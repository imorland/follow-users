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
/******/ 	return __webpack_require__(__webpack_require__.s = "./forum.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./forum.js":
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _inheritsLoose; });
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

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

/***/ "./src/forum/addFollowBadge.js":
/*!*************************************!*\
  !*** ./src/forum/addFollowBadge.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addSubscriptionBadge; });
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/models/Discussion */ "flarum/models/Discussion");
/* harmony import */ var flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_models_User__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/models/User */ "flarum/models/User");
/* harmony import */ var flarum_models_User__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_models_User__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_Badge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/Badge */ "flarum/components/Badge");
/* harmony import */ var flarum_components_Badge__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Badge__WEBPACK_IMPORTED_MODULE_3__);




function addSubscriptionBadge() {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'badges', function (badges) {
    var badge;

    if (this.user() && this.user().followed()) {
      badge = flarum_components_Badge__WEBPACK_IMPORTED_MODULE_3___default.a.component({
        label: app.translator.trans('ianm-follow-users.forum.badge.label'),
        icon: 'fas fa-user-friends',
        type: 'friend'
      });
    }

    if (badge) {
      badges.add('user-following', badge);
    }
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_models_User__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'badges', function (badges) {
    var badge;

    if (this.followed()) {
      badge = flarum_components_Badge__WEBPACK_IMPORTED_MODULE_3___default.a.component({
        label: app.translator.trans('ianm-follow-users.forum.badge.label'),
        icon: 'fas fa-user-friends',
        type: 'friend'
      });
    }

    if (badge) {
      badges.add('user-following', badge);
    }
  });
}

/***/ }),

/***/ "./src/forum/addFollowControls.js":
/*!****************************************!*\
  !*** ./src/forum/addFollowControls.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_utils_UserControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/utils/UserControls */ "flarum/utils/UserControls");
/* harmony import */ var flarum_utils_UserControls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_UserControls__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__);



/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_utils_UserControls__WEBPACK_IMPORTED_MODULE_1___default.a, 'userControls', function (items, user) {
    if (app.session.user === user || !app.session.user) {
      return;
    }

    function unfollow() {
      if (confirm(app.translator.trans("ianm-follow-users.forum.user_controls.unfollow_confirmation"))) {
        this.save({
          followed: false
        });
      }
    }

    function follow() {
      if (confirm(app.translator.trans("ianm-follow-users.forum.user_controls.follow_confirmation"))) {
        this.save({
          followed: true
        });
      }
    }

    if (user.followed()) {
      items.add('unfollow', flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
        icon: 'fas fa-user-slash',
        onclick: unfollow.bind(user)
      }, app.translator.trans('ianm-follow-users.forum.user_controls.unfollow_button')));
    } else if (user.canBeFollowed()) {
      items.add('follow', flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
        icon: 'fas fa-user-friends',
        onclick: follow.bind(user)
      }, app.translator.trans('ianm-follow-users.forum.user_controls.follow_button')));
    }
  });
});

/***/ }),

/***/ "./src/forum/addFollowingUsers.js":
/*!****************************************!*\
  !*** ./src/forum/addFollowingUsers.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fof-follow-tags */ "@fof-follow-tags");
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/states/DiscussionListState */ "flarum/states/DiscussionListState");
/* harmony import */ var flarum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_helpers_followingPageOptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/helpers/followingPageOptions */ "./src/common/helpers/followingPageOptions.js");




/* harmony default export */ __webpack_exports__["default"] = (function () {
  if (app.initializers.has('fof/follow-tags')) {
    // Replace the original function with our customized version
    _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__["utils"].followingPageOptions = _common_helpers_followingPageOptions__WEBPACK_IMPORTED_MODULE_3__["default"]; // Execute the customized helper to cache the returned list of options

    _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__["utils"].followingPageOptions('forum.index.following');
    Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'requestParams', function (params) {
      if (!_fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__["utils"].isFollowingPage() || !app.session.user) return;
      var q = params.filter.q || '';

      if (!this.followTags) {
        this.followTags = _fof_follow_tags__WEBPACK_IMPORTED_MODULE_1__["utils"].getDefaultFollowingFiltering();
      }

      var followTags = this.followTags;

      if (app.current.get('routeName') === 'following' && followTags) {
        if (followTags === 'users') {
          q += ' is:following-users';
          q = q.replace(' is:following', '');
        }

        params.filter.q = q;
      }
    });
  }
});

/***/ }),

/***/ "./src/forum/addPrivacySetting.js":
/*!****************************************!*\
  !*** ./src/forum/addPrivacySetting.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/SettingsPage */ "flarum/components/SettingsPage");
/* harmony import */ var flarum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Switch */ "flarum/components/Switch");
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Switch__WEBPACK_IMPORTED_MODULE_2__);



/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'privacyItems', function (items) {
    var _this = this;

    items.add('follow-users-block', flarum_components_Switch__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      state: this.user.preferences().blocksFollow,
      onchange: function onchange(value) {
        _this.blocksFollowLoading = true;

        _this.user.savePreferences({
          blocksFollow: value
        }).then(function () {
          _this.blocksFollowLoading = false;
          m.redraw();
        });
      },
      loading: this.blocksFollowLoading
    }, app.translator.trans('ianm-follow-users.forum.settings.block_follow')));
  });
});

/***/ }),

/***/ "./src/forum/addProfilePage.js":
/*!*************************************!*\
  !*** ./src/forum/addProfilePage.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_LinkButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/LinkButton */ "flarum/components/LinkButton");
/* harmony import */ var flarum_components_LinkButton__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LinkButton__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_UserPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/UserPage */ "flarum/components/UserPage");
/* harmony import */ var flarum_components_UserPage__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_UserPage__WEBPACK_IMPORTED_MODULE_3__);




/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_UserPage__WEBPACK_IMPORTED_MODULE_3___default.a.prototype, 'navItems', function (items) {
    if (flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user && flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user === this.user) items.add('followed-users', flarum_components_LinkButton__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      href: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.route('followedUsers'),
      icon: 'fas fa-user-friends'
    }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('ianm-follow-users.forum.profile_link')));
  });
});

/***/ }),

/***/ "./src/forum/components/NewDiscussionNotification.js":
/*!***********************************************************!*\
  !*** ./src/forum/components/NewDiscussionNotification.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NewDiscussionNotification; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Notification */ "flarum/components/Notification");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__);



var NewDiscussionNotification =
/*#__PURE__*/
function (_Notification) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(NewDiscussionNotification, _Notification);

  function NewDiscussionNotification() {
    return _Notification.apply(this, arguments) || this;
  }

  var _proto = NewDiscussionNotification.prototype;

  _proto.icon = function icon() {
    return 'fas fa-user-friends';
  };

  _proto.href = function href() {
    var notification = this.attrs.notification;
    var discussion = notification.subject();
    return app.route.discussion(discussion);
  };

  _proto.content = function content() {
    return app.translator.trans('ianm-follow-users.forum.notifications.new_discussion_text', {
      user: this.attrs.notification.fromUser(),
      title: this.attrs.notification.subject().title()
    });
  };

  return NewDiscussionNotification;
}(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/components/NewFollowerNotification.js":
/*!*********************************************************!*\
  !*** ./src/forum/components/NewFollowerNotification.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NewFollowerNotification; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Notification */ "flarum/components/Notification");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__);



var NewFollowerNotification =
/*#__PURE__*/
function (_Notification) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(NewFollowerNotification, _Notification);

  function NewFollowerNotification() {
    return _Notification.apply(this, arguments) || this;
  }

  var _proto = NewFollowerNotification.prototype;

  _proto.icon = function icon() {
    return 'fas fa-user-plus';
  };

  _proto.href = function href() {
    var notification = this.attrs.notification;
    var user = notification.subject();
    return app.route.user(user);
  };

  _proto.content = function content() {
    return app.translator.trans('ianm-follow-users.forum.notifications.new_follower_text', {
      user: this.attrs.notification.fromUser()
    });
  };

  return NewFollowerNotification;
}(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/components/NewPostNotification.js":
/*!*****************************************************!*\
  !*** ./src/forum/components/NewPostNotification.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NewPostNotification; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Notification */ "flarum/components/Notification");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__);



var NewPostNotification =
/*#__PURE__*/
function (_Notification) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(NewPostNotification, _Notification);

  function NewPostNotification() {
    return _Notification.apply(this, arguments) || this;
  }

  var _proto = NewPostNotification.prototype;

  _proto.icon = function icon() {
    return 'fas fa-user-friends';
  };

  _proto.href = function href() {
    var notification = this.attrs.notification;
    var discussion = notification.subject();
    var content = notification.content() || {};
    return app.route.discussion(discussion, content.postNumber);
  };

  _proto.content = function content() {
    return app.translator.trans('ianm-follow-users.forum.notifications.new_post_text', {
      user: this.attrs.notification.fromUser()
    });
  };

  return NewPostNotification;
}(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/components/NewUnfollowerNotification.js":
/*!***********************************************************!*\
  !*** ./src/forum/components/NewUnfollowerNotification.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NewUnfollowerNotification; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Notification */ "flarum/components/Notification");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__);



var NewUnfollowerNotification =
/*#__PURE__*/
function (_Notification) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(NewUnfollowerNotification, _Notification);

  function NewUnfollowerNotification() {
    return _Notification.apply(this, arguments) || this;
  }

  var _proto = NewUnfollowerNotification.prototype;

  _proto.icon = function icon() {
    return 'fas fa-user-minus';
  };

  _proto.href = function href() {
    var notification = this.attrs.notification;
    var user = notification.subject();
    return app.route.user(user);
  };

  _proto.content = function content() {
    return app.translator.trans('ianm-follow-users.forum.notifications.new_unfollower_text', {
      user: this.attrs.notification.fromUser()
    });
  };

  return NewUnfollowerNotification;
}(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/components/ProfilePage.js":
/*!*********************************************!*\
  !*** ./src/forum/components/ProfilePage.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ProfilePage; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/helpers/avatar */ "flarum/helpers/avatar");
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/helpers/username */ "flarum/helpers/username");
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_UserPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/UserPage */ "flarum/components/UserPage");
/* harmony import */ var flarum_components_UserPage__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_UserPage__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/utils/Stream */ "flarum/utils/Stream");
/* harmony import */ var flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_5__);







var ProfilePage =
/*#__PURE__*/
function (_UserPage) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ProfilePage, _UserPage);

  function ProfilePage() {
    return _UserPage.apply(this, arguments) || this;
  }

  var _proto = ProfilePage.prototype;

  _proto.oninit = function oninit(vnode) {
    _UserPage.prototype.oninit.call(this, vnode);

    this.loading = true;
    this.followedUsers = app.session.user.followedUsers();
    this.loadUser(app.session.user.username());
  };

  _proto.content = function content() {
    var _this = this;

    return m("table", {
      className: "NotificationGrid"
    }, this.followedUsers.map(function (user, i) {
      var unfollow = function unfollow() {
        if (confirm(app.translator.trans("ianm-follow-users.forum.user_controls.unfollow_confirmation"))) {
          user.save({
            followed: false
          });

          _this.followedUsers.splice(i, 1);

          app.session.user.followedUsers = flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_5___default()(_this.followedUsers);
        }
      };

      return m("tr", null, m("td", null, m("a", {
        href: app.route.user(user),
        config: m.route
      }, m("h3", null, flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1___default()(user, {
        className: 'followPage-avatar'
      }), " ", flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default()(user)))), m("td", {
        className: "followPage-button"
      }, flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
        icon: 'fas fa-comment-slash',
        type: 'button',
        className: 'Button Button--warning',
        onclick: unfollow.bind(user)
      }, app.translator.trans('ianm-follow-users.forum.user_controls.unfollow_button'))));
    }));
  };

  _proto.show = function show(user) {
    this.user = app.session.user;
    m.redraw();
  };

  return ProfilePage;
}(flarum_components_UserPage__WEBPACK_IMPORTED_MODULE_4___default.a);



/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_NotificationGrid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/NotificationGrid */ "flarum/components/NotificationGrid");
/* harmony import */ var flarum_components_NotificationGrid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_NotificationGrid__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_models_User__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/models/User */ "flarum/models/User");
/* harmony import */ var flarum_models_User__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_models_User__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _addFollowControls__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./addFollowControls */ "./src/forum/addFollowControls.js");
/* harmony import */ var _addProfilePage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./addProfilePage */ "./src/forum/addProfilePage.js");
/* harmony import */ var _components_ProfilePage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/ProfilePage */ "./src/forum/components/ProfilePage.js");
/* harmony import */ var _components_NewDiscussionNotification__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/NewDiscussionNotification */ "./src/forum/components/NewDiscussionNotification.js");
/* harmony import */ var _components_NewPostNotification__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/NewPostNotification */ "./src/forum/components/NewPostNotification.js");
/* harmony import */ var _components_NewFollowerNotification__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/NewFollowerNotification */ "./src/forum/components/NewFollowerNotification.js");
/* harmony import */ var _components_NewUnfollowerNotification__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/NewUnfollowerNotification */ "./src/forum/components/NewUnfollowerNotification.js");
/* harmony import */ var _addFollowBadge__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./addFollowBadge */ "./src/forum/addFollowBadge.js");
/* harmony import */ var _addPrivacySetting__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./addPrivacySetting */ "./src/forum/addPrivacySetting.js");
/* harmony import */ var _addFollowingUsers__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./addFollowingUsers */ "./src/forum/addFollowingUsers.js");














app.initializers.add('ianm-follow-users', function () {
  flarum_models_User__WEBPACK_IMPORTED_MODULE_3___default.a.prototype.followed = flarum_Model__WEBPACK_IMPORTED_MODULE_2___default.a.attribute('followed');
  flarum_models_User__WEBPACK_IMPORTED_MODULE_3___default.a.prototype.followedUsers = flarum_Model__WEBPACK_IMPORTED_MODULE_2___default.a.hasMany('followedUsers');
  flarum_models_User__WEBPACK_IMPORTED_MODULE_3___default.a.prototype.blocksFollow = flarum_Model__WEBPACK_IMPORTED_MODULE_2___default.a.attribute('blocksFollow');
  flarum_models_User__WEBPACK_IMPORTED_MODULE_3___default.a.prototype.canBeFollowed = flarum_Model__WEBPACK_IMPORTED_MODULE_2___default.a.attribute('canBeFollowed');
  app.routes.followedUsers = {
    path: '/followedUsers',
    component: _components_ProfilePage__WEBPACK_IMPORTED_MODULE_6__["default"]
  };
  Object(_addFollowControls__WEBPACK_IMPORTED_MODULE_4__["default"])();
  Object(_addProfilePage__WEBPACK_IMPORTED_MODULE_5__["default"])();
  Object(_addFollowBadge__WEBPACK_IMPORTED_MODULE_11__["default"])();
  Object(_addPrivacySetting__WEBPACK_IMPORTED_MODULE_12__["default"])();
  Object(_addFollowingUsers__WEBPACK_IMPORTED_MODULE_13__["default"])();
  app.notificationComponents.newFollower = _components_NewFollowerNotification__WEBPACK_IMPORTED_MODULE_9__["default"];
  app.notificationComponents.newUnfollower = _components_NewUnfollowerNotification__WEBPACK_IMPORTED_MODULE_10__["default"];
  app.notificationComponents.newDiscussionByUser = _components_NewDiscussionNotification__WEBPACK_IMPORTED_MODULE_7__["default"];
  app.notificationComponents.newPostByUser = _components_NewPostNotification__WEBPACK_IMPORTED_MODULE_8__["default"];
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_NotificationGrid__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'notificationTypes', function (items) {
    items.add('newFollower', {
      name: 'newFollower',
      icon: 'fas fa-user-plus',
      label: app.translator.trans('ianm-follow-users.forum.settings.notify_new_follower_label')
    });
    items.add('newUnfollower', {
      name: 'newUnfollower',
      icon: 'fas fa-user-minus',
      label: app.translator.trans('ianm-follow-users.forum.settings.notify_new_unfollower_label')
    });
    items.add('newDiscussionByUser', {
      name: 'newDiscussionByUser',
      icon: 'fas fa-user-friends',
      label: app.translator.trans('ianm-follow-users.forum.settings.notify_new_discussion_label')
    });
    items.add('newPostByUser', {
      name: 'newPostByUser',
      icon: 'fas fa-user-friends',
      label: app.translator.trans('ianm-follow-users.forum.settings.notify_new_post_label')
    });
  });
}, -1);

/***/ }),

/***/ "@fof-follow-tags":
/*!*******************************************************!*\
  !*** external "flarum.extensions['fof-follow-tags']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.extensions['fof-follow-tags'];

/***/ }),

/***/ "flarum/Model":
/*!**********************************************!*\
  !*** external "flarum.core.compat['Model']" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Model'];

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/components/Badge":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['components/Badge']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Badge'];

/***/ }),

/***/ "flarum/components/Button":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Button']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Button'];

/***/ }),

/***/ "flarum/components/LinkButton":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['components/LinkButton']" ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/LinkButton'];

/***/ }),

/***/ "flarum/components/Notification":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['components/Notification']" ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Notification'];

/***/ }),

/***/ "flarum/components/NotificationGrid":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['components/NotificationGrid']" ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/NotificationGrid'];

/***/ }),

/***/ "flarum/components/SettingsPage":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['components/SettingsPage']" ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/SettingsPage'];

/***/ }),

/***/ "flarum/components/Switch":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Switch']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Switch'];

/***/ }),

/***/ "flarum/components/UserPage":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/UserPage']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/UserPage'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/helpers/avatar":
/*!*******************************************************!*\
  !*** external "flarum.core.compat['helpers/avatar']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/avatar'];

/***/ }),

/***/ "flarum/helpers/username":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['helpers/username']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/username'];

/***/ }),

/***/ "flarum/models/Discussion":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['models/Discussion']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['models/Discussion'];

/***/ }),

/***/ "flarum/models/User":
/*!****************************************************!*\
  !*** external "flarum.core.compat['models/User']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['models/User'];

/***/ }),

/***/ "flarum/states/DiscussionListState":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['states/DiscussionListState']" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['states/DiscussionListState'];

/***/ }),

/***/ "flarum/utils/Stream":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['utils/Stream']" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/Stream'];

/***/ }),

/***/ "flarum/utils/UserControls":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['utils/UserControls']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/UserControls'];

/***/ })

/******/ });
//# sourceMappingURL=forum.js.map