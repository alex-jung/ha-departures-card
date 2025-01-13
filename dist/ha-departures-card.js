function t(t,e,s,i){var n,r=arguments.length,o=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,s,o):n(e,s))||o);return r>3&&o&&Object.defineProperty(e,s,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;class r{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&n.set(e,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new r(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:h,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,f=globalThis,$=f.trustedTypes,g=$?$.emptyScript:"",_=f.reactiveElementPolyfillSupport,y=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!h(t,e),A={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;class b extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=A){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return i?.call(this)},set(e){const r=i?.call(this);n.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??A}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const s of i){const i=document.createElement("style"),n=e.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:m).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=i,this[i]=n.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){if(s??=this.constructor.getPropertyOptions(t),!(s.hasChanged??v)(this[t],e))return;this.P(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t)!0!==s.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],s)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[y("elementProperties")]=new Map,b[y("finalized")]=new Map,_?.({ReactiveElement:b}),(f.reactiveElementVersions??=[]).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,E=w.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,x="?"+M,T=`<${x}>`,P=document,D=()=>P.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,N="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,k=/>/g,I=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,L=/"/g,z=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),F=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),V=new WeakMap,W=P.createTreeWalker(P,129);function q(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=H;for(let e=0;e<s;e++){const s=t[e];let a,h,c=-1,l=0;for(;l<s.length&&(o.lastIndex=l,h=o.exec(s),null!==h);)l=o.lastIndex,o===H?"!--"===h[1]?o=R:void 0!==h[1]?o=k:void 0!==h[2]?(z.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=I):void 0!==h[3]&&(o=I):o===I?">"===h[0]?(o=n??H,c=-1):void 0===h[1]?c=-2:(c=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?I:'"'===h[3]?L:j):o===L||o===j?o=I:o===R||o===k?o=H:(o=I,n=void 0);const d=o===I&&t[e+1].startsWith("/>")?" ":"";r+=o===H?s+T:c>=0?(i.push(a),s.slice(0,c)+C+s.slice(c)+M+d):s+M+(-2===c?e:d)}return[q(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class J{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[h,c]=Z(t,e);if(this.el=J.createElement(h,s),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=W.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[r++],s=i.getAttribute(t).split(M),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?st:X}),i.removeAttribute(t)}else t.startsWith(M)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(z.test(i.tagName)){const t=i.textContent.split(M),e=t.length-1;if(e>0){i.textContent=E?E.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],D()),W.nextNode(),a.push({type:2,index:++n});i.append(t[e],D())}}}else if(8===i.nodeType)if(i.data===x)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(M,t+1));)a.push({type:7,index:n}),t+=M.length-1}n++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function K(t,e,s=t,i){if(e===F)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=O(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=K(t,n._$AS(t,e.values),n,i)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);W.currentNode=i;let n=W.nextNode(),r=0,o=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new it(n,this,t)),this._$AV.push(e),a=s[++o]}r!==a?.index&&(n=W.nextNode(),r++)}return W.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),O(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(q(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new G(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new J(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Q(this.O(D()),this.O(D()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Y}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=K(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const i=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=K(this,i[s+o],e,o),a===F&&(a=this._$AH[o]),r||=!O(a)||a!==this._$AH[o],a===Y?t=Y:t!==Y&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class st extends X{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??Y)===F)return;const s=this._$AH,i=t===Y&&s!==Y||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==Y&&(s===Y||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(J,Q),(w.litHtmlVersions??=[]).push("3.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class rt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new Q(e.insertBefore(D(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}rt._$litElement$=!0,rt.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:rt});const ot=globalThis.litElementPolyfillSupport;ot?.({LitElement:rt}),(globalThis.litElementVersions??=[]).push("4.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at=t=>(e,s)=>{void 0!==s?s.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ht={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:v},ct=(t=ht,e,s)=>{const{kind:i,metadata:n}=s;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,n,t)},init(e){return void 0!==e&&this.P(i,void 0,t),e}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];e.call(this,s),this.requestUpdate(i,n,t)}}throw Error("Unsupported decorator location: "+i)};function lt(t){return(e,s)=>"object"==typeof s?ct(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,i?{...t,wrapped:!0}:t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function dt(t){return lt({...t,state:!0,attribute:!1})}const ut=o`
    ha-card {
        display: block;
        height: auto;
        padding: 16px;
    }
    card-header {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
    .card-title {
        font-size: 2em;
    }
    .table-header {
        display: flex;
        padding-top: 20px;
        flex-wrap: nowrap;
        justify-content: space-between;
    }
    .cell-line {
        display: flex;
        align-items: center;
        width: 70px;
    }
    .cell-destination {
        display: flex;
        align-items: left;
        flex: 2;
    }
    .line-number {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px;
        border-radius: 5px;
        width: 130px;
        height: 25px;
        font-size: 1.2em;
        font-weight: bold;
        background: none;
    }
    .delay {
        color: "limegreen";
    }
    .delay[delayed] {
        color: "#F72C5B";
    }
    `;let pt=class extends rt{constructor(){super(...arguments),this.title="Abfahrten",this.icon="mdi:bus"}render(){return B`
      <div class="card-title">${this.title}</div>
      <div>
        <ha-icon icon="${this.icon}"></ha-icon>
      </div>`}};pt.styles=ut,t([lt({type:String})],pt.prototype,"title",void 0),t([lt({type:String})],pt.prototype,"icon",void 0),pt=t([at("card-header")],pt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ft=1;class $t{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt="important",_t=" !"+gt,yt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends $t{constructor(t){if(super(t),t.type!==ft||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,s)=>{const i=t[s];return null==i?e:e+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`}),"")}update(t,[e]){const{style:s}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in e){const i=e[t];if(null!=i){this.ft.add(t);const e="string"==typeof i&&i.endsWith(_t);t.includes("-")||e?s.setProperty(t,e?i.slice(0,-11):i,e?gt:""):s[t]=i}}return F}});let mt=class extends rt{render(){const t={width:this.config.showTransportIcon?"100px":"70px"};return B`
        <div>
            <div class="table-header">
                <div class="cell-line" style=${yt(t)}>Linie</div>
                <div class="cell-destination">Ziel</div>
                <div>Abfahrt</div>
            </div>
            <hr/>
            ${this.config.entities?this.config.entities.map((t=>B`
                <departures-row 
                    .config=${t} 
                    .hass=${this.hass} 
                    .showDelay=${this.config.showDelay} 
                    .showIcon=${this.config.showTransportIcon}
                    .showTimestamp=${this.config.showTimestamp}>
                </departures-row>`)):Y}
        </div>
        `}};mt.styles=ut,t([lt({attribute:!1})],mt.prototype,"hass",void 0),t([lt({attribute:!1})],mt.prototype,"config",void 0),mt=t([at("departures-table")],mt);const vt=86400,At=31556952,bt=2629746,wt=Symbol.for("constructDateFrom");function Et(t,e){return"function"==typeof t?t(e):t&&"object"==typeof t&&wt in t?t[wt](e):t instanceof Date?new t.constructor(e):new Date(e)}function St(t,e){return Et(e||t,t)}let Ct={};function Mt(){return Ct}function xt(t,e){const s=Mt(),i=e?.weekStartsOn??e?.locale?.options?.weekStartsOn??s.weekStartsOn??s.locale?.options?.weekStartsOn??0,n=St(t,e?.in),r=n.getDay(),o=(r<i?7:0)+r-i;return n.setDate(n.getDate()-o),n.setHours(0,0,0,0),n}function Tt(t){const e=St(t),s=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds()));return s.setUTCFullYear(e.getFullYear()),+t-+s}function Pt(t,...e){const s=Et.bind(null,t||e.find((t=>"object"==typeof t)));return e.map(s)}function Dt(t,e){const s=St(t,e?.in);return s.setHours(0,0,0,0),s}function Ot(t,e,s){const[i,n]=Pt(s?.in,t,e),r=Dt(i),o=Dt(n),a=+r-Tt(r),h=+o-Tt(o);return Math.round((a-h)/864e5)}function Ut(t){return!(!((e=t)instanceof Date||"object"==typeof e&&"[object Date]"===Object.prototype.toString.call(e))&&"number"!=typeof t||isNaN(+St(t)));var e}function Nt(t,e,s){const[i,n]=Pt(s?.in,t,e);return 12*(i.getFullYear()-n.getFullYear())+(i.getMonth()-n.getMonth())}function Ht(t,e){const s=St(t,e?.in);return Math.trunc(s.getMonth()/3)+1}function Rt(t,e,s){const[i,n]=Pt(s?.in,t,e);return 4*(i.getFullYear()-n.getFullYear())+(Ht(i)-Ht(n))}function kt(t,e,s){const[i,n]=Pt(s?.in,t,e),r=xt(i,s),o=xt(n,s),a=+r-Tt(r),h=+o-Tt(o);return Math.round((a-h)/6048e5)}function It(t,e,s){const[i,n]=Pt(s?.in,t,e);return i.getFullYear()-n.getFullYear()}function jt(t){return e=>{const s=(t?Math[t]:Math.trunc)(e);return 0===s?0:s}}function Lt(t,e,s){const[i,n]=Pt(s?.in,t,e),r=(+i-+n)/36e5;return jt(s?.roundingMethod)(r)}function zt(t,e){return+St(t)-+St(e)}function Bt(t,e,s){const i=zt(t,e)/6e4;return jt(s?.roundingMethod)(i)}function Ft(t,e,s){const i=zt(t,e)/1e3;return jt(s?.roundingMethod)(i)}function Yt(t,e){return(t<0?"-":"")+Math.abs(t).toString().padStart(e,"0")}const Vt={y(t,e){const s=t.getFullYear(),i=s>0?s:1-s;return Yt("yy"===e?i%100:i,e.length)},M(t,e){const s=t.getMonth();return"M"===e?String(s+1):Yt(s+1,2)},d:(t,e)=>Yt(t.getDate(),e.length),a(t,e){const s=t.getHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return s.toUpperCase();case"aaa":return s;case"aaaaa":return s[0];default:return"am"===s?"a.m.":"p.m."}},h:(t,e)=>Yt(t.getHours()%12||12,e.length),H:(t,e)=>Yt(t.getHours(),e.length),m:(t,e)=>Yt(t.getMinutes(),e.length),s:(t,e)=>Yt(t.getSeconds(),e.length),S(t,e){const s=e.length,i=t.getMilliseconds();return Yt(Math.trunc(i*Math.pow(10,s-3)),e.length)}};function Wt(t,e){const s=St(t,e?.in);return s.setSeconds(0,0),s}function qt(t){return e=t,s=function(t){return Et(t,Date.now())}(t),+Wt(e)==+Wt(s);var e,s}const Zt=/(\w)\1*|''|'(''|[^'])+('|$)|./g,Jt=/^'([^]*?)'?$/,Kt=/''/g,Gt=/[a-zA-Z]/;function Qt(t,e){const s=St(t);if(!Ut(s))throw new RangeError("Invalid time value");const i=e.match(Zt);if(!i)return"";return i.map((t=>{if("''"===t)return"'";const e=t[0];if("'"===e)return function(t){const e=t.match(Jt);return e?e[1].replace(Kt,"'"):t}(t);const i=Vt[e];if(i)return i(s,t);if(e.match(Gt))throw new RangeError("Format string contains an unescaped latin alphabet character `"+e+"`");return t})).join("")}var Xt;!function(t){t.PLANNED_TIME="planned_departure_time",t.LINE_NAME="line_name",t.DIRECTION="direction",t.TRANSPORT="transport",t.LINE_ID="line_id",t.FRIENDLY_NAME="friendly_name",t.ICON="icon"}(Xt||(Xt={}));let te=class extends rt{constructor(){super(...arguments),this.showDelay=!0,this.showIcon=!1,this.showTimestamp=!1,this._departure="-:-",this._delay=0,this._now=!1,this.INTERVAL=1e4,this.updateTime=()=>{this._state=this.getState(),this._departure=this.calculateDeparture(this._state?.state),this._delay=this.calculateDelay(this._state?.state,this._state?.attributes[Xt.PLANNED_TIME])}}connectedCallback(){super.connectedCallback(),this.intervalTimer=setInterval(this.updateTime,this.INTERVAL)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.intervalTimer),this.intervalTimer=void 0}calculateDeparture(t){if(!t||"unknown"==t)return"-:-";let e=new Date(t).setSeconds(0,0),s=(new Date).setSeconds(0,0);return qt(e)?(this._now=!0,"Jetzt"):(this._now=!1,this.showTimestamp?Qt(e,"HH:mm"):function(t,e,s){let i,n=0;const[r,o]=Pt(s?.in,t,e);if(s?.unit)i=s?.unit,"second"===i?n=Ft(r,o):"minute"===i?n=Bt(r,o):"hour"===i?n=Lt(r,o):"day"===i?n=Ot(r,o):"week"===i?n=kt(r,o):"month"===i?n=Nt(r,o):"quarter"===i?n=Rt(r,o):"year"===i&&(n=It(r,o));else{const t=Ft(r,o);Math.abs(t)<60?(n=Ft(r,o),i="second"):Math.abs(t)<3600?(n=Bt(r,o),i="minute"):Math.abs(t)<vt&&Math.abs(Ot(r,o))<1?(n=Lt(r,o),i="hour"):Math.abs(t)<604800&&(n=Ot(r,o))&&Math.abs(n)<7?i="day":Math.abs(t)<bt?(n=kt(r,o),i="week"):Math.abs(t)<7889238?(n=Nt(r,o),i="month"):Math.abs(t)<At&&Rt(r,o)<4?(n=Rt(r,o),i="quarter"):(n=It(r,o),i="year")}return new Intl.RelativeTimeFormat(s?.locale,{numeric:"auto",...s}).format(n,i)}(e,s,{style:"short"}))}calculateDelay(t,e){return t&&"unknown"!==t&&e&&"unknown"!==e?Bt(t,e):0}getState(){return this.hass?this.hass.states[this.config.entity]:{}}render(){return this.updateTime(),B`
            ${this.renderIcon()}
            ${this.renderLine()}
            ${this.renderDestination()}
            ${this.renderDepartureTime()}
        `}renderIcon(){if(!this.showIcon)return Y;let t=this._state.attributes[Xt.ICON]??"mdi:train-bus";return B`<ha-icon icon=${t}></ha-icon>`}renderLine(){const t=this.config.line_name||this._state.attributes[Xt.LINE_NAME],e={background:this.config.line_color||""};return B`
            <div class="cell-line">
                <div class="line-number" style=${yt(e)}>${t}</div>
            </div>
        `}renderDestination(){const t=this.config.destination_name||this._state.attributes[Xt.DIRECTION];return B`
            <div class="cell-destination">${t}</div>
        `}renderDepartureTime(){return B`
            ${this._departure}
            ${this.renderDelay()}
        `}renderDelay(){if(!this.showDelay||this._now)return Y;const t=this._delay>=0;return B`<span class="delay" delayed=${t}>(${t?"+":"-"}${this._delay})</span>`}};te.styles=[ut,o`
        :host {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
        }
    `],t([lt({attribute:!1})],te.prototype,"config",void 0),t([lt({attribute:!1})],te.prototype,"hass",void 0),t([lt({type:Boolean})],te.prototype,"showDelay",void 0),t([lt({type:Boolean})],te.prototype,"showIcon",void 0),t([lt({type:Boolean})],te.prototype,"showTimestamp",void 0),t([dt()],te.prototype,"_departure",void 0),t([dt()],te.prototype,"_delay",void 0),t([dt()],te.prototype,"_now",void 0),t([dt()],te.prototype,"_state",void 0),te=t([at("departures-row")],te),window.customCards=window.customCards||[],window.customCards.push({type:"departures-card",name:"Departures Card",description:"Display departure times for different public transports"});console.groupCollapsed("%cDepartures-Card 0.0.1","color:black; font-weight: bold; background: tomato"),console.log("Github repository: https://github.com/alex-jung/ha-departures-card"),console.groupEnd();let ee=class extends rt{static getStubConfig(){return{}}async getCardSize(){return this._config&&this._config.entities?this._config.entities.length+1:1}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config=t}render(){return B`
      <ha-card>
        <div>
          <card-header .title=${this._config.title} .icon=${this._config.icon}></card-header>
          <departures-table .config=${this._config} .hass=${this.hass}></departures-table>
        </div>
      </ha-card>
    `}};ee.styles=ut,t([lt({attribute:!1})],ee.prototype,"hass",void 0),t([dt()],ee.prototype,"_config",void 0),ee=t([at("departures-card")],ee);export{ee as DeparturesCard};
//# sourceMappingURL=ha-departures-card.js.map
