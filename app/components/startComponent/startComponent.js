/**
 * Created by karol on 26.03.17.
 */
function StartComponentController($scope, wordService) {
    $scope.data = wordService.getWordData();
}

angular.module("wordApp").component("startComponent", {
    templateUrl: "/components/startComponent/startComponent.template.html",
    controller: ["$scope", "wordService", StartComponentController]
});