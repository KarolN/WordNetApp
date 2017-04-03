/**
 * Created by karol on 26.03.17.
 */
function StartComponentController($scope, wordService) {
    $scope.visualizeData = false;
    $scope.textToAnalize = "";

    $scope.onTextSubmit = function(text){
        $scope.textToAnalize = text;
        $scope.visualizeData = true;
        wordService.getWordData(text);
    }

    $scope.onRedirect = function(){
        $scope.visualizeData = false;
    }
}

angular.module("wordApp").component("startComponent", {
    templateUrl: "/components/startComponent/startComponent.template.html",
    controller: ["$scope", "wordService", StartComponentController]
});