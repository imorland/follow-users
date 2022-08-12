/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fof-follow-tags */ "@fof-follow-tags");
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common_helpers_followingPageOptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/helpers/followingPageOptions */ "./src/common/helpers/followingPageOptions.js");



flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('ianm-follow-users', function () {
  flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().extensionData["for"]('ianm-follow-users').registerPermission({
    icon: 'fas fa-user-friends',
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.admin.permissions.be_followed_label'),
    permission: 'user.beFollowed'
  }, 'reply', 95).registerSetting({
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.admin.settings.button-on-profile-label'),
    type: 'bool',
    setting: 'ianm-follow-users.button-on-profile'
  }).registerSetting({
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.admin.settings.stats-on-profile-label'),
    type: 'bool',
    setting: 'ianm-follow-users.stats-on-profile'
  });

  if (flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.has('fof/follow-tags')) {
    // Replace the original function with our customized version
    _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__.utils.followingPageOptions = _common_helpers_followingPageOptions__WEBPACK_IMPORTED_MODULE_2__["default"]; // Execute the customized helper to cache the returned list of options

    _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__.utils.followingPageOptions('admin.settings');
  }
});

/***/ }),

/***/ "./src/common/helpers/followingPageOptions.js":
/*!****************************************************!*\
  !*** ./src/common/helpers/followingPageOptions.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fof-follow-tags */ "@fof-follow-tags");
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__);

 // We need to add options to the list of options available on the following page
// As `follow_tags.utils.followingPageOptions` is a function, we cannot really
// extend or override it with the Flarum helpers.
// As the result of this function is cached after its first execution,
// we can use the below version and execute this one to cache the desired options.
// Save the reference to the original function, as it will be overriden

var original = _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__.utils.followingPageOptions; // Customized version of the helper with addition options for followed users

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function (section) {
  // Get the original options
  var options = original(section);
  options.users = flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.lib.following_link'); // Return the mutated options list

  return options;
});

/***/ }),

/***/ "@fof-follow-tags":
/*!*******************************************************!*\
  !*** external "flarum.extensions['fof-follow-tags']" ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.extensions['fof-follow-tags'];

/***/ }),

/***/ "flarum/admin/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['admin/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/app'];

/***/ }),

/***/ "flarum/common/app":
/*!***************************************************!*\
  !*** external "flarum.core.compat['common/app']" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/app'];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./admin.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=admin.js.map