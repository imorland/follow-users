module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./admin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./admin.js":
/*!******************!*\
  !*** ./admin.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fof-follow-tags */ "@fof-follow-tags");
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common_helpers_followingPageOptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/helpers/followingPageOptions */ "./src/common/helpers/followingPageOptions.js");



flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.initializers.add('ianm-follow-users', function () {
  flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.extensionData["for"]('ianm-follow-users').registerPermission({
    icon: 'fas fa-user-friends',
    label: flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.translator.trans('ianm-follow-users.admin.permissions.be_followed_label'),
    permission: 'user.beFollowed'
  }, 'reply', 95);

  if (flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.initializers.has('fof/follow-tags')) {
    // Replace the original function with our customized version
    _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__["utils"].followingPageOptions = _common_helpers_followingPageOptions__WEBPACK_IMPORTED_MODULE_2__["default"]; // Execute the customized helper to cache the returned list of options

    _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__["utils"].followingPageOptions('admin.settings');
  }
});

/***/ }),

/***/ "./src/common/helpers/followingPageOptions.js":
/*!****************************************************!*\
  !*** ./src/common/helpers/followingPageOptions.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @fof-follow-tags */ "@fof-follow-tags");
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_fof_follow_tags__WEBPACK_IMPORTED_MODULE_0__);
 // We need to add options to the list of options available on the following page
// As `follow_tags.utils.followingPageOptions` is a function, we cannot really
// extend or override it with the flarum helpers.
// As the reuslt of this function is cached after its first execution,
// we can use the below version and execute this one to cache the desired options.
// Save the reference to the original function, as it will be overriden

var original = _fof_follow_tags__WEBPACK_IMPORTED_MODULE_0__["utils"].followingPageOptions; // Customized version of the helper with addition options for followed users

/* harmony default export */ __webpack_exports__["default"] = (function (section) {
  // Get the original options
  var options = original(section);
  options.users = app.translator.trans('ianm-follow-users.lib.following_link'); // Return the mutated options list

  return options;
});

/***/ }),

/***/ "@fof-follow-tags":
/*!*******************************************************!*\
  !*** external "flarum.extensions['fof-follow-tags']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.extensions['fof-follow-tags'];

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['app'];

/***/ })

/******/ });
//# sourceMappingURL=admin.js.map