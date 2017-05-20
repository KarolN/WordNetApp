function VisualizerComponentController ($scope, wordService, mockService, graphService, $timeout) {

    var self = this;
    $scope.loader = true;

    var data = {};

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

    $scope.redirect = function () {
        self.onRedirect();
    }

    this.$onInit = function() {
        var loadingOptions = {
            bypassCache : true,
            includeSynsets: true
        };

        wordService.getWordData(this.textToVisualize, loadingOptions).then(function(loadedData){
            $scope.loader = false;
            data = {edges: new vis.DataSet(loadedData.edges), nodes: new vis.DataSet(loadedData.nodes)};
            self.createGraph($scope.loader);
        });
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
