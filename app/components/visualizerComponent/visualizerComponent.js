/**
 * Created by karol on 26.03.17.
 */
function VisualizerComponentController ($scope, wordService) {

    var ctrl = this;
    $scope.data = "c";

}

angular.module("wordApp").component("visualizerComponent", {
    templateUrl: "/components/visualizerComponent/visualizerComponent.template.html",
    controller: ["$scope", "wordService", VisualizerComponentController]
});