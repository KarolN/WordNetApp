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

    function getWordData(textToAnalize) {
        var textToAnalizeNoMarks = removePunctuationMarks(textToAnalize);
        dataService.sendDataForProcessing({
            "lpmn": "any2txt|wcrft2({\"morfeusz2\":false})|wsd",
            "text": textToAnalizeNoMarks
        })
            .then(function (response) {
                return checkTaskProgress(response.data)
            }).then(function (data) {
            dataService.getProcessedData(data.value[0].fileID).then(function (response) {
                return wsdXmlParsingService.parseWsdXml(response.data).then(function (data) {
                    dataService.getSynsets(synsetService.parseSynsetsIds(data)).then(function (response) {
                        console.log(response.data);
                    });
                });
            });
        });
    }

    return {
        getWordData: getWordData
    }
}]);