function t(t,e,i,s){var n,r=arguments.length,o=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,i,o):n(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new r(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:h,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",_=m.reactiveElementPolyfillSupport,y=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!h(t,e),v={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;class w extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return s?.call(this)},set(e){const r=s?.call(this);n.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s,this[s]=n.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??b)(this[t],e))return;this.P(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t)!0!==i.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],i)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,_?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,E=A.trustedTypes,x=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,T="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,I="?"+S,C=`<${I}>`,M=document,N=()=>M.createComment(""),D=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,O="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,k=/-->/g,L=/>/g,U=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,R=/"/g,z=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),B=new WeakMap,Z=M.createTreeWalker(M,129);function q(t,e){if(!P(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=H;for(let e=0;e<i;e++){const i=t[e];let a,h,c=-1,l=0;for(;l<i.length&&(o.lastIndex=l,h=o.exec(i),null!==h);)l=o.lastIndex,o===H?"!--"===h[1]?o=k:void 0!==h[1]?o=L:void 0!==h[2]?(z.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=U):void 0!==h[3]&&(o=U):o===U?">"===h[0]?(o=n??H,c=-1):void 0===h[1]?c=-2:(c=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?U:'"'===h[3]?R:j):o===R||o===j?o=U:o===k||o===L?o=H:(o=U,n=void 0);const d=o===U&&t[e+1].startsWith("/>")?" ":"";r+=o===H?i+C:c>=0?(s.push(a),i.slice(0,c)+T+i.slice(c)+S+d):i+S+(-2===c?e:d)}return[q(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[h,c]=J(t,e);if(this.el=K.createElement(h,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(T)){const e=c[r++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:X}),s.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(z.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),Z.nextNode(),a.push({type:2,index:++n});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===I)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)a.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===V)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=D(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=Y(t,n._$AS(t,e.values),n,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);Z.currentNode=s;let n=Z.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new st(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=Z.nextNode(),r++)}return Z.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),D(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>P(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new G(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new K(t)),e}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Q(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=Y(this,t,e,0),r=!D(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=Y(this,s[i+o],e,o),a===V&&(a=this._$AH[o]),r||=!D(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends X{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===V)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const nt=A.litHtmlPolyfillSupport;nt?.(K,Q),(A.litHtmlVersions??=[]).push("3.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class rt extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new Q(e.insertBefore(N(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}rt._$litElement$=!0,rt.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:rt});const ot=globalThis.litElementPolyfillSupport;ot?.({LitElement:rt}),(globalThis.litElementVersions??=[]).push("4.1.1");
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
 */,ht={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:b},ct=(t=ht,e,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t)},init(e){return void 0!==e&&this.P(s,void 0,t),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t)}}throw Error("Unsupported decorator location: "+s)};function lt(t){return(e,i)=>"object"==typeof i?ct(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,s?{...t,wrapped:!0}:t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function dt(t){return lt({...t,state:!0,attribute:!1})}const ut=o`
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
    `;const pt={en:{card:{editor:{title:"Card titel (optional)",icon:"Card icon (optional)",showAnimation:"Show arrival animation",showTransportIcon:"Show transport icon",debug:"Debug",departuresToShow:"Departures to show",addEntity:"Add entity",entity:{entity:"Entity",destinationName:"Destination name",lineName:"Line name",lineColor:"Line color",nowIcon:"Now icon",timeStyle:"Departure time style",remove:"Delete"}},departures:"Departures",line:"Line",destination:"Destination"}},de:{card:{editor:{title:"Card Titel (optional)",icon:"Card Icon (optional)",showAnimation:"Animation anzeigen",showTransportIcon:"Transport Icon anzeigen",debug:"Debug",departuresToShow:"Anzahl der Abfahrten",addEntity:"Neue Entity",entity:{entity:"Entity",destinationName:"Zielname",lineName:"Linienname",lineColor:"Linienfarbe",nowIcon:"Anfahrt Icon",timeStyle:"Ankunftszeit Stil",remove:"Entfernen"}},departures:"Abfahrten",line:"Linie",destination:"Ziel"}}};function mt(t,e){return e.split(".").reduce(((t,e)=>t?.[e]),t)}function ft(t,e="en",i){const s=Object.keys(pt).includes(e)?e:"en",n=pt.en;let r=mt(pt[s],t)??mt(n,t);if("string"!=typeof r)return t;if(i)for(const[t,e]of Object.entries(i))r=r.replace(new RegExp(`{${t}}`,"g"),e);return r}let gt=class extends rt{constructor(){super(...arguments),this.moreInfo=!1}getState(t){return this.hass?this.hass.states[t]:{}}render(){this.hass.locale;const t=void 0===this.config.showAnimation||this.config.showAnimation,e=void 0!==this.config.showTransportIcon&&this.config.showTransportIcon;let i=void 0===this.config.departuresToShow?1:this.config.departuresToShow;return this.moreInfo&&(i=5),F`
            <table-header>
                ${this.config.showTransportIcon?F`<div class="cell-icon">Icon</div>`:W}    
                <div class="cell-line">${ft("card.line",this.hass.locale?.language)}</div>
                <div class="cell-destination">${ft("card.destination",this.hass.locale?.language)}</div>
                <div>${ft("card.departures",this.hass.locale?.language)}</div>
            </table-header>
            <hr style="width:100%"/>
            ${this.config.entities?this.config.entities.map((s=>F`
                <departures-row 
                    .config=${s}
                    .hass=${this.hass} 
                    .showIcon=${e}
                    .debug=${!0===this.config.debug}
                    .state=${this.getState(s.entity)}
                    .timesToShow=${i}
                    .showAnimation=${t}/>
                `)):W}
        `}};gt.styles=[ut,o`
        :host {
            display: flex;
            flex-direction: column;
        }
        table-header {
            display: flex;
            padding-top: 20px;
            justify-content: space-between;
            font-weight: bold;
        }

        @media (max-width: 500px) {
            table-header {
                display: none;
            }
        }
    `],t([lt({attribute:!1})],gt.prototype,"hass",void 0),t([lt({attribute:!1})],gt.prototype,"config",void 0),t([lt({attribute:!1})],gt.prototype,"moreInfo",void 0),gt=t([at("departures-table")],gt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t=1,yt=t=>(...e)=>({_$litDirective$:t,values:e});class $t{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt="important",vt=" !"+bt,wt=yt(class extends $t{constructor(t){if(super(t),t.type!==_t||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(vt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?bt:""):i[t]=s}}return V}});var At;!function(t){t.PLANNED_TIME="planned_departure_time",t.PLANNED_TIME_1="planned_departure_time_1",t.PLANNED_TIME_2="planned_departure_time_2",t.PLANNED_TIME_3="planned_departure_time_3",t.PLANNED_TIME_4="planned_departure_time_4",t.ESTIMATED_TIME="estimated_departure_time",t.ESTIMATED_TIME_1="estimated_departure_time_1",t.ESTIMATED_TIME_2="estimated_departure_time_2",t.ESTIMATED_TIME_3="estimated_departure_time_3",t.ESTIMATED_TIME_4="estimated_departure_time_4",t.LINE_NAME="line_name",t.DIRECTION="direction",t.TRANSPORT="transport",t.LINE_ID="line_id",t.FRIENDLY_NAME="friendly_name",t.ICON="icon"}(At||(At={}));
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Et=yt(class extends $t{constructor(t){if(super(t),t.type!==_t||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return V}});function xt(t){if(!t||"unknown"===t)return null;let e=new Date(t);return e.setSeconds(0,0),e}const Tt=Symbol.for("constructDateFrom");function St(t,e){return"function"==typeof t?t(e):t&&"object"==typeof t&&Tt in t?t[Tt](e):t instanceof Date?new t.constructor(e):new Date(e)}function It(t,e){return St(e||t,t)}function Ct(t){return!(!((e=t)instanceof Date||"object"==typeof e&&"[object Date]"===Object.prototype.toString.call(e))&&"number"!=typeof t||isNaN(+It(t)));var e}function Mt(t,e,i){const s=(n=e,(+It(t)-+It(n))/6e4);var n,r;return(r=i?.roundingMethod,t=>{const e=(r?Math[r]:Math.trunc)(t);return 0===e?0:e})(s)}function Nt(t,e){return(t<0?"-":"")+Math.abs(t).toString().padStart(e,"0")}const Dt={y(t,e){const i=t.getFullYear(),s=i>0?i:1-i;return Nt("yy"===e?s%100:s,e.length)},M(t,e){const i=t.getMonth();return"M"===e?String(i+1):Nt(i+1,2)},d:(t,e)=>Nt(t.getDate(),e.length),a(t,e){const i=t.getHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return i.toUpperCase();case"aaa":return i;case"aaaaa":return i[0];default:return"am"===i?"a.m.":"p.m."}},h:(t,e)=>Nt(t.getHours()%12||12,e.length),H:(t,e)=>Nt(t.getHours(),e.length),m:(t,e)=>Nt(t.getMinutes(),e.length),s:(t,e)=>Nt(t.getSeconds(),e.length),S(t,e){const i=e.length,s=t.getMilliseconds();return Nt(Math.trunc(s*Math.pow(10,i-3)),e.length)}};function Pt(t,e){const i=It(t,e?.in);return i.setSeconds(0,0),i}function Ot(t){return e=t,i=function(t){return St(t,Date.now())}(t),+Pt(e)==+Pt(i);var e,i}const Ht=/(\w)\1*|''|'(''|[^'])+('|$)|./g,kt=/^'([^]*?)'?$/,Lt=/''/g,Ut=/[a-zA-Z]/;function jt(t,e){const i=It(t);if(!Ct(i))throw new RangeError("Invalid time value");const s=e.match(Ht);if(!s)return"";return s.map((t=>{if("''"===t)return"'";const e=t[0];if("'"===e)return function(t){const e=t.match(kt);return e?e[1].replace(Lt,"'"):t}(t);const s=Dt[e];if(s)return s(i,t);if(e.match(Ut))throw new RangeError("Format string contains an unescaped latin alphabet character `"+e+"`");return t})).join("")}var Rt;!function(t){t.NONE="none",t.TIMESTAMP="timestamp",t.DIFF="diff",t.NOW="now",t.PAST="past"}(Rt||(Rt={}));class zt{constructor(t){this._delay=0,this._realTime=!1,this._prefix="",this._postfix="",this._time="",this._mode=Rt.NONE,this._styleMode="dynamic",this._styleMode="timestamp"==t?"timestamp":"dynamic"}updateTime(t,e){this._realTime=!!e;let i=xt(Date()),s=xt(t),n=xt(e);if(!s)return void this._updateMode(Rt.NONE);if(n||(n=s),this.delay=Mt(n,s),Ot(n))return void this._updateMode(Rt.NOW);if(+It(n)<Date.now())return void this._updateMode(Rt.PAST);const r=n&&i?Mt(n,i):0;"dynamic"==this._styleMode?r>=60?this._updateMode(Rt.TIMESTAMP,jt(n,"HH:mm")):this._updateMode(Rt.DIFF,r.toString()):this._updateMode(Rt.TIMESTAMP,jt(n,"HH:mm"))}_updateMode(t,e=""){switch(this._mode=t,t){case Rt.TIMESTAMP:this._prefix="",this._postfix="",this._time=e;break;case Rt.DIFF:this._prefix="in",this._postfix="min",this._time=e;break;case Rt.NOW:this._prefix="",this._postfix="",this._time="Now";break;case Rt.NONE:this._prefix="",this._postfix="",this._time="-";break;case Rt.PAST:this._prefix="",this._postfix="",this._time="...";break;default:console.warn("Unknown mode",t)}}set delay(t){this._delay=t}get mode(){return this._mode}get delay(){return this._delay}get realTime(){return this._realTime}get prefix(){return this._prefix}get postfix(){return this._postfix}get time(){return this._time}}class Ft{constructor(t,e){this.index=t,this.config=void 0===e?{entity:"",lineColor:null,lineName:null,timeStyle:"dynamic",destinationName:null,nowIcon:null}:e}}let Vt=class extends rt{constructor(){super(...arguments),this.showAnimation=!0,this.nowIcon="mdi:train-bus"}getTimeHtml(){let t,e=!1;if(!this.time)return F`<div class="text">-</div>`;switch(this.time.mode){case Rt.NOW:t=F`<ha-icon icon=${this.nowIcon}></ha-icon>`,e=this.showAnimation&&!0;break;case Rt.DIFF:let i=Number(this.time.time);i>=0&&i<=5&&(e=this.showAnimation&&!0);case Rt.TIMESTAMP:case Rt.NONE:case Rt.PAST:t=F`${this.time.time}`}return F`
            <div class="text ${Et({pulsating:e})}">${t}</div>
        `}getDelayHtml(){let t;if(!this.time)return F`<div class="delay"></div>`;this.time.realTime&&this.time.mode==Rt.DIFF&&(t=this.time.delay>=0?`+${this.time.delay}`:`${this.time.delay}`);const e={green:this.time.delay<=0,red:this.time.delay>0};return F`<div class="delay ${Et(e)}">${t}</div>`}getPostfixHtml(){return this.time?F`
            <div class="postfix">${this.time.postfix}</div>
        `:F`<div class="postfix"></div>`}render(){return F`
            <div class="container">
                ${this.getTimeHtml()}
                ${this.getPostfixHtml()}
                ${this.getDelayHtml()}
            </div>
            `}};Vt.styles=[o`
        :host {
            display: flex;
        }
        .container {
            width: 50px;
            margin: 5px;
            display: grid;
            justify-self: center;
            justify-content: center;
            grid-template-columns: min-content min-content min-content;
            grid-template-rows: 15px 20px;
            gap: 0px 3px;
            grid-auto-flow: row;
            grid-template-areas:
                "prefix text delay"
                "prefix text postfix"
        }
        .prefix { 
            grid-area: prefix; 
            align-self: end;
            justify-self: start;
        }
        .delay { 
            grid-area: delay; 
            justify-self: start;
        }
        .green {
            color: var(--success-color);
        }
        .red {
            color: var(--error-color);
        }
        .postfix { 
            grid-area: postfix; 
            align-self: end;
            justify-self: end;
        }
        .text {
            grid-area: text;    
            font-size: 1.3em;
            font-weight: bold;
            align-self: end;
            align-content: center;
            line-height: 24px;
        }
        .pulsating {
            animation: pulsieren 1.5s infinite;
        }
        @media (min-width: 100px) and (max-width: 500px){
            :contianer {
                margin: 5px 0px 5px 0px;
            }
        }
        @keyframes pulsieren {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
    `],t([lt({attribute:!1})],Vt.prototype,"time",void 0),t([lt({attribute:!1})],Vt.prototype,"showAnimation",void 0),t([lt({attribute:!1})],Vt.prototype,"nowIcon",void 0),Vt=t([at("departure-text")],Vt);let Wt=class extends rt{constructor(){super(...arguments),this.showIcon=!1,this.debug=!1,this.timesToShow=1,this.showAnimation=!0,this.times=[],this.INTERVAL=1e4}connectedCallback(){super.connectedCallback(),this.intervalId=window.setInterval((()=>{this._updateTimes()}),this.INTERVAL),this._updateTimes()}disconnectedCallback(){super.disconnectedCallback(),void 0!==this.intervalId&&clearInterval(this.intervalId)}_updateTimes(){let t=this.config?.timeStyle??"dynamic";this.times=[new zt(t),new zt(t),new zt(t),new zt(t),new zt(t)],this.times[0].updateTime(this.state?.attributes[At.PLANNED_TIME],this.state?.attributes[At.ESTIMATED_TIME]),this.times[1].updateTime(this.state?.attributes[At.PLANNED_TIME_1],this.state?.attributes[At.ESTIMATED_TIME_1]),this.times[2].updateTime(this.state?.attributes[At.PLANNED_TIME_2],this.state?.attributes[At.ESTIMATED_TIME_2]),this.times[3].updateTime(this.state?.attributes[At.PLANNED_TIME_3],this.state?.attributes[At.ESTIMATED_TIME_3]),this.times[4].updateTime(this.state?.attributes[At.PLANNED_TIME_4],this.state?.attributes[At.ESTIMATED_TIME_4])}_getNowIcon(){return this.config?.nowIcon?this.config.nowIcon:this.state?.attributes[At.ICON]?this.state.attributes[At.ICON]:"mdi:train-bus"}render(){return F`
            <destination-container>
                ${this.renderIcon()}
                ${this.renderLine()}
                ${this.renderDestination()}
            </destination-container>
            <times-container>
                ${this.renderDepartureTimes()}
            </times-container>
            ${this.debug?this.renderDebugInfo():W}
        `}renderIcon(){if(!this.showIcon)return W;let t=this.state?.attributes[At.ICON]??"mdi:train-bus";return F`
            <div class="cell-icon">
                <ha-icon icon=${t}></ha-icon>
            </div>
        `}renderLine(){const t=this.config?.lineName??this.state?.attributes[At.LINE_NAME],e={background:this.config?.lineColor||""};return F`
            <div class="cell-line">
                <div class="line-number" style=${wt(e)}>${t}</div>
            </div>
        `}renderDestination(){let t=this.config?.destinationName??this.state?.attributes[At.DIRECTION];return F`
            <div class="cell-destination">${t}</div>
        `}renderDepartureTimes(){let t=this.times.filter((t=>t.mode!=Rt.PAST));const e=this.timesToShow-t.length;t=e<=0?t.slice(0,this.timesToShow):t.concat(new Array(e).fill(null));let i=this._getNowIcon();return F`
            ${t.map((t=>F`
                <departure-text 
                    .time=${t} 
                    .showAnimation=${this.showAnimation}
                    .nowIcon=${i}>
                </departure-text>`))}
        `}renderDebugInfo(){return F`
            <debug-info>
                <pre>${JSON.stringify(this.state?.attributes,null,1)}</pre></br>
            </debug-info>
        `}};Wt.styles=[ut,o`
        :host {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: baseline;
        }
        destination-container{
            display: flex;     
            flex: 2; 
            justify-content: space-between; 
            align-items: center;
        }
        times-container{
            display: flex;     
            flex: 1; 
            justify-content: flex-end; 
            align-items: center;
        }
        debug-info {
            display: flex;
            width: 100%;
            font-size: 0.7em;
            color: white;
            padding: 10px;
            background-color: black;
        }
        @media (min-width: 100px) and (max-width: 500px){
            :host {
                display: grid;
                grid-template-columns: 100%;
                grid-template-rows: auto auto;
            }
            destination-container{
                flex: 1; 
                display: flex; 
                justify-content: flex-start; 
                align-items: center;
                background: var(--primary-color);
            }
            times-container{
                flex: 2;
                display: flex;
                justify-content: flex-start;
            }
        }
    `],t([lt({attribute:!1})],Wt.prototype,"config",void 0),t([lt({attribute:!1})],Wt.prototype,"state",void 0),t([lt({attribute:!1})],Wt.prototype,"showIcon",void 0),t([lt({attribute:!1})],Wt.prototype,"debug",void 0),t([lt({attribute:!1})],Wt.prototype,"timesToShow",void 0),t([lt({attribute:!1})],Wt.prototype,"showAnimation",void 0),t([dt()],Wt.prototype,"times",void 0),Wt=t([at("departures-row")],Wt);var Bt="\\d\\d?",Zt="\\d\\d",qt="[^\\s]+";function Jt(t,e){for(var i=[],s=0,n=t.length;s<n;s++)i.push(t[s].substr(0,e));return i}var Kt=function(t){return function(e,i){var s=i[t].map((function(t){return t.toLowerCase()})),n=s.indexOf(e.toLowerCase());return n>-1?n:null}};function Yt(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];for(var s=0,n=e;s<n.length;s++){var r=n[s];for(var o in r)t[o]=r[o]}return t}var Gt=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Qt=["January","February","March","April","May","June","July","August","September","October","November","December"],Xt=Jt(Qt,3),te={dayNamesShort:Jt(Gt,3),dayNames:Gt,monthNamesShort:Xt,monthNames:Qt,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},ee=(Yt({},te),function(t){return+t-1}),ie=[null,Bt],se=[null,qt],ne=["isPm",qt,function(t,e){var i=t.toLowerCase();return i===e.amPm[0]?0:i===e.amPm[1]?1:null}],re=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var i=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?i:-i}return 0}];Kt("monthNamesShort"),Kt("monthNames");var oe,ae;!function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}}(),function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(oe||(oe={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(ae||(ae={}));var he=function(t,e,i,s){s=s||{},i=null==i?{}:i;var n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n};let ce=class extends rt{constructor(){super(...arguments),this._schema=[{name:"entity",selector:{entity:{},domain:"sensor"}},{name:"destinationName",selector:{text:{}}},{name:"",type:"grid",schema:[{name:"lineName",selector:{text:{}}},{name:"lineColor",selector:{text:{}}}]},{name:"nowIcon",selector:{icon:{}}},{name:"timeStyle",type:"select",default:"dynamic",options:[["dynamic","Dynamic"],["timestamp","Timestamp"]]}],this._computeLabelCallback=t=>ft(`card.editor.entity.${t.name}`,this.hass.locale?.language)}render(){return this.hass?F`
            <div class="entity-editor-content">
                <div id="card-options">
                    <ha-icon-button 
                        .label=${ft("card.editor.entity.remove",this.hass.locale?.language)}
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
      `:W}_configChanged(t){this.dispatchEvent(new CustomEvent("onChange",{detail:t.detail.value}))}handleDelete(){this.dispatchEvent(new CustomEvent("onDelete",{detail:this.data?.index}))}};ce.styles=[ut,o`
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
    `],t([lt({attribute:!1})],ce.prototype,"hass",void 0),t([lt({attribute:!1})],ce.prototype,"data",void 0),ce=t([at("departures-entity-editor")],ce);let le=class extends rt{constructor(){super(...arguments),this._tabs=[],this._currTab="1",this.SCHEMA=[{name:"",type:"grid",schema:[{name:"title",required:!1,selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"",type:"grid",column_min_width:"100px",schema:[{name:"showAnimation",type:"boolean"},{name:"showTransportIcon",type:"boolean"},{name:"debug",type:"boolean"}]},{name:"departuresToShow",type:"integer",required:!0,default:3,valueMin:1,valueMax:5}],this.computeLabelCallback=t=>ft(`card.editor.${t.name}`,this.hass.locale?.language)}setConfig(t){this._config=t,this._tabs=t.entities?.map(((t,e)=>new Ft(Number(e+1),t)))||[]}render(){return this.hass&&this._config?(0===this._tabs.length&&this.addEntity(),F`
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
              ${this._tabs.map((t=>F`
                  <sl-tab slot="nav" .panel=${t.index} .active=${this._currTab===t.index.toString()}>
                    ${t.index}
                  </sl-tab>
                `))}
              </sl-tab-group>
              <ha-icon-button
                .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
                .label=${ft("card.editor.addEntity",this.hass.locale?.language)}
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
    `):W}getTabData(){const t=parseInt(this._currTab)-1;if(t>=0&&t<this._tabs.length)return this._tabs[t]}addEntity(){if(!this._config)return;let t=new Ft(this._tabs.length+1,void 0);this._tabs=[...this._tabs,t],this._currTab=`${this._tabs.length}`,this.updateConfig()}removeEntity(t){if(!this._config)return;const e=parseInt(this._currTab)-1;this._tabs.splice(e,1),this.updateConfig(),this._currTab=Math.max(1,e).toString()}updateEntity(t){t.stopPropagation();let e=this.getTabData();e?(e.config=t.detail,this.updateConfig(),he(this,"config-changed",{config:this._config})):console.warn("No tab found for config change",this._tabs,this._currTab)}updateConfig(){const t={...this._config};t.entities=this._tabs.map((t=>t.config)),this._config=t,he(this,"config-changed",{config:this._config})}handleTabChanged(t){const e=t.detail.name.toString();e!==this._currTab&&(this._currTab=e)}configChanged(t){t.stopPropagation(),this._config&&this.hass&&(this._config=t.detail.value,he(this,"config-changed",{config:this._config}))}};le.styles=[ut,o`
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
  `],t([lt({attribute:!1})],le.prototype,"hass",void 0),t([dt()],le.prototype,"_config",void 0),t([dt()],le.prototype,"_tabs",void 0),t([dt()],le.prototype,"_currTab",void 0),le=t([at("departures-card-editor")],le),window.customCards=window.customCards||[],window.customCards.push({type:"departures-card",name:"Departures Card",description:"Display departure times for different public transports"});console.groupCollapsed("%cDepartures-Card 2.0.0","color:black; font-weight: bold; background: tomato; padding: 2px; border-radius: 5px;"),console.log("Github repository: https://github.com/alex-jung/ha-departures-card"),console.groupEnd();let de=class extends rt{constructor(){super(...arguments),this.moreInfoOpen=!1}static getStubConfig(t){return{type:"custom:departures-card",title:ft("card.departures",t.locale?.language)||"Departures",entity:[]}}static getConfigElement(){return document.createElement("departures-card-editor")}async getCardSize(){return this.config&&this.config.entities?this.config.entities.length+1:1}setConfig(t){if(!t)throw new Error("Invalid configuration");if(this.config=t,!this.config.entities||this.config.entities.length<=0)throw new Error("Please define at least one entity in the configuration.")}render(){const t=this.config.title||ft("card.departures",this.hass.locale?.language),e=this.config.icon||"mdi:bus";return F`
      <ha-card>
        <div class="card-content">
          <div class="card-header">
            ${t}
            <ha-icon icon="${e}"></ha-icon>
          </div> 
          <departures-table 
            @click="${()=>this.moreInfoOpen=!0}" 
            .config=${this.config}
            .hass=${this.hass}>
          </departures-table>
        </div>
      </ha-card>
      <ha-dialog hideactions ?open="${this.moreInfoOpen}" @closed="${()=>this.moreInfoOpen=!1}">
        <div class="card-header">
          <ha-icon-button @click="${()=>this.moreInfoOpen=!1}" aria-label="Close" title="Close">
            <ha-icon icon="mdi:close" style="display: flex;"></ha-icon>
          </ha-icon-button>
          ${t}
          <ha-icon icon="${e}"></ha-icon>
        </div>
        <div class="content">
          <departures-table
            .config=${this.config}
            .moreInfo=${!0}
            .hass=${this.hass}>
          </departures-table>
        </div>
      </ha-dialog>
    `}};de.styles=ut,t([lt({attribute:!1})],de.prototype,"hass",void 0),t([dt()],de.prototype,"config",void 0),t([dt()],de.prototype,"moreInfoOpen",void 0),de=t([at("departures-card")],de);export{de as DeparturesCard};
//# sourceMappingURL=ha-departures-card.js.map
