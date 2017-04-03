/**
 * Created by karol on 26.03.17.
 */
function MainPageComponentController ($scope) {
    var self = this;
    $scope.textToSubmit = "";

    $scope.submit = function() {
       self.onTextSubmit({textToAnalize: $scope.textToSubmit});
    }
}

angular.module("wordApp").component("mainPageComponent", {
    templateUrl: "/components/mainPageComponent/mainPageComponent.template.html",
    controller: ["$scope", MainPageComponentController],
    bindings: {
        onTextSubmit: "&"
    }
});