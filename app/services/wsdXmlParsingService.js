

angular.module("wordApp").factory("wsdXmlParsingService", ["$q", function($q){

    function parseWsdXml(input){
        $q(function(resolve, reject){
         var x2js = new X2JS();
         var jsonFromXml = x2js.xml_str2json(input);
         console.log(jsonFromXml);
         resolve(jsonFromXml);
        });
    }

    return {
        parseWsdXml: parseWsdXml
    };
}]);