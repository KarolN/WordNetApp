angular.module("wordApp").factory("wsdXmlParsingService", ["$q", function ($q) {

    function parseXml(xml) {
        var x2js = new X2JS();
        var jsonFromXml = x2js.xml_str2json(xml);
        return jsonFromXml;
    }

    function parseSynsRank(text) {
        var synsets = [];

        var idAndProbs = text.indexOf(" ") !== -1 ? text.split(" ") : [text];

        _.each(idAndProbs, function (item) {
            var idAndProb = item.split("/");
            var synset = {id: idAndProb[0], probability: idAndProb[1]};
            synsets.push(synset);
        });
        return synsets;
    }

    function createNewWord(tok) {
        var word = {
            name: tok.lex.base,
            count: 1
        };
        _.each(tok.prop, function (prop) {
            if (prop._key === "sense:ukb:syns_rank") {
                word.synsets = parseSynsRank(prop.__text);
            }
        });
        return word;
    }

    function incrementWordCount(foundWord) {
        foundWord.count += 1;
    }

    function getWordsWithData(parsedObject) {
        var result = [];
        console.log(parsedObject);
        console.log(parsedObject.chunkList.length);
        var chunks = parsedObject.chunkList.chunk.length > 1 ? parsedObject.chunkList.chunk : parsedObject.chunkList;
        _.each(chunks, function (chunk) {
            _.each(chunk.sentence.tok, function (tok) {
                var foundWord = _.find(result, function (resultWord) {
                    return resultWord.name === tok.lex.base;
                });
                if (foundWord) {
                    incrementWordCount(foundWord);
                } else {
                    var word = createNewWord(tok);
                    result.push(word);
                }
            });
        });
        console.log("getWordsWithData result: ");
        console.log(result);
        return result;
    }

    function parseWsdXml(input) {
        return $q(function (resolve, reject) {
            var parsedJson = parseXml(input);
            var result = getWordsWithData(parsedJson);
            resolve(result);
        });
    }

    return {
        parseWsdXml: parseWsdXml
    };
}]);