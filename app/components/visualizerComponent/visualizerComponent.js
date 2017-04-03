/**
 * Created by karol on 26.03.17.
 */
function VisualizerComponentController ($scope, wordService, graphService, $timeout) {
    var self = this;
    $scope.loader = true;
    $scope.nodes = [
        {
            id: 1,
            group: "domena1",
            label: "slowo",
            value: 10
        },
        {
            id: 2,
            group: "domena2",
            label: 'slowo',
            value: 80
        },
        {
            id: 3,
            group: "domena1",
            shape: "circle",
            label: "synset",
            value: 50
        },
        {
            id: 4,
            group: "domena1",
            shape: "circle",
            label: "synset",
            value: 5
        },
        {
            id: 5,
            group: "domena1",
            shape: "circle",
            label: "synset",
            value: 20
        },
        {
            id: 6,
            group: "domena2",
            shape: "circle",
            label: "synset",
            value: 100
        },
        {
            id: 7,
            group: "domena2",
            shape: "circle",
            label: "synset",
            value: 10
        },
    ];
    $scope.edges = [
        {
            from: 1,
            to: 3,
            width: 4,
        },
        {
            from: 1,
            to: 4,
            width: 6,
        },
        {
            from: 1,
            to: 5,
            width: 2,
        },
        {
            from: 2,
            to: 6,
            width: 1,
        },
        {
            from: 2,
            to: 7,
            width: 5,
        },
        {
            from: 2,
            to: 5,
            width: 1,
        }
    ];

    var data = {
        nodes: new vis.DataSet($scope.nodes),
        edges: new vis.DataSet($scope.edges)
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
              max:25
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
    controller: ["$scope", "wordService", "graphService", "$timeout", VisualizerComponentController],
    bindings: {
        textToVisualize: "<",
        onRedirect: "&"
    }
});
