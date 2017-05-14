angular.module("wordApp").factory("wsdXmlParsingService", ["$q", "domainsTableService", function ($q, domainsTableService) {

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

    function getWordDomain(domainText) {
      var indexOfColon = domainText.indexOf(":");
      var indexOfEndBracket = domainText.indexOf(")");
      var key = domainText.substring(indexOfColon+1,indexOfEndBracket);
      return domainsTableService.domainsTable[key];
    }

    function createNewWord(tok) {
      var domainText = tok.prop && tok.prop[2] ? tok.prop[2].toString() : ":bhp)";
        if(tok.lex.length > 1){
        var word = {
            name: tok.lex[0].base,
            id: tok.lex[0].base.hashCode(),
            count: 1,
            nextWords: [],
            domain: getWordDomain(domainText)
        };
        }else{
        var word = {
            name: tok.lex.base,
            id: tok.lex.base.hashCode(),
            count: 1,
            nextWords: [],
            domain: getWordDomain(domainText)
        };
    }
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

    function addSenteceRelations(previousWord, currentWord){
        previousWord.nextWords.push(currentWord);
    }

    function isInterpunctinalSign(sign){
        return sign === "." || sign === "," || sign === "?" || sign === "!";
    }

    function getWordsWithData(parsedObject) {
        var result = [];
        var chunks = parsedObject.chunkList.chunk.length > 1 ? parsedObject.chunkList.chunk : parsedObject.chunkList;

        if(!parsedObject.chunkList.chunk.length || parsedObject.chunkList.chunk.length > 1){
                 _.each(chunks, function (chunk) {
        chunk.sentence.tok = [].concat(chunk.sentence.tok);
                 });
        }

        _.each(chunks, function (chunk) {
            var previousWord;
            _.each(chunk.sentence.tok, function (tok) {
                var currentWord;
                if(isInterpunctinalSign(tok.lex.base)){
                    if(tok.lex.base !== ","){
                        previousWord = undefined;
                    }
                    return;
                }
                var foundWord = _.find(result, function (resultWord) {
                    return resultWord.name === tok.lex.base;
                });
                if (foundWord) {
                    currentWord = foundWord;
                    incrementWordCount(foundWord);
                } else {
                    var word = createNewWord(tok);
                    result.push(word);
                    currentWord = word;
                }
                if(previousWord){
                    addSenteceRelations(previousWord, currentWord);
                }
                previousWord = currentWord;
                if(currentWord === "." || currentWord === "?" || currentWord === "!"){
                    previousWord = undefined;
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
