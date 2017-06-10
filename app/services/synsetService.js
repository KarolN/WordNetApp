angular.module("wordApp").factory("synsetService", ["$q", "dataService", function ($q, dataService) {


    function parseSynsetsIds(input) {
        var wordIds = [];
        _.each(input, function (word) {
            _.each(word.synsets, function (synset) {
                wordIds.push(synset.id);
            });
        });
        return {
            synsetIds: wordIds
        }
    };

    function parseSynsetsIdsAndNames(input) {
        var wordIds = [];
        _.each(input, function (word) {
            _.each(word.synsets, function (synset) {
                wordIds.push(synset);
            });
        });
        return wordIds
    };

    function fetchAndParseSynsets(input) {
        return $q(function (resolve, reject) {
            var synsetsList = [];
            var wordIds = parseSynsetsIds(input);
            dataService.getSynsets(wordIds).then(function (synsets) {
                var allSysnsets = parseSynsetsIdsAndNames(input);
                _.each(synsets.data, function (synset) {
                    if(synset.results){
                    var word = _.find(allSysnsets, function(x){
                        return x.id == synset.results.id;
                    });
                    word.name = synset.results.str;
                    }
                });
                resolve(input);
            });
        });
    };

    return {
        parseSynsetsIds: parseSynsetsIds,
        fetchAndParseSynsets: fetchAndParseSynsets
    }
}]);

