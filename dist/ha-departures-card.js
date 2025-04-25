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
 */,{is:h,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,_=m?m.emptyScript:"",g=f.reactiveElementPolyfillSupport,$=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},A=(t,e)=>!h(t,e),v={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:A};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;class b extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return s?.call(this)},set(e){const r=s?.call(this);n.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s,this[s]=n.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??A)(this[t],e))return;this.P(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t)!0!==i.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],i)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[$("elementProperties")]=new Map,b[$("finalized")]=new Map,g?.({ReactiveElement:b}),(f.reactiveElementVersions??=[]).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E=globalThis,w=E.trustedTypes,x=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,T="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+S,N=`<${M}>`,I=document,C=()=>I.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,D=Array.isArray,O="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,j=/>/g,k=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,L=/"/g,z=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),V=new WeakMap,q=I.createTreeWalker(I,129);function Z(t,e){if(!D(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=U;for(let e=0;e<i;e++){const i=t[e];let a,h,l=-1,c=0;for(;c<i.length&&(o.lastIndex=c,h=o.exec(i),null!==h);)c=o.lastIndex,o===U?"!--"===h[1]?o=H:void 0!==h[1]?o=j:void 0!==h[2]?(z.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=k):void 0!==h[3]&&(o=k):o===k?">"===h[0]?(o=n??U,l=-1):void 0===h[1]?l=-2:(l=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?k:'"'===h[3]?L:R):o===L||o===R?o=k:o===H||o===j?o=U:(o=k,n=void 0);const d=o===k&&t[e+1].startsWith("/>")?" ":"";r+=o===U?i+N:l>=0?(s.push(a),i.slice(0,l)+T+i.slice(l)+S+d):i+S+(-2===l?e:d)}return[Z(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[h,l]=J(t,e);if(this.el=K.createElement(h,i),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=q.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(T)){const e=l[r++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:X}),s.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(z.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],C()),q.nextNode(),a.push({type:2,index:++n});s.append(t[e],C())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)a.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const i=I.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===W)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=P(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=Y(t,n._$AS(t,e.values),n,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??I).importNode(e,!0);q.currentNode=s;let n=q.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new st(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=q.nextNode(),r++)}return q.currentNode=I,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),P(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>D(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new G(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new K(t)),e}k(t){D(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Q(this.O(C()),this.O(C()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=Y(this,t,e,0),r=!P(t)||t!==this._$AH&&t!==W,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=Y(this,s[i+o],e,o),a===W&&(a=this._$AH[o]),r||=!P(a)||a!==this._$AH[o],a===B?t=B:t!==B&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class it extends X{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??B)===W)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const nt=E.litHtmlPolyfillSupport;nt?.(K,Q),(E.litHtmlVersions??=[]).push("3.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class rt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new Q(e.insertBefore(C(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}rt._$litElement$=!0,rt.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:rt});const ot=globalThis.litElementPolyfillSupport;ot?.({LitElement:rt}),(globalThis.litElementVersions??=[]).push("4.1.1");
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
 */,ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:A},lt=(t=ht,e,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t)},init(e){return void 0!==e&&this.P(s,void 0,t),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t)}}throw Error("Unsupported decorator location: "+s)};function ct(t){return(e,i)=>"object"==typeof i?lt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,s?{...t,wrapped:!0}:t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function dt(t){return ct({...t,state:!0,attribute:!1})}const pt=o`
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
    @media (min-width: 600px) and (min-height: 501px) {
      ha-dialog {
        --mdc-dialog-min-width: 650px !important;
        --mdc-dialog-max-width: 100vw !important;
      }
    }
    `;function ut(t,e){const i={de:{departures:"Abfahrten",line:"Linie",destination:"Ziel"},en:{departures:"Departures",line:"Line",destination:"Destination"}};return e&&"undefined"!==e||(e="en"),i[e][t]||i.en[t]}let ft=class extends rt{constructor(){super(...arguments),this.moreInfo=!1}getState(t){return this.hass?this.hass.states[t]:{}}render(){const t=this.hass.locale?.language,e=void 0===this.config.showAnimation||this.config.showAnimation,i=void 0!==this.config.showTransportIcon&&this.config.showTransportIcon;let s=void 0===this.config.departuresToShow?1:this.config.departuresToShow;return this.moreInfo&&(s=5),F`
            <table-header>
                ${this.config.showTransportIcon?F`<div class="cell-icon">Icon</div>`:B}    
                <div class="cell-line">${ut("line",t)}</div>
                <div class="cell-destination">${ut("destination",t)}</div>
                <div>${ut("departures",t)}</div>
            </table-header>
            <hr style="width:100%"/>
            ${this.config.entities?this.config.entities.map((t=>F`
                <departures-row 
                    .config=${t}
                    .hass=${this.hass} 
                    .showIcon=${i}
                    .destination=${t.destination_name}
                    .lineName=${t.line_name}
                    .lineColor=${t.line_color}
                    .state=${this.getState(t.entity)}
                    .timesToShow=${s}
                    .showAnimation=${e}
                </departures-row>`)):B}
        `}};ft.styles=[pt,o`
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
    `],t([ct({attribute:!1})],ft.prototype,"hass",void 0),t([ct({attribute:!1})],ft.prototype,"config",void 0),t([ct({attribute:!1})],ft.prototype,"moreInfo",void 0),ft=t([at("departures-table")],ft);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt=1,_t=t=>(...e)=>({_$litDirective$:t,values:e});class gt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $t="important",yt=" !"+$t,At=_t(class extends gt{constructor(t){if(super(t),t.type!==mt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(yt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?$t:""):i[t]=s}}return W}});var vt;!function(t){t.PLANNED_TIME="planned_departure_time",t.PLANNED_TIME_1="planned_departure_time_1",t.PLANNED_TIME_2="planned_departure_time_2",t.PLANNED_TIME_3="planned_departure_time_3",t.PLANNED_TIME_4="planned_departure_time_4",t.ESTIMATED_TIME="estimated_departure_time",t.ESTIMATED_TIME_1="estimated_departure_time_1",t.ESTIMATED_TIME_2="estimated_departure_time_2",t.ESTIMATED_TIME_3="estimated_departure_time_3",t.ESTIMATED_TIME_4="estimated_departure_time_4",t.LINE_NAME="line_name",t.DIRECTION="direction",t.TRANSPORT="transport",t.LINE_ID="line_id",t.FRIENDLY_NAME="friendly_name",t.ICON="icon"}(vt||(vt={}));
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bt=_t(class extends gt{constructor(t){if(super(t),t.type!==mt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return W}}),Et=Symbol.for("constructDateFrom");function wt(t,e){return"function"==typeof t?t(e):t&&"object"==typeof t&&Et in t?t[Et](e):t instanceof Date?new t.constructor(e):new Date(e)}function xt(t,e){return wt(e||t,t)}function Tt(t){return!(!((e=t)instanceof Date||"object"==typeof e&&"[object Date]"===Object.prototype.toString.call(e))&&"number"!=typeof t||isNaN(+xt(t)));var e}function St(t,e,i){const s=(n=e,(+xt(t)-+xt(n))/6e4);var n,r;return(r=i?.roundingMethod,t=>{const e=(r?Math[r]:Math.trunc)(t);return 0===e?0:e})(s)}function Mt(t,e){return(t<0?"-":"")+Math.abs(t).toString().padStart(e,"0")}const Nt={y(t,e){const i=t.getFullYear(),s=i>0?i:1-i;return Mt("yy"===e?s%100:s,e.length)},M(t,e){const i=t.getMonth();return"M"===e?String(i+1):Mt(i+1,2)},d:(t,e)=>Mt(t.getDate(),e.length),a(t,e){const i=t.getHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return i.toUpperCase();case"aaa":return i;case"aaaaa":return i[0];default:return"am"===i?"a.m.":"p.m."}},h:(t,e)=>Mt(t.getHours()%12||12,e.length),H:(t,e)=>Mt(t.getHours(),e.length),m:(t,e)=>Mt(t.getMinutes(),e.length),s:(t,e)=>Mt(t.getSeconds(),e.length),S(t,e){const i=e.length,s=t.getMilliseconds();return Mt(Math.trunc(s*Math.pow(10,i-3)),e.length)}};function It(t,e){const i=xt(t,e?.in);return i.setSeconds(0,0),i}function Ct(t){return e=t,i=function(t){return wt(t,Date.now())}(t),+It(e)==+It(i);var e,i}const Pt=/(\w)\1*|''|'(''|[^'])+('|$)|./g,Dt=/^'([^]*?)'?$/,Ot=/''/g,Ut=/[a-zA-Z]/;function Ht(t,e){const i=xt(t);if(!Tt(i))throw new RangeError("Invalid time value");const s=e.match(Pt);if(!s)return"";return s.map((t=>{if("''"===t)return"'";const e=t[0];if("'"===e)return function(t){const e=t.match(Dt);return e?e[1].replace(Ot,"'"):t}(t);const s=Nt[e];if(s)return s(i,t);if(e.match(Ut))throw new RangeError("Format string contains an unescaped latin alphabet character `"+e+"`");return t})).join("")}var jt;!function(t){t.NONE="none",t.TIMESTAMP="timestamp",t.DIFF="diff",t.NOW="now",t.PAST="past"}(jt||(jt={}));class kt{constructor(t){this._mode=jt.NONE,this._realTime=t,this._delay=0,this._time="-",this._prefix="",this._postfix=""}updateTime(t,e=""){switch(this._mode=t,t){case jt.TIMESTAMP:this._prefix="",this._postfix="",this._time=e;break;case jt.DIFF:this._prefix="in",this._postfix="min",this._time=e;break;case jt.NOW:this._prefix="",this._postfix="",this._time="Now";break;case jt.NONE:case jt.PAST:this._prefix="",this._postfix="",this._time="...";break;default:console.warn("Unknown mode",t)}}set delay(t){this._delay=t}get mode(){return this._mode}get delay(){return this._delay}get realTime(){return this._realTime}get prefix(){return this._prefix}get postfix(){return this._postfix}get time(){return this._time}}function Rt(t,e){let i=new kt(!!e),s=Lt(Date()),n=Lt(t),r=Lt(e);if(!n)return i.updateTime(jt.NONE),i;if(r||(r=n),i.delay=St(r,n),Ct(r))return i.updateTime(jt.NOW),i;if(+xt(r)<Date.now())return i.updateTime(jt.PAST),i;const o=r&&s?St(r,s):0;return o>=60?i.updateTime(jt.TIMESTAMP,Ht(r,"HH:mm")):i.updateTime(jt.DIFF,o.toString()),i}function Lt(t){if(!t||"unknown"===t)return null;let e=new Date(t);return e.setSeconds(0,0),e}let zt=class extends rt{constructor(){super(...arguments),this.planned=null,this.estimated=null,this.showAnimation=!0,this.data=new kt(!1),this.INTERVAL=2e3,this.updateTime=()=>{this.data=Rt(this.planned,this.estimated)}}connectedCallback(){super.connectedCallback(),this.intervalTimer=setInterval(this.updateTime,this.INTERVAL),this.updateTime()}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.intervalTimer),this.intervalTimer=void 0}getTimeHtml(){let t;let e=!1;switch(this.data.mode){case jt.NOW:t=F`<ha-icon icon=${"mdi:bus-side"}></ha-icon>`,e=this.showAnimation&&!0;break;case jt.DIFF:let i=Number(this.data.time);i>=0&&i<=5&&(e=this.showAnimation&&!0);case jt.TIMESTAMP:case jt.NONE:case jt.PAST:t=F`${this.data.time}`}return F`
            <div class="text ${bt({pulsating:e})}">${t}</div>
        `}getDelayHtml(){let t;this.data.realTime&&this.data.mode==jt.DIFF&&(t=this.data.delay>=0?`+${this.data.delay}`:`${this.data.delay}`);const e={green:this.data.delay<=0,red:this.data.delay>0};return F`<div class="delay ${bt(e)}">${t}</div>`}render(){return F`
            <div class="container">
                ${this.getTimeHtml()}
                <div class="postfix">${this.data.postfix}</div>
                ${this.getDelayHtml()}
            </div>
            `}};zt.styles=[o`
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
    `],t([ct({attribute:!1})],zt.prototype,"planned",void 0),t([ct({attribute:!1})],zt.prototype,"estimated",void 0),t([ct({attribute:!1})],zt.prototype,"showAnimation",void 0),t([dt()],zt.prototype,"data",void 0),zt=t([at("departure-text")],zt);let Ft=class extends rt{constructor(){super(...arguments),this.showIcon=!1,this.lineColor="",this.timesToShow=1,this.showAnimation=!0,this.times=[]}updateTimes(){this.times=[],this.times.push([this.state?.attributes[vt.PLANNED_TIME],this.state?.attributes[vt.ESTIMATED_TIME]]),this.times.push([this.state?.attributes[vt.PLANNED_TIME_1],this.state?.attributes[vt.ESTIMATED_TIME_1]]),this.times.push([this.state?.attributes[vt.PLANNED_TIME_2],this.state?.attributes[vt.ESTIMATED_TIME_2]]),this.times.push([this.state?.attributes[vt.PLANNED_TIME_3],this.state?.attributes[vt.ESTIMATED_TIME_3]]),this.times.push([this.state?.attributes[vt.PLANNED_TIME_4],this.state?.attributes[vt.ESTIMATED_TIME_4]])}render(){return this.updateTimes(),F`
            <destination-container>
                ${this.renderIcon()}
                ${this.renderLine()}
                ${this.renderDestination()}
            </destination-container>
            <times-container>
                ${this.renderDepartureTimes()}
            </times-container>
        `}renderIcon(){if(!this.showIcon)return B;let t=this.state.attributes[vt.ICON]??"mdi:train-bus";return F`
            <div class="cell-icon">
                <ha-icon icon=${t}></ha-icon>
            </div>
        `}renderLine(){const t=this.config?.line_name??this.state.attributes[vt.LINE_NAME],e={background:this.config?.line_color||""};return F`
            <div class="cell-line">
                <div class="line-number" style=${At(e)}>${t}</div>
            </div>
        `}renderDestination(){let t=this.config?.destination_name??this.state.attributes[vt.DIRECTION];return F`
            <div class="cell-destination">${t}</div>
        `}renderDepartureTimes(){let t=this.times.slice(0,this.timesToShow);return F`
            ${t.map((t=>F`
                <departure-text .planned=${t[0]} .estimated=${t[1]} .showAnimation=${this.showAnimation}></departure-text>`))}
        `}};Ft.styles=[pt,o`
        :host {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items:baseline;
        }
        destination-container{
            flex: 2; 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
        }
        times-container{
            flex: 1; 
            display: flex; 
            justify-content: flex-end; 
            align-items: center;
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
    `],t([ct({attribute:!1})],Ft.prototype,"config",void 0),t([ct({attribute:!1})],Ft.prototype,"state",void 0),t([ct({attribute:!1})],Ft.prototype,"showIcon",void 0),t([ct({attribute:!1})],Ft.prototype,"lineColor",void 0),t([ct({attribute:!1})],Ft.prototype,"timesToShow",void 0),t([ct({attribute:!1})],Ft.prototype,"showAnimation",void 0),t([dt()],Ft.prototype,"times",void 0),Ft=t([at("departures-row")],Ft),window.customCards=window.customCards||[],window.customCards.push({type:"departures-card",name:"Departures Card",description:"Display departure times for different public transports"});console.groupCollapsed("%cDepartures-Card 2.0.0","color:black; font-weight: bold; background: tomato; padding: 2px; border-radius: 5px;"),console.log("Github repository: https://github.com/alex-jung/ha-departures-card"),console.groupEnd();let Wt=class extends rt{constructor(){super(...arguments),this._open=!1}static getStubConfig(){return{}}async getCardSize(){return this.config&&this.config.entities?this.config.entities.length+1:1}setConfig(t){if(!t)throw new Error("Invalid configuration");if(this.config=t,!this.config.entities||this.config.entities.length<=0)throw new Error("Please define at least one entity in the configuration.")}render(){const t=this.config.title||ut("departures",this.hass.locale?.language),e=this.config.icon||"mdi:bus";return F`
      <ha-card>
        <div class="card-content">
          <div class="card-header">
            ${t}
            <ha-icon icon="${e}"></ha-icon>
          </div> 
          <departures-table 
            @click="${()=>this._open=!0}" 
            .config=${this.config}
            .hass=${this.hass}>
          </departures-table>
        </div>
      </ha-card>
      <ha-dialog hideactions ?open="${this._open}" @closed="${()=>this._open=!1}">
        <div class="card-header">
          <ha-icon-button @click="${()=>this._open=!1}" aria-label="Close" title="Close">
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
    `}};Wt.styles=pt,t([ct({attribute:!1})],Wt.prototype,"hass",void 0),t([dt()],Wt.prototype,"config",void 0),t([dt()],Wt.prototype,"_open",void 0),Wt=t([at("departures-card")],Wt);export{Wt as DeparturesCard};
//# sourceMappingURL=ha-departures-card.js.map
