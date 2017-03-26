/**
 * Created by karol on 26.03.17.
 */
function MainPageComponentController ($scope) {
    $scope.data = "";
}

angular.module("wordApp").component("mainPageComponent", {
    templateUrl: "/components/mainPageComponent/mainPageComponent.template.html",
    controller: ["$scope", MainPageComponentController]
});