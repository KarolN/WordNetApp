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
                            return checkTaskProgress(id).then(function (data) { resolve(data); });
                        }, 60);
                    } else {
                        resolve(response.data);
                    }
                })
        });
    };

    function getWordData(textToAnalize) {
        dataService.sendDataForProcessing({ "lpmn": "any2txt|wcrft2({\"morfeusz2\":false})|wsd", "text": textToAnalize })
            .then(function (response) {
                return checkTaskProgress(response.data)
            }).then(function (data) {
                dataService.getProcessedData(data.value[0].fileID).then(function (response) {
                    return wsdXmlParsingService.parseWsdXml(response.data).then(function (data) {
                        synsetService.fetchAndParseSynsets(data).then(function (dataWithNames){
                            console.log(dataWithNames);
                        });
                    });
                });
            });
    };

    return {
        getWordData: getWordData
    }
}]);