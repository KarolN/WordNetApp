angular.module("wordApp").factory("dataService", ["$q", "$http", function ($q, $http) {

    var baseApi = "http://localhost:5000";

    function getSynsets(query) {
        return $http.post(baseApi + "/api/values/GetSynsets", query);
    };

    function getProcessedData(path) {
        return $http.get(baseApi + "/api/values/DownloadWsd?fileId=" + path);
    };

    function getProgressData(id) {
        return $http.get(baseApi + "/api/values/GetStatus/" + id);
    };

    function sendDataForProcessing(query) {
        return $http.post(baseApi + "/api/values/StartTast", query);
    };

    function getWordsIds(query) {
        return $http.post(baseApi + "/api/values/words", query);
    };


    return {
        getSynsets: getSynsets,
        getProcessedData: getProcessedData,
        getProgressData: getProgressData,
        sendDataForProcessing: sendDataForProcessing,
        getWordsIds: getWordsIds
    }

}]);
