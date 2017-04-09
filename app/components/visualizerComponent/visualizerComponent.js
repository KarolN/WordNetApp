function VisualizerComponentController ($scope, wordService, mockService, graphService, $timeout) {

    var self = this;
    $scope.loader = true;
    let mockData = mockService.getMockData();

    var data = {
        nodes: new vis.DataSet(mockData.nodes),
        edges: new vis.DataSet(mockData.edges)
    };

    var options = {
        edges: {
          //  smooth: false,
          //  length: 1000
        },
        nodes: {
          //  physics: false,
          scaling:{
            label: {
              min:10,
              max:20
            }
          }
        },
        interaction: {
            navigationButtons: true
        }
    };

    this.createGraph = function(loader){
      if(!loader) {
          $timeout(function() {
              var container = document.getElementById('wordNetwork');
              graphService.runGraph(container, data, options);
          }, 1);
      };
    }

    $scope.$watch(function(){
        return $scope.loader;
    }, self.createGraph);

    $scope.redirect = function () {
        self.onRedirect();
    }

    this.$onInit = function() {
        $timeout(function(){
            $scope.loader = false;
        }, 1000);
    }
}

angular.module("wordApp").component("visualizerComponent", {
    templateUrl: "/components/visualizerComponent/visualizerComponent.template.html",
    controller: ["$scope", "wordService", "mockService", "graphService", "$timeout", VisualizerComponentController],
    bindings: {
        textToVisualize: "<",
        onRedirect: "&"
    }
});
