/*
 Copyright (c) 2015, Ben Schulz
 License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
*/
function q(c,l){return function(k){return k}(function(k,c,f){function r(d){this.b=d}var m=[[37,40],[9,9],[13,13],[27,27],[16,16],[112,112],[114,123],[113,113]],l=m.length-1,t={dispose:function(){}};f.defineExtension("ko-grid-editing",{A:["ko-grid-cell-navigation"],b:function(d,c,n){function k(){h=!0;a.style.top="0";a.style.left="0";a.style.right="0";a.style.bottom="0";a.style.width=""}var f=d.createEditor||c.createEditor||function(){return null},w=d.saveChange||c.saveChange||function(){return window.console.warn("No `saveChange` strategy provided.")},
u=null,v=null,a=null,e=null,h=!1,p=t;n.data.onCellDoubleClick(function(){e&&(k(),e.h())});n.extensions["ko-grid-cell-navigation"].onCellFocused(function(b,d,c){p.dispose();p=t;if(b=f(b,d))return a=window.document.createElement("div"),a.style.position="absolute",a.style.top="0",a.style.left="-8px",a.style.right="",a.style.bottom="0",a.style.width="7px",a.style.overflow="hidden",e=new r(b),b=e.element,a.appendChild(b),b.classList.add("ko-grid-editor"),b.style.boxSizing="border-box",b.style.width="100%",
b.style.height="100%",h=!1,p=n.onKeyDown(".ko-grid-editor",function(b){var c=b.keyCode,g;a:{g=h?4:0;for(var d=h?m.length:l;g<d;++g){var f=m[g];if(f[0]<=c&&f[1]>=c){g=!0;break a}}g=!1}if(!g){if(27===b.keyCode)b.preventDefault(),e.o(),h=!1,a.style.top="0",a.style.left="-8px",a.style.right="",a.style.bottom="0",a.style.width="7px",e.h();else{if(!b.ctrlKey&&13===c||9===c){e.t&&w(u,v,e.k);return}h||b.ctrlKey||b.altKey||k()}b.preventApplicationButAllowBrowserDefault()}}),{init:function(b,d,g){var f=arguments;
u=d;v=g;c.init.apply(this,f);b.appendChild(a);h?e.n():e.h()},update:c.update}})}});r.prototype={get element(){return this.b.element},get k(){return this.b.value},set k(c){this.b.value=c},get t(){return this.b.valueChanged},h:function(){this.b.activate()},n:function(){this.b.focus()},o:function(){this.b.reset()}};return f.declareExtensionAlias(["editing"],"ko-grid-editing")}({},l,c))}
"function"===typeof define&&define.amd?define(["ko-grid","knockout","ko-grid-cell-navigation","ko-data-source","ko-indexed-repeat"],q):window["ko-grid-editing"]=q(window.ko.bindingHandlers.grid,window.ko);