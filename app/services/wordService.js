/**
 * Created by karol on 26.03.17.
 */

angular.module("wordApp").factory("wordService", ["$http", "$q", "$timeout",
    "wsdXmlParsingService", "synsetService", "dataService", "dataCacheService",
    function ($http, $q, $timeout, wsdXmlParsingService, synsetService, dataService, dataCacheService) {

    function checkTaskProgress(id) {
        return $q(function (resolve, reject) {
            dataService.getProgressData(id)
                .then(function (response) {
                    if (response.data.status !== "DONE") {
                        $timeout(function () {
                            return checkTaskProgress(id).then(function (data) {
                                resolve(data);
                            });
                        }, 60);
                    } else {
                        resolve(response.data);
                    }
                })
        });
    }

    function removePunctuationMarks(textToAnalize) {
        var replacedText = textToAnalize.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]|\\|[0-9]/g, "");
        console.log("removePunctuationMarks: " + replacedText);
        return replacedText;
    }

    function mapWordFromApiToGraphNode(word, includeConnectors){
      let count = word.domain === 'bez hiperonimu' ? 1 :  word.count;
        return {
            id: word.id,
            shape: "ellipse",
            label: word.name,
            group: word.domain,
            value: count,
            hidden: !includeConnectors && word.domain === 'bez hiperonimu'
        };
    }

    function insertSynsetFromApiToGraphNodes(synset, nodes){
        var existingInCollection = _.find(nodes, function(node){
            return node.id === synset.id;
        });

        if(existingInCollection){
          if(existingInCollection.group !== 'bez hiperonimu'){
            existingInCollection.count++;
          }
        } else {
            nodes.push({
                id: synset.id,
                shape: "ellipse",
                label: synset.id,
                group: "synset",
                value: 1,
                name: synset.name
            });
        }
    }

    function createRelationBetweenWordAndSynset(word, synset){
        return {
            from: word.id,
            to: synset.id,
            width: synset.probability * 5
        };
    }

    function createRelationBetweenWordAndNextWordInSentence(word, next){
        return {
            from: word.id,
            to: next.id,
            width: 2,
            color: "#FF0000"
        };
    }

    function mapRetrievedDataToViusualizeStructure(data, options){
        var mappedData = {
            nodes: [],
            edges: []
        };

        _.each(data, function(word){
            mappedData.nodes.push(mapWordFromApiToGraphNode(word, options.includeConnectors));
            _.each(word.nextWords, function(nextWord){
                  mappedData.edges.push(createRelationBetweenWordAndNextWordInSentence(word, nextWord));
            });
            if(options.includeSynsets) {
                _.each(word.synsets, function (synset) {
                    insertSynsetFromApiToGraphNodes(synset, mappedData.nodes);
                    mappedData.edges.push(createRelationBetweenWordAndSynset(word, synset));
                });
            }
        });

        return mappedData;
    }

    var getWordDataInternal = {
        useCache: function(text, resolve){
            if(dataCacheService.isDataValid()) {
                var dataFromCache = dataCacheService.getDataFromCache();
                resolve(dataFromCache);
                return;
            }
            this.useApi(text, resolve);
        },

        useApi: function(textToAnalize, resolve){
            dataService.sendDataForProcessing({
                "lpmn": "any2txt|wcrft2({\"morfeusz2\":false})|wsd",
                "text": textToAnalize
            })
                .then(function (response) {
                    return checkTaskProgress(response.data);
                }).then(function (data) {
                dataService.getProcessedData(data.value[0].fileID).then(function (response) {
                    return wsdXmlParsingService.parseWsdXml(response.data).then(function (data) {
                        console.log(data);
                        synsetService.fetchAndParseSynsets(data).then(function (dataWithNames) {
                            dataCacheService.putDataIntoCache(dataWithNames);
                            resolve(dataWithNames);
                        });
                    });
                });
            });
        }
    }

    function getWordData(textToAnalize, options) {
        return $q(function(resolve, reject) {
            var textToAnalizeNoMarks = textToAnalize;//removePunctuationMarks(textToAnalize);
            var fetchMethod = options.bypassCache ? "useApi": "useCache" ;
            $q(function(res, rej){
                getWordDataInternal[fetchMethod](textToAnalize, res);
            }).then(function(data){
                var mappedData =  mapRetrievedDataToViusualizeStructure(data, options);
                resolve(mappedData);
            });
        });
    }

    return {
        getWordData: getWordData
    };
}]);
