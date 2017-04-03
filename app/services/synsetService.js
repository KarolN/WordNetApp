angular.module("wordApp").factory("synsetService", ["$q", function ($q) {


    function parseSynsetsIds(input) {
        var wordIds = [];
        _.each(input, function (word) {
            _.each(word.synsets, function (synset) {
                wordIds.push(synset.id);
            });
        });
        return {
            synsetIds : wordIds
        }
    };


    return {
        parseSynsetsIds: parseSynsetsIds
    }
}]);

