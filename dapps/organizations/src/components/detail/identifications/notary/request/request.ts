/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import * as dispatchers from '../../../../../dispatchers/registry';

import { triggerRequestReload } from '../notary.identifications';

interface RequestFormIdentInterface extends EvanForm {
  address: EvanFormControl;
  city: EvanFormControl;
  organization: EvanFormControl;
  contact: EvanFormControl;
  country: EvanFormControl;
  regNumber: EvanFormControl;
  zipCode: EvanFormControl;
}

@Component({ })
export default class IdentNotaryRequestComponent extends mixins(EvanComponent) {
  /**
   * Formular for verification requests
   */
  requestForm: RequestFormIdentInterface = null;

  /**
   * Show loading until the request was finished.
   */
  sending = false;

  /**
   * show formular or accept view
   */
  status = 0;

  steps = [
    {
      title: "Überblick",
      disabled: false
    },
    {
      title: "Ihre Daten",
      disabled: false
    },
    {
      title: "Zusammenfassung",
      disabled: true
    },
  ];

  /**
   * listen for dispatcher updates
   */
  listeners: Array<Function> = [ ];


  /**
   * listed courts in germany
   */
  courts: Array<string> = [
    'Amtsgericht Neuss',
    'Amtsgericht Remscheid',
    'Amtsgericht Brilon',
    'Amtsgericht Meschede',
    'Amtsgericht Werl',
    'Amtsgericht Herford',
    'Amtsgericht Herne',
    'Amtsgericht Castrop-Rauxel',
    'Amtsgericht Hamm',
    'Amtsgericht Lüdenscheid',
    'Amtsgericht Schwerte',
    'Amtsgericht Ibbenbüren',
    'Amtsgericht Lippstadt',
    'Amtsgericht Schleiden',
    'Amtsgericht Leverkusen',
    'Amtsgericht Wipperfürth',
    'Amtsgericht Emmendingen',
    'Amtsgericht Freiburg im Breisgau',
    'Amtsgericht Müllheim',
    'Amtsgericht Heidelberg',
    'Amtsgericht Konstanz',
    'Amtsgericht Singen am Hohentwiel',
    'Amtsgericht Schwetzingen',
    'Amtsgericht Buchen',
    'Amtsgericht Tauberbischofsheim',
    'Amtsgericht Albstadt',
    'Amtsgericht Balingen',
    'Amtsgericht Vaihingen an der Enz',
    'Amtsgericht Bad Waldsee',
    'Amtsgericht Böblingen',
    'Amtsgericht Kirchheim unter Teck',
    'Amtsgericht Leonberg',
    'Amtsgericht Stuttgart-Bad Cannstatt',
    'Amtsgericht Calw',
    'Amtsgericht Rottenburg',
    'Amtsgericht Bamberg',
    'Amtsgericht Kulmbach',
    'Amtsgericht Hof',
    'Amtsgericht Bad Neustadt a.d. Saale',
    'Amtsgericht Augsburg',
    'Amtsgericht Neuburg a. d. Donau',
    'Amtsgericht Kempten',
    'Amtsgericht Eggenfelden',
    'Amtsgericht Erding',
    'Amtsgericht Freising',
    'Amtsgericht Günzburg',
    'Amtsgericht Dachau',
    'Amtsgericht Laufen',
    'Amtsgericht Schwandorf',
    'Amtsgericht Ansbach',
    'Amtsgericht Neumarkt in der Oberpfalz',
    'Amtsgericht Schwabach',
    'Amtsgericht Tempelhof-Kreuzberg',
    'Amtsgericht Strausberg',
    'Amtsgericht Oranienburg',
    'Amtsgericht Brandenburg an der Havel',
    'Amtsgericht Potsdam',
    'Amtsgericht Hamburg-St.Georg',
    'Amtsgericht Groß-Gerau',
    'Amtsgericht Hünfeld',
    'Amtsgericht Gießen',
    'Amtsgericht Hanau',
    'Amtsgericht Dillenburg',
    'Amtsgericht Biedenkopf',
    'Amtsgericht Rüdesheim am Rhein',
    'Amtsgericht Neubrandenburg',
    'Amtsgericht Pasewalk',
    'Amtsgericht Clausthal-Zellerfeld',
    'Amtsgericht Seesen',
    'Amtsgericht Burgwedel',
    'Amtsgericht Hannover',
    'Amtsgericht Springe',
    'Amtsgericht Lehrte',
    'Amtsgericht Achim',
    'Amtsgericht Sulingen',
    'Amtsgericht Leer (Ostfriesland)',
    'Amtsgericht Norden',
    'Amtsgericht Nordenham',
    'Amtsgericht Andernach',
    'Amtsgericht Bad Neuenahr-Ahrweiler',
    'Amtsgericht Cochem',
    'Amtsgericht Bitburg',
    'Amtsgericht Prüm',
    'Amtsgericht Grünstadt',
    'Amtsgericht Ludwigshafen am Rhein',
    'Amtsgericht Speyer',
    'Amtsgericht Lebach',
    'Amtsgericht Ottweiler',
    'Amtsgericht Saarlouis',
    'Amtsgericht Völklingen',
    'Amtsgericht Merzig',
    'Amtsgericht Aue',
    'Amtsgericht Oschatz',
    'Amtsgericht Auerbach',
    'Amtsgericht Zwickau',
    'Amtsgericht Hohenstein-Ernstthal',
    'Amtsgericht Dessau-Roßlau',
    'Amtsgericht Köthen',
    'Amtsgericht Zerbst',
    'Amtsgericht Oschersleben',
    'Amtsgericht Düsseldorf',
    'Amtsgericht Duisburg-Hamborn',
    'Amtsgericht Mülheim an der Ruhr',
    'Amtsgericht Oberhausen',
    'Amtsgericht Kleve',
    'Amtsgericht Kempen',
    'Amtsgericht Krefeld',
    'Amtsgericht Mönchengladbach-Rheydt',
    'Amtsgericht Viersen',
    'Amtsgericht Mettmann',
    'Amtsgericht Gütersloh',
    'Amtsgericht Halle',
    'Amtsgericht Bochum',
    'Amtsgericht Herne-Wanne',
    'Amtsgericht Detmold',
    'Amtsgericht Unna',
    'Amtsgericht Gelsenkirchen',
    'Amtsgericht Hattingen',
    'Amtsgericht Altena',
    'Amtsgericht Borken',
    'Amtsgericht Tecklenburg',
    'Amtsgericht Delbrück',
    'Amtsgericht Paderborn',
    'Amtsgericht Jülich',
    'Amtsgericht Monschau',
    'Amtsgericht Siegburg',
    'Amtsgericht Bergheim',
    'Amtsgericht Kerpen',
    'Amtsgericht Baden-Baden',
    'Amtsgericht Staufen im Breisgau',
    'Amtsgericht Titisee-Neustadt',
    'Amtsgericht Bretten',
    'Amtsgericht Bruchsal',
    'Amtsgericht Karlsruhe',
    'Amtsgericht Karlsruhe-Durlach',
    'Amtsgericht Philippsburg',
    'Amtsgericht Maulbronn',
    'Amtsgericht Gengenbach',
    'Amtsgericht Oberkirch',
    'Amtsgericht Offenburg',
    'Amtsgericht Sankt Blasien',
    'Amtsgericht Schopfheim',
    'Amtsgericht Aalen',
    'Amtsgericht Bad Mergentheim',
    'Amtsgericht Neresheim',
    'Amtsgericht Besigheim',
    'Amtsgericht Heilbronn',
    'Amtsgericht Künzelsau',
    'Amtsgericht Öhringen',
    'Amtsgericht Riedlingen',
    'Amtsgericht Tettnang',
    'Amtsgericht Wangen im Allgäu',
    'Amtsgericht Oberndorf am Neckar',
    'Amtsgericht Rottweil',
    'Amtsgericht Esslingen am Neckar',
    'Amtsgericht Schorndorf',
    'Amtsgericht Waiblingen',
    'Amtsgericht Reutlingen',
    'Amtsgericht Göppingen',
    'Amtsgericht Ulm',
    'Amtsgericht Haßfurt',
    'Amtsgericht Bayreuth',
    'Amtsgericht Dillingen an der Donau',
    'Amtsgericht Ingolstadt',
    'Amtsgericht Memmingen',
    'Amtsgericht München',
    'Amtsgericht Fürstenfeldbruck',
    'Amtsgericht Garmisch-Partenkirchen',
    'Amtsgericht Rosenheim',
    'Amtsgericht Fürth',
    'Amtsgericht Cham',
    'Amtsgericht Regensburg',
    'Amtsgericht Köpenick',
    'Amtsgericht Mitte',
    'Amtsgericht Pankow/Weißensee',
    'Amtsgericht Tempelhof-Kreuzberg',
    'Amtsgericht Cottbus',
    'Amtsgericht Lübben (Spreewald)',
    'Amtsgericht Senftenberg',
    'Amtsgericht Luckenwalde',
    'Amtsgericht Zossen',
    'Amtsgericht Bremen',
    'Amtsgericht Bremen-Blumenthal',
    'Amtsgericht Bensheim',
    'Amtsgericht Fürth',
    'Amtsgericht Rüsselsheim',
    'Amtsgericht Königstein im Taunus',
    'Amtsgericht Fulda',
    'Amtsgericht Friedberg',
    'Amtsgericht Gelnhausen',
    'Amtsgericht Kassel',
    'Amtsgericht Melsungen',
    'Amtsgericht Wetzlar',
    'Amtsgericht Frankenberg (Eder)',
    'Amtsgericht Bad Schwalbach',
    'Amtsgericht Idstein',
    'Amtsgericht Rostock',
    'Amtsgericht Ludwigslust',
    'Amtsgericht Wismar',
    'Amtsgericht Greifswald',
    'Amtsgericht Ratingen',
    'Amtsgericht Duisburg',
    'Amtsgericht Duisburg-Ruhrort',
    'Amtsgericht Rheinberg',
    'Amtsgericht Marsberg',
    'Amtsgericht Warstein',
    'Amtsgericht Lübbecke',
    'Amtsgericht Minden',
    'Amtsgericht Rheda-Wiedenbrück',
    'Amtsgericht Lemgo',
    'Amtsgericht Bottrop',
    'Amtsgericht Essen-Borbeck',
    'Amtsgericht Gladbeck',
    'Amtsgericht Meinerzhagen',
    'Amtsgericht Wetter (Ruhr)',
    'Amtsgericht Beckum',
    'Amtsgericht Bocholt',
    'Amtsgericht Gronau',
    'Amtsgericht Münster',
    'Amtsgericht Steinfurt',
    'Amtsgericht Warendorf',
    'Amtsgericht Brakel',
    'Amtsgericht Höxter',
    'Amtsgericht Bad Berleburg',
    'Amtsgericht Siegen',
    'Amtsgericht Düren',
    'Amtsgericht Eschweiler',
    'Amtsgericht Geilenkirchen',
    'Amtsgericht Rheinbach',
    'Amtsgericht Brühl',
    'Amtsgericht Wermelskirchen',
    'Amtsgericht Bühl',
    'Amtsgericht Lörrach',
    'Amtsgericht Wiesloch',
    'Amtsgericht Donaueschingen',
    'Amtsgericht Radolfzell am Bodensee',
    'Amtsgericht Villingen-Schwenningen',
    'Amtsgericht Mannheim',
    'Amtsgericht Adelsheim',
    'Amtsgericht Kehl',
    'Amtsgericht Lahr/Schwarzwald',
    'Amtsgericht Bad Säckingen',
    'Amtsgericht Hechingen',
    'Amtsgericht Sigmaringen',
    'Amtsgericht Marbach',
    'Amtsgericht Schwäbisch Hall',
    'Amtsgericht Biberach/Riß',
    'Amtsgericht Freudenstadt',
    'Amtsgericht Ludwigsburg',
    'Amtsgericht Bad Urach',
    'Amtsgericht Münsingen',
    'Amtsgericht Aschaffenburg',
    'Amtsgericht Schweinfurt',
    'Amtsgericht Gemünden am Main',
    'Amtsgericht Würzburg',
    'Amtsgericht Aichach',
    'Amtsgericht Pfaffenhofen a.d.Ilm',
    'Amtsgericht Kaufbeuren',
    'Amtsgericht Ebersberg',
    'Amtsgericht Passau',
    'Amtsgericht Mühldorf am Inn',
    'Amtsgericht Traunstein',
    'Amtsgericht Amberg',
    'Amtsgericht Nürnberg',
    'Amtsgericht Lichtenberg',
    'Amtsgericht Spandau',
    'Amtsgericht Tiergarten',
    'Amtsgericht Wedding',
    'Amtsgericht Bernau bei Berlin',
    'Amtsgericht Frankfurt (Oder)',
    'Amtsgericht Schwedt/Oder',
    'Amtsgericht Bremerhaven',
    'Amtsgericht Hamburg-Bergedorf',
    'Amtsgericht Dieburg',
    'Amtsgericht Bad Homburg',
    'Amtsgericht Frankfurt am Main',
    'Amtsgericht Bad Hersfeld',
    'Amtsgericht Alsfeld',
    'Amtsgericht Hofgeismar',
    'Amtsgericht Dillenburg',
    'Amtsgericht Limburg a. d. Lahn',
    'Amtsgericht Schwalmstadt',
    'Amtsgericht Wiesbaden',
    'Amtsgericht Waren (Müritz)',
    'Amtsgericht Neubrandenburg',
    'Amtsgericht Schwerin',
    'Amtsgericht Wismar',
    'Amtsgericht Stralsund',
    'Amtsgericht Braunschweig',
    'Amtsgericht Salzgitter',
    'Amtsgericht Göttingen',
    'Amtsgericht Northeim',
    'Amtsgericht Osterode am Harz',
    'Amtsgericht Neustadt am Rübenberge',
    'Amtsgericht Wennigsen (Deister)',
    'Amtsgericht Burgdorf',
    'Amtsgericht Elze',
    'Amtsgericht Gifhorn',
    'Amtsgericht Hildesheim',
    'Amtsgericht Celle',
    'Amtsgericht Wesel',
    'Amtsgericht Emmerich am Rhein',
    'Amtsgericht Geldern',
    'Amtsgericht Moers',
    'Amtsgericht Grevenbroich',
    'Amtsgericht Velbert',
    'Amtsgericht Wuppertal',
    'Amtsgericht Menden (Sauerland)',
    'Amtsgericht Soest',
    'Amtsgericht Bielefeld',
    'Amtsgericht Bünde',
    'Amtsgericht Rahden',
    'Amtsgericht Recklinghausen',
    'Amtsgericht Witten',
    'Amtsgericht Blomberg',
    'Amtsgericht Dortmund',
    'Amtsgericht Kamen',
    'Amtsgericht Essen',
    'Amtsgericht Essen-Steele',
    'Amtsgericht Hagen',
    'Amtsgericht Iserlohn',
    'Amtsgericht Ahaus',
    'Amtsgericht Ahlen',
    'Amtsgericht Rheine',
    'Amtsgericht Lennestadt',
    'Amtsgericht Olpe',
    'Amtsgericht Aachen',
    'Amtsgericht Heinsberg',
    'Amtsgericht Euskirchen',
    'Amtsgericht Königswinter',
    'Amtsgericht Waldbröl',
    'Amtsgericht Gummersbach',
    'Amtsgericht Köln',
    'Amtsgericht Achern',
    'Amtsgericht Gernsbach',
    'Amtsgericht Rastatt',
    'Amtsgericht Breisach am Rhein',
    'Amtsgericht Kenzingen',
    'Amtsgericht Waldkirch',
    'Amtsgericht Sinsheim',
    'Amtsgericht Pforzheim',
    'Amtsgericht Überlingen',
    'Amtsgericht Weinheim',
    'Amtsgericht Mosbach',
    'Amtsgericht Wertheim',
    'Amtsgericht Wolfach',
    'Amtsgericht Schönau im Schwarzwald',
    'Amtsgericht Waldshut-Tiengen',
    'Amtsgericht Langenburg',
    'Amtsgericht Brackenheim',
    'Amtsgericht Bad Saulgau',
    'Amtsgericht Horb am Neckar',
    'Amtsgericht Tuttlingen',
    'Amtsgericht Backnang',
    'Amtsgericht Stuttgart',
    'Amtsgericht Aschaffenburg',
    'Amtsgericht Obernburg am Main',
    'Amtsgericht Obernburg am Main',
    'Amtsgericht Kronach',
    'Amtsgericht Lichtenfels',
    'Amtsgericht Landsberg am Lech',
    'Amtsgericht Nördlingen',
    'Amtsgericht Lindau',
    'Amtsgericht Landau a.d.Isar',
    'Amtsgericht Landshut',
    'Amtsgericht Miesbach',
    'Amtsgericht Starnberg',
    'Amtsgericht Freyung',
    'Amtsgericht Altötting',
    'Amtsgericht Erlangen',
    'Amtsgericht Hersbruck',
    'Amtsgericht Kelheim',
    'Amtsgericht Tirschenreuth',
    'Amtsgericht Weiden',
    'Amtsgericht Charlottenburg',
    'Amtsgericht Neukölln',
    'Amtsgericht Schöneberg',
    'Amtsgericht Pankow/Weißensee',
    'Amtsgericht Bad Liebenwerda',
    'Amtsgericht Cottbus',
    'Amtsgericht Eberswalde',
    'Amtsgericht Neuruppin',
    'Amtsgericht Prenzlau',
    'Amtsgericht Hamburg',
    'Amtsgericht Hamburg-Blankenese',
    'Amtsgericht Hamburg-Barmbek',
    'Amtsgericht Darmstadt',
    'Amtsgericht Lampertheim',
    'Amtsgericht Langen',
    'Amtsgericht Michelstadt',
    'Amtsgericht Offenbach am Main',
    'Amtsgericht Seligenstadt',
    'Amtsgericht Büdingen',
    'Amtsgericht Fritzlar',
    'Amtsgericht Limburg a.d. Lahn',
    'Amtsgericht Güstrow',
    'Amtsgericht Wolfenbüttel',
    'Amtsgericht Hann.Münden',
    'Amtsgericht Bückeburg',
    'Amtsgericht Stadthagen',
    'Amtsgericht Langenfeld',
    'Amtsgericht Dinslaken',
    'Amtsgericht Nettetal',
    'Amtsgericht Erkelenz',
    'Amtsgericht Mönchengladbach',
    'Amtsgericht Solingen',
    'Amtsgericht Arnsberg',
    'Amtsgericht Medebach',
    'Amtsgericht Schmallenberg',
    'Amtsgericht Bad Oeynhausen',
    'Amtsgericht Lünen',
    'Amtsgericht Dorsten',
    'Amtsgericht Marl',
    'Amtsgericht Plettenberg',
    'Amtsgericht Schwelm',
    'Amtsgericht Coesfeld',
    'Amtsgericht Dülmen',
    'Amtsgericht Lüdinghausen',
    'Amtsgericht Warburg',
    'Amtsgericht Bonn',
    'Amtsgericht Bergisch Gladbach',
    'Amtsgericht Ettenheim',
    'Amtsgericht Ettlingen',
    'Amtsgericht Stockach',
    'Amtsgericht Crailsheim',
    'Amtsgericht Ellwangen (Jagst)',
    'Amtsgericht Heidenheim a. d. Brenz',
    'Amtsgericht Schwäbisch Gmünd',
    'Amtsgericht Leutkirch',
    'Amtsgericht Ravensburg',
    'Amtsgericht Spaichingen',
    'Amtsgericht Nürtingen',
    'Amtsgericht Nagold',
    'Amtsgericht Tübingen',
    'Amtsgericht Ehingen/Donau',
    'Amtsgericht Geislingen/Steige',
    'Amtsgericht Forchheim',
    'Amtsgericht Coburg',
    'Amtsgericht Wunsiedel',
    'Amtsgericht Bad Kissingen',
    'Amtsgericht Kitzingen',
    'Amtsgericht Deggendorf',
    'Amtsgericht Viechtach',
    'Amtsgericht Sonthofen',
    'Amtsgericht Neu-Ulm',
    'Amtsgericht Weilheim',
    'Amtsgericht Wolfratshausen',
    'Amtsgericht Weißenburg',
    'Amtsgericht Neustadt an der Aisch',
    'Amtsgericht Straubing',
    'Amtsgericht Königs Wusterhausen',
    'Amtsgericht Bad Freienwalde (Oder)',
    'Amtsgericht Eisenhüttenstadt',
    'Amtsgericht Fürstenwalde/Spree',
    'Amtsgericht Perleberg',
    'Amtsgericht Zehdenick',
    'Amtsgericht Nauen',
    'Amtsgericht Rathenow',
    'Amtsgericht Hamburg-Altona',
    'Amtsgericht Hamburg-Harburg',
    'Amtsgericht Hamburg-Wandsbek',
    'Amtsgericht Eschwege',
    'Amtsgericht Korbach',
    'Amtsgericht Weilburg',
    'Amtsgericht Kirchhain',
    'Amtsgericht Marburg',
    'Amtsgericht Pasewalk',
    'Amtsgericht Waren (Müritz)',
    'Amtsgericht Ludwigslust',
    'Amtsgericht Stralsund',
    'Amtsgericht Bad Gandersheim',
    'Amtsgericht Helmstedt',
    'Amtsgericht Wolfsburg',
    'Amtsgericht Duderstadt',
    'Amtsgericht Einbeck',
    'Amtsgericht Herzberg am Harz',
    'Amtsgericht Hameln',
    'Amtsgericht Lüneburg',
    'Amtsgericht Uelzen',
    'Amtsgericht Zeven',
    'Amtsgericht Diepholz',
    'Amtsgericht Verden (Aller)',
    'Amtsgericht Walsrode',
    'Amtsgericht Cloppenburg',
    'Amtsgericht Delmenhorst',
    'Amtsgericht Vechta',
    'Amtsgericht Wildeshausen',
    'Amtsgericht Wilhelmshaven',
    'Amtsgericht Lingen (Ems)',
    'Amtsgericht Meppen',
    'Amtsgericht Osnabrück',
    'Amtsgericht Papenburg',
    'Amtsgericht Linz am Rhein',
    'Amtsgericht Sankt Goar',
    'Amtsgericht Westerburg',
    'Amtsgericht Bingen am Rhein',
    'Amtsgericht Bernkastel-Kues',
    'Amtsgericht Saarburg',
    'Amtsgericht Kaiserslautern',
    'Amtsgericht Homburg',
    'Amtsgericht Burg',
    'Amtsgericht Husum',
    'Amtsgericht Schleswig',
    'Amtsgericht Meldorf',
    'Amtsgericht Neumünster',
    'Amtsgericht Eutin',
    'Amtsgericht Pößneck',
    'Amtsgericht Rudolstadt',
    'Amtsgericht Eisenach',
    'Amtsgericht Goslar',
    'Amtsgericht Rinteln',
    'Amtsgericht Dannenberg',
    'Amtsgericht Cuxhaven',
    'Amtsgericht Otterndorf',
    'Amtsgericht Tostedt',
    'Amtsgericht Aurich',
    'Amtsgericht Emden',
    'Amtsgericht Brake (Unterweser)',
    'Amtsgericht Bersenbrück',
    'Amtsgericht Bad Kreuznach',
    'Amtsgericht Simmern (Hunsrück)',
    'Amtsgericht Betzdorf',
    'Amtsgericht Koblenz',
    'Amtsgericht Lahnstein',
    'Amtsgericht Montabaur',
    'Amtsgericht Sinzig',
    'Amtsgericht Mainz',
    'Amtsgericht Worms',
    'Amtsgericht Daun',
    'Amtsgericht Wittlich',
    'Amtsgericht Bad Dürkheim',
    'Amtsgericht Kusel',
    'Amtsgericht Rockenhausen',
    'Amtsgericht Kandel',
    'Amtsgericht Landstuhl',
    'Amtsgericht Zweibrücken',
    'Amtsgericht Saarbrücken',
    'Amtsgericht Sankt Ingbert',
    'Amtsgericht Chemnitz',
    'Amtsgericht Marienberg',
    'Amtsgericht Eilenburg',
    'Amtsgericht Sangerhausen',
    'Amtsgericht Zeitz',
    'Amtsgericht Haldensleben',
    'Amtsgericht Quedlinburg',
    'Amtsgericht Wernigerode',
    'Amtsgericht Bernburg',
    'Amtsgericht Eckernförde',
    'Amtsgericht Sömmerda',
    'Amtsgericht Arnstadt',
    'Amtsgericht Altenburg',
    'Amtsgericht Rudolstadt',
    'Amtsgericht Meiningen',
    'Amtsgericht Heilbad Heiligenstadt',
    'Amtsgericht Nordhausen',
    'Amtsgericht Sondershausen',
    'Amtsgericht Sondershausen',
    'Amtsgericht Soltau',
    'Amtsgericht Bremervörde',
    'Amtsgericht Stade',
    'Amtsgericht Nienburg (Weser)',
    'Amtsgericht Bad Iburg',
    'Amtsgericht Nordhorn',
    'Amtsgericht Altenkirchen (Westerwald)',
    'Amtsgericht Diez',
    'Amtsgericht Mayen',
    'Amtsgericht Neuwied',
    'Amtsgericht Trier',
    'Amtsgericht Neustadt an der Weinstraße',
    'Amtsgericht Pirmasens',
    'Amtsgericht Merzig',
    'Amtsgericht Neunkirchen',
    'Amtsgericht Freiberg',
    'Amtsgericht Aue',
    'Amtsgericht Döbeln',
    'Amtsgericht Hainichen',
    'Amtsgericht Dippoldiswalde',
    'Amtsgericht Meißen',
    'Amtsgericht Weißwasser',
    'Amtsgericht Zittau',
    'Amtsgericht Kamenz',
    'Amtsgericht Bautzen',
    'Amtsgericht Zittau',
    'Amtsgericht Grimma',
    'Amtsgericht Wittenberg',
    'Amtsgericht Merseburg',
    'Amtsgericht Gardelegen',
    'Amtsgericht Stendal',
    'Amtsgericht Niebüll',
    'Amtsgericht Itzehoe',
    'Amtsgericht Kiel',
    'Amtsgericht Norderstedt',
    'Amtsgericht Plön',
    'Amtsgericht Ratzeburg',
    'Amtsgericht Reinbek',
    'Amtsgericht Erfurt',
    'Amtsgericht Gotha',
    'Amtsgericht Mühlhausen',
    'Amtsgericht Alfeld (Leine)',
    'Amtsgericht Holzminden',
    'Amtsgericht Peine',
    'Amtsgericht Winsen (Luhe)',
    'Amtsgericht Buxtehude',
    'Amtsgericht Geestland',
    'Amtsgericht Osterholz-Scharmbeck',
    'Amtsgericht Rotenburg (Wümme)',
    'Amtsgericht Stolzenau',
    'Amtsgericht Syke',
    'Amtsgericht Wittmund',
    'Amtsgericht Jever',
    'Amtsgericht Oldenburg (Oldenburg)',
    'Amtsgericht Varel',
    'Amtsgericht Westerstede',
    'Amtsgericht Idar-Oberstein',
    'Amtsgericht Bad Sobernheim',
    'Amtsgericht Alzey',
    'Amtsgericht Hermeskeil',
    'Amtsgericht Frankenthal (Pfalz)',
    'Amtsgericht Germersheim',
    'Amtsgericht Landau in der Pfalz',
    'Amtsgericht Dresden',
    'Amtsgericht Pirna',
    'Amtsgericht Borna',
    'Amtsgericht Torgau',
    'Amtsgericht Plauen',
    'Amtsgericht Pinneberg',
    'Amtsgericht Bad Segeberg',
    'Amtsgericht Rendsburg',
    'Amtsgericht Ahrensburg',
    'Amtsgericht Lübeck',
    'Amtsgericht Apolda',
    'Amtsgericht Weimar',
    'Amtsgericht Gera',
    'Amtsgericht Greiz',
    'Amtsgericht Jena',
    'Amtsgericht Pößneck',
    'Amtsgericht Bad Salzungen',
    'Amtsgericht Hildburghausen',
    'Amtsgericht Sonneberg',
    'Amtsgericht Suhl',
    'Amtsgericht St. Wendel',
    'Amtsgericht Riesa',
    'Amtsgericht Görlitz',
    'Amtsgericht Hoyerswerda',
    'Amtsgericht Leipzig',
    'Amtsgericht Bitterfeld-Wolfen',
    'Amtsgericht Eisleben',
    'Amtsgericht Halle (Saale)',
    'Amtsgericht Naumburg',
    'Amtsgericht Weißenfels',
    'Amtsgericht Aschersleben',
    'Amtsgericht Halberstadt',
    'Amtsgericht Magdeburg',
    'Amtsgericht Schönebeck',
    'Amtsgericht Salzwedel',
    'Amtsgericht Flensburg',
    'Amtsgericht Elmshorn',
    'Amtsgericht Oldenburg (Holstein)',
    'Amtsgericht Schwarzenbek',
    'Amtsgericht Arnstadt',
    'Amtsgericht Stadtroda'
  ];

  async created() {
    this.requestForm = (<RequestFormIdentInterface>new EvanForm(this, {
      country: {
        value: 'germany', // TODO: should we use ISO 3166-1 alpha-2 country codes system wide, to avoid any confusions?
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      organization: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      regNumber: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          switch (form.country.value) {
            case 'germany':
              return /^HR(A|B)(\s|-)?(\d)+$/i.test(this.value)
            default:
              return false // foreign countries not supported yet
          }
        }
      },
      address: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      zipCode: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return !!this.value.match(/^\d{5}$/);
        }
      },
      city: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      contact: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      court: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      registerNumber: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      register: {
        value: 'HRA',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      department: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      }
    }));

    this.requestForm.organization.value = '';
    this.requestForm.regNumber.value = '';
    this.requestForm.country.value = 'germany';
    this.requestForm.address.value = '';
    this.requestForm.zipCode.value = '';
    this.requestForm.city.value = '';
    this.requestForm.contact.value = '';

    this.checkSending();
    this.listeners.push(dispatchers.requestIdentificationDispatcher
      .watch(async ($event) => {
        // if dispatcher has finished loading, reload the data
        if ($event.detail.status === 'finished') {
          this.status = 2;
          this.sending = false;
          triggerRequestReload(this.$route.params.address);
        }
      }));
  }

  /**
   * Update status, when clicked in step component
   *
   * @param step
   */
  updatestep(step: number) {
    this.status = step;
  }

  /**
   * Clear listeners...
   */
  beforeDestroy() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * check if currently a verification gets accepted.
   */
  async checkSending() {
    const runtime: bcc.Runtime = (<any>this).getRuntime();
    const instances = await dispatchers.requestIdentificationDispatcher.getInstances(runtime);

    this.sending = instances.length !== 0;
  }

  /**
   * Show the info modal.
   */
  show() {
    (<any>this.$refs).requestModal.show();
  }

  /**
   * Hide the info modal.
   */
  hide() {
    (<any>this.$refs).requestModal.hide();
  }

  /**
   * Send the request verification b-mail, so the process will be triggered.
   */
  requestIdentification() {
    this.sending = true;

    // define the request data, so we can append it into the attachment and as payload in the body
    const requestData = {
      organizationCity: this.requestForm.city.value,
      organizationContact: this.requestForm.contact.value,
      organizationCountry: this.requestForm.country.value,
      organizationEvanId: (<any>this).getRuntime().activeAccount,
      organizationRegistration: this.requestForm.regNumber.value,
      registrationNumber: this.requestForm.regNumber.value,
      organizationName: this.requestForm.organization.value,
      organizationStreetAddress: this.requestForm.address.value,
      organizationZipCode: this.requestForm.zipCode.value,
    };

    // send the verification request
    dispatchers.requestIdentificationDispatcher.start((<any>this).getRuntime(), {
      mail: {
        title: (<any>this).$i18n.translate('_org.ident.notary.request.mail.title'),
        body: (<any>this).$i18n.translate('_org.ident.notary.request.mail.body', requestData),
      },
      requestData,
    });
  }
}
