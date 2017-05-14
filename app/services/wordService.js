/**
 * Created by karol on 26.03.17.
 */

angular.module("wordApp").factory("wordService", ["$http", "$q", "$timeout", "wsdXmlParsingService", "synsetService", "dataService", function ($http, $q, $timeout, wsdXmlParsingService, synsetService, dataService) {

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

    function mapWordFromApiToGraphNode(word){
        return {
            id: word.id,
            shape: "ellipse",
            label: word.name,
            group: word.domain,
            value: word.count
        };
    }

    function insertSynsetFromApiToGraphNodes(synset, nodes){
        var existingInCollection = _.find(nodes, function(node){
            return node.id === synset.id;
        });

        if(existingInCollection){
            existingInCollection.count++;
        } else {
            nodes.push({
                id: synset.id,
                shape: "ellipse",
                label: synset.id,
                group: "synset",
                value: 1,
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

    function mapRetrievedDataToViusualizeStructure(data){
        var mappedData = {
            nodes: [],
            edges: []
        };

        _.each(data, function(word){
            mappedData.nodes.push(mapWordFromApiToGraphNode(word));
            _.each(word.nextWords, function(nextWord){
                mappedData.edges.push(createRelationBetweenWordAndNextWordInSentence(word, nextWord));
            });
            _.each(word.synsets, function(synset) {
                insertSynsetFromApiToGraphNodes(synset, mappedData.nodes);
                mappedData.edges.push(createRelationBetweenWordAndSynset(word, synset));
            });

        });

        return mappedData;
    }

    function getWordData(textToAnalize) {
        return $q(function(resolve, reject) {
            var textToAnalizeNoMarks = textToAnalize;//removePunctuationMarks(textToAnalize);
            dataService.sendDataForProcessing({
                "lpmn": "any2txt|wcrft2({\"morfeusz2\":false})|wsd",
                "text": textToAnalizeNoMarks
            })
                .then(function (response) {
                    return checkTaskProgress(response.data)
                }).then(function (data) {
                dataService.getProcessedData(data.value[0].fileID).then(function (response) {
                    return wsdXmlParsingService.parseWsdXml(response.data).then(function (data) {
                        console.log(data);
                        synsetService.fetchAndParseSynsets(data).then(function (dataWithNames) {
                            var dataToVisualize = mapRetrievedDataToViusualizeStructure(dataWithNames);
                            resolve(dataToVisualize);
                        });
                    });
                });
            });
        });
    }

    return {
        getWordData: getWordData
    };
}]);
