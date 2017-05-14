/**
 * Created by Joanna on 2017-05-14.
 */

angular.module("wordApp").factory("domainsTableService", [function () {
    var domainsTable = {
          bhp: 'bez hiperonimu',
          cech: 'cecha',
          cel: 'cel',
          czas: 'czas',
          czc: 'część ciała',
          czuj: 'emocje',
          czy: 'czynność',
          grp: 'grupa',
          il: 'ilość',
          jedz: 'jedzenie',
          ksz: 'kształt',
          msc: 'miejsce',
          os: 'osoba',
          por: 'porozumiewanie się',
          pos: 'posiadanie',
          prc: 'proces',
          rsl: 'roślina',
          rz: 'obiekt naturalny',
          sbst: 'substancja',
          st: 'stan',
          sys: 'systematyka',
          umy: 'myślenie',
          wytw: 'wytwór',
          zdarz: 'zdarzenie',
          zj: 'zjawisko naturalne',
          zw: 'zwierzę',
          zwz: 'relacja',
          cczuj: 'odczuwanie',
          cjedz: 'jedzenie',
          cpor: 'porozumiewanie się',
          cpos: 'posiadanie',
          cst: 'stan',
          cumy: 'myślenie',
          cwytw: 'wytwarzanie',
          dtk: 'kontakt fizyczny',
          hig: 'higiena',
          pog: 'pogoda',
          pst: 'postrzeganie',
          ruch: 'ruch',
          sp: 'życie społeczne',
          wal: 'rywalizacja',
          zmn: 'zmiana',

          grad: 'przymiotnik odprzymiotnikowy',
          jak: 'przymiotnik jakościowy',
          odcz: 'przymiotnik odczasownikowy',
          rel: 'przymiotnik relacyjny'
        }

    return {
        domainsTable: domainsTable
    }
}]);
