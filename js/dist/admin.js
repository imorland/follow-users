(()=>{var o={n:e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return o.d(r,{a:r}),r},d:(e,r)=>{for(var l in r)o.o(r,l)&&!o.o(e,l)&&Object.defineProperty(e,l,{enumerable:!0,get:r[l]})},o:(o,e)=>Object.prototype.hasOwnProperty.call(o,e),r:o=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(o,"__esModule",{value:!0})}},e={};(()=>{"use strict";o.r(e);const r=flarum.core.compat["admin/app"];var l=o.n(r);const n=flarum.extensions["fof-follow-tags"],s=flarum.core.compat["common/app"];var t=o.n(s),a=n.utils.followingPageOptions;const i=function(o){var e=a(o);return e.users=t().translator.trans("ianm-follow-users.lib.following_link"),e};l().initializers.add("ianm-follow-users",(function(){l().extensionData.for("ianm-follow-users").registerPermission({icon:"fas fa-user-friends",label:l().translator.trans("ianm-follow-users.admin.permissions.be_followed_label"),permission:"user.beFollowed"},"reply",95),l().initializers.has("fof/follow-tags")&&(n.utils.followingPageOptions=i,n.utils.followingPageOptions("admin.settings"))}))})(),module.exports=e})();
//# sourceMappingURL=admin.js.map