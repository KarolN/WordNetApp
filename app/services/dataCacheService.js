/**
 * Created by karol on 20.05.17.
 */

angular.module("wordApp").factory("dataCacheService" , [function(){

    var cachedData = undefined;

    function putDataIntoCache(data) {
        cachedData = data;
    }

    function getDataFromCache(){
        return cachedData;
    }

    function unvalidateCache(){
        cachedData = undefined;
    }

    function isDataValid(){
        return cachedData !== undefined;
    }

    return {
        putDataIntoCache: putDataIntoCache,
        getDataFromCache: getDataFromCache,
        unvalidateCache: unvalidateCache,
        isDataValid: isDataValid
    };
}]);