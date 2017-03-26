/**
 * Created by karol on 26.03.17.
 */

angular.module("wordApp").factory("wordService", ["$http", function ($http) {

    function getData(){
        return "Cos";
    }

    return {
        getWordData: getData
    }
}]);