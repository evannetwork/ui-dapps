!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("dapp-browser"),require("vuex"),require("vue-material"),require("vuex-i18n"),require("vue")):"function"==typeof define&&define.amd?define("evan.vue.libs.js",["dapp-browser","vuex","vue-material","vuex-i18n","vue"],t):"object"==typeof exports?exports["evan.vue.libs.js"]=t(require("dapp-browser"),require("vuex"),require("vue-material"),require("vuex-i18n"),require("vue")):e["evan.vue.libs.js"]=t(e["dapp-browser"],e.vuex,e["vue-material"],e["vuex-i18n"],e.vue)}(window,function(e,t,n,r,o){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/dist/",n(n.s=8)}([function(e,t,n){},function(t,n){t.exports=e},function(e,n){e.exports=t},function(e,t){e.exports=n},function(e,t){e.exports=r},function(e,t){e.exports=o},function(e,t,n){},function(e,t,n){"use strict";var r=n(0);n.n(r).a},function(e,t,n){"use strict";n.r(t);var r=n(1),o=n(2),u=n.n(o),i=n(3),c=n.n(i),a=(n(6),n(4),{de:{hello:"Hallo Welt"},en:{hello:"Hello World"}}),s=function(e,t){Object.keys(a).forEach(function(t){return e.i18n.add(t,a[t])})},f=n(5),l=n.n(f).a.extend({methods:{}});n(7);var p=[{name:"evan-success",comp:function(e,t,n,r,o,u,i,c){var a,s="function"==typeof e?e.options:e;if(t&&(s.render=t,s.staticRenderFns=[],s._compiled=!0),s._scopeId="data-v-"+u,a)if(s.functional){s._injectStyles=a;var f=s.render;s.render=function(e,t){return a.call(t),f(e,t)}}else{var l=s.beforeCreate;s.beforeCreate=l?[].concat(l,a):[a]}return{exports:e,options:s}}(l,function(){var e=this.$createElement,t=this._self._c||e;return t("svg",{staticClass:"checkmark",attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 52 52"}},[t("circle",{staticClass:"checkmark__circle",attrs:{cx:"26",cy:"26",r:"25",fill:"none"}}),this._v(" "),t("path",{staticClass:"checkmark__check",attrs:{fill:"none",d:"M14.1 27.2l7.1 7.2 16.7-16.8"}})])},0,0,0,"91f258b6").exports}];n.d(t,"VueCoreEvan",function(){return v}),n.d(t,"translations",function(){return a}),n.d(t,"registerEvanI18N",function(){return s}),r.System.map["@evan.network/vue-core"]="evan.vue.libs."+Object(r.getDomainName)()+"!dapp-content";var v=function(e){e.use(c.a),e.use(u.a),function(e){p.forEach(function(t){e.component(t.name,t.comp)})}(e)}}])});