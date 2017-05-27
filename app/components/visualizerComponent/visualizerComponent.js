function VisualizerComponentController ($scope, wordService, mockService, $timeout) {

    var self = this;
    $scope.loader = true;
    $scope.nodeGroup = "Select any node...";
    $scope.name = "Select synset...";

    var data = {};

    var highlightActive = false;
    var nodesDataset;

    this.groupBy = function(arr, key) {
          var newArr = [],
              Keys = {},
              newItem, i, j, cur;
          for (i = 0, j = arr.length; i < j; i++) {
            cur = arr[i];              
            if(cur[key] != 'synset'){
              if (!(cur[key] in Keys)) {
                  Keys[cur[key]] = { type: cur[key], data: [] };
                  newArr.push(Keys[cur[key]]);
              }
              Keys[cur[key]].data.push(cur);
            }
          }
          return newArr;
    }

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

            //Getting data for vis.js
            data = {edges: new vis.DataSet(loadedData.edges), nodes: new vis.DataSet(loadedData.nodes)};
            self.createGraph($scope.loader);
            
            //Getting data for chart.js
            var groupedNodes = self.groupBy(loadedData.nodes, 'group');         
            var chartLabels = groupedNodes.map(function(group) {
                return group.type;
            })
            var chartData = groupedNodes.map(function(group) {           
                return group.data.length;
            })

            //Charts props
            $scope.labels = chartLabels;
            $scope.series = "Suma";     
            $scope.data = chartData;
            $scope.options ={
                scales:
                {
                    xAxes: [{
                        display: false
                    }],
                    yAxes:[
                        {
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                }
            };
            /////////////
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
