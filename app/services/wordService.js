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

    function getWordData() {
        dataService.sendDataForProcessing({ "lpmn": "any2txt|wcrft2({\"morfeusz2\":false})|wsd", "text": " Za każdym razem, kiedy polska drużyna przyjeżdża na Bałkany, w prasowych tytułach pojawia się piekło. Że kibice straszni i jedzą surowe mięso, że na ulicach polowanie, miejscowi połamią na boisku naszym piłkarzom nogi, a nie daj Boże wygrać wysoko, bo się do kraju już nie wróci. Przez wiele lat można było do tego dodać jeszcze suche i proste: rywale są zwyczajnie lepsi, ale lepiej było dorabiać ideologię i tłumaczyć kolejne wpadki trudnymi warunkami." })
            .then(function (response) {
                return checkTaskProgress(response.data)
            }).then(function (data) {
                dataService.getProcessedData(data.value[0].fileID).then(function (response) {
                    return wsdXmlParsingService.parseWsdXml(response.data).then(function (data) {
                        dataService.getSynsets(synsetService.parseSynsetsIds(data)).then(function(response){
                            console.log(response.data);
                        });
                    });
                });
            });
    };

    return {
        getWordData: getWordData
    }
}]);