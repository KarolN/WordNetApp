

angular.module("wordApp").factory("wsdXmlParsingService", ["$q", function($q){

    function parseXml(xml){
        var x2js = new X2JS();
         var jsonFromXml = x2js.xml_str2json(xml);
         return jsonFromXml;
    }

    function parseSynsRank(text){
        var synsets = [];

        var idAndProbs = text.indexOf(" ") !== -1 ? text.split(" ") : [text];
        
        _.each(idAndProbs, function(item){
            var idAndProb = item.split("/");
            var synset = {id: idAndProb[0], probability :idAndProb[1]};
            synsets.push(synset);          
        });
        return synsets;
    }

    function getWordsWithData(parsedObject){
        var result = [];
        _.each(parsedObject.chunkList.chunk, function(chunk){
            _.each(chunk.sentence.tok, function(tok){
                var word = {
                    id: tok.lex.base.hashCode(),
                    name: tok.lex.base,
                    synsets: []
                };
                result.push(word);
                _.each(tok.prop, function(prop){
                    if(prop._key === "sense:ukb:syns_rank"){
                       word.synsets = parseSynsRank(prop.__text);
                    }
                });
            });
        });
        return result;
    }

    function parseWsdXml(input){
        return $q(function(resolve, reject){
            var parsedJson = parseXml(input);
            var result = getWordsWithData(parsedJson);
            resolve(result);
        });
    }

    return {
        parseWsdXml: parseWsdXml
    };
}]);