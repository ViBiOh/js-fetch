"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.readHeaders=readHeaders,exports.readContent=readContent,exports.errorHandler=errorHandler,exports.stringify=stringify,exports.default=exports.MEDIA_TYPE_TEXT=exports.MEDIA_TYPE_JSON=exports.CONTENT_TYPE_HEADER=exports.AUTHORIZATION_HEADER=exports.ACCEPT_TYPE_HEADER=void 0,require("isomorphic-fetch");var ACCEPT_TYPE_HEADER="Accept";exports.ACCEPT_TYPE_HEADER=ACCEPT_TYPE_HEADER;var AUTHORIZATION_HEADER="Authorization";exports.AUTHORIZATION_HEADER=AUTHORIZATION_HEADER;var CONTENT_TYPE_HEADER="Content-Type";exports.CONTENT_TYPE_HEADER=CONTENT_TYPE_HEADER;var MEDIA_TYPE_JSON="application/json";exports.MEDIA_TYPE_JSON=MEDIA_TYPE_JSON;var MEDIA_TYPE_TEXT="text/plain";exports.MEDIA_TYPE_TEXT=MEDIA_TYPE_TEXT;var CONTENT_TYPE_JSON=new RegExp(MEDIA_TYPE_JSON,"i");function readHeaders(e){if(e.headers.raw){var r=e.headers.raw();return Object.keys(r).reduce(function(e,t){return e[t]=Array.isArray(r[t])?r[t].join(", "):r[t],e},{})}return Array.from(e.headers.entries()).reduce(function(e,t){return e[t[0]]=t[1],e},{})}function readContent(e){return CONTENT_TYPE_JSON.test(e.headers.get(CONTENT_TYPE_HEADER))?e.json():e.text()}function errorHandler(r){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:readContent;return r.status<400?Promise.resolve(r):new Promise(function(e,t){return n(r).then(function(e){t({status:r.status,headers:readHeaders(r),content:e})})})}function stringify(e,t,r){var n=[],u=!!Array.isArray(t)&&t;return JSON.stringify(e,function(e,t){if(""===e||!u||-1!==u.indexOf(e)){if("object"===_typeof(t)&&null!==t){if(-1!==n.indexOf(t))return"[Circular]";n.push(t)}return t}},r)}function doFetch(e){var t=2<arguments.length&&void 0!==arguments[2]?arguments[2]:errorHandler,r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:readContent;return fetch(e,1<arguments.length&&void 0!==arguments[1]?arguments[1]:{}).then(function(e){return t(e,r)}).then(r)}function isJson(e){try{return JSON.parse(e),!0}catch(e){return!1}}var FuntchBuilder=function(){function e(){_classCallCheck(this,e),this.params={headers:{}}}return _createClass(e,[{key:"url",value:function(e){return this.url=e,this}},{key:"header",value:function(e,t){return this.params.headers[e]=t,this}},{key:"auth",value:function(e){return this.header(AUTHORIZATION_HEADER,e)}},{key:"contentJson",value:function(){return this.header(CONTENT_TYPE_HEADER,MEDIA_TYPE_JSON)}},{key:"contentText",value:function(){return this.header(CONTENT_TYPE_HEADER,MEDIA_TYPE_TEXT)}},{key:"guessContentType",value:function(e){return isJson(e)?this.contentJson():this.contentText()}},{key:"acceptJson",value:function(){return this.header(ACCEPT_TYPE_HEADER,MEDIA_TYPE_JSON)}},{key:"acceptText",value:function(){return this.header(ACCEPT_TYPE_HEADER,MEDIA_TYPE_TEXT)}},{key:"content",value:function(e){return this.readContent=e,this}},{key:"error",value:function(e){return this.errorHandler=e,this}},{key:"body",value:function(e,t){var r=!(1<arguments.length&&void 0!==t)||t;if(void 0!==e){var n=e;if("object"===_typeof(e)?n=stringify(e):"string"!=typeof e&&(n=String(e)),this.params.body=n,r&&!this.params.headers[CONTENT_TYPE_HEADER])return this.guessContentType(n)}return this}},{key:"method",value:function(e){return this.params.method=e,this}},{key:"get",value:function(){return this.method("GET").send()}},{key:"post",value:function(e){return this.body(e).method("POST").send()}},{key:"put",value:function(e){return this.body(e).method("PUT").send()}},{key:"patch",value:function(e){return this.body(e).method("PATCH").send()}},{key:"delete",value:function(){return this.method("DELETE").send()}},{key:"send",value:function(){return doFetch(this.url,this.params,this.errorHandler,this.readContent)}}]),e}(),funtch=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"url",value:function(e){return(new FuntchBuilder).url(e)}},{key:"get",value:function(e){return(new FuntchBuilder).url(e).get()}},{key:"post",value:function(e,t){return(new FuntchBuilder).url(e).post(t)}},{key:"put",value:function(e,t){return(new FuntchBuilder).url(e).put(t)}},{key:"patch",value:function(e,t){return(new FuntchBuilder).url(e).patch(t)}},{key:"delete",value:function(e){return(new FuntchBuilder).url(e).delete()}}]),e}();exports.default=funtch;