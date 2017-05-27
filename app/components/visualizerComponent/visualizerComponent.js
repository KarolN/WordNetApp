function VisualizerComponentController ($scope, wordService, mockService, $timeout) {

    var self = this;
    $scope.loader = true;
    $scope.nodeGroup = "Select any node...";
    $scope.name = "Select synset...";
    $scope.labels =["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

    $scope.data = [
      [65, 59, 90, 81, 56, 55, 40],
      [28, 48, 40, 19, 96, 27, 100]
    ];

    var data = {};

    var highlightActive = false;
    var nodesDataset;

    var options = {
        height: '100%',
        width: '100%',
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
        }
    };

    this.neighbourhoodHighlight = function(params) {
        var allNodes = nodesDataset.get({returnType: "Object"});
        if (params.nodes.length > 0) {
            highlightActive = true;
            var selectedNode = params.nodes[0];
            var selectedGroup = allNodes[selectedNode].group;

            for (var nodeId in allNodes) {
              if(allNodes[nodeId].group !== selectedGroup){
                allNodes[nodeId].color = 'rgba(200,200,200,0.5)';
              }
              else {
                allNodes[nodeId].color = undefined;
              }
            }
        }
        else if (highlightActive === true) {
            for (var nodeId in allNodes) {
                allNodes[nodeId].color = undefined;
            }
            highlightActive = false
        }

        var updateArray = [];
        for (nodeId in allNodes) {
            if (allNodes.hasOwnProperty(nodeId)) {
                updateArray.push(allNodes[nodeId]);
            }
        }
        nodesDataset.update(updateArray);
    }

    this.showDetails = function(params) {
        var allNodes = nodesDataset.get({returnType: "Object"});
        if (params.nodes.length > 0) {
            var selectedNode = params.nodes[0];
            $scope.$apply(function () {
                $scope.nodeGroup = allNodes[selectedNode].group;
                $scope.name = allNodes[selectedNode].name == undefined ? "Select synset..." : allNodes[selectedNode].name;
            });
        } else {
            $scope.$apply(function () {
                $scope.nodeGroup = "Select any node...";
                $scope.name = "Select synset...";
            });
        }
    }

    this.createGraph = function(loader){
      if(!loader) {
          $timeout(function() {
              var container = document.getElementById('wordNetwork');
              var network = new vis.Network(container, data, options);
              nodesDataset = data.nodes;

              network.on("click", self.neighbourhoodHighlight);
              network.on("click", self.showDetails);
          }, 1);
      };
    }

    $scope.redirect = function () {
        self.onRedirect();
    }

    this.$onInit = function() {
        var loadingOptions = {
            bypassCache : true,
            includeSynsets: true,
            includeConnectors: false
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
    controller: ["$scope", "wordService", "mockService", "$timeout", VisualizerComponentController],
    bindings: {
        textToVisualize: "<",
        onRedirect: "&"
    }
});
