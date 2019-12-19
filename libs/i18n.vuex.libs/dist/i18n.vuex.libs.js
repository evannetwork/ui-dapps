!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("@evan.network/ui-dapp-browser")):"function"==typeof define&&define.amd?define("i18n.vuex.libs.js",["@evan.network/ui-dapp-browser"],t):"object"==typeof exports?exports["i18n.vuex.libs.js"]=t(require("@evan.network/ui-dapp-browser")):e["i18n.vuex.libs.js"]=t(e["@evan.network/ui-dapp-browser"])}(window,function(e){return function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/dist/",n(n.s="./src/index.ts")}({"../../node_modules/vuex-i18n/dist/vuex-i18n.es.js":
/*!****************************************************************************************************!*\
  !*** /Users/tschuck/projects/evan.network/ui/ui-dapps/node_modules/vuex-i18n/dist/vuex-i18n.es.js ***!
  \****************************************************************************************************/
/*! exports provided: default */function(e,t,n){"use strict";function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}n.r(t);var r={namespaced:!0,state:{locale:null,fallback:null,translations:{}},mutations:{SET_LOCALE:function(e,t){e.locale=t.locale},ADD_LOCALE:function(e,t){var n=o(t.translations);if(e.translations.hasOwnProperty(t.locale)){var a=e.translations[t.locale];e.translations[t.locale]=Object.assign({},a,n)}else e.translations[t.locale]=n;try{e.translations.__ob__&&e.translations.__ob__.dep.notify()}catch(e){}},REPLACE_LOCALE:function(e,t){var n=o(t.translations);e.translations[t.locale]=n;try{e.translations.__ob__&&e.translations.__ob__.dep.notify()}catch(e){}},REMOVE_LOCALE:function(e,t){if(e.translations.hasOwnProperty(t.locale)){e.locale===t.locale&&(e.locale=null);var n=Object.assign({},e.translations);delete n[t.locale],e.translations=n}},SET_FALLBACK_LOCALE:function(e,t){e.fallback=t.locale}},actions:{setLocale:function(e,t){e.commit({type:"SET_LOCALE",locale:t.locale})},addLocale:function(e,t){e.commit({type:"ADD_LOCALE",locale:t.locale,translations:t.translations})},replaceLocale:function(e,t){e.commit({type:"REPLACE_LOCALE",locale:t.locale,translations:t.translations})},removeLocale:function(e,t){e.commit({type:"REMOVE_LOCALE",locale:t.locale,translations:t.translations})},setFallbackLocale:function(e,t){e.commit({type:"SET_FALLBACK_LOCALE",locale:t.locale})}}},o=function e(t){var n={};for(var r in t)if(t.hasOwnProperty(r)){var o=a(t[r]);if(s(t[r])){for(var l=t[r].length,c=0;c<l;c++){if("string"!==a(t[r][c])){console.warn("i18n:","currently only arrays of strings are fully supported",t[r]);break}}n[r]=t[r]}else if("object"==o&&null!==o){var i=e(t[r]);for(var u in i)i.hasOwnProperty(u)&&(n[r+"."+u]=i[u])}else n[r]=t[r]}return n};function s(e){return!!e&&Array===e.constructor}var l=function(e,t){switch(e){case"ay":case"bo":case"cgg":case"dz":case"fa":case"id":case"ja":case"jbo":case"ka":case"kk":case"km":case"ko":case"ky":case"lo":case"ms":case"my":case"sah":case"su":case"th":case"tt":case"ug":case"vi":case"wo":case"zh":return 0;case"is":return t%10!=1||t%100==11?1:0;case"jv":return 0!==t?1:0;case"mk":return 1===t||t%10==1?0:1;case"ach":case"ak":case"am":case"arn":case"br":case"fil":case"fr":case"gun":case"ln":case"mfe":case"mg":case"mi":case"oc":case"pt_BR":case"tg":case"ti":case"tr":case"uz":case"wa":case"zh":return t>1?1:0;case"lv":return t%10==1&&t%100!=11?0:0!==t?1:2;case"lt":return t%10==1&&t%100!=11?0:t%10>=2&&(t%100<10||t%100>=20)?1:2;case"be":case"bs":case"hr":case"ru":case"sr":case"uk":return t%10==1&&t%100!=11?0:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?1:2;case"mnk":return 0===t?0:1===t?1:2;case"ro":return 1===t?0:0===t||t%100>0&&t%100<20?1:2;case"pl":return 1===t?0:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?1:2;case"cs":case"sk":return 1===t?0:t>=2&&t<=4?1:2;case"csb":return 1===t?0:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?1:2;case"sl":return t%100==1?0:t%100==2?1:t%100==3||t%100==4?2:3;case"mt":return 1===t?0:0===t||t%100>1&&t%100<11?1:t%100>10&&t%100<20?2:3;case"gd":return 1===t||11===t?0:2===t||12===t?1:t>2&&t<20?2:3;case"cy":return 1===t?0:2===t?1:8!==t&&11!==t?2:3;case"kw":return 1===t?0:2===t?1:3===t?2:3;case"ga":return 1===t?0:2===t?1:t>2&&t<7?2:t>6&&t<11?3:4;case"ar":return 0===t?0:1===t?1:2===t?2:t%100>=3&&t%100<=10?3:t%100>=11?4:5;default:return 1!==t?1:0}},c={install:function(e,t,n){"string"!=typeof arguments[2]&&"string"!=typeof arguments[3]||(console.warn("i18n: Registering the plugin vuex-i18n with a string for `moduleName` or `identifiers` is deprecated. Use a configuration object instead.","https://github.com/dkfbasel/vuex-i18n#setup"),n={moduleName:arguments[2],identifiers:arguments[3]});var a=(n=Object.assign({warnings:!0,moduleName:"i18n",identifiers:["{","}"],preserveState:!1,translateFilterName:"translate",translateInFilterName:"translateIn",onTranslationNotFound:function(){}},n)).moduleName,o=n.identifiers,s=n.translateFilterName,l=n.translateInFilterName,c=n.onTranslationNotFound;if("function"!=typeof c&&(console.error("i18n: i18n config option onTranslationNotFound must be a function"),c=function(){}),t.registerModule(a,r,{preserveState:n.preserveState}),!1===t.state.hasOwnProperty(a))return console.error("i18n: i18n vuex module is not correctly initialized. Please check the module name:",a),e.prototype.$i18n=function(e){return e},e.prototype.$getLanguage=function(){return null},void(e.prototype.$setLanguage=function(){console.error("i18n: i18n vuex module is not correctly initialized")});var u=i(o,n.warnings),f=function(){var e=t.state[a].locale;return p.apply(void 0,[e].concat(Array.prototype.slice.call(arguments)))},p=function(e){var r=arguments,o="",s="",l={},i=null,f=r.length;if(f>=3&&"string"==typeof r[2]?(o=r[1],s=r[2],f>3&&(l=r[3]),f>4&&(i=r[4])):(s=o=r[1],f>2&&(l=r[2]),f>3&&(i=r[3])),!e)return n.warnings&&console.warn("i18n: i18n locale is not set when trying to access translations:",o),s;var p=t.state[a].translations,d=t.state[a].fallback,y=e.split("-"),v=!0;if(!1===p.hasOwnProperty(e)?v=!1:!1===p[e].hasOwnProperty(o)&&(v=!1),!0===v)return u(e,p[e][o],l,i);if(y.length>1&&!0===p.hasOwnProperty(y[0])&&!0===p[y[0]].hasOwnProperty(o))return u(y[0],p[y[0]][o],l,i);var m=c(e,o,s);return m&&Promise.resolve(m).then(function(t){var n={};n[o]=t,g(e,n)}),!1===p.hasOwnProperty(d)?u(e,s,l,i):!1===p[d].hasOwnProperty(o)?u(d,s,l,i):u(e,p[d][o],l,i)},d=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"fallback",r=t.state[a].locale,o=t.state[a].fallback,s=t.state[a].translations;if(s.hasOwnProperty(r)&&s[r].hasOwnProperty(e))return!0;if("strict"==n)return!1;var l=r.split("-");return!!(l.length>1&&s.hasOwnProperty(l[0])&&s[l[0]].hasOwnProperty(e))||"locale"!=n&&!(!s.hasOwnProperty(o)||!s[o].hasOwnProperty(e))},y=function(e){t.dispatch({type:"".concat(a,"/setFallbackLocale"),locale:e})},v=function(e){t.dispatch({type:"".concat(a,"/setLocale"),locale:e})},m=function(){return t.state[a].locale},b=function(){return Object.keys(t.state[a].translations)},g=function(e,n){return t.dispatch({type:"".concat(a,"/addLocale"),locale:e,translations:n})},h=function(e,n){return t.dispatch({type:"".concat(a,"/replaceLocale"),locale:e,translations:n})},w=function(e){t.state[a].translations.hasOwnProperty(e)&&t.dispatch({type:"".concat(a,"/removeLocale"),locale:e})},O=function(e){return n.warnings&&console.warn("i18n: $i18n.exists is depreceated. Please use $i18n.localeExists instead. It provides exactly the same functionality."),L(e)},L=function(e){return t.state[a].translations.hasOwnProperty(e)};e.prototype.$i18n={locale:m,locales:b,set:v,add:g,replace:h,remove:w,fallback:y,localeExists:L,keyExists:d,translate:f,translateIn:p,exists:O},e.i18n={locale:m,locales:b,set:v,add:g,replace:h,remove:w,fallback:y,translate:f,translateIn:p,localeExists:L,keyExists:d,exists:O},e.prototype.$t=f,e.prototype.$tlang=p,e.filter(s,f),e.filter(l,function(e,t){for(var n=arguments.length,a=new Array(n>2?n-2:0),r=2;r<n;r++)a[r-2]=arguments[r];return p.apply(void 0,[t,e].concat(a))})}},i=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];null!=e&&2==e.length||console.warn("i18n: You must specify the start and end character identifying variable substitutions");var n=new RegExp(e[0]+"{1}(\\w{1}|\\w.+?)"+e[1]+"{1}","g"),r=function(a,r){return a.replace?a.replace(n,function(n){var o=n.replace(e[0],"").replace(e[1],"");return void 0!==r[o]?r[o]:(t&&(console.group?console.group("i18n: Not all placeholders found"):console.warn("i18n: Not all placeholders found"),console.warn("Text:",a),console.warn("Placeholder:",n),console.groupEnd&&console.groupEnd()),n)}):a};return function(e,n){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,c=a(n),i=a(s),f=function(){return u(n)?n.map(function(e){return r(e,o)}):"string"===c?r(n,o):void 0};if(null===s)return f();if("number"!==i)return t&&console.warn("i18n: pluralization is not a number"),f();var p=f(),d=null;d=u(p)&&p.length>0?p:p.split(":::");var y=l(e,s);return void 0===d[y]?(t&&console.warn("i18n: pluralization not provided in locale",n,e,y),d[0].trim()):d[y].trim()}};function u(e){return!!e&&Array===e.constructor}var f={store:r,plugin:c};t.default=f},"./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var a=n(/*! @evan.network/ui-dapp-browser */"@evan.network/ui-dapp-browser"),r=n(/*! vuex-i18n */"../../node_modules/vuex-i18n/dist/vuex-i18n.es.js");a.System.map["vuex-i18n"]="i18n.vuex.libs."+Object(a.getDomainName)()+"!dapp-content",t.default=r.default},"@evan.network/ui-dapp-browser":
/*!************************************************!*\
  !*** external "@evan.network/ui-dapp-browser" ***!
  \************************************************/
/*! no static exports found */function(t,n){t.exports=e}})});