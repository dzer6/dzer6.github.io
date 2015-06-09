if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

//    PouchDB 3.4.1-prerelease
//    
//    (c) 2012-2015 Dale Harvey and the PouchDB team
//    PouchDB may be freely distributed under the Apache license, version 2.0.
//    For all details and documentation:
//    http://pouchdb.com
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.PouchDB=e()}}(function(){var define,module,exports;return function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var f=n[s]={exports:{}};t[s][0].call(f.exports,function(e){var n=t[s][1][e];return o(n?n:e)},f,f.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(e,t,n){"use strict";function r(e,t){for(var n=0;n<e.length;n++)if(t(e[n],n)===!0)return e[n];return!1}function o(e){return function(t,n){t||n[0]&&n[0].error?e(t||n[0]):e(null,n.length?n[0]:n)}}function i(e){var t={},n=[];return u.traverseRevTree(e,function(e,r,o,i){var s=r+"-"+o;return e&&(t[s]=0),void 0!==i&&n.push({from:i,to:s}),s}),n.reverse(),n.forEach(function(e){void 0===t[e.from]?t[e.from]=1+t[e.to]:t[e.from]=Math.min(t[e.from],1+t[e.to])}),t}function s(e,t,n){var r="limit"in t?t.keys.slice(t.skip,t.limit+t.skip):t.skip>0?t.keys.slice(t.skip):t.keys;if(t.descending&&r.reverse(),!r.length)return e._allDocs({limit:0},n);var o={offset:t.skip};return h.all(r.map(function(n){var r=c.extend(!0,{key:n,deleted:"ok"},t);return["limit","skip","keys"].forEach(function(e){delete r[e]}),new h(function(t,i){e._allDocs(r,function(e,r){return e?i(e):(o.total_rows=r.total_rows,void t(r.rows[0]||{key:n,error:"not_found"}))})})})).then(function(e){return o.rows=e,o})}function a(){l.call(this)}var c=e(36),u=e(31),f=e(19),l=e(40).EventEmitter,d=e(27),p=e(13),h=c.Promise;c.inherits(a,l),t.exports=a,a.prototype.post=c.adapterFun("post",function(e,t,n){return"function"==typeof t&&(n=t,t={}),"object"!=typeof e||Array.isArray(e)?n(f.error(f.NOT_AN_OBJECT)):void this.bulkDocs({docs:[e]},t,o(n))}),a.prototype.put=c.adapterFun("put",c.getArguments(function(e){var t,n,r,i,s=e.shift(),a="_id"in s;if("object"!=typeof s||Array.isArray(s))return(i=e.pop())(f.error(f.NOT_AN_OBJECT));for(s=c.clone(s);;)if(t=e.shift(),n=typeof t,"string"!==n||a?"string"!==n||!a||"_rev"in s?"object"===n?r=t:"function"===n&&(i=t):s._rev=t:(s._id=t,a=!0),!e.length)break;r=r||{};var u=c.invalidIdError(s._id);return u?i(u):c.isLocalId(s._id)&&"function"==typeof this._putLocal?s._deleted?this._removeLocal(s,i):this._putLocal(s,i):void this.bulkDocs({docs:[s]},r,o(i))})),a.prototype.putAttachment=c.adapterFun("putAttachment",function(e,t,n,r,o,i){function s(e){return e._attachments=e._attachments||{},e._attachments[t]={content_type:o,data:r},a.put(e)}var a=this;return"function"==typeof o&&(i=o,o=r,r=n,n=null),"undefined"==typeof o&&(o=r,r=n,n=null),a.get(e).then(function(e){if(e._rev!==n)throw f.error(f.REV_CONFLICT);return s(e)},function(t){if(t.reason===f.MISSING_DOC.message)return s({_id:e});throw t})}),a.prototype.removeAttachment=c.adapterFun("removeAttachment",function(e,t,n,r){var o=this;o.get(e,function(e,i){return e?void r(e):i._rev!==n?void r(f.error(f.REV_CONFLICT)):i._attachments?(delete i._attachments[t],0===Object.keys(i._attachments).length&&delete i._attachments,void o.put(i,r)):r()})}),a.prototype.remove=c.adapterFun("remove",function(e,t,n,r){var i;"string"==typeof t?(i={_id:e,_rev:t},"function"==typeof n&&(r=n,n={})):(i=e,"function"==typeof t?(r=t,n={}):(r=n,n=t)),n=c.clone(n||{}),n.was_delete=!0;var s={_id:i._id,_rev:i._rev||n.rev};return s._deleted=!0,c.isLocalId(s._id)&&"function"==typeof this._removeLocal?this._removeLocal(i,r):void this.bulkDocs({docs:[s]},n,o(r))}),a.prototype.revsDiff=c.adapterFun("revsDiff",function(e,t,n){function r(e,t){a.has(e)||a.set(e,{missing:[]}),a.get(e).missing.push(t)}function o(t,n){var o=e[t].slice(0);u.traverseRevTree(n,function(e,n,i,s,a){var c=n+"-"+i,u=o.indexOf(c);-1!==u&&(o.splice(u,1),"available"!==a.status&&r(t,c))}),o.forEach(function(e){r(t,e)})}"function"==typeof t&&(n=t,t={}),t=c.clone(t);var i=Object.keys(e);if(!i.length)return n(null,{});var s=0,a=new c.Map;i.map(function(t){this._getRevisionTree(t,function(r,c){if(r&&404===r.status&&"missing"===r.message)a.set(t,{missing:e[t]});else{if(r)return n(r);o(t,c)}if(++s===i.length){var u={};return a.forEach(function(e,t){u[t]=e}),n(null,u)}})},this)}),a.prototype.compactDocument=c.adapterFun("compactDocument",function(e,t,n){var r=this;this._getRevisionTree(e,function(o,s){if(o)return n(o);var a=i(s),c=[],f=[];Object.keys(a).forEach(function(e){a[e]>t&&c.push(e)}),u.traverseRevTree(s,function(e,t,n,r,o){var i=t+"-"+n;"available"===o.status&&-1!==c.indexOf(i)&&f.push(i)}),r._doCompaction(e,f,n)})}),a.prototype.compact=c.adapterFun("compact",function(e,t){"function"==typeof e&&(t=e,e={});var n=this;e=c.clone(e||{}),n.get("_local/compaction")["catch"](function(){return!1}).then(function(r){return"function"==typeof n._compact?(r&&r.last_seq&&(e.last_seq=r.last_seq),n._compact(e,t)):void 0})}),a.prototype._compact=function(e,t){function n(e){s.push(o.compactDocument(e.id,0))}function r(e){var n=e.last_seq;h.all(s).then(function(){return d(o,"_local/compaction",function(e){return!e.last_seq||e.last_seq<n?(e.last_seq=n,e):!1})}).then(function(){t(null,{ok:!0})})["catch"](t)}var o=this,i={returnDocs:!1,last_seq:e.last_seq||0},s=[];o.changes(i).on("change",n).on("complete",r).on("error",t)},a.prototype.get=c.adapterFun("get",function(e,t,n){function o(){var r=[],o=i.length;return o?void i.forEach(function(i){s.get(e,{rev:i,revs:t.revs,attachments:t.attachments},function(e,t){r.push(e?{missing:i}:{ok:t}),o--,o||n(null,r)})}):n(null,r)}if("function"==typeof t&&(n=t,t={}),"string"!=typeof e)return n(f.error(f.INVALID_ID));if(c.isLocalId(e)&&"function"==typeof this._getLocal)return this._getLocal(e,n);var i=[],s=this;if(!t.open_revs)return this._get(e,t,function(e,o){if(t=c.clone(t),e)return n(e);var i=o.doc,a=o.metadata,f=o.ctx;if(t.conflicts){var l=u.collectConflicts(a);l.length&&(i._conflicts=l)}if(c.isDeleted(a,i._rev)&&(i._deleted=!0),t.revs||t.revs_info){var d=u.rootToLeaf(a.rev_tree),p=r(d,function(e){return-1!==e.ids.map(function(e){return e.id}).indexOf(i._rev.split("-")[1])}),h=p.ids.map(function(e){return e.id}).indexOf(i._rev.split("-")[1])+1,v=p.ids.length-h;if(p.ids.splice(h,v),p.ids.reverse(),t.revs&&(i._revisions={start:p.pos+p.ids.length-1,ids:p.ids.map(function(e){return e.id})}),t.revs_info){var _=p.pos+p.ids.length;i._revs_info=p.ids.map(function(e){return _--,{rev:_+"-"+e.id,status:e.opts.status}})}}if(t.local_seq&&(c.info('The "local_seq" option is deprecated and will be removed'),i._local_seq=o.metadata.seq),t.attachments&&i._attachments){var m=i._attachments,g=Object.keys(m).length;if(0===g)return n(null,i);Object.keys(m).forEach(function(e){this._getAttachment(m[e],{encode:!0,ctx:f},function(t,r){var o=i._attachments[e];o.data=r,delete o.stub,delete o.length,--g||n(null,i)})},s)}else{if(i._attachments)for(var y in i._attachments)i._attachments.hasOwnProperty(y)&&(i._attachments[y].stub=!0);n(null,i)}});if("all"===t.open_revs)this._getRevisionTree(e,function(e,t){return e?n(e):(i=u.collectLeaves(t).map(function(e){return e.rev}),void o())});else{if(!Array.isArray(t.open_revs))return n(f.error(f.UNKNOWN_ERROR,"function_clause"));i=t.open_revs;for(var a=0;a<i.length;a++){var l=i[a];if("string"!=typeof l||!/^\d+-/.test(l))return n(f.error(f.INVALID_REV))}o()}}),a.prototype.getAttachment=c.adapterFun("getAttachment",function(e,t,n,r){var o=this;n instanceof Function&&(r=n,n={}),n=c.clone(n),this._get(e,n,function(e,i){return e?r(e):i.doc._attachments&&i.doc._attachments[t]?(n.ctx=i.ctx,void o._getAttachment(i.doc._attachments[t],n,r)):r(f.error(f.MISSING_DOC))})}),a.prototype.allDocs=c.adapterFun("allDocs",function(e,t){if("function"==typeof e&&(t=e,e={}),e=c.clone(e),e.skip="undefined"!=typeof e.skip?e.skip:0,"keys"in e){if(!Array.isArray(e.keys))return t(new TypeError("options.keys must be an array"));var n=["startkey","endkey","key"].filter(function(t){return t in e})[0];if(n)return void t(f.error(f.QUERY_PARSE_ERROR,"Query parameter `"+n+"` is not compatible with multi-get"));if("http"!==this.type())return s(this,e,t)}return this._allDocs(e,t)}),a.prototype.changes=function(e,t){return"function"==typeof e&&(t=e,e={}),new p(this,e,t)},a.prototype.close=c.adapterFun("close",function(e){return this._closed=!0,this._close(e)}),a.prototype.info=c.adapterFun("info",function(e){var t=this;this._info(function(n,r){return n?e(n):(r.db_name=r.db_name||t._db_name,r.auto_compaction=!(!t.auto_compaction||"http"===t.type()),void e(null,r))})}),a.prototype.id=c.adapterFun("id",function(e){return this._id(e)}),a.prototype.type=function(){return"function"==typeof this._type?this._type():this.adapter},a.prototype.bulkDocs=c.adapterFun("bulkDocs",function(e,t,n){if("function"==typeof t&&(n=t,t={}),t=c.clone(t),Array.isArray(e)&&(e={docs:e}),!e||!e.docs||!Array.isArray(e.docs))return n(f.error(f.MISSING_BULK_DOCS));for(var r=0;r<e.docs.length;++r)if("object"!=typeof e.docs[r]||Array.isArray(e.docs[r]))return n(f.error(f.NOT_AN_OBJECT));return e=c.clone(e),"new_edits"in t||("new_edits"in e?t.new_edits=e.new_edits:t.new_edits=!0),t.new_edits||"http"===this.type()||e.docs.sort(function(e,t){var n=c.compare(e._id,t._id);if(0!==n)return n;var r=e._revisions?e._revisions.start:0,o=t._revisions?t._revisions.start:0;return c.compare(r,o)}),e.docs.forEach(function(e){e._deleted&&delete e._attachments}),this._bulkDocs(e,t,function(e,r){return e?n(e):(t.new_edits||(r=r.filter(function(e){return e.error})),void n(null,r))})}),a.prototype.registerDependentDatabase=c.adapterFun("registerDependentDatabase",function(e,t){function n(t){return t.dependentDbs=t.dependentDbs||{},t.dependentDbs[e]?!1:(t.dependentDbs[e]=!0,t)}var r=new this.constructor(e,this.__opts);d(this,"_local/_pouch_dependentDbs",n,function(e){return e?t(e):t(null,{db:r})})}),a.prototype.destroy=c.adapterFun("destroy",function(e){function t(){n._destroy(function(t,r){return t?e(t):(n.emit("destroyed"),void e(null,r||{ok:!0}))})}var n=this,r="use_prefix"in n?n.use_prefix:!0;n.get("_local/_pouch_dependentDbs",function(o,i){if(o)return 404!==o.status?e(o):t();var s=i.dependentDbs,a=n.constructor,c=Object.keys(s).map(function(e){var t=r?e.replace(new RegExp("^"+a.prefix),""):e;return new a(t,n.__opts).destroy()});h.all(c).then(t,function(t){e(t)})})})},{13:13,19:19,27:27,31:31,36:36,40:40}],2:[function(e,t,n){(function(n){"use strict";function r(e){return/^_design/.test(e)?"_design/"+encodeURIComponent(e.slice(8)):/^_local/.test(e)?"_local/"+encodeURIComponent(e.slice(7)):encodeURIComponent(e)}function o(e){return e._attachments&&Object.keys(e._attachments)?l.Promise.all(Object.keys(e._attachments).map(function(t){var n=e._attachments[t];if(n.data&&"string"!=typeof n.data){if(h)return new l.Promise(function(e){l.readAsBinaryString(n.data,function(t){n.data=l.btoa(t),e()})});n.data=n.data.toString("base64")}})):l.Promise.resolve()}function i(e,t){if(/http(s?):/.test(e)){var n=l.parseUri(e);n.remote=!0,(n.user||n.password)&&(n.auth={username:n.user,password:n.password});var r=n.path.replace(/(^\/|\/$)/g,"").split("/");if(n.db=r.pop(),n.path=r.join("/"),t=t||{},t=l.clone(t),n.headers=t.headers||t.ajax&&t.ajax.headers||{},t.auth||n.auth){var o=t.auth||n.auth,i=l.btoa(o.username+":"+o.password);n.headers.Authorization="Basic "+i}return t.headers&&(n.headers=t.headers),n}return{host:"",path:"/",db:e,auth:!1}}function s(e,t){return a(e,e.db+"/"+t)}function a(e,t){if(e.remote){var n=e.path?"/":"";return e.protocol+"://"+e.host+":"+e.port+"/"+e.path+n+t}return"/"+t}function c(e,t){function n(e,t){var n=l.extend(!0,l.clone(y),e);return p(n.method+" "+n.url),l.ajax(n,t)}function c(e){return e.split("/").map(encodeURIComponent).join("/")}var _=this;_.getHost=e.getHost?e.getHost:i;var m=_.getHost(e.name,e),g=s(m,"");_.getUrl=function(){return g},_.getHeaders=function(){return l.clone(m.headers)};var y=e.ajax||{};e=l.clone(e);var b=function(){n({headers:m.headers,method:"PUT",url:g},function(e){e&&401===e.status?n({headers:m.headers,method:"HEAD",url:g},function(e){e?t(e):t(null,_)}):e&&412!==e.status?t(e):t(null,_)})};e.skipSetup||n({headers:m.headers,method:"GET",url:g},function(e){e?404===e.status?(l.explain404("PouchDB is just detecting if the remote DB exists."),b()):t(e):t(null,_)}),_.type=function(){return"http"},_.id=l.adapterFun("id",function(e){n({headers:m.headers,method:"GET",url:a(m,"")},function(t,n){var r=n&&n.uuid?n.uuid+m.db:s(m,"");e(null,r)})}),_.request=l.adapterFun("request",function(e,t){e.headers=m.headers,e.url=s(m,e.url),n(e,t)}),_.compact=l.adapterFun("compact",function(e,t){"function"==typeof e&&(t=e,e={}),e=l.clone(e),n({headers:m.headers,url:s(m,"_compact"),method:"POST"},function(){function n(){_.info(function(r,o){o.compact_running?setTimeout(n,e.interval||200):t(null,{ok:!0})})}"function"==typeof t&&n()})}),_._info=function(e){n({headers:m.headers,method:"GET",url:s(m,"")},function(t,n){t?e(t):(n.host=s(m,""),e(null,n))})},_.get=l.adapterFun("get",function(e,t,o){"function"==typeof t&&(o=t,t={}),t=l.clone(t),void 0===t.auto_encode&&(t.auto_encode=!0);var i=[];t.revs&&i.push("revs=true"),t.revs_info&&i.push("revs_info=true"),t.local_seq&&i.push("local_seq=true"),t.open_revs&&("all"!==t.open_revs&&(t.open_revs=JSON.stringify(t.open_revs)),i.push("open_revs="+t.open_revs)),t.attachments&&i.push("attachments=true"),t.rev&&i.push("rev="+t.rev),t.conflicts&&i.push("conflicts="+t.conflicts),i=i.join("&"),i=""===i?"":"?"+i,t.auto_encode&&(e=r(e));var a={headers:m.headers,method:"GET",url:s(m,e+i)},c=t.ajax||{};l.extend(!0,a,c);var u=e.split("/");(u.length>1&&"_design"!==u[0]&&"_local"!==u[0]||u.length>2&&"_design"===u[0]&&"_local"!==u[0])&&(a.binary=!0),n(a,function(e,t,n){return e?o(e):void o(null,t,n)})}),_.remove=l.adapterFun("remove",function(e,t,o,i){var a;"string"==typeof t?(a={_id:e,_rev:t},"function"==typeof o&&(i=o,o={})):(a=e,"function"==typeof t?(i=t,o={}):(i=o,o=t));var c=a._rev||o.rev;n({headers:m.headers,method:"DELETE",url:s(m,r(a._id))+"?rev="+c},i)}),_.getAttachment=l.adapterFun("getAttachment",function(e,t,n,o){"function"==typeof n&&(o=n,n={}),n=l.clone(n),void 0===n.auto_encode&&(n.auto_encode=!0),n.auto_encode&&(e=r(e)),n.auto_encode=!1,_.get(e+"/"+c(t),n,o)}),_.removeAttachment=l.adapterFun("removeAttachment",function(e,t,o,i){var a=s(m,r(e)+"/"+c(t))+"?rev="+o;n({headers:m.headers,method:"DELETE",url:a},i)}),_.putAttachment=l.adapterFun("putAttachment",function(e,t,o,i,a,u){"function"==typeof a&&(u=a,a=i,i=o,o=null),"undefined"==typeof a&&(a=i,i=o,o=null);var f=r(e)+"/"+c(t),p=s(m,f);if(o&&(p+="?rev="+o),"string"==typeof i){var _;try{_=l.atob(i)}catch(g){return u(d.error(d.BAD_ARG,"Attachments need to be base64 encoded"))}i=h?l.createBlob([l.fixBinary(_)],{type:a}):_?new v(_,"binary"):""}var y={headers:l.clone(m.headers),method:"PUT",url:p,processData:!1,body:i,timeout:6e4};y.headers["Content-Type"]=a,n(y,u)}),_.put=l.adapterFun("put",l.getArguments(function(e){var t,i,a,c=e.shift(),u="_id"in c,f=e.pop();return"object"!=typeof c||Array.isArray(c)?f(d.error(d.NOT_AN_OBJECT)):(c=l.clone(c),void o(c).then(function(){for(;;)if(t=e.shift(),i=typeof t,"string"!==i||u?"string"!==i||!u||"_rev"in c?"object"===i&&(a=l.clone(t)):c._rev=t:(c._id=t,u=!0),!e.length)break;a=a||{};var o=l.invalidIdError(c._id);if(o)throw o;var d=[];a&&"undefined"!=typeof a.new_edits&&d.push("new_edits="+a.new_edits),d=d.join("&"),""!==d&&(d="?"+d),n({headers:m.headers,method:"PUT",url:s(m,r(c._id))+d,body:c},function(e,t){return e?f(e):(t.ok=!0,void f(null,t))})})["catch"](f))})),_.post=l.adapterFun("post",function(e,t,n){return"function"==typeof t&&(n=t,t={}),t=l.clone(t),"object"!=typeof e?n(d.error(d.NOT_AN_OBJECT)):("_id"in e||(e._id=l.uuid()),void _.put(e,t,function(e,t){return e?n(e):(t.ok=!0,void n(null,t))}))}),_._bulkDocs=function(e,t,r){"undefined"!=typeof t.new_edits&&(e.new_edits=t.new_edits),l.Promise.all(e.docs.map(o)).then(function(){n({headers:m.headers,method:"POST",url:s(m,"_bulk_docs"),body:e},function(e,t){return e?r(e):(t.forEach(function(e){e.ok=!0}),void r(null,t))})})["catch"](r)},_.allDocs=l.adapterFun("allDocs",function(e,t){"function"==typeof e&&(t=e,e={}),e=l.clone(e);var r,o=[],i="GET";if(e.conflicts&&o.push("conflicts=true"),e.descending&&o.push("descending=true"),e.include_docs&&o.push("include_docs=true"),e.attachments&&o.push("attachments=true"),e.key&&o.push("key="+encodeURIComponent(JSON.stringify(e.key))),e.startkey&&o.push("startkey="+encodeURIComponent(JSON.stringify(e.startkey))),e.endkey&&o.push("endkey="+encodeURIComponent(JSON.stringify(e.endkey))),"undefined"!=typeof e.inclusive_end&&o.push("inclusive_end="+!!e.inclusive_end),"undefined"!=typeof e.limit&&o.push("limit="+e.limit),"undefined"!=typeof e.skip&&o.push("skip="+e.skip),o=o.join("&"),""!==o&&(o="?"+o),"undefined"!=typeof e.keys){var a="keys="+encodeURIComponent(JSON.stringify(e.keys));a.length+o.length+1<=f?o+=(-1!==o.indexOf("?")?"&":"?")+a:(i="POST",r=JSON.stringify({keys:e.keys}))}n({headers:m.headers,method:i,url:s(m,"_all_docs"+o),body:r},t)}),_._changes=function(e){var t="batch_size"in e?e.batch_size:u;e=l.clone(e),e.timeout=e.timeout||3e4;var r={timeout:e.timeout-5e3},o="undefined"!=typeof e.limit?e.limit:!1;0===o&&(o=1);var i;i="returnDocs"in e?e.returnDocs:!0;var a=o;if(e.style&&(r.style=e.style),(e.include_docs||e.filter&&"function"==typeof e.filter)&&(r.include_docs=!0),e.attachments&&(r.attachments=!0),e.continuous&&(r.feed="longpoll"),e.conflicts&&(r.conflicts=!0),e.descending&&(r.descending=!0),e.filter&&"string"==typeof e.filter&&(r.filter=e.filter,"_view"===e.filter&&e.view&&"string"==typeof e.view&&(r.view=e.view)),e.query_params&&"object"==typeof e.query_params)for(var c in e.query_params)e.query_params.hasOwnProperty(c)&&(r[c]=e.query_params[c]);var p,h="GET";if(e.doc_ids){r.filter="_doc_ids";var v=JSON.stringify(e.doc_ids);v.length<f?r.doc_ids=v:(h="POST",p={doc_ids:e.doc_ids})}if(e.continuous&&_._useSSE)return _.sse(e,r,i);var g,y,b=function(i,c){if(!e.aborted){r.since=i,"object"==typeof r.since&&(r.since=JSON.stringify(r.since)),e.descending?o&&(r.limit=a):r.limit=!o||a>t?t:a;var u="?"+Object.keys(r).map(function(e){return e+"="+r[e]}).join("&"),f={headers:m.headers,method:h,url:s(m,"_changes"+u),timeout:e.timeout,body:p};y=i,e.aborted||(g=n(f,c))}},E=10,w=0,S={results:[]},T=function(n,r){if(!e.aborted){var s=0;if(r&&r.results){s=r.results.length,S.last_seq=r.last_seq;var c={};c.query=e.query_params,r.results=r.results.filter(function(t){a--;var n=l.filterChange(e)(t);return n&&(i&&S.results.push(t),l.call(e.onChange,t)),n})}else if(n)return e.aborted=!0,void l.call(e.complete,n);r&&r.last_seq&&(y=r.last_seq);var u=o&&0>=a||r&&t>s||e.descending;if((!e.continuous||o&&0>=a)&&u)l.call(e.complete,null,S);else{n?w+=1:w=0;var f=1<<w,p=E*f,h=e.maximumWait||3e4;if(p>h)return void l.call(e.complete,n||d.error(d.UNKNOWN_ERROR));setTimeout(function(){b(y,T)},p)}}};return b(e.since||0,T),{cancel:function(){e.aborted=!0,g&&g.abort()}}},_.sse=function(e,t,n){function r(t){var r=JSON.parse(t.data);n&&u.results.push(r),u.last_seq=r.seq,l.call(e.onChange,r)}function o(t){return c.removeEventListener("message",r,!1),d===!1?(_._useSSE=!1,void(f=_._changes(e))):(c.close(),void l.call(e.complete,t))}t.feed="eventsource",t.since=e.since||0,t.limit=e.limit,delete t.timeout;var i="?"+Object.keys(t).map(function(e){return e+"="+t[e]}).join("&"),a=s(m,"_changes"+i),c=new EventSource(a),u={results:[],last_seq:!1},f=!1,d=!1;return c.addEventListener("message",r,!1),c.onopen=function(){d=!0},c.onerror=o,{cancel:function(){return f?f.cancel():(c.removeEventListener("message",r,!1),void c.close())}}},_._useSSE=!1,_.revsDiff=l.adapterFun("revsDiff",function(e,t,r){"function"==typeof t&&(r=t,t={}),n({headers:m.headers,method:"POST",url:s(m,"_revs_diff"),body:JSON.stringify(e)},r)}),_._close=function(e){e()},_._destroy=function(t){n({url:s(m,""),method:"DELETE",headers:m.headers},function(n,r){n?(_.emit("error",n),t(n)):(_.emit("destroyed"),_.constructor.emit("destroyed",e.name),t(null,r))})}}var u=25,f=1800,l=e(36),d=e(19),p=e(42)("pouchdb:http"),h="undefined"==typeof n||n.browser,v=e(18);c.valid=function(){return!0},t.exports=c}).call(this,e(41))},{18:18,19:19,36:36,41:41,42:42}],3:[function(e,t,n){"use strict";function r(e,t,n,r,o){try{if(e&&t)return o?IDBKeyRange.bound(t,e,!n,!1):IDBKeyRange.bound(e,t,!1,!n);if(e)return o?IDBKeyRange.upperBound(e):IDBKeyRange.lowerBound(e);if(t)return o?IDBKeyRange.lowerBound(t,!n):IDBKeyRange.upperBound(t,!n);if(r)return IDBKeyRange.only(r)}catch(i){return{error:i}}return null}function o(e,t,n,r){return"DataError"===n.name&&0===n.code?r(null,{total_rows:e._meta.docCount,offset:t.skip,rows:[]}):void r(a.error(a.IDB_ERROR,n.name,n.message))}function i(e,t,n,i){function a(e,i){function a(t,n,r){var o=t.id+"::"+r;L.get(o).onsuccess=function(r){n.doc=p(r.target.result),e.conflicts&&(n.doc._conflicts=s.collectConflicts(t)),v(n.doc,e,R)}}function c(t,n,r){var o={id:r.id,key:r.id,value:{rev:n}},i=r.deleted;if("ok"===e.deleted)N.push(o),i?(o.value.deleted=!0,o.doc=null):e.include_docs&&a(r,o,n);else if(!i&&S--<=0&&(N.push(o),e.include_docs&&a(r,o,n),0===--T))return;t["continue"]()}function u(e){j=t._meta.docCount;var n=e.target.result;if(n){var r=h(n.value),o=r.winningRev;c(n,o,r)}}function g(){i(null,{total_rows:j,offset:e.skip,rows:N})}function y(){e.attachments?_(N).then(g):g()}var b="startkey"in e?e.startkey:!1,E="endkey"in e?e.endkey:!1,w="key"in e?e.key:!1,S=e.skip||0,T="number"==typeof e.limit?e.limit:-1,A=e.inclusive_end!==!1,x="descending"in e&&e.descending?"prev":null,O=r(b,E,A,w,x);if(O&&O.error)return o(t,e,O.error,i);var k=[d,l];e.attachments&&k.push(f);var q=m(n,k,"readonly");if(q.error)return i(q.error);var R=q.txn,C=R.objectStore(d),D=R.objectStore(l),I=x?C.openCursor(O,x):C.openCursor(O),L=D.index("_doc_id_rev"),N=[],j=0;R.oncomplete=y,I.onsuccess=u}function c(e,n){return 0===e.limit?n(null,{total_rows:t._meta.docCount,offset:e.skip,rows:[]}):void a(e,n)}c(e,i)}var s=e(31),a=e(19),c=e(7),u=e(6),f=u.ATTACH_STORE,l=u.BY_SEQ_STORE,d=u.DOC_STORE,p=c.decodeDoc,h=c.decodeMetadata,v=c.fetchAttachmentsIfNecessary,_=c.postProcessAttachments,m=c.openTransactionSafely;t.exports=i},{19:19,31:31,6:6,7:7}],4:[function(e,t,n){"use strict";function r(e,t){return new o.Promise(function(n,r){var i=o.createBlob([""],{type:"image/png"});e.objectStore(s).put(i,"key"),e.oncomplete=function(){var e=t.transaction([s],"readwrite"),i=e.objectStore(s).get("key");i.onerror=r,i.onsuccess=function(e){var t=e.target.result,r=URL.createObjectURL(t);o.ajax({url:r,cache:!0,binary:!0},function(e,t){e&&405===e.status?n(!0):(n(!(!t||"image/png"!==t.type)),e&&404===e.status&&o.explain404("PouchDB is just detecting blob URL support.")),URL.revokeObjectURL(r)})}}})["catch"](function(){return!1})}var o=e(36),i=e(6),s=i.DETECT_BLOB_SUPPORT_STORE;t.exports=r},{36:36,6:6}],5:[function(e,t,n){"use strict";function r(e,t,n,r,s,a){function y(){var e=[l,f,u,p,d,c],t=g(r,e,"readwrite");return t.error?a(t.error):(C=t.txn,C.onerror=m(a),C.ontimeout=m(a),C.oncomplete=w,D=C.objectStore(l),I=C.objectStore(f),L=C.objectStore(u),N=C.objectStore(c),void T(function(e){return e?(V=!0,a(e)):void E()}))}function b(){o.processDocs(B,n,J,C,H,A,t)}function E(){function e(){++n===B.length&&b()}function t(t){var n=v(t.target.result);n&&J.set(n.id,n),e()}if(B.length)for(var n=0,r=0,i=B.length;i>r;r++){var s=B[r];if(s._id&&o.isLocalId(s._id))e();else{var a=D.get(s.metadata.id);a.onsuccess=t}}}function w(){V||(s.notify(n._meta.name),n._meta.docCount+=F,a(null,H))}function S(e,t){var n=L.get(e);n.onsuccess=function(n){if(n.target.result)t();else{var r=i.error(i.MISSING_STUB,"unknown stub attachment with digest "+e);r.status=412,t(r)}}}function T(e){function t(){++o===n.length&&e(r)}var n=[];if(B.forEach(function(e){e.data&&e.data._attachments&&Object.keys(e.data._attachments).forEach(function(t){var r=e.data._attachments[t];r.stub&&n.push(r.digest)})}),!n.length)return e();var r,o=0;n.forEach(function(e){S(e,function(e){e&&!r&&(r=e),t()})})}function A(e,t,n,r,o,i,s,a){F+=i;var c=e.data;c._id=e.metadata.id,c._rev=e.metadata.rev,r&&(c._deleted=!0);var u=c._attachments&&Object.keys(c._attachments).length;return u?k(e,t,n,o,s,a):void O(e,t,n,o,s,a)}function x(e){var t=o.compactTree(e.metadata);h(t,e.metadata.id,C)}function O(e,t,r,o,i,s){function a(i){o&&n.auto_compaction&&x(e),l.seq=i.target.result,delete l.rev;var s=_(l,t,r),a=D.put(s);a.onsuccess=u}function c(e){e.preventDefault(),e.stopPropagation();var t=I.index("_doc_id_rev"),n=t.getKey(f._doc_id_rev);n.onsuccess=function(e){var t=I.put(f,e.target.result);t.onsuccess=a}}function u(){H[i]={ok:!0,id:l.id,rev:t},J.set(e.metadata.id,e.metadata),q(e,l.seq,s)}var f=e.data,l=e.metadata;f._doc_id_rev=l.id+"::"+l.rev,delete f._id,delete f._rev;var d=I.put(f);d.onsuccess=a,d.onerror=c}function k(e,t,n,r,o,i){function s(){u===f.length&&O(e,t,n,r,o,i)}function a(){u++,s()}var c=e.data,u=0,f=Object.keys(c._attachments);f.forEach(function(t){var n=e.data._attachments[t];if(n.stub)u++,s();else{var r=n.data;delete n.data;var o=n.digest;R(o,r,a)}})}function q(e,t,n){function r(){++i===s.length&&n()}function o(n){var o=e.data._attachments[n].digest,i=N.put({seq:t,digestSeq:o+"::"+t});i.onsuccess=r,i.onerror=function(e){e.preventDefault(),e.stopPropagation(),r()}}var i=0,s=Object.keys(e.data._attachments||{});if(!s.length)return n();for(var a=0;a<s.length;a++)o(s[a])}function R(e,t,n){var r=L.count(e);r.onsuccess=function(r){var o=r.target.result;if(o)return n();var i={digest:e,body:t},s=L.put(i);s.onsuccess=n}}for(var C,D,I,L,N,j,B=e.docs,F=0,M=0,P=B.length;P>M;M++){var U=B[M];U._id&&o.isLocalId(U._id)||(U=B[M]=o.parseDoc(U,t.new_edits),U.error&&!j&&(j=U))}if(j)return a(j);var H=new Array(B.length),J=new o.Map,V=!1,G=n._meta.blobSupport?"blob":"base64";o.preprocessAttachments(B,G,function(e){return e?a(e):void y()})}var o=e(36),i=e(19),s=e(7),a=e(6),c=a.ATTACH_AND_SEQ_STORE,u=a.ATTACH_STORE,f=a.BY_SEQ_STORE,l=a.DOC_STORE,d=a.LOCAL_STORE,p=a.META_STORE,h=s.compactRevs,v=s.decodeMetadata,_=s.encodeMetadata,m=s.idbError,g=s.openTransactionSafely;t.exports=r},{19:19,36:36,6:6,7:7}],6:[function(e,t,n){"use strict";n.ADAPTER_VERSION=5,n.DOC_STORE="document-store",n.BY_SEQ_STORE="by-sequence",n.ATTACH_STORE="attach-store",n.ATTACH_AND_SEQ_STORE="attach-seq-store",n.META_STORE="meta-store",n.LOCAL_STORE="local-store",n.DETECT_BLOB_SUPPORT_STORE="detect-blob-support"},{}],7:[function(e,t,n){(function(t){"use strict";function r(e,t,n){try{e.apply(t,n)}catch(r){"undefined"!=typeof PouchDB&&PouchDB.emit("error",r)}}var o=e(19),i=e(36),s=e(6);n.taskQueue={running:!1,queue:[]},n.applyNext=function(){if(!n.taskQueue.running&&n.taskQueue.queue.length){n.taskQueue.running=!0;var e=n.taskQueue.queue.shift();e.action(function(o,i){r(e.callback,this,[o,i]),n.taskQueue.running=!1,t.nextTick(n.applyNext)})}},n.idbError=function(e){return function(t){var n=t.target&&t.target.error&&t.target.error.name||t.target;e(o.error(o.IDB_ERROR,n,t.type))}},n.encodeMetadata=function(e,t,n){return{data:i.safeJsonStringify(e),winningRev:t,deletedOrLocal:n?"1":"0",seq:e.seq,id:e.id}},n.decodeMetadata=function(e){if(!e)return null;var t=i.safeJsonParse(e.data);return t.winningRev=e.winningRev,t.deleted="1"===e.deletedOrLocal,t.seq=e.seq,t},n.decodeDoc=function(e){if(!e)return e;var t=i.lastIndexOf(e._doc_id_rev,":");return e._id=e._doc_id_rev.substring(0,t-1),e._rev=e._doc_id_rev.substring(t+1),delete e._doc_id_rev,e},n.readBlobData=function(e,t,n,r){n?e?"string"!=typeof e?i.readAsBinaryString(e,function(e){r(i.btoa(e))}):r(e):r(""):e?"string"!=typeof e?r(e):(e=i.fixBinary(atob(e)),r(i.createBlob([e],{type:t}))):r(i.createBlob([""],{type:t}))},n.fetchAttachmentsIfNecessary=function(e,t,n,r){function o(){++c===a.length&&r&&r()}function i(e,t){var r=e._attachments[t],i=r.digest,a=n.objectStore(s.ATTACH_STORE).get(i);a.onsuccess=function(e){r.body=e.target.result.body,o()}}var a=Object.keys(e._attachments||{});if(!a.length)return r&&r();var c=0;a.forEach(function(n){t.attachments&&t.include_docs?i(e,n):(e._attachments[n].stub=!0,o())})},n.postProcessAttachments=function(e){return i.Promise.all(e.map(function(e){if(e.doc&&e.doc._attachments){var t=Object.keys(e.doc._attachments);return i.Promise.all(t.map(function(t){var r=e.doc._attachments[t];if("body"in r){var o=r.body,s=r.content_type;return new i.Promise(function(a){n.readBlobData(o,s,!0,function(n){e.doc._attachments[t]=i.extend(i.pick(r,["digest","content_type"]),{data:n}),a()})})}}))}}))},n.compactRevs=function(e,t,n){function r(){f--,f||o()}function o(){i.length&&i.forEach(function(e){var t=u.index("digestSeq").count(IDBKeyRange.bound(e+"::",e+"::￿",!1,!1));t.onsuccess=function(t){var n=t.target.result;n||c["delete"](e)}})}var i=[],a=n.objectStore(s.BY_SEQ_STORE),c=n.objectStore(s.ATTACH_STORE),u=n.objectStore(s.ATTACH_AND_SEQ_STORE),f=e.length;e.forEach(function(e){var n=a.index("_doc_id_rev"),o=t+"::"+e;n.getKey(o).onsuccess=function(e){var t=e.target.result;if("number"!=typeof t)return r();a["delete"](t);var n=u.index("seq").openCursor(IDBKeyRange.only(t));n.onsuccess=function(e){var t=e.target.result;if(t){var n=t.value.digestSeq.split("::")[0];i.push(n),u["delete"](t.primaryKey),t["continue"]()}else r()}}})},n.openTransactionSafely=function(e,t,n){try{return{txn:e.transaction(t,n)}}catch(r){return{error:r}}}}).call(this,e(41))},{19:19,36:36,41:41,6:6}],8:[function(e,t,n){(function(n){"use strict";function r(e,t){var n=this;C.queue.push({action:function(t){o(n,e,t)},callback:t}),w()}function o(e,t,o){function u(e){var t=e.createObjectStore(y,{keyPath:"id"});e.createObjectStore(m,{autoIncrement:!0}).createIndex("_doc_id_rev","_doc_id_rev",{unique:!0}),e.createObjectStore(_,{keyPath:"digest"}),e.createObjectStore(E,{keyPath:"id",autoIncrement:!1}),e.createObjectStore(g),t.createIndex("deletedOrLocal","deletedOrLocal",{unique:!1}),e.createObjectStore(b,{keyPath:"_id"});var n=e.createObjectStore(v,{autoIncrement:!0});n.createIndex("seq","seq"),n.createIndex("digestSeq","digestSeq",{unique:!0})}function f(e,t){var n=e.objectStore(y);n.createIndex("deletedOrLocal","deletedOrLocal",{unique:!1}),n.openCursor().onsuccess=function(e){var r=e.target.result;if(r){var o=r.value,i=s.isDeleted(o);o.deletedOrLocal=i?"1":"0",n.put(o),r["continue"]()}else t()}}function w(e){e.createObjectStore(b,{keyPath:"_id"}).createIndex("_doc_id_rev","_doc_id_rev",{unique:!0})}function C(e,t){var n=e.objectStore(b),r=e.objectStore(y),o=e.objectStore(m),i=r.openCursor();i.onsuccess=function(e){var i=e.target.result;if(i){var c=i.value,u=c.id,f=s.isLocalId(u),l=a.winningRev(c);if(f){var d=u+"::"+l,p=u+"::",h=u+"::~",v=o.index("_doc_id_rev"),_=IDBKeyRange.bound(p,h,!1,!1),m=v.openCursor(_);m.onsuccess=function(e){if(m=e.target.result){var t=m.value;t._doc_id_rev===d&&n.put(t),o["delete"](m.primaryKey),m["continue"]()}else r["delete"](i.primaryKey),i["continue"]()}}else i["continue"]()}else t&&t()}}function L(e){var t=e.createObjectStore(v,{autoIncrement:!0});t.createIndex("seq","seq"),t.createIndex("digestSeq","digestSeq",{unique:!0})}function N(e,t){var n=e.objectStore(m),r=e.objectStore(_),o=e.objectStore(v),i=r.count();i.onsuccess=function(e){var r=e.target.result;return r?void(n.openCursor().onsuccess=function(e){var n=e.target.result;if(!n)return t();for(var r=n.value,i=n.primaryKey,s=Object.keys(r._attachments||{}),a={},c=0;c<s.length;c++){var u=r._attachments[s[c]];a[u.digest]=!0}var f=Object.keys(a);for(c=0;c<f.length;c++){var l=f[c];o.put({seq:i,digestSeq:l+"::"+i})}n["continue"]()}):t()}}function j(e){function t(e){return e.data?A(e):(e.deleted="1"===e.deletedOrLocal,e)}var n=e.objectStore(m),r=e.objectStore(y),o=r.openCursor();o.onsuccess=function(e){function o(){var e=c.id+"::",t=c.id+"::￿",r=n.index("_doc_id_rev").openCursor(IDBKeyRange.bound(e,t)),o=0;
r.onsuccess=function(e){var t=e.target.result;if(!t)return c.seq=o,i();var n=t.primaryKey;n>o&&(o=n),t["continue"]()}}function i(){var e=x(c,c.winningRev,c.deleted),t=r.put(e);t.onsuccess=function(){s["continue"]()}}var s=e.target.result;if(s){var c=t(s.value);return c.winningRev=c.winningRev||a.winningRev(c),c.seq?i():void o()}}}var B=t.name,F=null;e._meta=null,e.type=function(){return"idb"},e._id=s.toPromise(function(t){t(null,e._meta.instanceId)}),e._bulkDocs=function(t,n,o){l(t,n,e,F,r.Changes,o)},e._get=function(e,t,n){function r(){n(a,{doc:o,metadata:i,ctx:u})}var o,i,a,u;if(t=s.clone(t),t.ctx)u=t.ctx;else{var f=D(F,[y,m,_],"readonly");if(f.error)return n(f.error);u=f.txn}u.objectStore(y).get(e).onsuccess=function(e){if(i=A(e.target.result),!i)return a=c.error(c.MISSING_DOC,"missing"),r();if(s.isDeleted(i)&&!t.rev)return a=c.error(c.MISSING_DOC,"deleted"),r();var n=u.objectStore(m),f=t.rev||i.winningRev,l=i.id+"::"+f;n.index("_doc_id_rev").get(l).onsuccess=function(e){return o=e.target.result,o&&(o=T(o)),o?void r():(a=c.error(c.MISSING_DOC,"missing"),r())}}},e._getAttachment=function(e,t,n){var r;if(t=s.clone(t),t.ctx)r=t.ctx;else{var o=D(F,[y,m,_],"readonly");if(o.error)return n(o.error);r=o.txn}var i=e.digest,a=e.content_type;r.objectStore(_).get(i).onsuccess=function(e){var r=e.target.result.body;R(r,a,t.encode,function(e){n(null,e)})}},e._info=function(t){if(null===F||!I[B]){var n=new Error("db isn't open");return n.id="idbNull",t(n)}var r,o,i=D(F,[m],"readonly");if(i.error)return t(i.error);var s=i.txn,a=s.objectStore(m).openCursor(null,"prev");a.onsuccess=function(t){var n=t.target.result;r=n?n.key:0,o=e._meta.docCount},s.oncomplete=function(){t(null,{doc_count:o,update_seq:r,idb_attachment_format:e._meta.blobSupport?"binary":"base64"})}},e._allDocs=function(t,n){d(t,e,F,n)},e._changes=function(t){function n(e){function n(){return a.seq!==s?e["continue"]():(l=s,a.winningRev===i._rev?o(i):void r())}function r(){var e=i._id+"::"+a.winningRev,t=v.index("_doc_id_rev").openCursor(IDBKeyRange.bound(e,e+"￿"));t.onsuccess=function(e){o(T(e.target.result.value))}}function o(n){var r=t.processChange(n,a,t);r.seq=a.seq,w(r)&&(E++,p&&b.push(r),t.attachments&&t.include_docs?O(n,t,h,function(){q([r]).then(function(){t.onChange(r)})}):t.onChange(r)),E!==d&&e["continue"]()}var i=T(e.value),s=e.key;if(u&&!u.has(i._id))return e["continue"]();var a;return(a=S.get(i._id))?n():void(g.get(i._id).onsuccess=function(e){a=A(e.target.result),S.set(i._id,a),n()})}function o(e){var t=e.target.result;t&&n(t)}function i(){var e=[y,m];t.attachments&&e.push(_);var n=D(F,e,"readonly");if(n.error)return t.complete(n.error);h=n.txn,h.onerror=k(t.complete),h.oncomplete=a,v=h.objectStore(m),g=h.objectStore(y);var r;r=f?v.openCursor(null,f):v.openCursor(IDBKeyRange.lowerBound(t.since,!0)),r.onsuccess=o}function a(){function e(){t.complete(null,{results:b,last_seq:l})}!t.continuous&&t.attachments?q(b).then(e):e()}if(t=s.clone(t),t.continuous){var c=B+":"+s.uuid();return r.Changes.addListener(B,c,e,t),r.Changes.notify(B),{cancel:function(){r.Changes.removeListener(B,c)}}}var u=t.doc_ids&&new s.Set(t.doc_ids),f=t.descending?"prev":null;t.since=t.since||0;var l=t.since,d="limit"in t?t.limit:-1;0===d&&(d=1);var p;p="returnDocs"in t?t.returnDocs:!0;var h,v,g,b=[],E=0,w=s.filterChange(t),S=new s.Map;i()},e._close=function(e){return null===F?e(c.error(c.NOT_OPEN)):(F.close(),delete I[B],F=null,void e())},e._getRevisionTree=function(e,t){var n=D(F,[y],"readonly");if(n.error)return t(n.error);var r=n.txn,o=r.objectStore(y).get(e);o.onsuccess=function(e){var n=A(e.target.result);n?t(null,n.rev_tree):t(c.error(c.MISSING_DOC))}},e._doCompaction=function(e,t,n){var r=[y,m,_,v],o=D(F,r,"readwrite");if(o.error)return n(o.error);var i=o.txn,c=i.objectStore(y);c.get(e).onsuccess=function(n){var r=A(n.target.result);a.traverseRevTree(r.rev_tree,function(e,n,r,o,i){var s=n+"-"+r;-1!==t.indexOf(s)&&(i.status="missing")}),S(t,e,i);var o=r.winningRev,s=r.deleted;i.objectStore(y).put(x(r,o,s))},i.onerror=k(n),i.oncomplete=function(){s.call(n)}},e._getLocal=function(e,t){var n=D(F,[b],"readonly");if(n.error)return t(n.error);var r=n.txn,o=r.objectStore(b).get(e);o.onerror=k(t),o.onsuccess=function(e){var n=e.target.result;n?(delete n._doc_id_rev,t(null,n)):t(c.error(c.MISSING_DOC))}},e._putLocal=function(e,t,n){"function"==typeof t&&(n=t,t={}),delete e._revisions;var r=e._rev,o=e._id;r?e._rev="0-"+(parseInt(r.split("-")[1],10)+1):e._rev="0-1";var i,s=t.ctx;if(!s){var a=D(F,[b],"readwrite");if(a.error)return n(a.error);s=a.txn,s.onerror=k(n),s.oncomplete=function(){i&&n(null,i)}}var u,f=s.objectStore(b);r?(u=f.get(o),u.onsuccess=function(o){var s=o.target.result;if(s&&s._rev===r){var a=f.put(e);a.onsuccess=function(){i={ok:!0,id:e._id,rev:e._rev},t.ctx&&n(null,i)}}else n(c.error(c.REV_CONFLICT))}):(u=f.add(e),u.onerror=function(e){n(c.error(c.REV_CONFLICT)),e.preventDefault(),e.stopPropagation()},u.onsuccess=function(){i={ok:!0,id:e._id,rev:e._rev},t.ctx&&n(null,i)})},e._removeLocal=function(e,t){var n=D(F,[b],"readwrite");if(n.error)return t(n.error);var r,o=n.txn;o.oncomplete=function(){r&&t(null,r)};var i=e._id,s=o.objectStore(b),a=s.get(i);a.onerror=k(t),a.onsuccess=function(n){var o=n.target.result;o&&o._rev===e._rev?(s["delete"](i),r={ok:!0,id:i,rev:"0-0"}):t(c.error(c.MISSING_DOC))}},e._destroy=function(e){r.Changes.removeAllListeners(B),r.openReqList[B]&&r.openReqList[B].result&&(r.openReqList[B].result.close(),delete I[B]);var t=indexedDB.deleteDatabase(B);t.onsuccess=function(){r.openReqList[B]&&(r.openReqList[B]=null),s.hasLocalStorage()&&B in localStorage&&delete localStorage[B],e(null,{ok:!0})},t.onerror=k(e)};var M=I[B];if(M)return F=M.idb,e._meta=M.global,void n.nextTick(function(){o(null,e)});var P=indexedDB.open(B,h);"openReqList"in r||(r.openReqList={}),r.openReqList[B]=P,P.onupgradeneeded=function(e){function t(){var e=o[i-1];i++,e&&e(r,t)}var n=e.target.result;if(e.oldVersion<1)return u(n);var r=e.currentTarget.transaction;e.oldVersion<3&&w(n),e.oldVersion<4&&L(n);var o=[f,C,N,j],i=e.oldVersion;t()},P.onsuccess=function(t){F=t.target.result,F.onversionchange=function(){F.close(),delete I[B]},F.onabort=function(){F.close(),delete I[B]};var n=F.transaction([E,g,y],"readwrite"),r=n.objectStore(E).get(E),a=null,c=null,u=null;r.onsuccess=function(t){var r=function(){null!==a&&null!==c&&null!==u&&(e._meta={name:B,instanceId:u,blobSupport:a,docCount:c},I[B]={idb:F,global:e._meta},o(null,e))},f=t.target.result||{id:E};B+"_id"in f?(u=f[B+"_id"],r()):(u=s.uuid(),f[B+"_id"]=u,n.objectStore(E).put(f).onsuccess=function(){r()}),i||(i=p(n,F)),i.then(function(e){a=e,r()});var l=n.objectStore(y).index("deletedOrLocal");l.count(IDBKeyRange.only("0")).onsuccess=function(e){c=e.target.result,r()}}},P.onerror=k(o)}var i,s=e(36),a=e(31),c=e(19),u=e(7),f=e(6),l=e(5),d=e(3),p=e(4),h=f.ADAPTER_VERSION,v=f.ATTACH_AND_SEQ_STORE,_=f.ATTACH_STORE,m=f.BY_SEQ_STORE,g=f.DETECT_BLOB_SUPPORT_STORE,y=f.DOC_STORE,b=f.LOCAL_STORE,E=f.META_STORE,w=u.applyNext,S=u.compactRevs,T=u.decodeDoc,A=u.decodeMetadata,x=u.encodeMetadata,O=u.fetchAttachmentsIfNecessary,k=u.idbError,q=u.postProcessAttachments,R=u.readBlobData,C=u.taskQueue,D=u.openTransactionSafely,I={};r.valid=function(){var e="undefined"!=typeof openDatabase&&/(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)&&!/BlackBerry/.test(navigator.platform);return!e&&"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange},r.Changes=new s.Changes,t.exports=r}).call(this,e(41))},{19:19,3:3,31:31,36:36,4:4,41:41,5:5,6:6,7:7}],9:[function(e,t,n){"use strict";function r(e,t,n,r,a,_){function m(){return q?_(q):(a.notify(n._name),n._docCount=-1,void _(null,R))}function g(e,t){var n="SELECT count(*) as cnt FROM "+f+" WHERE digest=?";k.executeSql(n,[e],function(n,r){if(0===r.rows.item(0).cnt){var o=i.error(i.MISSING_STUB,"unknown stub attachment with digest "+e);t(o)}else t()})}function y(e){function t(){++o===n.length&&e(r)}var n=[];if(x.forEach(function(e){e.data&&e.data._attachments&&Object.keys(e.data._attachments).forEach(function(t){var r=e.data._attachments[t];r.stub&&n.push(r.digest)})}),!n.length)return e();var r,o=0;n.forEach(function(e){g(e,function(e){e&&!r&&(r=e),t()})})}function b(e,t,r,i,s,a,f,v){function _(){function t(e,t){function r(){return++i===s.length&&t(),!1}function o(t){var o="INSERT INTO "+l+" (digest, seq) VALUES (?,?)",i=[n._attachments[t].digest,e];k.executeSql(o,i,r,r)}var i=0,s=Object.keys(n._attachments||{});if(!s.length)return t();for(var a=0;a<s.length;a++)o(s[a])}var n=e.data,r=i?1:0,o=n._id,s=n._rev,a=p(n),c="INSERT INTO "+u+" (doc_id, rev, json, deleted) VALUES (?, ?, ?, ?);",f=[o,s,a,r];k.executeSql(c,f,function(e,n){var r=n.insertId;t(r,function(){b(e,r)})},function(){var e=d("seq",u,null,"doc_id=? AND rev=?");return k.executeSql(e,[o,s],function(e,n){var i=n.rows.item(0).seq,c="UPDATE "+u+" SET json=?, deleted=? WHERE doc_id=? AND rev=?;",f=[a,r,o,s];e.executeSql(c,f,function(e){t(i,function(){b(e,i)})})}),!1})}function m(e){E||(e?(E=e,v(E)):w===T.length&&_())}function g(e){w++,m(e)}function y(){if(s&&n.auto_compaction){var t=e.metadata.id,r=o.compactTree(e.metadata);h(r,t,k)}}function b(n,r){y(),e.metadata.seq=r,delete e.metadata.rev;var i=s?"UPDATE "+c+" SET json=?, max_seq=?, winningseq=(SELECT seq FROM "+u+" WHERE doc_id="+c+".id AND rev=?) WHERE id=?":"INSERT INTO "+c+" (id, winningseq, max_seq, json) VALUES (?,?,?,?);",a=o.safeJsonStringify(e.metadata),l=e.metadata.id,d=s?[a,r,t,l]:[l,r,r,a];n.executeSql(i,d,function(){R[f]={ok:!0,id:e.metadata.id,rev:t},C.set(l,e.metadata),v()})}var E=null,w=0;e.data._id=e.metadata.id,e.data._rev=e.metadata.rev;var T=Object.keys(e.data._attachments||{});i&&(e.data._deleted=!0),T.forEach(function(t){var n=e.data._attachments[t];if(n.stub)w++,m();else{var r=n.data;delete n.data;var o=n.digest;S(o,r,g)}}),T.length||_()}function E(){o.processDocs(x,n,C,k,R,b,t)}function w(e){function t(){++n===x.length&&e()}if(!x.length)return e();var n=0;x.forEach(function(e){if(e._id&&o.isLocalId(e._id))return t();var n=e.metadata.id;k.executeSql("SELECT json FROM "+c+" WHERE id = ?",[n],function(e,r){if(r.rows.length){var i=o.safeJsonParse(r.rows.item(0).json);C.set(n,i)}t()})})}function S(e,t,n){var r="SELECT digest FROM "+f+" WHERE digest=?";k.executeSql(r,[e],function(o,i){return i.rows.length?n():(r="INSERT INTO "+f+" (digest, body, escaped) VALUES (?,?,1)",void o.executeSql(r,[e,s.escapeBlob(t)],function(){n()},function(){return n(),!1}))})}var T=t.new_edits,A=e.docs,x=A.map(function(e){if(e._id&&o.isLocalId(e._id))return e;var t=o.parseDoc(e,T);return t}),O=x.filter(function(e){return e.error});if(O.length)return _(O[0]);var k,q,R=new Array(x.length),C=new o.Map;o.preprocessAttachments(x,"binary",function(e){return e?_(e):void r.transaction(function(e){k=e,y(function(e){e?q=e:w(E)})},v(_),m)})}var o=e(36),i=e(19),s=e(11),a=e(10),c=a.DOC_STORE,u=a.BY_SEQ_STORE,f=a.ATTACH_STORE,l=a.ATTACH_AND_SEQ_STORE,d=s.select,p=s.stringifyDoc,h=s.compactRevs,v=s.unknownError;t.exports=r},{10:10,11:11,19:19,36:36}],10:[function(e,t,n){"use strict";function r(e){return"'"+e+"'"}n.ADAPTER_VERSION=7,n.DOC_STORE=r("document-store"),n.BY_SEQ_STORE=r("by-sequence"),n.ATTACH_STORE=r("attach-store"),n.LOCAL_STORE=r("local-store"),n.META_STORE=r("metadata-store"),n.ATTACH_AND_SEQ_STORE=r("attach-seq-store")},{}],11:[function(e,t,n){"use strict";function r(e){return e.replace(/\u0002/g,"").replace(/\u0001/g,"").replace(/\u0000/g,"")}function o(e){return e.replace(/\u0001\u0001/g,"\x00").replace(/\u0001\u0002/g,"").replace(/\u0002\u0002/g,"")}function i(e){return delete e._id,delete e._rev,JSON.stringify(e)}function s(e,t,n){return e=JSON.parse(e),e._id=t,e._rev=n,e}function a(e){for(var t="(";e--;)t+="?",e&&(t+=",");return t+")"}function c(e,t,n,r,o){return"SELECT "+e+" FROM "+("string"==typeof t?t:t.join(" JOIN "))+(n?" ON "+n:"")+(r?" WHERE "+("string"==typeof r?r:r.join(" AND ")):"")+(o?" ORDER BY "+o:"")}function u(e,t,n){function r(){++i===e.length&&o()}function o(){if(s.length){var e="SELECT DISTINCT digest AS digest FROM "+b+" WHERE seq IN "+a(s.length);n.executeSql(e,s,function(e,t){for(var n=[],r=0;r<t.rows.length;r++)n.push(t.rows.item(r).digest);if(n.length){var o="DELETE FROM "+b+" WHERE seq IN ("+s.map(function(){return"?"}).join(",")+")";e.executeSql(o,s,function(e){var t="SELECT digest FROM "+b+" WHERE digest IN ("+n.map(function(){return"?"}).join(",")+")";e.executeSql(t,n,function(e,t){for(var r=new v.Set,o=0;o<t.rows.length;o++)r.add(t.rows.item(o).digest);n.forEach(function(t){r.has(t)||(e.executeSql("DELETE FROM "+b+" WHERE digest=?",[t]),e.executeSql("DELETE FROM "+y+" WHERE digest=?",[t]))})})})}})}}if(e.length){var i=0,s=[];e.forEach(function(e){var o="SELECT seq FROM "+g+" WHERE doc_id=? AND rev=?";n.executeSql(o,[t,e],function(e,t){if(!t.rows.length)return r();var n=t.rows.item(0).seq;s.push(n),e.executeSql("DELETE FROM "+g+" WHERE seq=?",[n],r)})})}}function f(e){return function(t){var n=t&&t.constructor.toString().match(/function ([^\(]+)/),r=n&&n[1]||t.type,o=t.target||t.message;e(_.error(_.WSQ_ERROR,o,r))}}function l(e){if("size"in e)return 1e6*e.size;var t=/Android/.test(window.navigator.userAgent);return t?5e6:1}function d(){return"undefined"!=typeof sqlitePlugin?sqlitePlugin.openDatabase.bind(sqlitePlugin):"undefined"!=typeof openDatabase?function(e){return openDatabase(e.name,e.version,e.description,e.size)}:void 0}function p(e){var t=d(),n=E[e.name];return n||(n=E[e.name]=t(e),n._sqlitePlugin="undefined"!=typeof sqlitePlugin),n}function h(){return"undefined"!=typeof openDatabase||"undefined"!=typeof SQLitePlugin}var v=e(36),_=e(19),m=e(10),g=m.BY_SEQ_STORE,y=m.ATTACH_STORE,b=m.ATTACH_AND_SEQ_STORE,E={};t.exports={escapeBlob:r,unescapeBlob:o,stringifyDoc:i,unstringifyDoc:s,qMarks:a,select:c,compactRevs:u,unknownError:f,getSize:l,openDB:p,valid:h}},{10:10,19:19,36:36}],12:[function(e,t,n){"use strict";function r(e,t,n,r,o){function s(){++u===c.length&&o&&o()}function a(e,t){var o=e._attachments[t],a={encode:!0,ctx:r};n._getAttachment(o,a,function(n,r){e._attachments[t]=i.extend(i.pick(o,["digest","content_type"]),{data:r}),s()})}var c=Object.keys(e._attachments||{});if(!c.length)return o&&o();var u=0;c.forEach(function(n){t.attachments&&t.include_docs?a(e,n):(e._attachments[n].stub=!0,s())})}function o(e,t){function n(){i.hasLocalStorage()&&(window.localStorage["_pouch__websqldb_"+K._name]=!0),t(null,K)}function u(e,t){e.executeSql(R),e.executeSql("ALTER TABLE "+h+" ADD COLUMN deleted TINYINT(1) DEFAULT 0",[],function(){e.executeSql(k),e.executeSql("ALTER TABLE "+p+" ADD COLUMN local TINYINT(1) DEFAULT 0",[],function(){e.executeSql("CREATE INDEX IF NOT EXISTS 'doc-store-local-idx' ON "+p+" (local, id)");var n="SELECT "+p+".winningseq AS seq, "+p+".json AS metadata FROM "+h+" JOIN "+p+" ON "+h+".seq = "+p+".winningseq";e.executeSql(n,[],function(e,n){for(var r=[],o=[],s=0;s<n.rows.length;s++){var a=n.rows.item(s),c=a.seq,u=JSON.parse(a.metadata);i.isDeleted(u)&&r.push(c),i.isLocalId(u.id)&&o.push(u.id)}e.executeSql("UPDATE "+p+"SET local = 1 WHERE id IN "+y(o.length),o,function(){e.executeSql("UPDATE "+h+" SET deleted = 1 WHERE seq IN "+y(r.length),r,t)})})})})}function N(e,t){var n="CREATE TABLE IF NOT EXISTS "+_+" (id UNIQUE, rev, json)";e.executeSql(n,[],function(){var n="SELECT "+p+".id AS id, "+h+".json AS data FROM "+h+" JOIN "+p+" ON "+h+".seq = "+p+".winningseq WHERE local = 1";e.executeSql(n,[],function(e,n){function r(){if(!o.length)return t(e);var n=o.shift(),i=JSON.parse(n.data)._rev;e.executeSql("INSERT INTO "+_+" (id, rev, json) VALUES (?,?,?)",[n.id,i,n.data],function(e){e.executeSql("DELETE FROM "+p+" WHERE id=?",[n.id],function(e){e.executeSql("DELETE FROM "+h+" WHERE seq=?",[n.seq],function(){r()})})})}for(var o=[],i=0;i<n.rows.length;i++)o.push(n.rows.item(i));r()})})}function j(e,t){function n(n){function r(){if(!n.length)return t(e);var o=n.shift(),i=c(o.hex,W),s=i.lastIndexOf("::"),a=i.substring(0,s),u=i.substring(s+2),f="UPDATE "+h+" SET doc_id=?, rev=? WHERE doc_id_rev=?";e.executeSql(f,[a,u,i],function(){r()})}r()}var r="ALTER TABLE "+h+" ADD COLUMN doc_id";e.executeSql(r,[],function(e){var t="ALTER TABLE "+h+" ADD COLUMN rev";e.executeSql(t,[],function(e){e.executeSql(q,[],function(e){var t="SELECT hex(doc_id_rev) as hex FROM "+h;e.executeSql(t,[],function(e,t){for(var r=[],o=0;o<t.rows.length;o++)r.push(t.rows.item(o));n(r)})})})})}function B(e,t){function n(e){var n="SELECT COUNT(*) AS cnt FROM "+v;e.executeSql(n,[],function(e,n){function r(){var n=w(L+", "+p+".id AS id",[p,h],I,null,p+".id ");n+=" LIMIT "+s+" OFFSET "+i,i+=s,e.executeSql(n,[],function(e,n){function o(e,t){var n=i[e]=i[e]||[];-1===n.indexOf(t)&&n.push(t)}if(!n.rows.length)return t(e);for(var i={},s=0;s<n.rows.length;s++)for(var a=n.rows.item(s),c=E(a.data,a.id,a.rev),u=Object.keys(c._attachments||{}),f=0;f<u.length;f++){var l=c._attachments[u[f]];o(l.digest,a.seq)}var d=[];if(Object.keys(i).forEach(function(e){var t=i[e];t.forEach(function(t){d.push([e,t])})}),!d.length)return r();var p=0;d.forEach(function(t){var n="INSERT INTO "+g+" (digest, seq) VALUES (?,?)";e.executeSql(n,t,function(){++p===d.length&&r()})})})}var o=n.rows.item(0).cnt;if(!o)return t(e);var i=0,s=10;r()})}var r="CREATE TABLE IF NOT EXISTS "+g+" (digest, seq INTEGER)";e.executeSql(r,[],function(e){e.executeSql(D,[],function(e){e.executeSql(C,[],n)})})}function F(e,t){var n="ALTER TABLE "+v+" ADD COLUMN escaped TINYINT(1) DEFAULT 0";e.executeSql(n,[],t)}function M(e,t){var n="ALTER TABLE "+p+" ADD COLUMN max_seq INTEGER";e.executeSql(n,[],function(e){var n="UPDATE "+p+" SET max_seq=(SELECT MAX(seq) FROM "+h+" WHERE doc_id=id)";e.executeSql(n,[],function(e){var n="CREATE UNIQUE INDEX IF NOT EXISTS 'doc-max-seq-idx' ON "+p+" (max_seq)";e.executeSql(n,[],t)})})}function P(e,t){e.executeSql('SELECT HEX("a") AS hex',[],function(e,n){var r=n.rows.item(0).hex;W=2===r.length?"UTF-8":"UTF-16",t()})}function U(){for(;X.length>0;){var e=X.pop();e(null,Q)}}function H(e,t){if(0===t){var n="CREATE TABLE IF NOT EXISTS "+m+" (dbid, db_version INTEGER)",r="CREATE TABLE IF NOT EXISTS "+v+" (digest UNIQUE, escaped TINYINT(1), body BLOB)",o="CREATE TABLE IF NOT EXISTS "+g+" (digest, seq INTEGER)",s="CREATE TABLE IF NOT EXISTS "+p+" (id unique, json, winningseq, max_seq INTEGER UNIQUE)",a="CREATE TABLE IF NOT EXISTS "+h+" (seq INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, json, deleted TINYINT(1), doc_id, rev)",c="CREATE TABLE IF NOT EXISTS "+_+" (id UNIQUE, rev, json)";e.executeSql(r),e.executeSql(c),e.executeSql(o,[],function(){e.executeSql(C),e.executeSql(D)}),e.executeSql(s,[],function(){e.executeSql(R),e.executeSql(a,[],function(){e.executeSql(k),e.executeSql(q),e.executeSql(n,[],function(){var t="INSERT INTO "+m+" (db_version, dbid) VALUES (?,?)";Q=i.uuid();var n=[d,Q];e.executeSql(t,n,function(){U()})})})})}else{var f=function(){var n=d>t;n&&e.executeSql("UPDATE "+m+" SET db_version = "+d);var r="SELECT dbid FROM "+m;e.executeSql(r,[],function(e,t){Q=t.rows.item(0).dbid,U()})},l=[u,N,j,B,F,M,f],y=t,b=function(e){l[y-1](e,b),y++};b(e)}}function J(){Y.transaction(function(e){P(e,function(){V(e)})},T(t),n)}function V(e){var t="SELECT sql FROM sqlite_master WHERE tbl_name = "+m;e.executeSql(t,[],function(e,t){t.rows.length?/db_version/.test(t.rows.item(0).sql)?e.executeSql("SELECT db_version FROM "+m,[],function(e,t){var n=t.rows.item(0).db_version;H(e,n)}):e.executeSql("ALTER TABLE "+m+" ADD COLUMN db_version INTEGER",[],function(){H(e,1)}):H(e,0)})}function G(e,t){if(-1!==K._docCount)return t(K._docCount);var n=w("COUNT("+p+".id) AS 'num'",[p,h],I,h+".deleted=0");e.executeSql(n,[],function(e,n){K._docCount=n.rows.item(0).num,t(K._docCount)})}var W,K=this,Q=null,z=A(e),X=[];K._docCount=-1,K._name=e.name;var Y=x({name:K._name,version:O,description:K._name,size:z,location:e.location,createFromLocation:e.createFromLocation});return Y?("function"!=typeof Y.readTransaction&&(Y.readTransaction=Y.transaction),i.isCordova()?window.addEventListener(K._name+"_pouch",function $(){window.removeEventListener(K._name+"_pouch",$,!1),J()},!1):J(),K.type=function(){return"websql"},K._id=i.toPromise(function(e){e(null,Q)}),K._info=function(e){Y.readTransaction(function(t){G(t,function(n){var r="SELECT MAX(seq) AS seq FROM "+h;t.executeSql(r,[],function(t,r){var o=r.rows.item(0).seq||0;e(null,{doc_count:n,update_seq:o,sqlite_plugin:Y._sqlitePlugin,websql_encoding:W})})})},T(e))},K._bulkDocs=function(e,t,n){l(e,t,K,Y,o.Changes,n)},K._get=function(e,t,n){function r(){n(c,{doc:o,metadata:s,ctx:l})}t=i.clone(t);var o,s,c;if(!t.ctx)return void Y.readTransaction(function(r){t.ctx=r,K._get(e,t,n)});var u,f,l=t.ctx;t.rev?(u=w(L,[p,h],p+".id="+h+".doc_id",[h+".doc_id=?",h+".rev=?"]),f=[e,t.rev]):(u=w(L,[p,h],I,p+".id=?"),f=[e]),l.executeSql(u,f,function(e,n){if(!n.rows.length)return c=a.error(a.MISSING_DOC,"missing"),r();var u=n.rows.item(0);return s=i.safeJsonParse(u.metadata),u.deleted&&!t.rev?(c=a.error(a.MISSING_DOC,"deleted"),r()):(o=E(u.data,s.id,u.rev),void r())})},K._allDocs=function(e,t){var n,o=[],a="startkey"in e?e.startkey:!1,c="endkey"in e?e.endkey:!1,u="key"in e?e.key:!1,f="descending"in e?e.descending:!1,l="limit"in e?e.limit:-1,d="skip"in e?e.skip:0,v=e.inclusive_end!==!1,_=[],m=[];if(u!==!1)m.push(p+".id = ?"),_.push(u);else if(a!==!1||c!==!1){if(a!==!1&&(m.push(p+".id "+(f?"<=":">=")+" ?"),_.push(a)),c!==!1){var g=f?">":"<";v&&(g+="="),m.push(p+".id "+g+" ?"),_.push(c)}u!==!1&&(m.push(p+".id = ?"),_.push(u))}"ok"!==e.deleted&&m.push(h+".deleted = 0"),Y.readTransaction(function(t){G(t,function(a){if(n=a,0!==l){var c=w(L,[p,h],I,m,p+".id "+(f?"DESC":"ASC"));c+=" LIMIT "+l+" OFFSET "+d,t.executeSql(c,_,function(t,n){for(var a=0,c=n.rows.length;c>a;a++){var u=n.rows.item(a),f=i.safeJsonParse(u.metadata),l=f.id,d=E(u.data,l,u.rev),p=d._rev,h={id:l,key:l,value:{rev:p}};if(e.include_docs&&(h.doc=d,h.doc._rev=p,e.conflicts&&(h.doc._conflicts=s.collectConflicts(f)),r(h.doc,e,K,t)),u.deleted){if("ok"!==e.deleted)continue;h.value.deleted=!0,h.doc=null}o.push(h)}})}})},T(t),function(){t(null,{total_rows:n,offset:e.skip,rows:o})})},K._changes=function(e){function t(){var t=p+".json AS metadata, "+p+".max_seq AS maxSeq, "+h+".json AS winningDoc, "+h+".rev AS winningRev ",n=p+" JOIN "+h,o=p+".id="+h+".doc_id AND "+p+".winningseq="+h+".seq",l=["maxSeq > ?"],d=[e.since];e.doc_ids&&(l.push(p+".id IN "+y(e.doc_ids.length)),d=d.concat(e.doc_ids));var v="maxSeq "+(s?"DESC":"ASC"),_=w(t,n,o,l,v),m=i.filterChange(e);e.view||e.filter||(_+=" LIMIT "+a);var g=e.since||0;Y.readTransaction(function(t){t.executeSql(_,d,function(t,n){function o(t){return function(){e.onChange(t)}}for(var s=0,l=n.rows.length;l>s;s++){var d=n.rows.item(s),p=i.safeJsonParse(d.metadata);g=d.maxSeq;var h=E(d.winningDoc,p.id,d.winningRev),v=e.processChange(h,p,e);if(v.seq=d.maxSeq,m(v)&&(f++,c&&u.push(v),e.attachments&&e.include_docs?r(h,e,K,t,o(v)):o(v)()),f===a)break}})},T(e.complete),function(){e.continuous||e.complete(null,{results:u,last_seq:g})})}if(e=i.clone(e),e.continuous){var n=K._name+":"+i.uuid();return o.Changes.addListener(K._name,n,K,e),o.Changes.notify(K._name),{cancel:function(){o.Changes.removeListener(K._name,n)}}}var s=e.descending;e.since=e.since&&!s?e.since:0;var a="limit"in e?e.limit:-1;0===a&&(a=1);var c;c="returnDocs"in e?e.returnDocs:!0;var u=[],f=0;t()},K._close=function(e){e()},K._getAttachment=function(e,t,n){var r,o=t.ctx,s=e.digest,a=e.content_type,u="SELECT escaped, CASE WHEN escaped = 1 THEN body ELSE HEX(body) END AS body FROM "+v+" WHERE digest=?";o.executeSql(u,[s],function(e,o){var s=o.rows.item(0),u=s.escaped?f.unescapeBlob(s.body):c(s.body,W);t.encode?r=btoa(u):(u=i.fixBinary(u),r=i.createBlob([u],{type:a})),n(null,r)})},K._getRevisionTree=function(e,t){Y.readTransaction(function(n){var r="SELECT json AS metadata FROM "+p+" WHERE id = ?";n.executeSql(r,[e],function(e,n){if(n.rows.length){var r=i.safeJsonParse(n.rows.item(0).metadata);t(null,r.rev_tree)}else t(a.error(a.MISSING_DOC))})})},K._doCompaction=function(e,t,n){return t.length?void Y.transaction(function(n){var r="SELECT json AS metadata FROM "+p+" WHERE id = ?";n.executeSql(r,[e],function(n,r){var o=i.safeJsonParse(r.rows.item(0).metadata);s.traverseRevTree(o.rev_tree,function(e,n,r,o,i){var s=n+"-"+r;-1!==t.indexOf(s)&&(i.status="missing")});var a="UPDATE "+p+" SET json = ? WHERE id = ?";n.executeSql(a,[i.safeJsonStringify(o),e])}),S(t,e,n)},T(n),function(){n()}):n()},K._getLocal=function(e,t){Y.readTransaction(function(n){var r="SELECT json, rev FROM "+_+" WHERE id=?";n.executeSql(r,[e],function(n,r){if(r.rows.length){var o=r.rows.item(0),i=E(o.json,e,o.rev);t(null,i)}else t(a.error(a.MISSING_DOC))})})},K._putLocal=function(e,t,n){function r(e){var r,f;i?(r="UPDATE "+_+" SET rev=?, json=? WHERE id=? AND rev=?",f=[o,u,s,i]):(r="INSERT INTO "+_+" (id, rev, json) VALUES (?,?,?)",f=[s,o,u]),e.executeSql(r,f,function(e,r){r.rowsAffected?(c={ok:!0,id:s,rev:o},t.ctx&&n(null,c)):n(a.error(a.REV_CONFLICT))},function(){return n(a.error(a.REV_CONFLICT)),!1})}"function"==typeof t&&(n=t,t={}),delete e._revisions;var o,i=e._rev,s=e._id;o=i?e._rev="0-"+(parseInt(i.split("-")[1],10)+1):e._rev="0-1";var c,u=b(e);t.ctx?r(t.ctx):Y.transaction(function(e){r(e)},T(n),function(){c&&n(null,c)})},K._removeLocal=function(e,t){var n;Y.transaction(function(r){var o="DELETE FROM "+_+" WHERE id=? AND rev=?",i=[e._id,e._rev];r.executeSql(o,i,function(r,o){return o.rowsAffected?void(n={ok:!0,id:e._id,rev:"0-0"}):t(a.error(a.MISSING_DOC))})},T(t),function(){n&&t(null,n)})},void(K._destroy=function(e){o.Changes.removeAllListeners(K._name),Y.transaction(function(e){var t=[p,h,v,m,_,g];t.forEach(function(t){e.executeSql("DROP TABLE IF EXISTS "+t,[])})},T(e),function(){i.hasLocalStorage()&&(delete window.localStorage["_pouch__websqldb_"+K._name],delete window.localStorage[K._name]),e(null,{ok:!0})})})):t(a.error(a.UNKNOWN_ERROR))}var i=e(36),s=e(31),a=e(19),c=e(23),u=e(10),f=e(11),l=e(9),d=u.ADAPTER_VERSION,p=u.DOC_STORE,h=u.BY_SEQ_STORE,v=u.ATTACH_STORE,_=u.LOCAL_STORE,m=u.META_STORE,g=u.ATTACH_AND_SEQ_STORE,y=f.qMarks,b=f.stringifyDoc,E=f.unstringifyDoc,w=f.select,S=f.compactRevs,T=f.unknownError,A=f.getSize,x=f.openDB,O=1,k="CREATE INDEX IF NOT EXISTS 'by-seq-deleted-idx' ON "+h+" (seq, deleted)",q="CREATE UNIQUE INDEX IF NOT EXISTS 'by-seq-doc-id-rev' ON "+h+" (doc_id, rev)",R="CREATE INDEX IF NOT EXISTS 'doc-winningseq-idx' ON "+p+" (winningseq)",C="CREATE INDEX IF NOT EXISTS 'attach-seq-seq-idx' ON "+g+" (seq)",D="CREATE UNIQUE INDEX IF NOT EXISTS 'attach-seq-digest-idx' ON "+g+" (digest, seq)",I=h+".seq = "+p+".winningseq",L=h+".seq AS seq, "+h+".deleted AS deleted, "+h+".json AS data, "+h+".rev AS rev, "+p+".json AS metadata";o.valid=f.valid,o.Changes=new i.Changes,t.exports=o},{10:10,11:11,19:19,23:23,31:31,36:36,9:9}],13:[function(e,t,n){"use strict";function r(e,t,n){function r(){o.cancel()}c.call(this);var o=this;this.db=e,t=t?i.clone(t):{};var s=n||t.complete||function(){},a=t.complete=i.once(function(t,n){t?o.emit("error",t):o.emit("complete",n),o.removeAllListeners(),e.removeListener("destroyed",r)});s&&(o.on("complete",function(e){s(null,e)}),o.on("error",function(e){s(e)}));var u=t.onChange;u&&o.on("change",u),e.once("destroyed",r),t.onChange=function(e){t.isCancelled||(o.emit("change",e),o.startSeq&&o.startSeq<=e.seq&&(o.emit("uptodate"),o.startSeq=!1),e.deleted?o.emit("delete",e):1===e.changes.length&&"1-"===e.changes[0].rev.slice(0,2)?o.emit("create",e):o.emit("update",e))};var f=new i.Promise(function(e,n){t.complete=function(t,r){t?n(t):e(r)}});o.once("cancel",function(){u&&o.removeListener("change",u),t.complete(null,{status:"cancelled"})}),this.then=f.then.bind(f),this["catch"]=f["catch"].bind(f),this.then(function(e){a(null,e)},a),e.taskqueue.isReady?o.doChanges(t):e.taskqueue.addTask(function(){o.isCancelled?o.emit("cancel"):o.doChanges(t)})}function o(e,t,n){var r=[{rev:e._rev}];"all_docs"===n.style&&(r=s.collectLeaves(t.rev_tree).map(function(e){return{rev:e.rev}}));var o={id:t.id,changes:r,doc:e};return i.isDeleted(t,e._rev)&&(o.deleted=!0),n.conflicts&&(o.doc._conflicts=s.collectConflicts(t),o.doc._conflicts.length||delete o.doc._conflicts),o}var i=e(36),s=e(31),a=e(19),c=e(40).EventEmitter,u=e(29),f=e(30);t.exports=r,i.inherits(r,c),r.prototype.cancel=function(){this.isCancelled=!0,this.db.taskqueue.isReady&&this.emit("cancel")},r.prototype.doChanges=function(e){var t=this,n=e.complete;if(e=i.clone(e),"live"in e&&!("continuous"in e)&&(e.continuous=e.live),e.processChange=o,"latest"===e.since&&(e.since="now"),e.since||(e.since=0),"now"===e.since)return void this.db.info().then(function(r){return t.isCancelled?void n(null,{status:"cancelled"}):(e.since=r.update_seq,void t.doChanges(e))},n);if(e.continuous&&"now"!==e.since&&this.db.info().then(function(e){t.startSeq=e.update_seq},function(e){if("idbNull"!==e.id)throw e}),"http"!==this.db.type()&&e.filter&&"string"==typeof e.filter&&!e.doc_ids)return this.filterChanges(e);"descending"in e||(e.descending=!1),e.limit=0===e.limit?1:e.limit,e.complete=n;var r=this.db._changes(e);if(r&&"function"==typeof r.cancel){var s=t.cancel;t.cancel=i.getArguments(function(e){r.cancel(),s.apply(this,e)})}},r.prototype.filterChanges=function(e){var t=this,n=e.complete;if("_view"===e.filter){if(!e.view||"string"!=typeof e.view){var r=a.error(a.BAD_REQUEST,"`view` filter parameter is not provided.");return void n(r)}var o=e.view.split("/");this.db.get("_design/"+o[0],function(r,i){if(t.isCancelled)return void n(null,{status:"cancelled"});if(r)return void n(a.generateErrorFromResponse(r));if(i&&i.views&&i.views[o[1]]){var s=f(i.views[o[1]].map);return e.filter=s,void t.doChanges(e)}var c=i.views?"missing json key: "+o[1]:"missing json key: views";r||(r=a.error(a.MISSING_DOC,c)),n(r)})}else{var i=e.filter.split("/");this.db.get("_design/"+i[0],function(r,o){if(t.isCancelled)return void n(null,{status:"cancelled"});if(r)return void n(a.generateErrorFromResponse(r));if(o&&o.filters&&o.filters[i[1]]){var s=u(o.filters[i[1]]);return e.filter=s,void t.doChanges(e)}var c=o&&o.filters?"missing json key: "+i[1]:"missing json key: filters";return r||(r=a.error(a.MISSING_DOC,c)),void n(r)})}}},{19:19,29:29,30:30,31:31,36:36,40:40}],14:[function(e,t,n){"use strict";function r(e,t,n,o){return e.get(t)["catch"](function(n){if(404===n.status)return"http"===e.type()&&s("PouchDB is just checking if a remote checkpoint exists."),{_id:t};throw n}).then(function(i){return o.cancelled?void 0:(i.last_seq=n,e.put(i)["catch"](function(i){if(409===i.status)return r(e,t,n,o);throw i}))})}function o(e,t,n,r){this.src=e,this.target=t,this.id=n,this.returnValue=r}var i=e(25),s=e(20),a=e(64),c=a.collate;o.prototype.writeCheckpoint=function(e){var t=this;return this.updateTarget(e).then(function(){return t.updateSource(e)})},o.prototype.updateTarget=function(e){return r(this.target,this.id,e,this.returnValue)},o.prototype.updateSource=function(e){var t=this;return this.readOnlySource?i.resolve(!0):r(this.src,this.id,e,this.returnValue)["catch"](function(e){var n="number"==typeof e.status&&4===Math.floor(e.status/100);if(n)return t.readOnlySource=!0,!0;throw e})},o.prototype.getCheckpoint=function(){var e=this;return e.target.get(e.id).then(function(t){return e.src.get(e.id).then(function(e){return 0===c(t.last_seq,e.last_seq)?e.last_seq:0},function(n){if(404===n.status&&t.last_seq)return e.src.put({_id:e.id,last_seq:0}).then(function(){return 0},function(n){return 401===n.status?(e.readOnlySource=!0,t.last_seq):0});throw n})})["catch"](function(e){if(404!==e.status)throw e;return 0})},t.exports=o},{20:20,25:25,64:64}],15:[function(e,t,n){(function(n,r){"use strict";function o(e){e&&r.debug&&console.error(e)}function i(e,t,r){if(!(this instanceof i))return new i(e,t,r);var f=this;("function"==typeof t||"undefined"==typeof t)&&(r=t,t={}),e&&"object"==typeof e&&(t=e,e=void 0),"undefined"==typeof r&&(r=o),e=e||t.name,
t=t?a.clone(t):{},delete t.name,this.__opts=t;var l=r;f.auto_compaction=t.auto_compaction,f.prefix=i.prefix,s.call(f),f.taskqueue=new c;var d=new u(function(o,s){r=function(e,t){return e?s(e):(delete t.then,void o(t))},t=a.clone(t);var c,u,l=t.name||e;return function(){try{if("string"!=typeof l)throw u=new Error("Missing/invalid DB name"),u.code=400,u;if(c=i.parseAdapter(l,t),t.originalName=l,t.name=c.name,t.prefix&&"http"!==c.adapter&&"https"!==c.adapter&&(t.name=t.prefix+t.name),t.adapter=t.adapter||c.adapter,f._adapter=t.adapter,f._db_name=l,!i.adapters[t.adapter])throw u=new Error("Adapter is missing"),u.code=404,u;if(!i.adapters[t.adapter].valid())throw u=new Error("Invalid Adapter"),u.code=404,u}catch(e){f.taskqueue.fail(e),f.changes=a.toPromise(function(t){t.complete&&t.complete(e)})}}(),u?s(u):(f.adapter=t.adapter,f.replicate={},f.replicate.from=function(e,t,n){return f.constructor.replicate(e,f,t,n)},f.replicate.to=function(e,t,n){return f.constructor.replicate(f,e,t,n)},f.sync=function(e,t,n){return f.constructor.sync(f,e,t,n)},f.replicate.sync=f.sync,i.adapters[t.adapter].call(f,t,function(e){function n(){i.emit("destroyed",t.originalName),i.emit(t.originalName,"destroyed"),f.removeListener("destroyed",n)}return e?void(r&&(f.taskqueue.fail(e),r(e))):(f.on("destroyed",n),f.emit("created",f),i.emit("created",t.originalName),f.taskqueue.ready(f),void r(null,f))}),t.skipSetup&&(f.taskqueue.ready(f),n.nextTick(function(){r(null,f)})),void(a.isCordova()&&cordova.fireWindowEvent(t.name+"_pouch",{})))});d.then(function(e){l(null,e)},l),f.then=d.then.bind(d),f["catch"]=d["catch"].bind(d)}var s=e(1),a=e(36),c=e(35),u=a.Promise;a.inherits(i,s),i.debug=e(42),t.exports=i}).call(this,e(41),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{1:1,35:35,36:36,41:41,42:42}],16:[function(e,t,n){(function(n){"use strict";function r(e,t){function r(t,n,r){if(e.binary||e.json||!e.processData||"string"==typeof t){if(!e.binary&&e.json&&"string"==typeof t)try{t=JSON.parse(t)}catch(o){return r(o)}}else t=JSON.stringify(t);Array.isArray(t)&&(t=t.map(function(e){return e.error||e.missing?s.generateErrorFromResponse(e):e})),r(null,t,n)}function c(e,t){var n,r;if(e.code&&e.status){var o=new Error(e.message||e.code);return o.status=e.status,t(o)}try{n=JSON.parse(e.responseText),r=s.generateErrorFromResponse(n)}catch(i){r=s.generateErrorFromResponse(e)}t(r)}function u(e){return n.browser?"":new i("","binary")}var f=!1,l=a.getArguments(function(e){f||(t.apply(this,e),f=!0)});"function"==typeof e&&(l=e,e={}),e=a.clone(e);var d={method:"GET",headers:{},json:!0,processData:!0,timeout:1e4,cache:!1};return e=a.extend(!0,d,e),e.json&&(e.binary||(e.headers.Accept="application/json"),e.headers["Content-Type"]=e.headers["Content-Type"]||"application/json"),e.binary&&(e.encoding=null,e.json=!1),e.processData||(e.json=!1),o(e,function(t,n,o){if(t)return t.status=n?n.statusCode:400,c(t,l);var i,a=n.headers&&n.headers["content-type"],f=o||u();e.binary||!e.json&&e.processData||"object"==typeof f||!(/json/.test(a)||/^[\s]*\{/.test(f)&&/\}[\s]*$/.test(f))||(f=JSON.parse(f)),n.statusCode>=200&&n.statusCode<300?r(f,n,l):(e.binary&&(f=JSON.parse(f.toString())),i=s.generateErrorFromResponse(f),i.status=n.statusCode,l(i))})}var o=e(26),i=e(18),s=e(19),a=e(36);t.exports=r}).call(this,e(41))},{18:18,19:19,26:26,36:36,41:41}],17:[function(e,t,n){(function(e){"use strict";function n(t,n){t=t||[],n=n||{};try{return new Blob(t,n)}catch(r){if("TypeError"!==r.name)throw r;for(var o=e.BlobBuilder||e.MSBlobBuilder||e.MozBlobBuilder||e.WebKitBlobBuilder,i=new o,s=0;s<t.length;s+=1)i.append(t[s]);return i.getBlob(n.type)}}t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],18:[function(e,t,n){t.exports={}},{}],19:[function(e,t,n){"use strict";function r(e){Error.call(e.reason),this.status=e.status,this.name=e.error,this.message=e.reason,this.error=!0}var o=e(45);o(r,Error),r.prototype.toString=function(){return JSON.stringify({status:this.status,name:this.name,message:this.message})},n.UNAUTHORIZED=new r({status:401,error:"unauthorized",reason:"Name or password is incorrect."}),n.MISSING_BULK_DOCS=new r({status:400,error:"bad_request",reason:"Missing JSON list of 'docs'"}),n.MISSING_DOC=new r({status:404,error:"not_found",reason:"missing"}),n.REV_CONFLICT=new r({status:409,error:"conflict",reason:"Document update conflict"}),n.INVALID_ID=new r({status:400,error:"invalid_id",reason:"_id field must contain a string"}),n.MISSING_ID=new r({status:412,error:"missing_id",reason:"_id is required for puts"}),n.RESERVED_ID=new r({status:400,error:"bad_request",reason:"Only reserved document ids may start with underscore."}),n.NOT_OPEN=new r({status:412,error:"precondition_failed",reason:"Database not open"}),n.UNKNOWN_ERROR=new r({status:500,error:"unknown_error",reason:"Database encountered an unknown error"}),n.BAD_ARG=new r({status:500,error:"badarg",reason:"Some query argument is invalid"}),n.INVALID_REQUEST=new r({status:400,error:"invalid_request",reason:"Request was invalid"}),n.QUERY_PARSE_ERROR=new r({status:400,error:"query_parse_error",reason:"Some query parameter is invalid"}),n.DOC_VALIDATION=new r({status:500,error:"doc_validation",reason:"Bad special document member"}),n.BAD_REQUEST=new r({status:400,error:"bad_request",reason:"Something wrong with the request"}),n.NOT_AN_OBJECT=new r({status:400,error:"bad_request",reason:"Document must be a JSON object"}),n.DB_MISSING=new r({status:404,error:"not_found",reason:"Database not found"}),n.IDB_ERROR=new r({status:500,error:"indexed_db_went_bad",reason:"unknown"}),n.WSQ_ERROR=new r({status:500,error:"web_sql_went_bad",reason:"unknown"}),n.LDB_ERROR=new r({status:500,error:"levelDB_went_went_bad",reason:"unknown"}),n.FORBIDDEN=new r({status:403,error:"forbidden",reason:"Forbidden by design doc validate_doc_update function"}),n.INVALID_REV=new r({status:400,error:"bad_request",reason:"Invalid rev format"}),n.FILE_EXISTS=new r({status:412,error:"file_exists",reason:"The database could not be created, the file already exists."}),n.MISSING_STUB=new r({status:412,error:"missing_stub"}),n.error=function(e,t,n){function o(t){for(var r in e)"function"!=typeof e[r]&&(this[r]=e[r]);void 0!==n&&(this.name=n),void 0!==t&&(this.reason=t)}return o.prototype=r.prototype,new o(t)},n.getErrorTypeByProp=function(e,t,r){var o=n,i=Object.keys(o).filter(function(n){var r=o[n];return"function"!=typeof r&&r[e]===t}),s=r&&i.filter(function(e){var t=o[e];return t.message===r})[0]||i[0];return s?o[s]:null},n.generateErrorFromResponse=function(e){var t,r,o,i,s,a=n;return r=e.error===!0&&"string"==typeof e.name?e.name:e.error,s=e.reason,o=a.getErrorTypeByProp("name",r,s),e.missing||"missing"===s||"deleted"===s||"not_found"===r?o=a.MISSING_DOC:"doc_validation"===r?(o=a.DOC_VALIDATION,i=s):"bad_request"===r&&o.message!==s&&(0===s.indexOf("unknown stub attachment")?(o=a.MISSING_STUB,i=s):o=a.BAD_REQUEST),o||(o=a.getErrorTypeByProp("status",e.status,s)||a.UNKNOWN_ERROR),t=a.error(o,s,r),i&&(t.message=i),e.id&&(t.id=e.id),e.status&&(t.status=e.status),e.statusText&&(t.name=e.statusText),e.missing&&(t.missing=e.missing),t}},{45:45}],20:[function(e,t,n){(function(e,n){"use strict";function r(t){e.browser&&"console"in n&&"info"in console&&console.info("The above 404 is totally normal. "+t)}t.exports=r}).call(this,e(41),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{41:41}],21:[function(e,t,n){(function(n,r){"use strict";function o(e){var t=[255&e,e>>>8&255,e>>>16&255,e>>>24&255];return t.map(function(e){return String.fromCharCode(e)}).join("")}function i(e){for(var t="",n=0;n<e.length;n++)t+=o(e[n]);return btoa(t)}function s(e,t,n,r){(n>0||r<t.byteLength)&&(t=new Uint8Array(t,n,Math.min(r,t.byteLength)-n)),e.append(t)}function a(e,t,n,r){(n>0||r<t.length)&&(t=t.substring(n,r)),e.appendBinary(t)}var c=e(39),u=e(75),f=r.setImmediate||r.setTimeout,l=32768;t.exports=function(e,t){function r(){var n=_*h,o=n+h;if(_++,v>_)g(m,e,n,o),f(r);else{g(m,e,n,o);var s=m.end(!0),a=i(s);t(null,a),m.destroy()}}if(!n.browser){var o=c.createHash("md5").update(e).digest("base64");return void t(null,o)}var d="string"==typeof e,p=d?e.length:e.byteLength,h=Math.min(l,p),v=Math.ceil(p/h),_=0,m=d?new u:new u.ArrayBuffer,g=d?a:s;r()}}).call(this,e(41),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{39:39,41:41,75:75}],22:[function(e,t,n){"use strict";function r(e){return e.reduce(function(e,t){return e[t]=!0,e},{})}function o(e){if(!/^\d+\-./.test(e))return s.error(s.INVALID_REV);var t=e.indexOf("-"),n=e.substring(0,t),r=e.substring(t+1);return{prefix:parseInt(n,10),id:r}}function i(e,t){for(var n=e.start-e.ids.length+1,r=e.ids,o=[r[0],t,[]],i=1,s=r.length;s>i;i++)o=[r[i],{status:"missing"},[o]];return[{pos:n,ids:o}]}var s=e(19),a=e(28),c=r(["_id","_rev","_attachments","_deleted","_revisions","_revs_info","_conflicts","_deleted_conflicts","_local_seq","_rev_tree","_replication_id","_replication_state","_replication_state_time","_replication_state_reason","_replication_stats","_removed"]),u=r(["_attachments","_replication_id","_replication_state","_replication_state_time","_replication_state_reason","_replication_stats"]);n.invalidIdError=function(e){var t;if(e?"string"!=typeof e?t=s.error(s.INVALID_ID):/^_/.test(e)&&!/^_(design|local)/.test(e)&&(t=s.error(s.RESERVED_ID)):t=s.error(s.MISSING_ID),t)throw t},n.parseDoc=function(e,t){var r,f,l,d={status:"available"};if(e._deleted&&(d.deleted=!0),t)if(e._id||(e._id=a()),f=a(32,16).toLowerCase(),e._rev){if(l=o(e._rev),l.error)return l;e._rev_tree=[{pos:l.prefix,ids:[l.id,{status:"missing"},[[f,d,[]]]]}],r=l.prefix+1}else e._rev_tree=[{pos:1,ids:[f,d,[]]}],r=1;else if(e._revisions&&(e._rev_tree=i(e._revisions,d),r=e._revisions.start,f=e._revisions.ids[0]),!e._rev_tree){if(l=o(e._rev),l.error)return l;r=l.prefix,f=l.id,e._rev_tree=[{pos:r,ids:[f,d,[]]}]}n.invalidIdError(e._id),e._rev=r+"-"+f;var p={metadata:{},data:{}};for(var h in e)if(e.hasOwnProperty(h)){var v="_"===h[0];if(v&&!c[h]){var _=s.error(s.DOC_VALIDATION,h);throw _.message=s.DOC_VALIDATION.message+": "+h,_}v&&!u[h]?p.metadata[h.slice(1)]=e[h]:p.data[h]=e[h]}return p}},{19:19,28:28}],23:[function(e,t,n){"use strict";function r(e){return decodeURIComponent(window.escape(e))}function o(e){return 65>e?e-48:e-55}function i(e,t,n){for(var r="";n>t;)r+=String.fromCharCode(o(e.charCodeAt(t++))<<4|o(e.charCodeAt(t++)));return r}function s(e,t,n){for(var r="";n>t;)r+=String.fromCharCode(o(e.charCodeAt(t+2))<<12|o(e.charCodeAt(t+3))<<8|o(e.charCodeAt(t))<<4|o(e.charCodeAt(t+1))),t+=4;return r}function a(e,t){return"UTF-8"===t?r(i(e,0,e.length)):s(e,0,e.length)}t.exports=a},{}],24:[function(e,t,n){"use strict";function r(e){for(var t=o,n=t.parser[t.strictMode?"strict":"loose"].exec(e),r={},i=14;i--;){var s=t.key[i],a=n[i]||"",c=-1!==["user","password"].indexOf(s);r[s]=c?decodeURIComponent(a):a}return r[t.q.name]={},r[t.key[12]].replace(t.q.parser,function(e,n,o){n&&(r[t.q.name][n]=o)}),r}var o={strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};t.exports=r},{}],25:[function(e,t,n){"use strict";"function"==typeof Promise?t.exports=Promise:t.exports=e(49)},{49:49}],26:[function(e,t,n){"use strict";function r(){for(var e={},t=new a.Promise(function(t,n){e.resolve=t,e.reject=n}),n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.then=t.then.bind(t),e["catch"]=t["catch"].bind(t),e.promise=t,fetch.apply(null,n).then(function(t){e.resolve(t)},function(t){e.reject(t)})["catch"](function(t){e["catch"](t)}),e}function o(e,t){var n,o,i,s=new Headers,c={method:e.method,credentials:"include",headers:s};return e.json&&(s.set("Accept","application/json"),s.set("Content-Type",e.headers["Content-Type"]||"application/json")),e.body&&e.body instanceof Blob?a.readAsBinaryString(e.body,function(e){c.body=a.fixBinary(e)}):e.body&&e.processData&&"string"!=typeof e.body?c.body=JSON.stringify(e.body):"body"in e?c.body=e.body:c.body=null,Object.keys(e.headers).forEach(function(t){e.headers.hasOwnProperty(t)&&s.set(t,e.headers[t])}),n=r(e.url,c),e.timeout>0&&(o=setTimeout(function(){n.reject(new Error("Load timeout for resource: "+e.url))},e.timeout)),n.promise.then(function(t){var n;return i=t,e.timeout>0&&clearTimeout(o),t.status>=200&&t.status<300?e.binary?t.blob():t.text():n.json()}).then(function(e){i.status>=200&&i.status<300?t(null,i,e):t(e,i)})["catch"](function(e){t(e,i)}),{abort:n.reject}}function i(e,t){var n,r,o,i=function(){n.abort()};if(n=e.xhr?new e.xhr:new XMLHttpRequest,"GET"===e.method&&!e.cache){var c=-1!==e.url.indexOf("?");e.url+=(c?"&":"?")+"_nonce="+Date.now()}n.open(e.method,e.url),n.withCredentials=!0,"GET"===e.method?delete e.headers["Content-Type"]:e.json&&(e.headers.Accept="application/json",e.headers["Content-Type"]=e.headers["Content-Type"]||"application/json",e.body&&e.processData&&"string"!=typeof e.body&&(e.body=JSON.stringify(e.body))),e.binary&&(n.responseType="arraybuffer"),"body"in e||(e.body=null);for(var u in e.headers)e.headers.hasOwnProperty(u)&&n.setRequestHeader(u,e.headers[u]);return e.timeout>0&&(r=setTimeout(i,e.timeout),n.onprogress=function(){clearTimeout(r),r=setTimeout(i,e.timeout)},"undefined"==typeof o&&(o=-1!==Object.keys(n).indexOf("upload")&&"undefined"!=typeof n.upload),o&&(n.upload.onprogress=n.onprogress)),n.onreadystatechange=function(){if(4===n.readyState){var r={statusCode:n.status};if(n.status>=200&&n.status<300){var o;o=e.binary?s([n.response||""],{type:n.getResponseHeader("Content-Type")}):n.responseText,t(null,r,o)}else{var i={};try{i=JSON.parse(n.response)}catch(a){}t(i,r)}}},e.body&&e.body instanceof Blob?a.readAsBinaryString(e.body,function(e){n.send(a.fixBinary(e))}):n.send(e.body),{abort:i}}var s=e(17),a=e(36);t.exports=function(e,t){return"undefined"!=typeof XMLHttpRequest||e.xhr?i(e,t):o(e,t)}},{17:17,36:36}],27:[function(e,t,n){"use strict";var r=e(74).upsert;t.exports=function(e,t,n,o){return r.call(e,t,n,o)}},{74:74}],28:[function(e,t,n){"use strict";function r(e){return 0|Math.random()*e}function o(e,t){t=t||i.length;var n="",o=-1;if(e){for(;++o<e;)n+=i[r(t)];return n}for(;++o<36;)switch(o){case 8:case 13:case 18:case 23:n+="-";break;case 19:n+=i[3&r(16)|8];break;default:n+=i[r(16)]}return n}var i="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");t.exports=o},{}],29:[function(_dereq_,module,exports){"use strict";function evalFilter(input){return eval(["(function () { return ",input," })()"].join(""))}module.exports=evalFilter},{}],30:[function(_dereq_,module,exports){"use strict";function evalView(input){return eval(["(function () {","  return function (doc) {","    var emitted = false;","    var emit = function (a, b) {","      emitted = true;","    };","    var view = "+input+";","    view(doc);","    if (emitted) {","      return true;","    }","  }","})()"].join("\n"))}module.exports=evalView},{}],31:[function(e,t,n){"use strict";function r(e,t,n){for(var r,o=0,i=e.length;i>o;)r=o+i>>>1,n(e[r],t)<0?o=r+1:i=r;return o}function o(e,t,n){var o=r(e,t,n);e.splice(o,0,t)}function i(e){for(var t,n=e.shift(),r=[n.id,n.opts,[]],o=r;e.length;)n=e.shift(),t=[n.id,n.opts,[]],o[2].push(t),o=t;return r}function s(e,t){return e[0]<t[0]?-1:1}function a(e,t){for(var n=[{tree1:e,tree2:t}],r=!1;n.length>0;){var i=n.pop(),a=i.tree1,c=i.tree2;(a[1].status||c[1].status)&&(a[1].status="available"===a[1].status||"available"===c[1].status?"available":"missing");for(var u=0;u<c[2].length;u++)if(a[2][0]){for(var f=!1,l=0;l<a[2].length;l++)a[2][l][0]===c[2][u][0]&&(n.push({tree1:a[2][l],tree2:c[2][u]}),f=!0);f||(r="new_branch",o(a[2],c[2][u],s))}else r="new_leaf",a[2][0]=c[2][u]}return{conflicts:r,tree:e}}function c(e,t,n){var r,o=[],i=!1,s=!1;return e.length?(e.forEach(function(e){if(e.pos===t.pos&&e.ids[0]===t.ids[0])r=a(e.ids,t.ids),o.push({pos:e.pos,ids:r.tree}),i=i||r.conflicts,s=!0;else if(n!==!0){var c=e.pos<t.pos?e:t,u=e.pos<t.pos?t:e,f=u.pos-c.pos,l=[],d=[];for(d.push({ids:c.ids,diff:f,parent:null,parentIdx:null});d.length>0;){var p=d.pop();0!==p.diff?p.ids&&p.ids[2].forEach(function(e,t){d.push({ids:e,diff:p.diff-1,parent:p.ids,parentIdx:t})}):p.ids[0]===u.ids[0]&&l.push(p)}var h=l[0];h?(r=a(h.ids,u.ids),h.parent[2][h.parentIdx]=r.tree,o.push({pos:c.pos,ids:c.ids}),i=i||r.conflicts,s=!0):o.push(e)}else o.push(e)}),s||o.push(t),o.sort(function(e,t){return e.pos-t.pos}),{tree:o,conflicts:i||"internal_node"}):{tree:[t],conflicts:"new_leaf"}}function u(e,t){var n=l.rootToLeaf(e).map(function(e){var n=e.ids.slice(-t);return{pos:e.pos+(e.ids.length-n.length),ids:i(n)}});return n.reduce(function(e,t){return c(e,t,!0).tree},[n.shift()])}var f=e(67),l={};l.merge=function(e,t,n){e=f(!0,[],e),t=f(!0,{},t);var r=c(e,t);return{tree:u(r.tree,n),conflicts:r.conflicts}},l.winningRev=function(e){var t=[];return l.traverseRevTree(e.rev_tree,function(e,n,r,o,i){e&&t.push({pos:n,id:r,deleted:!!i.deleted})}),t.sort(function(e,t){return e.deleted!==t.deleted?e.deleted>t.deleted?1:-1:e.pos!==t.pos?t.pos-e.pos:e.id<t.id?1:-1}),t[0].pos+"-"+t[0].id},l.traverseRevTree=function(e,t){for(var n,r=e.slice();n=r.pop();)for(var o=n.pos,i=n.ids,s=i[2],a=t(0===s.length,o,i[0],n.ctx,i[1]),c=0,u=s.length;u>c;c++)r.push({pos:o+1,ids:s[c],ctx:a})},l.collectLeaves=function(e){var t=[];return l.traverseRevTree(e,function(e,n,r,o,i){e&&t.push({rev:n+"-"+r,pos:n,opts:i})}),t.sort(function(e,t){return t.pos-e.pos}),t.forEach(function(e){delete e.pos}),t},l.collectConflicts=function(e){var t=l.winningRev(e),n=l.collectLeaves(e.rev_tree),r=[];return n.forEach(function(e){e.rev===t||e.opts.deleted||r.push(e.rev)}),r},l.rootToLeaf=function(e){var t=[];return l.traverseRevTree(e,function(e,n,r,o,i){if(o=o?o.slice(0):[],o.push({id:r,opts:i}),e){var s=n+1-o.length;t.unshift({pos:s,ids:o})}return o}),t},t.exports=l},{67:67}],32:[function(e,t,n){"use strict";function r(e,t){e=parseInt(e,10),t=parseInt(t,10),e!==e&&(e=0),t!==t||e>=t?t=(e||1)<<1:t+=1;var n=Math.random(),r=t-e;return~~(r*n+e)}function o(e){var t=0;return e||(t=2e3),r(e,t)}function i(e,t,n,r,i,s,a){return r.retry===!1?(i.emit("error",a),void i.removeAllListeners()):(r.default_back_off=r.default_back_off||0,r.retries=r.retries||0,"function"!=typeof r.back_off_function&&(r.back_off_function=o),r.retries++,r.max_retries&&r.retries>r.max_retries?(i.emit("error",new Error("tried "+r.retries+" times but replication failed")),void i.removeAllListeners()):(i.emit("requestError",a),"active"===i.state&&(i.emit("paused",a),i.state="stopped",i.once("active",function(){r.current_back_off=r.default_back_off})),r.current_back_off=r.current_back_off||r.default_back_off,r.current_back_off=r.back_off_function(r.current_back_off),void setTimeout(function(){c(e,t,n,r,i)},r.current_back_off)))}function s(){d.call(this),this.cancelled=!1,this.state="pending";var e=this,t=new l.Promise(function(t,n){e.once("complete",t),e.once("error",n)});e.then=function(e,n){return t.then(e,n)},e["catch"]=function(e){return t["catch"](e)},e["catch"](function(){})}function a(e,t,n){var r=n.filter?n.filter.toString():"";return e.id().then(function(e){return t.id().then(function(t){var o=e+t+r+JSON.stringify(n.query_params)+n.doc_ids;return l.MD5(o).then(function(e){return e=e.replace(/\//g,".").replace(/\+/g,"_"),"_local/"+e})})})}function c(e,t,n,r,o,s){function a(){if(0!==x.docs.length){var e=x.docs;return n.bulkDocs({docs:e,new_edits:!1}).then(function(t){if(F.cancelled)throw b(),new Error("cancelled");var n=[],r={};t.forEach(function(e){e.error&&(s.doc_write_failures++,n.push(e),r[e.id]=e)}),P=P.concat(n),s.docs_written+=x.docs.length-n.length;var i=n.filter(function(e){return"unauthorized"!==e.name&&"forbidden"!==e.name});if(U=[],e.forEach(function(e){var t=r[e._id];t?o.emit("denied",l.clone(t)):U.push(e)}),i.length>0){var a=new Error("bulkDocs error");throw a.other_errors=n,y("target.bulkDocs failed to write docs",a),new Error("bulkWrite partial failure")}},function(t){throw s.doc_write_failures+=e.length,t})}}function c(e){for(var n=x.diffs,r=n[e].missing,o=[],i=0;i<r.length;i+=h)o.push(r.slice(i,Math.min(r.length,i+h)));return l.Promise.all(o.map(function(r){var o={revs:!0,open_revs:r,attachments:!0};return t.get(e,o).then(function(t){t.forEach(function(e){return F.cancelled?b():void(e.ok&&(s.docs_read++,x.pendingRevs++,x.docs.push(e.ok)))}),delete n[e]})}))}function u(){var e=Object.keys(x.diffs);return l.Promise.all(e.map(c))}function f(){var e=Object.keys(x.diffs).filter(function(e){var t=x.diffs[e].missing;return 1===t.length&&"1-"===t[0].slice(0,2)});return e.length?t.allDocs({keys:e,include_docs:!0}).then(function(e){if(F.cancelled)throw b(),new Error("cancelled");e.rows.forEach(function(e){!e.doc||e.deleted||"1-"!==e.value.rev.slice(0,2)||e.doc._attachments&&0!==Object.keys(e.doc._attachments).length||(s.docs_read++,x.pendingRevs++,x.docs.push(e.doc),delete x.diffs[e.id])})}):l.Promise.resolve()}function d(){return f().then(u)}function v(){return q=!0,M.writeCheckpoint(x.seq).then(function(){if(q=!1,F.cancelled)throw b(),new Error("cancelled");s.last_seq=D=x.seq;var e=l.clone(s);e.docs=U,o.emit("change",e),x=void 0,T()})["catch"](function(e){throw q=!1,y("writeCheckpoint completed with error",e),e})}function _(){var e={};return x.changes.forEach(function(t){"_user/"!==t.id&&(e[t.id]=t.changes.map(function(e){return e.rev}))}),n.revsDiff(e).then(function(e){if(F.cancelled)throw b(),new Error("cancelled");x.diffs=e,x.pendingRevs=0})}function m(){if(!F.cancelled&&!x){if(0===O.length)return void g(!0);x=O.shift(),_().then(d).then(a).then(v).then(m)["catch"](function(e){y("batch processing terminated with error",e)})}}function g(e){return 0===k.changes.length?void(0!==O.length||x||((I&&H.live||R)&&(o.state="pending",o.emit("paused"),o.emit("uptodate",s)),R&&b())):void((e||R||k.changes.length>=L)&&(O.push(k),k={seq:0,changes:[],docs:[]},("pending"===o.state||"stopped"===o.state)&&(o.state="active",o.emit("active")),m()))}function y(e,t){C||(t.message||(t.message=e),s.ok=!1,s.status="aborting",s.errors.push(t),P=P.concat(t),O=[],k={seq:0,changes:[],docs:[]},b())}function b(){if(!(C||F.cancelled&&(s.status="cancelled",q))){s.status=s.status||"complete",s.end_time=new Date,s.last_seq=D,C=F.cancelled=!0;var a=P.filter(function(e){return"unauthorized"!==e.name&&"forbidden"!==e.name});if(a.length>0){var c=P.pop();P.length>0&&(c.other_errors=P),c.result=s,i(e,t,n,r,o,s,c)}else s.errors=P,o.emit("complete",s),o.removeAllListeners()}}function E(e){if(F.cancelled)return b();var t=l.filterChange(r)(e);t&&(0!==k.changes.length||0!==O.length||x||o.emit("outofdate",s),k.seq=e.seq,k.changes.push(e),g(0===O.length))}function w(e){return j=!1,F.cancelled?b():(e.results.length>0?(H.since=e.last_seq,T()):I?(H.live=!0,T()):R=!0,void g(!0))}function S(e){return j=!1,F.cancelled?b():void y("changes rejected",e)}function T(){function e(){r.cancel()}function n(){o.removeListener("cancel",e)}if(!j&&!R&&O.length<N){j=!0,o.once("cancel",e);var r=t.changes(H).on("change",E);r.then(n,n),r.then(w)["catch"](S)}}function A(){M.getCheckpoint().then(function(e){D=e,H={since:D,limit:L,batch_size:L,style:"all_docs",doc_ids:B,returnDocs:!0},r.filter&&("string"!=typeof r.filter?H.include_docs=!0:H.filter=r.filter),r.query_params&&(H.query_params=r.query_params),r.view&&(H.view=r.view),T()})["catch"](function(e){y("getCheckpoint rejected with ",e)})}var x,O=[],k={seq:0,changes:[],docs:[]},q=!1,R=!1,C=!1,D=0,I=r.continuous||r.live||!1,L=r.batch_size||100,N=r.batches_limit||10,j=!1,B=r.doc_ids,F={cancelled:!1},M=new p(t,n,e,F),P=[],U=[];s=s||{ok:!0,start_time:new Date,docs_read:0,docs_written:0,doc_write_failures:0,errors:[]};var H={};return o.ready(t,n),o.cancelled?void b():(o.once("cancel",b),"function"==typeof r.onChange&&o.on("change",r.onChange),"function"==typeof r.complete&&(o.once("error",r.complete),o.once("complete",function(e){r.complete(null,e)})),void("undefined"==typeof r.since?A():(q=!0,M.writeCheckpoint(r.since).then(function(){return q=!1,F.cancelled?void b():(D=r.since,void A())})["catch"](function(e){throw q=!1,y("writeCheckpoint completed with error",e),e}))))}function u(e,t){var n=t.PouchConstructor;return"string"==typeof e?new n(e,t):e.then?e:l.Promise.resolve(e)}function f(e,t,n,r){"function"==typeof n&&(r=n,n={}),"undefined"==typeof n&&(n={}),n.complete||(n.complete=r||function(){}),n=l.clone(n),n.continuous=n.continuous||n.live,n.retry="retry"in n?n.retry:v,n.PouchConstructor=n.PouchConstructor||this;var o=new s(n);return u(e,n).then(function(e){return u(t,n).then(function(t){return a(e,t,n).then(function(r){c(r,e,t,n,o)})})})["catch"](function(e){o.emit("error",e),n.complete(e)}),o}var l=e(36),d=e(40).EventEmitter,p=e(14),h=50,v=!1;l.inherits(s,d),s.prototype.cancel=function(){this.cancelled=!0,this.state="cancelled",this.emit("cancel")},s.prototype.ready=function(e,t){function n(){o.cancel()}function r(){e.removeListener("destroyed",n),t.removeListener("destroyed",n)}var o=this;e.once("destroyed",n),t.once("destroyed",n),this.then(r,r)},n.toPouch=u,n.replicate=f},{14:14,36:36,40:40}],33:[function(e,t,n){"use strict";var r=e(15),o=e(36),i=e(40).EventEmitter;r.adapters={},r.preferredAdapters=[],r.prefix="_pouch_";var s=new i,a=["on","addListener","emit","listeners","once","removeAllListeners","removeListener","setMaxListeners"];a.forEach(function(e){r[e]=s[e].bind(s)}),r.setMaxListeners(0),r.parseAdapter=function(e,t){var n,i,s=e.match(/([a-z\-]*):\/\/(.*)/);if(s){if(e=/http(s?)/.test(s[1])?s[1]+"://"+s[2]:s[2],n=s[1],!r.adapters[n].valid())throw"Invalid adapter";return{name:e,adapter:s[1]}}var a="idb"in r.adapters&&"websql"in r.adapters&&o.hasLocalStorage()&&localStorage["_pouch__websqldb_"+r.prefix+e];if(t.adapter)i=t.adapter;else if("undefined"!=typeof t&&t.db)i="leveldb";else for(var c=0;c<r.preferredAdapters.length;++c)if(i=r.preferredAdapters[c],i in r.adapters){if(a&&"idb"===i){console.log('PouchDB is downgrading "'+e+'" to WebSQL to avoid data loss, because it was already opened with WebSQL.');continue}break}n=r.adapters[i];var u=n&&"use_prefix"in n?n.use_prefix:!0;return{name:u?r.prefix+e:e,adapter:i}},r.destroy=o.toPromise(function(e,t,n){console.log("PouchDB.destroy() is deprecated and will be removed. Please use db.destroy() instead."),("function"==typeof t||"undefined"==typeof t)&&(n=t,t={}),e&&"object"==typeof e&&(t=e,e=void 0),new r(e,t,function(e,t){return e?n(e):void t.destroy(n)})}),r.adapter=function(e,t,n){t.valid()&&(r.adapters[e]=t,n&&r.preferredAdapters.push(e))},r.plugin=function(e){Object.keys(e).forEach(function(t){r.prototype[t]=e[t]})},r.defaults=function(e){function t(t,n,i){("function"==typeof n||"undefined"==typeof n)&&(i=n,n={}),t&&"object"==typeof t&&(n=t,t=void 0),n=o.extend(!0,{},e,n),r.call(this,t,n,i)}return o.inherits(t,r),t.destroy=o.toPromise(function(t,n,i){return("function"==typeof n||"undefined"==typeof n)&&(i=n,n={}),t&&"object"==typeof t&&(n=t,t=void 0),n=o.extend(!0,{},e,n),r.destroy(t,n,i)}),a.forEach(function(e){t[e]=s[e].bind(s)}),t.setMaxListeners(0),t.preferredAdapters=r.preferredAdapters.slice(),Object.keys(r).forEach(function(e){e in t||(t[e]=r[e])}),t},t.exports=r},{15:15,36:36,40:40}],34:[function(e,t,n){"use strict";function r(e,t,n,r){return"function"==typeof n&&(r=n,n={}),"undefined"==typeof n&&(n={}),n=i.clone(n),n.PouchConstructor=n.PouchConstructor||this,e=s.toPouch(e,n),t=s.toPouch(t,n),new o(e,t,n,r)}function o(e,t,n,r){function o(e){v||(v=!0,d.emit("cancel",e))}function s(e){d.emit("change",{direction:"pull",change:e})}function c(e){d.emit("change",{direction:"push",change:e})}function u(e){d.emit("denied",{direction:"push",doc:e})}function f(e){d.emit("denied",{direction:"pull",doc:e})}function l(e){return function(t,n){var r="change"===t&&(n===s||n===c),i="cancel"===t&&n===o,a=t in _&&n===_[t];(r||i||a)&&(t in m||(m[t]={}),m[t][e]=!0,2===Object.keys(m[t]).length&&d.removeAllListeners(t))}}var d=this;this.canceled=!1;var p,h;"onChange"in n&&(p=n.onChange,delete n.onChange),"function"!=typeof r||n.complete?"complete"in n&&(h=n.complete,delete n.complete):h=r,this.push=a(e,t,n),this.pull=a(t,e,n);var v=!1,_={},m={};n.live&&(this.push.on("complete",d.pull.cancel.bind(d.pull)),this.pull.on("complete",d.push.cancel.bind(d.push))),this.on("newListener",function(e){"change"===e?(d.pull.on("change",s),d.push.on("change",c)):"denied"===e?(d.pull.on("denied",f),d.push.on("denied",u)):"cancel"===e?(d.pull.on("cancel",o),d.push.on("cancel",o)):"error"===e||"removeListener"===e||"complete"===e||e in _||(_[e]=function(t){d.emit(e,t)},d.pull.on(e,_[e]),d.push.on(e,_[e]))}),this.on("removeListener",function(e){"change"===e?(d.pull.removeListener("change",s),d.push.removeListener("change",c)):"cancel"===e?(d.pull.removeListener("cancel",o),d.push.removeListener("cancel",o)):e in _&&"function"==typeof _[e]&&(d.pull.removeListener(e,_[e]),d.push.removeListener(e,_[e]),delete _[e])}),this.pull.on("removeListener",l("pull")),this.push.on("removeListener",l("push"));var g=i.Promise.all([this.push,this.pull]).then(function(e){var t={push:e[0],pull:e[1]};return d.emit("complete",t),h&&h(null,t),d.removeAllListeners(),t},function(e){throw d.cancel(),d.emit("error",e),h&&h(e),d.removeAllListeners(),e});this.then=function(e,t){return g.then(e,t)},this["catch"]=function(e){return g["catch"](e)}}var i=e(36),s=e(32),a=s.replicate,c=e(40).EventEmitter;i.inherits(o,c),t.exports=r,o.prototype.cancel=function(){this.canceled||(this.canceled=!0,this.push.cancel(),this.pull.cancel())}},{32:32,36:36,40:40}],35:[function(e,t,n){"use strict";function r(){this.isReady=!1,this.failed=!1,this.queue=[]}t.exports=r,r.prototype.execute=function(){var e,t;if(this.failed)for(;e=this.queue.shift();)"function"!=typeof e?(t=e.parameters[e.parameters.length-1],"function"==typeof t?t(this.failed):"changes"===e.name&&"function"==typeof t.complete&&t.complete(this.failed)):e(this.failed);else if(this.isReady)for(;e=this.queue.shift();)"function"==typeof e?e():e.task=this.db[e.name].apply(this.db,e.parameters)},r.prototype.fail=function(e){this.failed=e,this.execute()},r.prototype.ready=function(e){return this.failed?!1:0===arguments.length?this.isReady:(this.isReady=e?!0:!1,this.db=e,void this.execute())},r.prototype.addTask=function(e,t){if("function"!=typeof e){var n={name:e,parameters:t};return this.queue.push(n),this.failed&&this.execute(),n}this.queue.push(e),this.failed&&this.execute()}},{}],36:[function(e,t,n){(function(t){function r(){return"undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage&&"undefined"!=typeof chrome.storage.local}function o(){if(!(this instanceof o))return new o;var e=this;c.call(this),this.isChrome=r(),this.listeners={},this.hasLocal=!1,this.isChrome||(this.hasLocal=n.hasLocalStorage()),this.isChrome?chrome.storage.onChanged.addListener(function(t){null!=t.db_name&&e.emit(t.dbName.newValue)}):this.hasLocal&&("undefined"!=typeof addEventListener?addEventListener("storage",function(t){e.emit(t.key)}):window.attachEvent("storage",function(t){e.emit(t.key)}))}var i=e(31);n.extend=e(67),n.ajax=e(16),n.createBlob=e(17),n.uuid=e(28),n.getArguments=e(38);var s=e(18),a=e(19),c=e(40).EventEmitter,u=e(66);n.Map=u.Map,n.Set=u.Set;var f=e(22),l=e(25);n.Promise=l,n.lastIndexOf=function(e,t){for(var n=e.length-1;n>=0;n--)if(e.charAt(n)===t)return n;return-1},n.clone=function(e){return n.extend(!0,{},e)},n.pick=function(e,t){for(var n={},r=0,o=t.length;o>r;r++){
var i=t[r];n[i]=e[i]}return n},n.inherits=e(45),n.call=n.getArguments(function(e){if(e.length){var t=e.shift();"function"==typeof t&&t.apply(this,e)}}),n.isLocalId=function(e){return/^_local/.test(e)},n.isDeleted=function(e,t){t||(t=i.winningRev(e));var n=t.indexOf("-");-1!==n&&(t=t.substring(n+1));var r=!1;return i.traverseRevTree(e.rev_tree,function(e,n,o,i,s){o===t&&(r=!!s.deleted)}),r},n.revExists=function(e,t){var n=!1;return i.traverseRevTree(e.rev_tree,function(e,r,o){r+"-"+o===t&&(n=!0)}),n},n.filterChange=function(e){var t={},n=e.filter&&"function"==typeof e.filter;return t.query=e.query_params,function(r){if(r.doc||(r.doc={}),e.filter&&n&&!e.filter.call(this,r.doc,t))return!1;if(e.include_docs){if(!e.attachments)for(var o in r.doc._attachments)r.doc._attachments.hasOwnProperty(o)&&(r.doc._attachments[o].stub=!0)}else delete r.doc;return!0}},n.parseDoc=f.parseDoc,n.invalidIdError=f.invalidIdError,n.isCordova=function(){return"undefined"!=typeof cordova||"undefined"!=typeof PhoneGap||"undefined"!=typeof phonegap},n.hasLocalStorage=function(){if(r())return!1;try{return localStorage}catch(e){return!1}},n.Changes=o,n.inherits(o,c),o.prototype.addListener=function(e,r,o,i){function s(){if(a.listeners[r]){if(c)return void(c="waiting");c=!0,o.changes({style:i.style,include_docs:i.include_docs,attachments:i.attachments,conflicts:i.conflicts,continuous:!1,descending:!1,filter:i.filter,doc_ids:i.doc_ids,view:i.view,since:i.since,query_params:i.query_params}).on("change",function(e){e.seq>i.since&&!i.cancelled&&(i.since=e.seq,n.call(i.onChange,e))}).on("complete",function(){"waiting"===c&&t.nextTick(function(){a.notify(e)}),c=!1}).on("error",function(){c=!1})}}if(!this.listeners[r]){var a=this,c=!1;this.listeners[r]=s,this.on(e,s)}},o.prototype.removeListener=function(e,t){t in this.listeners&&c.prototype.removeListener.call(this,e,this.listeners[t])},o.prototype.notifyLocalWindows=function(e){this.isChrome?chrome.storage.local.set({dbName:e}):this.hasLocal&&(localStorage[e]="a"===localStorage[e]?"b":"a")},o.prototype.notify=function(e){this.emit(e),this.notifyLocalWindows(e)},"function"==typeof atob?n.atob=function(e){return atob(e)}:n.atob=function(e){var t=new s(e,"base64");if(t.toString("base64")!==e)throw"Cannot base64 encode full string";return t.toString("binary")},"function"==typeof btoa?n.btoa=function(e){return btoa(e)}:n.btoa=function(e){return new s(e,"binary").toString("base64")},n.fixBinary=function(e){if(!t.browser)return e;for(var n=e.length,r=new ArrayBuffer(n),o=new Uint8Array(r),i=0;n>i;i++)o[i]=e.charCodeAt(i);return r},n.readAsBinaryString=function(e,t){var r=new FileReader,o="function"==typeof r.readAsBinaryString;r.onloadend=function(e){var r=e.target.result||"";return o?t(r):void t(n.arrayBufferToBinaryString(r))},o?r.readAsBinaryString(e):r.readAsArrayBuffer(e)},n.readAsArrayBuffer=function(e,t){var n=new FileReader;n.onloadend=function(e){var n=e.target.result||new ArrayBuffer(0);t(n)},n.readAsArrayBuffer(e)},n.once=function(e){var t=!1;return n.getArguments(function(n){if(t)throw new Error("once called  more than once");t=!0,e.apply(this,n)})},n.toPromise=function(e){return n.getArguments(function(r){var o,i=this,s="function"==typeof r[r.length-1]?r.pop():!1;s&&(o=function(e,n){t.nextTick(function(){s(e,n)})});var a=new l(function(t,o){var s;try{var a=n.once(function(e,n){e?o(e):t(n)});r.push(a),s=e.apply(i,r),s&&"function"==typeof s.then&&t(s)}catch(c){o(c)}});return o&&a.then(function(e){o(null,e)},o),a.cancel=function(){return this},a})},n.adapterFun=function(t,r){function o(e,t,n){if(i.enabled){for(var r=[e._db_name,t],o=0;o<n.length-1;o++)r.push(n[o]);i.apply(null,r);var s=n[n.length-1];n[n.length-1]=function(n,r){var o=[e._db_name,t];o=o.concat(n?["error",n]:["success",r]),i.apply(null,o),s(n,r)}}}var i=e(42)("pouchdb:api");return n.toPromise(n.getArguments(function(e){if(this._closed)return l.reject(new Error("database is closed"));var n=this;return o(n,t,e),this.taskqueue.isReady?r.apply(this,e):new l(function(r,o){n.taskqueue.addTask(function(i){i?o(i):r(n[t].apply(n,e))})})}))},n.arrayBufferToBinaryString=function(e){for(var t="",n=new Uint8Array(e),r=n.byteLength,o=0;r>o;o++)t+=String.fromCharCode(n[o]);return t},n.cancellableFun=function(e,t,r){r=r?n.clone(!0,{},r):{};var o=new c,i=r.complete||function(){},s=r.complete=n.once(function(e,t){e?i(e):(o.emit("end",t),i(null,t)),o.removeAllListeners()}),a=r.onChange||function(){},u=0;t.on("destroyed",function(){o.removeAllListeners()}),r.onChange=function(e){a(e),e.seq<=u||(u=e.seq,o.emit("change",e),e.deleted?o.emit("delete",e):1===e.changes.length&&"1-"===e.changes[0].rev.slice(0,1)?o.emit("create",e):o.emit("update",e))};var f=new l(function(e,t){r.complete=function(n,r){n?t(n):e(r)}});return f.then(function(e){s(null,e)},s),f.cancel=function(){f.isCancelled=!0,t.taskqueue.isReady&&r.complete(null,{status:"cancelled"})},t.taskqueue.isReady?e(t,r,f):t.taskqueue.addTask(function(){f.isCancelled?r.complete(null,{status:"cancelled"}):e(t,r,f)}),f.on=o.on.bind(o),f.once=o.once.bind(o),f.addListener=o.addListener.bind(o),f.removeListener=o.removeListener.bind(o),f.removeAllListeners=o.removeAllListeners.bind(o),f.setMaxListeners=o.setMaxListeners.bind(o),f.listeners=o.listeners.bind(o),f.emit=o.emit.bind(o),f},n.MD5=n.toPromise(e(21)),n.explain404=e(20),n.info=function(e){"undefined"!=typeof console&&"info"in console&&console.info(e)},n.parseUri=e(24),n.compare=function(e,t){return t>e?-1:e>t?1:0},n.updateDoc=function(e,t,r,o,s,c,u){if(n.revExists(e,t.metadata.rev))return r[o]=t,s();var f=i.winningRev(e),l=n.isDeleted(e,f),d=n.isDeleted(t.metadata),p=/^1-/.test(t.metadata.rev);if(l&&!d&&u&&p){var h=t.data;h._rev=f,h._id=t.metadata.id,t=n.parseDoc(h,u)}var v=i.merge(e.rev_tree,t.metadata.rev_tree[0],1e3),_=u&&(l&&d||!l&&"new_leaf"!==v.conflicts||l&&!d&&"new_branch"===v.conflicts);if(_){var m=a.error(a.REV_CONFLICT);return r[o]=m,s()}var g=t.metadata.rev;t.metadata.rev_tree=v.tree,e.rev_map&&(t.metadata.rev_map=e.rev_map);var y=i.winningRev(t.metadata),b=n.isDeleted(t.metadata,y),E=l===b?0:b>l?-1:1,w=n.isDeleted(t.metadata,g);c(t,y,b,w,!0,E,o,s)},n.processDocs=function(e,t,r,o,s,c,u,f){function l(e,t,r){var o=i.winningRev(e.metadata),f=n.isDeleted(e.metadata,o);if("was_delete"in u&&f)return s[t]=a.error(a.MISSING_DOC,"deleted"),r();var l=f?0:1;c(e,o,f,f,!1,l,t,r)}function d(){++v===_&&f&&f()}if(e.length){var p=u.new_edits,h=new n.Map,v=0,_=e.length;e.forEach(function(e,r){if(e._id&&n.isLocalId(e._id))return void t[e._deleted?"_removeLocal":"_putLocal"](e,{ctx:o},function(e){e?s[r]=e:s[r]={ok:!0},d()});var i=e.metadata.id;h.has(i)?(_--,h.get(i).push([e,r])):h.set(i,[[e,r]])}),h.forEach(function(e,t){function o(){++a<e.length?i():d()}function i(){var i=e[a],u=i[0],f=i[1];r.has(t)?n.updateDoc(r.get(t),u,s,f,o,c,p):l(u,f,o)}var a=0;i()})}},n.preprocessAttachments=function(e,t,r){function o(e){try{return n.atob(e)}catch(t){var r=a.error(a.BAD_ARG,"Attachments need to be base64 encoded");return{error:r}}}function i(e,r){if(e.stub)return r();if("string"==typeof e.data){var i=o(e.data);if(i.error)return r(i.error);e.length=i.length,"blob"===t?e.data=n.createBlob([n.fixBinary(i)],{type:e.content_type}):"base64"===t?e.data=n.btoa(i):e.data=i,n.MD5(i).then(function(t){e.digest="md5-"+t,r()})}else n.readAsArrayBuffer(e.data,function(o){"binary"===t?e.data=n.arrayBufferToBinaryString(o):"base64"===t&&(e.data=n.btoa(n.arrayBufferToBinaryString(o))),n.MD5(o).then(function(t){e.digest="md5-"+t,e.length=o.byteLength,r()})})}function s(){u++,e.length===u&&(c?r(c):r())}if(!e.length)return r();var c,u=0;e.forEach(function(e){function t(e){c=e,r++,r===n.length&&s()}var n=e.data&&e.data._attachments?Object.keys(e.data._attachments):[],r=0;if(!n.length)return s();for(var o in e.data._attachments)e.data._attachments.hasOwnProperty(o)&&i(e.data._attachments[o],t)})},n.compactTree=function(e){var t=[];return i.traverseRevTree(e.rev_tree,function(e,n,r,o,i){"available"!==i.status||e||(t.push(n+"-"+r),i.status="missing")}),t};var d=e(76);n.safeJsonParse=function(e){try{return JSON.parse(e)}catch(t){return d.parse(e)}},n.safeJsonStringify=function(e){try{return JSON.stringify(e)}catch(t){return d.stringify(e)}}}).call(this,e(41))},{16:16,17:17,18:18,19:19,20:20,21:21,22:22,24:24,25:25,28:28,31:31,38:38,40:40,41:41,42:42,45:45,66:66,67:67,76:76}],37:[function(e,t,n){t.exports="3.4.1-prerelease"},{}],38:[function(e,t,n){"use strict";function r(e){return function(){var t=arguments.length;if(t){for(var n=[],r=-1;++r<t;)n[r]=arguments[r];return e.call(this,n)}return e.call(this,[])}}t.exports=r},{}],39:[function(e,t,n){},{}],40:[function(e,t,n){function r(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function o(e){return"function"==typeof e}function i(e){return"number"==typeof e}function s(e){return"object"==typeof e&&null!==e}function a(e){return void 0===e}t.exports=r,r.EventEmitter=r,r.prototype._events=void 0,r.prototype._maxListeners=void 0,r.defaultMaxListeners=10,r.prototype.setMaxListeners=function(e){if(!i(e)||0>e||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},r.prototype.emit=function(e){var t,n,r,i,c,u;if(this._events||(this._events={}),"error"===e&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;throw TypeError('Uncaught, unspecified "error" event.')}if(n=this._events[e],a(n))return!1;if(o(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:for(r=arguments.length,i=new Array(r-1),c=1;r>c;c++)i[c-1]=arguments[c];n.apply(this,i)}else if(s(n)){for(r=arguments.length,i=new Array(r-1),c=1;r>c;c++)i[c-1]=arguments[c];for(u=n.slice(),r=u.length,c=0;r>c;c++)u[c].apply(this,i)}return!0},r.prototype.addListener=function(e,t){var n;if(!o(t))throw TypeError("listener must be a function");if(this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,o(t.listener)?t.listener:t),this._events[e]?s(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,s(this._events[e])&&!this._events[e].warned){var n;n=a(this._maxListeners)?r.defaultMaxListeners:this._maxListeners,n&&n>0&&this._events[e].length>n&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())}return this},r.prototype.on=r.prototype.addListener,r.prototype.once=function(e,t){function n(){this.removeListener(e,n),r||(r=!0,t.apply(this,arguments))}if(!o(t))throw TypeError("listener must be a function");var r=!1;return n.listener=t,this.on(e,n),this},r.prototype.removeListener=function(e,t){var n,r,i,a;if(!o(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(n=this._events[e],i=n.length,r=-1,n===t||o(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(s(n)){for(a=i;a-->0;)if(n[a]===t||n[a].listener&&n[a].listener===t){r=a;break}if(0>r)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},r.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[e],o(n))this.removeListener(e,n);else for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},r.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?o(this._events[e])?[this._events[e]]:this._events[e].slice():[]},r.listenerCount=function(e,t){var n;return n=e._events&&e._events[t]?o(e._events[t])?1:e._events[t].length:0}},{}],41:[function(e,t,n){function r(){if(!a){a=!0;for(var e,t=s.length;t;){e=s,s=[];for(var n=-1;++n<t;)e[n]();t=s.length}a=!1}}function o(){}var i=t.exports={},s=[],a=!1;i.nextTick=function(e){s.push(e),a||setTimeout(r,0)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=o,i.addListener=o,i.once=o,i.off=o,i.removeListener=o,i.removeAllListeners=o,i.emit=o,i.binding=function(e){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}],42:[function(e,t,n){function r(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}function o(){var e=arguments,t=this.useColors;if(e[0]=(t?"%c":"")+this.namespace+(t?" %c":" ")+e[0]+(t?"%c ":" ")+"+"+n.humanize(this.diff),!t)return e;var r="color: "+this.color;e=[e[0],r,"color: inherit"].concat(Array.prototype.slice.call(e,1));var o=0,i=0;return e[0].replace(/%[a-z%]/g,function(e){"%"!==e&&(o++,"%c"===e&&(i=o))}),e.splice(i,0,r),e}function i(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function s(e){try{null==e?u.removeItem("debug"):u.debug=e}catch(t){}}function a(){var e;try{e=u.debug}catch(t){}return e}function c(){try{return window.localStorage}catch(e){}}n=t.exports=e(43),n.log=i,n.formatArgs=o,n.save=s,n.load=a,n.useColors=r;var u;u="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:c(),n.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],n.formatters.j=function(e){return JSON.stringify(e)},n.enable(a())},{43:43}],43:[function(e,t,n){function r(){return n.colors[f++%n.colors.length]}function o(e){function t(){}function o(){var e=o,t=+new Date,i=t-(u||t);e.diff=i,e.prev=u,e.curr=t,u=t,null==e.useColors&&(e.useColors=n.useColors()),null==e.color&&e.useColors&&(e.color=r());var s=Array.prototype.slice.call(arguments);s[0]=n.coerce(s[0]),"string"!=typeof s[0]&&(s=["%o"].concat(s));var a=0;s[0]=s[0].replace(/%([a-z%])/g,function(t,r){if("%"===t)return t;a++;var o=n.formatters[r];if("function"==typeof o){var i=s[a];t=o.call(e,i),s.splice(a,1),a--}return t}),"function"==typeof n.formatArgs&&(s=n.formatArgs.apply(e,s));var c=o.log||n.log||console.log.bind(console);c.apply(e,s)}t.enabled=!1,o.enabled=!0;var i=n.enabled(e)?o:t;return i.namespace=e,i}function i(e){n.save(e);for(var t=(e||"").split(/[\s,]+/),r=t.length,o=0;r>o;o++)t[o]&&(e=t[o].replace(/\*/g,".*?"),"-"===e[0]?n.skips.push(new RegExp("^"+e.substr(1)+"$")):n.names.push(new RegExp("^"+e+"$")))}function s(){n.enable("")}function a(e){var t,r;for(t=0,r=n.skips.length;r>t;t++)if(n.skips[t].test(e))return!1;for(t=0,r=n.names.length;r>t;t++)if(n.names[t].test(e))return!0;return!1}function c(e){return e instanceof Error?e.stack||e.message:e}n=t.exports=o,n.coerce=c,n.disable=s,n.enable=i,n.enabled=a,n.humanize=e(44),n.names=[],n.skips=[],n.formatters={};var u,f=0},{44:44}],44:[function(e,t,n){function r(e){var t=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(t){var n=parseFloat(t[1]),r=(t[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return n*l;case"days":case"day":case"d":return n*f;case"hours":case"hour":case"hrs":case"hr":case"h":return n*u;case"minutes":case"minute":case"mins":case"min":case"m":return n*c;case"seconds":case"second":case"secs":case"sec":case"s":return n*a;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n}}}function o(e){return e>=f?Math.round(e/f)+"d":e>=u?Math.round(e/u)+"h":e>=c?Math.round(e/c)+"m":e>=a?Math.round(e/a)+"s":e+"ms"}function i(e){return s(e,f,"day")||s(e,u,"hour")||s(e,c,"minute")||s(e,a,"second")||e+" ms"}function s(e,t,n){return t>e?void 0:1.5*t>e?Math.floor(e/t)+" "+n:Math.ceil(e/t)+" "+n+"s"}var a=1e3,c=60*a,u=60*c,f=24*u,l=365.25*f;t.exports=function(e,t){return t=t||{},"string"==typeof e?r(e):t["long"]?i(e):o(e)}},{}],45:[function(e,t,n){"function"==typeof Object.create?t.exports=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(e,t){e.super_=t;var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e}},{}],46:[function(e,t,n){"use strict";function r(){}t.exports=r},{}],47:[function(e,t,n){"use strict";function r(e){function t(e,t){function o(e){u[t]=e,++f===n&!r&&(r=!0,c.resolve(d,u))}s(e).then(o,function(e){r||(r=!0,c.reject(d,e))})}if("[object Array]"!==Object.prototype.toString.call(e))return i(new TypeError("must be an array"));var n=e.length,r=!1;if(!n)return s([]);for(var u=new Array(n),f=0,l=-1,d=new o(a);++l<n;)t(e[l],l);return d}var o=e(50),i=e(53),s=e(54),a=e(46),c=e(48);t.exports=r},{46:46,48:48,50:50,53:53,54:54}],48:[function(e,t,n){"use strict";function r(e){var t=e&&e.then;return e&&"object"==typeof e&&"function"==typeof t?function(){t.apply(e,arguments)}:void 0}var o=e(57),i=e(55),s=e(56);n.resolve=function(e,t){var a=o(r,t);if("error"===a.status)return n.reject(e,a.value);var c=a.value;if(c)i.safely(e,c);else{e.state=s.FULFILLED,e.outcome=t;for(var u=-1,f=e.queue.length;++u<f;)e.queue[u].callFulfilled(t)}return e},n.reject=function(e,t){e.state=s.REJECTED,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e}},{55:55,56:56,57:57}],49:[function(e,t,n){t.exports=n=e(50),n.resolve=e(54),n.reject=e(53),n.all=e(47),n.race=e(52)},{47:47,50:50,52:52,53:53,54:54}],50:[function(e,t,n){"use strict";function r(e){if(!(this instanceof r))return new r(e);if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=a.PENDING,this.queue=[],this.outcome=void 0,e!==i&&s.safely(this,e)}var o=e(58),i=e(46),s=e(55),a=e(56),c=e(51);t.exports=r,r.prototype["catch"]=function(e){return this.then(null,e)},r.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a.FULFILLED||"function"!=typeof t&&this.state===a.REJECTED)return this;var n=new r(i);if(this.state!==a.PENDING){var s=this.state===a.FULFILLED?e:t;o(n,s,this.outcome)}else this.queue.push(new c(n,e,t));return n}},{46:46,51:51,55:55,56:56,58:58}],51:[function(e,t,n){"use strict";function r(e,t,n){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof n&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}var o=e(48),i=e(58);t.exports=r,r.prototype.callFulfilled=function(e){o.resolve(this.promise,e)},r.prototype.otherCallFulfilled=function(e){i(this.promise,this.onFulfilled,e)},r.prototype.callRejected=function(e){o.reject(this.promise,e)},r.prototype.otherCallRejected=function(e){i(this.promise,this.onRejected,e)}},{48:48,58:58}],52:[function(e,t,n){"use strict";function r(e){function t(e){s(e).then(function(e){r||(r=!0,c.resolve(f,e))},function(e){r||(r=!0,c.reject(f,e))})}if("[object Array]"!==Object.prototype.toString.call(e))return i(new TypeError("must be an array"));var n=e.length,r=!1;if(!n)return s([]);for(var u=-1,f=new o(a);++u<n;)t(e[u]);return f}var o=e(50),i=e(53),s=e(54),a=e(46),c=e(48);t.exports=r},{46:46,48:48,50:50,53:53,54:54}],53:[function(e,t,n){"use strict";function r(e){var t=new o(i);return s.reject(t,e)}var o=e(50),i=e(46),s=e(48);t.exports=r},{46:46,48:48,50:50}],54:[function(e,t,n){"use strict";function r(e){if(e)return e instanceof o?e:s.resolve(new o(i),e);var t=typeof e;switch(t){case"boolean":return a;case"undefined":return u;case"object":return c;case"number":return f;case"string":return l}}var o=e(50),i=e(46),s=e(48);t.exports=r;var a=s.resolve(new o(i),!1),c=s.resolve(new o(i),null),u=s.resolve(new o(i),void 0),f=s.resolve(new o(i),0),l=s.resolve(new o(i),"")},{46:46,48:48,50:50}],55:[function(e,t,n){"use strict";function r(e,t){function n(t){a||(a=!0,o.reject(e,t))}function r(t){a||(a=!0,o.resolve(e,t))}function s(){t(r,n)}var a=!1,c=i(s);"error"===c.status&&n(c.value)}var o=e(48),i=e(57);n.safely=r},{48:48,57:57}],56:[function(e,t,n){n.REJECTED=["REJECTED"],n.FULFILLED=["FULFILLED"],n.PENDING=["PENDING"]},{}],57:[function(e,t,n){"use strict";function r(e,t){var n={};try{n.value=e(t),n.status="success"}catch(r){n.status="error",n.value=r}return n}t.exports=r},{}],58:[function(e,t,n){"use strict";function r(e,t,n){o(function(){var r;try{r=t(n)}catch(o){return i.reject(e,o)}r===e?i.reject(e,new TypeError("Cannot resolve promise with itself")):i.resolve(e,r)})}var o=e(59),i=e(48);t.exports=r},{48:48,59:59}],59:[function(e,t,n){"use strict";function r(){s=!1,a&&a.length?l=a.concat(l):f=-1,l.length&&o()}function o(){s=!0;for(var e=l.length,t=setTimeout(r);e;){for(a=l,l=[];++f<e;)a[f]();f=-1,e=l.length}f=-1,s=!1,clearTimeout(t)}function i(e){1!==l.push(e)||s||c()}for(var s,a,c,u=[e(39),e(61),e(60),e(62),e(63)],f=-1,l=[],d=-1,p=u.length;++d<p;)if(u[d]&&u[d].test&&u[d].test()){c=u[d].install(o);break}t.exports=i},{39:39,60:60,61:61,62:62,63:63}],60:[function(e,t,n){(function(e){"use strict";n.test=function(){return e.setImmediate?!1:"undefined"!=typeof e.MessageChannel},n.install=function(t){var n=new e.MessageChannel;return n.port1.onmessage=t,function(){n.port2.postMessage(0)}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],61:[function(e,t,n){(function(e){"use strict";var t=e.MutationObserver||e.WebKitMutationObserver;n.test=function(){return t},n.install=function(n){var r=0,o=new t(n),i=e.document.createTextNode("");return o.observe(i,{characterData:!0}),function(){i.data=r=++r%2}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],62:[function(e,t,n){(function(e){"use strict";n.test=function(){return"document"in e&&"onreadystatechange"in e.document.createElement("script")},n.install=function(t){return function(){var n=e.document.createElement("script");return n.onreadystatechange=function(){t(),n.onreadystatechange=null,n.parentNode.removeChild(n),n=null},e.document.documentElement.appendChild(n),t}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],63:[function(e,t,n){"use strict";n.test=function(){return!0},n.install=function(e){return function(){setTimeout(e,0)}}},{}],64:[function(e,t,n){"use strict";function r(e){if(null!==e)switch(typeof e){case"boolean":return e?1:0;case"number":return f(e);case"string":return e.replace(/\u0002/g,"").replace(/\u0001/g,"").replace(/\u0000/g,"");case"object":var t=Array.isArray(e),r=t?e:Object.keys(e),o=-1,i=r.length,s="";if(t)for(;++o<i;)s+=n.toIndexableString(r[o]);else for(;++o<i;){var a=r[o];s+=n.toIndexableString(a)+n.toIndexableString(e[a])}return s}return""}function o(e,t){var n,r=t,o="1"===e[t];if(o)n=0,t++;else{var i="0"===e[t];t++;var s="",a=e.substring(t,t+d),c=parseInt(a,10)+l;for(i&&(c=-c),t+=d;;){var u=e[t];if("\x00"===u)break;s+=u,t++}s=s.split("."),n=1===s.length?parseInt(s,10):parseFloat(s[0]+"."+s[1]),i&&(n-=10),0!==c&&(n=parseFloat(n+"e"+c))}return{num:n,length:t-r}}function i(e,t){var n=e.pop();if(t.length){var r=t[t.length-1];n===r.element&&(t.pop(),r=t[t.length-1]);var o=r.element,i=r.index;if(Array.isArray(o))o.push(n);else if(i===e.length-2){var s=e.pop();o[s]=n}else e.push(n)}}function s(e,t){for(var r=Math.min(e.length,t.length),o=0;r>o;o++){var i=n.collate(e[o],t[o]);if(0!==i)return i}return e.length===t.length?0:e.length>t.length?1:-1}function a(e,t){return e===t?0:e>t?1:-1}function c(e,t){for(var r=Object.keys(e),o=Object.keys(t),i=Math.min(r.length,o.length),s=0;i>s;s++){var a=n.collate(r[s],o[s]);if(0!==a)return a;if(a=n.collate(e[r[s]],t[o[s]]),0!==a)return a}return r.length===o.length?0:r.length>o.length?1:-1}function u(e){var t=["boolean","number","string","object"],n=t.indexOf(typeof e);return~n?null===e?1:Array.isArray(e)?5:3>n?n+2:n+3:Array.isArray(e)?5:void 0}function f(e){if(0===e)return"1";var t=e.toExponential().split(/e\+?/),n=parseInt(t[1],10),r=0>e,o=r?"0":"2",i=(r?-n:n)-l,s=h.padLeft(i.toString(),"0",d);o+=p+s;var a=Math.abs(parseFloat(t[0]));r&&(a=10-a);var c=a.toFixed(20);return c=c.replace(/\.?0+$/,""),o+=p+c}var l=-324,d=3,p="",h=e(65);n.collate=function(e,t){if(e===t)return 0;e=n.normalizeKey(e),t=n.normalizeKey(t);var r=u(e),o=u(t);if(r-o!==0)return r-o;if(null===e)return 0;switch(typeof e){case"number":return e-t;case"boolean":return e===t?0:t>e?-1:1;case"string":return a(e,t)}return Array.isArray(e)?s(e,t):c(e,t)},n.normalizeKey=function(e){switch(typeof e){case"undefined":return null;case"number":return e===1/0||e===-(1/0)||isNaN(e)?null:e;case"object":var t=e;if(Array.isArray(e)){var r=e.length;e=new Array(r);for(var o=0;r>o;o++)e[o]=n.normalizeKey(t[o])}else{if(e instanceof Date)return e.toJSON();if(null!==e){e={};for(var i in t)if(t.hasOwnProperty(i)){var s=t[i];"undefined"!=typeof s&&(e[i]=n.normalizeKey(s))}}}}return e},n.toIndexableString=function(e){var t="\x00";return e=n.normalizeKey(e),u(e)+p+r(e)+t},n.parseIndexableString=function(e){for(var t=[],n=[],r=0;;){var s=e[r++];if("\x00"!==s)switch(s){case"1":t.push(null);break;case"2":t.push("1"===e[r]),r++;break;case"3":var a=o(e,r);t.push(a.num),r+=a.length;break;case"4":for(var c="";;){var u=e[r];if("\x00"===u)break;c+=u,r++}c=c.replace(/\u0001\u0001/g,"\x00").replace(/\u0001\u0002/g,"").replace(/\u0002\u0002/g,""),t.push(c);break;case"5":var f={element:[],index:t.length};t.push(f.element),n.push(f);break;case"6":var l={element:{},index:t.length};t.push(l.element),n.push(l);break;default:throw new Error("bad collationIndex or unexpectedly reached end of input: "+s)}else{if(1===t.length)return t.pop();i(t,n)}}}},{65:65}],65:[function(e,t,n){"use strict";function r(e,t,n){for(var r="",o=n-e.length;r.length<o;)r+=t;return r}n.padLeft=function(e,t,n){var o=r(e,t,n);return o+e},n.padRight=function(e,t,n){var o=r(e,t,n);return e+o},n.stringLexCompare=function(e,t){var n,r=e.length,o=t.length;for(n=0;r>n;n++){if(n===o)return 1;var i=e.charAt(n),s=t.charAt(n);if(i!==s)return s>i?-1:1}return o>r?-1:0},n.intToDecimalForm=function(e){var t=0>e,n="";do{var r=t?-Math.ceil(e%10):Math.floor(e%10);n=r+n,e=t?Math.ceil(e/10):Math.floor(e/10)}while(e);return t&&"0"!==n&&(n="-"+n),n}},{}],66:[function(e,t,n){"use strict";function r(){this.store={}}function o(e){if(this.store=new r,e&&Array.isArray(e))for(var t=0,n=e.length;n>t;t++)this.add(e[t])}n.Map=r,n.Set=o,r.prototype.mangle=function(e){if("string"!=typeof e)throw new TypeError("key must be a string but Got "+e);return"$"+e},r.prototype.unmangle=function(e){return e.substring(1)},r.prototype.get=function(e){var t=this.mangle(e);return t in this.store?this.store[t]:void 0},r.prototype.set=function(e,t){var n=this.mangle(e);return this.store[n]=t,!0},r.prototype.has=function(e){var t=this.mangle(e);return t in this.store},r.prototype["delete"]=function(e){var t=this.mangle(e);return t in this.store?(delete this.store[t],!0):!1},r.prototype.forEach=function(e){var t=this,n=Object.keys(t.store);n.forEach(function(n){var r=t.store[n];n=t.unmangle(n),e(r,n)})},o.prototype.add=function(e){return this.store.set(e,!0)},o.prototype.has=function(e){return this.store.has(e)},o.prototype["delete"]=function(e){return this.store["delete"](e)}},{}],67:[function(e,t,n){"use strict";function r(e){return null===e?String(e):"object"==typeof e||"function"==typeof e?u[p.call(e)]||"object":typeof e}function o(e){return null!==e&&e===e.window}function i(e){if(!e||"object"!==r(e)||e.nodeType||o(e))return!1;try{if(e.constructor&&!h.call(e,"constructor")&&!h.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}var n;for(n in e);return void 0===n||h.call(e,n)}function s(e){return"function"===r(e)}function a(){for(var e=[],t=-1,n=arguments.length,r=new Array(n);++t<n;)r[t]=arguments[t];var o={};e.push({args:r,result:{container:o,key:"key"}});for(var i;i=e.pop();)c(e,i.args,i.result);return o.key}function c(e,t,n){var r,o,a,c,u,f,l,d=t[0]||{},p=1,h=t.length,_=!1,m=/\d+/;for("boolean"==typeof d&&(_=d,d=t[1]||{},p=2),"object"==typeof d||s(d)||(d={}),h===p&&(d=this,--p);h>p;p++)if(null!=(r=t[p])){l=v(r);for(o in r)if(!(o in Object.prototype)){if(l&&!m.test(o))continue;if(a=d[o],c=r[o],d===c)continue;_&&c&&(i(c)||(u=v(c)))?(u?(u=!1,f=a&&v(a)?a:[]):f=a&&i(a)?a:{},e.push({args:[_,f,c],result:{container:d,key:o}})):void 0!==c&&(v(r)&&s(c)||(d[o]=c))}}n.container[n.key]=d}for(var u={},f=["Boolean","Number","String","Function","Array","Date","RegExp","Object","Error"],l=0;l<f.length;l++){var d=f[l];u["[object "+d+"]"]=d.toLowerCase()}var p=u.toString,h=u.hasOwnProperty,v=Array.isArray||function(e){return"array"===r(e)};t.exports=a},{}],68:[function(e,t,n){"use strict";var r=e(72),o=e(73),i=o.Promise;t.exports=function(e){var t=e.db,n=e.viewName,s=e.map,a=e.reduce,c=e.temporary,u=s.toString()+(a&&a.toString())+"undefined";if(!c&&t._cachedViews){var f=t._cachedViews[u];if(f)return i.resolve(f)}return t.info().then(function(e){function i(e){e.views=e.views||{};var t=n;-1===t.indexOf("/")&&(t=n+"/"+n);var r=e.views[t]=e.views[t]||{};if(!r[f])return r[f]=!0,e}var f=e.db_name+"-mrview-"+(c?"temp":o.MD5(u));return r(t,"_local/mrviews",i).then(function(){return t.registerDependentDatabase(f).then(function(e){var n=e.db;n.auto_compaction=!0;var r={name:f,db:n,sourceDB:t,adapter:t.adapter,mapFun:s,reduceFun:a};return r.db.get("_local/lastSeq")["catch"](function(e){if(404!==e.status)throw e}).then(function(e){return r.seq=e?e.seq:0,c||(t._cachedViews=t._cachedViews||{},t._cachedViews[u]=r,r.db.on("destroyed",function(){delete t._cachedViews[u]})),r})})})})}},{72:72,73:73}],69:[function(_dereq_,module,exports){"use strict";module.exports=function(func,emit,sum,log,isArray,toJSON){return eval("'use strict'; ("+func.replace(/;\s*$/,"")+");")}},{}],70:[function(e,t,n){(function(t){"use strict";function r(e){return-1===e.indexOf("/")?[e,e]:e.split("/")}function o(e){return 1===e.length&&/^1-/.test(e[0].rev)}function i(e,t){try{e.emit("error",t)}catch(n){console.error("The user's map/reduce function threw an uncaught error.\nYou can debug this error by doing:\nmyDatabase.on('error', function (err) { debugger; });\nPlease double-check your map/reduce function."),console.error(t)}}function s(e,t,n){try{return{output:t.apply(null,n)}}catch(r){return i(e,r),{error:r}}}function a(e,t){var n=I(e.key,t.key);return 0!==n?n:I(e.value,t.value)}function c(e,t,n){return n=n||0,"number"==typeof t?e.slice(n,t+n):n>0?e.slice(n):e}function u(e){var t=e.value,n=t&&"object"==typeof t&&t._id||e.id;return n}function f(e){var t="builtin "+e+" function requires map values to be numbers or number arrays";return new q(t)}function l(e){for(var t=0,n=0,r=e.length;r>n;n++){var o=e[n];if("number"!=typeof o){if(!Array.isArray(o))throw f("_sum");t="number"==typeof t?[t]:t;for(var i=0,s=o.length;s>i;i++){var a=o[i];if("number"!=typeof a)throw f("_sum");"undefined"==typeof t[i]?t.push(a):t[i]+=a}}else"number"==typeof t?t+=o:t[0]+=o}return t}function d(e,t,n,r){var o=t[e];"undefined"!=typeof o&&(r&&(o=encodeURIComponent(JSON.stringify(o))),n.push(e+"="+o))}function p(e,t){var n=e.descending?"endkey":"startkey",r=e.descending?"startkey":"endkey";if("undefined"!=typeof e[n]&&"undefined"!=typeof e[r]&&I(e[n],e[r])>0)throw new O("No rows can match your key range, reverse your start_key and end_key or set {descending : true}");if(t.reduce&&e.reduce!==!1){if(e.include_docs)throw new O("{include_docs:true} is invalid for reduce");if(e.keys&&e.keys.length>1&&!e.group&&!e.group_level)throw new O("Multi-key fetches for reduce views must use {group: true}")}if(e.group_level){
if("number"!=typeof e.group_level)throw new O('Invalid value for integer: "'+e.group_level+'"');if(e.group_level<0)throw new O('Invalid value for positive integer: "'+e.group_level+'"')}}function h(e,t,n){var o,i=[],s="GET";if(d("reduce",n,i),d("include_docs",n,i),d("attachments",n,i),d("limit",n,i),d("descending",n,i),d("group",n,i),d("group_level",n,i),d("skip",n,i),d("stale",n,i),d("conflicts",n,i),d("startkey",n,i,!0),d("endkey",n,i,!0),d("inclusive_end",n,i),d("key",n,i,!0),i=i.join("&"),i=""===i?"":"?"+i,"undefined"!=typeof n.keys){var a=2e3,c="keys="+encodeURIComponent(JSON.stringify(n.keys));c.length+i.length+1<=a?i+=("?"===i[0]?"&":"?")+c:(s="POST","string"==typeof t?o=JSON.stringify({keys:n.keys}):t.keys=n.keys)}if("string"==typeof t){var u=r(t);return e.request({method:s,url:"_design/"+u[0]+"/_view/"+u[1]+i,body:o})}return o=o||{},Object.keys(t).forEach(function(e){Array.isArray(t[e])?o[e]=t[e]:o[e]=t[e].toString()}),e.request({method:"POST",url:"_temp_view"+i,body:o})}function v(e){return function(t){if(404===t.status)return e;throw t}}function _(e,t,n){function r(){return o(l)?M.resolve(c):t.db.get(a)["catch"](v(c))}function i(e){return e.keys.length?t.db.allDocs({keys:e.keys,include_docs:!0}):M.resolve({rows:[]})}function s(e,t){for(var n=[],r={},o=0,i=t.rows.length;i>o;o++){var s=t.rows[o],a=s.doc;if(a&&(n.push(a),r[a._id]=!0,a._deleted=!f[a._id],!a._deleted)){var c=f[a._id];"value"in c&&(a.value=c.value)}}var u=Object.keys(f);return u.forEach(function(e){if(!r[e]){var t={_id:e},o=f[e];"value"in o&&(t.value=o.value),n.push(t)}}),e.keys=F.uniq(u.concat(e.keys)),n.push(e),n}var a="_local/doc_"+e,c={_id:a,keys:[]},u=n[e],f=u.indexableKeysToKeyValues,l=u.changes;return r().then(function(e){return i(e).then(function(t){return s(e,t)})})}function m(e,t,n){var r="_local/lastSeq";return e.db.get(r)["catch"](v({_id:r,seq:0})).then(function(r){var o=Object.keys(t);return M.all(o.map(function(n){return _(n,e,t)})).then(function(t){var o=F.flatten(t);return r.seq=n,o.push(r),e.db.bulkDocs({docs:o})})})}function g(e){var t="string"==typeof e?e:e.name,n=P[t];return n||(n=P[t]=new D),n}function y(e){return F.sequentialize(g(e),function(){return b(e)})()}function b(e){function t(e,t){var n={id:o._id,key:N(e)};"undefined"!=typeof t&&null!==t&&(n.value=N(t)),r.push(n)}function n(t,n){return function(){return m(e,t,n)}}var r,o,i;if("function"==typeof e.mapFun&&2===e.mapFun.length){var c=e.mapFun;i=function(e){return c(e,t)}}else i=B(e.mapFun.toString(),t,l,R,Array.isArray,JSON.parse);var u=e.seq||0,f=new D;return new M(function(t,c){function l(){f.finish().then(function(){e.seq=u,t()})}function d(){function t(e){c(e)}e.sourceDB.changes({conflicts:!0,include_docs:!0,style:"all_docs",since:u,limit:H}).on("complete",function(t){var c=t.results;if(!c.length)return l();for(var p={},h=0,v=c.length;v>h;h++){var _=c[h];if("_"!==_.doc._id[0]){r=[],o=_.doc,o._deleted||s(e.sourceDB,i,[o]),r.sort(a);for(var m,g={},y=0,b=r.length;b>y;y++){var E=r[y],w=[E.key,E.id];0===I(E.key,m)&&w.push(y);var S=L(w);g[S]=E,m=E.key}p[_.doc._id]={indexableKeysToKeyValues:g,changes:_.changes}}u=_.seq}return f.add(n(p,u)),c.length<H?l():d()}).on("error",t)}d()})}function E(e,t,n){0===n.group_level&&delete n.group_level;var r,o=n.group||n.group_level;r=J[e.reduceFun]?J[e.reduceFun]:B(e.reduceFun.toString(),null,l,R,Array.isArray,JSON.parse);var i=[],a=n.group_level;t.forEach(function(e){var t=i[i.length-1],n=o?e.key:null;return o&&Array.isArray(n)&&"number"==typeof a&&(n=n.length>a?n.slice(0,a):n),t&&0===I(t.key[0][0],n)?(t.key.push([n,e.id]),void t.value.push(e.value)):void i.push({key:[[n,e.id]],value:[e.value]})});for(var u=0,f=i.length;f>u;u++){var d=i[u],p=s(e.sourceDB,r,[d.key,d.value,!1]);if(p.error&&p.error instanceof q)throw p.error;d.value=p.error?null:p.output,d.key=d.key[0][0]}return{rows:c(i,n.limit,n.skip)}}function w(e,t){return F.sequentialize(g(e),function(){return S(e,t)})()}function S(e,t){function n(t){return t.include_docs=!0,e.db.allDocs(t).then(function(e){return o=e.total_rows,e.rows.map(function(e){if("value"in e.doc&&"object"==typeof e.doc.value&&null!==e.doc.value){var t=Object.keys(e.doc.value).sort(),n=["id","key","value"];if(!(n>t||t>n))return e.doc.value}var r=C.parseIndexableString(e.doc._id);return{key:r[0],id:r[1],value:"value"in e.doc?e.doc.value:null}})})}function r(n){var r;if(r=i?E(e,n,t):{total_rows:o,offset:s,rows:n},t.include_docs){var a=F.uniq(n.map(u));return e.sourceDB.allDocs({keys:a,include_docs:!0,conflicts:t.conflicts,attachments:t.attachments}).then(function(e){var t={};return e.rows.forEach(function(e){e.doc&&(t["$"+e.id]=e.doc)}),n.forEach(function(e){var n=u(e),r=t["$"+n];r&&(e.doc=r)}),r})}return r}var o,i=e.reduceFun&&t.reduce!==!1,s=t.skip||0;"undefined"==typeof t.keys||t.keys.length||(t.limit=0,delete t.keys);var a=function(e){return e.reduce(function(e,t){return e.concat(t)})};if("undefined"!=typeof t.keys){var c=t.keys,f=c.map(function(e){var t={startkey:L([e]),endkey:L([e,{}])};return n(t)});return M.all(f).then(a).then(r)}var l={descending:t.descending};if("undefined"!=typeof t.startkey&&(l.startkey=L(t.descending?[t.startkey,{}]:[t.startkey])),"undefined"!=typeof t.endkey){var d=t.inclusive_end!==!1;t.descending&&(d=!d),l.endkey=L(d?[t.endkey,{}]:[t.endkey])}if("undefined"!=typeof t.key){var p=L([t.key]),h=L([t.key,{}]);l.descending?(l.endkey=p,l.startkey=h):(l.startkey=p,l.endkey=h)}return i||("number"==typeof t.limit&&(l.limit=t.limit),l.skip=s),n(l).then(r)}function T(e){return e.request({method:"POST",url:"_view_cleanup"})}function A(e){return e.get("_local/mrviews").then(function(t){var n={};Object.keys(t.views).forEach(function(e){var t=r(e),o="_design/"+t[0],i=t[1];n[o]=n[o]||{},n[o][i]=!0});var o={keys:Object.keys(n),include_docs:!0};return e.allDocs(o).then(function(r){var o={};r.rows.forEach(function(e){var r=e.key.substring(8);Object.keys(n[e.key]).forEach(function(n){var i=r+"/"+n;t.views[i]||(i=n);var s=Object.keys(t.views[i]),a=e.doc&&e.doc.views&&e.doc.views[n];s.forEach(function(e){o[e]=o[e]||a})})});var i=Object.keys(o).filter(function(e){return!o[e]}),s=i.map(function(t){return F.sequentialize(g(t),function(){return new e.constructor(t,e.__opts).destroy()})()});return M.all(s).then(function(){return{ok:!0}})})},v({ok:!0}))}function x(e,n,o){if("http"===e.type())return h(e,n,o);if("string"!=typeof n){p(o,n);var i={db:e,viewName:"temp_view/temp_view",map:n.map,reduce:n.reduce,temporary:!0};return U.add(function(){return j(i).then(function(e){function t(){return e.db.destroy()}return F.fin(y(e).then(function(){return w(e,o)}),t)})}),U.finish()}var s=n,a=r(s),c=a[0],u=a[1];return e.get("_design/"+c).then(function(n){var r=n.views&&n.views[u];if(!r||"string"!=typeof r.map)throw new k("ddoc "+c+" has no view named "+u);p(o,r);var i={db:e,viewName:s,map:r.map,reduce:r.reduce};return j(i).then(function(e){return"ok"===o.stale||"update_after"===o.stale?("update_after"===o.stale&&t.nextTick(function(){y(e)}),w(e,o)):y(e).then(function(){return w(e,o)})})})}function O(e){this.status=400,this.name="query_parse_error",this.message=e,this.error=!0;try{Error.captureStackTrace(this,O)}catch(t){}}function k(e){this.status=404,this.name="not_found",this.message=e,this.error=!0;try{Error.captureStackTrace(this,k)}catch(t){}}function q(e){this.status=500,this.name="invalid_value",this.message=e,this.error=!0;try{Error.captureStackTrace(this,q)}catch(t){}}var R,C=e(64),D=e(71),I=C.collate,L=C.toIndexableString,N=C.normalizeKey,j=e(68),B=e(69);R="undefined"!=typeof console&&"function"==typeof console.log?Function.prototype.bind.call(console.log,console):function(){};var F=e(73),M=F.Promise,P={},U=new D,H=50,J={_sum:function(e,t){return l(t)},_count:function(e,t){return t.length},_stats:function(e,t){function n(e){for(var t=0,n=0,r=e.length;r>n;n++){var o=e[n];t+=o*o}return t}return{sum:l(t),min:Math.min.apply(null,t),max:Math.max.apply(null,t),count:t.length,sumsqr:n(t)}}};n.viewCleanup=F.callbackify(function(){var e=this;return"http"===e.type()?T(e):A(e)}),n.query=function(e,t,n){"function"==typeof t&&(n=t,t={}),t=F.extend(!0,{},t),"function"==typeof e&&(e={map:e});var r=this,o=M.resolve().then(function(){return x(r,e,t)});return F.promisedCallback(o,n),o},F.inherits(O,Error),F.inherits(k,Error),F.inherits(q,Error)}).call(this,e(41))},{41:41,64:64,68:68,69:69,71:71,73:73}],71:[function(e,t,n){"use strict";function r(){this.promise=new o(function(e){e()})}var o=e(73).Promise;r.prototype.add=function(e){return this.promise=this.promise["catch"](function(){}).then(function(){return e()}),this.promise},r.prototype.finish=function(){return this.promise},t.exports=r},{73:73}],72:[function(e,t,n){"use strict";var r=e(74).upsert;t.exports=function(e,t,n){return r.apply(e,[t,n])}},{74:74}],73:[function(e,t,n){(function(t,r){"use strict";"function"==typeof r.Promise?n.Promise=r.Promise:n.Promise=e(49),n.inherits=e(45),n.extend=e(67);var o=e(38);n.promisedCallback=function(e,n){return n&&e.then(function(e){t.nextTick(function(){n(null,e)})},function(e){t.nextTick(function(){n(e)})}),e},n.callbackify=function(e){return o(function(t){var r=t.pop(),o=e.apply(this,t);return"function"==typeof r&&n.promisedCallback(o,r),o})},n.fin=function(e,t){return e.then(function(e){var n=t();return"function"==typeof n.then?n.then(function(){return e}):e},function(e){var n=t();if("function"==typeof n.then)return n.then(function(){throw e});throw e})},n.sequentialize=function(e,t){return function(){var n=arguments,r=this;return e.add(function(){return t.apply(r,n)})}},n.flatten=function(e){for(var t=[],n=0,r=e.length;r>n;n++)t=t.concat(e[n]);return t},n.uniq=function(e){for(var t={},n=0,r=e.length;r>n;n++)t["$"+e[n]]=!0;var o=Object.keys(t),i=new Array(o.length);for(n=0,r=o.length;r>n;n++)i[n]=o[n].substring(1);return i};var i=e(39),s=e(75);n.MD5=function(e){return t.browser?s.hash(e):i.createHash("md5").update(e).digest("hex")}}).call(this,e(41),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{38:38,39:39,41:41,45:45,49:49,67:67,75:75}],74:[function(e,t,n){(function(t){"use strict";function r(e,t,n){return new i(function(r,i){return"string"!=typeof t?i(new Error("doc id is required")):void e.get(t,function(s,a){if(s){if(404!==s.status)return i(s);a={}}var c=a._rev,u=n(a);return u?(u._id=t,u._rev=c,void r(o(e,u,n))):r({updated:!1,rev:c})})})}function o(e,t,n){return e.put(t).then(function(e){return{updated:!0,rev:e.rev}},function(o){if(409!==o.status)throw o;return r(e,t._id,n)})}var i;i="undefined"!=typeof window&&window.PouchDB?window.PouchDB.utils.Promise:"function"==typeof t.Promise?t.Promise:e(49),n.upsert=function(e,t,n){var o=this,i=r(o,e,t);return"function"!=typeof n?i:void i.then(function(e){n(null,e)},n)},n.putIfNotExists=function(e,t,n){var o=this;"string"!=typeof e&&(n=t,t=e,e=t._id);var i=function(e){return e._rev?!1:t},s=r(o,e,i);return"function"!=typeof n?s:void s.then(function(e){n(null,e)},n)},"undefined"!=typeof window&&window.PouchDB&&window.PouchDB.plugin(n)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{49:49}],75:[function(e,t,n){!function(e){if("object"==typeof n)t.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var r;try{r=window}catch(o){r=self}r.SparkMD5=e()}}(function(e){"use strict";var t=function(e,t){return e+t&4294967295},n=function(e,n,r,o,i,s){return n=t(t(n,e),t(o,s)),t(n<<i|n>>>32-i,r)},r=function(e,t,r,o,i,s,a){return n(t&r|~t&o,e,t,i,s,a)},o=function(e,t,r,o,i,s,a){return n(t&o|r&~o,e,t,i,s,a)},i=function(e,t,r,o,i,s,a){return n(t^r^o,e,t,i,s,a)},s=function(e,t,r,o,i,s,a){return n(r^(t|~o),e,t,i,s,a)},a=function(e,n){var a=e[0],c=e[1],u=e[2],f=e[3];a=r(a,c,u,f,n[0],7,-680876936),f=r(f,a,c,u,n[1],12,-389564586),u=r(u,f,a,c,n[2],17,606105819),c=r(c,u,f,a,n[3],22,-1044525330),a=r(a,c,u,f,n[4],7,-176418897),f=r(f,a,c,u,n[5],12,1200080426),u=r(u,f,a,c,n[6],17,-1473231341),c=r(c,u,f,a,n[7],22,-45705983),a=r(a,c,u,f,n[8],7,1770035416),f=r(f,a,c,u,n[9],12,-1958414417),u=r(u,f,a,c,n[10],17,-42063),c=r(c,u,f,a,n[11],22,-1990404162),a=r(a,c,u,f,n[12],7,1804603682),f=r(f,a,c,u,n[13],12,-40341101),u=r(u,f,a,c,n[14],17,-1502002290),c=r(c,u,f,a,n[15],22,1236535329),a=o(a,c,u,f,n[1],5,-165796510),f=o(f,a,c,u,n[6],9,-1069501632),u=o(u,f,a,c,n[11],14,643717713),c=o(c,u,f,a,n[0],20,-373897302),a=o(a,c,u,f,n[5],5,-701558691),f=o(f,a,c,u,n[10],9,38016083),u=o(u,f,a,c,n[15],14,-660478335),c=o(c,u,f,a,n[4],20,-405537848),a=o(a,c,u,f,n[9],5,568446438),f=o(f,a,c,u,n[14],9,-1019803690),u=o(u,f,a,c,n[3],14,-187363961),c=o(c,u,f,a,n[8],20,1163531501),a=o(a,c,u,f,n[13],5,-1444681467),f=o(f,a,c,u,n[2],9,-51403784),u=o(u,f,a,c,n[7],14,1735328473),c=o(c,u,f,a,n[12],20,-1926607734),a=i(a,c,u,f,n[5],4,-378558),f=i(f,a,c,u,n[8],11,-2022574463),u=i(u,f,a,c,n[11],16,1839030562),c=i(c,u,f,a,n[14],23,-35309556),a=i(a,c,u,f,n[1],4,-1530992060),f=i(f,a,c,u,n[4],11,1272893353),u=i(u,f,a,c,n[7],16,-155497632),c=i(c,u,f,a,n[10],23,-1094730640),a=i(a,c,u,f,n[13],4,681279174),f=i(f,a,c,u,n[0],11,-358537222),u=i(u,f,a,c,n[3],16,-722521979),c=i(c,u,f,a,n[6],23,76029189),a=i(a,c,u,f,n[9],4,-640364487),f=i(f,a,c,u,n[12],11,-421815835),u=i(u,f,a,c,n[15],16,530742520),c=i(c,u,f,a,n[2],23,-995338651),a=s(a,c,u,f,n[0],6,-198630844),f=s(f,a,c,u,n[7],10,1126891415),u=s(u,f,a,c,n[14],15,-1416354905),c=s(c,u,f,a,n[5],21,-57434055),a=s(a,c,u,f,n[12],6,1700485571),f=s(f,a,c,u,n[3],10,-1894986606),u=s(u,f,a,c,n[10],15,-1051523),c=s(c,u,f,a,n[1],21,-2054922799),a=s(a,c,u,f,n[8],6,1873313359),f=s(f,a,c,u,n[15],10,-30611744),u=s(u,f,a,c,n[6],15,-1560198380),c=s(c,u,f,a,n[13],21,1309151649),a=s(a,c,u,f,n[4],6,-145523070),f=s(f,a,c,u,n[11],10,-1120210379),u=s(u,f,a,c,n[2],15,718787259),c=s(c,u,f,a,n[9],21,-343485551),e[0]=t(a,e[0]),e[1]=t(c,e[1]),e[2]=t(u,e[2]),e[3]=t(f,e[3])},c=function(e){var t,n=[];for(t=0;64>t;t+=4)n[t>>2]=e.charCodeAt(t)+(e.charCodeAt(t+1)<<8)+(e.charCodeAt(t+2)<<16)+(e.charCodeAt(t+3)<<24);return n},u=function(e){var t,n=[];for(t=0;64>t;t+=4)n[t>>2]=e[t]+(e[t+1]<<8)+(e[t+2]<<16)+(e[t+3]<<24);return n},f=function(e){var t,n,r,o,i,s,u=e.length,f=[1732584193,-271733879,-1732584194,271733878];for(t=64;u>=t;t+=64)a(f,c(e.substring(t-64,t)));for(e=e.substring(t-64),n=e.length,r=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t=0;n>t;t+=1)r[t>>2]|=e.charCodeAt(t)<<(t%4<<3);if(r[t>>2]|=128<<(t%4<<3),t>55)for(a(f,r),t=0;16>t;t+=1)r[t]=0;return o=8*u,o=o.toString(16).match(/(.*?)(.{0,8})$/),i=parseInt(o[2],16),s=parseInt(o[1],16)||0,r[14]=i,r[15]=s,a(f,r),f},l=function(e){var t,n,r,o,i,s,c=e.length,f=[1732584193,-271733879,-1732584194,271733878];for(t=64;c>=t;t+=64)a(f,u(e.subarray(t-64,t)));for(e=c>t-64?e.subarray(t-64):new Uint8Array(0),n=e.length,r=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t=0;n>t;t+=1)r[t>>2]|=e[t]<<(t%4<<3);if(r[t>>2]|=128<<(t%4<<3),t>55)for(a(f,r),t=0;16>t;t+=1)r[t]=0;return o=8*c,o=o.toString(16).match(/(.*?)(.{0,8})$/),i=parseInt(o[2],16),s=parseInt(o[1],16)||0,r[14]=i,r[15]=s,a(f,r),f},d=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"],p=function(e){var t,n="";for(t=0;4>t;t+=1)n+=d[e>>8*t+4&15]+d[e>>8*t&15];return n},h=function(e){var t;for(t=0;t<e.length;t+=1)e[t]=p(e[t]);return e.join("")},v=function(e){return h(f(e))},_=function(){this.reset()};return"5d41402abc4b2a76b9719d911017c592"!==v("hello")&&(t=function(e,t){var n=(65535&e)+(65535&t),r=(e>>16)+(t>>16)+(n>>16);return r<<16|65535&n}),_.prototype.append=function(e){return/[\u0080-\uFFFF]/.test(e)&&(e=unescape(encodeURIComponent(e))),this.appendBinary(e),this},_.prototype.appendBinary=function(e){this._buff+=e,this._length+=e.length;var t,n=this._buff.length;for(t=64;n>=t;t+=64)a(this._state,c(this._buff.substring(t-64,t)));return this._buff=this._buff.substr(t-64),this},_.prototype.end=function(e){var t,n,r=this._buff,o=r.length,i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;o>t;t+=1)i[t>>2]|=r.charCodeAt(t)<<(t%4<<3);return this._finish(i,o),n=e?this._state:h(this._state),this.reset(),n},_.prototype._finish=function(e,t){var n,r,o,i=t;if(e[i>>2]|=128<<(i%4<<3),i>55)for(a(this._state,e),i=0;16>i;i+=1)e[i]=0;n=8*this._length,n=n.toString(16).match(/(.*?)(.{0,8})$/),r=parseInt(n[2],16),o=parseInt(n[1],16)||0,e[14]=r,e[15]=o,a(this._state,e)},_.prototype.reset=function(){return this._buff="",this._length=0,this._state=[1732584193,-271733879,-1732584194,271733878],this},_.prototype.destroy=function(){delete this._state,delete this._buff,delete this._length},_.hash=function(e,t){/[\u0080-\uFFFF]/.test(e)&&(e=unescape(encodeURIComponent(e)));var n=f(e);return t?n:h(n)},_.hashBinary=function(e,t){var n=f(e);return t?n:h(n)},_.ArrayBuffer=function(){this.reset()},_.ArrayBuffer.prototype.append=function(e){var t,n=this._concatArrayBuffer(this._buff,e),r=n.length;for(this._length+=e.byteLength,t=64;r>=t;t+=64)a(this._state,u(n.subarray(t-64,t)));return this._buff=r>t-64?n.subarray(t-64):new Uint8Array(0),this},_.ArrayBuffer.prototype.end=function(e){var t,n,r=this._buff,o=r.length,i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;o>t;t+=1)i[t>>2]|=r[t]<<(t%4<<3);return this._finish(i,o),n=e?this._state:h(this._state),this.reset(),n},_.ArrayBuffer.prototype._finish=_.prototype._finish,_.ArrayBuffer.prototype.reset=function(){return this._buff=new Uint8Array(0),this._length=0,this._state=[1732584193,-271733879,-1732584194,271733878],this},_.ArrayBuffer.prototype.destroy=_.prototype.destroy,_.ArrayBuffer.prototype._concatArrayBuffer=function(e,t){var n=e.length,r=new Uint8Array(n+t.byteLength);return r.set(e),r.set(new Uint8Array(t),n),r},_.ArrayBuffer.hash=function(e,t){var n=l(new Uint8Array(e));return t?n:h(n)},_})},{}],76:[function(e,t,n){"use strict";function r(e,t,n){var r=n[n.length-1];e===r.element&&(n.pop(),r=n[n.length-1]);var o=r.element,i=r.index;if(Array.isArray(o))o.push(e);else if(i===t.length-2){var s=t.pop();o[s]=e}else t.push(e)}n.stringify=function(e){var t=[];t.push({obj:e});for(var n,r,o,i,s,a,c,u,f,l,d,p="";n=t.pop();)if(r=n.obj,o=n.prefix||"",i=n.val||"",p+=o,i)p+=i;else if("object"!=typeof r)p+="undefined"==typeof r?null:JSON.stringify(r);else if(null===r)p+="null";else if(Array.isArray(r)){for(t.push({val:"]"}),s=r.length-1;s>=0;s--)a=0===s?"":",",t.push({obj:r[s],prefix:a});t.push({val:"["})}else{c=[];for(u in r)r.hasOwnProperty(u)&&c.push(u);for(t.push({val:"}"}),s=c.length-1;s>=0;s--)f=c[s],l=r[f],d=s>0?",":"",d+=JSON.stringify(f)+":",t.push({obj:l,prefix:d});t.push({val:"{"})}return p},n.parse=function(e){for(var t,n,o,i,s,a,c,u,f,l=[],d=[],p=0;;)if(t=e[p++],"}"!==t&&"]"!==t&&"undefined"!=typeof t)switch(t){case" ":case"	":case"\n":case":":case",":break;case"n":p+=3,r(null,l,d);break;case"t":p+=3,r(!0,l,d);break;case"f":p+=4,r(!1,l,d);break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":case"-":for(n="",p--;;){if(o=e[p++],!/[\d\.\-e\+]/.test(o)){p--;break}n+=o}r(parseFloat(n),l,d);break;case'"':for(i="",s=void 0,a=0;;){if(c=e[p++],'"'===c&&("\\"!==s||a%2!==1))break;i+=c,s=c,"\\"===s?a++:a=0}r(JSON.parse('"'+i+'"'),l,d);break;case"[":u={element:[],index:l.length},l.push(u.element),d.push(u);break;case"{":f={element:{},index:l.length},l.push(f.element),d.push(f);break;default:throw new Error("unexpectedly reached end of input: "+t)}else{if(1===l.length)return l.pop();r(l.pop(),l,d)}}},{}],77:[function(e,t,n){(function(n){"use strict";var r=e(33);t.exports=r,r.ajax=e(16),r.utils=e(36),r.Errors=e(19),r.replicate=e(32).replicate,r.sync=e(34),r.version=e(37);var o=e(2);if(r.adapter("http",o),r.adapter("https",o),r.adapter("idb",e(8),!0),r.adapter("websql",e(12),!0),r.plugin(e(70)),!n.browser){var i=e(39);r.adapter("leveldb",i,!0)}}).call(this,e(41))},{12:12,16:16,19:19,2:2,32:32,33:33,34:34,36:36,37:37,39:39,41:41,70:70,8:8}]},{},[77])(77)});

/**
 * React v0.12.2
 *
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.React=e()}}(function(){return function e(t,n,r){function o(i,s){if(!n[i]){if(!t[i]){var u="function"==typeof require&&require;if(!s&&u)return u(i,!0);if(a)return a(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[i]={exports:{}};t[i][0].call(l.exports,function(e){var n=t[i][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[i].exports}for(var a="function"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}({1:[function(e,t){"use strict";var n=e("./DOMPropertyOperations"),r=e("./EventPluginUtils"),o=e("./ReactChildren"),a=e("./ReactComponent"),i=e("./ReactCompositeComponent"),s=e("./ReactContext"),u=e("./ReactCurrentOwner"),c=e("./ReactElement"),l=(e("./ReactElementValidator"),e("./ReactDOM")),p=e("./ReactDOMComponent"),d=e("./ReactDefaultInjection"),f=e("./ReactInstanceHandles"),h=e("./ReactLegacyElement"),m=e("./ReactMount"),v=e("./ReactMultiChild"),g=e("./ReactPerf"),y=e("./ReactPropTypes"),E=e("./ReactServerRendering"),C=e("./ReactTextComponent"),R=e("./Object.assign"),M=e("./deprecated"),b=e("./onlyChild");d.inject();var O=c.createElement,D=c.createFactory;O=h.wrapCreateElement(O),D=h.wrapCreateFactory(D);var x=g.measure("React","render",m.render),P={Children:{map:o.map,forEach:o.forEach,count:o.count,only:b},DOM:l,PropTypes:y,initializeTouchEvents:function(e){r.useTouchEvents=e},createClass:i.createClass,createElement:O,createFactory:D,constructAndRenderComponent:m.constructAndRenderComponent,constructAndRenderComponentByID:m.constructAndRenderComponentByID,render:x,renderToString:E.renderToString,renderToStaticMarkup:E.renderToStaticMarkup,unmountComponentAtNode:m.unmountComponentAtNode,isValidClass:h.isValidClass,isValidElement:c.isValidElement,withContext:s.withContext,__spread:R,renderComponent:M("React","renderComponent","render",this,x),renderComponentToString:M("React","renderComponentToString","renderToString",this,E.renderToString),renderComponentToStaticMarkup:M("React","renderComponentToStaticMarkup","renderToStaticMarkup",this,E.renderToStaticMarkup),isValidComponent:M("React","isValidComponent","isValidElement",this,c.isValidElement)};"undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject&&__REACT_DEVTOOLS_GLOBAL_HOOK__.inject({Component:a,CurrentOwner:u,DOMComponent:p,DOMPropertyOperations:n,InstanceHandles:f,Mount:m,MultiChild:v,TextComponent:C});P.version="0.12.2",t.exports=P},{"./DOMPropertyOperations":12,"./EventPluginUtils":20,"./Object.assign":27,"./ReactChildren":31,"./ReactComponent":32,"./ReactCompositeComponent":34,"./ReactContext":35,"./ReactCurrentOwner":36,"./ReactDOM":37,"./ReactDOMComponent":39,"./ReactDefaultInjection":49,"./ReactElement":50,"./ReactElementValidator":51,"./ReactInstanceHandles":58,"./ReactLegacyElement":59,"./ReactMount":61,"./ReactMultiChild":62,"./ReactPerf":66,"./ReactPropTypes":70,"./ReactServerRendering":74,"./ReactTextComponent":76,"./deprecated":104,"./onlyChild":135}],2:[function(e,t){"use strict";var n=e("./focusNode"),r={componentDidMount:function(){this.props.autoFocus&&n(this.getDOMNode())}};t.exports=r},{"./focusNode":109}],3:[function(e,t){"use strict";function n(){var e=window.opera;return"object"==typeof e&&"function"==typeof e.version&&parseInt(e.version(),10)<=12}function r(e){return(e.ctrlKey||e.altKey||e.metaKey)&&!(e.ctrlKey&&e.altKey)}var o=e("./EventConstants"),a=e("./EventPropagators"),i=e("./ExecutionEnvironment"),s=e("./SyntheticInputEvent"),u=e("./keyOf"),c=i.canUseDOM&&"TextEvent"in window&&!("documentMode"in document||n()),l=32,p=String.fromCharCode(l),d=o.topLevelTypes,f={beforeInput:{phasedRegistrationNames:{bubbled:u({onBeforeInput:null}),captured:u({onBeforeInputCapture:null})},dependencies:[d.topCompositionEnd,d.topKeyPress,d.topTextInput,d.topPaste]}},h=null,m=!1,v={eventTypes:f,extractEvents:function(e,t,n,o){var i;if(c)switch(e){case d.topKeyPress:var u=o.which;if(u!==l)return;m=!0,i=p;break;case d.topTextInput:if(i=o.data,i===p&&m)return;break;default:return}else{switch(e){case d.topPaste:h=null;break;case d.topKeyPress:o.which&&!r(o)&&(h=String.fromCharCode(o.which));break;case d.topCompositionEnd:h=o.data}if(null===h)return;i=h}if(i){var v=s.getPooled(f.beforeInput,n,o);return v.data=i,h=null,a.accumulateTwoPhaseDispatches(v),v}}};t.exports=v},{"./EventConstants":16,"./EventPropagators":21,"./ExecutionEnvironment":22,"./SyntheticInputEvent":87,"./keyOf":131}],4:[function(e,t){"use strict";function n(e,t){return e+t.charAt(0).toUpperCase()+t.substring(1)}var r={columnCount:!0,flex:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,strokeOpacity:!0},o=["Webkit","ms","Moz","O"];Object.keys(r).forEach(function(e){o.forEach(function(t){r[n(t,e)]=r[e]})});var a={background:{backgroundImage:!0,backgroundPosition:!0,backgroundRepeat:!0,backgroundColor:!0},border:{borderWidth:!0,borderStyle:!0,borderColor:!0},borderBottom:{borderBottomWidth:!0,borderBottomStyle:!0,borderBottomColor:!0},borderLeft:{borderLeftWidth:!0,borderLeftStyle:!0,borderLeftColor:!0},borderRight:{borderRightWidth:!0,borderRightStyle:!0,borderRightColor:!0},borderTop:{borderTopWidth:!0,borderTopStyle:!0,borderTopColor:!0},font:{fontStyle:!0,fontVariant:!0,fontWeight:!0,fontSize:!0,lineHeight:!0,fontFamily:!0}},i={isUnitlessNumber:r,shorthandPropertyExpansions:a};t.exports=i},{}],5:[function(e,t){"use strict";var n=e("./CSSProperty"),r=e("./ExecutionEnvironment"),o=(e("./camelizeStyleName"),e("./dangerousStyleValue")),a=e("./hyphenateStyleName"),i=e("./memoizeStringOnly"),s=(e("./warning"),i(function(e){return a(e)})),u="cssFloat";r.canUseDOM&&void 0===document.documentElement.style.cssFloat&&(u="styleFloat");var c={createMarkupForStyles:function(e){var t="";for(var n in e)if(e.hasOwnProperty(n)){var r=e[n];null!=r&&(t+=s(n)+":",t+=o(n,r)+";")}return t||null},setValueForStyles:function(e,t){var r=e.style;for(var a in t)if(t.hasOwnProperty(a)){var i=o(a,t[a]);if("float"===a&&(a=u),i)r[a]=i;else{var s=n.shorthandPropertyExpansions[a];if(s)for(var c in s)r[c]="";else r[a]=""}}}};t.exports=c},{"./CSSProperty":4,"./ExecutionEnvironment":22,"./camelizeStyleName":98,"./dangerousStyleValue":103,"./hyphenateStyleName":122,"./memoizeStringOnly":133,"./warning":141}],6:[function(e,t){"use strict";function n(){this._callbacks=null,this._contexts=null}var r=e("./PooledClass"),o=e("./Object.assign"),a=e("./invariant");o(n.prototype,{enqueue:function(e,t){this._callbacks=this._callbacks||[],this._contexts=this._contexts||[],this._callbacks.push(e),this._contexts.push(t)},notifyAll:function(){var e=this._callbacks,t=this._contexts;if(e){a(e.length===t.length),this._callbacks=null,this._contexts=null;for(var n=0,r=e.length;r>n;n++)e[n].call(t[n]);e.length=0,t.length=0}},reset:function(){this._callbacks=null,this._contexts=null},destructor:function(){this.reset()}}),r.addPoolingTo(n),t.exports=n},{"./Object.assign":27,"./PooledClass":28,"./invariant":124}],7:[function(e,t){"use strict";function n(e){return"SELECT"===e.nodeName||"INPUT"===e.nodeName&&"file"===e.type}function r(e){var t=M.getPooled(P.change,w,e);E.accumulateTwoPhaseDispatches(t),R.batchedUpdates(o,t)}function o(e){y.enqueueEvents(e),y.processEventQueue()}function a(e,t){_=e,w=t,_.attachEvent("onchange",r)}function i(){_&&(_.detachEvent("onchange",r),_=null,w=null)}function s(e,t,n){return e===x.topChange?n:void 0}function u(e,t,n){e===x.topFocus?(i(),a(t,n)):e===x.topBlur&&i()}function c(e,t){_=e,w=t,T=e.value,N=Object.getOwnPropertyDescriptor(e.constructor.prototype,"value"),Object.defineProperty(_,"value",k),_.attachEvent("onpropertychange",p)}function l(){_&&(delete _.value,_.detachEvent("onpropertychange",p),_=null,w=null,T=null,N=null)}function p(e){if("value"===e.propertyName){var t=e.srcElement.value;t!==T&&(T=t,r(e))}}function d(e,t,n){return e===x.topInput?n:void 0}function f(e,t,n){e===x.topFocus?(l(),c(t,n)):e===x.topBlur&&l()}function h(e){return e!==x.topSelectionChange&&e!==x.topKeyUp&&e!==x.topKeyDown||!_||_.value===T?void 0:(T=_.value,w)}function m(e){return"INPUT"===e.nodeName&&("checkbox"===e.type||"radio"===e.type)}function v(e,t,n){return e===x.topClick?n:void 0}var g=e("./EventConstants"),y=e("./EventPluginHub"),E=e("./EventPropagators"),C=e("./ExecutionEnvironment"),R=e("./ReactUpdates"),M=e("./SyntheticEvent"),b=e("./isEventSupported"),O=e("./isTextInputElement"),D=e("./keyOf"),x=g.topLevelTypes,P={change:{phasedRegistrationNames:{bubbled:D({onChange:null}),captured:D({onChangeCapture:null})},dependencies:[x.topBlur,x.topChange,x.topClick,x.topFocus,x.topInput,x.topKeyDown,x.topKeyUp,x.topSelectionChange]}},_=null,w=null,T=null,N=null,I=!1;C.canUseDOM&&(I=b("change")&&(!("documentMode"in document)||document.documentMode>8));var S=!1;C.canUseDOM&&(S=b("input")&&(!("documentMode"in document)||document.documentMode>9));var k={get:function(){return N.get.call(this)},set:function(e){T=""+e,N.set.call(this,e)}},A={eventTypes:P,extractEvents:function(e,t,r,o){var a,i;if(n(t)?I?a=s:i=u:O(t)?S?a=d:(a=h,i=f):m(t)&&(a=v),a){var c=a(e,t,r);if(c){var l=M.getPooled(P.change,c,o);return E.accumulateTwoPhaseDispatches(l),l}}i&&i(e,t,r)}};t.exports=A},{"./EventConstants":16,"./EventPluginHub":18,"./EventPropagators":21,"./ExecutionEnvironment":22,"./ReactUpdates":77,"./SyntheticEvent":85,"./isEventSupported":125,"./isTextInputElement":127,"./keyOf":131}],8:[function(e,t){"use strict";var n=0,r={createReactRootIndex:function(){return n++}};t.exports=r},{}],9:[function(e,t){"use strict";function n(e){switch(e){case g.topCompositionStart:return E.compositionStart;case g.topCompositionEnd:return E.compositionEnd;case g.topCompositionUpdate:return E.compositionUpdate}}function r(e,t){return e===g.topKeyDown&&t.keyCode===h}function o(e,t){switch(e){case g.topKeyUp:return-1!==f.indexOf(t.keyCode);case g.topKeyDown:return t.keyCode!==h;case g.topKeyPress:case g.topMouseDown:case g.topBlur:return!0;default:return!1}}function a(e){this.root=e,this.startSelection=c.getSelection(e),this.startValue=this.getText()}var i=e("./EventConstants"),s=e("./EventPropagators"),u=e("./ExecutionEnvironment"),c=e("./ReactInputSelection"),l=e("./SyntheticCompositionEvent"),p=e("./getTextContentAccessor"),d=e("./keyOf"),f=[9,13,27,32],h=229,m=u.canUseDOM&&"CompositionEvent"in window,v=!m||"documentMode"in document&&document.documentMode>8&&document.documentMode<=11,g=i.topLevelTypes,y=null,E={compositionEnd:{phasedRegistrationNames:{bubbled:d({onCompositionEnd:null}),captured:d({onCompositionEndCapture:null})},dependencies:[g.topBlur,g.topCompositionEnd,g.topKeyDown,g.topKeyPress,g.topKeyUp,g.topMouseDown]},compositionStart:{phasedRegistrationNames:{bubbled:d({onCompositionStart:null}),captured:d({onCompositionStartCapture:null})},dependencies:[g.topBlur,g.topCompositionStart,g.topKeyDown,g.topKeyPress,g.topKeyUp,g.topMouseDown]},compositionUpdate:{phasedRegistrationNames:{bubbled:d({onCompositionUpdate:null}),captured:d({onCompositionUpdateCapture:null})},dependencies:[g.topBlur,g.topCompositionUpdate,g.topKeyDown,g.topKeyPress,g.topKeyUp,g.topMouseDown]}};a.prototype.getText=function(){return this.root.value||this.root[p()]},a.prototype.getData=function(){var e=this.getText(),t=this.startSelection.start,n=this.startValue.length-this.startSelection.end;return e.substr(t,e.length-n-t)};var C={eventTypes:E,extractEvents:function(e,t,i,u){var c,p;if(m?c=n(e):y?o(e,u)&&(c=E.compositionEnd):r(e,u)&&(c=E.compositionStart),v&&(y||c!==E.compositionStart?c===E.compositionEnd&&y&&(p=y.getData(),y=null):y=new a(t)),c){var d=l.getPooled(c,i,u);return p&&(d.data=p),s.accumulateTwoPhaseDispatches(d),d}}};t.exports=C},{"./EventConstants":16,"./EventPropagators":21,"./ExecutionEnvironment":22,"./ReactInputSelection":57,"./SyntheticCompositionEvent":83,"./getTextContentAccessor":119,"./keyOf":131}],10:[function(e,t){"use strict";function n(e,t,n){e.insertBefore(t,e.childNodes[n]||null)}var r,o=e("./Danger"),a=e("./ReactMultiChildUpdateTypes"),i=e("./getTextContentAccessor"),s=e("./invariant"),u=i();r="textContent"===u?function(e,t){e.textContent=t}:function(e,t){for(;e.firstChild;)e.removeChild(e.firstChild);if(t){var n=e.ownerDocument||document;e.appendChild(n.createTextNode(t))}};var c={dangerouslyReplaceNodeWithMarkup:o.dangerouslyReplaceNodeWithMarkup,updateTextContent:r,processUpdates:function(e,t){for(var i,u=null,c=null,l=0;i=e[l];l++)if(i.type===a.MOVE_EXISTING||i.type===a.REMOVE_NODE){var p=i.fromIndex,d=i.parentNode.childNodes[p],f=i.parentID;s(d),u=u||{},u[f]=u[f]||[],u[f][p]=d,c=c||[],c.push(d)}var h=o.dangerouslyRenderMarkup(t);if(c)for(var m=0;m<c.length;m++)c[m].parentNode.removeChild(c[m]);for(var v=0;i=e[v];v++)switch(i.type){case a.INSERT_MARKUP:n(i.parentNode,h[i.markupIndex],i.toIndex);break;case a.MOVE_EXISTING:n(i.parentNode,u[i.parentID][i.fromIndex],i.toIndex);break;case a.TEXT_CONTENT:r(i.parentNode,i.textContent);break;case a.REMOVE_NODE:}}};t.exports=c},{"./Danger":13,"./ReactMultiChildUpdateTypes":63,"./getTextContentAccessor":119,"./invariant":124}],11:[function(e,t){"use strict";function n(e,t){return(e&t)===t}var r=e("./invariant"),o={MUST_USE_ATTRIBUTE:1,MUST_USE_PROPERTY:2,HAS_SIDE_EFFECTS:4,HAS_BOOLEAN_VALUE:8,HAS_NUMERIC_VALUE:16,HAS_POSITIVE_NUMERIC_VALUE:48,HAS_OVERLOADED_BOOLEAN_VALUE:64,injectDOMPropertyConfig:function(e){var t=e.Properties||{},a=e.DOMAttributeNames||{},s=e.DOMPropertyNames||{},u=e.DOMMutationMethods||{};e.isCustomAttribute&&i._isCustomAttributeFunctions.push(e.isCustomAttribute);for(var c in t){r(!i.isStandardName.hasOwnProperty(c)),i.isStandardName[c]=!0;var l=c.toLowerCase();if(i.getPossibleStandardName[l]=c,a.hasOwnProperty(c)){var p=a[c];i.getPossibleStandardName[p]=c,i.getAttributeName[c]=p}else i.getAttributeName[c]=l;i.getPropertyName[c]=s.hasOwnProperty(c)?s[c]:c,i.getMutationMethod[c]=u.hasOwnProperty(c)?u[c]:null;var d=t[c];i.mustUseAttribute[c]=n(d,o.MUST_USE_ATTRIBUTE),i.mustUseProperty[c]=n(d,o.MUST_USE_PROPERTY),i.hasSideEffects[c]=n(d,o.HAS_SIDE_EFFECTS),i.hasBooleanValue[c]=n(d,o.HAS_BOOLEAN_VALUE),i.hasNumericValue[c]=n(d,o.HAS_NUMERIC_VALUE),i.hasPositiveNumericValue[c]=n(d,o.HAS_POSITIVE_NUMERIC_VALUE),i.hasOverloadedBooleanValue[c]=n(d,o.HAS_OVERLOADED_BOOLEAN_VALUE),r(!i.mustUseAttribute[c]||!i.mustUseProperty[c]),r(i.mustUseProperty[c]||!i.hasSideEffects[c]),r(!!i.hasBooleanValue[c]+!!i.hasNumericValue[c]+!!i.hasOverloadedBooleanValue[c]<=1)}}},a={},i={ID_ATTRIBUTE_NAME:"data-reactid",isStandardName:{},getPossibleStandardName:{},getAttributeName:{},getPropertyName:{},getMutationMethod:{},mustUseAttribute:{},mustUseProperty:{},hasSideEffects:{},hasBooleanValue:{},hasNumericValue:{},hasPositiveNumericValue:{},hasOverloadedBooleanValue:{},_isCustomAttributeFunctions:[],isCustomAttribute:function(e){for(var t=0;t<i._isCustomAttributeFunctions.length;t++){var n=i._isCustomAttributeFunctions[t];if(n(e))return!0}return!1},getDefaultValueForProperty:function(e,t){var n,r=a[e];return r||(a[e]=r={}),t in r||(n=document.createElement(e),r[t]=n[t]),r[t]},injection:o};t.exports=i},{"./invariant":124}],12:[function(e,t){"use strict";function n(e,t){return null==t||r.hasBooleanValue[e]&&!t||r.hasNumericValue[e]&&isNaN(t)||r.hasPositiveNumericValue[e]&&1>t||r.hasOverloadedBooleanValue[e]&&t===!1}var r=e("./DOMProperty"),o=e("./escapeTextForBrowser"),a=e("./memoizeStringOnly"),i=(e("./warning"),a(function(e){return o(e)+'="'})),s={createMarkupForID:function(e){return i(r.ID_ATTRIBUTE_NAME)+o(e)+'"'},createMarkupForProperty:function(e,t){if(r.isStandardName.hasOwnProperty(e)&&r.isStandardName[e]){if(n(e,t))return"";var a=r.getAttributeName[e];return r.hasBooleanValue[e]||r.hasOverloadedBooleanValue[e]&&t===!0?o(a):i(a)+o(t)+'"'}return r.isCustomAttribute(e)?null==t?"":i(e)+o(t)+'"':null},setValueForProperty:function(e,t,o){if(r.isStandardName.hasOwnProperty(t)&&r.isStandardName[t]){var a=r.getMutationMethod[t];if(a)a(e,o);else if(n(t,o))this.deleteValueForProperty(e,t);else if(r.mustUseAttribute[t])e.setAttribute(r.getAttributeName[t],""+o);else{var i=r.getPropertyName[t];r.hasSideEffects[t]&&""+e[i]==""+o||(e[i]=o)}}else r.isCustomAttribute(t)&&(null==o?e.removeAttribute(t):e.setAttribute(t,""+o))},deleteValueForProperty:function(e,t){if(r.isStandardName.hasOwnProperty(t)&&r.isStandardName[t]){var n=r.getMutationMethod[t];if(n)n(e,void 0);else if(r.mustUseAttribute[t])e.removeAttribute(r.getAttributeName[t]);else{var o=r.getPropertyName[t],a=r.getDefaultValueForProperty(e.nodeName,o);r.hasSideEffects[t]&&""+e[o]===a||(e[o]=a)}}else r.isCustomAttribute(t)&&e.removeAttribute(t)}};t.exports=s},{"./DOMProperty":11,"./escapeTextForBrowser":107,"./memoizeStringOnly":133,"./warning":141}],13:[function(e,t){"use strict";function n(e){return e.substring(1,e.indexOf(" "))}var r=e("./ExecutionEnvironment"),o=e("./createNodesFromMarkup"),a=e("./emptyFunction"),i=e("./getMarkupWrap"),s=e("./invariant"),u=/^(<[^ \/>]+)/,c="data-danger-index",l={dangerouslyRenderMarkup:function(e){s(r.canUseDOM);for(var t,l={},p=0;p<e.length;p++)s(e[p]),t=n(e[p]),t=i(t)?t:"*",l[t]=l[t]||[],l[t][p]=e[p];var d=[],f=0;for(t in l)if(l.hasOwnProperty(t)){var h=l[t];for(var m in h)if(h.hasOwnProperty(m)){var v=h[m];h[m]=v.replace(u,"$1 "+c+'="'+m+'" ')}var g=o(h.join(""),a);for(p=0;p<g.length;++p){var y=g[p];y.hasAttribute&&y.hasAttribute(c)&&(m=+y.getAttribute(c),y.removeAttribute(c),s(!d.hasOwnProperty(m)),d[m]=y,f+=1)}}return s(f===d.length),s(d.length===e.length),d},dangerouslyReplaceNodeWithMarkup:function(e,t){s(r.canUseDOM),s(t),s("html"!==e.tagName.toLowerCase());var n=o(t,a)[0];e.parentNode.replaceChild(n,e)}};t.exports=l},{"./ExecutionEnvironment":22,"./createNodesFromMarkup":102,"./emptyFunction":105,"./getMarkupWrap":116,"./invariant":124}],14:[function(e,t){"use strict";var n=e("./keyOf"),r=[n({ResponderEventPlugin:null}),n({SimpleEventPlugin:null}),n({TapEventPlugin:null}),n({EnterLeaveEventPlugin:null}),n({ChangeEventPlugin:null}),n({SelectEventPlugin:null}),n({CompositionEventPlugin:null}),n({BeforeInputEventPlugin:null}),n({AnalyticsEventPlugin:null}),n({MobileSafariClickEventPlugin:null})];t.exports=r},{"./keyOf":131}],15:[function(e,t){"use strict";var n=e("./EventConstants"),r=e("./EventPropagators"),o=e("./SyntheticMouseEvent"),a=e("./ReactMount"),i=e("./keyOf"),s=n.topLevelTypes,u=a.getFirstReactDOM,c={mouseEnter:{registrationName:i({onMouseEnter:null}),dependencies:[s.topMouseOut,s.topMouseOver]},mouseLeave:{registrationName:i({onMouseLeave:null}),dependencies:[s.topMouseOut,s.topMouseOver]}},l=[null,null],p={eventTypes:c,extractEvents:function(e,t,n,i){if(e===s.topMouseOver&&(i.relatedTarget||i.fromElement))return null;if(e!==s.topMouseOut&&e!==s.topMouseOver)return null;var p;if(t.window===t)p=t;else{var d=t.ownerDocument;p=d?d.defaultView||d.parentWindow:window}var f,h;if(e===s.topMouseOut?(f=t,h=u(i.relatedTarget||i.toElement)||p):(f=p,h=t),f===h)return null;var m=f?a.getID(f):"",v=h?a.getID(h):"",g=o.getPooled(c.mouseLeave,m,i);g.type="mouseleave",g.target=f,g.relatedTarget=h;var y=o.getPooled(c.mouseEnter,v,i);return y.type="mouseenter",y.target=h,y.relatedTarget=f,r.accumulateEnterLeaveDispatches(g,y,m,v),l[0]=g,l[1]=y,l}};t.exports=p},{"./EventConstants":16,"./EventPropagators":21,"./ReactMount":61,"./SyntheticMouseEvent":89,"./keyOf":131}],16:[function(e,t){"use strict";var n=e("./keyMirror"),r=n({bubbled:null,captured:null}),o=n({topBlur:null,topChange:null,topClick:null,topCompositionEnd:null,topCompositionStart:null,topCompositionUpdate:null,topContextMenu:null,topCopy:null,topCut:null,topDoubleClick:null,topDrag:null,topDragEnd:null,topDragEnter:null,topDragExit:null,topDragLeave:null,topDragOver:null,topDragStart:null,topDrop:null,topError:null,topFocus:null,topInput:null,topKeyDown:null,topKeyPress:null,topKeyUp:null,topLoad:null,topMouseDown:null,topMouseMove:null,topMouseOut:null,topMouseOver:null,topMouseUp:null,topPaste:null,topReset:null,topScroll:null,topSelectionChange:null,topSubmit:null,topTextInput:null,topTouchCancel:null,topTouchEnd:null,topTouchMove:null,topTouchStart:null,topWheel:null}),a={topLevelTypes:o,PropagationPhases:r};t.exports=a},{"./keyMirror":130}],17:[function(e,t){var n=e("./emptyFunction"),r={listen:function(e,t,n){return e.addEventListener?(e.addEventListener(t,n,!1),{remove:function(){e.removeEventListener(t,n,!1)}}):e.attachEvent?(e.attachEvent("on"+t,n),{remove:function(){e.detachEvent("on"+t,n)}}):void 0},capture:function(e,t,r){return e.addEventListener?(e.addEventListener(t,r,!0),{remove:function(){e.removeEventListener(t,r,!0)}}):{remove:n}},registerDefault:function(){}};t.exports=r},{"./emptyFunction":105}],18:[function(e,t){"use strict";var n=e("./EventPluginRegistry"),r=e("./EventPluginUtils"),o=e("./accumulateInto"),a=e("./forEachAccumulated"),i=e("./invariant"),s={},u=null,c=function(e){if(e){var t=r.executeDispatch,o=n.getPluginModuleForEvent(e);o&&o.executeDispatch&&(t=o.executeDispatch),r.executeDispatchesInOrder(e,t),e.isPersistent()||e.constructor.release(e)}},l=null,p={injection:{injectMount:r.injection.injectMount,injectInstanceHandle:function(e){l=e},getInstanceHandle:function(){return l},injectEventPluginOrder:n.injectEventPluginOrder,injectEventPluginsByName:n.injectEventPluginsByName},eventNameDispatchConfigs:n.eventNameDispatchConfigs,registrationNameModules:n.registrationNameModules,putListener:function(e,t,n){i(!n||"function"==typeof n);var r=s[t]||(s[t]={});r[e]=n},getListener:function(e,t){var n=s[t];return n&&n[e]},deleteListener:function(e,t){var n=s[t];n&&delete n[e]},deleteAllListeners:function(e){for(var t in s)delete s[t][e]},extractEvents:function(e,t,r,a){for(var i,s=n.plugins,u=0,c=s.length;c>u;u++){var l=s[u];if(l){var p=l.extractEvents(e,t,r,a);p&&(i=o(i,p))}}return i},enqueueEvents:function(e){e&&(u=o(u,e))},processEventQueue:function(){var e=u;u=null,a(e,c),i(!u)},__purge:function(){s={}},__getListenerBank:function(){return s}};t.exports=p},{"./EventPluginRegistry":19,"./EventPluginUtils":20,"./accumulateInto":95,"./forEachAccumulated":110,"./invariant":124}],19:[function(e,t){"use strict";function n(){if(i)for(var e in s){var t=s[e],n=i.indexOf(e);if(a(n>-1),!u.plugins[n]){a(t.extractEvents),u.plugins[n]=t;var o=t.eventTypes;for(var c in o)a(r(o[c],t,c))}}}function r(e,t,n){a(!u.eventNameDispatchConfigs.hasOwnProperty(n)),u.eventNameDispatchConfigs[n]=e;var r=e.phasedRegistrationNames;if(r){for(var i in r)if(r.hasOwnProperty(i)){var s=r[i];o(s,t,n)}return!0}return e.registrationName?(o(e.registrationName,t,n),!0):!1}function o(e,t,n){a(!u.registrationNameModules[e]),u.registrationNameModules[e]=t,u.registrationNameDependencies[e]=t.eventTypes[n].dependencies}var a=e("./invariant"),i=null,s={},u={plugins:[],eventNameDispatchConfigs:{},registrationNameModules:{},registrationNameDependencies:{},injectEventPluginOrder:function(e){a(!i),i=Array.prototype.slice.call(e),n()},injectEventPluginsByName:function(e){var t=!1;for(var r in e)if(e.hasOwnProperty(r)){var o=e[r];s.hasOwnProperty(r)&&s[r]===o||(a(!s[r]),s[r]=o,t=!0)}t&&n()},getPluginModuleForEvent:function(e){var t=e.dispatchConfig;if(t.registrationName)return u.registrationNameModules[t.registrationName]||null;for(var n in t.phasedRegistrationNames)if(t.phasedRegistrationNames.hasOwnProperty(n)){var r=u.registrationNameModules[t.phasedRegistrationNames[n]];if(r)return r}return null},_resetEventPlugins:function(){i=null;for(var e in s)s.hasOwnProperty(e)&&delete s[e];u.plugins.length=0;var t=u.eventNameDispatchConfigs;for(var n in t)t.hasOwnProperty(n)&&delete t[n];var r=u.registrationNameModules;for(var o in r)r.hasOwnProperty(o)&&delete r[o]}};t.exports=u},{"./invariant":124}],20:[function(e,t){"use strict";function n(e){return e===m.topMouseUp||e===m.topTouchEnd||e===m.topTouchCancel}function r(e){return e===m.topMouseMove||e===m.topTouchMove}function o(e){return e===m.topMouseDown||e===m.topTouchStart}function a(e,t){var n=e._dispatchListeners,r=e._dispatchIDs;if(Array.isArray(n))for(var o=0;o<n.length&&!e.isPropagationStopped();o++)t(e,n[o],r[o]);else n&&t(e,n,r)}function i(e,t,n){e.currentTarget=h.Mount.getNode(n);var r=t(e,n);return e.currentTarget=null,r}function s(e,t){a(e,t),e._dispatchListeners=null,e._dispatchIDs=null}function u(e){var t=e._dispatchListeners,n=e._dispatchIDs;if(Array.isArray(t)){for(var r=0;r<t.length&&!e.isPropagationStopped();r++)if(t[r](e,n[r]))return n[r]}else if(t&&t(e,n))return n;return null}function c(e){var t=u(e);return e._dispatchIDs=null,e._dispatchListeners=null,t}function l(e){var t=e._dispatchListeners,n=e._dispatchIDs;f(!Array.isArray(t));var r=t?t(e,n):null;return e._dispatchListeners=null,e._dispatchIDs=null,r}function p(e){return!!e._dispatchListeners}var d=e("./EventConstants"),f=e("./invariant"),h={Mount:null,injectMount:function(e){h.Mount=e}},m=d.topLevelTypes,v={isEndish:n,isMoveish:r,isStartish:o,executeDirectDispatch:l,executeDispatch:i,executeDispatchesInOrder:s,executeDispatchesInOrderStopAtTrue:c,hasDispatches:p,injection:h,useTouchEvents:!1};t.exports=v},{"./EventConstants":16,"./invariant":124}],21:[function(e,t){"use strict";function n(e,t,n){var r=t.dispatchConfig.phasedRegistrationNames[n];return m(e,r)}function r(e,t,r){var o=t?h.bubbled:h.captured,a=n(e,r,o);a&&(r._dispatchListeners=d(r._dispatchListeners,a),r._dispatchIDs=d(r._dispatchIDs,e))}function o(e){e&&e.dispatchConfig.phasedRegistrationNames&&p.injection.getInstanceHandle().traverseTwoPhase(e.dispatchMarker,r,e)}function a(e,t,n){if(n&&n.dispatchConfig.registrationName){var r=n.dispatchConfig.registrationName,o=m(e,r);o&&(n._dispatchListeners=d(n._dispatchListeners,o),n._dispatchIDs=d(n._dispatchIDs,e))}}function i(e){e&&e.dispatchConfig.registrationName&&a(e.dispatchMarker,null,e)}function s(e){f(e,o)}function u(e,t,n,r){p.injection.getInstanceHandle().traverseEnterLeave(n,r,a,e,t)}function c(e){f(e,i)}var l=e("./EventConstants"),p=e("./EventPluginHub"),d=e("./accumulateInto"),f=e("./forEachAccumulated"),h=l.PropagationPhases,m=p.getListener,v={accumulateTwoPhaseDispatches:s,accumulateDirectDispatches:c,accumulateEnterLeaveDispatches:u};t.exports=v},{"./EventConstants":16,"./EventPluginHub":18,"./accumulateInto":95,"./forEachAccumulated":110}],22:[function(e,t){"use strict";var n=!("undefined"==typeof window||!window.document||!window.document.createElement),r={canUseDOM:n,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:n&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:n&&!!window.screen,isInWorker:!n};t.exports=r},{}],23:[function(e,t){"use strict";var n,r=e("./DOMProperty"),o=e("./ExecutionEnvironment"),a=r.injection.MUST_USE_ATTRIBUTE,i=r.injection.MUST_USE_PROPERTY,s=r.injection.HAS_BOOLEAN_VALUE,u=r.injection.HAS_SIDE_EFFECTS,c=r.injection.HAS_NUMERIC_VALUE,l=r.injection.HAS_POSITIVE_NUMERIC_VALUE,p=r.injection.HAS_OVERLOADED_BOOLEAN_VALUE;if(o.canUseDOM){var d=document.implementation;n=d&&d.hasFeature&&d.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")}var f={isCustomAttribute:RegExp.prototype.test.bind(/^(data|aria)-[a-z_][a-z\d_.\-]*$/),Properties:{accept:null,acceptCharset:null,accessKey:null,action:null,allowFullScreen:a|s,allowTransparency:a,alt:null,async:s,autoComplete:null,autoPlay:s,cellPadding:null,cellSpacing:null,charSet:a,checked:i|s,classID:a,className:n?a:i,cols:a|l,colSpan:null,content:null,contentEditable:null,contextMenu:a,controls:i|s,coords:null,crossOrigin:null,data:null,dateTime:a,defer:s,dir:null,disabled:a|s,download:p,draggable:null,encType:null,form:a,formAction:a,formEncType:a,formMethod:a,formNoValidate:s,formTarget:a,frameBorder:a,height:a,hidden:a|s,href:null,hrefLang:null,htmlFor:null,httpEquiv:null,icon:null,id:i,label:null,lang:null,list:a,loop:i|s,manifest:a,marginHeight:null,marginWidth:null,max:null,maxLength:a,media:a,mediaGroup:null,method:null,min:null,multiple:i|s,muted:i|s,name:null,noValidate:s,open:null,pattern:null,placeholder:null,poster:null,preload:null,radioGroup:null,readOnly:i|s,rel:null,required:s,role:a,rows:a|l,rowSpan:null,sandbox:null,scope:null,scrolling:null,seamless:a|s,selected:i|s,shape:null,size:a|l,sizes:a,span:l,spellCheck:null,src:null,srcDoc:i,srcSet:a,start:c,step:null,style:null,tabIndex:null,target:null,title:null,type:null,useMap:null,value:i|u,width:a,wmode:a,autoCapitalize:null,autoCorrect:null,itemProp:a,itemScope:a|s,itemType:a,property:null},DOMAttributeNames:{acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv"},DOMPropertyNames:{autoCapitalize:"autocapitalize",autoComplete:"autocomplete",autoCorrect:"autocorrect",autoFocus:"autofocus",autoPlay:"autoplay",encType:"enctype",hrefLang:"hreflang",radioGroup:"radiogroup",spellCheck:"spellcheck",srcDoc:"srcdoc",srcSet:"srcset"}};t.exports=f},{"./DOMProperty":11,"./ExecutionEnvironment":22}],24:[function(e,t){"use strict";function n(e){u(null==e.props.checkedLink||null==e.props.valueLink)}function r(e){n(e),u(null==e.props.value&&null==e.props.onChange)}function o(e){n(e),u(null==e.props.checked&&null==e.props.onChange)}function a(e){this.props.valueLink.requestChange(e.target.value)}function i(e){this.props.checkedLink.requestChange(e.target.checked)}var s=e("./ReactPropTypes"),u=e("./invariant"),c={button:!0,checkbox:!0,image:!0,hidden:!0,radio:!0,reset:!0,submit:!0},l={Mixin:{propTypes:{value:function(e,t){return!e[t]||c[e.type]||e.onChange||e.readOnly||e.disabled?void 0:new Error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.")},checked:function(e,t){return!e[t]||e.onChange||e.readOnly||e.disabled?void 0:new Error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.")},onChange:s.func}},getValue:function(e){return e.props.valueLink?(r(e),e.props.valueLink.value):e.props.value},getChecked:function(e){return e.props.checkedLink?(o(e),e.props.checkedLink.value):e.props.checked},getOnChange:function(e){return e.props.valueLink?(r(e),a):e.props.checkedLink?(o(e),i):e.props.onChange}};t.exports=l},{"./ReactPropTypes":70,"./invariant":124}],25:[function(e,t){"use strict";function n(e){e.remove()}var r=e("./ReactBrowserEventEmitter"),o=e("./accumulateInto"),a=e("./forEachAccumulated"),i=e("./invariant"),s={trapBubbledEvent:function(e,t){i(this.isMounted());var n=r.trapBubbledEvent(e,t,this.getDOMNode());this._localEventListeners=o(this._localEventListeners,n)},componentWillUnmount:function(){this._localEventListeners&&a(this._localEventListeners,n)}};t.exports=s},{"./ReactBrowserEventEmitter":30,"./accumulateInto":95,"./forEachAccumulated":110,"./invariant":124}],26:[function(e,t){"use strict";var n=e("./EventConstants"),r=e("./emptyFunction"),o=n.topLevelTypes,a={eventTypes:null,extractEvents:function(e,t,n,a){if(e===o.topTouchStart){var i=a.target;i&&!i.onclick&&(i.onclick=r)}}};t.exports=a},{"./EventConstants":16,"./emptyFunction":105}],27:[function(e,t){function n(e){if(null==e)throw new TypeError("Object.assign target cannot be null or undefined");for(var t=Object(e),n=Object.prototype.hasOwnProperty,r=1;r<arguments.length;r++){var o=arguments[r];if(null!=o){var a=Object(o);for(var i in a)n.call(a,i)&&(t[i]=a[i])}}return t}t.exports=n},{}],28:[function(e,t){"use strict";var n=e("./invariant"),r=function(e){var t=this;if(t.instancePool.length){var n=t.instancePool.pop();return t.call(n,e),n}return new t(e)},o=function(e,t){var n=this;if(n.instancePool.length){var r=n.instancePool.pop();return n.call(r,e,t),r}return new n(e,t)},a=function(e,t,n){var r=this;
if(r.instancePool.length){var o=r.instancePool.pop();return r.call(o,e,t,n),o}return new r(e,t,n)},i=function(e,t,n,r,o){var a=this;if(a.instancePool.length){var i=a.instancePool.pop();return a.call(i,e,t,n,r,o),i}return new a(e,t,n,r,o)},s=function(e){var t=this;n(e instanceof t),e.destructor&&e.destructor(),t.instancePool.length<t.poolSize&&t.instancePool.push(e)},u=10,c=r,l=function(e,t){var n=e;return n.instancePool=[],n.getPooled=t||c,n.poolSize||(n.poolSize=u),n.release=s,n},p={addPoolingTo:l,oneArgumentPooler:r,twoArgumentPooler:o,threeArgumentPooler:a,fiveArgumentPooler:i};t.exports=p},{"./invariant":124}],29:[function(e,t){"use strict";var n=e("./ReactEmptyComponent"),r=e("./ReactMount"),o=e("./invariant"),a={getDOMNode:function(){return o(this.isMounted()),n.isNullComponentID(this._rootNodeID)?null:r.getNode(this._rootNodeID)}};t.exports=a},{"./ReactEmptyComponent":52,"./ReactMount":61,"./invariant":124}],30:[function(e,t){"use strict";function n(e){return Object.prototype.hasOwnProperty.call(e,h)||(e[h]=d++,l[e[h]]={}),l[e[h]]}var r=e("./EventConstants"),o=e("./EventPluginHub"),a=e("./EventPluginRegistry"),i=e("./ReactEventEmitterMixin"),s=e("./ViewportMetrics"),u=e("./Object.assign"),c=e("./isEventSupported"),l={},p=!1,d=0,f={topBlur:"blur",topChange:"change",topClick:"click",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topScroll:"scroll",topSelectionChange:"selectionchange",topTextInput:"textInput",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",topTouchStart:"touchstart",topWheel:"wheel"},h="_reactListenersID"+String(Math.random()).slice(2),m=u({},i,{ReactEventListener:null,injection:{injectReactEventListener:function(e){e.setHandleTopLevel(m.handleTopLevel),m.ReactEventListener=e}},setEnabled:function(e){m.ReactEventListener&&m.ReactEventListener.setEnabled(e)},isEnabled:function(){return!(!m.ReactEventListener||!m.ReactEventListener.isEnabled())},listenTo:function(e,t){for(var o=t,i=n(o),s=a.registrationNameDependencies[e],u=r.topLevelTypes,l=0,p=s.length;p>l;l++){var d=s[l];i.hasOwnProperty(d)&&i[d]||(d===u.topWheel?c("wheel")?m.ReactEventListener.trapBubbledEvent(u.topWheel,"wheel",o):c("mousewheel")?m.ReactEventListener.trapBubbledEvent(u.topWheel,"mousewheel",o):m.ReactEventListener.trapBubbledEvent(u.topWheel,"DOMMouseScroll",o):d===u.topScroll?c("scroll",!0)?m.ReactEventListener.trapCapturedEvent(u.topScroll,"scroll",o):m.ReactEventListener.trapBubbledEvent(u.topScroll,"scroll",m.ReactEventListener.WINDOW_HANDLE):d===u.topFocus||d===u.topBlur?(c("focus",!0)?(m.ReactEventListener.trapCapturedEvent(u.topFocus,"focus",o),m.ReactEventListener.trapCapturedEvent(u.topBlur,"blur",o)):c("focusin")&&(m.ReactEventListener.trapBubbledEvent(u.topFocus,"focusin",o),m.ReactEventListener.trapBubbledEvent(u.topBlur,"focusout",o)),i[u.topBlur]=!0,i[u.topFocus]=!0):f.hasOwnProperty(d)&&m.ReactEventListener.trapBubbledEvent(d,f[d],o),i[d]=!0)}},trapBubbledEvent:function(e,t,n){return m.ReactEventListener.trapBubbledEvent(e,t,n)},trapCapturedEvent:function(e,t,n){return m.ReactEventListener.trapCapturedEvent(e,t,n)},ensureScrollValueMonitoring:function(){if(!p){var e=s.refreshScrollValues;m.ReactEventListener.monitorScrollValue(e),p=!0}},eventNameDispatchConfigs:o.eventNameDispatchConfigs,registrationNameModules:o.registrationNameModules,putListener:o.putListener,getListener:o.getListener,deleteListener:o.deleteListener,deleteAllListeners:o.deleteAllListeners});t.exports=m},{"./EventConstants":16,"./EventPluginHub":18,"./EventPluginRegistry":19,"./Object.assign":27,"./ReactEventEmitterMixin":54,"./ViewportMetrics":94,"./isEventSupported":125}],31:[function(e,t){"use strict";function n(e,t){this.forEachFunction=e,this.forEachContext=t}function r(e,t,n,r){var o=e;o.forEachFunction.call(o.forEachContext,t,r)}function o(e,t,o){if(null==e)return e;var a=n.getPooled(t,o);p(e,r,a),n.release(a)}function a(e,t,n){this.mapResult=e,this.mapFunction=t,this.mapContext=n}function i(e,t,n,r){var o=e,a=o.mapResult,i=!a.hasOwnProperty(n);if(i){var s=o.mapFunction.call(o.mapContext,t,r);a[n]=s}}function s(e,t,n){if(null==e)return e;var r={},o=a.getPooled(r,t,n);return p(e,i,o),a.release(o),r}function u(){return null}function c(e){return p(e,u,null)}var l=e("./PooledClass"),p=e("./traverseAllChildren"),d=(e("./warning"),l.twoArgumentPooler),f=l.threeArgumentPooler;l.addPoolingTo(n,d),l.addPoolingTo(a,f);var h={forEach:o,map:s,count:c};t.exports=h},{"./PooledClass":28,"./traverseAllChildren":140,"./warning":141}],32:[function(e,t){"use strict";var n=e("./ReactElement"),r=e("./ReactOwner"),o=e("./ReactUpdates"),a=e("./Object.assign"),i=e("./invariant"),s=e("./keyMirror"),u=s({MOUNTED:null,UNMOUNTED:null}),c=!1,l=null,p=null,d={injection:{injectEnvironment:function(e){i(!c),p=e.mountImageIntoNode,l=e.unmountIDFromEnvironment,d.BackendIDOperations=e.BackendIDOperations,c=!0}},LifeCycle:u,BackendIDOperations:null,Mixin:{isMounted:function(){return this._lifeCycleState===u.MOUNTED},setProps:function(e,t){var n=this._pendingElement||this._currentElement;this.replaceProps(a({},n.props,e),t)},replaceProps:function(e,t){i(this.isMounted()),i(0===this._mountDepth),this._pendingElement=n.cloneAndReplaceProps(this._pendingElement||this._currentElement,e),o.enqueueUpdate(this,t)},_setPropsInternal:function(e,t){var r=this._pendingElement||this._currentElement;this._pendingElement=n.cloneAndReplaceProps(r,a({},r.props,e)),o.enqueueUpdate(this,t)},construct:function(e){this.props=e.props,this._owner=e._owner,this._lifeCycleState=u.UNMOUNTED,this._pendingCallbacks=null,this._currentElement=e,this._pendingElement=null},mountComponent:function(e,t,n){i(!this.isMounted());var o=this._currentElement.ref;if(null!=o){var a=this._currentElement._owner;r.addComponentAsRefTo(this,o,a)}this._rootNodeID=e,this._lifeCycleState=u.MOUNTED,this._mountDepth=n},unmountComponent:function(){i(this.isMounted());var e=this._currentElement.ref;null!=e&&r.removeComponentAsRefFrom(this,e,this._owner),l(this._rootNodeID),this._rootNodeID=null,this._lifeCycleState=u.UNMOUNTED},receiveComponent:function(e,t){i(this.isMounted()),this._pendingElement=e,this.performUpdateIfNecessary(t)},performUpdateIfNecessary:function(e){if(null!=this._pendingElement){var t=this._currentElement,n=this._pendingElement;this._currentElement=n,this.props=n.props,this._owner=n._owner,this._pendingElement=null,this.updateComponent(e,t)}},updateComponent:function(e,t){var n=this._currentElement;(n._owner!==t._owner||n.ref!==t.ref)&&(null!=t.ref&&r.removeComponentAsRefFrom(this,t.ref,t._owner),null!=n.ref&&r.addComponentAsRefTo(this,n.ref,n._owner))},mountComponentIntoNode:function(e,t,n){var r=o.ReactReconcileTransaction.getPooled();r.perform(this._mountComponentIntoNode,this,e,t,r,n),o.ReactReconcileTransaction.release(r)},_mountComponentIntoNode:function(e,t,n,r){var o=this.mountComponent(e,n,0);p(o,t,r)},isOwnedBy:function(e){return this._owner===e},getSiblingByRef:function(e){var t=this._owner;return t&&t.refs?t.refs[e]:null}}};t.exports=d},{"./Object.assign":27,"./ReactElement":50,"./ReactOwner":65,"./ReactUpdates":77,"./invariant":124,"./keyMirror":130}],33:[function(e,t){"use strict";var n=e("./ReactDOMIDOperations"),r=e("./ReactMarkupChecksum"),o=e("./ReactMount"),a=e("./ReactPerf"),i=e("./ReactReconcileTransaction"),s=e("./getReactRootElementInContainer"),u=e("./invariant"),c=e("./setInnerHTML"),l=1,p=9,d={ReactReconcileTransaction:i,BackendIDOperations:n,unmountIDFromEnvironment:function(e){o.purgeID(e)},mountImageIntoNode:a.measure("ReactComponentBrowserEnvironment","mountImageIntoNode",function(e,t,n){if(u(t&&(t.nodeType===l||t.nodeType===p)),n){if(r.canReuseMarkup(e,s(t)))return;u(t.nodeType!==p)}u(t.nodeType!==p),c(t,e)})};t.exports=d},{"./ReactDOMIDOperations":41,"./ReactMarkupChecksum":60,"./ReactMount":61,"./ReactPerf":66,"./ReactReconcileTransaction":72,"./getReactRootElementInContainer":118,"./invariant":124,"./setInnerHTML":136}],34:[function(e,t){"use strict";function n(e){var t=e._owner||null;return t&&t.constructor&&t.constructor.displayName?" Check the render method of `"+t.constructor.displayName+"`.":""}function r(e,t){for(var n in t)t.hasOwnProperty(n)&&D("function"==typeof t[n])}function o(e,t){var n=S.hasOwnProperty(t)?S[t]:null;L.hasOwnProperty(t)&&D(n===N.OVERRIDE_BASE),e.hasOwnProperty(t)&&D(n===N.DEFINE_MANY||n===N.DEFINE_MANY_MERGED)}function a(e){var t=e._compositeLifeCycleState;D(e.isMounted()||t===A.MOUNTING),D(null==f.current),D(t!==A.UNMOUNTING)}function i(e,t){if(t){D(!g.isValidFactory(t)),D(!h.isValidElement(t));var n=e.prototype;t.hasOwnProperty(T)&&k.mixins(e,t.mixins);for(var r in t)if(t.hasOwnProperty(r)&&r!==T){var a=t[r];if(o(n,r),k.hasOwnProperty(r))k[r](e,a);else{var i=S.hasOwnProperty(r),s=n.hasOwnProperty(r),u=a&&a.__reactDontBind,p="function"==typeof a,d=p&&!i&&!s&&!u;if(d)n.__reactAutoBindMap||(n.__reactAutoBindMap={}),n.__reactAutoBindMap[r]=a,n[r]=a;else if(s){var f=S[r];D(i&&(f===N.DEFINE_MANY_MERGED||f===N.DEFINE_MANY)),f===N.DEFINE_MANY_MERGED?n[r]=c(n[r],a):f===N.DEFINE_MANY&&(n[r]=l(n[r],a))}else n[r]=a}}}}function s(e,t){if(t)for(var n in t){var r=t[n];if(t.hasOwnProperty(n)){var o=n in k;D(!o);var a=n in e;D(!a),e[n]=r}}}function u(e,t){return D(e&&t&&"object"==typeof e&&"object"==typeof t),_(t,function(t,n){D(void 0===e[n]),e[n]=t}),e}function c(e,t){return function(){var n=e.apply(this,arguments),r=t.apply(this,arguments);return null==n?r:null==r?n:u(n,r)}}function l(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}var p=e("./ReactComponent"),d=e("./ReactContext"),f=e("./ReactCurrentOwner"),h=e("./ReactElement"),m=(e("./ReactElementValidator"),e("./ReactEmptyComponent")),v=e("./ReactErrorUtils"),g=e("./ReactLegacyElement"),y=e("./ReactOwner"),E=e("./ReactPerf"),C=e("./ReactPropTransferer"),R=e("./ReactPropTypeLocations"),M=(e("./ReactPropTypeLocationNames"),e("./ReactUpdates")),b=e("./Object.assign"),O=e("./instantiateReactComponent"),D=e("./invariant"),x=e("./keyMirror"),P=e("./keyOf"),_=(e("./monitorCodeUse"),e("./mapObject")),w=e("./shouldUpdateReactComponent"),T=(e("./warning"),P({mixins:null})),N=x({DEFINE_ONCE:null,DEFINE_MANY:null,OVERRIDE_BASE:null,DEFINE_MANY_MERGED:null}),I=[],S={mixins:N.DEFINE_MANY,statics:N.DEFINE_MANY,propTypes:N.DEFINE_MANY,contextTypes:N.DEFINE_MANY,childContextTypes:N.DEFINE_MANY,getDefaultProps:N.DEFINE_MANY_MERGED,getInitialState:N.DEFINE_MANY_MERGED,getChildContext:N.DEFINE_MANY_MERGED,render:N.DEFINE_ONCE,componentWillMount:N.DEFINE_MANY,componentDidMount:N.DEFINE_MANY,componentWillReceiveProps:N.DEFINE_MANY,shouldComponentUpdate:N.DEFINE_ONCE,componentWillUpdate:N.DEFINE_MANY,componentDidUpdate:N.DEFINE_MANY,componentWillUnmount:N.DEFINE_MANY,updateComponent:N.OVERRIDE_BASE},k={displayName:function(e,t){e.displayName=t},mixins:function(e,t){if(t)for(var n=0;n<t.length;n++)i(e,t[n])},childContextTypes:function(e,t){r(e,t,R.childContext),e.childContextTypes=b({},e.childContextTypes,t)},contextTypes:function(e,t){r(e,t,R.context),e.contextTypes=b({},e.contextTypes,t)},getDefaultProps:function(e,t){e.getDefaultProps=e.getDefaultProps?c(e.getDefaultProps,t):t},propTypes:function(e,t){r(e,t,R.prop),e.propTypes=b({},e.propTypes,t)},statics:function(e,t){s(e,t)}},A=x({MOUNTING:null,UNMOUNTING:null,RECEIVING_PROPS:null}),L={construct:function(){p.Mixin.construct.apply(this,arguments),y.Mixin.construct.apply(this,arguments),this.state=null,this._pendingState=null,this.context=null,this._compositeLifeCycleState=null},isMounted:function(){return p.Mixin.isMounted.call(this)&&this._compositeLifeCycleState!==A.MOUNTING},mountComponent:E.measure("ReactCompositeComponent","mountComponent",function(e,t,n){p.Mixin.mountComponent.call(this,e,t,n),this._compositeLifeCycleState=A.MOUNTING,this.__reactAutoBindMap&&this._bindAutoBindMethods(),this.context=this._processContext(this._currentElement._context),this.props=this._processProps(this.props),this.state=this.getInitialState?this.getInitialState():null,D("object"==typeof this.state&&!Array.isArray(this.state)),this._pendingState=null,this._pendingForceUpdate=!1,this.componentWillMount&&(this.componentWillMount(),this._pendingState&&(this.state=this._pendingState,this._pendingState=null)),this._renderedComponent=O(this._renderValidatedComponent(),this._currentElement.type),this._compositeLifeCycleState=null;var r=this._renderedComponent.mountComponent(e,t,n+1);return this.componentDidMount&&t.getReactMountReady().enqueue(this.componentDidMount,this),r}),unmountComponent:function(){this._compositeLifeCycleState=A.UNMOUNTING,this.componentWillUnmount&&this.componentWillUnmount(),this._compositeLifeCycleState=null,this._renderedComponent.unmountComponent(),this._renderedComponent=null,p.Mixin.unmountComponent.call(this)},setState:function(e,t){D("object"==typeof e||null==e),this.replaceState(b({},this._pendingState||this.state,e),t)},replaceState:function(e,t){a(this),this._pendingState=e,this._compositeLifeCycleState!==A.MOUNTING&&M.enqueueUpdate(this,t)},_processContext:function(e){var t=null,n=this.constructor.contextTypes;if(n){t={};for(var r in n)t[r]=e[r]}return t},_processChildContext:function(e){var t=this.getChildContext&&this.getChildContext();if(this.constructor.displayName||"ReactCompositeComponent",t){D("object"==typeof this.constructor.childContextTypes);for(var n in t)D(n in this.constructor.childContextTypes);return b({},e,t)}return e},_processProps:function(e){return e},_checkPropTypes:function(e,t,r){var o=this.constructor.displayName;for(var a in e)if(e.hasOwnProperty(a)){var i=e[a](t,a,o,r);i instanceof Error&&n(this)}},performUpdateIfNecessary:function(e){var t=this._compositeLifeCycleState;if(t!==A.MOUNTING&&t!==A.RECEIVING_PROPS&&(null!=this._pendingElement||null!=this._pendingState||this._pendingForceUpdate)){var n=this.context,r=this.props,o=this._currentElement;null!=this._pendingElement&&(o=this._pendingElement,n=this._processContext(o._context),r=this._processProps(o.props),this._pendingElement=null,this._compositeLifeCycleState=A.RECEIVING_PROPS,this.componentWillReceiveProps&&this.componentWillReceiveProps(r,n)),this._compositeLifeCycleState=null;var a=this._pendingState||this.state;this._pendingState=null;var i=this._pendingForceUpdate||!this.shouldComponentUpdate||this.shouldComponentUpdate(r,a,n);i?(this._pendingForceUpdate=!1,this._performComponentUpdate(o,r,a,n,e)):(this._currentElement=o,this.props=r,this.state=a,this.context=n,this._owner=o._owner)}},_performComponentUpdate:function(e,t,n,r,o){var a=this._currentElement,i=this.props,s=this.state,u=this.context;this.componentWillUpdate&&this.componentWillUpdate(t,n,r),this._currentElement=e,this.props=t,this.state=n,this.context=r,this._owner=e._owner,this.updateComponent(o,a),this.componentDidUpdate&&o.getReactMountReady().enqueue(this.componentDidUpdate.bind(this,i,s,u),this)},receiveComponent:function(e,t){(e!==this._currentElement||null==e._owner)&&p.Mixin.receiveComponent.call(this,e,t)},updateComponent:E.measure("ReactCompositeComponent","updateComponent",function(e,t){p.Mixin.updateComponent.call(this,e,t);var n=this._renderedComponent,r=n._currentElement,o=this._renderValidatedComponent();if(w(r,o))n.receiveComponent(o,e);else{var a=this._rootNodeID,i=n._rootNodeID;n.unmountComponent(),this._renderedComponent=O(o,this._currentElement.type);var s=this._renderedComponent.mountComponent(a,e,this._mountDepth+1);p.BackendIDOperations.dangerouslyReplaceNodeWithMarkupByID(i,s)}}),forceUpdate:function(e){var t=this._compositeLifeCycleState;D(this.isMounted()||t===A.MOUNTING),D(t!==A.UNMOUNTING&&null==f.current),this._pendingForceUpdate=!0,M.enqueueUpdate(this,e)},_renderValidatedComponent:E.measure("ReactCompositeComponent","_renderValidatedComponent",function(){var e,t=d.current;d.current=this._processChildContext(this._currentElement._context),f.current=this;try{e=this.render(),null===e||e===!1?(e=m.getEmptyComponent(),m.registerNullComponentID(this._rootNodeID)):m.deregisterNullComponentID(this._rootNodeID)}finally{d.current=t,f.current=null}return D(h.isValidElement(e)),e}),_bindAutoBindMethods:function(){for(var e in this.__reactAutoBindMap)if(this.__reactAutoBindMap.hasOwnProperty(e)){var t=this.__reactAutoBindMap[e];this[e]=this._bindAutoBindMethod(v.guard(t,this.constructor.displayName+"."+e))}},_bindAutoBindMethod:function(e){var t=this,n=e.bind(t);return n}},U=function(){};b(U.prototype,p.Mixin,y.Mixin,C.Mixin,L);var F={LifeCycle:A,Base:U,createClass:function(e){var t=function(){};t.prototype=new U,t.prototype.constructor=t,I.forEach(i.bind(null,t)),i(t,e),t.getDefaultProps&&(t.defaultProps=t.getDefaultProps()),D(t.prototype.render);for(var n in S)t.prototype[n]||(t.prototype[n]=null);return g.wrapFactory(h.createFactory(t))},injection:{injectMixin:function(e){I.push(e)}}};t.exports=F},{"./Object.assign":27,"./ReactComponent":32,"./ReactContext":35,"./ReactCurrentOwner":36,"./ReactElement":50,"./ReactElementValidator":51,"./ReactEmptyComponent":52,"./ReactErrorUtils":53,"./ReactLegacyElement":59,"./ReactOwner":65,"./ReactPerf":66,"./ReactPropTransferer":67,"./ReactPropTypeLocationNames":68,"./ReactPropTypeLocations":69,"./ReactUpdates":77,"./instantiateReactComponent":123,"./invariant":124,"./keyMirror":130,"./keyOf":131,"./mapObject":132,"./monitorCodeUse":134,"./shouldUpdateReactComponent":138,"./warning":141}],35:[function(e,t){"use strict";var n=e("./Object.assign"),r={current:{},withContext:function(e,t){var o,a=r.current;r.current=n({},a,e);try{o=t()}finally{r.current=a}return o}};t.exports=r},{"./Object.assign":27}],36:[function(e,t){"use strict";var n={current:null};t.exports=n},{}],37:[function(e,t){"use strict";function n(e){return o.markNonLegacyFactory(r.createFactory(e))}var r=e("./ReactElement"),o=(e("./ReactElementValidator"),e("./ReactLegacyElement")),a=e("./mapObject"),i=a({a:"a",abbr:"abbr",address:"address",area:"area",article:"article",aside:"aside",audio:"audio",b:"b",base:"base",bdi:"bdi",bdo:"bdo",big:"big",blockquote:"blockquote",body:"body",br:"br",button:"button",canvas:"canvas",caption:"caption",cite:"cite",code:"code",col:"col",colgroup:"colgroup",data:"data",datalist:"datalist",dd:"dd",del:"del",details:"details",dfn:"dfn",dialog:"dialog",div:"div",dl:"dl",dt:"dt",em:"em",embed:"embed",fieldset:"fieldset",figcaption:"figcaption",figure:"figure",footer:"footer",form:"form",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",head:"head",header:"header",hr:"hr",html:"html",i:"i",iframe:"iframe",img:"img",input:"input",ins:"ins",kbd:"kbd",keygen:"keygen",label:"label",legend:"legend",li:"li",link:"link",main:"main",map:"map",mark:"mark",menu:"menu",menuitem:"menuitem",meta:"meta",meter:"meter",nav:"nav",noscript:"noscript",object:"object",ol:"ol",optgroup:"optgroup",option:"option",output:"output",p:"p",param:"param",picture:"picture",pre:"pre",progress:"progress",q:"q",rp:"rp",rt:"rt",ruby:"ruby",s:"s",samp:"samp",script:"script",section:"section",select:"select",small:"small",source:"source",span:"span",strong:"strong",style:"style",sub:"sub",summary:"summary",sup:"sup",table:"table",tbody:"tbody",td:"td",textarea:"textarea",tfoot:"tfoot",th:"th",thead:"thead",time:"time",title:"title",tr:"tr",track:"track",u:"u",ul:"ul","var":"var",video:"video",wbr:"wbr",circle:"circle",defs:"defs",ellipse:"ellipse",g:"g",line:"line",linearGradient:"linearGradient",mask:"mask",path:"path",pattern:"pattern",polygon:"polygon",polyline:"polyline",radialGradient:"radialGradient",rect:"rect",stop:"stop",svg:"svg",text:"text",tspan:"tspan"},n);t.exports=i},{"./ReactElement":50,"./ReactElementValidator":51,"./ReactLegacyElement":59,"./mapObject":132}],38:[function(e,t){"use strict";var n=e("./AutoFocusMixin"),r=e("./ReactBrowserComponentMixin"),o=e("./ReactCompositeComponent"),a=e("./ReactElement"),i=e("./ReactDOM"),s=e("./keyMirror"),u=a.createFactory(i.button.type),c=s({onClick:!0,onDoubleClick:!0,onMouseDown:!0,onMouseMove:!0,onMouseUp:!0,onClickCapture:!0,onDoubleClickCapture:!0,onMouseDownCapture:!0,onMouseMoveCapture:!0,onMouseUpCapture:!0}),l=o.createClass({displayName:"ReactDOMButton",mixins:[n,r],render:function(){var e={};for(var t in this.props)!this.props.hasOwnProperty(t)||this.props.disabled&&c[t]||(e[t]=this.props[t]);return u(e,this.props.children)}});t.exports=l},{"./AutoFocusMixin":2,"./ReactBrowserComponentMixin":29,"./ReactCompositeComponent":34,"./ReactDOM":37,"./ReactElement":50,"./keyMirror":130}],39:[function(e,t){"use strict";function n(e){e&&(g(null==e.children||null==e.dangerouslySetInnerHTML),g(null==e.style||"object"==typeof e.style))}function r(e,t,n,r){var o=d.findReactContainerForID(e);if(o){var a=o.nodeType===O?o.ownerDocument:o;C(t,a)}r.getPutListenerQueue().enqueuePutListener(e,t,n)}function o(e){_.call(P,e)||(g(x.test(e)),P[e]=!0)}function a(e){o(e),this._tag=e,this.tagName=e.toUpperCase()}var i=e("./CSSPropertyOperations"),s=e("./DOMProperty"),u=e("./DOMPropertyOperations"),c=e("./ReactBrowserComponentMixin"),l=e("./ReactComponent"),p=e("./ReactBrowserEventEmitter"),d=e("./ReactMount"),f=e("./ReactMultiChild"),h=e("./ReactPerf"),m=e("./Object.assign"),v=e("./escapeTextForBrowser"),g=e("./invariant"),y=(e("./isEventSupported"),e("./keyOf")),E=(e("./monitorCodeUse"),p.deleteListener),C=p.listenTo,R=p.registrationNameModules,M={string:!0,number:!0},b=y({style:null}),O=1,D={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},x=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,P={},_={}.hasOwnProperty;a.displayName="ReactDOMComponent",a.Mixin={mountComponent:h.measure("ReactDOMComponent","mountComponent",function(e,t,r){l.Mixin.mountComponent.call(this,e,t,r),n(this.props);var o=D[this._tag]?"":"</"+this._tag+">";return this._createOpenTagMarkupAndPutListeners(t)+this._createContentMarkup(t)+o}),_createOpenTagMarkupAndPutListeners:function(e){var t=this.props,n="<"+this._tag;for(var o in t)if(t.hasOwnProperty(o)){var a=t[o];if(null!=a)if(R.hasOwnProperty(o))r(this._rootNodeID,o,a,e);else{o===b&&(a&&(a=t.style=m({},t.style)),a=i.createMarkupForStyles(a));var s=u.createMarkupForProperty(o,a);s&&(n+=" "+s)}}if(e.renderToStaticMarkup)return n+">";var c=u.createMarkupForID(this._rootNodeID);return n+" "+c+">"},_createContentMarkup:function(e){var t=this.props.dangerouslySetInnerHTML;if(null!=t){if(null!=t.__html)return t.__html}else{var n=M[typeof this.props.children]?this.props.children:null,r=null!=n?null:this.props.children;if(null!=n)return v(n);if(null!=r){var o=this.mountChildren(r,e);return o.join("")}}return""},receiveComponent:function(e,t){(e!==this._currentElement||null==e._owner)&&l.Mixin.receiveComponent.call(this,e,t)},updateComponent:h.measure("ReactDOMComponent","updateComponent",function(e,t){n(this._currentElement.props),l.Mixin.updateComponent.call(this,e,t),this._updateDOMProperties(t.props,e),this._updateDOMChildren(t.props,e)}),_updateDOMProperties:function(e,t){var n,o,a,i=this.props;for(n in e)if(!i.hasOwnProperty(n)&&e.hasOwnProperty(n))if(n===b){var u=e[n];for(o in u)u.hasOwnProperty(o)&&(a=a||{},a[o]="")}else R.hasOwnProperty(n)?E(this._rootNodeID,n):(s.isStandardName[n]||s.isCustomAttribute(n))&&l.BackendIDOperations.deletePropertyByID(this._rootNodeID,n);for(n in i){var c=i[n],p=e[n];if(i.hasOwnProperty(n)&&c!==p)if(n===b)if(c&&(c=i.style=m({},c)),p){for(o in p)!p.hasOwnProperty(o)||c&&c.hasOwnProperty(o)||(a=a||{},a[o]="");for(o in c)c.hasOwnProperty(o)&&p[o]!==c[o]&&(a=a||{},a[o]=c[o])}else a=c;else R.hasOwnProperty(n)?r(this._rootNodeID,n,c,t):(s.isStandardName[n]||s.isCustomAttribute(n))&&l.BackendIDOperations.updatePropertyByID(this._rootNodeID,n,c)}a&&l.BackendIDOperations.updateStylesByID(this._rootNodeID,a)},_updateDOMChildren:function(e,t){var n=this.props,r=M[typeof e.children]?e.children:null,o=M[typeof n.children]?n.children:null,a=e.dangerouslySetInnerHTML&&e.dangerouslySetInnerHTML.__html,i=n.dangerouslySetInnerHTML&&n.dangerouslySetInnerHTML.__html,s=null!=r?null:e.children,u=null!=o?null:n.children,c=null!=r||null!=a,p=null!=o||null!=i;null!=s&&null==u?this.updateChildren(null,t):c&&!p&&this.updateTextContent(""),null!=o?r!==o&&this.updateTextContent(""+o):null!=i?a!==i&&l.BackendIDOperations.updateInnerHTMLByID(this._rootNodeID,i):null!=u&&this.updateChildren(u,t)},unmountComponent:function(){this.unmountChildren(),p.deleteAllListeners(this._rootNodeID),l.Mixin.unmountComponent.call(this)}},m(a.prototype,l.Mixin,a.Mixin,f.Mixin,c),t.exports=a},{"./CSSPropertyOperations":5,"./DOMProperty":11,"./DOMPropertyOperations":12,"./Object.assign":27,"./ReactBrowserComponentMixin":29,"./ReactBrowserEventEmitter":30,"./ReactComponent":32,"./ReactMount":61,"./ReactMultiChild":62,"./ReactPerf":66,"./escapeTextForBrowser":107,"./invariant":124,"./isEventSupported":125,"./keyOf":131,"./monitorCodeUse":134}],40:[function(e,t){"use strict";var n=e("./EventConstants"),r=e("./LocalEventTrapMixin"),o=e("./ReactBrowserComponentMixin"),a=e("./ReactCompositeComponent"),i=e("./ReactElement"),s=e("./ReactDOM"),u=i.createFactory(s.form.type),c=a.createClass({displayName:"ReactDOMForm",mixins:[o,r],render:function(){return u(this.props)},componentDidMount:function(){this.trapBubbledEvent(n.topLevelTypes.topReset,"reset"),this.trapBubbledEvent(n.topLevelTypes.topSubmit,"submit")}});t.exports=c},{"./EventConstants":16,"./LocalEventTrapMixin":25,"./ReactBrowserComponentMixin":29,"./ReactCompositeComponent":34,"./ReactDOM":37,"./ReactElement":50}],41:[function(e,t){"use strict";var n=e("./CSSPropertyOperations"),r=e("./DOMChildrenOperations"),o=e("./DOMPropertyOperations"),a=e("./ReactMount"),i=e("./ReactPerf"),s=e("./invariant"),u=e("./setInnerHTML"),c={dangerouslySetInnerHTML:"`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.",style:"`style` must be set using `updateStylesByID()`."},l={updatePropertyByID:i.measure("ReactDOMIDOperations","updatePropertyByID",function(e,t,n){var r=a.getNode(e);s(!c.hasOwnProperty(t)),null!=n?o.setValueForProperty(r,t,n):o.deleteValueForProperty(r,t)}),deletePropertyByID:i.measure("ReactDOMIDOperations","deletePropertyByID",function(e,t,n){var r=a.getNode(e);s(!c.hasOwnProperty(t)),o.deleteValueForProperty(r,t,n)}),updateStylesByID:i.measure("ReactDOMIDOperations","updateStylesByID",function(e,t){var r=a.getNode(e);n.setValueForStyles(r,t)}),updateInnerHTMLByID:i.measure("ReactDOMIDOperations","updateInnerHTMLByID",function(e,t){var n=a.getNode(e);u(n,t)}),updateTextContentByID:i.measure("ReactDOMIDOperations","updateTextContentByID",function(e,t){var n=a.getNode(e);r.updateTextContent(n,t)}),dangerouslyReplaceNodeWithMarkupByID:i.measure("ReactDOMIDOperations","dangerouslyReplaceNodeWithMarkupByID",function(e,t){var n=a.getNode(e);r.dangerouslyReplaceNodeWithMarkup(n,t)}),dangerouslyProcessChildrenUpdates:i.measure("ReactDOMIDOperations","dangerouslyProcessChildrenUpdates",function(e,t){for(var n=0;n<e.length;n++)e[n].parentNode=a.getNode(e[n].parentID);r.processUpdates(e,t)})};t.exports=l},{"./CSSPropertyOperations":5,"./DOMChildrenOperations":10,"./DOMPropertyOperations":12,"./ReactMount":61,"./ReactPerf":66,"./invariant":124,"./setInnerHTML":136}],42:[function(e,t){"use strict";var n=e("./EventConstants"),r=e("./LocalEventTrapMixin"),o=e("./ReactBrowserComponentMixin"),a=e("./ReactCompositeComponent"),i=e("./ReactElement"),s=e("./ReactDOM"),u=i.createFactory(s.img.type),c=a.createClass({displayName:"ReactDOMImg",tagName:"IMG",mixins:[o,r],render:function(){return u(this.props)},componentDidMount:function(){this.trapBubbledEvent(n.topLevelTypes.topLoad,"load"),this.trapBubbledEvent(n.topLevelTypes.topError,"error")}});t.exports=c},{"./EventConstants":16,"./LocalEventTrapMixin":25,"./ReactBrowserComponentMixin":29,"./ReactCompositeComponent":34,"./ReactDOM":37,"./ReactElement":50}],43:[function(e,t){"use strict";function n(){this.isMounted()&&this.forceUpdate()}var r=e("./AutoFocusMixin"),o=e("./DOMPropertyOperations"),a=e("./LinkedValueUtils"),i=e("./ReactBrowserComponentMixin"),s=e("./ReactCompositeComponent"),u=e("./ReactElement"),c=e("./ReactDOM"),l=e("./ReactMount"),p=e("./ReactUpdates"),d=e("./Object.assign"),f=e("./invariant"),h=u.createFactory(c.input.type),m={},v=s.createClass({displayName:"ReactDOMInput",mixins:[r,a.Mixin,i],getInitialState:function(){var e=this.props.defaultValue;return{initialChecked:this.props.defaultChecked||!1,initialValue:null!=e?e:null}},render:function(){var e=d({},this.props);e.defaultChecked=null,e.defaultValue=null;var t=a.getValue(this);e.value=null!=t?t:this.state.initialValue;var n=a.getChecked(this);return e.checked=null!=n?n:this.state.initialChecked,e.onChange=this._handleChange,h(e,this.props.children)},componentDidMount:function(){var e=l.getID(this.getDOMNode());m[e]=this},componentWillUnmount:function(){var e=this.getDOMNode(),t=l.getID(e);delete m[t]},componentDidUpdate:function(){var e=this.getDOMNode();null!=this.props.checked&&o.setValueForProperty(e,"checked",this.props.checked||!1);var t=a.getValue(this);null!=t&&o.setValueForProperty(e,"value",""+t)},_handleChange:function(e){var t,r=a.getOnChange(this);r&&(t=r.call(this,e)),p.asap(n,this);var o=this.props.name;if("radio"===this.props.type&&null!=o){for(var i=this.getDOMNode(),s=i;s.parentNode;)s=s.parentNode;for(var u=s.querySelectorAll("input[name="+JSON.stringify(""+o)+'][type="radio"]'),c=0,d=u.length;d>c;c++){var h=u[c];if(h!==i&&h.form===i.form){var v=l.getID(h);f(v);var g=m[v];f(g),p.asap(n,g)}}}return t}});t.exports=v},{"./AutoFocusMixin":2,"./DOMPropertyOperations":12,"./LinkedValueUtils":24,"./Object.assign":27,"./ReactBrowserComponentMixin":29,"./ReactCompositeComponent":34,"./ReactDOM":37,"./ReactElement":50,"./ReactMount":61,"./ReactUpdates":77,"./invariant":124}],44:[function(e,t){"use strict";var n=e("./ReactBrowserComponentMixin"),r=e("./ReactCompositeComponent"),o=e("./ReactElement"),a=e("./ReactDOM"),i=(e("./warning"),o.createFactory(a.option.type)),s=r.createClass({displayName:"ReactDOMOption",mixins:[n],componentWillMount:function(){},render:function(){return i(this.props,this.props.children)}});t.exports=s},{"./ReactBrowserComponentMixin":29,"./ReactCompositeComponent":34,"./ReactDOM":37,"./ReactElement":50,"./warning":141}],45:[function(e,t){"use strict";function n(){this.isMounted()&&(this.setState({value:this._pendingValue}),this._pendingValue=0)}function r(e,t){if(null!=e[t])if(e.multiple){if(!Array.isArray(e[t]))return new Error("The `"+t+"` prop supplied to <select> must be an array if `multiple` is true.")}else if(Array.isArray(e[t]))return new Error("The `"+t+"` prop supplied to <select> must be a scalar value if `multiple` is false.")}function o(e,t){var n,r,o,a=e.props.multiple,i=null!=t?t:e.state.value,s=e.getDOMNode().options;if(a)for(n={},r=0,o=i.length;o>r;++r)n[""+i[r]]=!0;else n=""+i;for(r=0,o=s.length;o>r;r++){var u=a?n.hasOwnProperty(s[r].value):s[r].value===n;u!==s[r].selected&&(s[r].selected=u)}}var a=e("./AutoFocusMixin"),i=e("./LinkedValueUtils"),s=e("./ReactBrowserComponentMixin"),u=e("./ReactCompositeComponent"),c=e("./ReactElement"),l=e("./ReactDOM"),p=e("./ReactUpdates"),d=e("./Object.assign"),f=c.createFactory(l.select.type),h=u.createClass({displayName:"ReactDOMSelect",mixins:[a,i.Mixin,s],propTypes:{defaultValue:r,value:r},getInitialState:function(){return{value:this.props.defaultValue||(this.props.multiple?[]:"")}},componentWillMount:function(){this._pendingValue=null},componentWillReceiveProps:function(e){!this.props.multiple&&e.multiple?this.setState({value:[this.state.value]}):this.props.multiple&&!e.multiple&&this.setState({value:this.state.value[0]})
},render:function(){var e=d({},this.props);return e.onChange=this._handleChange,e.value=null,f(e,this.props.children)},componentDidMount:function(){o(this,i.getValue(this))},componentDidUpdate:function(e){var t=i.getValue(this),n=!!e.multiple,r=!!this.props.multiple;(null!=t||n!==r)&&o(this,t)},_handleChange:function(e){var t,r=i.getOnChange(this);r&&(t=r.call(this,e));var o;if(this.props.multiple){o=[];for(var a=e.target.options,s=0,u=a.length;u>s;s++)a[s].selected&&o.push(a[s].value)}else o=e.target.value;return this._pendingValue=o,p.asap(n,this),t}});t.exports=h},{"./AutoFocusMixin":2,"./LinkedValueUtils":24,"./Object.assign":27,"./ReactBrowserComponentMixin":29,"./ReactCompositeComponent":34,"./ReactDOM":37,"./ReactElement":50,"./ReactUpdates":77}],46:[function(e,t){"use strict";function n(e,t,n,r){return e===n&&t===r}function r(e){var t=document.selection,n=t.createRange(),r=n.text.length,o=n.duplicate();o.moveToElementText(e),o.setEndPoint("EndToStart",n);var a=o.text.length,i=a+r;return{start:a,end:i}}function o(e){var t=window.getSelection&&window.getSelection();if(!t||0===t.rangeCount)return null;var r=t.anchorNode,o=t.anchorOffset,a=t.focusNode,i=t.focusOffset,s=t.getRangeAt(0),u=n(t.anchorNode,t.anchorOffset,t.focusNode,t.focusOffset),c=u?0:s.toString().length,l=s.cloneRange();l.selectNodeContents(e),l.setEnd(s.startContainer,s.startOffset);var p=n(l.startContainer,l.startOffset,l.endContainer,l.endOffset),d=p?0:l.toString().length,f=d+c,h=document.createRange();h.setStart(r,o),h.setEnd(a,i);var m=h.collapsed;return{start:m?f:d,end:m?d:f}}function a(e,t){var n,r,o=document.selection.createRange().duplicate();"undefined"==typeof t.end?(n=t.start,r=n):t.start>t.end?(n=t.end,r=t.start):(n=t.start,r=t.end),o.moveToElementText(e),o.moveStart("character",n),o.setEndPoint("EndToStart",o),o.moveEnd("character",r-n),o.select()}function i(e,t){if(window.getSelection){var n=window.getSelection(),r=e[c()].length,o=Math.min(t.start,r),a="undefined"==typeof t.end?o:Math.min(t.end,r);if(!n.extend&&o>a){var i=a;a=o,o=i}var s=u(e,o),l=u(e,a);if(s&&l){var p=document.createRange();p.setStart(s.node,s.offset),n.removeAllRanges(),o>a?(n.addRange(p),n.extend(l.node,l.offset)):(p.setEnd(l.node,l.offset),n.addRange(p))}}}var s=e("./ExecutionEnvironment"),u=e("./getNodeForCharacterOffset"),c=e("./getTextContentAccessor"),l=s.canUseDOM&&document.selection,p={getOffsets:l?r:o,setOffsets:l?a:i};t.exports=p},{"./ExecutionEnvironment":22,"./getNodeForCharacterOffset":117,"./getTextContentAccessor":119}],47:[function(e,t){"use strict";function n(){this.isMounted()&&this.forceUpdate()}var r=e("./AutoFocusMixin"),o=e("./DOMPropertyOperations"),a=e("./LinkedValueUtils"),i=e("./ReactBrowserComponentMixin"),s=e("./ReactCompositeComponent"),u=e("./ReactElement"),c=e("./ReactDOM"),l=e("./ReactUpdates"),p=e("./Object.assign"),d=e("./invariant"),f=(e("./warning"),u.createFactory(c.textarea.type)),h=s.createClass({displayName:"ReactDOMTextarea",mixins:[r,a.Mixin,i],getInitialState:function(){var e=this.props.defaultValue,t=this.props.children;null!=t&&(d(null==e),Array.isArray(t)&&(d(t.length<=1),t=t[0]),e=""+t),null==e&&(e="");var n=a.getValue(this);return{initialValue:""+(null!=n?n:e)}},render:function(){var e=p({},this.props);return d(null==e.dangerouslySetInnerHTML),e.defaultValue=null,e.value=null,e.onChange=this._handleChange,f(e,this.state.initialValue)},componentDidUpdate:function(){var e=a.getValue(this);if(null!=e){var t=this.getDOMNode();o.setValueForProperty(t,"value",""+e)}},_handleChange:function(e){var t,r=a.getOnChange(this);return r&&(t=r.call(this,e)),l.asap(n,this),t}});t.exports=h},{"./AutoFocusMixin":2,"./DOMPropertyOperations":12,"./LinkedValueUtils":24,"./Object.assign":27,"./ReactBrowserComponentMixin":29,"./ReactCompositeComponent":34,"./ReactDOM":37,"./ReactElement":50,"./ReactUpdates":77,"./invariant":124,"./warning":141}],48:[function(e,t){"use strict";function n(){this.reinitializeTransaction()}var r=e("./ReactUpdates"),o=e("./Transaction"),a=e("./Object.assign"),i=e("./emptyFunction"),s={initialize:i,close:function(){p.isBatchingUpdates=!1}},u={initialize:i,close:r.flushBatchedUpdates.bind(r)},c=[u,s];a(n.prototype,o.Mixin,{getTransactionWrappers:function(){return c}});var l=new n,p={isBatchingUpdates:!1,batchedUpdates:function(e,t,n){var r=p.isBatchingUpdates;p.isBatchingUpdates=!0,r?e(t,n):l.perform(e,null,t,n)}};t.exports=p},{"./Object.assign":27,"./ReactUpdates":77,"./Transaction":93,"./emptyFunction":105}],49:[function(e,t){"use strict";function n(){O.EventEmitter.injectReactEventListener(b),O.EventPluginHub.injectEventPluginOrder(s),O.EventPluginHub.injectInstanceHandle(D),O.EventPluginHub.injectMount(x),O.EventPluginHub.injectEventPluginsByName({SimpleEventPlugin:w,EnterLeaveEventPlugin:u,ChangeEventPlugin:o,CompositionEventPlugin:i,MobileSafariClickEventPlugin:p,SelectEventPlugin:P,BeforeInputEventPlugin:r}),O.NativeComponent.injectGenericComponentClass(m),O.NativeComponent.injectComponentClasses({button:v,form:g,img:y,input:E,option:C,select:R,textarea:M,html:N("html"),head:N("head"),body:N("body")}),O.CompositeComponent.injectMixin(d),O.DOMProperty.injectDOMPropertyConfig(l),O.DOMProperty.injectDOMPropertyConfig(T),O.EmptyComponent.injectEmptyComponent("noscript"),O.Updates.injectReconcileTransaction(f.ReactReconcileTransaction),O.Updates.injectBatchingStrategy(h),O.RootIndex.injectCreateReactRootIndex(c.canUseDOM?a.createReactRootIndex:_.createReactRootIndex),O.Component.injectEnvironment(f)}var r=e("./BeforeInputEventPlugin"),o=e("./ChangeEventPlugin"),a=e("./ClientReactRootIndex"),i=e("./CompositionEventPlugin"),s=e("./DefaultEventPluginOrder"),u=e("./EnterLeaveEventPlugin"),c=e("./ExecutionEnvironment"),l=e("./HTMLDOMPropertyConfig"),p=e("./MobileSafariClickEventPlugin"),d=e("./ReactBrowserComponentMixin"),f=e("./ReactComponentBrowserEnvironment"),h=e("./ReactDefaultBatchingStrategy"),m=e("./ReactDOMComponent"),v=e("./ReactDOMButton"),g=e("./ReactDOMForm"),y=e("./ReactDOMImg"),E=e("./ReactDOMInput"),C=e("./ReactDOMOption"),R=e("./ReactDOMSelect"),M=e("./ReactDOMTextarea"),b=e("./ReactEventListener"),O=e("./ReactInjection"),D=e("./ReactInstanceHandles"),x=e("./ReactMount"),P=e("./SelectEventPlugin"),_=e("./ServerReactRootIndex"),w=e("./SimpleEventPlugin"),T=e("./SVGDOMPropertyConfig"),N=e("./createFullPageComponent");t.exports={inject:n}},{"./BeforeInputEventPlugin":3,"./ChangeEventPlugin":7,"./ClientReactRootIndex":8,"./CompositionEventPlugin":9,"./DefaultEventPluginOrder":14,"./EnterLeaveEventPlugin":15,"./ExecutionEnvironment":22,"./HTMLDOMPropertyConfig":23,"./MobileSafariClickEventPlugin":26,"./ReactBrowserComponentMixin":29,"./ReactComponentBrowserEnvironment":33,"./ReactDOMButton":38,"./ReactDOMComponent":39,"./ReactDOMForm":40,"./ReactDOMImg":42,"./ReactDOMInput":43,"./ReactDOMOption":44,"./ReactDOMSelect":45,"./ReactDOMTextarea":47,"./ReactDefaultBatchingStrategy":48,"./ReactEventListener":55,"./ReactInjection":56,"./ReactInstanceHandles":58,"./ReactMount":61,"./SVGDOMPropertyConfig":78,"./SelectEventPlugin":79,"./ServerReactRootIndex":80,"./SimpleEventPlugin":81,"./createFullPageComponent":101}],50:[function(e,t){"use strict";var n=e("./ReactContext"),r=e("./ReactCurrentOwner"),o=(e("./warning"),{key:!0,ref:!0}),a=function(e,t,n,r,o,a){this.type=e,this.key=t,this.ref=n,this._owner=r,this._context=o,this.props=a};a.prototype={_isReactElement:!0},a.createElement=function(e,t,i){var s,u={},c=null,l=null;if(null!=t){l=void 0===t.ref?null:t.ref,c=null==t.key?null:""+t.key;for(s in t)t.hasOwnProperty(s)&&!o.hasOwnProperty(s)&&(u[s]=t[s])}var p=arguments.length-2;if(1===p)u.children=i;else if(p>1){for(var d=Array(p),f=0;p>f;f++)d[f]=arguments[f+2];u.children=d}if(e&&e.defaultProps){var h=e.defaultProps;for(s in h)"undefined"==typeof u[s]&&(u[s]=h[s])}return new a(e,c,l,r.current,n.current,u)},a.createFactory=function(e){var t=a.createElement.bind(null,e);return t.type=e,t},a.cloneAndReplaceProps=function(e,t){var n=new a(e.type,e.key,e.ref,e._owner,e._context,t);return n},a.isValidElement=function(e){var t=!(!e||!e._isReactElement);return t},t.exports=a},{"./ReactContext":35,"./ReactCurrentOwner":36,"./warning":141}],51:[function(e,t){"use strict";function n(){var e=p.current;return e&&e.constructor.displayName||void 0}function r(e,t){e._store.validated||null!=e.key||(e._store.validated=!0,a("react_key_warning",'Each child in an array should have a unique "key" prop.',e,t))}function o(e,t,n){v.test(e)&&a("react_numeric_key_warning","Child objects should have non-numeric keys so ordering is preserved.",t,n)}function a(e,t,r,o){var a=n(),i=o.displayName,s=a||i,u=f[e];if(!u.hasOwnProperty(s)){u[s]=!0,t+=a?" Check the render method of "+a+".":" Check the renderComponent call using <"+i+">.";var c=null;r._owner&&r._owner!==p.current&&(c=r._owner.constructor.displayName,t+=" It was passed a child from "+c+"."),t+=" See http://fb.me/react-warning-keys for more information.",d(e,{component:s,componentOwner:c}),console.warn(t)}}function i(){var e=n()||"";h.hasOwnProperty(e)||(h[e]=!0,d("react_object_map_children"))}function s(e,t){if(Array.isArray(e))for(var n=0;n<e.length;n++){var a=e[n];c.isValidElement(a)&&r(a,t)}else if(c.isValidElement(e))e._store.validated=!0;else if(e&&"object"==typeof e){i();for(var s in e)o(s,e[s],t)}}function u(e,t,n,r){for(var o in t)if(t.hasOwnProperty(o)){var a;try{a=t[o](n,o,e,r)}catch(i){a=i}a instanceof Error&&!(a.message in m)&&(m[a.message]=!0,d("react_failed_descriptor_type_check",{message:a.message}))}}var c=e("./ReactElement"),l=e("./ReactPropTypeLocations"),p=e("./ReactCurrentOwner"),d=e("./monitorCodeUse"),f=(e("./warning"),{react_key_warning:{},react_numeric_key_warning:{}}),h={},m={},v=/^\d+$/,g={createElement:function(e){var t=c.createElement.apply(this,arguments);if(null==t)return t;for(var n=2;n<arguments.length;n++)s(arguments[n],e);if(e){var r=e.displayName;e.propTypes&&u(r,e.propTypes,t.props,l.prop),e.contextTypes&&u(r,e.contextTypes,t._context,l.context)}return t},createFactory:function(e){var t=g.createElement.bind(null,e);return t.type=e,t}};t.exports=g},{"./ReactCurrentOwner":36,"./ReactElement":50,"./ReactPropTypeLocations":69,"./monitorCodeUse":134,"./warning":141}],52:[function(e,t){"use strict";function n(){return u(i),i()}function r(e){c[e]=!0}function o(e){delete c[e]}function a(e){return c[e]}var i,s=e("./ReactElement"),u=e("./invariant"),c={},l={injectEmptyComponent:function(e){i=s.createFactory(e)}},p={deregisterNullComponentID:o,getEmptyComponent:n,injection:l,isNullComponentID:a,registerNullComponentID:r};t.exports=p},{"./ReactElement":50,"./invariant":124}],53:[function(e,t){"use strict";var n={guard:function(e){return e}};t.exports=n},{}],54:[function(e,t){"use strict";function n(e){r.enqueueEvents(e),r.processEventQueue()}var r=e("./EventPluginHub"),o={handleTopLevel:function(e,t,o,a){var i=r.extractEvents(e,t,o,a);n(i)}};t.exports=o},{"./EventPluginHub":18}],55:[function(e,t){"use strict";function n(e){var t=l.getID(e),n=c.getReactRootIDFromNodeID(t),r=l.findReactContainerForID(n),o=l.getFirstReactDOM(r);return o}function r(e,t){this.topLevelType=e,this.nativeEvent=t,this.ancestors=[]}function o(e){for(var t=l.getFirstReactDOM(f(e.nativeEvent))||window,r=t;r;)e.ancestors.push(r),r=n(r);for(var o=0,a=e.ancestors.length;a>o;o++){t=e.ancestors[o];var i=l.getID(t)||"";m._handleTopLevel(e.topLevelType,t,i,e.nativeEvent)}}function a(e){var t=h(window);e(t)}var i=e("./EventListener"),s=e("./ExecutionEnvironment"),u=e("./PooledClass"),c=e("./ReactInstanceHandles"),l=e("./ReactMount"),p=e("./ReactUpdates"),d=e("./Object.assign"),f=e("./getEventTarget"),h=e("./getUnboundedScrollPosition");d(r.prototype,{destructor:function(){this.topLevelType=null,this.nativeEvent=null,this.ancestors.length=0}}),u.addPoolingTo(r,u.twoArgumentPooler);var m={_enabled:!0,_handleTopLevel:null,WINDOW_HANDLE:s.canUseDOM?window:null,setHandleTopLevel:function(e){m._handleTopLevel=e},setEnabled:function(e){m._enabled=!!e},isEnabled:function(){return m._enabled},trapBubbledEvent:function(e,t,n){var r=n;return r?i.listen(r,t,m.dispatchEvent.bind(null,e)):void 0},trapCapturedEvent:function(e,t,n){var r=n;return r?i.capture(r,t,m.dispatchEvent.bind(null,e)):void 0},monitorScrollValue:function(e){var t=a.bind(null,e);i.listen(window,"scroll",t),i.listen(window,"resize",t)},dispatchEvent:function(e,t){if(m._enabled){var n=r.getPooled(e,t);try{p.batchedUpdates(o,n)}finally{r.release(n)}}}};t.exports=m},{"./EventListener":17,"./ExecutionEnvironment":22,"./Object.assign":27,"./PooledClass":28,"./ReactInstanceHandles":58,"./ReactMount":61,"./ReactUpdates":77,"./getEventTarget":115,"./getUnboundedScrollPosition":120}],56:[function(e,t){"use strict";var n=e("./DOMProperty"),r=e("./EventPluginHub"),o=e("./ReactComponent"),a=e("./ReactCompositeComponent"),i=e("./ReactEmptyComponent"),s=e("./ReactBrowserEventEmitter"),u=e("./ReactNativeComponent"),c=e("./ReactPerf"),l=e("./ReactRootIndex"),p=e("./ReactUpdates"),d={Component:o.injection,CompositeComponent:a.injection,DOMProperty:n.injection,EmptyComponent:i.injection,EventPluginHub:r.injection,EventEmitter:s.injection,NativeComponent:u.injection,Perf:c.injection,RootIndex:l.injection,Updates:p.injection};t.exports=d},{"./DOMProperty":11,"./EventPluginHub":18,"./ReactBrowserEventEmitter":30,"./ReactComponent":32,"./ReactCompositeComponent":34,"./ReactEmptyComponent":52,"./ReactNativeComponent":64,"./ReactPerf":66,"./ReactRootIndex":73,"./ReactUpdates":77}],57:[function(e,t){"use strict";function n(e){return o(document.documentElement,e)}var r=e("./ReactDOMSelection"),o=e("./containsNode"),a=e("./focusNode"),i=e("./getActiveElement"),s={hasSelectionCapabilities:function(e){return e&&("INPUT"===e.nodeName&&"text"===e.type||"TEXTAREA"===e.nodeName||"true"===e.contentEditable)},getSelectionInformation:function(){var e=i();return{focusedElem:e,selectionRange:s.hasSelectionCapabilities(e)?s.getSelection(e):null}},restoreSelection:function(e){var t=i(),r=e.focusedElem,o=e.selectionRange;t!==r&&n(r)&&(s.hasSelectionCapabilities(r)&&s.setSelection(r,o),a(r))},getSelection:function(e){var t;if("selectionStart"in e)t={start:e.selectionStart,end:e.selectionEnd};else if(document.selection&&"INPUT"===e.nodeName){var n=document.selection.createRange();n.parentElement()===e&&(t={start:-n.moveStart("character",-e.value.length),end:-n.moveEnd("character",-e.value.length)})}else t=r.getOffsets(e);return t||{start:0,end:0}},setSelection:function(e,t){var n=t.start,o=t.end;if("undefined"==typeof o&&(o=n),"selectionStart"in e)e.selectionStart=n,e.selectionEnd=Math.min(o,e.value.length);else if(document.selection&&"INPUT"===e.nodeName){var a=e.createTextRange();a.collapse(!0),a.moveStart("character",n),a.moveEnd("character",o-n),a.select()}else r.setOffsets(e,t)}};t.exports=s},{"./ReactDOMSelection":46,"./containsNode":99,"./focusNode":109,"./getActiveElement":111}],58:[function(e,t){"use strict";function n(e){return d+e.toString(36)}function r(e,t){return e.charAt(t)===d||t===e.length}function o(e){return""===e||e.charAt(0)===d&&e.charAt(e.length-1)!==d}function a(e,t){return 0===t.indexOf(e)&&r(t,e.length)}function i(e){return e?e.substr(0,e.lastIndexOf(d)):""}function s(e,t){if(p(o(e)&&o(t)),p(a(e,t)),e===t)return e;for(var n=e.length+f,i=n;i<t.length&&!r(t,i);i++);return t.substr(0,i)}function u(e,t){var n=Math.min(e.length,t.length);if(0===n)return"";for(var a=0,i=0;n>=i;i++)if(r(e,i)&&r(t,i))a=i;else if(e.charAt(i)!==t.charAt(i))break;var s=e.substr(0,a);return p(o(s)),s}function c(e,t,n,r,o,u){e=e||"",t=t||"",p(e!==t);var c=a(t,e);p(c||a(e,t));for(var l=0,d=c?i:s,f=e;;f=d(f,t)){var m;if(o&&f===e||u&&f===t||(m=n(f,c,r)),m===!1||f===t)break;p(l++<h)}}var l=e("./ReactRootIndex"),p=e("./invariant"),d=".",f=d.length,h=100,m={createReactRootID:function(){return n(l.createReactRootIndex())},createReactID:function(e,t){return e+t},getReactRootIDFromNodeID:function(e){if(e&&e.charAt(0)===d&&e.length>1){var t=e.indexOf(d,1);return t>-1?e.substr(0,t):e}return null},traverseEnterLeave:function(e,t,n,r,o){var a=u(e,t);a!==e&&c(e,a,n,r,!1,!0),a!==t&&c(a,t,n,o,!0,!1)},traverseTwoPhase:function(e,t,n){e&&(c("",e,t,n,!0,!1),c(e,"",t,n,!1,!0))},traverseAncestors:function(e,t,n){c("",e,t,n,!0,!1)},_getFirstCommonAncestorID:u,_getNextDescendantID:s,isAncestorIDOf:a,SEPARATOR:d};t.exports=m},{"./ReactRootIndex":73,"./invariant":124}],59:[function(e,t){"use strict";function n(e,t){if("function"==typeof t)for(var n in t)if(t.hasOwnProperty(n)){var r=t[n];if("function"==typeof r){var o=r.bind(t);for(var a in r)r.hasOwnProperty(a)&&(o[a]=r[a]);e[n]=o}else e[n]=r}}var r=(e("./ReactCurrentOwner"),e("./invariant")),o=(e("./monitorCodeUse"),e("./warning"),{}),a={},i={};i.wrapCreateFactory=function(e){var t=function(t){return"function"!=typeof t?e(t):t.isReactNonLegacyFactory?e(t.type):t.isReactLegacyFactory?e(t.type):t};return t},i.wrapCreateElement=function(e){var t=function(t){if("function"!=typeof t)return e.apply(this,arguments);var n;return t.isReactNonLegacyFactory?(n=Array.prototype.slice.call(arguments,0),n[0]=t.type,e.apply(this,n)):t.isReactLegacyFactory?(t._isMockFunction&&(t.type._mockedReactClassConstructor=t),n=Array.prototype.slice.call(arguments,0),n[0]=t.type,e.apply(this,n)):t.apply(null,Array.prototype.slice.call(arguments,1))};return t},i.wrapFactory=function(e){r("function"==typeof e);var t=function(){return e.apply(this,arguments)};return n(t,e.type),t.isReactLegacyFactory=o,t.type=e.type,t},i.markNonLegacyFactory=function(e){return e.isReactNonLegacyFactory=a,e},i.isValidFactory=function(e){return"function"==typeof e&&e.isReactLegacyFactory===o},i.isValidClass=function(e){return i.isValidFactory(e)},i._isLegacyCallWarningEnabled=!0,t.exports=i},{"./ReactCurrentOwner":36,"./invariant":124,"./monitorCodeUse":134,"./warning":141}],60:[function(e,t){"use strict";var n=e("./adler32"),r={CHECKSUM_ATTR_NAME:"data-react-checksum",addChecksumToMarkup:function(e){var t=n(e);return e.replace(">"," "+r.CHECKSUM_ATTR_NAME+'="'+t+'">')},canReuseMarkup:function(e,t){var o=t.getAttribute(r.CHECKSUM_ATTR_NAME);o=o&&parseInt(o,10);var a=n(e);return a===o}};t.exports=r},{"./adler32":96}],61:[function(e,t){"use strict";function n(e){var t=E(e);return t&&S.getID(t)}function r(e){var t=o(e);if(t)if(x.hasOwnProperty(t)){var n=x[t];n!==e&&(R(!s(n,t)),x[t]=e)}else x[t]=e;return t}function o(e){return e&&e.getAttribute&&e.getAttribute(D)||""}function a(e,t){var n=o(e);n!==t&&delete x[n],e.setAttribute(D,t),x[t]=e}function i(e){return x.hasOwnProperty(e)&&s(x[e],e)||(x[e]=S.findReactNodeByID(e)),x[e]}function s(e,t){if(e){R(o(e)===t);var n=S.findReactContainerForID(t);if(n&&g(n,e))return!0}return!1}function u(e){delete x[e]}function c(e){var t=x[e];return t&&s(t,e)?void(I=t):!1}function l(e){I=null,m.traverseAncestors(e,c);var t=I;return I=null,t}var p=e("./DOMProperty"),d=e("./ReactBrowserEventEmitter"),f=(e("./ReactCurrentOwner"),e("./ReactElement")),h=e("./ReactLegacyElement"),m=e("./ReactInstanceHandles"),v=e("./ReactPerf"),g=e("./containsNode"),y=e("./deprecated"),E=e("./getReactRootElementInContainer"),C=e("./instantiateReactComponent"),R=e("./invariant"),M=e("./shouldUpdateReactComponent"),b=(e("./warning"),h.wrapCreateElement(f.createElement)),O=m.SEPARATOR,D=p.ID_ATTRIBUTE_NAME,x={},P=1,_=9,w={},T={},N=[],I=null,S={_instancesByReactRootID:w,scrollMonitor:function(e,t){t()},_updateRootComponent:function(e,t,n,r){var o=t.props;return S.scrollMonitor(n,function(){e.replaceProps(o,r)}),e},_registerComponent:function(e,t){R(t&&(t.nodeType===P||t.nodeType===_)),d.ensureScrollValueMonitoring();var n=S.registerContainer(t);return w[n]=e,n},_renderNewRootComponent:v.measure("ReactMount","_renderNewRootComponent",function(e,t,n){var r=C(e,null),o=S._registerComponent(r,t);return r.mountComponentIntoNode(o,t,n),r}),render:function(e,t,r){R(f.isValidElement(e));var o=w[n(t)];if(o){var a=o._currentElement;if(M(a,e))return S._updateRootComponent(o,e,t,r);S.unmountComponentAtNode(t)}var i=E(t),s=i&&S.isRenderedByReact(i),u=s&&!o,c=S._renderNewRootComponent(e,t,u);return r&&r.call(c),c},constructAndRenderComponent:function(e,t,n){var r=b(e,t);return S.render(r,n)},constructAndRenderComponentByID:function(e,t,n){var r=document.getElementById(n);return R(r),S.constructAndRenderComponent(e,t,r)},registerContainer:function(e){var t=n(e);return t&&(t=m.getReactRootIDFromNodeID(t)),t||(t=m.createReactRootID()),T[t]=e,t},unmountComponentAtNode:function(e){var t=n(e),r=w[t];return r?(S.unmountComponentFromNode(r,e),delete w[t],delete T[t],!0):!1},unmountComponentFromNode:function(e,t){for(e.unmountComponent(),t.nodeType===_&&(t=t.documentElement);t.lastChild;)t.removeChild(t.lastChild)},findReactContainerForID:function(e){var t=m.getReactRootIDFromNodeID(e),n=T[t];return n},findReactNodeByID:function(e){var t=S.findReactContainerForID(e);return S.findComponentRoot(t,e)},isRenderedByReact:function(e){if(1!==e.nodeType)return!1;var t=S.getID(e);return t?t.charAt(0)===O:!1},getFirstReactDOM:function(e){for(var t=e;t&&t.parentNode!==t;){if(S.isRenderedByReact(t))return t;t=t.parentNode}return null},findComponentRoot:function(e,t){var n=N,r=0,o=l(t)||e;for(n[0]=o.firstChild,n.length=1;r<n.length;){for(var a,i=n[r++];i;){var s=S.getID(i);s?t===s?a=i:m.isAncestorIDOf(s,t)&&(n.length=r=0,n.push(i.firstChild)):n.push(i.firstChild),i=i.nextSibling}if(a)return n.length=0,a}n.length=0,R(!1)},getReactRootID:n,getID:r,setID:a,getNode:i,purgeID:u};S.renderComponent=y("ReactMount","renderComponent","render",this,S.render),t.exports=S},{"./DOMProperty":11,"./ReactBrowserEventEmitter":30,"./ReactCurrentOwner":36,"./ReactElement":50,"./ReactInstanceHandles":58,"./ReactLegacyElement":59,"./ReactPerf":66,"./containsNode":99,"./deprecated":104,"./getReactRootElementInContainer":118,"./instantiateReactComponent":123,"./invariant":124,"./shouldUpdateReactComponent":138,"./warning":141}],62:[function(e,t){"use strict";function n(e,t,n){h.push({parentID:e,parentNode:null,type:c.INSERT_MARKUP,markupIndex:m.push(t)-1,textContent:null,fromIndex:null,toIndex:n})}function r(e,t,n){h.push({parentID:e,parentNode:null,type:c.MOVE_EXISTING,markupIndex:null,textContent:null,fromIndex:t,toIndex:n})}function o(e,t){h.push({parentID:e,parentNode:null,type:c.REMOVE_NODE,markupIndex:null,textContent:null,fromIndex:t,toIndex:null})}function a(e,t){h.push({parentID:e,parentNode:null,type:c.TEXT_CONTENT,markupIndex:null,textContent:t,fromIndex:null,toIndex:null})}function i(){h.length&&(u.BackendIDOperations.dangerouslyProcessChildrenUpdates(h,m),s())}function s(){h.length=0,m.length=0}var u=e("./ReactComponent"),c=e("./ReactMultiChildUpdateTypes"),l=e("./flattenChildren"),p=e("./instantiateReactComponent"),d=e("./shouldUpdateReactComponent"),f=0,h=[],m=[],v={Mixin:{mountChildren:function(e,t){var n=l(e),r=[],o=0;this._renderedChildren=n;for(var a in n){var i=n[a];if(n.hasOwnProperty(a)){var s=p(i,null);n[a]=s;var u=this._rootNodeID+a,c=s.mountComponent(u,t,this._mountDepth+1);s._mountIndex=o,r.push(c),o++}}return r},updateTextContent:function(e){f++;var t=!0;try{var n=this._renderedChildren;for(var r in n)n.hasOwnProperty(r)&&this._unmountChildByName(n[r],r);this.setTextContent(e),t=!1}finally{f--,f||(t?s():i())}},updateChildren:function(e,t){f++;var n=!0;try{this._updateChildren(e,t),n=!1}finally{f--,f||(n?s():i())}},_updateChildren:function(e,t){var n=l(e),r=this._renderedChildren;if(n||r){var o,a=0,i=0;for(o in n)if(n.hasOwnProperty(o)){var s=r&&r[o],u=s&&s._currentElement,c=n[o];if(d(u,c))this.moveChild(s,i,a),a=Math.max(s._mountIndex,a),s.receiveComponent(c,t),s._mountIndex=i;else{s&&(a=Math.max(s._mountIndex,a),this._unmountChildByName(s,o));var f=p(c,null);this._mountChildByNameAtIndex(f,o,i,t)}i++}for(o in r)!r.hasOwnProperty(o)||n&&n[o]||this._unmountChildByName(r[o],o)}},unmountChildren:function(){var e=this._renderedChildren;for(var t in e){var n=e[t];n.unmountComponent&&n.unmountComponent()}this._renderedChildren=null},moveChild:function(e,t,n){e._mountIndex<n&&r(this._rootNodeID,e._mountIndex,t)},createChild:function(e,t){n(this._rootNodeID,t,e._mountIndex)},removeChild:function(e){o(this._rootNodeID,e._mountIndex)},setTextContent:function(e){a(this._rootNodeID,e)},_mountChildByNameAtIndex:function(e,t,n,r){var o=this._rootNodeID+t,a=e.mountComponent(o,r,this._mountDepth+1);e._mountIndex=n,this.createChild(e,a),this._renderedChildren=this._renderedChildren||{},this._renderedChildren[t]=e},_unmountChildByName:function(e,t){this.removeChild(e),e._mountIndex=null,e.unmountComponent(),delete this._renderedChildren[t]}}};t.exports=v},{"./ReactComponent":32,"./ReactMultiChildUpdateTypes":63,"./flattenChildren":108,"./instantiateReactComponent":123,"./shouldUpdateReactComponent":138}],63:[function(e,t){"use strict";var n=e("./keyMirror"),r=n({INSERT_MARKUP:null,MOVE_EXISTING:null,REMOVE_NODE:null,TEXT_CONTENT:null});t.exports=r},{"./keyMirror":130}],64:[function(e,t){"use strict";function n(e,t,n){var r=i[e];return null==r?(o(a),new a(e,t)):n===e?(o(a),new a(e,t)):new r.type(t)}var r=e("./Object.assign"),o=e("./invariant"),a=null,i={},s={injectGenericComponentClass:function(e){a=e},injectComponentClasses:function(e){r(i,e)}},u={createInstanceForTag:n,injection:s};t.exports=u},{"./Object.assign":27,"./invariant":124}],65:[function(e,t){"use strict";var n=e("./emptyObject"),r=e("./invariant"),o={isValidOwner:function(e){return!(!e||"function"!=typeof e.attachRef||"function"!=typeof e.detachRef)},addComponentAsRefTo:function(e,t,n){r(o.isValidOwner(n)),n.attachRef(t,e)},removeComponentAsRefFrom:function(e,t,n){r(o.isValidOwner(n)),n.refs[t]===e&&n.detachRef(t)},Mixin:{construct:function(){this.refs=n},attachRef:function(e,t){r(t.isOwnedBy(this));var o=this.refs===n?this.refs={}:this.refs;o[e]=t},detachRef:function(e){delete this.refs[e]}}};t.exports=o},{"./emptyObject":106,"./invariant":124}],66:[function(e,t){"use strict";function n(e,t,n){return n}var r={enableMeasure:!1,storedMeasure:n,measure:function(e,t,n){return n},injection:{injectMeasure:function(e){r.storedMeasure=e}}};t.exports=r},{}],67:[function(e,t){"use strict";function n(e){return function(t,n,r){t[n]=t.hasOwnProperty(n)?e(t[n],r):r}}function r(e,t){for(var n in t)if(t.hasOwnProperty(n)){var r=c[n];r&&c.hasOwnProperty(n)?r(e,n,t[n]):e.hasOwnProperty(n)||(e[n]=t[n])}return e}var o=e("./Object.assign"),a=e("./emptyFunction"),i=e("./invariant"),s=e("./joinClasses"),u=(e("./warning"),n(function(e,t){return o({},t,e)})),c={children:a,className:n(s),style:u},l={TransferStrategies:c,mergeProps:function(e,t){return r(o({},e),t)},Mixin:{transferPropsTo:function(e){return i(e._owner===this),r(e.props,this.props),e}}};t.exports=l},{"./Object.assign":27,"./emptyFunction":105,"./invariant":124,"./joinClasses":129,"./warning":141}],68:[function(e,t){"use strict";var n={};t.exports=n},{}],69:[function(e,t){"use strict";var n=e("./keyMirror"),r=n({prop:null,context:null,childContext:null});t.exports=r},{"./keyMirror":130}],70:[function(e,t){"use strict";function n(e){function t(t,n,r,o,a){if(o=o||C,null!=n[r])return e(n,r,o,a);var i=g[a];return t?new Error("Required "+i+" `"+r+"` was not specified in "+("`"+o+"`.")):void 0}var n=t.bind(null,!1);return n.isRequired=t.bind(null,!0),n}function r(e){function t(t,n,r,o){var a=t[n],i=h(a);if(i!==e){var s=g[o],u=m(a);return new Error("Invalid "+s+" `"+n+"` of type `"+u+"` "+("supplied to `"+r+"`, expected `"+e+"`."))}}return n(t)}function o(){return n(E.thatReturns())}function a(e){function t(t,n,r,o){var a=t[n];if(!Array.isArray(a)){var i=g[o],s=h(a);return new Error("Invalid "+i+" `"+n+"` of type "+("`"+s+"` supplied to `"+r+"`, expected an array."))}for(var u=0;u<a.length;u++){var c=e(a,u,r,o);if(c instanceof Error)return c}}return n(t)}function i(){function e(e,t,n,r){if(!v.isValidElement(e[t])){var o=g[r];return new Error("Invalid "+o+" `"+t+"` supplied to "+("`"+n+"`, expected a ReactElement."))}}return n(e)}function s(e){function t(t,n,r,o){if(!(t[n]instanceof e)){var a=g[o],i=e.name||C;return new Error("Invalid "+a+" `"+n+"` supplied to "+("`"+r+"`, expected instance of `"+i+"`."))}}return n(t)}function u(e){function t(t,n,r,o){for(var a=t[n],i=0;i<e.length;i++)if(a===e[i])return;var s=g[o],u=JSON.stringify(e);return new Error("Invalid "+s+" `"+n+"` of value `"+a+"` "+("supplied to `"+r+"`, expected one of "+u+"."))}return n(t)}function c(e){function t(t,n,r,o){var a=t[n],i=h(a);if("object"!==i){var s=g[o];return new Error("Invalid "+s+" `"+n+"` of type "+("`"+i+"` supplied to `"+r+"`, expected an object."))}for(var u in a)if(a.hasOwnProperty(u)){var c=e(a,u,r,o);if(c instanceof Error)return c}}return n(t)}function l(e){function t(t,n,r,o){for(var a=0;a<e.length;a++){var i=e[a];if(null==i(t,n,r,o))return}var s=g[o];return new Error("Invalid "+s+" `"+n+"` supplied to "+("`"+r+"`."))}return n(t)}function p(){function e(e,t,n,r){if(!f(e[t])){var o=g[r];return new Error("Invalid "+o+" `"+t+"` supplied to "+("`"+n+"`, expected a ReactNode."))}}return n(e)}function d(e){function t(t,n,r,o){var a=t[n],i=h(a);if("object"!==i){var s=g[o];return new Error("Invalid "+s+" `"+n+"` of type `"+i+"` "+("supplied to `"+r+"`, expected `object`."))}for(var u in e){var c=e[u];if(c){var l=c(a,u,r,o);if(l)return l}}}return n(t,"expected `object`")}function f(e){switch(typeof e){case"number":case"string":return!0;case"boolean":return!e;case"object":if(Array.isArray(e))return e.every(f);if(v.isValidElement(e))return!0;for(var t in e)if(!f(e[t]))return!1;return!0;default:return!1}}function h(e){var t=typeof e;return Array.isArray(e)?"array":e instanceof RegExp?"object":t}function m(e){var t=h(e);if("object"===t){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return t}var v=e("./ReactElement"),g=e("./ReactPropTypeLocationNames"),y=e("./deprecated"),E=e("./emptyFunction"),C="<<anonymous>>",R=i(),M=p(),b={array:r("array"),bool:r("boolean"),func:r("function"),number:r("number"),object:r("object"),string:r("string"),any:o(),arrayOf:a,element:R,instanceOf:s,node:M,objectOf:c,oneOf:u,oneOfType:l,shape:d,component:y("React.PropTypes","component","element",this,R),renderable:y("React.PropTypes","renderable","node",this,M)};t.exports=b},{"./ReactElement":50,"./ReactPropTypeLocationNames":68,"./deprecated":104,"./emptyFunction":105}],71:[function(e,t){"use strict";function n(){this.listenersToPut=[]}var r=e("./PooledClass"),o=e("./ReactBrowserEventEmitter"),a=e("./Object.assign");a(n.prototype,{enqueuePutListener:function(e,t,n){this.listenersToPut.push({rootNodeID:e,propKey:t,propValue:n})},putListeners:function(){for(var e=0;e<this.listenersToPut.length;e++){var t=this.listenersToPut[e];o.putListener(t.rootNodeID,t.propKey,t.propValue)}},reset:function(){this.listenersToPut.length=0},destructor:function(){this.reset()}}),r.addPoolingTo(n),t.exports=n},{"./Object.assign":27,"./PooledClass":28,"./ReactBrowserEventEmitter":30}],72:[function(e,t){"use strict";function n(){this.reinitializeTransaction(),this.renderToStaticMarkup=!1,this.reactMountReady=r.getPooled(null),this.putListenerQueue=s.getPooled()}var r=e("./CallbackQueue"),o=e("./PooledClass"),a=e("./ReactBrowserEventEmitter"),i=e("./ReactInputSelection"),s=e("./ReactPutListenerQueue"),u=e("./Transaction"),c=e("./Object.assign"),l={initialize:i.getSelectionInformation,close:i.restoreSelection},p={initialize:function(){var e=a.isEnabled();return a.setEnabled(!1),e},close:function(e){a.setEnabled(e)}},d={initialize:function(){this.reactMountReady.reset()},close:function(){this.reactMountReady.notifyAll()}},f={initialize:function(){this.putListenerQueue.reset()},close:function(){this.putListenerQueue.putListeners()}},h=[f,l,p,d],m={getTransactionWrappers:function(){return h},getReactMountReady:function(){return this.reactMountReady},getPutListenerQueue:function(){return this.putListenerQueue},destructor:function(){r.release(this.reactMountReady),this.reactMountReady=null,s.release(this.putListenerQueue),this.putListenerQueue=null}};c(n.prototype,u.Mixin,m),o.addPoolingTo(n),t.exports=n
},{"./CallbackQueue":6,"./Object.assign":27,"./PooledClass":28,"./ReactBrowserEventEmitter":30,"./ReactInputSelection":57,"./ReactPutListenerQueue":71,"./Transaction":93}],73:[function(e,t){"use strict";var n={injectCreateReactRootIndex:function(e){r.createReactRootIndex=e}},r={createReactRootIndex:null,injection:n};t.exports=r},{}],74:[function(e,t){"use strict";function n(e){c(o.isValidElement(e));var t;try{var n=a.createReactRootID();return t=s.getPooled(!1),t.perform(function(){var r=u(e,null),o=r.mountComponent(n,t,0);return i.addChecksumToMarkup(o)},null)}finally{s.release(t)}}function r(e){c(o.isValidElement(e));var t;try{var n=a.createReactRootID();return t=s.getPooled(!0),t.perform(function(){var r=u(e,null);return r.mountComponent(n,t,0)},null)}finally{s.release(t)}}var o=e("./ReactElement"),a=e("./ReactInstanceHandles"),i=e("./ReactMarkupChecksum"),s=e("./ReactServerRenderingTransaction"),u=e("./instantiateReactComponent"),c=e("./invariant");t.exports={renderToString:n,renderToStaticMarkup:r}},{"./ReactElement":50,"./ReactInstanceHandles":58,"./ReactMarkupChecksum":60,"./ReactServerRenderingTransaction":75,"./instantiateReactComponent":123,"./invariant":124}],75:[function(e,t){"use strict";function n(e){this.reinitializeTransaction(),this.renderToStaticMarkup=e,this.reactMountReady=o.getPooled(null),this.putListenerQueue=a.getPooled()}var r=e("./PooledClass"),o=e("./CallbackQueue"),a=e("./ReactPutListenerQueue"),i=e("./Transaction"),s=e("./Object.assign"),u=e("./emptyFunction"),c={initialize:function(){this.reactMountReady.reset()},close:u},l={initialize:function(){this.putListenerQueue.reset()},close:u},p=[l,c],d={getTransactionWrappers:function(){return p},getReactMountReady:function(){return this.reactMountReady},getPutListenerQueue:function(){return this.putListenerQueue},destructor:function(){o.release(this.reactMountReady),this.reactMountReady=null,a.release(this.putListenerQueue),this.putListenerQueue=null}};s(n.prototype,i.Mixin,d),r.addPoolingTo(n),t.exports=n},{"./CallbackQueue":6,"./Object.assign":27,"./PooledClass":28,"./ReactPutListenerQueue":71,"./Transaction":93,"./emptyFunction":105}],76:[function(e,t){"use strict";var n=e("./DOMPropertyOperations"),r=e("./ReactComponent"),o=e("./ReactElement"),a=e("./Object.assign"),i=e("./escapeTextForBrowser"),s=function(){};a(s.prototype,r.Mixin,{mountComponent:function(e,t,o){r.Mixin.mountComponent.call(this,e,t,o);var a=i(this.props);return t.renderToStaticMarkup?a:"<span "+n.createMarkupForID(e)+">"+a+"</span>"},receiveComponent:function(e){var t=e.props;t!==this.props&&(this.props=t,r.BackendIDOperations.updateTextContentByID(this._rootNodeID,t))}});var u=function(e){return new o(s,null,null,null,null,e)};u.type=s,t.exports=u},{"./DOMPropertyOperations":12,"./Object.assign":27,"./ReactComponent":32,"./ReactElement":50,"./escapeTextForBrowser":107}],77:[function(e,t){"use strict";function n(){h(O.ReactReconcileTransaction&&y)}function r(){this.reinitializeTransaction(),this.dirtyComponentsLength=null,this.callbackQueue=c.getPooled(),this.reconcileTransaction=O.ReactReconcileTransaction.getPooled()}function o(e,t,r){n(),y.batchedUpdates(e,t,r)}function a(e,t){return e._mountDepth-t._mountDepth}function i(e){var t=e.dirtyComponentsLength;h(t===m.length),m.sort(a);for(var n=0;t>n;n++){var r=m[n];if(r.isMounted()){var o=r._pendingCallbacks;if(r._pendingCallbacks=null,r.performUpdateIfNecessary(e.reconcileTransaction),o)for(var i=0;i<o.length;i++)e.callbackQueue.enqueue(o[i],r)}}}function s(e,t){return h(!t||"function"==typeof t),n(),y.isBatchingUpdates?(m.push(e),void(t&&(e._pendingCallbacks?e._pendingCallbacks.push(t):e._pendingCallbacks=[t]))):void y.batchedUpdates(s,e,t)}function u(e,t){h(y.isBatchingUpdates),v.enqueue(e,t),g=!0}var c=e("./CallbackQueue"),l=e("./PooledClass"),p=(e("./ReactCurrentOwner"),e("./ReactPerf")),d=e("./Transaction"),f=e("./Object.assign"),h=e("./invariant"),m=(e("./warning"),[]),v=c.getPooled(),g=!1,y=null,E={initialize:function(){this.dirtyComponentsLength=m.length},close:function(){this.dirtyComponentsLength!==m.length?(m.splice(0,this.dirtyComponentsLength),M()):m.length=0}},C={initialize:function(){this.callbackQueue.reset()},close:function(){this.callbackQueue.notifyAll()}},R=[E,C];f(r.prototype,d.Mixin,{getTransactionWrappers:function(){return R},destructor:function(){this.dirtyComponentsLength=null,c.release(this.callbackQueue),this.callbackQueue=null,O.ReactReconcileTransaction.release(this.reconcileTransaction),this.reconcileTransaction=null},perform:function(e,t,n){return d.Mixin.perform.call(this,this.reconcileTransaction.perform,this.reconcileTransaction,e,t,n)}}),l.addPoolingTo(r);var M=p.measure("ReactUpdates","flushBatchedUpdates",function(){for(;m.length||g;){if(m.length){var e=r.getPooled();e.perform(i,null,e),r.release(e)}if(g){g=!1;var t=v;v=c.getPooled(),t.notifyAll(),c.release(t)}}}),b={injectReconcileTransaction:function(e){h(e),O.ReactReconcileTransaction=e},injectBatchingStrategy:function(e){h(e),h("function"==typeof e.batchedUpdates),h("boolean"==typeof e.isBatchingUpdates),y=e}},O={ReactReconcileTransaction:null,batchedUpdates:o,enqueueUpdate:s,flushBatchedUpdates:M,injection:b,asap:u};t.exports=O},{"./CallbackQueue":6,"./Object.assign":27,"./PooledClass":28,"./ReactCurrentOwner":36,"./ReactPerf":66,"./Transaction":93,"./invariant":124,"./warning":141}],78:[function(e,t){"use strict";var n=e("./DOMProperty"),r=n.injection.MUST_USE_ATTRIBUTE,o={Properties:{cx:r,cy:r,d:r,dx:r,dy:r,fill:r,fillOpacity:r,fontFamily:r,fontSize:r,fx:r,fy:r,gradientTransform:r,gradientUnits:r,markerEnd:r,markerMid:r,markerStart:r,offset:r,opacity:r,patternContentUnits:r,patternUnits:r,points:r,preserveAspectRatio:r,r:r,rx:r,ry:r,spreadMethod:r,stopColor:r,stopOpacity:r,stroke:r,strokeDasharray:r,strokeLinecap:r,strokeOpacity:r,strokeWidth:r,textAnchor:r,transform:r,version:r,viewBox:r,x1:r,x2:r,x:r,y1:r,y2:r,y:r},DOMAttributeNames:{fillOpacity:"fill-opacity",fontFamily:"font-family",fontSize:"font-size",gradientTransform:"gradientTransform",gradientUnits:"gradientUnits",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",patternContentUnits:"patternContentUnits",patternUnits:"patternUnits",preserveAspectRatio:"preserveAspectRatio",spreadMethod:"spreadMethod",stopColor:"stop-color",stopOpacity:"stop-opacity",strokeDasharray:"stroke-dasharray",strokeLinecap:"stroke-linecap",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",textAnchor:"text-anchor",viewBox:"viewBox"}};t.exports=o},{"./DOMProperty":11}],79:[function(e,t){"use strict";function n(e){if("selectionStart"in e&&i.hasSelectionCapabilities(e))return{start:e.selectionStart,end:e.selectionEnd};if(window.getSelection){var t=window.getSelection();return{anchorNode:t.anchorNode,anchorOffset:t.anchorOffset,focusNode:t.focusNode,focusOffset:t.focusOffset}}if(document.selection){var n=document.selection.createRange();return{parentElement:n.parentElement(),text:n.text,top:n.boundingTop,left:n.boundingLeft}}}function r(e){if(!g&&null!=h&&h==u()){var t=n(h);if(!v||!p(v,t)){v=t;var r=s.getPooled(f.select,m,e);return r.type="select",r.target=h,a.accumulateTwoPhaseDispatches(r),r}}}var o=e("./EventConstants"),a=e("./EventPropagators"),i=e("./ReactInputSelection"),s=e("./SyntheticEvent"),u=e("./getActiveElement"),c=e("./isTextInputElement"),l=e("./keyOf"),p=e("./shallowEqual"),d=o.topLevelTypes,f={select:{phasedRegistrationNames:{bubbled:l({onSelect:null}),captured:l({onSelectCapture:null})},dependencies:[d.topBlur,d.topContextMenu,d.topFocus,d.topKeyDown,d.topMouseDown,d.topMouseUp,d.topSelectionChange]}},h=null,m=null,v=null,g=!1,y={eventTypes:f,extractEvents:function(e,t,n,o){switch(e){case d.topFocus:(c(t)||"true"===t.contentEditable)&&(h=t,m=n,v=null);break;case d.topBlur:h=null,m=null,v=null;break;case d.topMouseDown:g=!0;break;case d.topContextMenu:case d.topMouseUp:return g=!1,r(o);case d.topSelectionChange:case d.topKeyDown:case d.topKeyUp:return r(o)}}};t.exports=y},{"./EventConstants":16,"./EventPropagators":21,"./ReactInputSelection":57,"./SyntheticEvent":85,"./getActiveElement":111,"./isTextInputElement":127,"./keyOf":131,"./shallowEqual":137}],80:[function(e,t){"use strict";var n=Math.pow(2,53),r={createReactRootIndex:function(){return Math.ceil(Math.random()*n)}};t.exports=r},{}],81:[function(e,t){"use strict";var n=e("./EventConstants"),r=e("./EventPluginUtils"),o=e("./EventPropagators"),a=e("./SyntheticClipboardEvent"),i=e("./SyntheticEvent"),s=e("./SyntheticFocusEvent"),u=e("./SyntheticKeyboardEvent"),c=e("./SyntheticMouseEvent"),l=e("./SyntheticDragEvent"),p=e("./SyntheticTouchEvent"),d=e("./SyntheticUIEvent"),f=e("./SyntheticWheelEvent"),h=e("./getEventCharCode"),m=e("./invariant"),v=e("./keyOf"),g=(e("./warning"),n.topLevelTypes),y={blur:{phasedRegistrationNames:{bubbled:v({onBlur:!0}),captured:v({onBlurCapture:!0})}},click:{phasedRegistrationNames:{bubbled:v({onClick:!0}),captured:v({onClickCapture:!0})}},contextMenu:{phasedRegistrationNames:{bubbled:v({onContextMenu:!0}),captured:v({onContextMenuCapture:!0})}},copy:{phasedRegistrationNames:{bubbled:v({onCopy:!0}),captured:v({onCopyCapture:!0})}},cut:{phasedRegistrationNames:{bubbled:v({onCut:!0}),captured:v({onCutCapture:!0})}},doubleClick:{phasedRegistrationNames:{bubbled:v({onDoubleClick:!0}),captured:v({onDoubleClickCapture:!0})}},drag:{phasedRegistrationNames:{bubbled:v({onDrag:!0}),captured:v({onDragCapture:!0})}},dragEnd:{phasedRegistrationNames:{bubbled:v({onDragEnd:!0}),captured:v({onDragEndCapture:!0})}},dragEnter:{phasedRegistrationNames:{bubbled:v({onDragEnter:!0}),captured:v({onDragEnterCapture:!0})}},dragExit:{phasedRegistrationNames:{bubbled:v({onDragExit:!0}),captured:v({onDragExitCapture:!0})}},dragLeave:{phasedRegistrationNames:{bubbled:v({onDragLeave:!0}),captured:v({onDragLeaveCapture:!0})}},dragOver:{phasedRegistrationNames:{bubbled:v({onDragOver:!0}),captured:v({onDragOverCapture:!0})}},dragStart:{phasedRegistrationNames:{bubbled:v({onDragStart:!0}),captured:v({onDragStartCapture:!0})}},drop:{phasedRegistrationNames:{bubbled:v({onDrop:!0}),captured:v({onDropCapture:!0})}},focus:{phasedRegistrationNames:{bubbled:v({onFocus:!0}),captured:v({onFocusCapture:!0})}},input:{phasedRegistrationNames:{bubbled:v({onInput:!0}),captured:v({onInputCapture:!0})}},keyDown:{phasedRegistrationNames:{bubbled:v({onKeyDown:!0}),captured:v({onKeyDownCapture:!0})}},keyPress:{phasedRegistrationNames:{bubbled:v({onKeyPress:!0}),captured:v({onKeyPressCapture:!0})}},keyUp:{phasedRegistrationNames:{bubbled:v({onKeyUp:!0}),captured:v({onKeyUpCapture:!0})}},load:{phasedRegistrationNames:{bubbled:v({onLoad:!0}),captured:v({onLoadCapture:!0})}},error:{phasedRegistrationNames:{bubbled:v({onError:!0}),captured:v({onErrorCapture:!0})}},mouseDown:{phasedRegistrationNames:{bubbled:v({onMouseDown:!0}),captured:v({onMouseDownCapture:!0})}},mouseMove:{phasedRegistrationNames:{bubbled:v({onMouseMove:!0}),captured:v({onMouseMoveCapture:!0})}},mouseOut:{phasedRegistrationNames:{bubbled:v({onMouseOut:!0}),captured:v({onMouseOutCapture:!0})}},mouseOver:{phasedRegistrationNames:{bubbled:v({onMouseOver:!0}),captured:v({onMouseOverCapture:!0})}},mouseUp:{phasedRegistrationNames:{bubbled:v({onMouseUp:!0}),captured:v({onMouseUpCapture:!0})}},paste:{phasedRegistrationNames:{bubbled:v({onPaste:!0}),captured:v({onPasteCapture:!0})}},reset:{phasedRegistrationNames:{bubbled:v({onReset:!0}),captured:v({onResetCapture:!0})}},scroll:{phasedRegistrationNames:{bubbled:v({onScroll:!0}),captured:v({onScrollCapture:!0})}},submit:{phasedRegistrationNames:{bubbled:v({onSubmit:!0}),captured:v({onSubmitCapture:!0})}},touchCancel:{phasedRegistrationNames:{bubbled:v({onTouchCancel:!0}),captured:v({onTouchCancelCapture:!0})}},touchEnd:{phasedRegistrationNames:{bubbled:v({onTouchEnd:!0}),captured:v({onTouchEndCapture:!0})}},touchMove:{phasedRegistrationNames:{bubbled:v({onTouchMove:!0}),captured:v({onTouchMoveCapture:!0})}},touchStart:{phasedRegistrationNames:{bubbled:v({onTouchStart:!0}),captured:v({onTouchStartCapture:!0})}},wheel:{phasedRegistrationNames:{bubbled:v({onWheel:!0}),captured:v({onWheelCapture:!0})}}},E={topBlur:y.blur,topClick:y.click,topContextMenu:y.contextMenu,topCopy:y.copy,topCut:y.cut,topDoubleClick:y.doubleClick,topDrag:y.drag,topDragEnd:y.dragEnd,topDragEnter:y.dragEnter,topDragExit:y.dragExit,topDragLeave:y.dragLeave,topDragOver:y.dragOver,topDragStart:y.dragStart,topDrop:y.drop,topError:y.error,topFocus:y.focus,topInput:y.input,topKeyDown:y.keyDown,topKeyPress:y.keyPress,topKeyUp:y.keyUp,topLoad:y.load,topMouseDown:y.mouseDown,topMouseMove:y.mouseMove,topMouseOut:y.mouseOut,topMouseOver:y.mouseOver,topMouseUp:y.mouseUp,topPaste:y.paste,topReset:y.reset,topScroll:y.scroll,topSubmit:y.submit,topTouchCancel:y.touchCancel,topTouchEnd:y.touchEnd,topTouchMove:y.touchMove,topTouchStart:y.touchStart,topWheel:y.wheel};for(var C in E)E[C].dependencies=[C];var R={eventTypes:y,executeDispatch:function(e,t,n){var o=r.executeDispatch(e,t,n);o===!1&&(e.stopPropagation(),e.preventDefault())},extractEvents:function(e,t,n,r){var v=E[e];if(!v)return null;var y;switch(e){case g.topInput:case g.topLoad:case g.topError:case g.topReset:case g.topSubmit:y=i;break;case g.topKeyPress:if(0===h(r))return null;case g.topKeyDown:case g.topKeyUp:y=u;break;case g.topBlur:case g.topFocus:y=s;break;case g.topClick:if(2===r.button)return null;case g.topContextMenu:case g.topDoubleClick:case g.topMouseDown:case g.topMouseMove:case g.topMouseOut:case g.topMouseOver:case g.topMouseUp:y=c;break;case g.topDrag:case g.topDragEnd:case g.topDragEnter:case g.topDragExit:case g.topDragLeave:case g.topDragOver:case g.topDragStart:case g.topDrop:y=l;break;case g.topTouchCancel:case g.topTouchEnd:case g.topTouchMove:case g.topTouchStart:y=p;break;case g.topScroll:y=d;break;case g.topWheel:y=f;break;case g.topCopy:case g.topCut:case g.topPaste:y=a}m(y);var C=y.getPooled(v,n,r);return o.accumulateTwoPhaseDispatches(C),C}};t.exports=R},{"./EventConstants":16,"./EventPluginUtils":20,"./EventPropagators":21,"./SyntheticClipboardEvent":82,"./SyntheticDragEvent":84,"./SyntheticEvent":85,"./SyntheticFocusEvent":86,"./SyntheticKeyboardEvent":88,"./SyntheticMouseEvent":89,"./SyntheticTouchEvent":90,"./SyntheticUIEvent":91,"./SyntheticWheelEvent":92,"./getEventCharCode":112,"./invariant":124,"./keyOf":131,"./warning":141}],82:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticEvent"),o={clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}};r.augmentClass(n,o),t.exports=n},{"./SyntheticEvent":85}],83:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticEvent"),o={data:null};r.augmentClass(n,o),t.exports=n},{"./SyntheticEvent":85}],84:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticMouseEvent"),o={dataTransfer:null};r.augmentClass(n,o),t.exports=n},{"./SyntheticMouseEvent":89}],85:[function(e,t){"use strict";function n(e,t,n){this.dispatchConfig=e,this.dispatchMarker=t,this.nativeEvent=n;var r=this.constructor.Interface;for(var o in r)if(r.hasOwnProperty(o)){var i=r[o];this[o]=i?i(n):n[o]}var s=null!=n.defaultPrevented?n.defaultPrevented:n.returnValue===!1;this.isDefaultPrevented=s?a.thatReturnsTrue:a.thatReturnsFalse,this.isPropagationStopped=a.thatReturnsFalse}var r=e("./PooledClass"),o=e("./Object.assign"),a=e("./emptyFunction"),i=e("./getEventTarget"),s={type:null,target:i,currentTarget:a.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};o(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e.preventDefault?e.preventDefault():e.returnValue=!1,this.isDefaultPrevented=a.thatReturnsTrue},stopPropagation:function(){var e=this.nativeEvent;e.stopPropagation?e.stopPropagation():e.cancelBubble=!0,this.isPropagationStopped=a.thatReturnsTrue},persist:function(){this.isPersistent=a.thatReturnsTrue},isPersistent:a.thatReturnsFalse,destructor:function(){var e=this.constructor.Interface;for(var t in e)this[t]=null;this.dispatchConfig=null,this.dispatchMarker=null,this.nativeEvent=null}}),n.Interface=s,n.augmentClass=function(e,t){var n=this,a=Object.create(n.prototype);o(a,e.prototype),e.prototype=a,e.prototype.constructor=e,e.Interface=o({},n.Interface,t),e.augmentClass=n.augmentClass,r.addPoolingTo(e,r.threeArgumentPooler)},r.addPoolingTo(n,r.threeArgumentPooler),t.exports=n},{"./Object.assign":27,"./PooledClass":28,"./emptyFunction":105,"./getEventTarget":115}],86:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticUIEvent"),o={relatedTarget:null};r.augmentClass(n,o),t.exports=n},{"./SyntheticUIEvent":91}],87:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticEvent"),o={data:null};r.augmentClass(n,o),t.exports=n},{"./SyntheticEvent":85}],88:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticUIEvent"),o=e("./getEventCharCode"),a=e("./getEventKey"),i=e("./getEventModifierState"),s={key:a,location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:i,charCode:function(e){return"keypress"===e.type?o(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?o(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}};r.augmentClass(n,s),t.exports=n},{"./SyntheticUIEvent":91,"./getEventCharCode":112,"./getEventKey":113,"./getEventModifierState":114}],89:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticUIEvent"),o=e("./ViewportMetrics"),a=e("./getEventModifierState"),i={screenX:null,screenY:null,clientX:null,clientY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:a,button:function(e){var t=e.button;return"which"in e?t:2===t?2:4===t?1:0},buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},pageX:function(e){return"pageX"in e?e.pageX:e.clientX+o.currentScrollLeft},pageY:function(e){return"pageY"in e?e.pageY:e.clientY+o.currentScrollTop}};r.augmentClass(n,i),t.exports=n},{"./SyntheticUIEvent":91,"./ViewportMetrics":94,"./getEventModifierState":114}],90:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticUIEvent"),o=e("./getEventModifierState"),a={touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:o};r.augmentClass(n,a),t.exports=n},{"./SyntheticUIEvent":91,"./getEventModifierState":114}],91:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticEvent"),o=e("./getEventTarget"),a={view:function(e){if(e.view)return e.view;var t=o(e);if(null!=t&&t.window===t)return t;var n=t.ownerDocument;return n?n.defaultView||n.parentWindow:window},detail:function(e){return e.detail||0}};r.augmentClass(n,a),t.exports=n},{"./SyntheticEvent":85,"./getEventTarget":115}],92:[function(e,t){"use strict";function n(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticMouseEvent"),o={deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null};r.augmentClass(n,o),t.exports=n},{"./SyntheticMouseEvent":89}],93:[function(e,t){"use strict";var n=e("./invariant"),r={reinitializeTransaction:function(){this.transactionWrappers=this.getTransactionWrappers(),this.wrapperInitData?this.wrapperInitData.length=0:this.wrapperInitData=[],this._isInTransaction=!1},_isInTransaction:!1,getTransactionWrappers:null,isInTransaction:function(){return!!this._isInTransaction},perform:function(e,t,r,o,a,i,s,u){n(!this.isInTransaction());var c,l;try{this._isInTransaction=!0,c=!0,this.initializeAll(0),l=e.call(t,r,o,a,i,s,u),c=!1}finally{try{if(c)try{this.closeAll(0)}catch(p){}else this.closeAll(0)}finally{this._isInTransaction=!1}}return l},initializeAll:function(e){for(var t=this.transactionWrappers,n=e;n<t.length;n++){var r=t[n];try{this.wrapperInitData[n]=o.OBSERVED_ERROR,this.wrapperInitData[n]=r.initialize?r.initialize.call(this):null}finally{if(this.wrapperInitData[n]===o.OBSERVED_ERROR)try{this.initializeAll(n+1)}catch(a){}}}},closeAll:function(e){n(this.isInTransaction());for(var t=this.transactionWrappers,r=e;r<t.length;r++){var a,i=t[r],s=this.wrapperInitData[r];try{a=!0,s!==o.OBSERVED_ERROR&&i.close&&i.close.call(this,s),a=!1}finally{if(a)try{this.closeAll(r+1)}catch(u){}}}this.wrapperInitData.length=0}},o={Mixin:r,OBSERVED_ERROR:{}};t.exports=o},{"./invariant":124}],94:[function(e,t){"use strict";var n=e("./getUnboundedScrollPosition"),r={currentScrollLeft:0,currentScrollTop:0,refreshScrollValues:function(){var e=n(window);r.currentScrollLeft=e.x,r.currentScrollTop=e.y}};t.exports=r},{"./getUnboundedScrollPosition":120}],95:[function(e,t){"use strict";function n(e,t){if(r(null!=t),null==e)return t;var n=Array.isArray(e),o=Array.isArray(t);return n&&o?(e.push.apply(e,t),e):n?(e.push(t),e):o?[e].concat(t):[e,t]}var r=e("./invariant");t.exports=n},{"./invariant":124}],96:[function(e,t){"use strict";function n(e){for(var t=1,n=0,o=0;o<e.length;o++)t=(t+e.charCodeAt(o))%r,n=(n+t)%r;return t|n<<16}var r=65521;t.exports=n},{}],97:[function(e,t){function n(e){return e.replace(r,function(e,t){return t.toUpperCase()})}var r=/-(.)/g;t.exports=n},{}],98:[function(e,t){"use strict";function n(e){return r(e.replace(o,"ms-"))}var r=e("./camelize"),o=/^-ms-/;t.exports=n},{"./camelize":97}],99:[function(e,t){function n(e,t){return e&&t?e===t?!0:r(e)?!1:r(t)?n(e,t.parentNode):e.contains?e.contains(t):e.compareDocumentPosition?!!(16&e.compareDocumentPosition(t)):!1:!1}var r=e("./isTextNode");t.exports=n},{"./isTextNode":128}],100:[function(e,t){function n(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"length"in e&&!("setInterval"in e)&&"number"!=typeof e.nodeType&&(Array.isArray(e)||"callee"in e||"item"in e)}function r(e){return n(e)?Array.isArray(e)?e.slice():o(e):[e]}var o=e("./toArray");t.exports=r},{"./toArray":139}],101:[function(e,t){"use strict";function n(e){var t=o.createFactory(e),n=r.createClass({displayName:"ReactFullPageComponent"+e,componentWillUnmount:function(){a(!1)},render:function(){return t(this.props)}});return n}var r=e("./ReactCompositeComponent"),o=e("./ReactElement"),a=e("./invariant");t.exports=n},{"./ReactCompositeComponent":34,"./ReactElement":50,"./invariant":124}],102:[function(e,t){function n(e){var t=e.match(c);return t&&t[1].toLowerCase()}function r(e,t){var r=u;s(!!u);var o=n(e),c=o&&i(o);if(c){r.innerHTML=c[1]+e+c[2];for(var l=c[0];l--;)r=r.lastChild}else r.innerHTML=e;var p=r.getElementsByTagName("script");p.length&&(s(t),a(p).forEach(t));for(var d=a(r.childNodes);r.lastChild;)r.removeChild(r.lastChild);return d}var o=e("./ExecutionEnvironment"),a=e("./createArrayFrom"),i=e("./getMarkupWrap"),s=e("./invariant"),u=o.canUseDOM?document.createElement("div"):null,c=/^\s*<(\w+)/;t.exports=r},{"./ExecutionEnvironment":22,"./createArrayFrom":100,"./getMarkupWrap":116,"./invariant":124}],103:[function(e,t){"use strict";function n(e,t){var n=null==t||"boolean"==typeof t||""===t;if(n)return"";var r=isNaN(t);return r||0===t||o.hasOwnProperty(e)&&o[e]?""+t:("string"==typeof t&&(t=t.trim()),t+"px")}var r=e("./CSSProperty"),o=r.isUnitlessNumber;t.exports=n},{"./CSSProperty":4}],104:[function(e,t){function n(e,t,n,r,o){return o}e("./Object.assign"),e("./warning");t.exports=n},{"./Object.assign":27,"./warning":141}],105:[function(e,t){function n(e){return function(){return e}}function r(){}r.thatReturns=n,r.thatReturnsFalse=n(!1),r.thatReturnsTrue=n(!0),r.thatReturnsNull=n(null),r.thatReturnsThis=function(){return this},r.thatReturnsArgument=function(e){return e},t.exports=r},{}],106:[function(e,t){"use strict";var n={};t.exports=n},{}],107:[function(e,t){"use strict";function n(e){return o[e]}function r(e){return(""+e).replace(a,n)}var o={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;"},a=/[&><"']/g;t.exports=r},{}],108:[function(e,t){"use strict";function n(e,t,n){var r=e,a=!r.hasOwnProperty(n);if(a&&null!=t){var i,s=typeof t;i="string"===s?o(t):"number"===s?o(""+t):t,r[n]=i}}function r(e){if(null==e)return e;var t={};return a(e,n,t),t}{var o=e("./ReactTextComponent"),a=e("./traverseAllChildren");e("./warning")}t.exports=r},{"./ReactTextComponent":76,"./traverseAllChildren":140,"./warning":141}],109:[function(e,t){"use strict";function n(e){try{e.focus()}catch(t){}}t.exports=n},{}],110:[function(e,t){"use strict";var n=function(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)};t.exports=n},{}],111:[function(e,t){function n(){try{return document.activeElement||document.body}catch(e){return document.body}}t.exports=n},{}],112:[function(e,t){"use strict";function n(e){var t,n=e.keyCode;return"charCode"in e?(t=e.charCode,0===t&&13===n&&(t=13)):t=n,t>=32||13===t?t:0}t.exports=n},{}],113:[function(e,t){"use strict";function n(e){if(e.key){var t=o[e.key]||e.key;if("Unidentified"!==t)return t}if("keypress"===e.type){var n=r(e);return 13===n?"Enter":String.fromCharCode(n)}return"keydown"===e.type||"keyup"===e.type?a[e.keyCode]||"Unidentified":""}var r=e("./getEventCharCode"),o={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},a={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"};t.exports=n},{"./getEventCharCode":112}],114:[function(e,t){"use strict";function n(e){var t=this,n=t.nativeEvent;if(n.getModifierState)return n.getModifierState(e);var r=o[e];return r?!!n[r]:!1}function r(){return n}var o={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};t.exports=r},{}],115:[function(e,t){"use strict";function n(e){var t=e.target||e.srcElement||window;return 3===t.nodeType?t.parentNode:t}t.exports=n},{}],116:[function(e,t){function n(e){return o(!!a),p.hasOwnProperty(e)||(e="*"),i.hasOwnProperty(e)||(a.innerHTML="*"===e?"<link />":"<"+e+"></"+e+">",i[e]=!a.firstChild),i[e]?p[e]:null}var r=e("./ExecutionEnvironment"),o=e("./invariant"),a=r.canUseDOM?document.createElement("div"):null,i={circle:!0,defs:!0,ellipse:!0,g:!0,line:!0,linearGradient:!0,path:!0,polygon:!0,polyline:!0,radialGradient:!0,rect:!0,stop:!0,text:!0},s=[1,'<select multiple="true">',"</select>"],u=[1,"<table>","</table>"],c=[3,"<table><tbody><tr>","</tr></tbody></table>"],l=[1,"<svg>","</svg>"],p={"*":[1,"?<div>","</div>"],area:[1,"<map>","</map>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],legend:[1,"<fieldset>","</fieldset>"],param:[1,"<object>","</object>"],tr:[2,"<table><tbody>","</tbody></table>"],optgroup:s,option:s,caption:u,colgroup:u,tbody:u,tfoot:u,thead:u,td:c,th:c,circle:l,defs:l,ellipse:l,g:l,line:l,linearGradient:l,path:l,polygon:l,polyline:l,radialGradient:l,rect:l,stop:l,text:l};t.exports=n},{"./ExecutionEnvironment":22,"./invariant":124}],117:[function(e,t){"use strict";function n(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function r(e){for(;e;){if(e.nextSibling)return e.nextSibling;e=e.parentNode}}function o(e,t){for(var o=n(e),a=0,i=0;o;){if(3==o.nodeType){if(i=a+o.textContent.length,t>=a&&i>=t)return{node:o,offset:t-a};a=i}o=n(r(o))}}t.exports=o},{}],118:[function(e,t){"use strict";function n(e){return e?e.nodeType===r?e.documentElement:e.firstChild:null}var r=9;t.exports=n},{}],119:[function(e,t){"use strict";function n(){return!o&&r.canUseDOM&&(o="textContent"in document.documentElement?"textContent":"innerText"),o}var r=e("./ExecutionEnvironment"),o=null;t.exports=n},{"./ExecutionEnvironment":22}],120:[function(e,t){"use strict";function n(e){return e===window?{x:window.pageXOffset||document.documentElement.scrollLeft,y:window.pageYOffset||document.documentElement.scrollTop}:{x:e.scrollLeft,y:e.scrollTop}}t.exports=n},{}],121:[function(e,t){function n(e){return e.replace(r,"-$1").toLowerCase()}var r=/([A-Z])/g;t.exports=n},{}],122:[function(e,t){"use strict";function n(e){return r(e).replace(o,"-ms-")}var r=e("./hyphenate"),o=/^ms-/;t.exports=n},{"./hyphenate":121}],123:[function(e,t){"use strict";function n(e,t){var n;return n="string"==typeof e.type?r.createInstanceForTag(e.type,e.props,t):new e.type(e.props),n.construct(e),n}{var r=(e("./warning"),e("./ReactElement"),e("./ReactLegacyElement"),e("./ReactNativeComponent"));e("./ReactEmptyComponent")}t.exports=n},{"./ReactElement":50,"./ReactEmptyComponent":52,"./ReactLegacyElement":59,"./ReactNativeComponent":64,"./warning":141}],124:[function(e,t){"use strict";var n=function(e,t,n,r,o,a,i,s){if(!e){var u;if(void 0===t)u=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,r,o,a,i,s],l=0;u=new Error("Invariant Violation: "+t.replace(/%s/g,function(){return c[l++]}))}throw u.framesToPop=1,u}};t.exports=n},{}],125:[function(e,t){"use strict";function n(e,t){if(!o.canUseDOM||t&&!("addEventListener"in document))return!1;var n="on"+e,a=n in document;if(!a){var i=document.createElement("div");i.setAttribute(n,"return;"),a="function"==typeof i[n]}return!a&&r&&"wheel"===e&&(a=document.implementation.hasFeature("Events.wheel","3.0")),a}var r,o=e("./ExecutionEnvironment");o.canUseDOM&&(r=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0),t.exports=n},{"./ExecutionEnvironment":22}],126:[function(e,t){function n(e){return!(!e||!("function"==typeof Node?e instanceof Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName))}t.exports=n},{}],127:[function(e,t){"use strict";function n(e){return e&&("INPUT"===e.nodeName&&r[e.type]||"TEXTAREA"===e.nodeName)}var r={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};t.exports=n},{}],128:[function(e,t){function n(e){return r(e)&&3==e.nodeType}var r=e("./isNode");t.exports=n},{"./isNode":126}],129:[function(e,t){"use strict";function n(e){e||(e="");var t,n=arguments.length;if(n>1)for(var r=1;n>r;r++)t=arguments[r],t&&(e=(e?e+" ":"")+t);return e}t.exports=n},{}],130:[function(e,t){"use strict";var n=e("./invariant"),r=function(e){var t,r={};n(e instanceof Object&&!Array.isArray(e));for(t in e)e.hasOwnProperty(t)&&(r[t]=t);return r};t.exports=r},{"./invariant":124}],131:[function(e,t){var n=function(e){var t;for(t in e)if(e.hasOwnProperty(t))return t;return null};t.exports=n},{}],132:[function(e,t){"use strict";function n(e,t,n){if(!e)return null;var o={};for(var a in e)r.call(e,a)&&(o[a]=t.call(n,e[a],a,e));return o}var r=Object.prototype.hasOwnProperty;t.exports=n},{}],133:[function(e,t){"use strict";function n(e){var t={};return function(n){return t.hasOwnProperty(n)?t[n]:t[n]=e.call(this,n)}}t.exports=n},{}],134:[function(e,t){"use strict";function n(e){r(e&&!/[^a-z0-9_]/.test(e))}var r=e("./invariant");t.exports=n},{"./invariant":124}],135:[function(e,t){"use strict";function n(e){return o(r.isValidElement(e)),e}var r=e("./ReactElement"),o=e("./invariant");t.exports=n},{"./ReactElement":50,"./invariant":124}],136:[function(e,t){"use strict";var n=e("./ExecutionEnvironment"),r=/^[ \r\n\t\f]/,o=/<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/,a=function(e,t){e.innerHTML=t};if(n.canUseDOM){var i=document.createElement("div");i.innerHTML=" ",""===i.innerHTML&&(a=function(e,t){if(e.parentNode&&e.parentNode.replaceChild(e,e),r.test(t)||"<"===t[0]&&o.test(t)){e.innerHTML=""+t;
var n=e.firstChild;1===n.data.length?e.removeChild(n):n.deleteData(0,1)}else e.innerHTML=t})}t.exports=a},{"./ExecutionEnvironment":22}],137:[function(e,t){"use strict";function n(e,t){if(e===t)return!0;var n;for(n in e)if(e.hasOwnProperty(n)&&(!t.hasOwnProperty(n)||e[n]!==t[n]))return!1;for(n in t)if(t.hasOwnProperty(n)&&!e.hasOwnProperty(n))return!1;return!0}t.exports=n},{}],138:[function(e,t){"use strict";function n(e,t){return e&&t&&e.type===t.type&&e.key===t.key&&e._owner===t._owner?!0:!1}t.exports=n},{}],139:[function(e,t){function n(e){var t=e.length;if(r(!Array.isArray(e)&&("object"==typeof e||"function"==typeof e)),r("number"==typeof t),r(0===t||t-1 in e),e.hasOwnProperty)try{return Array.prototype.slice.call(e)}catch(n){}for(var o=Array(t),a=0;t>a;a++)o[a]=e[a];return o}var r=e("./invariant");t.exports=n},{"./invariant":124}],140:[function(e,t){"use strict";function n(e){return d[e]}function r(e,t){return e&&null!=e.key?a(e.key):t.toString(36)}function o(e){return(""+e).replace(f,n)}function a(e){return"$"+o(e)}function i(e,t,n){return null==e?0:h(e,"",0,t,n)}var s=e("./ReactElement"),u=e("./ReactInstanceHandles"),c=e("./invariant"),l=u.SEPARATOR,p=":",d={"=":"=0",".":"=1",":":"=2"},f=/[=.:]/g,h=function(e,t,n,o,i){var u,d,f=0;if(Array.isArray(e))for(var m=0;m<e.length;m++){var v=e[m];u=t+(t?p:l)+r(v,m),d=n+f,f+=h(v,u,d,o,i)}else{var g=typeof e,y=""===t,E=y?l+r(e,0):t;if(null==e||"boolean"===g)o(i,null,E,n),f=1;else if("string"===g||"number"===g||s.isValidElement(e))o(i,e,E,n),f=1;else if("object"===g){c(!e||1!==e.nodeType);for(var C in e)e.hasOwnProperty(C)&&(u=t+(t?p:l)+a(C)+p+r(e[C],0),d=n+f,f+=h(e[C],u,d,o,i))}}return f};t.exports=i},{"./ReactElement":50,"./ReactInstanceHandles":58,"./invariant":124}],141:[function(e,t){"use strict";var n=e("./emptyFunction"),r=n;t.exports=r},{"./emptyFunction":105}]},{},[1])(1)});
;(function(){
var h, aa = this;
function n(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
}
function ba(a) {
  return "array" == n(a);
}
function ca(a) {
  return "string" == typeof a;
}
function ga(a) {
  return "number" == typeof a;
}
function ha(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
}
function ia(a) {
  return a[ka] || (a[ka] = ++na);
}
var ka = "closure_uid_" + (1E9 * Math.random() >>> 0), na = 0;
function oa(a, b, c) {
  return a.call.apply(a.bind, arguments);
}
function qa(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
}
function ra(a, b, c) {
  ra = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? oa : qa;
  return ra.apply(null, arguments);
}
function sa(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
}
var ta = Date.now || function() {
  return +new Date;
};
function wa(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.Ab = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.base = function(a, c, f) {
    for (var g = Array(arguments.length - 2), k = 2;k < arguments.length;k++) {
      g[k - 2] = arguments[k];
    }
    return b.prototype[c].apply(a, g);
  };
}
;function ya(a, b) {
  for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift();
  }
  return d + c.join("%s");
}
var Aa = String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
function Ba(a) {
  if (!Ca.test(a)) {
    return a;
  }
  -1 != a.indexOf("\x26") && (a = a.replace(Ea, "\x26amp;"));
  -1 != a.indexOf("\x3c") && (a = a.replace(Fa, "\x26lt;"));
  -1 != a.indexOf("\x3e") && (a = a.replace(Ga, "\x26gt;"));
  -1 != a.indexOf('"') && (a = a.replace(Ha, "\x26quot;"));
  -1 != a.indexOf("'") && (a = a.replace(Ia, "\x26#39;"));
  -1 != a.indexOf("\x00") && (a = a.replace(Ka, "\x26#0;"));
  return a;
}
var Ea = /&/g, Fa = /</g, Ga = />/g, Ha = /"/g, Ia = /'/g, Ka = /\x00/g, Ca = /[\x00&<>"']/;
function La(a, b) {
  return Array(b + 1).join(a);
}
function Na(a) {
  a = String(a);
  var b = a.indexOf(".");
  -1 == b && (b = a.length);
  return La("0", Math.max(0, 2 - b)) + a;
}
function Oa(a) {
  return Array.prototype.join.call(arguments, "");
}
function Pa(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
;function Qa(a, b) {
  for (var c in a) {
    b.call(void 0, a[c], c, a);
  }
}
var Ra = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Sa(a, b) {
  for (var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (var f = 0;f < Ra.length;f++) {
      c = Ra[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
}
function Ta(a) {
  var b = arguments.length;
  if (1 == b && ba(arguments[0])) {
    return Ta.apply(null, arguments[0]);
  }
  for (var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0;
  }
  return c;
}
;function Ua(a, b) {
  null != a && this.append.apply(this, arguments);
}
h = Ua.prototype;
h.cb = "";
h.set = function(a) {
  this.cb = "" + a;
};
h.append = function(a, b, c) {
  this.cb += a;
  if (null != b) {
    for (var d = 1;d < arguments.length;d++) {
      this.cb += arguments[d];
    }
  }
  return this;
};
h.clear = function() {
  this.cb = "";
};
h.toString = function() {
  return this.cb;
};
function Va(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Va);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
}
wa(Va, Error);
Va.prototype.name = "CustomError";
function Xa(a, b) {
  b.unshift(a);
  Va.call(this, ya.apply(null, b));
  b.shift();
}
wa(Xa, Va);
Xa.prototype.name = "AssertionError";
function Ya(a, b) {
  throw new Xa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
}
;var Za = Array.prototype, $a = Za.indexOf ? function(a, b, c) {
  return Za.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (ca(a)) {
    return ca(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (;c < a.length;c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return -1;
}, ab = Za.forEach ? function(a, b, c) {
  Za.forEach.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = ca(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a);
  }
};
function bb(a, b) {
  a.sort(b || cb);
}
function db(a, b) {
  for (var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]};
  }
  var d = b || cb;
  bb(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index;
  });
  for (c = 0;c < a.length;c++) {
    a[c] = a[c].value;
  }
}
function cb(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}
;if ("undefined" === typeof fb) {
  var fb = function() {
    throw Error("No *print-fn* fn set for evaluation environment");
  }
}
var gb = !0, hb = null;
if ("undefined" === typeof ib) {
  var ib = null
}
function jb() {
  return new u(null, 5, [kb, !0, lb, !0, mb, !1, nb, !1, pb, null], null);
}
function v(a) {
  return null != a && !1 !== a;
}
function qb(a) {
  return null == a;
}
function rb(a) {
  return a instanceof Array;
}
function sb(a) {
  return v(a) ? !1 : !0;
}
function w(a, b) {
  return a[n(null == b ? null : b)] ? !0 : a._ ? !0 : !1;
}
function tb(a) {
  return null == a ? null : a.constructor;
}
function x(a, b) {
  var c = tb(b), c = v(v(c) ? c.Ed : c) ? c.Dd : n(b);
  return Error(["No protocol method ", a, " defined for type ", c, ": ", b].join(""));
}
function ub(a) {
  var b = a.Dd;
  return v(b) ? b : "" + z(a);
}
var vb = "undefined" !== typeof Symbol && "function" === n(Symbol) ? Symbol.iterator : "@@iterator";
function wb(a) {
  for (var b = a.length, c = Array(b), d = 0;;) {
    if (d < b) {
      c[d] = a[d], d += 1;
    } else {
      break;
    }
  }
  return c;
}
function xb() {
  switch(arguments.length) {
    case 1:
      return yb(arguments[0]);
    case 2:
      return yb(arguments[1]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function zb(a) {
  return yb(a);
}
function yb(a) {
  function b(a, b) {
    a.push(b);
    return a;
  }
  var c = [];
  return Ab ? Ab(b, c, a) : Bb.call(null, b, c, a);
}
var Cb = {}, Db = {}, Eb = {}, Gb = function Gb(b) {
  if (b ? b.$ : b) {
    return b.$(b);
  }
  var c;
  c = Gb[n(null == b ? null : b)];
  if (!c && (c = Gb._, !c)) {
    throw x("ICounted.-count", b);
  }
  return c.call(null, b);
}, Hb = function Hb(b) {
  if (b ? b.aa : b) {
    return b.aa(b);
  }
  var c;
  c = Hb[n(null == b ? null : b)];
  if (!c && (c = Hb._, !c)) {
    throw x("IEmptyableCollection.-empty", b);
  }
  return c.call(null, b);
}, Ib = {}, Jb = function Jb(b, c) {
  if (b ? b.X : b) {
    return b.X(b, c);
  }
  var d;
  d = Jb[n(null == b ? null : b)];
  if (!d && (d = Jb._, !d)) {
    throw x("ICollection.-conj", b);
  }
  return d.call(null, b, c);
}, Kb = {}, C = function C() {
  switch(arguments.length) {
    case 2:
      return C.c(arguments[0], arguments[1]);
    case 3:
      return C.l(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
};
C.c = function(a, b) {
  if (a ? a.P : a) {
    return a.P(a, b);
  }
  var c;
  c = C[n(null == a ? null : a)];
  if (!c && (c = C._, !c)) {
    throw x("IIndexed.-nth", a);
  }
  return c.call(null, a, b);
};
C.l = function(a, b, c) {
  if (a ? a.Ca : a) {
    return a.Ca(a, b, c);
  }
  var d;
  d = C[n(null == a ? null : a)];
  if (!d && (d = C._, !d)) {
    throw x("IIndexed.-nth", a);
  }
  return d.call(null, a, b, c);
};
C.H = 3;
var Lb = {}, Mb = function Mb(b) {
  if (b ? b.ba : b) {
    return b.ba(b);
  }
  var c;
  c = Mb[n(null == b ? null : b)];
  if (!c && (c = Mb._, !c)) {
    throw x("ISeq.-first", b);
  }
  return c.call(null, b);
}, Nb = function Nb(b) {
  if (b ? b.Ba : b) {
    return b.Ba(b);
  }
  var c;
  c = Nb[n(null == b ? null : b)];
  if (!c && (c = Nb._, !c)) {
    throw x("ISeq.-rest", b);
  }
  return c.call(null, b);
}, Ob = {}, Pb = {}, Qb = function Qb() {
  switch(arguments.length) {
    case 2:
      return Qb.c(arguments[0], arguments[1]);
    case 3:
      return Qb.l(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
};
Qb.c = function(a, b) {
  if (a ? a.U : a) {
    return a.U(a, b);
  }
  var c;
  c = Qb[n(null == a ? null : a)];
  if (!c && (c = Qb._, !c)) {
    throw x("ILookup.-lookup", a);
  }
  return c.call(null, a, b);
};
Qb.l = function(a, b, c) {
  if (a ? a.R : a) {
    return a.R(a, b, c);
  }
  var d;
  d = Qb[n(null == a ? null : a)];
  if (!d && (d = Qb._, !d)) {
    throw x("ILookup.-lookup", a);
  }
  return d.call(null, a, b, c);
};
Qb.H = 3;
var Rb = function Rb(b, c) {
  if (b ? b.Pc : b) {
    return b.Pc(b, c);
  }
  var d;
  d = Rb[n(null == b ? null : b)];
  if (!d && (d = Rb._, !d)) {
    throw x("IAssociative.-contains-key?", b);
  }
  return d.call(null, b, c);
}, Sb = function Sb(b, c, d) {
  if (b ? b.Fb : b) {
    return b.Fb(b, c, d);
  }
  var e;
  e = Sb[n(null == b ? null : b)];
  if (!e && (e = Sb._, !e)) {
    throw x("IAssociative.-assoc", b);
  }
  return e.call(null, b, c, d);
}, Tb = {}, Ub = function Ub(b, c) {
  if (b ? b.Uc : b) {
    return b.Uc(b, c);
  }
  var d;
  d = Ub[n(null == b ? null : b)];
  if (!d && (d = Ub._, !d)) {
    throw x("IMap.-dissoc", b);
  }
  return d.call(null, b, c);
}, Vb = {}, Wb = function Wb(b) {
  if (b ? b.Vc : b) {
    return b.Vc();
  }
  var c;
  c = Wb[n(null == b ? null : b)];
  if (!c && (c = Wb._, !c)) {
    throw x("IMapEntry.-key", b);
  }
  return c.call(null, b);
}, Xb = function Xb(b) {
  if (b ? b.Wc : b) {
    return b.Wc();
  }
  var c;
  c = Xb[n(null == b ? null : b)];
  if (!c && (c = Xb._, !c)) {
    throw x("IMapEntry.-val", b);
  }
  return c.call(null, b);
}, Yb = {}, Zb = function Zb(b, c) {
  if (b ? b.Ad : b) {
    return b.Ad(0, c);
  }
  var d;
  d = Zb[n(null == b ? null : b)];
  if (!d && (d = Zb._, !d)) {
    throw x("ISet.-disjoin", b);
  }
  return d.call(null, b, c);
}, $b = function $b(b) {
  if (b ? b.Nb : b) {
    return b.Nb(b);
  }
  var c;
  c = $b[n(null == b ? null : b)];
  if (!c && (c = $b._, !c)) {
    throw x("IStack.-peek", b);
  }
  return c.call(null, b);
}, ac = function ac(b) {
  if (b ? b.Ob : b) {
    return b.Ob(b);
  }
  var c;
  c = ac[n(null == b ? null : b)];
  if (!c && (c = ac._, !c)) {
    throw x("IStack.-pop", b);
  }
  return c.call(null, b);
}, bc = {}, cc = function cc(b, c, d) {
  if (b ? b.bd : b) {
    return b.bd(b, c, d);
  }
  var e;
  e = cc[n(null == b ? null : b)];
  if (!e && (e = cc._, !e)) {
    throw x("IVector.-assoc-n", b);
  }
  return e.call(null, b, c, d);
}, ec = function ec(b) {
  if (b ? b.fc : b) {
    return b.fc(b);
  }
  var c;
  c = ec[n(null == b ? null : b)];
  if (!c && (c = ec._, !c)) {
    throw x("IDeref.-deref", b);
  }
  return c.call(null, b);
}, fc = {}, gc = function gc(b) {
  if (b ? b.T : b) {
    return b.T(b);
  }
  var c;
  c = gc[n(null == b ? null : b)];
  if (!c && (c = gc._, !c)) {
    throw x("IMeta.-meta", b);
  }
  return c.call(null, b);
}, hc = {}, ic = function ic(b, c) {
  if (b ? b.W : b) {
    return b.W(b, c);
  }
  var d;
  d = ic[n(null == b ? null : b)];
  if (!d && (d = ic._, !d)) {
    throw x("IWithMeta.-with-meta", b);
  }
  return d.call(null, b, c);
}, jc = {}, kc = function kc() {
  switch(arguments.length) {
    case 2:
      return kc.c(arguments[0], arguments[1]);
    case 3:
      return kc.l(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
};
kc.c = function(a, b) {
  if (a ? a.ra : a) {
    return a.ra(a, b);
  }
  var c;
  c = kc[n(null == a ? null : a)];
  if (!c && (c = kc._, !c)) {
    throw x("IReduce.-reduce", a);
  }
  return c.call(null, a, b);
};
kc.l = function(a, b, c) {
  if (a ? a.sa : a) {
    return a.sa(a, b, c);
  }
  var d;
  d = kc[n(null == a ? null : a)];
  if (!d && (d = kc._, !d)) {
    throw x("IReduce.-reduce", a);
  }
  return d.call(null, a, b, c);
};
kc.H = 3;
var lc = function lc(b, c, d) {
  if (b ? b.Jb : b) {
    return b.Jb(b, c, d);
  }
  var e;
  e = lc[n(null == b ? null : b)];
  if (!e && (e = lc._, !e)) {
    throw x("IKVReduce.-kv-reduce", b);
  }
  return e.call(null, b, c, d);
}, mc = function mc(b, c) {
  if (b ? b.I : b) {
    return b.I(b, c);
  }
  var d;
  d = mc[n(null == b ? null : b)];
  if (!d && (d = mc._, !d)) {
    throw x("IEquiv.-equiv", b);
  }
  return d.call(null, b, c);
}, nc = function nc(b) {
  if (b ? b.N : b) {
    return b.N(b);
  }
  var c;
  c = nc[n(null == b ? null : b)];
  if (!c && (c = nc._, !c)) {
    throw x("IHash.-hash", b);
  }
  return c.call(null, b);
}, oc = {}, qc = function qc(b) {
  if (b ? b.Y : b) {
    return b.Y(b);
  }
  var c;
  c = qc[n(null == b ? null : b)];
  if (!c && (c = qc._, !c)) {
    throw x("ISeqable.-seq", b);
  }
  return c.call(null, b);
}, rc = {}, sc = {}, tc = {}, uc = function uc(b) {
  if (b ? b.hc : b) {
    return b.hc(b);
  }
  var c;
  c = uc[n(null == b ? null : b)];
  if (!c && (c = uc._, !c)) {
    throw x("IReversible.-rseq", b);
  }
  return c.call(null, b);
}, vc = function vc(b, c) {
  if (b ? b.Cd : b) {
    return b.Cd(0, c);
  }
  var d;
  d = vc[n(null == b ? null : b)];
  if (!d && (d = vc._, !d)) {
    throw x("IWriter.-write", b);
  }
  return d.call(null, b, c);
}, wc = {}, xc = function xc(b, c, d) {
  if (b ? b.L : b) {
    return b.L(b, c, d);
  }
  var e;
  e = xc[n(null == b ? null : b)];
  if (!e && (e = xc._, !e)) {
    throw x("IPrintWithWriter.-pr-writer", b);
  }
  return e.call(null, b, c, d);
}, yc = function yc(b, c, d) {
  if (b ? b.jc : b) {
    return b.jc(b, c, d);
  }
  var e;
  e = yc[n(null == b ? null : b)];
  if (!e && (e = yc._, !e)) {
    throw x("IWatchable.-notify-watches", b);
  }
  return e.call(null, b, c, d);
}, zc = function zc(b, c, d) {
  if (b ? b.ic : b) {
    return b.ic(b, c, d);
  }
  var e;
  e = zc[n(null == b ? null : b)];
  if (!e && (e = zc._, !e)) {
    throw x("IWatchable.-add-watch", b);
  }
  return e.call(null, b, c, d);
}, Ac = function Ac(b, c) {
  if (b ? b.kc : b) {
    return b.kc(b, c);
  }
  var d;
  d = Ac[n(null == b ? null : b)];
  if (!d && (d = Ac._, !d)) {
    throw x("IWatchable.-remove-watch", b);
  }
  return d.call(null, b, c);
}, Bc = function Bc(b) {
  if (b ? b.ob : b) {
    return b.ob(b);
  }
  var c;
  c = Bc[n(null == b ? null : b)];
  if (!c && (c = Bc._, !c)) {
    throw x("IEditableCollection.-as-transient", b);
  }
  return c.call(null, b);
}, Cc = function Cc(b, c) {
  if (b ? b.fb : b) {
    return b.fb(b, c);
  }
  var d;
  d = Cc[n(null == b ? null : b)];
  if (!d && (d = Cc._, !d)) {
    throw x("ITransientCollection.-conj!", b);
  }
  return d.call(null, b, c);
}, Ec = function Ec(b) {
  if (b ? b.pb : b) {
    return b.pb(b);
  }
  var c;
  c = Ec[n(null == b ? null : b)];
  if (!c && (c = Ec._, !c)) {
    throw x("ITransientCollection.-persistent!", b);
  }
  return c.call(null, b);
}, Fc = function Fc(b, c, d) {
  if (b ? b.Pb : b) {
    return b.Pb(b, c, d);
  }
  var e;
  e = Fc[n(null == b ? null : b)];
  if (!e && (e = Fc._, !e)) {
    throw x("ITransientAssociative.-assoc!", b);
  }
  return e.call(null, b, c, d);
}, Gc = function Gc(b, c, d) {
  if (b ? b.Bd : b) {
    return b.Bd(0, c, d);
  }
  var e;
  e = Gc[n(null == b ? null : b)];
  if (!e && (e = Gc._, !e)) {
    throw x("ITransientVector.-assoc-n!", b);
  }
  return e.call(null, b, c, d);
}, Hc = {}, Ic = function Ic(b, c) {
  if (b ? b.eb : b) {
    return b.eb(b, c);
  }
  var d;
  d = Ic[n(null == b ? null : b)];
  if (!d && (d = Ic._, !d)) {
    throw x("IComparable.-compare", b);
  }
  return d.call(null, b, c);
}, Jc = function Jc(b) {
  if (b ? b.wd : b) {
    return b.wd();
  }
  var c;
  c = Jc[n(null == b ? null : b)];
  if (!c && (c = Jc._, !c)) {
    throw x("IChunk.-drop-first", b);
  }
  return c.call(null, b);
}, Kc = function Kc(b) {
  if (b ? b.Rc : b) {
    return b.Rc(b);
  }
  var c;
  c = Kc[n(null == b ? null : b)];
  if (!c && (c = Kc._, !c)) {
    throw x("IChunkedSeq.-chunked-first", b);
  }
  return c.call(null, b);
}, Lc = function Lc(b) {
  if (b ? b.Sc : b) {
    return b.Sc(b);
  }
  var c;
  c = Lc[n(null == b ? null : b)];
  if (!c && (c = Lc._, !c)) {
    throw x("IChunkedSeq.-chunked-rest", b);
  }
  return c.call(null, b);
}, Mc = function Mc(b) {
  if (b ? b.Qc : b) {
    return b.Qc(b);
  }
  var c;
  c = Mc[n(null == b ? null : b)];
  if (!c && (c = Mc._, !c)) {
    throw x("IChunkedNext.-chunked-next", b);
  }
  return c.call(null, b);
}, Nc = function Nc(b) {
  if (b ? b.Kb : b) {
    return b.Kb(b);
  }
  var c;
  c = Nc[n(null == b ? null : b)];
  if (!c && (c = Nc._, !c)) {
    throw x("INamed.-name", b);
  }
  return c.call(null, b);
}, Oc = function Oc(b) {
  if (b ? b.Lb : b) {
    return b.Lb(b);
  }
  var c;
  c = Oc[n(null == b ? null : b)];
  if (!c && (c = Oc._, !c)) {
    throw x("INamed.-namespace", b);
  }
  return c.call(null, b);
}, Pc = function Pc(b, c) {
  if (b ? b.Xc : b) {
    return b.Xc(b, c);
  }
  var d;
  d = Pc[n(null == b ? null : b)];
  if (!d && (d = Pc._, !d)) {
    throw x("IReset.-reset!", b);
  }
  return d.call(null, b, c);
}, Qc = function Qc() {
  switch(arguments.length) {
    case 2:
      return Qc.c(arguments[0], arguments[1]);
    case 3:
      return Qc.l(arguments[0], arguments[1], arguments[2]);
    case 4:
      return Qc.C(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5:
      return Qc.K(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
};
Qc.c = function(a, b) {
  if (a ? a.Yc : a) {
    return a.Yc(a, b);
  }
  var c;
  c = Qc[n(null == a ? null : a)];
  if (!c && (c = Qc._, !c)) {
    throw x("ISwap.-swap!", a);
  }
  return c.call(null, a, b);
};
Qc.l = function(a, b, c) {
  if (a ? a.Zc : a) {
    return a.Zc(a, b, c);
  }
  var d;
  d = Qc[n(null == a ? null : a)];
  if (!d && (d = Qc._, !d)) {
    throw x("ISwap.-swap!", a);
  }
  return d.call(null, a, b, c);
};
Qc.C = function(a, b, c, d) {
  if (a ? a.$c : a) {
    return a.$c(a, b, c, d);
  }
  var e;
  e = Qc[n(null == a ? null : a)];
  if (!e && (e = Qc._, !e)) {
    throw x("ISwap.-swap!", a);
  }
  return e.call(null, a, b, c, d);
};
Qc.K = function(a, b, c, d, e) {
  if (a ? a.ad : a) {
    return a.ad(a, b, c, d, e);
  }
  var f;
  f = Qc[n(null == a ? null : a)];
  if (!f && (f = Qc._, !f)) {
    throw x("ISwap.-swap!", a);
  }
  return f.call(null, a, b, c, d, e);
};
Qc.H = 5;
var Rc = function Rc(b) {
  if (b ? b.Ib : b) {
    return b.Ib(b);
  }
  var c;
  c = Rc[n(null == b ? null : b)];
  if (!c && (c = Rc._, !c)) {
    throw x("IIterable.-iterator", b);
  }
  return c.call(null, b);
};
function Sc(a) {
  this.we = a;
  this.A = 1073741824;
  this.J = 0;
}
Sc.prototype.Cd = function(a, b) {
  return this.we.append(b);
};
function Tc(a) {
  var b = new Ua;
  a.L(null, new Sc(b), jb());
  return "" + z(b);
}
var Uc = "undefined" !== typeof Math.imul && 0 !== Math.imul(4294967295, 5) ? function(a, b) {
  return Math.imul(a, b);
} : function(a, b) {
  var c = a & 65535, d = b & 65535;
  return c * d + ((a >>> 16 & 65535) * d + c * (b >>> 16 & 65535) << 16 >>> 0) | 0;
};
function Vc(a) {
  a = Uc(a | 0, -862048943);
  return Uc(a << 15 | a >>> -15, 461845907);
}
function Wc(a, b) {
  var c = (a | 0) ^ (b | 0);
  return Uc(c << 13 | c >>> -13, 5) + -430675100 | 0;
}
function Xc(a, b) {
  var c = (a | 0) ^ b, c = Uc(c ^ c >>> 16, -2048144789), c = Uc(c ^ c >>> 13, -1028477387);
  return c ^ c >>> 16;
}
function Yc(a) {
  var b;
  a: {
    b = 1;
    for (var c = 0;;) {
      if (b < a.length) {
        var d = b + 2, c = Wc(c, Vc(a.charCodeAt(b - 1) | a.charCodeAt(b) << 16));
        b = d;
      } else {
        b = c;
        break a;
      }
    }
  }
  b = 1 === (a.length & 1) ? b ^ Vc(a.charCodeAt(a.length - 1)) : b;
  return Xc(b, Uc(2, a.length));
}
var Zc = {}, $c = 0;
function ad(a) {
  255 < $c && (Zc = {}, $c = 0);
  var b = Zc[a];
  if ("number" !== typeof b) {
    a: {
      if (null != a) {
        if (b = a.length, 0 < b) {
          for (var c = 0, d = 0;;) {
            if (c < b) {
              var e = c + 1, d = Uc(31, d) + a.charCodeAt(c), c = e
            } else {
              b = d;
              break a;
            }
          }
        } else {
          b = 0;
        }
      } else {
        b = 0;
      }
    }
    Zc[a] = b;
    $c += 1;
  }
  return a = b;
}
function bd(a) {
  a && (a.A & 4194304 || a.Ze) ? a = a.N(null) : "number" === typeof a ? a = Math.floor(a) % 2147483647 : !0 === a ? a = 1 : !1 === a ? a = 0 : "string" === typeof a ? (a = ad(a), 0 !== a && (a = Vc(a), a = Wc(0, a), a = Xc(a, 4))) : a = a instanceof Date ? a.valueOf() : null == a ? 0 : nc(a);
  return a;
}
function cd(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2);
}
function dd(a, b) {
  if (a.Qa === b.Qa) {
    return 0;
  }
  var c = sb(a.ua);
  if (v(c ? b.ua : c)) {
    return -1;
  }
  if (v(a.ua)) {
    if (sb(b.ua)) {
      return 1;
    }
    c = cb(a.ua, b.ua);
    return 0 === c ? cb(a.name, b.name) : c;
  }
  return cb(a.name, b.name);
}
function E(a, b, c, d, e) {
  this.ua = a;
  this.name = b;
  this.Qa = c;
  this.nb = d;
  this.za = e;
  this.A = 2154168321;
  this.J = 4096;
}
h = E.prototype;
h.toString = function() {
  return this.Qa;
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.I = function(a, b) {
  return b instanceof E ? this.Qa === b.Qa : !1;
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return Qb.l(c, this, null);
      case 3:
        return Qb.l(c, this, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.c = function(a, c) {
    return Qb.l(c, this, null);
  };
  a.l = function(a, c, d) {
    return Qb.l(c, this, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.h = function(a) {
  return Qb.l(a, this, null);
};
h.c = function(a, b) {
  return Qb.l(a, this, b);
};
h.T = function() {
  return this.za;
};
h.W = function(a, b) {
  return new E(this.ua, this.name, this.Qa, this.nb, b);
};
h.N = function() {
  var a = this.nb;
  return null != a ? a : this.nb = a = cd(Yc(this.name), ad(this.ua));
};
h.Kb = function() {
  return this.name;
};
h.Lb = function() {
  return this.ua;
};
h.L = function(a, b) {
  return vc(b, this.Qa);
};
function ed() {
  var a = [z("reagent"), z(fd.c(gd, hd))].join("");
  return a instanceof E ? a : id(null, a);
}
function id(a, b) {
  var c = null != a ? [z(a), z("/"), z(b)].join("") : b;
  return new E(a, b, c, null, null);
}
function F(a) {
  if (null == a) {
    return null;
  }
  if (a && (a.A & 8388608 || a.bf)) {
    return a.Y(null);
  }
  if (rb(a) || "string" === typeof a) {
    return 0 === a.length ? null : new I(a, 0);
  }
  if (w(oc, a)) {
    return qc(a);
  }
  throw Error([z(a), z(" is not ISeqable")].join(""));
}
function J(a) {
  if (null == a) {
    return null;
  }
  if (a && (a.A & 64 || a.Mb)) {
    return a.ba(null);
  }
  a = F(a);
  return null == a ? null : Mb(a);
}
function jd(a) {
  return null != a ? a && (a.A & 64 || a.Mb) ? a.Ba(null) : (a = F(a)) ? Nb(a) : kd : kd;
}
function K(a) {
  return null == a ? null : a && (a.A & 128 || a.gc) ? a.va(null) : F(jd(a));
}
var L = function L() {
  switch(arguments.length) {
    case 1:
      return L.h(arguments[0]);
    case 2:
      return L.c(arguments[0], arguments[1]);
    default:
      return L.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
L.h = function() {
  return !0;
};
L.c = function(a, b) {
  return null == a ? null == b : a === b || mc(a, b);
};
L.v = function(a, b, c) {
  for (;;) {
    if (L.c(a, b)) {
      if (K(c)) {
        a = b, b = J(c), c = K(c);
      } else {
        return L.c(b, J(c));
      }
    } else {
      return !1;
    }
  }
};
L.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return L.v(b, a, c);
};
L.H = 2;
function ld(a) {
  this.s = a;
}
ld.prototype.next = function() {
  if (null != this.s) {
    var a = J(this.s);
    this.s = K(this.s);
    return {value:a, done:!1};
  }
  return {value:null, done:!0};
};
function md(a) {
  return new ld(F(a));
}
function nd(a, b) {
  var c = Vc(a), c = Wc(0, c);
  return Xc(c, b);
}
function od(a) {
  var b = 0, c = 1;
  for (a = F(a);;) {
    if (null != a) {
      b += 1, c = Uc(31, c) + bd(J(a)) | 0, a = K(a);
    } else {
      return nd(c, b);
    }
  }
}
var pd = nd(1, 0);
function qd(a) {
  var b = 0, c = 0;
  for (a = F(a);;) {
    if (null != a) {
      b += 1, c = c + bd(J(a)) | 0, a = K(a);
    } else {
      return nd(c, b);
    }
  }
}
var rd = nd(0, 0);
Eb["null"] = !0;
Gb["null"] = function() {
  return 0;
};
Date.prototype.I = function(a, b) {
  return b instanceof Date && this.valueOf() === b.valueOf();
};
Date.prototype.Gb = !0;
Date.prototype.eb = function(a, b) {
  if (b instanceof Date) {
    return cb(this.valueOf(), b.valueOf());
  }
  throw Error([z("Cannot compare "), z(this), z(" to "), z(b)].join(""));
};
mc.number = function(a, b) {
  return a === b;
};
Cb["function"] = !0;
fc["function"] = !0;
gc["function"] = function() {
  return null;
};
nc._ = function(a) {
  return ia(a);
};
function hd(a) {
  return a + 1;
}
function M(a) {
  return ec(a);
}
function sd(a, b) {
  var c = Gb(a);
  if (0 === c) {
    return b.B ? b.B() : b.call(null);
  }
  for (var d = C.c(a, 0), e = 1;;) {
    if (e < c) {
      var f = C.c(a, e), d = b.c ? b.c(d, f) : b.call(null, d, f), e = e + 1
    } else {
      return d;
    }
  }
}
function td(a, b, c) {
  var d = Gb(a), e = c;
  for (c = 0;;) {
    if (c < d) {
      var f = C.c(a, c), e = b.c ? b.c(e, f) : b.call(null, e, f);
      c += 1;
    } else {
      return e;
    }
  }
}
function ud(a, b) {
  var c = a.length;
  if (0 === a.length) {
    return b.B ? b.B() : b.call(null);
  }
  for (var d = a[0], e = 1;;) {
    if (e < c) {
      var f = a[e], d = b.c ? b.c(d, f) : b.call(null, d, f), e = e + 1
    } else {
      return d;
    }
  }
}
function vd(a, b, c) {
  var d = a.length, e = c;
  for (c = 0;;) {
    if (c < d) {
      var f = a[c], e = b.c ? b.c(e, f) : b.call(null, e, f);
      c += 1;
    } else {
      return e;
    }
  }
}
function wd(a, b, c, d) {
  for (var e = a.length;;) {
    if (d < e) {
      var f = a[d];
      c = b.c ? b.c(c, f) : b.call(null, c, f);
      d += 1;
    } else {
      return c;
    }
  }
}
function xd(a) {
  return a ? a.A & 2 || a.ee ? !0 : a.A ? !1 : w(Eb, a) : w(Eb, a);
}
function yd(a) {
  return a ? a.A & 16 || a.xd ? !0 : a.A ? !1 : w(Kb, a) : w(Kb, a);
}
function zd(a, b) {
  this.j = a;
  this.i = b;
}
zd.prototype.vc = function() {
  return this.i < this.j.length;
};
zd.prototype.next = function() {
  var a = this.j[this.i];
  this.i += 1;
  return a;
};
function I(a, b) {
  this.j = a;
  this.i = b;
  this.A = 166199550;
  this.J = 8192;
}
h = I.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.P = function(a, b) {
  var c = b + this.i;
  return c < this.j.length ? this.j[c] : null;
};
h.Ca = function(a, b, c) {
  a = b + this.i;
  return a < this.j.length ? this.j[a] : c;
};
h.Ib = function() {
  return new zd(this.j, this.i);
};
h.va = function() {
  return this.i + 1 < this.j.length ? new I(this.j, this.i + 1) : null;
};
h.$ = function() {
  var a = this.j.length - this.i;
  return 0 > a ? 0 : a;
};
h.hc = function() {
  var a = Gb(this);
  return 0 < a ? new Ad(this, a - 1, null) : null;
};
h.N = function() {
  return od(this);
};
h.I = function(a, b) {
  return Bd.c ? Bd.c(this, b) : Bd.call(null, this, b);
};
h.aa = function() {
  return kd;
};
h.ra = function(a, b) {
  return wd(this.j, b, this.j[this.i], this.i + 1);
};
h.sa = function(a, b, c) {
  return wd(this.j, b, c, this.i);
};
h.ba = function() {
  return this.j[this.i];
};
h.Ba = function() {
  return this.i + 1 < this.j.length ? new I(this.j, this.i + 1) : kd;
};
h.Y = function() {
  return this.i < this.j.length ? this : null;
};
h.X = function(a, b) {
  return N.c ? N.c(b, this) : N.call(null, b, this);
};
I.prototype[vb] = function() {
  return md(this);
};
function Cd(a, b) {
  return b < a.length ? new I(a, b) : null;
}
function O() {
  switch(arguments.length) {
    case 1:
      return Cd(arguments[0], 0);
    case 2:
      return Cd(arguments[0], arguments[1]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function Ad(a, b, c) {
  this.ec = a;
  this.i = b;
  this.meta = c;
  this.A = 32374990;
  this.J = 8192;
}
h = Ad.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.meta;
};
h.va = function() {
  return 0 < this.i ? new Ad(this.ec, this.i - 1, null) : null;
};
h.$ = function() {
  return this.i + 1;
};
h.N = function() {
  return od(this);
};
h.I = function(a, b) {
  return Bd.c ? Bd.c(this, b) : Bd.call(null, this, b);
};
h.aa = function() {
  var a = this.meta;
  return Dd.c ? Dd.c(kd, a) : Dd.call(null, kd, a);
};
h.ra = function(a, b) {
  return Ed ? Ed(b, this) : Fd.call(null, b, this);
};
h.sa = function(a, b, c) {
  return Gd ? Gd(b, c, this) : Fd.call(null, b, c, this);
};
h.ba = function() {
  return C.c(this.ec, this.i);
};
h.Ba = function() {
  return 0 < this.i ? new Ad(this.ec, this.i - 1, null) : kd;
};
h.Y = function() {
  return this;
};
h.W = function(a, b) {
  return new Ad(this.ec, this.i, b);
};
h.X = function(a, b) {
  return N.c ? N.c(b, this) : N.call(null, b, this);
};
Ad.prototype[vb] = function() {
  return md(this);
};
function Id(a) {
  return J(K(a));
}
function Jd(a) {
  return K(J(a));
}
function Kd(a) {
  for (;;) {
    var b = K(a);
    if (null != b) {
      a = b;
    } else {
      return J(a);
    }
  }
}
mc._ = function(a, b) {
  return a === b;
};
var Ld = function Ld() {
  switch(arguments.length) {
    case 0:
      return Ld.B();
    case 1:
      return Ld.h(arguments[0]);
    case 2:
      return Ld.c(arguments[0], arguments[1]);
    default:
      return Ld.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
Ld.B = function() {
  return Md;
};
Ld.h = function(a) {
  return a;
};
Ld.c = function(a, b) {
  return null != a ? Jb(a, b) : Jb(kd, b);
};
Ld.v = function(a, b, c) {
  for (;;) {
    if (v(c)) {
      a = Ld.c(a, b), b = J(c), c = K(c);
    } else {
      return Ld.c(a, b);
    }
  }
};
Ld.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return Ld.v(b, a, c);
};
Ld.H = 2;
function P(a) {
  if (null != a) {
    if (a && (a.A & 2 || a.ee)) {
      a = a.$(null);
    } else {
      if (rb(a)) {
        a = a.length;
      } else {
        if ("string" === typeof a) {
          a = a.length;
        } else {
          if (w(Eb, a)) {
            a = Gb(a);
          } else {
            a: {
              a = F(a);
              for (var b = 0;;) {
                if (xd(a)) {
                  a = b + Gb(a);
                  break a;
                }
                a = K(a);
                b += 1;
              }
            }
          }
        }
      }
    }
  } else {
    a = 0;
  }
  return a;
}
function Nd(a, b) {
  for (var c = null;;) {
    if (null == a) {
      return c;
    }
    if (0 === b) {
      return F(a) ? J(a) : c;
    }
    if (yd(a)) {
      return C.l(a, b, c);
    }
    if (F(a)) {
      var d = K(a), e = b - 1;
      a = d;
      b = e;
    } else {
      return c;
    }
  }
}
function Od(a, b) {
  if ("number" !== typeof b) {
    throw Error("index argument to nth must be a number");
  }
  if (null == a) {
    return a;
  }
  if (a && (a.A & 16 || a.xd)) {
    return a.P(null, b);
  }
  if (rb(a) || "string" === typeof a) {
    return b < a.length ? a[b] : null;
  }
  if (w(Kb, a)) {
    return C.c(a, b);
  }
  if (a ? a.A & 64 || a.Mb || (a.A ? 0 : w(Lb, a)) : w(Lb, a)) {
    var c;
    a: {
      c = a;
      for (var d = b;;) {
        if (null == c) {
          throw Error("Index out of bounds");
        }
        if (0 === d) {
          if (F(c)) {
            c = J(c);
            break a;
          }
          throw Error("Index out of bounds");
        }
        if (yd(c)) {
          c = C.c(c, d);
          break a;
        }
        if (F(c)) {
          c = K(c), --d;
        } else {
          throw Error("Index out of bounds");
        }
      }
    }
    return c;
  }
  throw Error([z("nth not supported on this type "), z(ub(tb(a)))].join(""));
}
function R(a, b) {
  if ("number" !== typeof b) {
    throw Error("index argument to nth must be a number.");
  }
  if (null == a) {
    return null;
  }
  if (a && (a.A & 16 || a.xd)) {
    return a.Ca(null, b, null);
  }
  if (rb(a) || "string" === typeof a) {
    return b < a.length ? a[b] : null;
  }
  if (w(Kb, a)) {
    return C.c(a, b);
  }
  if (a ? a.A & 64 || a.Mb || (a.A ? 0 : w(Lb, a)) : w(Lb, a)) {
    return Nd(a, b);
  }
  throw Error([z("nth not supported on this type "), z(ub(tb(a)))].join(""));
}
function S(a, b) {
  return null == a ? null : a && (a.A & 256 || a.yd) ? a.U(null, b) : rb(a) ? b < a.length ? a[b | 0] : null : "string" === typeof a ? b < a.length ? a[b | 0] : null : w(Pb, a) ? Qb.c(a, b) : null;
}
function Pd(a, b, c) {
  return null != a ? a && (a.A & 256 || a.yd) ? a.R(null, b, c) : rb(a) ? b < a.length ? a[b] : c : "string" === typeof a ? b < a.length ? a[b] : c : w(Pb, a) ? Qb.l(a, b, c) : c : c;
}
var T = function T() {
  switch(arguments.length) {
    case 3:
      return T.l(arguments[0], arguments[1], arguments[2]);
    default:
      return T.v(arguments[0], arguments[1], arguments[2], new I(Array.prototype.slice.call(arguments, 3), 0));
  }
};
T.l = function(a, b, c) {
  return null != a ? Sb(a, b, c) : Qd([b], [c]);
};
T.v = function(a, b, c, d) {
  for (;;) {
    if (a = T.l(a, b, c), v(d)) {
      b = J(d), c = Id(d), d = K(K(d));
    } else {
      return a;
    }
  }
};
T.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  var d = K(c), c = J(d), d = K(d);
  return T.v(b, a, c, d);
};
T.H = 3;
var Rd = function Rd() {
  switch(arguments.length) {
    case 1:
      return Rd.h(arguments[0]);
    case 2:
      return Rd.c(arguments[0], arguments[1]);
    default:
      return Rd.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
Rd.h = function(a) {
  return a;
};
Rd.c = function(a, b) {
  return null == a ? null : Ub(a, b);
};
Rd.v = function(a, b, c) {
  for (;;) {
    if (null == a) {
      return null;
    }
    a = Rd.c(a, b);
    if (v(c)) {
      b = J(c), c = K(c);
    } else {
      return a;
    }
  }
};
Rd.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return Rd.v(b, a, c);
};
Rd.H = 2;
function Sd(a) {
  var b = "function" == n(a);
  return v(b) ? b : a ? v(v(null) ? null : a.de) ? !0 : a.cd ? !1 : w(Cb, a) : w(Cb, a);
}
function Td(a, b) {
  this.m = a;
  this.meta = b;
  this.A = 393217;
  this.J = 0;
}
h = Td.prototype;
h.T = function() {
  return this.meta;
};
h.W = function(a, b) {
  return new Td(this.m, b);
};
h.de = !0;
h.call = function() {
  function a(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, D, Q, ea) {
    a = this.m;
    return Ud.Hb ? Ud.Hb(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, D, Q, ea) : Ud.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, D, Q, ea);
  }
  function b(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, D, Q) {
    a = this;
    return a.m.na ? a.m.na(b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, D, Q) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, D, Q);
  }
  function c(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, D) {
    a = this;
    return a.m.ma ? a.m.ma(b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, D) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, D);
  }
  function d(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H) {
    a = this;
    return a.m.la ? a.m.la(b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H);
  }
  function e(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G) {
    a = this;
    return a.m.ka ? a.m.ka(b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G);
  }
  function f(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B) {
    a = this;
    return a.m.ja ? a.m.ja(b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B);
  }
  function g(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A) {
    a = this;
    return a.m.ia ? a.m.ia(b, c, d, e, f, g, k, l, p, m, q, r, t, y, A) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A);
  }
  function k(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y) {
    a = this;
    return a.m.ha ? a.m.ha(b, c, d, e, f, g, k, l, p, m, q, r, t, y) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q, r, t, y);
  }
  function l(a, b, c, d, e, f, g, k, l, p, m, q, r, t) {
    a = this;
    return a.m.ga ? a.m.ga(b, c, d, e, f, g, k, l, p, m, q, r, t) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q, r, t);
  }
  function p(a, b, c, d, e, f, g, k, l, p, m, q, r) {
    a = this;
    return a.m.fa ? a.m.fa(b, c, d, e, f, g, k, l, p, m, q, r) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q, r);
  }
  function m(a, b, c, d, e, f, g, k, l, p, m, q) {
    a = this;
    return a.m.ea ? a.m.ea(b, c, d, e, f, g, k, l, p, m, q) : a.m.call(null, b, c, d, e, f, g, k, l, p, m, q);
  }
  function q(a, b, c, d, e, f, g, k, l, p, m) {
    a = this;
    return a.m.da ? a.m.da(b, c, d, e, f, g, k, l, p, m) : a.m.call(null, b, c, d, e, f, g, k, l, p, m);
  }
  function r(a, b, c, d, e, f, g, k, l, p) {
    a = this;
    return a.m.qa ? a.m.qa(b, c, d, e, f, g, k, l, p) : a.m.call(null, b, c, d, e, f, g, k, l, p);
  }
  function t(a, b, c, d, e, f, g, k, l) {
    a = this;
    return a.m.pa ? a.m.pa(b, c, d, e, f, g, k, l) : a.m.call(null, b, c, d, e, f, g, k, l);
  }
  function y(a, b, c, d, e, f, g, k) {
    a = this;
    return a.m.oa ? a.m.oa(b, c, d, e, f, g, k) : a.m.call(null, b, c, d, e, f, g, k);
  }
  function A(a, b, c, d, e, f, g) {
    a = this;
    return a.m.S ? a.m.S(b, c, d, e, f, g) : a.m.call(null, b, c, d, e, f, g);
  }
  function B(a, b, c, d, e, f) {
    a = this;
    return a.m.K ? a.m.K(b, c, d, e, f) : a.m.call(null, b, c, d, e, f);
  }
  function G(a, b, c, d, e) {
    a = this;
    return a.m.C ? a.m.C(b, c, d, e) : a.m.call(null, b, c, d, e);
  }
  function H(a, b, c, d) {
    a = this;
    return a.m.l ? a.m.l(b, c, d) : a.m.call(null, b, c, d);
  }
  function Q(a, b, c) {
    a = this;
    return a.m.c ? a.m.c(b, c) : a.m.call(null, b, c);
  }
  function ea(a, b) {
    a = this;
    return a.m.h ? a.m.h(b) : a.m.call(null, b);
  }
  function va(a) {
    a = this;
    return a.m.B ? a.m.B() : a.m.call(null);
  }
  var D = null, D = function(Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa, eb, ob, Fb, dc, Dc, Hd, ff, Qh) {
    switch(arguments.length) {
      case 1:
        return va.call(this, Ma);
      case 2:
        return ea.call(this, Ma, da);
      case 3:
        return Q.call(this, Ma, da, fa);
      case 4:
        return H.call(this, Ma, da, fa, ja);
      case 5:
        return G.call(this, Ma, da, fa, ja, la);
      case 6:
        return B.call(this, Ma, da, fa, ja, la, ma);
      case 7:
        return A.call(this, Ma, da, fa, ja, la, ma, pa);
      case 8:
        return y.call(this, Ma, da, fa, ja, la, ma, pa, ua);
      case 9:
        return t.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa);
      case 10:
        return r.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za);
      case 11:
        return q.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da);
      case 12:
        return m.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja);
      case 13:
        return p.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D);
      case 14:
        return l.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa);
      case 15:
        return k.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa, eb);
      case 16:
        return g.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa, eb, ob);
      case 17:
        return f.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa, eb, ob, Fb);
      case 18:
        return e.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa, eb, ob, Fb, dc);
      case 19:
        return d.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa, eb, ob, Fb, dc, Dc);
      case 20:
        return c.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa, eb, ob, Fb, dc, Dc, Hd);
      case 21:
        return b.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa, eb, ob, Fb, dc, Dc, Hd, ff);
      case 22:
        return a.call(this, Ma, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, D, Wa, eb, ob, Fb, dc, Dc, Hd, ff, Qh);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  D.h = va;
  D.c = ea;
  D.l = Q;
  D.C = H;
  D.K = G;
  D.S = B;
  D.oa = A;
  D.pa = y;
  D.qa = t;
  D.da = r;
  D.ea = q;
  D.fa = m;
  D.ga = p;
  D.ha = l;
  D.ia = k;
  D.ja = g;
  D.ka = f;
  D.la = e;
  D.ma = d;
  D.na = c;
  D.Tc = b;
  D.Hb = a;
  return D;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.B = function() {
  return this.m.B ? this.m.B() : this.m.call(null);
};
h.h = function(a) {
  return this.m.h ? this.m.h(a) : this.m.call(null, a);
};
h.c = function(a, b) {
  return this.m.c ? this.m.c(a, b) : this.m.call(null, a, b);
};
h.l = function(a, b, c) {
  return this.m.l ? this.m.l(a, b, c) : this.m.call(null, a, b, c);
};
h.C = function(a, b, c, d) {
  return this.m.C ? this.m.C(a, b, c, d) : this.m.call(null, a, b, c, d);
};
h.K = function(a, b, c, d, e) {
  return this.m.K ? this.m.K(a, b, c, d, e) : this.m.call(null, a, b, c, d, e);
};
h.S = function(a, b, c, d, e, f) {
  return this.m.S ? this.m.S(a, b, c, d, e, f) : this.m.call(null, a, b, c, d, e, f);
};
h.oa = function(a, b, c, d, e, f, g) {
  return this.m.oa ? this.m.oa(a, b, c, d, e, f, g) : this.m.call(null, a, b, c, d, e, f, g);
};
h.pa = function(a, b, c, d, e, f, g, k) {
  return this.m.pa ? this.m.pa(a, b, c, d, e, f, g, k) : this.m.call(null, a, b, c, d, e, f, g, k);
};
h.qa = function(a, b, c, d, e, f, g, k, l) {
  return this.m.qa ? this.m.qa(a, b, c, d, e, f, g, k, l) : this.m.call(null, a, b, c, d, e, f, g, k, l);
};
h.da = function(a, b, c, d, e, f, g, k, l, p) {
  return this.m.da ? this.m.da(a, b, c, d, e, f, g, k, l, p) : this.m.call(null, a, b, c, d, e, f, g, k, l, p);
};
h.ea = function(a, b, c, d, e, f, g, k, l, p, m) {
  return this.m.ea ? this.m.ea(a, b, c, d, e, f, g, k, l, p, m) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m);
};
h.fa = function(a, b, c, d, e, f, g, k, l, p, m, q) {
  return this.m.fa ? this.m.fa(a, b, c, d, e, f, g, k, l, p, m, q) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m, q);
};
h.ga = function(a, b, c, d, e, f, g, k, l, p, m, q, r) {
  return this.m.ga ? this.m.ga(a, b, c, d, e, f, g, k, l, p, m, q, r) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r);
};
h.ha = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t) {
  return this.m.ha ? this.m.ha(a, b, c, d, e, f, g, k, l, p, m, q, r, t) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t);
};
h.ia = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y) {
  return this.m.ia ? this.m.ia(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y);
};
h.ja = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A) {
  return this.m.ja ? this.m.ja(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A);
};
h.ka = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B) {
  return this.m.ka ? this.m.ka(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B);
};
h.la = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G) {
  return this.m.la ? this.m.la(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G);
};
h.ma = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H) {
  return this.m.ma ? this.m.ma(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H);
};
h.na = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q) {
  return this.m.na ? this.m.na(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q) : this.m.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q);
};
h.Tc = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea) {
  var va = this.m;
  return Ud.Hb ? Ud.Hb(va, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea) : Ud.call(null, va, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea);
};
function Dd(a, b) {
  return Sd(a) && !(a ? a.A & 262144 || a.ff || (a.A ? 0 : w(hc, a)) : w(hc, a)) ? new Td(a, b) : null == a ? null : ic(a, b);
}
function Vd(a) {
  var b = null != a;
  return (b ? a ? a.A & 131072 || a.le || (a.A ? 0 : w(fc, a)) : w(fc, a) : b) ? gc(a) : null;
}
var Wd = function Wd() {
  switch(arguments.length) {
    case 1:
      return Wd.h(arguments[0]);
    case 2:
      return Wd.c(arguments[0], arguments[1]);
    default:
      return Wd.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
Wd.h = function(a) {
  return a;
};
Wd.c = function(a, b) {
  return null == a ? null : Zb(a, b);
};
Wd.v = function(a, b, c) {
  for (;;) {
    if (null == a) {
      return null;
    }
    a = Wd.c(a, b);
    if (v(c)) {
      b = J(c), c = K(c);
    } else {
      return a;
    }
  }
};
Wd.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return Wd.v(b, a, c);
};
Wd.H = 2;
function Xd(a) {
  return null == a || sb(F(a));
}
function Yd(a) {
  return null == a ? !1 : a ? a.A & 8 || a.We ? !0 : a.A ? !1 : w(Ib, a) : w(Ib, a);
}
function Zd(a) {
  return null == a ? !1 : a ? a.A & 4096 || a.df ? !0 : a.A ? !1 : w(Yb, a) : w(Yb, a);
}
function $d(a) {
  return a ? a.A & 16777216 || a.cf ? !0 : a.A ? !1 : w(rc, a) : w(rc, a);
}
function ae(a) {
  return null == a ? !1 : a ? a.A & 1024 || a.je ? !0 : a.A ? !1 : w(Tb, a) : w(Tb, a);
}
function be(a) {
  return a ? a.A & 16384 || a.ef ? !0 : a.A ? !1 : w(bc, a) : w(bc, a);
}
function ce(a) {
  return a ? a.J & 512 || a.Ve ? !0 : !1 : !1;
}
function de(a) {
  var b = [];
  Qa(a, function(a, b) {
    return function(a, c) {
      return b.push(c);
    };
  }(a, b));
  return b;
}
function ee(a, b, c, d, e) {
  for (;0 !== e;) {
    c[d] = a[b], d += 1, --e, b += 1;
  }
}
var fe = {};
function ge(a) {
  return !1 === a;
}
function he(a) {
  return null == a ? !1 : a ? a.A & 64 || a.Mb ? !0 : a.A ? !1 : w(Lb, a) : w(Lb, a);
}
function ie(a) {
  return v(a) ? !0 : !1;
}
function je(a) {
  var b = Sd(a);
  return b ? b : a ? a.A & 1 || a.Ye ? !0 : a.A ? !1 : w(Db, a) : w(Db, a);
}
function ke(a, b) {
  return Pd(a, b, fe) === fe ? !1 : !0;
}
function le(a, b) {
  if (a === b) {
    return 0;
  }
  if (null == a) {
    return -1;
  }
  if (null == b) {
    return 1;
  }
  if ("number" === typeof a) {
    if ("number" === typeof b) {
      return cb(a, b);
    }
    throw Error([z("Cannot compare "), z(a), z(" to "), z(b)].join(""));
  }
  if (a ? a.J & 2048 || a.Gb || (a.J ? 0 : w(Hc, a)) : w(Hc, a)) {
    return Ic(a, b);
  }
  if ("string" !== typeof a && !rb(a) && !0 !== a && !1 !== a || tb(a) !== tb(b)) {
    throw Error([z("Cannot compare "), z(a), z(" to "), z(b)].join(""));
  }
  return cb(a, b);
}
function me(a, b) {
  var c = P(a), d = P(b);
  if (c < d) {
    c = -1;
  } else {
    if (c > d) {
      c = 1;
    } else {
      if (0 === c) {
        c = 0;
      } else {
        a: {
          for (d = 0;;) {
            var e = le(Od(a, d), Od(b, d));
            if (0 === e && d + 1 < c) {
              d += 1;
            } else {
              c = e;
              break a;
            }
          }
        }
      }
    }
  }
  return c;
}
function ne(a) {
  return L.c(a, le) ? le : function(b, c) {
    var d = a.c ? a.c(b, c) : a.call(null, b, c);
    return "number" === typeof d ? d : v(d) ? -1 : v(a.c ? a.c(c, b) : a.call(null, c, b)) ? 1 : 0;
  };
}
function oe(a, b) {
  if (F(b)) {
    var c = pe.h ? pe.h(b) : pe.call(null, b), d = ne(a);
    db(c, d);
    return F(c);
  }
  return kd;
}
function qe(a, b) {
  return re(a, b);
}
function re(a, b) {
  return oe(function(b, d) {
    return ne(le).call(null, a.h ? a.h(b) : a.call(null, b), a.h ? a.h(d) : a.call(null, d));
  }, b);
}
function Fd() {
  switch(arguments.length) {
    case 2:
      return Ed(arguments[0], arguments[1]);
    case 3:
      return Gd(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function Ed(a, b) {
  var c = F(b);
  if (c) {
    var d = J(c), c = K(c);
    return Ab ? Ab(a, d, c) : Bb.call(null, a, d, c);
  }
  return a.B ? a.B() : a.call(null);
}
function Gd(a, b, c) {
  for (c = F(c);;) {
    if (c) {
      var d = J(c);
      b = a.c ? a.c(b, d) : a.call(null, b, d);
      c = K(c);
    } else {
      return b;
    }
  }
}
function Bb() {
  switch(arguments.length) {
    case 2:
      return se(arguments[0], arguments[1]);
    case 3:
      return Ab(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function se(a, b) {
  return b && (b.A & 524288 || b.me) ? b.ra(null, a) : rb(b) ? ud(b, a) : "string" === typeof b ? ud(b, a) : w(jc, b) ? kc.c(b, a) : Ed(a, b);
}
function Ab(a, b, c) {
  return c && (c.A & 524288 || c.me) ? c.sa(null, a, b) : rb(c) ? vd(c, a, b) : "string" === typeof c ? vd(c, a, b) : w(jc, c) ? kc.l(c, a, b) : Gd(a, b, c);
}
function te(a, b, c) {
  return null != c ? lc(c, a, b) : b;
}
function ue(a) {
  return a;
}
function ve(a, b, c, d) {
  a = a.h ? a.h(b) : a.call(null, b);
  c = Ab(a, c, d);
  return a.h ? a.h(c) : a.call(null, c);
}
var we = function we() {
  switch(arguments.length) {
    case 0:
      return we.B();
    case 1:
      return we.h(arguments[0]);
    case 2:
      return we.c(arguments[0], arguments[1]);
    default:
      return we.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
we.B = function() {
  return 0;
};
we.h = function(a) {
  return a;
};
we.c = function(a, b) {
  return a + b;
};
we.v = function(a, b, c) {
  return Ab(we, a + b, c);
};
we.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return we.v(b, a, c);
};
we.H = 2;
function xe(a) {
  return a - 1;
}
function ye(a, b) {
  return (a % b + b) % b;
}
function ze(a) {
  a = (a - a % 2) / 2;
  return 0 <= a ? Math.floor(a) : Math.ceil(a);
}
function Ae(a) {
  a -= a >> 1 & 1431655765;
  a = (a & 858993459) + (a >> 2 & 858993459);
  return 16843009 * (a + (a >> 4) & 252645135) >> 24;
}
function Be(a) {
  var b = 1;
  for (a = F(a);;) {
    if (a && 0 < b) {
      --b, a = K(a);
    } else {
      return a;
    }
  }
}
var z = function z() {
  switch(arguments.length) {
    case 0:
      return z.B();
    case 1:
      return z.h(arguments[0]);
    default:
      return z.v(arguments[0], new I(Array.prototype.slice.call(arguments, 1), 0));
  }
};
z.B = function() {
  return "";
};
z.h = function(a) {
  return null == a ? "" : Oa(a);
};
z.v = function(a, b) {
  for (var c = new Ua("" + z(a)), d = b;;) {
    if (v(d)) {
      c = c.append("" + z(J(d))), d = K(d);
    } else {
      return c.toString();
    }
  }
};
z.D = function(a) {
  var b = J(a);
  a = K(a);
  return z.v(b, a);
};
z.H = 1;
function Ce(a, b) {
  return a.substring(b);
}
function Bd(a, b) {
  var c;
  if ($d(b)) {
    if (xd(a) && xd(b) && P(a) !== P(b)) {
      c = !1;
    } else {
      a: {
        c = F(a);
        for (var d = F(b);;) {
          if (null == c) {
            c = null == d;
            break a;
          }
          if (null != d && L.c(J(c), J(d))) {
            c = K(c), d = K(d);
          } else {
            c = !1;
            break a;
          }
        }
      }
    }
  } else {
    c = null;
  }
  return ie(c);
}
function De(a, b, c, d, e) {
  this.meta = a;
  this.first = b;
  this.Va = c;
  this.count = d;
  this.G = e;
  this.A = 65937646;
  this.J = 8192;
}
h = De.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.meta;
};
h.va = function() {
  return 1 === this.count ? null : this.Va;
};
h.$ = function() {
  return this.count;
};
h.Nb = function() {
  return this.first;
};
h.Ob = function() {
  return Nb(this);
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return ic(kd, this.meta);
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.ba = function() {
  return this.first;
};
h.Ba = function() {
  return 1 === this.count ? kd : this.Va;
};
h.Y = function() {
  return this;
};
h.W = function(a, b) {
  return new De(b, this.first, this.Va, this.count, this.G);
};
h.X = function(a, b) {
  return new De(this.meta, b, this, this.count + 1, null);
};
De.prototype[vb] = function() {
  return md(this);
};
function Ee(a) {
  this.meta = a;
  this.A = 65937614;
  this.J = 8192;
}
h = Ee.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.meta;
};
h.va = function() {
  return null;
};
h.$ = function() {
  return 0;
};
h.Nb = function() {
  return null;
};
h.Ob = function() {
  throw Error("Can't pop empty list");
};
h.N = function() {
  return pd;
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return this;
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.ba = function() {
  return null;
};
h.Ba = function() {
  return kd;
};
h.Y = function() {
  return null;
};
h.W = function(a, b) {
  return new Ee(b);
};
h.X = function(a, b) {
  return new De(this.meta, b, null, 1, null);
};
var kd = new Ee(null);
Ee.prototype[vb] = function() {
  return md(this);
};
function Fe(a) {
  return (a ? a.A & 134217728 || a.af || (a.A ? 0 : w(tc, a)) : w(tc, a)) ? uc(a) : Ab(Ld, kd, a);
}
function Ge() {
  a: {
    var a = 0 < arguments.length ? new I(Array.prototype.slice.call(arguments, 0), 0) : null, b;
    if (a instanceof I && 0 === a.i) {
      b = a.j;
    } else {
      b: {
        for (b = [];;) {
          if (null != a) {
            b.push(a.ba(null)), a = a.va(null);
          } else {
            break b;
          }
        }
      }
    }
    for (var a = b.length, c = kd;;) {
      if (0 < a) {
        var d = a - 1, c = c.X(null, b[a - 1]), a = d
      } else {
        break a;
      }
    }
  }
  return c;
}
function He(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.Va = c;
  this.G = d;
  this.A = 65929452;
  this.J = 8192;
}
h = He.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.meta;
};
h.va = function() {
  return null == this.Va ? null : F(this.Va);
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(kd, this.meta);
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.ba = function() {
  return this.first;
};
h.Ba = function() {
  return null == this.Va ? kd : this.Va;
};
h.Y = function() {
  return this;
};
h.W = function(a, b) {
  return new He(b, this.first, this.Va, this.G);
};
h.X = function(a, b) {
  return new He(null, b, this, this.G);
};
He.prototype[vb] = function() {
  return md(this);
};
function N(a, b) {
  var c = null == b;
  return (c ? c : b && (b.A & 64 || b.Mb)) ? new He(null, a, b, null) : new He(null, a, F(b), null);
}
function Ie(a, b) {
  if (a.Ma === b.Ma) {
    return 0;
  }
  var c = sb(a.ua);
  if (v(c ? b.ua : c)) {
    return -1;
  }
  if (v(a.ua)) {
    if (sb(b.ua)) {
      return 1;
    }
    c = cb(a.ua, b.ua);
    return 0 === c ? cb(a.name, b.name) : c;
  }
  return cb(a.name, b.name);
}
function U(a, b, c, d) {
  this.ua = a;
  this.name = b;
  this.Ma = c;
  this.nb = d;
  this.A = 2153775105;
  this.J = 4096;
}
h = U.prototype;
h.toString = function() {
  return [z(":"), z(this.Ma)].join("");
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.I = function(a, b) {
  return b instanceof U ? this.Ma === b.Ma : !1;
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return S(c, this);
      case 3:
        return Pd(c, this, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.c = function(a, c) {
    return S(c, this);
  };
  a.l = function(a, c, d) {
    return Pd(c, this, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.h = function(a) {
  return S(a, this);
};
h.c = function(a, b) {
  return Pd(a, this, b);
};
h.N = function() {
  var a = this.nb;
  return null != a ? a : this.nb = a = cd(Yc(this.name), ad(this.ua)) + 2654435769 | 0;
};
h.Kb = function() {
  return this.name;
};
h.Lb = function() {
  return this.ua;
};
h.L = function(a, b) {
  return vc(b, [z(":"), z(this.Ma)].join(""));
};
var Je = function Je() {
  switch(arguments.length) {
    case 1:
      return Je.h(arguments[0]);
    case 2:
      return Je.c(arguments[0], arguments[1]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
};
Je.h = function(a) {
  if (a instanceof U) {
    return a;
  }
  if (a instanceof E) {
    var b;
    if (a && (a.J & 4096 || a.zd)) {
      b = a.Lb(null);
    } else {
      throw Error([z("Doesn't support namespace: "), z(a)].join(""));
    }
    return new U(b, Ke.h ? Ke.h(a) : Ke.call(null, a), a.Qa, null);
  }
  return "string" === typeof a ? (b = a.split("/"), 2 === b.length ? new U(b[0], b[1], a, null) : new U(null, b[0], a, null)) : null;
};
Je.c = function(a, b) {
  return new U(a, b, [z(v(a) ? [z(a), z("/")].join("") : null), z(b)].join(""), null);
};
Je.H = 2;
function Le(a, b, c, d) {
  this.meta = a;
  this.ub = b;
  this.s = c;
  this.G = d;
  this.A = 32374988;
  this.J = 0;
}
h = Le.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
function Me(a) {
  null != a.ub && (a.s = a.ub.B ? a.ub.B() : a.ub.call(null), a.ub = null);
  return a.s;
}
h.T = function() {
  return this.meta;
};
h.va = function() {
  qc(this);
  return null == this.s ? null : K(this.s);
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(kd, this.meta);
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.ba = function() {
  qc(this);
  return null == this.s ? null : J(this.s);
};
h.Ba = function() {
  qc(this);
  return null != this.s ? jd(this.s) : kd;
};
h.Y = function() {
  Me(this);
  if (null == this.s) {
    return null;
  }
  for (var a = this.s;;) {
    if (a instanceof Le) {
      a = Me(a);
    } else {
      return this.s = a, F(this.s);
    }
  }
};
h.W = function(a, b) {
  return new Le(b, this.ub, this.s, this.G);
};
h.X = function(a, b) {
  return N(b, this);
};
Le.prototype[vb] = function() {
  return md(this);
};
function Ne(a, b) {
  this.Oc = a;
  this.end = b;
  this.A = 2;
  this.J = 0;
}
Ne.prototype.add = function(a) {
  this.Oc[this.end] = a;
  return this.end += 1;
};
Ne.prototype.Aa = function() {
  var a = new Oe(this.Oc, 0, this.end);
  this.Oc = null;
  return a;
};
Ne.prototype.$ = function() {
  return this.end;
};
function Pe(a) {
  return new Ne(Array(a), 0);
}
function Oe(a, b, c) {
  this.j = a;
  this.ta = b;
  this.end = c;
  this.A = 524306;
  this.J = 0;
}
h = Oe.prototype;
h.$ = function() {
  return this.end - this.ta;
};
h.P = function(a, b) {
  return this.j[this.ta + b];
};
h.Ca = function(a, b, c) {
  return 0 <= b && b < this.end - this.ta ? this.j[this.ta + b] : c;
};
h.wd = function() {
  if (this.ta === this.end) {
    throw Error("-drop-first of empty chunk");
  }
  return new Oe(this.j, this.ta + 1, this.end);
};
h.ra = function(a, b) {
  return wd(this.j, b, this.j[this.ta], this.ta + 1);
};
h.sa = function(a, b, c) {
  return wd(this.j, b, c, this.ta);
};
function Qe(a, b, c, d) {
  this.Aa = a;
  this.Pa = b;
  this.meta = c;
  this.G = d;
  this.A = 31850732;
  this.J = 1536;
}
h = Qe.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.meta;
};
h.va = function() {
  if (1 < Gb(this.Aa)) {
    return new Qe(Jc(this.Aa), this.Pa, this.meta, null);
  }
  var a = qc(this.Pa);
  return null == a ? null : a;
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(kd, this.meta);
};
h.ba = function() {
  return C.c(this.Aa, 0);
};
h.Ba = function() {
  return 1 < Gb(this.Aa) ? new Qe(Jc(this.Aa), this.Pa, this.meta, null) : null == this.Pa ? kd : this.Pa;
};
h.Y = function() {
  return this;
};
h.Rc = function() {
  return this.Aa;
};
h.Sc = function() {
  return null == this.Pa ? kd : this.Pa;
};
h.W = function(a, b) {
  return new Qe(this.Aa, this.Pa, b, this.G);
};
h.X = function(a, b) {
  return N(b, this);
};
h.Qc = function() {
  return null == this.Pa ? null : this.Pa;
};
Qe.prototype[vb] = function() {
  return md(this);
};
function Re(a, b) {
  return 0 === Gb(a) ? b : new Qe(a, b, null, null);
}
function Se(a, b) {
  a.add(b);
}
function pe(a) {
  for (var b = [];;) {
    if (F(a)) {
      b.push(J(a)), a = K(a);
    } else {
      return b;
    }
  }
}
function Te(a, b) {
  if (xd(a)) {
    return P(a);
  }
  for (var c = a, d = b, e = 0;;) {
    if (0 < d && F(c)) {
      c = K(c), --d, e += 1;
    } else {
      return e;
    }
  }
}
var Ue = function Ue(b) {
  return null == b ? null : null == K(b) ? F(J(b)) : N(J(b), Ue(K(b)));
}, Ve = function Ve() {
  switch(arguments.length) {
    case 0:
      return Ve.B();
    case 1:
      return Ve.h(arguments[0]);
    case 2:
      return Ve.c(arguments[0], arguments[1]);
    default:
      return Ve.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
Ve.B = function() {
  return new Le(null, function() {
    return null;
  }, null, null);
};
Ve.h = function(a) {
  return new Le(null, function() {
    return a;
  }, null, null);
};
Ve.c = function(a, b) {
  return new Le(null, function() {
    var c = F(a);
    return c ? ce(c) ? Re(Kc(c), Ve.c(Lc(c), b)) : N(J(c), Ve.c(jd(c), b)) : b;
  }, null, null);
};
Ve.v = function(a, b, c) {
  return function e(a, b) {
    return new Le(null, function() {
      var c = F(a);
      return c ? ce(c) ? Re(Kc(c), e(Lc(c), b)) : N(J(c), e(jd(c), b)) : v(b) ? e(J(b), K(b)) : null;
    }, null, null);
  }(Ve.c(a, b), c);
};
Ve.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return Ve.v(b, a, c);
};
Ve.H = 2;
var We = function We() {
  switch(arguments.length) {
    case 0:
      return We.B();
    case 1:
      return We.h(arguments[0]);
    case 2:
      return We.c(arguments[0], arguments[1]);
    default:
      return We.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
We.B = function() {
  return Bc(Md);
};
We.h = function(a) {
  return a;
};
We.c = function(a, b) {
  return Cc(a, b);
};
We.v = function(a, b, c) {
  for (;;) {
    if (a = Cc(a, b), v(c)) {
      b = J(c), c = K(c);
    } else {
      return a;
    }
  }
};
We.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return We.v(b, a, c);
};
We.H = 2;
function Xe(a, b, c) {
  var d = F(c);
  if (0 === b) {
    return a.B ? a.B() : a.call(null);
  }
  c = Mb(d);
  var e = Nb(d);
  if (1 === b) {
    return a.h ? a.h(c) : a.h ? a.h(c) : a.call(null, c);
  }
  var d = Mb(e), f = Nb(e);
  if (2 === b) {
    return a.c ? a.c(c, d) : a.c ? a.c(c, d) : a.call(null, c, d);
  }
  var e = Mb(f), g = Nb(f);
  if (3 === b) {
    return a.l ? a.l(c, d, e) : a.l ? a.l(c, d, e) : a.call(null, c, d, e);
  }
  var f = Mb(g), k = Nb(g);
  if (4 === b) {
    return a.C ? a.C(c, d, e, f) : a.C ? a.C(c, d, e, f) : a.call(null, c, d, e, f);
  }
  var g = Mb(k), l = Nb(k);
  if (5 === b) {
    return a.K ? a.K(c, d, e, f, g) : a.K ? a.K(c, d, e, f, g) : a.call(null, c, d, e, f, g);
  }
  var k = Mb(l), p = Nb(l);
  if (6 === b) {
    return a.S ? a.S(c, d, e, f, g, k) : a.S ? a.S(c, d, e, f, g, k) : a.call(null, c, d, e, f, g, k);
  }
  var l = Mb(p), m = Nb(p);
  if (7 === b) {
    return a.oa ? a.oa(c, d, e, f, g, k, l) : a.oa ? a.oa(c, d, e, f, g, k, l) : a.call(null, c, d, e, f, g, k, l);
  }
  var p = Mb(m), q = Nb(m);
  if (8 === b) {
    return a.pa ? a.pa(c, d, e, f, g, k, l, p) : a.pa ? a.pa(c, d, e, f, g, k, l, p) : a.call(null, c, d, e, f, g, k, l, p);
  }
  var m = Mb(q), r = Nb(q);
  if (9 === b) {
    return a.qa ? a.qa(c, d, e, f, g, k, l, p, m) : a.qa ? a.qa(c, d, e, f, g, k, l, p, m) : a.call(null, c, d, e, f, g, k, l, p, m);
  }
  var q = Mb(r), t = Nb(r);
  if (10 === b) {
    return a.da ? a.da(c, d, e, f, g, k, l, p, m, q) : a.da ? a.da(c, d, e, f, g, k, l, p, m, q) : a.call(null, c, d, e, f, g, k, l, p, m, q);
  }
  var r = Mb(t), y = Nb(t);
  if (11 === b) {
    return a.ea ? a.ea(c, d, e, f, g, k, l, p, m, q, r) : a.ea ? a.ea(c, d, e, f, g, k, l, p, m, q, r) : a.call(null, c, d, e, f, g, k, l, p, m, q, r);
  }
  var t = Mb(y), A = Nb(y);
  if (12 === b) {
    return a.fa ? a.fa(c, d, e, f, g, k, l, p, m, q, r, t) : a.fa ? a.fa(c, d, e, f, g, k, l, p, m, q, r, t) : a.call(null, c, d, e, f, g, k, l, p, m, q, r, t);
  }
  var y = Mb(A), B = Nb(A);
  if (13 === b) {
    return a.ga ? a.ga(c, d, e, f, g, k, l, p, m, q, r, t, y) : a.ga ? a.ga(c, d, e, f, g, k, l, p, m, q, r, t, y) : a.call(null, c, d, e, f, g, k, l, p, m, q, r, t, y);
  }
  var A = Mb(B), G = Nb(B);
  if (14 === b) {
    return a.ha ? a.ha(c, d, e, f, g, k, l, p, m, q, r, t, y, A) : a.ha ? a.ha(c, d, e, f, g, k, l, p, m, q, r, t, y, A) : a.call(null, c, d, e, f, g, k, l, p, m, q, r, t, y, A);
  }
  var B = Mb(G), H = Nb(G);
  if (15 === b) {
    return a.ia ? a.ia(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B) : a.ia ? a.ia(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B) : a.call(null, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B);
  }
  var G = Mb(H), Q = Nb(H);
  if (16 === b) {
    return a.ja ? a.ja(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G) : a.ja ? a.ja(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G) : a.call(null, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G);
  }
  var H = Mb(Q), ea = Nb(Q);
  if (17 === b) {
    return a.ka ? a.ka(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H) : a.ka ? a.ka(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H) : a.call(null, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H);
  }
  var Q = Mb(ea), va = Nb(ea);
  if (18 === b) {
    return a.la ? a.la(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q) : a.la ? a.la(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q) : a.call(null, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q);
  }
  ea = Mb(va);
  va = Nb(va);
  if (19 === b) {
    return a.ma ? a.ma(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea) : a.ma ? a.ma(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea) : a.call(null, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea);
  }
  var D = Mb(va);
  Nb(va);
  if (20 === b) {
    return a.na ? a.na(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea, D) : a.na ? a.na(c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea, D) : a.call(null, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea, D);
  }
  throw Error("Only up to 20 arguments supported on functions");
}
function Ud() {
  switch(arguments.length) {
    case 2:
      return Ye(arguments[0], arguments[1]);
    case 3:
      return Ze(arguments[0], arguments[1], arguments[2]);
    case 4:
      return $e(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5:
      return af(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    default:
      return bf(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], new I(Array.prototype.slice.call(arguments, 5), 0));
  }
}
function Ye(a, b) {
  var c = a.H;
  if (a.D) {
    var d = Te(b, c + 1);
    return d <= c ? Xe(a, d, b) : a.D(b);
  }
  return a.apply(a, pe(b));
}
function Ze(a, b, c) {
  b = N(b, c);
  c = a.H;
  if (a.D) {
    var d = Te(b, c + 1);
    return d <= c ? Xe(a, d, b) : a.D(b);
  }
  return a.apply(a, pe(b));
}
function $e(a, b, c, d) {
  b = N(b, N(c, d));
  c = a.H;
  return a.D ? (d = Te(b, c + 1), d <= c ? Xe(a, d, b) : a.D(b)) : a.apply(a, pe(b));
}
function af(a, b, c, d, e) {
  b = N(b, N(c, N(d, e)));
  c = a.H;
  return a.D ? (d = Te(b, c + 1), d <= c ? Xe(a, d, b) : a.D(b)) : a.apply(a, pe(b));
}
function bf(a, b, c, d, e, f) {
  b = N(b, N(c, N(d, N(e, Ue(f)))));
  c = a.H;
  return a.D ? (d = Te(b, c + 1), d <= c ? Xe(a, d, b) : a.D(b)) : a.apply(a, pe(b));
}
function cf(a, b) {
  for (;;) {
    if (null == F(b)) {
      return !0;
    }
    var c;
    c = J(b);
    c = a.h ? a.h(c) : a.call(null, c);
    if (v(c)) {
      c = a;
      var d = K(b);
      a = c;
      b = d;
    } else {
      return !1;
    }
  }
}
function df(a, b) {
  for (;;) {
    if (F(b)) {
      var c;
      c = J(b);
      c = a.h ? a.h(c) : a.call(null, c);
      if (v(c)) {
        return c;
      }
      c = a;
      var d = K(b);
      a = c;
      b = d;
    } else {
      return null;
    }
  }
}
function ef(a) {
  return function() {
    function b(b, c) {
      return sb(a.c ? a.c(b, c) : a.call(null, b, c));
    }
    function c(b) {
      return sb(a.h ? a.h(b) : a.call(null, b));
    }
    function d() {
      return sb(a.B ? a.B() : a.call(null));
    }
    var e = null, f = function() {
      function b(a, d, e) {
        var f = null;
        if (2 < arguments.length) {
          for (var f = 0, g = Array(arguments.length - 2);f < g.length;) {
            g[f] = arguments[f + 2], ++f;
          }
          f = new I(g, 0);
        }
        return c.call(this, a, d, f);
      }
      function c(b, d, e) {
        return sb($e(a, b, d, e));
      }
      b.H = 2;
      b.D = function(a) {
        var b = J(a);
        a = K(a);
        var d = J(a);
        a = jd(a);
        return c(b, d, a);
      };
      b.v = c;
      return b;
    }(), e = function(a, e, l) {
      switch(arguments.length) {
        case 0:
          return d.call(this);
        case 1:
          return c.call(this, a);
        case 2:
          return b.call(this, a, e);
        default:
          var p = null;
          if (2 < arguments.length) {
            for (var p = 0, m = Array(arguments.length - 2);p < m.length;) {
              m[p] = arguments[p + 2], ++p;
            }
            p = new I(m, 0);
          }
          return f.v(a, e, p);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    e.H = 2;
    e.D = f.D;
    e.B = d;
    e.h = c;
    e.c = b;
    e.v = f.v;
    return e;
  }();
}
var gf = function gf() {
  switch(arguments.length) {
    case 0:
      return gf.B();
    case 1:
      return gf.h(arguments[0]);
    case 2:
      return gf.c(arguments[0], arguments[1]);
    case 3:
      return gf.l(arguments[0], arguments[1], arguments[2]);
    default:
      return gf.v(arguments[0], arguments[1], arguments[2], new I(Array.prototype.slice.call(arguments, 3), 0));
  }
};
gf.B = function() {
  return ue;
};
gf.h = function(a) {
  return a;
};
gf.c = function(a, b) {
  return function() {
    function c(c, d, e) {
      c = b.l ? b.l(c, d, e) : b.call(null, c, d, e);
      return a.h ? a.h(c) : a.call(null, c);
    }
    function d(c, d) {
      var e = b.c ? b.c(c, d) : b.call(null, c, d);
      return a.h ? a.h(e) : a.call(null, e);
    }
    function e(c) {
      c = b.h ? b.h(c) : b.call(null, c);
      return a.h ? a.h(c) : a.call(null, c);
    }
    function f() {
      var c = b.B ? b.B() : b.call(null);
      return a.h ? a.h(c) : a.call(null, c);
    }
    var g = null, k = function() {
      function c(a, b, e, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new I(k, 0);
        }
        return d.call(this, a, b, e, g);
      }
      function d(c, e, f, g) {
        c = af(b, c, e, f, g);
        return a.h ? a.h(c) : a.call(null, c);
      }
      c.H = 3;
      c.D = function(a) {
        var b = J(a);
        a = K(a);
        var c = J(a);
        a = K(a);
        var e = J(a);
        a = jd(a);
        return d(b, c, e, a);
      };
      c.v = d;
      return c;
    }(), g = function(a, b, g, q) {
      switch(arguments.length) {
        case 0:
          return f.call(this);
        case 1:
          return e.call(this, a);
        case 2:
          return d.call(this, a, b);
        case 3:
          return c.call(this, a, b, g);
        default:
          var r = null;
          if (3 < arguments.length) {
            for (var r = 0, t = Array(arguments.length - 3);r < t.length;) {
              t[r] = arguments[r + 3], ++r;
            }
            r = new I(t, 0);
          }
          return k.v(a, b, g, r);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    g.H = 3;
    g.D = k.D;
    g.B = f;
    g.h = e;
    g.c = d;
    g.l = c;
    g.v = k.v;
    return g;
  }();
};
gf.l = function(a, b, c) {
  return function() {
    function d(d, e, f) {
      d = c.l ? c.l(d, e, f) : c.call(null, d, e, f);
      d = b.h ? b.h(d) : b.call(null, d);
      return a.h ? a.h(d) : a.call(null, d);
    }
    function e(d, e) {
      var f;
      f = c.c ? c.c(d, e) : c.call(null, d, e);
      f = b.h ? b.h(f) : b.call(null, f);
      return a.h ? a.h(f) : a.call(null, f);
    }
    function f(d) {
      d = c.h ? c.h(d) : c.call(null, d);
      d = b.h ? b.h(d) : b.call(null, d);
      return a.h ? a.h(d) : a.call(null, d);
    }
    function g() {
      var d;
      d = c.B ? c.B() : c.call(null);
      d = b.h ? b.h(d) : b.call(null, d);
      return a.h ? a.h(d) : a.call(null, d);
    }
    var k = null, l = function() {
      function d(a, b, c, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new I(k, 0);
        }
        return e.call(this, a, b, c, g);
      }
      function e(d, f, g, k) {
        d = af(c, d, f, g, k);
        d = b.h ? b.h(d) : b.call(null, d);
        return a.h ? a.h(d) : a.call(null, d);
      }
      d.H = 3;
      d.D = function(a) {
        var b = J(a);
        a = K(a);
        var c = J(a);
        a = K(a);
        var d = J(a);
        a = jd(a);
        return e(b, c, d, a);
      };
      d.v = e;
      return d;
    }(), k = function(a, b, c, k) {
      switch(arguments.length) {
        case 0:
          return g.call(this);
        case 1:
          return f.call(this, a);
        case 2:
          return e.call(this, a, b);
        case 3:
          return d.call(this, a, b, c);
        default:
          var t = null;
          if (3 < arguments.length) {
            for (var t = 0, y = Array(arguments.length - 3);t < y.length;) {
              y[t] = arguments[t + 3], ++t;
            }
            t = new I(y, 0);
          }
          return l.v(a, b, c, t);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    k.H = 3;
    k.D = l.D;
    k.B = g;
    k.h = f;
    k.c = e;
    k.l = d;
    k.v = l.v;
    return k;
  }();
};
gf.v = function(a, b, c, d) {
  return function(a) {
    return function() {
      function b(a) {
        var d = null;
        if (0 < arguments.length) {
          for (var d = 0, e = Array(arguments.length - 0);d < e.length;) {
            e[d] = arguments[d + 0], ++d;
          }
          d = new I(e, 0);
        }
        return c.call(this, d);
      }
      function c(b) {
        b = Ye(J(a), b);
        for (var d = K(a);;) {
          if (d) {
            b = J(d).call(null, b), d = K(d);
          } else {
            return b;
          }
        }
      }
      b.H = 0;
      b.D = function(a) {
        a = F(a);
        return c(a);
      };
      b.v = c;
      return b;
    }();
  }(Fe(N(a, N(b, N(c, d)))));
};
gf.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  var d = K(c), c = J(d), d = K(d);
  return gf.v(b, a, c, d);
};
gf.H = 3;
var hf = function hf() {
  switch(arguments.length) {
    case 1:
      return hf.h(arguments[0]);
    case 2:
      return hf.c(arguments[0], arguments[1]);
    case 3:
      return hf.l(arguments[0], arguments[1], arguments[2]);
    case 4:
      return hf.C(arguments[0], arguments[1], arguments[2], arguments[3]);
    default:
      return hf.v(arguments[0], arguments[1], arguments[2], arguments[3], new I(Array.prototype.slice.call(arguments, 4), 0));
  }
};
hf.h = function(a) {
  return a;
};
hf.c = function(a, b) {
  return function() {
    function c(c, d, e) {
      return a.C ? a.C(b, c, d, e) : a.call(null, b, c, d, e);
    }
    function d(c, d) {
      return a.l ? a.l(b, c, d) : a.call(null, b, c, d);
    }
    function e(c) {
      return a.c ? a.c(b, c) : a.call(null, b, c);
    }
    function f() {
      return a.h ? a.h(b) : a.call(null, b);
    }
    var g = null, k = function() {
      function c(a, b, e, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new I(k, 0);
        }
        return d.call(this, a, b, e, g);
      }
      function d(c, e, f, g) {
        return bf(a, b, c, e, f, O([g], 0));
      }
      c.H = 3;
      c.D = function(a) {
        var b = J(a);
        a = K(a);
        var c = J(a);
        a = K(a);
        var e = J(a);
        a = jd(a);
        return d(b, c, e, a);
      };
      c.v = d;
      return c;
    }(), g = function(a, b, g, q) {
      switch(arguments.length) {
        case 0:
          return f.call(this);
        case 1:
          return e.call(this, a);
        case 2:
          return d.call(this, a, b);
        case 3:
          return c.call(this, a, b, g);
        default:
          var r = null;
          if (3 < arguments.length) {
            for (var r = 0, t = Array(arguments.length - 3);r < t.length;) {
              t[r] = arguments[r + 3], ++r;
            }
            r = new I(t, 0);
          }
          return k.v(a, b, g, r);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    g.H = 3;
    g.D = k.D;
    g.B = f;
    g.h = e;
    g.c = d;
    g.l = c;
    g.v = k.v;
    return g;
  }();
};
hf.l = function(a, b, c) {
  return function() {
    function d(d, e, f) {
      return a.K ? a.K(b, c, d, e, f) : a.call(null, b, c, d, e, f);
    }
    function e(d, e) {
      return a.C ? a.C(b, c, d, e) : a.call(null, b, c, d, e);
    }
    function f(d) {
      return a.l ? a.l(b, c, d) : a.call(null, b, c, d);
    }
    function g() {
      return a.c ? a.c(b, c) : a.call(null, b, c);
    }
    var k = null, l = function() {
      function d(a, b, c, f) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new I(k, 0);
        }
        return e.call(this, a, b, c, g);
      }
      function e(d, f, g, k) {
        return bf(a, b, c, d, f, O([g, k], 0));
      }
      d.H = 3;
      d.D = function(a) {
        var b = J(a);
        a = K(a);
        var c = J(a);
        a = K(a);
        var d = J(a);
        a = jd(a);
        return e(b, c, d, a);
      };
      d.v = e;
      return d;
    }(), k = function(a, b, c, k) {
      switch(arguments.length) {
        case 0:
          return g.call(this);
        case 1:
          return f.call(this, a);
        case 2:
          return e.call(this, a, b);
        case 3:
          return d.call(this, a, b, c);
        default:
          var t = null;
          if (3 < arguments.length) {
            for (var t = 0, y = Array(arguments.length - 3);t < y.length;) {
              y[t] = arguments[t + 3], ++t;
            }
            t = new I(y, 0);
          }
          return l.v(a, b, c, t);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    k.H = 3;
    k.D = l.D;
    k.B = g;
    k.h = f;
    k.c = e;
    k.l = d;
    k.v = l.v;
    return k;
  }();
};
hf.C = function(a, b, c, d) {
  return function() {
    function e(e, f, g) {
      return a.S ? a.S(b, c, d, e, f, g) : a.call(null, b, c, d, e, f, g);
    }
    function f(e, f) {
      return a.K ? a.K(b, c, d, e, f) : a.call(null, b, c, d, e, f);
    }
    function g(e) {
      return a.C ? a.C(b, c, d, e) : a.call(null, b, c, d, e);
    }
    function k() {
      return a.l ? a.l(b, c, d) : a.call(null, b, c, d);
    }
    var l = null, p = function() {
      function e(a, b, c, d) {
        var g = null;
        if (3 < arguments.length) {
          for (var g = 0, k = Array(arguments.length - 3);g < k.length;) {
            k[g] = arguments[g + 3], ++g;
          }
          g = new I(k, 0);
        }
        return f.call(this, a, b, c, g);
      }
      function f(e, g, k, l) {
        return bf(a, b, c, d, e, O([g, k, l], 0));
      }
      e.H = 3;
      e.D = function(a) {
        var b = J(a);
        a = K(a);
        var c = J(a);
        a = K(a);
        var d = J(a);
        a = jd(a);
        return f(b, c, d, a);
      };
      e.v = f;
      return e;
    }(), l = function(a, b, c, d) {
      switch(arguments.length) {
        case 0:
          return k.call(this);
        case 1:
          return g.call(this, a);
        case 2:
          return f.call(this, a, b);
        case 3:
          return e.call(this, a, b, c);
        default:
          var l = null;
          if (3 < arguments.length) {
            for (var l = 0, A = Array(arguments.length - 3);l < A.length;) {
              A[l] = arguments[l + 3], ++l;
            }
            l = new I(A, 0);
          }
          return p.v(a, b, c, l);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    l.H = 3;
    l.D = p.D;
    l.B = k;
    l.h = g;
    l.c = f;
    l.l = e;
    l.v = p.v;
    return l;
  }();
};
hf.v = function(a, b, c, d, e) {
  return function() {
    function f(a) {
      var b = null;
      if (0 < arguments.length) {
        for (var b = 0, c = Array(arguments.length - 0);b < c.length;) {
          c[b] = arguments[b + 0], ++b;
        }
        b = new I(c, 0);
      }
      return g.call(this, b);
    }
    function g(f) {
      return af(a, b, c, d, Ve.c(e, f));
    }
    f.H = 0;
    f.D = function(a) {
      a = F(a);
      return g(a);
    };
    f.v = g;
    return f;
  }();
};
hf.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  var d = K(c), c = J(d), e = K(d), d = J(e), e = K(e);
  return hf.v(b, a, c, d, e);
};
hf.H = 4;
function jf(a, b) {
  return function d(b, f) {
    return new Le(null, function() {
      var g = F(f);
      if (g) {
        if (ce(g)) {
          for (var k = Kc(g), l = P(k), p = Pe(l), m = 0;;) {
            if (m < l) {
              Se(p, function() {
                var d = b + m, f = C.c(k, m);
                return a.c ? a.c(d, f) : a.call(null, d, f);
              }()), m += 1;
            } else {
              break;
            }
          }
          return Re(p.Aa(), d(b + l, Lc(g)));
        }
        return N(function() {
          var d = J(g);
          return a.c ? a.c(b, d) : a.call(null, b, d);
        }(), d(b + 1, jd(g)));
      }
      return null;
    }, null, null);
  }(0, b);
}
function kf(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.Db = c;
  this.ca = d;
  this.J = 16386;
  this.A = 6455296;
}
h = kf.prototype;
h.equiv = function(a) {
  return this.I(null, a);
};
h.I = function(a, b) {
  return this === b;
};
h.fc = function() {
  return this.state;
};
h.T = function() {
  return this.meta;
};
h.jc = function(a, b, c) {
  for (var d = F(this.ca), e = null, f = 0, g = 0;;) {
    if (g < f) {
      a = e.P(null, g);
      var k = R(a, 0);
      a = R(a, 1);
      var l = b, p = c;
      a.C ? a.C(k, this, l, p) : a.call(null, k, this, l, p);
      g += 1;
    } else {
      if (a = F(d)) {
        d = a, ce(d) ? (e = Kc(d), d = Lc(d), a = e, f = P(e), e = a) : (a = J(d), k = R(a, 0), a = R(a, 1), e = k, f = b, g = c, a.C ? a.C(e, this, f, g) : a.call(null, e, this, f, g), d = K(d), e = null, f = 0), g = 0;
      } else {
        return null;
      }
    }
  }
};
h.ic = function(a, b, c) {
  this.ca = T.l(this.ca, b, c);
  return this;
};
h.kc = function(a, b) {
  return this.ca = Rd.c(this.ca, b);
};
h.N = function() {
  return ia(this);
};
function lf() {
  switch(arguments.length) {
    case 1:
      return mf(arguments[0]);
    default:
      var a = arguments[0], b = new I(Array.prototype.slice.call(arguments, 1), 0), c = he(b) ? Ye(nf, b) : b, b = S(c, mb), c = S(c, of);
      return new kf(a, b, c, null);
  }
}
function mf(a) {
  return new kf(a, null, null, null);
}
function V(a, b) {
  if (a instanceof kf) {
    var c = a.Db;
    if (null != c && !v(c.h ? c.h(b) : c.call(null, b))) {
      throw Error([z("Assert failed: "), z("Validator rejected reference state"), z("\n"), z(function() {
        var a = Ge(new E(null, "validate", "validate", 1439230700, null), new E(null, "new-value", "new-value", -1567397401, null));
        return pf.h ? pf.h(a) : pf.call(null, a);
      }())].join(""));
    }
    c = a.state;
    a.state = b;
    null != a.ca && yc(a, c, b);
    return b;
  }
  return Pc(a, b);
}
var fd = function fd() {
  switch(arguments.length) {
    case 2:
      return fd.c(arguments[0], arguments[1]);
    case 3:
      return fd.l(arguments[0], arguments[1], arguments[2]);
    case 4:
      return fd.C(arguments[0], arguments[1], arguments[2], arguments[3]);
    default:
      return fd.v(arguments[0], arguments[1], arguments[2], arguments[3], new I(Array.prototype.slice.call(arguments, 4), 0));
  }
};
fd.c = function(a, b) {
  var c;
  a instanceof kf ? (c = a.state, c = b.h ? b.h(c) : b.call(null, c), c = V(a, c)) : c = Qc.c(a, b);
  return c;
};
fd.l = function(a, b, c) {
  if (a instanceof kf) {
    var d = a.state;
    b = b.c ? b.c(d, c) : b.call(null, d, c);
    a = V(a, b);
  } else {
    a = Qc.l(a, b, c);
  }
  return a;
};
fd.C = function(a, b, c, d) {
  if (a instanceof kf) {
    var e = a.state;
    b = b.l ? b.l(e, c, d) : b.call(null, e, c, d);
    a = V(a, b);
  } else {
    a = Qc.C(a, b, c, d);
  }
  return a;
};
fd.v = function(a, b, c, d, e) {
  return a instanceof kf ? V(a, af(b, a.state, c, d, e)) : Qc.K(a, b, c, d, e);
};
fd.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  var d = K(c), c = J(d), e = K(d), d = J(e), e = K(e);
  return fd.v(b, a, c, d, e);
};
fd.H = 4;
function qf(a, b) {
  return function d(b, f) {
    return new Le(null, function() {
      var g = F(f);
      if (g) {
        if (ce(g)) {
          for (var k = Kc(g), l = P(k), p = Pe(l), m = 0;;) {
            if (m < l) {
              var q = function() {
                var d = b + m, f = C.c(k, m);
                return a.c ? a.c(d, f) : a.call(null, d, f);
              }();
              null != q && p.add(q);
              m += 1;
            } else {
              break;
            }
          }
          return Re(p.Aa(), d(b + l, Lc(g)));
        }
        l = function() {
          var d = J(g);
          return a.c ? a.c(b, d) : a.call(null, b, d);
        }();
        return null == l ? d(b + 1, jd(g)) : N(l, d(b + 1, jd(g)));
      }
      return null;
    }, null, null);
  }(0, b);
}
var W = function W() {
  switch(arguments.length) {
    case 1:
      return W.h(arguments[0]);
    case 2:
      return W.c(arguments[0], arguments[1]);
    case 3:
      return W.l(arguments[0], arguments[1], arguments[2]);
    case 4:
      return W.C(arguments[0], arguments[1], arguments[2], arguments[3]);
    default:
      return W.v(arguments[0], arguments[1], arguments[2], arguments[3], new I(Array.prototype.slice.call(arguments, 4), 0));
  }
};
W.h = function(a) {
  return function(b) {
    return function() {
      function c(c, d) {
        var e = a.h ? a.h(d) : a.call(null, d);
        return b.c ? b.c(c, e) : b.call(null, c, e);
      }
      function d(a) {
        return b.h ? b.h(a) : b.call(null, a);
      }
      function e() {
        return b.B ? b.B() : b.call(null);
      }
      var f = null, g = function() {
        function c(a, b, e) {
          var f = null;
          if (2 < arguments.length) {
            for (var f = 0, g = Array(arguments.length - 2);f < g.length;) {
              g[f] = arguments[f + 2], ++f;
            }
            f = new I(g, 0);
          }
          return d.call(this, a, b, f);
        }
        function d(c, e, f) {
          e = Ze(a, e, f);
          return b.c ? b.c(c, e) : b.call(null, c, e);
        }
        c.H = 2;
        c.D = function(a) {
          var b = J(a);
          a = K(a);
          var c = J(a);
          a = jd(a);
          return d(b, c, a);
        };
        c.v = d;
        return c;
      }(), f = function(a, b, f) {
        switch(arguments.length) {
          case 0:
            return e.call(this);
          case 1:
            return d.call(this, a);
          case 2:
            return c.call(this, a, b);
          default:
            var m = null;
            if (2 < arguments.length) {
              for (var m = 0, q = Array(arguments.length - 2);m < q.length;) {
                q[m] = arguments[m + 2], ++m;
              }
              m = new I(q, 0);
            }
            return g.v(a, b, m);
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      f.H = 2;
      f.D = g.D;
      f.B = e;
      f.h = d;
      f.c = c;
      f.v = g.v;
      return f;
    }();
  };
};
W.c = function(a, b) {
  return new Le(null, function() {
    var c = F(b);
    if (c) {
      if (ce(c)) {
        for (var d = Kc(c), e = P(d), f = Pe(e), g = 0;;) {
          if (g < e) {
            Se(f, function() {
              var b = C.c(d, g);
              return a.h ? a.h(b) : a.call(null, b);
            }()), g += 1;
          } else {
            break;
          }
        }
        return Re(f.Aa(), W.c(a, Lc(c)));
      }
      return N(function() {
        var b = J(c);
        return a.h ? a.h(b) : a.call(null, b);
      }(), W.c(a, jd(c)));
    }
    return null;
  }, null, null);
};
W.l = function(a, b, c) {
  return new Le(null, function() {
    var d = F(b), e = F(c);
    if (d && e) {
      var f = N, g;
      g = J(d);
      var k = J(e);
      g = a.c ? a.c(g, k) : a.call(null, g, k);
      d = f(g, W.l(a, jd(d), jd(e)));
    } else {
      d = null;
    }
    return d;
  }, null, null);
};
W.C = function(a, b, c, d) {
  return new Le(null, function() {
    var e = F(b), f = F(c), g = F(d);
    if (e && f && g) {
      var k = N, l;
      l = J(e);
      var p = J(f), m = J(g);
      l = a.l ? a.l(l, p, m) : a.call(null, l, p, m);
      e = k(l, W.C(a, jd(e), jd(f), jd(g)));
    } else {
      e = null;
    }
    return e;
  }, null, null);
};
W.v = function(a, b, c, d, e) {
  var f = function k(a) {
    return new Le(null, function() {
      var b = W.c(F, a);
      return cf(ue, b) ? N(W.c(J, b), k(W.c(jd, b))) : null;
    }, null, null);
  };
  return W.c(function() {
    return function(b) {
      return Ye(a, b);
    };
  }(f), f(Ld.v(e, d, O([c, b], 0))));
};
W.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  var d = K(c), c = J(d), e = K(d), d = J(e), e = K(e);
  return W.v(b, a, c, d, e);
};
W.H = 4;
function rf(a, b) {
  return new Le(null, function() {
    if (0 < a) {
      var c = F(b);
      return c ? N(J(c), rf(a - 1, jd(c))) : null;
    }
    return null;
  }, null, null);
}
function sf(a, b) {
  return new Le(null, function(c) {
    return function() {
      return c(a, b);
    };
  }(function(a, b) {
    for (;;) {
      var e = F(b);
      if (0 < a && e) {
        var f = a - 1, e = jd(e);
        a = f;
        b = e;
      } else {
        return e;
      }
    }
  }), null, null);
}
function tf(a) {
  return new Le(null, function() {
    return N(a, tf(a));
  }, null, null);
}
function uf(a) {
  return new Le(null, function() {
    return N(a.B ? a.B() : a.call(null), uf(a));
  }, null, null);
}
var vf = function vf() {
  switch(arguments.length) {
    case 2:
      return vf.c(arguments[0], arguments[1]);
    default:
      return vf.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
vf.c = function(a, b) {
  return new Le(null, function() {
    var c = F(a), d = F(b);
    return c && d ? N(J(c), N(J(d), vf.c(jd(c), jd(d)))) : null;
  }, null, null);
};
vf.v = function(a, b, c) {
  return new Le(null, function() {
    var d = W.c(F, Ld.v(c, b, O([a], 0)));
    return cf(ue, d) ? Ve.c(W.c(J, d), Ye(vf, W.c(jd, d))) : null;
  }, null, null);
};
vf.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return vf.v(b, a, c);
};
vf.H = 2;
function wf(a, b) {
  return new Le(null, function() {
    var c = F(b);
    if (c) {
      if (ce(c)) {
        for (var d = Kc(c), e = P(d), f = Pe(e), g = 0;;) {
          if (g < e) {
            var k;
            k = C.c(d, g);
            k = a.h ? a.h(k) : a.call(null, k);
            v(k) && (k = C.c(d, g), f.add(k));
            g += 1;
          } else {
            break;
          }
        }
        return Re(f.Aa(), wf(a, Lc(c)));
      }
      d = J(c);
      c = jd(c);
      return v(a.h ? a.h(d) : a.call(null, d)) ? N(d, wf(a, c)) : wf(a, c);
    }
    return null;
  }, null, null);
}
var xf = function xf() {
  switch(arguments.length) {
    case 2:
      return xf.c(arguments[0], arguments[1]);
    case 3:
      return xf.l(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
};
xf.c = function(a, b) {
  var c;
  null != a ? a && (a.J & 4 || a.fe) ? (c = Ab(Cc, Bc(a), b), c = Ec(c), c = Dd(c, Vd(a))) : c = Ab(Jb, a, b) : c = Ab(Ld, kd, b);
  return c;
};
xf.l = function(a, b, c) {
  a && (a.J & 4 || a.fe) ? (b = ve(b, We, Bc(a), c), b = Ec(b), a = Dd(b, Vd(a))) : a = ve(b, Ld, a, c);
  return a;
};
xf.H = 3;
function yf(a) {
  return zf(2, 2, a);
}
function zf(a, b, c) {
  return new Le(null, function() {
    var d = F(c);
    if (d) {
      var e = rf(a, d);
      return a === P(e) ? N(e, zf(a, b, sf(b, d))) : null;
    }
    return null;
  }, null, null);
}
function Af(a, b) {
  for (var c = fe, d = a, e = F(b);;) {
    if (e) {
      var f = d;
      if (f ? f.A & 256 || f.yd || (f.A ? 0 : w(Pb, f)) : w(Pb, f)) {
        d = Pd(d, J(e), c);
        if (c === d) {
          return null;
        }
        e = K(e);
      } else {
        return null;
      }
    } else {
      return d;
    }
  }
}
var Bf = function Bf(b, c, d) {
  var e = R(c, 0);
  c = Be(c);
  return v(c) ? T.l(b, e, Bf(S(b, e), c, d)) : T.l(b, e, d);
}, Cf = function Cf() {
  switch(arguments.length) {
    case 3:
      return Cf.l(arguments[0], arguments[1], arguments[2]);
    case 4:
      return Cf.C(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5:
      return Cf.K(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    case 6:
      return Cf.S(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    default:
      return Cf.v(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], new I(Array.prototype.slice.call(arguments, 6), 0));
  }
};
Cf.l = function(a, b, c) {
  var d = R(b, 0);
  b = Be(b);
  return v(b) ? T.l(a, d, Cf.l(S(a, d), b, c)) : T.l(a, d, function() {
    var b = S(a, d);
    return c.h ? c.h(b) : c.call(null, b);
  }());
};
Cf.C = function(a, b, c, d) {
  var e = R(b, 0);
  b = Be(b);
  return v(b) ? T.l(a, e, Cf.C(S(a, e), b, c, d)) : T.l(a, e, function() {
    var b = S(a, e);
    return c.c ? c.c(b, d) : c.call(null, b, d);
  }());
};
Cf.K = function(a, b, c, d, e) {
  var f = R(b, 0);
  b = Be(b);
  return v(b) ? T.l(a, f, Cf.K(S(a, f), b, c, d, e)) : T.l(a, f, function() {
    var b = S(a, f);
    return c.l ? c.l(b, d, e) : c.call(null, b, d, e);
  }());
};
Cf.S = function(a, b, c, d, e, f) {
  var g = R(b, 0);
  b = Be(b);
  return v(b) ? T.l(a, g, Cf.S(S(a, g), b, c, d, e, f)) : T.l(a, g, function() {
    var b = S(a, g);
    return c.C ? c.C(b, d, e, f) : c.call(null, b, d, e, f);
  }());
};
Cf.v = function(a, b, c, d, e, f, g) {
  var k = R(b, 0);
  b = Be(b);
  return v(b) ? T.l(a, k, bf(Cf, S(a, k), b, c, d, O([e, f, g], 0))) : T.l(a, k, bf(c, S(a, k), d, e, f, O([g], 0)));
};
Cf.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  var d = K(c), c = J(d), e = K(d), d = J(e), f = K(e), e = J(f), g = K(f), f = J(g), g = K(g);
  return Cf.v(b, a, c, d, e, f, g);
};
Cf.H = 6;
function Df(a, b) {
  this.M = a;
  this.j = b;
}
function Ef(a) {
  return new Df(a, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
}
function Ff(a) {
  return new Df(a.M, wb(a.j));
}
function Gf(a) {
  a = a.w;
  return 32 > a ? 0 : a - 1 >>> 5 << 5;
}
function Hf(a, b, c) {
  for (;;) {
    if (0 === b) {
      return c;
    }
    var d = Ef(a);
    d.j[0] = c;
    c = d;
    b -= 5;
  }
}
var If = function If(b, c, d, e) {
  var f = Ff(d), g = b.w - 1 >>> c & 31;
  5 === c ? f.j[g] = e : (d = d.j[g], b = null != d ? If(b, c - 5, d, e) : Hf(null, c - 5, e), f.j[g] = b);
  return f;
};
function Jf(a, b) {
  throw Error([z("No item "), z(a), z(" in vector of length "), z(b)].join(""));
}
function Kf(a, b) {
  if (b >= Gf(a)) {
    return a.ya;
  }
  for (var c = a.root, d = a.shift;;) {
    if (0 < d) {
      var e = d - 5, c = c.j[b >>> d & 31], d = e
    } else {
      return c.j;
    }
  }
}
function Lf(a, b) {
  return 0 <= b && b < a.w ? Kf(a, b) : Jf(b, a.w);
}
var Mf = function Mf(b, c, d, e, f) {
  var g = Ff(d);
  if (0 === c) {
    g.j[e & 31] = f;
  } else {
    var k = e >>> c & 31;
    b = Mf(b, c - 5, d.j[k], e, f);
    g.j[k] = b;
  }
  return g;
}, Nf = function Nf(b, c, d) {
  var e = b.w - 2 >>> c & 31;
  if (5 < c) {
    b = Nf(b, c - 5, d.j[e]);
    if (null == b && 0 === e) {
      return null;
    }
    d = Ff(d);
    d.j[e] = b;
    return d;
  }
  if (0 === e) {
    return null;
  }
  d = Ff(d);
  d.j[e] = null;
  return d;
};
function Of(a, b, c, d, e, f) {
  this.i = a;
  this.base = b;
  this.j = c;
  this.La = d;
  this.start = e;
  this.end = f;
}
Of.prototype.vc = function() {
  return this.i < this.end;
};
Of.prototype.next = function() {
  32 === this.i - this.base && (this.j = Kf(this.La, this.i), this.base += 32);
  var a = this.j[this.i & 31];
  this.i += 1;
  return a;
};
function X(a, b, c, d, e, f) {
  this.meta = a;
  this.w = b;
  this.shift = c;
  this.root = d;
  this.ya = e;
  this.G = f;
  this.A = 167668511;
  this.J = 8196;
}
h = X.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.U = function(a, b) {
  return Qb.l(this, b, null);
};
h.R = function(a, b, c) {
  return "number" === typeof b ? C.l(this, b, c) : c;
};
h.Jb = function(a, b, c) {
  a = 0;
  for (var d = c;;) {
    if (a < this.w) {
      var e = Kf(this, a);
      c = e.length;
      a: {
        for (var f = 0;;) {
          if (f < c) {
            var g = f + a, k = e[f], d = b.l ? b.l(d, g, k) : b.call(null, d, g, k), f = f + 1
          } else {
            e = d;
            break a;
          }
        }
      }
      a += c;
      d = e;
    } else {
      return d;
    }
  }
};
h.P = function(a, b) {
  return Lf(this, b)[b & 31];
};
h.Ca = function(a, b, c) {
  return 0 <= b && b < this.w ? Kf(this, b)[b & 31] : c;
};
h.bd = function(a, b, c) {
  if (0 <= b && b < this.w) {
    return Gf(this) <= b ? (a = wb(this.ya), a[b & 31] = c, new X(this.meta, this.w, this.shift, this.root, a, null)) : new X(this.meta, this.w, this.shift, Mf(this, this.shift, this.root, b, c), this.ya, null);
  }
  if (b === this.w) {
    return Jb(this, c);
  }
  throw Error([z("Index "), z(b), z(" out of bounds  [0,"), z(this.w), z("]")].join(""));
};
h.Ib = function() {
  var a = this.w;
  return new Of(0, 0, 0 < P(this) ? Kf(this, 0) : null, this, 0, a);
};
h.T = function() {
  return this.meta;
};
h.$ = function() {
  return this.w;
};
h.Vc = function() {
  return C.c(this, 0);
};
h.Wc = function() {
  return C.c(this, 1);
};
h.Nb = function() {
  return 0 < this.w ? C.c(this, this.w - 1) : null;
};
h.Ob = function() {
  if (0 === this.w) {
    throw Error("Can't pop empty vector");
  }
  if (1 === this.w) {
    return ic(Md, this.meta);
  }
  if (1 < this.w - Gf(this)) {
    return new X(this.meta, this.w - 1, this.shift, this.root, this.ya.slice(0, -1), null);
  }
  var a = Kf(this, this.w - 2), b = Nf(this, this.shift, this.root), b = null == b ? Y : b, c = this.w - 1;
  return 5 < this.shift && null == b.j[1] ? new X(this.meta, c, this.shift - 5, b.j[0], a, null) : new X(this.meta, c, this.shift, b, a, null);
};
h.hc = function() {
  return 0 < this.w ? new Ad(this, this.w - 1, null) : null;
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  if (b instanceof X) {
    if (this.w === P(b)) {
      for (var c = Rc(this), d = Rc(b);;) {
        if (v(c.vc())) {
          var e = c.next(), f = d.next();
          if (!L.c(e, f)) {
            return !1;
          }
        } else {
          return !0;
        }
      }
    } else {
      return !1;
    }
  } else {
    return Bd(this, b);
  }
};
h.ob = function() {
  var a = this;
  return new Pf(a.w, a.shift, function() {
    var b = a.root;
    return Qf.h ? Qf.h(b) : Qf.call(null, b);
  }(), function() {
    var b = a.ya;
    return Rf.h ? Rf.h(b) : Rf.call(null, b);
  }());
};
h.aa = function() {
  return Dd(Md, this.meta);
};
h.ra = function(a, b) {
  return sd(this, b);
};
h.sa = function(a, b, c) {
  a = 0;
  for (var d = c;;) {
    if (a < this.w) {
      var e = Kf(this, a);
      c = e.length;
      a: {
        for (var f = 0;;) {
          if (f < c) {
            var g = e[f], d = b.c ? b.c(d, g) : b.call(null, d, g), f = f + 1
          } else {
            e = d;
            break a;
          }
        }
      }
      a += c;
      d = e;
    } else {
      return d;
    }
  }
};
h.Fb = function(a, b, c) {
  if ("number" === typeof b) {
    return cc(this, b, c);
  }
  throw Error("Vector's key for assoc must be a number.");
};
h.Y = function() {
  if (0 === this.w) {
    return null;
  }
  if (32 >= this.w) {
    return new I(this.ya, 0);
  }
  var a;
  a: {
    a = this.root;
    for (var b = this.shift;;) {
      if (0 < b) {
        b -= 5, a = a.j[0];
      } else {
        a = a.j;
        break a;
      }
    }
  }
  return Sf ? Sf(this, a, 0, 0) : Tf.call(null, this, a, 0, 0);
};
h.W = function(a, b) {
  return new X(b, this.w, this.shift, this.root, this.ya, this.G);
};
h.X = function(a, b) {
  if (32 > this.w - Gf(this)) {
    for (var c = this.ya.length, d = Array(c + 1), e = 0;;) {
      if (e < c) {
        d[e] = this.ya[e], e += 1;
      } else {
        break;
      }
    }
    d[c] = b;
    return new X(this.meta, this.w + 1, this.shift, this.root, d, null);
  }
  c = (d = this.w >>> 5 > 1 << this.shift) ? this.shift + 5 : this.shift;
  d ? (d = Ef(null), d.j[0] = this.root, e = Hf(null, this.shift, new Df(null, this.ya)), d.j[1] = e) : d = If(this, this.shift, this.root, new Df(null, this.ya));
  return new X(this.meta, this.w + 1, c, d, [b], null);
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.P(null, c);
      case 3:
        return this.Ca(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.c = function(a, c) {
    return this.P(null, c);
  };
  a.l = function(a, c, d) {
    return this.Ca(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.h = function(a) {
  return this.P(null, a);
};
h.c = function(a, b) {
  return this.Ca(null, a, b);
};
var Y = new Df(null, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]), Md = new X(null, 0, 5, Y, [], pd);
function Uf(a) {
  var b = a.length;
  if (32 > b) {
    return new X(null, b, 5, Y, a, null);
  }
  for (var c = 32, d = (new X(null, 32, 5, Y, a.slice(0, 32), null)).ob(null);;) {
    if (c < b) {
      var e = c + 1, d = We.c(d, a[c]), c = e
    } else {
      return Ec(d);
    }
  }
}
X.prototype[vb] = function() {
  return md(this);
};
function Vf(a) {
  return rb(a) ? Uf(a) : Ec(Ab(Cc, Bc(Md), a));
}
var Wf = function Wf() {
  return Wf.v(0 < arguments.length ? new I(Array.prototype.slice.call(arguments, 0), 0) : null);
};
Wf.v = function(a) {
  return a instanceof I && 0 === a.i ? Uf(a.j) : Vf(a);
};
Wf.H = 0;
Wf.D = function(a) {
  return Wf.v(F(a));
};
function Xf(a, b, c, d, e, f) {
  this.Ia = a;
  this.node = b;
  this.i = c;
  this.ta = d;
  this.meta = e;
  this.G = f;
  this.A = 32375020;
  this.J = 1536;
}
h = Xf.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.meta;
};
h.va = function() {
  if (this.ta + 1 < this.node.length) {
    var a;
    a = this.Ia;
    var b = this.node, c = this.i, d = this.ta + 1;
    a = Sf ? Sf(a, b, c, d) : Tf.call(null, a, b, c, d);
    return null == a ? null : a;
  }
  return Mc(this);
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(Md, this.meta);
};
h.ra = function(a, b) {
  var c;
  c = this.Ia;
  var d = this.i + this.ta, e = P(this.Ia);
  c = Yf ? Yf(c, d, e) : Zf.call(null, c, d, e);
  return sd(c, b);
};
h.sa = function(a, b, c) {
  a = this.Ia;
  var d = this.i + this.ta, e = P(this.Ia);
  a = Yf ? Yf(a, d, e) : Zf.call(null, a, d, e);
  return td(a, b, c);
};
h.ba = function() {
  return this.node[this.ta];
};
h.Ba = function() {
  if (this.ta + 1 < this.node.length) {
    var a;
    a = this.Ia;
    var b = this.node, c = this.i, d = this.ta + 1;
    a = Sf ? Sf(a, b, c, d) : Tf.call(null, a, b, c, d);
    return null == a ? kd : a;
  }
  return Lc(this);
};
h.Y = function() {
  return this;
};
h.Rc = function() {
  var a = this.node;
  return new Oe(a, this.ta, a.length);
};
h.Sc = function() {
  var a = this.i + this.node.length;
  if (a < Gb(this.Ia)) {
    var b = this.Ia, c = Kf(this.Ia, a);
    return Sf ? Sf(b, c, a, 0) : Tf.call(null, b, c, a, 0);
  }
  return kd;
};
h.W = function(a, b) {
  var c = this.Ia, d = this.node, e = this.i, f = this.ta;
  return $f ? $f(c, d, e, f, b) : Tf.call(null, c, d, e, f, b);
};
h.X = function(a, b) {
  return N(b, this);
};
h.Qc = function() {
  var a = this.i + this.node.length;
  if (a < Gb(this.Ia)) {
    var b = this.Ia, c = Kf(this.Ia, a);
    return Sf ? Sf(b, c, a, 0) : Tf.call(null, b, c, a, 0);
  }
  return null;
};
Xf.prototype[vb] = function() {
  return md(this);
};
function Tf() {
  switch(arguments.length) {
    case 3:
      var a = arguments[0], b = arguments[1], c = arguments[2];
      return new Xf(a, Lf(a, b), b, c, null, null);
    case 4:
      return Sf(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5:
      return $f(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function Sf(a, b, c, d) {
  return new Xf(a, b, c, d, null, null);
}
function $f(a, b, c, d, e) {
  return new Xf(a, b, c, d, e, null);
}
function ag(a, b, c, d, e) {
  this.meta = a;
  this.La = b;
  this.start = c;
  this.end = d;
  this.G = e;
  this.A = 167666463;
  this.J = 8192;
}
h = ag.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.U = function(a, b) {
  return Qb.l(this, b, null);
};
h.R = function(a, b, c) {
  return "number" === typeof b ? C.l(this, b, c) : c;
};
h.Jb = function(a, b, c) {
  a = this.start;
  for (var d = 0;;) {
    if (a < this.end) {
      var e = d, f = C.c(this.La, a);
      c = b.l ? b.l(c, e, f) : b.call(null, c, e, f);
      d += 1;
      a += 1;
    } else {
      return c;
    }
  }
};
h.P = function(a, b) {
  return 0 > b || this.end <= this.start + b ? Jf(b, this.end - this.start) : C.c(this.La, this.start + b);
};
h.Ca = function(a, b, c) {
  return 0 > b || this.end <= this.start + b ? c : C.l(this.La, this.start + b, c);
};
h.bd = function(a, b, c) {
  var d = this.start + b;
  a = this.meta;
  c = T.l(this.La, d, c);
  b = this.start;
  var e = this.end, d = d + 1, d = e > d ? e : d;
  return bg.K ? bg.K(a, c, b, d, null) : bg.call(null, a, c, b, d, null);
};
h.T = function() {
  return this.meta;
};
h.$ = function() {
  return this.end - this.start;
};
h.Nb = function() {
  return C.c(this.La, this.end - 1);
};
h.Ob = function() {
  if (this.start === this.end) {
    throw Error("Can't pop empty vector");
  }
  var a = this.meta, b = this.La, c = this.start, d = this.end - 1;
  return bg.K ? bg.K(a, b, c, d, null) : bg.call(null, a, b, c, d, null);
};
h.hc = function() {
  return this.start !== this.end ? new Ad(this, this.end - this.start - 1, null) : null;
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(Md, this.meta);
};
h.ra = function(a, b) {
  return sd(this, b);
};
h.sa = function(a, b, c) {
  return td(this, b, c);
};
h.Fb = function(a, b, c) {
  if ("number" === typeof b) {
    return cc(this, b, c);
  }
  throw Error("Subvec's key for assoc must be a number.");
};
h.Y = function() {
  var a = this;
  return function(b) {
    return function d(e) {
      return e === a.end ? null : N(C.c(a.La, e), new Le(null, function() {
        return function() {
          return d(e + 1);
        };
      }(b), null, null));
    };
  }(this)(a.start);
};
h.W = function(a, b) {
  var c = this.La, d = this.start, e = this.end, f = this.G;
  return bg.K ? bg.K(b, c, d, e, f) : bg.call(null, b, c, d, e, f);
};
h.X = function(a, b) {
  var c = this.meta, d = cc(this.La, this.end, b), e = this.start, f = this.end + 1;
  return bg.K ? bg.K(c, d, e, f, null) : bg.call(null, c, d, e, f, null);
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.P(null, c);
      case 3:
        return this.Ca(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.c = function(a, c) {
    return this.P(null, c);
  };
  a.l = function(a, c, d) {
    return this.Ca(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.h = function(a) {
  return this.P(null, a);
};
h.c = function(a, b) {
  return this.Ca(null, a, b);
};
ag.prototype[vb] = function() {
  return md(this);
};
function bg(a, b, c, d, e) {
  for (;;) {
    if (b instanceof ag) {
      c = b.start + c, d = b.start + d, b = b.La;
    } else {
      var f = P(b);
      if (0 > c || 0 > d || c > f || d > f) {
        throw Error("Index out of bounds");
      }
      return new ag(a, b, c, d, e);
    }
  }
}
function Zf() {
  switch(arguments.length) {
    case 2:
      var a = arguments[0];
      return Yf(a, arguments[1], P(a));
    case 3:
      return Yf(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function Yf(a, b, c) {
  return bg(null, a, b, c, null);
}
function cg(a, b) {
  return a === b.M ? b : new Df(a, wb(b.j));
}
function Qf(a) {
  return new Df({}, wb(a.j));
}
function Rf(a) {
  var b = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  ee(a, 0, b, 0, a.length);
  return b;
}
var dg = function dg(b, c, d, e) {
  d = cg(b.root.M, d);
  var f = b.w - 1 >>> c & 31;
  if (5 === c) {
    b = e;
  } else {
    var g = d.j[f];
    b = null != g ? dg(b, c - 5, g, e) : Hf(b.root.M, c - 5, e);
  }
  d.j[f] = b;
  return d;
};
function Pf(a, b, c, d) {
  this.w = a;
  this.shift = b;
  this.root = c;
  this.ya = d;
  this.J = 88;
  this.A = 275;
}
h = Pf.prototype;
h.fb = function(a, b) {
  if (this.root.M) {
    if (32 > this.w - Gf(this)) {
      this.ya[this.w & 31] = b;
    } else {
      var c = new Df(this.root.M, this.ya), d = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      d[0] = b;
      this.ya = d;
      if (this.w >>> 5 > 1 << this.shift) {
        var d = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], e = this.shift + 5;
        d[0] = this.root;
        d[1] = Hf(this.root.M, this.shift, c);
        this.root = new Df(this.root.M, d);
        this.shift = e;
      } else {
        this.root = dg(this, this.shift, this.root, c);
      }
    }
    this.w += 1;
    return this;
  }
  throw Error("conj! after persistent!");
};
h.pb = function() {
  if (this.root.M) {
    this.root.M = null;
    var a = this.w - Gf(this), b = Array(a);
    ee(this.ya, 0, b, 0, a);
    return new X(null, this.w, this.shift, this.root, b, null);
  }
  throw Error("persistent! called twice");
};
h.Pb = function(a, b, c) {
  if ("number" === typeof b) {
    return Gc(this, b, c);
  }
  throw Error("TransientVector's key for assoc! must be a number.");
};
h.Bd = function(a, b, c) {
  var d = this;
  if (d.root.M) {
    if (0 <= b && b < d.w) {
      return Gf(this) <= b ? d.ya[b & 31] = c : (a = function() {
        return function f(a, k) {
          var l = cg(d.root.M, k);
          if (0 === a) {
            l.j[b & 31] = c;
          } else {
            var p = b >>> a & 31, m = f(a - 5, l.j[p]);
            l.j[p] = m;
          }
          return l;
        };
      }(this).call(null, d.shift, d.root), d.root = a), this;
    }
    if (b === d.w) {
      return Cc(this, c);
    }
    throw Error([z("Index "), z(b), z(" out of bounds for TransientVector of length"), z(d.w)].join(""));
  }
  throw Error("assoc! after persistent!");
};
h.$ = function() {
  if (this.root.M) {
    return this.w;
  }
  throw Error("count after persistent!");
};
h.P = function(a, b) {
  if (this.root.M) {
    return Lf(this, b)[b & 31];
  }
  throw Error("nth after persistent!");
};
h.Ca = function(a, b, c) {
  return 0 <= b && b < this.w ? C.c(this, b) : c;
};
h.U = function(a, b) {
  return Qb.l(this, b, null);
};
h.R = function(a, b, c) {
  return "number" === typeof b ? C.l(this, b, c) : c;
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.U(null, c);
      case 3:
        return this.R(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.c = function(a, c) {
    return this.U(null, c);
  };
  a.l = function(a, c, d) {
    return this.R(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.h = function(a) {
  return this.U(null, a);
};
h.c = function(a, b) {
  return this.R(null, a, b);
};
function eg() {
  this.A = 2097152;
  this.J = 0;
}
eg.prototype.equiv = function(a) {
  return this.I(null, a);
};
eg.prototype.I = function() {
  return !1;
};
var fg = new eg;
function gg(a, b) {
  return ie(ae(b) ? P(a) === P(b) ? cf(ue, W.c(function(a) {
    return L.c(Pd(b, J(a), fg), Id(a));
  }, a)) : null : null);
}
function hg(a) {
  this.s = a;
}
hg.prototype.next = function() {
  if (null != this.s) {
    var a = J(this.s), b = R(a, 0), a = R(a, 1);
    this.s = K(this.s);
    return {value:[b, a], done:!1};
  }
  return {value:null, done:!0};
};
function ig(a) {
  return new hg(F(a));
}
function jg(a) {
  this.s = a;
}
jg.prototype.next = function() {
  if (null != this.s) {
    var a = J(this.s);
    this.s = K(this.s);
    return {value:[a, a], done:!1};
  }
  return {value:null, done:!0};
};
function kg(a, b) {
  var c;
  if (b instanceof U) {
    a: {
      c = a.length;
      for (var d = b.Ma, e = 0;;) {
        if (c <= e) {
          c = -1;
          break a;
        }
        var f = a[e];
        if (f instanceof U && d === f.Ma) {
          c = e;
          break a;
        }
        e += 2;
      }
    }
  } else {
    if (c = ca(b), v(v(c) ? c : "number" === typeof b)) {
      a: {
        for (c = a.length, d = 0;;) {
          if (c <= d) {
            c = -1;
            break a;
          }
          if (b === a[d]) {
            c = d;
            break a;
          }
          d += 2;
        }
      }
    } else {
      if (b instanceof E) {
        a: {
          for (c = a.length, d = b.Qa, e = 0;;) {
            if (c <= e) {
              c = -1;
              break a;
            }
            f = a[e];
            if (f instanceof E && d === f.Qa) {
              c = e;
              break a;
            }
            e += 2;
          }
        }
      } else {
        if (null == b) {
          a: {
            for (c = a.length, d = 0;;) {
              if (c <= d) {
                c = -1;
                break a;
              }
              if (null == a[d]) {
                c = d;
                break a;
              }
              d += 2;
            }
          }
        } else {
          a: {
            for (c = a.length, d = 0;;) {
              if (c <= d) {
                c = -1;
                break a;
              }
              if (L.c(b, a[d])) {
                c = d;
                break a;
              }
              d += 2;
            }
          }
        }
      }
    }
  }
  return c;
}
function lg(a, b, c) {
  this.j = a;
  this.i = b;
  this.za = c;
  this.A = 32374990;
  this.J = 0;
}
h = lg.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.za;
};
h.va = function() {
  return this.i < this.j.length - 2 ? new lg(this.j, this.i + 2, this.za) : null;
};
h.$ = function() {
  return (this.j.length - this.i) / 2;
};
h.N = function() {
  return od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(kd, this.za);
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.ba = function() {
  return new X(null, 2, 5, Y, [this.j[this.i], this.j[this.i + 1]], null);
};
h.Ba = function() {
  return this.i < this.j.length - 2 ? new lg(this.j, this.i + 2, this.za) : kd;
};
h.Y = function() {
  return this;
};
h.W = function(a, b) {
  return new lg(this.j, this.i, b);
};
h.X = function(a, b) {
  return N(b, this);
};
lg.prototype[vb] = function() {
  return md(this);
};
function mg(a, b, c) {
  this.j = a;
  this.i = b;
  this.w = c;
}
mg.prototype.vc = function() {
  return this.i < this.w;
};
mg.prototype.next = function() {
  var a = new X(null, 2, 5, Y, [this.j[this.i], this.j[this.i + 1]], null);
  this.i += 2;
  return a;
};
function u(a, b, c, d) {
  this.meta = a;
  this.w = b;
  this.j = c;
  this.G = d;
  this.A = 16647951;
  this.J = 8196;
}
h = u.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.keys = function() {
  return md(ng.h ? ng.h(this) : ng.call(null, this));
};
h.entries = function() {
  return ig(F(this));
};
h.values = function() {
  return md(og.h ? og.h(this) : og.call(null, this));
};
h.has = function(a) {
  return ke(this, a);
};
h.get = function(a, b) {
  return this.R(null, a, b);
};
h.forEach = function(a) {
  for (var b = F(this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.P(null, e), g = R(f, 0), f = R(f, 1);
      a.c ? a.c(f, g) : a.call(null, f, g);
      e += 1;
    } else {
      if (b = F(b)) {
        ce(b) ? (c = Kc(b), b = Lc(b), g = c, d = P(c), c = g) : (c = J(b), g = R(c, 0), c = f = R(c, 1), a.c ? a.c(c, g) : a.call(null, c, g), b = K(b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
h.U = function(a, b) {
  return Qb.l(this, b, null);
};
h.R = function(a, b, c) {
  a = kg(this.j, b);
  return -1 === a ? c : this.j[a + 1];
};
h.Jb = function(a, b, c) {
  a = this.j.length;
  for (var d = 0;;) {
    if (d < a) {
      var e = this.j[d], f = this.j[d + 1];
      c = b.l ? b.l(c, e, f) : b.call(null, c, e, f);
      d += 2;
    } else {
      return c;
    }
  }
};
h.Ib = function() {
  return new mg(this.j, 0, 2 * this.w);
};
h.T = function() {
  return this.meta;
};
h.$ = function() {
  return this.w;
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = qd(this);
};
h.I = function(a, b) {
  if (b && (b.A & 1024 || b.je)) {
    var c = this.j.length;
    if (this.w === b.$(null)) {
      for (var d = 0;;) {
        if (d < c) {
          var e = b.R(null, this.j[d], fe);
          if (e !== fe) {
            if (L.c(this.j[d + 1], e)) {
              d += 2;
            } else {
              return !1;
            }
          } else {
            return !1;
          }
        } else {
          return !0;
        }
      }
    } else {
      return !1;
    }
  } else {
    return gg(this, b);
  }
};
h.ob = function() {
  return new pg({}, this.j.length, wb(this.j));
};
h.aa = function() {
  return ic(Z, this.meta);
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.Uc = function(a, b) {
  if (0 <= kg(this.j, b)) {
    var c = this.j.length, d = c - 2;
    if (0 === d) {
      return Hb(this);
    }
    for (var d = Array(d), e = 0, f = 0;;) {
      if (e >= c) {
        return new u(this.meta, this.w - 1, d, null);
      }
      L.c(b, this.j[e]) || (d[f] = this.j[e], d[f + 1] = this.j[e + 1], f += 2);
      e += 2;
    }
  } else {
    return this;
  }
};
h.Fb = function(a, b, c) {
  a = kg(this.j, b);
  if (-1 === a) {
    if (this.w < qg) {
      a = this.j;
      for (var d = a.length, e = Array(d + 2), f = 0;;) {
        if (f < d) {
          e[f] = a[f], f += 1;
        } else {
          break;
        }
      }
      e[d] = b;
      e[d + 1] = c;
      return new u(this.meta, this.w + 1, e, null);
    }
    return ic(Sb(xf.c(rg, this), b, c), this.meta);
  }
  if (c === this.j[a + 1]) {
    return this;
  }
  b = wb(this.j);
  b[a + 1] = c;
  return new u(this.meta, this.w, b, null);
};
h.Pc = function(a, b) {
  return -1 !== kg(this.j, b);
};
h.Y = function() {
  var a = this.j;
  return 0 <= a.length - 2 ? new lg(a, 0, null) : null;
};
h.W = function(a, b) {
  return new u(b, this.w, this.j, this.G);
};
h.X = function(a, b) {
  if (be(b)) {
    return Sb(this, C.c(b, 0), C.c(b, 1));
  }
  for (var c = this, d = F(b);;) {
    if (null == d) {
      return c;
    }
    var e = J(d);
    if (be(e)) {
      c = Sb(c, C.c(e, 0), C.c(e, 1)), d = K(d);
    } else {
      throw Error("conj on a map takes map entries or seqables of map entries");
    }
  }
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.U(null, c);
      case 3:
        return this.R(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.c = function(a, c) {
    return this.U(null, c);
  };
  a.l = function(a, c, d) {
    return this.R(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.h = function(a) {
  return this.U(null, a);
};
h.c = function(a, b) {
  return this.R(null, a, b);
};
var Z = new u(null, 0, [], rd), qg = 8;
function sg(a) {
  for (var b = [], c = 0;;) {
    if (c < a.length) {
      var d = a[c], e = a[c + 1];
      -1 === kg(b, d) && (b.push(d), b.push(e));
      c += 2;
    } else {
      break;
    }
  }
  return new u(null, b.length / 2, b, null);
}
u.prototype[vb] = function() {
  return md(this);
};
function pg(a, b, c) {
  this.qb = a;
  this.xb = b;
  this.j = c;
  this.A = 258;
  this.J = 56;
}
h = pg.prototype;
h.$ = function() {
  if (v(this.qb)) {
    return ze(this.xb);
  }
  throw Error("count after persistent!");
};
h.U = function(a, b) {
  return Qb.l(this, b, null);
};
h.R = function(a, b, c) {
  if (v(this.qb)) {
    return a = kg(this.j, b), -1 === a ? c : this.j[a + 1];
  }
  throw Error("lookup after persistent!");
};
h.fb = function(a, b) {
  if (v(this.qb)) {
    if (b ? b.A & 2048 || b.ke || (b.A ? 0 : w(Vb, b)) : w(Vb, b)) {
      return Fc(this, tg.h ? tg.h(b) : tg.call(null, b), ug.h ? ug.h(b) : ug.call(null, b));
    }
    for (var c = F(b), d = this;;) {
      var e = J(c);
      if (v(e)) {
        var f = e, c = K(c), d = Fc(d, function() {
          var a = f;
          return tg.h ? tg.h(a) : tg.call(null, a);
        }(), function() {
          var a = f;
          return ug.h ? ug.h(a) : ug.call(null, a);
        }())
      } else {
        return d;
      }
    }
  } else {
    throw Error("conj! after persistent!");
  }
};
h.pb = function() {
  if (v(this.qb)) {
    return this.qb = !1, new u(null, ze(this.xb), this.j, null);
  }
  throw Error("persistent! called twice");
};
h.Pb = function(a, b, c) {
  if (v(this.qb)) {
    a = kg(this.j, b);
    if (-1 === a) {
      if (this.xb + 2 <= 2 * qg) {
        return this.xb += 2, this.j.push(b), this.j.push(c), this;
      }
      a = this.xb;
      var d = this.j;
      a = vg.c ? vg.c(a, d) : vg.call(null, a, d);
      return Fc(a, b, c);
    }
    c !== this.j[a + 1] && (this.j[a + 1] = c);
    return this;
  }
  throw Error("assoc! after persistent!");
};
function vg(a, b) {
  for (var c = Bc(rg), d = 0;;) {
    if (d < a) {
      c = Fc(c, b[d], b[d + 1]), d += 2;
    } else {
      return c;
    }
  }
}
function wg() {
  this.Ra = !1;
}
function xg(a, b) {
  return a === b ? !0 : a === b || a instanceof U && b instanceof U && a.Ma === b.Ma ? !0 : L.c(a, b);
}
function yg(a, b, c) {
  a = wb(a);
  a[b] = c;
  return a;
}
function zg(a, b) {
  var c = Array(a.length - 2);
  ee(a, 0, c, 0, 2 * b);
  ee(a, 2 * (b + 1), c, 2 * b, c.length - 2 * b);
  return c;
}
function Ag(a, b, c, d) {
  a = a.gb(b);
  a.j[c] = d;
  return a;
}
function Bg(a, b, c) {
  for (var d = a.length, e = 0, f = c;;) {
    if (e < d) {
      c = a[e];
      if (null != c) {
        var g = a[e + 1];
        c = b.l ? b.l(f, c, g) : b.call(null, f, c, g);
      } else {
        c = a[e + 1], c = null != c ? c.Wb(b, f) : f;
      }
      e += 2;
      f = c;
    } else {
      return f;
    }
  }
}
function Cg(a, b, c) {
  this.M = a;
  this.O = b;
  this.j = c;
}
h = Cg.prototype;
h.gb = function(a) {
  if (a === this.M) {
    return this;
  }
  var b = Ae(this.O), c = Array(0 > b ? 4 : 2 * (b + 1));
  ee(this.j, 0, c, 0, 2 * b);
  return new Cg(a, this.O, c);
};
h.Tb = function() {
  var a = this.j;
  return Dg ? Dg(a) : Eg.call(null, a);
};
h.Wb = function(a, b) {
  return Bg(this.j, a, b);
};
h.$a = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if (0 === (this.O & e)) {
    return d;
  }
  var f = Ae(this.O & e - 1), e = this.j[2 * f], f = this.j[2 * f + 1];
  return null == e ? f.$a(a + 5, b, c, d) : xg(c, e) ? f : d;
};
h.Oa = function(a, b, c, d, e, f) {
  var g = 1 << (c >>> b & 31), k = Ae(this.O & g - 1);
  if (0 === (this.O & g)) {
    var l = Ae(this.O);
    if (2 * l < this.j.length) {
      a = this.gb(a);
      b = a.j;
      f.Ra = !0;
      a: {
        for (c = 2 * (l - k), f = 2 * k + (c - 1), l = 2 * (k + 1) + (c - 1);;) {
          if (0 === c) {
            break a;
          }
          b[l] = b[f];
          --l;
          --c;
          --f;
        }
      }
      b[2 * k] = d;
      b[2 * k + 1] = e;
      a.O |= g;
      return a;
    }
    if (16 <= l) {
      k = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      k[c >>> b & 31] = Fg.Oa(a, b + 5, c, d, e, f);
      for (e = d = 0;;) {
        if (32 > d) {
          0 !== (this.O >>> d & 1) && (k[d] = null != this.j[e] ? Fg.Oa(a, b + 5, bd(this.j[e]), this.j[e], this.j[e + 1], f) : this.j[e + 1], e += 2), d += 1;
        } else {
          break;
        }
      }
      return new Gg(a, l + 1, k);
    }
    b = Array(2 * (l + 4));
    ee(this.j, 0, b, 0, 2 * k);
    b[2 * k] = d;
    b[2 * k + 1] = e;
    ee(this.j, 2 * k, b, 2 * (k + 1), 2 * (l - k));
    f.Ra = !0;
    a = this.gb(a);
    a.j = b;
    a.O |= g;
    return a;
  }
  l = this.j[2 * k];
  g = this.j[2 * k + 1];
  if (null == l) {
    return l = g.Oa(a, b + 5, c, d, e, f), l === g ? this : Ag(this, a, 2 * k + 1, l);
  }
  if (xg(d, l)) {
    return e === g ? this : Ag(this, a, 2 * k + 1, e);
  }
  f.Ra = !0;
  f = b + 5;
  d = Hg ? Hg(a, f, l, g, c, d, e) : Ig.call(null, a, f, l, g, c, d, e);
  e = 2 * k;
  k = 2 * k + 1;
  a = this.gb(a);
  a.j[e] = null;
  a.j[k] = d;
  return a;
};
h.Na = function(a, b, c, d, e) {
  var f = 1 << (b >>> a & 31), g = Ae(this.O & f - 1);
  if (0 === (this.O & f)) {
    var k = Ae(this.O);
    if (16 <= k) {
      g = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      g[b >>> a & 31] = Fg.Na(a + 5, b, c, d, e);
      for (d = c = 0;;) {
        if (32 > c) {
          0 !== (this.O >>> c & 1) && (g[c] = null != this.j[d] ? Fg.Na(a + 5, bd(this.j[d]), this.j[d], this.j[d + 1], e) : this.j[d + 1], d += 2), c += 1;
        } else {
          break;
        }
      }
      return new Gg(null, k + 1, g);
    }
    a = Array(2 * (k + 1));
    ee(this.j, 0, a, 0, 2 * g);
    a[2 * g] = c;
    a[2 * g + 1] = d;
    ee(this.j, 2 * g, a, 2 * (g + 1), 2 * (k - g));
    e.Ra = !0;
    return new Cg(null, this.O | f, a);
  }
  var l = this.j[2 * g], f = this.j[2 * g + 1];
  if (null == l) {
    return k = f.Na(a + 5, b, c, d, e), k === f ? this : new Cg(null, this.O, yg(this.j, 2 * g + 1, k));
  }
  if (xg(c, l)) {
    return d === f ? this : new Cg(null, this.O, yg(this.j, 2 * g + 1, d));
  }
  e.Ra = !0;
  e = this.O;
  k = this.j;
  a += 5;
  a = Jg ? Jg(a, l, f, b, c, d) : Ig.call(null, a, l, f, b, c, d);
  c = 2 * g;
  g = 2 * g + 1;
  d = wb(k);
  d[c] = null;
  d[g] = a;
  return new Cg(null, e, d);
};
h.Ub = function(a, b, c) {
  var d = 1 << (b >>> a & 31);
  if (0 === (this.O & d)) {
    return this;
  }
  var e = Ae(this.O & d - 1), f = this.j[2 * e], g = this.j[2 * e + 1];
  return null == f ? (a = g.Ub(a + 5, b, c), a === g ? this : null != a ? new Cg(null, this.O, yg(this.j, 2 * e + 1, a)) : this.O === d ? null : new Cg(null, this.O ^ d, zg(this.j, e))) : xg(c, f) ? new Cg(null, this.O ^ d, zg(this.j, e)) : this;
};
var Fg = new Cg(null, 0, []);
function Gg(a, b, c) {
  this.M = a;
  this.w = b;
  this.j = c;
}
h = Gg.prototype;
h.gb = function(a) {
  return a === this.M ? this : new Gg(a, this.w, wb(this.j));
};
h.Tb = function() {
  var a = this.j;
  return Kg ? Kg(a) : Lg.call(null, a);
};
h.Wb = function(a, b) {
  for (var c = this.j.length, d = 0, e = b;;) {
    if (d < c) {
      var f = this.j[d];
      null != f && (e = f.Wb(a, e));
      d += 1;
    } else {
      return e;
    }
  }
};
h.$a = function(a, b, c, d) {
  var e = this.j[b >>> a & 31];
  return null != e ? e.$a(a + 5, b, c, d) : d;
};
h.Oa = function(a, b, c, d, e, f) {
  var g = c >>> b & 31, k = this.j[g];
  if (null == k) {
    return a = Ag(this, a, g, Fg.Oa(a, b + 5, c, d, e, f)), a.w += 1, a;
  }
  b = k.Oa(a, b + 5, c, d, e, f);
  return b === k ? this : Ag(this, a, g, b);
};
h.Na = function(a, b, c, d, e) {
  var f = b >>> a & 31, g = this.j[f];
  if (null == g) {
    return new Gg(null, this.w + 1, yg(this.j, f, Fg.Na(a + 5, b, c, d, e)));
  }
  a = g.Na(a + 5, b, c, d, e);
  return a === g ? this : new Gg(null, this.w, yg(this.j, f, a));
};
h.Ub = function(a, b, c) {
  var d = b >>> a & 31, e = this.j[d];
  if (null != e) {
    a = e.Ub(a + 5, b, c);
    if (a === e) {
      d = this;
    } else {
      if (null == a) {
        if (8 >= this.w) {
          a: {
            e = this.j;
            a = e.length;
            b = Array(2 * (this.w - 1));
            c = 0;
            for (var f = 1, g = 0;;) {
              if (c < a) {
                c !== d && null != e[c] && (b[f] = e[c], f += 2, g |= 1 << c), c += 1;
              } else {
                d = new Cg(null, g, b);
                break a;
              }
            }
          }
        } else {
          d = new Gg(null, this.w - 1, yg(this.j, d, a));
        }
      } else {
        d = new Gg(null, this.w, yg(this.j, d, a));
      }
    }
    return d;
  }
  return this;
};
function Mg(a, b, c) {
  b *= 2;
  for (var d = 0;;) {
    if (d < b) {
      if (xg(c, a[d])) {
        return d;
      }
      d += 2;
    } else {
      return -1;
    }
  }
}
function Ng(a, b, c, d) {
  this.M = a;
  this.Sa = b;
  this.w = c;
  this.j = d;
}
h = Ng.prototype;
h.gb = function(a) {
  if (a === this.M) {
    return this;
  }
  var b = Array(2 * (this.w + 1));
  ee(this.j, 0, b, 0, 2 * this.w);
  return new Ng(a, this.Sa, this.w, b);
};
h.Tb = function() {
  var a = this.j;
  return Dg ? Dg(a) : Eg.call(null, a);
};
h.Wb = function(a, b) {
  return Bg(this.j, a, b);
};
h.$a = function(a, b, c, d) {
  a = Mg(this.j, this.w, c);
  return 0 > a ? d : xg(c, this.j[a]) ? this.j[a + 1] : d;
};
h.Oa = function(a, b, c, d, e, f) {
  if (c === this.Sa) {
    b = Mg(this.j, this.w, d);
    if (-1 === b) {
      if (this.j.length > 2 * this.w) {
        return b = 2 * this.w, c = 2 * this.w + 1, a = this.gb(a), a.j[b] = d, a.j[c] = e, f.Ra = !0, a.w += 1, a;
      }
      c = this.j.length;
      b = Array(c + 2);
      ee(this.j, 0, b, 0, c);
      b[c] = d;
      b[c + 1] = e;
      f.Ra = !0;
      d = this.w + 1;
      a === this.M ? (this.j = b, this.w = d, a = this) : a = new Ng(this.M, this.Sa, d, b);
      return a;
    }
    return this.j[b + 1] === e ? this : Ag(this, a, b + 1, e);
  }
  return (new Cg(a, 1 << (this.Sa >>> b & 31), [null, this, null, null])).Oa(a, b, c, d, e, f);
};
h.Na = function(a, b, c, d, e) {
  return b === this.Sa ? (a = Mg(this.j, this.w, c), -1 === a ? (a = 2 * this.w, b = Array(a + 2), ee(this.j, 0, b, 0, a), b[a] = c, b[a + 1] = d, e.Ra = !0, new Ng(null, this.Sa, this.w + 1, b)) : L.c(this.j[a], d) ? this : new Ng(null, this.Sa, this.w, yg(this.j, a + 1, d))) : (new Cg(null, 1 << (this.Sa >>> a & 31), [null, this])).Na(a, b, c, d, e);
};
h.Ub = function(a, b, c) {
  a = Mg(this.j, this.w, c);
  return -1 === a ? this : 1 === this.w ? null : new Ng(null, this.Sa, this.w - 1, zg(this.j, ze(a)));
};
function Ig() {
  switch(arguments.length) {
    case 6:
      return Jg(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    case 7:
      return Hg(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function Jg(a, b, c, d, e, f) {
  var g = bd(b);
  if (g === d) {
    return new Ng(null, g, 2, [b, c, e, f]);
  }
  var k = new wg;
  return Fg.Na(a, g, b, c, k).Na(a, d, e, f, k);
}
function Hg(a, b, c, d, e, f, g) {
  var k = bd(c);
  if (k === e) {
    return new Ng(null, k, 2, [c, d, f, g]);
  }
  var l = new wg;
  return Fg.Oa(a, b, k, c, d, l).Oa(a, b, e, f, g, l);
}
function Og(a, b, c, d, e) {
  this.meta = a;
  this.ab = b;
  this.i = c;
  this.s = d;
  this.G = e;
  this.A = 32374860;
  this.J = 0;
}
h = Og.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.meta;
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(kd, this.meta);
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.ba = function() {
  return null == this.s ? new X(null, 2, 5, Y, [this.ab[this.i], this.ab[this.i + 1]], null) : J(this.s);
};
h.Ba = function() {
  if (null == this.s) {
    var a = this.ab, b = this.i + 2;
    return Pg ? Pg(a, b, null) : Eg.call(null, a, b, null);
  }
  var a = this.ab, b = this.i, c = K(this.s);
  return Pg ? Pg(a, b, c) : Eg.call(null, a, b, c);
};
h.Y = function() {
  return this;
};
h.W = function(a, b) {
  return new Og(b, this.ab, this.i, this.s, this.G);
};
h.X = function(a, b) {
  return N(b, this);
};
Og.prototype[vb] = function() {
  return md(this);
};
function Eg() {
  switch(arguments.length) {
    case 1:
      return Dg(arguments[0]);
    case 3:
      return Pg(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function Dg(a) {
  return Pg(a, 0, null);
}
function Pg(a, b, c) {
  if (null == c) {
    for (c = a.length;;) {
      if (b < c) {
        if (null != a[b]) {
          return new Og(null, a, b, null, null);
        }
        var d = a[b + 1];
        if (v(d) && (d = d.Tb(), v(d))) {
          return new Og(null, a, b + 2, d, null);
        }
        b += 2;
      } else {
        return null;
      }
    }
  } else {
    return new Og(null, a, b, c, null);
  }
}
function Qg(a, b, c, d, e) {
  this.meta = a;
  this.ab = b;
  this.i = c;
  this.s = d;
  this.G = e;
  this.A = 32374860;
  this.J = 0;
}
h = Qg.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.meta;
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(kd, this.meta);
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.ba = function() {
  return J(this.s);
};
h.Ba = function() {
  var a = this.ab, b = this.i, c = K(this.s);
  return Rg ? Rg(null, a, b, c) : Lg.call(null, null, a, b, c);
};
h.Y = function() {
  return this;
};
h.W = function(a, b) {
  return new Qg(b, this.ab, this.i, this.s, this.G);
};
h.X = function(a, b) {
  return N(b, this);
};
Qg.prototype[vb] = function() {
  return md(this);
};
function Lg() {
  switch(arguments.length) {
    case 1:
      return Kg(arguments[0]);
    case 4:
      return Rg(arguments[0], arguments[1], arguments[2], arguments[3]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function Kg(a) {
  return Rg(null, a, 0, null);
}
function Rg(a, b, c, d) {
  if (null == d) {
    for (d = b.length;;) {
      if (c < d) {
        var e = b[c];
        if (v(e) && (e = e.Tb(), v(e))) {
          return new Qg(a, b, c + 1, e, null);
        }
        c += 1;
      } else {
        return null;
      }
    }
  } else {
    return new Qg(a, b, c, d, null);
  }
}
function Sg(a, b, c, d, e, f) {
  this.meta = a;
  this.w = b;
  this.root = c;
  this.wa = d;
  this.Da = e;
  this.G = f;
  this.A = 16123663;
  this.J = 8196;
}
h = Sg.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.keys = function() {
  return md(ng.h ? ng.h(this) : ng.call(null, this));
};
h.entries = function() {
  return ig(F(this));
};
h.values = function() {
  return md(og.h ? og.h(this) : og.call(null, this));
};
h.has = function(a) {
  return ke(this, a);
};
h.get = function(a, b) {
  return this.R(null, a, b);
};
h.forEach = function(a) {
  for (var b = F(this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.P(null, e), g = R(f, 0), f = R(f, 1);
      a.c ? a.c(f, g) : a.call(null, f, g);
      e += 1;
    } else {
      if (b = F(b)) {
        ce(b) ? (c = Kc(b), b = Lc(b), g = c, d = P(c), c = g) : (c = J(b), g = R(c, 0), c = f = R(c, 1), a.c ? a.c(c, g) : a.call(null, c, g), b = K(b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
h.U = function(a, b) {
  return Qb.l(this, b, null);
};
h.R = function(a, b, c) {
  return null == b ? this.wa ? this.Da : c : null == this.root ? c : this.root.$a(0, bd(b), b, c);
};
h.Jb = function(a, b, c) {
  this.wa && (a = this.Da, c = b.l ? b.l(c, null, a) : b.call(null, c, null, a));
  return null != this.root ? this.root.Wb(b, c) : c;
};
h.T = function() {
  return this.meta;
};
h.$ = function() {
  return this.w;
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = qd(this);
};
h.I = function(a, b) {
  return gg(this, b);
};
h.ob = function() {
  return new Tg({}, this.root, this.w, this.wa, this.Da);
};
h.aa = function() {
  return ic(rg, this.meta);
};
h.Uc = function(a, b) {
  if (null == b) {
    return this.wa ? new Sg(this.meta, this.w - 1, this.root, !1, null, null) : this;
  }
  if (null == this.root) {
    return this;
  }
  var c = this.root.Ub(0, bd(b), b);
  return c === this.root ? this : new Sg(this.meta, this.w - 1, c, this.wa, this.Da, null);
};
h.Fb = function(a, b, c) {
  if (null == b) {
    return this.wa && c === this.Da ? this : new Sg(this.meta, this.wa ? this.w : this.w + 1, this.root, !0, c, null);
  }
  a = new wg;
  b = (null == this.root ? Fg : this.root).Na(0, bd(b), b, c, a);
  return b === this.root ? this : new Sg(this.meta, a.Ra ? this.w + 1 : this.w, b, this.wa, this.Da, null);
};
h.Pc = function(a, b) {
  return null == b ? this.wa : null == this.root ? !1 : this.root.$a(0, bd(b), b, fe) !== fe;
};
h.Y = function() {
  if (0 < this.w) {
    var a = null != this.root ? this.root.Tb() : null;
    return this.wa ? N(new X(null, 2, 5, Y, [null, this.Da], null), a) : a;
  }
  return null;
};
h.W = function(a, b) {
  return new Sg(b, this.w, this.root, this.wa, this.Da, this.G);
};
h.X = function(a, b) {
  if (be(b)) {
    return Sb(this, C.c(b, 0), C.c(b, 1));
  }
  for (var c = this, d = F(b);;) {
    if (null == d) {
      return c;
    }
    var e = J(d);
    if (be(e)) {
      c = Sb(c, C.c(e, 0), C.c(e, 1)), d = K(d);
    } else {
      throw Error("conj on a map takes map entries or seqables of map entries");
    }
  }
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.U(null, c);
      case 3:
        return this.R(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.c = function(a, c) {
    return this.U(null, c);
  };
  a.l = function(a, c, d) {
    return this.R(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.h = function(a) {
  return this.U(null, a);
};
h.c = function(a, b) {
  return this.R(null, a, b);
};
var rg = new Sg(null, 0, null, !1, null, rd);
function Qd(a, b) {
  for (var c = a.length, d = 0, e = Bc(rg);;) {
    if (d < c) {
      var f = d + 1, e = e.Pb(null, a[d], b[d]), d = f
    } else {
      return Ec(e);
    }
  }
}
Sg.prototype[vb] = function() {
  return md(this);
};
function Tg(a, b, c, d, e) {
  this.M = a;
  this.root = b;
  this.count = c;
  this.wa = d;
  this.Da = e;
  this.A = 258;
  this.J = 56;
}
function Ug(a, b) {
  if (a.M) {
    if (b ? b.A & 2048 || b.ke || (b.A ? 0 : w(Vb, b)) : w(Vb, b)) {
      return Vg(a, tg.h ? tg.h(b) : tg.call(null, b), ug.h ? ug.h(b) : ug.call(null, b));
    }
    for (var c = F(b), d = a;;) {
      var e = J(c);
      if (v(e)) {
        var f = e, c = K(c), d = Vg(d, function() {
          var a = f;
          return tg.h ? tg.h(a) : tg.call(null, a);
        }(), function() {
          var a = f;
          return ug.h ? ug.h(a) : ug.call(null, a);
        }())
      } else {
        return d;
      }
    }
  } else {
    throw Error("conj! after persistent");
  }
}
function Vg(a, b, c) {
  if (a.M) {
    if (null == b) {
      a.Da !== c && (a.Da = c), a.wa || (a.count += 1, a.wa = !0);
    } else {
      var d = new wg;
      b = (null == a.root ? Fg : a.root).Oa(a.M, 0, bd(b), b, c, d);
      b !== a.root && (a.root = b);
      d.Ra && (a.count += 1);
    }
    return a;
  }
  throw Error("assoc! after persistent!");
}
h = Tg.prototype;
h.$ = function() {
  if (this.M) {
    return this.count;
  }
  throw Error("count after persistent!");
};
h.U = function(a, b) {
  return null == b ? this.wa ? this.Da : null : null == this.root ? null : this.root.$a(0, bd(b), b);
};
h.R = function(a, b, c) {
  return null == b ? this.wa ? this.Da : c : null == this.root ? c : this.root.$a(0, bd(b), b, c);
};
h.fb = function(a, b) {
  return Ug(this, b);
};
h.pb = function() {
  var a;
  if (this.M) {
    this.M = null, a = new Sg(null, this.count, this.root, this.wa, this.Da, null);
  } else {
    throw Error("persistent! called twice");
  }
  return a;
};
h.Pb = function(a, b, c) {
  return Vg(this, b, c);
};
var nf = function nf() {
  return nf.v(0 < arguments.length ? new I(Array.prototype.slice.call(arguments, 0), 0) : null);
};
nf.v = function(a) {
  for (var b = F(a), c = Bc(rg);;) {
    if (b) {
      a = K(K(b));
      var d = J(b), b = Id(b), c = Fc(c, d, b), b = a;
    } else {
      return Ec(c);
    }
  }
};
nf.H = 0;
nf.D = function(a) {
  return nf.v(F(a));
};
var Wg = function Wg() {
  return Wg.v(0 < arguments.length ? new I(Array.prototype.slice.call(arguments, 0), 0) : null);
};
Wg.v = function(a) {
  a = a instanceof I && 0 === a.i ? a.j : yb(a);
  return sg(a);
};
Wg.H = 0;
Wg.D = function(a) {
  return Wg.v(F(a));
};
function Xg(a, b) {
  this.xa = a;
  this.za = b;
  this.A = 32374988;
  this.J = 0;
}
h = Xg.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.za;
};
h.va = function() {
  var a = this.xa, a = (a ? a.A & 128 || a.gc || (a.A ? 0 : w(Ob, a)) : w(Ob, a)) ? this.xa.va(null) : K(this.xa);
  return null == a ? null : new Xg(a, this.za);
};
h.N = function() {
  return od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(kd, this.za);
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.ba = function() {
  return this.xa.ba(null).Vc();
};
h.Ba = function() {
  var a = this.xa, a = (a ? a.A & 128 || a.gc || (a.A ? 0 : w(Ob, a)) : w(Ob, a)) ? this.xa.va(null) : K(this.xa);
  return null != a ? new Xg(a, this.za) : kd;
};
h.Y = function() {
  return this;
};
h.W = function(a, b) {
  return new Xg(this.xa, b);
};
h.X = function(a, b) {
  return N(b, this);
};
Xg.prototype[vb] = function() {
  return md(this);
};
function ng(a) {
  return (a = F(a)) ? new Xg(a, null) : null;
}
function tg(a) {
  return Wb(a);
}
function Yg(a, b) {
  this.xa = a;
  this.za = b;
  this.A = 32374988;
  this.J = 0;
}
h = Yg.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.T = function() {
  return this.za;
};
h.va = function() {
  var a = this.xa, a = (a ? a.A & 128 || a.gc || (a.A ? 0 : w(Ob, a)) : w(Ob, a)) ? this.xa.va(null) : K(this.xa);
  return null == a ? null : new Yg(a, this.za);
};
h.N = function() {
  return od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(kd, this.za);
};
h.ra = function(a, b) {
  return Ed(b, this);
};
h.sa = function(a, b, c) {
  return Gd(b, c, this);
};
h.ba = function() {
  return this.xa.ba(null).Wc();
};
h.Ba = function() {
  var a = this.xa, a = (a ? a.A & 128 || a.gc || (a.A ? 0 : w(Ob, a)) : w(Ob, a)) ? this.xa.va(null) : K(this.xa);
  return null != a ? new Yg(a, this.za) : kd;
};
h.Y = function() {
  return this;
};
h.W = function(a, b) {
  return new Yg(this.xa, b);
};
h.X = function(a, b) {
  return N(b, this);
};
Yg.prototype[vb] = function() {
  return md(this);
};
function og(a) {
  return (a = F(a)) ? new Yg(a, null) : null;
}
function ug(a) {
  return Xb(a);
}
var Zg = function Zg() {
  return Zg.v(0 < arguments.length ? new I(Array.prototype.slice.call(arguments, 0), 0) : null);
};
Zg.v = function(a) {
  return v(df(ue, a)) ? se(function(a, c) {
    return Ld.c(v(a) ? a : Z, c);
  }, a) : null;
};
Zg.H = 0;
Zg.D = function(a) {
  return Zg.v(F(a));
};
function $g(a, b) {
  return v(df(ue, b)) ? se(function(a) {
    return function(b, e) {
      return Ab(a, v(b) ? b : Z, F(e));
    };
  }(function(b, d) {
    var e = J(d), f = Id(d);
    return ke(b, e) ? T.l(b, e, function() {
      var d = S(b, e);
      return a.c ? a.c(d, f) : a.call(null, d, f);
    }()) : T.l(b, e, f);
  }), b) : null;
}
function ah(a, b, c) {
  this.meta = a;
  this.ib = b;
  this.G = c;
  this.A = 15077647;
  this.J = 8196;
}
h = ah.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.keys = function() {
  return md(F(this));
};
h.entries = function() {
  var a = F(this);
  return new jg(F(a));
};
h.values = function() {
  return md(F(this));
};
h.has = function(a) {
  return ke(this, a);
};
h.forEach = function(a) {
  for (var b = F(this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = c.P(null, e), g = R(f, 0), f = R(f, 1);
      a.c ? a.c(f, g) : a.call(null, f, g);
      e += 1;
    } else {
      if (b = F(b)) {
        ce(b) ? (c = Kc(b), b = Lc(b), g = c, d = P(c), c = g) : (c = J(b), g = R(c, 0), c = f = R(c, 1), a.c ? a.c(c, g) : a.call(null, c, g), b = K(b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
h.U = function(a, b) {
  return Qb.l(this, b, null);
};
h.R = function(a, b, c) {
  return Rb(this.ib, b) ? b : c;
};
h.T = function() {
  return this.meta;
};
h.$ = function() {
  return Gb(this.ib);
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = qd(this);
};
h.I = function(a, b) {
  return Zd(b) && P(this) === P(b) && cf(function(a) {
    return function(b) {
      return ke(a, b);
    };
  }(this), b);
};
h.ob = function() {
  return new bh(Bc(this.ib));
};
h.aa = function() {
  return Dd(ch, this.meta);
};
h.Ad = function(a, b) {
  return new ah(this.meta, Ub(this.ib, b), null);
};
h.Y = function() {
  return ng(this.ib);
};
h.W = function(a, b) {
  return new ah(b, this.ib, this.G);
};
h.X = function(a, b) {
  return new ah(this.meta, T.l(this.ib, b, null), null);
};
h.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.U(null, c);
      case 3:
        return this.R(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.c = function(a, c) {
    return this.U(null, c);
  };
  a.l = function(a, c, d) {
    return this.R(null, c, d);
  };
  return a;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.h = function(a) {
  return this.U(null, a);
};
h.c = function(a, b) {
  return this.R(null, a, b);
};
var ch = new ah(null, Z, rd);
ah.prototype[vb] = function() {
  return md(this);
};
function bh(a) {
  this.Wa = a;
  this.J = 136;
  this.A = 259;
}
h = bh.prototype;
h.fb = function(a, b) {
  this.Wa = Fc(this.Wa, b, null);
  return this;
};
h.pb = function() {
  return new ah(null, Ec(this.Wa), null);
};
h.$ = function() {
  return P(this.Wa);
};
h.U = function(a, b) {
  return Qb.l(this, b, null);
};
h.R = function(a, b, c) {
  return Qb.l(this.Wa, b, fe) === fe ? c : b;
};
h.call = function() {
  function a(a, b, c) {
    return Qb.l(this.Wa, b, fe) === fe ? c : b;
  }
  function b(a, b) {
    return Qb.l(this.Wa, b, fe) === fe ? null : b;
  }
  var c = null, c = function(c, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, c, e);
      case 3:
        return a.call(this, c, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  c.c = b;
  c.l = a;
  return c;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.h = function(a) {
  return Qb.l(this.Wa, a, fe) === fe ? null : a;
};
h.c = function(a, b) {
  return Qb.l(this.Wa, a, fe) === fe ? b : a;
};
function dh(a) {
  a = F(a);
  if (null == a) {
    return ch;
  }
  if (a instanceof I && 0 === a.i) {
    a = a.j;
    a: {
      for (var b = 0, c = Bc(ch);;) {
        if (b < a.length) {
          var d = b + 1, c = c.fb(null, a[b]), b = d
        } else {
          break a;
        }
      }
    }
    return c.pb(null);
  }
  for (d = Bc(ch);;) {
    if (null != a) {
      b = K(a), d = d.fb(null, a.ba(null)), a = b;
    } else {
      return Ec(d);
    }
  }
}
function eh(a) {
  for (var b = Md;;) {
    if (K(a)) {
      b = Ld.c(b, J(a)), a = K(a);
    } else {
      return F(b);
    }
  }
}
function Ke(a) {
  if (a && (a.J & 4096 || a.zd)) {
    return a.Kb(null);
  }
  if ("string" === typeof a) {
    return a;
  }
  throw Error([z("Doesn't support name: "), z(a)].join(""));
}
function fh(a, b) {
  return new Le(null, function() {
    var c = F(b);
    if (c) {
      var d;
      d = J(c);
      d = a.h ? a.h(d) : a.call(null, d);
      c = v(d) ? N(J(c), fh(a, jd(c))) : null;
    } else {
      c = null;
    }
    return c;
  }, null, null);
}
function gh(a, b, c) {
  this.i = a;
  this.end = b;
  this.step = c;
}
gh.prototype.vc = function() {
  return 0 < this.step ? this.i < this.end : this.i > this.end;
};
gh.prototype.next = function() {
  var a = this.i;
  this.i += this.step;
  return a;
};
function hh(a, b, c, d, e) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d;
  this.G = e;
  this.A = 32375006;
  this.J = 8192;
}
h = hh.prototype;
h.toString = function() {
  return Tc(this);
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.P = function(a, b) {
  if (b < Gb(this)) {
    return this.start + b * this.step;
  }
  if (this.start > this.end && 0 === this.step) {
    return this.start;
  }
  throw Error("Index out of bounds");
};
h.Ca = function(a, b, c) {
  return b < Gb(this) ? this.start + b * this.step : this.start > this.end && 0 === this.step ? this.start : c;
};
h.Ib = function() {
  return new gh(this.start, this.end, this.step);
};
h.T = function() {
  return this.meta;
};
h.va = function() {
  return 0 < this.step ? this.start + this.step < this.end ? new hh(this.meta, this.start + this.step, this.end, this.step, null) : null : this.start + this.step > this.end ? new hh(this.meta, this.start + this.step, this.end, this.step, null) : null;
};
h.$ = function() {
  return sb(qc(this)) ? 0 : Math.ceil((this.end - this.start) / this.step);
};
h.N = function() {
  var a = this.G;
  return null != a ? a : this.G = a = od(this);
};
h.I = function(a, b) {
  return Bd(this, b);
};
h.aa = function() {
  return Dd(kd, this.meta);
};
h.ra = function(a, b) {
  return sd(this, b);
};
h.sa = function(a, b, c) {
  for (a = this.start;;) {
    if (0 < this.step ? a < this.end : a > this.end) {
      var d = a;
      c = b.c ? b.c(c, d) : b.call(null, c, d);
      a += this.step;
    } else {
      return c;
    }
  }
};
h.ba = function() {
  return null == qc(this) ? null : this.start;
};
h.Ba = function() {
  return null != qc(this) ? new hh(this.meta, this.start + this.step, this.end, this.step, null) : kd;
};
h.Y = function() {
  return 0 < this.step ? this.start < this.end ? this : null : this.start > this.end ? this : null;
};
h.W = function(a, b) {
  return new hh(b, this.start, this.end, this.step, this.G);
};
h.X = function(a, b) {
  return N(b, this);
};
hh.prototype[vb] = function() {
  return md(this);
};
function ih(a) {
  a: {
    for (var b = a;;) {
      if (F(b)) {
        b = K(b);
      } else {
        break a;
      }
    }
  }
  return a;
}
function jh(a, b) {
  if ("string" === typeof b) {
    var c = a.exec(b);
    return L.c(J(c), b) ? 1 === P(c) ? J(c) : Vf(c) : null;
  }
  throw new TypeError("re-matches must match against a string.");
}
function kh(a, b) {
  if ("string" === typeof b) {
    var c = a.exec(b);
    return null == c ? null : 1 === P(c) ? J(c) : Vf(c);
  }
  throw new TypeError("re-find must match against a string.");
}
var lh = function lh(b, c) {
  var d = kh(b, c), e = c.search(b), f = Yd(d) ? J(d) : d, g = Ce(c, e + P(f));
  return v(d) ? new Le(null, function(c, d, e, f) {
    return function() {
      return N(c, F(f) ? lh(b, f) : null);
    };
  }(d, e, f, g), null, null) : null;
};
function mh(a) {
  if (a instanceof RegExp) {
    return a;
  }
  var b = kh(/^\(\?([idmsux]*)\)/, a), c = R(b, 0), b = R(b, 1);
  a = Ce(a, P(c));
  return new RegExp(a, v(b) ? b : "");
}
function nh(a, b, c, d, e, f, g) {
  var k = hb;
  hb = null == hb ? null : hb - 1;
  try {
    if (null != hb && 0 > hb) {
      return vc(a, "#");
    }
    vc(a, c);
    if (0 === pb.h(f)) {
      F(g) && vc(a, function() {
        var a = oh.h(f);
        return v(a) ? a : "...";
      }());
    } else {
      if (F(g)) {
        var l = J(g);
        b.l ? b.l(l, a, f) : b.call(null, l, a, f);
      }
      for (var p = K(g), m = pb.h(f) - 1;;) {
        if (!p || null != m && 0 === m) {
          F(p) && 0 === m && (vc(a, d), vc(a, function() {
            var a = oh.h(f);
            return v(a) ? a : "...";
          }()));
          break;
        } else {
          vc(a, d);
          var q = J(p);
          c = a;
          g = f;
          b.l ? b.l(q, c, g) : b.call(null, q, c, g);
          var r = K(p);
          c = m - 1;
          p = r;
          m = c;
        }
      }
    }
    return vc(a, e);
  } finally {
    hb = k;
  }
}
function ph(a, b) {
  for (var c = F(b), d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = d.P(null, f);
      vc(a, g);
      f += 1;
    } else {
      if (c = F(c)) {
        d = c, ce(d) ? (c = Kc(d), e = Lc(d), d = c, g = P(c), c = e, e = g) : (g = J(d), vc(a, g), c = K(d), d = null, e = 0), f = 0;
      } else {
        return null;
      }
    }
  }
}
var qh = {'"':'\\"', "\\":"\\\\", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t"};
function rh(a) {
  return [z('"'), z(a.replace(RegExp('[\\\\"\b\f\n\r\t]', "g"), function(a) {
    return qh[a];
  })), z('"')].join("");
}
function sh(a, b, c) {
  if (null == a) {
    return vc(b, "nil");
  }
  if (void 0 === a) {
    return vc(b, "#\x3cundefined\x3e");
  }
  if (v(function() {
    var b = S(c, mb);
    return v(b) ? (b = a ? a.A & 131072 || a.le ? !0 : a.A ? !1 : w(fc, a) : w(fc, a)) ? Vd(a) : b : b;
  }())) {
    vc(b, "^");
    var d = Vd(a);
    th.l ? th.l(d, b, c) : th.call(null, d, b, c);
    vc(b, " ");
  }
  return null == a ? vc(b, "nil") : a.Ed ? a.ne(a, b, c) : a && (a.A & 2147483648 || a.V) ? a.L(null, b, c) : tb(a) === Boolean || "number" === typeof a ? vc(b, "" + z(a)) : null != a && a.constructor === Object ? (vc(b, "#js "), d = W.c(function(b) {
    return new X(null, 2, 5, Y, [Je.h(b), a[b]], null);
  }, de(a)), uh.C ? uh.C(d, th, b, c) : uh.call(null, d, th, b, c)) : rb(a) ? nh(b, th, "#js [", " ", "]", c, a) : v(ca(a)) ? v(lb.h(c)) ? vc(b, rh(a)) : vc(b, a) : Sd(a) ? ph(b, O(["#\x3c", "" + z(a), "\x3e"], 0)) : a instanceof Date ? (d = function(a, b) {
    for (var c = "" + z(a);;) {
      if (P(c) < b) {
        c = [z("0"), z(c)].join("");
      } else {
        return c;
      }
    }
  }, ph(b, O(['#inst "', "" + z(a.getUTCFullYear()), "-", d(a.getUTCMonth() + 1, 2), "-", d(a.getUTCDate(), 2), "T", d(a.getUTCHours(), 2), ":", d(a.getUTCMinutes(), 2), ":", d(a.getUTCSeconds(), 2), ".", d(a.getUTCMilliseconds(), 3), "-", '00:00"'], 0))) : v(a instanceof RegExp) ? ph(b, O(['#"', a.source, '"'], 0)) : (a ? a.A & 2147483648 || a.V || (a.A ? 0 : w(wc, a)) : w(wc, a)) ? xc(a, b, c) : ph(b, O(["#\x3c", "" + z(a), "\x3e"], 0));
}
function th(a, b, c) {
  var d = vh.h(c);
  return v(d) ? (c = T.l(c, wh, sh), d.l ? d.l(a, b, c) : d.call(null, a, b, c)) : sh(a, b, c);
}
function xh(a) {
  var b = jb();
  if (Xd(a)) {
    b = "";
  } else {
    var c = z, d = new Ua;
    a: {
      var e = new Sc(d);
      th(J(a), e, b);
      a = F(K(a));
      for (var f = null, g = 0, k = 0;;) {
        if (k < g) {
          var l = f.P(null, k);
          vc(e, " ");
          th(l, e, b);
          k += 1;
        } else {
          if (a = F(a)) {
            f = a, ce(f) ? (a = Kc(f), g = Lc(f), f = a, l = P(a), a = g, g = l) : (l = J(f), vc(e, " "), th(l, e, b), a = K(f), f = null, g = 0), k = 0;
          } else {
            break a;
          }
        }
      }
    }
    b = "" + c(d);
  }
  return b;
}
function pf() {
  return yh(0 < arguments.length ? new I(Array.prototype.slice.call(arguments, 0), 0) : null);
}
function yh(a) {
  return xh(a);
}
function zh(a) {
  a = xh(a);
  fb.h ? fb.h(a) : fb.call(null, a);
  v(gb) ? (a = jb(), fb.h ? fb.h("\n") : fb.call(null, "\n"), a = (S(a, kb), null)) : a = null;
  return a;
}
function uh(a, b, c, d) {
  return nh(c, function(a, c, d) {
    var k = Wb(a);
    b.l ? b.l(k, c, d) : b.call(null, k, c, d);
    vc(c, " ");
    a = Xb(a);
    return b.l ? b.l(a, c, d) : b.call(null, a, c, d);
  }, "{", ", ", "}", d, F(a));
}
I.prototype.V = !0;
I.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
Le.prototype.V = !0;
Le.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
Og.prototype.V = !0;
Og.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
lg.prototype.V = !0;
lg.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
Xf.prototype.V = !0;
Xf.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
He.prototype.V = !0;
He.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
Ad.prototype.V = !0;
Ad.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
Sg.prototype.V = !0;
Sg.prototype.L = function(a, b, c) {
  return uh(this, th, b, c);
};
Qg.prototype.V = !0;
Qg.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
ag.prototype.V = !0;
ag.prototype.L = function(a, b, c) {
  return nh(b, th, "[", " ", "]", c, this);
};
ah.prototype.V = !0;
ah.prototype.L = function(a, b, c) {
  return nh(b, th, "#{", " ", "}", c, this);
};
Qe.prototype.V = !0;
Qe.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
kf.prototype.V = !0;
kf.prototype.L = function(a, b, c) {
  vc(b, "#\x3cAtom: ");
  th(this.state, b, c);
  return vc(b, "\x3e");
};
Yg.prototype.V = !0;
Yg.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
X.prototype.V = !0;
X.prototype.L = function(a, b, c) {
  return nh(b, th, "[", " ", "]", c, this);
};
Ee.prototype.V = !0;
Ee.prototype.L = function(a, b) {
  return vc(b, "()");
};
u.prototype.V = !0;
u.prototype.L = function(a, b, c) {
  return uh(this, th, b, c);
};
hh.prototype.V = !0;
hh.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
Xg.prototype.V = !0;
Xg.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
De.prototype.V = !0;
De.prototype.L = function(a, b, c) {
  return nh(b, th, "(", " ", ")", c, this);
};
E.prototype.Gb = !0;
E.prototype.eb = function(a, b) {
  if (b instanceof E) {
    return dd(this, b);
  }
  throw Error([z("Cannot compare "), z(this), z(" to "), z(b)].join(""));
};
U.prototype.Gb = !0;
U.prototype.eb = function(a, b) {
  if (b instanceof U) {
    return Ie(this, b);
  }
  throw Error([z("Cannot compare "), z(this), z(" to "), z(b)].join(""));
};
ag.prototype.Gb = !0;
ag.prototype.eb = function(a, b) {
  if (be(b)) {
    return me(this, b);
  }
  throw Error([z("Cannot compare "), z(this), z(" to "), z(b)].join(""));
};
X.prototype.Gb = !0;
X.prototype.eb = function(a, b) {
  if (be(b)) {
    return me(this, b);
  }
  throw Error([z("Cannot compare "), z(this), z(" to "), z(b)].join(""));
};
var gd = null, Ah = {}, Bh = function Bh(b) {
  if (b ? b.ie : b) {
    return b.ie(b);
  }
  var c;
  c = Bh[n(null == b ? null : b)];
  if (!c && (c = Bh._, !c)) {
    throw x("IEncodeJS.-clj-\x3ejs", b);
  }
  return c.call(null, b);
};
function Ch(a) {
  return (a ? v(v(null) ? null : a.he) || (a.cd ? 0 : w(Ah, a)) : w(Ah, a)) ? Bh(a) : "string" === typeof a || "number" === typeof a || a instanceof U || a instanceof E ? Dh.h ? Dh.h(a) : Dh.call(null, a) : yh(O([a], 0));
}
var Dh = function Dh(b) {
  if (null == b) {
    return null;
  }
  if (b ? v(v(null) ? null : b.he) || (b.cd ? 0 : w(Ah, b)) : w(Ah, b)) {
    return Bh(b);
  }
  if (b instanceof U) {
    return Ke(b);
  }
  if (b instanceof E) {
    return "" + z(b);
  }
  if (ae(b)) {
    var c = {};
    b = F(b);
    for (var d = null, e = 0, f = 0;;) {
      if (f < e) {
        var g = d.P(null, f), k = R(g, 0), g = R(g, 1);
        c[Ch(k)] = Dh(g);
        f += 1;
      } else {
        if (b = F(b)) {
          ce(b) ? (e = Kc(b), b = Lc(b), d = e, e = P(e)) : (e = J(b), d = R(e, 0), e = R(e, 1), c[Ch(d)] = Dh(e), b = K(b), d = null, e = 0), f = 0;
        } else {
          break;
        }
      }
    }
    return c;
  }
  if (Yd(b)) {
    c = [];
    b = F(W.c(Dh, b));
    d = null;
    for (f = e = 0;;) {
      if (f < e) {
        k = d.P(null, f), c.push(k), f += 1;
      } else {
        if (b = F(b)) {
          d = b, ce(d) ? (b = Kc(d), f = Lc(d), d = b, e = P(b), b = f) : (b = J(d), c.push(b), b = K(d), d = null, e = 0), f = 0;
        } else {
          break;
        }
      }
    }
    return c;
  }
  return b;
}, Eh = {}, Fh = function Fh(b, c) {
  if (b ? b.ge : b) {
    return b.ge(b, c);
  }
  var d;
  d = Fh[n(null == b ? null : b)];
  if (!d && (d = Fh._, !d)) {
    throw x("IEncodeClojure.-js-\x3eclj", b);
  }
  return d.call(null, b, c);
};
function Gh(a) {
  var b = O([Hh, !0], 0), c = he(b) ? Ye(nf, b) : b, d = S(c, Hh);
  return function(a, c, d, k) {
    return function p(m) {
      return (m ? v(v(null) ? null : m.Xe) || (m.cd ? 0 : w(Eh, m)) : w(Eh, m)) ? Fh(m, Ye(Wg, b)) : he(m) ? ih(W.c(p, m)) : Yd(m) ? xf.c(null == m ? null : Hb(m), W.c(p, m)) : rb(m) ? Vf(W.c(p, m)) : tb(m) === Object ? xf.c(Z, function() {
        return function(a, b, c, d) {
          return function B(e) {
            return new Le(null, function(a, b, c, d) {
              return function() {
                for (;;) {
                  var a = F(e);
                  if (a) {
                    if (ce(a)) {
                      var b = Kc(a), c = P(b), f = Pe(c);
                      return function() {
                        for (var a = 0;;) {
                          if (a < c) {
                            var e = C.c(b, a), g = f, k = Y, t;
                            t = e;
                            t = d.h ? d.h(t) : d.call(null, t);
                            e = new X(null, 2, 5, k, [t, p(m[e])], null);
                            g.add(e);
                            a += 1;
                          } else {
                            return !0;
                          }
                        }
                      }() ? Re(f.Aa(), B(Lc(a))) : Re(f.Aa(), null);
                    }
                    var g = J(a);
                    return N(new X(null, 2, 5, Y, [function() {
                      var a = g;
                      return d.h ? d.h(a) : d.call(null, a);
                    }(), p(m[g])], null), B(jd(a)));
                  }
                  return null;
                }
              };
            }(a, b, c, d), null, null);
          };
        }(a, c, d, k)(de(m));
      }()) : m;
    };
  }(b, c, d, v(d) ? Je : z)(a);
}
var Ih = null;
function Jh() {
  if (null == Ih) {
    var a = new u(null, 3, [Kh, Z, Lh, Z, Mh, Z], null);
    Ih = mf ? mf(a) : lf.call(null, a);
  }
  return Ih;
}
function Nh(a, b, c) {
  var d = L.c(b, c);
  if (!d && !(d = ke(Mh.h(a).call(null, b), c)) && (d = be(c)) && (d = be(b))) {
    if (d = P(c) === P(b)) {
      for (var e = !0, f = 0;;) {
        if (e && f !== P(c)) {
          e = Nh(a, function() {
            var a = f;
            return b.h ? b.h(a) : b.call(null, a);
          }(), function() {
            var a = f;
            return c.h ? c.h(a) : c.call(null, a);
          }()), f = d = f + 1;
        } else {
          return e;
        }
      }
    } else {
      return d;
    }
  } else {
    return d;
  }
}
function Oh(a) {
  var b;
  b = Jh();
  b = M.h ? M.h(b) : M.call(null, b);
  a = S(Kh.h(b), a);
  return F(a) ? a : null;
}
function Ph(a, b, c, d) {
  fd.c(a, function() {
    return M.h ? M.h(b) : M.call(null, b);
  });
  fd.c(c, function() {
    return M.h ? M.h(d) : M.call(null, d);
  });
}
var Rh = function Rh(b, c, d) {
  var e = (M.h ? M.h(d) : M.call(null, d)).call(null, b), e = v(v(e) ? e.h ? e.h(c) : e.call(null, c) : e) ? !0 : null;
  if (v(e)) {
    return e;
  }
  e = function() {
    for (var e = Oh(c);;) {
      if (0 < P(e)) {
        Rh(b, J(e), d), e = jd(e);
      } else {
        return null;
      }
    }
  }();
  if (v(e)) {
    return e;
  }
  e = function() {
    for (var e = Oh(b);;) {
      if (0 < P(e)) {
        Rh(J(e), c, d), e = jd(e);
      } else {
        return null;
      }
    }
  }();
  return v(e) ? e : !1;
};
function Sh(a, b, c) {
  c = Rh(a, b, c);
  if (v(c)) {
    a = c;
  } else {
    c = Nh;
    var d;
    d = Jh();
    d = M.h ? M.h(d) : M.call(null, d);
    a = c(d, a, b);
  }
  return a;
}
var Th = function Th(b, c, d, e, f, g, k) {
  var l = Ab(function(e, g) {
    var k = R(g, 0);
    R(g, 1);
    if (Nh(M.h ? M.h(d) : M.call(null, d), c, k)) {
      var l;
      l = (l = null == e) ? l : Sh(k, J(e), f);
      l = v(l) ? g : e;
      if (!v(Sh(J(l), k, f))) {
        throw Error([z("Multiple methods in multimethod '"), z(b), z("' match dispatch value: "), z(c), z(" -\x3e "), z(k), z(" and "), z(J(l)), z(", and neither is preferred")].join(""));
      }
      return l;
    }
    return e;
  }, null, M.h ? M.h(e) : M.call(null, e));
  if (v(l)) {
    if (L.c(M.h ? M.h(k) : M.call(null, k), M.h ? M.h(d) : M.call(null, d))) {
      return fd.C(g, T, c, Id(l)), Id(l);
    }
    Ph(g, e, k, d);
    return Th(b, c, d, e, f, g, k);
  }
  return null;
};
function Uh(a, b) {
  throw Error([z("No method in multimethod '"), z(a), z("' for dispatch value: "), z(b)].join(""));
}
function Vh(a, b, c, d, e, f, g, k) {
  this.name = a;
  this.o = b;
  this.pe = c;
  this.xc = d;
  this.Zb = e;
  this.ve = f;
  this.Bc = g;
  this.bc = k;
  this.A = 4194305;
  this.J = 4352;
}
h = Vh.prototype;
h.call = function() {
  function a(a, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H, Q, ea) {
    a = this;
    var va = bf(a.o, b, c, d, e, O([f, g, k, l, m, p, t, q, r, y, A, B, G, D, H, Q, ea], 0)), Yk = Wh(this, va);
    v(Yk) || Uh(a.name, va);
    return bf(Yk, b, c, d, e, O([f, g, k, l, m, p, t, q, r, y, A, B, G, D, H, Q, ea], 0));
  }
  function b(a, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H, Q) {
    a = this;
    var ea = a.o.na ? a.o.na(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H, Q) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H, Q), va = Wh(this, ea);
    v(va) || Uh(a.name, ea);
    return va.na ? va.na(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H, Q) : va.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H, Q);
  }
  function c(a, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H) {
    a = this;
    var Q = a.o.ma ? a.o.ma(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H), ea = Wh(this, Q);
    v(ea) || Uh(a.name, Q);
    return ea.ma ? ea.ma(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H) : ea.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D, H);
  }
  function d(a, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D) {
    a = this;
    var H = a.o.la ? a.o.la(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D), Q = Wh(this, H);
    v(Q) || Uh(a.name, H);
    return Q.la ? Q.la(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D) : Q.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G, D);
  }
  function e(a, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G) {
    a = this;
    var D = a.o.ka ? a.o.ka(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G), H = Wh(this, D);
    v(H) || Uh(a.name, D);
    return H.ka ? H.ka(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G) : H.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B, G);
  }
  function f(a, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B) {
    a = this;
    var G = a.o.ja ? a.o.ja(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B), D = Wh(this, G);
    v(D) || Uh(a.name, G);
    return D.ja ? D.ja(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B) : D.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A, B);
  }
  function g(a, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A) {
    a = this;
    var B = a.o.ia ? a.o.ia(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A), G = Wh(this, B);
    v(G) || Uh(a.name, B);
    return G.ia ? G.ia(b, c, d, e, f, g, k, l, m, p, t, q, r, y, A) : G.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y, A);
  }
  function k(a, b, c, d, e, f, g, k, l, m, p, t, q, r, y) {
    a = this;
    var A = a.o.ha ? a.o.ha(b, c, d, e, f, g, k, l, m, p, t, q, r, y) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y), B = Wh(this, A);
    v(B) || Uh(a.name, A);
    return B.ha ? B.ha(b, c, d, e, f, g, k, l, m, p, t, q, r, y) : B.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r, y);
  }
  function l(a, b, c, d, e, f, g, k, l, m, p, t, q, r) {
    a = this;
    var y = a.o.ga ? a.o.ga(b, c, d, e, f, g, k, l, m, p, t, q, r) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r), A = Wh(this, y);
    v(A) || Uh(a.name, y);
    return A.ga ? A.ga(b, c, d, e, f, g, k, l, m, p, t, q, r) : A.call(null, b, c, d, e, f, g, k, l, m, p, t, q, r);
  }
  function p(a, b, c, d, e, f, g, k, l, m, p, t, q) {
    a = this;
    var r = a.o.fa ? a.o.fa(b, c, d, e, f, g, k, l, m, p, t, q) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t, q), y = Wh(this, r);
    v(y) || Uh(a.name, r);
    return y.fa ? y.fa(b, c, d, e, f, g, k, l, m, p, t, q) : y.call(null, b, c, d, e, f, g, k, l, m, p, t, q);
  }
  function m(a, b, c, d, e, f, g, k, l, m, p, t) {
    a = this;
    var q = a.o.ea ? a.o.ea(b, c, d, e, f, g, k, l, m, p, t) : a.o.call(null, b, c, d, e, f, g, k, l, m, p, t), r = Wh(this, q);
    v(r) || Uh(a.name, q);
    return r.ea ? r.ea(b, c, d, e, f, g, k, l, m, p, t) : r.call(null, b, c, d, e, f, g, k, l, m, p, t);
  }
  function q(a, b, c, d, e, f, g, k, l, m, p) {
    a = this;
    var t = a.o.da ? a.o.da(b, c, d, e, f, g, k, l, m, p) : a.o.call(null, b, c, d, e, f, g, k, l, m, p), q = Wh(this, t);
    v(q) || Uh(a.name, t);
    return q.da ? q.da(b, c, d, e, f, g, k, l, m, p) : q.call(null, b, c, d, e, f, g, k, l, m, p);
  }
  function r(a, b, c, d, e, f, g, k, l, m) {
    a = this;
    var p = a.o.qa ? a.o.qa(b, c, d, e, f, g, k, l, m) : a.o.call(null, b, c, d, e, f, g, k, l, m), t = Wh(this, p);
    v(t) || Uh(a.name, p);
    return t.qa ? t.qa(b, c, d, e, f, g, k, l, m) : t.call(null, b, c, d, e, f, g, k, l, m);
  }
  function t(a, b, c, d, e, f, g, k, l) {
    a = this;
    var m = a.o.pa ? a.o.pa(b, c, d, e, f, g, k, l) : a.o.call(null, b, c, d, e, f, g, k, l), p = Wh(this, m);
    v(p) || Uh(a.name, m);
    return p.pa ? p.pa(b, c, d, e, f, g, k, l) : p.call(null, b, c, d, e, f, g, k, l);
  }
  function y(a, b, c, d, e, f, g, k) {
    a = this;
    var l = a.o.oa ? a.o.oa(b, c, d, e, f, g, k) : a.o.call(null, b, c, d, e, f, g, k), m = Wh(this, l);
    v(m) || Uh(a.name, l);
    return m.oa ? m.oa(b, c, d, e, f, g, k) : m.call(null, b, c, d, e, f, g, k);
  }
  function A(a, b, c, d, e, f, g) {
    a = this;
    var k = a.o.S ? a.o.S(b, c, d, e, f, g) : a.o.call(null, b, c, d, e, f, g), l = Wh(this, k);
    v(l) || Uh(a.name, k);
    return l.S ? l.S(b, c, d, e, f, g) : l.call(null, b, c, d, e, f, g);
  }
  function B(a, b, c, d, e, f) {
    a = this;
    var g = a.o.K ? a.o.K(b, c, d, e, f) : a.o.call(null, b, c, d, e, f), k = Wh(this, g);
    v(k) || Uh(a.name, g);
    return k.K ? k.K(b, c, d, e, f) : k.call(null, b, c, d, e, f);
  }
  function G(a, b, c, d, e) {
    a = this;
    var f = a.o.C ? a.o.C(b, c, d, e) : a.o.call(null, b, c, d, e), g = Wh(this, f);
    v(g) || Uh(a.name, f);
    return g.C ? g.C(b, c, d, e) : g.call(null, b, c, d, e);
  }
  function H(a, b, c, d) {
    a = this;
    var e = a.o.l ? a.o.l(b, c, d) : a.o.call(null, b, c, d), f = Wh(this, e);
    v(f) || Uh(a.name, e);
    return f.l ? f.l(b, c, d) : f.call(null, b, c, d);
  }
  function Q(a, b, c) {
    a = this;
    var d = a.o.c ? a.o.c(b, c) : a.o.call(null, b, c), e = Wh(this, d);
    v(e) || Uh(a.name, d);
    return e.c ? e.c(b, c) : e.call(null, b, c);
  }
  function ea(a, b) {
    a = this;
    var c = a.o.h ? a.o.h(b) : a.o.call(null, b), d = Wh(this, c);
    v(d) || Uh(a.name, c);
    return d.h ? d.h(b) : d.call(null, b);
  }
  function va(a) {
    a = this;
    var b = a.o.B ? a.o.B() : a.o.call(null), c = Wh(this, b);
    v(c) || Uh(a.name, b);
    return c.B ? c.B() : c.call(null);
  }
  var D = null, D = function(D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa, eb, ob, Fb, dc, Dc, Hd, ff, Qh) {
    switch(arguments.length) {
      case 1:
        return va.call(this, D);
      case 2:
        return ea.call(this, D, da);
      case 3:
        return Q.call(this, D, da, fa);
      case 4:
        return H.call(this, D, da, fa, ja);
      case 5:
        return G.call(this, D, da, fa, ja, la);
      case 6:
        return B.call(this, D, da, fa, ja, la, ma);
      case 7:
        return A.call(this, D, da, fa, ja, la, ma, pa);
      case 8:
        return y.call(this, D, da, fa, ja, la, ma, pa, ua);
      case 9:
        return t.call(this, D, da, fa, ja, la, ma, pa, ua, xa);
      case 10:
        return r.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za);
      case 11:
        return q.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da);
      case 12:
        return m.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja);
      case 13:
        return p.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc);
      case 14:
        return l.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa);
      case 15:
        return k.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa, eb);
      case 16:
        return g.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa, eb, ob);
      case 17:
        return f.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa, eb, ob, Fb);
      case 18:
        return e.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa, eb, ob, Fb, dc);
      case 19:
        return d.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa, eb, ob, Fb, dc, Dc);
      case 20:
        return c.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa, eb, ob, Fb, dc, Dc, Hd);
      case 21:
        return b.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa, eb, ob, Fb, dc, Dc, Hd, ff);
      case 22:
        return a.call(this, D, da, fa, ja, la, ma, pa, ua, xa, za, Da, Ja, pc, Wa, eb, ob, Fb, dc, Dc, Hd, ff, Qh);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  D.h = va;
  D.c = ea;
  D.l = Q;
  D.C = H;
  D.K = G;
  D.S = B;
  D.oa = A;
  D.pa = y;
  D.qa = t;
  D.da = r;
  D.ea = q;
  D.fa = m;
  D.ga = p;
  D.ha = l;
  D.ia = k;
  D.ja = g;
  D.ka = f;
  D.la = e;
  D.ma = d;
  D.na = c;
  D.Tc = b;
  D.Hb = a;
  return D;
}();
h.apply = function(a, b) {
  return this.call.apply(this, [this].concat(wb(b)));
};
h.B = function() {
  var a = this.o.B ? this.o.B() : this.o.call(null), b = Wh(this, a);
  v(b) || Uh(this.name, a);
  return b.B ? b.B() : b.call(null);
};
h.h = function(a) {
  var b = this.o.h ? this.o.h(a) : this.o.call(null, a), c = Wh(this, b);
  v(c) || Uh(this.name, b);
  return c.h ? c.h(a) : c.call(null, a);
};
h.c = function(a, b) {
  var c = this.o.c ? this.o.c(a, b) : this.o.call(null, a, b), d = Wh(this, c);
  v(d) || Uh(this.name, c);
  return d.c ? d.c(a, b) : d.call(null, a, b);
};
h.l = function(a, b, c) {
  var d = this.o.l ? this.o.l(a, b, c) : this.o.call(null, a, b, c), e = Wh(this, d);
  v(e) || Uh(this.name, d);
  return e.l ? e.l(a, b, c) : e.call(null, a, b, c);
};
h.C = function(a, b, c, d) {
  var e = this.o.C ? this.o.C(a, b, c, d) : this.o.call(null, a, b, c, d), f = Wh(this, e);
  v(f) || Uh(this.name, e);
  return f.C ? f.C(a, b, c, d) : f.call(null, a, b, c, d);
};
h.K = function(a, b, c, d, e) {
  var f = this.o.K ? this.o.K(a, b, c, d, e) : this.o.call(null, a, b, c, d, e), g = Wh(this, f);
  v(g) || Uh(this.name, f);
  return g.K ? g.K(a, b, c, d, e) : g.call(null, a, b, c, d, e);
};
h.S = function(a, b, c, d, e, f) {
  var g = this.o.S ? this.o.S(a, b, c, d, e, f) : this.o.call(null, a, b, c, d, e, f), k = Wh(this, g);
  v(k) || Uh(this.name, g);
  return k.S ? k.S(a, b, c, d, e, f) : k.call(null, a, b, c, d, e, f);
};
h.oa = function(a, b, c, d, e, f, g) {
  var k = this.o.oa ? this.o.oa(a, b, c, d, e, f, g) : this.o.call(null, a, b, c, d, e, f, g), l = Wh(this, k);
  v(l) || Uh(this.name, k);
  return l.oa ? l.oa(a, b, c, d, e, f, g) : l.call(null, a, b, c, d, e, f, g);
};
h.pa = function(a, b, c, d, e, f, g, k) {
  var l = this.o.pa ? this.o.pa(a, b, c, d, e, f, g, k) : this.o.call(null, a, b, c, d, e, f, g, k), p = Wh(this, l);
  v(p) || Uh(this.name, l);
  return p.pa ? p.pa(a, b, c, d, e, f, g, k) : p.call(null, a, b, c, d, e, f, g, k);
};
h.qa = function(a, b, c, d, e, f, g, k, l) {
  var p = this.o.qa ? this.o.qa(a, b, c, d, e, f, g, k, l) : this.o.call(null, a, b, c, d, e, f, g, k, l), m = Wh(this, p);
  v(m) || Uh(this.name, p);
  return m.qa ? m.qa(a, b, c, d, e, f, g, k, l) : m.call(null, a, b, c, d, e, f, g, k, l);
};
h.da = function(a, b, c, d, e, f, g, k, l, p) {
  var m = this.o.da ? this.o.da(a, b, c, d, e, f, g, k, l, p) : this.o.call(null, a, b, c, d, e, f, g, k, l, p), q = Wh(this, m);
  v(q) || Uh(this.name, m);
  return q.da ? q.da(a, b, c, d, e, f, g, k, l, p) : q.call(null, a, b, c, d, e, f, g, k, l, p);
};
h.ea = function(a, b, c, d, e, f, g, k, l, p, m) {
  var q = this.o.ea ? this.o.ea(a, b, c, d, e, f, g, k, l, p, m) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m), r = Wh(this, q);
  v(r) || Uh(this.name, q);
  return r.ea ? r.ea(a, b, c, d, e, f, g, k, l, p, m) : r.call(null, a, b, c, d, e, f, g, k, l, p, m);
};
h.fa = function(a, b, c, d, e, f, g, k, l, p, m, q) {
  var r = this.o.fa ? this.o.fa(a, b, c, d, e, f, g, k, l, p, m, q) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m, q), t = Wh(this, r);
  v(t) || Uh(this.name, r);
  return t.fa ? t.fa(a, b, c, d, e, f, g, k, l, p, m, q) : t.call(null, a, b, c, d, e, f, g, k, l, p, m, q);
};
h.ga = function(a, b, c, d, e, f, g, k, l, p, m, q, r) {
  var t = this.o.ga ? this.o.ga(a, b, c, d, e, f, g, k, l, p, m, q, r) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r), y = Wh(this, t);
  v(y) || Uh(this.name, t);
  return y.ga ? y.ga(a, b, c, d, e, f, g, k, l, p, m, q, r) : y.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r);
};
h.ha = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t) {
  var y = this.o.ha ? this.o.ha(a, b, c, d, e, f, g, k, l, p, m, q, r, t) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t), A = Wh(this, y);
  v(A) || Uh(this.name, y);
  return A.ha ? A.ha(a, b, c, d, e, f, g, k, l, p, m, q, r, t) : A.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t);
};
h.ia = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y) {
  var A = this.o.ia ? this.o.ia(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y), B = Wh(this, A);
  v(B) || Uh(this.name, A);
  return B.ia ? B.ia(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y) : B.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y);
};
h.ja = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A) {
  var B = this.o.ja ? this.o.ja(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A), G = Wh(this, B);
  v(G) || Uh(this.name, B);
  return G.ja ? G.ja(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A) : G.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A);
};
h.ka = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B) {
  var G = this.o.ka ? this.o.ka(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B), H = Wh(this, G);
  v(H) || Uh(this.name, G);
  return H.ka ? H.ka(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B) : H.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B);
};
h.la = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G) {
  var H = this.o.la ? this.o.la(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G), Q = Wh(this, H);
  v(Q) || Uh(this.name, H);
  return Q.la ? Q.la(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G) : Q.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G);
};
h.ma = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H) {
  var Q = this.o.ma ? this.o.ma(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H), ea = Wh(this, Q);
  v(ea) || Uh(this.name, Q);
  return ea.ma ? ea.ma(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H) : ea.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H);
};
h.na = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q) {
  var ea = this.o.na ? this.o.na(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q) : this.o.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q), va = Wh(this, ea);
  v(va) || Uh(this.name, ea);
  return va.na ? va.na(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q) : va.call(null, a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q);
};
h.Tc = function(a, b, c, d, e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea) {
  var va = bf(this.o, a, b, c, d, O([e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea], 0)), D = Wh(this, va);
  v(D) || Uh(this.name, va);
  return bf(D, a, b, c, d, O([e, f, g, k, l, p, m, q, r, t, y, A, B, G, H, Q, ea], 0));
};
function Xh(a, b, c) {
  fd.C(a.Zb, T, b, c);
  Ph(a.Bc, a.Zb, a.bc, a.xc);
}
function Wh(a, b) {
  L.c(function() {
    var b = a.bc;
    return M.h ? M.h(b) : M.call(null, b);
  }(), function() {
    var b = a.xc;
    return M.h ? M.h(b) : M.call(null, b);
  }()) || Ph(a.Bc, a.Zb, a.bc, a.xc);
  var c = function() {
    var b = a.Bc;
    return M.h ? M.h(b) : M.call(null, b);
  }().call(null, b);
  if (v(c)) {
    return c;
  }
  c = Th(a.name, b, a.xc, a.Zb, a.ve, a.Bc, a.bc);
  return v(c) ? c : function() {
    var b = a.Zb;
    return M.h ? M.h(b) : M.call(null, b);
  }().call(null, a.pe);
}
h.Kb = function() {
  return Nc(this.name);
};
h.Lb = function() {
  return Oc(this.name);
};
h.N = function() {
  return ia(this);
};
function Yh(a, b) {
  this.uuid = a;
  this.G = b;
  this.A = 2153775104;
  this.J = 2048;
}
h = Yh.prototype;
h.toString = function() {
  return this.uuid;
};
h.equiv = function(a) {
  return this.I(null, a);
};
h.I = function(a, b) {
  return b instanceof Yh && this.uuid === b.uuid;
};
h.L = function(a, b) {
  return vc(b, [z('#uuid "'), z(this.uuid), z('"')].join(""));
};
h.N = function() {
  if (null == this.G) {
    for (var a = this.uuid, b = 0, c = 0;c < a.length;++c) {
      b = 31 * b + a.charCodeAt(c), b %= 4294967296;
    }
    this.G = b;
  }
  return this.G;
};
h.eb = function(a, b) {
  return cb(this.uuid, b.uuid);
};
function Zh(a, b, c) {
  var d = Error();
  this.message = a;
  this.data = b;
  this.vd = c;
  this.name = d.name;
  this.description = d.description;
  this.number = d.number;
  this.fileName = d.fileName;
  this.lineNumber = d.lineNumber;
  this.columnNumber = d.columnNumber;
  this.stack = d.stack;
  return this;
}
Zh.prototype.__proto__ = Error.prototype;
Zh.prototype.V = !0;
Zh.prototype.L = function(a, b, c) {
  vc(b, "#ExceptionInfo{:message ");
  th(this.message, b, c);
  v(this.data) && (vc(b, ", :data "), th(this.data, b, c));
  v(this.vd) && (vc(b, ", :cause "), th(this.vd, b, c));
  return vc(b, "}");
};
Zh.prototype.toString = function() {
  return Tc(this);
};
var $h = new U(null, "role", "role", -736691072), ai = new U(null, "table.table.table-hover.campaigns-table", "table.table.table-hover.campaigns-table", 1276270880), bi = new U(null, "description", "description", -1428560544), ci = new U(null, "date-element-parser", "date-element-parser", 2072167040), di = new U(null, "hour-minute", "hour-minute", -1164421312), ei = new U(null, "_id", "_id", -789960287), fi = new U(null, "place-details", "place-details", 1251649570), gi = new U(null, "on-set", "on-set", 
-140953470), hi = new U(null, "div.col-sm-10", "div.col-sm-10", 353164674), ii = new U(null, "t-time", "t-time", -42016318), ji = new U(null, "place-add", "place-add", 904020610), ki = new U(null, "basic-ordinal-date", "basic-ordinal-date", 243220162), li = new U(null, "zoom", "zoom", -1827487038), mi = new U(null, "date", "date", -1463434462), ni = new U(null, "hour", "hour", -555989214), oi = new U(null, "*", "*", -1294732318), pi = new U(null, "home", "home", -74557309), qi = new U(null, "div.alert.alert-danger", 
"div.alert.alert-danger", -890058301), ri = new U(null, "time-no-ms", "time-no-ms", 870271683), si = new U(null, "weekyear-week-day", "weekyear-week-day", -740233533), ti = new U(null, "week-date-time", "week-date-time", 540228836), ui = new U(null, "date-hour-minute-second-fraction", "date-hour-minute-second-fraction", 1937143076), mb = new U(null, "meta", "meta", 1499536964), vi = new U(null, "tbody", "tbody", -80678300), wi = new U(null, "basic-date-time", "basic-date-time", 1525413604), xi = 
new U(null, "date-time", "date-time", 177938180), yi = new U(null, "basic-time-no-ms", "basic-time-no-ms", -1720654076), zi = new U(null, "date-parser", "date-parser", -981534587), nb = new U(null, "dup", "dup", 556298533), Ai = new U(null, "basic-week-date", "basic-week-date", 1775847845), Bi = new U(null, "ul.nav.nav-pills", "ul.nav.nav-pills", 1953877445), Ci = new U(null, "key", "key", -1516042587), Di = new U("cljs-time.core", "period", "cljs-time.core/period", 1354080486), Ei = new U(null, 
"div.alert.alert-success", "div.alert.alert-success", 1190067590), Fi = new U(null, "basic-t-time-no-ms", "basic-t-time-no-ms", -424650106), Gi = new U(null, "local-time", "local-time", -1873195290), Hi = new U(null, "div.place-param", "div.place-param", -100378874), Ii = new U(null, "transitions", "transitions", -2046216121), Ji = new U(null, "date-time-no-ms", "date-time-no-ms", 1655953671), Ki = new U(null, "year-month-day", "year-month-day", -415594169), Li = new U(null, "derefed", "derefed", 
590684583), Mi = new U(null, "place-list", "place-list", 713612711), Ni = new U(null, "date-opt-time", "date-opt-time", -1507102105), Oi = new U(null, "displayName", "displayName", -809144601), Pi = new U(null, "place-edit", "place-edit", -1837081849), Qi = new U(null, "rfc822", "rfc822", -404628697), of = new U(null, "validator", "validator", -1966190681), Ri = new U(null, "div.footer", "div.footer", 1103856744), Si = new U(null, "default", "default", -1987822328), Ti = new U(null, "cljsRender", 
"cljsRender", 247449928), Ui = new U("cljs-time.format", "formatter", "cljs-time.format/formatter", 1104417384), Vi = new U(null, "date-hour-minute-second-ms", "date-hour-minute-second-ms", -425334775), Wi = new U(null, "name", "name", 1843675177), Xi = new U(null, "basic-ordinal-date-time", "basic-ordinal-date-time", 1054564521), Yi = new U(null, "descending", "descending", -24766135), Zi = new U(null, "ordinal-date", "ordinal-date", -77899447), $i = new U(null, "td", "td", 1479933353), aj = new U(null, 
"li", "li", 723558921), bj = new U(null, "hour-minute-second-fraction", "hour-minute-second-fraction", -1253038551), cj = new U(null, "formatter", "formatter", -483008823), dj = new U(null, "value", "value", 305978217), ej = new U(null, "date-hour-minute", "date-hour-minute", 1629918346), fj = new U(null, "time", "time", 1385887882), gj = new U(null, "component-did-mount", "component-did-mount", -1126910518), hj = new U(null, "tr", "tr", -1424774646), ij = new U(null, "basic-week-date-time", "basic-week-date-time", 
-502077622), jj = new U("secretary.core", "map", "secretary.core/map", -31086646), kj = new U(null, "start", "start", -355208981), lj = new U(null, "months", "months", -45571637), mj = new U(null, "params", "params", 710516235), nj = new U(null, "label.col-sm-2.control-label", "label.col-sm-2.control-label", -947311669), oj = new U(null, "component-did-update", "component-did-update", -1468549173), pj = new U(null, "days", "days", -1394072564), qj = new U(null, "place-find", "place-find", -25889492), 
rj = new U(null, "weekyear", "weekyear", -74064500), sj = new U(null, "type", "type", 1174270348), tj = new U(null, "input.form-control", "input.form-control", -1123419636), uj = new U(null, "longitude", "longitude", -1268876372), vj = new U(null, "basic-time", "basic-time", -923134899), wh = new U(null, "fallback-impl", "fallback-impl", -1501286995), wj = new U(null, "route", "route", 329891309), kb = new U(null, "flush-on-newline", "flush-on-newline", -151457939), xj = new U(null, "componentWillUnmount", 
"componentWillUnmount", 1573788814), yj = new U(null, "div.form-group", "div.form-group", -1721134770), zj = new U(null, "hour-minute-second", "hour-minute-second", -1906654770), Aj = new U(null, "ordinal-date-time", "ordinal-date-time", -1386753458), Bj = new U(null, "seconds", "seconds", -445266194), Cj = new U(null, "ordinal-date-time-no-ms", "ordinal-date-time-no-ms", -1539005490), Dj = new U(null, "on-click", "on-click", 1632826543), Lh = new U(null, "descendants", "descendants", 1824886031), 
Ej = new U(null, "hour-minute-second-ms", "hour-minute-second-ms", 1209749775), Fj = new U(null, "prefix", "prefix", -265908465), Gj = new U(null, "center", "center", -748944368), Hj = new U(null, "shouldComponentUpdate", "shouldComponentUpdate", 1795750960), Mh = new U(null, "ancestors", "ancestors", -776045424), Ij = new U(null, "time-parser", "time-parser", -1636511536), Jj = new U(null, "div.col-sm-offset-2.col-sm-10", "div.col-sm-offset-2.col-sm-10", 353212848), Kj = new U(null, "rows", "rows", 
850049680), Lj = new U(null, "button.btn.btn-primary", "button.btn.btn-primary", 510358192), Mj = new U(null, "div", "div", 1057191632), lb = new U(null, "readably", "readably", 1129599760), Nj = new U(null, "date-time-parser", "date-time-parser", -656147568), oh = new U(null, "more-marker", "more-marker", -14717935), Oj = new U(null, "year", "year", 335913393), Pj = new U(null, "reagentRender", "reagentRender", -358306383), Qj = new U(null, "t-time-no-ms", "t-time-no-ms", 990689905), Rj = new U(null, 
"basic-week-date-time-no-ms", "basic-week-date-time-no-ms", -2043113679), Sj = new U(null, "place-found", "place-found", 1457931057), Tj = new U(null, "render", "render", -1408033454), Uj = new U(null, "parser", "parser", -1543495310), Vj = new U(null, "basic-date", "basic-date", 1566551506), Wj = new U(null, "success", "success", 1890645906), Xj = new U(null, "reagent-render", "reagent-render", -985383853), Yj = new U(null, "div.container", "div.container", 72419955), Zj = new U(null, "h3.text-muted", 
"h3.text-muted", -652753069), ak = new U(null, "weekyear-week", "weekyear-week", 795291571), pb = new U(null, "print-length", "print-length", 1931866356), bk = new U(null, "div.header", "div.header", 1964513620), ck = new U(null, "local-date", "local-date", 1829761428), dk = new U(null, "basic-ordinal-date-time-no-ms", "basic-ordinal-date-time-no-ms", -395135436), ek = new U(null, "id", "id", -1388402092), fk = new U(null, "form.form-horizontal", "form.form-horizontal", -1605711052), gk = new U(null, 
"div#place-edit-map-canvas", "div#place-edit-map-canvas", -2133638316), hk = new U(null, "year-month", "year-month", 735283381), ik = new U(null, "auto-run", "auto-run", 1958400437), jk = new U(null, "cljsName", "cljsName", 999824949), Kh = new U(null, "parents", "parents", -2027538891), kk = new U(null, "ul.nav.nav-pills.pull-right", "ul.nav.nav-pills.pull-right", 430135989), lk = new U(null, "std_offset", "std_offset", 1663653877), mk = new U(null, "component-will-unmount", "component-will-unmount", 
-2058314698), nk = new U(null, "query-params", "query-params", 900640534), ok = new U("cljs-time.core", "interval", "cljs-time.core/interval", 1734402006), pk = new U(null, "local-date-opt-time", "local-date-opt-time", 1178432599), qk = new U(null, "div#place-details-map-canvas", "div#place-details-map-canvas", -1723294569), rk = new U(null, "display-name", "display-name", 694513143), sk = new U(null, "hours", "hours", 58380855), tk = new U(null, "years", "years", -1298579689), uk = new U(null, "latitude", 
"latitude", 394867543), vk = new U(null, "week-date", "week-date", -1176745129), wk = new U(null, "on-submit", "on-submit", 1227871159), xk = new U(null, "on-dispose", "on-dispose", 2105306360), yk = new U(null, "action", "action", -811238024), zk = new U(null, "error", "error", -978969032), Ak = new U(null, "componentFunction", "componentFunction", 825866104), Bk = new U(null, "button.close", "button.close", -1545560743), Ck = new U(null, "date-hour", "date-hour", -344234471), Dk = new U(null, "live", 
"live", -1610148039), Ek = new U("secretary.core", "sequential", "secretary.core/sequential", -347187207), Fk = new U(null, "minutes", "minutes", 1319166394), Gk = new U(null, "end", "end", -268185958), Hk = new U(null, "not-implemented", "not-implemented", 1918806714), Ik = new U(null, "presentation", "presentation", -997269830), Jk = new U(null, "on-change", "on-change", -732046149), Kk = new U(null, "hierarchy", "hierarchy", -1053470341), vh = new U(null, "alt-impl", "alt-impl", 670969595), Lk = 
new U(null, "time-element-parser", "time-element-parser", -2042883205), Mk = new U(null, "doc", "doc", 1913296891), Nk = new U(null, "date-hour-minute-second", "date-hour-minute-second", -1565419364), Ok = new U(null, "week-date-time-no-ms", "week-date-time-no-ms", -1226853060), Pk = new U(null, "place-share", "place-share", -745769316), Hh = new U(null, "keywordize-keys", "keywordize-keys", 1310784252), Qk = new U(null, "p", "p", 151049309), Rk = new U(null, "weeks", "weeks", 1844596125), Sk = new U(null, 
"basic-date-time-no-ms", "basic-date-time-no-ms", -899402179), Tk = new U(null, "componentWillMount", "componentWillMount", -285327619), Uk = new U(null, "millis", "millis", -1338288387), Vk = new U(null, "href", "href", -793805698), Wk = new U(null, "names", "names", -1943074658), Xk = new U(null, "mysql", "mysql", -1431590210), Zk = new U(null, "a", "a", -2123407586), $k = new U(null, "message", "message", -406056002), al = new U(null, "time-zone", "time-zone", -1838760002), bl = new U(null, "basic-t-time", 
"basic-t-time", 191791391), cl = new U(null, "include_docs", "include_docs", -65447201);
function dl(a, b, c) {
  if ("string" === typeof b) {
    return a.replace(new RegExp(String(b).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08"), "g"), c);
  }
  if (b instanceof RegExp) {
    return a.replace(new RegExp(b.source, "g"), c);
  }
  throw [z("Invalid match arg: "), z(b)].join("");
}
function el(a) {
  var b = new Ua;
  for (a = F(a);;) {
    if (a) {
      b = b.append("" + z(J(a))), a = K(a);
    } else {
      return b.toString();
    }
  }
}
function fl(a, b) {
  for (var c = new Ua, d = F(b);;) {
    if (d) {
      c.append("" + z(J(d))), d = K(d), null != d && c.append(a);
    } else {
      return c.toString();
    }
  }
}
function gl(a, b) {
  if (0 >= b || b >= 2 + P(a)) {
    return Ld.c(Vf(N("", W.c(z, F(a)))), "");
  }
  if (v(L.c ? L.c(1, b) : L.call(null, 1, b))) {
    return new X(null, 1, 5, Y, [a], null);
  }
  if (v(L.c ? L.c(2, b) : L.call(null, 2, b))) {
    return new X(null, 2, 5, Y, ["", a], null);
  }
  var c = b - 2;
  return Ld.c(Vf(N("", Yf(Vf(W.c(z, F(a))), 0, c))), a.substring(c));
}
function hl(a, b) {
  return il(a, b, 0);
}
function il(a, b, c) {
  if (L.c("" + z(b), "/(?:)/")) {
    b = gl(a, c);
  } else {
    if (1 > c) {
      b = Vf(("" + z(a)).split(b));
    } else {
      a: {
        for (var d = c, e = Md;;) {
          if (L.c(d, 1)) {
            b = Ld.c(e, a);
            break a;
          }
          var f = kh(b, a);
          if (v(f)) {
            var g = f, f = a.indexOf(g), g = a.substring(f + P(g)), d = d - 1, e = Ld.c(e, a.substring(0, f));
            a = g;
          } else {
            b = Ld.c(e, a);
            break a;
          }
        }
      }
    }
  }
  if (L.c(0, c)) {
    a: {
      for (c = b;;) {
        if (L.c("", null == c ? null : $b(c))) {
          c = null == c ? null : ac(c);
        } else {
          break a;
        }
      }
    }
  } else {
    c = b;
  }
  return c;
}
;function jl() {
  var a = kl();
  return "" + z(a.uuid);
}
function kl() {
  function a() {
    return Math.floor(16 * Math.random()).toString(16);
  }
  return new Yh(el(Ve.v(rf(8, uf(a)), "-", O([rf(4, uf(a)), "-4", rf(3, uf(a)), "-", (8 | 3 & Math.floor(15 * Math.random())).toString(16), rf(3, uf(a)), "-", rf(12, uf(a))], 0))));
}
mh([z("^"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("-"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("-"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("-"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("-"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), 
z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("[0-9a-fA-F]"), z("$")].join(""));
function ll(a) {
  a = Dh(a);
  return v(a) ? a : {};
}
function ml(a, b) {
  var c = nl, d = ll(a);
  c.put(d, b);
}
;var ol = "undefined" !== typeof window && null != window.document, pl = new ah(null, new u(null, 2, ["aria", null, "data", null], null), null);
function ql(a) {
  return 2 > P(a) ? a.toUpperCase() : [z(a.substring(0, 1).toUpperCase()), z(a.substring(1))].join("");
}
function rl(a) {
  if ("string" === typeof a) {
    return a;
  }
  a = Ke(a);
  var b = hl(a, /-/), c = R(b, 0), b = Be(b);
  return v(pl.h ? pl.h(c) : pl.call(null, c)) ? a : Ze(z, c, W.c(ql, b));
}
var sl = !1;
if ("undefined" === typeof tl) {
  var tl = mf ? mf(Z) : lf.call(null, Z)
}
function ul(a, b, c) {
  try {
    var d = sl;
    sl = !0;
    try {
      return React.render(a.B ? a.B() : a.call(null), b, function() {
        return function() {
          var d = sl;
          sl = !1;
          try {
            return fd.C(tl, T, b, new X(null, 2, 5, Y, [a, b], null)), null != c ? c.B ? c.B() : c.call(null) : null;
          } finally {
            sl = d;
          }
        };
      }(d));
    } finally {
      sl = d;
    }
  } catch (e) {
    if (e instanceof Object) {
      try {
        React.unmountComponentAtNode(b);
      } catch (f) {
        if (f instanceof Object) {
          "undefined" !== typeof console && console.warn([z("Warning: "), z("Error unmounting:")].join("")), "undefined" !== typeof console && console.log(f);
        } else {
          throw f;
        }
      }
    }
    throw e;
  }
}
function vl(a, b) {
  return ul(a, b, null);
}
;var wl;
if ("undefined" === typeof xl) {
  var xl = !1
}
if ("undefined" === typeof yl) {
  var yl = mf ? mf(0) : lf.call(null, 0)
}
function zl(a, b) {
  b.lc = null;
  var c = wl;
  wl = b;
  try {
    return a.B ? a.B() : a.call(null);
  } finally {
    wl = c;
  }
}
function Al(a) {
  var b = a.lc;
  a.lc = null;
  return b;
}
function Bl(a) {
  var b = wl;
  if (null != b) {
    var c = b.lc;
    b.lc = Ld.c(null == c ? ch : c, a);
  }
}
function Cl(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.Db = c;
  this.ca = d;
  this.A = 2153938944;
  this.J = 114690;
}
h = Cl.prototype;
h.L = function(a, b, c) {
  vc(b, "#\x3cAtom: ");
  th(this.state, b, c);
  return vc(b, "\x3e");
};
h.T = function() {
  return this.meta;
};
h.N = function() {
  return ia(this);
};
h.I = function(a, b) {
  return this === b;
};
h.Xc = function(a, b) {
  if (null != this.Db && !v(this.Db.h ? this.Db.h(b) : this.Db.call(null, b))) {
    throw Error([z("Assert failed: "), z("Validator rejected reference state"), z("\n"), z(yh(O([Ge(new E(null, "validator", "validator", -325659154, null), new E(null, "new-value", "new-value", -1567397401, null))], 0)))].join(""));
  }
  var c = this.state;
  this.state = b;
  null != this.ca && yc(this, c, b);
  return b;
};
h.Yc = function(a, b) {
  var c;
  c = this.state;
  c = b.h ? b.h(c) : b.call(null, c);
  return Pc(this, c);
};
h.Zc = function(a, b, c) {
  a = this.state;
  b = b.c ? b.c(a, c) : b.call(null, a, c);
  return Pc(this, b);
};
h.$c = function(a, b, c, d) {
  a = this.state;
  b = b.l ? b.l(a, c, d) : b.call(null, a, c, d);
  return Pc(this, b);
};
h.ad = function(a, b, c, d, e) {
  return Pc(this, af(b, this.state, c, d, e));
};
h.jc = function(a, b, c) {
  return te(function(a) {
    return function(e, f, g) {
      g.C ? g.C(f, a, b, c) : g.call(null, f, a, b, c);
      return null;
    };
  }(this), null, this.ca);
};
h.ic = function(a, b, c) {
  return this.ca = T.l(this.ca, b, c);
};
h.kc = function(a, b) {
  return this.ca = Rd.c(this.ca, b);
};
h.fc = function() {
  Bl(this);
  return this.state;
};
var Dl = function Dl() {
  switch(arguments.length) {
    case 1:
      return Dl.h(arguments[0]);
    default:
      return Dl.v(arguments[0], new I(Array.prototype.slice.call(arguments, 1), 0));
  }
};
Dl.h = function(a) {
  return new Cl(a, null, null, null);
};
Dl.v = function(a, b) {
  var c = he(b) ? Ye(nf, b) : b, d = S(c, mb), c = S(c, of);
  return new Cl(a, d, c, null);
};
Dl.D = function(a) {
  var b = J(a);
  a = K(a);
  return Dl.v(b, a);
};
Dl.H = 1;
var El = function El(b) {
  if (b ? b.Md : b) {
    return b.Md();
  }
  var c;
  c = El[n(null == b ? null : b)];
  if (!c && (c = El._, !c)) {
    throw x("IDisposable.dispose!", b);
  }
  return c.call(null, b);
}, Fl = function Fl(b) {
  if (b ? b.Nd : b) {
    return b.Nd();
  }
  var c;
  c = Fl[n(null == b ? null : b)];
  if (!c && (c = Fl._, !c)) {
    throw x("IRunnable.run", b);
  }
  return c.call(null, b);
}, Gl = function Gl(b, c) {
  if (b ? b.rd : b) {
    return b.rd(0, c);
  }
  var d;
  d = Gl[n(null == b ? null : b)];
  if (!d && (d = Gl._, !d)) {
    throw x("IComputedImpl.-update-watching", b);
  }
  return d.call(null, b, c);
}, Hl = function Hl(b, c, d, e) {
  if (b ? b.Kd : b) {
    return b.Kd(0, 0, d, e);
  }
  var f;
  f = Hl[n(null == b ? null : b)];
  if (!f && (f = Hl._, !f)) {
    throw x("IComputedImpl.-handle-change", b);
  }
  return f.call(null, b, c, d, e);
}, Il = function Il(b) {
  if (b ? b.Ld : b) {
    return b.Ld();
  }
  var c;
  c = Il[n(null == b ? null : b)];
  if (!c && (c = Il._, !c)) {
    throw x("IComputedImpl.-peek-at", b);
  }
  return c.call(null, b);
};
function Jl(a, b, c, d, e, f, g, k, l) {
  this.tc = a;
  this.state = b;
  this.Ya = c;
  this.Eb = d;
  this.mb = e;
  this.ca = f;
  this.Mc = g;
  this.Dc = k;
  this.Cc = l;
  this.A = 2153807872;
  this.J = 114690;
}
h = Jl.prototype;
h.Kd = function(a, b, c, d) {
  var e = this;
  return v(function() {
    var a = e.Eb;
    return v(a) ? sb(e.Ya) && c !== d : a;
  }()) ? (e.Ya = !0, function() {
    var a = e.Mc;
    return v(a) ? a : Fl;
  }().call(null, this)) : null;
};
h.rd = function(a, b) {
  for (var c = F(b), d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = d.P(null, f);
      ke(this.mb, g) || zc(g, this, Hl);
      f += 1;
    } else {
      if (c = F(c)) {
        d = c, ce(d) ? (c = Kc(d), f = Lc(d), d = c, e = P(c), c = f) : (c = J(d), ke(this.mb, c) || zc(c, this, Hl), c = K(d), d = null, e = 0), f = 0;
      } else {
        break;
      }
    }
  }
  c = F(this.mb);
  d = null;
  for (f = e = 0;;) {
    if (f < e) {
      g = d.P(null, f), ke(b, g) || Ac(g, this), f += 1;
    } else {
      if (c = F(c)) {
        d = c, ce(d) ? (c = Kc(d), f = Lc(d), d = c, e = P(c), c = f) : (c = J(d), ke(b, c) || Ac(c, this), c = K(d), d = null, e = 0), f = 0;
      } else {
        break;
      }
    }
  }
  return this.mb = b;
};
h.Ld = function() {
  if (sb(this.Ya)) {
    return this.state;
  }
  var a = wl;
  wl = null;
  try {
    return ec(this);
  } finally {
    wl = a;
  }
};
h.L = function(a, b, c) {
  vc(b, [z("#\x3cReaction "), z(bd(this)), z(": ")].join(""));
  th(this.state, b, c);
  return vc(b, "\x3e");
};
h.N = function() {
  return ia(this);
};
h.I = function(a, b) {
  return this === b;
};
h.Md = function() {
  for (var a = F(this.mb), b = null, c = 0, d = 0;;) {
    if (d < c) {
      var e = b.P(null, d);
      Ac(e, this);
      d += 1;
    } else {
      if (a = F(a)) {
        b = a, ce(b) ? (a = Kc(b), d = Lc(b), b = a, c = P(a), a = d) : (a = J(b), Ac(a, this), a = K(b), b = null, c = 0), d = 0;
      } else {
        break;
      }
    }
  }
  this.state = this.mb = null;
  this.Ya = !0;
  v(this.Eb) && (v(xl) && fd.c(yl, xe), this.Eb = !1);
  return v(this.Cc) ? this.Cc.B ? this.Cc.B() : this.Cc.call(null) : null;
};
h.Xc = function(a, b) {
  var c = this.state;
  this.state = b;
  v(this.Dc) && (this.Ya = !0, this.Dc.c ? this.Dc.c(c, b) : this.Dc.call(null, c, b));
  yc(this, c, b);
  return b;
};
h.Yc = function(a, b) {
  var c;
  c = Il(this);
  c = b.h ? b.h(c) : b.call(null, c);
  return Pc(this, c);
};
h.Zc = function(a, b, c) {
  a = Il(this);
  b = b.c ? b.c(a, c) : b.call(null, a, c);
  return Pc(this, b);
};
h.$c = function(a, b, c, d) {
  a = Il(this);
  b = b.l ? b.l(a, c, d) : b.call(null, a, c, d);
  return Pc(this, b);
};
h.ad = function(a, b, c, d, e) {
  return Pc(this, af(b, Il(this), c, d, e));
};
h.Nd = function() {
  var a = this.state, b = zl(this.tc, this), c = Al(this);
  !L.c(c, this.mb) && Gl(this, c);
  v(this.Eb) || (v(xl) && fd.c(yl, hd), this.Eb = !0);
  this.Ya = !1;
  this.state = b;
  yc(this, a, this.state);
  return b;
};
h.jc = function(a, b, c) {
  return te(function(a) {
    return function(e, f, g) {
      g.C ? g.C(f, a, b, c) : g.call(null, f, a, b, c);
      return null;
    };
  }(this), null, this.ca);
};
h.ic = function(a, b, c) {
  return this.ca = T.l(this.ca, b, c);
};
h.kc = function(a, b) {
  this.ca = Rd.c(this.ca, b);
  return Xd(this.ca) && sb(this.Mc) ? El(this) : null;
};
h.fc = function() {
  var a = this.Mc;
  if (v(v(a) ? a : null != wl)) {
    return Bl(this), v(this.Ya) ? Fl(this) : this.state;
  }
  v(this.Ya) && (a = this.state, this.state = this.tc.B ? this.tc.B() : this.tc.call(null), a !== this.state && yc(this, a, this.state));
  return this.state;
};
function Kl(a, b) {
  var c = he(b) ? Ye(nf, b) : b, d = S(c, ik), e = S(c, gi), f = S(c, xk), c = S(c, Li), d = L.c(d, !0) ? Fl : d, g = null != c, e = new Jl(a, null, !g, g, null, null, d, e, f);
  null != c && (v(xl) && fd.c(yl, hd), e.rd(0, c));
  return e;
}
;if ("undefined" === typeof Ll) {
  var Ll = 0
}
function Ml(a) {
  return setTimeout(a, 16);
}
var Nl = sb(ol) ? Ml : function() {
  var a = window, b = a.requestAnimationFrame;
  if (v(b)) {
    return b;
  }
  b = a.webkitRequestAnimationFrame;
  if (v(b)) {
    return b;
  }
  b = a.mozRequestAnimationFrame;
  if (v(b)) {
    return b;
  }
  a = a.msRequestAnimationFrame;
  return v(a) ? a : Ml;
}();
function Ol(a, b) {
  return a.cljsMountOrder - b.cljsMountOrder;
}
function Pl() {
  var a = Ql;
  if (v(a.sd)) {
    return null;
  }
  a.sd = !0;
  a = function(a) {
    return function() {
      var c = a.qd, d = a.Lc;
      a.qd = [];
      a.Lc = [];
      a.sd = !1;
      a: {
        c.sort(Ol);
        for (var e = c.length, f = 0;;) {
          if (f < e) {
            var g = c[f];
            v(g.cljsIsDirty) && g.forceUpdate();
            f += 1;
          } else {
            break a;
          }
        }
      }
      a: {
        for (c = d.length, e = 0;;) {
          if (e < c) {
            d[e].call(null), e += 1;
          } else {
            break a;
          }
        }
      }
      return null;
    };
  }(a);
  return Nl.h ? Nl.h(a) : Nl.call(null, a);
}
var Ql = new function() {
  this.qd = [];
  this.sd = !1;
  this.Lc = [];
};
function Rl(a) {
  Ql.Lc.push(a);
  Pl();
}
function Sl(a) {
  a = null == a ? null : a.props;
  return null == a ? null : a.argv;
}
function Tl(a, b) {
  if (!v(Sl(a))) {
    throw Error([z("Assert failed: "), z(yh(O([Ge(new E(null, "is-reagent-component", "is-reagent-component", -1856228005, null), new E(null, "c", "c", -122660552, null))], 0)))].join(""));
  }
  a.cljsIsDirty = !1;
  var c = a.cljsRatom;
  if (null == c) {
    var d = zl(b, a), e = Al(a);
    null != e && (a.cljsRatom = Kl(b, O([ik, function() {
      return function() {
        a.cljsIsDirty = !0;
        Ql.qd.push(a);
        return Pl();
      };
    }(d, e, c), Li, e], 0)));
    return d;
  }
  return Fl(c);
}
;var Ul, Vl = function Vl(b) {
  var c = Ul;
  Ul = b;
  try {
    var d = b.cljsRender;
    if (!je(d)) {
      throw Error([z("Assert failed: "), z(yh(O([Ge(new E(null, "ifn?", "ifn?", -2106461064, null), new E(null, "f", "f", 43394975, null))], 0)))].join(""));
    }
    var e = b.props, f = null == b.reagentRender ? d.h ? d.h(b) : d.call(null, b) : function() {
      var b = e.argv;
      switch(P(b)) {
        case 1:
          return d.B ? d.B() : d.call(null);
        case 2:
          return b = Od(b, 1), d.h ? d.h(b) : d.call(null, b);
        case 3:
          var c = Od(b, 1), b = Od(b, 2);
          return d.c ? d.c(c, b) : d.call(null, c, b);
        case 4:
          var c = Od(b, 1), f = Od(b, 2), b = Od(b, 3);
          return d.l ? d.l(c, f, b) : d.call(null, c, f, b);
        case 5:
          var c = Od(b, 1), f = Od(b, 2), p = Od(b, 3), b = Od(b, 4);
          return d.C ? d.C(c, f, p, b) : d.call(null, c, f, p, b);
        default:
          return Ye(d, Yf(b, 1, P(b)));
      }
    }();
    return be(f) ? Wl(f) : je(f) ? (b.cljsRender = f, Vl(b)) : f;
  } finally {
    Ul = c;
  }
}, Xl = new u(null, 1, [Tj, function() {
  return sb(void 0) ? Tl(this, function(a) {
    return function() {
      return Vl(a);
    };
  }(this)) : Vl(this);
}], null);
function Yl(a, b) {
  var c = a instanceof U ? a.Ma : null;
  switch(c) {
    case "getDefaultProps":
      throw Error([z("Assert failed: "), z("getDefaultProps not supported yet"), z("\n"), z(yh(O([!1], 0)))].join(""));;
    case "getInitialState":
      return function() {
        return function() {
          var a;
          a = this.cljsState;
          a = null != a ? a : this.cljsState = Dl.h(null);
          var c = b.h ? b.h(this) : b.call(null, this);
          return V.c ? V.c(a, c) : V.call(null, a, c);
        };
      }(c);
    case "componentWillReceiveProps":
      return function() {
        return function(a) {
          a = a.argv;
          return b.c ? b.c(this, a) : b.call(null, this, a);
        };
      }(c);
    case "shouldComponentUpdate":
      return function() {
        return function(a) {
          var c = sl;
          if (v(c)) {
            return c;
          }
          c = this.props.argv;
          a = a.argv;
          return null == b ? null == c || null == a || !L.c(c, a) : b.l ? b.l(this, c, a) : b.call(null, this, c, a);
        };
      }(c);
    case "componentWillUpdate":
      return function() {
        return function(a) {
          a = a.argv;
          return b.c ? b.c(this, a) : b.call(null, this, a);
        };
      }(c);
    case "componentDidUpdate":
      return function() {
        return function(a) {
          a = a.argv;
          return b.c ? b.c(this, a) : b.call(null, this, a);
        };
      }(c);
    case "componentWillMount":
      return function() {
        return function() {
          this.cljsMountOrder = Ll += 1;
          return null == b ? null : b.h ? b.h(this) : b.call(null, this);
        };
      }(c);
    case "componentWillUnmount":
      return function() {
        return function() {
          var a = this.cljsRatom;
          null == a || El(a);
          this.cljsIsDirty = !1;
          return null == b ? null : b.h ? b.h(this) : b.call(null, this);
        };
      }(c);
    default:
      return null;
  }
}
function Zl(a) {
  return je(a) ? function() {
    function b(b) {
      var c = null;
      if (0 < arguments.length) {
        for (var c = 0, f = Array(arguments.length - 0);c < f.length;) {
          f[c] = arguments[c + 0], ++c;
        }
        c = new I(f, 0);
      }
      return Ze(a, this, c);
    }
    function c(b) {
      return Ze(a, this, b);
    }
    b.H = 0;
    b.D = function(a) {
      a = F(a);
      return c(a);
    };
    b.v = c;
    return b;
  }() : a;
}
var $l = new ah(null, new u(null, 4, [Ti, null, Pj, null, Tj, null, jk, null], null), null);
function am(a, b, c) {
  if (v($l.h ? $l.h(a) : $l.call(null, a))) {
    return Sd(b) && (b.__reactDontBind = !0), b;
  }
  var d = Yl(a, b);
  if (v(v(d) ? b : d) && !je(b)) {
    throw Error([z("Assert failed: "), z([z("Expected function in "), z(c), z(a), z(" but got "), z(b)].join("")), z("\n"), z(yh(O([Ge(new E(null, "ifn?", "ifn?", -2106461064, null), new E(null, "f", "f", 43394975, null))], 0)))].join(""));
  }
  return v(d) ? d : Zl(b);
}
var bm = new u(null, 3, [Hj, null, Tk, null, xj, null], null), cm = function(a) {
  return function(b) {
    return function(c) {
      var d = S(M.h ? M.h(b) : M.call(null, b), c);
      if (null != d) {
        return d;
      }
      d = a.h ? a.h(c) : a.call(null, c);
      fd.C(b, T, c, d);
      return d;
    };
  }(mf ? mf(Z) : lf.call(null, Z));
}(rl);
function dm(a) {
  return te(function(a, c, d) {
    return T.l(a, Je.h(cm.h ? cm.h(c) : cm.call(null, c)), d);
  }, Z, a);
}
function em(a) {
  return Zg.v(O([bm, a], 0));
}
function fm(a, b, c) {
  a = T.v(a, Ti, b, O([Tj, Tj.h(Xl)], 0));
  return T.l(a, jk, function() {
    return function() {
      return c;
    };
  }(a));
}
function gm(a) {
  var b = function() {
    var b = Sd(a);
    return b ? (b = a.displayName, v(b) ? b : a.name) : b;
  }();
  if (v(b)) {
    return b;
  }
  b = function() {
    var b = a ? a.J & 4096 || a.zd ? !0 : !1 : !1;
    return b ? Ke(a) : b;
  }();
  if (v(b)) {
    return b;
  }
  b = Vd(a);
  return ae(b) ? Wi.h(b) : null;
}
function hm(a) {
  var b = function() {
    var b = Ak.h(a);
    return null == b ? a : Rd.c(T.l(a, Pj, b), Ak);
  }(), c = function() {
    var a = Pj.h(b);
    return v(a) ? a : Tj.h(b);
  }();
  if (!je(c)) {
    throw Error([z("Assert failed: "), z([z("Render must be a function, not "), z(yh(O([c], 0)))].join("")), z("\n"), z(yh(O([Ge(new E(null, "ifn?", "ifn?", -2106461064, null), new E(null, "render-fun", "render-fun", -1209513086, null))], 0)))].join(""));
  }
  var d = null, e = "" + z(function() {
    var a = Oi.h(b);
    return v(a) ? a : gm(c);
  }()), f;
  if (Xd(e)) {
    f = z;
    var g;
    null == gd && (gd = mf ? mf(0) : lf.call(null, 0));
    g = ed();
    f = "" + f(g);
  } else {
    f = e;
  }
  g = fm(T.l(b, Oi, f), c, f);
  return te(function(a, b, c, d, e) {
    return function(a, b, c) {
      return T.l(a, b, am(b, c, e));
    };
  }(b, c, d, e, f, g), Z, g);
}
function im(a) {
  return te(function(a, c, d) {
    a[Ke(c)] = d;
    return a;
  }, {}, a);
}
function jm(a) {
  if (!ae(a)) {
    throw Error([z("Assert failed: "), z(yh(O([Ge(new E(null, "map?", "map?", -1780568534, null), new E(null, "body", "body", -408674142, null))], 0)))].join(""));
  }
  var b = im(hm(em(dm(a))));
  a = React.createClass(b);
  b = function(a, b) {
    return function() {
      function a(b) {
        var d = null;
        if (0 < arguments.length) {
          for (var d = 0, e = Array(arguments.length - 0);d < e.length;) {
            e[d] = arguments[d + 0], ++d;
          }
          d = new I(e, 0);
        }
        return c.call(this, d);
      }
      function c(a) {
        a = Ze(Wf, b, a);
        return Wl(a);
      }
      a.H = 0;
      a.D = function(a) {
        a = F(a);
        return c(a);
      };
      a.v = c;
      return a;
    }();
  }(b, a);
  b.cljsReactClass = a;
  a.cljsReactClass = a;
  return b;
}
function km() {
  var a;
  a = Ul;
  a = null == a ? null : a.cljsName();
  return Xd(a) ? "" : [z(" (in "), z(a), z(")")].join("");
}
;var lm = /([^\s\.#]+)(?:#([^\s\.#]+))?(?:\.([^\s#]+))?/;
function mm(a) {
  return a instanceof U || a instanceof E;
}
function nm(a) {
  var b = mm(a);
  return v(b) ? b : "string" === typeof a;
}
var om = {"class":"className", "for":"htmlFor", charset:"charSet"};
function pm(a, b) {
  return v(a.hasOwnProperty(b)) ? a[b] : null;
}
var qm = function qm(b) {
  return "string" === typeof b || "number" === typeof b || Sd(b) ? b : v(mm(b)) ? Ke(b) : ae(b) ? te(function(b, d, e) {
    if (v(mm(d))) {
      var f = pm(om, Ke(d));
      d = null == f ? om[Ke(d)] = rl(d) : f;
    }
    b[d] = qm(e);
    return b;
  }, {}, b) : Yd(b) ? Dh(b) : je(b) ? function() {
    function c(b) {
      var c = null;
      if (0 < arguments.length) {
        for (var c = 0, g = Array(arguments.length - 0);c < g.length;) {
          g[c] = arguments[c + 0], ++c;
        }
        c = new I(g, 0);
      }
      return d.call(this, c);
    }
    function d(c) {
      return Ye(b, c);
    }
    c.H = 0;
    c.D = function(b) {
      b = F(b);
      return d(b);
    };
    c.v = d;
    return c;
  }() : Dh(b);
};
function rm(a) {
  var b = a.cljsInputValue;
  if (null == b) {
    return null;
  }
  a.cljsInputDirty = !1;
  a = a.getDOMNode();
  return L.c(b, a.value) ? null : a.value = b;
}
function sm(a, b, c) {
  b = b.h ? b.h(c) : b.call(null, c);
  v(a.cljsInputDirty) || (a.cljsInputDirty = !0, Rl(function() {
    return function() {
      return rm(a);
    };
  }(b)));
  return b;
}
function tm(a) {
  var b = Ul;
  if (v(function() {
    var b = a.hasOwnProperty("onChange");
    return v(b) ? a.hasOwnProperty("value") : b;
  }())) {
    var c = a.value, d = null == c ? "" : c, e = a.onChange;
    b.cljsInputValue = d;
    delete a.value;
    a.defaultValue = d;
    a.onChange = function(a, c, d, e) {
      return function(a) {
        return sm(b, e, a);
      };
    }(a, c, d, e);
  } else {
    b.cljsInputValue = null;
  }
}
var um = null, wm = new u(null, 4, [rk, "ReagentInput", oj, rm, mk, function(a) {
  return a.cljsInputValue = null;
}, Xj, function(a, b, c, d) {
  tm(c);
  return vm.C ? vm.C(a, b, c, d) : vm.call(null, a, b, c, d);
}], null);
function xm(a, b, c, d) {
  null == um && (um = jm(wm));
  return um.C ? um.C(a, b, c, d) : um.call(null, a, b, c, d);
}
function ym(a) {
  return ae(a) ? S(a, Ci) : null;
}
function zm(a) {
  var b;
  b = Vd(a);
  b = null == b ? null : ym(b);
  return null == b ? ym(R(a, 1)) : b;
}
var Am = {};
function Wl(a) {
  if ("string" !== typeof a) {
    if (be(a)) {
      if (!(0 < P(a))) {
        throw Error([z("Assert failed: "), z([z("Hiccup form should not be empty: "), z(yh(O([a], 0))), z(km())].join("")), z("\n"), z(yh(O([Ge(new E(null, "pos?", "pos?", -244377722, null), Ge(new E(null, "count", "count", -514511684, null), new E(null, "v", "v", 1661996586, null)))], 0)))].join(""));
      }
      var b = Od(a, 0), c;
      c = nm(b);
      c = v(c) ? c : je(b) || !1;
      if (!v(c)) {
        throw Error([z("Assert failed: "), z([z("Invalid Hiccup form: "), z(yh(O([a], 0))), z(km())].join("")), z("\n"), z(yh(O([Ge(new E(null, "valid-tag?", "valid-tag?", 1243064160, null), new E(null, "tag", "tag", 350170304, null))], 0)))].join(""));
      }
      var d;
      if (v(nm(b))) {
        c = pm(Am, Ke(b));
        if (null == c) {
          c = Ke(b);
          d = K(jh(lm, Ke(b)));
          var e = R(d, 0), f = R(d, 1);
          d = R(d, 2);
          d = v(d) ? dl(d, /\./, " ") : null;
          if (!v(e)) {
            throw Error([z("Assert failed: "), z([z("Invalid tag: '"), z(b), z("'"), z(km())].join("")), z("\n"), z(yh(O([new E(null, "tag", "tag", 350170304, null)], 0)))].join(""));
          }
          c = Am[c] = {name:e, id:f, className:d};
        }
        d = c;
      } else {
        d = null;
      }
      if (v(d)) {
        c = d.name;
        f = R(a, 1);
        e = null == f || ae(f);
        var g = e ? f : null, f = d.id;
        d = d.className;
        var k = null == f && null == d;
        k && Xd(g) ? f = null : (g = qm(g), k || (g = null == g ? {} : g, null != f && null == g.id && (g.id = f), null != d && (f = g.className, g.className = null != f ? [z(d), z(" "), z(f)].join("") : d)), f = g);
        e = e ? 2 : 1;
        v("input" === c || "textarea" === c) ? (c = Dd(new X(null, 5, 5, Y, [xm, a, c, f, e], null), Vd(a)), c = Wl.h ? Wl.h(c) : Wl.call(null, c)) : (d = Vd(a), d = null == d ? null : ym(d), null != d && (f = null == f ? {} : f, f.key = d), c = vm.C ? vm.C(a, c, f, e) : vm.call(null, a, c, f, e));
      } else {
        c = null;
      }
      if (null == c) {
        c = b.cljsReactClass;
        if (null == c) {
          if (!je(b)) {
            throw Error([z("Assert failed: "), z([z("Expected a function, not "), z(yh(O([b], 0)))].join("")), z("\n"), z(yh(O([Ge(new E(null, "ifn?", "ifn?", -2106461064, null), new E(null, "f", "f", 43394975, null))], 0)))].join(""));
          }
          Sd(b) && null != b.type && "undefined" !== typeof console && console.warn([z("Warning: "), z("Using native React classes directly in Hiccup forms "), z("is not supported. Use create-element or "), z("adapt-react-class instead: "), z(b.type), z(km())].join(""));
          c = Vd(b);
          c = T.l(c, Xj, b);
          c = jm(c).cljsReactClass;
          b.cljsReactClass = c;
        }
        b = c;
        c = {argv:a};
        a = null == a ? null : zm(a);
        null == a || (c.key = a);
        a = React.createElement(b, c);
      } else {
        a = c;
      }
    } else {
      a = he(a) ? Bm.h ? Bm.h(a) : Bm.call(null, a) : a;
    }
  }
  return a;
}
function Cm(a, b) {
  for (var c = yb(a), d = c.length, e = 0;;) {
    if (e < d) {
      var f = c[e];
      be(f) && null == zm(f) && (b["no-key"] = !0);
      c[e] = Wl(f);
      e += 1;
    } else {
      break;
    }
  }
  return c;
}
function Bm(a) {
  var b = {}, c = null == wl ? Cm(a, b) : zl(function(b) {
    return function() {
      return Cm(a, b);
    };
  }(b), b);
  v(Al(b)) && "undefined" !== typeof console && console.warn([z("Warning: "), z("Reactive deref not supported in lazy seq, "), z("it should be wrapped in doall"), z(km()), z(". Value:\n"), z(yh(O([a], 0)))].join(""));
  v(b["no-key"]) && "undefined" !== typeof console && console.warn([z("Warning: "), z("Every element in a seq should have a unique "), z(":key"), z(km()), z(". Value: "), z(yh(O([a], 0)))].join(""));
  return c;
}
function vm(a, b, c, d) {
  var e = P(a) - d;
  switch(e) {
    case 0:
      return React.createElement(b, c);
    case 1:
      return React.createElement(b, c, Wl(Od(a, d)));
    default:
      return React.createElement.apply(null, te(function() {
        return function(a, b, c) {
          b >= d && a.push(Wl(c));
          return a;
        };
      }(e), [b, c], a));
  }
}
;function Dm() {
  switch(arguments.length) {
    case 2:
      return Em(arguments[0], arguments[1], null);
    case 3:
      return Em(arguments[0], arguments[1], arguments[2]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
}
function Em(a, b, c) {
  return ul(function() {
    var b = Sd(a) ? a.B ? a.B() : a.call(null) : a;
    return Wl(b);
  }, b, c);
}
function Fm() {
  for (var a = F(og(M.h ? M.h(tl) : M.call(null, tl))), b = null, c = 0, d = 0;;) {
    if (d < c) {
      var e = b.P(null, d);
      Ye(vl, e);
      d += 1;
    } else {
      if (a = F(a)) {
        b = a, ce(b) ? (a = Kc(b), d = Lc(b), b = a, c = P(a), a = d) : (a = J(b), Ye(vl, a), a = K(b), b = null, c = 0), d = 0;
      } else {
        break;
      }
    }
  }
  return "Updated";
}
var Gm = ["reagent", "core", "force_update_all"], Hm = aa;
Gm[0] in Hm || !Hm.execScript || Hm.execScript("var " + Gm[0]);
for (var Im;Gm.length && (Im = Gm.shift());) {
  Gm.length || void 0 === Fm ? Hm = Hm[Im] ? Hm[Im] : Hm[Im] = {} : Hm[Im] = Fm;
}
;if ("undefined" === typeof Jm) {
  var Jm = "http://dev.husensys.com:4984/monte-bello-sync/"
}
if ("undefined" === typeof nl) {
  var nl = new PouchDB("monte-bello")
}
if ("undefined" === typeof Km) {
  var Km = Dl.h(Md)
}
if ("undefined" === typeof Lm) {
  var Lm = Dl.h(pi)
}
if ("undefined" === typeof Mm) {
  var Mm;
  Mm = Dl.h(new u(null, 8, [pi, "Home", ji, "Add Place", fi, "Place Details", Pi, "Edit Place", qj, "Find Place", Sj, "Found Places", Mi, "Places", Pk, "Share Place"], null));
}
if ("undefined" === typeof Nm) {
  var Nm = Dl.h(Z)
}
if ("undefined" === typeof Om) {
  var Om = Dl.h(Z)
}
if ("undefined" === typeof Pm) {
  var Pm = Dl.h(Z)
}
;function Qm(a) {
  var b = T.l(M.h ? M.h(Om) : M.call(null, Om), ei, jl());
  ml(b, function() {
    return function(a, b) {
      return zh(O(["save-document \x3d ", a, ", ", b], 0));
    };
  }(b));
  return a.preventDefault();
}
;var Rm;
Rm = {Ee:["BC", "AD"], De:["Before Christ", "Anno Domini"], Ge:"JFMAMJJASOND".split(""), Ne:"JFMAMJJASOND".split(""), Fe:"January February March April May June July August September October November December".split(" "), Me:"January February March April May June July August September October November December".split(" "), Je:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), Pe:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), Te:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), 
Re:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), Le:"Sun Mon Tue Wed Thu Fri Sat".split(" "), Qe:"Sun Mon Tue Wed Thu Fri Sat".split(" "), He:"SMTWTFS".split(""), Oe:"SMTWTFS".split(""), Ke:["Q1", "Q2", "Q3", "Q4"], Ie:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], Ae:["AM", "PM"], Be:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], Se:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], Ce:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], 
Td:6, Ue:[5, 6], Ud:5};
var Sm;
a: {
  var Tm = aa.navigator;
  if (Tm) {
    var Um = Tm.userAgent;
    if (Um) {
      Sm = Um;
      break a;
    }
  }
  Sm = "";
}
function Vm(a) {
  return -1 != Sm.indexOf(a);
}
;function Wm() {
  return Vm("Edge");
}
;var Xm = Vm("Opera") || Vm("OPR"), Ym = Vm("Edge") || Vm("Trident") || Vm("MSIE"), Zm = Vm("Gecko") && !(-1 != Sm.toLowerCase().indexOf("webkit") && !Wm()) && !(Vm("Trident") || Vm("MSIE")) && !Wm(), $m = -1 != Sm.toLowerCase().indexOf("webkit") && !Wm();
function an() {
  var a = Sm;
  if (Zm) {
    return /rv\:([^\);]+)(\)|;)/.exec(a);
  }
  if (Ym && Wm()) {
    return /Edge\/([\d\.]+)/.exec(a);
  }
  if (Ym) {
    return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
  }
  if ($m) {
    return /WebKit\/(\S+)/.exec(a);
  }
}
function bn() {
  var a = aa.document;
  return a ? a.documentMode : void 0;
}
var cn = function() {
  if (Xm && aa.opera) {
    var a = aa.opera.version;
    return "function" == n(a) ? a() : a;
  }
  var a = "", b = an();
  b && (a = b ? b[1] : "");
  return Ym && !Wm() && (b = bn(), b > parseFloat(a)) ? String(b) : a;
}(), dn = {};
function en(a) {
  var b;
  if (!(b = dn[a])) {
    b = 0;
    for (var c = Aa(String(cn)).split("."), d = Aa(String(a)).split("."), e = Math.max(c.length, d.length), f = 0;0 == b && f < e;f++) {
      var g = c[f] || "", k = d[f] || "", l = RegExp("(\\d*)(\\D*)", "g"), p = RegExp("(\\d*)(\\D*)", "g");
      do {
        var m = l.exec(g) || ["", "", ""], q = p.exec(k) || ["", "", ""];
        if (0 == m[0].length && 0 == q[0].length) {
          break;
        }
        b = Pa(0 == m[1].length ? 0 : parseInt(m[1], 10), 0 == q[1].length ? 0 : parseInt(q[1], 10)) || Pa(0 == m[2].length, 0 == q[2].length) || Pa(m[2], q[2]);
      } while (0 == b);
    }
    b = dn[a] = 0 <= b;
  }
  return b;
}
function fn(a) {
  return Ym && (Wm() || gn >= a);
}
var hn = aa.document, jn = bn(), gn = !hn || !Ym || !jn && Wm() ? void 0 : jn || ("CSS1Compat" == hn.compatMode ? parseInt(cn, 10) : 5);
!Zm && !Ym || Ym && fn(9) || Zm && en("1.9.1");
Ym && en("9");
function kn(a, b) {
  var c = Array.prototype.slice.call(arguments), d = c.shift();
  if ("undefined" == typeof d) {
    throw Error("[goog.string.format] Template required");
  }
  return d.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, d, k, l, p, m, q) {
    if ("%" == p) {
      return "%";
    }
    var r = c.shift();
    if ("undefined" == typeof r) {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = r;
    return kn.Ta[p].apply(null, arguments);
  });
}
kn.Ta = {};
kn.Ta.s = function(a, b, c) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + La(" ", c - a.length) : La(" ", c - a.length) + a;
};
kn.Ta.f = function(a, b, c, d, e) {
  d = a.toString();
  isNaN(e) || "" == e || (d = parseFloat(a).toFixed(e));
  var f;
  f = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (d = f + d);
  if (isNaN(c) || d.length >= c) {
    return d;
  }
  d = isNaN(e) ? Math.abs(a).toString() : Math.abs(a).toFixed(e);
  a = c - d.length - f.length;
  return d = 0 <= b.indexOf("-", 0) ? f + d + La(" ", a) : f + La(0 <= b.indexOf("0", 0) ? "0" : " ", a) + d;
};
kn.Ta.d = function(a, b, c, d, e, f, g, k) {
  return kn.Ta.f(parseInt(a, 10), b, c, d, 0, f, g, k);
};
kn.Ta.i = kn.Ta.d;
kn.Ta.u = kn.Ta.d;
function ln() {
  return mn(0 < arguments.length ? new I(Array.prototype.slice.call(arguments, 0), 0) : null);
}
function mn(a) {
  return cf(function(a) {
    return a instanceof nn;
  }, a) ? Ye(L, W.c(function(a) {
    return a.getTime();
  }, a)) : Ye(L, a);
}
function on(a) {
  return 0 === ye(a, 400) ? !0 : 0 === ye(a, 100) ? !1 : 0 === ye(a, 4) ? !0 : !1;
}
function pn(a, b) {
  return J(qf(function(a, d) {
    return v(mn(O([d, b], 0))) ? a : null;
  }, a));
}
function qn(a) {
  a = W.c(function(a) {
    return a instanceof U || a instanceof E ? "" + z(a) : a;
  }, a);
  return Ze(kn, "%s not implemented yet", a);
}
function rn(a) {
  return 0 <= a && 9 >= a ? [z("0"), z(a)].join("") : "" + z(a);
}
;var sn = Ta("area base br col command embed hr img input keygen link meta param source track wbr".split(" "));
function tn() {
  this.Kc = "";
  this.Zd = un;
}
tn.prototype.wb = !0;
tn.prototype.vb = function() {
  return this.Kc;
};
tn.prototype.toString = function() {
  return "Const{" + this.Kc + "}";
};
function vn(a) {
  if (a instanceof tn && a.constructor === tn && a.Zd === un) {
    return a.Kc;
  }
  Ya("expected object of type Const, got '" + a + "'");
  return "type_error:Const";
}
var un = {};
function wn(a) {
  var b = new tn;
  b.Kc = a;
  return b;
}
;function xn() {
  this.Ec = "";
  this.Xd = yn;
}
xn.prototype.wb = !0;
var yn = {};
xn.prototype.vb = function() {
  return this.Ec;
};
xn.prototype.toString = function() {
  return "SafeStyle{" + this.Ec + "}";
};
xn.prototype.zc = function(a) {
  this.Ec = a;
  return this;
};
var zn = (new xn).zc(""), An = /^[-,."'%_!# a-zA-Z0-9]+$/;
function Bn() {
  this.bb = "";
  this.Yd = Cn;
}
h = Bn.prototype;
h.wb = !0;
h.vb = function() {
  return this.bb;
};
h.md = !0;
h.Rb = function() {
  return 1;
};
h.toString = function() {
  return "SafeUrl{" + this.bb + "}";
};
var Cn = {};
function Dn() {
  this.Fc = "";
  this.$d = En;
}
h = Dn.prototype;
h.wb = !0;
h.vb = function() {
  return this.Fc;
};
h.md = !0;
h.Rb = function() {
  return 1;
};
h.toString = function() {
  return "TrustedResourceUrl{" + this.Fc + "}";
};
function Fn(a) {
  if (a instanceof Dn && a.constructor === Dn && a.$d === En) {
    return a.Fc;
  }
  Ya("expected object of type TrustedResourceUrl, got '" + a + "'");
  return "type_error:TrustedResourceUrl";
}
var En = {};
function Gn(a) {
  var b = new Dn;
  b.Fc = a;
  return b;
}
;function Hn() {
  this.bb = "";
  this.Wd = In;
  this.Fd = null;
}
h = Hn.prototype;
h.md = !0;
h.Rb = function() {
  return this.Fd;
};
h.wb = !0;
h.vb = function() {
  return this.bb;
};
h.toString = function() {
  return "SafeHtml{" + this.bb + "}";
};
function Jn(a) {
  if (a instanceof Hn && a.constructor === Hn && a.Wd === In) {
    return a.bb;
  }
  Ya("expected object of type SafeHtml, got '" + a + "'");
  return "type_error:SafeHtml";
}
var Kn = /^[a-zA-Z0-9-]+$/, Ln = {action:!0, cite:!0, data:!0, formaction:!0, href:!0, manifest:!0, poster:!0, src:!0}, Mn = {EMBED:!0, IFRAME:!0, LINK:!0, OBJECT:!0, SCRIPT:!0, STYLE:!0, TEMPLATE:!0};
function Nn(a, b, c) {
  if (!Kn.test(a)) {
    throw Error("Invalid tag name \x3c" + a + "\x3e.");
  }
  if (a.toUpperCase() in Mn) {
    throw Error("Tag name \x3c" + a + "\x3e is not allowed for SafeHtml.");
  }
  return On(a, b, c);
}
function Pn(a) {
  function b(a) {
    if (ba(a)) {
      ab(a, b);
    } else {
      if (!(a instanceof Hn)) {
        var f = null;
        a.md && (f = a.Rb());
        a = Qn(Ba(a.wb ? a.vb() : String(a)), f);
      }
      d += Jn(a);
      a = a.Rb();
      0 == c ? c = a : 0 != a && c != a && (c = null);
    }
  }
  var c = 0, d = "";
  ab(arguments, b);
  return Qn(d, c);
}
var In = {};
function Qn(a, b) {
  return (new Hn).zc(a, b);
}
Hn.prototype.zc = function(a, b) {
  this.bb = a;
  this.Fd = b;
  return this;
};
function On(a, b, c) {
  var d = null, e = "\x3c" + a;
  if (b) {
    for (var f in b) {
      if (!Kn.test(f)) {
        throw Error('Invalid attribute name "' + f + '".');
      }
      var g = b[f];
      if (null != g) {
        var k, l = a;
        k = f;
        if (g instanceof tn) {
          g = vn(g);
        } else {
          if ("style" == k.toLowerCase()) {
            if (!ha(g)) {
              throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof g + " given: " + g);
            }
            if (!(g instanceof xn)) {
              var l = "", p = void 0;
              for (p in g) {
                if (!/^[-_a-zA-Z0-9]+$/.test(p)) {
                  throw Error("Name allows only [-_a-zA-Z0-9], got: " + p);
                }
                var m = g[p];
                if (null != m) {
                  if (m instanceof tn) {
                    m = vn(m);
                  } else {
                    if (An.test(m)) {
                      for (var q = !0, r = !0, t = 0;t < m.length;t++) {
                        var y = m.charAt(t);
                        "'" == y && r ? q = !q : '"' == y && q && (r = !r);
                      }
                      q && r || (Ya("String value requires balanced quotes, got: " + m), m = "zClosurez");
                    } else {
                      Ya("String value allows only [-,.\"'%_!# a-zA-Z0-9], got: " + m), m = "zClosurez";
                    }
                  }
                  l += p + ":" + m + ";";
                }
              }
              g = l ? (new xn).zc(l) : zn;
            }
            l = void 0;
            g instanceof xn && g.constructor === xn && g.Xd === yn ? l = g.Ec : (Ya("expected object of type SafeStyle, got '" + g + "'"), l = "type_error:SafeStyle");
            g = l;
          } else {
            if (/^on/i.test(k)) {
              throw Error('Attribute "' + k + '" requires goog.string.Const value, "' + g + '" given.');
            }
            if (k.toLowerCase() in Ln) {
              if (g instanceof Dn) {
                g = Fn(g);
              } else {
                if (g instanceof Bn) {
                  g instanceof Bn && g.constructor === Bn && g.Yd === Cn ? g = g.bb : (Ya("expected object of type SafeUrl, got '" + g + "'"), g = "type_error:SafeUrl");
                } else {
                  throw Error('Attribute "' + k + '" on tag "' + l + '" requires goog.html.SafeUrl or goog.string.Const value, "' + g + '" given.');
                }
              }
            }
          }
        }
        g.wb && (g = g.vb());
        k = k + '\x3d"' + Ba(String(g)) + '"';
        e += " " + k;
      }
    }
  }
  null != c ? ba(c) || (c = [c]) : c = [];
  !0 === sn[a.toLowerCase()] ? e += "\x3e" : (d = Pn(c), e += "\x3e" + Jn(d) + "\x3c/" + a + "\x3e", d = d.Rb());
  (a = b && b.dir) && (d = /^(ltr|rtl|auto)$/i.test(a) ? 0 : null);
  return Qn(e, d);
}
Qn("\x3c!DOCTYPE html\x3e", 0);
Qn("", 0);
var Rn = !Ym || fn(9), Sn = Ym && !en("9");
!$m || en("528");
Zm && en("1.9b") || Ym && en("8") || Xm && en("9.5") || $m && en("528");
Zm && !en("8") || Ym && en("9");
function Tn() {
  0 != Un && (Vn[ia(this)] = this);
  this.Qb = this.Qb;
  this.kb = this.kb;
}
var Un = 0, Vn = {};
Tn.prototype.Qb = !1;
Tn.prototype.jd = function() {
  if (!this.Qb && (this.Qb = !0, this.Ua(), 0 != Un)) {
    var a = ia(this);
    delete Vn[a];
  }
};
Tn.prototype.Ua = function() {
  if (this.kb) {
    for (;this.kb.length;) {
      this.kb.shift()();
    }
  }
};
function Wn(a) {
  a && "function" == typeof a.jd && a.jd();
}
;function Xn(a, b) {
  this.type = a;
  this.currentTarget = this.target = b;
  this.defaultPrevented = this.lb = !1;
  this.Od = !0;
}
Xn.prototype.stopPropagation = function() {
  this.lb = !0;
};
Xn.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.Od = !1;
};
function Yn(a) {
  Yn[" "](a);
  return a;
}
Yn[" "] = function() {
};
function Zn(a, b) {
  Xn.call(this, a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.rb = this.state = null;
  if (a) {
    var c = this.type = a.type;
    this.target = a.target || a.srcElement;
    this.currentTarget = b;
    var d = a.relatedTarget;
    if (d) {
      if (Zm) {
        var e;
        a: {
          try {
            Yn(d.nodeName);
            e = !0;
            break a;
          } catch (f) {
          }
          e = !1;
        }
        e || (d = null);
      }
    } else {
      "mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement);
    }
    this.relatedTarget = d;
    this.offsetX = $m || void 0 !== a.offsetX ? a.offsetX : a.layerX;
    this.offsetY = $m || void 0 !== a.offsetY ? a.offsetY : a.layerY;
    this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
    this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
    this.screenX = a.screenX || 0;
    this.screenY = a.screenY || 0;
    this.button = a.button;
    this.keyCode = a.keyCode || 0;
    this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.state = a.state;
    this.rb = a;
    a.defaultPrevented && this.preventDefault();
  }
}
wa(Zn, Xn);
Zn.prototype.stopPropagation = function() {
  Zn.Ab.stopPropagation.call(this);
  this.rb.stopPropagation ? this.rb.stopPropagation() : this.rb.cancelBubble = !0;
};
Zn.prototype.preventDefault = function() {
  Zn.Ab.preventDefault.call(this);
  var a = this.rb;
  if (a.preventDefault) {
    a.preventDefault();
  } else {
    if (a.returnValue = !1, Sn) {
      try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1;
        }
      } catch (b) {
      }
    }
  }
};
var $n = "closure_listenable_" + (1E6 * Math.random() | 0), ao = 0;
function bo(a, b, c, d, e) {
  this.listener = a;
  this.Gc = null;
  this.src = b;
  this.type = c;
  this.dc = !!d;
  this.uc = e;
  this.key = ++ao;
  this.zb = this.cc = !1;
}
function co(a) {
  a.zb = !0;
  a.listener = null;
  a.Gc = null;
  a.src = null;
  a.uc = null;
}
;function eo(a) {
  this.src = a;
  this.listeners = {};
  this.ac = 0;
}
eo.prototype.add = function(a, b, c, d, e) {
  var f = a.toString();
  a = this.listeners[f];
  a || (a = this.listeners[f] = [], this.ac++);
  var g = fo(a, b, d, e);
  -1 < g ? (b = a[g], c || (b.cc = !1)) : (b = new bo(b, this.src, f, !!d, e), b.cc = c, a.push(b));
  return b;
};
eo.prototype.remove = function(a, b, c, d) {
  a = a.toString();
  if (!(a in this.listeners)) {
    return !1;
  }
  var e = this.listeners[a];
  b = fo(e, b, c, d);
  return -1 < b ? (co(e[b]), Za.splice.call(e, b, 1), 0 == e.length && (delete this.listeners[a], this.ac--), !0) : !1;
};
function go(a, b) {
  var c = b.type;
  if (!(c in a.listeners)) {
    return !1;
  }
  var d = a.listeners[c], e = $a(d, b), f;
  (f = 0 <= e) && Za.splice.call(d, e, 1);
  f && (co(b), 0 == a.listeners[c].length && (delete a.listeners[c], a.ac--));
  return f;
}
eo.prototype.Hc = function(a) {
  a = a && a.toString();
  var b = 0, c;
  for (c in this.listeners) {
    if (!a || c == a) {
      for (var d = this.listeners[c], e = 0;e < d.length;e++) {
        ++b, co(d[e]);
      }
      delete this.listeners[c];
      this.ac--;
    }
  }
  return b;
};
eo.prototype.Sb = function(a, b, c, d) {
  a = this.listeners[a.toString()];
  var e = -1;
  a && (e = fo(a, b, c, d));
  return -1 < e ? a[e] : null;
};
function fo(a, b, c, d) {
  for (var e = 0;e < a.length;++e) {
    var f = a[e];
    if (!f.zb && f.listener == b && f.dc == !!c && f.uc == d) {
      return e;
    }
  }
  return -1;
}
;var ho = "closure_lm_" + (1E6 * Math.random() | 0), io = {}, jo = 0;
function ko(a, b, c, d, e) {
  if (ba(b)) {
    for (var f = 0;f < b.length;f++) {
      ko(a, b[f], c, d, e);
    }
    return null;
  }
  c = lo(c);
  if (a && a[$n]) {
    a = a.jb(b, c, d, e);
  } else {
    if (!b) {
      throw Error("Invalid event type");
    }
    var f = !!d, g = mo(a);
    g || (a[ho] = g = new eo(a));
    c = g.add(b, c, !1, d, e);
    c.Gc || (d = no(), c.Gc = d, d.src = a, d.listener = c, a.addEventListener ? a.addEventListener(b.toString(), d, f) : a.attachEvent(oo(b.toString()), d), jo++);
    a = c;
  }
  return a;
}
function no() {
  var a = po, b = Rn ? function(c) {
    return a.call(b.src, b.listener, c);
  } : function(c) {
    c = a.call(b.src, b.listener, c);
    if (!c) {
      return c;
    }
  };
  return b;
}
function qo(a, b, c, d, e) {
  if (ba(b)) {
    for (var f = 0;f < b.length;f++) {
      qo(a, b[f], c, d, e);
    }
  } else {
    c = lo(c), a && a[$n] ? a.ud(b, c, d, e) : a && (a = mo(a)) && (b = a.Sb(b, c, !!d, e)) && ro(b);
  }
}
function ro(a) {
  if (ga(a) || !a || a.zb) {
    return !1;
  }
  var b = a.src;
  if (b && b[$n]) {
    return go(b.Za, a);
  }
  var c = a.type, d = a.Gc;
  b.removeEventListener ? b.removeEventListener(c, d, a.dc) : b.detachEvent && b.detachEvent(oo(c), d);
  jo--;
  (c = mo(b)) ? (go(c, a), 0 == c.ac && (c.src = null, b[ho] = null)) : co(a);
  return !0;
}
function oo(a) {
  return a in io ? io[a] : io[a] = "on" + a;
}
function so(a, b, c, d) {
  var e = !0;
  if (a = mo(a)) {
    if (b = a.listeners[b.toString()]) {
      for (b = b.concat(), a = 0;a < b.length;a++) {
        var f = b[a];
        f && f.dc == c && !f.zb && (f = to(f, d), e = e && !1 !== f);
      }
    }
  }
  return e;
}
function to(a, b) {
  var c = a.listener, d = a.uc || a.src;
  a.cc && ro(a);
  return c.call(d, b);
}
function po(a, b) {
  if (a.zb) {
    return !0;
  }
  if (!Rn) {
    var c;
    if (!(c = b)) {
      a: {
        c = ["window", "event"];
        for (var d = aa, e;e = c.shift();) {
          if (null != d[e]) {
            d = d[e];
          } else {
            c = null;
            break a;
          }
        }
        c = d;
      }
    }
    e = c;
    c = new Zn(e, this);
    d = !0;
    if (!(0 > e.keyCode || void 0 != e.returnValue)) {
      a: {
        var f = !1;
        if (0 == e.keyCode) {
          try {
            e.keyCode = -1;
            break a;
          } catch (g) {
            f = !0;
          }
        }
        if (f || void 0 == e.returnValue) {
          e.returnValue = !0;
        }
      }
      e = [];
      for (f = c.currentTarget;f;f = f.parentNode) {
        e.push(f);
      }
      for (var f = a.type, k = e.length - 1;!c.lb && 0 <= k;k--) {
        c.currentTarget = e[k];
        var l = so(e[k], f, !0, c), d = d && l;
      }
      for (k = 0;!c.lb && k < e.length;k++) {
        c.currentTarget = e[k], l = so(e[k], f, !1, c), d = d && l;
      }
    }
    return d;
  }
  return to(a, new Zn(b, this));
}
function mo(a) {
  a = a[ho];
  return a instanceof eo ? a : null;
}
var uo = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
function lo(a) {
  if ("function" == n(a)) {
    return a;
  }
  a[uo] || (a[uo] = function(b) {
    return a.handleEvent(b);
  });
  return a[uo];
}
;function vo(a, b) {
  switch(b) {
    case 1:
      return 0 != a % 4 || 0 == a % 100 && 0 != a % 400 ? 28 : 29;
    case 5:
    ;
    case 8:
    ;
    case 10:
    ;
    case 3:
      return 30;
  }
  return 31;
}
function wo(a, b, c, d, e, f) {
  ca(a) ? (this.Ja = a == xo ? b : 0, this.Ga = a == yo ? b : 0, this.Ka = a == zo ? b : 0, this.Ea = a == Ao ? b : 0, this.Fa = a == Bo ? b : 0, this.Ha = a == Co ? b : 0) : (this.Ja = a || 0, this.Ga = b || 0, this.Ka = c || 0, this.Ea = d || 0, this.Fa = e || 0, this.Ha = f || 0);
}
wo.prototype.$b = function(a) {
  var b = Math.min(this.Ja, this.Ga, this.Ka, this.Ea, this.Fa, this.Ha), c = Math.max(this.Ja, this.Ga, this.Ka, this.Ea, this.Fa, this.Ha);
  if (0 > b && 0 < c) {
    return null;
  }
  if (!a && 0 == b && 0 == c) {
    return "PT0S";
  }
  c = [];
  0 > b && c.push("-");
  c.push("P");
  (this.Ja || a) && c.push(Math.abs(this.Ja) + "Y");
  (this.Ga || a) && c.push(Math.abs(this.Ga) + "M");
  (this.Ka || a) && c.push(Math.abs(this.Ka) + "D");
  if (this.Ea || this.Fa || this.Ha || a) {
    c.push("T"), (this.Ea || a) && c.push(Math.abs(this.Ea) + "H"), (this.Fa || a) && c.push(Math.abs(this.Fa) + "M"), (this.Ha || a) && c.push(Math.abs(this.Ha) + "S");
  }
  return c.join("");
};
wo.prototype.clone = function() {
  return new wo(this.Ja, this.Ga, this.Ka, this.Ea, this.Fa, this.Ha);
};
var xo = "y", yo = "m", zo = "d", Ao = "h", Bo = "n", Co = "s";
wo.prototype.add = function(a) {
  this.Ja += a.Ja;
  this.Ga += a.Ga;
  this.Ka += a.Ka;
  this.Ea += a.Ea;
  this.Fa += a.Fa;
  this.Ha += a.Ha;
};
function nn(a, b, c) {
  ga(a) ? (this.F = Do(a, b || 0, c || 1), Eo(this, c || 1)) : ha(a) ? (this.F = Do(a.getFullYear(), a.getMonth(), a.getDate()), Eo(this, a.getDate())) : (this.F = new Date(ta()), this.F.setHours(0), this.F.setMinutes(0), this.F.setSeconds(0), this.F.setMilliseconds(0));
}
function Do(a, b, c) {
  b = new Date(a, b, c);
  0 <= a && 100 > a && b.setFullYear(b.getFullYear() - 1900);
  return b;
}
h = nn.prototype;
h.sb = Rm.Td;
h.tb = Rm.Ud;
h.clone = function() {
  var a = new nn(this.F);
  a.sb = this.sb;
  a.tb = this.tb;
  return a;
};
h.getFullYear = function() {
  return this.F.getFullYear();
};
h.getYear = function() {
  return this.getFullYear();
};
h.getMonth = function() {
  return this.F.getMonth();
};
h.getDate = function() {
  return this.F.getDate();
};
h.getTime = function() {
  return this.F.getTime();
};
h.getDay = function() {
  return this.F.getDay();
};
h.getUTCFullYear = function() {
  return this.F.getUTCFullYear();
};
h.getUTCMonth = function() {
  return this.F.getUTCMonth();
};
h.getUTCDate = function() {
  return this.F.getUTCDate();
};
h.getUTCDay = function() {
  return this.F.getDay();
};
h.getUTCHours = function() {
  return this.F.getUTCHours();
};
h.getUTCMinutes = function() {
  return this.F.getUTCMinutes();
};
h.getTimezoneOffset = function() {
  return this.F.getTimezoneOffset();
};
function Fo(a) {
  a = a.getTimezoneOffset();
  if (0 == a) {
    a = "Z";
  } else {
    var b = Math.abs(a) / 60, c = Math.floor(b), b = 60 * (b - c);
    a = (0 < a ? "-" : "+") + Na(c) + ":" + Na(b);
  }
  return a;
}
h.set = function(a) {
  this.F = new Date(a.getFullYear(), a.getMonth(), a.getDate());
};
h.setFullYear = function(a) {
  this.F.setFullYear(a);
};
h.setYear = function(a) {
  this.setFullYear(a);
};
h.setMonth = function(a) {
  this.F.setMonth(a);
};
h.setDate = function(a) {
  this.F.setDate(a);
};
h.setTime = function(a) {
  this.F.setTime(a);
};
h.setUTCFullYear = function(a) {
  this.F.setUTCFullYear(a);
};
h.setUTCMonth = function(a) {
  this.F.setUTCMonth(a);
};
h.setUTCDate = function(a) {
  this.F.setUTCDate(a);
};
h.add = function(a) {
  if (a.Ja || a.Ga) {
    var b = this.getMonth() + a.Ga + 12 * a.Ja, c = this.getYear() + Math.floor(b / 12), b = b % 12;
    0 > b && (b += 12);
    var d = Math.min(vo(c, b), this.getDate());
    this.setDate(1);
    this.setFullYear(c);
    this.setMonth(b);
    this.setDate(d);
  }
  a.Ka && (b = new Date(this.getYear(), this.getMonth(), this.getDate(), 12), a = new Date(b.getTime() + 864E5 * a.Ka), this.setDate(1), this.setFullYear(a.getFullYear()), this.setMonth(a.getMonth()), this.setDate(a.getDate()), Eo(this, a.getDate()));
};
h.$b = function(a, b) {
  return [this.getFullYear(), Na(this.getMonth() + 1), Na(this.getDate())].join(a ? "-" : "") + (b ? Fo(this) : "");
};
h.toString = function() {
  return this.$b();
};
function Eo(a, b) {
  if (a.getDate() != b) {
    var c = a.getDate() < b ? 1 : -1;
    a.F.setUTCHours(a.F.getUTCHours() + c);
  }
}
h.valueOf = function() {
  return this.F.valueOf();
};
function Go(a, b, c, d, e, f, g) {
  this.F = ga(a) ? new Date(a, b || 0, c || 1, d || 0, e || 0, f || 0, g || 0) : new Date(a ? a.getTime() : ta());
}
wa(Go, nn);
h = Go.prototype;
h.getHours = function() {
  return this.F.getHours();
};
h.getMinutes = function() {
  return this.F.getMinutes();
};
h.getSeconds = function() {
  return this.F.getSeconds();
};
h.getMilliseconds = function() {
  return this.F.getMilliseconds();
};
h.getUTCDay = function() {
  return this.F.getUTCDay();
};
h.getUTCHours = function() {
  return this.F.getUTCHours();
};
h.getUTCMinutes = function() {
  return this.F.getUTCMinutes();
};
h.getUTCSeconds = function() {
  return this.F.getUTCSeconds();
};
h.getUTCMilliseconds = function() {
  return this.F.getUTCMilliseconds();
};
h.setHours = function(a) {
  this.F.setHours(a);
};
h.setMinutes = function(a) {
  this.F.setMinutes(a);
};
h.setSeconds = function(a) {
  this.F.setSeconds(a);
};
h.setMilliseconds = function(a) {
  this.F.setMilliseconds(a);
};
h.setUTCHours = function(a) {
  this.F.setUTCHours(a);
};
h.setUTCMinutes = function(a) {
  this.F.setUTCMinutes(a);
};
h.setUTCSeconds = function(a) {
  this.F.setUTCSeconds(a);
};
h.setUTCMilliseconds = function(a) {
  this.F.setUTCMilliseconds(a);
};
h.add = function(a) {
  nn.prototype.add.call(this, a);
  a.Ea && this.setHours(this.F.getHours() + a.Ea);
  a.Fa && this.setMinutes(this.F.getMinutes() + a.Fa);
  a.Ha && this.setSeconds(this.F.getSeconds() + a.Ha);
};
h.$b = function(a, b) {
  var c = nn.prototype.$b.call(this, a);
  return a ? c + " " + Na(this.getHours()) + ":" + Na(this.getMinutes()) + ":" + Na(this.getSeconds()) + (b ? Fo(this) : "") : c + "T" + Na(this.getHours()) + Na(this.getMinutes()) + Na(this.getSeconds()) + (b ? Fo(this) : "");
};
h.toString = function() {
  return this.$b();
};
h.clone = function() {
  var a = new Go(this.F);
  a.sb = this.sb;
  a.tb = this.tb;
  return a;
};
function Ho(a, b, c, d, e, f, g) {
  a = ga(a) ? Date.UTC(a, b || 0, c || 1, d || 0, e || 0, f || 0, g || 0) : a ? a.getTime() : ta();
  this.F = new Date(a);
}
wa(Ho, Go);
h = Ho.prototype;
h.clone = function() {
  var a = new Ho(this.F);
  a.sb = this.sb;
  a.tb = this.tb;
  return a;
};
h.add = function(a) {
  (a.Ja || a.Ga) && nn.prototype.add.call(this, new wo(a.Ja, a.Ga));
  this.F = new Date(this.F.getTime() + 1E3 * (a.Ha + 60 * (a.Fa + 60 * (a.Ea + 24 * a.Ka))));
};
h.getTimezoneOffset = function() {
  return 0;
};
h.getFullYear = Go.prototype.getUTCFullYear;
h.getMonth = Go.prototype.getUTCMonth;
h.getDate = Go.prototype.getUTCDate;
h.getHours = Go.prototype.getUTCHours;
h.getMinutes = Go.prototype.getUTCMinutes;
h.getSeconds = Go.prototype.getUTCSeconds;
h.getMilliseconds = Go.prototype.getUTCMilliseconds;
h.getDay = Go.prototype.getUTCDay;
h.setFullYear = Go.prototype.setUTCFullYear;
h.setMonth = Go.prototype.setUTCMonth;
h.setDate = Go.prototype.setUTCDate;
h.setHours = Go.prototype.setUTCHours;
h.setMinutes = Go.prototype.setUTCMinutes;
h.setSeconds = Go.prototype.setUTCSeconds;
h.setMilliseconds = Go.prototype.setUTCMilliseconds;
var Io = function Io(b) {
  if (b ? b.rc : b) {
    return b.rc(b);
  }
  var c;
  c = Io[n(null == b ? null : b)];
  if (!c && (c = Io._, !c)) {
    throw x("DateTimeProtocol.year", b);
  }
  return c.call(null, b);
}, Jo = function Jo(b) {
  if (b ? b.pc : b) {
    return b.pc(b);
  }
  var c;
  c = Jo[n(null == b ? null : b)];
  if (!c && (c = Jo._, !c)) {
    throw x("DateTimeProtocol.month", b);
  }
  return c.call(null, b);
}, Ko = function Ko(b) {
  if (b ? b.oc : b) {
    return b.oc(b);
  }
  var c;
  c = Ko[n(null == b ? null : b)];
  if (!c && (c = Ko._, !c)) {
    throw x("DateTimeProtocol.day", b);
  }
  return c.call(null, b);
}, Lo = function Lo(b) {
  if (b ? b.ed : b) {
    return b.ed(b);
  }
  var c;
  c = Lo[n(null == b ? null : b)];
  if (!c && (c = Lo._, !c)) {
    throw x("DateTimeProtocol.hour", b);
  }
  return c.call(null, b);
}, Mo = function Mo(b) {
  if (b ? b.gd : b) {
    return b.gd(b);
  }
  var c;
  c = Mo[n(null == b ? null : b)];
  if (!c && (c = Mo._, !c)) {
    throw x("DateTimeProtocol.minute", b);
  }
  return c.call(null, b);
}, No = function No(b) {
  if (b ? b.hd : b) {
    return b.hd(b);
  }
  var c;
  c = No[n(null == b ? null : b)];
  if (!c && (c = No._, !c)) {
    throw x("DateTimeProtocol.second", b);
  }
  return c.call(null, b);
}, Oo = function Oo(b) {
  if (b ? b.fd : b) {
    return b.fd(b);
  }
  var c;
  c = Oo[n(null == b ? null : b)];
  if (!c && (c = Oo._, !c)) {
    throw x("DateTimeProtocol.milli", b);
  }
  return c.call(null, b);
}, Po = function Po(b, c) {
  if (b ? b.mc : b) {
    return b.mc(b, c);
  }
  var d;
  d = Po[n(null == b ? null : b)];
  if (!d && (d = Po._, !d)) {
    throw x("DateTimeProtocol.after?", b);
  }
  return d.call(null, b, c);
}, Qo = function Qo(b, c) {
  if (b ? b.nc : b) {
    return b.nc(b, c);
  }
  var d;
  d = Qo[n(null == b ? null : b)];
  if (!d && (d = Qo._, !d)) {
    throw x("DateTimeProtocol.before?", b);
  }
  return d.call(null, b, c);
}, Ro = function Ro(b, c) {
  if (b ? b.qc : b) {
    return b.qc(b, c);
  }
  var d;
  d = Ro[n(null == b ? null : b)];
  if (!d && (d = Ro._, !d)) {
    throw x("DateTimeProtocol.plus-", b);
  }
  return d.call(null, b, c);
}, So = function() {
  function a(a, c, d, e, f) {
    e = e.clone();
    a = a.h ? a.h(e) : a.call(null, e);
    d = d.c ? d.c(a, f) : d.call(null, a, f);
    c.c ? c.c(e, d) : c.call(null, e, d);
    return e;
  }
  return new u(null, 8, [Uk, hf.l(a, Oo, function() {
    return function(a, c) {
      return a.setMilliseconds(c);
    };
  }(a)), Bj, hf.l(a, No, function() {
    return function(a, c) {
      return a.setSeconds(c);
    };
  }(a)), Fk, hf.l(a, Mo, function() {
    return function(a, c) {
      return a.setMinutes(c);
    };
  }(a)), sk, hf.l(a, Lo, function() {
    return function(a, c) {
      return a.setHours(c);
    };
  }(a)), pj, hf.l(a, Ko, function() {
    return function(a, c) {
      return a.setDate(c);
    };
  }(a)), Rk, function() {
    return function(a, c, d) {
      var e = c.clone();
      e.setDate(function() {
        var c = Ko(e), g = 7 * d;
        return a.c ? a.c(c, g) : a.call(null, c, g);
      }());
      return e;
    };
  }(a), lj, function() {
    return function(a, c, d) {
      c = c.clone();
      var e = Jo(c);
      a = a.c ? a.c(e, d) : a.call(null, e, d);
      d = Io(c);
      d = 12 < a ? d + 1 : 1 > a ? d - 1 : d;
      c.setMonth((12 < a ? ye(a, 12) : 1 > a ? a + 12 : a) - 1);
      c.setYear(d);
      return c;
    };
  }(a), tk, function() {
    return function(a, c, d) {
      var e = c.clone();
      v(function() {
        var a = on(Io(e));
        return v(a) && (a = Jo(e), a = ln.c ? ln.c(2, a) : ln.call(null, 2, a), v(a)) ? (a = Ko(e), ln.c ? ln.c(29, a) : ln.call(null, 29, a)) : a;
      }()) && e.setDate(28);
      e.setYear(function() {
        var c = Io(e);
        return a.c ? a.c(c, d) : a.call(null, c, d);
      }());
      return e;
    };
  }(a)], null);
}();
function To(a) {
  return function(b, c) {
    return Ab(function(a, c) {
      var f = Wb(c);
      return (So.h ? So.h(f) : So.call(null, f)).call(null, b, a, Xb(c));
    }, c, a);
  };
}
h = Ho.prototype;
h.rc = function() {
  return this.getYear();
};
h.pc = function() {
  return this.getMonth() + 1;
};
h.oc = function() {
  return this.getDate();
};
h.ed = function() {
  return this.getHours();
};
h.gd = function() {
  return this.getMinutes();
};
h.hd = function() {
  return this.getSeconds();
};
h.fd = function() {
  return this.getMilliseconds();
};
h.mc = function(a, b) {
  return this.getTime() > b.getTime();
};
h.nc = function(a, b) {
  return this.getTime() < b.getTime();
};
h.qc = function(a, b) {
  return To(b).call(null, we, this);
};
h = Go.prototype;
h.rc = function() {
  return this.getYear();
};
h.pc = function() {
  return this.getMonth() + 1;
};
h.oc = function() {
  return this.getDate();
};
h.ed = function() {
  return this.getHours();
};
h.gd = function() {
  return this.getMinutes();
};
h.hd = function() {
  return this.getSeconds();
};
h.fd = function() {
  return this.getMilliseconds();
};
h.mc = function(a, b) {
  return this.getTime() > b.getTime();
};
h.nc = function(a, b) {
  return this.getTime() < b.getTime();
};
h.qc = function(a, b) {
  return To(b).call(null, we, this);
};
h = nn.prototype;
h.rc = function() {
  return this.getYear();
};
h.pc = function() {
  return this.getMonth() + 1;
};
h.oc = function() {
  return this.getDate();
};
h.mc = function(a, b) {
  return this.getTime() > b.getTime();
};
h.nc = function(a, b) {
  return this.getTime() < b.getTime();
};
h.qc = function(a, b) {
  return To(b).call(null, we, this);
};
var Uo = Dh(new u(null, 4, [ek, "UTC", lk, 0, Wk, new X(null, 1, 5, Y, ["UTC"], null), Ii, Md], null));
if ("number" == typeof Uo) {
  var Vo = Uo;
  if (0 != Vo) {
    var Wo = ["Etc/GMT", 0 > Vo ? "-" : "+"], Vo = Math.abs(Vo);
    Wo.push(Math.floor(Vo / 60) % 100);
    Vo %= 60;
    0 != Vo && Wo.push(":", Na(Vo));
  }
  var Xo = Uo;
  if (0 != Xo) {
    var Yo = ["UTC", 0 > Xo ? "+" : "-"], Xo = Math.abs(Xo);
    Yo.push(Math.floor(Xo / 60) % 100);
    Xo %= 60;
    0 != Xo && Yo.push(":", Xo);
  }
}
function Zo(a, b, c) {
  return new Ho(a, b - 1, c, 0, 0, 0, 0);
}
var $o = function $o() {
  switch(arguments.length) {
    case 2:
      return $o.c(arguments[0], arguments[1]);
    default:
      return $o.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
$o.c = function(a, b) {
  return Ro(a, b);
};
$o.v = function(a, b, c) {
  return Ab(Ro, Ro(a, b), c);
};
$o.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return $o.v(b, a, c);
};
$o.H = 2;
function ap(a) {
  a = he(a) ? Ye(nf, a) : a;
  var b = S(a, kj);
  return S(a, Gk).getTime() - b.getTime();
}
function bp(a) {
  var b = he(a) ? Ye(nf, a) : a, c = S(b, kj), d = S(b, Gk);
  return fh(function(a, b, c, d) {
    return function(a) {
      return Qo(a, d);
    };
  }(a, b, c, d), W.c(function(a, b, c) {
    return function(a) {
      return $o.c(c, Dd(new sg([lj, a + 1]), new u(null, 1, [sj, Di], null)));
    };
  }(a, b, c, d), new hh(null, 0, Number.MAX_VALUE, 1, null)));
}
function cp(a) {
  return W.c(function(a) {
    return vo(a.getFullYear(), a.getMonth());
  }, bp(a));
}
function dp(a) {
  var b = he(a) ? Ye(nf, a) : a;
  a = S(b, kj);
  var b = S(b, Gk), c = Jo(a), d = Ko(a), e = Jo(b), f = Ko(b), g = v(function() {
    var a = ln.c ? ln.c(c, 2) : ln.call(null, c, 2);
    return v(a) && (a = ln.c ? ln.c(d, 29) : ln.call(null, d, 29), v(a)) ? (a = ln.c ? ln.c(e, 2) : ln.call(null, e, 2), v(a) ? ln.c ? ln.c(f, 28) : ln.call(null, f, 28) : a) : a;
  }()) ? 0 : v(Qo(Zo(Io(a), c, d), Zo(Io(a), e, f))) ? 0 : v(Po(Zo(Io(a), c, d), Zo(Io(a), e, f))) ? 1 : 0;
  return Io(b) - Io(a) - g;
}
if ("undefined" === typeof ep) {
  var ep, fp = mf ? mf(Z) : lf.call(null, Z), gp = mf ? mf(Z) : lf.call(null, Z), hp = mf ? mf(Z) : lf.call(null, Z), ip = mf ? mf(Z) : lf.call(null, Z), jp = Pd(Z, Kk, Jh());
  ep = new Vh(id("cljs-time.core", "-\x3eperiod"), Vd, Si, jp, fp, gp, hp, ip);
}
Xh(ep, new u(null, 1, [sj, ok], null), function(a) {
  var b = he(a) ? Ye(nf, a) : a, c = S(b, kj);
  S(b, Gk);
  a = dp(b);
  var d = Io(c), d = W.c(on, new hh(null, d, d + a, 1, null)), d = P(wf(ef(ge), d));
  Jo(c);
  var e = cp(b), c = P(e), e = 365 * a + d + se(we, e), d = ((((ap(b) / 1E3 | 0) / 60 | 0) / 60 | 0) / 24 | 0) - e, f = 24 * (d + e), e = (((ap(b) / 1E3 | 0) / 60 | 0) / 60 | 0) - f, g = 60 * (e + f), f = ((ap(b) / 1E3 | 0) / 60 | 0) - g, g = 60 * (f + g), k = (ap(b) / 1E3 | 0) - g, b = O([lj, c, pj, d, sk, e, Fk, f, Bj, k, Uk, ap(b) - 1E3 * (k + g)], 0);
  return Ze(T, Dd(new sg([tk, a]), new u(null, 1, [sj, Di], null)), b);
});
var kp = function kp() {
  switch(arguments.length) {
    case 1:
      return kp.h(arguments[0]);
    case 2:
      return kp.c(arguments[0], arguments[1]);
    default:
      return kp.v(arguments[0], arguments[1], new I(Array.prototype.slice.call(arguments, 2), 0));
  }
};
kp.h = function(a) {
  return a;
};
kp.c = function(a, b) {
  return P(a) < P(b) ? Ab(function(a, d) {
    return ke(b, d) ? Wd.c(a, d) : a;
  }, a, a) : Ab(Wd, a, b);
};
kp.v = function(a, b, c) {
  return Ab(kp, a, Ld.c(c, b));
};
kp.D = function(a) {
  var b = J(a), c = K(a);
  a = J(c);
  c = K(c);
  return kp.v(b, a, c);
};
kp.H = 2;
var lp = new X(null, 12, 5, Y, "January February March April May June July August September October November December".split(" "), null), mp = new X(null, 7, 5, Y, "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), null);
function np(a, b) {
  return b.substring(0, a);
}
var op = function() {
  function a(a) {
    return a.getDate();
  }
  var b = function() {
    return function(a) {
      return a.getMonth() + 1;
    };
  }(a), c = function() {
    return function(a) {
      return a.getYear();
    };
  }(a, b), d = function() {
    return function(a) {
      a = ye(a.getHours(), 12);
      return 0 === a ? 12 : a;
    };
  }(a, b, c), e = function() {
    return function(a) {
      return 12 > a.getHours() ? "am" : "pm";
    };
  }(a, b, c, d), f = function() {
    return function(a) {
      return 12 > a.getHours() ? "AM" : "PM";
    };
  }(a, b, c, d, e), g = function() {
    return function(a) {
      return a.getHours();
    };
  }(a, b, c, d, e, f), k = function() {
    return function(a) {
      return a.getMinutes();
    };
  }(a, b, c, d, e, f, g), l = function() {
    return function(a) {
      return a.getSeconds();
    };
  }(a, b, c, d, e, f, g, k), p = function() {
    return function(a) {
      return a.getMilliseconds();
    };
  }(a, b, c, d, e, f, g, k, l), m = function() {
    return function(a) {
      return Fo(a);
    };
  }(a, b, c, d, e, f, g, k, l, p), q = function() {
    return function(a) {
      var b = a.getDate(), c = a.getFullYear();
      for (a = a.getMonth() - 1;0 <= a;a--) {
        b += vo(c, a);
      }
      return b;
    };
  }(a, b, c, d, e, f, g, k, l, p, m), r = function() {
    return function(a) {
      return a.getDay();
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q);
  return Qd("d HH ZZ s ww MMM YYYY e ss DDD SSS dow YY M mm S MM EEE Z H DD dd a hh dth yyyy A EEEE h xxxx m yy D MMMM".split(" "), [a, function(a, b, c, d, e, f, g) {
    return function(a) {
      return rn(g(a));
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), m, l, function(a, b, c, d, e, f, g, k, l, m, p, q) {
    return function(a) {
      a = q(a) / 7;
      a = Math.ceil(a);
      return rn(a);
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), function(a, b) {
    return function(a) {
      a = b(a) - 1;
      return (lp.h ? lp.h(a) : lp.call(null, a)).substring(0, 3);
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), c, r, function(a, b, c, d, e, f, g, k, l) {
    return function(a) {
      return rn(l(a));
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), q, function(a, b, c, d, e, f, g, k, l, m) {
    return function(a) {
      a = m(a);
      return [z(el(rf(3 - P("" + z(a)), tf("0")))), z(a)].join("");
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), function(a, b, c, d, e, f, g, k, l, m, p, q, r) {
    return function(a) {
      a = r(a);
      return mp.h ? mp.h(a) : mp.call(null, a);
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), function(a, b, c) {
    return function(a) {
      return ye(c(a), 100);
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), b, function(a, b, c, d, e, f, g, k) {
    return function(a) {
      return rn(k(a));
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), p, function(a, b) {
    return function(a) {
      return rn(b(a));
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), function(a, b, c, d, e, f, g, k, l, m, p, q, r) {
    return function(a) {
      a = r(a);
      return (mp.h ? mp.h(a) : mp.call(null, a)).substring(0, 3);
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), m, g, q, function(a) {
    return function(b) {
      return rn(a(b));
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), e, function(a, b, c, d) {
    return function(a) {
      return rn(d(a));
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), function(a) {
    return function(b) {
      var c = a(b);
      return [z(c), z(function() {
        switch(c) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      }())].join("");
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), c, f, function(a, b, c, d, e, f, g, k, l, m, p, q, r) {
    return function(a) {
      a = r(a);
      return mp.h ? mp.h(a) : mp.call(null, a);
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), d, c, k, function(a, b, c) {
    return function(a) {
      return ye(c(a), 100);
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), q, function(a, b) {
    return function(a) {
      a = b(a) - 1;
      return lp.h ? lp.h(a) : lp.call(null, a);
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r)]);
}(), pp = function() {
  function a(a) {
    return parseInt(a, 10);
  }
  var b = function(a) {
    return function(b) {
      return function(a) {
        return function(c, d) {
          return T.l(c, b, a(d));
        };
      }(a);
    };
  }(a), c = b(tk), d = b(pj), e = function(a) {
    return function(b, c) {
      return T.l(b, lj, a(c) - 1);
    };
  }(a, b, c, d), f = function(a) {
    return function(b, c) {
      return T.l(b, sk, ye(a(c), 12));
    };
  }(a, b, c, d, e), g = function() {
    return function(a, b) {
      var c = he(a) ? Ye(nf, a) : a, d = S(c, sk);
      return v((new ah(null, new u(null, 2, ["p", null, "pm", null], null), null)).call(null, b.toLowerCase())) ? T.l(c, sk, function() {
        var a = 12 + d;
        return L.c(a, 24) ? 0 : a;
      }()) : c;
    };
  }(a, b, c, d, e, f), k = b(sk), l = b(Fk), p = b(Bj), m = b(Uk), q = function(a, b, c, d, e, f, g, k, l, m, p) {
    return function(q, r) {
      var t = J(wf(function() {
        return function(a) {
          return lh(mh([z("^"), z(r)].join("")), a);
        };
      }(a, b, c, d, e, f, g, k, l, m, p), lp));
      return e(q, "" + z(pn(lp, t) + 1));
    };
  }(a, b, c, d, e, f, g, k, l, p, m), r = function(a, b, c, d, e) {
    return function(a, b) {
      return e(a, "" + z(pn(lp, b) + 1));
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q), t = function() {
    return function() {
      function a(b, c) {
        if (1 < arguments.length) {
          for (var d = 0, e = Array(arguments.length - 1);d < e.length;) {
            e[d] = arguments[d + 1], ++d;
          }
        }
        return b;
      }
      a.H = 1;
      a.D = function(a) {
        var b = J(a);
        jd(a);
        return b;
      };
      a.v = function(a) {
        return a;
      };
      return a;
    }();
  }(a, b, c, d, e, f, g, k, l, p, m, q, r), b = function() {
    return function(a, b) {
      return T.l(a, al, b);
    };
  }(a, b, c, d, e, f, g, k, l, p, m, q, r, t);
  return Qd("d HH ZZ s MMM YYYY ss DDD SSS dow YY M mm S MM Y EEE Z H E DD dd a hh dth y yyyy A EEEE h m yy D MMMM".split(" "), [new X(null, 2, 5, Y, ["(\\d{1,2})", d], null), new X(null, 2, 5, Y, ["(\\d{2})", k], null), new X(null, 2, 5, Y, ["((?:(?:\\+|-)\\d{2}:\\d{2})|Z+)", b], null), new X(null, 2, 5, Y, ["(\\d{1,2})", p], null), new X(null, 2, 5, Y, [[z("("), z(fl("|", W.c(hf.c(np, 3), lp))), z(")")].join(""), q], null), new X(null, 2, 5, Y, ["(\\d{4})", c], null), new X(null, 2, 5, Y, ["(\\d{2})", 
  p], null), new X(null, 2, 5, Y, ["(\\d{3})", d], null), new X(null, 2, 5, Y, ["(\\d{3})", m], null), new X(null, 2, 5, Y, [[z("("), z(fl("|", mp)), z(")")].join(""), t], null), new X(null, 2, 5, Y, ["(\\d{2,4})", c], null), new X(null, 2, 5, Y, ["(\\d{1,2})", e], null), new X(null, 2, 5, Y, ["(\\d{2})", l], null), new X(null, 2, 5, Y, ["(\\d{1,2})", m], null), new X(null, 2, 5, Y, ["((?:\\d{2})|(?:\\b\\d{1,2}\\b))", e], null), new X(null, 2, 5, Y, ["(\\d{1,4})", c], null), new X(null, 2, 5, Y, 
  [[z("("), z(fl("|", W.c(hf.c(np, 3), mp))), z(")")].join(""), t], null), new X(null, 2, 5, Y, ["((?:(?:\\+|-)\\d{2}:?\\d{2})|Z+)", b], null), new X(null, 2, 5, Y, ["(\\d{1,2})", k], null), new X(null, 2, 5, Y, [[z("("), z(fl("|", W.c(hf.c(np, 3), mp))), z(")")].join(""), t], null), new X(null, 2, 5, Y, ["(\\d{2,3})", d], null), new X(null, 2, 5, Y, ["(\\d{2})", d], null), new X(null, 2, 5, Y, ["(am|pm|a|p|AM|PM|A|P)", g], null), new X(null, 2, 5, Y, ["(\\d{2})", f], null), new X(null, 2, 5, Y, 
  ["(\\d{1,2})(?:st|nd|rd|th)", d], null), new X(null, 2, 5, Y, ["(\\d{1,4})", c], null), new X(null, 2, 5, Y, ["(\\d{4})", c], null), new X(null, 2, 5, Y, ["(am|pm|a|p|AM|PM|A|P)", g], null), new X(null, 2, 5, Y, [[z("("), z(fl("|", mp)), z(")")].join(""), t], null), new X(null, 2, 5, Y, ["(\\d{1,2})", f], null), new X(null, 2, 5, Y, ["(\\d{1,2})", l], null), new X(null, 2, 5, Y, ["(\\d{2,4})", c], null), new X(null, 2, 5, Y, ["(\\d{1,3})", d], null), new X(null, 2, 5, Y, [[z("("), z(fl("|", lp)), 
  z(")")].join(""), r], null)]);
}();
function qp(a) {
  return pn(new X(null, 30, 5, Y, "YYYY YY Y yyyy yy y d dd D DD DDD dth M MM MMM MMMM dow h H m s S hh HH mm ss a SSS Z ZZ".split(" "), null), a);
}
var rp = mh([z("("), z(fl(")|(", Fe(qe(P, ng(op))))), z(")")].join(""));
function sp(a) {
  return mh(dl(dl(a, /'([^']+)'/, "$1"), rp, function(a) {
    return J(pp.h ? pp.h(a) : pp.call(null, a));
  }));
}
function tp(a) {
  return function(b) {
    return qe(gf.c(qp, Id), yf(vf.c(Jd(lh(sp(a), b)), W.c(J, lh(rp, a)))));
  };
}
function up(a) {
  return function() {
    function b(a, b) {
      var f = null;
      if (1 < arguments.length) {
        for (var f = 0, g = Array(arguments.length - 1);f < g.length;) {
          g[f] = arguments[f + 1], ++f;
        }
        f = new I(g, 0);
      }
      return c.call(this, a, f);
    }
    function c(b, c) {
      var f = R(c, 0);
      return new X(null, 3, 5, Y, [dl(a, /'([^']+)'/, "$1"), rp, function(a, c) {
        return function(a) {
          return (v(c) ? c : op).call(null, a).call(null, b);
        };
      }(c, f)], null);
    }
    b.H = 1;
    b.D = function(a) {
      var b = J(a);
      a = jd(a);
      return c(b, a);
    };
    b.v = c;
    return b;
  }();
}
function vp(a) {
  return Dd(new u(null, 2, [Uj, tp(a), cj, up(a)], null), new u(null, 1, [sj, Ui], null));
}
function wp(a) {
  return function() {
    throw Dh(new u(null, 2, [Wi, Hk, $k, qn(O([Ke(a)], 0))], null));
  };
}
var xp = wp(new E(null, "dateElementParser", "dateElementParser", 984800945, null)), yp = vp("HH:mm"), zp = vp("'T'HH:mm:ss.SSSZZ"), Ap = vp("yyyyDDD"), Bp = vp("yyyy-MM-dd"), Cp = vp("HH"), Dp = vp("HH:mm:ssZZ"), Ep = vp("xxxx-'W'ww-e"), Fp = vp("xxxx-'W'ww-e'T'HH:mm:ss.SSSZZ"), Gp = vp("yyyy-MM-dd'T'HH:mm:ss.SSS"), Hp = vp("yyyyMMdd'T'HHmmss.SSSZ"), Ip = vp("yyyy-MM-dd'T'HH:mm:ss.SSSZZ"), Jp = vp("HHmmssZ"), Kp = wp(new E(null, "dateParser", "dateParser", -1248418930, null)), Lp = vp("xxxx'W'wwe"), 
Mp = vp("'T'HHmmssZ"), Np = wp(new E(null, "localTimeParser", "localTimeParser", -1738135328, null)), Op = vp("yyyy-MM-dd'T'HH:mm:ssZZ"), Pp = vp("yyyy-MM-dd"), Qp = wp(new E(null, "dateOptionalTimeParser", "dateOptionalTimeParser", 1783230854, null)), Rp = vp("EEE, dd MMM yyyy HH:mm:ss Z"), Sp = vp("yyyy-MM-dd'T'HH:mm:ss.SSS"), Tp = vp("yyyyDDD'T'HHmmss.SSSZ"), Up = vp("yyyy-DDD"), Vp = vp("HH:mm:ss.SSS"), Wp = vp("yyyy-MM-dd'T'HH:mm"), Xp = vp("HH:mm:ss.SSSZZ"), Yp = vp("xxxx'W'wwe'T'HHmmss.SSSZ"), 
Zp = vp("xxxx"), $p = vp("HHmmss.SSSZ"), aq = vp("HH:mm:ss"), bq = vp("yyyy-DDD'T'HH:mm:ss.SSSZZ"), cq = vp("yyyy-DDD'T'HH:mm:ssZZ"), dq = vp("HH:mm:ss.SSS"), eq;
eq = vp(new E(null, "timeParser", "timeParser", 1585048034, null));
var fq = Qd([ci, di, ii, ki, mi, ni, ri, si, ti, ui, wi, xi, yi, zi, Ai, Fi, Gi, Ji, Ki, Ni, Qi, Vi, Xi, Zi, bj, ej, fj, ij, rj, vj, zj, Aj, Cj, Ej, Ij, Nj, Oj, Qj, Rj, Vj, ak, ck, dk, hk, pk, vk, Ck, Lk, Nk, Ok, Sk, Xk, bl], [xp, yp, zp, Ap, Bp, Cp, Dp, Ep, Fp, Gp, Hp, Ip, Jp, Kp, Lp, Mp, Np, Op, Pp, Qp, Rp, Sp, Tp, Up, Vp, Wp, Xp, Yp, Zp, $p, aq, bq, cq, dq, eq, wp(new E(null, "dateTimeParser", "dateTimeParser", -1493718282, null)), vp("yyyy"), vp("'T'HH:mm:ssZZ"), vp("xxxx'W'wwe'T'HHmmssZ"), vp("yyyyMMdd"), 
vp("xxxx-'W'ww"), wp(new E(null, "localDateParser", "localDateParser", 477820077, null)), vp("yyyyDDD'T'HHmmssZ"), vp("yyyy-MM"), wp(new E(null, "localDateOptionalTimeParser", "localDateOptionalTimeParser", 435955537, null)), vp("xxxx-'W'ww-e"), vp("yyyy-MM-dd'T'HH"), wp(new E(null, "timeElementParser", "timeElementParser", 302132553, null)), vp("yyyy-MM-dd'T'HH:mm:ss"), vp("xxxx-'W'ww-e'T'HH:mm:ssZZ"), vp("yyyyMMdd'T'HHmmssZ"), vp("yyyy-MM-dd HH:mm:ss"), vp("'T'HHmmss.SSSZ")]), gq = new ah(null, 
new u(null, 9, [ci, null, zi, null, Gi, null, Ni, null, Ij, null, Nj, null, ck, null, pk, null, Lk, null], null), null);
kp.c(dh(ng(fq)), gq);
if ("undefined" === typeof hq) {
  var hq, iq = mf ? mf(Z) : lf.call(null, Z), jq = mf ? mf(Z) : lf.call(null, Z), kq = mf ? mf(Z) : lf.call(null, Z), lq = mf ? mf(Z) : lf.call(null, Z), mq = Pd(Z, Kk, Jh());
  hq = new Vh(id("cljs-time.format", "date-map"), tb, Si, mq, iq, jq, kq, lq);
}
Xh(hq, nn, function() {
  return new u(null, 3, [tk, 0, lj, 0, pj, 1], null);
});
Xh(hq, Go, function() {
  return new u(null, 7, [tk, 0, lj, 0, pj, 1, sk, 0, Fk, 0, Bj, 0, Uk, 0], null);
});
Xh(hq, Ho, function() {
  return new u(null, 8, [tk, 0, lj, 0, pj, 1, sk, 0, Fk, 0, Bj, 0, Uk, 0, al, null], null);
});
function nq(a) {
  var b = document;
  return ca(a) ? b.getElementById(a) : a;
}
function oq(a) {
  return a.contentDocument || a.contentWindow.document;
}
;function pq() {
  return new X(null, 2, 5, Y, [Mj, new X(null, 2, 5, Y, [Bi, new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Dj, function() {
    return window.history.back();
  }], null), "BACK"], null)], null)], null)], null);
}
;function qq() {
  Tn.call(this);
  this.Za = new eo(this);
  this.ae = this;
  this.pd = null;
}
wa(qq, Tn);
qq.prototype[$n] = !0;
h = qq.prototype;
h.addEventListener = function(a, b, c, d) {
  ko(this, a, b, c, d);
};
h.removeEventListener = function(a, b, c, d) {
  qo(this, a, b, c, d);
};
h.dispatchEvent = function(a) {
  var b, c = this.pd;
  if (c) {
    for (b = [];c;c = c.pd) {
      b.push(c);
    }
  }
  var c = this.ae, d = a.type || a;
  if (ca(a)) {
    a = new Xn(a, c);
  } else {
    if (a instanceof Xn) {
      a.target = a.target || c;
    } else {
      var e = a;
      a = new Xn(d, c);
      Sa(a, e);
    }
  }
  var e = !0, f;
  if (b) {
    for (var g = b.length - 1;!a.lb && 0 <= g;g--) {
      f = a.currentTarget = b[g], e = rq(f, d, !0, a) && e;
    }
  }
  a.lb || (f = a.currentTarget = c, e = rq(f, d, !0, a) && e, a.lb || (e = rq(f, d, !1, a) && e));
  if (b) {
    for (g = 0;!a.lb && g < b.length;g++) {
      f = a.currentTarget = b[g], e = rq(f, d, !1, a) && e;
    }
  }
  return e;
};
h.Ua = function() {
  qq.Ab.Ua.call(this);
  this.removeAllListeners();
  this.pd = null;
};
h.jb = function(a, b, c, d) {
  return this.Za.add(String(a), b, !1, c, d);
};
h.ud = function(a, b, c, d) {
  return this.Za.remove(String(a), b, c, d);
};
h.removeAllListeners = function(a) {
  return this.Za ? this.Za.Hc(a) : 0;
};
function rq(a, b, c, d) {
  b = a.Za.listeners[String(b)];
  if (!b) {
    return !0;
  }
  b = b.concat();
  for (var e = !0, f = 0;f < b.length;++f) {
    var g = b[f];
    if (g && !g.zb && g.dc == c) {
      var k = g.listener, l = g.uc || g.src;
      g.cc && go(a.Za, g);
      e = !1 !== k.call(l, d) && e;
    }
  }
  return e && 0 != d.Od;
}
h.Sb = function(a, b, c, d) {
  return this.Za.Sb(String(a), b, c, d);
};
function sq(a, b) {
  qq.call(this);
  this.Vb = a || 1;
  this.Bb = b || aa;
  this.Nc = ra(this.xe, this);
  this.nd = ta();
}
wa(sq, qq);
h = sq.prototype;
h.enabled = !1;
h.Z = null;
h.setInterval = function(a) {
  this.Vb = a;
  this.Z && this.enabled ? (this.stop(), this.start()) : this.Z && this.stop();
};
h.xe = function() {
  if (this.enabled) {
    var a = ta() - this.nd;
    0 < a && a < .8 * this.Vb ? this.Z = this.Bb.setTimeout(this.Nc, this.Vb - a) : (this.Z && (this.Bb.clearTimeout(this.Z), this.Z = null), this.dispatchEvent(tq), this.enabled && (this.Z = this.Bb.setTimeout(this.Nc, this.Vb), this.nd = ta()));
  }
};
h.start = function() {
  this.enabled = !0;
  this.Z || (this.Z = this.Bb.setTimeout(this.Nc, this.Vb), this.nd = ta());
};
h.stop = function() {
  this.enabled = !1;
  this.Z && (this.Bb.clearTimeout(this.Z), this.Z = null);
};
h.Ua = function() {
  sq.Ab.Ua.call(this);
  this.stop();
  delete this.Bb;
};
var tq = "tick";
function uq() {
  return new X(null, 1, 5, Y, [gk], null);
}
function vq() {
  var a = document.getElementById("place-edit-map-canvas"), b = Mk.h(M.h ? M.h(Nm) : M.call(null, Nm)), c = he(b) ? Ye(nf, b) : b, b = S(c, uk), c = S(c, uj), b = new google.od.Vd(b, c), b = Dh(new u(null, 2, [Gj, b, li, 18], null));
  return new google.od.Map(a, b);
}
function wq() {
  return jm(new u(null, 2, [Xj, uq, gj, vq], null));
}
function xq(a, b) {
  return new X(null, 3, 5, Y, [yj, new X(null, 2, 5, Y, [nj, [z(b), z(":")].join("")], null), new X(null, 2, 5, Y, [hi, new X(null, 2, 5, Y, [tj, new u(null, 2, [sj, "text", dj, a], null)], null)], null)], null);
}
function yq() {
  var a = Mk.h(M.h ? M.h(Nm) : M.call(null, Nm)), b = he(a) ? Ye(nf, a) : a, a = S(b, Wi), c = S(b, bi), d = S(b, sj), e = S(b, uk), b = S(b, uj);
  return new X(null, 3, 5, Y, [Mj, new X(null, 1, 5, Y, [wq], null), new X(null, 7, 5, Y, [fk, new X(null, 3, 5, Y, [xq, a, "Name"], null), new X(null, 3, 5, Y, [xq, c, "Description"], null), new X(null, 3, 5, Y, [xq, d, "Type"], null), new X(null, 3, 5, Y, [xq, e, "Latitude"], null), new X(null, 3, 5, Y, [xq, b, "Longitude"], null), new X(null, 2, 5, Y, [yj, new X(null, 2, 5, Y, [Jj, new X(null, 3, 5, Y, [Lj, new u(null, 1, [sj, "submit"], null), "Submit"], null)], null)], null)], null)], null);
}
function zq() {
  return new X(null, 3, 5, Y, [Mj, new X(null, 2, 5, Y, [Bi, new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Dj, function() {
    return window.history.back();
  }], null), "BACK"], null)], null)], null), new X(null, 1, 5, Y, [yq], null)], null);
}
;function Aq() {
  return new X(null, 1, 5, Y, [qk], null);
}
function Bq() {
  var a = document.getElementById("place-details-map-canvas"), b = Mk.h(M.h ? M.h(Nm) : M.call(null, Nm)), c = he(b) ? Ye(nf, b) : b, b = S(c, uk), c = S(c, uj), b = new google.od.Vd(b, c), b = Dh(new u(null, 2, [Gj, b, li, 18], null));
  return new google.od.Map(a, b);
}
function Cq() {
  return jm(new u(null, 2, [Xj, Aq, gj, Bq], null));
}
function Dq(a, b) {
  var c = Y, d = new X(null, 2, 5, Y, [nj, [z(b), z(":")].join("")], null);
  return new X(null, 3, 5, c, [yj, d, new X(null, 2, 5, Y, [hi, new X(null, 2, 5, Y, [Hi, v(/^[\s\xa0]*$/.test(null == a ? "" : String(a))) ? "None" : a], null)], null)], null);
}
function Eq() {
  var a = Mk.h(M.h ? M.h(Nm) : M.call(null, Nm)), b = he(a) ? Ye(nf, a) : a, a = S(b, Wi), c = S(b, bi), d = S(b, sj), e = S(b, uk), b = S(b, uj);
  return new X(null, 3, 5, Y, [Mj, new X(null, 1, 5, Y, [Cq], null), new X(null, 6, 5, Y, [fk, new X(null, 3, 5, Y, [Dq, a, "Name"], null), new X(null, 3, 5, Y, [Dq, c, "Description"], null), new X(null, 3, 5, Y, [Dq, d, "Type"], null), new X(null, 3, 5, Y, [Dq, e, "Latitude"], null), new X(null, 3, 5, Y, [Dq, b, "Longitude"], null)], null)], null);
}
function Fq() {
  return new X(null, 3, 5, Y, [Mj, new X(null, 5, 5, Y, [Bi, new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Dj, function() {
    return window.history.back();
  }], null), "BACK"], null)], null), new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Vk, "#place-share"], null), "Share"], null)], null), new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Vk, "#place-edit"], null), "Edit"], null)], null), new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Dj, function() {
    M.h ? M.h(Nm) : M.call(null, Nm);
    return null;
  }], null), "Delete"], null)], null)], null), new X(null, 1, 5, Y, [Eq], null)], null);
}
;function Gq() {
  return new X(null, 2, 5, Y, [Mj, new X(null, 2, 5, Y, [Bi, new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Dj, function() {
    return window.history.back();
  }], null), "BACK"], null)], null)], null)], null);
}
;function Hq(a) {
  Tn.call(this);
  this.Gd = a;
  this.Ac = {};
}
wa(Hq, Tn);
var Iq = [];
h = Hq.prototype;
h.jb = function(a, b, c, d) {
  ba(b) || (b && (Iq[0] = b.toString()), b = Iq);
  for (var e = 0;e < b.length;e++) {
    var f = ko(a, b[e], c || this.handleEvent, d || !1, this.Gd || this);
    if (!f) {
      break;
    }
    this.Ac[f.key] = f;
  }
  return this;
};
h.ud = function(a, b, c, d, e) {
  if (ba(b)) {
    for (var f = 0;f < b.length;f++) {
      this.ud(a, b[f], c, d, e);
    }
  } else {
    c = c || this.handleEvent, e = e || this.Gd || this, c = lo(c), d = !!d, b = a && a[$n] ? a.Sb(b, c, d, e) : a ? (a = mo(a)) ? a.Sb(b, c, d, e) : null : null, b && (ro(b), delete this.Ac[b.key]);
  }
  return this;
};
h.Hc = function() {
  Qa(this.Ac, ro);
  this.Ac = {};
};
h.Ua = function() {
  Hq.Ab.Ua.call(this);
  this.Hc();
};
h.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
function Jq(a) {
  Xn.call(this, "navigate");
  this.ye = a;
}
wa(Jq, Xn);
function Kq(a, b) {
  for (var c = [a], d = b.length - 1;0 <= d;--d) {
    c.push(typeof b[d], b[d]);
  }
  return c.join("\x0B");
}
;function Lq(a, b, c, d) {
  qq.call(this);
  if (a && !b) {
    throw Error("Can't use invisible history without providing a blank page.");
  }
  var e;
  if (c) {
    e = c;
  } else {
    e = "history_state" + Mq;
    var f = Nn("input", {type:"text", name:e, id:e, style:wn("display:none")});
    document.write(Jn(f));
    e = nq(e);
  }
  this.wc = e;
  c = c ? (c = 9 == c.nodeType ? c : c.ownerDocument || c.document) ? c.parentWindow || c.defaultView : window : window;
  this.Xa = c;
  this.ld = ca(b) ? Gn(b) : b;
  Ym && !b && (b = "https" == window.location.protocol ? wn("https:///") : wn('javascript:""'), this.ld = b = Gn(vn(b)));
  this.Z = new sq(Nq);
  b = sa(Wn, this.Z);
  this.Qb ? b.call(void 0) : (this.kb || (this.kb = []), this.kb.push(b));
  this.Cb = !a;
  this.hb = new Hq(this);
  if (a || Oq) {
    var g;
    if (d) {
      g = d;
    } else {
      a = "history_iframe" + Mq;
      d = {id:a, style:wn("display:none"), hf:void 0};
      b = {};
      b.src = this.ld || null;
      b.srcdoc = null;
      c = {sandbox:""};
      e = {};
      for (g in b) {
        e[g] = b[g];
      }
      for (g in c) {
        e[g] = c[g];
      }
      for (g in d) {
        f = g.toLowerCase();
        if (f in b) {
          throw Error('Cannot override "' + f + '" attribute, got "' + g + '" with value "' + d[g] + '"');
        }
        f in c && delete e[f];
        e[g] = d[g];
      }
      g = On("iframe", e, void 0);
      document.write(Jn(g));
      g = nq(a);
    }
    this.yc = g;
    this.Sd = !0;
  }
  Oq && (this.hb.jb(this.Xa, "load", this.re), this.Rd = this.kd = !1);
  this.Cb ? Pq(this, Qq(this), !0) : Rq(this, this.wc.value);
  Mq++;
}
wa(Lq, qq);
Lq.prototype.sc = !1;
Lq.prototype.yb = !1;
Lq.prototype.Xb = null;
var Sq = function(a, b) {
  var c = b || Kq;
  return function() {
    var b = this || aa, b = b.closure_memoize_cache_ || (b.closure_memoize_cache_ = {}), e = c(ia(a), arguments);
    return b.hasOwnProperty(e) ? b[e] : b[e] = a.apply(this, arguments);
  };
}(function() {
  return Ym ? fn(8) : "onhashchange" in aa;
}), Oq = Ym && !fn(8);
h = Lq.prototype;
h.Yb = null;
h.Ua = function() {
  Lq.Ab.Ua.call(this);
  this.hb.jd();
  Tq(this, !1);
};
function Tq(a, b) {
  if (b != a.sc) {
    if (Oq && !a.kd) {
      a.Rd = b;
    } else {
      if (b) {
        if (Xm ? a.hb.jb(a.Xa.document, Uq, a.ue) : Zm && a.hb.jb(a.Xa, "pageshow", a.te), Sq() && a.Cb) {
          a.hb.jb(a.Xa, "hashchange", a.se), a.sc = !0, a.dispatchEvent(new Jq(Qq(a)));
        } else {
          if (!Ym || !(Vm("iPad") || Vm("Android") && !Vm("Mobile") || Vm("Silk")) && (Vm("iPod") || Vm("iPhone") || Vm("Android") || Vm("IEMobile")) || a.kd) {
            a.hb.jb(a.Z, tq, ra(a.be, a, !0)), a.sc = !0, Oq || (a.Xb = Qq(a), a.dispatchEvent(new Jq(Qq(a)))), a.Z.start();
          }
        }
      } else {
        a.sc = !1, a.hb.Hc(), a.Z.stop();
      }
    }
  }
}
h.re = function() {
  this.kd = !0;
  this.wc.value && Rq(this, this.wc.value, !0);
  Tq(this, this.Rd);
};
h.te = function(a) {
  a.rb.persisted && (Tq(this, !1), Tq(this, !0));
};
h.se = function() {
  var a = Vq(this.Xa);
  a != this.Xb && Wq(this, a);
};
function Qq(a) {
  return null != a.Yb ? a.Yb : a.Cb ? Vq(a.Xa) : Xq(a) || "";
}
function Vq(a) {
  a = a.location.href;
  var b = a.indexOf("#");
  return 0 > b ? "" : a.substring(b + 1);
}
function Pq(a, b, c) {
  a = a.Xa.location;
  var d = a.href.split("#")[0], e = -1 != a.href.indexOf("#");
  if (Oq || e || b) {
    d += "#" + b;
  }
  d != a.href && (c ? a.replace(d) : a.href = d);
}
function Rq(a, b, c) {
  if (a.Sd || b != Xq(a)) {
    if (a.Sd = !1, b = encodeURIComponent(String(b)), Ym) {
      var d = oq(a.yc);
      d.open("text/html", c ? "replace" : void 0);
      c = Pn(Nn("title", {}, a.Xa.document.title), Nn("body", {}, b));
      d.write(Jn(c));
      d.close();
    } else {
      if (d = Fn(a.ld) + "#" + b, a = a.yc.contentWindow) {
        c ? a.location.replace(d) : a.location.href = d;
      }
    }
  }
}
function Xq(a) {
  if (Ym) {
    return a = oq(a.yc), a.body ? decodeURIComponent(a.body.innerHTML.replace(/\+/g, " ")) : null;
  }
  var b = a.yc.contentWindow;
  if (b) {
    var c;
    try {
      c = decodeURIComponent(Vq(b).replace(/\+/g, " "));
    } catch (d) {
      return a.yb || (1 != a.yb && a.Z.setInterval(Yq), a.yb = !0), null;
    }
    a.yb && (0 != a.yb && a.Z.setInterval(Nq), a.yb = !1);
    return c || null;
  }
  return null;
}
h.be = function() {
  if (this.Cb) {
    var a = Vq(this.Xa);
    a != this.Xb && Wq(this, a);
  }
  if (!this.Cb || Oq) {
    if (a = Xq(this) || "", null == this.Yb || a == this.Yb) {
      this.Yb = null, a != this.Xb && Wq(this, a);
    }
  }
};
function Wq(a, b) {
  a.Xb = a.wc.value = b;
  a.Cb ? (Oq && Rq(a, b), Pq(a, b)) : Rq(a, b);
  a.dispatchEvent(new Jq(Qq(a)));
}
h.ue = function() {
  this.Z.stop();
  this.Z.start();
};
var Uq = ["mousedown", "keydown", "mousemove"], Mq = 0, Nq = 150, Yq = 1E4;
var Zq = function Zq(b, c) {
  var d;
  d = hf.c(Zq, b);
  he(c) ? (d = ih(W.c(d, c)), d = b.h ? b.h(d) : b.call(null, d)) : Yd(c) ? (d = xf.c(null == c ? null : Hb(c), W.c(d, c)), d = b.h ? b.h(d) : b.call(null, d)) : d = b.h ? b.h(c) : b.call(null, c);
  return d;
};
function $q(a) {
  return Zq(function(a) {
    return function(c) {
      return ae(c) ? xf.c(Z, W.c(a, c)) : c;
    };
  }(function(a) {
    var c = R(a, 0);
    a = R(a, 1);
    return "string" === typeof c ? new X(null, 2, 5, Y, [Je.h(c), a], null) : new X(null, 2, 5, Y, [c, a], null);
  }), a);
}
;var ar, br = function br(b, c) {
  if (b ? b.Ic : b) {
    return b.Ic(b, c);
  }
  var d;
  d = br[n(null == b ? null : b)];
  if (!d && (d = br._, !d)) {
    throw x("IRouteMatches.route-matches", b);
  }
  return d.call(null, b, c);
}, cr = function cr(b) {
  if (b ? b.Jc : b) {
    return b.Jc(b);
  }
  var c;
  c = cr[n(null == b ? null : b)];
  if (!c && (c = cr._, !c)) {
    throw x("IRouteValue.route-value", b);
  }
  return c.call(null, b);
}, dr = function dr() {
  switch(arguments.length) {
    case 1:
      return dr.h(arguments[0]);
    case 2:
      return dr.c(arguments[0], arguments[1]);
    default:
      throw Error([z("Invalid arity: "), z(arguments.length)].join(""));;
  }
};
dr.h = function(a) {
  if (a ? a.Pd : a) {
    return a.Pd();
  }
  var b;
  b = dr[n(null == a ? null : a)];
  if (!b && (b = dr._, !b)) {
    throw x("IRenderRoute.render-route", a);
  }
  return b.call(null, a);
};
dr.c = function(a, b) {
  if (a ? a.Qd : a) {
    return a.Qd(a, b);
  }
  var c;
  c = dr[n(null == a ? null : a)];
  if (!c && (c = dr._, !c)) {
    throw x("IRenderRoute.render-route", a);
  }
  return c.call(null, a, b);
};
dr.H = 2;
var er, fr = new u(null, 1, [Fj, ""], null);
er = mf ? mf(fr) : lf.call(null, fr);
function gr() {
  var a = new X(null, 1, 5, Y, [Fj], null), a = $d(a) ? a : new X(null, 1, 5, Y, [a], null), b = M.h ? M.h(er) : M.call(null, er);
  return Af(b, a);
}
var hr = encodeURIComponent;
if ("undefined" === typeof ir) {
  var ir = function() {
    var a = mf ? mf(Z) : lf.call(null, Z), b = mf ? mf(Z) : lf.call(null, Z), c = mf ? mf(Z) : lf.call(null, Z), d = mf ? mf(Z) : lf.call(null, Z), e = Pd(Z, Kk, Jh());
    return new Vh(id("secretary.core", "encode-pair"), function() {
      return function(a) {
        R(a, 0);
        a = R(a, 1);
        if ($d(a) || Zd(a)) {
          a = Ek;
        } else {
          var b = ae(a);
          a = (b ? b : a ? a.A & 67108864 || a.$e || (a.A ? 0 : w(sc, a)) : w(sc, a)) ? jj : null;
        }
        return a;
      };
    }(a, b, c, d, e), Si, e, a, b, c, d);
  }()
}
function jr(a, b) {
  return [z(Ke(a)), z("["), z(b), z("]")].join("");
}
Xh(ir, Ek, function(a) {
  var b = R(a, 0), c = R(a, 1);
  return fl("\x26", jf(function(a, b) {
    return function(a, c) {
      var d = Yd(c) ? new X(null, 2, 5, Y, [jr(b, a), c], null) : new X(null, 2, 5, Y, [[z(Ke(b)), z("[]")].join(""), c], null);
      return ir.h ? ir.h(d) : ir.call(null, d);
    };
  }(a, b, c), c));
});
Xh(ir, jj, function(a) {
  var b = R(a, 0), c = R(a, 1);
  a = W.c(function(a, b) {
    return function(a) {
      var c = R(a, 0);
      a = R(a, 1);
      c = new X(null, 2, 5, Y, [jr(b, Ke(c)), a], null);
      return ir.h ? ir.h(c) : ir.call(null, c);
    };
  }(a, b, c), c);
  return fl("\x26", a);
});
Xh(ir, Si, function(a) {
  var b = R(a, 0), c = R(a, 1);
  return [z(Ke(b)), z("\x3d"), z(function() {
    var a = "" + z(c);
    return hr.h ? hr.h(a) : hr.call(null, a);
  }())].join("");
});
function kr(a) {
  return fl("/", W.c(hr, hl(a, /\//)));
}
var lr = decodeURIComponent;
function mr(a) {
  var b = /\[([^\]]*)\]*/;
  a = lh(b, a);
  return W.c(function() {
    return function(a) {
      R(a, 0);
      a = R(a, 1);
      return Xd(a) ? 0 : v(jh(/\d+/, a)) ? parseInt(a) : a;
    };
  }(b, a), a);
}
function nr(a, b, c) {
  function d(a) {
    return jf(function(b) {
      return rf(b + 1, a);
    }, a);
  }
  var e = d(b);
  a = Ab(function() {
    return function(a, b) {
      var c;
      (c = "number" !== typeof Kd(b)) || (c = eh(b), c = Af(a, c), c = be(c));
      return c ? a : Bf(a, eh(b), Md);
    };
  }(d, e), a, e);
  return 0 === Kd(b) ? Cf.C(a, eh(b), Ld, c) : Bf(a, b, c);
}
function or(a) {
  a = hl(a, /&/);
  a = Ab(function() {
    return function(a, c) {
      var d = il(c, /=/, 2), e = R(d, 0), d = R(d, 1), f = jh(/([^\[\]]+)((?:\[[^\]]*\])*)?/, e);
      R(f, 0);
      e = R(f, 1);
      f = R(f, 2);
      f = v(f) ? mr(f) : null;
      e = N(e, f);
      return nr(a, e, lr.h ? lr.h(d) : lr.call(null, d));
    };
  }(a), Z, a);
  return $q(a);
}
function pr(a, b) {
  var c = jh(a, b);
  return v(c) ? $d(c) ? c : new X(null, 2, 5, Y, [c, c], null) : null;
}
var qr = dh("\\.*+|?()[]{}$^");
function rr(a) {
  return Ab(function(a, c) {
    return v(qr.h ? qr.h(c) : qr.call(null, c)) ? [z(a), z("\\"), z(c)].join("") : [z(a), z(c)].join("");
  }, "", a);
}
function sr(a, b) {
  return df(function(b) {
    var d = R(b, 0);
    b = R(b, 1);
    var e = kh(d, a);
    return v(e) ? (d = R(e, 0), e = R(e, 1), new X(null, 2, 5, Y, [Ce(a, P(d)), b.h ? b.h(e) : b.call(null, e)], null)) : null;
  }, b);
}
function tr(a, b) {
  for (var c = a, d = "", e = Md;;) {
    if (F(c)) {
      var f = sr(c, b), c = R(f, 0), g = R(f, 1), f = R(g, 0), g = R(g, 1), d = [z(d), z(f)].join(""), e = Ld.c(e, g)
    } else {
      return new X(null, 2, 5, Y, [mh([z("^"), z(d), z("$")].join("")), wf(ef(qb), e)], null);
    }
  }
}
var ur = function ur(b) {
  var c = new X(null, 3, 5, Y, [new X(null, 2, 5, Y, [/^\*([^\s.:*\/]*)/, function(b) {
    b = F(b) ? Je.h(b) : oi;
    return new X(null, 2, 5, Y, ["(.*?)", b], null);
  }], null), new X(null, 2, 5, Y, [/^\:([^\s.:*\/]+)/, function(b) {
    b = Je.h(b);
    return new X(null, 2, 5, Y, ["([^,;?/]+)", b], null);
  }], null), new X(null, 2, 5, Y, [/^([^:*]+)/, function(b) {
    b = rr(b);
    return new X(null, 1, 5, Y, [b], null);
  }], null)], null), d = tr(b, c), e = R(d, 0), f = R(d, 1);
  "undefined" === typeof ar && (ar = function(b, c, d, e, f, q, r) {
    this.oe = b;
    this.Hd = c;
    this.ce = d;
    this.ze = e;
    this.Jd = f;
    this.Id = q;
    this.qe = r;
    this.A = 393216;
    this.J = 0;
  }, ar.prototype.W = function() {
    return function(b, c) {
      return new ar(this.oe, this.Hd, this.ce, this.ze, this.Jd, this.Id, c);
    };
  }(c, d, e, f), ar.prototype.T = function() {
    return function() {
      return this.qe;
    };
  }(c, d, e, f), ar.prototype.Jc = function() {
    return function() {
      return this.Hd;
    };
  }(c, d, e, f), ar.prototype.Ic = function() {
    return function(b, c) {
      var d = pr(this.Jd, c);
      return v(d) ? (R(d, 0), d = Be(d), $g(Wf, O([Z, yf(vf.c(this.Id, W.c(lr, d)))], 0))) : null;
    };
  }(c, d, e, f), ar.gf = function() {
    return function() {
      return new X(null, 7, 5, Y, [new E(null, "compile-route", "compile-route", -1479918120, null), new E(null, "orig-route", "orig-route", 899103121, null), new E(null, "clauses", "clauses", -1199594528, null), new E(null, "vec__14909", "vec__14909", -1446174831, null), new E(null, "re", "re", 1869207729, null), new E(null, "params", "params", -1943919534, null), new E(null, "meta14911", "meta14911", 1619611780, null)], null);
    };
  }(c, d, e, f), ar.Ed = !0, ar.Dd = "secretary.core/t14910", ar.ne = function() {
    return function(b, c) {
      return vc(c, "secretary.core/t14910");
    };
  }(c, d, e, f));
  return new ar(ur, b, c, d, e, f, Z);
}, vr = mf ? mf(Md) : lf.call(null, Md);
function wr(a, b) {
  var c = "string" === typeof a ? ur(a) : a;
  fd.l(vr, Ld, new X(null, 2, 5, Y, [c, b], null));
}
function xr(a) {
  return df(function(b) {
    var c = R(b, 0);
    b = R(b, 1);
    var d = br(c, a);
    return v(d) ? new u(null, 3, [yk, b, mj, d, wj, c], null) : null;
  }, M.h ? M.h(vr) : M.call(null, vr));
}
function yr(a) {
  var b = hl(dl(a, mh([z("^"), z("" + z(gr()))].join("")), ""), /\?/);
  a = R(b, 0);
  var b = R(b, 1), c;
  c = L.c("/", J(a)) ? a : [z("/"), z(a)].join("");
  a = v(b) ? new u(null, 1, [nk, or(b)], null) : null;
  b = xr(c);
  c = he(b) ? Ye(nf, b) : b;
  b = S(c, yk);
  c = S(c, mj);
  b = v(b) ? b : ue;
  a = Zg.v(O([c, a], 0));
  return b.h ? b.h(a) : b.call(null, a);
}
function zr(a, b) {
  return Ab(function(b, d) {
    var e = R(d, 0), f = R(d, 1), g = S(a, e);
    return v(jh(f, g)) ? b : T.l(b, e, new X(null, 2, 5, Y, [g, f], null));
  }, Z, yf(b));
}
br.string = function(a, b) {
  return br(ur(a), b);
};
RegExp.prototype.Ic = function(a, b) {
  var c = pr(this, b);
  return v(c) ? (R(c, 0), c = Be(c), Vf(c)) : null;
};
X.prototype.Ic = function(a, b) {
  R(a, 0);
  Be(a);
  var c = R(this, 0), d = Be(this), c = br(ur(c), b);
  return v(Xd(zr(c, d))) ? c : null;
};
cr.string = function(a) {
  return cr(ur(a));
};
RegExp.prototype.Jc = function() {
  return this;
};
X.prototype.Jc = function(a) {
  R(a, 0);
  Be(a);
  a = R(this, 0);
  var b = Be(this);
  return Vf(N(cr(a), b));
};
dr.string = function() {
  function a(a, b) {
    var c = he(b) ? Ye(nf, b) : b, g = S(c, nk), k = mf ? mf(c) : lf.call(null, c), c = a.replace(RegExp(":[^\\s.:*/]+|\\*[^\\s.:*/]*", "g"), function(a, b, c, d, e) {
      return function(a) {
        var b = Je.h(L.c(a, "*") ? a : a.substring(1)), c = S(M.h ? M.h(e) : M.call(null, e), b);
        $d(c) ? (fd.C(e, T, b, K(c)), a = kr(J(c))) : a = v(c) ? kr(c) : a;
        return a;
      };
    }(b, c, c, g, k)), c = [z(gr()), z(c)].join(""), g = v(g) ? fl("\x26", W.c(ir, g)) : g;
    return v(g) ? [z(c), z("?"), z(g)].join("") : c;
  }
  function b(a) {
    return dr.c(a, Z);
  }
  var c = null, c = function(c, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, c);
      case 2:
        return a.call(this, c, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  c.h = b;
  c.c = a;
  return c;
}();
X.prototype.Pd = function() {
  return dr.c(this, Z);
};
X.prototype.Qd = function(a, b) {
  R(a, 0);
  Be(a);
  var c = R(this, 0), d = Be(this), d = zr(b, d);
  if (Xd(d)) {
    return dr.c(c, b);
  }
  throw new Zh("Could not build route: invalid params", d, null);
};
function Ar(a) {
  a = T.l(M.h ? M.h(Pm) : M.call(null, Pm), a, null);
  return V.c ? V.c(Pm, a) : V.call(null, Pm, a);
}
function Br(a) {
  V.c ? V.c(Nm, a) : V.call(null, Nm, a);
  window.location.hash = "place-details";
  return yr("place-details");
}
(function(a, b) {
  var c = ll(new u(null, 2, [cl, !0, Yi, !0], null));
  return a.allDocs(c, function() {
    return function(a, c) {
      var f = v(c) ? Gh(c) : Z;
      return b.c ? b.c(a, f) : b.call(null, a, f);
    };
  }(c));
})(nl, function(a, b) {
  var c = he(b) ? Ye(nf, b) : b, c = S(c, Kj);
  zh(O(["get-all-docs-callback \x3d ", c], 0));
  var d = xf.c(M.h ? M.h(Km) : M.call(null, Km), c);
  V.c ? V.c(Km, d) : V.call(null, Km, d);
  return V.c ? V.c(Nm, c) : V.call(null, Nm, c);
});
function Cr() {
  zh(O(["alert-block, @state/alert \x3d", M.h ? M.h(Pm) : M.call(null, Pm)], 0));
  return v(zk.h(M.h ? M.h(Pm) : M.call(null, Pm))) ? new X(null, 3, 5, Y, [qi, new X(null, 3, 5, Y, [Bk, new u(null, 2, [sj, "button", Dj, function() {
    return Ar(zk);
  }], null), "\u00d7"], null), zk.h(M.h ? M.h(Pm) : M.call(null, Pm))], null) : v(Wj.h(M.h ? M.h(Pm) : M.call(null, Pm))) ? new X(null, 3, 5, Y, [Ei, new X(null, 3, 5, Y, [Bk, new u(null, 2, [sj, "button", Dj, function() {
    return Ar(Wj);
  }], null), "\u00d7"], null), Wj.h(M.h ? M.h(Pm) : M.call(null, Pm))], null) : new X(null, 1, 5, Y, [Mj], null);
}
function Dr() {
  return new X(null, 2, 5, Y, [ai, new X(null, 2, 5, Y, [vi, function() {
    return function b(c) {
      return new Le(null, function() {
        for (;;) {
          var d = F(c);
          if (d) {
            var e = d;
            if (ce(e)) {
              var f = Kc(e), g = P(f), k = Pe(g);
              return function() {
                for (var b = 0;;) {
                  if (b < g) {
                    var c = C.c(f, b);
                    Se(k, function() {
                      var l = Mk.h(c), r = he(l) ? Ye(nf, l) : l, t = S(r, ek), y = S(r, Wi), A = S(r, bi), B = S(r, sj);
                      return Dd(new X(null, 5, 5, Y, [hj, new u(null, 1, [Dj, function(b, c, d, e, f, g, k, l) {
                        return function() {
                          return Br(l);
                        };
                      }(b, l, r, t, y, A, B, c, f, g, k, e, d)], null), new X(null, 2, 5, Y, [$i, y], null), new X(null, 2, 5, Y, [$i, A], null), new X(null, 2, 5, Y, [$i, B], null)], null), new u(null, 1, [Ci, t], null));
                    }());
                    b += 1;
                  } else {
                    return !0;
                  }
                }
              }() ? Re(k.Aa(), b(Lc(e))) : Re(k.Aa(), null);
            }
            var l = J(e);
            return N(function() {
              var b = Mk.h(l), c = he(b) ? Ye(nf, b) : b, f = S(c, ek), g = S(c, Wi), k = S(c, bi), y = S(c, sj);
              return Dd(new X(null, 5, 5, Y, [hj, new u(null, 1, [Dj, function(b, c, d, e, f, g, k) {
                return function() {
                  return Br(k);
                };
              }(b, c, f, g, k, y, l, e, d)], null), new X(null, 2, 5, Y, [$i, g], null), new X(null, 2, 5, Y, [$i, k], null), new X(null, 2, 5, Y, [$i, y], null)], null), new u(null, 1, [Ci, f], null));
            }(), b(jd(e)));
          }
          return null;
        }
      }, null, null);
    }(M.h ? M.h(Km) : M.call(null, Km));
  }()], null)], null);
}
function Er() {
  return new X(null, 4, 5, Y, [Mj, new X(null, 4, 5, Y, [Bi, new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Dj, function() {
    return window.history.back();
  }], null), "BACK"], null)], null), new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Vk, "#place-add"], null), "Add Place"], null)], null), new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Vk, "#place-find"], null), "Find Place"], null)], null)], null), new X(null, 1, 5, Y, [Cr], null), new X(null, 1, 5, Y, [Dr], null)], null);
}
;function Fr(a, b) {
  return new X(null, 3, 5, Y, [yj, new X(null, 2, 5, Y, [nj, [z(b), z(":")].join("")], null), new X(null, 2, 5, Y, [hi, new X(null, 2, 5, Y, [tj, new u(null, 3, [sj, "text", dj, S(M.h ? M.h(Om) : M.call(null, Om), a), Jk, function(b) {
    b = T.l(M.h ? M.h(Om) : M.call(null, Om), a, b.target.value);
    return V.c ? V.c(Om, b) : V.call(null, Om, b);
  }], null)], null)], null)], null);
}
function Gr() {
  return new X(null, 2, 5, Y, [Mj, new X(null, 8, 5, Y, [fk, new u(null, 1, [wk, Qm], null), new X(null, 3, 5, Y, [Fr, Wi, "Name"], null), new X(null, 3, 5, Y, [Fr, bi, "Description"], null), new X(null, 3, 5, Y, [Fr, sj, "Type"], null), new X(null, 3, 5, Y, [Fr, uk, "Latitude"], null), new X(null, 3, 5, Y, [Fr, uj, "Longitude"], null), new X(null, 2, 5, Y, [yj, new X(null, 2, 5, Y, [Jj, new X(null, 2, 5, Y, [Lj, "Submit"], null)], null)], null)], null)], null);
}
function Hr() {
  return new X(null, 3, 5, Y, [Mj, new X(null, 2, 5, Y, [Bi, new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Dj, function() {
    return window.history.back();
  }], null), "BACK"], null)], null)], null), new X(null, 1, 5, Y, [Gr], null)], null);
}
;function Ir() {
  return new X(null, 2, 5, Y, [Mj, new X(null, 2, 5, Y, [Bi, new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Dj, function() {
    return window.history.back();
  }], null), "BACK"], null)], null)], null)], null);
}
;function Jr() {
  return new X(null, 2, 5, Y, [Mj, new X(null, 4, 5, Y, [Bi, new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Vk, "#place-list"], null), "My Places"], null)], null), new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Vk, "#place-add"], null), "Add Place"], null)], null), new X(null, 3, 5, Y, [aj, new u(null, 1, [$h, Ik], null), new X(null, 3, 5, Y, [Zk, new u(null, 1, [Vk, "#place-find"], null), "Find Place"], 
  null)], null)], null)], null);
}
;var gb = !1, fb = function() {
  function a(a) {
    var d = null;
    if (0 < arguments.length) {
      for (var d = 0, e = Array(arguments.length - 0);d < e.length;) {
        e[d] = arguments[d + 0], ++d;
      }
      d = new I(e, 0);
    }
    return b.call(this, d);
  }
  function b(a) {
    return console.log.apply(console, zb ? yb(a) : xb.call(null, a));
  }
  a.H = 0;
  a.D = function(a) {
    a = F(a);
    return b(a);
  };
  a.v = b;
  return a;
}(), Kr = $d(Fj) ? Fj : new X(null, 1, 5, Y, [Fj], null);
fd.C(er, Bf, Kr, "#");
if ("undefined" === typeof Lr) {
  var Lr = new Lq
}
ko(Lr, "navigate", function(a) {
  return yr(a.ye);
});
Tq(Lr, !0);
zh(O(["ClojureScript appears to have loaded correctly."], 0));
function Mr() {
  return new X(null, 3, 5, Y, [bk, new X(null, 2, 5, Y, [kk, new X(null, 2, 5, Y, [aj, new X(null, 3, 5, Y, [Zk, new u(null, 1, [Vk, "#"], null), "Back To Main Page"], null)], null)], null), new X(null, 2, 5, Y, [Zj, S(M.h ? M.h(Mm) : M.call(null, Mm), M.h ? M.h(Lm) : M.call(null, Lm))], null)], null);
}
function Nr() {
  return new X(null, 2, 5, Y, [Ri, new X(null, 3, 5, Y, [Qk, "\u00a9 Montebello 2015 ", new X(null, 3, 5, Y, [Zk, new u(null, 1, [Vk, "mailto:info@montebello.com"], null), "info@montebello.com"], null)], null)], null);
}
function Or() {
  return new X(null, 4, 5, Y, [Yj, new X(null, 1, 5, Y, [Mr], null), function() {
    var a = M.h ? M.h(Lm) : M.call(null, Lm);
    if (v(L.c ? L.c(pi, a) : L.call(null, pi, a))) {
      return new X(null, 1, 5, Y, [Jr], null);
    }
    if (v(L.c ? L.c(ji, a) : L.call(null, ji, a))) {
      return new X(null, 1, 5, Y, [Hr], null);
    }
    if (v(L.c ? L.c(fi, a) : L.call(null, fi, a))) {
      return new X(null, 1, 5, Y, [Fq], null);
    }
    if (v(L.c ? L.c(Pi, a) : L.call(null, Pi, a))) {
      return new X(null, 1, 5, Y, [zq], null);
    }
    if (v(L.c ? L.c(qj, a) : L.call(null, qj, a))) {
      return new X(null, 1, 5, Y, [Ir], null);
    }
    if (v(L.c ? L.c(Sj, a) : L.call(null, Sj, a))) {
      return new X(null, 1, 5, Y, [Gq], null);
    }
    if (v(L.c ? L.c(Mi, a) : L.call(null, Mi, a))) {
      return new X(null, 1, 5, Y, [Er], null);
    }
    if (v(L.c ? L.c(Pk, a) : L.call(null, Pk, a))) {
      return new X(null, 1, 5, Y, [pq], null);
    }
    throw Error([z("No matching clause: "), z(a)].join(""));
  }(), new X(null, 1, 5, Y, [Nr], null)], null);
}
wr("/", function(a) {
  return ae(a) ? (he(a) && Ye(nf, a), V.c ? V.c(Lm, pi) : V.call(null, Lm, pi)) : be(a) ? V.c ? V.c(Lm, pi) : V.call(null, Lm, pi) : null;
});
wr("/home", function(a) {
  return ae(a) ? (he(a) && Ye(nf, a), V.c ? V.c(Lm, pi) : V.call(null, Lm, pi)) : be(a) ? V.c ? V.c(Lm, pi) : V.call(null, Lm, pi) : null;
});
wr("/place-add", function(a) {
  return ae(a) ? (he(a) && Ye(nf, a), V.c ? V.c(Lm, ji) : V.call(null, Lm, ji)) : be(a) ? V.c ? V.c(Lm, ji) : V.call(null, Lm, ji) : null;
});
wr("/place-details", function(a) {
  return ae(a) ? (he(a) && Ye(nf, a), V.c ? V.c(Lm, fi) : V.call(null, Lm, fi)) : be(a) ? V.c ? V.c(Lm, fi) : V.call(null, Lm, fi) : null;
});
wr("/place-edit", function(a) {
  return ae(a) ? (he(a) && Ye(nf, a), V.c ? V.c(Lm, Pi) : V.call(null, Lm, Pi)) : be(a) ? V.c ? V.c(Lm, Pi) : V.call(null, Lm, Pi) : null;
});
wr("/place-find", function(a) {
  return ae(a) ? (he(a) && Ye(nf, a), V.c ? V.c(Lm, qj) : V.call(null, Lm, qj)) : be(a) ? V.c ? V.c(Lm, qj) : V.call(null, Lm, qj) : null;
});
wr("/place-found", function(a) {
  return ae(a) ? (he(a) && Ye(nf, a), V.c ? V.c(Lm, Sj) : V.call(null, Lm, Sj)) : be(a) ? V.c ? V.c(Lm, Sj) : V.call(null, Lm, Sj) : null;
});
wr("/place-list", function(a) {
  return ae(a) ? (he(a) && Ye(nf, a), V.c ? V.c(Lm, Mi) : V.call(null, Lm, Mi)) : be(a) ? V.c ? V.c(Lm, Mi) : V.call(null, Lm, Mi) : null;
});
wr("/place-share", function(a) {
  return ae(a) ? (he(a) && Ye(nf, a), V.c ? V.c(Lm, Pk) : V.call(null, Lm, Pk)) : be(a) ? V.c ? V.c(Lm, Pk) : V.call(null, Lm, Pk) : null;
});
var Pr = nl, Qr = Jm, Rr = ll(new u(null, 1, [Dk, !0], null));
PouchDB.replicate(Pr, Qr, Rr);
PouchDB.replicate(Qr, Pr, Rr);
(function() {
  function a() {
    var a = document.getElementById("app");
    v(a) && (a.className = "");
    yr(document.location.hash);
    return new X(null, 1, 5, Y, [Or], null);
  }
  zh(O(["mount-it"], 0));
  var b = document.getElementById("app"), c = function() {
    return function() {
      return null;
    };
  }(a, b);
  return Em ? Em(a, b, c) : Dm.call(null, a, b, c);
})();

})();
