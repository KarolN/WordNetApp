/**
 * Created by karol on 26.03.17.
 */
function VisualizerComponentController ($scope, wordService, graphService, $timeout) {
    var self = this;
    $scope.loader = true;

    $scope.redirect = function () {
        self.onRedirect();
    }

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

    $scope.$watch(function(){
        return $scope.loader;
    }, function (newVal) {
        if(!newVal) {
            $timeout(function() {
                var container = document.getElementById('wordNetwork');
                graphService.runGraph(container, data, options);
            })
        }
    })

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