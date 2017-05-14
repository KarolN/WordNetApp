/**
 * Created by Alicja on 2017-04-03.
 */

angular.module("wordApp").factory("graphService", ["$timeout", function($timeout) {
    var highlightActive = false;
    var nodesDataset;

    function neighbourhoodHighlight(params) {
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

    function runGraph(container, data, options){
        var network = new vis.Network(container, data, options);
        nodesDataset = data.nodes;

        network.on("click", neighbourhoodHighlight);
    }

    return {
        runGraph: runGraph
    }
}]);
