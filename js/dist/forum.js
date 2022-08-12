/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");

/***/ }),

/***/ "./node_modules/css-what/lib/index.js":
/*!********************************************!*\
  !*** ./node_modules/css-what/lib/index.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) {
    if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.stringify = exports.parse = void 0;

__exportStar(__webpack_require__(/*! ./parse */ "./node_modules/css-what/lib/parse.js"), exports);

var parse_1 = __webpack_require__(/*! ./parse */ "./node_modules/css-what/lib/parse.js");

Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function get() {
    return __importDefault(parse_1)["default"];
  }
}));

var stringify_1 = __webpack_require__(/*! ./stringify */ "./node_modules/css-what/lib/stringify.js");

Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function get() {
    return __importDefault(stringify_1)["default"];
  }
}));

/***/ }),

/***/ "./node_modules/css-what/lib/parse.js":
/*!********************************************!*\
  !*** ./node_modules/css-what/lib/parse.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


var __spreadArray = this && this.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isTraversal = void 0;
var reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
var actionTypes = new Map([["~", "element"], ["^", "start"], ["$", "end"], ["*", "any"], ["!", "not"], ["|", "hyphen"]]);
var Traversals = {
  ">": "child",
  "<": "parent",
  "~": "sibling",
  "+": "adjacent"
};
var attribSelectors = {
  "#": ["id", "equals"],
  ".": ["class", "element"]
}; // Pseudos, whose data property is parsed as well.

var unpackPseudos = new Set(["has", "not", "matches", "is", "where", "host", "host-context"]);
var traversalNames = new Set(__spreadArray(["descendant"], Object.keys(Traversals).map(function (k) {
  return Traversals[k];
}), true));
/**
 * Attributes that are case-insensitive in HTML.
 *
 * @private
 * @see https://html.spec.whatwg.org/multipage/semantics-other.html#case-sensitivity-of-selectors
 */

var caseInsensitiveAttributes = new Set(["accept", "accept-charset", "align", "alink", "axis", "bgcolor", "charset", "checked", "clear", "codetype", "color", "compact", "declare", "defer", "dir", "direction", "disabled", "enctype", "face", "frame", "hreflang", "http-equiv", "lang", "language", "link", "media", "method", "multiple", "nohref", "noresize", "noshade", "nowrap", "readonly", "rel", "rev", "rules", "scope", "scrolling", "selected", "shape", "target", "text", "type", "valign", "valuetype", "vlink"]);
/**
 * Checks whether a specific selector is a traversal.
 * This is useful eg. in swapping the order of elements that
 * are not traversals.
 *
 * @param selector Selector to check.
 */

function isTraversal(selector) {
  return traversalNames.has(selector.type);
}

exports.isTraversal = isTraversal;
var stripQuotesFromPseudos = new Set(["contains", "icontains"]);
var quotes = new Set(['"', "'"]); // Unescape function taken from https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L152

function funescape(_, escaped, escapedWhitespace) {
  var high = parseInt(escaped, 16) - 0x10000; // NaN means non-codepoint

  return high !== high || escapedWhitespace ? escaped : high < 0 ? // BMP codepoint
  String.fromCharCode(high + 0x10000) : // Supplemental Plane codepoint (surrogate pair)
  String.fromCharCode(high >> 10 | 0xd800, high & 0x3ff | 0xdc00);
}

function unescapeCSS(str) {
  return str.replace(reEscape, funescape);
}

function isWhitespace(c) {
  return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
}
/**
 * Parses `selector`, optionally with the passed `options`.
 *
 * @param selector Selector to parse.
 * @param options Options for parsing.
 * @returns Returns a two-dimensional array.
 * The first dimension represents selectors separated by commas (eg. `sub1, sub2`),
 * the second contains the relevant tokens for that selector.
 */


function parse(selector, options) {
  var subselects = [];
  var endIndex = parseSelector(subselects, "" + selector, options, 0);

  if (endIndex < selector.length) {
    throw new Error("Unmatched selector: " + selector.slice(endIndex));
  }

  return subselects;
}

exports["default"] = parse;

function parseSelector(subselects, selector, options, selectorIndex) {
  var _a, _b;

  if (options === void 0) {
    options = {};
  }

  var tokens = [];
  var sawWS = false;

  function getName(offset) {
    var match = selector.slice(selectorIndex + offset).match(reName);

    if (!match) {
      throw new Error("Expected name, found " + selector.slice(selectorIndex));
    }

    var name = match[0];
    selectorIndex += offset + name.length;
    return unescapeCSS(name);
  }

  function stripWhitespace(offset) {
    while (isWhitespace(selector.charAt(selectorIndex + offset))) {
      offset++;
    }

    selectorIndex += offset;
  }

  function isEscaped(pos) {
    var slashCount = 0;

    while (selector.charAt(--pos) === "\\") {
      slashCount++;
    }

    return (slashCount & 1) === 1;
  }

  function ensureNotTraversal() {
    if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
      throw new Error("Did not expect successive traversals.");
    }
  }

  stripWhitespace(0);

  while (selector !== "") {
    var firstChar = selector.charAt(selectorIndex);

    if (isWhitespace(firstChar)) {
      sawWS = true;
      stripWhitespace(1);
    } else if (firstChar in Traversals) {
      ensureNotTraversal();
      tokens.push({
        type: Traversals[firstChar]
      });
      sawWS = false;
      stripWhitespace(1);
    } else if (firstChar === ",") {
      if (tokens.length === 0) {
        throw new Error("Empty sub-selector");
      }

      subselects.push(tokens);
      tokens = [];
      sawWS = false;
      stripWhitespace(1);
    } else if (selector.startsWith("/*", selectorIndex)) {
      var endIndex = selector.indexOf("*/", selectorIndex + 2);

      if (endIndex < 0) {
        throw new Error("Comment was not terminated");
      }

      selectorIndex = endIndex + 2;
    } else {
      if (sawWS) {
        ensureNotTraversal();
        tokens.push({
          type: "descendant"
        });
        sawWS = false;
      }

      if (firstChar in attribSelectors) {
        var _c = attribSelectors[firstChar],
            name_1 = _c[0],
            action = _c[1];
        tokens.push({
          type: "attribute",
          name: name_1,
          action: action,
          value: getName(1),
          namespace: null,
          // TODO: Add quirksMode option, which makes `ignoreCase` `true` for HTML.
          ignoreCase: options.xmlMode ? null : false
        });
      } else if (firstChar === "[") {
        stripWhitespace(1); // Determine attribute name and namespace

        var namespace = null;

        if (selector.charAt(selectorIndex) === "|") {
          namespace = "";
          selectorIndex += 1;
        }

        if (selector.startsWith("*|", selectorIndex)) {
          namespace = "*";
          selectorIndex += 2;
        }

        var name_2 = getName(0);

        if (namespace === null && selector.charAt(selectorIndex) === "|" && selector.charAt(selectorIndex + 1) !== "=") {
          namespace = name_2;
          name_2 = getName(1);
        }

        if ((_a = options.lowerCaseAttributeNames) !== null && _a !== void 0 ? _a : !options.xmlMode) {
          name_2 = name_2.toLowerCase();
        }

        stripWhitespace(0); // Determine comparison operation

        var action = "exists";
        var possibleAction = actionTypes.get(selector.charAt(selectorIndex));

        if (possibleAction) {
          action = possibleAction;

          if (selector.charAt(selectorIndex + 1) !== "=") {
            throw new Error("Expected `=`");
          }

          stripWhitespace(2);
        } else if (selector.charAt(selectorIndex) === "=") {
          action = "equals";
          stripWhitespace(1);
        } // Determine value


        var value = "";
        var ignoreCase = null;

        if (action !== "exists") {
          if (quotes.has(selector.charAt(selectorIndex))) {
            var quote = selector.charAt(selectorIndex);
            var sectionEnd = selectorIndex + 1;

            while (sectionEnd < selector.length && (selector.charAt(sectionEnd) !== quote || isEscaped(sectionEnd))) {
              sectionEnd += 1;
            }

            if (selector.charAt(sectionEnd) !== quote) {
              throw new Error("Attribute value didn't end");
            }

            value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd));
            selectorIndex = sectionEnd + 1;
          } else {
            var valueStart = selectorIndex;

            while (selectorIndex < selector.length && (!isWhitespace(selector.charAt(selectorIndex)) && selector.charAt(selectorIndex) !== "]" || isEscaped(selectorIndex))) {
              selectorIndex += 1;
            }

            value = unescapeCSS(selector.slice(valueStart, selectorIndex));
          }

          stripWhitespace(0); // See if we have a force ignore flag

          var forceIgnore = selector.charAt(selectorIndex); // If the forceIgnore flag is set (either `i` or `s`), use that value

          if (forceIgnore === "s" || forceIgnore === "S") {
            ignoreCase = false;
            stripWhitespace(1);
          } else if (forceIgnore === "i" || forceIgnore === "I") {
            ignoreCase = true;
            stripWhitespace(1);
          }
        } // If `xmlMode` is set, there are no rules; otherwise, use the `caseInsensitiveAttributes` list.


        if (!options.xmlMode) {
          // TODO: Skip this for `exists`, as there is no value to compare to.
          ignoreCase !== null && ignoreCase !== void 0 ? ignoreCase : ignoreCase = caseInsensitiveAttributes.has(name_2);
        }

        if (selector.charAt(selectorIndex) !== "]") {
          throw new Error("Attribute selector didn't terminate");
        }

        selectorIndex += 1;
        var attributeSelector = {
          type: "attribute",
          name: name_2,
          action: action,
          value: value,
          namespace: namespace,
          ignoreCase: ignoreCase
        };
        tokens.push(attributeSelector);
      } else if (firstChar === ":") {
        if (selector.charAt(selectorIndex + 1) === ":") {
          tokens.push({
            type: "pseudo-element",
            name: getName(2).toLowerCase()
          });
          continue;
        }

        var name_3 = getName(1).toLowerCase();
        var data = null;

        if (selector.charAt(selectorIndex) === "(") {
          if (unpackPseudos.has(name_3)) {
            if (quotes.has(selector.charAt(selectorIndex + 1))) {
              throw new Error("Pseudo-selector " + name_3 + " cannot be quoted");
            }

            data = [];
            selectorIndex = parseSelector(data, selector, options, selectorIndex + 1);

            if (selector.charAt(selectorIndex) !== ")") {
              throw new Error("Missing closing parenthesis in :" + name_3 + " (" + selector + ")");
            }

            selectorIndex += 1;
          } else {
            selectorIndex += 1;
            var start = selectorIndex;
            var counter = 1;

            for (; counter > 0 && selectorIndex < selector.length; selectorIndex++) {
              if (selector.charAt(selectorIndex) === "(" && !isEscaped(selectorIndex)) {
                counter++;
              } else if (selector.charAt(selectorIndex) === ")" && !isEscaped(selectorIndex)) {
                counter--;
              }
            }

            if (counter) {
              throw new Error("Parenthesis not matched");
            }

            data = selector.slice(start, selectorIndex - 1);

            if (stripQuotesFromPseudos.has(name_3)) {
              var quot = data.charAt(0);

              if (quot === data.slice(-1) && quotes.has(quot)) {
                data = data.slice(1, -1);
              }

              data = unescapeCSS(data);
            }
          }
        }

        tokens.push({
          type: "pseudo",
          name: name_3,
          data: data
        });
      } else {
        var namespace = null;
        var name_4 = void 0;

        if (firstChar === "*") {
          selectorIndex += 1;
          name_4 = "*";
        } else if (reName.test(selector.slice(selectorIndex))) {
          if (selector.charAt(selectorIndex) === "|") {
            namespace = "";
            selectorIndex += 1;
          }

          name_4 = getName(0);
        } else {
          /*
           * We have finished parsing the selector.
           * Remove descendant tokens at the end if they exist,
           * and return the last index, so that parsing can be
           * picked up from here.
           */
          if (tokens.length && tokens[tokens.length - 1].type === "descendant") {
            tokens.pop();
          }

          addToken(subselects, tokens);
          return selectorIndex;
        }

        if (selector.charAt(selectorIndex) === "|") {
          namespace = name_4;

          if (selector.charAt(selectorIndex + 1) === "*") {
            name_4 = "*";
            selectorIndex += 2;
          } else {
            name_4 = getName(1);
          }
        }

        if (name_4 === "*") {
          tokens.push({
            type: "universal",
            namespace: namespace
          });
        } else {
          if ((_b = options.lowerCaseTags) !== null && _b !== void 0 ? _b : !options.xmlMode) {
            name_4 = name_4.toLowerCase();
          }

          tokens.push({
            type: "tag",
            name: name_4,
            namespace: namespace
          });
        }
      }
    }
  }

  addToken(subselects, tokens);
  return selectorIndex;
}

function addToken(subselects, tokens) {
  if (subselects.length > 0 && tokens.length === 0) {
    throw new Error("Empty sub-selector");
  }

  subselects.push(tokens);
}

/***/ }),

/***/ "./node_modules/css-what/lib/stringify.js":
/*!************************************************!*\
  !*** ./node_modules/css-what/lib/stringify.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


var __spreadArray = this && this.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var actionTypes = {
  equals: "",
  element: "~",
  start: "^",
  end: "$",
  any: "*",
  not: "!",
  hyphen: "|"
};
var charsToEscape = new Set(__spreadArray(__spreadArray([], Object.keys(actionTypes).map(function (typeKey) {
  return actionTypes[typeKey];
}).filter(Boolean), true), [":", "[", "]", " ", "\\", "(", ")", "'"], false));
/**
 * Turns `selector` back into a string.
 *
 * @param selector Selector to stringify.
 */

function stringify(selector) {
  return selector.map(stringifySubselector).join(", ");
}

exports["default"] = stringify;

function stringifySubselector(token) {
  return token.map(stringifyToken).join("");
}

function stringifyToken(token) {
  switch (token.type) {
    // Simple types
    case "child":
      return " > ";

    case "parent":
      return " < ";

    case "sibling":
      return " ~ ";

    case "adjacent":
      return " + ";

    case "descendant":
      return " ";

    case "universal":
      return getNamespace(token.namespace) + "*";

    case "tag":
      return getNamespacedName(token);

    case "pseudo-element":
      return "::" + escapeName(token.name);

    case "pseudo":
      if (token.data === null) return ":" + escapeName(token.name);

      if (typeof token.data === "string") {
        return ":" + escapeName(token.name) + "(" + escapeName(token.data) + ")";
      }

      return ":" + escapeName(token.name) + "(" + stringify(token.data) + ")";

    case "attribute":
      {
        if (token.name === "id" && token.action === "equals" && !token.ignoreCase && !token.namespace) {
          return "#" + escapeName(token.value);
        }

        if (token.name === "class" && token.action === "element" && !token.ignoreCase && !token.namespace) {
          return "." + escapeName(token.value);
        }

        var name_1 = getNamespacedName(token);

        if (token.action === "exists") {
          return "[" + name_1 + "]";
        }

        return "[" + name_1 + actionTypes[token.action] + "='" + escapeName(token.value) + "'" + (token.ignoreCase ? "i" : token.ignoreCase === false ? "s" : "") + "]";
      }
  }
}

function getNamespacedName(token) {
  return "" + getNamespace(token.namespace) + escapeName(token.name);
}

function getNamespace(namespace) {
  return namespace !== null ? (namespace === "*" ? "*" : escapeName(namespace)) + "|" : "";
}

function escapeName(str) {
  return str.split("").map(function (c) {
    return charsToEscape.has(c) ? "\\" + c : c;
  }).join("");
}

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};

  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };

  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
 true ? module.exports : 0);

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

/***/ }),

/***/ "./src/common/FollowLevels.js":
/*!************************************!*\
  !*** ./src/common/FollowLevels.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FollowLevels": () => (/* binding */ FollowLevels)
/* harmony export */ });
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_0__);


var trans = function trans(key) {
  return function (opts) {
    return flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("ianm-follow-users.lib.follow_levels." + key, opts);
  };
};

var FollowLevels = Object.freeze([{
  value: 'unfollow',
  name: trans('unfollow.name'),
  description: trans('unfollow.description')
}, {
  value: 'follow',
  name: trans('follow.name'),
  description: trans('follow.description')
}, {
  value: 'lurk',
  name: trans('lurk.name'),
  description: trans('lurk.description')
}]);

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

/***/ "./src/forum/addFollowBadge.js":
/*!*************************************!*\
  !*** ./src/forum/addFollowBadge.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addFollowBadge)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/models/Discussion */ "flarum/common/models/Discussion");
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/models/User */ "flarum/common/models/User");
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_User__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Badge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Badge */ "flarum/common/components/Badge");
/* harmony import */ var flarum_common_components_Badge__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Badge__WEBPACK_IMPORTED_MODULE_4__);





function addFollowBadge() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'badges', function (badges) {
    var _this$user;

    if ((_this$user = this.user()) != null && _this$user.followed != null && _this$user.followed()) {
      badges.add('user-following', m((flarum_common_components_Badge__WEBPACK_IMPORTED_MODULE_4___default()), {
        label: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("ianm-follow-users.forum.badge.label." + this.user().followed()),
        icon: "fas fa-user-friends",
        type: "friend"
      }));
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_models_User__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'badges', function (badges) {
    if (this.followed()) {
      badges.add('user-following', m((flarum_common_components_Badge__WEBPACK_IMPORTED_MODULE_4___default()), {
        label: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("ianm-follow-users.forum.badge.label." + this.followed()),
        icon: "fas fa-user-friends",
        type: "friend"
      }));
    }
  });
}

/***/ }),

/***/ "./src/forum/addFollowControls.js":
/*!****************************************!*\
  !*** ./src/forum/addFollowControls.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addFollowControls)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_utils_UserControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/utils/UserControls */ "flarum/forum/utils/UserControls");
/* harmony import */ var flarum_forum_utils_UserControls__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_UserControls__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_SelectFollowLevelModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/SelectFollowLevelModal */ "./src/forum/components/SelectFollowLevelModal.js");
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/models/User */ "flarum/common/models/User");
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_User__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/forum/components/UserCard */ "flarum/forum/components/UserCard");
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _util_findVdomChild__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util/findVdomChild */ "./src/forum/util/findVdomChild.ts");








function addFollowControls() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_utils_UserControls__WEBPACK_IMPORTED_MODULE_2___default()), 'userControls', function (items, user) {
    if (!(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session.user) || (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session.user) === user || !user.canBeFollowed() || flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('ianm-follow-users.button-on-profile')) {
      return;
    }
    /**
     * Opens the SelectFollowLevelModal with the provided user.
     *
     * @param {User} user
     */


    function openFollowLevelModal(user) {
      if (!(user instanceof (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_5___default()))) return;
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().modal.show(_components_SelectFollowLevelModal__WEBPACK_IMPORTED_MODULE_4__.SelectFollowUserTypeModal, {
        user: user
      });
    }

    items.add('follow', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      icon: "fas fa-user-friends",
      onclick: openFollowLevelModal.bind(this, user)
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("ianm-follow-users.forum.user_controls." + (user.followed() ? 'unfollow_button' : 'follow_button'))));
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_6___default().prototype), 'view', function (view) {
    var user = this.attrs.user;

    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('ianm-follow-users.button-on-profile') || !(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session.user) || (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session.user) === user || !user.canBeFollowed()) {
      return;
    }
    /**
     * Opens the SelectFollowLevelModal with the provided user.
     *
     * @param {User} user
     */


    function openFollowLevelModal(user) {
      if (!(user instanceof (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_5___default()))) return;
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().modal.show(_components_SelectFollowLevelModal__WEBPACK_IMPORTED_MODULE_4__.SelectFollowUserTypeModal, {
        user: user
      });
    }

    var followButton = m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button",
      icon: "fas fa-user-friends",
      onclick: openFollowLevelModal.bind(this, user)
    }, user.followed() ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("ianm-follow-users.forum.badge.label." + user.followed()) : flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.forum.user_controls.follow_button'));
    (0,_util_findVdomChild__WEBPACK_IMPORTED_MODULE_7__.findFirstVdomChild)(view, '.UserCard-profile', function (vdom) {
      vdom.children.splice(2, 0, followButton);
    });
  });
}

/***/ }),

/***/ "./src/forum/addFollowingUsers.js":
/*!****************************************!*\
  !*** ./src/forum/addFollowingUsers.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fof-follow-tags */ "@fof-follow-tags");
/* harmony import */ var _fof_follow_tags__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_fof_follow_tags__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fof_user_directory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fof-user-directory */ "@fof-user-directory");
/* harmony import */ var _fof_user_directory__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_fof_user_directory__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/states/DiscussionListState */ "flarum/forum/states/DiscussionListState");
/* harmony import */ var flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_helpers_followingPageOptions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/helpers/followingPageOptions */ "./src/common/helpers/followingPageOptions.js");
/* harmony import */ var flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Separator */ "flarum/common/components/Separator");
/* harmony import */ var flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6__);







/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.has('fof/follow-tags')) {
    // Replace the original function with our customized version
    _fof_follow_tags__WEBPACK_IMPORTED_MODULE_2__.utils.followingPageOptions = _common_helpers_followingPageOptions__WEBPACK_IMPORTED_MODULE_5__["default"]; // Execute the customized helper to cache the returned list of options

    _fof_follow_tags__WEBPACK_IMPORTED_MODULE_2__.utils.followingPageOptions('forum.index.following');
    (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_4___default().prototype), 'requestParams', function (params) {
      if (!_fof_follow_tags__WEBPACK_IMPORTED_MODULE_2__.utils.isFollowingPage() || !(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session.user)) return;

      if (!this.followTags) {
        this.followTags = _fof_follow_tags__WEBPACK_IMPORTED_MODULE_2__.utils.getDefaultFollowingFiltering();
      }

      var followTags = this.followTags;

      if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().current.get('routeName') === 'following' && followTags === 'users') {
        params.filter['following-users'] = true;
        delete params.filter.subscription;
      }
    });
  }

  if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.has('fof-user-directory')) {
    (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)(_fof_user_directory__WEBPACK_IMPORTED_MODULE_3__.UserDirectoryPage.prototype, 'groupItems', function (items) {
      var _this = this;

      items.add('follow-users', _fof_user_directory__WEBPACK_IMPORTED_MODULE_3__.CheckableButton.component({
        className: 'GroupFilterButton',
        icon: 'fas fa-user-friends',
        checked: this.enabledSpecialGroupFilters['ianm-follow-users'] === 'is:followeduser',
        onclick: function onclick() {
          var id = 'ianm-follow-users';

          if (_this.enabledSpecialGroupFilters[id] === 'is:followeduser') {
            _this.enabledSpecialGroupFilters[id] = '';
          } else {
            _this.enabledSpecialGroupFilters[id] = 'is:followeduser';
          }

          _this.changeParams(_this.params().sort);
        }
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.forum.filter.following')), 65);
      items.add('separator', m((flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6___default()), null), 50);
    });
  }
}

/***/ }),

/***/ "./src/forum/addPrivacySetting.js":
/*!****************************************!*\
  !*** ./src/forum/addPrivacySetting.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/SettingsPage */ "flarum/forum/components/SettingsPage");
/* harmony import */ var flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Switch */ "flarum/common/components/Switch");
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_3__);




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_SettingsPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'privacyItems', function (items) {
    var _this = this;

    items.add('follow-users-block', m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_3___default()), {
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
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.forum.settings.block_follow')));
  });
}

/***/ }),

/***/ "./src/forum/addProfilePage.js":
/*!*************************************!*\
  !*** ./src/forum/addProfilePage.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_3__);




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'navItems', function (items) {
    if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user) && (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user) === this.user) {
      var followedUsersCount = this.user.followingCount();
      items.add('followed-users', m((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_2___default()), {
        href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route('followedUsers'),
        icon: "fas fa-user-friends"
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('ianm-follow-users.forum.profile_link'), m("span", {
        className: "Button-badge"
      }, followedUsersCount)));
    }
  });
}

/***/ }),

/***/ "./src/forum/addUserCardStats.tsx":
/*!****************************************!*\
  !*** ./src/forum/addUserCardStats.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addUserCardStats)
/* harmony export */ });
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/UserCard */ "flarum/forum/components/UserCard");
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_3__);




function addUserCardStats() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'infoItems', function (items) {
    if (!this.attrs.user || !flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().forum.attribute('ianm-follow-users.stats-on-profile')) return;
    var user = this.attrs.user;
    var followedUsersCount = user.followingCount();
    var followersUsersCount = user.followerCount();
    items.add('followers', m("div", {
      className: "FollowUsers--stats"
    }, m("span", null, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_1___default()('fas fa-user-friends'), m("span", {
      className: "Button-badge"
    }, followedUsersCount), " ", flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('ianm-follow-users.forum.followed'), m("span", {
      className: "Button-badge"
    }, followersUsersCount), " ", flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('ianm-follow-users.forum.followers'))), 40);
  });
}

/***/ }),

/***/ "./src/forum/components/FollowedUserListItem.js":
/*!******************************************************!*\
  !*** ./src/forum/components/FollowedUserListItem.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FollowedUserListItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/UserCard */ "flarum/forum/components/UserCard");
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_2__);




var FollowedUserListItem = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(FollowedUserListItem, _Component);

  function FollowedUserListItem() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = FollowedUserListItem.prototype;

  _proto.view = function view() {
    var user = this.attrs.user;
    return m("div", {
      className: "User"
    }, m((flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_2___default()), {
      user: user,
      className: "UserCard--follow-list",
      controlsButtonClassName: "Button Button--icon Button--flat"
    }));
  };

  return FollowedUserListItem;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));



/***/ }),

/***/ "./src/forum/components/NewDiscussionNotification.js":
/*!***********************************************************!*\
  !*** ./src/forum/components/NewDiscussionNotification.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NewDiscussionNotification)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Notification */ "flarum/common/components/Notification");
/* harmony import */ var flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2__);




var NewDiscussionNotification = /*#__PURE__*/function (_Notification) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(NewDiscussionNotification, _Notification);

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
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route.discussion(discussion);
  };

  _proto.content = function content() {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('ianm-follow-users.forum.notifications.new_discussion_text', {
      user: this.attrs.notification.fromUser(),
      title: this.attrs.notification.subject().title()
    });
  };

  _proto.excerpt = function excerpt() {
    return null;
  };

  return NewDiscussionNotification;
}((flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2___default()));



/***/ }),

/***/ "./src/forum/components/NewFollowerNotification.js":
/*!*********************************************************!*\
  !*** ./src/forum/components/NewFollowerNotification.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NewFollowerNotification)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Notification */ "flarum/common/components/Notification");
/* harmony import */ var flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2__);




var NewFollowerNotification = /*#__PURE__*/function (_Notification) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(NewFollowerNotification, _Notification);

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
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route.user(user);
  };

  _proto.content = function content() {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('ianm-follow-users.forum.notifications.new_follower_text', {
      user: this.attrs.notification.fromUser()
    });
  };

  _proto.excerpt = function excerpt() {
    return null;
  };

  return NewFollowerNotification;
}((flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2___default()));



/***/ }),

/***/ "./src/forum/components/NewPostNotification.js":
/*!*****************************************************!*\
  !*** ./src/forum/components/NewPostNotification.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NewPostNotification)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Notification */ "flarum/common/components/Notification");
/* harmony import */ var flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2__);




var NewPostNotification = /*#__PURE__*/function (_Notification) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(NewPostNotification, _Notification);

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
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route.discussion(discussion, content.postNumber);
  };

  _proto.content = function content() {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('ianm-follow-users.forum.notifications.new_post_text', {
      user: this.attrs.notification.fromUser()
    });
  };

  _proto.excerpt = function excerpt() {
    return null;
  };

  return NewPostNotification;
}((flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2___default()));



/***/ }),

/***/ "./src/forum/components/NewUnfollowerNotification.js":
/*!***********************************************************!*\
  !*** ./src/forum/components/NewUnfollowerNotification.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NewUnfollowerNotification)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Notification */ "flarum/common/components/Notification");
/* harmony import */ var flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2__);




var NewUnfollowerNotification = /*#__PURE__*/function (_Notification) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(NewUnfollowerNotification, _Notification);

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
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route.user(user);
  };

  _proto.content = function content() {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('ianm-follow-users.forum.notifications.new_unfollower_text', {
      user: this.attrs.notification.fromUser()
    });
  };

  _proto.excerpt = function excerpt() {
    return null;
  };

  return NewUnfollowerNotification;
}((flarum_common_components_Notification__WEBPACK_IMPORTED_MODULE_2___default()));



/***/ }),

/***/ "./src/forum/components/ProfilePage.js":
/*!*********************************************!*\
  !*** ./src/forum/components/ProfilePage.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProfilePage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _SelectFollowLevelModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SelectFollowLevelModal */ "./src/forum/components/SelectFollowLevelModal.js");
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Placeholder */ "flarum/common/components/Placeholder");
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _FollowedUserListItem__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FollowedUserListItem */ "./src/forum/components/FollowedUserListItem.js");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6__);








var ProfilePage = /*#__PURE__*/function (_UserPage) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ProfilePage, _UserPage);

  function ProfilePage() {
    return _UserPage.apply(this, arguments) || this;
  }

  var _proto = ProfilePage.prototype;

  _proto.oninit = function oninit(vnode) {
    _UserPage.prototype.oninit.call(this, vnode);

    this.refresh();
  };

  _proto.refresh = function refresh() {
    this.loading = true;
    this.followedUsers = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.followedUsers();
    this.loadUser(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.username());
    this.loading = false;
    m.redraw();
  };

  _proto.changeUserFollowOptions = function changeUserFollowOptions(user) {
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(_SelectFollowLevelModal__WEBPACK_IMPORTED_MODULE_3__.SelectFollowUserTypeModal, {
      user: user
    });
  };

  _proto.content = function content() {
    if (this.loading) {
      return m("div", {
        className: "DiscussionList"
      }, m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6___default()), null));
    }

    if (this.followedUsers.length === 0) {
      return m("div", {
        className: "DiscussionList"
      }, m((flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_4___default()), {
        text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('ianm-follow-users.forum.profile_page.no_following')
      }));
    }

    return m("div", {
      className: "FollowedUserList"
    }, m("ul", {
      className: "FollowedUserList-users"
    }, this.followedUsers.map(function (user) {
      return m("li", {
        key: user.id(),
        "data-id": user.id()
      }, m(_FollowedUserListItem__WEBPACK_IMPORTED_MODULE_5__["default"], {
        user: user
      }));
    })));
  };

  _proto.show = function show() {
    this.user = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user);
    m.redraw();
  };

  return ProfilePage;
}((flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default()));



/***/ }),

/***/ "./src/forum/components/SelectFollowLevelModal.js":
/*!********************************************************!*\
  !*** ./src/forum/components/SelectFollowLevelModal.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectFollowUserTypeModal": () => (/* binding */ SelectFollowUserTypeModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/models/User */ "flarum/common/models/User");
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_User__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Select */ "flarum/common/components/Select");
/* harmony import */ var flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _common_FollowLevels__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../common/FollowLevels */ "./src/common/FollowLevels.js");










var SelectFollowUserTypeModal = /*#__PURE__*/function (_Modal) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(SelectFollowUserTypeModal, _Modal);

  function SelectFollowUserTypeModal() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Modal.call.apply(_Modal, [this].concat(args)) || this;
    _this.state = {
      /**
       * User being followed
       *
       * @type User | null
       */
      user: null,

      /**
       * Is the modal currently saving?
       *
       * @type boolean
       */
      saving: false,

      /**
       * Currently selected follow level.
       *
       * @type "lurk" | "follow" | "unfollow"
       * @example "lurk"
       */
      followState: undefined
    };

    _this.className = function () {
      return 'iam_follow_users-selectFollowLevelModal';
    };

    return _this;
  }

  var _proto = SelectFollowUserTypeModal.prototype;

  _proto.oninit = function oninit(vnode) {
    _Modal.prototype.oninit.call(this, vnode);

    this.state.user = this.attrs.user;
    this.state.followState = this.state.user.followed() || 'unfollow';
  };

  _proto.title = function title() {
    var _this$state$user;

    return this.trans('title', {
      username: m("em", null, (_this$state$user = this.state.user) == null ? void 0 : _this$state$user.username == null ? void 0 : _this$state$user.username())
    });
  };

  _proto.content = function content() {
    var _this2 = this;

    // If `this.user` isn't a valid User, exit quickly to prevent complete forum errors.
    if (!(this.state.user instanceof (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_6___default()))) {
      // Show a more detailed error if this happens when the forum is in debug mode.
      return m("div", {
        "class": "Modal-body"
      }, m("p", null, this.trans("no_user_attr_provided_err" + (flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().forum.attribute('debug') ? '_debug' : ''))));
    }

    var user = this.state.user;
    var availableLevelOptions = _common_FollowLevels__WEBPACK_IMPORTED_MODULE_9__.FollowLevels.reduce(function (acc, curr) {
      var _extends2;

      return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, acc, (_extends2 = {}, _extends2[curr.value] = curr.name(), _extends2));
    }, {});
    var selectedLevel = _common_FollowLevels__WEBPACK_IMPORTED_MODULE_9__.FollowLevels.find(function (l) {
      return l.value === _this2.state.followState;
    });
    return m("div", {
      "class": "Modal-body"
    }, m("fieldset", null, m("legend", null, this.trans('description', {
      user: user
    })), m("div", {
      "class": "selectFollowLevelModal-level"
    }, m("label", {
      "for": "selectFollowLevelModal-select"
    }, this.trans('follow_select_label')), m((flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_8___default()), {
      disabled: this.state.saving,
      id: "selectFollowLevelModal-select",
      onchange: this.onFollowLevelChange.bind(this) // Dynamic attrs that change based on the input
      ,
      value: selectedLevel.value,
      "aria-described-by": "selectFollowLevelModal-" + selectedLevel.value + "-help",
      options: availableLevelOptions
    }), m("p", {
      id: "selectFollowLevelModal-" + selectedLevel.value + "-help"
    }, selectedLevel.description({
      user: user
    })))), m("fieldset", {
      "class": "selectFollowLevelModal-actions"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
      disabled: this.state.saving,
      "class": "Button",
      onclick: this.hide.bind(this)
    }, this.trans('cancel_btn')), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
      disabled: this.state.saving,
      "class": "Button Button--primary",
      onclick: this.saveFollowLevel.bind(this),
      loading: this.state.saving
    }, this.trans('save_btn'))));
  }
  /**
   * Handles a change on the <select> element and saves the new value to a class property.
   */
  ;

  _proto.onFollowLevelChange = function onFollowLevelChange() {
    /**
     * @type HTMLInputElement
     */
    var selectElement = this.$('.Select-input')[0];
    this.state.followState = selectElement.value || 'unfollow';
  }
  /**
   * Helper for app.translator.trans, already including the initial keys up to `modals.select_follow_level`.
   */
  ;

  _proto.trans = function trans(key) {
    var _app$translator;

    for (var _len2 = arguments.length, opts = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      opts[_key2 - 1] = arguments[_key2];
    }

    return (_app$translator = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator)).trans.apply(_app$translator, ["ianm-follow-users.forum.modals.select_follow_level." + key].concat(opts));
  };

  _proto.onsubmit = function onsubmit() {
    this.saveFollowLevel();
  }
  /**
   * Sends the new follow state to the
   */
  ;

  _proto.saveFollowLevel =
  /*#__PURE__*/
  function () {
    var _saveFollowLevel = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().mark(function _callee() {
      var newFollowState, x;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              newFollowState = this.state.followState === 'unfollow' ? null : this.state.followState;
              this.state.saving = true; // Exit early if level not changed

              if (!(this.state.user.attribute('following') === newFollowState)) {
                _context.next = 5;
                break;
              }

              this.hide();
              return _context.abrupt("return");

            case 5:
              _context.next = 7;
              return this.state.user.save({
                followUsers: newFollowState
              });

            case 7:
              x = _context.sent;
              this.hide();

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function saveFollowLevel() {
      return _saveFollowLevel.apply(this, arguments);
    }

    return saveFollowLevel;
  }();

  return SelectFollowUserTypeModal;
}((flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_5___default()));

/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_NotificationGrid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/NotificationGrid */ "flarum/forum/components/NotificationGrid");
/* harmony import */ var flarum_forum_components_NotificationGrid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_NotificationGrid__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/models/User */ "flarum/common/models/User");
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _addFollowControls__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./addFollowControls */ "./src/forum/addFollowControls.js");
/* harmony import */ var _addProfilePage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./addProfilePage */ "./src/forum/addProfilePage.js");
/* harmony import */ var _components_ProfilePage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/ProfilePage */ "./src/forum/components/ProfilePage.js");
/* harmony import */ var _components_NewDiscussionNotification__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/NewDiscussionNotification */ "./src/forum/components/NewDiscussionNotification.js");
/* harmony import */ var _components_NewPostNotification__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/NewPostNotification */ "./src/forum/components/NewPostNotification.js");
/* harmony import */ var _components_NewFollowerNotification__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/NewFollowerNotification */ "./src/forum/components/NewFollowerNotification.js");
/* harmony import */ var _components_NewUnfollowerNotification__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/NewUnfollowerNotification */ "./src/forum/components/NewUnfollowerNotification.js");
/* harmony import */ var _addFollowBadge__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./addFollowBadge */ "./src/forum/addFollowBadge.js");
/* harmony import */ var _addPrivacySetting__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./addPrivacySetting */ "./src/forum/addPrivacySetting.js");
/* harmony import */ var _addFollowingUsers__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./addFollowingUsers */ "./src/forum/addFollowingUsers.js");
/* harmony import */ var _addUserCardStats__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./addUserCardStats */ "./src/forum/addUserCardStats.tsx");
















flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('ianm-follow-users', function () {
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default().prototype.followed) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default().attribute('followed');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default().prototype.followedUsers) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default().hasMany('followedUsers');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default().prototype.followedBy) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default().hasMany('followedBy');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default().prototype.blocksFollow) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default().attribute('blocksFollow');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default().prototype.canBeFollowed) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default().attribute('canBeFollowed');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default().prototype.followingCount) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default().attribute('followingCount');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default().prototype.followerCount) = flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default().attribute('followerCount');
  (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().routes.followedUsers) = {
    path: '/followedUsers',
    component: _components_ProfilePage__WEBPACK_IMPORTED_MODULE_7__["default"]
  };
  (0,_addFollowControls__WEBPACK_IMPORTED_MODULE_5__["default"])();
  (0,_addProfilePage__WEBPACK_IMPORTED_MODULE_6__["default"])();
  (0,_addFollowBadge__WEBPACK_IMPORTED_MODULE_12__["default"])();
  (0,_addPrivacySetting__WEBPACK_IMPORTED_MODULE_13__["default"])();
  (0,_addFollowingUsers__WEBPACK_IMPORTED_MODULE_14__["default"])();
  (0,_addUserCardStats__WEBPACK_IMPORTED_MODULE_15__["default"])();
  (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().notificationComponents.newFollower) = _components_NewFollowerNotification__WEBPACK_IMPORTED_MODULE_10__["default"];
  (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().notificationComponents.newUnfollower) = _components_NewUnfollowerNotification__WEBPACK_IMPORTED_MODULE_11__["default"];
  (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().notificationComponents.newDiscussionByUser) = _components_NewDiscussionNotification__WEBPACK_IMPORTED_MODULE_8__["default"];
  (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().notificationComponents.newPostByUser) = _components_NewPostNotification__WEBPACK_IMPORTED_MODULE_9__["default"];
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_NotificationGrid__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'notificationTypes', function (items) {
    items.add('newFollower', {
      name: 'newFollower',
      icon: 'fas fa-user-plus',
      label: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.forum.settings.notify_new_follower_label')
    });
    items.add('newUnfollower', {
      name: 'newUnfollower',
      icon: 'fas fa-user-minus',
      label: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.forum.settings.notify_new_unfollower_label')
    });
    items.add('newDiscussionByUser', {
      name: 'newDiscussionByUser',
      icon: 'fas fa-user-friends',
      label: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.forum.settings.notify_new_discussion_label')
    });
    items.add('newPostByUser', {
      name: 'newPostByUser',
      icon: 'fas fa-user-friends',
      label: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ianm-follow-users.forum.settings.notify_new_post_label')
    });
  });
}, -1);

/***/ }),

/***/ "./src/forum/util/findVdomChild.ts":
/*!*****************************************!*\
  !*** ./src/forum/util/findVdomChild.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "findAndRemoveFirstVdomChild": () => (/* binding */ findAndRemoveFirstVdomChild),
/* harmony export */   "findFirstVdomChild": () => (/* binding */ findFirstVdomChild)
/* harmony export */ });
/* harmony import */ var css_what__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! css-what */ "./node_modules/css-what/lib/index.js");
/* harmony import */ var css_what__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(css_what__WEBPACK_IMPORTED_MODULE_0__);

function findAndRemoveFirstVdomChild(vdom, selector) {
  var node = findFirstVdomChild(vdom, selector);
  if (node === undefined) return false; // Set to empty fragment

  node.tag = '[';
  node.attrs = {
    removedViaVdomUtils: true
  };
  node.children = [];
  return true;
}
function findFirstVdomChild(vdom, selector, manipulationFunc) {
  var parsedSelector = (0,css_what__WEBPACK_IMPORTED_MODULE_0__.parse)(selector);
  return searchChildren(vdom, parsedSelector, manipulationFunc);
}

function searchChildren(vdom, selectors, manipulationFunc) {
  var nodes;

  if (!Array.isArray(vdom)) {
    nodes = [vdom];
  } else {
    nodes = vdom;
  }

  var found = undefined;
  nodes.some(function (node) {
    if (typeof node === 'boolean' || typeof node === 'number' || typeof node === 'string' || node === null || node === undefined) return false;

    if (Array.isArray(node)) {
      var result = searchChildren(node, selectors, manipulationFunc);

      if (result) {
        found = result;
        return true;
      }

      return false;
    }

    if (doesChildMatchSelectors(node, selectors)) {
      found = node;
      return true;
    }

    if (Array.isArray(node.children)) {
      var _result = searchChildren(node.children, selectors);

      if (_result) {
        found = _result;
        return true;
      }

      return false;
    }

    return false;
  });
  if (manipulationFunc && found) manipulationFunc(found);
  return found;
}

function doesChildMatchSelectors(child, selectors) {
  return selectors.some(function (selector) {
    return selector.every(function (criterion) {
      var _attr, _attr2, _attr3, _attr3$split;

      switch (criterion.type) {
        case 'tag':
          return child.tag === criterion.name;

        case 'attribute':
          if (!child.attrs) return false;
          if (criterion.name === 'class') criterion.name = 'className';
          var attr = child.attrs[criterion.name];

          if (criterion.name === 'className' && typeof attr === 'string') {
            attr = attr.trim();
          }

          if (criterion.ignoreCase && typeof attr === 'string') {
            attr = attr.toLowerCase();
            criterion.value = criterion.value.toLowerCase();
          }

          switch (criterion.action) {
            case 'exists':
              return child.attrs.hasOwnProperty(criterion.name);

            case 'equals':
              return attr === criterion.value;

            case 'start':
              return ((_attr = attr) == null ? void 0 : _attr.startsWith == null ? void 0 : _attr.startsWith(criterion.value)) || false;

            case 'end':
              return ((_attr2 = attr) == null ? void 0 : _attr2.endsWith == null ? void 0 : _attr2.endsWith(criterion.value)) || false;

            case 'element':
              return ((_attr3 = attr) == null ? void 0 : _attr3.split == null ? void 0 : (_attr3$split = _attr3.split(' ')) == null ? void 0 : _attr3$split.includes == null ? void 0 : _attr3$split.includes(criterion.value)) || false;
          }

      }

      return false;
    });
  });
}

/***/ }),

/***/ "@fof-follow-tags":
/*!*******************************************************!*\
  !*** external "flarum.extensions['fof-follow-tags']" ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.extensions['fof-follow-tags'];

/***/ }),

/***/ "@fof-user-directory":
/*!**********************************************************!*\
  !*** external "flarum.extensions['fof-user-directory']" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.extensions['fof-user-directory'];

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/app":
/*!***************************************************!*\
  !*** external "flarum.core.compat['common/app']" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/app'];

/***/ }),

/***/ "flarum/common/components/Badge":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Badge']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Badge'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/LinkButton":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['common/components/LinkButton']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LinkButton'];

/***/ }),

/***/ "flarum/common/components/LoadingIndicator":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['common/components/LoadingIndicator']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LoadingIndicator'];

/***/ }),

/***/ "flarum/common/components/Modal":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Modal']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Modal'];

/***/ }),

/***/ "flarum/common/components/Notification":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['common/components/Notification']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Notification'];

/***/ }),

/***/ "flarum/common/components/Placeholder":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['common/components/Placeholder']" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Placeholder'];

/***/ }),

/***/ "flarum/common/components/Select":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Select']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Select'];

/***/ }),

/***/ "flarum/common/components/Separator":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['common/components/Separator']" ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Separator'];

/***/ }),

/***/ "flarum/common/components/Switch":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Switch']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Switch'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/helpers/icon":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/icon']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/icon'];

/***/ }),

/***/ "flarum/common/models/Discussion":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/models/Discussion']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/models/Discussion'];

/***/ }),

/***/ "flarum/common/models/User":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/models/User']" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/models/User'];

/***/ }),

/***/ "flarum/forum/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['forum/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/app'];

/***/ }),

/***/ "flarum/forum/components/NotificationGrid":
/*!**************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/NotificationGrid']" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/NotificationGrid'];

/***/ }),

/***/ "flarum/forum/components/SettingsPage":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['forum/components/SettingsPage']" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/SettingsPage'];

/***/ }),

/***/ "flarum/forum/components/UserCard":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/UserCard']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/UserCard'];

/***/ }),

/***/ "flarum/forum/components/UserPage":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/UserPage']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/UserPage'];

/***/ }),

/***/ "flarum/forum/states/DiscussionListState":
/*!*************************************************************************!*\
  !*** external "flarum.core.compat['forum/states/DiscussionListState']" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/states/DiscussionListState'];

/***/ }),

/***/ "flarum/forum/utils/UserControls":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['forum/utils/UserControls']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/utils/UserControls'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
  !*** ./forum.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map