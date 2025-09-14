function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;class o{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}}const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:h,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",_=m.reactiveElementPolyfillSupport,$=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!h(t,e),v={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return s?.call(this)},set(e){const o=s?.call(this);n.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s,this[s]=n.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??b)(this[t],e))return;this.P(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t)!0!==i.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],i)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[$("elementProperties")]=new Map,A[$("finalized")]=new Map,_?.({ReactiveElement:A}),(m.reactiveElementVersions??=[]).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E=globalThis,w=E.trustedTypes,S=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,x="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+C,P=`<${T}>`,N=document,H=()=>N.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,M="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,L=/>/g,k=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,j=/"/g,z=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,Z=N.createTreeWalker(N,129);function F(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=D;for(let e=0;e<i;e++){const i=t[e];let a,h,l=-1,c=0;for(;c<i.length&&(r.lastIndex=c,h=r.exec(i),null!==h);)c=r.lastIndex,r===D?"!--"===h[1]?r=R:void 0!==h[1]?r=L:void 0!==h[2]?(z.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=k):void 0!==h[3]&&(r=k):r===k?">"===h[0]?(r=n??D,l=-1):void 0===h[1]?l=-2:(l=r.lastIndex-h[2].length,a=h[1],r=void 0===h[3]?k:'"'===h[3]?j:I):r===j||r===I?r=k:r===R||r===L?r=D:(r=k,n=void 0);const d=r===k&&t[e+1].startsWith("/>")?" ":"";o+=r===D?i+P:l>=0?(s.push(a),i.slice(0,l)+x+i.slice(l)+C+d):i+C+(-2===l?e:d)}return[F(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[h,l]=J(t,e);if(this.el=K.createElement(h,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(x)){const e=l[o++],i=s.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:Y}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(z.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],H()),Z.nextNode(),a.push({type:2,index:++n});s.append(t[e],H())}}}else if(8===s.nodeType)if(s.data===T)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const i=N.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,s){if(e===B)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=G(t,n._$AS(t,e.values),n,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??N).importNode(e,!0);Z.currentNode=s;let n=Z.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new st(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=Z.nextNode(),o++)}return Z.currentNode=N,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),O(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(F(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new X(this.O(H()),this.O(H()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=G(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=G(this,s[i+r],e,r),a===B&&(a=this._$AH[r]),o||=!O(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends Y{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??W)===B)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const nt=E.litHtmlPolyfillSupport;nt?.(K,X),(E.litHtmlVersions??=[]).push("3.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class ot extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new X(e.insertBefore(H(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}ot._$litElement$=!0,ot.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:ot});const rt=globalThis.litElementPolyfillSupport;rt?.({LitElement:ot}),(globalThis.litElementVersions??=[]).push("4.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at=t=>(e,i)=>{void 0!==i?i.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},lt=(t=ht,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t)},init(e){return void 0!==e&&this.P(s,void 0,t),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t)}}throw Error("Unsupported decorator location: "+s)};function ct(t){return(e,i)=>"object"==typeof i?lt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,s?{...t,wrapped:!0}:t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function dt(t){return ct({...t,state:!0,attribute:!1})}var pt="\\d\\d?",ut="\\d\\d",mt="[^\\s]+";function ft(t,e){for(var i=[],s=0,n=t.length;s<n;s++)i.push(t[s].substr(0,e));return i}var gt=function(t){return function(e,i){var s=i[t].map((function(t){return t.toLowerCase()})),n=s.indexOf(e.toLowerCase());return n>-1?n:null}};function _t(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];for(var s=0,n=e;s<n.length;s++){var o=n[s];for(var r in o)t[r]=o[r]}return t}var $t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],yt=["January","February","March","April","May","June","July","August","September","October","November","December"],bt=ft(yt,3),vt={dayNamesShort:ft($t,3),dayNames:$t,monthNamesShort:bt,monthNames:yt,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},At=(_t({},vt),function(t){return+t-1}),Et=[null,pt],wt=[null,mt],St=["isPm",mt,function(t,e){var i=t.toLowerCase();return i===e.amPm[0]?0:i===e.amPm[1]?1:null}],xt=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var i=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?i:-i}return 0}];gt("monthNamesShort"),gt("monthNames");var Ct,Tt;!function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}}(),function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Ct||(Ct={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Tt||(Tt={}));var Pt=function(t,e,i,s){s=s||{},i=null==i?{}:i;var n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n};const Nt={en:{card:{editor:{title:"Card titel (optional)",icon:"Card icon (optional)",showAnimation:"Show arrival animation",showTransportIcon:"Show transport icon",hideEmptyDepartures:"Hide empty departures",debug:"Debug",departuresToShow:"Departures to show",addEntity:"Add entity",entity:{entity:"Entity",destinationName:"Destination name",lineName:"Line name",lineColor:"Line color",nowIcon:"Now icon",timeStyle:"Departure time style",remove:"Delete"}},departures:"Departures",line:"Line",destination:"Destination"}},de:{card:{editor:{title:"Card Titel (optional)",icon:"Card Icon (optional)",showAnimation:"Animation anzeigen",showTransportIcon:"Transport Icon anzeigen",hideEmptyDepartures:"Leere Abfahrten ausblenden",debug:"Debug",departuresToShow:"Anzahl der Abfahrten",addEntity:"Neue Entity",entity:{entity:"Entity",destinationName:"Zielname",lineName:"Linienname",lineColor:"Linienfarbe",nowIcon:"Anfahrt Icon",timeStyle:"Ankunftszeit Stil",remove:"Entfernen"}},departures:"Abfahrten",line:"Linie",destination:"Ziel"}}};function Ht(t,e){return e.split(".").reduce(((t,e)=>t?.[e]),t)}function Ot(t,e="en",i){const s=Object.keys(Nt).includes(e)?e:"en",n=Nt.en;let o=Ht(Nt[s],t)??Ht(n,t);if("string"!=typeof o)return t;if(i)for(const[t,e]of Object.entries(i))o=o.replace(new RegExp(`{${t}}`,"g"),e);return o}const Ut=r`
    ha-card {
        display: block;
        height: auto;
        width: 100%;
        cursor: pointer;
        overflow: hidden;
    }
    .card-header {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        font-size: 2em;
    }
    .cell-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
    }
    .cell-line {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 70px;
    }
    .cell-destination {
        display: flex;
        flex: 2;
        white-space: nowrap;
    }
    .line-number {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px;
        border-radius: 5px;
        width: 100%;
        height: 25px;
        font-size: 1.2em;
        font-weight: bold;
    }
    @media (min-width: 600px) and (min-height: 501px) 
    {
        ha-dialog {
            --mdc-dialog-min-width: 650px !important;
            --mdc-dialog-max-width: 100vw !important;
        }
    }
    @media (max-width: 400px){
        ha-dialog {
            --dialog-content-padding: 20px 10px 10px 10px !important;
        }
    }
    `;let Mt=class extends ot{constructor(){super(...arguments),this._schema=[{name:"entity",selector:{entity:{},domain:"sensor"}},{name:"destinationName",selector:{text:{}}},{name:"",type:"grid",schema:[{name:"lineName",selector:{text:{}}},{name:"lineColor",selector:{text:{}}}]},{name:"nowIcon",selector:{icon:{}}},{name:"timeStyle",type:"select",default:"dynamic",options:[["dynamic","Dynamic"],["timestamp","Timestamp"]]}],this._computeLabelCallback=t=>Ot(`card.editor.entity.${t.name}`,this.hass.locale?.language)}render(){return this.hass?V`
            <div class="entity-editor-content">
                <div id="card-options">
                    <ha-icon-button 
                        .label=${Ot("card.editor.entity.remove",this.hass.locale?.language)}
                        .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                        @click=${this.handleDelete}>
                    </ha-icon-button>
                </div>
                <ha-form
                    .schema="${this._schema}"
                    .hass="${this.hass}"
                    .data="${this.data?.config}"
                    @value-changed=${this._configChanged}
                    .computeLabel=${this._computeLabelCallback}
                >
                </ha-form>
            </div>
      `:W}_configChanged(t){this.dispatchEvent(new CustomEvent("onChange",{detail:t.detail.value}))}handleDelete(){this.dispatchEvent(new CustomEvent("onDelete",{detail:this.data?.index}))}};var Dt;Mt.styles=[Ut,r`
        :host {
        }
        .entity-editor-content{
            border: 1px solid var(--divider-color);
            padding: 10px;
        }
        #card-options{
            display: flex;
            justify-content: flex-end;
            width: 100%;
        }
    `],t([ct({attribute:!1})],Mt.prototype,"hass",void 0),t([ct({attribute:!1})],Mt.prototype,"data",void 0),Mt=t([at("departures-entity-editor")],Mt),function(t){t.NONE="none",t.TIMESTAMP="timestamp",t.DIFF="diff",t.NOW="now",t.PAST="past"}(Dt||(Dt={}));class Rt{constructor(t,e){this.index=t,this.config=void 0===e?{entity:"",lineColor:null,lineName:null,timeStyle:"dynamic",destinationName:null,nowIcon:null}:e}}let Lt=class extends ot{constructor(){super(...arguments),this._tabs=[],this._currTab="1",this.SCHEMA=[{name:"",type:"grid",schema:[{name:"title",required:!1,selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"",type:"grid",column_min_width:"100px",schema:[{name:"showAnimation",type:"boolean"},{name:"showTransportIcon",type:"boolean"},{name:"hideEmptyDepartures",type:"boolean"},{name:"debug",type:"boolean"}]},{name:"departuresToShow",type:"integer",required:!0,default:3,valueMin:1,valueMax:5}],this.computeLabelCallback=t=>Ot(`card.editor.${t.name}`,this.hass.locale?.language)}setConfig(t){this._config=t,this._tabs=t.entities?.map(((t,e)=>new Rt(Number(e+1),t)))||[]}render(){return this.hass&&this._config?(0===this._tabs.length&&this.addEntity(),V`
        <ha-form
          .schema="${this.SCHEMA}"
          .data="${this._config}"
          .hass="${this.hass}"
          .computeLabel=${this.computeLabelCallback}
          @value-changed=${this.configChanged}
        >
        </ha-form>

        <ha-expansion-panel .leftChevron=${!0}>
          <span slot="header">Entities</span>
          <div class="card-config">
            <div class="toolbar">
              <sl-tab-group @sl-tab-show=${this.handleTabChanged}>
              ${this._tabs.map((t=>V`
                  <sl-tab slot="nav" .panel=${t.index} .active=${this._currTab===t.index.toString()}>
                    ${t.index}
                  </sl-tab>
                `))}
              </sl-tab-group>
              <ha-icon-button
                .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
                .label=${Ot("card.editor.addEntity",this.hass.locale?.language)}
                @click=${this.addEntity}
              ></ha-icon-button>
            </div>
              <departures-entity-editor 
                .hass=${this.hass}
                .data=${this.getTabData()}
                @onDelete=${this.removeEntity}
                @onChange=${this.updateEntity}
                />
          </div>
        </ha-expansion-panel>
    `):W}getTabData(){const t=parseInt(this._currTab)-1;if(t>=0&&t<this._tabs.length)return this._tabs[t]}addEntity(){if(!this._config)return;let t=new Rt(this._tabs.length+1,void 0);this._tabs=[...this._tabs,t],this._currTab=`${this._tabs.length}`,this.updateConfig()}removeEntity(t){if(!this._config)return;const e=parseInt(this._currTab)-1;this._tabs.splice(e,1),this.updateConfig(),this._currTab=Math.max(1,e).toString()}updateEntity(t){t.stopPropagation();let e=this.getTabData();e?(e.config=t.detail,this.updateConfig(),Pt(this,"config-changed",{config:this._config})):console.warn("No tab found for config change",this._tabs,this._currTab)}updateConfig(){const t={...this._config};t.entities=this._tabs.map((t=>t.config)),this._config=t,Pt(this,"config-changed",{config:this._config})}handleTabChanged(t){const e=t.detail.name.toString();e!==this._currTab&&(this._currTab=e)}configChanged(t){t.stopPropagation(),this._config&&this.hass&&(this._config=t.detail.value,Pt(this,"config-changed",{config:this._config}))}};Lt.styles=[Ut,r`
      .entity-editor-content{
          border: 1px solid var(--divider-color);
          padding: 10px;
      }
      .toolbar {
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start;
      }
      sl-tab-group {
        flex: 1; 
        margin-right: 5px; 
        max-width:400px; 
        --ha-tab-track-color:var(--card-background-color)  
      }
      ha-expansion-panel {
        margin-top: 20px;
      }
      .card-options{
          display: flex;
          justify-content: flex-end;
          width: 100%;
      }
  `],t([ct({attribute:!1})],Lt.prototype,"hass",void 0),t([dt()],Lt.prototype,"_config",void 0),t([dt()],Lt.prototype,"_tabs",void 0),t([dt()],Lt.prototype,"_currTab",void 0),Lt=t([at("departures-card-editor")],Lt);export{Lt as DeparturesCardEditor};
//# sourceMappingURL=ha-departures-card-editor.js.map
