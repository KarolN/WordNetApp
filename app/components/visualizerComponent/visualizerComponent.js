/**
 * Created by karol on 26.03.17.
 */
function VisualizerComponentController ($scope, wordService, $timeout) {
    var self = this;

    $scope.redirect = function () {
        self.onRedirect();
    }

    $scope.loader = true;

    $scope.nodes = [
        {
            id: 1,
            label: "słowo",
            group: "domena1",
            title: "booo"
        },
        {
            id: 2,
            label: "słowo",
            group: "domena2",
        },
        {
            id: 3,
            label: "synset",
            group: "domena1"
        },
        {
            id: 4,
            label: "synset",
            group: "domena1"
        },
        {
            id: 5,
            label: "synset",
            group: "domena1"
        },
        {
            id: 6,
            label: "synset",
            group: "domena2"
        },
        {
            id: 7,
            label: "synset",
            group: "domena2"
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


    var nodesDataset = new vis.DataSet($scope.nodes);
    var edges = new vis.DataSet($scope.edges);

    var data = {
        nodes: nodesDataset,
        edges: edges
    };

    var options = {
        edges: {
           // smooth: false
        },
        nodes: {
          //  physics: false,
            //mass: 10
        },
        interaction: {
            navigationButtons: true
        }
    };

    var highlightActive = false;
    var allNodes;
    var network;
    function runGraph(){
        $timeout(function()
        {
            var container = document.getElementById('wordNetwork');
            network = new vis.Network(container, data, options);
            network.on("click",neighbourhoodHighlight);
            allNodes = nodesDataset.get({returnType:"Object"});
        }, 1);
    }

    this.$onInit = function() {
        // initialize your network
        $timeout(function(){ $scope.loader = false; runGraph();}, 1000);
    }

    function neighbourhoodHighlight(params) {
        // if something is selected:
        if (params.nodes.length > 0) {
            highlightActive = true;
            var i,j;
            var selectedNode = params.nodes[0];
            var degrees = 2;

            // mark all nodes as hard to read.
            for (var nodeId in allNodes) {
                allNodes[nodeId].color = 'rgba(200,200,200,0.5)';
                if (allNodes[nodeId].hiddenLabel === undefined) {
                    allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
                    allNodes[nodeId].label = undefined;
                }
            }
            var connectedNodes = network.getConnectedNodes(selectedNode);
            var allConnectedNodes = [];

            // get the second degree nodes
            for (i = 1; i < degrees; i++) {
                for (j = 0; j < connectedNodes.length; j++) {
                    allConnectedNodes = allConnectedNodes.concat(network.getConnectedNodes(connectedNodes[j]));
                }
            }

            // all second degree nodes get a different color and their label back
            for (i = 0; i < allConnectedNodes.length; i++) {
                allNodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.75)';
                if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
                    allNodes[allConnectedNodes[i]].label = allNodes[allConnectedNodes[i]].hiddenLabel;
                    allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
                }
            }

            // all first degree nodes get their own color and their label back
            for (i = 0; i < connectedNodes.length; i++) {
                allNodes[connectedNodes[i]].color = undefined;
                if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
                    allNodes[connectedNodes[i]].label = allNodes[connectedNodes[i]].hiddenLabel;
                    allNodes[connectedNodes[i]].hiddenLabel = undefined;
                }
            }

            // the main node gets its own color and its label back.
            allNodes[selectedNode].color = undefined;
            if (allNodes[selectedNode].hiddenLabel !== undefined) {
                allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
                allNodes[selectedNode].hiddenLabel = undefined;
            }
        }
        else if (highlightActive === true) {
            // reset all nodes
            for (var nodeId in allNodes) {
                allNodes[nodeId].color = undefined;
                if (allNodes[nodeId].hiddenLabel !== undefined) {
                    allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
                    allNodes[nodeId].hiddenLabel = undefined;
                }
            }
            highlightActive = false
        }

        // transform the object into an array
        var updateArray = [];
        for (nodeId in allNodes) {
            if (allNodes.hasOwnProperty(nodeId)) {
                updateArray.push(allNodes[nodeId]);
            }
        }
        nodesDataset.update(updateArray);
    }
}

angular.module("wordApp").component("visualizerComponent", {
    templateUrl: "/components/visualizerComponent/visualizerComponent.template.html",
    controller: ["$scope", "wordService", "$timeout", VisualizerComponentController],
    bindings: {
        textToVisualize: "<",
        onRedirect: "&"
    }
});