"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug2(...args) {
          if (!debug2.enabled) {
            return;
          }
          const self = debug2;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug2.namespace = namespace;
        debug2.useColors = createDebug.useColors();
        debug2.color = createDebug.selectColor(namespace);
        debug2.extend = extend;
        debug2.destroy = createDebug.destroy;
        Object.defineProperty(debug2, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug2);
        }
        return debug2;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module2) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);

// src/Plugin.ts
var import_obsidian14 = require("obsidian");

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/plugin/plugin-base.mjs
var import_obsidian3 = require("obsidian");

// node_modules/obsidian-dev-utils/dist/lib/esm/array.mjs
(function initEsm() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
function filterInPlace(arr, predicate) {
  const length = arr.length;
  let writeIndex = 0;
  for (let readIndex = 0; readIndex < length; readIndex++) {
    if (!Object.hasOwn(arr, readIndex)) {
      continue;
    }
    const current = arr[readIndex];
    if (predicate(current, readIndex, arr)) {
      arr[writeIndex++] = current;
    }
  }
  arr.length = writeIndex;
}

// node_modules/obsidian-dev-utils/dist/lib/esm/async-events.mjs
(function initEsm2() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var AsyncEvents = class {
  eventRefsMap = /* @__PURE__ */ new Map();
  /**
   * Remove an event listener.
   *
   * @param name - The name of the event.
   * @param callback - The callback to remove.
   *
   * @example
   * ```ts
   * events.off('my-event', myListener);
   * ```
   *
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- We need to use the dummy parameter to get type inference.
  off(name, callback) {
    const eventRefs = this.eventRefsMap.get(name);
    if (!eventRefs) {
      return;
    }
    filterInPlace(eventRefs, (eventRef) => eventRef.callback !== callback);
    if (eventRefs.length === 0) {
      this.eventRefsMap.delete(name);
    }
  }
  /**
   * Remove an event listener by reference.
   *
   * @param eventRef - The reference to the event listener.
   *
   * @example
   * ```ts
   * events.offref(myRef);
   * ```
   *
   * @public
   */
  offref(eventRef) {
    const eventRefs = this.eventRefsMap.get(eventRef.name);
    if (!eventRefs) {
      return;
    }
    filterInPlace(eventRefs, (storedEventRef) => storedEventRef !== eventRef);
    if (eventRefs.length === 0) {
      this.eventRefsMap.delete(eventRef.name);
    }
  }
  /**
   * Add an event listener.
   *
   * @param name - The name of the event.
   * @param callback - The callback to call when the event is triggered.
   * @param thisArg - The context passed as `this` to the `callback`.
   * @returns A reference to the event listener.
   *
   * @example
   * ```ts
   * events.on('my-event', async (arg1, arg2) => {
   *     await sleep(100);
   *     console.log(arg1, arg2);
   * });
   * ```
   *
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- We need to use the dummy parameter to get type inference.
  on(name, callback, thisArg) {
    let eventRefs = this.eventRefsMap.get(name);
    if (!eventRefs) {
      eventRefs = [];
      this.eventRefsMap.set(name, eventRefs);
    }
    const eventRef = {
      asyncEvents: this,
      callback,
      name,
      thisArg
    };
    eventRefs.push(eventRef);
    return eventRef;
  }
  /**
   * Add an event listener that will be triggered only once.
   *
   * @param name - The name of the event.
   * @param callback - The callback to call when the event is triggered.
   * @param thisArg - The context passed as `this` to the `callback`.
   * @returns A reference to the event listener.
   *
   * @example
   * ```ts
   * events.once('my-event', async (arg1, arg2) => {
   *     await sleep(100);
   *     console.log(arg1, arg2);
   * });
   * ```
   *
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- We need to use the dummy parameter to get type inference.
  once(name, callback, thisArg) {
    const originalEventRef = this.on(name, callback, thisArg);
    const cleanupEventRef = this.on(name, () => {
      this.offref(originalEventRef);
      this.offref(cleanupEventRef);
    });
    return originalEventRef;
  }
  /**
   * Trigger an event, executing all the listeners in order even if some of them throw an error.
   *
   * @param name - The name of the event.
   * @param args - The data to pass to the event listeners.
   *
   * @example
   * ```ts
   * events.trigger('my-event', 'arg1', 'arg2');
   * ```
   *
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- We need to use the dummy parameter to get type inference.
  trigger(name, ...args) {
    const eventRefs = this.eventRefsMap.get(name) ?? [];
    for (const eventRef of eventRefs.slice()) {
      this.tryTrigger(eventRef, args);
    }
  }
  /**
   * Trigger an event asynchronously, executing all the listeners in order even if some of them throw an error.
   *
   * @param name - The name of the event.
   * @param args - The data to pass to the event listeners.
   *
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- We need to use the dummy parameter to get type inference.
  async triggerAsync(name, ...args) {
    const eventRefs = this.eventRefsMap.get(name) ?? [];
    for (const eventRef of eventRefs.slice()) {
      await this.tryTriggerAsync(eventRef, args);
    }
  }
  /**
   * Try to trigger an event, executing all the listeners in order even if some of them throw an error.
   *
   * @param eventRef - The event reference.
   * @param args - The data to pass to the event listeners.
   *
   * @example
   * ```ts
   * events.tryTrigger(myRef, ['arg1', 'arg2']);
   * ```
   *
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- We need to use the dummy parameter to get type inference.
  tryTrigger(eventRef, args) {
    try {
      eventRef.callback.apply(eventRef.thisArg, args);
    } catch (e) {
      window.setTimeout(() => {
        throw e;
      }, 0);
    }
  }
  /**
   * Try to trigger an event asynchronously, executing all the listeners in order even if some of them throw an error.
   *
   * @param eventRef - The event reference.
   * @param args - The data to pass to the event listeners.
   *
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- We need to use the dummy parameter to get type inference.
  async tryTriggerAsync(eventRef, args) {
    try {
      const result = eventRef.callback.call(eventRef.thisArg, ...args);
      await result;
    } catch (e) {
      window.setTimeout(() => {
        throw e;
      }, 0);
    }
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/function.mjs
(function initEsm3() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
function noop() {
}
async function noopAsync() {
}

// node_modules/obsidian-dev-utils/dist/lib/esm/abort-controller.mjs
(function initEsm4() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var INFINITE_TIMEOUT = Number.POSITIVE_INFINITY;
function abortSignalAny(...maybeAbortSignals) {
  const abortSignals = maybeAbortSignals.filter((abortSignal) => !!abortSignal);
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any(abortSignals);
  }
  if (abortSignals.length === 0) {
    return abortSignalNever();
  }
  if (abortSignals.length === 1 && abortSignals[0]) {
    return abortSignals[0];
  }
  const abortController = new AbortController();
  for (const abortSignal of abortSignals) {
    if (abortSignal.aborted) {
      return abortSignal;
    }
  }
  const abortHandlerRemovers = [];
  for (const abortSignal of abortSignals) {
    abortHandlerRemovers.push(onAbort(abortSignal, handleAbort));
  }
  return abortController.signal;
  function handleAbort(abortSignal) {
    for (const abortHandlerRemover of abortHandlerRemovers) {
      abortHandlerRemover();
    }
    abortController.abort(abortSignal.reason);
  }
}
function abortSignalNever() {
  return new AbortController().signal;
}
function abortSignalTimeout(timeoutInMilliseconds) {
  if (timeoutInMilliseconds === INFINITE_TIMEOUT) {
    return abortSignalNever();
  }
  if (typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutInMilliseconds);
  }
  const abortController = new AbortController();
  window.setTimeout(() => {
    abortController.abort(new Error(`Timed out in ${String(timeoutInMilliseconds)} milliseconds`));
  }, timeoutInMilliseconds);
  return abortController.signal;
}
function onAbort(abortSignal, callback) {
  if (abortSignal.aborted) {
    callback(abortSignal);
    return noop;
  }
  abortSignal.addEventListener("abort", wrappedCallback, { once: true });
  return () => {
    abortSignal.removeEventListener("abort", wrappedCallback);
  };
  function wrappedCallback(evt) {
    callback(evt.target);
  }
}
function waitForAbort(abortSignal, shouldRejectOnAbort) {
  return new Promise((resolve, reject) => {
    onAbort(abortSignal, () => {
      if (shouldRejectOnAbort) {
        reject(abortSignal.reason);
      } else {
        resolve(abortSignal.reason);
      }
    });
  });
}

// node_modules/obsidian-dev-utils/dist/lib/esm/debug.mjs
var import_debug = __toESM(require_browser(), 1);

// node_modules/obsidian-dev-utils/dist/lib/esm/type-guards.mjs
(function initEsm5() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
function assertNonNullable(value, errorOrMessage) {
  if (value !== null && value !== void 0) {
    return;
  }
  errorOrMessage ??= value === null ? "Value is null" : "Value is undefined";
  const error = typeof errorOrMessage === "string" ? new Error(errorOrMessage) : errorOrMessage;
  throw error;
}
function ensureGenericObject(obj) {
  return obj;
}
function ensureNonNullable(value, errorOrMessage) {
  assertNonNullable(value, errorOrMessage);
  return value;
}

// node_modules/obsidian-dev-utils/dist/lib/esm/error.mjs
(function initEsm6() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var ASYNC_ERROR_EVENT = "asyncError";
var asyncErrorEventEmitter = new AsyncEvents();
asyncErrorEventEmitter.on(ASYNC_ERROR_EVENT, handleAsyncError);
var ASYNC_WRAPPER_ERROR_MESSAGE = "An unhandled error occurred executing async operation";
var STACK_TRACE_PREFIX = "    at";
var CustomStackTraceError = class _CustomStackTraceError extends Error {
  /**
   * Creates a new CustomStackTraceError.
   *
   * @param message - The message of the error.
   * @param stackTrace - The stack trace of the error.
   * @param cause - The cause of the error.
   */
  constructor(message, stackTrace, cause) {
    super(message, { cause });
    this.name = "CustomStackTraceError";
    Error.captureStackTrace?.(this, _CustomStackTraceError);
    let rootCause = cause;
    const parentCauses = /* @__PURE__ */ new Set();
    while (rootCause instanceof _CustomStackTraceError) {
      if (parentCauses.has(rootCause)) {
        throw new Error("Circular cause detected");
      }
      parentCauses.add(rootCause);
      rootCause = rootCause.cause;
    }
    const originalStackLines = ensureNonNullable(this.stack).split("\n");
    const stackLines = stackTrace.split("\n");
    const ERROR_HEADER_REG_EXP = /^\w*Error(?:: |$)/;
    if (ERROR_HEADER_REG_EXP.test(ensureNonNullable(stackLines[0]))) {
      stackLines.splice(0, 1);
    }
    originalStackLines.splice(1, originalStackLines.length - 1, ...stackLines);
    this.stack = originalStackLines.join("\n");
  }
};
var SilentError = class _SilentError extends Error {
  /**
   * Creates a new SilentError.
   *
   * @param message - The message of the error.
   */
  constructor(message) {
    super(message);
    this.name = "SilentError";
    Error.captureStackTrace?.(this, _SilentError);
  }
};
function emitAsyncErrorEvent(asyncError) {
  asyncErrorEventEmitter.trigger(ASYNC_ERROR_EVENT, asyncError);
}
function errorToString(error) {
  if (!(error instanceof Error)) {
    return String(error);
  }
  let message = error.stack ?? `${error.name}: ${error.message}`;
  if (error.cause !== void 0) {
    const causeStrLines = errorToString(error.cause).split("\n");
    message += `
${generateStackTraceLine("Caused by:")}`;
    for (const line of causeStrLines) {
      if (!line.trim()) {
        continue;
      }
      message += line.startsWith(STACK_TRACE_PREFIX) ? `
${line}` : `
${generateStackTraceLine(line)}`;
    }
  }
  return message;
}
function getStackTrace(framesToSkip = 0) {
  const ADDITIONAL_FRAMES_TO_SKIP = 2;
  const stack = ensureNonNullable(new Error().stack);
  const lines = stack.split("\n");
  return lines.slice(framesToSkip + ADDITIONAL_FRAMES_TO_SKIP).join("\n");
}
function printError(error, console2) {
  console2 ??= globalThis.console;
  console2.error(errorToString(error));
}
function registerAsyncErrorEventHandler(handler) {
  const eventRef = asyncErrorEventEmitter.on(ASYNC_ERROR_EVENT, handler);
  return () => {
    asyncErrorEventEmitter.offref(eventRef);
  };
}
function generateStackTraceLine(title) {
  return `${STACK_TRACE_PREFIX} --- ${title} --- (0)`;
}
function handleAsyncError(asyncError) {
  printError(asyncError);
}

// node_modules/obsidian-dev-utils/dist/lib/esm/library.mjs
(function initEsm7() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var LIBRARY_VERSION = "54.0.3";
var LIBRARY_NAME = "obsidian-dev-utils";
var LIBRARY_STYLES = `.obsidian-dev-utils.code-highlighter-component textarea, .obsidian-dev-utils.code-highlighter-component pre, .obsidian-dev-utils.code-highlighter-component code {
  font-family: var(--font-monospace);
  line-height: var(--line-height-normal);
  margin: 0;
}
.obsidian-dev-utils.code-highlighter-component textarea, .obsidian-dev-utils.code-highlighter-component code {
  font-size: var(--code-size);
}
.obsidian-dev-utils.code-highlighter-component textarea {
  background: transparent;
  color: transparent;
  z-index: 2;
  width: 20em;
  height: 10em;
}
.obsidian-dev-utils.code-highlighter-component pre {
  position: absolute;
  pointer-events: none;
  border: var(--input-border-width) solid transparent;
  overflow: auto;
  inset: 0;
  padding: var(--size-4-1) var(--size-4-2);
  z-index: 1;
}
.obsidian-dev-utils.code-highlighter-component pre::after {
  content: "";
  display: block;
  height: var(--bottom-gap, 0);
}
.obsidian-dev-utils.code-highlighter-component pre.is-placeholder {
  opacity: 0.6;
}
.obsidian-dev-utils.code-highlighter-component code {
  display: block;
  padding: 0;
}

.obsidian-dev-utils input[type=url] {
  height: var(--input-height);
}
.obsidian-dev-utils input[type=month],
.obsidian-dev-utils input[type=tel],
.obsidian-dev-utils input[type=time],
.obsidian-dev-utils input[type=url],
.obsidian-dev-utils input[type=week] {
  -webkit-app-region: no-drag;
  background: var(--background-modifier-form-field);
  border: var(--input-border-width) solid var(--background-modifier-border);
  color: var(--text-normal);
  font-family: inherit;
  padding: var(--size-4-1) var(--size-4-2);
  font-size: var(--font-ui-small);
  border-radius: var(--input-radius);
  outline: none;
}
@media (hover: hover) {
  .obsidian-dev-utils input[type=month]:hover,
  .obsidian-dev-utils input[type=tel]:hover,
  .obsidian-dev-utils input[type=time]:hover,
  .obsidian-dev-utils input[type=url]:hover,
  .obsidian-dev-utils input[type=week]:hover {
    border-color: var(--background-modifier-border-hover);
    transition: box-shadow 0.15s ease-in-out, border 0.15s ease-in-out;
  }
}
.obsidian-dev-utils input[type=month]:active, .obsidian-dev-utils input[type=month]:focus,
.obsidian-dev-utils input[type=tel]:active,
.obsidian-dev-utils input[type=tel]:focus,
.obsidian-dev-utils input[type=time]:active,
.obsidian-dev-utils input[type=time]:focus,
.obsidian-dev-utils input[type=url]:active,
.obsidian-dev-utils input[type=url]:focus,
.obsidian-dev-utils input[type=week]:active,
.obsidian-dev-utils input[type=week]:focus {
  border-color: var(--background-modifier-border-focus);
  transition: box-shadow 0.15s ease-in-out, border 0.15s ease-in-out;
}
.obsidian-dev-utils input[type=month]:active, .obsidian-dev-utils input[type=month]:focus, .obsidian-dev-utils input[type=month]:focus-visible,
.obsidian-dev-utils input[type=tel]:active,
.obsidian-dev-utils input[type=tel]:focus,
.obsidian-dev-utils input[type=tel]:focus-visible,
.obsidian-dev-utils input[type=time]:active,
.obsidian-dev-utils input[type=time]:focus,
.obsidian-dev-utils input[type=time]:focus-visible,
.obsidian-dev-utils input[type=url]:active,
.obsidian-dev-utils input[type=url]:focus,
.obsidian-dev-utils input[type=url]:focus-visible,
.obsidian-dev-utils input[type=week]:active,
.obsidian-dev-utils input[type=week]:focus,
.obsidian-dev-utils input[type=week]:focus-visible {
  box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
}
.obsidian-dev-utils input[type=month]::placeholder,
.obsidian-dev-utils input[type=tel]::placeholder,
.obsidian-dev-utils input[type=time]::placeholder,
.obsidian-dev-utils input[type=url]::placeholder,
.obsidian-dev-utils input[type=week]::placeholder {
  color: var(--text-faint);
}
.mod-rtl input[type=month],
.mod-rtl input[type=time],
.mod-rtl input[type=week],
.is-rtl input[type=month],
.is-rtl input[type=time],
.is-rtl input[type=week],
.rtl input[type=month],
.rtl input[type=time],
.rtl input[type=week] {
  direction: rtl;
}
.mod-rtl input[type=month]::-webkit-calendar-picker-indicator,
.mod-rtl input[type=time]::-webkit-calendar-picker-indicator,
.mod-rtl input[type=week]::-webkit-calendar-picker-indicator,
.is-rtl input[type=month]::-webkit-calendar-picker-indicator,
.is-rtl input[type=time]::-webkit-calendar-picker-indicator,
.is-rtl input[type=week]::-webkit-calendar-picker-indicator,
.rtl input[type=month]::-webkit-calendar-picker-indicator,
.rtl input[type=time]::-webkit-calendar-picker-indicator,
.rtl input[type=week]::-webkit-calendar-picker-indicator {
  right: var(--size-4-1);
  left: auto;
}

.obsidian-dev-utils input[type=month],
.obsidian-dev-utils input[type=time],
.obsidian-dev-utils input[type=week] {
  font-variant-numeric: tabular-nums;
  position: relative;
}
.obsidian-dev-utils input[type=month]::-webkit-datetime-edit-text,
.obsidian-dev-utils input[type=time]::-webkit-datetime-edit-text,
.obsidian-dev-utils input[type=week]::-webkit-datetime-edit-text {
  color: var(--text-faint);
  padding-inline-end: 0;
}
.obsidian-dev-utils input[type=month]::-webkit-calendar-picker-indicator,
.obsidian-dev-utils input[type=time]::-webkit-calendar-picker-indicator,
.obsidian-dev-utils input[type=week]::-webkit-calendar-picker-indicator {
  position: absolute;
  left: var(--size-4-1);
  right: auto;
  opacity: 0.5;
}
.obsidian-dev-utils input[type=month]::-webkit-datetime-edit-month-field:active, .obsidian-dev-utils input[type=month]::-webkit-datetime-edit-month-field:focus, .obsidian-dev-utils input[type=month]::-webkit-datetime-edit-day-field:active, .obsidian-dev-utils input[type=month]::-webkit-datetime-edit-day-field:focus, .obsidian-dev-utils input[type=month]::-webkit-datetime-edit-year-field:active, .obsidian-dev-utils input[type=month]::-webkit-datetime-edit-year-field:focus,
.obsidian-dev-utils input[type=time]::-webkit-datetime-edit-month-field:active,
.obsidian-dev-utils input[type=time]::-webkit-datetime-edit-month-field:focus,
.obsidian-dev-utils input[type=time]::-webkit-datetime-edit-day-field:active,
.obsidian-dev-utils input[type=time]::-webkit-datetime-edit-day-field:focus,
.obsidian-dev-utils input[type=time]::-webkit-datetime-edit-year-field:active,
.obsidian-dev-utils input[type=time]::-webkit-datetime-edit-year-field:focus,
.obsidian-dev-utils input[type=week]::-webkit-datetime-edit-month-field:active,
.obsidian-dev-utils input[type=week]::-webkit-datetime-edit-month-field:focus,
.obsidian-dev-utils input[type=week]::-webkit-datetime-edit-day-field:active,
.obsidian-dev-utils input[type=week]::-webkit-datetime-edit-day-field:focus,
.obsidian-dev-utils input[type=week]::-webkit-datetime-edit-year-field:active,
.obsidian-dev-utils input[type=week]::-webkit-datetime-edit-year-field:focus {
  background-color: var(--text-selection);
  color: var(--text-normal);
  cursor: text;
}
.mod-rtl .obsidian-dev-utils input[type=month], .is-rtl .obsidian-dev-utils input[type=month], .rtl .obsidian-dev-utils input[type=month],
.mod-rtl .obsidian-dev-utils input[type=time],
.is-rtl .obsidian-dev-utils input[type=time],
.rtl .obsidian-dev-utils input[type=time],
.mod-rtl .obsidian-dev-utils input[type=week],
.is-rtl .obsidian-dev-utils input[type=week],
.rtl .obsidian-dev-utils input[type=week] {
  direction: rtl;
}
.mod-rtl .obsidian-dev-utils input[type=month]::-webkit-calendar-picker-indicator, .is-rtl .obsidian-dev-utils input[type=month]::-webkit-calendar-picker-indicator, .rtl .obsidian-dev-utils input[type=month]::-webkit-calendar-picker-indicator,
.mod-rtl .obsidian-dev-utils input[type=time]::-webkit-calendar-picker-indicator,
.is-rtl .obsidian-dev-utils input[type=time]::-webkit-calendar-picker-indicator,
.rtl .obsidian-dev-utils input[type=time]::-webkit-calendar-picker-indicator,
.mod-rtl .obsidian-dev-utils input[type=week]::-webkit-calendar-picker-indicator,
.is-rtl .obsidian-dev-utils input[type=week]::-webkit-calendar-picker-indicator,
.rtl .obsidian-dev-utils input[type=week]::-webkit-calendar-picker-indicator {
  left: auto;
  right: var(--size-4-1);
}

body:not(.is-ios):not(.is-android) .obsidian-dev-utils input[type=month],
body:not(.is-ios):not(.is-android) .obsidian-dev-utils input[type=time],
body:not(.is-ios):not(.is-android) .obsidian-dev-utils input[type=week] {
  padding-inline-start: var(--size-4-6);
}

.obsidian-dev-utils input[type=time]::-webkit-calendar-picker-indicator {
  margin-inline-start: 0;
}

.obsidian-dev-utilsprogress.loop {
  min-width: 200px;
}

.obsidian-dev-utils.modal-container .ok-button {
  margin-right: 10px;
  margin-top: 20px;
}

.obsidian-dev-utils .multiple-dropdown-component select,
.obsidian-dev-utils .multiple-dropdown-component select:focus,
.obsidian-dev-utils .multiple-dropdown-component .dropdown {
  height: auto;
  padding-top: 3px;
}
.obsidian-dev-utils .multiple-dropdown-component select option:checked,
.obsidian-dev-utils .multiple-dropdown-component select:focus option:checked,
.obsidian-dev-utils .multiple-dropdown-component .dropdown option:checked {
  background-color: #1967d2;
  color: #fff;
}

.obsidian-dev-utils.plugin-settings-tab a:focus {
  outline: 2px solid var(--link-color);
}

.obsidian-dev-utils.prompt-modal .text-box {
  width: 100%;
}

.obsidian-dev-utils.tri-state-checkbox-component input[type=checkbox]:indeterminate {
  appearance: checkbox;
}

.obsidian-dev-utils :invalid {
  box-shadow: 0 0 0 2px var(--text-error);
}
.obsidian-dev-utils input.metadata-input-text:active:invalid, .obsidian-dev-utils input.metadata-input-text:focus-visible:invalid, .obsidian-dev-utils input.metadata-input-text:focus:invalid,
.obsidian-dev-utils input[type=date]:active:invalid,
.obsidian-dev-utils input[type=date]:focus-visible:invalid,
.obsidian-dev-utils input[type=date]:focus:invalid,
.obsidian-dev-utils input[type=datetime-local]:active:invalid,
.obsidian-dev-utils input[type=datetime-local]:focus-visible:invalid,
.obsidian-dev-utils input[type=datetime-local]:focus:invalid,
.obsidian-dev-utils input[type=email]:active:invalid,
.obsidian-dev-utils input[type=email]:focus-visible:invalid,
.obsidian-dev-utils input[type=email]:focus:invalid,
.obsidian-dev-utils input[type=number]:active:invalid,
.obsidian-dev-utils input[type=number]:focus-visible:invalid,
.obsidian-dev-utils input[type=number]:focus:invalid,
.obsidian-dev-utils input[type=password]:active:invalid,
.obsidian-dev-utils input[type=password]:focus-visible:invalid,
.obsidian-dev-utils input[type=password]:focus:invalid,
.obsidian-dev-utils input[type=search]:active:invalid,
.obsidian-dev-utils input[type=search]:focus-visible:invalid,
.obsidian-dev-utils input[type=search]:focus:invalid,
.obsidian-dev-utils input[type=text]:active:invalid,
.obsidian-dev-utils input[type=text]:focus-visible:invalid,
.obsidian-dev-utils input[type=text]:focus:invalid,
.obsidian-dev-utils textarea:active:invalid,
.obsidian-dev-utils textarea:focus-visible:invalid,
.obsidian-dev-utils textarea:focus:invalid {
  box-shadow: 0 0 0 2px var(--text-error);
}
.obsidian-dev-utils.setting-component-wrapper {
  position: relative;
  display: inline-flex;
}
.obsidian-dev-utils.overlay-validator {
  caret-color: transparent;
  cursor: default;
  position: absolute;
  background-color: transparent;
  border: none;
  outline: none;
  pointer-events: none;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.obsidian-dev-utils.tooltip.tooltip-validator {
  position: absolute;
  top: calc(100% + 8px);
  width: max-content;
}

/*# sourceMappingURL=data:application/json;charset=utf-8,%7B%22version%22:3,%22sourceRoot%22:%22%22,%22sources%22:%5B%22../src/styles/code-highlighter-component.scss%22,%22../src/styles/input.scss%22,%22../src/styles/input-time.scss%22,%22../src/styles/loop.scss%22,%22../src/styles/modal-container.scss%22,%22../src/styles/multiple-dropdown-component.scss%22,%22../src/styles/plugin-settings-tab.scss%22,%22../src/styles/prompt-modal.scss%22,%22../src/styles/tri-state-checkbox-component.scss%22,%22../src/styles/validation.scss%22%5D,%22names%22:%5B%5D,%22mappings%22:%22AAEI;EACE;EACA;EACA;;AAGF;EACE;;AAGF;EACE;EACA;EACA;EACA;EACA;;AAGF;EACE;EACA;EACA;EACA;EACA;EACA;EACA;;AAGF;EACE;EACA;EACA;;AAGF;EACE;;AAGF;EACE;EACA;;;ACzCJ;EACE;;AAGF;AAAA;AAAA;AAAA;AAAA;EAKE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AAGE;EACE;AAAA;AAAA;AAAA;AAAA;IACE;IACA,YACE;;;AAMR;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EAEE;EACA,YACE;;AAIJ;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EAGE;;AAGF;AAAA;AAAA;AAAA;AAAA;EACE;;AASE;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EAGE;;AAEA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EACE;EACA;;;AC7DV;AAAA;AAAA;EAGE;EACA;;AAEA;AAAA;AAAA;EACE;EACA;;AAGF;AAAA;AAAA;EACE;EACA;EACA;EACA;;AAMA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EAEE;EACA;EACA;;AAIK;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EAGP;;AAEA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EACE;EACA;;;AAKF;AAAA;AAAA;EACE;;;AAMJ;EACE;;;ACjDJ;EACE;;;ACAA;EACE;EACA;;;ACFF;AAAA;AAAA;EAGE;EACA;;AAEA;AAAA;AAAA;EACE;EACA;;;ACRJ;EACE;;;ACDF;EACE;;;ACDF;EACE;;;ACEJ;EAJA;;AAoBI;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;EApBJ;;AA0BA;EACE;EACA;;AAGF;EACE;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;EACA;;AAGF;EACE;EACA;EACA%22,%22file%22:%22styles.css%22,%22sourcesContent%22:%5B%22.obsidian-dev-utils%20%7B%5Cn%20%20&.code-highlighter-component%20%7B%5Cn%20%20%20%20textarea,%20pre,%20code%20%7B%5Cn%20%20%20%20%20%20font-family:%20var(--font-monospace);%5Cn%20%20%20%20%20%20line-height:%20var(--line-height-normal);%5Cn%20%20%20%20%20%20margin:%200;%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20textarea,%20code%20%7B%5Cn%20%20%20%20%20%20font-size:%20var(--code-size);%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20textarea%20%7B%5Cn%20%20%20%20%20%20background:%20transparent;%5Cn%20%20%20%20%20%20color:%20transparent;%5Cn%20%20%20%20%20%20z-index:%202;%5Cn%20%20%20%20%20%20width:%2020em;%5Cn%20%20%20%20%20%20height:%2010em;%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20pre%20%7B%5Cn%20%20%20%20%20%20position:%20absolute;%5Cn%20%20%20%20%20%20pointer-events:%20none;%5Cn%20%20%20%20%20%20border:%20var(--input-border-width)%20solid%20transparent;%5Cn%20%20%20%20%20%20overflow:%20auto;%5Cn%20%20%20%20%20%20inset:%200;%5Cn%20%20%20%20%20%20padding:%20var(--size-4-1)%20var(--size-4-2);%5Cn%20%20%20%20%20%20z-index:%201;%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20pre::after%20%7B%5Cn%20%20%20%20%20%20content:%20%5C%22%5C%22;%5Cn%20%20%20%20%20%20display:%20block;%5Cn%20%20%20%20%20%20height:%20var(--bottom-gap,%200);%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20pre.is-placeholder%20%7B%5Cn%20%20%20%20%20%20opacity:%200.6;%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20code%20%7B%5Cn%20%20%20%20%20%20display:%20block;%5Cn%20%20%20%20%20%20padding:%200;%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%7D%5Cn%22,%22.obsidian-dev-utils%20%7B%5Cn%20%20input%5Btype='url'%5D%20%7B%5Cn%20%20%20%20height:%20var(--input-height)%5Cn%20%20%7D%5Cn%5Cn%20%20input%5Btype='month'%5D,%5Cn%20%20input%5Btype='tel'%5D,%5Cn%20%20input%5Btype='time'%5D,%5Cn%20%20input%5Btype='url'%5D,%5Cn%20%20input%5Btype='week'%5D%20%7B%5Cn%20%20%20%20-webkit-app-region:%20no-drag;%5Cn%20%20%20%20background:%20var(--background-modifier-form-field);%5Cn%20%20%20%20border:%20var(--input-border-width)%20solid%20var(--background-modifier-border);%5Cn%20%20%20%20color:%20var(--text-normal);%5Cn%20%20%20%20font-family:%20inherit;%5Cn%20%20%20%20padding:%20var(--size-4-1)%20var(--size-4-2);%5Cn%20%20%20%20font-size:%20var(--font-ui-small);%5Cn%20%20%20%20border-radius:%20var(--input-radius);%5Cn%20%20%20%20outline:%20none;%5Cn%5Cn%20%20%20%20@at-root%20%7B%5Cn%20%20%20%20%20%20@media%20(hover:%20hover)%20%7B%5Cn%20%20%20%20%20%20%20%20&:hover%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20border-color:%20var(--background-modifier-border-hover);%5Cn%20%20%20%20%20%20%20%20%20%20transition:%5Cn%20%20%20%20%20%20%20%20%20%20%20%20box-shadow%200.15s%20ease-in-out,%5Cn%20%20%20%20%20%20%20%20%20%20%20%20border%200.15s%20ease-in-out;%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20&:active,%5Cn%20%20%20%20&:focus%20%7B%5Cn%20%20%20%20%20%20border-color:%20var(--background-modifier-border-focus);%5Cn%20%20%20%20%20%20transition:%5Cn%20%20%20%20%20%20%20%20box-shadow%200.15s%20ease-in-out,%5Cn%20%20%20%20%20%20%20%20border%200.15s%20ease-in-out;%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20&:active,%5Cn%20%20%20%20&:focus,%5Cn%20%20%20%20&:focus-visible%20%7B%5Cn%20%20%20%20%20%20box-shadow:%200%200%200%202px%20var(--background-modifier-border-focus);%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20&::placeholder%20%7B%5Cn%20%20%20%20%20%20color:%20var(--text-faint);%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%5Cn%20%20@at-root%20%7B%5Cn%20%20%20%20.mod-rtl,%5Cn%20%20%20%20.is-rtl,%5Cn%20%20%20%20.rtl%20%7B%5Cn%20%20%20%20%20%20&%20%7B%5Cn%20%20%20%20%20%20%20%20input%5Btype='month'%5D,%5Cn%20%20%20%20%20%20%20%20input%5Btype='time'%5D,%5Cn%20%20%20%20%20%20%20%20input%5Btype='week'%5D%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20direction:%20rtl;%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20&::-webkit-calendar-picker-indicator%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20right:%20var(--size-4-1);%5Cn%20%20%20%20%20%20%20%20%20%20%20%20left:%20auto;%5Cn%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%7D%5Cn%22,%22.obsidian-dev-utils%20%7B%5Cn%20%20input%5Btype='month'%5D,%5Cn%20%20input%5Btype='time'%5D,%5Cn%20%20input%5Btype='week'%5D%20%7B%5Cn%20%20%20%20font-variant-numeric:%20tabular-nums;%5Cn%20%20%20%20position:%20relative;%5Cn%5Cn%20%20%20%20&::-webkit-datetime-edit-text%20%7B%5Cn%20%20%20%20%20%20color:%20var(--text-faint);%5Cn%20%20%20%20%20%20padding-inline-end:%200;%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20&::-webkit-calendar-picker-indicator%20%7B%5Cn%20%20%20%20%20%20position:%20absolute;%5Cn%20%20%20%20%20%20left:%20var(--size-4-1);%5Cn%20%20%20%20%20%20right:%20auto;%5Cn%20%20%20%20%20%20opacity:%200.5;%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20&::-webkit-datetime-edit-month-field,%5Cn%20%20%20%20&::-webkit-datetime-edit-day-field,%5Cn%20%20%20%20&::-webkit-datetime-edit-year-field%20%7B%5Cn%20%20%20%20%20%20&:active,%5Cn%20%20%20%20%20%20&:focus%20%7B%5Cn%20%20%20%20%20%20%20%20background-color:%20var(--text-selection);%5Cn%20%20%20%20%20%20%20%20color:%20var(--text-normal);%5Cn%20%20%20%20%20%20%20%20cursor:%20text;%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20@at-root%20.mod-rtl%20&,%5Cn%20%20%20%20%20%20.is-rtl%20&,%5Cn%20%20%20%20%20%20.rtl%20&%20%7B%5Cn%20%20%20%20%20%20direction:%20rtl;%5Cn%5Cn%20%20%20%20%20%20&::-webkit-calendar-picker-indicator%20%7B%5Cn%20%20%20%20%20%20%20%20left:%20auto;%5Cn%20%20%20%20%20%20%20%20right:%20var(--size-4-1);%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20@at-root%20%7B%5Cn%20%20%20%20%20%20body:not(.is-ios):not(.is-android)%20&%20%7B%5Cn%20%20%20%20%20%20%20%20padding-inline-start:%20var(--size-4-6);%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%5Cn%20%20input%5Btype='time'%5D%20%7B%5Cn%20%20%20%20&::-webkit-calendar-picker-indicator%20%7B%5Cn%20%20%20%20%20%20margin-inline-start:%200;%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%7D%5Cn%22,%22.obsidian-dev-utils%20%7B%5Cn%20%20&progress.loop%20%7B%5Cn%20%20%20%20min-width:%20200px;%5Cn%20%20%7D%5Cn%7D%5Cn%22,%22.obsidian-dev-utils%20%7B%5Cn%20%20&.modal-container%20%7B%5Cn%20%20%20%20.ok-button%20%7B%5Cn%20%20%20%20%20%20margin-right:%2010px;%5Cn%20%20%20%20%20%20margin-top:%2020px;%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%7D%5Cn%22,%22.obsidian-dev-utils%20%7B%5Cn%20%20.multiple-dropdown-component%20%7B%5Cn%20%20%20%20select,%5Cn%20%20%20%20select:focus,%5Cn%20%20%20%20.dropdown%20%7B%5Cn%20%20%20%20%20%20height:%20auto;%5Cn%20%20%20%20%20%20padding-top:%203px;%5Cn%5Cn%20%20%20%20%20%20option:checked%20%7B%5Cn%20%20%20%20%20%20%20%20background-color:%20%231967d2;%5Cn%20%20%20%20%20%20%20%20color:%20%23fff;%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%7D%5Cn%22,%22.obsidian-dev-utils%20%7B%5Cn%20%20&.plugin-settings-tab%20%7B%5Cn%20%20%20%20a:focus%20%7B%5Cn%20%20%20%20%20%20outline:%202px%20solid%20var(--link-color);%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%7D%5Cn%22,%22.obsidian-dev-utils%20%7B%5Cn%20%20&.prompt-modal%20%7B%5Cn%20%20%20%20.text-box%20%7B%5Cn%20%20%20%20%20%20width:%20100%25;%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%7D%5Cn%22,%22.obsidian-dev-utils%20%7B%5Cr%5Cn%20%20&.tri-state-checkbox-component%20%7B%5Cr%5Cn%20%20%20%20input%5Btype='checkbox'%5D:indeterminate%20%7B%5Cr%5Cn%20%20%20%20%20%20appearance:%20checkbox;%5Cr%5Cn%20%20%20%20%7D%5Cr%5Cn%20%20%7D%5Cr%5Cn%7D%5Cr%5Cn%22,%22@mixin%20invalid%20%7B%5Cn%20%20box-shadow:%200%200%200%202px%20var(--text-error);%5Cn%7D%5Cn%5Cn.obsidian-dev-utils%20%7B%5Cn%20%20:invalid%20%7B%5Cn%20%20%20%20@include%20invalid;%5Cn%20%20%7D%5Cn%5Cn%20%20input.metadata-input-text,%5Cn%20%20input%5Btype='date'%5D,%5Cn%20%20input%5Btype='datetime-local'%5D,%5Cn%20%20input%5Btype='email'%5D,%5Cn%20%20input%5Btype='number'%5D,%5Cn%20%20input%5Btype='password'%5D,%5Cn%20%20input%5Btype='search'%5D,%5Cn%20%20input%5Btype='text'%5D,%5Cn%20%20textarea%20%7B%5Cn%20%20%20%20&:active,%5Cn%20%20%20%20&:focus-visible,%5Cn%20%20%20%20&:focus%20%7B%5Cn%20%20%20%20%20%20&:invalid%20%7B%5Cn%20%20%20%20%20%20%20%20@include%20invalid;%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%5Cn%20%20&.setting-component-wrapper%20%7B%5Cn%20%20%20%20position:%20relative;%5Cn%20%20%20%20display:%20inline-flex;%5Cn%20%20%7D%5Cn%5Cn%20%20&.overlay-validator%20%7B%5Cn%20%20%20%20caret-color:%20transparent;%5Cn%20%20%20%20cursor:%20default;%5Cn%20%20%20%20position:%20absolute;%5Cn%20%20%20%20background-color:%20transparent;%5Cn%20%20%20%20border:%20none;%5Cn%20%20%20%20outline:%20none;%5Cn%20%20%20%20pointer-events:%20none;%5Cn%20%20%20%20z-index:%209999;%5Cn%20%20%20%20left:%200;%5Cn%20%20%20%20top:%200;%5Cn%20%20%20%20width:%20100%25;%5Cn%20%20%20%20height:%20100%25;%5Cn%20%20%7D%5Cn%5Cn%20%20&.tooltip.tooltip-validator%20%7B%5Cn%20%20%20%20position:%20absolute;%5Cn%20%20%20%20top:%20calc(100%25%20+%208px);%5Cn%20%20%20%20width:%20max-content;%5Cn%20%20%7D%5Cn%7D%5Cn%22%5D%7D */
`;

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/app.mjs
(function initEsm8() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var ValueWrapper = class {
  /**
   * Creates a new value wrapper.
   *
   * @param value - The value to wrap.
   */
  constructor(value) {
    this.value = value;
    noop();
  }
  value;
};
function getApp() {
  const app = globalThis.app;
  if (app) {
    return app;
  }
  try {
    return globalThis.require("obsidian/app");
  } catch {
    throw new Error("Obsidian App global instance not found");
  }
}
function getObsidianDevUtilsState(app, key, defaultValue) {
  const holder = app ?? getAppOrNull() ?? globalThis;
  const sharedStateWrapper = holder;
  sharedStateWrapper.obsidianDevUtilsState ??= {};
  return sharedStateWrapper.obsidianDevUtilsState[key] ??= new ValueWrapper(defaultValue);
}
function getAppOrNull() {
  try {
    return getApp();
  } catch {
    return null;
  }
}

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/is-in-obsidian.mjs
(function initEsm9() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
function isInObsidian() {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    getApp();
    return true;
  } catch {
    return false;
  }
}

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/plugin/plugin-id.mjs
(function initEsm10() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var NO_PLUGIN_ID_INITIALIZED = "__no-plugin-id-initialized__";
var pluginId = NO_PLUGIN_ID_INITIALIZED;
function getPluginId() {
  return pluginId;
}
function setPluginId(newPluginId) {
  if (newPluginId) {
    pluginId = newPluginId;
  }
}

// node_modules/obsidian-dev-utils/dist/lib/esm/debug.mjs
(function initEsm11() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var NAMESPACE_SEPARATOR = ",";
var NEGATED_NAMESPACE_PREFIX = "-";
function getDebugController() {
  return {
    disable: disableNamespaces,
    enable: enableNamespaces,
    get: getNamespaces,
    set: setNamespaces
  };
}
function getDebugger(namespace, framesToSkip = 0) {
  const key = `${namespace}:${String(framesToSkip)}`;
  const debuggersMap = getObsidianDevUtilsState(null, "debuggers", /* @__PURE__ */ new Map()).value;
  let debuggerEx = debuggersMap.get(key);
  if (!debuggerEx) {
    debuggerEx = getSharedDebugLibInstance()(namespace);
    debuggerEx.log = (message, ...args) => {
      logWithCaller(namespace, framesToSkip, message, ...args);
    };
    debuggersMap.set(key, debuggerEx);
  }
  return debuggerEx;
}
function getLibDebugger(namespace) {
  const pluginId2 = getPluginId();
  const prefix = pluginId2 === NO_PLUGIN_ID_INITIALIZED ? "" : `${pluginId2}:`;
  return getDebugger(`${prefix}${LIBRARY_NAME}:${namespace}`);
}
function showInitialDebugMessage(pluginId2) {
  const isEnabled = getSharedDebugLibInstance().enabled(pluginId2);
  const state = isEnabled ? "enabled" : "disabled";
  const changeAction = isEnabled ? "disable" : "enable";
  const namespaces = getNamespaces();
  setNamespaces(pluginId2);
  getDebugger(pluginId2)(
    `Debug messages for plugin ${pluginId2} are ${state}. See https://github.com/mnaoumov/obsidian-dev-utils/blob/main/docs/debugging.md how to ${changeAction} them.`
  );
  setNamespaces(namespaces);
}
function disableNamespaces(namespaces) {
  const set = new Set(getNamespaces());
  for (const namespace of toArray(namespaces)) {
    if (namespace.startsWith(NEGATED_NAMESPACE_PREFIX)) {
      continue;
    }
    const negatedNamespace = NEGATED_NAMESPACE_PREFIX + namespace;
    if (set.has(namespace)) {
      set.delete(namespace);
    }
    set.add(negatedNamespace);
  }
  setNamespaces(Array.from(set));
}
function enableNamespaces(namespaces) {
  const set = new Set(getNamespaces());
  for (const namespace of toArray(namespaces)) {
    if (!namespace.startsWith(NEGATED_NAMESPACE_PREFIX)) {
      const negatedNamespace = NEGATED_NAMESPACE_PREFIX + namespace;
      if (set.has(negatedNamespace)) {
        set.delete(negatedNamespace);
      }
    }
    set.add(namespace);
  }
  setNamespaces(Array.from(set));
}
function getNamespaces() {
  return toArray(getSharedDebugLibInstance().load() ?? "");
}
function getSharedDebugLibInstance() {
  if (!isInObsidian()) {
    return import_debug.default;
  }
  return getObsidianDevUtilsState(null, "debug", import_debug.default).value;
}
function logWithCaller(namespace, framesToSkip, message, ...args) {
  if (!getSharedDebugLibInstance().enabled(namespace)) {
    return;
  }
  if (!isInObsidian()) {
    console.debug(message, ...args);
    return;
  }
  const CALLER_LINE_INDEX = 4;
  const stackLines = ensureNonNullable(new Error().stack).split("\n");
  stackLines.splice(0, CALLER_LINE_INDEX + framesToSkip);
  console.debug(message, ...args, "\n\n---\nLogger stack trace:\n", makeStackTraceError(stackLines.join("\n")));
}
function makeStackTraceError(stackTrace) {
  return new CustomStackTraceError(
    "Debug mode: intentional placeholder error. See https://github.com/mnaoumov/obsidian-dev-utils/blob/main/docs/debugging.md.",
    stackTrace,
    void 0
  );
}
function setNamespaces(namespaces) {
  getSharedDebugLibInstance().enable(toArray(namespaces).join(NAMESPACE_SEPARATOR));
}
function toArray(namespaces) {
  return typeof namespaces === "string" ? namespaces.split(NAMESPACE_SEPARATOR).filter(Boolean) : namespaces.flatMap(toArray);
}

// node_modules/obsidian-dev-utils/dist/lib/esm/reg-exp.mjs
(function initEsm12() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();

// node_modules/obsidian-dev-utils/dist/lib/esm/value-provider.mjs
(function initEsm13() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();

// node_modules/obsidian-dev-utils/dist/lib/esm/string.mjs
(function initEsm14() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var ESCAPE_MAP = {
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\b": "\\b",
  "\f": "\\f",
  "'": "\\'",
  '"': '\\"',
  "\\": "\\\\"
};
var UNESCAPE_MAP = {};
for (const [key, value] of Object.entries(ESCAPE_MAP)) {
  UNESCAPE_MAP[value] = key;
}

// node_modules/obsidian-dev-utils/dist/lib/esm/object-utils.mjs
(function initEsm15() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var equalityComparerEntries = createEqualityComparerEntries(
  [
    { constructor: ArrayBuffer, equalityComparer: deepEqualArrayBuffer },
    { constructor: Date, equalityComparer: deepEqualDate },
    { constructor: RegExp, equalityComparer: deepEqualRegExp },
    { constructor: Map, equalityComparer: deepEqualMap },
    { constructor: Set, equalityComparer: deepEqualSet }
  ]
);
function castTo(value) {
  return value;
}
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  const aConstructor = a.constructor;
  const bConstructor = b.constructor;
  if (aConstructor !== bConstructor) {
    return false;
  }
  if (aConstructor !== Object) {
    const result = deepEqualTyped(a, b);
    if (result !== void 0) {
      return result;
    }
  }
  const keysA = getAllKeys(a);
  const keysB = getAllKeys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  const aRecord = ensureGenericObject(a);
  const bRecord = ensureGenericObject(b);
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(aRecord[key], bRecord[key])) {
      return false;
    }
  }
  return true;
}
function getAllKeys(obj) {
  const keys = [];
  let current = obj;
  while (current) {
    const descriptors = Object.getOwnPropertyDescriptors(current);
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (key === "__proto__") {
        continue;
      }
      if (typeof descriptor.value === "function") {
        continue;
      }
      const hasGetter = typeof descriptor.get === "function";
      const hasSetter = typeof descriptor.set === "function";
      if (hasGetter || hasSetter) {
        if (hasGetter && hasSetter) {
          keys.push(key);
        }
        continue;
      }
      if (descriptor.enumerable && descriptor.writable) {
        keys.push(key);
      }
    }
    current = Object.getPrototypeOf(current);
  }
  return keys.sort();
}
function createEqualityComparerEntries(entries) {
  return entries;
}
function deepEqualArrayBuffer(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  const viewA = new Uint8Array(a);
  const viewB = new Uint8Array(b);
  return deepEqual(viewA, viewB);
}
function deepEqualDate(a, b) {
  return a.getTime() === b.getTime();
}
function deepEqualMap(a, b) {
  if (a.size !== b.size) {
    return false;
  }
  for (const [key, value] of a.entries()) {
    if (!b.has(key) || !deepEqual(value, b.get(key))) {
      return false;
    }
  }
  return true;
}
function deepEqualRegExp(a, b) {
  return a.source === b.source && a.flags === b.flags;
}
function deepEqualSet(a, b) {
  if (a.size !== b.size) {
    return false;
  }
  for (const valueA of a) {
    if (b.has(valueA)) {
      continue;
    }
    let found = false;
    for (const valueB of b) {
      if (deepEqual(valueA, valueB)) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }
  return true;
}
function deepEqualTyped(a, b) {
  for (const { constructor, equalityComparer } of equalityComparerEntries) {
    if (a instanceof constructor && b instanceof constructor) {
      return equalityComparer(a, b);
    }
  }
  return void 0;
}

// node_modules/obsidian-dev-utils/dist/lib/esm/async.mjs
(function initEsm16() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
async function addErrorHandler(asyncFn, stackTrace) {
  stackTrace ??= getStackTrace(1);
  try {
    await asyncFn();
  } catch (asyncError) {
    const wrappedError = new CustomStackTraceError(ASYNC_WRAPPER_ERROR_MESSAGE, stackTrace, asyncError);
    if (handleSilentError(wrappedError)) {
      return;
    }
    emitAsyncErrorEvent(wrappedError);
  }
}
function convertAsyncToSync(asyncFunc, stackTrace) {
  stackTrace ??= getStackTrace(1);
  return (...args) => {
    assertNonNullable(stackTrace);
    const innerStackTrace = getStackTrace(1);
    stackTrace = `${stackTrace}
    at --- convertAsyncToSync --- (0)
${innerStackTrace}`;
    invokeAsyncSafely(() => asyncFunc(...args), stackTrace);
  };
}
function handleSilentError(error) {
  let cause = error;
  while (!(cause instanceof SilentError)) {
    if (!(cause instanceof Error)) {
      return false;
    }
    cause = cause.cause;
  }
  getLibDebugger("Async:handleSilentError")(error);
  return true;
}
function invokeAsyncSafely(asyncFn, stackTrace) {
  stackTrace ??= getStackTrace(1);
  void addErrorHandler(asyncFn, stackTrace);
}
function invokeAsyncSafelyAfterDelay(asyncFn, delayInMilliseconds = 0, stackTrace, abortSignal) {
  abortSignal ??= abortSignalNever();
  abortSignal.throwIfAborted();
  stackTrace ??= getStackTrace(1);
  invokeAsyncSafely(async () => {
    await sleep(delayInMilliseconds, abortSignal, true);
    await asyncFn(abortSignal);
  }, stackTrace);
}
async function sleep(milliseconds, abortSignal, shouldThrowOnAbort) {
  await waitForAbort(abortSignalAny(abortSignal, abortSignalTimeout(milliseconds)));
  if (shouldThrowOnAbort) {
    abortSignal?.throwIfAborted();
  }
}

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/workspace.mjs
(function initEsm17() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
function getAllContainers(app) {
  const containers = /* @__PURE__ */ new Set();
  app.workspace.iterateAllLeaves((leaf) => {
    containers.add(leaf.getContainer());
  });
  return Array.from(containers);
}
function getAllDomWindows(app) {
  return getAllContainers(app).map((container) => container.win);
}

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/components/all-windows-event-handler.mjs
(function initEsm18() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var AllWindowsEventHandler = class {
  /**
   * Creates a new instance of the `AllWindowsEventHandler` class.
   *
   * @param app - The Obsidian app instance.
   * @param component - The component to register the event on.
   */
  constructor(app, component) {
    this.app = app;
    this.component = component;
  }
  app;
  component;
  /**
   * Registers a DOM event for all documents (main window document and all existing/future popup window documents).
   *
   * @typeParam DocumentEventType - The type of the event.
   * @param type - The type of the event.
   * @param callback - The callback to execute.
   * @param options - The options for the event.
   */
  registerAllDocumentsDomEvent(type, callback, options) {
    this.registerAllWindowsHandler((win) => {
      this.component.registerDomEvent(win.document, type, callback, options);
    });
  }
  /**
   * Registers a DOM event for all windows (main window and all existing/future popup windows).
   *
   * @typeParam WindowEventType - The type of the event.
   * @param type - The type of the event.
   * @param callback - The callback to execute.
   * @param options - The options for the event.
   */
  registerAllWindowsDomEvent(type, callback, options) {
    this.registerAllWindowsHandler((win) => {
      this.component.registerDomEvent(win, type, callback, options);
    });
  }
  /**
   * Registers a handler for all windows (main window and all existing/future popup windows).
   *
   * @param allWindowsHandler - The handler for all windows.
   */
  registerAllWindowsHandler(allWindowsHandler) {
    const mainWindow = window;
    allWindowsHandler(mainWindow);
    this.app.workspace.onLayoutReady(() => {
      for (const win of getAllDomWindows(this.app)) {
        if (win === mainWindow) {
          continue;
        }
        allWindowsHandler(win);
      }
      this.component.registerEvent(this.app.workspace.on("window-open", (workspaceWindow) => {
        allWindowsHandler(workspaceWindow.win);
      }));
    });
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/components/async-events-component.mjs
var import_obsidian = require("obsidian");
(function initEsm19() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var AsyncEventsComponent = class extends import_obsidian.Component {
  /**
   * The async events.
   */
  asyncEvents = new AsyncEvents();
  /**
   * Registers an async event.
   *
   * @param eventRef - The event reference.
   */
  registerAsyncEvent(eventRef) {
    registerAsyncEvent(this, eventRef);
  }
};
function registerAsyncEvent(component, eventRef) {
  component.register(() => {
    eventRef.asyncEvents.offref(eventRef);
  });
}

// node_modules/i18next/dist/esm/i18next.js
var isString = (obj) => typeof obj === "string";
var defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
var makeString = (object) => {
  if (object == null) return "";
  return String(object);
};
var copy = (a, s, t3) => {
  a.forEach((m) => {
    if (s[m]) t3[m] = s[m];
  });
};
var lastOfPathSeparatorRegExp = /###/g;
var cleanKey = (key) => key && key.includes("###") ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
var canNotTraverseDeeper = (object) => !object || isString(object);
var getLastOfPath = (object, path, Empty) => {
  const stack = !isString(path) ? path : path.split(".");
  let stackIndex = 0;
  while (stackIndex < stack.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack[stackIndex])
  };
};
var setPath = (object, path, newValue) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  if (obj !== void 0 || path.length === 1) {
    obj[k] = newValue;
    return;
  }
  let e = path[path.length - 1];
  let p = path.slice(0, path.length - 1);
  let last = getLastOfPath(object, p, Object);
  while (last.obj === void 0 && p.length) {
    e = `${p[p.length - 1]}.${e}`;
    p = p.slice(0, p.length - 1);
    last = getLastOfPath(object, p, Object);
    if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") {
      last.obj = void 0;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
var pushPath = (object, path, newValue, concat) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  obj[k] = obj[k] || [];
  obj[k].push(newValue);
};
var getPath = (object, path) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path);
  if (!obj) return void 0;
  if (!Object.prototype.hasOwnProperty.call(obj, k)) return void 0;
  return obj[k];
};
var getPathWithDefaults = (data, defaultData, key) => {
  const value = getPath(data, key);
  if (value !== void 0) {
    return value;
  }
  return getPath(defaultData, key);
};
var deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== "__proto__" && prop !== "constructor") {
      if (prop in target) {
        if (isString(target[prop]) || target[prop] instanceof String || isString(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
var regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
var escape = (data) => {
  if (isString(data)) {
    return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
  }
  return data;
};
var RegExpCache = class {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = /* @__PURE__ */ new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== void 0) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
};
var chars = [" ", ",", "?", "!", ";"];
var looksLikeObjectPathRegExpCache = new RegExpCache(20);
var looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || "";
  keySeparator = keySeparator || "";
  const possibleChars = chars.filter((c) => !nsSeparator.includes(c) && !keySeparator.includes(c));
  if (possibleChars.length === 0) return true;
  const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
  let matched = !r.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
};
var deepFind = (obj, path, keySeparator = ".") => {
  if (!obj) return void 0;
  if (obj[path]) {
    if (!Object.prototype.hasOwnProperty.call(obj, path)) return void 0;
    return obj[path];
  }
  const tokens = path.split(keySeparator);
  let current = obj;
  for (let i = 0; i < tokens.length; ) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    let next;
    let nextPath = "";
    for (let j = i; j < tokens.length; ++j) {
      if (j !== i) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j];
      next = current[nextPath];
      if (next !== void 0) {
        if (["string", "number", "boolean"].includes(typeof next) && j < tokens.length - 1) {
          continue;
        }
        i += j - i + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
var getCleanedCode = (code) => code?.replace(/_/g, "-");
var consoleLogger = {
  type: "logger",
  log(args) {
    this.output("log", args);
  },
  warn(args) {
    this.output("warn", args);
  },
  error(args) {
    this.output("error", args);
  },
  output(type, args) {
    console?.[type]?.apply?.(console, args);
  }
};
var Logger = class _Logger {
  constructor(concreteLogger, options = {}) {
    this.init(concreteLogger, options);
  }
  init(concreteLogger, options = {}) {
    this.prefix = options.prefix || "i18next:";
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log(...args) {
    return this.forward(args, "log", "", true);
  }
  warn(...args) {
    return this.forward(args, "warn", "", true);
  }
  error(...args) {
    return this.forward(args, "error", "");
  }
  deprecate(...args) {
    return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    args = args.map((a) => isString(a) ? a.replace(/[\r\n\x00-\x1F\x7F]/g, " ") : a);
    if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new _Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new _Logger(this.logger, options);
  }
};
var baseLogger = new Logger();
var EventEmitter = class {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(" ").forEach((event) => {
      if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event].delete(listener);
  }
  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
    return this;
  }
  emit(event, ...args) {
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer(...args);
        }
      });
    }
    if (this.observers["*"]) {
      const cloned = Array.from(this.observers["*"].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer(event, ...args);
        }
      });
    }
  }
};
var ResourceStore = class extends EventEmitter {
  constructor(data, options = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    if (this.options.ignoreJSONStructure === void 0) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (!this.options.ns.includes(ns)) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index = this.options.ns.indexOf(ns);
    if (index > -1) {
      this.options.ns.splice(index, 1);
    }
  }
  getResource(lng, ns, key, options = {}) {
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path;
    if (lng.includes(".")) {
      path = lng.split(".");
    } else {
      path = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path.push(...key);
        } else if (isString(key) && keySeparator) {
          path.push(...key.split(keySeparator));
        } else {
          path.push(key);
        }
      }
    }
    const result = getPath(this.data, path);
    if (!result && !ns && !key && lng.includes(".")) {
      lng = path[0];
      ns = path[1];
      key = path.slice(2).join(".");
    }
    if (result || !ignoreJSONStructure || !isString(key)) return result;
    return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
  }
  addResource(lng, ns, key, value, options = {
    silent: false
  }) {
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let path = [lng, ns];
    if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.includes(".")) {
      path = lng.split(".");
      value = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path, value);
    if (!options.silent) this.emit("added", lng, ns, key, value);
  }
  addResources(lng, ns, resources, options = {
    silent: false
  }) {
    for (const m in resources) {
      if (isString(resources[m]) || Array.isArray(resources[m])) this.addResource(lng, ns, m, resources[m], {
        silent: true
      });
    }
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  addResourceBundle(lng, ns, resources, deep, overwrite, options = {
    silent: false,
    skipCopy: false
  }) {
    let path = [lng, ns];
    if (lng.includes(".")) {
      path = lng.split(".");
      deep = resources;
      resources = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path) || {};
    if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
    if (deep) {
      deepExtend(pack, resources, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources
      };
    }
    setPath(this.data, path, pack);
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit("removed", lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== void 0;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n = data && Object.keys(data) || [];
    return !!n.find((v) => data[v] && Object.keys(data[v]).length > 0);
  }
  toJSON() {
    return this.data;
  }
};
var postProcessor = {
  processors: {},
  addPostProcessor(module2) {
    this.processors[module2.name] = module2;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach((processor) => {
      value = this.processors[processor]?.process(value, key, options, translator) ?? value;
    });
    return value;
  }
};
var PATH_KEY = /* @__PURE__ */ Symbol("i18next/PATH_KEY");
function createProxy() {
  const state = [];
  const handler = /* @__PURE__ */ Object.create(null);
  let proxy;
  handler.get = (target, key) => {
    proxy?.revoke?.();
    if (key === PATH_KEY) return state;
    state.push(key);
    proxy = Proxy.revocable(target, handler);
    return proxy.proxy;
  };
  return Proxy.revocable(/* @__PURE__ */ Object.create(null), handler).proxy;
}
function keysFromSelector(selector, opts) {
  const {
    [PATH_KEY]: path
  } = selector(createProxy());
  const keySeparator = opts?.keySeparator ?? ".";
  const nsSeparator = opts?.nsSeparator ?? ":";
  const strict = opts?.enableSelector === "strict";
  if (path.length > 1 && nsSeparator) {
    const ns = opts?.ns;
    const nsList = strict ? Array.isArray(ns) ? ns : ns ? [ns] : null : Array.isArray(ns) ? ns : null;
    if (nsList) {
      const candidates = strict ? nsList : nsList.length > 1 ? nsList.slice(1) : [];
      if (candidates.includes(path[0])) {
        return `${path[0]}${nsSeparator}${path.slice(1).join(keySeparator)}`;
      }
    }
  }
  return path.join(keySeparator);
}
var shouldHandleAsObject = (res) => !isString(res) && typeof res !== "boolean" && typeof res !== "number";
var Translator = class _Translator extends EventEmitter {
  constructor(services, options = {}) {
    super();
    copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    this.logger = baseLogger.create("translator");
    this.checkedLoadedFor = {};
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key, o = {
    interpolation: {}
  }) {
    const opt = {
      ...o
    };
    if (key == null) return false;
    const resolved = this.resolve(key, opt);
    if (resolved?.res === void 0) return false;
    const isObject = shouldHandleAsObject(resolved.res);
    if (opt.returnObjects === false && isObject) {
      return false;
    }
    return true;
  }
  extractFromKey(key, opt) {
    let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
    let namespaces = opt.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.includes(nsSeparator);
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !opt.keySeparator && !this.options.userDefinedNsSeparator && !opt.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m = key.match(this.interpolator.nestingRegexp);
      if (m && m.length > 0) {
        return {
          key,
          namespaces: isString(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.includes(parts[0])) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, o, lastKey) {
    let opt = typeof o === "object" ? {
      ...o
    } : o;
    if (typeof opt !== "object" && this.options.overloadTranslationOptionHandler) {
      opt = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof opt === "object") opt = {
      ...opt
    };
    if (!opt) opt = {};
    if (keys == null) return "";
    if (typeof keys === "function") keys = keysFromSelector(keys, {
      ...this.options,
      ...opt
    });
    if (!Array.isArray(keys)) keys = [String(keys)];
    keys = keys.map((k) => typeof k === "function" ? keysFromSelector(k, {
      ...this.options,
      ...opt
    }) : String(k));
    const returnDetails = opt.returnDetails !== void 0 ? opt.returnDetails : this.options.returnDetails;
    const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], opt);
    const namespace = namespaces[namespaces.length - 1];
    let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const lng = opt.lng || this.language;
    const appendNamespaceToCIMode = opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng?.toLowerCase() === "cimode") {
      if (appendNamespaceToCIMode) {
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(opt)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(opt)
        };
      }
      return key;
    }
    const resolved = this.resolve(keys, opt);
    let res = resolved?.res;
    const resUsedKey = resolved?.usedKey || key;
    const resExactUsedKey = resolved?.exactUsedKey || key;
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
    const joinArrays = opt.joinArrays !== void 0 ? opt.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const needsPluralHandling = opt.count !== void 0 && !isString(opt.count);
    const hasDefaultValue = _Translator.hasDefaultValue(opt);
    const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, opt) : "";
    const defaultValueSuffixOrdinalFallback = opt.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, {
      ordinal: false
    }) : "";
    const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
    const defaultValue = needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] || opt[`defaultValue${defaultValueSuffix}`] || opt[`defaultValue${defaultValueSuffixOrdinalFallback}`] || opt.defaultValue;
    let resForObjHndl = res;
    if (handleAsObjectInI18nFormat && !res && hasDefaultValue) {
      resForObjHndl = defaultValue;
    }
    const handleAsObject = shouldHandleAsObject(resForObjHndl);
    const resType = Object.prototype.toString.apply(resForObjHndl);
    if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && !noObject.includes(resType) && !(isString(joinArrays) && Array.isArray(resForObjHndl))) {
      if (!opt.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        }
        const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
          ...opt,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved.res = r;
          resolved.usedParams = this.getUsedParamsDetails(opt);
          return resolved;
        }
        return r;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(resForObjHndl);
        const copy2 = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m in resForObjHndl) {
          if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m}`;
            if (hasDefaultValue && !res) {
              copy2[m] = this.translate(deepKey, {
                ...opt,
                defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : void 0,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            } else {
              copy2[m] = this.translate(deepKey, {
                ...opt,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            }
            if (copy2[m] === deepKey) copy2[m] = resForObjHndl[m];
          }
        }
        res = copy2;
      }
    } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, opt, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = opt.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, needsPluralHandling && !updateMissing ? `${key}${this.pluralResolver.getSuffix(lng, opt.count, opt)}` : key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...opt,
            keySeparator: false
          });
          if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, opt.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === "all") {
          lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
        } else {
          lngs.push(opt.lng || this.language);
        }
        const send = (l, k, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, opt);
          } else if (this.backendConnector?.saveMissing) {
            this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, opt);
          }
          this.emit("missingKey", l, namespace, k, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((language) => {
              const suffixes = this.pluralResolver.getSuffixes(language, opt);
              if (needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] && !suffixes.includes(`${this.options.pluralSeparator}zero`)) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach((suffix) => {
                send([language], key + suffix, opt[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, opt, resolved, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) {
        res = `${namespace}${nsSeparator}${key}`;
      }
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}${nsSeparator}${key}` : key, usedDefault ? res : void 0, opt);
      }
    }
    if (returnDetails) {
      resolved.res = res;
      resolved.usedParams = this.getUsedParamsDetails(opt);
      return resolved;
    }
    return res;
  }
  extendTranslation(res, key, opt, resolved, lastKey) {
    if (this.i18nFormat?.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...opt
      }, opt.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved
      });
    } else if (!opt.skipInterpolation) {
      if (opt.interpolation) this.interpolator.init({
        ...opt,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...opt.interpolation
          }
        }
      });
      const skipOnVariables = isString(res) && (opt?.interpolation?.skipOnVariables !== void 0 ? opt.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = opt.replace && !isString(opt.replace) ? opt.replace : opt;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, opt.lng || this.language || resolved.usedLng, opt);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) opt.nest = false;
      }
      if (!opt.lng && resolved && resolved.res) opt.lng = this.language || resolved.usedLng;
      if (opt.nest !== false) res = this.interpolator.nest(res, (...args) => {
        if (lastKey?.[0] === args[0] && !opt.context) {
          this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return this.translate(...args, key);
      }, opt);
      if (opt.interpolation) this.interpolator.reset();
    }
    const postProcess = opt.postProcess || this.options.postProcess;
    const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
    if (res != null && postProcessorNames?.length && opt.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved,
          usedParams: this.getUsedParamsDetails(opt)
        },
        ...opt
      } : opt, this);
    }
    return res;
  }
  resolve(keys, opt = {}) {
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString(keys)) keys = [keys];
    if (Array.isArray(keys)) keys = keys.map((k) => typeof k === "function" ? keysFromSelector(k, {
      ...this.options,
      ...opt
    }) : k);
    keys.forEach((k) => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k, opt);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = opt.count !== void 0 && !isString(opt.count);
      const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
      const needsContextHandling = opt.context !== void 0 && (isString(opt.context) || typeof opt.context === "number") && opt.context !== "";
      const codes = opt.lngs ? opt.lngs : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);
      namespaces.forEach((ns) => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!this.checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(usedNS)) {
          this.checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        }
        codes.forEach((code) => {
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat?.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, opt.count, opt);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              if (opt.ordinal && pluralSuffix.startsWith(ordinalPrefix)) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              finalKeys.push(key + pluralSuffix);
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator || "_"}${opt.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                if (opt.ordinal && pluralSuffix.startsWith(ordinalPrefix)) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                finalKeys.push(contextKey + pluralSuffix);
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, opt);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
  }
  getResource(code, ns, key, options = {}) {
    if (this.i18nFormat?.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails(options = {}) {
    const optionsKeys = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"];
    const useOptionsReplaceForData = options.replace && !isString(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== "undefined") {
      data.count = options.count;
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = "defaultValue";
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && option.startsWith(prefix) && void 0 !== options[option]) {
        return true;
      }
    }
    return false;
  }
};
var LanguageUtil = class {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create("languageUtils");
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || !code.includes("-")) return null;
    const p = code.split("-");
    if (p.length === 2) return null;
    p.pop();
    if (p[p.length - 1].toLowerCase() === "x") return null;
    return this.formatLanguageCode(p.join("-"));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || !code.includes("-")) return code;
    const p = code.split("-");
    return this.formatLanguageCode(p[0]);
  }
  formatLanguageCode(code) {
    if (isString(code) && code.includes("-")) {
      let formattedCode;
      try {
        formattedCode = Intl.getCanonicalLocales(code)[0];
      } catch (e) {
      }
      if (formattedCode && this.options.lowerCaseLng) {
        formattedCode = formattedCode.toLowerCase();
      }
      if (formattedCode) return formattedCode;
      if (this.options.lowerCaseLng) {
        return code.toLowerCase();
      }
      return code;
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.includes(code);
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach((code) => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach((code) => {
        if (found) return;
        const lngScOnly = this.getScriptPartFromCode(code);
        if (this.isSupportedCode(lngScOnly)) return found = lngScOnly;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find((supportedLng) => {
          if (supportedLng === lngOnly) return true;
          if (!supportedLng.includes("-") && !lngOnly.includes("-")) return false;
          if (supportedLng.includes("-") && !lngOnly.includes("-") && supportedLng.slice(0, supportedLng.indexOf("-")) === lngOnly) return true;
          if (supportedLng.startsWith(lngOnly) && lngOnly.length > 1) return true;
          return false;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === "function") fallbacks = fallbacks(code);
    if (isString(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes((fallbackCode === false ? [] : fallbackCode) || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = (c) => {
      if (!c) return;
      if (this.isSupportedCode(c)) {
        codes.push(c);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
      }
    };
    if (isString(code) && (code.includes("-") || code.includes("_"))) {
      if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
    } else if (isString(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach((fc) => {
      if (!codes.includes(fc)) addCode(this.formatLanguageCode(fc));
    });
    return codes;
  }
};
var suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
var dummyRule = {
  select: (count) => count === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
var PluralResolver = class {
  constructor(languageUtils, options = {}) {
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create("pluralResolver");
    this.pluralRulesCache = {};
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code, options = {}) {
    const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
    const type = options.ordinal ? "ordinal" : "cardinal";
    const cacheKey = JSON.stringify({
      cleanedCode,
      type
    });
    if (cacheKey in this.pluralRulesCache) {
      return this.pluralRulesCache[cacheKey];
    }
    let rule;
    try {
      rule = new Intl.PluralRules(cleanedCode, {
        type
      });
    } catch (err) {
      if (typeof Intl === "undefined") {
        this.logger.error("No Intl support, please use an Intl polyfill!");
        return dummyRule;
      }
      if (!code.match(/-|_/)) return dummyRule;
      const lngPart = this.languageUtils.getLanguagePartFromCode(code);
      rule = this.getRule(lngPart, options);
    }
    this.pluralRulesCache[cacheKey] = rule;
    return rule;
  }
  needsPlural(code, options = {}) {
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule("dev", options);
    return rule?.resolvedOptions().pluralCategories.length > 1;
  }
  getPluralFormsOfKey(code, key, options = {}) {
    return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
  }
  getSuffixes(code, options = {}) {
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule("dev", options);
    if (!rule) return [];
    return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
  }
  getSuffix(code, count, options = {}) {
    const rule = this.getRule(code, options);
    if (rule) {
      return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return this.getSuffix("dev", count, options);
  }
};
var deepFindWithDefaults = (data, defaultData, key, keySeparator = ".", ignoreJSONStructure = true) => {
  let path = getPathWithDefaults(data, defaultData, key);
  if (!path && ignoreJSONStructure && isString(key)) {
    path = deepFind(data, key, keySeparator);
    if (path === void 0) path = deepFind(defaultData, key, keySeparator);
  }
  return path;
};
var regexSafe = (val) => val.replace(/\$/g, "$$$$");
var Interpolator = class {
  constructor(options = {}) {
    this.logger = baseLogger.create("interpolator");
    this.options = options;
    this.format = options?.interpolation?.format || ((value) => value);
    this.init(options);
  }
  init(options = {}) {
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$1,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$1 !== void 0 ? escape$1 : escape;
    this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
    this.formatSeparator = formatSeparator || ",";
    this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix ? regexEscape(unescapePrefix) : "-";
    this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix ? regexEscape(unescapeSuffix) : "";
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
    this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
    this.maxReplaces = maxReplaces || 1e3;
    this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp?.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, "g");
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = (key) => {
      if (!key.includes(this.formatSeparator)) {
        const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path, void 0, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path;
      }
      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
        ...options,
        ...data,
        interpolationkey: k
      });
    };
    this.resetRegExp();
    if (!this.escapeValue && typeof str === "string" && /\$t\([^)]*\{[^}]*\{\{/.test(str)) {
      this.logger.warn("nesting options string contains interpolated variables with escapeValue: false \u2014 if any of those values are attacker-controlled they can inject additional nesting options (e.g. redirect lng/ns). Sanitise untrusted input before passing it to t(), or keep escapeValue: true.");
    }
    const missingInterpolationHandler = options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options?.interpolation?.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: (val) => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach((todo) => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === void 0) {
          if (typeof missingInterpolationHandler === "function") {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString(temp) ? temp : "";
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = "";
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = "";
          }
        } else if (!isString(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc, options = {}) {
    let match;
    let value;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (!key.includes(sep)) return key;
      const c = key.split(new RegExp(`${regexEscape(sep)}[ ]*{`));
      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes || (matchedDoubleQuotes?.length ?? 0) % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.includes(this.prefix)) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      const keyEndIndex = /{.*}/.test(match[1]) ? match[1].lastIndexOf("}") + 1 : match[1].indexOf(this.formatSeparator);
      if (keyEndIndex !== -1) {
        formatters = match[1].slice(keyEndIndex).split(this.formatSeparator).map((elem) => elem.trim()).filter(Boolean);
        match[1] = match[1].slice(0, keyEndIndex);
      }
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && !isString(value)) return value;
      if (!isString(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = "";
      }
      if (formatters.length) {
        value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
};
var parseFormatStr = (formatStr) => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.includes("(")) {
    const p = formatStr.split("(");
    formatName = p[0].toLowerCase().trim();
    const optStr = p[1].slice(0, -1);
    if (formatName === "currency" && !optStr.includes(":")) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === "relativetime" && !optStr.includes(":")) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(";");
      opts.forEach((opt) => {
        if (opt) {
          const [key, ...rest] = opt.split(":");
          const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === "false") formatOptions[trimmedKey] = false;
          if (val === "true") formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
var createCachedFormatter = (fn) => {
  const cache = {};
  return (v, l, o) => {
    let optForCache = o;
    if (o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [o.interpolationkey]: void 0
      };
    }
    const key = l + JSON.stringify(optForCache);
    let frm = cache[key];
    if (!frm) {
      frm = fn(getCleanedCode(l), o);
      cache[key] = frm;
    }
    return frm(v);
  };
};
var createNonCachedFormatter = (fn) => (v, l, o) => fn(getCleanedCode(l), o)(v);
var Formatter = class {
  constructor(options = {}) {
    this.logger = baseLogger.create("formatter");
    this.options = options;
    this.init(options);
  }
  init(services, options = {
    interpolation: {}
  }) {
    this.formatSeparator = options.interpolation.formatSeparator || ",";
    const cf = options.cacheInBuiltFormats ? createCachedFormatter : createNonCachedFormatter;
    this.formats = {
      number: cf((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      currency: cf((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: "currency"
        });
        return (val) => formatter.format(val);
      }),
      datetime: cf((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      relativetime: cf((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val, opt.range || "day");
      }),
      list: cf((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      })
    };
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value, format, lng, options = {}) {
    if (!format) return value;
    if (value == null) return value;
    const formats = format.split(this.formatSeparator);
    if (formats.length > 1 && formats[0].indexOf("(") > 1 && !formats[0].includes(")") && formats.find((f) => f.includes(")"))) {
      const lastIndex = formats.findIndex((f) => f.includes(")"));
      formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
    }
    const result = formats.reduce((mem, f) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options?.formatParams?.[options.interpolationkey] || {};
          const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error) {
          this.logger.warn(error);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
};
var removePending = (q, name) => {
  if (q.pending[name] !== void 0) {
    delete q.pending[name];
    q.pendingCount--;
  }
};
var Connector = class extends EventEmitter {
  constructor(backend, store, services, options = {}) {
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create("backendConnector");
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    this.backend?.init?.(services, options.backend, options);
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach((lng) => {
      let hasAllNamespaces = true;
      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ;
        else if (this.state[name] === 1) {
          if (pending[name] === void 0) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === void 0) pending[name] = true;
          if (toLoad[name] === void 0) toLoad[name] = true;
          if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    if (err) this.emit("failedLoading", lng, ns, err);
    if (!err && data) {
      this.store.addResourceBundle(lng, ns, data, void 0, void 0, {
        skipCopy: true
      });
    }
    this.state[name] = err ? -1 : 2;
    if (err && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach((q) => {
      pushPath(q.loaded, [lng], ns);
      removePending(q, name);
      if (err) q.errors.push(err);
      if (q.pendingCount === 0 && !q.done) {
        Object.keys(q.loaded).forEach((l) => {
          if (!loaded[l]) loaded[l] = {};
          const loadedKeys = q.loaded[l];
          if (loadedKeys.length) {
            loadedKeys.forEach((n) => {
              if (loaded[l][n] === void 0) loaded[l][n] = true;
            });
          }
        });
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });
    this.emit("loaded", loaded);
    this.queue = this.queue.filter((q) => !q.done);
  }
  read(lng, ns, fcName, tried = 0, wait = this.retryTimeout, callback) {
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read(lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r = fc(lng, ns);
        if (r && typeof r.then === "function") {
          r.then((data) => resolver(null, data)).catch(resolver);
        } else {
          resolver(null, r);
        }
      } catch (err) {
        resolver(err);
      }
      return;
    }
    return fc(lng, ns, resolver);
  }
  prepareLoading(languages, namespaces, options = {}, callback) {
    if (!this.backend) {
      this.logger.warn("No backend was added via i18next.use. Will not load resources.");
      return callback && callback();
    }
    if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach((name) => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name, prefix = "") {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    this.read(lng, ns, "read", void 0, void 0, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate, options = {}, clb = () => {
  }) {
    if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (key === void 0 || key === null || key === "") return;
    if (this.backend?.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r;
          if (fc.length === 5) {
            r = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r = fc(languages, namespace, key, fallbackValue);
          }
          if (r && typeof r.then === "function") {
            r.then((data) => clb(null, data)).catch(clb);
          } else {
            clb(null, r);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
};
var get = () => ({
  debug: false,
  initAsync: true,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: "all",
  preload: false,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  enableSelector: false,
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: "fallback",
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: (args) => {
    let ret = {};
    if (typeof args[1] === "object") ret = args[1];
    if (isString(args[1])) ret.defaultValue = args[1];
    if (isString(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === "object" || typeof args[3] === "object") {
      const options = args[3] || args[2];
      Object.keys(options).forEach((key) => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: true
  },
  cacheInBuiltFormats: true
});
var transformOptions = (options) => {
  if (isString(options.ns)) options.ns = [options.ns];
  if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs && !options.supportedLngs.includes("cimode")) {
    options.supportedLngs = options.supportedLngs.concat(["cimode"]);
  }
  return options;
};
var noop2 = () => {
};
var bindMemberFunctions = (inst) => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach((mem) => {
    if (typeof inst[mem] === "function") {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
var I18n = class _I18n extends EventEmitter {
  constructor(options = {}, callback) {
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initAsync) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init(options = {}, callback) {
    this.isInitializing = true;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (options.defaultNS == null && options.ns) {
      if (isString(options.ns)) {
        options.defaultNS = options.ns;
      } else if (!options.ns.includes("translation")) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    this.options.interpolation = {
      ...defOpts.interpolation,
      ...this.options.interpolation
    };
    if (options.keySeparator !== void 0) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== void 0) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    if (typeof this.options.overloadTranslationOptionHandler !== "function") {
      this.options.overloadTranslationOptionHandler = defOpts.overloadTranslationOptionHandler;
    }
    const createClassOnDemand = (ClassOrObject) => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === "function") return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator
      });
      if (formatter) {
        s.formatter = createClassOnDemand(formatter);
        if (s.formatter.init) s.formatter.init(s, this.options);
        this.options.interpolation.format = s.formatter.format.bind(s.formatter);
      }
      s.interpolator = new Interpolator(this.options);
      s.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      s.backendConnector.on("*", (event, ...args) => {
        this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init) s.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on("*", (event, ...args) => {
        this.emit(event, ...args);
      });
      this.modules.external.forEach((m) => {
        if (m.init) m.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop2;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn("init: no languageDetector is used and no lng is defined");
    }
    const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
    storeApi.forEach((fcName) => {
      this[fcName] = (...args) => this.store[fcName](...args);
    });
    const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
    storeApiChained.forEach((fcName) => {
      this[fcName] = (...args) => {
        this.store[fcName](...args);
        return this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t3) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log("initialized", this.options);
        this.emit("initialized", this.options);
        deferred.resolve(t3);
        callback(err, t3);
      };
      if ((this.languages || this.isLanguageChangingTo) && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initAsync) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language, callback = noop2) {
    let usedCallback = callback;
    const usedLng = isString(language) ? language : this.language;
    if (typeof language === "function") usedCallback = language;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = (lng) => {
        if (!lng) return;
        if (lng === "cimode") return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l) => {
          if (l === "cimode") return;
          if (!toLoad.includes(l)) toLoad.push(l);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach((l) => append(l));
      } else {
        append(usedLng);
      }
      this.options.preload?.forEach?.((l) => append(l));
      this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === "function") {
      callback = lngs;
      lngs = void 0;
    }
    if (typeof ns === "function") {
      callback = ns;
      ns = void 0;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop2;
    this.services.backendConnector.reload(lngs, ns, (err) => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module2) {
    if (!module2) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!module2.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    if (module2.type === "backend") {
      this.modules.backend = module2;
    }
    if (module2.type === "logger" || module2.log && module2.warn && module2.error) {
      this.modules.logger = module2;
    }
    if (module2.type === "languageDetector") {
      this.modules.languageDetector = module2;
    }
    if (module2.type === "i18nFormat") {
      this.modules.i18nFormat = module2;
    }
    if (module2.type === "postProcessor") {
      postProcessor.addPostProcessor(module2);
    }
    if (module2.type === "formatter") {
      this.modules.formatter = module2;
    }
    if (module2.type === "3rdParty") {
      this.modules.external.push(module2);
    }
    return this;
  }
  setResolvedLanguage(l) {
    if (!l || !this.languages) return;
    if (["cimode", "dev"].includes(l)) return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (["cimode", "dev"].includes(lngInLngs)) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
    if (!this.resolvedLanguage && !this.languages.includes(l) && this.store.hasLanguageSomeTranslations(l)) {
      this.resolvedLanguage = l;
      this.languages.unshift(l);
    }
  }
  changeLanguage(lng, callback) {
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit("languageChanging", lng);
    const setLngProps = (l) => {
      this.language = l;
      this.languages = this.services.languageUtils.toResolveHierarchy(l);
      this.resolvedLanguage = void 0;
      this.setResolvedLanguage(l);
    };
    const done = (err, l) => {
      if (l) {
        if (this.isLanguageChangingTo === lng) {
          setLngProps(l);
          this.translator.changeLanguage(l);
          this.isLanguageChangingTo = void 0;
          this.emit("languageChanged", l);
          this.logger.log("languageChanged", l);
        }
      } else {
        this.isLanguageChangingTo = void 0;
      }
      deferred.resolve((...args) => this.t(...args));
      if (callback) callback(err, (...args) => this.t(...args));
    };
    const setLng = (lngs) => {
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const fl = isString(lngs) ? lngs : lngs && lngs[0];
      const l = this.store.hasLanguageSomeTranslations(fl) ? fl : this.services.languageUtils.getBestMatchFromCodes(isString(lngs) ? [lngs] : lngs);
      if (l) {
        if (!this.language) {
          setLngProps(l);
        }
        if (!this.translator.language) this.translator.changeLanguage(l);
        this.services.languageDetector?.cacheUserLanguage?.(l);
      }
      this.loadResources(l, (err) => {
        done(err, l);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix, fixedOpts) {
    const scopeNs = fixedOpts?.scopeNs;
    const fixedT = (key, opts, ...rest) => {
      let o;
      if (typeof opts !== "object") {
        o = this.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        o = {
          ...opts
        };
      }
      o.lng = o.lng || fixedT.lng;
      o.lngs = o.lngs || fixedT.lngs;
      const explicitCallNs = o.ns !== void 0 && o.ns !== null;
      o.ns = o.ns || fixedT.ns;
      if (o.keyPrefix !== "") o.keyPrefix = o.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const selectorOpts = {
        ...this.options,
        ...o
      };
      if (Array.isArray(scopeNs) && !explicitCallNs) selectorOpts.ns = scopeNs;
      if (typeof o.keyPrefix === "function") o.keyPrefix = keysFromSelector(o.keyPrefix, selectorOpts);
      const keySeparator = this.options.keySeparator || ".";
      let resultKey;
      if (o.keyPrefix && Array.isArray(key)) {
        resultKey = key.map((k) => {
          if (typeof k === "function") k = keysFromSelector(k, selectorOpts);
          return `${o.keyPrefix}${keySeparator}${k}`;
        });
      } else {
        if (typeof key === "function") key = keysFromSelector(key, selectorOpts);
        resultKey = o.keyPrefix ? `${o.keyPrefix}${keySeparator}${key}` : key;
      }
      return this.t(resultKey, o);
    };
    if (isString(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t(...args) {
    return this.translator?.translate(...args);
  }
  exists(...args) {
    return this.translator?.exists(...args);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns, options = {}) {
    if (!this.isInitialized) {
      this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === "cimode") return true;
    const loadNotPending = (l, n) => {
      const loadState = this.services.backendConnector.state[`${l}|${n}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== void 0) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString(ns)) ns = [ns];
    ns.forEach((n) => {
      if (!this.options.ns.includes(n)) this.options.ns.push(n);
    });
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter((lng) => !preloaded.includes(lng) && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng) lng = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language);
    if (!lng) return "rtl";
    try {
      const l = new Intl.Locale(lng);
      if (l && l.getTextInfo) {
        const ti = l.getTextInfo();
        if (ti && ti.direction) return ti.direction;
      }
    } catch (e) {
    }
    const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
    const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
    if (lng.toLowerCase().indexOf("-latn") > 1) return "ltr";
    return rtlLngs.includes(languageUtils.getLanguagePartFromCode(lng)) || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(options = {}, callback) {
    const instance2 = new _I18n(options, callback);
    instance2.createInstance = _I18n.createInstance;
    return instance2;
  }
  cloneInstance(options = {}, callback = noop2) {
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new _I18n(mergedOptions);
    if (options.debug !== void 0 || options.prefix !== void 0) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ["store", "services", "language"];
    membersToCopy.forEach((m) => {
      clone[m] = this[m];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      const clonedData = Object.keys(this.store.data).reduce((prev, l) => {
        prev[l] = {
          ...this.store.data[l]
        };
        prev[l] = Object.keys(prev[l]).reduce((acc, n) => {
          acc[n] = {
            ...prev[l][n]
          };
          return acc;
        }, prev[l]);
        return prev;
      }, {});
      clone.store = new ResourceStore(clonedData, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    if (options.interpolation) {
      const defOpts = get();
      const mergedInterpolation = {
        ...defOpts.interpolation,
        ...this.options.interpolation,
        ...options.interpolation
      };
      const mergedForInterpolator = {
        ...mergedOptions,
        interpolation: mergedInterpolation
      };
      clone.services.interpolator = new Interpolator(mergedForInterpolator);
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on("*", (event, ...args) => {
      clone.emit(event, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
};
var instance = I18n.createInstance();
var createInstance = instance.createInstance;
var dir = instance.dir;
var init = instance.init;
var loadResources = instance.loadResources;
var reloadResources = instance.reloadResources;
var use = instance.use;
var changeLanguage = instance.changeLanguage;
var getFixedT = instance.getFixedT;
var t = instance.t;
var exists = instance.exists;
var setDefaultNamespace = instance.setDefaultNamespace;
var hasLoadedNamespace = instance.hasLoadedNamespace;
var loadNamespaces = instance.loadNamespaces;
var loadLanguages = instance.loadLanguages;

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/i18n/i18n.mjs
var import_obsidian2 = require("obsidian");

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/i18n/locales/en.mjs
(function initEsm20() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var en = {
  obsidianDevUtils: {
    asyncWithNotice: {
      milliseconds: "milliseconds...",
      operation: "Operation",
      runningFor: "Running for",
      terminateOperation: "You can terminate the operation by clicking the button below, but be aware it might leave the vault in an inconsistent state.",
      timedOut: "The operation timed out after {{duration, number}} milliseconds."
    },
    buttons: {
      cancel: "Cancel",
      ok: "OK"
    },
    callout: {
      loadContent: "Load content for callout"
    },
    dataview: {
      itemsPerPage: "Items per page:",
      jumpToPage: "Jump to page:",
      pageHeader: "Page {{pageNumber, number}} of {{totalPages, number}}, Total items: {{totalItems, number}}"
    },
    metadataCache: {
      getBacklinksForFilePath: "Get backlinks for {{filePath}}"
    },
    notices: {
      attachmentIsStillUsed: "Attachment {{attachmentPath}} is still used by other notes. It will not be deleted.",
      unhandledError: "An unhandled error occurred. Please check the console for more information."
    },
    queue: {
      flushQueue: "Flush queue"
    },
    renameDeleteHandler: {
      handleDelete: "Handle delete: {{filePath}}",
      handleOrphanedRenames: "Handle orphaned renames",
      handleRename: "Handle rename: {{oldPath}} -> {{newPath}}",
      updatedLinks: "Updated {{linksCount, number}} links in {{filesCount, number}} files."
    },
    vault: {
      processFile: "Process file {{filePath}}"
    }
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/i18n/locales/translations-map.mjs
(function initEsm21() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var DEFAULT_LANGUAGE = "en";
var translationsMapImpl = {
  en
};
var defaultTranslationsMap = translationsMapImpl;

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/i18n/i18n.mjs
(function initEsm22() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var DEFAULT_NS = "translation";
var isInitialized = false;
async function initI18N(translationsMap, isAsync = true) {
  if (isInitialized) {
    return;
  }
  isInitialized = true;
  await init({
    fallbackLng: DEFAULT_LANGUAGE,
    initAsync: isAsync,
    interpolation: {
      escapeValue: false
    },
    lng: (0, import_obsidian2.getLanguage)(),
    resources: Object.fromEntries(
      Object.entries(translationsMap).map(([language, translations]) => [
        language,
        {
          [DEFAULT_NS]: translations
        }
      ])
    ),
    returnEmptyString: false,
    returnNull: false
  });
  instance.addResourceBundle(DEFAULT_LANGUAGE, DEFAULT_NS, en, true, false);
}
function tImpl(selector, options) {
  if (!isInitialized) {
    console.warn("I18N was not initialized, initializing default obsidian-dev-utils translations");
    invokeAsyncSafely(() => initI18N(defaultTranslationsMap, false));
  }
  if (!options) {
    return t(selector);
  }
  return t(selector, options);
}
var t2 = tImpl;

// node_modules/compare-versions/lib/esm/utils.js
var semver = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
var validateAndParse = (version) => {
  if (typeof version !== "string") {
    throw new TypeError("Invalid argument expected string");
  }
  const match = version.match(semver);
  if (!match) {
    throw new Error(`Invalid argument not valid semver ('${version}' received)`);
  }
  match.shift();
  return match;
};
var isWildcard = (s) => s === "*" || s === "x" || s === "X";
var tryParse = (v) => {
  const n = parseInt(v, 10);
  return isNaN(n) ? v : n;
};
var forceType = (a, b) => typeof a !== typeof b ? [String(a), String(b)] : [a, b];
var compareStrings = (a, b) => {
  if (isWildcard(a) || isWildcard(b))
    return 0;
  const [ap, bp] = forceType(tryParse(a), tryParse(b));
  if (ap > bp)
    return 1;
  if (ap < bp)
    return -1;
  return 0;
};
var compareSegments = (a, b) => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const r = compareStrings(a[i] || "0", b[i] || "0");
    if (r !== 0)
      return r;
  }
  return 0;
};

// node_modules/compare-versions/lib/esm/compareVersions.js
var compareVersions = (v1, v2) => {
  const n1 = validateAndParse(v1);
  const n2 = validateAndParse(v2);
  const p1 = n1.pop();
  const p2 = n2.pop();
  const r = compareSegments(n1, n2);
  if (r !== 0)
    return r;
  if (p1 && p2) {
    return compareSegments(p1.split("."), p2.split("."));
  } else if (p1 || p2) {
    return p1 ? -1 : 1;
  }
  return 0;
};

// node_modules/obsidian-dev-utils/dist/lib/esm/css-class.mjs
(function initEsm23() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var CssClass = /* @__PURE__ */ ((CssClass2) => {
  CssClass2["AlertModal"] = "alert-modal";
  CssClass2["CancelButton"] = "cancel-button";
  CssClass2["CheckboxComponent"] = "checkbox-component";
  CssClass2["CodeHighlighterComponent"] = "code-highlighter-component";
  CssClass2["ConfirmModal"] = "confirm-modal";
  CssClass2["DateComponent"] = "date-component";
  CssClass2["DateTimeComponent"] = "datetime-component";
  CssClass2["EmailComponent"] = "email-component";
  CssClass2["FileComponent"] = "file-component";
  CssClass2["IsPlaceholder"] = "is-placeholder";
  CssClass2["LibraryName"] = "obsidian-dev-utils";
  CssClass2["MonthComponent"] = "month-component";
  CssClass2["MultipleDropdownComponent"] = "multiple-dropdown-component";
  CssClass2["MultipleEmailComponent"] = "multiple-email-component";
  CssClass2["MultipleFileComponent"] = "multiple-file-component";
  CssClass2["MultipleTextComponent"] = "multiple-text-component";
  CssClass2["NumberComponent"] = "number-component";
  CssClass2["OkButton"] = "ok-button";
  CssClass2["OverlayValidator"] = "overlay-validator";
  CssClass2["PasswordComponent"] = "password-component";
  CssClass2["PluginSettingsTab"] = "plugin-settings-tab";
  CssClass2["PromptModal"] = "prompt-modal";
  CssClass2["SelectItemModal"] = "select-item-modal";
  CssClass2["SettingComponentWrapper"] = "setting-component-wrapper";
  CssClass2["TelephoneComponent"] = "telephone-component";
  CssClass2["TextBox"] = "text-box";
  CssClass2["TimeComponent"] = "time-component";
  CssClass2["Tooltip"] = "tooltip";
  CssClass2["TooltipArrow"] = "tooltip-arrow";
  CssClass2["TooltipValidator"] = "tooltip-validator";
  CssClass2["TriStateCheckboxComponent"] = "tri-state-checkbox-component";
  CssClass2["TypedDropdownComponent"] = "typed-dropdown-component";
  CssClass2["TypedMultipleDropdownComponent"] = "typed-multiple-dropdown-component";
  CssClass2["UrlComponent"] = "url-component";
  CssClass2["WeekComponent"] = "week-component";
  return CssClass2;
})(CssClass || {});

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/plugin/plugin-context.mjs
(function initEsm24() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var STYLES_ID = `${LIBRARY_NAME}-styles`;
function addPluginCssClasses(el, ...cssClasses) {
  el.addClass(CssClass.LibraryName, getPluginId(), ...cssClasses);
}
function initDebugController(win) {
  const pluginContextWindow = win;
  pluginContextWindow.DEBUG = getDebugController();
}
function initPluginContext(app, pluginId2) {
  setPluginId(pluginId2);
  showInitialDebugMessage(pluginId2);
  const lastLibraryVersionWrapper = getObsidianDevUtilsState(app, "lastLibraryVersion", "0.0.0");
  if (compareVersions(LIBRARY_VERSION, lastLibraryVersionWrapper.value) <= 0) {
    return;
  }
  lastLibraryVersionWrapper.value = LIBRARY_VERSION;
  document.head.querySelector(`#${STYLES_ID}`)?.remove();
  document.head.createEl("style", {
    attr: {
      id: STYLES_ID
    },
    text: LIBRARY_STYLES
  });
}

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/plugin/plugin-base.mjs
(function initEsm25() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var PluginBase = class extends import_obsidian3.Plugin {
  /**
   * The events of the plugin.
   */
  events = new AsyncEvents();
  /**
   * Gets the AbortSignal used for aborting long-running operations.
   *
   * @returns The abort signal.
   * @throws If the abort signal is not defined.
   */
  get abortSignal() {
    if (!this._abortSignal) {
      throw new Error("Abort signal not defined");
    }
    return this._abortSignal;
  }
  /**
   * Gets the readonly plugin settings.
   *
   * @returns The readonly plugin settings.
   */
  get settings() {
    return this.settingsManager.settingsWrapper.safeSettings;
  }
  /**
   * Gets the plugin settings manager.
   *
   * @returns The plugin settings manager.
   */
  get settingsManager() {
    if (!this._settingsManager) {
      throw new Error("Settings manager not defined");
    }
    return this._settingsManager;
  }
  /**
   * Gets the plugin settings tab.
   *
   * @returns The plugin settings tab.
   */
  get settingsTab() {
    if (!this._settingsTab) {
      throw new Error("Settings tab not defined");
    }
    return this._settingsTab;
  }
  _abortSignal;
  _settingsManager = null;
  _settingsTab = null;
  lifecycleEventNames = /* @__PURE__ */ new Set();
  notice;
  /**
   * Logs a message to the console.
   *
   * Use instead of `console.debug()`.
   *
   * Those messages are not shown by default, but they can be shown by enabling `your-plugin-id` debugger namespace.
   *
   * @see {@link https://github.com/mnaoumov/obsidian-dev-utils/blob/main/docs/debugging.md} for more information.
   *
   * @param message - The message to log.
   * @param args - The arguments to log.
   */
  consoleDebug(message, ...args) {
    const FRAMES_TO_SKIP = 1;
    const pluginDebugger = getDebugger(this.manifest.id, FRAMES_TO_SKIP);
    pluginDebugger(message, ...args);
  }
  /**
   * Called when the external settings change.
   *
   * Usually, you don't need to override this method. Consider using {@link onLoadSettings} instead.
   *
   * If you still need to override this method, make sure to call `await super.onExternalSettingsChange()` first.
   */
  async onExternalSettingsChange() {
    await super.onExternalSettingsChange?.();
    await this._settingsManager?.loadFromFile(false);
  }
  /**
   * Called when the plugin is loaded
   *
   * Usually, you don't need to override this method. Consider using {@link onloadImpl} instead.
   *
   * If you still need to override this method, make sure to call `await super.onload()` first.
   */
  async onload() {
    await super.onload();
    await this.onloadImpl();
    invokeAsyncSafelyAfterDelay(this.afterLoad.bind(this));
  }
  /**
   * Called when the plugin is unloaded.
   *
   * Usually, you don't need to override this method. Consider using {@link onunloadImpl} instead.
   *
   * If you still need to override this method, make sure to call `super.onunload()` first.
   */
  onunload() {
    super.onunload();
    invokeAsyncSafely(async () => {
      try {
        await this.onunloadImpl();
      } finally {
        await this.triggerLifecycleEvent("unload");
      }
    });
  }
  /**
   * Registers a callback to be executed when a lifecycle event is triggered.
   *
   * @param name - The name of the event.
   * @param callback - The callback to execute.
   */
  registerForLifecycleEvent(name, callback) {
    invokeAsyncSafely(async () => {
      await this.waitForLifecycleEvent(name);
      await callback();
    });
  }
  /**
   * Waits for a lifecycle event to be triggered.
   *
   * If you `await` this method during lifecycle event, it might cause a deadlock.
   *
   * Consider wrapping this call with {@link invokeAsyncSafely}.
   *
   * @param name - The name of the event.
   * @returns A {@link Promise} that resolves when the event is triggered.
   */
  async waitForLifecycleEvent(name) {
    if (this.lifecycleEventNames.has(name)) {
      return;
    }
    await new Promise((resolve) => {
      this.events.once(name, () => {
        resolve();
      });
    });
  }
  /**
   * Creates the plugin settings manager. This method must be implemented by subclasses.
   *
   * @returns The plugin settings manager.
   */
  createSettingsManager() {
    return null;
  }
  /**
   * Creates a plugin settings tab.
   *
   * @returns The settings tab or `null` if not applicable.
   */
  createSettingsTab() {
    return null;
  }
  /**
   * Creates a translations map.
   *
   * @returns The translations map.
   */
  createTranslationsMap() {
    return defaultTranslationsMap;
  }
  /**
   * Called when an async error occurs.
   *
   * @param _asyncError - The async error.
   */
  handleAsyncError(_asyncError) {
    this.showNotice(t2(($) => $.obsidianDevUtils.notices.unhandledError));
  }
  /**
   * Called when the layout is ready.
   */
  async onLayoutReady() {
    await noopAsync();
  }
  /**
   * Executed when the plugin is loaded.
   *
   * If this method fails, the plugin will be automatically unloaded.
   *
   * @remarks It is important to call `super.onloadImpl()` in overridden method.
   */
  async onloadImpl() {
    initPluginContext(this.app, this.manifest.id);
    new AllWindowsEventHandler(this.app, this).registerAllWindowsHandler((win) => {
      initDebugController(win);
    });
    await initI18N(this.createTranslationsMap());
    this.register(registerAsyncErrorEventHandler(this.handleAsyncError.bind(this)));
    this._settingsManager = this.createSettingsManager();
    if (this._settingsManager) {
      registerAsyncEvent(this, this._settingsManager.on("loadSettings", this.onLoadSettings.bind(this)));
      registerAsyncEvent(this, this._settingsManager.on("saveSettings", this.onSaveSettings.bind(this)));
    }
    await this._settingsManager?.loadFromFile(true);
    this._settingsTab = this.createSettingsTab();
    if (this._settingsTab) {
      this.addSettingTab(this._settingsTab);
    }
    const abortController = new AbortController();
    this._abortSignal = abortController.signal;
    this.register(() => {
      abortController.abort(new SilentError(`Plugin ${this.manifest.id} had been unloaded`));
    });
  }
  /**
   * Called when the plugin settings are loaded or reloaded.
   *
   * @param _loadedSettings - The loaded settings wrapper.
   * @param _isInitialLoad - Whether the settings are being loaded for the first time.
   */
  async onLoadSettings(_loadedSettings, _isInitialLoad) {
    await noopAsync();
  }
  /**
   * Called when the plugin settings are saved.
   *
   * @param _newSettings - The new settings.
   * @param _oldSettings - The old settings.
   * @param _context - The context.
   */
  async onSaveSettings(_newSettings, _oldSettings, _context) {
    await noopAsync();
  }
  /**
   * Called when the plugin is unloaded.
   */
  async onunloadImpl() {
    await noopAsync();
  }
  /**
   * Displays a notice message to the user.
   *
   * @param message - The message to display.
   */
  showNotice(message) {
    if (this.notice) {
      this.notice.hide();
    }
    this.notice = new import_obsidian3.Notice(`${this.manifest.name}
${message}`);
  }
  async afterLoad() {
    if (this.abortSignal.aborted) {
      return;
    }
    await this.triggerLifecycleEvent("load");
    this.app.workspace.onLayoutReady(convertAsyncToSync(this.onLayoutReadyBase.bind(this)));
  }
  async onLayoutReadyBase() {
    try {
      await this.onLayoutReady();
    } finally {
      await this.triggerLifecycleEvent("layoutReady");
    }
  }
  async triggerLifecycleEvent(name) {
    this.lifecycleEventNames.add(name);
    await this.events.triggerAsync(name);
  }
};

// src/Modals/DashboardModal.ts
var import_obsidian5 = require("obsidian");

// src/createNote.ts
function isoDate() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function zettelkastenId() {
  const d = /* @__PURE__ */ new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
    String(d.getHours()).padStart(2, "0"),
    String(d.getMinutes()).padStart(2, "0"),
    String(d.getSeconds()).padStart(2, "0")
  ].join("");
}
function getTemplater(app) {
  const plugin = app.plugins?.plugins?.["templater-obsidian"];
  if (!plugin) return null;
  return plugin.templater ?? null;
}
async function createNote(app, settings) {
  const folder = settings.newNoteFolder;
  const templatePath = settings.newNoteTemplate;
  const templateFile = templatePath ? app.vault.getFileByPath(templatePath) : null;
  const content = templateFile ? await app.vault.read(templateFile) : "";
  const useZettel = settings.newNoteFilenameFormat === "zettelkasten";
  const baseName = useZettel ? zettelkastenId() : `Untitled ${isoDate()}`;
  let finalPath = folder ? `${folder}/${baseName}.md` : `${baseName}.md`;
  let n = 1;
  while (app.vault.getFileByPath(finalPath)) {
    const alt = useZettel ? `${baseName}-${n}` : `${baseName} ${n}`;
    finalPath = folder ? `${folder}/${alt}.md` : `${alt}.md`;
    n++;
  }
  const file = await app.vault.create(finalPath, content);
  if (templateFile) {
    const templater = getTemplater(app);
    await templater?.overwrite_file_commands?.(file, false);
  }
  return file;
}

// src/Modals/AppendPromptModal.ts
var import_obsidian4 = require("obsidian");
var AppendPromptModal = class extends import_obsidian4.Modal {
  constructor(app, hint, onConfirm) {
    super(app);
    this.hint = hint;
    this.onConfirm = onConfirm;
  }
  hint;
  onConfirm;
  inputEl;
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("qw-prompt");
    contentEl.createEl("p", { cls: "qw-prompt-hint", text: this.hint });
    this.inputEl = contentEl.createEl("input", { type: "text" });
    this.inputEl.addClass("qw-prompt-input");
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.confirm();
      if (e.key === "Escape") this.close();
    });
    const btns = contentEl.createEl("div", { cls: "qw-prompt-btns" });
    const cancel = btns.createEl("button", { cls: "qw-prompt-btn", text: "Cancel" });
    cancel.addEventListener("click", () => this.close());
    const confirm = btns.createEl("button", { cls: "qw-prompt-btn qw-prompt-btn--confirm", text: "Add" });
    confirm.addEventListener("click", () => this.confirm());
    setTimeout(() => {
      this.inputEl.focus();
    }, 50);
  }
  onClose() {
    this.contentEl.empty();
  }
  confirm() {
    const text = this.inputEl.value.trim();
    if (!text) return;
    this.close();
    this.onConfirm(text);
  }
};

// src/Modals/DashboardModal.ts
function headerDate() {
  return (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
}
function fromNow(timestamp) {
  const s = Math.floor((Date.now() - timestamp) / 1e3);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.floor(h / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function stripMarkdown(raw) {
  const body = raw.startsWith("---") ? raw.replace(/^---[\s\S]*?---\n?/, "") : raw;
  return body.replace(/```[\s\S]*?```/g, "").replace(/%%[\s\S]*?%%/g, "").replace(/!\[\[.*?\]\]/g, "").replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1").replace(/!\[.*?\]\(.*?\)/g, "").replace(/\[([^\]]+)\]\(.*?\)/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^\s*\|.*\|\s*$/gm, "").replace(/\*{1,3}([^*\n]+)\*{1,3}/g, "$1").replace(/_([^_\n]+)_/g, "$1").replace(/^>\s?/gm, "").replace(/^[-*+]\s+/gm, "").replace(/^\d+\.\s+/gm, "").replace(/`[^`\n]*`/g, "").split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
}
function extractTailPreview(raw) {
  const lines = stripMarkdown(raw);
  return lines.slice(-3).join("  \xB7  ").replace(/\s{2,}/g, " ").trim().slice(0, 140);
}
function noteTags(file, app) {
  const cache = app.metadataCache.getFileCache(file);
  const inline = (cache?.tags ?? []).map((t3) => t3.tag);
  const fm = (cache?.frontmatter?.["tags"] ?? []).map((t3) => `#${t3}`);
  return [.../* @__PURE__ */ new Set([...inline, ...fm])].slice(0, 2);
}
function getTrashApi(app) {
  const plugin = app.plugins?.plugins?.["trash-collection"];
  if (!plugin) return null;
  const api = plugin.api;
  if (!api || typeof api.getCandidates !== "function") return null;
  return api;
}
function getContinuePlugin(app) {
  const plugin = app.plugins?.plugins?.["obsidian-continue"];
  if (!plugin || !Array.isArray(plugin.openedLog)) return null;
  return plugin;
}
var DashboardModal = class extends import_obsidian5.Modal {
  settings;
  constructor(app, settings) {
    super(app);
    this.settings = settings;
  }
  async onOpen() {
    const { modalEl, contentEl, containerEl } = this;
    containerEl.addClass("qw-dash-container");
    modalEl.addClass("qw-dash-modal");
    contentEl.addClass("qw-dash");
    modalEl.createEl("div", { cls: "qw-dash-handle" });
    const widgets = this.settings.dashboardWidgets ?? [];
    this.renderCapture(contentEl);
    this.renderTodaySection(contentEl);
    for (const widget of widgets) {
      if (!widget.enabled) continue;
      switch (widget.type) {
        case "continue":
          await this.renderContinue(contentEl);
          break;
        case "graph":
          this.renderGraph(contentEl);
          break;
        case "new-note":
          this.renderMoreActions(contentEl);
          break;
      }
    }
  }
  onClose() {
    this.contentEl.empty();
  }
  // ── Sections ───────────────────────────────────────────────────────────────
  renderCapture(root) {
    const appendAction = (this.settings.quickActions ?? []).find((a) => a.action === "append-to-note");
    const bar = root.createEl("div", { cls: "qw-dash-capture" });
    bar.createEl("div", { cls: "qw-dash-capture-icon", text: "\u2726" });
    bar.createEl("div", {
      cls: "qw-dash-capture-placeholder",
      text: appendAction ? `Add to ${this.app.vault.getFileByPath(appendAction.notePath ?? "")?.basename ?? "note"}\u2026` : "Capture a thought\u2026"
    });
    bar.addEventListener("click", () => {
      if (appendAction) {
        void this.handleQuickAction(appendAction);
      } else {
        void this.handleQuickAction({ label: "New note", icon: "file-plus", action: "new-note" });
      }
    });
  }
  renderTodaySection(root) {
    const dateRow = root.createEl("div", { cls: "qw-dash-date-row" });
    dateRow.createEl("span", { cls: "qw-dash-date", text: `TODAY \xB7 ${headerDate()}` });
    const cards = (this.settings.pulseCards ?? []).filter((c) => c.enabled);
    if (cards.length === 0) return;
    const needsTrash = cards.some((c) => c.type === "trash");
    const trashApi = needsTrash ? getTrashApi(this.app) : null;
    const trashCount = trashApi ? trashApi.getCandidates().length : 0;
    const allFiles = this.app.vault.getMarkdownFiles();
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const visibleCards = cards.filter((c) => {
      if (c.type === "trash") return trashCount > 0;
      return true;
    });
    if (visibleCards.length === 0) return;
    const pulseRow = root.createEl("div", { cls: "qw-dash-pulse-row" });
    for (const card of visibleCards) {
      this.renderPulseCard(pulseRow, card, { allFiles, today, trashApi, trashCount });
    }
  }
  renderPulseCard(row, card, ctx) {
    switch (card.type) {
      case "daily-note": {
        const el = row.createEl("div", { cls: "qw-dash-pulse-card qw-dash-pulse-card--accent" });
        el.createEl("div", { cls: "qw-dash-pulse-label", text: "Daily note" });
        el.createEl("div", { cls: "qw-dash-pulse-value qw-dash-pulse-value--accent", text: "Open" });
        el.createEl("div", { cls: "qw-dash-pulse-sub", text: "Jump to today" });
        el.addEventListener("click", () => {
          this.close();
          try {
            const id = this.app.commands.findCommand("daily-notes:goto-today") ? "daily-notes:goto-today" : "periodic-notes:open-daily-note";
            this.app.commands.executeCommandById(id);
          } catch {
          }
        });
        break;
      }
      case "modified-today": {
        const count = ctx.allFiles.filter((f) => f.stat.mtime >= ctx.today.getTime()).length;
        const el = row.createEl("div", { cls: "qw-dash-pulse-card" });
        el.createEl("div", { cls: "qw-dash-pulse-label", text: "Modified" });
        el.createEl("div", { cls: "qw-dash-pulse-value", text: String(count) });
        el.createEl("div", { cls: "qw-dash-pulse-sub", text: "notes today" });
        break;
      }
      case "vault": {
        const noteCount = ctx.allFiles.length;
        const noteStr = noteCount >= 1e3 ? `${(noteCount / 1e3).toFixed(1)}k` : String(noteCount);
        let linkCount = 0;
        for (const f of ctx.allFiles) linkCount += this.app.metadataCache.getFileCache(f)?.links?.length ?? 0;
        const linkStr = linkCount >= 1e3 ? `${(linkCount / 1e3).toFixed(1)}k` : String(linkCount);
        const el = row.createEl("div", { cls: "qw-dash-pulse-card" });
        el.createEl("div", { cls: "qw-dash-pulse-label", text: "Vault" });
        el.createEl("div", { cls: "qw-dash-pulse-value qw-dash-pulse-value--gold", text: noteStr });
        el.createEl("div", { cls: "qw-dash-pulse-sub", text: `notes \xB7 ${linkStr} links` });
        break;
      }
      case "trash": {
        const el = row.createEl("div", { cls: "qw-dash-pulse-card" });
        el.createEl("div", { cls: "qw-dash-pulse-label", text: "Needs review" });
        el.createEl("div", { cls: "qw-dash-pulse-value", text: String(ctx.trashCount) });
        el.createEl("div", { cls: "qw-dash-pulse-sub", text: "stale notes" });
        el.addEventListener("click", () => {
          this.close();
          void ctx.trashApi?.openTriage();
        });
        break;
      }
      case "quick-action": {
        const action = card.quickAction;
        if (!action) break;
        const el = row.createEl("div", { cls: "qw-dash-pulse-card" });
        const iconWrap = el.createEl("div", { cls: "qw-dash-pulse-action-icon" });
        (0, import_obsidian5.setIcon)(iconWrap, action.icon || "zap");
        el.createEl("div", { cls: "qw-dash-pulse-label", text: action.label });
        el.addEventListener("click", () => {
          void this.handleQuickAction(action);
        });
        break;
      }
    }
  }
  async renderContinue(root) {
    const files = this.getRecentFiles();
    if (files.length === 0) return;
    root.createEl("div", { cls: "qw-dash-section-label", text: "RECENTLY TOUCHED" });
    for (const [idx, file] of files.entries()) {
      const row = root.createEl("div", {
        cls: idx === 0 ? "qw-dash-note-row qw-dash-note-row--recent" : "qw-dash-note-row"
      });
      const meta = row.createEl("div", { cls: "qw-dash-note-meta" });
      const titleRow = meta.createEl("div", { cls: "qw-dash-note-title-row" });
      titleRow.createEl("span", { cls: "qw-dash-note-title", text: file.basename });
      titleRow.createEl("span", { cls: "qw-dash-note-time", text: fromNow(file.stat.mtime) });
      const tags = noteTags(file, this.app);
      let backlinkCount = 0;
      for (const links of Object.values(this.app.metadataCache.resolvedLinks)) {
        if (links[file.path]) backlinkCount++;
      }
      const detail = meta.createEl("div", { cls: "qw-dash-note-detail" });
      if (backlinkCount > 0) detail.createEl("span", { cls: "qw-dash-note-links", text: `\u2190 ${backlinkCount}` });
      for (const tag of tags) detail.createEl("span", { cls: "qw-dash-note-tag", text: tag });
      try {
        const preview = extractTailPreview(await this.app.vault.cachedRead(file));
        if (preview) meta.createEl("div", { cls: "qw-dash-note-preview", text: preview });
      } catch {
      }
      row.addEventListener("click", () => {
        this.close();
        void this.app.workspace.getMostRecentLeaf()?.openFile(file);
      });
    }
  }
  renderGraph(root) {
    const centerFile = this.getRecentFiles()[0];
    if (!centerFile) return;
    const resolvedLinks = this.app.metadataCache.resolvedLinks;
    const outgoing = Object.keys(resolvedLinks[centerFile.path] ?? {});
    const incoming = [];
    for (const [src, links] of Object.entries(resolvedLinks)) {
      if (src !== centerFile.path && links[centerFile.path]) incoming.push(src);
    }
    const neighborPaths = [.../* @__PURE__ */ new Set([...outgoing, ...incoming])];
    const totalConnections = neighborPaths.length;
    root.createEl("div", { cls: "qw-dash-section-label", text: "ACTIVE CLUSTER" });
    const card = root.createEl("div", { cls: "qw-dash-graph-card" });
    const canvas = card.createEl("div", { cls: "qw-dash-graph-canvas" });
    const attachListeners = (expanded) => {
      canvas.innerHTML = this.buildGraphSvg(centerFile, neighborPaths.slice(0, expanded ? 20 : 10), expanded);
      canvas.querySelectorAll("[data-path]").forEach((el) => {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const file = this.app.vault.getFileByPath(el.getAttribute("data-path") ?? "");
          if (file) {
            this.close();
            void this.app.workspace.getMostRecentLeaf()?.openFile(file);
          }
        });
      });
      canvas.querySelector("[data-center]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
        void this.app.workspace.getMostRecentLeaf()?.openFile(centerFile);
      });
      canvas.addEventListener("click", () => {
        const expanded2 = card.classList.toggle("qw-dash-graph-card--expanded");
        attachListeners(expanded2);
      }, { once: true });
    };
    attachListeners(false);
    const footer = card.createEl("div", { cls: "qw-dash-graph-footer" });
    const stat = footer.createEl("div", { cls: "qw-dash-graph-stat" });
    stat.createEl("div", { cls: "qw-dash-graph-dot" });
    stat.createEl("span", { text: `${totalConnections} connected notes` });
    const btn = footer.createEl("button", { cls: "qw-dash-graph-btn", text: "FULL GRAPH \u2192" });
    btn.addEventListener("click", () => {
      this.close();
      try {
        this.app.commands.executeCommandById("graph:open");
      } catch {
      }
    });
  }
  buildGraphSvg(center, neighborPaths, expanded = false) {
    const cx = 171;
    const viewH = expanded ? 356 : 178;
    const cy = viewH / 2;
    const r = expanded ? 115 : 58;
    const n = neighborPaths.length;
    const neighbors = neighborPaths.map((path, i) => {
      const angle = i / Math.max(n, 1) * 2 * Math.PI - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const name = this.app.vault.getFileByPath(path)?.basename ?? path.split("/").pop()?.replace(/\.md$/, "") ?? "";
      return { x, y, name, path };
    });
    const edges = neighbors.map((nb) => `<line x1="${cx}" y1="${cy}" x2="${nb.x.toFixed(1)}" y2="${nb.y.toFixed(1)}" stroke="#2e2e3a" stroke-width="1" opacity="0.8"/>`).join("");
    const nodes = neighbors.map((nb) => {
      const truncated = nb.name.length > 14 ? nb.name.slice(0, 14) + "\u2026" : nb.name;
      const above = nb.y < cy;
      const ly = above ? nb.y - 10 : nb.y + 14;
      return `<g data-path="${nb.path}" style="cursor:pointer">
          <circle cx="${nb.x.toFixed(1)}" cy="${nb.y.toFixed(1)}" r="14" fill="transparent"/>
          <circle cx="${nb.x.toFixed(1)}" cy="${nb.y.toFixed(1)}" r="4" fill="#1e1e28" stroke="#3a3a50" stroke-width="1"/>
          <text x="${nb.x.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" fill="#9b7ce8" font-size="7" font-family="monospace" opacity="0.85">[[${truncated}]]</text>
        </g>`;
    }).join("");
    const centerLabel = center.basename.length > 20 ? center.basename.slice(0, 20) + "\u2026" : center.basename;
    return `<svg viewBox="0 0 343 ${viewH}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <g>${edges}</g>
      <g>${nodes}</g>
      <g data-center style="cursor:pointer">
        <circle cx="${cx}" cy="${cy}" r="22" fill="transparent"/>
        <circle cx="${cx}" cy="${cy}" r="16" fill="none" stroke="#7c5cbf" stroke-width="1" opacity="0.2"/>
        <circle cx="${cx}" cy="${cy}" r="13" fill="#1a1230" stroke="#9b7ce8" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="7" fill="#7c5cbf"/>
        <circle cx="${cx}" cy="${cy}" r="3" fill="#d4b8ff"/>
        <text x="${cx}" y="${cy + 26}" text-anchor="middle" fill="#e8e8ec" font-size="8" font-family="sans-serif" font-weight="500">${centerLabel}</text>
      </g>
    </svg>`;
  }
  renderMoreActions(root) {
    const actions = this.settings.quickActions ?? [];
    if (actions.length === 0) return;
    root.createEl("div", { cls: "qw-dash-section-label", text: "MORE ACTIONS" });
    const row = root.createEl("div", { cls: "qw-dash-actions" });
    for (const action of actions) {
      const btn = row.createEl("button", { cls: "qw-dash-action-btn" });
      const iconEl = btn.createEl("span", { cls: "qw-dash-action-icon" });
      (0, import_obsidian5.setIcon)(iconEl, action.icon || "zap");
      btn.createEl("span", { text: action.label });
      btn.addEventListener("click", () => {
        void this.handleQuickAction(action);
      });
    }
  }
  // ── Helpers ────────────────────────────────────────────────────────────────
  isExcluded(file) {
    return (this.settings.continueExcluded ?? []).some(
      (rule) => rule.endsWith("/") ? file.path.startsWith(rule) : file.path === rule
    );
  }
  getRecentFiles() {
    const MAX = 4;
    const continuePlug = getContinuePlugin(this.app);
    const paths = continuePlug && continuePlug.openedLog.length > 0 ? continuePlug.openedLog : this.app.workspace.getLastOpenFiles();
    return paths.map((p) => this.app.vault.getFileByPath(p)).filter((f) => f !== null && !this.isExcluded(f)).slice(0, MAX);
  }
  async handleQuickAction(action) {
    switch (action.action) {
      case "new-note": {
        this.close();
        const file = await createNote(this.app, this.settings);
        await this.app.workspace.getMostRecentLeaf()?.openFile(file);
        break;
      }
      case "homepage": {
        this.close();
        const target = this.settings.homePath;
        if (target) {
          const file = this.app.vault.getFileByPath(target);
          if (file) {
            await this.app.workspace.getMostRecentLeaf()?.openFile(file);
            return;
          }
        }
        try {
          if (this.app.commands.findCommand("homepage:open")) {
            this.app.commands.executeCommandById("homepage:open");
          } else {
            new import_obsidian5.Notice("No home note configured.");
          }
        } catch {
          new import_obsidian5.Notice("No home note configured.");
        }
        break;
      }
      case "command": {
        this.close();
        if (action.commandId) this.app.commands.executeCommandById(action.commandId);
        break;
      }
      case "append-to-note": {
        const notePath = action.notePath;
        if (!notePath) {
          new import_obsidian5.Notice("No note path configured for this action.");
          return;
        }
        const template = action.appendTemplate || "{{text}}";
        new AppendPromptModal(this.app, action.label, async (text) => {
          const file = this.app.vault.getFileByPath(notePath);
          if (!file) {
            new import_obsidian5.Notice(`Note not found: ${notePath}`);
            return;
          }
          const line = template.replace("{{text}}", text);
          const content = await this.app.vault.read(file);
          const sep = content.endsWith("\n") ? "" : "\n";
          await this.app.vault.modify(file, content + sep + line + "\n");
          new import_obsidian5.Notice(`Added to ${file.basename}`);
        }).open();
        break;
      }
    }
  }
};

// src/Modals/RadialMenuModal.ts
var import_obsidian6 = require("obsidian");
var SVG_NS = "http://www.w3.org/2000/svg";
var GAP_DEG = 2;
function deg2rad(deg) {
  return deg * Math.PI / 180;
}
function polarXY(cx, cy, r, angleDeg) {
  const a = deg2rad(angleDeg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function makeArcPath(cx, cy, outerR, innerR, startDeg, endDeg) {
  const s = startDeg + GAP_DEG;
  const e = endDeg - GAP_DEG;
  const large = e - s > 180 ? 1 : 0;
  const o1 = polarXY(cx, cy, outerR, s);
  const o2 = polarXY(cx, cy, outerR, e);
  const i1 = polarXY(cx, cy, innerR, e);
  const i2 = polarXY(cx, cy, innerR, s);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i2.x} ${i2.y}`,
    "Z"
  ].join(" ");
}
var RadialMenuModal = class extends import_obsidian6.Modal {
  settings;
  constructor(app, settings) {
    super(app);
    this.settings = settings;
  }
  onOpen() {
    const { modalEl, contentEl } = this;
    modalEl.addClass("qw-modal");
    contentEl.addClass("qw-content");
    const bg = this.containerEl.querySelector(".modal-bg");
    if (bg) {
      bg.style.setProperty("opacity", "1");
      bg.style.setProperty("background", "rgba(0,0,0,0.5)");
      bg.style.setProperty("backdrop-filter", "blur(6px)");
      bg.style.setProperty("-webkit-backdrop-filter", "blur(6px)");
    }
    const w = activeWindow.innerWidth;
    const h = activeWindow.innerHeight;
    const size = Math.min(w, h) * 0.85;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 8;
    const innerR = outerR * 0.28;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.addClass("qw-svg");
    this.settings.slices.forEach((slice, i) => {
      const span = slice.endAngle - slice.startAngle;
      if (span <= GAP_DEG * 2) return;
      const g = this.makeSliceGroup(cx, cy, outerR, innerR, slice, i);
      svg.appendChild(g);
    });
    const hasCancelSlice = this.settings.slices.some((s) => s.action === "cancel");
    if (!hasCancelSlice) {
      const centerBg = document.createElementNS(SVG_NS, "circle");
      centerBg.setAttribute("cx", String(cx));
      centerBg.setAttribute("cy", String(cy));
      centerBg.setAttribute("r", String(innerR - 4));
      centerBg.addClass("qw-center");
      svg.appendChild(centerBg);
      const centerText = document.createElementNS(SVG_NS, "text");
      centerText.setAttribute("x", String(cx));
      centerText.setAttribute("y", String(cy));
      centerText.setAttribute("text-anchor", "middle");
      centerText.setAttribute("dominant-baseline", "middle");
      centerText.addClass("qw-center-icon");
      centerText.textContent = "\u2715";
      svg.appendChild(centerText);
      const closeCenter = () => {
        this.close();
      };
      centerBg.addEventListener("click", closeCenter);
      centerText.addEventListener("click", closeCenter);
    }
    contentEl.appendChild(svg);
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl || e.target === contentEl) this.close();
    });
    requestAnimationFrame(() => {
      svg.addClass("qw-svg--open");
    });
  }
  onClose() {
    this.contentEl.empty();
  }
  makeSliceGroup(cx, cy, outerR, innerR, slice, index) {
    const g = document.createElementNS(SVG_NS, "g");
    g.addClass("qw-slice-group");
    g.style.setProperty("--i", String(index));
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", makeArcPath(cx, cy, outerR, innerR, slice.startAngle, slice.endAngle));
    path.setAttribute("fill", slice.color);
    path.addClass("qw-slice");
    g.appendChild(path);
    const mid = (slice.startAngle + slice.endAngle) / 2;
    const labelR = (outerR + innerR) / 2;
    const lp = polarXY(cx, cy, labelR, mid);
    const depth = outerR - innerR;
    const offset = Math.min(12, depth * 0.2);
    const iconEl = document.createElementNS(SVG_NS, "text");
    iconEl.setAttribute("x", String(lp.x));
    iconEl.setAttribute("y", String(lp.y - offset));
    iconEl.setAttribute("text-anchor", "middle");
    iconEl.setAttribute("dominant-baseline", "middle");
    iconEl.addClass("qw-icon");
    iconEl.textContent = slice.icon;
    g.appendChild(iconEl);
    const span = slice.endAngle - slice.startAngle;
    if (span >= 45) {
      const labelEl = document.createElementNS(SVG_NS, "text");
      labelEl.setAttribute("x", String(lp.x));
      labelEl.setAttribute("y", String(lp.y + offset + 4));
      labelEl.setAttribute("text-anchor", "middle");
      labelEl.setAttribute("dominant-baseline", "middle");
      labelEl.addClass("qw-label");
      labelEl.textContent = slice.label;
      g.appendChild(labelEl);
    }
    g.addEventListener("click", () => {
      void this.handleSlice(slice);
    });
    return g;
  }
  async handleSlice(slice) {
    this.close();
    switch (slice.action) {
      case "cancel":
        break;
      case "dashboard": {
        new DashboardModal(this.app, this.settings).open();
        break;
      }
      case "homepage": {
        const target = this.settings.homePath;
        if (target) {
          const file = this.app.vault.getFileByPath(target);
          if (file) {
            await this.app.workspace.getMostRecentLeaf()?.openFile(file);
            return;
          }
        }
        try {
          if (this.app.commands.findCommand("homepage:open")) {
            this.app.commands.executeCommandById("homepage:open");
          } else {
            new import_obsidian6.Notice("No home note configured. Set a path in Mobile Quick Widget settings.");
          }
        } catch {
          new import_obsidian6.Notice("No home note configured. Set a path in Mobile Quick Widget settings.");
        }
        break;
      }
      case "new-note": {
        const file = await createNote(this.app, this.settings);
        await this.app.workspace.getMostRecentLeaf()?.openFile(file);
        break;
      }
      case "command": {
        if (slice.commandId) {
          this.app.commands.executeCommandById(slice.commandId);
        }
        break;
      }
    }
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/transformers/transformer.mjs
(function initEsm26() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var Transformer = class {
  /**
   * Gets the transformer with the given id.
   *
   * @param transformerId - The id of the transformer to get.
   * @returns The transformer with the given id.
   */
  // eslint-disable-next-line @typescript-eslint/prefer-return-this-type -- The overridden method might return a different type.
  getTransformer(transformerId) {
    if (transformerId === this.id) {
      return this;
    }
    throw new Error(`Transformer with id ${transformerId} not found`);
  }
  /**
   * Transforms the given object recursively.
   *
   * @param value - The value to transform.
   * @returns The transformed value.
   */
  transformObjectRecursively(value) {
    return this.transformValueRecursively(value, "");
  }
  /**
   * Gets the id of the transformer that can transform the given value.
   *
   * @param value - The value to get the transformer id for.
   * @param key - The key of the value to get the transformer id for.
   * @returns The id of the transformer that can transform the given value.
   */
  getTransformerId(value, key) {
    if (this.canTransform(value, key)) {
      return this.id;
    }
    return null;
  }
  /**
   * Transforms the given value recursively.
   *
   * @param value - The value to transform.
   * @param key - The key of the value to transform.
   * @returns The transformed value.
   */
  transformValueRecursively(value, key) {
    const transformerId = this.getTransformerId(value, key);
    if (transformerId) {
      const transformedValue = this.transformValue(value, key);
      if (transformedValue === void 0) {
        return void 0;
      }
      const wrapper = {
        __transformerId: transformerId,
        transformedValue
      };
      return wrapper;
    }
    if (value === null) {
      return null;
    }
    if (typeof value !== "object") {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((childValue, index) => this.transformValueRecursively(childValue, String(index)));
    }
    const transformedValueWrapper = value;
    if (transformedValueWrapper.__transformerId) {
      return this.getTransformer(transformedValueWrapper.__transformerId).restoreValue(transformedValueWrapper.transformedValue, key);
    }
    const record = {};
    for (const childKey of getAllKeys(value)) {
      const childValue = value[childKey];
      const transformedChildValue = this.transformValueRecursively(childValue, childKey);
      record[childKey] = transformedChildValue;
    }
    return record;
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/transformers/typed-transformer.mjs
(function initEsm27() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var TypedTransformer = class extends Transformer {
};

// node_modules/obsidian-dev-utils/dist/lib/esm/transformers/date-transformer.mjs
(function initEsm28() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var DateTransformer = class extends TypedTransformer {
  /**
   * An id of the transformer.
   *
   * @returns `date`.
   */
  get id() {
    return "date";
  }
  /**
   * Determines if the value is a Date.
   *
   * @param value - The value to check.
   * @returns A boolean indicating if the value is a Date.
   */
  canTransform(value) {
    return value instanceof Date;
  }
  /**
   * Restores the value from a string.
   *
   * @param transformedValue - The transformed value.
   * @returns The restored value.
   */
  restoreValue(transformedValue) {
    return new Date(transformedValue);
  }
  /**
   * Transforms the value to a string.
   *
   * @param value - The value to transform.
   * @returns The transformed value.
   */
  transformValue(value) {
    return value.toISOString();
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/transformers/duration-transformer.mjs
var import_obsidian7 = require("obsidian");
(function initEsm29() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var DurationTransformer = class extends TypedTransformer {
  /**
   * An id of the transformer.
   *
   * @returns The id of the transformer.
   */
  get id() {
    return "duration";
  }
  /**
   * Checks if the value is a Duration.
   *
   * @param value - The value to check.
   * @returns `true` if the value is a Duration, `false` otherwise.
   */
  canTransform(value) {
    const maybeDuration = value ?? {};
    return !!maybeDuration.asHours && !!maybeDuration.asMinutes && !!maybeDuration.asSeconds && !!maybeDuration.asMilliseconds;
  }
  /**
   * Restores the value from a string.
   *
   * @param transformedValue - The string to restore the value from.
   * @returns The restored value.
   */
  restoreValue(transformedValue) {
    return import_obsidian7.moment.duration(transformedValue);
  }
  /**
   * Transforms the value to a string.
   *
   * @param value - The value to transform.
   * @returns The transformed value.
   */
  transformValue(value) {
    return value.toISOString();
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/transformers/group-transformer.mjs
(function initEsm30() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var GroupTransformer = class extends Transformer {
  /**
   * Transformers to combine.
   *
   * @param transformers - The transformers to combine.
   */
  constructor(transformers) {
    super();
    this.transformers = transformers;
  }
  transformers;
  /**
   * An id of the transformer.
   *
   * @returns `group`.
   */
  get id() {
    return "group";
  }
  /**
   * Determines if the value can be transformed by any of the transformers.
   *
   * @param value - The value to check.
   * @param key - The key of the value to check.
   * @returns A boolean indicating if the value can be transformed.
   */
  canTransform(value, key) {
    return this.getFirstTransformerThatCanTransform(value, key) !== null;
  }
  /**
   * Gets the transformer with the given id.
   *
   * @param transformerId - The id of the transformer to get.
   * @returns The transformer with the given id.
   */
  getTransformer(transformerId) {
    return ensureNonNullable(this.transformers.find((t3) => t3.id === transformerId), `No transformer with id ${transformerId} found`);
  }
  /**
   * Transforms the value using the first transformer that can transform it.
   *
   * @param value - The value to transform.
   * @param key - The key of the value to transform.
   * @returns The transformed value.
   */
  transformValue(value, key) {
    const transformer = this.getFirstTransformerThatCanTransform(value, key);
    assertNonNullable(transformer, "No transformer can transform the value");
    return transformer.transformValue(value, key);
  }
  /**
   * Gets the id of the transformer that can transform the given value.
   *
   * @param value - The value to get the transformer id for.
   * @param key - The key of the value to get the transformer id for.
   * @returns The id of the transformer that can transform the given value.
   */
  getTransformerId(value, key) {
    const transformer = this.getFirstTransformerThatCanTransform(value, key);
    if (transformer === null) {
      return null;
    }
    return transformer.id;
  }
  /**
   * This transformer does not support restoring values.
   *
   * @throws
   */
  restoreValue() {
    throw new Error("GroupTransformer does not support restoring values");
  }
  /**
   * Gets the first transformer that can transform the given value.
   *
   * @param value - The value to get the first transformer for.
   * @param key - The key of the value to get the first transformer for.
   * @returns The first transformer that can transform the given value.
   */
  getFirstTransformerThatCanTransform(value, key) {
    return this.transformers.find((t3) => t3.canTransform(value, key)) ?? null;
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/transformers/map-transformer.mjs
(function initEsm31() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var MapTransformer = class extends TypedTransformer {
  /**
   * An id of the transformer.
   *
   * @returns The ID of the transformer.
   */
  get id() {
    return "map";
  }
  /**
   * Checks if the value is a Map.
   *
   * @param value - The value to check.
   * @returns `true` if the value is a Map, `false` otherwise.
   */
  canTransform(value) {
    return value instanceof Map;
  }
  /**
   * Restores the value from an array of entries.
   *
   * @param transformedValue - The array of entries to restore the value from.
   * @returns The restored value.
   */
  restoreValue(transformedValue) {
    return new Map(transformedValue);
  }
  /**
   * Transforms the value to an array of entries.
   *
   * @param value - The value to transform.
   * @returns The transformed value.
   */
  transformValue(value) {
    return Array.from(value.entries());
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/transformers/set-transformer.mjs
(function initEsm32() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var SetTransformer = class extends TypedTransformer {
  /**
   * An id of the transformer.
   *
   * @returns The ID of the transformer.
   */
  get id() {
    return "set";
  }
  /**
   * Checks if the value is a Set.
   *
   * @param value - The value to check.
   * @returns `true` if the value is a Set, `false` otherwise.
   */
  canTransform(value) {
    return value instanceof Set;
  }
  /**
   * Restores the value from an array.
   *
   * @param transformedValue - The array to restore the value from.
   * @returns The restored value.
   */
  restoreValue(transformedValue) {
    return new Set(transformedValue);
  }
  /**
   * Transforms the value to an array.
   *
   * @param value - The value to transform.
   * @returns The transformed value.
   */
  transformValue(value) {
    return Array.from(value);
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/transformers/skip-private-property-transformer.mjs
(function initEsm33() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var PRIVATE_PROPERTY_PREFIX = "_";
var SkipPrivatePropertyTransformer = class extends Transformer {
  /**
   * An id of the transformer.
   *
   * @returns `skip-private-property`.
   */
  get id() {
    return "skip-private-property";
  }
  /**
   * Determines if the transformer can transform the given value.
   *
   * @param _value - The value to check.
   * @param key - The key of the value to check.
   * @returns A boolean indicating if the transformer can transform the value.
   */
  canTransform(_value, key) {
    return key.startsWith(PRIVATE_PROPERTY_PREFIX);
  }
  /**
   * Transforms the given value.
   *
   * @returns The transformed value.
   */
  transformValue() {
    return void 0;
  }
  /**
   * Restores the given value.
   */
  restoreValue() {
    throw new Error("SkipPrivatePropertyTransformer does not support restoring values");
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/two-way-map.mjs
(function initEsm34() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var TwoWayMap = class {
  keyValueMap = /* @__PURE__ */ new Map();
  valueKeyMap = /* @__PURE__ */ new Map();
  /**
   * Creates a new two-way map.
   *
   * @param entries - Entries to initialize the map with.
   */
  constructor(entries = []) {
    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }
  /**
   * Clears the map.
   */
  clear() {
    this.keyValueMap.clear();
    this.valueKeyMap.clear();
  }
  /**
   * Deletes a key from the map.
   *
   * @param key - The key.
   */
  deleteKey(key) {
    const value = this.getValue(key);
    if (value !== void 0) {
      this.valueKeyMap.delete(value);
    }
    this.keyValueMap.delete(key);
  }
  /**
   * Deletes a value from the map.
   *
   * @param value - The value.
   */
  deleteValue(value) {
    const key = this.getKey(value);
    if (key !== void 0) {
      this.keyValueMap.delete(key);
    }
    this.valueKeyMap.delete(value);
  }
  /**
   * Gets all entries in the map.
   *
   * @returns An iterator over all entries in the map.
   */
  entries() {
    return this.keyValueMap.entries();
  }
  /**
   * Gets a key by its value.
   *
   * @param value - The value.
   * @returns The key.
   */
  getKey(value) {
    return this.valueKeyMap.get(value);
  }
  /**
   * Gets a value by its key.
   *
   * @param key - The key.
   * @returns The value.
   */
  getValue(key) {
    return this.keyValueMap.get(key);
  }
  /**
   * Checks if the map has a key.
   *
   * @param key - The key.
   * @returns `true` if the map has the key, `false` otherwise.
   */
  hasKey(key) {
    return this.keyValueMap.has(key);
  }
  /**
   * Checks if the map has a value.
   *
   * @param value - The value.
   * @returns `true` if the map has the value, `false` otherwise.
   */
  hasValue(value) {
    return this.valueKeyMap.has(value);
  }
  /**
   * Gets all keys in the map.
   *
   * @returns An iterator over all keys in the map.
   */
  keys() {
    return this.keyValueMap.keys();
  }
  /**
   * Sets a key-value pair in the map.
   *
   * @param key - The key.
   * @param value - The value.
   */
  set(key, value) {
    this.deleteKey(key);
    this.deleteValue(value);
    this.keyValueMap.set(key, value);
    this.valueKeyMap.set(value, key);
  }
  /**
   * Gets all values in the map.
   *
   * @returns An iterator over all values in the map.
   */
  values() {
    return this.valueKeyMap.keys();
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/transformers/two-way-map-transformer.mjs
(function initEsm35() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var TwoWayMapTransformer = class extends TypedTransformer {
  /**
   * Gets the ID of the transformer.
   *
   * @returns The ID of the transformer.
   */
  get id() {
    return "two-way-map";
  }
  /**
   * Checks if the value is a TwoWayMap.
   *
   * @param value - The value to check.
   * @returns `true` if the value is a TwoWayMap, `false` otherwise.
   */
  canTransform(value) {
    return value instanceof TwoWayMap;
  }
  /**
   * Restores a TwoWayMap from an array of entries.
   *
   * @param transformedValue - The array of entries.
   * @returns The TwoWayMap.
   */
  restoreValue(transformedValue) {
    return new TwoWayMap(transformedValue);
  }
  /**
   * Transforms a TwoWayMap to an array of entries.
   *
   * @param value - The TwoWayMap.
   * @returns The array of entries.
   */
  transformValue(value) {
    return Array.from(value.entries());
  }
};

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/plugin/plugin-settings-manager-base.mjs
(function initEsm36() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var defaultTransformer = new GroupTransformer([
  new SkipPrivatePropertyTransformer(),
  new DateTransformer(),
  new DurationTransformer(),
  new MapTransformer(),
  new SetTransformer(),
  new TwoWayMapTransformer()
]);
var PluginSettingsManagerBase = class extends AsyncEvents {
  /**
   * Creates a new plugin settings manager.
   *
   * @param plugin - The plugin.
   */
  constructor(plugin) {
    super();
    this.plugin = plugin;
    this.app = plugin.app;
    this.defaultSettings = this.createDefaultSettings();
    this.currentSettingsWrapper = this.createDefaultSettingsWrapper();
    this.lastSavedSettingsWrapper = this.createDefaultSettingsWrapper();
    this.propertyNames = getAllKeys(this.currentSettingsWrapper.settings);
    this.registerValidators();
    this.registerLegacySettingsConverters();
  }
  plugin;
  /**
   * Gets the app.
   *
   * @returns The app.
   */
  app;
  /**
   * Gets the readonly default settings.
   *
   * @returns The default settings (as a readonly object).
   */
  defaultSettings;
  /**
   * Gets the current settings wrapper.
   *
   * @returns The current settings wrapper.
   */
  get settingsWrapper() {
    return this.currentSettingsWrapper;
  }
  currentSettingsWrapper;
  lastSavedSettingsWrapper;
  legacySettingsConverters = [];
  propertyNames;
  validators = /* @__PURE__ */ new Map();
  /**
   * Edits the plugin settings and saves them.
   *
   * @param settingsEditor - The editor.
   * @param context - The context.
   * @returns A {@link Promise} that resolves when the settings are saved.
   */
  async editAndSave(settingsEditor, context) {
    await this.edit(settingsEditor);
    await this.saveToFile(context);
  }
  /**
   * Ensures the settings are safe.
   *
   * It runs validation for each property and sets the default value if the validation fails.
   *
   * @param settings - The settings.
   * @returns A {@link Promise} that resolves when the settings are safe.
   */
  async ensureSafe(settings) {
    const validationResult = await this.validate(settings);
    for (const propertyName of this.propertyNames) {
      if (validationResult[propertyName]) {
        settings[propertyName] = this.defaultSettings[propertyName];
      }
    }
  }
  /**
   * Gets a safe copy of the settings.
   *
   * @param settings - The settings.
   * @returns A {@link Promise} that resolves to the safe copy of the settings.
   */
  async getSafeCopy(settings) {
    const safeSettings = await this.cloneSettings(settings);
    await this.ensureSafe(safeSettings);
    return safeSettings;
  }
  /**
   * Loads the plugin settings from the file.
   *
   * @param isInitialLoad - Whether the settings are being loaded for the first time.
   * @returns A {@link Promise} that resolves when the settings are loaded.
   */
  async loadFromFile(isInitialLoad) {
    const data = await this.plugin.loadData();
    this.lastSavedSettingsWrapper = this.createDefaultSettingsWrapper();
    this.currentSettingsWrapper = this.createDefaultSettingsWrapper();
    try {
      if (data === void 0 || data === null) {
        return;
      }
      if (typeof data !== "object") {
        console.error(`Invalid settings from data.json. Expected Object, got: ${typeof data}`);
        return;
      }
      const rawRecord = data;
      const parsedSettings = await this.rawRecordToSettings(rawRecord);
      const validationResult = await this.validate(parsedSettings);
      for (const propertyName of this.propertyNames) {
        this.setPropertyImpl(propertyName, parsedSettings[propertyName], validationResult[propertyName]);
      }
      this.lastSavedSettingsWrapper = await this.cloneSettingsWrapper(this.currentSettingsWrapper);
      const newRecord = await this.settingsToRawRecord(this.currentSettingsWrapper.settings);
      if (!deepEqual(newRecord, data)) {
        await this.saveToFileImpl();
      }
    } finally {
      await this.triggerAsync("loadSettings", this.currentSettingsWrapper, isInitialLoad);
    }
  }
  /**
   * Subscribes to an event.
   *
   * @param name - The name of the event.
   * @param callback - The callback to call when the event is triggered.
   * @param thisArg - The context passed as `this` to the `callback`.
   * @returns A reference to the event listener.
   */
  on(name, callback, thisArg) {
    return super.on(name, callback, thisArg);
  }
  /**
   * Revalidates the settings.
   *
   * @returns The validation messages.
   */
  async revalidate() {
    await this.edit(noop);
    return this.currentSettingsWrapper.validationMessages;
  }
  /**
   * Saves the new plugin settings.
   *
   * @param context - The context of the save to file operation.
   * @returns A {@link Promise} that resolves when the settings are saved.
   */
  async saveToFile(context) {
    if (deepEqual(this.lastSavedSettingsWrapper.settings, this.currentSettingsWrapper.settings)) {
      return;
    }
    await this.saveToFileImpl();
    await this.triggerAsync("saveSettings", this.currentSettingsWrapper, this.lastSavedSettingsWrapper, context);
    this.lastSavedSettingsWrapper = await this.cloneSettingsWrapper(this.currentSettingsWrapper);
  }
  /**
   * Sets the value of a property.
   *
   * @typeParam PropertyName - The name of the property.
   * @param propertyName - The name of the property.
   * @param value - The value to set.
   * @returns A {@link Promise} that resolves to the validation message.
   */
  async setProperty(propertyName, value) {
    await this.edit((settings) => {
      settings[propertyName] = value;
    });
    return this.currentSettingsWrapper.validationMessages[propertyName];
  }
  /**
   * Validates the settings.
   *
   * @param settings - The settings.
   * @returns A {@link Promise} that resolves to the validation result.
   */
  async validate(settings) {
    const result = {};
    for (const [propertyName, validator] of this.validators.entries()) {
      const validationMessage = await validator(settings[propertyName], settings);
      if (validationMessage) {
        result[propertyName] = validationMessage;
      }
    }
    return result;
  }
  /**
   * Gets the transformer.
   *
   * @returns The transformer.
   */
  getTransformer() {
    return defaultTransformer;
  }
  /**
   * Called when the plugin settings are loaded.
   *
   * @param record - The record.
   */
  async onLoadRecord(record) {
    for (const converter of this.legacySettingsConverters) {
      converter(record);
    }
    await Promise.resolve();
  }
  /**
   * Called when the plugin settings are saving.
   *
   * @param _record - The record.
   */
  async onSavingRecord(_record) {
    await noopAsync();
  }
  /**
   * Registers a legacy settings converter.
   *
   * @typeParam LegacySettings - The legacy settings class.
   * @param legacySettingsClass - The legacy settings class.
   * @param converter - The converter.
   */
  registerLegacySettingsConverter(legacySettingsClass, converter) {
    const that = this;
    this.legacySettingsConverters.push(legacySettingsConverter);
    function legacySettingsConverter(record) {
      const legacySettingsKeys = new Set(Object.keys(new legacySettingsClass()));
      const pluginSettingKeys = new Set(that.propertyNames);
      const legacySettings = record;
      converter(legacySettings);
      for (const key of Object.keys(legacySettings)) {
        if (pluginSettingKeys.has(key)) {
          continue;
        }
        if (!legacySettingsKeys.has(key)) {
          continue;
        }
        delete record[key];
      }
    }
  }
  /**
   * Registers the legacy settings converters.
   *
   * This method can be overridden by subclasses to register legacy settings converters.
   */
  registerLegacySettingsConverters() {
    noop();
  }
  /**
   * Registers a validator for a property.
   *
   * @param propertyName - The name of the property.
   * @param validator - The validator.
   */
  registerValidator(propertyName, validator) {
    this.validators.set(propertyName, validator);
  }
  /**
   * Registers the validators.
   *
   * This method can be overridden by subclasses to register validators for properties.
   */
  registerValidators() {
    noop();
  }
  async cloneSettings(settings) {
    const record = await this.settingsToRawRecord(settings);
    const json = JSON.stringify(record);
    const cloneRecord = JSON.parse(json);
    return await this.rawRecordToSettings(cloneRecord);
  }
  async cloneSettingsWrapper(settingsWrapper) {
    return {
      safeSettings: await this.cloneSettings(settingsWrapper.safeSettings),
      settings: await this.cloneSettings(settingsWrapper.settings),
      validationMessages: { ...settingsWrapper.validationMessages }
    };
  }
  createDefaultSettingsWrapper() {
    return {
      safeSettings: this.createDefaultSettings(),
      settings: this.createDefaultSettings(),
      validationMessages: castTo({})
    };
  }
  async edit(settingsEditor) {
    try {
      await settingsEditor(this.currentSettingsWrapper.settings);
    } finally {
      const validationResult = await this.validate(this.currentSettingsWrapper.settings);
      for (const propertyName of this.propertyNames) {
        const validationMessage = validationResult[propertyName] ?? "";
        this.currentSettingsWrapper.validationMessages[propertyName] = validationMessage;
        this.currentSettingsWrapper.safeSettings[propertyName] = validationMessage ? this.defaultSettings[propertyName] : this.currentSettingsWrapper.settings[propertyName];
      }
    }
  }
  isValidPropertyName(prop) {
    if (typeof prop !== "string") {
      return false;
    }
    return this.propertyNames.includes(prop);
  }
  async rawRecordToSettings(rawRecord) {
    rawRecord = this.getTransformer().transformObjectRecursively(rawRecord);
    await this.onLoadRecord(rawRecord);
    const settings = this.createDefaultSettings();
    for (const [propertyName, value] of Object.entries(rawRecord)) {
      if (!this.isValidPropertyName(propertyName)) {
        getLibDebugger("PluginSettingsManagerBase:rawRecordToSettings")(`Unknown property: ${propertyName}`);
        continue;
      }
      if (typeof value !== typeof this.defaultSettings[propertyName]) {
        getLibDebugger("PluginSettingsManagerBase:rawRecordToSettings")(
          "Possible invalid value type. It might lead to an unexpected behavior of the plugin. There is also a chance it is a false-negative warning, as we are unable to determine the exact type of the value in runtime.",
          {
            defaultValue: this.defaultSettings[propertyName],
            propertyName,
            value
          }
        );
      }
      settings[propertyName] = value;
    }
    return settings;
  }
  async saveToFileImpl() {
    await this.plugin.saveData(await this.settingsToRawRecord(this.currentSettingsWrapper.settings));
  }
  setPropertyImpl(propertyName, value, validationMessage) {
    this.currentSettingsWrapper.settings[propertyName] = value;
    this.currentSettingsWrapper.validationMessages[propertyName] = validationMessage ?? "";
    this.currentSettingsWrapper.safeSettings[propertyName] = validationMessage ? this.defaultSettings[propertyName] : value;
  }
  async settingsToRawRecord(settings) {
    const rawRecord = {};
    for (const propertyName of this.propertyNames) {
      rawRecord[propertyName] = settings[propertyName];
    }
    await this.onSavingRecord(rawRecord);
    return this.getTransformer().transformObjectRecursively(rawRecord);
  }
};

// src/PluginSettings.ts
var QUICK_ACTION_DEFAULTS = [
  { label: "New note", icon: "file-plus", action: "new-note" },
  { label: "Home", icon: "home", action: "homepage" }
];
var DASHBOARD_PRESETS = {
  focus: {
    label: "Focus",
    widgets: [
      { type: "continue", enabled: true },
      { type: "new-note", enabled: true },
      { type: "trash", enabled: false }
    ]
  },
  full: {
    label: "Full",
    widgets: [
      { type: "graph", enabled: true },
      { type: "continue", enabled: true },
      { type: "trash", enabled: true },
      { type: "new-note", enabled: false }
    ]
  },
  triage: {
    label: "Triage",
    widgets: [
      { type: "trash", enabled: true },
      { type: "continue", enabled: true },
      { type: "new-note", enabled: true }
    ]
  }
};
var WIDGET_LABELS = {
  continue: "Recently Touched",
  graph: "Active Cluster (graph)",
  trash: "Needs Review",
  "new-note": "More Actions"
};
var PULSE_CARD_LABELS = {
  "daily-note": "Daily Note",
  "modified-today": "Modified Today",
  "vault": "Vault Stats",
  "trash": "Trash (conditional)",
  "quick-action": "Quick Action"
};
var DEFAULT_PULSE_CARDS = [
  { type: "daily-note", enabled: true },
  { type: "modified-today", enabled: true },
  { type: "vault", enabled: true }
];
var PluginSettings = class {
  homePath = "";
  newNoteFolder = "";
  newNoteTemplate = "";
  continueExcluded = [];
  quickActions = QUICK_ACTION_DEFAULTS.map((a) => ({ ...a }));
  newNoteFilenameFormat = "untitled";
  pulseCards = DEFAULT_PULSE_CARDS.map((c) => ({ ...c }));
  slices = [
    { label: "Cancel", icon: "\u2715", action: "cancel", color: "#666666", startAngle: 0, endAngle: 180 },
    { label: "Home", icon: "\u2302", action: "homepage", color: "#3b82f6", startAngle: 180, endAngle: 270 },
    { label: "New Note", icon: "+", action: "new-note", color: "#10b981", startAngle: 270, endAngle: 360 }
  ];
  dashboardWidgets = DASHBOARD_PRESETS.full.widgets.map((w) => ({ ...w }));
};

// src/PluginSettingsManager.ts
var PluginSettingsManager = class extends PluginSettingsManagerBase {
  createDefaultSettings() {
    return new PluginSettings();
  }
};

// src/PluginSettingsTab.ts
var import_obsidian13 = require("obsidian");

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/plugin/plugin-settings-tab-base.mjs
var import_obsidian11 = require("obsidian");

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/components/setting-components/setting-component-wrapper.mjs
(function initEsm37() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
function ensureWrapped(el) {
  const parent = el.parentElement;
  assertNonNullable(parent, "Element must be attached to the DOM");
  if (parent.classList.contains(CssClass.SettingComponentWrapper)) {
    return parent;
  }
  const children = Array.from(parent.children);
  const wrapper = createDiv();
  addPluginCssClasses(wrapper, CssClass.SettingComponentWrapper);
  for (const child of children) {
    wrapper.appendChild(child);
  }
  parent.appendChild(wrapper);
  return wrapper;
}

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/components/setting-components/text-based-component.mjs
var import_obsidian8 = require("obsidian");
(function initEsm38() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var AbstractTextComponentWrapper = class {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- `unknown` doesn't work, getting compiler errors.
  constructor(abstractTextComponent) {
    this.abstractTextComponent = abstractTextComponent;
  }
  abstractTextComponent;
  empty() {
    this.abstractTextComponent.setValue("");
  }
  isEmpty() {
    return this.abstractTextComponent.getValue() === "";
  }
  setPlaceholderValue(placeholderValue) {
    this.abstractTextComponent.setPlaceholder(placeholderValue);
    return this;
  }
};
function getTextBasedComponentValue(obj) {
  if (isTextBasedComponent(obj)) {
    return obj;
  }
  if (obj instanceof import_obsidian8.AbstractTextComponent) {
    return new AbstractTextComponentWrapper(obj);
  }
  return null;
}
function isTextBasedComponent(component) {
  const textBasedComponent = component;
  return typeof textBasedComponent.setPlaceholderValue === "function" && typeof textBasedComponent.isEmpty === "function";
}

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/components/setting-components/validator-component.mjs
var import_obsidian9 = require("obsidian");
(function initEsm39() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var OverlayValidatorComponent = class {
  constructor(el) {
    this.el = el;
    const wrapper = ensureWrapped(el);
    this._validatorEl = wrapper.createEl("input", {
      attr: {
        tabindex: -1
      }
    });
    addPluginCssClasses(this._validatorEl, CssClass.OverlayValidator);
    this._validatorEl.addEventListener("focus", () => {
      this.el.focus();
    });
    this._validatorEl.isActiveElement = this.isElementOrDescendantActive.bind(this);
    let tabIndexEl = this.el.querySelector("[tabindex]");
    if (!tabIndexEl) {
      if (this.el.getAttr("tabindex") === null) {
        this.el.tabIndex = -1;
      }
      tabIndexEl = this.el;
    }
    this.el.addEventListener("focusin", () => {
      this.forceBlurValidatorEl();
    });
    this.el.addEventListener("click", () => {
      tabIndexEl.focus();
    });
    this.el.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (this.isElementOrDescendantActive()) {
          return;
        }
        this.forceBlurValidatorEl();
      }, 0);
    });
  }
  el;
  get validatorEl() {
    return this._validatorEl;
  }
  _validatorEl;
  forceBlurValidatorEl() {
    this._validatorEl.dispatchEvent(new Event("blur"));
  }
  isElementOrDescendantActive() {
    return this.el.contains(document.activeElement);
  }
};
var ValidatorElementWrapper = class {
  constructor(validatorEl) {
    this.validatorEl = validatorEl;
  }
  validatorEl;
};
function getValidatorComponent(obj) {
  if (isValidatorComponent(obj)) {
    return obj;
  }
  if (obj instanceof import_obsidian9.ColorComponent) {
    return new ValidatorElementWrapper(obj.colorPickerEl);
  }
  if (obj instanceof import_obsidian9.DropdownComponent) {
    return new ValidatorElementWrapper(obj.selectEl);
  }
  if (obj instanceof import_obsidian9.ProgressBarComponent) {
    return new OverlayValidatorComponent(obj.progressBar);
  }
  if (obj instanceof import_obsidian9.SearchComponent) {
    return new ValidatorElementWrapper(obj.inputEl);
  }
  if (obj instanceof import_obsidian9.SliderComponent) {
    return new ValidatorElementWrapper(obj.sliderEl);
  }
  if (obj instanceof import_obsidian9.TextAreaComponent) {
    return new ValidatorElementWrapper(obj.inputEl);
  }
  if (obj instanceof import_obsidian9.TextComponent) {
    return new ValidatorElementWrapper(obj.inputEl);
  }
  if (obj instanceof import_obsidian9.ToggleComponent) {
    return new OverlayValidatorComponent(obj.toggleEl);
  }
  return null;
}
function isValidatorComponent(obj) {
  return typeof obj === "object" && obj !== null && "validatorEl" in obj && !!obj.validatorEl;
}

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/validation.mjs
var import_obsidian10 = require("obsidian");
(function initEsm40() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
function isValidationMessageHolder(value) {
  return value.validationMessage !== void 0;
}

// node_modules/obsidian-dev-utils/dist/lib/esm/obsidian/plugin/plugin-settings-tab-base.mjs
(function initEsm41() {
  if (globalThis.process) {
    return;
  }
  const browserProcess = {
    browser: true,
    cwd() {
      return "/";
    },
    env: {},
    platform: "android"
  };
  globalThis.process = browserProcess;
})();
var SAVE_TO_FILE_CONTEXT = "PluginSettingsTab";
var PluginSettingsTabBase = class extends import_obsidian11.PluginSettingTab {
  /**
   * Creates a new plugin settings tab.
   *
   * @param plugin - The plugin.
   */
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
    addPluginCssClasses(this.containerEl, CssClass.PluginSettingsTab);
    this.saveSettingsDebounced = (0, import_obsidian11.debounce)(
      convertAsyncToSync(() => this.plugin.settingsManager.saveToFile(SAVE_TO_FILE_CONTEXT)),
      this.saveSettingsDebounceTimeoutInMilliseconds
    );
    this.asyncEventsComponent = new AsyncEventsComponent();
  }
  plugin;
  /**
   * Whether the plugin settings tab is open.
   *
   * @returns Whether the plugin settings tab is open.
   */
  get isOpen() {
    return this._isOpen;
  }
  /**
   * A debounce timeout for saving settings.
   *
   * @returns The debounce timeout for saving settings.
   */
  get saveSettingsDebounceTimeoutInMilliseconds() {
    const DEFAULT = 2e3;
    return DEFAULT;
  }
  _isOpen = false;
  asyncEventsComponent;
  saveSettingsDebounced;
  get pluginSettings() {
    return this.plugin.settingsManager.settingsWrapper.settings;
  }
  /**
   * Binds a value component to a plugin setting.
   *
   * @typeParam UIValue - The type of the value of the UI component.
   * @typeParam TValueComponent - The type of the value component.
   * @typeParam PropertyName - The property name of the plugin settings to bind to.
   * @param valueComponent - The value component to bind.
   * @param propertyName - The property name of the plugin settings to bind to.
   * @param options - The options for binding the value component.
   * @returns The value component.
   */
  bind(valueComponent, propertyName, options) {
    const DEFAULT_OPTIONS = {
      componentToPluginSettingsValueConverter: (value) => value,
      onChanged: noop,
      pluginSettingsToComponentValueConverter: (value) => value,
      shouldResetSettingWhenComponentIsEmpty: true,
      shouldShowPlaceholderForDefaultValues: true,
      shouldShowValidationMessage: true
    };
    const optionsExt = { ...DEFAULT_OPTIONS, ...options };
    const validatorEl = getValidatorComponent(valueComponent)?.validatorEl;
    const textBasedComponent = getTextBasedComponentValue(valueComponent);
    const readonlyValue = this.pluginSettings[propertyName];
    const defaultValue = this.plugin.settingsManager.defaultSettings[propertyName];
    const defaultComponentValue = optionsExt.pluginSettingsToComponentValueConverter(defaultValue);
    textBasedComponent?.setPlaceholderValue(defaultComponentValue);
    let validationMessage;
    let tooltipEl = null;
    let tooltipContentEl = null;
    if (validatorEl) {
      const wrapper = ensureWrapped(validatorEl);
      tooltipEl = wrapper.createDiv();
      addPluginCssClasses(tooltipEl, CssClass.Tooltip, CssClass.TooltipValidator);
      tooltipContentEl = tooltipEl.createSpan();
      const tooltipArrowEl = tooltipEl.createDiv();
      addPluginCssClasses(tooltipArrowEl, CssClass.TooltipArrow);
      tooltipEl.hide();
      wrapper.appendChild(tooltipEl);
    }
    this.asyncEventsComponent.registerAsyncEvent(this.on("validationMessageChanged", (anotherPropertyName, anotherValidationMessage) => {
      if (propertyName !== anotherPropertyName) {
        return;
      }
      validationMessage = anotherValidationMessage;
      updateValidatorElDebounced();
    }));
    let shouldEmptyOnBlur = false;
    let shouldRevertToDefaultValueOnBlur = false;
    if (textBasedComponent && optionsExt.shouldShowPlaceholderForDefaultValues && deepEqual(readonlyValue, defaultValue)) {
      textBasedComponent.empty();
    } else {
      valueComponent.setValue(optionsExt.pluginSettingsToComponentValueConverter(readonlyValue));
    }
    let shouldSkipOnChange = false;
    const UPDATE_VALIDATOR_EL_TIMEOUT_IN_MILLISECONDS = 100;
    const updateValidatorElDebounced = (0, import_obsidian11.debounce)(() => {
      requestAnimationFrame(() => {
        updateValidatorEl();
      });
    }, UPDATE_VALIDATOR_EL_TIMEOUT_IN_MILLISECONDS);
    valueComponent.onChange(async (uiValue) => {
      if (shouldSkipOnChange) {
        shouldSkipOnChange = false;
        return;
      }
      shouldEmptyOnBlur = false;
      const oldValue = this.pluginSettings[propertyName];
      let newValue = void 0;
      let shouldSetProperty = true;
      shouldRevertToDefaultValueOnBlur = !!textBasedComponent?.isEmpty() && optionsExt.shouldResetSettingWhenComponentIsEmpty;
      if (shouldRevertToDefaultValueOnBlur) {
        newValue = defaultValue;
      } else {
        const convertedValue = optionsExt.componentToPluginSettingsValueConverter(uiValue);
        if (isValidationMessageHolder(convertedValue)) {
          validationMessage = convertedValue.validationMessage;
          shouldSetProperty = false;
        } else {
          newValue = convertedValue;
        }
      }
      if (shouldSetProperty) {
        validationMessage = await this.plugin.settingsManager.setProperty(propertyName, newValue);
        if (textBasedComponent && optionsExt.shouldShowPlaceholderForDefaultValues && !textBasedComponent.isEmpty() && deepEqual(newValue, defaultValue)) {
          shouldEmptyOnBlur = true;
        }
      }
      updateValidatorElDebounced();
      if (shouldSetProperty) {
        await optionsExt.onChanged(newValue, oldValue);
      }
      this.saveSettingsDebounced();
    });
    validatorEl?.addEventListener("focus", () => {
      updateValidatorElDebounced();
    });
    validatorEl?.addEventListener("blur", () => {
      updateValidatorElDebounced();
    });
    validatorEl?.addEventListener("click", () => {
      requestAnimationFrame(() => {
        updateValidatorElDebounced();
      });
    });
    validationMessage = this.plugin.settingsManager.settingsWrapper.validationMessages[propertyName] ?? "";
    updateValidatorElDebounced();
    return valueComponent;
    function updateValidatorEl() {
      if (!validatorEl?.isActiveElement()) {
        if (shouldEmptyOnBlur) {
          shouldEmptyOnBlur = false;
          if (!textBasedComponent?.isEmpty()) {
            shouldSkipOnChange = true;
            textBasedComponent?.empty();
          }
        } else if (shouldRevertToDefaultValueOnBlur) {
          shouldRevertToDefaultValueOnBlur = false;
          if (textBasedComponent?.isEmpty()) {
            shouldSkipOnChange = true;
            valueComponent.setValue(defaultComponentValue);
          }
        }
      }
      if (!validatorEl) {
        return;
      }
      if (validationMessage === "") {
        validatorEl.setCustomValidity("");
        validatorEl.checkValidity();
        validationMessage = validatorEl.validationMessage;
      }
      validatorEl.setCustomValidity(validationMessage);
      if (optionsExt.shouldShowValidationMessage) {
        if (tooltipContentEl) {
          tooltipContentEl.textContent = validationMessage;
        }
        tooltipEl?.toggle(!!validationMessage);
      } else if (validationMessage) {
        (0, import_obsidian11.setTooltip)(validatorEl, validationMessage);
      }
    }
  }
  /**
   * Renders the plugin settings tab.
   */
  display() {
    this.containerEl.empty();
    this._isOpen = true;
    this.asyncEventsComponent.load();
    this.asyncEventsComponent.registerAsyncEvent(this.plugin.settingsManager.on("loadSettings", this.onLoadSettings.bind(this)));
    this.asyncEventsComponent.registerAsyncEvent(this.plugin.settingsManager.on("saveSettings", this.onSaveSettings.bind(this)));
  }
  /**
   * Hides the plugin settings tab.
   */
  hide() {
    super.hide();
    this.saveSettingsDebounced.cancel();
    this._isOpen = false;
    this.asyncEventsComponent.unload();
    this.asyncEventsComponent.load();
    invokeAsyncSafely(() => this.hideAsync());
  }
  /**
   * Async actions to perform when the settings tab is being hidden.
   *
   * @returns A {@link Promise} that resolves when the settings tab is hidden.
   */
  async hideAsync() {
    await this.plugin.settingsManager.saveToFile(SAVE_TO_FILE_CONTEXT);
  }
  /**
   * Shows the plugin settings tab.
   */
  show() {
    this.app.setting.openTab(this);
  }
  /**
   * Called when the plugin settings are loaded.
   *
   * @param _loadedSettings - The loaded settings.
   * @param _isInitialLoad - Whether the settings are being loaded for the first time.
   * @returns A {@link Promise} that resolves when the settings are loaded.
   */
  async onLoadSettings(_loadedSettings, _isInitialLoad) {
    this.display();
    await noopAsync();
  }
  /**
   * Revalidates the settings.
   *
   * @returns A {@link Promise} that resolves when the settings are revalidated.
   */
  async revalidate() {
    const validationMessages = await this.plugin.settingsManager.revalidate();
    await this.updateValidations(validationMessages);
  }
  on(name, callback, thisArg) {
    return this.asyncEventsComponent.asyncEvents.on(name, callback, thisArg);
  }
  async onSaveSettings(newSettings, _oldSettings, context) {
    if (context === SAVE_TO_FILE_CONTEXT) {
      await this.updateValidations(newSettings.validationMessages);
      return;
    }
    this.display();
  }
  async updateValidations(validationMessages) {
    for (const [propertyName, validationMessage] of Object.entries(validationMessages)) {
      await this.asyncEventsComponent.asyncEvents.triggerAsync("validationMessageChanged", propertyName, validationMessage);
    }
  }
};

// src/Modals/CommandPickerModal.ts
var import_obsidian12 = require("obsidian");
var CommandPickerModal = class extends import_obsidian12.FuzzySuggestModal {
  onChoose;
  constructor(app, onChoose) {
    super(app);
    this.onChoose = onChoose;
    this.setPlaceholder("Search commands\u2026");
  }
  getItems() {
    return this.app.commands.listCommands().sort((a, b) => a.name.localeCompare(b.name));
  }
  getItemText(command) {
    return command.name;
  }
  onChooseItem(command) {
    this.onChoose(command);
  }
};

// src/PluginSettingsTab.ts
var PluginSettingsTab = class extends PluginSettingsTabBase {
  display() {
    this.containerEl.empty();
    const s = this.plugin.settings;
    new import_obsidian13.Setting(this.containerEl).setName("Homepage file path").setDesc('Path to your home note, e.g. "Home.md" or "Notes/Index.md"').addText((text) => {
      text.setPlaceholder("Home.md").setValue(s.homePath).onChange((val) => {
        s.homePath = val.trim();
        void this.plugin.settingsManager.saveToFile();
      });
    });
    new import_obsidian13.Setting(this.containerEl).setName("New note folder").setDesc("Folder for new notes. Leave blank for vault root.").addText((text) => {
      text.setPlaceholder("Inbox").setValue(s.newNoteFolder).onChange((val) => {
        s.newNoteFolder = val.trim();
        void this.plugin.settingsManager.saveToFile();
      });
    });
    new import_obsidian13.Setting(this.containerEl).setName("New note template").setDesc("Path to a template file. Leave blank for an empty note. If Templater is installed, its syntax will be processed.").addText((text) => {
      text.setPlaceholder("Templates/New Note.md").setValue(s.newNoteTemplate).onChange((val) => {
        s.newNoteTemplate = val.trim();
        void this.plugin.settingsManager.saveToFile();
      });
    });
    new import_obsidian13.Setting(this.containerEl).setName("New note filename format").setDesc('Untitled uses "Untitled YYYY-MM-DD". Zettelkasten uses a 14-digit timestamp ID (YYYYMMDDHHmmss).').addDropdown((dd) => {
      dd.addOption("untitled", "Untitled + date").addOption("zettelkasten", "Zettelkasten ID (unique notes)").setValue(s.newNoteFilenameFormat).onChange((val) => {
        s.newNoteFilenameFormat = val;
        void this.plugin.settingsManager.saveToFile();
      });
    });
    new import_obsidian13.Setting(this.containerEl).setName("Continue \u2014 excluded paths").setDesc("Files or folders to hide from the Continue list. One path per line. Folders should end with /.").addTextArea((t3) => {
      t3.setPlaceholder("Meta/Home.md\nTemplates/").setValue((s.continueExcluded ?? []).join("\n")).onChange((val) => {
        s.continueExcluded = val.split("\n").map((p) => p.trim()).filter(Boolean);
        void this.plugin.settingsManager.saveToFile();
      });
      t3.inputEl.rows = 4;
      t3.inputEl.style.width = "100%";
    });
    this.renderDashboardSection(s);
    this.renderPulseCardsSection(s);
    this.renderQuickActionsSection(s);
    this.containerEl.createEl("h3", { text: "Slices" });
    this.containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Angles use SVG screen coordinates: 0\xB0=right, 90\xB0=bottom, 180\xB0=left, 270\xB0=top. Default layout: bottom half (0\u2192180) = cancel, top-left (180\u2192270) = home, top-right (270\u2192360) = new note."
    });
    const slices = s.slices;
    for (let i = 0; i < slices.length; i++) {
      this.renderSlice(slices, i);
    }
    new import_obsidian13.Setting(this.containerEl).addButton((btn) => {
      btn.setButtonText("Add slice").setCta().onClick(() => {
        slices.push({
          label: "New Slice",
          icon: "\u2605",
          action: "cancel",
          color: "#888888",
          startAngle: 0,
          endAngle: 90
        });
        void this.plugin.settingsManager.saveToFile();
        this.display();
      });
    }).addButton((btn) => {
      btn.setButtonText("Reset to defaults").onClick(() => {
        this.plugin.settings.slices = new PluginSettings().slices;
        void this.plugin.settingsManager.saveToFile();
        this.display();
      });
    });
  }
  renderSlice(slices, i) {
    const slice = slices[i];
    if (!slice) return;
    const save = () => {
      this.validateAngles(slices);
      void this.plugin.settingsManager.saveToFile();
    };
    this.containerEl.createEl("h4", { text: `Slice ${i + 1}: ${slice.label}` });
    new import_obsidian13.Setting(this.containerEl).setName("Label").addText((t3) => {
      t3.setValue(slice.label).onChange((v) => {
        slice.label = v;
        save();
      });
    });
    new import_obsidian13.Setting(this.containerEl).setName("Icon").setDesc("Emoji or single character").addText((t3) => {
      t3.setValue(slice.icon).onChange((v) => {
        slice.icon = v;
        save();
      });
    });
    new import_obsidian13.Setting(this.containerEl).setName("Action").addDropdown((dd) => {
      dd.addOption("cancel", "Cancel (close menu)").addOption("dashboard", "Open dashboard").addOption("homepage", "Open homepage").addOption("new-note", "Create new note").addOption("command", "Run Obsidian command").setValue(slice.action).onChange((v) => {
        slice.action = v;
        save();
        this.display();
      });
    });
    if (slice.action === "command") {
      new import_obsidian13.Setting(this.containerEl).setName("Command").setDesc(slice.commandId ? `ID: ${slice.commandId}` : "No command selected").addButton((btn) => {
        btn.setButtonText(slice.commandId ? "Change\u2026" : "Choose command\u2026").onClick(() => {
          new CommandPickerModal(this.app, (cmd) => {
            slice.commandId = cmd.id;
            save();
            this.display();
          }).open();
        });
      });
    }
    new import_obsidian13.Setting(this.containerEl).setName("Angles").setDesc("Start angle \u2192 end angle in degrees").addText((t3) => {
      t3.setPlaceholder("Start").setValue(String(slice.startAngle)).onChange((v) => {
        const n = Number(v);
        if (!isNaN(n)) {
          slice.startAngle = n;
          save();
        }
      });
    }).addText((t3) => {
      t3.setPlaceholder("End").setValue(String(slice.endAngle)).onChange((v) => {
        const n = Number(v);
        if (!isNaN(n)) {
          slice.endAngle = n;
          save();
        }
      });
    });
    new import_obsidian13.Setting(this.containerEl).setName("Color").addColorPicker((cp) => {
      cp.setValue(slice.color).onChange((v) => {
        slice.color = v;
        save();
      });
    }).addButton((btn) => {
      btn.setButtonText("Remove").setWarning().onClick(() => {
        slices.splice(i, 1);
        void this.plugin.settingsManager.saveToFile();
        this.display();
      });
    });
    this.containerEl.createEl("hr");
  }
  renderDashboardSection(s) {
    this.containerEl.createEl("h3", { text: "Dashboard" });
    const presetSetting = new import_obsidian13.Setting(this.containerEl).setName("Presets").setDesc("Apply a preset widget layout.");
    const presets = Object.values(DASHBOARD_PRESETS);
    for (const preset of presets) {
      presetSetting.addButton((btn) => {
        btn.setButtonText(preset.label).onClick(() => {
          s.dashboardWidgets = preset.widgets.map((w) => ({ type: w.type, enabled: w.enabled }));
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      });
    }
    const widgets = s.dashboardWidgets;
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      if (!widget) continue;
      new import_obsidian13.Setting(this.containerEl).setName(WIDGET_LABELS[widget.type]).addToggle((t3) => {
        t3.setValue(widget.enabled).onChange((v) => {
          widget.enabled = v;
          void this.plugin.settingsManager.saveToFile();
        });
      }).addExtraButton((btn) => {
        btn.setIcon("arrow-up").setTooltip("Move up").onClick(() => {
          if (i === 0) return;
          const prev = widgets[i - 1];
          const curr = widgets[i];
          if (prev && curr) {
            widgets[i - 1] = curr;
            widgets[i] = prev;
          }
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      }).addExtraButton((btn) => {
        btn.setIcon("arrow-down").setTooltip("Move down").onClick(() => {
          if (i === widgets.length - 1) return;
          const next = widgets[i + 1];
          const curr = widgets[i];
          if (next && curr) {
            widgets[i + 1] = curr;
            widgets[i] = next;
          }
          void this.plugin.settingsManager.saveToFile();
          this.display();
        });
      });
    }
  }
  renderPulseCardsSection(s) {
    this.containerEl.createEl("h3", { text: "Pulse Cards" });
    this.containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Cards shown below the date header. Trash only appears when there are stale notes. Quick Action cards use any action from your Quick Actions list."
    });
    const cards = s.pulseCards;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (!card) continue;
      const save = () => {
        void this.plugin.settingsManager.saveToFile();
      };
      const setting = new import_obsidian13.Setting(this.containerEl).setName(card.type === "quick-action" && card.quickAction ? card.quickAction.label : PULSE_CARD_LABELS[card.type]).addToggle((t3) => {
        t3.setValue(card.enabled).onChange((v) => {
          card.enabled = v;
          save();
        });
      }).addExtraButton((btn) => {
        btn.setIcon("arrow-up").setTooltip("Move up").onClick(() => {
          if (i === 0) return;
          [cards[i - 1], cards[i]] = [cards[i], cards[i - 1]];
          save();
          this.display();
        });
      }).addExtraButton((btn) => {
        btn.setIcon("arrow-down").setTooltip("Move down").onClick(() => {
          if (i === cards.length - 1) return;
          [cards[i + 1], cards[i]] = [cards[i], cards[i + 1]];
          save();
          this.display();
        });
      }).addButton((btn) => {
        btn.setButtonText("Remove").setWarning().onClick(() => {
          cards.splice(i, 1);
          save();
          this.display();
        });
      });
      if (card.type === "quick-action") {
        const action = card.quickAction;
        setting.setDesc(action ? `${action.action}${action.commandId ? ` \xB7 ${action.commandId}` : ""}` : "Not configured");
      }
    }
    new import_obsidian13.Setting(this.containerEl).addDropdown((dd) => {
      dd.addOption("daily-note", PULSE_CARD_LABELS["daily-note"]).addOption("modified-today", PULSE_CARD_LABELS["modified-today"]).addOption("vault", PULSE_CARD_LABELS["vault"]).addOption("trash", PULSE_CARD_LABELS["trash"]).addOption("quick-action", PULSE_CARD_LABELS["quick-action"]);
      dd.onChange((val) => {
        const type = val;
        if (type === "quick-action") {
          cards.push({ type, enabled: true, quickAction: { label: "Action", icon: "zap", action: "new-note" } });
        } else {
          cards.push({ type, enabled: true });
        }
        void this.plugin.settingsManager.saveToFile();
        this.display();
      });
      dd.setValue("daily-note");
    }).addButton((btn) => {
      btn.setButtonText("Reset").onClick(() => {
        s.pulseCards = DEFAULT_PULSE_CARDS.map((c) => ({ ...c }));
        void this.plugin.settingsManager.saveToFile();
        this.display();
      });
    });
  }
  renderQuickActionsSection(s) {
    this.containerEl.createEl("h3", { text: "Quick Actions" });
    this.containerEl.createEl("p", {
      cls: "setting-item-description",
      text: 'Buttons shown in the dashboard Quick Actions section. "Append to note" opens a text prompt and appends the result to a specified note using a template ({{text}} is replaced with what you type).'
    });
    const actions = s.quickActions;
    for (let i = 0; i < actions.length; i++) {
      this.renderQuickAction(s, actions, i);
    }
    new import_obsidian13.Setting(this.containerEl).addButton((btn) => {
      btn.setButtonText("Add action").setCta().onClick(() => {
        actions.push({ label: "New Action", icon: "zap", action: "command" });
        void this.plugin.settingsManager.saveToFile();
        this.display();
      });
    }).addButton((btn) => {
      btn.setButtonText("Reset to defaults").onClick(() => {
        s.quickActions = QUICK_ACTION_DEFAULTS.map((a) => ({ ...a }));
        void this.plugin.settingsManager.saveToFile();
        this.display();
      });
    });
  }
  renderQuickAction(_s, actions, i) {
    const action = actions[i];
    if (!action) return;
    const save = () => {
      void this.plugin.settingsManager.saveToFile();
    };
    this.containerEl.createEl("h4", { text: `Action ${i + 1}: ${action.label}` });
    new import_obsidian13.Setting(this.containerEl).setName("Label").addText((t3) => {
      t3.setValue(action.label).onChange((v) => {
        action.label = v;
        save();
      });
    });
    new import_obsidian13.Setting(this.containerEl).setName("Icon").setDesc("Lucide icon name \u2014 browse at lucide.dev").addText((t3) => {
      t3.setPlaceholder("zap").setValue(action.icon).onChange((v) => {
        action.icon = v;
        save();
      });
    });
    new import_obsidian13.Setting(this.containerEl).setName("Action type").addDropdown((dd) => {
      dd.addOption("new-note", "Create new note").addOption("homepage", "Open homepage").addOption("command", "Run command").addOption("append-to-note", "Append to note").setValue(action.action).onChange((v) => {
        action.action = v;
        save();
        this.display();
      });
    });
    if (action.action === "command") {
      new import_obsidian13.Setting(this.containerEl).setName("Command").setDesc(action.commandId ? `ID: ${action.commandId}` : "No command selected").addButton((btn) => {
        btn.setButtonText(action.commandId ? "Change\u2026" : "Choose command\u2026").onClick(() => {
          new CommandPickerModal(this.app, (cmd) => {
            action.commandId = cmd.id;
            save();
            this.display();
          }).open();
        });
      });
    }
    if (action.action === "append-to-note") {
      new import_obsidian13.Setting(this.containerEl).setName("Target note").setDesc('Path to the note to append to, e.g. "Inbox/Tasks.md"').addText((t3) => {
        t3.setPlaceholder("Inbox/Tasks.md").setValue(action.notePath ?? "").onChange((v) => {
          action.notePath = v.trim();
          save();
        });
      });
      new import_obsidian13.Setting(this.containerEl).setName("Append template").setDesc("Text to append. {{text}} is replaced with your input. Default: {{text}}").addText((t3) => {
        t3.setPlaceholder("- [ ] {{text}}").setValue(action.appendTemplate ?? "").onChange((v) => {
          action.appendTemplate = v.trim();
          save();
        });
      });
    }
    new import_obsidian13.Setting(this.containerEl).addButton((btn) => {
      btn.setButtonText("Remove").setWarning().onClick(() => {
        actions.splice(i, 1);
        void this.plugin.settingsManager.saveToFile();
        this.display();
      });
    });
    this.containerEl.createEl("hr");
  }
  validateAngles(slices) {
    for (const slice of slices) {
      if (slice.startAngle >= slice.endAngle) {
        new import_obsidian13.Notice(`Slice "${slice.label}": start angle must be less than end angle.`);
        return;
      }
    }
    for (let i = 0; i < slices.length; i++) {
      for (let j = i + 1; j < slices.length; j++) {
        const a = slices[i];
        const b = slices[j];
        if (!a || !b) continue;
        if (a.startAngle < b.endAngle && b.startAngle < a.endAngle) {
          new import_obsidian13.Notice(`Slices "${a.label}" and "${b.label}" overlap. Adjust their angles.`);
          return;
        }
      }
    }
  }
};

// src/Plugin.ts
var Plugin = class extends PluginBase {
  createSettingsManager() {
    return new PluginSettingsManager(this);
  }
  createSettingsTab() {
    return new PluginSettingsTab(this);
  }
  async onloadImpl() {
    await super.onloadImpl();
    if (!import_obsidian14.Platform.isMobile && !document.body.hasClass("is-mobile")) return;
    this.addCommand({
      callback: () => {
        new RadialMenuModal(this.app, this.settings).open();
      },
      id: "open-quick-menu",
      name: "Open Quick Menu"
    });
    this.addCommand({
      callback: () => {
        new DashboardModal(this.app, this.settings).open();
      },
      id: "open-dashboard",
      name: "Open Dashboard"
    });
  }
};

// src/main.ts
var main_default = Plugin;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL21zL2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvY29tbW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvYnJvd3Nlci5qcyIsICJzcmMvbWFpbi50cyIsICJzcmMvUGx1Z2luLnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL29ic2lkaWFuL3BsdWdpbi9wbHVnaW4tYmFzZS50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9hcnJheS50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9hc3luYy1ldmVudHMudHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvZnVuY3Rpb24udHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvYWJvcnQtY29udHJvbGxlci50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9kZWJ1Zy50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy90eXBlLWd1YXJkcy50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9lcnJvci50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9saWJyYXJ5LnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL29ic2lkaWFuL2FwcC50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9vYnNpZGlhbi9pcy1pbi1vYnNpZGlhbi50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9vYnNpZGlhbi9wbHVnaW4vcGx1Z2luLWlkLnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL3N0cmluZy50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9vYmplY3QtdXRpbHMudHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvYXN5bmMudHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvb2JzaWRpYW4vd29ya3NwYWNlLnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL29ic2lkaWFuL2NvbXBvbmVudHMvYWxsLXdpbmRvd3MtZXZlbnQtaGFuZGxlci50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9vYnNpZGlhbi9jb21wb25lbnRzL2FzeW5jLWV2ZW50cy1jb21wb25lbnQudHMiLCAibm9kZV9tb2R1bGVzL2kxOG5leHQvZGlzdC9lc20vaTE4bmV4dC5qcyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9vYnNpZGlhbi9pMThuL2kxOG4udHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvb2JzaWRpYW4vaTE4bi9sb2NhbGVzL2VuLnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL29ic2lkaWFuL2kxOG4vbG9jYWxlcy90cmFuc2xhdGlvbnMtbWFwLnRzIiwgIm5vZGVfbW9kdWxlcy9jb21wYXJlLXZlcnNpb25zL3NyYy91dGlscy50cyIsICJub2RlX21vZHVsZXMvY29tcGFyZS12ZXJzaW9ucy9zcmMvY29tcGFyZVZlcnNpb25zLnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL2Nzcy1jbGFzcy50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9vYnNpZGlhbi9wbHVnaW4vcGx1Z2luLWNvbnRleHQudHMiLCAic3JjL01vZGFscy9EYXNoYm9hcmRNb2RhbC50cyIsICJzcmMvY3JlYXRlTm90ZS50cyIsICJzcmMvTW9kYWxzL0FwcGVuZFByb21wdE1vZGFsLnRzIiwgInNyYy9Nb2RhbHMvUmFkaWFsTWVudU1vZGFsLnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL3RyYW5zZm9ybWVycy90cmFuc2Zvcm1lci50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy90cmFuc2Zvcm1lcnMvdHlwZWQtdHJhbnNmb3JtZXIudHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvdHJhbnNmb3JtZXJzL2RhdGUtdHJhbnNmb3JtZXIudHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvdHJhbnNmb3JtZXJzL2R1cmF0aW9uLXRyYW5zZm9ybWVyLnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL3RyYW5zZm9ybWVycy9ncm91cC10cmFuc2Zvcm1lci50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy90cmFuc2Zvcm1lcnMvbWFwLXRyYW5zZm9ybWVyLnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL3RyYW5zZm9ybWVycy9zZXQtdHJhbnNmb3JtZXIudHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvdHJhbnNmb3JtZXJzL3NraXAtcHJpdmF0ZS1wcm9wZXJ0eS10cmFuc2Zvcm1lci50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy90d28td2F5LW1hcC50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy90cmFuc2Zvcm1lcnMvdHdvLXdheS1tYXAtdHJhbnNmb3JtZXIudHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvb2JzaWRpYW4vcGx1Z2luL3BsdWdpbi1zZXR0aW5ncy1tYW5hZ2VyLWJhc2UudHMiLCAic3JjL1BsdWdpblNldHRpbmdzLnRzIiwgInNyYy9QbHVnaW5TZXR0aW5nc01hbmFnZXIudHMiLCAic3JjL1BsdWdpblNldHRpbmdzVGFiLnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL29ic2lkaWFuL3BsdWdpbi9wbHVnaW4tc2V0dGluZ3MtdGFiLWJhc2UudHMiLCAibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRldi11dGlscy9zcmMvb2JzaWRpYW4vY29tcG9uZW50cy9zZXR0aW5nLWNvbXBvbmVudHMvc2V0dGluZy1jb21wb25lbnQtd3JhcHBlci50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9vYnNpZGlhbi9jb21wb25lbnRzL3NldHRpbmctY29tcG9uZW50cy90ZXh0LWJhc2VkLWNvbXBvbmVudC50cyIsICJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGV2LXV0aWxzL3NyYy9vYnNpZGlhbi9jb21wb25lbnRzL3NldHRpbmctY29tcG9uZW50cy92YWxpZGF0b3ItY29tcG9uZW50LnRzIiwgIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kZXYtdXRpbHMvc3JjL29ic2lkaWFuL3ZhbGlkYXRpb24udHMiLCAic3JjL01vZGFscy9Db21tYW5kUGlja2VyTW9kYWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgdyA9IGQgKiA3O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWwsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbDtcbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHBhcnNlKHZhbCk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsKSkge1xuICAgIHJldHVybiBvcHRpb25zLmxvbmcgPyBmbXRMb25nKHZhbCkgOiBmbXRTaG9ydCh2YWwpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAndmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSB2YWxpZCBudW1iZXIuIHZhbD0nICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KHZhbClcbiAgKTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG1hdGNoID0gL14oLT8oPzpcXGQrKT9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHdlZWtzP3x3fHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKFxuICAgIHN0clxuICApO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKCk7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeTtcbiAgICBjYXNlICd3ZWVrcyc6XG4gICAgY2FzZSAnd2Vlayc6XG4gICAgY2FzZSAndyc6XG4gICAgICByZXR1cm4gbiAqIHc7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRTaG9ydChtcykge1xuICB2YXIgbXNBYnMgPSBNYXRoLmFicyhtcyk7XG4gIGlmIChtc0FicyA+PSBkKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcbiAgfVxuICBpZiAobXNBYnMgPj0gaCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcbiAgfVxuICByZXR1cm4gbXMgKyAnbXMnO1xufVxuXG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10TG9uZyhtcykge1xuICB2YXIgbXNBYnMgPSBNYXRoLmFicyhtcyk7XG4gIGlmIChtc0FicyA+PSBkKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGQsICdkYXknKTtcbiAgfVxuICBpZiAobXNBYnMgPj0gaCkge1xuICAgIHJldHVybiBwbHVyYWwobXMsIG1zQWJzLCBoLCAnaG91cicpO1xuICB9XG4gIGlmIChtc0FicyA+PSBtKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIG0sICdtaW51dGUnKTtcbiAgfVxuICBpZiAobXNBYnMgPj0gcykge1xuICAgIHJldHVybiBwbHVyYWwobXMsIG1zQWJzLCBzLCAnc2Vjb25kJyk7XG4gIH1cbiAgcmV0dXJuIG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBtc0FicywgbiwgbmFtZSkge1xuICB2YXIgaXNQbHVyYWwgPSBtc0FicyA+PSBuICogMS41O1xuICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG4pICsgJyAnICsgbmFtZSArIChpc1BsdXJhbCA/ICdzJyA6ICcnKTtcbn1cbiIsICJcbi8qKlxuICogVGhpcyBpcyB0aGUgY29tbW9uIGxvZ2ljIGZvciBib3RoIHRoZSBOb2RlLmpzIGFuZCB3ZWIgYnJvd3NlclxuICogaW1wbGVtZW50YXRpb25zIG9mIGBkZWJ1ZygpYC5cbiAqL1xuXG5mdW5jdGlvbiBzZXR1cChlbnYpIHtcblx0Y3JlYXRlRGVidWcuZGVidWcgPSBjcmVhdGVEZWJ1Zztcblx0Y3JlYXRlRGVidWcuZGVmYXVsdCA9IGNyZWF0ZURlYnVnO1xuXHRjcmVhdGVEZWJ1Zy5jb2VyY2UgPSBjb2VyY2U7XG5cdGNyZWF0ZURlYnVnLmRpc2FibGUgPSBkaXNhYmxlO1xuXHRjcmVhdGVEZWJ1Zy5lbmFibGUgPSBlbmFibGU7XG5cdGNyZWF0ZURlYnVnLmVuYWJsZWQgPSBlbmFibGVkO1xuXHRjcmVhdGVEZWJ1Zy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG5cdGNyZWF0ZURlYnVnLmRlc3Ryb3kgPSBkZXN0cm95O1xuXG5cdE9iamVjdC5rZXlzKGVudikuZm9yRWFjaChrZXkgPT4ge1xuXHRcdGNyZWF0ZURlYnVnW2tleV0gPSBlbnZba2V5XTtcblx0fSk7XG5cblx0LyoqXG5cdCogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG5cdCovXG5cblx0Y3JlYXRlRGVidWcubmFtZXMgPSBbXTtcblx0Y3JlYXRlRGVidWcuc2tpcHMgPSBbXTtcblxuXHQvKipcblx0KiBNYXAgb2Ygc3BlY2lhbCBcIiVuXCIgaGFuZGxpbmcgZnVuY3Rpb25zLCBmb3IgdGhlIGRlYnVnIFwiZm9ybWF0XCIgYXJndW1lbnQuXG5cdCpcblx0KiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG5cdCovXG5cdGNyZWF0ZURlYnVnLmZvcm1hdHRlcnMgPSB7fTtcblxuXHQvKipcblx0KiBTZWxlY3RzIGEgY29sb3IgZm9yIGEgZGVidWcgbmFtZXNwYWNlXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSBUaGUgbmFtZXNwYWNlIHN0cmluZyBmb3IgdGhlIGRlYnVnIGluc3RhbmNlIHRvIGJlIGNvbG9yZWRcblx0KiBAcmV0dXJuIHtOdW1iZXJ8U3RyaW5nfSBBbiBBTlNJIGNvbG9yIGNvZGUgZm9yIHRoZSBnaXZlbiBuYW1lc3BhY2Vcblx0KiBAYXBpIHByaXZhdGVcblx0Ki9cblx0ZnVuY3Rpb24gc2VsZWN0Q29sb3IobmFtZXNwYWNlKSB7XG5cdFx0bGV0IGhhc2ggPSAwO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lc3BhY2UubGVuZ3RoOyBpKyspIHtcblx0XHRcdGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIG5hbWVzcGFjZS5jaGFyQ29kZUF0KGkpO1xuXHRcdFx0aGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcblx0XHR9XG5cblx0XHRyZXR1cm4gY3JlYXRlRGVidWcuY29sb3JzW01hdGguYWJzKGhhc2gpICUgY3JlYXRlRGVidWcuY29sb3JzLmxlbmd0aF07XG5cdH1cblx0Y3JlYXRlRGVidWcuc2VsZWN0Q29sb3IgPSBzZWxlY3RDb2xvcjtcblxuXHQvKipcblx0KiBDcmVhdGUgYSBkZWJ1Z2dlciB3aXRoIHRoZSBnaXZlbiBgbmFtZXNwYWNlYC5cblx0KlxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2Vcblx0KiBAcmV0dXJuIHtGdW5jdGlvbn1cblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVEZWJ1ZyhuYW1lc3BhY2UpIHtcblx0XHRsZXQgcHJldlRpbWU7XG5cdFx0bGV0IGVuYWJsZU92ZXJyaWRlID0gbnVsbDtcblx0XHRsZXQgbmFtZXNwYWNlc0NhY2hlO1xuXHRcdGxldCBlbmFibGVkQ2FjaGU7XG5cblx0XHRmdW5jdGlvbiBkZWJ1ZyguLi5hcmdzKSB7XG5cdFx0XHQvLyBEaXNhYmxlZD9cblx0XHRcdGlmICghZGVidWcuZW5hYmxlZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNlbGYgPSBkZWJ1ZztcblxuXHRcdFx0Ly8gU2V0IGBkaWZmYCB0aW1lc3RhbXBcblx0XHRcdGNvbnN0IGN1cnIgPSBOdW1iZXIobmV3IERhdGUoKSk7XG5cdFx0XHRjb25zdCBtcyA9IGN1cnIgLSAocHJldlRpbWUgfHwgY3Vycik7XG5cdFx0XHRzZWxmLmRpZmYgPSBtcztcblx0XHRcdHNlbGYucHJldiA9IHByZXZUaW1lO1xuXHRcdFx0c2VsZi5jdXJyID0gY3Vycjtcblx0XHRcdHByZXZUaW1lID0gY3VycjtcblxuXHRcdFx0YXJnc1swXSA9IGNyZWF0ZURlYnVnLmNvZXJjZShhcmdzWzBdKTtcblxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzWzBdICE9PSAnc3RyaW5nJykge1xuXHRcdFx0XHQvLyBBbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlT1xuXHRcdFx0XHRhcmdzLnVuc2hpZnQoJyVPJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFwcGx5IGFueSBgZm9ybWF0dGVyc2AgdHJhbnNmb3JtYXRpb25zXG5cdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0YXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16QS1aJV0pL2csIChtYXRjaCwgZm9ybWF0KSA9PiB7XG5cdFx0XHRcdC8vIElmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcblx0XHRcdFx0aWYgKG1hdGNoID09PSAnJSUnKSB7XG5cdFx0XHRcdFx0cmV0dXJuICclJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRjb25zdCBmb3JtYXR0ZXIgPSBjcmVhdGVEZWJ1Zy5mb3JtYXR0ZXJzW2Zvcm1hdF07XG5cdFx0XHRcdGlmICh0eXBlb2YgZm9ybWF0dGVyID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsID0gYXJnc1tpbmRleF07XG5cdFx0XHRcdFx0bWF0Y2ggPSBmb3JtYXR0ZXIuY2FsbChzZWxmLCB2YWwpO1xuXG5cdFx0XHRcdFx0Ly8gTm93IHdlIG5lZWQgdG8gcmVtb3ZlIGBhcmdzW2luZGV4XWAgc2luY2UgaXQncyBpbmxpbmVkIGluIHRoZSBgZm9ybWF0YFxuXHRcdFx0XHRcdGFyZ3Muc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0XHRpbmRleC0tO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBtYXRjaDtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBBcHBseSBlbnYtc3BlY2lmaWMgZm9ybWF0dGluZyAoY29sb3JzLCBldGMuKVxuXHRcdFx0Y3JlYXRlRGVidWcuZm9ybWF0QXJncy5jYWxsKHNlbGYsIGFyZ3MpO1xuXG5cdFx0XHRjb25zdCBsb2dGbiA9IHNlbGYubG9nIHx8IGNyZWF0ZURlYnVnLmxvZztcblx0XHRcdGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXHRcdH1cblxuXHRcdGRlYnVnLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcblx0XHRkZWJ1Zy51c2VDb2xvcnMgPSBjcmVhdGVEZWJ1Zy51c2VDb2xvcnMoKTtcblx0XHRkZWJ1Zy5jb2xvciA9IGNyZWF0ZURlYnVnLnNlbGVjdENvbG9yKG5hbWVzcGFjZSk7XG5cdFx0ZGVidWcuZXh0ZW5kID0gZXh0ZW5kO1xuXHRcdGRlYnVnLmRlc3Ryb3kgPSBjcmVhdGVEZWJ1Zy5kZXN0cm95OyAvLyBYWFggVGVtcG9yYXJ5LiBXaWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS5cblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZWJ1ZywgJ2VuYWJsZWQnLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogKCkgPT4ge1xuXHRcdFx0XHRpZiAoZW5hYmxlT3ZlcnJpZGUgIT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gZW5hYmxlT3ZlcnJpZGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5hbWVzcGFjZXNDYWNoZSAhPT0gY3JlYXRlRGVidWcubmFtZXNwYWNlcykge1xuXHRcdFx0XHRcdG5hbWVzcGFjZXNDYWNoZSA9IGNyZWF0ZURlYnVnLm5hbWVzcGFjZXM7XG5cdFx0XHRcdFx0ZW5hYmxlZENhY2hlID0gY3JlYXRlRGVidWcuZW5hYmxlZChuYW1lc3BhY2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGVuYWJsZWRDYWNoZTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IHYgPT4ge1xuXHRcdFx0XHRlbmFibGVPdmVycmlkZSA9IHY7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBFbnYtc3BlY2lmaWMgaW5pdGlhbGl6YXRpb24gbG9naWMgZm9yIGRlYnVnIGluc3RhbmNlc1xuXHRcdGlmICh0eXBlb2YgY3JlYXRlRGVidWcuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Y3JlYXRlRGVidWcuaW5pdChkZWJ1Zyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlYnVnO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXh0ZW5kKG5hbWVzcGFjZSwgZGVsaW1pdGVyKSB7XG5cdFx0Y29uc3QgbmV3RGVidWcgPSBjcmVhdGVEZWJ1Zyh0aGlzLm5hbWVzcGFjZSArICh0eXBlb2YgZGVsaW1pdGVyID09PSAndW5kZWZpbmVkJyA/ICc6JyA6IGRlbGltaXRlcikgKyBuYW1lc3BhY2UpO1xuXHRcdG5ld0RlYnVnLmxvZyA9IHRoaXMubG9nO1xuXHRcdHJldHVybiBuZXdEZWJ1Zztcblx0fVxuXG5cdC8qKlxuXHQqIEVuYWJsZXMgYSBkZWJ1ZyBtb2RlIGJ5IG5hbWVzcGFjZXMuIFRoaXMgY2FuIGluY2x1ZGUgbW9kZXNcblx0KiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuXHRcdGNyZWF0ZURlYnVnLnNhdmUobmFtZXNwYWNlcyk7XG5cdFx0Y3JlYXRlRGVidWcubmFtZXNwYWNlcyA9IG5hbWVzcGFjZXM7XG5cblx0XHRjcmVhdGVEZWJ1Zy5uYW1lcyA9IFtdO1xuXHRcdGNyZWF0ZURlYnVnLnNraXBzID0gW107XG5cblx0XHRjb25zdCBzcGxpdCA9ICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycgPyBuYW1lc3BhY2VzIDogJycpXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXFxzKy9nLCAnLCcpXG5cdFx0XHQuc3BsaXQoJywnKVxuXHRcdFx0LmZpbHRlcihCb29sZWFuKTtcblxuXHRcdGZvciAoY29uc3QgbnMgb2Ygc3BsaXQpIHtcblx0XHRcdGlmIChuc1swXSA9PT0gJy0nKSB7XG5cdFx0XHRcdGNyZWF0ZURlYnVnLnNraXBzLnB1c2gobnMuc2xpY2UoMSkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3JlYXRlRGVidWcubmFtZXMucHVzaChucyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gc3RyaW5nIG1hdGNoZXMgYSBuYW1lc3BhY2UgdGVtcGxhdGUsIGhvbm9yaW5nXG5cdCAqIGFzdGVyaXNrcyBhcyB3aWxkY2FyZHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzZWFyY2hcblx0ICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRmdW5jdGlvbiBtYXRjaGVzVGVtcGxhdGUoc2VhcmNoLCB0ZW1wbGF0ZSkge1xuXHRcdGxldCBzZWFyY2hJbmRleCA9IDA7XG5cdFx0bGV0IHRlbXBsYXRlSW5kZXggPSAwO1xuXHRcdGxldCBzdGFySW5kZXggPSAtMTtcblx0XHRsZXQgbWF0Y2hJbmRleCA9IDA7XG5cblx0XHR3aGlsZSAoc2VhcmNoSW5kZXggPCBzZWFyY2gubGVuZ3RoKSB7XG5cdFx0XHRpZiAodGVtcGxhdGVJbmRleCA8IHRlbXBsYXRlLmxlbmd0aCAmJiAodGVtcGxhdGVbdGVtcGxhdGVJbmRleF0gPT09IHNlYXJjaFtzZWFyY2hJbmRleF0gfHwgdGVtcGxhdGVbdGVtcGxhdGVJbmRleF0gPT09ICcqJykpIHtcblx0XHRcdFx0Ly8gTWF0Y2ggY2hhcmFjdGVyIG9yIHByb2NlZWQgd2l0aCB3aWxkY2FyZFxuXHRcdFx0XHRpZiAodGVtcGxhdGVbdGVtcGxhdGVJbmRleF0gPT09ICcqJykge1xuXHRcdFx0XHRcdHN0YXJJbmRleCA9IHRlbXBsYXRlSW5kZXg7XG5cdFx0XHRcdFx0bWF0Y2hJbmRleCA9IHNlYXJjaEluZGV4O1xuXHRcdFx0XHRcdHRlbXBsYXRlSW5kZXgrKzsgLy8gU2tpcCB0aGUgJyonXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VhcmNoSW5kZXgrKztcblx0XHRcdFx0XHR0ZW1wbGF0ZUluZGV4Kys7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoc3RhckluZGV4ICE9PSAtMSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5lZ2F0ZWQtY29uZGl0aW9uXG5cdFx0XHRcdC8vIEJhY2t0cmFjayB0byB0aGUgbGFzdCAnKicgYW5kIHRyeSB0byBtYXRjaCBtb3JlIGNoYXJhY3RlcnNcblx0XHRcdFx0dGVtcGxhdGVJbmRleCA9IHN0YXJJbmRleCArIDE7XG5cdFx0XHRcdG1hdGNoSW5kZXgrKztcblx0XHRcdFx0c2VhcmNoSW5kZXggPSBtYXRjaEluZGV4O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlOyAvLyBObyBtYXRjaFxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSB0cmFpbGluZyAnKicgaW4gdGVtcGxhdGVcblx0XHR3aGlsZSAodGVtcGxhdGVJbmRleCA8IHRlbXBsYXRlLmxlbmd0aCAmJiB0ZW1wbGF0ZVt0ZW1wbGF0ZUluZGV4XSA9PT0gJyonKSB7XG5cdFx0XHR0ZW1wbGF0ZUluZGV4Kys7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRlbXBsYXRlSW5kZXggPT09IHRlbXBsYXRlLmxlbmd0aDtcblx0fVxuXG5cdC8qKlxuXHQqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuXHQqXG5cdCogQHJldHVybiB7U3RyaW5nfSBuYW1lc3BhY2VzXG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gZGlzYWJsZSgpIHtcblx0XHRjb25zdCBuYW1lc3BhY2VzID0gW1xuXHRcdFx0Li4uY3JlYXRlRGVidWcubmFtZXMsXG5cdFx0XHQuLi5jcmVhdGVEZWJ1Zy5za2lwcy5tYXAobmFtZXNwYWNlID0+ICctJyArIG5hbWVzcGFjZSlcblx0XHRdLmpvaW4oJywnKTtcblx0XHRjcmVhdGVEZWJ1Zy5lbmFibGUoJycpO1xuXHRcdHJldHVybiBuYW1lc3BhY2VzO1xuXHR9XG5cblx0LyoqXG5cdCogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVcblx0KiBAcmV0dXJuIHtCb29sZWFufVxuXHQqIEBhcGkgcHVibGljXG5cdCovXG5cdGZ1bmN0aW9uIGVuYWJsZWQobmFtZSkge1xuXHRcdGZvciAoY29uc3Qgc2tpcCBvZiBjcmVhdGVEZWJ1Zy5za2lwcykge1xuXHRcdFx0aWYgKG1hdGNoZXNUZW1wbGF0ZShuYW1lLCBza2lwKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBucyBvZiBjcmVhdGVEZWJ1Zy5uYW1lcykge1xuXHRcdFx0aWYgKG1hdGNoZXNUZW1wbGF0ZShuYW1lLCBucykpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCogQ29lcmNlIGB2YWxgLlxuXHQqXG5cdCogQHBhcmFtIHtNaXhlZH0gdmFsXG5cdCogQHJldHVybiB7TWl4ZWR9XG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIGNvZXJjZSh2YWwpIHtcblx0XHRpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcblx0XHRcdHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG5cdFx0fVxuXHRcdHJldHVybiB2YWw7XG5cdH1cblxuXHQvKipcblx0KiBYWFggRE8gTk9UIFVTRS4gVGhpcyBpcyBhIHRlbXBvcmFyeSBzdHViIGZ1bmN0aW9uLlxuXHQqIFhYWCBJdCBXSUxMIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS5cblx0Ki9cblx0ZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHRjb25zb2xlLndhcm4oJ0luc3RhbmNlIG1ldGhvZCBgZGVidWcuZGVzdHJveSgpYCBpcyBkZXByZWNhdGVkIGFuZCBubyBsb25nZXIgZG9lcyBhbnl0aGluZy4gSXQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24gb2YgYGRlYnVnYC4nKTtcblx0fVxuXG5cdGNyZWF0ZURlYnVnLmVuYWJsZShjcmVhdGVEZWJ1Zy5sb2FkKCkpO1xuXG5cdHJldHVybiBjcmVhdGVEZWJ1Zztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR1cDtcbiIsICIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLnN0b3JhZ2UgPSBsb2NhbHN0b3JhZ2UoKTtcbmV4cG9ydHMuZGVzdHJveSA9ICgoKSA9PiB7XG5cdGxldCB3YXJuZWQgPSBmYWxzZTtcblxuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGlmICghd2FybmVkKSB7XG5cdFx0XHR3YXJuZWQgPSB0cnVlO1xuXHRcdFx0Y29uc29sZS53YXJuKCdJbnN0YW5jZSBtZXRob2QgYGRlYnVnLmRlc3Ryb3koKWAgaXMgZGVwcmVjYXRlZCBhbmQgbm8gbG9uZ2VyIGRvZXMgYW55dGhpbmcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uIG9mIGBkZWJ1Z2AuJyk7XG5cdFx0fVxuXHR9O1xufSkoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG5cdCcjMDAwMENDJyxcblx0JyMwMDAwRkYnLFxuXHQnIzAwMzNDQycsXG5cdCcjMDAzM0ZGJyxcblx0JyMwMDY2Q0MnLFxuXHQnIzAwNjZGRicsXG5cdCcjMDA5OUNDJyxcblx0JyMwMDk5RkYnLFxuXHQnIzAwQ0MwMCcsXG5cdCcjMDBDQzMzJyxcblx0JyMwMENDNjYnLFxuXHQnIzAwQ0M5OScsXG5cdCcjMDBDQ0NDJyxcblx0JyMwMENDRkYnLFxuXHQnIzMzMDBDQycsXG5cdCcjMzMwMEZGJyxcblx0JyMzMzMzQ0MnLFxuXHQnIzMzMzNGRicsXG5cdCcjMzM2NkNDJyxcblx0JyMzMzY2RkYnLFxuXHQnIzMzOTlDQycsXG5cdCcjMzM5OUZGJyxcblx0JyMzM0NDMDAnLFxuXHQnIzMzQ0MzMycsXG5cdCcjMzNDQzY2Jyxcblx0JyMzM0NDOTknLFxuXHQnIzMzQ0NDQycsXG5cdCcjMzNDQ0ZGJyxcblx0JyM2NjAwQ0MnLFxuXHQnIzY2MDBGRicsXG5cdCcjNjYzM0NDJyxcblx0JyM2NjMzRkYnLFxuXHQnIzY2Q0MwMCcsXG5cdCcjNjZDQzMzJyxcblx0JyM5OTAwQ0MnLFxuXHQnIzk5MDBGRicsXG5cdCcjOTkzM0NDJyxcblx0JyM5OTMzRkYnLFxuXHQnIzk5Q0MwMCcsXG5cdCcjOTlDQzMzJyxcblx0JyNDQzAwMDAnLFxuXHQnI0NDMDAzMycsXG5cdCcjQ0MwMDY2Jyxcblx0JyNDQzAwOTknLFxuXHQnI0NDMDBDQycsXG5cdCcjQ0MwMEZGJyxcblx0JyNDQzMzMDAnLFxuXHQnI0NDMzMzMycsXG5cdCcjQ0MzMzY2Jyxcblx0JyNDQzMzOTknLFxuXHQnI0NDMzNDQycsXG5cdCcjQ0MzM0ZGJyxcblx0JyNDQzY2MDAnLFxuXHQnI0NDNjYzMycsXG5cdCcjQ0M5OTAwJyxcblx0JyNDQzk5MzMnLFxuXHQnI0NDQ0MwMCcsXG5cdCcjQ0NDQzMzJyxcblx0JyNGRjAwMDAnLFxuXHQnI0ZGMDAzMycsXG5cdCcjRkYwMDY2Jyxcblx0JyNGRjAwOTknLFxuXHQnI0ZGMDBDQycsXG5cdCcjRkYwMEZGJyxcblx0JyNGRjMzMDAnLFxuXHQnI0ZGMzMzMycsXG5cdCcjRkYzMzY2Jyxcblx0JyNGRjMzOTknLFxuXHQnI0ZGMzNDQycsXG5cdCcjRkYzM0ZGJyxcblx0JyNGRjY2MDAnLFxuXHQnI0ZGNjYzMycsXG5cdCcjRkY5OTAwJyxcblx0JyNGRjk5MzMnLFxuXHQnI0ZGQ0MwMCcsXG5cdCcjRkZDQzMzJ1xuXTtcblxuLyoqXG4gKiBDdXJyZW50bHkgb25seSBXZWJLaXQtYmFzZWQgV2ViIEluc3BlY3RvcnMsIEZpcmVmb3ggPj0gdjMxLFxuICogYW5kIHRoZSBGaXJlYnVnIGV4dGVuc2lvbiAoYW55IEZpcmVmb3ggdmVyc2lvbikgYXJlIGtub3duXG4gKiB0byBzdXBwb3J0IFwiJWNcIiBDU1MgY3VzdG9taXphdGlvbnMuXG4gKlxuICogVE9ETzogYWRkIGEgYGxvY2FsU3RvcmFnZWAgdmFyaWFibGUgdG8gZXhwbGljaXRseSBlbmFibGUvZGlzYWJsZSBjb2xvcnNcbiAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuXHQvLyBOQjogSW4gYW4gRWxlY3Ryb24gcHJlbG9hZCBzY3JpcHQsIGRvY3VtZW50IHdpbGwgYmUgZGVmaW5lZCBidXQgbm90IGZ1bGx5XG5cdC8vIGluaXRpYWxpemVkLiBTaW5jZSB3ZSBrbm93IHdlJ3JlIGluIENocm9tZSwgd2UnbGwganVzdCBkZXRlY3QgdGhpcyBjYXNlXG5cdC8vIGV4cGxpY2l0bHlcblx0aWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wcm9jZXNzICYmICh3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInIHx8IHdpbmRvdy5wcm9jZXNzLl9fbndqcykpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIEludGVybmV0IEV4cGxvcmVyIGFuZCBFZGdlIGRvIG5vdCBzdXBwb3J0IGNvbG9ycy5cblx0aWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC8oZWRnZXx0cmlkZW50KVxcLyhcXGQrKS8pKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0bGV0IG07XG5cblx0Ly8gSXMgd2Via2l0PyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjQ1OTYwNi8zNzY3NzNcblx0Ly8gZG9jdW1lbnQgaXMgdW5kZWZpbmVkIGluIHJlYWN0LW5hdGl2ZTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0LW5hdGl2ZS9wdWxsLzE2MzJcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cblx0cmV0dXJuICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLldlYmtpdEFwcGVhcmFuY2UpIHx8XG5cdFx0Ly8gSXMgZmlyZWJ1Zz8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzk4MTIwLzM3Njc3M1xuXHRcdCh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuY29uc29sZSAmJiAod2luZG93LmNvbnNvbGUuZmlyZWJ1ZyB8fCAod2luZG93LmNvbnNvbGUuZXhjZXB0aW9uICYmIHdpbmRvdy5jb25zb2xlLnRhYmxlKSkpIHx8XG5cdFx0Ly8gSXMgZmlyZWZveCA+PSB2MzE/XG5cdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Ub29scy9XZWJfQ29uc29sZSNTdHlsaW5nX21lc3NhZ2VzXG5cdFx0KHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgKG0gPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSkgJiYgcGFyc2VJbnQobVsxXSwgMTApID49IDMxKSB8fFxuXHRcdC8vIERvdWJsZSBjaGVjayB3ZWJraXQgaW4gdXNlckFnZW50IGp1c3QgaW4gY2FzZSB3ZSBhcmUgaW4gYSB3b3JrZXJcblx0XHQodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2FwcGxld2Via2l0XFwvKFxcZCspLykpO1xufVxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuXHRhcmdzWzBdID0gKHRoaXMudXNlQ29sb3JzID8gJyVjJyA6ICcnKSArXG5cdFx0dGhpcy5uYW1lc3BhY2UgK1xuXHRcdCh0aGlzLnVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKSArXG5cdFx0YXJnc1swXSArXG5cdFx0KHRoaXMudXNlQ29sb3JzID8gJyVjICcgOiAnICcpICtcblx0XHQnKycgKyBtb2R1bGUuZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG5cdGlmICghdGhpcy51c2VDb2xvcnMpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcblx0YXJncy5zcGxpY2UoMSwgMCwgYywgJ2NvbG9yOiBpbmhlcml0Jyk7XG5cblx0Ly8gVGhlIGZpbmFsIFwiJWNcIiBpcyBzb21ld2hhdCB0cmlja3ksIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb3RoZXJcblx0Ly8gYXJndW1lbnRzIHBhc3NlZCBlaXRoZXIgYmVmb3JlIG9yIGFmdGVyIHRoZSAlYywgc28gd2UgbmVlZCB0b1xuXHQvLyBmaWd1cmUgb3V0IHRoZSBjb3JyZWN0IGluZGV4IHRvIGluc2VydCB0aGUgQ1NTIGludG9cblx0bGV0IGluZGV4ID0gMDtcblx0bGV0IGxhc3RDID0gMDtcblx0YXJnc1swXS5yZXBsYWNlKC8lW2EtekEtWiVdL2csIG1hdGNoID0+IHtcblx0XHRpZiAobWF0Y2ggPT09ICclJScpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aW5kZXgrKztcblx0XHRpZiAobWF0Y2ggPT09ICclYycpIHtcblx0XHRcdC8vIFdlIG9ubHkgYXJlIGludGVyZXN0ZWQgaW4gdGhlICpsYXN0KiAlY1xuXHRcdFx0Ly8gKHRoZSB1c2VyIG1heSBoYXZlIHByb3ZpZGVkIHRoZWlyIG93bilcblx0XHRcdGxhc3RDID0gaW5kZXg7XG5cdFx0fVxuXHR9KTtcblxuXHRhcmdzLnNwbGljZShsYXN0QywgMCwgYyk7XG59XG5cbi8qKlxuICogSW52b2tlcyBgY29uc29sZS5kZWJ1ZygpYCB3aGVuIGF2YWlsYWJsZS5cbiAqIE5vLW9wIHdoZW4gYGNvbnNvbGUuZGVidWdgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAqIElmIGBjb25zb2xlLmRlYnVnYCBpcyBub3QgYXZhaWxhYmxlLCBmYWxscyBiYWNrXG4gKiB0byBgY29uc29sZS5sb2dgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydHMubG9nID0gY29uc29sZS5kZWJ1ZyB8fCBjb25zb2xlLmxvZyB8fCAoKCkgPT4ge30pO1xuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG5cdHRyeSB7XG5cdFx0aWYgKG5hbWVzcGFjZXMpIHtcblx0XHRcdGV4cG9ydHMuc3RvcmFnZS5zZXRJdGVtKCdkZWJ1ZycsIG5hbWVzcGFjZXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gU3dhbGxvd1xuXHRcdC8vIFhYWCAoQFFpeC0pIHNob3VsZCB3ZSBiZSBsb2dnaW5nIHRoZXNlP1xuXHR9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGxvYWQoKSB7XG5cdGxldCByO1xuXHR0cnkge1xuXHRcdHIgPSBleHBvcnRzLnN0b3JhZ2UuZ2V0SXRlbSgnZGVidWcnKSB8fCBleHBvcnRzLnN0b3JhZ2UuZ2V0SXRlbSgnREVCVUcnKSA7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gU3dhbGxvd1xuXHRcdC8vIFhYWCAoQFFpeC0pIHNob3VsZCB3ZSBiZSBsb2dnaW5nIHRoZXNlP1xuXHR9XG5cblx0Ly8gSWYgZGVidWcgaXNuJ3Qgc2V0IGluIExTLCBhbmQgd2UncmUgaW4gRWxlY3Ryb24sIHRyeSB0byBsb2FkICRERUJVR1xuXHRpZiAoIXIgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICdlbnYnIGluIHByb2Nlc3MpIHtcblx0XHRyID0gcHJvY2Vzcy5lbnYuREVCVUc7XG5cdH1cblxuXHRyZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBMb2NhbHN0b3JhZ2UgYXR0ZW1wdHMgdG8gcmV0dXJuIHRoZSBsb2NhbHN0b3JhZ2UuXG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBzYWZhcmkgdGhyb3dzXG4gKiB3aGVuIGEgdXNlciBkaXNhYmxlcyBjb29raWVzL2xvY2Fsc3RvcmFnZVxuICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAqXG4gKiBAcmV0dXJuIHtMb2NhbFN0b3JhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKSB7XG5cdHRyeSB7XG5cdFx0Ly8gVFZNTEtpdCAoQXBwbGUgVFYgSlMgUnVudGltZSkgZG9lcyBub3QgaGF2ZSBhIHdpbmRvdyBvYmplY3QsIGp1c3QgbG9jYWxTdG9yYWdlIGluIHRoZSBnbG9iYWwgY29udGV4dFxuXHRcdC8vIFRoZSBCcm93c2VyIGFsc28gaGFzIGxvY2FsU3RvcmFnZSBpbiB0aGUgZ2xvYmFsIGNvbnRleHQuXG5cdFx0cmV0dXJuIGxvY2FsU3RvcmFnZTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHQvLyBTd2FsbG93XG5cdFx0Ly8gWFhYIChAUWl4LSkgc2hvdWxkIHdlIGJlIGxvZ2dpbmcgdGhlc2U/XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbW1vbicpKGV4cG9ydHMpO1xuXG5jb25zdCB7Zm9ybWF0dGVyc30gPSBtb2R1bGUuZXhwb3J0cztcblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZm9ybWF0dGVycy5qID0gZnVuY3Rpb24gKHYpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuICdbVW5leHBlY3RlZEpTT05QYXJzZUVycm9yXTogJyArIGVycm9yLm1lc3NhZ2U7XG5cdH1cbn07XG4iLCAiaW1wb3J0ICcuL3N0eWxlcy9tYWluLmNzcyc7IC8vIERvIG5vdCBkZWxldGUgdGhpcyBsaW5lIGlmIHlvdSB3YW50IHRvIGhhdmUgYSBzdHlsZXMuY3NzIGZpbGUgaW4geW91ciBidWlsZCBvdXRwdXQuXG5pbXBvcnQgeyBQbHVnaW4gfSBmcm9tICcuL1BsdWdpbi50cyc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQteC9uby1kZWZhdWx0LWV4cG9ydCAtLSBPYnNpZGlhbiBpbmZyYXN0cnVjdHVyZSByZXF1aXJlcyBhIGRlZmF1bHQgZXhwb3J0LlxuZXhwb3J0IGRlZmF1bHQgUGx1Z2luO1xuIiwgImltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgUGx1Z2luQmFzZSB9IGZyb20gJ29ic2lkaWFuLWRldi11dGlscy9vYnNpZGlhbi9wbHVnaW4vcGx1Z2luLWJhc2UnO1xuXG5pbXBvcnQgdHlwZSB7IFBsdWdpblR5cGVzIH0gZnJvbSAnLi9QbHVnaW5UeXBlcy50cyc7XG5cbmltcG9ydCB7IERhc2hib2FyZE1vZGFsIH0gZnJvbSAnLi9Nb2RhbHMvRGFzaGJvYXJkTW9kYWwudHMnO1xuaW1wb3J0IHsgUmFkaWFsTWVudU1vZGFsIH0gZnJvbSAnLi9Nb2RhbHMvUmFkaWFsTWVudU1vZGFsLnRzJztcbmltcG9ydCB7IFBsdWdpblNldHRpbmdzTWFuYWdlciB9IGZyb20gJy4vUGx1Z2luU2V0dGluZ3NNYW5hZ2VyLnRzJztcbmltcG9ydCB7IFBsdWdpblNldHRpbmdzVGFiIH0gZnJvbSAnLi9QbHVnaW5TZXR0aW5nc1RhYi50cyc7XG5cbmV4cG9ydCBjbGFzcyBQbHVnaW4gZXh0ZW5kcyBQbHVnaW5CYXNlPFBsdWdpblR5cGVzPiB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBjcmVhdGVTZXR0aW5nc01hbmFnZXIoKTogUGx1Z2luU2V0dGluZ3NNYW5hZ2VyIHtcbiAgICByZXR1cm4gbmV3IFBsdWdpblNldHRpbmdzTWFuYWdlcih0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBjcmVhdGVTZXR0aW5nc1RhYigpOiBQbHVnaW5TZXR0aW5nc1RhYiB7XG4gICAgcmV0dXJuIG5ldyBQbHVnaW5TZXR0aW5nc1RhYih0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBhc3luYyBvbmxvYWRJbXBsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHN1cGVyLm9ubG9hZEltcGwoKTtcbiAgICBpZiAoIVBsYXRmb3JtLmlzTW9iaWxlICYmICFkb2N1bWVudC5ib2R5Lmhhc0NsYXNzKCdpcy1tb2JpbGUnKSkgcmV0dXJuO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB7IG5ldyBSYWRpYWxNZW51TW9kYWwodGhpcy5hcHAsIHRoaXMuc2V0dGluZ3MpLm9wZW4oKTsgfSxcbiAgICAgIGlkOiAnb3Blbi1xdWljay1tZW51JyxcbiAgICAgIG5hbWU6ICdPcGVuIFF1aWNrIE1lbnUnXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgY2FsbGJhY2s6ICgpID0+IHsgbmV3IERhc2hib2FyZE1vZGFsKHRoaXMuYXBwLCB0aGlzLnNldHRpbmdzKS5vcGVuKCk7IH0sXG4gICAgICBpZDogJ29wZW4tZGFzaGJvYXJkJyxcbiAgICAgIG5hbWU6ICdPcGVuIERhc2hib2FyZCdcbiAgICB9KTtcbiAgfVxufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQmFzZSBjbGFzcyBmb3IgT2JzaWRpYW4gcGx1Z2lucyBwcm92aWRpbmcgdXRpbGl0eSBtZXRob2RzIGZvciBzZXR0aW5ncyBtYW5hZ2VtZW50LCBlcnJvciBoYW5kbGluZywgYW5kIG5vdGlmaWNhdGlvbnMuXG4gKlxuICogVGhpcyBjbGFzcyBzaW1wbGlmaWVzIHRoZSBwcm9jZXNzIG9mIG1hbmFnaW5nIHBsdWdpbiBzZXR0aW5ncywgZGlzcGxheWluZyBub3RpZmljYXRpb25zLCBhbmQgaGFuZGxpbmcgZXJyb3JzLlxuICogU3ViY2xhc3NlcyBzaG91bGQgaW1wbGVtZW50IG1ldGhvZHMgdG8gY3JlYXRlIGRlZmF1bHQgc2V0dGluZ3MgYW5kIHNldHRpbmdzIHRhYnMsIGFuZCBjb21wbGV0ZSBwbHVnaW4tc3BlY2lmaWNcbiAqIGxvYWRpbmcgdGFza3MuXG4gKi9cblxuLyogdjggaWdub3JlIHN0YXJ0IC0tIERlZXBseSBjb3VwbGVkIHRvIE9ic2lkaWFuIHJ1bnRpbWU7IHJlcXVpcmVzIHJ1bm5pbmcgdmF1bHQgZm9yIG1lYW5pbmdmdWwgdGVzdGluZy4gKi9cblxuaW1wb3J0IHR5cGUgeyBSZWFkb25seURlZXAgfSBmcm9tICd0eXBlLWZlc3QnO1xuXG5pbXBvcnQge1xuICBOb3RpY2UsXG4gIFBsdWdpbiBhcyBPYnNpZGlhblBsdWdpblxufSBmcm9tICdvYnNpZGlhbic7XG5cbmltcG9ydCB0eXBlIHsgVHJhbnNsYXRpb25zTWFwIH0gZnJvbSAnLi4vaTE4bi9pMThuLnRzJztcbmltcG9ydCB0eXBlIHtcbiAgRXh0cmFjdFBsdWdpblNldHRpbmdzLFxuICBFeHRyYWN0UGx1Z2luU2V0dGluZ3NNYW5hZ2VyLFxuICBFeHRyYWN0UGx1Z2luU2V0dGluZ3NUYWIsXG4gIEV4dHJhY3RSZWFkb25seVBsdWdpblNldHRpbmdzV3JhcHBlcixcbiAgUGx1Z2luVHlwZXNCYXNlXG59IGZyb20gJy4vcGx1Z2luLXR5cGVzLWJhc2UudHMnO1xuXG5pbXBvcnQgeyBBc3luY0V2ZW50cyB9IGZyb20gJy4uLy4uL2FzeW5jLWV2ZW50cy50cyc7XG5pbXBvcnQge1xuICBjb252ZXJ0QXN5bmNUb1N5bmMsXG4gIGludm9rZUFzeW5jU2FmZWx5LFxuICBpbnZva2VBc3luY1NhZmVseUFmdGVyRGVsYXlcbn0gZnJvbSAnLi4vLi4vYXN5bmMudHMnO1xuaW1wb3J0IHsgZ2V0RGVidWdnZXIgfSBmcm9tICcuLi8uLi9kZWJ1Zy50cyc7XG5pbXBvcnQge1xuICByZWdpc3RlckFzeW5jRXJyb3JFdmVudEhhbmRsZXIsXG4gIFNpbGVudEVycm9yXG59IGZyb20gJy4uLy4uL2Vycm9yLnRzJztcbmltcG9ydCB7IG5vb3BBc3luYyB9IGZyb20gJy4uLy4uL2Z1bmN0aW9uLnRzJztcbmltcG9ydCB7IEFsbFdpbmRvd3NFdmVudEhhbmRsZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL2FsbC13aW5kb3dzLWV2ZW50LWhhbmRsZXIudHMnO1xuaW1wb3J0IHsgcmVnaXN0ZXJBc3luY0V2ZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9hc3luYy1ldmVudHMtY29tcG9uZW50LnRzJztcbmltcG9ydCB7XG4gIGluaXRJMThOLFxuICB0XG59IGZyb20gJy4uL2kxOG4vaTE4bi50cyc7XG5pbXBvcnQgeyBkZWZhdWx0VHJhbnNsYXRpb25zTWFwIH0gZnJvbSAnLi4vaTE4bi9sb2NhbGVzL3RyYW5zbGF0aW9ucy1tYXAudHMnO1xuaW1wb3J0IHtcbiAgaW5pdERlYnVnQ29udHJvbGxlcixcbiAgaW5pdFBsdWdpbkNvbnRleHRcbn0gZnJvbSAnLi9wbHVnaW4tY29udGV4dC50cyc7XG5cbnR5cGUgTGlmZWN5Y2xlRXZlbnROYW1lID0gJ2xheW91dFJlYWR5JyB8ICdsb2FkJyB8ICd1bmxvYWQnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNyZWF0aW5nIE9ic2lkaWFuIHBsdWdpbnMgd2l0aCBidWlsdC1pbiBzdXBwb3J0IGZvciBzZXR0aW5ncyBtYW5hZ2VtZW50LCBlcnJvciBoYW5kbGluZywgYW5kIG5vdGlmaWNhdGlvbnMuXG4gKlxuICogQHR5cGVQYXJhbSBQbHVnaW5UeXBlcyAtIFBsdWdpbi1zcGVjaWZpYyB0eXBlcy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBsdWdpbkJhc2U8UGx1Z2luVHlwZXMgZXh0ZW5kcyBQbHVnaW5UeXBlc0Jhc2U+IGV4dGVuZHMgT2JzaWRpYW5QbHVnaW4ge1xuICAvKipcbiAgICogVGhlIGV2ZW50cyBvZiB0aGUgcGx1Z2luLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50cyA9IG5ldyBBc3luY0V2ZW50cygpO1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBBYm9ydFNpZ25hbCB1c2VkIGZvciBhYm9ydGluZyBsb25nLXJ1bm5pbmcgb3BlcmF0aW9ucy5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGFib3J0IHNpZ25hbC5cbiAgICogQHRocm93cyBJZiB0aGUgYWJvcnQgc2lnbmFsIGlzIG5vdCBkZWZpbmVkLlxuICAgKi9cbiAgcHVibGljIGdldCBhYm9ydFNpZ25hbCgpOiBBYm9ydFNpZ25hbCB7XG4gICAgaWYgKCF0aGlzLl9hYm9ydFNpZ25hbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBYm9ydCBzaWduYWwgbm90IGRlZmluZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Fib3J0U2lnbmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJlYWRvbmx5IHBsdWdpbiBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIHJlYWRvbmx5IHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIHB1YmxpYyBnZXQgc2V0dGluZ3MoKTogUmVhZG9ubHlEZWVwPEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4+IHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc01hbmFnZXIuc2V0dGluZ3NXcmFwcGVyLnNhZmVTZXR0aW5ncyBhcyBSZWFkb25seURlZXA8RXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPj47XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcGx1Z2luIHNldHRpbmdzIG1hbmFnZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBwbHVnaW4gc2V0dGluZ3MgbWFuYWdlci5cbiAgICovXG4gIHB1YmxpYyBnZXQgc2V0dGluZ3NNYW5hZ2VyKCk6IEV4dHJhY3RQbHVnaW5TZXR0aW5nc01hbmFnZXI8UGx1Z2luVHlwZXM+IHtcbiAgICBpZiAoIXRoaXMuX3NldHRpbmdzTWFuYWdlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXR0aW5ncyBtYW5hZ2VyIG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NldHRpbmdzTWFuYWdlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBwbHVnaW4gc2V0dGluZ3MgdGFiLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgcGx1Z2luIHNldHRpbmdzIHRhYi5cbiAgICovXG4gIHB1YmxpYyBnZXQgc2V0dGluZ3NUYWIoKTogRXh0cmFjdFBsdWdpblNldHRpbmdzVGFiPFBsdWdpblR5cGVzPiB7XG4gICAgaWYgKCF0aGlzLl9zZXR0aW5nc1RhYikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXR0aW5ncyB0YWIgbm90IGRlZmluZWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3NUYWI7XG4gIH1cblxuICBwcml2YXRlIF9hYm9ydFNpZ25hbD86IEFib3J0U2lnbmFsO1xuICBwcml2YXRlIF9zZXR0aW5nc01hbmFnZXI6IEV4dHJhY3RQbHVnaW5TZXR0aW5nc01hbmFnZXI8UGx1Z2luVHlwZXM+IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX3NldHRpbmdzVGFiOiBFeHRyYWN0UGx1Z2luU2V0dGluZ3NUYWI8UGx1Z2luVHlwZXM+IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGlmZWN5Y2xlRXZlbnROYW1lcyA9IG5ldyBTZXQ8TGlmZWN5Y2xlRXZlbnROYW1lPigpO1xuICBwcml2YXRlIG5vdGljZT86IE5vdGljZTtcblxuICAvKipcbiAgICogTG9ncyBhIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGUuXG4gICAqXG4gICAqIFVzZSBpbnN0ZWFkIG9mIGBjb25zb2xlLmRlYnVnKClgLlxuICAgKlxuICAgKiBUaG9zZSBtZXNzYWdlcyBhcmUgbm90IHNob3duIGJ5IGRlZmF1bHQsIGJ1dCB0aGV5IGNhbiBiZSBzaG93biBieSBlbmFibGluZyBgeW91ci1wbHVnaW4taWRgIGRlYnVnZ2VyIG5hbWVzcGFjZS5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL21uYW91bW92L29ic2lkaWFuLWRldi11dGlscy9ibG9iL21haW4vZG9jcy9kZWJ1Z2dpbmcubWR9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbWVzc2FnZSAtIFRoZSBtZXNzYWdlIHRvIGxvZy5cbiAgICogQHBhcmFtIGFyZ3MgLSBUaGUgYXJndW1lbnRzIHRvIGxvZy5cbiAgICovXG4gIHB1YmxpYyBjb25zb2xlRGVidWcobWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiB1bmtub3duW10pOiB2b2lkIHtcbiAgICAvLyBTa2lwIHRoZSBgY29uc29sZURlYnVnKClgIGNhbGwgaXRzZWxmXG4gICAgY29uc3QgRlJBTUVTX1RPX1NLSVAgPSAxO1xuICAgIGNvbnN0IHBsdWdpbkRlYnVnZ2VyID0gZ2V0RGVidWdnZXIodGhpcy5tYW5pZmVzdC5pZCwgRlJBTUVTX1RPX1NLSVApO1xuICAgIHBsdWdpbkRlYnVnZ2VyKG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBleHRlcm5hbCBzZXR0aW5ncyBjaGFuZ2UuXG4gICAqXG4gICAqIFVzdWFsbHksIHlvdSBkb24ndCBuZWVkIHRvIG92ZXJyaWRlIHRoaXMgbWV0aG9kLiBDb25zaWRlciB1c2luZyB7QGxpbmsgb25Mb2FkU2V0dGluZ3N9IGluc3RlYWQuXG4gICAqXG4gICAqIElmIHlvdSBzdGlsbCBuZWVkIHRvIG92ZXJyaWRlIHRoaXMgbWV0aG9kLCBtYWtlIHN1cmUgdG8gY2FsbCBgYXdhaXQgc3VwZXIub25FeHRlcm5hbFNldHRpbmdzQ2hhbmdlKClgIGZpcnN0LlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIGFzeW5jIG9uRXh0ZXJuYWxTZXR0aW5nc0NoYW5nZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBzdXBlci5vbkV4dGVybmFsU2V0dGluZ3NDaGFuZ2U/LigpO1xuICAgIGF3YWl0IHRoaXMuX3NldHRpbmdzTWFuYWdlcj8ubG9hZEZyb21GaWxlKGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGlzIGxvYWRlZFxuICAgKlxuICAgKiBVc3VhbGx5LCB5b3UgZG9uJ3QgbmVlZCB0byBvdmVycmlkZSB0aGlzIG1ldGhvZC4gQ29uc2lkZXIgdXNpbmcge0BsaW5rIG9ubG9hZEltcGx9IGluc3RlYWQuXG4gICAqXG4gICAqIElmIHlvdSBzdGlsbCBuZWVkIHRvIG92ZXJyaWRlIHRoaXMgbWV0aG9kLCBtYWtlIHN1cmUgdG8gY2FsbCBgYXdhaXQgc3VwZXIub25sb2FkKClgIGZpcnN0LlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIGFzeW5jIG9ubG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBzdXBlci5vbmxvYWQoKTtcbiAgICBhd2FpdCB0aGlzLm9ubG9hZEltcGwoKTtcbiAgICBpbnZva2VBc3luY1NhZmVseUFmdGVyRGVsYXkodGhpcy5hZnRlckxvYWQuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBpcyB1bmxvYWRlZC5cbiAgICpcbiAgICogVXN1YWxseSwgeW91IGRvbid0IG5lZWQgdG8gb3ZlcnJpZGUgdGhpcyBtZXRob2QuIENvbnNpZGVyIHVzaW5nIHtAbGluayBvbnVubG9hZEltcGx9IGluc3RlYWQuXG4gICAqXG4gICAqIElmIHlvdSBzdGlsbCBuZWVkIHRvIG92ZXJyaWRlIHRoaXMgbWV0aG9kLCBtYWtlIHN1cmUgdG8gY2FsbCBgc3VwZXIub251bmxvYWQoKWAgZmlyc3QuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgb251bmxvYWQoKTogdm9pZCB7XG4gICAgc3VwZXIub251bmxvYWQoKTtcbiAgICBpbnZva2VBc3luY1NhZmVseShhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLm9udW5sb2FkSW1wbCgpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyTGlmZWN5Y2xlRXZlbnQoJ3VubG9hZCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYSBsaWZlY3ljbGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUuXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJGb3JMaWZlY3ljbGVFdmVudChuYW1lOiBMaWZlY3ljbGVFdmVudE5hbWUsIGNhbGxiYWNrOiAoKSA9PiBQcm9taXNlPHZvaWQ+KTogdm9pZCB7XG4gICAgaW52b2tlQXN5bmNTYWZlbHkoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy53YWl0Rm9yTGlmZWN5Y2xlRXZlbnQobmFtZSk7XG4gICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciBhIGxpZmVjeWNsZSBldmVudCB0byBiZSB0cmlnZ2VyZWQuXG4gICAqXG4gICAqIElmIHlvdSBgYXdhaXRgIHRoaXMgbWV0aG9kIGR1cmluZyBsaWZlY3ljbGUgZXZlbnQsIGl0IG1pZ2h0IGNhdXNlIGEgZGVhZGxvY2suXG4gICAqXG4gICAqIENvbnNpZGVyIHdyYXBwaW5nIHRoaXMgY2FsbCB3aXRoIHtAbGluayBpbnZva2VBc3luY1NhZmVseX0uXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICovXG4gIHB1YmxpYyBhc3luYyB3YWl0Rm9yTGlmZWN5Y2xlRXZlbnQobmFtZTogTGlmZWN5Y2xlRXZlbnROYW1lKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMubGlmZWN5Y2xlRXZlbnROYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5ldmVudHMub25jZShuYW1lLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIHBsdWdpbiBzZXR0aW5ncyBtYW5hZ2VyLiBUaGlzIG1ldGhvZCBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBwbHVnaW4gc2V0dGluZ3MgbWFuYWdlci5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVTZXR0aW5nc01hbmFnZXIoKTogRXh0cmFjdFBsdWdpblNldHRpbmdzTWFuYWdlcjxQbHVnaW5UeXBlcz4gfCBudWxsIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcGx1Z2luIHNldHRpbmdzIHRhYi5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIHNldHRpbmdzIHRhYiBvciBgbnVsbGAgaWYgbm90IGFwcGxpY2FibGUuXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlU2V0dGluZ3NUYWIoKTogRXh0cmFjdFBsdWdpblNldHRpbmdzVGFiPFBsdWdpblR5cGVzPiB8IG51bGwge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB0cmFuc2xhdGlvbnMgbWFwLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNsYXRpb25zIG1hcC5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVUcmFuc2xhdGlvbnNNYXAoKTogVHJhbnNsYXRpb25zTWFwPFBsdWdpblR5cGVzPiB7XG4gICAgcmV0dXJuIGRlZmF1bHRUcmFuc2xhdGlvbnNNYXA7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYW4gYXN5bmMgZXJyb3Igb2NjdXJzLlxuICAgKlxuICAgKiBAcGFyYW0gX2FzeW5jRXJyb3IgLSBUaGUgYXN5bmMgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgaGFuZGxlQXN5bmNFcnJvcihfYXN5bmNFcnJvcjogdW5rbm93bik6IHZvaWQge1xuICAgIHRoaXMuc2hvd05vdGljZSh0KCgkKSA9PiAkLm9ic2lkaWFuRGV2VXRpbHMubm90aWNlcy51bmhhbmRsZWRFcnJvcikpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBsYXlvdXQgaXMgcmVhZHkuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgb25MYXlvdXRSZWFkeSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBub29wQXN5bmMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlZCB3aGVuIHRoZSBwbHVnaW4gaXMgbG9hZGVkLlxuICAgKlxuICAgKiBJZiB0aGlzIG1ldGhvZCBmYWlscywgdGhlIHBsdWdpbiB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgdW5sb2FkZWQuXG4gICAqXG4gICAqIEByZW1hcmtzIEl0IGlzIGltcG9ydGFudCB0byBjYWxsIGBzdXBlci5vbmxvYWRJbXBsKClgIGluIG92ZXJyaWRkZW4gbWV0aG9kLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIG9ubG9hZEltcGwoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaW5pdFBsdWdpbkNvbnRleHQodGhpcy5hcHAsIHRoaXMubWFuaWZlc3QuaWQpO1xuICAgIG5ldyBBbGxXaW5kb3dzRXZlbnRIYW5kbGVyKHRoaXMuYXBwLCB0aGlzKS5yZWdpc3RlckFsbFdpbmRvd3NIYW5kbGVyKCh3aW4pID0+IHtcbiAgICAgIGluaXREZWJ1Z0NvbnRyb2xsZXIod2luKTtcbiAgICB9KTtcbiAgICBhd2FpdCBpbml0STE4TjxQbHVnaW5UeXBlcz4odGhpcy5jcmVhdGVUcmFuc2xhdGlvbnNNYXAoKSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyKHJlZ2lzdGVyQXN5bmNFcnJvckV2ZW50SGFuZGxlcih0aGlzLmhhbmRsZUFzeW5jRXJyb3IuYmluZCh0aGlzKSkpO1xuXG4gICAgdGhpcy5fc2V0dGluZ3NNYW5hZ2VyID0gdGhpcy5jcmVhdGVTZXR0aW5nc01hbmFnZXIoKTtcbiAgICBpZiAodGhpcy5fc2V0dGluZ3NNYW5hZ2VyKSB7XG4gICAgICByZWdpc3RlckFzeW5jRXZlbnQodGhpcywgdGhpcy5fc2V0dGluZ3NNYW5hZ2VyLm9uKCdsb2FkU2V0dGluZ3MnLCB0aGlzLm9uTG9hZFNldHRpbmdzLmJpbmQodGhpcykpKTtcbiAgICAgIHJlZ2lzdGVyQXN5bmNFdmVudCh0aGlzLCB0aGlzLl9zZXR0aW5nc01hbmFnZXIub24oJ3NhdmVTZXR0aW5ncycsIHRoaXMub25TYXZlU2V0dGluZ3MuYmluZCh0aGlzKSkpO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuX3NldHRpbmdzTWFuYWdlcj8ubG9hZEZyb21GaWxlKHRydWUpO1xuICAgIHRoaXMuX3NldHRpbmdzVGFiID0gdGhpcy5jcmVhdGVTZXR0aW5nc1RhYigpO1xuICAgIGlmICh0aGlzLl9zZXR0aW5nc1RhYikge1xuICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKHRoaXMuX3NldHRpbmdzVGFiKTtcbiAgICB9XG5cbiAgICBjb25zdCBhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgdGhpcy5fYWJvcnRTaWduYWwgPSBhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICAgIHRoaXMucmVnaXN0ZXIoKCkgPT4ge1xuICAgICAgYWJvcnRDb250cm9sbGVyLmFib3J0KG5ldyBTaWxlbnRFcnJvcihgUGx1Z2luICR7dGhpcy5tYW5pZmVzdC5pZH0gaGFkIGJlZW4gdW5sb2FkZWRgKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBzZXR0aW5ncyBhcmUgbG9hZGVkIG9yIHJlbG9hZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gX2xvYWRlZFNldHRpbmdzIC0gVGhlIGxvYWRlZCBzZXR0aW5ncyB3cmFwcGVyLlxuICAgKiBAcGFyYW0gX2lzSW5pdGlhbExvYWQgLSBXaGV0aGVyIHRoZSBzZXR0aW5ncyBhcmUgYmVpbmcgbG9hZGVkIGZvciB0aGUgZmlyc3QgdGltZS5cbiAgICovXG4gIHByb3RlY3RlZCBhc3luYyBvbkxvYWRTZXR0aW5ncyhfbG9hZGVkU2V0dGluZ3M6IEV4dHJhY3RSZWFkb25seVBsdWdpblNldHRpbmdzV3JhcHBlcjxQbHVnaW5UeXBlcz4sIF9pc0luaXRpYWxMb2FkOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgbm9vcEFzeW5jKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBzZXR0aW5ncyBhcmUgc2F2ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBfbmV3U2V0dGluZ3MgLSBUaGUgbmV3IHNldHRpbmdzLlxuICAgKiBAcGFyYW0gX29sZFNldHRpbmdzIC0gVGhlIG9sZCBzZXR0aW5ncy5cbiAgICogQHBhcmFtIF9jb250ZXh0IC0gVGhlIGNvbnRleHQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgb25TYXZlU2V0dGluZ3MoXG4gICAgX25ld1NldHRpbmdzOiBFeHRyYWN0UmVhZG9ubHlQbHVnaW5TZXR0aW5nc1dyYXBwZXI8UGx1Z2luVHlwZXM+LFxuICAgIF9vbGRTZXR0aW5nczogRXh0cmFjdFJlYWRvbmx5UGx1Z2luU2V0dGluZ3NXcmFwcGVyPFBsdWdpblR5cGVzPixcbiAgICBfY29udGV4dDogdW5rbm93blxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBub29wQXN5bmMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGlzIHVubG9hZGVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIG9udW5sb2FkSW1wbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBub29wQXN5bmMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyBhIG5vdGljZSBtZXNzYWdlIHRvIHRoZSB1c2VyLlxuICAgKlxuICAgKiBAcGFyYW0gbWVzc2FnZSAtIFRoZSBtZXNzYWdlIHRvIGRpc3BsYXkuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2hvd05vdGljZShtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ub3RpY2UpIHtcbiAgICAgIHRoaXMubm90aWNlLmhpZGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLm5vdGljZSA9IG5ldyBOb3RpY2UoYCR7dGhpcy5tYW5pZmVzdC5uYW1lfVxcbiR7bWVzc2FnZX1gKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYWZ0ZXJMb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmFib3J0U2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgdGhpcy50cmlnZ2VyTGlmZWN5Y2xlRXZlbnQoJ2xvYWQnKTtcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeShjb252ZXJ0QXN5bmNUb1N5bmModGhpcy5vbkxheW91dFJlYWR5QmFzZS5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG9uTGF5b3V0UmVhZHlCYXNlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLm9uTGF5b3V0UmVhZHkoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyTGlmZWN5Y2xlRXZlbnQoJ2xheW91dFJlYWR5Jyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB0cmlnZ2VyTGlmZWN5Y2xlRXZlbnQobmFtZTogTGlmZWN5Y2xlRXZlbnROYW1lKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5saWZlY3ljbGVFdmVudE5hbWVzLmFkZChuYW1lKTtcbiAgICBhd2FpdCB0aGlzLmV2ZW50cy50cmlnZ2VyQXN5bmMobmFtZSk7XG4gIH1cbn1cbi8qIHY4IGlnbm9yZSBzdG9wICovXG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBBcnJheSB1dGlsaXRpZXMuXG4gKi9cblxuLyoqXG4gKiBGaWx0ZXIgYW4gYXJyYXkgaW4gcGxhY2UuXG4gKlxuICogQHBhcmFtIGFyciAtIFRoZSBhcnJheSB0byBmaWx0ZXIuXG4gKiBAcGFyYW0gcHJlZGljYXRlIC0gVGhlIHByZWRpY2F0ZSB0byBmaWx0ZXIgdGhlIGFycmF5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySW5QbGFjZTxUPihhcnI6IFRbXSwgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIGFycmF5OiBUW10pID0+IGJvb2xlYW4pOiB2b2lkIHtcbiAgY29uc3QgbGVuZ3RoID0gYXJyLmxlbmd0aDtcbiAgbGV0IHdyaXRlSW5kZXggPSAwO1xuICBmb3IgKGxldCByZWFkSW5kZXggPSAwOyByZWFkSW5kZXggPCBsZW5ndGg7IHJlYWRJbmRleCsrKSB7XG4gICAgaWYgKCFPYmplY3QuaGFzT3duKGFyciwgcmVhZEluZGV4KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudCA9IGFycltyZWFkSW5kZXhdIGFzIFQ7XG4gICAgaWYgKHByZWRpY2F0ZShjdXJyZW50LCByZWFkSW5kZXgsIGFycikpIHtcbiAgICAgIGFyclt3cml0ZUluZGV4KytdID0gY3VycmVudDtcbiAgICB9XG4gIH1cbiAgYXJyLmxlbmd0aCA9IHdyaXRlSW5kZXg7XG59XG5cbi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gYXJyIC0gVGhlIGFycmF5IHRvIHJlbW92ZSBkdXBsaWNhdGVzIGZyb20uXG4gKiBAcmV0dXJucyBUaGUgYXJyYXkgd2l0aCBkdXBsaWNhdGVzIHJlbW92ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWU8VD4oYXJyOiByZWFkb25seSBUW10pOiBUW10ge1xuICBjb25zdCBzZXQgPSBuZXcgU2V0PFQ+KCk7XG4gIHJldHVybiBhcnIuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgIGlmIChzZXQuaGFzKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzZXQuYWRkKHZhbHVlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhbiBhcnJheSBpbiBwbGFjZS5cbiAqXG4gKiBAcGFyYW0gYXJyIC0gVGhlIGFycmF5IHRvIHJlbW92ZSBkdXBsaWNhdGVzIGZyb20uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWVJblBsYWNlKGFycjogdW5rbm93bltdKTogdm9pZCB7XG4gIGNvbnN0IHNldCA9IG5ldyBTZXQ8dW5rbm93bj4oKTtcbiAgZmlsdGVySW5QbGFjZShhcnIsICh2YWx1ZSkgPT4ge1xuICAgIGlmIChzZXQuaGFzKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzZXQuYWRkKHZhbHVlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBBc3luYyBldmVudCBlbWl0dGVyLlxuICovXG5cbmltcG9ydCB0eXBlIHsgUHJvbWlzYWJsZSB9IGZyb20gJ3R5cGUtZmVzdCc7XG5cbmltcG9ydCB7IGZpbHRlckluUGxhY2UgfSBmcm9tICcuL2FycmF5LnRzJztcblxuLyoqXG4gKiBBc3luYyBldmVudCByZWZlcmVuY2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXN5bmNFdmVudFJlZiB7XG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVyLlxuICAgKi9cbiAgYXN5bmNFdmVudHM6IEFzeW5jRXZlbnRzO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKi9cbiAgY2FsbGJhY2s6IEdlbmVyaWNDYWxsYmFjaztcblxuICAvKipcbiAgICogQSBuYW1lIG9mIHRoZSBldmVudC5cbiAgICovXG4gIG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQSBjb250ZXh0IHBhc3NlZCBhcyBgdGhpc2AgdG8gdGhlIGBjYWxsYmFja2AuXG4gICAqL1xuICB0aGlzQXJnOiB1bmtub3duO1xufVxuXG50eXBlIEdlbmVyaWNDYWxsYmFjayA9ICguLi5hcmdzOiB1bmtub3duW10pID0+IFByb21pc2FibGU8dm9pZD47XG5cbi8qKlxuICogQXN5bmMgZXZlbnQgZW1pdHRlciBpbXBsZW1lbnRhdGlvblxuICovXG5leHBvcnQgY2xhc3MgQXN5bmNFdmVudHMge1xuICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50UmVmc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBBc3luY0V2ZW50UmVmW10+KCk7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYHRzXG4gICAqIGV2ZW50cy5vZmYoJ215LWV2ZW50JywgbXlMaXN0ZW5lcik7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVubmVjZXNzYXJ5LXR5cGUtcGFyYW1ldGVycyAtLSBXZSBuZWVkIHRvIHVzZSB0aGUgZHVtbXkgcGFyYW1ldGVyIHRvIGdldCB0eXBlIGluZmVyZW5jZS5cbiAgcHVibGljIG9mZjxBcmdzIGV4dGVuZHMgdW5rbm93bltdPihuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoLi4uYXJnczogQXJncykgPT4gUHJvbWlzYWJsZTx2b2lkPik6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50UmVmcyA9IHRoaXMuZXZlbnRSZWZzTWFwLmdldChuYW1lKTtcbiAgICBpZiAoIWV2ZW50UmVmcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZpbHRlckluUGxhY2UoZXZlbnRSZWZzLCAoZXZlbnRSZWYpID0+IGV2ZW50UmVmLmNhbGxiYWNrICE9PSBjYWxsYmFjayk7XG4gICAgaWYgKGV2ZW50UmVmcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZXZlbnRSZWZzTWFwLmRlbGV0ZShuYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyIGJ5IHJlZmVyZW5jZS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50UmVmIC0gVGhlIHJlZmVyZW5jZSB0byB0aGUgZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYHRzXG4gICAqIGV2ZW50cy5vZmZyZWYobXlSZWYpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIG9mZnJlZihldmVudFJlZjogQXN5bmNFdmVudFJlZik6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50UmVmcyA9IHRoaXMuZXZlbnRSZWZzTWFwLmdldChldmVudFJlZi5uYW1lKTtcbiAgICBpZiAoIWV2ZW50UmVmcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZpbHRlckluUGxhY2UoZXZlbnRSZWZzLCAoc3RvcmVkRXZlbnRSZWYpID0+IHN0b3JlZEV2ZW50UmVmICE9PSBldmVudFJlZik7XG4gICAgaWYgKGV2ZW50UmVmcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZXZlbnRSZWZzTWFwLmRlbGV0ZShldmVudFJlZi5uYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiBAcGFyYW0gdGhpc0FyZyAtIFRoZSBjb250ZXh0IHBhc3NlZCBhcyBgdGhpc2AgdG8gdGhlIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgdHNcbiAgICogZXZlbnRzLm9uKCdteS1ldmVudCcsIGFzeW5jIChhcmcxLCBhcmcyKSA9PiB7XG4gICAqICAgICBhd2FpdCBzbGVlcCgxMDApO1xuICAgKiAgICAgY29uc29sZS5sb2coYXJnMSwgYXJnMik7XG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS10eXBlLXBhcmFtZXRlcnMgLS0gV2UgbmVlZCB0byB1c2UgdGhlIGR1bW15IHBhcmFtZXRlciB0byBnZXQgdHlwZSBpbmZlcmVuY2UuXG4gIHB1YmxpYyBvbjxBcmdzIGV4dGVuZHMgdW5rbm93bltdPihuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoLi4uYXJnczogQXJncykgPT4gUHJvbWlzYWJsZTx2b2lkPiwgdGhpc0FyZz86IHVua25vd24pOiBBc3luY0V2ZW50UmVmIHtcbiAgICBsZXQgZXZlbnRSZWZzID0gdGhpcy5ldmVudFJlZnNNYXAuZ2V0KG5hbWUpO1xuICAgIGlmICghZXZlbnRSZWZzKSB7XG4gICAgICBldmVudFJlZnMgPSBbXTtcbiAgICAgIHRoaXMuZXZlbnRSZWZzTWFwLnNldChuYW1lLCBldmVudFJlZnMpO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50UmVmOiBBc3luY0V2ZW50UmVmID0ge1xuICAgICAgYXN5bmNFdmVudHM6IHRoaXMsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2sgYXMgR2VuZXJpY0NhbGxiYWNrLFxuICAgICAgbmFtZSxcbiAgICAgIHRoaXNBcmdcbiAgICB9O1xuICAgIGV2ZW50UmVmcy5wdXNoKGV2ZW50UmVmKTtcbiAgICByZXR1cm4gZXZlbnRSZWY7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWQgb25seSBvbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiBAcGFyYW0gdGhpc0FyZyAtIFRoZSBjb250ZXh0IHBhc3NlZCBhcyBgdGhpc2AgdG8gdGhlIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgdHNcbiAgICogZXZlbnRzLm9uY2UoJ215LWV2ZW50JywgYXN5bmMgKGFyZzEsIGFyZzIpID0+IHtcbiAgICogICAgIGF3YWl0IHNsZWVwKDEwMCk7XG4gICAqICAgICBjb25zb2xlLmxvZyhhcmcxLCBhcmcyKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVubmVjZXNzYXJ5LXR5cGUtcGFyYW1ldGVycyAtLSBXZSBuZWVkIHRvIHVzZSB0aGUgZHVtbXkgcGFyYW1ldGVyIHRvIGdldCB0eXBlIGluZmVyZW5jZS5cbiAgcHVibGljIG9uY2U8QXJncyBleHRlbmRzIHVua25vd25bXT4obmFtZTogc3RyaW5nLCBjYWxsYmFjazogKC4uLmFyZ3M6IEFyZ3MpID0+IFByb21pc2FibGU8dm9pZD4sIHRoaXNBcmc/OiB1bmtub3duKTogQXN5bmNFdmVudFJlZiB7XG4gICAgY29uc3Qgb3JpZ2luYWxFdmVudFJlZiA9IHRoaXMub24obmFtZSwgY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgIGNvbnN0IGNsZWFudXBFdmVudFJlZiA9IHRoaXMub24obmFtZSwgKCkgPT4ge1xuICAgICAgdGhpcy5vZmZyZWYob3JpZ2luYWxFdmVudFJlZik7XG4gICAgICB0aGlzLm9mZnJlZihjbGVhbnVwRXZlbnRSZWYpO1xuICAgIH0pO1xuICAgIHJldHVybiBvcmlnaW5hbEV2ZW50UmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYW4gZXZlbnQsIGV4ZWN1dGluZyBhbGwgdGhlIGxpc3RlbmVycyBpbiBvcmRlciBldmVuIGlmIHNvbWUgb2YgdGhlbSB0aHJvdyBhbiBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSBhcmdzIC0gVGhlIGRhdGEgdG8gcGFzcyB0byB0aGUgZXZlbnQgbGlzdGVuZXJzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGB0c1xuICAgKiBldmVudHMudHJpZ2dlcignbXktZXZlbnQnLCAnYXJnMScsICdhcmcyJyk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVubmVjZXNzYXJ5LXR5cGUtcGFyYW1ldGVycyAtLSBXZSBuZWVkIHRvIHVzZSB0aGUgZHVtbXkgcGFyYW1ldGVyIHRvIGdldCB0eXBlIGluZmVyZW5jZS5cbiAgcHVibGljIHRyaWdnZXI8QXJncyBleHRlbmRzIHVua25vd25bXT4obmFtZTogc3RyaW5nLCAuLi5hcmdzOiBBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnRSZWZzID0gdGhpcy5ldmVudFJlZnNNYXAuZ2V0KG5hbWUpID8/IFtdO1xuICAgIGZvciAoY29uc3QgZXZlbnRSZWYgb2YgZXZlbnRSZWZzLnNsaWNlKCkpIHtcbiAgICAgIHRoaXMudHJ5VHJpZ2dlcihldmVudFJlZiwgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYW4gZXZlbnQgYXN5bmNocm9ub3VzbHksIGV4ZWN1dGluZyBhbGwgdGhlIGxpc3RlbmVycyBpbiBvcmRlciBldmVuIGlmIHNvbWUgb2YgdGhlbSB0aHJvdyBhbiBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSBhcmdzIC0gVGhlIGRhdGEgdG8gcGFzcyB0byB0aGUgZXZlbnQgbGlzdGVuZXJzLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVubmVjZXNzYXJ5LXR5cGUtcGFyYW1ldGVycyAtLSBXZSBuZWVkIHRvIHVzZSB0aGUgZHVtbXkgcGFyYW1ldGVyIHRvIGdldCB0eXBlIGluZmVyZW5jZS5cbiAgcHVibGljIGFzeW5jIHRyaWdnZXJBc3luYzxBcmdzIGV4dGVuZHMgdW5rbm93bltdPihuYW1lOiBzdHJpbmcsIC4uLmFyZ3M6IEFyZ3MpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBldmVudFJlZnMgPSB0aGlzLmV2ZW50UmVmc01hcC5nZXQobmFtZSkgPz8gW107XG4gICAgZm9yIChjb25zdCBldmVudFJlZiBvZiBldmVudFJlZnMuc2xpY2UoKSkge1xuICAgICAgYXdhaXQgdGhpcy50cnlUcmlnZ2VyQXN5bmMoZXZlbnRSZWYsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcnkgdG8gdHJpZ2dlciBhbiBldmVudCwgZXhlY3V0aW5nIGFsbCB0aGUgbGlzdGVuZXJzIGluIG9yZGVyIGV2ZW4gaWYgc29tZSBvZiB0aGVtIHRocm93IGFuIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnRSZWYgLSBUaGUgZXZlbnQgcmVmZXJlbmNlLlxuICAgKiBAcGFyYW0gYXJncyAtIFRoZSBkYXRhIHRvIHBhc3MgdG8gdGhlIGV2ZW50IGxpc3RlbmVycy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgdHNcbiAgICogZXZlbnRzLnRyeVRyaWdnZXIobXlSZWYsIFsnYXJnMScsICdhcmcyJ10pO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS10eXBlLXBhcmFtZXRlcnMgLS0gV2UgbmVlZCB0byB1c2UgdGhlIGR1bW15IHBhcmFtZXRlciB0byBnZXQgdHlwZSBpbmZlcmVuY2UuXG4gIHB1YmxpYyB0cnlUcmlnZ2VyPEFyZ3MgZXh0ZW5kcyB1bmtub3duW10+KGV2ZW50UmVmOiBBc3luY0V2ZW50UmVmLCBhcmdzOiBBcmdzKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGV2ZW50UmVmLmNhbGxiYWNrLmFwcGx5KGV2ZW50UmVmLnRoaXNBcmcsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcnkgdG8gdHJpZ2dlciBhbiBldmVudCBhc3luY2hyb25vdXNseSwgZXhlY3V0aW5nIGFsbCB0aGUgbGlzdGVuZXJzIGluIG9yZGVyIGV2ZW4gaWYgc29tZSBvZiB0aGVtIHRocm93IGFuIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnRSZWYgLSBUaGUgZXZlbnQgcmVmZXJlbmNlLlxuICAgKiBAcGFyYW0gYXJncyAtIFRoZSBkYXRhIHRvIHBhc3MgdG8gdGhlIGV2ZW50IGxpc3RlbmVycy5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS10eXBlLXBhcmFtZXRlcnMgLS0gV2UgbmVlZCB0byB1c2UgdGhlIGR1bW15IHBhcmFtZXRlciB0byBnZXQgdHlwZSBpbmZlcmVuY2UuXG4gIHB1YmxpYyBhc3luYyB0cnlUcmlnZ2VyQXN5bmM8QXJncyBleHRlbmRzIHVua25vd25bXT4oZXZlbnRSZWY6IEFzeW5jRXZlbnRSZWYsIGFyZ3M6IEFyZ3MpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXZlbnRSZWYuY2FsbGJhY2suY2FsbChldmVudFJlZi50aGlzQXJnLCAuLi5hcmdzKTtcbiAgICAgIGF3YWl0IChyZXN1bHQgYXMgUHJvbWlzZTx2b2lkPik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBDb250YWlucyB1dGlsaXR5IGZ1bmN0aW9ucyBmb3Igd29ya2luZyB3aXRoIGZ1bmN0aW9ucy5cbiAqL1xuXG4vKipcbiAqIENvbnZlcnRzIGEgZnVuY3Rpb24gaW50byBhIHN0cmluZyB0aGF0IGlzIGEgdmFsaWQgZnVuY3Rpb24gZXhwcmVzc2lvbi5cbiAqXG4gKiBgRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nKClgIG9uIGEgc2hvcnRoYW5kIG1ldGhvZCBsaWtlIGB7IGZuKCkge30gfWBcbiAqIHJldHVybnMgYFwiZm4oKSB7fVwiYCwgd2hpY2ggaXMgbm90IGEgdmFsaWQgZXhwcmVzc2lvbi5cbiAqIFRoaXMgaGVscGVyIGRldGVjdHMgdGhhdCBmb3JtIGFuZCBwcmVmaXhlcyBpdCB3aXRoIGBmdW5jdGlvbiBgLlxuICpcbiAqIEBwYXJhbSBmbiAtIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMgQSBzdHJpbmcgdGhhdCBpcyBhIHZhbGlkIGZ1bmN0aW9uIGV4cHJlc3Npb24uXG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWZ1bmN0aW9uLXR5cGUgLS0gV2UgbmVlZCB0byB1c2UgYEZ1bmN0aW9uYCB0eXBlLlxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uRXhwcmVzc2lvblN0cmluZyhmbjogRnVuY3Rpb24pOiBzdHJpbmcge1xuICBjb25zdCBmblN0cmluZyA9IGZuLnRvU3RyaW5nKCk7XG5cbiAgaWYgKEZVTkNUSU9OX0VYUFJFU1NJT05fUkUudGVzdChmblN0cmluZykpIHtcbiAgICByZXR1cm4gZm5TdHJpbmc7XG4gIH1cblxuICBjb25zdCBhc3luY01hdGNoID0gQVNZTkNfS0VZV09SRF9SRS5leGVjKGZuU3RyaW5nKTtcbiAgaWYgKGFzeW5jTWF0Y2gpIHtcbiAgICByZXR1cm4gYGFzeW5jIGZ1bmN0aW9uICR7Zm5TdHJpbmcuc2xpY2UoYXN5bmNNYXRjaFswXS5sZW5ndGgpfWA7XG4gIH1cblxuICByZXR1cm4gYGZ1bmN0aW9uICR7Zm5TdHJpbmd9YDtcbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgZG9lcyBub3RoaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9vcCgpOiB2b2lkIHtcbiAgLy8gRG9lcyBub3RoaW5nLlxufVxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBkb2VzIG5vdGhpbmcuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBub29wQXN5bmMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIERvZXMgbm90aGluZy5cbn1cblxuLyoqXG4gKiBNYWtlcyBhbiBhc3luYyBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSBvcmlnaW5hbCBhc3luYyBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYW5kIG9taXRzIHRoZSByZXR1cm4gdmFsdWUuXG4gKlxuICogQHR5cGVQYXJhbSBBcmdzIC0gQXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gZm4gLSBGdW5jdGlvbiB0byBiZSBjYWxsZWQuXG4gKiBAcmV0dXJucyBBbiBhc3luYyBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYW5kIG9taXRzIHRoZSByZXR1cm4gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbWl0QXN5bmNSZXR1cm5UeXBlPEFyZ3MgZXh0ZW5kcyB1bmtub3duW10+KGZuOiAoLi4uYXJnczogQXJncykgPT4gUHJvbWlzZTx1bmtub3duPik6ICguLi5hcmdzOiBBcmdzKSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIGFzeW5jICguLi5hcmdzOiBBcmdzKSA9PiB7XG4gICAgYXdhaXQgZm4oLi4uYXJncyk7XG4gIH07XG59XG5cbi8qKlxuICogTWF0Y2hlcyBzdHJpbmdzIHRoYXQgYXJlIGFscmVhZHkgdmFsaWQgZnVuY3Rpb24gZXhwcmVzc2lvbnM6XG4gKiAtIGBmdW5jdGlvbiAuLi5gIChrZXl3b3JkLCBub3QgaWRlbnRpZmllciBsaWtlIGBmdW5jdGlvbjFgKVxuICogLSBgKGAgKGFycm93IGZ1bmN0aW9uKVxuICogLSBgYXN5bmNcXGJgIGZvbGxvd2VkIGJ5IGBmdW5jdGlvblxcYmAgb3IgYChgIChhc3luYyBmdW5jdGlvbi9hcnJvdylcbiAqL1xuY29uc3QgRlVOQ1RJT05fRVhQUkVTU0lPTl9SRSA9IC9eKD86ZnVuY3Rpb25cXGJ8YXN5bmNcXGJcXHMqKD86ZnVuY3Rpb25cXGJ8XFwoKXxcXCgpLztcblxuLyoqXG4gKiBNYXRjaGVzIHRoZSBgYXN5bmNgIGtleXdvcmQgKHdvcmQgYm91bmRhcnksIG5vdCBgYXN5bmMxYCkgZm9sbG93ZWQgYnkgb3B0aW9uYWwgd2hpdGVzcGFjZS5cbiAqIFVzZWQgdG8gc3RyaXAgdGhlIGBhc3luY2AgcHJlZml4IGZyb20gYXN5bmMgc2hvcnRoYW5kIG1ldGhvZHMgYmVmb3JlIHJlLWFkZGluZyBgYXN5bmMgZnVuY3Rpb25gLlxuICovXG5jb25zdCBBU1lOQ19LRVlXT1JEX1JFID0gL15hc3luY1xcYlxccyovO1xuXG4vKipcbiAqIE1ha2VzIGEgZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzIGFuZCBvbWl0cyB0aGUgcmV0dXJuIHZhbHVlLlxuICpcbiAqIEB0eXBlUGFyYW0gQXJncyAtIEFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9uLlxuICogQHBhcmFtIGZuIC0gRnVuY3Rpb24gdG8gYmUgY2FsbGVkLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYW5kIG9taXRzIHRoZSByZXR1cm4gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbWl0UmV0dXJuVHlwZTxBcmdzIGV4dGVuZHMgdW5rbm93bltdPihmbjogKC4uLmFyZ3M6IEFyZ3MpID0+IHVua25vd24pOiAoLi4uYXJnczogQXJncykgPT4gdm9pZCB7XG4gIHJldHVybiAoLi4uYXJnczogQXJncykgPT4ge1xuICAgIGZuKC4uLmFyZ3MpO1xuICB9O1xufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQWJvcnRDb250cm9sbGVyIHV0aWxpdGllcy5cbiAqL1xuXG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi9mdW5jdGlvbi50cyc7XG5cbi8qKlxuICogQSBjb25zdGFudCByZXByZXNlbnRpbmcgYW4gaW5maW5pdGUgdGltZW91dC5cbiAqL1xuZXhwb3J0IGNvbnN0IElORklOSVRFX1RJTUVPVVQgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5cbi8qKlxuICogQW4gYWJvcnQgc2lnbmFsIHRoYXQgYWJvcnRzIHdoZW4gYW55IG9mIHRoZSBnaXZlbiBhYm9ydCBzaWduYWxzIGFib3J0LlxuICpcbiAqIEBwYXJhbSBtYXliZUFib3J0U2lnbmFscyAtIFRoZSBhYm9ydCBzaWduYWxzIHRvIGFib3J0IHdoZW4gYW55IG9mIHRoZW0gYWJvcnQuXG4gKiBAcmV0dXJucyBUaGUgYWJvcnQgc2lnbmFsIHRoYXQgYWJvcnRzIHdoZW4gYW55IG9mIHRoZSBnaXZlbiBhYm9ydCBzaWduYWxzIGFib3J0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWJvcnRTaWduYWxBbnkoLi4ubWF5YmVBYm9ydFNpZ25hbHM6IChBYm9ydFNpZ25hbCB8IHVuZGVmaW5lZClbXSk6IEFib3J0U2lnbmFsIHtcbiAgY29uc3QgYWJvcnRTaWduYWxzID0gbWF5YmVBYm9ydFNpZ25hbHMuZmlsdGVyKChhYm9ydFNpZ25hbCkgPT4gISFhYm9ydFNpZ25hbCk7XG5cbiAgaWYgKHR5cGVvZiBBYm9ydFNpZ25hbC5hbnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQWJvcnRTaWduYWwuYW55KGFib3J0U2lnbmFscyk7XG4gIH1cblxuICBpZiAoYWJvcnRTaWduYWxzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBhYm9ydFNpZ25hbE5ldmVyKCk7XG4gIH1cblxuICBpZiAoYWJvcnRTaWduYWxzLmxlbmd0aCA9PT0gMSAmJiBhYm9ydFNpZ25hbHNbMF0pIHtcbiAgICByZXR1cm4gYWJvcnRTaWduYWxzWzBdO1xuICB9XG5cbiAgY29uc3QgYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXG4gIGZvciAoY29uc3QgYWJvcnRTaWduYWwgb2YgYWJvcnRTaWduYWxzKSB7XG4gICAgaWYgKGFib3J0U2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgIHJldHVybiBhYm9ydFNpZ25hbDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBhYm9ydEhhbmRsZXJSZW1vdmVyczogKCgpID0+IHZvaWQpW10gPSBbXTtcblxuICBmb3IgKGNvbnN0IGFib3J0U2lnbmFsIG9mIGFib3J0U2lnbmFscykge1xuICAgIGFib3J0SGFuZGxlclJlbW92ZXJzLnB1c2gob25BYm9ydChhYm9ydFNpZ25hbCwgaGFuZGxlQWJvcnQpKTtcbiAgfVxuXG4gIHJldHVybiBhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUFib3J0KGFib3J0U2lnbmFsOiBBYm9ydFNpZ25hbCk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgYWJvcnRIYW5kbGVyUmVtb3ZlciBvZiBhYm9ydEhhbmRsZXJSZW1vdmVycykge1xuICAgICAgYWJvcnRIYW5kbGVyUmVtb3ZlcigpO1xuICAgIH1cblxuICAgIGFib3J0Q29udHJvbGxlci5hYm9ydChhYm9ydFNpZ25hbC5yZWFzb24pO1xuICB9XG59XG5cbi8qKlxuICogQW4gYWJvcnQgc2lnbmFsIHRoYXQgbmV2ZXIgYWJvcnRzLlxuICpcbiAqIEByZXR1cm5zIFRoZSBhYm9ydCBzaWduYWwgdGhhdCBuZXZlciBhYm9ydHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYm9ydFNpZ25hbE5ldmVyKCk6IEFib3J0U2lnbmFsIHtcbiAgcmV0dXJuIG5ldyBBYm9ydENvbnRyb2xsZXIoKS5zaWduYWw7XG59XG5cbi8qKlxuICogQW4gYWJvcnQgc2lnbmFsIHRoYXQgYWJvcnRzIGFmdGVyIGEgdGltZW91dC5cbiAqXG4gKiBAcGFyYW0gdGltZW91dEluTWlsbGlzZWNvbmRzIC0gVGhlIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzLlxuICogQHJldHVybnMgVGhlIGFib3J0IHNpZ25hbCB0aGF0IGFib3J0cyBhZnRlciBhIHRpbWVvdXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYm9ydFNpZ25hbFRpbWVvdXQodGltZW91dEluTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBBYm9ydFNpZ25hbCB7XG4gIGlmICh0aW1lb3V0SW5NaWxsaXNlY29uZHMgPT09IElORklOSVRFX1RJTUVPVVQpIHtcbiAgICByZXR1cm4gYWJvcnRTaWduYWxOZXZlcigpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBBYm9ydFNpZ25hbC50aW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEFib3J0U2lnbmFsLnRpbWVvdXQodGltZW91dEluTWlsbGlzZWNvbmRzKTtcbiAgfVxuXG4gIGNvbnN0IGFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGFib3J0Q29udHJvbGxlci5hYm9ydChuZXcgRXJyb3IoYFRpbWVkIG91dCBpbiAke1N0cmluZyh0aW1lb3V0SW5NaWxsaXNlY29uZHMpfSBtaWxsaXNlY29uZHNgKSk7XG4gIH0sIHRpbWVvdXRJbk1pbGxpc2Vjb25kcyk7XG4gIHJldHVybiBhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xufVxuXG4vKipcbiAqIEFkZHMgYW4gYWJvcnQgbGlzdGVuZXIgdG8gYW4gYWJvcnQgc2lnbmFsIGFuZCBjYWxscyB0aGUgY2FsbGJhY2sgaWYgdGhlIGFib3J0IHNpZ25hbCBpcyBhbHJlYWR5IGFib3J0ZWQuXG4gKlxuICogQHBhcmFtIGFib3J0U2lnbmFsIC0gVGhlIGFib3J0IHNpZ25hbCB0byBhZGQgdGhlIGxpc3RlbmVyIHRvLlxuICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbGwgd2hlbiB0aGUgYWJvcnQgc2lnbmFsIGFib3J0cy5cbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBhYm9ydCBsaXN0ZW5lci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uQWJvcnQoYWJvcnRTaWduYWw6IEFib3J0U2lnbmFsLCBjYWxsYmFjazogKGFib3J0U2lnbmFsOiBBYm9ydFNpZ25hbCkgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICBpZiAoYWJvcnRTaWduYWwuYWJvcnRlZCkge1xuICAgIGNhbGxiYWNrKGFib3J0U2lnbmFsKTtcbiAgICByZXR1cm4gbm9vcDtcbiAgfVxuXG4gIGFib3J0U2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgd3JhcHBlZENhbGxiYWNrLCB7IG9uY2U6IHRydWUgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgYWJvcnRTaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCB3cmFwcGVkQ2FsbGJhY2spO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHdyYXBwZWRDYWxsYmFjayhldnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgY2FsbGJhY2soZXZ0LnRhcmdldCBhcyBBYm9ydFNpZ25hbCk7XG4gIH1cbn1cblxuLyoqXG4gKiBXYWl0cyBmb3IgYW4gYWJvcnQgc2lnbmFsIHRvIGFib3J0IGFuZCByZXNvbHZlcyB3aXRoIGl0cyByZWFzb24uXG4gKlxuICogQHR5cGVQYXJhbSBUIC0gRXhwZWN0ZWQgdHlwZSBvZiBgYWJvcnRTaWduYWwucmVhc29uYC5cbiAqIEBwYXJhbSBhYm9ydFNpZ25hbCAtIFRoZSBhYm9ydCBzaWduYWwgdG8gd2FpdCBmb3IuXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlYXNvbiBvZiB0aGUgYWJvcnQgc2lnbmFsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2FpdEZvckFib3J0PFQgPSB1bmtub3duPihhYm9ydFNpZ25hbDogQWJvcnRTaWduYWwpOiBQcm9taXNlPFQ+O1xuLyoqXG4gKiBXYWl0cyBmb3IgYW4gYWJvcnQgc2lnbmFsIHRvIGFib3J0IGFuZCByZWplY3RzIHdpdGggaXRzIHJlYXNvbi5cbiAqXG4gKiBAcGFyYW0gYWJvcnRTaWduYWwgLSBUaGUgYWJvcnQgc2lnbmFsIHRvIHdhaXQgZm9yLlxuICogQHBhcmFtIHNob3VsZFJlamVjdE9uQWJvcnQgLSBXaGV0aGVyIHRvIHJlamVjdCB0aGUgcHJvbWlzZSBpZiB0aGUgYWJvcnQgc2lnbmFsIGlzIGFib3J0ZWQuXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlamVjdHMgd2l0aCB0aGUgcmVhc29uIG9mIHRoZSBhYm9ydCBzaWduYWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yQWJvcnQoYWJvcnRTaWduYWw6IEFib3J0U2lnbmFsLCBzaG91bGRSZWplY3RPbkFib3J0OiB0cnVlKTogUHJvbWlzZTxuZXZlcj47XG4vKipcbiAqIFdhaXRzIGZvciBhbiBhYm9ydCBzaWduYWwgdG8gYWJvcnQgYW5kIHJlc29sdmVzIHdpdGggaXRzIHJlYXNvbi5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBFeHBlY3RlZCB0eXBlIG9mIGBhYm9ydFNpZ25hbC5yZWFzb25gLlxuICogQHBhcmFtIGFib3J0U2lnbmFsIC0gVGhlIGFib3J0IHNpZ25hbCB0byB3YWl0IGZvci5cbiAqIEBwYXJhbSBzaG91bGRSZWplY3RPbkFib3J0IC0gV2hldGhlciB0byByZWplY3QgdGhlIHByb21pc2UgaWYgdGhlIGFib3J0IHNpZ25hbCBpcyBhYm9ydGVkLlxuICogQHJldHVybnMgQSB7QGxpbmsgUHJvbWlzZX0gdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZWFzb24gb2YgdGhlIGFib3J0IHNpZ25hbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3JBYm9ydDxUID0gdW5rbm93bj4oYWJvcnRTaWduYWw6IEFib3J0U2lnbmFsLCBzaG91bGRSZWplY3RPbkFib3J0PzogYm9vbGVhbik6IFByb21pc2U8VD4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIG9uQWJvcnQoYWJvcnRTaWduYWwsICgpID0+IHtcbiAgICAgIGlmIChzaG91bGRSZWplY3RPbkFib3J0KSB7XG4gICAgICAgIHJlamVjdChhYm9ydFNpZ25hbC5yZWFzb24gYXMgRXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShhYm9ydFNpZ25hbC5yZWFzb24gYXMgVCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQ29udGFpbnMgdXRpbGl0eSBmdW5jdGlvbnMgZm9yIGRlYnVnZ2luZy5cbiAqL1xuXG5pbXBvcnQgdHlwZSB7IERlYnVnZ2VyIH0gZnJvbSAnZGVidWcnO1xuXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuXG5pbXBvcnQgdHlwZSB7IERlYnVnQ29udHJvbGxlciB9IGZyb20gJy4vZGVidWctY29udHJvbGxlci50cyc7XG5cbmltcG9ydCB7IEN1c3RvbVN0YWNrVHJhY2VFcnJvciB9IGZyb20gJy4vZXJyb3IudHMnO1xuaW1wb3J0IHsgTElCUkFSWV9OQU1FIH0gZnJvbSAnLi9saWJyYXJ5LnRzJztcbmltcG9ydCB7IGdldE9ic2lkaWFuRGV2VXRpbHNTdGF0ZSB9IGZyb20gJy4vb2JzaWRpYW4vYXBwLnRzJztcbmltcG9ydCB7IGlzSW5PYnNpZGlhbiB9IGZyb20gJy4vb2JzaWRpYW4vaXMtaW4tb2JzaWRpYW4udHMnO1xuaW1wb3J0IHtcbiAgZ2V0UGx1Z2luSWQsXG4gIE5PX1BMVUdJTl9JRF9JTklUSUFMSVpFRFxufSBmcm9tICcuL29ic2lkaWFuL3BsdWdpbi9wbHVnaW4taWQudHMnO1xuaW1wb3J0IHsgZW5zdXJlTm9uTnVsbGFibGUgfSBmcm9tICcuL3R5cGUtZ3VhcmRzLnRzJztcblxuY29uc3QgTkFNRVNQQUNFX1NFUEFSQVRPUiA9ICcsJztcbmNvbnN0IE5FR0FURURfTkFNRVNQQUNFX1BSRUZJWCA9ICctJztcblxuLyoqXG4gKiBFbmFibGVzIHRoZSBkZWJ1Z2dlcnMgZm9yIHRoZSBgb2JzaWRpYW4tZGV2LXV0aWxzYCBsaWJyYXJ5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlTGlicmFyeURlYnVnZ2VycygpOiB2b2lkIHtcbiAgZW5hYmxlTmFtZXNwYWNlcyhbTElCUkFSWV9OQU1FLCBgJHtMSUJSQVJZX05BTUV9OipgXSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGRlYnVnIGNvbnRyb2xsZXIuXG4gKlxuICogQHJldHVybnMgQSBkZWJ1ZyBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVidWdDb250cm9sbGVyKCk6IERlYnVnQ29udHJvbGxlciB7XG4gIHJldHVybiB7XG4gICAgZGlzYWJsZTogZGlzYWJsZU5hbWVzcGFjZXMsXG4gICAgZW5hYmxlOiBlbmFibGVOYW1lc3BhY2VzLFxuICAgIGdldDogZ2V0TmFtZXNwYWNlcyxcbiAgICBzZXQ6IHNldE5hbWVzcGFjZXNcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZGVidWdnZXIgaW5zdGFuY2Ugd2l0aCBhIGxvZyBmdW5jdGlvbiB0aGF0IGluY2x1ZGVzIHRoZSBjYWxsZXIncyBmaWxlIG5hbWUgYW5kIGxpbmUgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSBuYW1lc3BhY2UgLSBUaGUgbmFtZXNwYWNlIGZvciB0aGUgZGVidWdnZXIgaW5zdGFuY2UuXG4gKiBAcGFyYW0gZnJhbWVzVG9Ta2lwIC0gVGhlIG51bWJlciBvZiBmcmFtZXMgdG8gc2tpcCBpbiB0aGUgc3RhY2sgdHJhY2UuXG4gKiBAcmV0dXJucyBBIGRlYnVnZ2VyIGluc3RhbmNlIHdpdGggYSBsb2cgZnVuY3Rpb24gdGhhdCBpbmNsdWRlcyB0aGUgY2FsbGVyJ3MgZmlsZSBuYW1lIGFuZCBsaW5lIG51bWJlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlYnVnZ2VyKG5hbWVzcGFjZTogc3RyaW5nLCBmcmFtZXNUb1NraXAgPSAwKTogRGVidWdnZXIge1xuICBjb25zdCBrZXkgPSBgJHtuYW1lc3BhY2V9OiR7U3RyaW5nKGZyYW1lc1RvU2tpcCl9YDtcbiAgY29uc3QgZGVidWdnZXJzTWFwID0gZ2V0T2JzaWRpYW5EZXZVdGlsc1N0YXRlKG51bGwsICdkZWJ1Z2dlcnMnLCBuZXcgTWFwPHN0cmluZywgRGVidWdnZXI+KCkpLnZhbHVlO1xuICBsZXQgZGVidWdnZXJFeCA9IGRlYnVnZ2Vyc01hcC5nZXQoa2V5KTtcbiAgaWYgKCFkZWJ1Z2dlckV4KSB7XG4gICAgZGVidWdnZXJFeCA9IGdldFNoYXJlZERlYnVnTGliSW5zdGFuY2UoKShuYW1lc3BhY2UpO1xuICAgIGRlYnVnZ2VyRXgubG9nID0gKG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogdW5rbm93bltdKTogdm9pZCA9PiB7XG4gICAgICBsb2dXaXRoQ2FsbGVyKG5hbWVzcGFjZSwgZnJhbWVzVG9Ta2lwLCBtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICB9O1xuXG4gICAgZGVidWdnZXJzTWFwLnNldChrZXksIGRlYnVnZ2VyRXgpO1xuICB9XG5cbiAgcmV0dXJuIGRlYnVnZ2VyRXg7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGRlYnVnZ2VyIGluc3RhbmNlIGZvciB0aGUgYG9ic2lkaWFuLWRldi11dGlsc2AgbGlicmFyeS5cbiAqXG4gKiBAcGFyYW0gbmFtZXNwYWNlIC0gVGhlIG5hbWVzcGFjZSBmb3IgdGhlIGRlYnVnZ2VyIGluc3RhbmNlLlxuICogQHJldHVybnMgQSBkZWJ1Z2dlciBpbnN0YW5jZSBmb3IgdGhlIGBvYnNpZGlhbi1kZXYtdXRpbHNgIGxpYnJhcnkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaWJEZWJ1Z2dlcihuYW1lc3BhY2U6IHN0cmluZyk6IERlYnVnZ2VyIHtcbiAgY29uc3QgcGx1Z2luSWQgPSBnZXRQbHVnaW5JZCgpO1xuICBjb25zdCBwcmVmaXggPSBwbHVnaW5JZCA9PT0gTk9fUExVR0lOX0lEX0lOSVRJQUxJWkVEID8gJycgOiBgJHtwbHVnaW5JZH06YDtcbiAgcmV0dXJuIGdldERlYnVnZ2VyKGAke3ByZWZpeH0ke0xJQlJBUllfTkFNRX06JHtuYW1lc3BhY2V9YCk7XG59XG5cbi8qKlxuICogUHJpbnRzIGEgbWVzc2FnZSB3aXRoIGEgc3RhY2sgdHJhY2UuXG4gKlxuICogQHBhcmFtIGRlYnVnZ2VySW5zdGFuY2UgLSBUaGUgZGVidWdnZXIgaW5zdGFuY2UuXG4gKiBAcGFyYW0gc3RhY2tUcmFjZSAtIFRoZSBzdGFjayB0cmFjZSB0byBwcmludC5cbiAqIEBwYXJhbSBtZXNzYWdlIC0gVGhlIG1lc3NhZ2UgdG8gcHJpbnQuXG4gKiBAcGFyYW0gYXJncyAtIFRoZSBhcmd1bWVudHMgdG8gcHJpbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmludFdpdGhTdGFja1RyYWNlKGRlYnVnZ2VySW5zdGFuY2U6IERlYnVnZ2VyLCBzdGFja1RyYWNlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogdW5rbm93bltdKTogdm9pZCB7XG4gIGlmICghaXNJbk9ic2lkaWFuKCkpIHtcbiAgICBkZWJ1Z2dlckluc3RhbmNlKG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRlYnVnZ2VySW5zdGFuY2UobWVzc2FnZSwgLi4uYXJncywgJ1xcblxcbi0tLVxcbkNvbnRleHQgc3RhY2sgdHJhY2U6XFxuJywgbWFrZVN0YWNrVHJhY2VFcnJvcihzdGFja1RyYWNlKSk7XG59XG5cbi8qKlxuICogU2hvd3MgYW4gaW5pdGlhbCBkZWJ1ZyBtZXNzYWdlLlxuICpcbiAqIEBwYXJhbSBwbHVnaW5JZCAtIFRoZSBwbHVnaW4gSUQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG93SW5pdGlhbERlYnVnTWVzc2FnZShwbHVnaW5JZDogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IGlzRW5hYmxlZCA9IGdldFNoYXJlZERlYnVnTGliSW5zdGFuY2UoKS5lbmFibGVkKHBsdWdpbklkKTtcbiAgY29uc3Qgc3RhdGUgPSBpc0VuYWJsZWQgPyAnZW5hYmxlZCcgOiAnZGlzYWJsZWQnO1xuICBjb25zdCBjaGFuZ2VBY3Rpb24gPSBpc0VuYWJsZWQgPyAnZGlzYWJsZScgOiAnZW5hYmxlJztcbiAgY29uc3QgbmFtZXNwYWNlcyA9IGdldE5hbWVzcGFjZXMoKTtcbiAgc2V0TmFtZXNwYWNlcyhwbHVnaW5JZCk7XG4gIGdldERlYnVnZ2VyKHBsdWdpbklkKShcbiAgICBgRGVidWcgbWVzc2FnZXMgZm9yIHBsdWdpbiAke3BsdWdpbklkfSBhcmUgJHtzdGF0ZX0uIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW5hb3Vtb3Yvb2JzaWRpYW4tZGV2LXV0aWxzL2Jsb2IvbWFpbi9kb2NzL2RlYnVnZ2luZy5tZCBob3cgdG8gJHtjaGFuZ2VBY3Rpb259IHRoZW0uYFxuICApO1xuICBzZXROYW1lc3BhY2VzKG5hbWVzcGFjZXMpO1xufVxuXG5mdW5jdGlvbiBkaXNhYmxlTmFtZXNwYWNlcyhuYW1lc3BhY2VzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHZvaWQge1xuICBjb25zdCBzZXQgPSBuZXcgU2V0KGdldE5hbWVzcGFjZXMoKSk7XG4gIGZvciAoY29uc3QgbmFtZXNwYWNlIG9mIHRvQXJyYXkobmFtZXNwYWNlcykpIHtcbiAgICBpZiAobmFtZXNwYWNlLnN0YXJ0c1dpdGgoTkVHQVRFRF9OQU1FU1BBQ0VfUFJFRklYKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IG5lZ2F0ZWROYW1lc3BhY2UgPSBORUdBVEVEX05BTUVTUEFDRV9QUkVGSVggKyBuYW1lc3BhY2U7XG4gICAgaWYgKHNldC5oYXMobmFtZXNwYWNlKSkge1xuICAgICAgc2V0LmRlbGV0ZShuYW1lc3BhY2UpO1xuICAgIH1cbiAgICBzZXQuYWRkKG5lZ2F0ZWROYW1lc3BhY2UpO1xuICB9XG4gIHNldE5hbWVzcGFjZXMoQXJyYXkuZnJvbShzZXQpKTtcbn1cblxuZnVuY3Rpb24gZW5hYmxlTmFtZXNwYWNlcyhuYW1lc3BhY2VzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHZvaWQge1xuICBjb25zdCBzZXQgPSBuZXcgU2V0KGdldE5hbWVzcGFjZXMoKSk7XG4gIGZvciAoY29uc3QgbmFtZXNwYWNlIG9mIHRvQXJyYXkobmFtZXNwYWNlcykpIHtcbiAgICBpZiAoIW5hbWVzcGFjZS5zdGFydHNXaXRoKE5FR0FURURfTkFNRVNQQUNFX1BSRUZJWCkpIHtcbiAgICAgIGNvbnN0IG5lZ2F0ZWROYW1lc3BhY2UgPSBORUdBVEVEX05BTUVTUEFDRV9QUkVGSVggKyBuYW1lc3BhY2U7XG4gICAgICBpZiAoc2V0LmhhcyhuZWdhdGVkTmFtZXNwYWNlKSkge1xuICAgICAgICBzZXQuZGVsZXRlKG5lZ2F0ZWROYW1lc3BhY2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBzZXQuYWRkKG5hbWVzcGFjZSk7XG4gIH1cbiAgc2V0TmFtZXNwYWNlcyhBcnJheS5mcm9tKHNldCkpO1xufVxuXG5mdW5jdGlvbiBnZXROYW1lc3BhY2VzKCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIHRvQXJyYXkoZ2V0U2hhcmVkRGVidWdMaWJJbnN0YW5jZSgpLmxvYWQoKSA/PyAnJyk7XG59XG5cbmZ1bmN0aW9uIGdldFNoYXJlZERlYnVnTGliSW5zdGFuY2UoKTogdHlwZW9mIGRlYnVnIHtcbiAgaWYgKCFpc0luT2JzaWRpYW4oKSkge1xuICAgIHJldHVybiBkZWJ1ZztcbiAgfVxuICByZXR1cm4gZ2V0T2JzaWRpYW5EZXZVdGlsc1N0YXRlKG51bGwsICdkZWJ1ZycsIGRlYnVnKS52YWx1ZTtcbn1cblxuZnVuY3Rpb24gbG9nV2l0aENhbGxlcihuYW1lc3BhY2U6IHN0cmluZywgZnJhbWVzVG9Ta2lwOiBudW1iZXIsIG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogdW5rbm93bltdKTogdm9pZCB7XG4gIGlmICghZ2V0U2hhcmVkRGVidWdMaWJJbnN0YW5jZSgpLmVuYWJsZWQobmFtZXNwYWNlKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghaXNJbk9ic2lkaWFuKCkpIHtcbiAgICBjb25zb2xlLmRlYnVnKG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNhbGxlciBsaW5lIGluZGV4IGlzIDQgYmVjYXVzZSB0aGUgY2FsbCBzdGFjayBpcyBhcyBmb2xsb3dzOlxuICAgKlxuICAgKiAwOiBFcnJvclxuICAgKiAxOiAgICAgYXQgbG9nV2l0aENhbGxlciAoPzo/Oj8pXG4gICAqIDI6ICAgICBhdCBkZWJ1Z0luc3RhbmNlLmxvZyAoPzo/Oj8pXG4gICAqIDM6ICAgICBhdCBkZWJ1ZyAoPzo/Oj8pXG4gICAqIDQ6ICAgICBhdCBmdW5jdGlvbk5hbWUgKHBhdGgvdG8vY2FsbGVyLmpzOj86PylcbiAgICovXG4gIGNvbnN0IENBTExFUl9MSU5FX0lOREVYID0gNDtcblxuICBjb25zdCBzdGFja0xpbmVzID0gZW5zdXJlTm9uTnVsbGFibGUobmV3IEVycm9yKCkuc3RhY2spLnNwbGl0KCdcXG4nKTtcbiAgc3RhY2tMaW5lcy5zcGxpY2UoMCwgQ0FMTEVSX0xJTkVfSU5ERVggKyBmcmFtZXNUb1NraXApO1xuXG4gIGNvbnNvbGUuZGVidWcobWVzc2FnZSwgLi4uYXJncywgJ1xcblxcbi0tLVxcbkxvZ2dlciBzdGFjayB0cmFjZTpcXG4nLCBtYWtlU3RhY2tUcmFjZUVycm9yKHN0YWNrTGluZXMuam9pbignXFxuJykpKTtcbn1cblxuZnVuY3Rpb24gbWFrZVN0YWNrVHJhY2VFcnJvcihzdGFja1RyYWNlOiBzdHJpbmcpOiBDdXN0b21TdGFja1RyYWNlRXJyb3Ige1xuICByZXR1cm4gbmV3IEN1c3RvbVN0YWNrVHJhY2VFcnJvcihcbiAgICAnRGVidWcgbW9kZTogaW50ZW50aW9uYWwgcGxhY2Vob2xkZXIgZXJyb3IuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW5hb3Vtb3Yvb2JzaWRpYW4tZGV2LXV0aWxzL2Jsb2IvbWFpbi9kb2NzL2RlYnVnZ2luZy5tZC4nLFxuICAgIHN0YWNrVHJhY2UsXG4gICAgdW5kZWZpbmVkXG4gICk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbmFtZXNwYWNlcyB0byBlbmFibGUuXG4gKlxuICogQHBhcmFtIG5hbWVzcGFjZXMgLSBUaGUgbmFtZXNwYWNlcyB0byBlbmFibGUuXG4gKi9cbmZ1bmN0aW9uIHNldE5hbWVzcGFjZXMobmFtZXNwYWNlczogc3RyaW5nIHwgc3RyaW5nW10pOiB2b2lkIHtcbiAgZ2V0U2hhcmVkRGVidWdMaWJJbnN0YW5jZSgpLmVuYWJsZSh0b0FycmF5KG5hbWVzcGFjZXMpLmpvaW4oTkFNRVNQQUNFX1NFUEFSQVRPUikpO1xufVxuXG5mdW5jdGlvbiB0b0FycmF5KG5hbWVzcGFjZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICByZXR1cm4gdHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnID8gbmFtZXNwYWNlcy5zcGxpdChOQU1FU1BBQ0VfU0VQQVJBVE9SKS5maWx0ZXIoQm9vbGVhbikgOiBuYW1lc3BhY2VzLmZsYXRNYXAodG9BcnJheSk7XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBDb250YWlucyB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgdHlwZSBndWFyZHMuXG4gKi9cblxuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vZnVuY3Rpb24udHMnO1xuXG4vKipcbiAqIEEgdHlwZSB0aGF0IHJlcHJlc2VudHMgYSBnZW5lcmljIG9iamVjdC5cbiAqL1xuZXhwb3J0IHR5cGUgR2VuZXJpY09iamVjdCA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXG50eXBlIE51bGxhYmxlQ29uc3RyYWludDxUPiA9IG51bGwgZXh0ZW5kcyBUID8gdW5rbm93biA6IHVuZGVmaW5lZCBleHRlbmRzIFQgPyB1bmtub3duIDogbmV2ZXI7XG5cbi8qKlxuICogQXNzZXJ0cyB0aGF0IGEgY29uZGl0aW9uIGlzIGB0cnVlYC4gVGhyb3dzIGlmIGl0IGlzIG5vdC5cbiAqXG4gKiBVc2UgaW4gcGxhY2Ugb2YgYC8qIHY4IGlnbm9yZSAqXFwvYCBmb3IgZGVmZW5zaXZlIGd1YXJkcyB0aGF0IHNob3VsZFxuICogbmV2ZXIgdHJpZ2dlciBhdCBydW50aW1lIGJ1dCB3b3VsZCBvdGhlcndpc2UgY3JlYXRlIHVuY292ZXJlZCBicmFuY2hlcy5cbiAqXG4gKiBAcGFyYW0gY29uZGl0aW9uIC0gVGhlIGNvbmRpdGlvbiB0byBhc3NlcnQuXG4gKiBAcGFyYW0gZXJyb3JPck1lc3NhZ2UgLSBUaGUgZXJyb3Igb3IgbWVzc2FnZSB0byB0aHJvdyBpZiB0aGUgY29uZGl0aW9uIGlzIGBmYWxzZWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uOiBib29sZWFuLCBlcnJvck9yTWVzc2FnZTogRXJyb3IgfCBzdHJpbmcpOiBhc3NlcnRzIGNvbmRpdGlvbiB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgdHlwZW9mIGVycm9yT3JNZXNzYWdlID09PSAnc3RyaW5nJyA/IG5ldyBFcnJvcihlcnJvck9yTWVzc2FnZSkgOiBlcnJvck9yTWVzc2FnZTtcbiAgfVxufVxuXG4vKipcbiAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgZ2VuZXJpYyBvYmplY3QsIG5hcnJvd2luZyBpdHMgdHlwZSBpbiBwbGFjZS5cbiAqXG4gKiBAcGFyYW0gX29iaiAtIFRoZSB2YWx1ZSB0byBhc3NlcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRHZW5lcmljT2JqZWN0KF9vYmo6IG9iamVjdCk6IGFzc2VydHMgX29iaiBpcyBHZW5lcmljT2JqZWN0IHtcbiAgbm9vcCgpO1xufVxuXG4vKipcbiAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIG5vdCBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsIG5hcnJvd2luZyBpdHMgdHlwZSBpbiBwbGFjZS5cbiAqXG4gKiBPbmx5IGNhbGxhYmxlIHdoZW4gYFRgIGluY2x1ZGVzIGBudWxsYCBvciBgdW5kZWZpbmVkYC4gUGFzc2luZyBhbiBhbHJlYWR5IG5vbi1udWxsYWJsZSB0eXBlIGlzIGEgY29tcGlsZSBlcnJvci5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBUaGUgdHlwZSBvZiB0aGUgdmFsdWUuXG4gKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0gZXJyb3JPck1lc3NhZ2UgLSBPcHRpb25hbCB7QGxpbmsgRXJyb3J9IG9yIGVycm9yIG1lc3NhZ2Ugc3RyaW5nLlxuICogQHRocm93cyBJZiB0aGUgdmFsdWUgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Tm9uTnVsbGFibGU8VCBleHRlbmRzIE51bGxhYmxlQ29uc3RyYWludDxUPj4odmFsdWU6IFQsIGVycm9yT3JNZXNzYWdlPzogRXJyb3IgfCBzdHJpbmcpOiBhc3NlcnRzIHZhbHVlIGlzIE5vbk51bGxhYmxlPFQ+IHtcbiAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBlcnJvck9yTWVzc2FnZSA/Pz0gdmFsdWUgPT09IG51bGwgPyAnVmFsdWUgaXMgbnVsbCcgOiAnVmFsdWUgaXMgdW5kZWZpbmVkJztcbiAgY29uc3QgZXJyb3IgPSB0eXBlb2YgZXJyb3JPck1lc3NhZ2UgPT09ICdzdHJpbmcnID8gbmV3IEVycm9yKGVycm9yT3JNZXNzYWdlKSA6IGVycm9yT3JNZXNzYWdlO1xuICB0aHJvdyBlcnJvcjtcbn1cblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgYSB2YWx1ZSBpcyBhIGdlbmVyaWMgb2JqZWN0LCByZXR1cm5pbmcgaXQgd2l0aCBuYXJyb3dlZCB0eXBlLlxuICpcbiAqIEBwYXJhbSBvYmogLSBUaGUgdmFsdWUgdG8gZW5zdXJlLlxuICogQHJldHVybnMgVGhlIHZhbHVlIGFzIGEgZ2VuZXJpYyBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVHZW5lcmljT2JqZWN0PFQ+KG9iajogVCk6IEdlbmVyaWNPYmplY3QgJiBUIHtcbiAgcmV0dXJuIG9iaiBhcyBHZW5lcmljT2JqZWN0ICYgVDtcbn1cblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgYSB2YWx1ZSBpcyBub3QgYG51bGxgIG9yIGB1bmRlZmluZWRgIGFuZCByZXR1cm5zIGl0IHdpdGggbmFycm93ZWQgdHlwZS5cbiAqXG4gKiBPbmx5IGNhbGxhYmxlIHdoZW4gYFRgIGluY2x1ZGVzIGBudWxsYCBvciBgdW5kZWZpbmVkYC4gUGFzc2luZyBhbiBhbHJlYWR5IG5vbi1udWxsYWJsZSB0eXBlIGlzIGEgY29tcGlsZSBlcnJvci5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBUaGUgdHlwZSBvZiB0aGUgdmFsdWUuXG4gKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0gZXJyb3JPck1lc3NhZ2UgLSBPcHRpb25hbCB7QGxpbmsgRXJyb3J9IG9yIGVycm9yIG1lc3NhZ2Ugc3RyaW5nLlxuICogQHJldHVybnMgVGhlIHZhbHVlIHdpdGggYG51bGxgIGFuZCBgdW5kZWZpbmVkYCBleGNsdWRlZCBmcm9tIGl0cyB0eXBlLlxuICogQHRocm93cyBJZiB0aGUgdmFsdWUgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlTm9uTnVsbGFibGU8VCBleHRlbmRzIE51bGxhYmxlQ29uc3RyYWludDxUPj4odmFsdWU6IFQsIGVycm9yT3JNZXNzYWdlPzogRXJyb3IgfCBzdHJpbmcpOiBOb25OdWxsYWJsZTxUPiB7XG4gIGFzc2VydE5vbk51bGxhYmxlKHZhbHVlLCBlcnJvck9yTWVzc2FnZSk7XG4gIHJldHVybiB2YWx1ZTtcbn1cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIENvbnRhaW5zIHV0aWxpdHkgZnVuY3Rpb25zIGZvciBlcnJvciBoYW5kbGluZy5cbiAqL1xuXG5pbXBvcnQgeyBBc3luY0V2ZW50cyB9IGZyb20gJy4vYXN5bmMtZXZlbnRzLnRzJztcbmltcG9ydCB7IGVuc3VyZU5vbk51bGxhYmxlIH0gZnJvbSAnLi90eXBlLWd1YXJkcy50cyc7XG5cbmNvbnN0IEFTWU5DX0VSUk9SX0VWRU5UID0gJ2FzeW5jRXJyb3InO1xuXG5jb25zdCBhc3luY0Vycm9yRXZlbnRFbWl0dGVyID0gbmV3IEFzeW5jRXZlbnRzKCk7XG5hc3luY0Vycm9yRXZlbnRFbWl0dGVyLm9uKEFTWU5DX0VSUk9SX0VWRU5ULCBoYW5kbGVBc3luY0Vycm9yKTtcblxuLyoqXG4gKiBBIG1lc3NhZ2Ugb2YgdGhlIEFzeW5jV3JhcHBlckVycm9yLlxuICovXG5leHBvcnQgY29uc3QgQVNZTkNfV1JBUFBFUl9FUlJPUl9NRVNTQUdFID0gJ0FuIHVuaGFuZGxlZCBlcnJvciBvY2N1cnJlZCBleGVjdXRpbmcgYXN5bmMgb3BlcmF0aW9uJztcblxuY29uc3QgU1RBQ0tfVFJBQ0VfUFJFRklYID0gJyAgICBhdCc7XG5cbi8qKlxuICogQW4gZXJyb3IgdGhhdCB3cmFwcyBhbiBlcnJvciB3aXRoIGEgY3VzdG9tIHN0YWNrIHRyYWNlLlxuICovXG5leHBvcnQgY2xhc3MgQ3VzdG9tU3RhY2tUcmFjZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBDdXN0b21TdGFja1RyYWNlRXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSBtZXNzYWdlIC0gVGhlIG1lc3NhZ2Ugb2YgdGhlIGVycm9yLlxuICAgKiBAcGFyYW0gc3RhY2tUcmFjZSAtIFRoZSBzdGFjayB0cmFjZSBvZiB0aGUgZXJyb3IuXG4gICAqIEBwYXJhbSBjYXVzZSAtIFRoZSBjYXVzZSBvZiB0aGUgZXJyb3IuXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBzdGFja1RyYWNlOiBzdHJpbmcsIGNhdXNlOiB1bmtub3duKSB7XG4gICAgc3VwZXIobWVzc2FnZSwgeyBjYXVzZSB9KTtcbiAgICB0aGlzLm5hbWUgPSAnQ3VzdG9tU3RhY2tUcmFjZUVycm9yJztcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5uZWNlc3NhcnktY29uZGl0aW9uIC0tIGA/LmAgaXMgdXNlZCB0byBzdXBwb3J0IGlPUyBiZWZvcmUgMTcuMi5cbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZT8uKHRoaXMsIEN1c3RvbVN0YWNrVHJhY2VFcnJvcik7XG5cbiAgICBsZXQgcm9vdENhdXNlID0gY2F1c2U7XG4gICAgY29uc3QgcGFyZW50Q2F1c2VzID0gbmV3IFNldDxDdXN0b21TdGFja1RyYWNlRXJyb3I+KCk7XG4gICAgd2hpbGUgKHJvb3RDYXVzZSBpbnN0YW5jZW9mIEN1c3RvbVN0YWNrVHJhY2VFcnJvcikge1xuICAgICAgaWYgKHBhcmVudENhdXNlcy5oYXMocm9vdENhdXNlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NpcmN1bGFyIGNhdXNlIGRldGVjdGVkJyk7XG4gICAgICB9XG4gICAgICBwYXJlbnRDYXVzZXMuYWRkKHJvb3RDYXVzZSk7XG4gICAgICByb290Q2F1c2UgPSByb290Q2F1c2UuY2F1c2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luYWxTdGFja0xpbmVzID0gZW5zdXJlTm9uTnVsbGFibGUodGhpcy5zdGFjaykuc3BsaXQoJ1xcbicpO1xuICAgIGNvbnN0IHN0YWNrTGluZXMgPSBzdGFja1RyYWNlLnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBFUlJPUl9IRUFERVJfUkVHX0VYUCA9IC9eXFx3KkVycm9yKD86OiB8JCkvO1xuICAgIGlmIChFUlJPUl9IRUFERVJfUkVHX0VYUC50ZXN0KGVuc3VyZU5vbk51bGxhYmxlKHN0YWNrTGluZXNbMF0pKSkge1xuICAgICAgc3RhY2tMaW5lcy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuICAgIG9yaWdpbmFsU3RhY2tMaW5lcy5zcGxpY2UoMSwgb3JpZ2luYWxTdGFja0xpbmVzLmxlbmd0aCAtIDEsIC4uLnN0YWNrTGluZXMpO1xuICAgIHRoaXMuc3RhY2sgPSBvcmlnaW5hbFN0YWNrTGluZXMuam9pbignXFxuJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBlcnJvciB0aGF0IGlzIG5vdCBwcmludGVkIHRvIHRoZSBjb25zb2xlLlxuICovXG5leHBvcnQgY2xhc3MgU2lsZW50RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFNpbGVudEVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0gbWVzc2FnZSAtIFRoZSBtZXNzYWdlIG9mIHRoZSBlcnJvci5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSAnU2lsZW50RXJyb3InO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS1jb25kaXRpb24gLS0gYD8uYCBpcyB1c2VkIHRvIHN1cHBvcnQgaU9TIGJlZm9yZSAxNy4yLlxuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlPy4odGhpcywgU2lsZW50RXJyb3IpO1xuICB9XG59XG5cbi8qKlxuICogRW1pdHMgYW4gYXN5bmNocm9ub3VzIGVycm9yIGV2ZW50LlxuICpcbiAqIEBwYXJhbSBhc3luY0Vycm9yIC0gVGhlIGVycm9yIHRvIGVtaXQgYXMgYW4gYXN5bmNocm9ub3VzIGVycm9yIGV2ZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1pdEFzeW5jRXJyb3JFdmVudChhc3luY0Vycm9yOiB1bmtub3duKTogdm9pZCB7XG4gIGFzeW5jRXJyb3JFdmVudEVtaXR0ZXIudHJpZ2dlcihBU1lOQ19FUlJPUl9FVkVOVCwgYXN5bmNFcnJvcik7XG59XG5cbi8qKlxuICogQ29udmVydHMgYW4gZXJyb3IgdG8gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24sIGluY2x1ZGluZyBuZXN0ZWQgY2F1c2VzIHdpdGggaW5kZW50YXRpb24uXG4gKlxuICogQHBhcmFtIGVycm9yIC0gVGhlIGVycm9yIHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gKiBAcmV0dXJucyBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVycm9yVG9TdHJpbmcoZXJyb3I6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgIHJldHVybiBTdHJpbmcoZXJyb3IpO1xuICB9XG5cbiAgbGV0IG1lc3NhZ2UgPSBlcnJvci5zdGFjayA/PyBgJHtlcnJvci5uYW1lfTogJHtlcnJvci5tZXNzYWdlfWA7XG4gIGlmIChlcnJvci5jYXVzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgY2F1c2VTdHJMaW5lcyA9IGVycm9yVG9TdHJpbmcoZXJyb3IuY2F1c2UpLnNwbGl0KCdcXG4nKTtcbiAgICBtZXNzYWdlICs9IGBcXG4ke2dlbmVyYXRlU3RhY2tUcmFjZUxpbmUoJ0NhdXNlZCBieTonKX1gO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiBjYXVzZVN0ckxpbmVzKSB7XG4gICAgICBpZiAoIWxpbmUudHJpbSgpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbWVzc2FnZSArPSBsaW5lLnN0YXJ0c1dpdGgoU1RBQ0tfVFJBQ0VfUFJFRklYKVxuICAgICAgICA/IGBcXG4ke2xpbmV9YFxuICAgICAgICA6IGBcXG4ke2dlbmVyYXRlU3RhY2tUcmFjZUxpbmUobGluZSl9YDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2U7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgY3VycmVudCBzdGFjayB0cmFjZSBhcyBhIHN0cmluZywgZXhjbHVkaW5nIHRoZSBjdXJyZW50IGZ1bmN0aW9uIGNhbGwuXG4gKlxuICogQHBhcmFtIGZyYW1lc1RvU2tpcCAtIFRoZSBudW1iZXIgb2YgZnJhbWVzIHRvIHNraXAgaW4gdGhlIHN0YWNrIHRyYWNlLlxuICogQHJldHVybnMgQSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGN1cnJlbnQgc3RhY2sgdHJhY2UsIGV4Y2x1ZGluZyB0aGUgY3VycmVudCBmdW5jdGlvbiBjYWxsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RhY2tUcmFjZShmcmFtZXNUb1NraXAgPSAwKTogc3RyaW5nIHtcbiAgLy8gU2tpcHBpbmcgRXJyb3IgcHJlZml4IGFuZCBgZ2V0U3RhY2tUcmFjZWAgZnVuY3Rpb24gY2FsbFxuICBjb25zdCBBRERJVElPTkFMX0ZSQU1FU19UT19TS0lQID0gMjtcbiAgY29uc3Qgc3RhY2sgPSBlbnN1cmVOb25OdWxsYWJsZShuZXcgRXJyb3IoKS5zdGFjayk7XG4gIGNvbnN0IGxpbmVzID0gc3RhY2suc3BsaXQoJ1xcbicpO1xuICByZXR1cm4gbGluZXMuc2xpY2UoZnJhbWVzVG9Ta2lwICsgQURESVRJT05BTF9GUkFNRVNfVE9fU0tJUCkuam9pbignXFxuJyk7XG59XG5cbi8qKlxuICogUHJpbnRzIGFuIGVycm9yIHRvIHRoZSBjb25zb2xlLCBpbmNsdWRpbmcgbmVzdGVkIGNhdXNlcyBhbmQgb3B0aW9uYWwgQU5TSSBzZXF1ZW5jZSBjbGVhcmluZy5cbiAqXG4gKiBAcGFyYW0gZXJyb3IgLSBUaGUgZXJyb3IgdG8gcHJpbnQuXG4gKiBAcGFyYW0gY29uc29sZSAtIFRoZSBjb25zb2xlIHRvIHByaW50IHRvIChkZWZhdWx0OiBgZ2xvYmFsVGhpcy5jb25zb2xlYCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmludEVycm9yKGVycm9yOiB1bmtub3duLCBjb25zb2xlPzogQ29uc29sZSk6IHZvaWQge1xuICBjb25zb2xlID8/PSBnbG9iYWxUaGlzLmNvbnNvbGU7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3JUb1N0cmluZyhlcnJvcikpO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVycyBhbiBldmVudCBoYW5kbGVyIGZvciBhc3luY2hyb25vdXMgZXJyb3JzLlxuICpcbiAqIEBwYXJhbSBoYW5kbGVyIC0gVGhlIGhhbmRsZXIgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gYW4gYXN5bmNocm9ub3VzIGVycm9yIGV2ZW50IG9jY3Vycy5cbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdG8gdW5yZWdpc3RlciB0aGUgaGFuZGxlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQXN5bmNFcnJvckV2ZW50SGFuZGxlcihoYW5kbGVyOiAoYXN5bmNFcnJvcjogdW5rbm93bikgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICBjb25zdCBldmVudFJlZiA9IGFzeW5jRXJyb3JFdmVudEVtaXR0ZXIub24oQVNZTkNfRVJST1JfRVZFTlQsIGhhbmRsZXIpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGFzeW5jRXJyb3JFdmVudEVtaXR0ZXIub2ZmcmVmKGV2ZW50UmVmKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UuXG4gKlxuICogQHBhcmFtIGVycm9yIC0gVGhlIGVycm9yIHRvIHRocm93LlxuICogQHRocm93c1xuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dFeHByZXNzaW9uKGVycm9yOiB1bmtub3duKTogbmV2ZXIge1xuICB0aHJvdyBlcnJvcjtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVTdGFja1RyYWNlTGluZSh0aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke1NUQUNLX1RSQUNFX1BSRUZJWH0gLS0tICR7dGl0bGV9IC0tLSAoMClgO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgYXN5bmNocm9ub3VzIGVycm9ycyBieSBwcmludGluZyB0aGVtLlxuICpcbiAqIEBwYXJhbSBhc3luY0Vycm9yIC0gVGhlIGFzeW5jaHJvbm91cyBlcnJvciB0byBoYW5kbGUuXG4gKi9cbmZ1bmN0aW9uIGhhbmRsZUFzeW5jRXJyb3IoYXN5bmNFcnJvcjogdW5rbm93bik6IHZvaWQge1xuICBwcmludEVycm9yKGFzeW5jRXJyb3IpO1xufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogSGVscGVycyBmb3Igd29ya2luZyB3aXRoIHRoZSBgb2JzaWRpYW4tZGV2LXV0aWxzYCBsaWJyYXJ5LlxuICovXG5cbi8qKlxuICogQSB2ZXJzaW9uIG9mIHRoZSBgb2JzaWRpYW4tZGV2LXV0aWxzYCBsaWJyYXJ5LlxuICovXG5leHBvcnQgY29uc3QgTElCUkFSWV9WRVJTSU9OID0gJyQoTElCUkFSWV9WRVJTSU9OKSc7XG5cbi8qKlxuICogQSBuYW1lIG9mIHRoZSBgb2JzaWRpYW4tZGV2LXV0aWxzYCBsaWJyYXJ5LlxuICovXG5leHBvcnQgY29uc3QgTElCUkFSWV9OQU1FID0gJ29ic2lkaWFuLWRldi11dGlscyc7XG5cbi8qKlxuICogQSBzdHlsZXMgb2YgdGhlIGBvYnNpZGlhbi1kZXYtdXRpbHNgIGxpYnJhcnkuXG4gKi9cbmV4cG9ydCBjb25zdCBMSUJSQVJZX1NUWUxFUyA9ICckKExJQlJBUllfU1RZTEVTKSc7XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBQcm92aWRlcyBhIHV0aWxpdHkgdG8gcmV0cmlldmUgdGhlIE9ic2lkaWFuIGBBcHBgIGluc3RhbmNlLlxuICovXG5cbmltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgdHlwZSB7IEdlbmVyaWNPYmplY3QgfSBmcm9tICcuLi90eXBlLWd1YXJkcy50cyc7XG5cbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi9mdW5jdGlvbi50cyc7XG5cbi8qKlxuICogV3JhcHBlciB0eXBlIGZvciBhY2Nlc3NpbmcgdGhlIGBBcHBgIGluc3RhbmNlIGdsb2JhbGx5LlxuICovXG5pbnRlcmZhY2UgQXBwV3JhcHBlciB7XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCByZWZlcmVuY2UgdG8gdGhlIE9ic2lkaWFuIGBBcHBgIGluc3RhbmNlLlxuICAgKi9cbiAgYXBwOiBBcHA7XG59XG5cbmludGVyZmFjZSBPYnNpZGlhbkRldlV0aWxzU3RhdGVXcmFwcGVyIHtcbiAgb2JzaWRpYW5EZXZVdGlsc1N0YXRlOiBHZW5lcmljT2JqZWN0O1xufVxuXG4vKipcbiAqIFdyYXBwZXIgdHlwZSBmb3Igc3RvcmluZyBzaGFyZWQgc3RhdGUgaW4gdGhlIE9ic2lkaWFuIGFwcC5cbiAqL1xuZXhwb3J0IGNsYXNzIFZhbHVlV3JhcHBlcjxUPiB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHZhbHVlIHdyYXBwZXIuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byB3cmFwLlxuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogVCkge1xuICAgIG5vb3AoKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgT2JzaWRpYW4gYEFwcGAgaW5zdGFuY2UuXG4gKlxuICogQHJldHVybnMgVGhlIGBBcHBgIGluc3RhbmNlLlxuICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIHRoZSBgQXBwYCBpbnN0YW5jZSBjYW5ub3QgYmUgZm91bmQuXG4gKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL21uYW91bW92L29ic2lkaWFuLWNvZGVzY3JpcHQtdG9vbGtpdD90YWI9cmVhZG1lLW92LWZpbGUjb2JzaWRpYW5hcHAtbW9kdWxlfVxuICogQGRlcHJlY2F0ZWQgVXNhZ2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyBub3QgcmVjb21tZW5kZWQuIFBhc3MgdGhlIHtAbGluayBBcHB9IGluc3RhbmNlIHRvIHRoZSBmdW5jdGlvbiBpbnN0ZWFkIHdoZW4gcG9zc2libGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHAoKTogQXBwIHtcbiAgY29uc3QgYXBwID0gKGdsb2JhbFRoaXMgYXMgUGFydGlhbDxBcHBXcmFwcGVyPikuYXBwO1xuXG4gIGlmIChhcHApIHtcbiAgICByZXR1cm4gYXBwO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZ2xvYmFsVGhpcy5yZXF1aXJlKCdvYnNpZGlhbi9hcHAnKSBhcyBBcHA7XG4gIH0gY2F0Y2gge1xuICAgIHRocm93IG5ldyBFcnJvcignT2JzaWRpYW4gQXBwIGdsb2JhbCBpbnN0YW5jZSBub3QgZm91bmQnKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHJpZXZlcyBvciBjcmVhdGVzIGEgc2hhcmVkIHN0YXRlIHdyYXBwZXIgb2JqZWN0IGZvciBhIGdpdmVuIGtleSBpbiB0aGUgT2JzaWRpYW4gYXBwLlxuICpcbiAqIEBwYXJhbSBhcHAgLSBUaGUgT2JzaWRpYW4gYXBwIGluc3RhbmNlLlxuICogQHBhcmFtIGtleSAtIFRoZSBrZXkgdG8gc3RvcmUgb3IgcmV0cmlldmUgdGhlIHNoYXJlZCBzdGF0ZS5cbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWUgLSBUaGUgZGVmYXVsdCB2YWx1ZSB0byB1c2UgaWYgdGhlIHNoYXJlZCBzdGF0ZSBkb2VzIG5vdCBleGlzdC5cbiAqIEByZXR1cm5zIFRoZSBWYWx1ZVdyYXBwZXIgb2JqZWN0IHRoYXQgc3RvcmVzIHRoZSBzaGFyZWQgc3RhdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPYnNpZGlhbkRldlV0aWxzU3RhdGU8VD4oYXBwOiBBcHAgfCBudWxsLCBrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBUKTogVmFsdWVXcmFwcGVyPFQ+IHtcbiAgY29uc3QgaG9sZGVyID0gYXBwID8/IGdldEFwcE9yTnVsbCgpID8/IGdsb2JhbFRoaXM7XG4gIGNvbnN0IHNoYXJlZFN0YXRlV3JhcHBlciA9IGhvbGRlciBhcyBQYXJ0aWFsPE9ic2lkaWFuRGV2VXRpbHNTdGF0ZVdyYXBwZXI+O1xuICBzaGFyZWRTdGF0ZVdyYXBwZXIub2JzaWRpYW5EZXZVdGlsc1N0YXRlID8/PSB7fTtcbiAgcmV0dXJuIChzaGFyZWRTdGF0ZVdyYXBwZXIub2JzaWRpYW5EZXZVdGlsc1N0YXRlW2tleV0gPz89IG5ldyBWYWx1ZVdyYXBwZXIoZGVmYXVsdFZhbHVlKSkgYXMgVmFsdWVXcmFwcGVyPFQ+O1xufVxuXG5mdW5jdGlvbiBnZXRBcHBPck51bGwoKTogQXBwIHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1kZXByZWNhdGVkIC0tIFdlIG5lZWQgdG8gdXNlIHRoZSBkZXByZWNhdGVkIGZ1bmN0aW9uIHRvIGdldCB0aGUgYXBwIGluc3RhbmNlLlxuICAgIHJldHVybiBnZXRBcHAoKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW5zaWRlIGFuIE9ic2lkaWFuIGVudmlyb25tZW50LlxuICovXG5cbmltcG9ydCB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQteC9uby1kZXByZWNhdGVkIC0tIFdlIG5lZWQgdG8gdXNlIHRoZSBkZXByZWNhdGVkIGZ1bmN0aW9uIHRvIGNoZWNrIGZvciBPYnNpZGlhbi5cbiAgZ2V0QXBwXG59IGZyb20gJy4vYXBwLnRzJztcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgY29kZSBpcyBydW5uaW5nIGluc2lkZSBhbiBPYnNpZGlhbiBlbnZpcm9ubWVudC5cbiAqXG4gKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW5zaWRlIE9ic2lkaWFuLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbk9ic2lkaWFuKCk6IGJvb2xlYW4ge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZGVwcmVjYXRlZCwgaW1wb3J0LXgvbm8tZGVwcmVjYXRlZCAtLSBXZSBuZWVkIHRvIHVzZSB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvbiB0byBjaGVjayBmb3IgT2JzaWRpYW4uXG4gICAgZ2V0QXBwKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogSG9sZGVyIGZvciB0aGUgcGx1Z2luIElELlxuICovXG5cbi8qKlxuICogQSBwbHVnaW4gSUQgZm9yIG5vIHBsdWdpbi5cbiAqL1xuZXhwb3J0IGNvbnN0IE5PX1BMVUdJTl9JRF9JTklUSUFMSVpFRCA9ICdfX25vLXBsdWdpbi1pZC1pbml0aWFsaXplZF9fJztcblxubGV0IHBsdWdpbklkID0gTk9fUExVR0lOX0lEX0lOSVRJQUxJWkVEO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHBsdWdpbiBJRC5cbiAqXG4gKiBAcmV0dXJucyBUaGUgcGx1Z2luIElELlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGx1Z2luSWQoKTogc3RyaW5nIHtcbiAgcmV0dXJuIHBsdWdpbklkO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHBsdWdpbiBJRC5cbiAqXG4gKiBAcGFyYW0gbmV3UGx1Z2luSWQgLSBUaGUgbmV3IHBsdWdpbiBJRC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFBsdWdpbklkKG5ld1BsdWdpbklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKG5ld1BsdWdpbklkKSB7XG4gICAgcGx1Z2luSWQgPSBuZXdQbHVnaW5JZDtcbiAgfVxufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQ29udGFpbnMgdXRpbGl0eSBmdW5jdGlvbnMgZm9yIHN0cmluZyBvcGVyYXRpb25zLlxuICovXG5cbmltcG9ydCB0eXBlIHsgTWF5YmVSZXR1cm4gfSBmcm9tICcuL3R5cGUudHMnO1xuaW1wb3J0IHR5cGUgeyBWYWx1ZVByb3ZpZGVyIH0gZnJvbSAnLi92YWx1ZS1wcm92aWRlci50cyc7XG5cbmltcG9ydCB7IGFib3J0U2lnbmFsTmV2ZXIgfSBmcm9tICcuL2Fib3J0LWNvbnRyb2xsZXIudHMnO1xuaW1wb3J0IHsgZXNjYXBlUmVnRXhwIH0gZnJvbSAnLi9yZWctZXhwLnRzJztcbmltcG9ydCB7XG4gIGFzc2VydCxcbiAgZW5zdXJlTm9uTnVsbGFibGVcbn0gZnJvbSAnLi90eXBlLWd1YXJkcy50cyc7XG5pbXBvcnQgeyByZXNvbHZlVmFsdWUgfSBmcm9tICcuL3ZhbHVlLXByb3ZpZGVyLnRzJztcblxuLyoqXG4gKiBBIHN5bmNocm9ub3VzL2FzeW5jaHJvbm91cyBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyByZXBsYWNlbWVudCBzdHJpbmdzLCBvciBhIHN0cmluZyB0byByZXBsYWNlIHdpdGguXG4gKi9cbmV4cG9ydCB0eXBlIEFzeW5jUmVwbGFjZXI8UmVwbGFjZUdyb3VwQXJncyBleHRlbmRzIHN0cmluZ1tdPiA9IFZhbHVlUHJvdmlkZXI8U3RyaW5nUmVwbGFjZW1lbnQsIFtSZXBsYWNlQ29tbW9uQXJncywgLi4uUmVwbGFjZUdyb3VwQXJnc10+O1xuXG4vKipcbiAqIENvbW1vbiBhcmd1bWVudHMgZm9yIHRoZSBgcmVwbGFjZUFsbGAvYHJlcGxhY2VBbGxBc3luY2AgZnVuY3Rpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxhY2VDb21tb25BcmdzIHtcbiAgLyoqXG4gICAqIEdyb3VwcyBvZiB0aGUgbWF0Y2guXG4gICAqL1xuICBncm91cHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHVuZGVmaW5lZD4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEluZGljZXMgb2YgdGhlIGdyb3VwcyB0aGF0IHdlcmUgbm90IGZvdW5kIGluIHRoZSBtYXRjaC5cbiAgICovXG4gIG1pc3NpbmdHcm91cEluZGljZXM6IG51bWJlcltdO1xuXG4gIC8qKlxuICAgKiBBbiBvZmZzZXQgb2YgdGhlIG1hdGNoLlxuICAgKi9cbiAgb2Zmc2V0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgc291cmNlIG9mIHRoZSBtYXRjaC5cbiAgICovXG4gIHNvdXJjZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHN1YnN0cmluZyBvZiB0aGUgbWF0Y2guXG4gICAqL1xuICBzdWJzdHJpbmc6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHN5bmNocm9ub3VzIGZ1bmN0aW9uIHRoYXQgZ2VuZXJhdGVzIHJlcGxhY2VtZW50IHN0cmluZ3MsIG9yIGEgc3RyaW5nIHRvIHJlcGxhY2Ugd2l0aC5cbiAqL1xuZXhwb3J0IHR5cGUgUmVwbGFjZXI8UmVwbGFjZUdyb3VwQXJncyBleHRlbmRzIHN0cmluZ1tdPiA9ICgoLi4uYXJnczogW1JlcGxhY2VDb21tb25BcmdzLCAuLi5SZXBsYWNlR3JvdXBBcmdzXSkgPT4gU3RyaW5nUmVwbGFjZW1lbnQpIHwgU3RyaW5nUmVwbGFjZW1lbnQ7XG5cbnR5cGUgU3RyaW5nUmVwbGFjZW1lbnQgPSBNYXliZVJldHVybjxzdHJpbmc+O1xuXG4vKipcbiAqIE1hcHBpbmcgb2Ygc3BlY2lhbCBjaGFyYWN0ZXJzIHRvIHRoZWlyIGVzY2FwZWQgY291bnRlcnBhcnRzLlxuICovXG5jb25zdCBFU0NBUEVfTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnXFxuJzogJ1xcXFxuJyxcbiAgJ1xccic6ICdcXFxccicsXG4gICdcXHQnOiAnXFxcXHQnLFxuICAnXFxiJzogJ1xcXFxiJyxcbiAgJ1xcZic6ICdcXFxcZicsXG4gICdcXCcnOiAnXFxcXFxcJycsXG4gICdcIic6ICdcXFxcXCInLFxuICAnXFxcXCc6ICdcXFxcXFxcXCdcbn0gYXMgY29uc3Q7XG5cbmNvbnN0IENSID0gJ1xccic7XG5jb25zdCBMRiA9ICdcXG4nO1xuY29uc3QgTk9UX0ZPVU5EX0lOREVYID0gLTE7XG5cbi8qKlxuICogTWFwcGluZyBvZiBlc2NhcGVkIHNwZWNpYWwgY2hhcmFjdGVycyB0byB0aGVpciB1bmVzY2FwZWQgY291bnRlcnBhcnRzLlxuICovXG5jb25zdCBVTkVTQ0FQRV9NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbmZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKEVTQ0FQRV9NQVApKSB7XG4gIFVORVNDQVBFX01BUFt2YWx1ZV0gPSBrZXk7XG59XG5cbi8qKlxuICogRW5zdXJlcyB0aGF0IGEgc3RyaW5nIGVuZHMgd2l0aCB0aGUgc3BlY2lmaWVkIHN1ZmZpeCwgYWRkaW5nIGl0IGlmIG5lY2Vzc2FyeS5cbiAqXG4gKiBAcGFyYW0gc3RyIC0gVGhlIHN0cmluZyB0byBjaGVjay5cbiAqIEBwYXJhbSBzdWZmaXggLSBUaGUgc3VmZml4IHRvIGVuc3VyZS5cbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgdGhhdCBlbmRzIHdpdGggdGhlIHN1ZmZpeC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUVuZHNXaXRoKHN0cjogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHIuZW5kc1dpdGgoc3VmZml4KSA/IHN0ciA6IHN0ciArIHN1ZmZpeDtcbn1cblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgYSBzdHJpbmcgaGFzIGBMRmAgbGluZSBlbmRpbmdzLlxuICpcbiAqIEl0IHJlcGxhY2VzIGBDUkxGYCBsaW5lIGVuZGluZ3Mgd2l0aCBgTEZgLlxuICpcbiAqIEBwYXJhbSBzdHIgLSBUaGUgc3RyaW5nLlxuICogQHJldHVybnMgVGhlIHN0cmluZyB3aXRoIGBMRmAgbGluZSBlbmRpbmdzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlTGZFbmRpbmdzKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlQWxsKC9cXHJcXG4/L2csICdcXG4nKTtcbn1cblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgYSBzdHJpbmcgc3RhcnRzIHdpdGggdGhlIHNwZWNpZmllZCBwcmVmaXgsIGFkZGluZyBpdCBpZiBuZWNlc3NhcnkuXG4gKlxuICogQHBhcmFtIHN0ciAtIFRoZSBzdHJpbmcgdG8gY2hlY2suXG4gKiBAcGFyYW0gcHJlZml4IC0gVGhlIHByZWZpeCB0byBlbnN1cmUuXG4gKiBAcmV0dXJucyBUaGUgc3RyaW5nIHRoYXQgc3RhcnRzIHdpdGggdGhlIHByZWZpeC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZVN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcsIHByZWZpeDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5zdGFydHNXaXRoKHByZWZpeCkgPyBzdHIgOiBwcmVmaXggKyBzdHI7XG59XG5cbi8qKlxuICogRXNjYXBlcyBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHN0ciAtIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMgVGhlIGVzY2FwZWQgc3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHJlcGxhY2Uoc3RyLCBFU0NBUEVfTUFQKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBtYXBzIExGLW5vcm1hbGl6ZWQgb2Zmc2V0cyB0byBvcmlnaW5hbCBvZmZzZXRzLlxuICpcbiAqIEBwYXJhbSBzdHIgLSBUaGUgc3RyaW5nIHRvIGdldCB0aGUgTEYtbm9ybWFsaXplZCBpbmRpY2VzIGZyb20uXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgbWFwcyBMRi1ub3JtYWxpemVkIG9mZnNldHMgdG8gb3JpZ2luYWwgb2Zmc2V0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExmTm9ybWFsaXplZE9mZnNldFRvT3JpZ2luYWxPZmZzZXRNYXBwZXIoc3RyOiBzdHJpbmcpOiAobGZPZmZzZXQ6IG51bWJlcikgPT4gbnVtYmVyIHtcbiAgY29uc3QgbGZPZmZzZXRUb09yaWdpbmFsT2Zmc2V0TWFwOiBudW1iZXJbXSA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0cltpXSA9PT0gQ1IgJiYgc3RyW2kgKyAxXSA9PT0gTEYpIHtcbiAgICAgIGxmT2Zmc2V0VG9PcmlnaW5hbE9mZnNldE1hcC5wdXNoKGkgKyAxKTtcbiAgICAgIGkrKztcbiAgICB9IGVsc2Uge1xuICAgICAgbGZPZmZzZXRUb09yaWdpbmFsT2Zmc2V0TWFwLnB1c2goaSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChsZk9mZnNldDogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICBpZiAobGZPZmZzZXQgPCAwKSB7XG4gICAgICByZXR1cm4gbGZPZmZzZXQ7XG4gICAgfVxuICAgIGlmIChsZk9mZnNldCA+PSBsZk9mZnNldFRvT3JpZ2luYWxPZmZzZXRNYXAubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbGZPZmZzZXQgLSBsZk9mZnNldFRvT3JpZ2luYWxPZmZzZXRNYXAubGVuZ3RoICsgc3RyLmxlbmd0aDtcbiAgICB9XG5cbiAgICBhc3NlcnQobGZPZmZzZXRUb09yaWdpbmFsT2Zmc2V0TWFwW2xmT2Zmc2V0XSAhPT0gdW5kZWZpbmVkLCAnQ291bGQgbm90IG1hcCBvZmZzZXQnKTtcbiAgICByZXR1cm4gbGZPZmZzZXRUb09yaWdpbmFsT2Zmc2V0TWFwW2xmT2Zmc2V0XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBzdHJpbmcgaGFzIGEgc2luZ2xlIG9jY3VycmVuY2Ugb2YgYSBzZWFyY2ggdmFsdWUuXG4gKlxuICogQHBhcmFtIHN0ciAtIFRoZSBzdHJpbmcgdG8gY2hlY2suXG4gKiBAcGFyYW0gc2VhcmNoVmFsdWUgLSBUaGUgc2VhcmNoIHZhbHVlIHRvIGNoZWNrIGZvci5cbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgc3RyaW5nIGhhcyBhIHNpbmdsZSBvY2N1cnJlbmNlIG9mIHRoZSBzZWFyY2ggdmFsdWUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzU2luZ2xlT2NjdXJyZW5jZShzdHI6IHN0cmluZywgc2VhcmNoVmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBmaXJzdEluZGV4ID0gc3RyLmluZGV4T2Yoc2VhcmNoVmFsdWUpO1xuICBjb25zdCBsYXN0SW5kZXggPSBzdHIubGFzdEluZGV4T2Yoc2VhcmNoVmFsdWUpO1xuICByZXR1cm4gZmlyc3RJbmRleCAhPT0gTk9UX0ZPVU5EX0lOREVYICYmIGZpcnN0SW5kZXggPT09IGxhc3RJbmRleDtcbn1cblxuLyoqXG4gKiBJbmRlbnRzIGEgc3RyaW5nIGJ5IGFkZGluZyBhIHByZWZpeCB0byBlYWNoIGxpbmUuXG4gKlxuICogQHBhcmFtIHRleHQgLSBUaGUgc3RyaW5nIHRvIGluZGVudC5cbiAqIEBwYXJhbSBwcmVmaXggLSBUaGUgcHJlZml4IHRvIGFkZCB0byBlYWNoIGxpbmUuXG4gKiBAcmV0dXJucyBUaGUgaW5kZW50ZWQgc3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5kZW50KHRleHQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdGV4dC5zcGxpdCgnXFxuJykubWFwKChsaW5lKSA9PiBgJHtwcmVmaXh9JHtsaW5lfWApLmpvaW4oJ1xcbicpO1xufVxuXG4vKipcbiAqIEluc2VydHMgYSBzdWJzdHJpbmcgYXQgYSBzcGVjaWZpZWQgcG9zaXRpb24gaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHN0ciAtIFRoZSBzdHJpbmcgdG8gaW5zZXJ0IHRoZSBzdWJzdHJpbmcgaW50by5cbiAqIEBwYXJhbSBzdWJzdHJpbmcgLSBUaGUgc3Vic3RyaW5nIHRvIGluc2VydC5cbiAqIEBwYXJhbSBzdGFydEluZGV4IC0gVGhlIGluZGV4IHRvIGluc2VydCB0aGUgc3Vic3RyaW5nIGF0LlxuICogQHBhcmFtIGVuZEluZGV4IC0gVGhlIGluZGV4IHRvIGVuZCB0aGUgc3Vic3RyaW5nIGF0LlxuICogQHJldHVybnMgVGhlIG1vZGlmaWVkIHN0cmluZyB3aXRoIHRoZSBzdWJzdHJpbmcgaW5zZXJ0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRBdChzdHI6IHN0cmluZywgc3Vic3RyaW5nOiBzdHJpbmcsIHN0YXJ0SW5kZXg6IG51bWJlciwgZW5kSW5kZXg/OiBudW1iZXIpOiBzdHJpbmcge1xuICBlbmRJbmRleCA/Pz0gc3RhcnRJbmRleDtcbiAgcmV0dXJuIHN0ci5zbGljZSgwLCBzdGFydEluZGV4KSArIHN1YnN0cmluZyArIHN0ci5zbGljZShlbmRJbmRleCk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBzdHJpbmcgaW50byBhIHZhbGlkIEphdmFTY3JpcHQgdmFyaWFibGUgbmFtZSBieSByZXBsYWNpbmcgaW52YWxpZCBjaGFyYWN0ZXJzIHdpdGggdW5kZXJzY29yZXMuXG4gKlxuICogQHBhcmFtIHN0ciAtIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIFRoZSB2YWxpZCB2YXJpYWJsZSBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZVZhbGlkVmFyaWFibGVOYW1lKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHJlcGxhY2VBbGwoc3RyLCAvW15hLXpBLVowLTlfXS9nLCAnXycpO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYSBzdHJpbmcgYnkgY29udmVydGluZyBpdCB0byB0aGUgTkZDIGZvcm0gYW5kIHJlcGxhY2luZyBub24tYnJlYWtpbmcgc3BhY2VzIHdpdGggcmVndWxhciBzcGFjZXMuXG4gKlxuICogQHBhcmFtIHN0ciAtIFRoZSBzdHJpbmcgdG8gbm9ybWFsaXplLlxuICogQHJldHVybnMgVGhlIG5vcm1hbGl6ZWQgc3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHJlcGxhY2VBbGwoc3RyLCAvXFx1MDBBMHxcXHUyMDJGL2csICcgJykubm9ybWFsaXplKCdORkMnKTtcbn1cblxuLyoqXG4gKiBSZXBsYWNlcyBvY2N1cnJlbmNlcyBvZiBzdHJpbmdzIGluIGEgZ2l2ZW4gc3RyaW5nIGJhc2VkIG9uIGEgcmVwbGFjZW1lbnRzIG1hcC5cbiAqXG4gKiBAcGFyYW0gc3RyIC0gVGhlIHN0cmluZyB0byBwZXJmb3JtIHJlcGxhY2VtZW50cyBvbi5cbiAqIEBwYXJhbSByZXBsYWNlbWVudHNNYXAgLSBBbiBvYmplY3QgbWFwcGluZyBzdHJpbmdzIHRvIHRoZWlyIHJlcGxhY2VtZW50IHZhbHVlcy5cbiAqIEByZXR1cm5zIFRoZSBtb2RpZmllZCBzdHJpbmcgd2l0aCByZXBsYWNlbWVudHMgYXBwbGllZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2Uoc3RyOiBzdHJpbmcsIHJlcGxhY2VtZW50c01hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHN0cmluZyB7XG4gIGNvbnN0IHJlZ0V4cCA9IG5ldyBSZWdFeHAoT2JqZWN0LmtleXMocmVwbGFjZW1lbnRzTWFwKS5tYXAoKHNvdXJjZSkgPT4gZXNjYXBlUmVnRXhwKHNvdXJjZSkpLmpvaW4oJ3wnKSwgJ2cnKTtcbiAgcmV0dXJuIHJlcGxhY2VBbGwoc3RyLCByZWdFeHAsICh7IHN1YnN0cmluZzogc291cmNlIH0pID0+IGVuc3VyZU5vbk51bGxhYmxlKHJlcGxhY2VtZW50c01hcFtzb3VyY2VdKSk7XG59XG5cbi8qKlxuICogUmVwbGFjZXMgYWxsIG9jY3VycmVuY2VzIG9mIGEgc2VhcmNoIHN0cmluZyBvciBwYXR0ZXJuIHdpdGggdGhlIHJlc3VsdHMgb2YgYW4gcmVwbGFjZXIgZnVuY3Rpb24uXG4gKlxuICogQHR5cGVQYXJhbSBSZXBsYWNlR3JvdXBBcmdzIC0gVGhlIHR5cGUgb2YgYWRkaXRpb25hbCBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSByZXBsYWNlciBmdW5jdGlvbi5cbiAqIEBwYXJhbSBzdHIgLSBUaGUgc3RyaW5nIGluIHdoaWNoIHRvIHBlcmZvcm0gcmVwbGFjZW1lbnRzLlxuICogQHBhcmFtIHNlYXJjaFZhbHVlIC0gVGhlIHN0cmluZyBvciByZWd1bGFyIGV4cHJlc3Npb24gdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSByZXBsYWNlciAtIEEgcmVwbGFjZXIgZnVuY3Rpb24gdGhhdCBnZW5lcmF0ZXMgcmVwbGFjZW1lbnQgc3RyaW5ncywgb3IgYSBzdHJpbmcgdG8gcmVwbGFjZSB3aXRoLlxuICogQHJldHVybnMgVGhlIHN0cmluZyB3aXRoIGFsbCByZXBsYWNlbWVudHMgbWFkZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VBbGw8UmVwbGFjZUdyb3VwQXJncyBleHRlbmRzIHN0cmluZ1tdPihcbiAgc3RyOiBzdHJpbmcsXG4gIHNlYXJjaFZhbHVlOiBSZWdFeHAgfCBzdHJpbmcsXG4gIHJlcGxhY2VyOiBSZXBsYWNlcjxSZXBsYWNlR3JvdXBBcmdzPlxuKTogc3RyaW5nIHtcbiAgaWYgKHR5cGVvZiByZXBsYWNlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgaWYgKHNlYXJjaFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwICYmICFzZWFyY2hWYWx1ZS5nbG9iYWwpIHtcbiAgICBzZWFyY2hWYWx1ZSA9IG5ldyBSZWdFeHAoc2VhcmNoVmFsdWUuc291cmNlLCBgJHtzZWFyY2hWYWx1ZS5mbGFnc31nYCk7XG4gIH1cblxuICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzdHIucmVwbGFjZUFsbChzZWFyY2hWYWx1ZSwgcmVwbGFjZXIpO1xuICB9XG5cbiAgcmV0dXJuIHN0ci5yZXBsYWNlQWxsKHNlYXJjaFZhbHVlLCAoc3Vic3RyaW5nOiBzdHJpbmcsIC4uLmFyZ3M6IHVua25vd25bXSkgPT4ge1xuICAgIGNvbnN0IFNPVVJDRV9JTkRFWF9PRkZTRVRfRk9SX0dST1VQX0FSRyA9IDI7XG4gICAgY29uc3QgaGFzR3JvdXBzQXJnID0gdHlwZW9mIGFyZ3MuYXQoLTEpID09PSAnb2JqZWN0JztcbiAgICBjb25zdCBzb3VyY2VJbmRleCA9IGhhc0dyb3Vwc0FyZyA/IGFyZ3MubGVuZ3RoIC0gU09VUkNFX0lOREVYX09GRlNFVF9GT1JfR1JPVVBfQVJHIDogYXJncy5sZW5ndGggLSAxO1xuXG4gICAgY29uc3QgY29tbW9uQXJnczogUmVwbGFjZUNvbW1vbkFyZ3MgPSB7XG4gICAgICBncm91cHM6IGhhc0dyb3Vwc0FyZyA/IGFyZ3MuYXQoLTEpIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHVuZGVmaW5lZD4gOiB1bmRlZmluZWQsXG4gICAgICBtaXNzaW5nR3JvdXBJbmRpY2VzOiBbXSxcbiAgICAgIG9mZnNldDogYXJncy5hdChzb3VyY2VJbmRleCAtIDEpIGFzIG51bWJlcixcbiAgICAgIHNvdXJjZTogYXJncy5hdChzb3VyY2VJbmRleCkgYXMgc3RyaW5nLFxuICAgICAgc3Vic3RyaW5nXG4gICAgfTtcblxuICAgIGNvbnN0IGdyb3VwQXJncyA9IGFyZ3Muc2xpY2UoMCwgc291cmNlSW5kZXggLSAxKS5tYXAoKGFyZywgaW5kZXgpOiBzdHJpbmcgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBhcmc7XG4gICAgICB9XG5cbiAgICAgIC8qIHY4IGlnbm9yZSBzdGFydCAtLSBJdCBpbmNvcnJlY3RseSByZXBvcnRzIHRoaXMgYXMgdW5jb3ZlcmVkLCBidXQgaXQgaXMgY292ZXJlZCBieSBgc2hvdWxkIHBvcHVsYXRlIG1pc3NpbmdHcm91cEluZGljZXMgZm9yIHVuZGVmaW5lZCBjYXB0dXJlIGdyb3Vwc2AgdGVzdC4gKi9cbiAgICAgIGlmICh0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvKiB2OCBpZ25vcmUgc3RvcCAqL1xuICAgICAgICBjb21tb25BcmdzLm1pc3NpbmdHcm91cEluZGljZXMucHVzaChpbmRleCk7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgLyogdjggaWdub3JlIHN0YXJ0IC0tIE5ldmVyIGhhcHBlbnMuICovXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgYXJndW1lbnQgdHlwZTogJHt0eXBlb2YgYXJnfWApO1xuICAgICAgLyogdjggaWdub3JlIHN0b3AgKi9cbiAgICB9KSBhcyBSZXBsYWNlR3JvdXBBcmdzO1xuXG4gICAgcmV0dXJuIChyZXBsYWNlcihjb21tb25BcmdzLCAuLi5ncm91cEFyZ3MpIGFzIHN0cmluZyB8IHVuZGVmaW5lZCkgPz8gY29tbW9uQXJncy5zdWJzdHJpbmc7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFzeW5jaHJvbm91c2x5IHJlcGxhY2VzIGFsbCBvY2N1cnJlbmNlcyBvZiBhIHNlYXJjaCBzdHJpbmcgb3IgcGF0dGVybiB3aXRoIHRoZSByZXN1bHRzIG9mIGFuIGFzeW5jaHJvbm91cyByZXBsYWNlciBmdW5jdGlvbi5cbiAqXG4gKiBAdHlwZVBhcmFtIFJlcGxhY2VHcm91cEFyZ3MgLSBUaGUgdHlwZSBvZiBhZGRpdGlvbmFsIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIHJlcGxhY2VyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHN0ciAtIFRoZSBzdHJpbmcgaW4gd2hpY2ggdG8gcGVyZm9ybSByZXBsYWNlbWVudHMuXG4gKiBAcGFyYW0gc2VhcmNoVmFsdWUgLSBUaGUgc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHJlcGxhY2VyIC0gQSBzeW5jaHJvbm91cy9hc3luY2hyb25vdXMgZnVuY3Rpb24gdGhhdCBnZW5lcmF0ZXMgcmVwbGFjZW1lbnQgc3RyaW5ncywgb3IgYSBzdHJpbmcgdG8gcmVwbGFjZSB3aXRoLlxuICogQHBhcmFtIGFib3J0U2lnbmFsIC0gVGhlIGFib3J0IHNpZ25hbCB0byBjb250cm9sIHRoZSBleGVjdXRpb24gb2YgdGhlIGZ1bmN0aW9uLlxuICogQHJldHVybnMgQSB7QGxpbmsgUHJvbWlzZX0gdGhhdCByZXNvbHZlcyB0byB0aGUgc3RyaW5nIHdpdGggYWxsIHJlcGxhY2VtZW50cyBtYWRlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVwbGFjZUFsbEFzeW5jPFJlcGxhY2VHcm91cEFyZ3MgZXh0ZW5kcyBzdHJpbmdbXT4oXG4gIHN0cjogc3RyaW5nLFxuICBzZWFyY2hWYWx1ZTogUmVnRXhwIHwgc3RyaW5nLFxuICByZXBsYWNlcjogQXN5bmNSZXBsYWNlcjxSZXBsYWNlR3JvdXBBcmdzPixcbiAgYWJvcnRTaWduYWw/OiBBYm9ydFNpZ25hbFxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgYWJvcnRTaWduYWwgPz89IGFib3J0U2lnbmFsTmV2ZXIoKTtcbiAgYWJvcnRTaWduYWwudGhyb3dJZkFib3J0ZWQoKTtcbiAgaWYgKHR5cGVvZiByZXBsYWNlciA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcmVwbGFjZUFsbChzdHIsIHNlYXJjaFZhbHVlLCByZXBsYWNlcik7XG4gIH1cblxuICBjb25zdCByZXBsYWNlbWVudEFzeW5jRm5zOiAoKCkgPT4gUHJvbWlzZTxTdHJpbmdSZXBsYWNlbWVudD4pW10gPSBbXTtcblxuICByZXBsYWNlQWxsPFJlcGxhY2VHcm91cEFyZ3M+KHN0ciwgc2VhcmNoVmFsdWUsIChjb21tb25BcmdzLCAuLi5ncm91cEFyZ3MpID0+IHtcbiAgICByZXBsYWNlbWVudEFzeW5jRm5zLnB1c2goKCkgPT4gcmVzb2x2ZVZhbHVlKHJlcGxhY2VyLCBhYm9ydFNpZ25hbCwgY29tbW9uQXJncywgLi4uZ3JvdXBBcmdzKSk7XG4gICAgcmV0dXJuICcnO1xuICB9KTtcblxuICBjb25zdCByZXBsYWNlbWVudHM6IFN0cmluZ1JlcGxhY2VtZW50W10gPSBbXTtcblxuICBmb3IgKGNvbnN0IGFzeW5jRm4gb2YgcmVwbGFjZW1lbnRBc3luY0Zucykge1xuICAgIGFib3J0U2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG4gICAgcmVwbGFjZW1lbnRzLnB1c2goYXdhaXQgYXN5bmNGbigpKTtcbiAgfVxuXG4gIGFib3J0U2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG4gIHJldHVybiByZXBsYWNlQWxsKHN0ciwgc2VhcmNoVmFsdWUsIChhcmdzKTogc3RyaW5nID0+IHJlcGxhY2VtZW50cy5zaGlmdCgpID8/IGFyZ3Muc3Vic3RyaW5nKTtcbn1cblxuLyoqXG4gKiBUcmltcyB0aGUgc3BlY2lmaWVkIHN1ZmZpeCBmcm9tIHRoZSBlbmQgb2YgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHN0ciAtIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAqIEBwYXJhbSBzdWZmaXggLSBUaGUgc3VmZml4IHRvIHJlbW92ZSBmcm9tIHRoZSBlbmQgb2YgdGhlIHN0cmluZy5cbiAqIEBwYXJhbSBzaG91bGRWYWxpZGF0ZSAtIElmIGB0cnVlYCwgdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBzdHJpbmcgZG9lcyBub3QgZW5kIHdpdGggdGhlIHN1ZmZpeC5cbiAqIEByZXR1cm5zIFRoZSB0cmltbWVkIHN0cmluZy5cbiAqIEB0aHJvd3MgSWYgYHZhbGlkYXRlYCBpcyBgdHJ1ZWAgYW5kIHRoZSBzdHJpbmcgZG9lcyBub3QgZW5kIHdpdGggdGhlIHN1ZmZpeC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyaW1FbmQoc3RyOiBzdHJpbmcsIHN1ZmZpeDogc3RyaW5nLCBzaG91bGRWYWxpZGF0ZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICBpZiAoc3RyLmVuZHNXaXRoKHN1ZmZpeCkpIHtcbiAgICByZXR1cm4gc3RyLnNsaWNlKDAsIC1zdWZmaXgubGVuZ3RoKTtcbiAgfVxuXG4gIGlmIChzaG91bGRWYWxpZGF0ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgU3RyaW5nICR7c3RyfSBkb2VzIG5vdCBlbmQgd2l0aCBzdWZmaXggJHtzdWZmaXh9YCk7XG4gIH1cblxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIFRyaW1zIHRoZSBzcGVjaWZpZWQgcHJlZml4IGZyb20gdGhlIHN0YXJ0IG9mIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSBzdHIgLSBUaGUgc3RyaW5nIHRvIHRyaW0uXG4gKiBAcGFyYW0gcHJlZml4IC0gVGhlIHByZWZpeCB0byByZW1vdmUgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIHN0cmluZy5cbiAqIEBwYXJhbSB2YWxpZGF0ZSAtIElmIGB0cnVlYCwgdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBzdHJpbmcgZG9lcyBub3Qgc3RhcnQgd2l0aCB0aGUgcHJlZml4LlxuICogQHJldHVybnMgVGhlIHRyaW1tZWQgc3RyaW5nLlxuICogQHRocm93cyBJZiBgdmFsaWRhdGVgIGlzIGB0cnVlYCBhbmQgdGhlIHN0cmluZyBkb2VzIG5vdCBzdGFydCB3aXRoIHRoZSBwcmVmaXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmltU3RhcnQoc3RyOiBzdHJpbmcsIHByZWZpeDogc3RyaW5nLCB2YWxpZGF0ZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICBpZiAoc3RyLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuICAgIHJldHVybiBzdHIuc2xpY2UocHJlZml4Lmxlbmd0aCk7XG4gIH1cblxuICBpZiAodmFsaWRhdGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFN0cmluZyAke3N0cn0gZG9lcyBub3Qgc3RhcnQgd2l0aCBwcmVmaXggJHtwcmVmaXh9YCk7XG4gIH1cblxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIFVuZXNjYXBlcyBhIHN0cmluZyBieSByZXBsYWNpbmcgZXNjYXBlIHNlcXVlbmNlcyB3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2hhcmFjdGVycy5cbiAqXG4gKiBAcGFyYW0gc3RyIC0gVGhlIHN0cmluZyB0byB1bmVzY2FwZS5cbiAqIEByZXR1cm5zIFRoZSB1bmVzY2FwZWQgc3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcmVwbGFjZShzdHIsIFVORVNDQVBFX01BUCk7XG59XG5cbi8qKlxuICogVW5pbmRlbnRzIGEgc3RyaW5nIGJ5IHJlbW92aW5nIGEgcHJlZml4IGZyb20gZWFjaCBsaW5lLlxuICpcbiAqIEBwYXJhbSB0ZXh0IC0gVGhlIHN0cmluZyB0byB1bmluZGVudC5cbiAqIEBwYXJhbSBwcmVmaXggLSBUaGUgcHJlZml4IHRvIHJlbW92ZSBmcm9tIGVhY2ggbGluZS5cbiAqIEBwYXJhbSBzaG91bGRUaHJvd0lmTm90SW5kZW50ZWQgLSBJZiBgdHJ1ZWAsIHRocm93cyBhbiBlcnJvciBpZiBhIGxpbmUgaXMgbm90IGluZGVudGVkIHdpdGggdGhlIHByZWZpeC5cbiAqIEByZXR1cm5zIFRoZSB1bmluZGVudGVkIHN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaW5kZW50KHRleHQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcsIHNob3VsZFRocm93SWZOb3RJbmRlbnRlZCA9IGZhbHNlKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRleHQuc3BsaXQoJ1xcbicpLm1hcCgobGluZSkgPT4ge1xuICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgocHJlZml4KSkge1xuICAgICAgcmV0dXJuIGxpbmUuc2xpY2UocHJlZml4Lmxlbmd0aCk7XG4gICAgfVxuICAgIGlmIChzaG91bGRUaHJvd0lmTm90SW5kZW50ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTGluZSBcIiR7bGluZX1cIiBpcyBub3QgaW5kZW50ZWQgd2l0aCBcIiR7cHJlZml4fVwiYCk7XG4gICAgfVxuICAgIHJldHVybiBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcbn1cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIENvbnRhaW5zIHV0aWxpdHkgZnVuY3Rpb25zIGZvciBPYmplY3RzLlxuICovXG5cbmltcG9ydCB0eXBlIHtcbiAgQ29uc3RydWN0b3IsXG4gIFJlcXVpcmVkS2V5c09mLFxuICBVbmRlZmluZWRPblBhcnRpYWxEZWVwXG59IGZyb20gJ3R5cGUtZmVzdCc7XG5cbmltcG9ydCB0eXBlIHsgR2VuZXJpY09iamVjdCB9IGZyb20gJy4vdHlwZS1ndWFyZHMudHMnO1xuaW1wb3J0IHR5cGUge1xuICBFeGFjdE1lbWJlcnMsXG4gIE1heWJlUmV0dXJuLFxuICBTdHJpbmdLZXlzXG59IGZyb20gJy4vdHlwZS50cyc7XG5cbmltcG9ydCB7IGVycm9yVG9TdHJpbmcgfSBmcm9tICcuL2Vycm9yLnRzJztcbmltcG9ydCB7IGdldEZ1bmN0aW9uRXhwcmVzc2lvblN0cmluZyB9IGZyb20gJy4vZnVuY3Rpb24udHMnO1xuaW1wb3J0IHsgcmVwbGFjZUFsbCB9IGZyb20gJy4vc3RyaW5nLnRzJztcbmltcG9ydCB7XG4gIGFzc2VydCxcbiAgZW5zdXJlR2VuZXJpY09iamVjdCxcbiAgZW5zdXJlTm9uTnVsbGFibGVcbn0gZnJvbSAnLi90eXBlLWd1YXJkcy50cyc7XG5cbi8qKlxuICogU3BlY2lmaWVzIGhvdyBmdW5jdGlvbnMgc2hvdWxkIGJlIGhhbmRsZWQgaW4gdGhlIEpTT04gb3V0cHV0LlxuICovXG5leHBvcnQgZW51bSBGdW5jdGlvbkhhbmRsaW5nTW9kZSB7XG4gIC8qKlxuICAgKiBFeGNsdWRlcyBmdW5jdGlvbnMgZnJvbSB0aGUgSlNPTiBvdXRwdXQuXG4gICAqL1xuICBFeGNsdWRlID0gJ2V4Y2x1ZGUnLFxuICAvKipcbiAgICogSW5jbHVkZXMgdGhlIGZ1bGwgZnVuY3Rpb24gZGVmaW5pdGlvbiBpbiB0aGUgSlNPTiBvdXRwdXQuXG4gICAqL1xuICBGdWxsID0gJ2Z1bGwnLFxuICAvKipcbiAgICogSW5jbHVkZXMgb25seSB0aGUgZnVuY3Rpb24gbmFtZSBpbiB0aGUgSlNPTiBvdXRwdXQuXG4gICAqL1xuICBOYW1lT25seSA9ICduYW1lT25seSdcbn1cblxuZW51bSBUb2tlblN1YnN0aXR1dGlvbktleSB7XG4gIENpcmN1bGFyUmVmZXJlbmNlID0gJ0NpcmN1bGFyUmVmZXJlbmNlJyxcbiAgRnVuY3Rpb24gPSAnRnVuY3Rpb24nLFxuICBNYXhEZXB0aExpbWl0UmVhY2hlZCA9ICdNYXhEZXB0aExpbWl0UmVhY2hlZCcsXG4gIE1heERlcHRoTGltaXRSZWFjaGVkQXJyYXkgPSAnTWF4RGVwdGhMaW1pdFJlYWNoZWRBcnJheScsXG4gIFRvSlNPTkZhaWxlZCA9ICdUb0pTT05GYWlsZWQnLFxuICBVbmRlZmluZWQgPSAnVW5kZWZpbmVkJ1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHtAbGluayB0b0pzb259LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRvSnNvbk9wdGlvbnMge1xuICAvKipcbiAgICogU3BlY2lmaWVzIGhvdyBmdW5jdGlvbnMgc2hvdWxkIGJlIGhhbmRsZWQgaW4gdGhlIEpTT04gb3V0cHV0IChkZWZhdWx0OiBgZXhjbHVkZWApLlxuICAgKi9cbiAgcmVhZG9ubHkgZnVuY3Rpb25IYW5kbGluZ01vZGU6IEZ1bmN0aW9uSGFuZGxpbmdNb2RlO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIG1heGltdW0gZGVwdGggb2YgbmVzdGVkIG9iamVjdHMgdG8gaW5jbHVkZSBpbiB0aGUgSlNPTiBvdXRwdXQuXG4gICAqIFVzZSBgLTFgIGZvciBubyBsaW1pdC5cbiAgICogRGVmYXVsdHMgdG8gYC0xYC5cbiAgICovXG4gIHJlYWRvbmx5IG1heERlcHRoOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRvIGNhdGNoIGVycm9ycyBpbiBgdG9KU09OKClgIGFuZCByZXBsYWNlIHRoZW0gd2l0aCBhIHBsYWNlaG9sZGVyLlxuICAgKiBEZWZhdWx0cyB0byBgZmFsc2VgLlxuICAgKi9cbiAgcmVhZG9ubHkgc2hvdWxkQ2F0Y2hUb0pTT05FcnJvcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRvIGhhbmRsZSBjaXJjdWxhciByZWZlcmVuY2VzIGluIHRoZSBKU09OIG91dHB1dC5cbiAgICogRGVmYXVsdHMgdG8gYGZhbHNlYC5cbiAgICovXG4gIHJlYWRvbmx5IHNob3VsZEhhbmRsZUNpcmN1bGFyUmVmZXJlbmNlczogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdG8gaGFuZGxlIGVycm9ycyBpbiB0aGUgSlNPTiBvdXRwdXQuXG4gICAqIERlZmF1bHRzIHRvIGBmYWxzZWAuXG4gICAqL1xuICByZWFkb25seSBzaG91bGRIYW5kbGVFcnJvcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRvIGhhbmRsZSBgdW5kZWZpbmVkYCB2YWx1ZXMgaW4gdGhlIEpTT04gb3V0cHV0LlxuICAgKiBEZWZhdWx0cyB0byBgZmFsc2VgLlxuICAgKi9cbiAgcmVhZG9ubHkgc2hvdWxkSGFuZGxlVW5kZWZpbmVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0byBzb3J0IHRoZSBrZXlzIG9mIHRoZSBKU09OIG91dHB1dC5cbiAgICogRGVmYXVsdHMgdG8gYGZhbHNlYC5cbiAgICovXG4gIHJlYWRvbmx5IHNob3VsZFNvcnRLZXlzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIGluZGVudGF0aW9uIG9mIHRoZSBKU09OIG91dHB1dC4gVGhpcyBjYW4gYmUgYSBudW1iZXIgb2Ygc3BhY2VzIG9yIGEgc3RyaW5nLiBEZWZhdWx0cyB0byBgMmAuXG4gICAqL1xuICByZWFkb25seSBzcGFjZTogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIHN1YnN0aXR1dGlvbnMgdG8gdXNlIGluIHRoZSBKU09OIG91dHB1dC5cbiAgICovXG4gIHJlYWRvbmx5IHRva2VuU3Vic3RpdHV0aW9uczogUGFydGlhbDxUb2tlblN1YnN0aXR1dGlvbnM+O1xufVxuXG5pbnRlcmZhY2UgQXBwbHlTdWJzdGl0dXRpb25zUGFyYW1zIHtcbiAgcmVhZG9ubHkgZnVuY3Rpb25UZXh0czogcmVhZG9ubHkgc3RyaW5nW107XG4gIHJlYWRvbmx5IGluZGV4OiBudW1iZXI7XG4gIHJlYWRvbmx5IGtleTogVG9rZW5TdWJzdGl0dXRpb25LZXk7XG4gIHJlYWRvbmx5IHN1YnN0aXR1dGlvbnM6IFRva2VuU3Vic3RpdHV0aW9ucztcbn1cblxuaW50ZXJmYWNlIEVxdWFsaXR5Q29tcGFyZXJFbnRyeTxUPiB7XG4gIGNvbnN0cnVjdG9yOiBDb25zdHJ1Y3RvcjxUPjtcbiAgZXF1YWxpdHlDb21wYXJlcihhOiBULCBiOiBUKTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEpTT05TZXJpYWxpemFibGUge1xuICB0b0pTT04oLi4uYXJnczogdW5rbm93bltdKTogdW5rbm93bjtcbn1cblxuaW50ZXJmYWNlIE1vZHVsZVdpdGhEZWZhdWx0RXhwb3J0PFQ+IHtcbiAgZGVmYXVsdDogVDtcbn1cblxuaW50ZXJmYWNlIFJlc29sdmVkVG9Kc29uT3B0aW9ucyBleHRlbmRzIFRvSnNvbk9wdGlvbnMge1xuICByZWFkb25seSB0b2tlblN1YnN0aXR1dGlvbnM6IFRva2VuU3Vic3RpdHV0aW9ucztcbn1cblxuaW50ZXJmYWNlIFRva2VuU3Vic3RpdHV0aW9ucyB7XG4gIGNpcmN1bGFyUmVmZXJlbmNlOiBzdHJpbmc7XG4gIG1heERlcHRoTGltaXRSZWFjaGVkOiBzdHJpbmc7XG4gIHRvSlNPTkZhaWxlZDogc3RyaW5nO1xufVxuXG5jb25zdCBLRVlfU0VQQVJBVE9SID0gJy4nO1xuY29uc3QgZXF1YWxpdHlDb21wYXJlckVudHJpZXMgPSBjcmVhdGVFcXVhbGl0eUNvbXBhcmVyRW50cmllcyhcbiAgW1xuICAgIHsgY29uc3RydWN0b3I6IEFycmF5QnVmZmVyLCBlcXVhbGl0eUNvbXBhcmVyOiBkZWVwRXF1YWxBcnJheUJ1ZmZlciB9LFxuICAgIHsgY29uc3RydWN0b3I6IERhdGUsIGVxdWFsaXR5Q29tcGFyZXI6IGRlZXBFcXVhbERhdGUgfSxcbiAgICB7IGNvbnN0cnVjdG9yOiBSZWdFeHAsIGVxdWFsaXR5Q29tcGFyZXI6IGRlZXBFcXVhbFJlZ0V4cCB9LFxuICAgIHsgY29uc3RydWN0b3I6IE1hcCwgZXF1YWxpdHlDb21wYXJlcjogZGVlcEVxdWFsTWFwIH0sXG4gICAgeyBjb25zdHJ1Y3RvcjogU2V0LCBlcXVhbGl0eUNvbXBhcmVyOiBkZWVwRXF1YWxTZXQgfVxuICBdIGFzIGNvbnN0XG4pO1xuXG50eXBlIEtleXNXaXRoVW5kZWZpbmVkPFQ+ID0ge1xuICBbSyBpbiBrZXlvZiBUXS0/OiB1bmRlZmluZWQgZXh0ZW5kcyBUW0tdID8gSyA6IG5ldmVyO1xufVtrZXlvZiBUXTtcblxudHlwZSBNYW5kYXRvcnlLZXlzV2l0aFVuZGVmaW5lZDxUIGV4dGVuZHMgb2JqZWN0PiA9IEV4dHJhY3Q8UmVxdWlyZWRLZXlzT2Y8VD4gJiBTdHJpbmdLZXlzPFQ+LCBLZXlzV2l0aFVuZGVmaW5lZDxUPj47XG5cbnR5cGUgUmVtb3ZlVW5kZWZpbmVkT3ZlcmxvYWQ8VCBleHRlbmRzIG9iamVjdD4gPSBNYW5kYXRvcnlLZXlzV2l0aFVuZGVmaW5lZDxUPiBleHRlbmRzIG5ldmVyID8gW29iajogVF1cbiAgOiBuZXZlcjtcblxudHlwZSBSZW1vdmVVbmRlZmluZWRXaXRoS2V5c092ZXJsb2FkPFQgZXh0ZW5kcyBvYmplY3QsIEsgZXh0ZW5kcyByZWFkb25seSBzdHJpbmdbXT4gPSBbb2JqOiBULCBrZXlzVG9LZWVwOiBFeGFjdE1lbWJlcnM8TWFuZGF0b3J5S2V5c1dpdGhVbmRlZmluZWQ8VD4sIEs+XTtcblxuLyoqXG4gKiBBc3NpZ25zIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhIHRhcmdldCBvYmplY3QsIGluY2x1ZGluZyBub24tZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgdGFyZ2V0IG9iamVjdCB0byBhc3NpZ24gcHJvcGVydGllcyB0by5cbiAqIEBwYXJhbSBzb3VyY2UgLSBUaGUgc291cmNlIG9iamVjdCB0byBhc3NpZ24gcHJvcGVydGllcyBmcm9tLlxuICogQHJldHVybnMgVGhlIHRhcmdldCBvYmplY3Qgd2l0aCB0aGUgYXNzaWduZWQgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbldpdGhOb25FbnVtZXJhYmxlUHJvcGVydGllczxUIGV4dGVuZHMgb2JqZWN0LCBVPih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuLyoqXG4gKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIHRhcmdldCBvYmplY3QgdG8gYXNzaWduIHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0gc291cmNlMSAtIFRoZSBmaXJzdCBzb3VyY2Ugb2JqZWN0IHRvIGFzc2lnbiBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0gc291cmNlMiAtIFRoZSBzZWNvbmQgc291cmNlIG9iamVjdCB0byBhc3NpZ24gcHJvcGVydGllcyBmcm9tLlxuICogQHJldHVybnMgVGhlIHRhcmdldCBvYmplY3Qgd2l0aCB0aGUgYXNzaWduZWQgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbldpdGhOb25FbnVtZXJhYmxlUHJvcGVydGllczxUIGV4dGVuZHMgb2JqZWN0LCBVLCBWPih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYpOiBUICYgVSAmIFY7XG4vKipcbiAqIEFzc2lnbnMgcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIGEgdGFyZ2V0IG9iamVjdCwgaW5jbHVkaW5nIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHRhcmdldCAtIFRoZSB0YXJnZXQgb2JqZWN0IHRvIGFzc2lnbiBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHNvdXJjZTEgLSBUaGUgZmlyc3Qgc291cmNlIG9iamVjdCB0byBhc3NpZ24gcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHNvdXJjZTIgLSBUaGUgc2Vjb25kIHNvdXJjZSBvYmplY3QgdG8gYXNzaWduIHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSBzb3VyY2UzIC0gVGhlIHRoaXJkIHNvdXJjZSBvYmplY3QgdG8gYXNzaWduIHByb3BlcnRpZXMgZnJvbS5cbiAqIEByZXR1cm5zIFRoZSB0YXJnZXQgb2JqZWN0IHdpdGggdGhlIGFzc2lnbmVkIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25XaXRoTm9uRW51bWVyYWJsZVByb3BlcnRpZXM8VCBleHRlbmRzIG9iamVjdCwgVSwgViwgVz4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXKTogVCAmIFUgJiBWICYgVztcbi8qKlxuICogQXNzaWducyBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYSB0YXJnZXQgb2JqZWN0LCBpbmNsdWRpbmcgbm9uLWVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIHRhcmdldCBvYmplY3QgdG8gYXNzaWduIHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0gc291cmNlcyAtIFRoZSBzb3VyY2Ugb2JqZWN0cyB0byBhc3NpZ24gcHJvcGVydGllcyBmcm9tLlxuICogQHJldHVybnMgVGhlIHRhcmdldCBvYmplY3Qgd2l0aCB0aGUgYXNzaWduZWQgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbldpdGhOb25FbnVtZXJhYmxlUHJvcGVydGllcyh0YXJnZXQ6IG9iamVjdCwgLi4uc291cmNlczogb2JqZWN0W10pOiBvYmplY3Qge1xuICByZXR1cm4gYXNzaWduV2l0aE5vbkVudW1lcmFibGVQcm9wZXJ0aWVzSW1wbCh0YXJnZXQsIC4uLnNvdXJjZXMpO1xufVxuLyoqXG4gKiBDYXN0cyBhIHZhbHVlIHRvIGEgc3BlY2lmaWMgdHlwZS5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gY2FzdC5cbiAqIEByZXR1cm5zIFRoZSB2YWx1ZSBhcyB0aGUgc3BlY2lmaWVkIHR5cGUuXG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5uZWNlc3NhcnktdHlwZS1wYXJhbWV0ZXJzIC0tIFdlIG5lZWQgdG8gY2FzdC5cbmV4cG9ydCBmdW5jdGlvbiBjYXN0VG88VD4odmFsdWU6IHVua25vd24pOiBUIHtcbiAgcmV0dXJuIHZhbHVlIGFzIFQ7XG59XG4vKipcbiAqIENsb25lcyBhbiBvYmplY3QsIGluY2x1ZGluZyBub24tZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSBvYmogLSBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMgQSBuZXcgb2JqZWN0IHdpdGggdGhlIHNhbWUgcHJvcGVydGllcyBhcyB0aGUgb3JpZ2luYWwgb2JqZWN0LCBpbmNsdWRpbmcgbm9uLWVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb25lV2l0aE5vbkVudW1lcmFibGVQcm9wZXJ0aWVzPFQgZXh0ZW5kcyBvYmplY3Q+KG9iajogVCk6IFQge1xuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShnZXRQcm90b3R5cGVPZihvYmopLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmopKSBhcyBUO1xufVxuLyoqXG4gKiBDb21wYXJlcyB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBkZWVwbHkgZXF1YWwuXG4gKlxuICogQHBhcmFtIGEgLSBUaGUgZmlyc3QgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSBiIC0gVGhlIHNlY29uZCB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGRlZXBseSBlcXVhbCwgb3RoZXJ3aXNlIGBmYWxzZWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwRXF1YWwoYTogdW5rbm93biwgYjogdW5rbm93bik6IGJvb2xlYW4ge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPT0gJ29iamVjdCcgfHwgYSA9PT0gbnVsbCB8fCBiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgYUNvbnN0cnVjdG9yID0gYS5jb25zdHJ1Y3RvcjtcbiAgY29uc3QgYkNvbnN0cnVjdG9yID0gYi5jb25zdHJ1Y3RvcjtcblxuICBpZiAoYUNvbnN0cnVjdG9yICE9PSBiQ29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoYUNvbnN0cnVjdG9yICE9PSBPYmplY3QpIHtcbiAgICBjb25zdCByZXN1bHQgPSBkZWVwRXF1YWxUeXBlZChhLCBiKTtcbiAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qga2V5c0EgPSBnZXRBbGxLZXlzKGEpO1xuICBjb25zdCBrZXlzQiA9IGdldEFsbEtleXMoYik7XG5cbiAgaWYgKGtleXNBLmxlbmd0aCAhPT0ga2V5c0IubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgYVJlY29yZCA9IGVuc3VyZUdlbmVyaWNPYmplY3QoYSk7XG4gIGNvbnN0IGJSZWNvcmQgPSBlbnN1cmVHZW5lcmljT2JqZWN0KGIpO1xuXG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXNBKSB7XG4gICAgaWYgKCFrZXlzQi5pbmNsdWRlcyhrZXkpIHx8ICFkZWVwRXF1YWwoYVJlY29yZFtrZXldLCBiUmVjb3JkW2tleV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogRGVsZXRlcyBtdWx0aXBsZSBwcm9wZXJ0aWVzIGZyb20gYW4gb2JqZWN0LlxuICpcbiAqIEB0eXBlUGFyYW0gVCAtIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QuXG4gKiBAcGFyYW0gb2JqIC0gVGhlIG9iamVjdCB0byBkZWxldGUgdGhlIHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSBwcm9wZXJ0eU5hbWVzIC0gVGhlIG5hbWVzIG9mIHRoZSBwcm9wZXJ0aWVzIHRvIGRlbGV0ZS5cbiAqIEByZXR1cm5zIGB0cnVlYCBpZiBhbnkgb2YgdGhlIHByb3BlcnRpZXMgd2VyZSBwcmVzZW50LCBvdGhlcndpc2UgYGZhbHNlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnRpZXM8VCBleHRlbmRzIG9iamVjdD4ob2JqOiBULCBwcm9wZXJ0eU5hbWVzOiAoa2V5b2YgVClbXSk6IGJvb2xlYW4ge1xuICBsZXQgYW5zID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgb2YgcHJvcGVydHlOYW1lcykge1xuICAgIGFucyA9IGRlbGV0ZVByb3BlcnR5KG9iaiwgcHJvcGVydHlOYW1lKSB8fCBhbnM7XG4gIH1cblxuICByZXR1cm4gYW5zO1xufVxuXG4vKipcbiAqIERlbGV0ZXMgYSBwcm9wZXJ0eSBmcm9tIGFuIG9iamVjdC5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBUaGUgdHlwZSBvZiB0aGUgb2JqZWN0LlxuICogQHBhcmFtIG9iaiAtIFRoZSBvYmplY3QgdG8gZGVsZXRlIHRoZSBwcm9wZXJ0eSBmcm9tLlxuICogQHBhcmFtIHByb3BlcnR5TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byBkZWxldGUuXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHByb3BlcnR5IHdhcyBwcmVzZW50LCBvdGhlcndpc2UgYGZhbHNlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5PFQgZXh0ZW5kcyBvYmplY3Q+KG9iajogVCwgcHJvcGVydHlOYW1lOiBrZXlvZiBUKTogYm9vbGVhbiB7XG4gIGlmICghT2JqZWN0Lmhhc093bihvYmosIHByb3BlcnR5TmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1keW5hbWljLWRlbGV0ZSAtLSBXZSBoYXZlIG5vIG90aGVyIHdheSB0byBkZWxldGUgdGhlIHByb3BlcnR5LlxuICBkZWxldGUgb2JqW3Byb3BlcnR5TmFtZV07XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSBkZWZhdWx0IGV4cG9ydCBmcm9tIGEgbW9kdWxlLlxuICpcbiAqIFVzZWZ1bCB0byBoYW5kbGUgaW5jb3JyZWN0IGRlZmF1bHQgZXhwb3J0IGludGVyb3AgYmV0d2VlbiBFU00gYW5kIENKUy5cbiAqXG4gKiBAcGFyYW0gbW9kdWxlIC0gVGhlIG1vZHVsZSB0byBleHRyYWN0IHRoZSBkZWZhdWx0IGV4cG9ydCBmcm9tLlxuICogQHJldHVybnMgVGhlIGRlZmF1bHQgZXhwb3J0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdERlZmF1bHRFeHBvcnRJbnRlcm9wPFQ+KG1vZHVsZTogTW9kdWxlV2l0aERlZmF1bHRFeHBvcnQ8VD4gfCBUKTogVCB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAnb2JqZWN0JyB8fCBtb2R1bGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbW9kdWxlO1xuICB9XG5cbiAgaWYgKCdkZWZhdWx0JyBpbiBtb2R1bGUpIHtcbiAgICByZXR1cm4gbW9kdWxlLmRlZmF1bHQ7XG4gIH1cblxuICByZXR1cm4gbW9kdWxlO1xufVxuXG4vKipcbiAqIEdldHMgYWxsIGVudHJpZXMgb2YgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBvYmogLSBUaGUgb2JqZWN0IHRvIGdldCB0aGUgZW50cmllcyBvZi5cbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGFsbCBlbnRyaWVzIG9mIHRoZSBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxFbnRyaWVzPFQgZXh0ZW5kcyBvYmplY3Q+KG9iajogVCk6IFtTdHJpbmdLZXlzPFQ+LCBUW1N0cmluZ0tleXM8VD5dXVtdIHtcbiAgcmV0dXJuIGdldEFsbEtleXMob2JqKS5tYXAoKGtleSkgPT4gW2tleSwgb2JqW2tleV1dKTtcbn1cblxuLyoqXG4gKiBHZXRzIGFsbCBrZXlzIG9mIGFuIG9iamVjdC5cbiAqIEluY2x1ZGVzIGZpZWxkcyBhbmQgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gVGhlIG9iamVjdCB0byBnZXQgdGhlIGtleXMgb2YuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBhbGwga2V5cyBvZiB0aGUgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsS2V5czxUIGV4dGVuZHMgb2JqZWN0PihvYmo6IFQpOiBTdHJpbmdLZXlzPFQ+W10ge1xuICBjb25zdCBrZXlzOiBTdHJpbmdLZXlzPFQ+W10gPSBbXTtcbiAgbGV0IGN1cnJlbnQ6IG51bGwgfCBvYmplY3QgPSBvYmo7XG4gIHdoaWxlIChjdXJyZW50KSB7XG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhjdXJyZW50KSBhcyBSZWNvcmQ8c3RyaW5nLCBQcm9wZXJ0eURlc2NyaXB0b3I+O1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY3JpcHRvcl0gb2YgT2JqZWN0LmVudHJpZXMoZGVzY3JpcHRvcnMpKSB7XG4gICAgICBpZiAoa2V5ID09PSAnX19wcm90b19fJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBoYXNHZXR0ZXIgPSB0eXBlb2YgZGVzY3JpcHRvci5nZXQgPT09ICdmdW5jdGlvbic7XG4gICAgICBjb25zdCBoYXNTZXR0ZXIgPSB0eXBlb2YgZGVzY3JpcHRvci5zZXQgPT09ICdmdW5jdGlvbic7XG4gICAgICBpZiAoaGFzR2V0dGVyIHx8IGhhc1NldHRlcikge1xuICAgICAgICBpZiAoaGFzR2V0dGVyICYmIGhhc1NldHRlcikge1xuICAgICAgICAgIGtleXMucHVzaChrZXkgYXMgU3RyaW5nS2V5czxUPik7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZXNjcmlwdG9yLmVudW1lcmFibGUgJiYgZGVzY3JpcHRvci53cml0YWJsZSkge1xuICAgICAgICBrZXlzLnB1c2goa2V5IGFzIFN0cmluZ0tleXM8VD4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGN1cnJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY3VycmVudCkgYXMgbnVsbCB8IG9iamVjdDtcbiAgfVxuICByZXR1cm4ga2V5cy5zb3J0KCk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgb2YgYSBuZXN0ZWQgcHJvcGVydHkgZnJvbSBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIG9iaiAtIFRoZSBvYmplY3QgdG8gZ2V0IHRoZSBuZXN0ZWQgcHJvcGVydHkgdmFsdWUgZnJvbS5cbiAqIEBwYXJhbSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIG5lc3RlZCBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIFRoZSB2YWx1ZSBvZiB0aGUgbmVzdGVkIHByb3BlcnR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmVzdGVkUHJvcGVydHlWYWx1ZShvYmo6IEdlbmVyaWNPYmplY3QsIHBhdGg6IHN0cmluZyk6IHVua25vd24ge1xuICBsZXQgbm9kZTogR2VuZXJpY09iamVjdCB8IHVuZGVmaW5lZCA9IG9iajtcbiAgY29uc3Qga2V5cyA9IHBhdGguc3BsaXQoS0VZX1NFUEFSQVRPUik7XG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBub2RlID0gbm9kZVtrZXldIGFzIEdlbmVyaWNPYmplY3QgfCB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBwcm90b3R5cGUgb2YgdGhlIHNwZWNpZmllZCBvYmplY3QuXG4gKlxuICogQHR5cGVQYXJhbSBUIC0gVGhlIHR5cGUgb2YgdGhlIG9iamVjdC5cbiAqIEBwYXJhbSBpbnN0YW5jZSAtIFRoZSBvYmplY3QgaW5zdGFuY2UgdG8gcmV0cmlldmUgdGhlIHByb3RvdHlwZSBvZi5cbiAqIEByZXR1cm5zIFRoZSBwcm90b3R5cGUgb2YgdGhlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mPFQ+KGluc3RhbmNlOiBUKTogVCB7XG4gIGlmIChpbnN0YW5jZSA9PT0gdW5kZWZpbmVkIHx8IGluc3RhbmNlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5zdGFuY2UpIGFzIFQ7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBuYW1lIG9mIGEgcHJvcGVydHkgb2YgYSBnaXZlbiB0eXBlIGBUYC5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBUaGUgdHlwZSBvZiB0aGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHByb3BlcnR5LlxuICogQHBhcmFtIG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgYXMgYSBzdHJpbmcuXG4gKiBAcmV0dXJucyBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuYW1lb2Y8VCBleHRlbmRzIG9iamVjdD4obmFtZTogU3RyaW5nS2V5czxUPik6IFN0cmluZ0tleXM8VD4ge1xuICByZXR1cm4gbmFtZTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemVzIG9wdGlvbmFsIHByb3BlcnRpZXMgdG8gYWxsb3cgYHVuZGVmaW5lZGAgYXNzaWdubWVudCBpbiBzdHJpY3QgbW9kZS5cbiAqXG4gKiBUaGlzIHV0aWxpdHkgcHJvdmlkZXMgYSB3b3JrYXJvdW5kIGZvciB0aGUgYGV4YWN0T3B0aW9uYWxQcm9wZXJ0eVR5cGVzYCBUeXBlU2NyaXB0IGZsYWcsXG4gKiB3aGljaCBwcm9oaWJpdHMgZGlyZWN0bHkgYXNzaWduaW5nIGB1bmRlZmluZWRgIHRvIG9wdGlvbmFsIHByb3BlcnRpZXMgd2hlbiB0aGUgdHlwZVxuICogZXhwbGljaXRseSBvbWl0cyBgdW5kZWZpbmVkYC5cbiAqXG4gKiBFeGFtcGxlOlxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gV2l0aCBgZXhhY3RPcHRpb25hbFByb3BlcnR5VHlwZXM6IHRydWVgXG4gKiBjb25zdCB4OiB7IHByb3A/OiBzdHJpbmcgfSA9IHsgcHJvcDogdW5kZWZpbmVkIH07IC8vIENvbXBpbGVyIGVycm9yXG4gKlxuICogLy8gVXNpbmcgdGhpcyB1dGlsaXR5OlxuICogY29uc3QgeTogeyBwcm9wPzogc3RyaW5nIH0gPSBub3JtYWxpemVPcHRpb25hbFByb3BlcnRpZXM8eyBwcm9wPzogc3RyaW5nIH0+KHsgcHJvcDogdW5kZWZpbmVkIH0pOyAvLyBXb3Jrc1xuICogYGBgXG4gKlxuICogQHR5cGVQYXJhbSBUIC0gVGhlIHRhcmdldCB0eXBlIHdpdGggb3B0aW9uYWwgcHJvcGVydGllcyB0byBub3JtYWxpemUuXG4gKiBAcGFyYW0gb2JqIC0gVGhlIG9iamVjdCB0byBub3JtYWxpemUsIGFsbG93aW5nIGV4cGxpY2l0IGB1bmRlZmluZWRgIGZvciBvcHRpb25hbCBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMgVGhlIG5vcm1hbGl6ZWQgb2JqZWN0LCBjb21wYXRpYmxlIHdpdGggYGV4YWN0T3B0aW9uYWxQcm9wZXJ0eVR5cGVzYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZU9wdGlvbmFsUHJvcGVydGllczxUPihvYmo6IFVuZGVmaW5lZE9uUGFydGlhbERlZXA8VD4pOiBUIHtcbiAgcmV0dXJuIG9iaiBhcyBUO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGB1bmRlZmluZWRgIHByb3BlcnRpZXMgZnJvbSBhbiBvYmplY3Qgd2hlbiB0aGVyZSBhcmUgbm8gbWFuZGF0b3J5IGtleXMgd2l0aCBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHR5cGVQYXJhbSBUeXBlIC0gVGhlIHR5cGUgb2YgdGhlIG9iamVjdC5cbiAqIEBwYXJhbSBhcmdzIC0gVGhlIGFyZ3VtZW50cyB0byB0aGUgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyBUaGUgb2JqZWN0IHdpdGggYWxsIGB1bmRlZmluZWRgIHByb3BlcnRpZXMgcmVtb3ZlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVVuZGVmaW5lZFByb3BlcnRpZXM8VHlwZSBleHRlbmRzIG9iamVjdD4oXG4gIC4uLmFyZ3M6IFJlbW92ZVVuZGVmaW5lZE92ZXJsb2FkPFR5cGU+XG4pOiBUeXBlO1xuLyoqXG4gKiBSZW1vdmVzIGFsbCBgdW5kZWZpbmVkYCBwcm9wZXJ0aWVzIGZyb20gYW4gb2JqZWN0IHdoZW4gdGhlcmUgYXJlIG1hbmRhdG9yeSBrZXlzIHdpdGggYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEB0eXBlUGFyYW0gVHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QuXG4gKiBAdHlwZVBhcmFtIEtleXNUb0tlZXAgLSBUaGUga2V5cyB0byBrZWVwLlxuICogQHBhcmFtIGFyZ3MgLSBUaGUgYXJndW1lbnRzIHRvIHRoZSBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIFRoZSBvYmplY3Qgd2l0aCBhbGwgYHVuZGVmaW5lZGAgcHJvcGVydGllcyByZW1vdmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVW5kZWZpbmVkUHJvcGVydGllczxUeXBlIGV4dGVuZHMgb2JqZWN0LCBjb25zdCBLZXlzVG9LZWVwIGV4dGVuZHMgcmVhZG9ubHkgc3RyaW5nW10+KFxuICAuLi5hcmdzOiBSZW1vdmVVbmRlZmluZWRXaXRoS2V5c092ZXJsb2FkPFR5cGUsIEtleXNUb0tlZXA+XG4pOiBUeXBlO1xuLyoqXG4gKiBSZW1vdmVzIGFsbCBgdW5kZWZpbmVkYCBwcm9wZXJ0aWVzIGZyb20gYW4gb2JqZWN0LlxuICpcbiAqIEB0eXBlUGFyYW0gVHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QuXG4gKiBAdHlwZVBhcmFtIEtleXNUb0tlZXAgLSBUaGUga2V5cyB0byBrZWVwLlxuICogQHBhcmFtIG9iaiAtIFRoZSBvYmplY3QgdG8gcmVtb3ZlIGB1bmRlZmluZWRgIHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSBrZXlzVG9LZWVwIC0gVGhlIGtleXMgdG8ga2VlcC5cbiAqIEByZXR1cm5zIFRoZSBvYmplY3Qgd2l0aCBhbGwgYHVuZGVmaW5lZGAgcHJvcGVydGllcyByZW1vdmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVW5kZWZpbmVkUHJvcGVydGllczxUeXBlIGV4dGVuZHMgb2JqZWN0PihvYmo6IFR5cGUsIGtleXNUb0tlZXA/OiByZWFkb25seSBzdHJpbmdbXSk6IFR5cGUge1xuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmopIGFzIFtTdHJpbmdLZXlzPFR5cGU+LCB1bmtub3duXVtdKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIWtleXNUb0tlZXA/LmluY2x1ZGVzKGtleSBhcyBzdHJpbmcpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWR5bmFtaWMtZGVsZXRlIC0tIFdlIGhhdmUgbm8gb3RoZXIgd2F5IHRvIGRlbGV0ZSB0aGUgcHJvcGVydHkuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgdmFsdWUgb2YgYSBuZXN0ZWQgcHJvcGVydHkgaW4gYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBvYmogLSBUaGUgb2JqZWN0IHRvIHNldCB0aGUgbmVzdGVkIHByb3BlcnR5IHZhbHVlIGluLlxuICogQHBhcmFtIHBhdGggLSBUaGUgcGF0aCB0byB0aGUgbmVzdGVkIHByb3BlcnR5LlxuICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNldC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldE5lc3RlZFByb3BlcnR5VmFsdWUob2JqOiBHZW5lcmljT2JqZWN0LCBwYXRoOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogdm9pZCB7XG4gIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBQcm9wZXJ0eSBwYXRoICR7cGF0aH0gbm90IGZvdW5kYCk7XG4gIGxldCBub2RlOiBHZW5lcmljT2JqZWN0IHwgdW5kZWZpbmVkID0gb2JqO1xuICBjb25zdCBrZXlzID0gcGF0aC5zcGxpdChLRVlfU0VQQVJBVE9SKTtcbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5cy5zbGljZSgwLCAtMSkpIHtcbiAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gICAgbm9kZSA9IG5vZGVba2V5XSBhcyBHZW5lcmljT2JqZWN0IHwgdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgbGFzdEtleSA9IGVuc3VyZU5vbk51bGxhYmxlKGtleXMuYXQoLTEpKTtcbiAgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IGVycm9yO1xuICB9XG5cbiAgbm9kZVtsYXN0S2V5XSA9IHZhbHVlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgZ2l2ZW4gdmFsdWUgdG8gYSBKU09OIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gYmUgY29udmVydGVkIHRvIEpTT04uIFRoaXMgY2FuIGJlIG9mIGFueSB0eXBlLlxuICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zIGZvciBjdXN0b21pemluZyB0aGUgSlNPTiBjb252ZXJzaW9uIHByb2Nlc3MuXG4gKiBAcmV0dXJucyBUaGUgSlNPTiBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGlucHV0IHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9Kc29uKHZhbHVlOiB1bmtub3duLCBvcHRpb25zOiBQYXJ0aWFsPFRvSnNvbk9wdGlvbnM+ID0ge30pOiBzdHJpbmcge1xuICBjb25zdCBERUZBVUxUX09QVElPTlM6IFJlc29sdmVkVG9Kc29uT3B0aW9ucyA9IHtcbiAgICBmdW5jdGlvbkhhbmRsaW5nTW9kZTogRnVuY3Rpb25IYW5kbGluZ01vZGUuRXhjbHVkZSxcbiAgICBtYXhEZXB0aDogLTEsXG4gICAgc2hvdWxkQ2F0Y2hUb0pTT05FcnJvcnM6IGZhbHNlLFxuICAgIHNob3VsZEhhbmRsZUNpcmN1bGFyUmVmZXJlbmNlczogZmFsc2UsXG4gICAgc2hvdWxkSGFuZGxlRXJyb3JzOiBmYWxzZSxcbiAgICBzaG91bGRIYW5kbGVVbmRlZmluZWQ6IGZhbHNlLFxuICAgIHNob3VsZFNvcnRLZXlzOiBmYWxzZSxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVycyAtLSBFeHRyYWN0aW5nIG1hZ2ljIG51bWJlciBhcyBhIGNvbnN0YW50IHdvdWxkIGJlIHJlcGV0aXRpdmUsIGFzIHRoZSB2YWx1ZSBpcyB1c2VkIG9ubHkgb25jZSBhbmQgaXRzIG5hbWUgd291bGQgYmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnR5LlxuICAgIHNwYWNlOiAyLFxuICAgIHRva2VuU3Vic3RpdHV0aW9uczoge1xuICAgICAgY2lyY3VsYXJSZWZlcmVuY2U6IG1ha2VPYmplY3RUb2tlblN1YnN0aXR1dGlvbihUb2tlblN1YnN0aXR1dGlvbktleS5DaXJjdWxhclJlZmVyZW5jZSksXG4gICAgICBtYXhEZXB0aExpbWl0UmVhY2hlZDogbWFrZU9iamVjdFRva2VuU3Vic3RpdHV0aW9uKFRva2VuU3Vic3RpdHV0aW9uS2V5Lk1heERlcHRoTGltaXRSZWFjaGVkKSxcbiAgICAgIHRvSlNPTkZhaWxlZDogbWFrZU9iamVjdFRva2VuU3Vic3RpdHV0aW9uKFRva2VuU3Vic3RpdHV0aW9uS2V5LlRvSlNPTkZhaWxlZClcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZnVsbE9wdGlvbnMgPSB7XG4gICAgLi4uREVGQVVMVF9PUFRJT05TLFxuICAgIC4uLm9wdGlvbnMsXG4gICAgdG9rZW5TdWJzdGl0dXRpb25zOiB7XG4gICAgICAuLi5ERUZBVUxUX09QVElPTlMudG9rZW5TdWJzdGl0dXRpb25zLFxuICAgICAgLi4ub3B0aW9ucy50b2tlblN1YnN0aXR1dGlvbnNcbiAgICB9XG4gIH07XG5cbiAgaWYgKGZ1bGxPcHRpb25zLm1heERlcHRoID09PSAtMSkge1xuICAgIGZ1bGxPcHRpb25zLm1heERlcHRoID0gSW5maW5pdHk7XG4gIH1cblxuICBjb25zdCBmdW5jdGlvblRleHRzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB1c2VkT2JqZWN0cyA9IG5ldyBXZWFrU2V0PG9iamVjdD4oKTtcblxuICBjb25zdCBwbGFpbk9iamVjdCA9IHRvUGxhaW5PYmplY3QodmFsdWUsICcnLCAwLCB0cnVlLCBmdWxsT3B0aW9ucywgZnVuY3Rpb25UZXh0cywgdXNlZE9iamVjdHMpO1xuICBsZXQganNvbiA9IGVuc3VyZU5vbk51bGxhYmxlKEpTT04uc3RyaW5naWZ5KHBsYWluT2JqZWN0LCBudWxsLCBmdWxsT3B0aW9ucy5zcGFjZSkpO1xuICBqc29uID0gcmVwbGFjZUFsbChqc29uLCAvXCJcXFtcXFsoPzxLZXk+W0EtWmEtel0rKSg/PEluZGV4PlxcZCopXFxdXFxdXCIvZywgKF8sIGtleSwgaW5kZXhTdHIpID0+XG4gICAgYXBwbHlTdWJzdGl0dXRpb25zKHtcbiAgICAgIGZ1bmN0aW9uVGV4dHMsXG4gICAgICBpbmRleDogaW5kZXhTdHIgPyBwYXJzZUludChpbmRleFN0ciwgMTApIDogMCxcbiAgICAgIGtleToga2V5IGFzIFRva2VuU3Vic3RpdHV0aW9uS2V5LFxuICAgICAgc3Vic3RpdHV0aW9uczogZnVsbE9wdGlvbnMudG9rZW5TdWJzdGl0dXRpb25zXG4gICAgfSkpO1xuICByZXR1cm4ganNvbjtcbn1cblxuZnVuY3Rpb24gYXBwbHlTdWJzdGl0dXRpb25zKHBhcmFtczogQXBwbHlTdWJzdGl0dXRpb25zUGFyYW1zKTogTWF5YmVSZXR1cm48c3RyaW5nPiB7XG4gIHN3aXRjaCAocGFyYW1zLmtleSkge1xuICAgIGNhc2UgVG9rZW5TdWJzdGl0dXRpb25LZXkuQ2lyY3VsYXJSZWZlcmVuY2U6XG4gICAgICByZXR1cm4gcGFyYW1zLnN1YnN0aXR1dGlvbnMuY2lyY3VsYXJSZWZlcmVuY2U7XG4gICAgY2FzZSBUb2tlblN1YnN0aXR1dGlvbktleS5GdW5jdGlvbjpcbiAgICAgIHJldHVybiBlbnN1cmVOb25OdWxsYWJsZShwYXJhbXMuZnVuY3Rpb25UZXh0c1twYXJhbXMuaW5kZXhdLCBgRnVuY3Rpb24gd2l0aCBpbmRleCAke1N0cmluZyhwYXJhbXMuaW5kZXgpfSBub3QgZm91bmRgKTtcbiAgICBjYXNlIFRva2VuU3Vic3RpdHV0aW9uS2V5Lk1heERlcHRoTGltaXRSZWFjaGVkOlxuICAgICAgcmV0dXJuIHBhcmFtcy5zdWJzdGl0dXRpb25zLm1heERlcHRoTGltaXRSZWFjaGVkO1xuICAgIGNhc2UgVG9rZW5TdWJzdGl0dXRpb25LZXkuTWF4RGVwdGhMaW1pdFJlYWNoZWRBcnJheTpcbiAgICAgIHJldHVybiBgQXJyYXkoJHtTdHJpbmcocGFyYW1zLmluZGV4KX0pYDtcbiAgICBjYXNlIFRva2VuU3Vic3RpdHV0aW9uS2V5LlRvSlNPTkZhaWxlZDpcbiAgICAgIHJldHVybiBwYXJhbXMuc3Vic3RpdHV0aW9ucy50b0pTT05GYWlsZWQ7XG4gICAgY2FzZSBUb2tlblN1YnN0aXR1dGlvbktleS5VbmRlZmluZWQ6XG4gICAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gICAgLyogdjggaWdub3JlIHN0YXJ0IC0tIEV4aGF1c3RpdmUgc3dpdGNoIGd1YXJkOyBkZWZhdWx0IGJyYW5jaCBpcyB1bnJlYWNoYWJsZS4gKi9cbiAgICBkZWZhdWx0OlxuICAgICAgYXNzZXJ0KGZhbHNlLCAnVW5oYW5kbGVkIHN1YnN0aXR1dGlvbiBrZXknKTtcbiAgICAgIC8qIHY4IGlnbm9yZSBzdG9wICovXG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzaWduV2l0aE5vbkVudW1lcmFibGVQcm9wZXJ0aWVzSW1wbCh0YXJnZXQ6IG9iamVjdCwgLi4uc291cmNlczogb2JqZWN0W10pOiBvYmplY3Qge1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpO1xuXG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjcmlwdG9yXSBvZiBPYmplY3QuZW50cmllcyhkZXNjcmlwdG9ycykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIEF2b2lkIHJlZGVmaW5pbmcgcmVhZC1vbmx5IHByb3BlcnRpZXMgKGVzcGVjaWFsbHkgYHByb3RvdHlwZWApXG4gICAgICAgIGlmIChcbiAgICAgICAgICBrZXkgPT09ICdwcm90b3R5cGUnXG4gICAgICAgICAgfHwgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpPy53cml0YWJsZSA9PT0gZmFsc2VcbiAgICAgICAgICAgICYmICFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KT8uY29uZmlndXJhYmxlKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gU2lsZW50bHkgaWdub3JlIGlmIGRlZmluZVByb3BlcnR5IGZhaWxzXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc291cmNlUHJvdG90eXBlcyA9IHNvdXJjZXNcbiAgICAubWFwKChzb3VyY2UpID0+IGdldFByb3RvdHlwZU9mPG9iamVjdCB8IHVuZGVmaW5lZD4oc291cmNlKSlcbiAgICAuZmlsdGVyKChwcm90byk6IHByb3RvIGlzIG9iamVjdCA9PiAhIXByb3RvKTtcblxuICBpZiAoc291cmNlUHJvdG90eXBlcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgdGFyZ2V0UHJvdG90eXBlID0gYXNzaWduV2l0aE5vbkVudW1lcmFibGVQcm9wZXJ0aWVzSW1wbCh7fSwgZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSwgLi4uc291cmNlUHJvdG90eXBlcyk7XG5cbiAgICB0cnkge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgdGFyZ2V0UHJvdG90eXBlKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIFNpbGVudGx5IGlnbm9yZSBpZiBzZXRQcm90b3R5cGVPZiBmYWlsc1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55IC0tIGB1bmtub3duYCBkb2Vzbid0IHdvcmssIGdldHRpbmcgY29tcGlsZXIgZXJyb3JzLlxuZnVuY3Rpb24gY3JlYXRlRXF1YWxpdHlDb21wYXJlckVudHJpZXM8Y29uc3QgVCBleHRlbmRzIHJlYWRvbmx5IEVxdWFsaXR5Q29tcGFyZXJFbnRyeTxhbnk+W10+KGVudHJpZXM6IFQpOiBUIHtcbiAgcmV0dXJuIGVudHJpZXM7XG59XG5cbmZ1bmN0aW9uIGRlZXBFcXVhbEFycmF5QnVmZmVyKGE6IEFycmF5QnVmZmVyLCBiOiBBcnJheUJ1ZmZlcik6IGJvb2xlYW4ge1xuICBpZiAoYS5ieXRlTGVuZ3RoICE9PSBiLmJ5dGVMZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB2aWV3QSA9IG5ldyBVaW50OEFycmF5KGEpO1xuICBjb25zdCB2aWV3QiA9IG5ldyBVaW50OEFycmF5KGIpO1xuICByZXR1cm4gZGVlcEVxdWFsKHZpZXdBLCB2aWV3Qik7XG59XG5cbmZ1bmN0aW9uIGRlZXBFcXVhbERhdGUoYTogRGF0ZSwgYjogRGF0ZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gYS5nZXRUaW1lKCkgPT09IGIuZ2V0VGltZSgpO1xufVxuXG5mdW5jdGlvbiBkZWVwRXF1YWxNYXAoYTogTWFwPHVua25vd24sIHVua25vd24+LCBiOiBNYXA8dW5rbm93biwgdW5rbm93bj4pOiBib29sZWFuIHtcbiAgaWYgKGEuc2l6ZSAhPT0gYi5zaXplKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgYS5lbnRyaWVzKCkpIHtcbiAgICBpZiAoIWIuaGFzKGtleSkgfHwgIWRlZXBFcXVhbCh2YWx1ZSwgYi5nZXQoa2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZGVlcEVxdWFsUmVnRXhwKGE6IFJlZ0V4cCwgYjogUmVnRXhwKTogYm9vbGVhbiB7XG4gIHJldHVybiBhLnNvdXJjZSA9PT0gYi5zb3VyY2UgJiYgYS5mbGFncyA9PT0gYi5mbGFncztcbn1cblxuZnVuY3Rpb24gZGVlcEVxdWFsU2V0KGE6IFNldDx1bmtub3duPiwgYjogU2V0PHVua25vd24+KTogYm9vbGVhbiB7XG4gIGlmIChhLnNpemUgIT09IGIuc2l6ZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAoY29uc3QgdmFsdWVBIG9mIGEpIHtcbiAgICBpZiAoYi5oYXModmFsdWVBKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgdmFsdWVCIG9mIGIpIHtcbiAgICAgIGlmIChkZWVwRXF1YWwodmFsdWVBLCB2YWx1ZUIpKSB7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZm91bmQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZGVlcEVxdWFsVHlwZWQoYTogdW5rbm93biwgYjogdW5rbm93bik6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICBmb3IgKGNvbnN0IHsgY29uc3RydWN0b3IsIGVxdWFsaXR5Q29tcGFyZXIgfSBvZiBlcXVhbGl0eUNvbXBhcmVyRW50cmllcykge1xuICAgIGlmIChhIGluc3RhbmNlb2YgY29uc3RydWN0b3IgJiYgYiBpbnN0YW5jZW9mIGNvbnN0cnVjdG9yKSB7XG4gICAgICByZXR1cm4gZXF1YWxpdHlDb21wYXJlcihhIGFzIG5ldmVyLCBiIGFzIG5ldmVyKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQXJyYXkoXG4gIHZhbHVlOiB1bmtub3duW10sXG4gIGRlcHRoOiBudW1iZXIsXG4gIGNhblVzZVRvSlNPTjogYm9vbGVhbixcbiAgZnVsbE9wdGlvbnM6IFRvSnNvbk9wdGlvbnMsXG4gIGZ1bmN0aW9uVGV4dHM6IHN0cmluZ1tdLFxuICB1c2VkT2JqZWN0czogV2Vha1NldDxvYmplY3Q+XG4pOiB1bmtub3duIHtcbiAgaWYgKGRlcHRoID4gZnVsbE9wdGlvbnMubWF4RGVwdGgpIHtcbiAgICByZXR1cm4gbWFrZVBsYWNlaG9sZGVyKFRva2VuU3Vic3RpdHV0aW9uS2V5Lk1heERlcHRoTGltaXRSZWFjaGVkQXJyYXksIHZhbHVlLmxlbmd0aCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWUubWFwKChpdGVtLCBpbmRleCkgPT4gdG9QbGFpbk9iamVjdChpdGVtLCBTdHJpbmcoaW5kZXgpLCBkZXB0aCArIDEsIGNhblVzZVRvSlNPTiwgZnVsbE9wdGlvbnMsIGZ1bmN0aW9uVGV4dHMsIHVzZWRPYmplY3RzKSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUNpcmN1bGFyUmVmZXJlbmNlKHZhbHVlOiBvYmplY3QsIGtleTogc3RyaW5nLCBmdWxsT3B0aW9uczogVG9Kc29uT3B0aW9ucyk6IHVua25vd24ge1xuICBpZiAoZnVsbE9wdGlvbnMuc2hvdWxkSGFuZGxlQ2lyY3VsYXJSZWZlcmVuY2VzKSB7XG4gICAgcmV0dXJuIG1ha2VQbGFjZWhvbGRlcihUb2tlblN1YnN0aXR1dGlvbktleS5DaXJjdWxhclJlZmVyZW5jZSk7XG4gIH1cbiAgY29uc3QgdmFsdWVDb25zdHJ1Y3Rvck5hbWUgPSB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICdPYmplY3QnO1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKGBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OXG4tLT4gc3RhcnRpbmcgYXQgb2JqZWN0IHdpdGggY29uc3RydWN0b3IgJyR7dmFsdWVDb25zdHJ1Y3Rvck5hbWV9J1xuLS0tIHByb3BlcnR5ICcke2tleX0nIGNsb3NlcyB0aGUgY2lyY2xlYCk7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWZ1bmN0aW9uLXR5cGUgLS0gV2UgbmVlZCB0byB1c2UgYEZ1bmN0aW9uYCB0eXBlIHRvIGhhbmRsZSB0aGVtIHNlcGFyYXRlbHkuXG5mdW5jdGlvbiBoYW5kbGVGdW5jdGlvbih2YWx1ZTogRnVuY3Rpb24sIGZ1bmN0aW9uVGV4dHM6IHN0cmluZ1tdLCBmdWxsT3B0aW9uczogVG9Kc29uT3B0aW9ucyk6IHVua25vd24ge1xuICBpZiAoZnVsbE9wdGlvbnMuZnVuY3Rpb25IYW5kbGluZ01vZGUgPT09IEZ1bmN0aW9uSGFuZGxpbmdNb2RlLkV4Y2x1ZGUpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IGluZGV4ID0gZnVuY3Rpb25UZXh0cy5sZW5ndGg7XG4gIGNvbnN0IGZ1bmN0aW9uVGV4dCA9IGZ1bGxPcHRpb25zLmZ1bmN0aW9uSGFuZGxpbmdNb2RlID09PSBGdW5jdGlvbkhhbmRsaW5nTW9kZS5GdWxsXG4gICAgPyBnZXRGdW5jdGlvbkV4cHJlc3Npb25TdHJpbmcodmFsdWUpXG4gICAgOiBgZnVuY3Rpb24gJHt2YWx1ZS5uYW1lIHx8ICdhbm9ueW1vdXMnfSgpIHsgLyogLi4uICovIH1gO1xuICBmdW5jdGlvblRleHRzLnB1c2goZnVuY3Rpb25UZXh0KTtcbiAgcmV0dXJuIG1ha2VQbGFjZWhvbGRlcihUb2tlblN1YnN0aXR1dGlvbktleS5GdW5jdGlvbiwgaW5kZXgpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPYmplY3QoXG4gIHZhbHVlOiBvYmplY3QsXG4gIGtleTogc3RyaW5nLFxuICBkZXB0aDogbnVtYmVyLFxuICBjYW5Vc2VUb0pTT046IGJvb2xlYW4sXG4gIGZ1bGxPcHRpb25zOiBUb0pzb25PcHRpb25zLFxuICBmdW5jdGlvblRleHRzOiBzdHJpbmdbXSxcbiAgdXNlZE9iamVjdHM6IFdlYWtTZXQ8b2JqZWN0PlxuKTogdW5rbm93biB7XG4gIGlmICh1c2VkT2JqZWN0cy5oYXModmFsdWUpKSB7XG4gICAgcmV0dXJuIGhhbmRsZUNpcmN1bGFyUmVmZXJlbmNlKHZhbHVlLCBrZXksIGZ1bGxPcHRpb25zKTtcbiAgfVxuXG4gIHVzZWRPYmplY3RzLmFkZCh2YWx1ZSk7XG5cbiAgaWYgKGNhblVzZVRvSlNPTikge1xuICAgIGNvbnN0IHRvSlNPTlJlc3VsdCA9IHRyeUhhbmRsZVRvSlNPTih2YWx1ZSwga2V5LCBkZXB0aCwgZnVsbE9wdGlvbnMsIGZ1bmN0aW9uVGV4dHMsIHVzZWRPYmplY3RzKTtcbiAgICBpZiAodG9KU09OUmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0b0pTT05SZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGhhbmRsZUFycmF5KHZhbHVlLCBkZXB0aCwgY2FuVXNlVG9KU09OLCBmdWxsT3B0aW9ucywgZnVuY3Rpb25UZXh0cywgdXNlZE9iamVjdHMpO1xuICB9XG5cbiAgaWYgKGRlcHRoID4gZnVsbE9wdGlvbnMubWF4RGVwdGgpIHtcbiAgICByZXR1cm4gbWFrZVBsYWNlaG9sZGVyKFRva2VuU3Vic3RpdHV0aW9uS2V5Lk1heERlcHRoTGltaXRSZWFjaGVkKTtcbiAgfVxuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVycm9yICYmIGZ1bGxPcHRpb25zLnNob3VsZEhhbmRsZUVycm9ycykge1xuICAgIHJldHVybiBlcnJvclRvU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiBoYW5kbGVQbGFpbk9iamVjdCh2YWx1ZSwgZGVwdGgsIGNhblVzZVRvSlNPTiwgZnVsbE9wdGlvbnMsIGZ1bmN0aW9uVGV4dHMsIHVzZWRPYmplY3RzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUGxhaW5PYmplY3QoXG4gIHZhbHVlOiBvYmplY3QsXG4gIGRlcHRoOiBudW1iZXIsXG4gIGNhblVzZVRvSlNPTjogYm9vbGVhbixcbiAgZnVsbE9wdGlvbnM6IFRvSnNvbk9wdGlvbnMsXG4gIGZ1bmN0aW9uVGV4dHM6IHN0cmluZ1tdLFxuICB1c2VkT2JqZWN0czogV2Vha1NldDxvYmplY3Q+XG4pOiB1bmtub3duIHtcbiAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHZhbHVlKTtcbiAgaWYgKGZ1bGxPcHRpb25zLnNob3VsZFNvcnRLZXlzKSB7XG4gICAgZW50cmllcy5zb3J0KChba2V5MV0sIFtrZXkyXSkgPT4ga2V5MS5sb2NhbGVDb21wYXJlKGtleTIpKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgZW50cmllcy5tYXAoKFtrZXkyLCB2YWx1ZTJdKSA9PiBbXG4gICAgICBrZXkyLFxuICAgICAgdG9QbGFpbk9iamVjdCh2YWx1ZTIsIGtleTIsIGRlcHRoICsgMSwgY2FuVXNlVG9KU09OLCBmdWxsT3B0aW9ucywgZnVuY3Rpb25UZXh0cywgdXNlZE9iamVjdHMpXG4gICAgXSlcbiAgKTtcbn1cblxuZnVuY3Rpb24gbWFrZU9iamVjdFRva2VuU3Vic3RpdHV0aW9uKGtleTogVG9rZW5TdWJzdGl0dXRpb25LZXkpOiBzdHJpbmcge1xuICByZXR1cm4gYHsgXCJbWyR7a2V5fV1dXCI6IG51bGwgfWA7XG59XG5cbmZ1bmN0aW9uIG1ha2VQbGFjZWhvbGRlcihrZXk6IFRva2VuU3Vic3RpdHV0aW9uS2V5LCBpbmRleD86IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBgW1ske2tleX0ke2luZGV4ID8gU3RyaW5nKGluZGV4KSA6ICcnfV1dYDtcbn1cblxuZnVuY3Rpb24gdG9QbGFpbk9iamVjdChcbiAgdmFsdWU6IHVua25vd24sXG4gIGtleTogc3RyaW5nLFxuICBkZXB0aDogbnVtYmVyLFxuICBjYW5Vc2VUb0pTT046IGJvb2xlYW4sXG4gIGZ1bGxPcHRpb25zOiBUb0pzb25PcHRpb25zLFxuICBmdW5jdGlvblRleHRzOiBzdHJpbmdbXSxcbiAgdXNlZE9iamVjdHM6IFdlYWtTZXQ8b2JqZWN0PlxuKTogdW5rbm93biB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIChkZXB0aCA9PT0gMCB8fCBmdWxsT3B0aW9ucy5zaG91bGRIYW5kbGVVbmRlZmluZWQpXG4gICAgICA/IG1ha2VQbGFjZWhvbGRlcihUb2tlblN1YnN0aXR1dGlvbktleS5VbmRlZmluZWQpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gaGFuZGxlRnVuY3Rpb24odmFsdWUsIGZ1bmN0aW9uVGV4dHMsIGZ1bGxPcHRpb25zKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGhhbmRsZU9iamVjdCh2YWx1ZSwga2V5LCBkZXB0aCwgY2FuVXNlVG9KU09OLCBmdWxsT3B0aW9ucywgZnVuY3Rpb25UZXh0cywgdXNlZE9iamVjdHMpO1xufVxuXG5mdW5jdGlvbiB0cnlIYW5kbGVUb0pTT04oXG4gIHZhbHVlOiBvYmplY3QsXG4gIGtleTogc3RyaW5nLFxuICBkZXB0aDogbnVtYmVyLFxuICBmdWxsT3B0aW9uczogVG9Kc29uT3B0aW9ucyxcbiAgZnVuY3Rpb25UZXh0czogc3RyaW5nW10sXG4gIHVzZWRPYmplY3RzOiBXZWFrU2V0PG9iamVjdD5cbik6IHVua25vd24ge1xuICBjb25zdCB0b0pTT04gPSAodmFsdWUgYXMgUGFydGlhbDxKU09OU2VyaWFsaXphYmxlPikudG9KU09OO1xuICBpZiAodHlwZW9mIHRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IHRvSlNPTi5jYWxsKHZhbHVlLCBrZXkpO1xuICAgICAgcmV0dXJuIHRvUGxhaW5PYmplY3QobmV3VmFsdWUsIGtleSwgZGVwdGgsIGZhbHNlLCBmdWxsT3B0aW9ucywgZnVuY3Rpb25UZXh0cywgdXNlZE9iamVjdHMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChmdWxsT3B0aW9ucy5zaG91bGRDYXRjaFRvSlNPTkVycm9ycykge1xuICAgICAgICByZXR1cm4gbWFrZVBsYWNlaG9sZGVyKFRva2VuU3Vic3RpdHV0aW9uS2V5LlRvSlNPTkZhaWxlZCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQ29udGFpbnMgdXRpbGl0eSBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cyBvcGVyYXRpb25zLlxuICovXG5cbmltcG9ydCB0eXBlIHsgUHJvbWlzYWJsZSB9IGZyb20gJ3R5cGUtZmVzdCc7XG5cbmltcG9ydCB7XG4gIGFib3J0U2lnbmFsQW55LFxuICBhYm9ydFNpZ25hbE5ldmVyLFxuICBhYm9ydFNpZ25hbFRpbWVvdXQsXG4gIHdhaXRGb3JBYm9ydFxufSBmcm9tICcuL2Fib3J0LWNvbnRyb2xsZXIudHMnO1xuaW1wb3J0IHtcbiAgZ2V0TGliRGVidWdnZXIsXG4gIHByaW50V2l0aFN0YWNrVHJhY2Vcbn0gZnJvbSAnLi9kZWJ1Zy50cyc7XG5pbXBvcnQge1xuICBBU1lOQ19XUkFQUEVSX0VSUk9SX01FU1NBR0UsXG4gIEN1c3RvbVN0YWNrVHJhY2VFcnJvcixcbiAgZW1pdEFzeW5jRXJyb3JFdmVudCxcbiAgZ2V0U3RhY2tUcmFjZSxcbiAgcHJpbnRFcnJvcixcbiAgU2lsZW50RXJyb3Jcbn0gZnJvbSAnLi9lcnJvci50cyc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi9mdW5jdGlvbi50cyc7XG5pbXBvcnQgeyBub3JtYWxpemVPcHRpb25hbFByb3BlcnRpZXMgfSBmcm9tICcuL29iamVjdC11dGlscy50cyc7XG5pbXBvcnQge1xuICBhc3NlcnQsXG4gIGFzc2VydE5vbk51bGxhYmxlXG59IGZyb20gJy4vdHlwZS1ndWFyZHMudHMnO1xuXG4vKipcbiAqIEEgdHlwZSByZXByZXNlbnRpbmcgYSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIGEge0BsaW5rIFByb21pc2V9LlxuICpcbiAqIEB0eXBlUGFyYW0gVCAtIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZS5cbiAqL1xuZXhwb3J0IHR5cGUgUHJvbWlzZVJlc29sdmU8VD4gPSB1bmRlZmluZWQgZXh0ZW5kcyBUID8gKHZhbHVlPzogUHJvbWlzZUxpa2U8VD4gfCBUKSA9PiB2b2lkXG4gIDogKHZhbHVlOiBQcm9taXNlTGlrZTxUPiB8IFQpID0+IHZvaWQ7XG5cbi8qKlxuICogT3B0aW9ucyBmb3Ige0BsaW5rIHJldHJ5V2l0aFRpbWVvdXR9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJldHJ5T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIGFib3J0IHNpZ25hbCB0byBjYW5jZWwgdGhlIHJldHJ5IG9wZXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGFib3J0U2lnbmFsPzogQWJvcnRTaWduYWw7XG5cbiAgLyoqXG4gICAqIEEgZGVsYXkgaW4gbWlsbGlzZWNvbmRzIGJldHdlZW4gcmV0cnkgYXR0ZW1wdHMuXG4gICAqL1xuICByZWFkb25seSByZXRyeURlbGF5SW5NaWxsaXNlY29uZHM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcmV0cnkgdGhlIGZ1bmN0aW9uIG9uIGVycm9yLlxuICAgKi9cbiAgcmVhZG9ubHkgc2hvdWxkUmV0cnlPbkVycm9yPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBtYXhpbXVtIHRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGdpdmluZyB1cCBvbiByZXRyeWluZy5cbiAgICovXG4gIHJlYWRvbmx5IHRpbWVvdXRJbk1pbGxpc2Vjb25kcz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBBZGRzIGFuIGVycm9yIGhhbmRsZXIgdG8gYSB7QGxpbmsgUHJvbWlzZX0gdGhhdCBjYXRjaGVzIGFueSBlcnJvcnMgYW5kIGVtaXRzIGFuIGFzeW5jIGVycm9yIGV2ZW50LlxuICpcbiAqIEBwYXJhbSBhc3luY0ZuIC0gVGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbiB0byBhZGQgYW4gZXJyb3IgaGFuZGxlciB0by5cbiAqIEBwYXJhbSBzdGFja1RyYWNlIC0gVGhlIHN0YWNrIHRyYWNlIG9mIHRoZSBzb3VyY2UgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbiBjb21wbGV0ZXMgb3IgZW1pdHMgYXN5bmMgZXJyb3IgZXZlbnQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRFcnJvckhhbmRsZXIoYXN5bmNGbjogKCkgPT4gUHJvbWlzZTx1bmtub3duPiwgc3RhY2tUcmFjZT86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBzdGFja1RyYWNlID8/PSBnZXRTdGFja1RyYWNlKDEpO1xuICB0cnkge1xuICAgIGF3YWl0IGFzeW5jRm4oKTtcbiAgfSBjYXRjaCAoYXN5bmNFcnJvcikge1xuICAgIGNvbnN0IHdyYXBwZWRFcnJvciA9IG5ldyBDdXN0b21TdGFja1RyYWNlRXJyb3IoQVNZTkNfV1JBUFBFUl9FUlJPUl9NRVNTQUdFLCBzdGFja1RyYWNlLCBhc3luY0Vycm9yKTtcbiAgICBpZiAoaGFuZGxlU2lsZW50RXJyb3Iod3JhcHBlZEVycm9yKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbWl0QXN5bmNFcnJvckV2ZW50KHdyYXBwZWRFcnJvcik7XG4gIH1cbn1cblxuLyoqXG4gKiBGaWx0ZXJzIGFuIGFycmF5IGFzeW5jaHJvbm91c2x5LCBrZWVwaW5nIG9ubHkgdGhlIGVsZW1lbnRzIHRoYXQgc2F0aXNmeSB0aGUgcHJvdmlkZWQgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICpcbiAqIEB0eXBlUGFyYW0gVCAtIFRoZSB0eXBlIG9mIGVsZW1lbnRzIGluIHRoZSBpbnB1dCBhcnJheS5cbiAqIEBwYXJhbSBhcnIgLSBUaGUgYXJyYXkgdG8gZmlsdGVyLlxuICogQHBhcmFtIHByZWRpY2F0ZSAtIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQuXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdpdGggYW4gYXJyYXkgb2YgZWxlbWVudHMgdGhhdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhc3luY0ZpbHRlcjxUPihhcnI6IFRbXSwgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIGFycmF5OiBUW10pID0+IFByb21pc2FibGU8Ym9vbGVhbj4pOiBQcm9taXNlPFRbXT4ge1xuICBjb25zdCBhbnM6IFRbXSA9IFtdO1xuXG4gIGNvbnN0IGxlbmd0aCA9IGFyci5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIU9iamVjdC5oYXNPd24oYXJyLCBpKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgaXRlbSA9IGFycltpXSBhcyBUO1xuICAgIGlmIChhd2FpdCBwcmVkaWNhdGUoaXRlbSwgaSwgYXJyKSkge1xuICAgICAgYW5zLnB1c2goaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFucztcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIGFuIGFycmF5IGFzeW5jaHJvbm91c2x5IGluIHBsYWNlLCBrZWVwaW5nIG9ubHkgdGhlIGVsZW1lbnRzIHRoYXQgc2F0aXNmeSB0aGUgcHJvdmlkZWQgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICpcbiAqIEB0eXBlUGFyYW0gVCAtIFRoZSB0eXBlIG9mIGVsZW1lbnRzIGluIHRoZSBpbnB1dCBhcnJheS5cbiAqIEBwYXJhbSBhcnIgLSBUaGUgYXJyYXkgdG8gZmlsdGVyLlxuICogQHBhcmFtIHByZWRpY2F0ZSAtIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQuXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGFycmF5IGlzIGZpbHRlcmVkLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXN5bmNGaWx0ZXJJblBsYWNlPFQ+KGFycjogVFtdLCBwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IFRbXSkgPT4gUHJvbWlzYWJsZTxib29sZWFuPik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBsZW5ndGggPSBhcnIubGVuZ3RoO1xuICBsZXQgd3JpdGVJbmRleCA9IDA7XG4gIGZvciAobGV0IHJlYWRJbmRleCA9IDA7IHJlYWRJbmRleCA8IGxlbmd0aDsgcmVhZEluZGV4KyspIHtcbiAgICBpZiAoIU9iamVjdC5oYXNPd24oYXJyLCByZWFkSW5kZXgpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50ID0gYXJyW3JlYWRJbmRleF0gYXMgVDtcbiAgICBpZiAoYXdhaXQgcHJlZGljYXRlKGN1cnJlbnQsIHJlYWRJbmRleCwgYXJyKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtYXRvbWljLXVwZGF0ZXMgLS0gWWVzLCBpdCBpcyBhIHBvdGVudGlhbCByYWNlIGNvbmRpdGlvbiwgYnV0IEkgZG9uJ3QgYW4gZWxlZ2FudCB3YXkgdG8gZml4IGl0LlxuICAgICAgYXJyW3dyaXRlSW5kZXgrK10gPSBjdXJyZW50O1xuICAgIH1cbiAgfVxuICBhcnIubGVuZ3RoID0gd3JpdGVJbmRleDtcbn1cblxuLyoqXG4gKiBNYXBzIG92ZXIgYW4gYXJyYXkgYXN5bmNocm9ub3VzbHksIGFwcGx5aW5nIHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbiB0byBlYWNoIGVsZW1lbnQsIGFuZCB0aGVuIGZsYXR0ZW5zIHRoZSByZXN1bHRzIGludG8gYSBzaW5nbGUgYXJyYXkuXG4gKlxuICogQHR5cGVQYXJhbSBUIC0gVGhlIHR5cGUgb2YgZWxlbWVudHMgaW4gdGhlIGlucHV0IGFycmF5LlxuICogQHR5cGVQYXJhbSBVIC0gVGhlIHR5cGUgb2YgZWxlbWVudHMgaW4gdGhlIG91dHB1dCBhcnJheS5cbiAqIEBwYXJhbSBhcnIgLSBUaGUgYXJyYXkgdG8gbWFwIG92ZXIgYW5kIGZsYXR0ZW4uXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50LlxuICogQHJldHVybnMgQSB7QGxpbmsgUHJvbWlzZX0gdGhhdCByZXNvbHZlcyB3aXRoIGEgZmxhdHRlbmVkIGFycmF5IG9mIHRoZSByZXN1bHRzIG9mIHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFzeW5jRmxhdE1hcDxULCBVPihhcnI6IFRbXSwgY2FsbGJhY2s6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IFRbXSkgPT4gUHJvbWlzYWJsZTxVW10+KTogUHJvbWlzZTxVW10+IHtcbiAgcmV0dXJuIChhd2FpdCBhc3luY01hcChhcnIsIGNhbGxiYWNrKSkuZmxhdCgpO1xufVxuXG4vKipcbiAqIE1hcHMgb3ZlciBhbiBhcnJheSBhc3luY2hyb25vdXNseSwgYXBwbHlpbmcgdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGVhY2ggZWxlbWVudC5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBUaGUgdHlwZSBvZiBlbGVtZW50cyBpbiB0aGUgaW5wdXQgYXJyYXkuXG4gKiBAdHlwZVBhcmFtIFUgLSBUaGUgdHlwZSBvZiBlbGVtZW50cyBpbiB0aGUgb3V0cHV0IGFycmF5LlxuICogQHBhcmFtIGFyciAtIFRoZSBhcnJheSB0byBtYXAgb3Zlci5cbiAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQuXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdpdGggYW4gYXJyYXkgb2YgdGhlIHJlc3VsdHMgb2YgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXN5bmNNYXA8VCwgVT4oYXJyOiBUW10sIGNhbGxiYWNrOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIGFycmF5OiBUW10pID0+IFByb21pc2FibGU8VT4pOiBQcm9taXNlPFVbXT4ge1xuICByZXR1cm4gYXdhaXQgcHJvbWlzZUFsbFNlcXVlbnRpYWxseShhcnIubWFwKGNhbGxiYWNrKSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uIHRvIGEgc3luY2hyb25vdXMgb25lIGJ5IGF1dG9tYXRpY2FsbHkgaGFuZGxpbmcgdGhlIFByb21pc2UgcmVqZWN0aW9uLlxuICpcbiAqIEB0eXBlUGFyYW0gQXJncyAtIFRoZSB0eXBlcyBvZiB0aGUgYXJndW1lbnRzIHRoZSBmdW5jdGlvbiBhY2NlcHRzLlxuICogQHBhcmFtIGFzeW5jRnVuYyAtIFRoZSBhc3luY2hyb25vdXMgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEBwYXJhbSBzdGFja1RyYWNlIC0gVGhlIHN0YWNrIHRyYWNlIG9mIHRoZSBzb3VyY2UgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgd3JhcHMgdGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbiBpbiBhIHN5bmNocm9ub3VzIGludGVyZmFjZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRBc3luY1RvU3luYzxBcmdzIGV4dGVuZHMgdW5rbm93bltdPihhc3luY0Z1bmM6ICguLi5hcmdzOiBBcmdzKSA9PiBQcm9taXNlPHVua25vd24+LCBzdGFja1RyYWNlPzogc3RyaW5nKTogKC4uLmFyZ3M6IEFyZ3MpID0+IHZvaWQge1xuICBzdGFja1RyYWNlID8/PSBnZXRTdGFja1RyYWNlKDEpO1xuICByZXR1cm4gKC4uLmFyZ3M6IEFyZ3MpOiB2b2lkID0+IHtcbiAgICBhc3NlcnROb25OdWxsYWJsZShzdGFja1RyYWNlKTtcbiAgICBjb25zdCBpbm5lclN0YWNrVHJhY2UgPSBnZXRTdGFja1RyYWNlKDEpO1xuICAgIHN0YWNrVHJhY2UgPSBgJHtzdGFja1RyYWNlfVxcbiAgICBhdCAtLS0gY29udmVydEFzeW5jVG9TeW5jIC0tLSAoMClcXG4ke2lubmVyU3RhY2tUcmFjZX1gO1xuICAgIGludm9rZUFzeW5jU2FmZWx5KCgpID0+IGFzeW5jRnVuYyguLi5hcmdzKSwgc3RhY2tUcmFjZSk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBzeW5jaHJvbm91cyBmdW5jdGlvbiB0byBhbiBhc3luY2hyb25vdXMgb25lIGJ5IHdyYXBwaW5nIGl0IGluIGEge0BsaW5rIFByb21pc2V9LlxuICpcbiAqIEB0eXBlUGFyYW0gQXJncyAtIFRoZSB0eXBlcyBvZiB0aGUgYXJndW1lbnRzIHRoZSBmdW5jdGlvbiBhY2NlcHRzLlxuICogQHR5cGVQYXJhbSBSZXN1bHQgLSBUaGUgdHlwZSBvZiB0aGUgZnVuY3Rpb24ncyByZXR1cm4gdmFsdWUuXG4gKiBAcGFyYW0gc3luY0ZuIC0gVGhlIHN5bmNocm9ub3VzIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgd3JhcHMgdGhlIHN5bmNocm9ub3VzIGZ1bmN0aW9uIGluIGFuIGFzeW5jaHJvbm91cyBpbnRlcmZhY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0U3luY1RvQXN5bmM8QXJncyBleHRlbmRzIHVua25vd25bXSwgUmVzdWx0PihzeW5jRm46ICguLi5hcmdzOiBBcmdzKSA9PiBSZXN1bHQpOiAoLi4uYXJnczogQXJncykgPT4gUHJvbWlzZTxSZXN1bHQ+IHtcbiAgcmV0dXJuIGFzeW5jICguLi5hcmdzOiBBcmdzKTogUHJvbWlzZTxSZXN1bHQ+ID0+IHtcbiAgICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgICByZXR1cm4gc3luY0ZuKC4uLmFyZ3MpO1xuICB9O1xufVxuXG4vKipcbiAqIEhhbmRsZXMgYSBzaWxlbnQgZXJyb3IuXG4gKlxuICogQHBhcmFtIGVycm9yIC0gVGhlIGVycm9yIHRvIGhhbmRsZS5cbiAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIGVycm9yIGlzIGEgc2lsZW50IGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlU2lsZW50RXJyb3IoZXJyb3I6IHVua25vd24pOiBib29sZWFuIHtcbiAgbGV0IGNhdXNlID0gZXJyb3I7XG4gIHdoaWxlICghKGNhdXNlIGluc3RhbmNlb2YgU2lsZW50RXJyb3IpKSB7XG4gICAgaWYgKCEoY2F1c2UgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjYXVzZSA9IGNhdXNlLmNhdXNlO1xuICB9XG5cbiAgZ2V0TGliRGVidWdnZXIoJ0FzeW5jOmhhbmRsZVNpbGVudEVycm9yJykoZXJyb3IpO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBJZ25vcmVzIGFuIGVycm9yIHRoYXQgaXMgdGhyb3duIGJ5IGFuIGFzeW5jaHJvbm91cyBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gcHJvbWlzZSAtIFRoZSBwcm9taXNlIHRvIGlnbm9yZSB0aGUgZXJyb3Igb2YuXG4gKiBAcGFyYW0gZmFsbGJhY2tWYWx1ZSAtIEFsd2F5cyBgdW5kZWZpbmVkYC5cbiAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgYXN5bmNocm9ub3VzIGZ1bmN0aW9uIGNvbXBsZXRlcyBvciBmYWlscy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlnbm9yZUVycm9yKHByb21pc2U6IFByb21pc2U8dW5rbm93bj4sIGZhbGxiYWNrVmFsdWU/OiB1bmRlZmluZWQpOiBQcm9taXNlPHZvaWQ+O1xuLyoqXG4gKiBJbnZva2VzIGFuIGFzeW5jaHJvbm91cyBmdW5jdGlvbiBhbmQgcmV0dXJucyBhIGZhbGxiYWNrIHZhbHVlIGlmIGFuIGVycm9yIGlzIHRocm93bi5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgdGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbi5cbiAqIEBwYXJhbSBwcm9taXNlIC0gVGhlIHByb21pc2UgdG8gaWdub3JlIHRoZSBlcnJvciBvZi5cbiAqIEBwYXJhbSBmYWxsYmFja1ZhbHVlIC0gVGhlIHZhbHVlIHRvIHJldHVybiBpZiBhbiBlcnJvciBpcyB0aHJvd24uXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHZhbHVlIHJldHVybmVkIGJ5IHRoZSBhc3luY2hyb25vdXMgZnVuY3Rpb24gb3IgdGhlIGZhbGxiYWNrIHZhbHVlIGlmIGFuIGVycm9yIGlzIHRocm93bi5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlnbm9yZUVycm9yPFQ+KHByb21pc2U6IFByb21pc2U8VD4sIGZhbGxiYWNrVmFsdWU6IFQpOiBQcm9taXNlPFQ+O1xuLyoqXG4gKiBJZ25vcmVzIGFuIGVycm9yIHRoYXQgaXMgdGhyb3duIGJ5IGFuIGFzeW5jaHJvbm91cyBmdW5jdGlvbi5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgdGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbi5cbiAqIEBwYXJhbSBwcm9taXNlIC0gVGhlIHByb21pc2UgdG8gaWdub3JlIHRoZSBlcnJvciBvZi5cbiAqIEBwYXJhbSBmYWxsYmFja1ZhbHVlIC0gVGhlIHZhbHVlIHRvIHJldHVybiBpZiBhbiBlcnJvciBpcyB0aHJvd24uXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHZhbHVlIHJldHVybmVkIGJ5IHRoZSBhc3luY2hyb25vdXMgZnVuY3Rpb24gb3IgdGhlIGZhbGxiYWNrIHZhbHVlIGlmIGFuIGVycm9yIGlzIHRocm93bi5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlnbm9yZUVycm9yPFQ+KHByb21pc2U6IFByb21pc2U8VD4sIGZhbGxiYWNrVmFsdWU/OiBUKTogUHJvbWlzZTxUIHwgdm9pZD4ge1xuICBjb25zdCBpZ25vcmVFcnJvckRlYnVnZ2VyID0gZ2V0TGliRGVidWdnZXIoJ0FzeW5jOmlnbm9yZUVycm9yJyk7XG4gIGNvbnN0IHN0YWNrVHJhY2UgPSBnZXRTdGFja1RyYWNlKDEpO1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBwcm9taXNlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWdub3JlRXJyb3JEZWJ1Z2dlcignSWdub3JlZCBlcnJvcicsIG5ldyBDdXN0b21TdGFja1RyYWNlRXJyb3IoJ0lnbm9yZWQgZXJyb3InLCBzdGFja1RyYWNlLCBlKSk7XG4gICAgcmV0dXJuIGZhbGxiYWNrVmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnZva2VzIGEge0BsaW5rIFByb21pc2V9IGFuZCBzYWZlbHkgaGFuZGxlcyBhbnkgZXJyb3JzIGJ5IGNhdGNoaW5nIHRoZW0gYW5kIGVtaXR0aW5nIGFuIGFzeW5jIGVycm9yIGV2ZW50LlxuICpcbiAqIEBwYXJhbSBhc3luY0ZuIC0gVGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbiB0byBpbnZva2Ugc2FmZWx5LlxuICogQHBhcmFtIHN0YWNrVHJhY2UgLSBUaGUgc3RhY2sgdHJhY2Ugb2YgdGhlIHNvdXJjZSBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludm9rZUFzeW5jU2FmZWx5KGFzeW5jRm46ICgpID0+IFByb21pc2U8dW5rbm93bj4sIHN0YWNrVHJhY2U/OiBzdHJpbmcpOiB2b2lkIHtcbiAgc3RhY2tUcmFjZSA/Pz0gZ2V0U3RhY2tUcmFjZSgxKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXZvaWQgLS0gV2UgbmVlZCB0byBmaXJlLWFuZC1mb3JnZXQuXG4gIHZvaWQgYWRkRXJyb3JIYW5kbGVyKGFzeW5jRm4sIHN0YWNrVHJhY2UpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uIGFmdGVyIGEgZGVsYXkuXG4gKlxuICogQHBhcmFtIGFzeW5jRm4gLSBUaGUgYXN5bmNocm9ub3VzIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSBkZWxheUluTWlsbGlzZWNvbmRzIC0gVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSBzdGFja1RyYWNlIC0gVGhlIHN0YWNrIHRyYWNlIG9mIHRoZSBzb3VyY2UgZnVuY3Rpb24uXG4gKiBAcGFyYW0gYWJvcnRTaWduYWwgLSBUaGUgYWJvcnQgc2lnbmFsIHRvIGxpc3RlbiB0by5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludm9rZUFzeW5jU2FmZWx5QWZ0ZXJEZWxheShcbiAgYXN5bmNGbjogKGFib3J0U2lnbmFsOiBBYm9ydFNpZ25hbCkgPT4gUHJvbWlzYWJsZTx2b2lkPixcbiAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IDAsXG4gIHN0YWNrVHJhY2U/OiBzdHJpbmcsXG4gIGFib3J0U2lnbmFsPzogQWJvcnRTaWduYWxcbik6IHZvaWQge1xuICBhYm9ydFNpZ25hbCA/Pz0gYWJvcnRTaWduYWxOZXZlcigpO1xuICBhYm9ydFNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuICBzdGFja1RyYWNlID8/PSBnZXRTdGFja1RyYWNlKDEpO1xuICBpbnZva2VBc3luY1NhZmVseShhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgc2xlZXAoZGVsYXlJbk1pbGxpc2Vjb25kcywgYWJvcnRTaWduYWwsIHRydWUpO1xuICAgIGF3YWl0IGFzeW5jRm4oYWJvcnRTaWduYWwpO1xuICB9LCBzdGFja1RyYWNlKTtcbn1cblxuLyoqXG4gKiBFeGVjdXRlcyBhc3luYyBmdW5jdGlvbnMgc2VxdWVudGlhbGx5LlxuICpcbiAqIEB0eXBlUGFyYW0gVCAtIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZS5cbiAqIEBwYXJhbSBhc3luY0ZucyAtIFRoZSBhc3luYyBmdW5jdGlvbnMgdG8gZXhlY3V0ZSBzZXF1ZW50aWFsbHkuXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdpdGggYW4gYXJyYXkgb2YgdGhlIHJlc3VsdHMgb2YgdGhlIGFzeW5jIGZ1bmN0aW9ucy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByb21pc2VBbGxBc3luY0Zuc1NlcXVlbnRpYWxseTxUPihhc3luY0ZuczogKCgpID0+IFByb21pc2FibGU8VD4pW10pOiBQcm9taXNlPFRbXT4ge1xuICBjb25zdCByZXN1bHRzOiBUW10gPSBbXTtcbiAgZm9yIChjb25zdCBhc3luY0ZuIG9mIGFzeW5jRm5zKSB7XG4gICAgcmVzdWx0cy5wdXNoKGF3YWl0IGFzeW5jRm4oKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbi8qKlxuICogRXhlY3V0ZXMgcHJvbWlzZXMgc2VxdWVudGlhbGx5LlxuICpcbiAqIEB0eXBlUGFyYW0gVCAtIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZS5cbiAqIEBwYXJhbSBwcm9taXNlcyAtIFRoZSBwcm9taXNlcyB0byBleGVjdXRlIHNlcXVlbnRpYWxseS5cbiAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgcmVzb2x2ZXMgd2l0aCBhbiBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiB0aGUgcHJvbWlzZXMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcm9taXNlQWxsU2VxdWVudGlhbGx5PFQ+KHByb21pc2VzOiBQcm9taXNhYmxlPFQ+W10pOiBQcm9taXNlPFRbXT4ge1xuICByZXR1cm4gYXdhaXQgcHJvbWlzZUFsbEFzeW5jRm5zU2VxdWVudGlhbGx5KHByb21pc2VzLm1hcCgocHJvbWlzZSkgPT4gKCkgPT4gcHJvbWlzZSkpO1xufVxuXG5jb25zdCB0ZXJtaW5hdGVSZXRyeUVycm9ycyA9IG5ldyBXZWFrU2V0PEVycm9yPigpO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHtAbGluayByZXRyeVdpdGhUaW1lb3V0fS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXRyeVdpdGhUaW1lb3V0UGFyYW1zIHtcbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIHRpbWVvdXQuXG4gICAqXG4gICAqIEBwYXJhbSBjb250ZXh0IC0gVGhlIHRpbWVvdXQgY29udGV4dC5cbiAgICovXG4gIHJlYWRvbmx5IG9uVGltZW91dD86ICh0aGlzOiB2b2lkLCBjb250ZXh0OiBUaW1lb3V0Q29udGV4dCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUuXG4gICAqXG4gICAqIEBwYXJhbSBhYm9ydFNpZ25hbCAtIFRoZSBhYm9ydCBzaWduYWwgdG8gbGlzdGVuIHRvLlxuICAgKiBAcmV0dXJucyBUaGUgcmVzdWx0IG9mIHRoZSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IG9wZXJhdGlvbkZuOiAodGhpczogdm9pZCwgYWJvcnRTaWduYWw6IEFib3J0U2lnbmFsKSA9PiBQcm9taXNhYmxlPGJvb2xlYW4+O1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgb3BlcmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgb3BlcmF0aW9uTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJldHJ5IG9wdGlvbnMuXG4gICAqL1xuICByZWFkb25seSByZXRyeU9wdGlvbnM/OiBSZXRyeU9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGFjayB0cmFjZSBvZiB0aGUgc291cmNlIGZ1bmN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhY2tUcmFjZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciB7QGxpbmsgcnVuV2l0aFRpbWVvdXR9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJ1bldpdGhUaW1lb3V0UGFyYW1zPFJlc3VsdD4ge1xuICAvKipcbiAgICogVGhlIGNvbnRleHQgb2YgdGhlIGZ1bmN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGV4dD86IHVua25vd247XG5cbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIHRpbWVvdXQuXG4gICAqXG4gICAqIEBwYXJhbSBjb250ZXh0IC0gVGhlIHRpbWVvdXQgY29udGV4dC5cbiAgICovXG4gIHJlYWRvbmx5IG9uVGltZW91dD86ICh0aGlzOiB2b2lkLCBjb250ZXh0OiBUaW1lb3V0Q29udGV4dCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogVGhlIG9wZXJhdGlvbiBmdW5jdGlvbiB0byBleGVjdXRlLlxuICAgKlxuICAgKiBAcGFyYW0gYWJvcnRTaWduYWwgLSBUaGUgYWJvcnQgc2lnbmFsIHRvIGxpc3RlbiB0by5cbiAgICogQHJldHVybnMgVGhlIHJlc3VsdCBvZiB0aGUgZnVuY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBvcGVyYXRpb25GbjogKHRoaXM6IHZvaWQsIGFib3J0U2lnbmFsOiBBYm9ydFNpZ25hbCkgPT4gUHJvbWlzYWJsZTxSZXN1bHQ+O1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgb3BlcmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgb3BlcmF0aW9uTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHN0YWNrIHRyYWNlIG9mIHRoZSBzb3VyY2UgZnVuY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBzdGFja1RyYWNlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSB0aW1lIHRvIHdhaXQgaW4gbWlsbGlzZWNvbmRzLlxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dEluTWlsbGlzZWNvbmRzOiBudW1iZXI7XG59XG5cbi8qKlxuICogQ29udGV4dCBwcm92aWRlZCB0byB0aGUgdGltZW91dCBoYW5kbGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVvdXRDb250ZXh0IHtcbiAgLyoqXG4gICAqIFRoZSBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgc2luY2UgdGhlIG9wZXJhdGlvbiBzdGFydGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZHVyYXRpb246IG51bWJlcjtcbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGNvbXBsZXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgb3BlcmF0aW9uIGNvbXBsZXRlcy5cbiAgICovXG4gIHJlYWRvbmx5IG9uT3BlcmF0aW9uQ29tcGxldGVkOiAoY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHZvaWQ7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgb3BlcmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgb3BlcmF0aW9uTmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogVGVybWluYXRlcyB0aGUgb3BlcmF0aW9uIHRoYXQgdGltZWQgb3V0LlxuICAgKi9cbiAgcmVhZG9ubHkgdGVybWluYXRlT3BlcmF0aW9uOiAoKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIE1hcmtzIGFuIGVycm9yIHRvIHRlcm1pbmF0ZSByZXRyeSBsb2dpYy5cbiAqXG4gKiBAcGFyYW0gZXJyb3IgLSBUaGUgZXJyb3IgdG8gbWFyayB0byB0ZXJtaW5hdGUgcmV0cnkgbG9naWMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXJrc0FzVGVybWluYXRlUmV0cnkoZXJyb3I6IEVycm9yKTogdm9pZCB7XG4gIHRlcm1pbmF0ZVJldHJ5RXJyb3JzLmFkZChlcnJvcik7XG59XG5cbi8qKlxuICogQW4gYXN5bmMgZnVuY3Rpb24gdGhhdCBuZXZlciBlbmRzLlxuICpcbiAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgbmV2ZXIgcmVzb2x2ZXMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBuZXZlckVuZHMoKTogUHJvbWlzZTxuZXZlcj4ge1xuICBhd2FpdCBuZXcgUHJvbWlzZSgoKSA9PiB7XG4gICAgbm9vcCgpO1xuICB9KTtcbiAgLyogdjggaWdub3JlIHN0YXJ0IC0tIEV4aGF1c3RpdmUgc3dpdGNoIGd1YXJkOyB0aGUgYXdhaXQgYWJvdmUgbmV2ZXIgcmVzb2x2ZXMuICovXG4gIGFzc2VydChmYWxzZSwgJ1Nob3VsZCBuZXZlciBoYXBwZW4nKTtcbiAgLyogdjggaWdub3JlIHN0b3AgKi9cbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBuZXh0IHRpY2suXG4gKlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgbmV4dCB0aWNrIGlzIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5leHRUaWNrQXN5bmMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgcmVzb2x2ZSgpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBuZXh0IHF1ZXVlIG1pY3JvdGFzay5cbiAqXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBuZXh0IHF1ZXVlIG1pY3JvdGFzayBpcyBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBxdWV1ZU1pY3JvdGFza0FzeW5jKCk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5leHQgcmVxdWVzdCBhbmltYXRpb24gZnJhbWUuXG4gKlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgbmV4dCByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBpcyBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWVBc3luYygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0cmllcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gdW50aWwgaXQgcmV0dXJucyBgdHJ1ZWAgb3IgdGhlIHRpbWVvdXQgaXMgcmVhY2hlZC5cbiAqXG4gKiBAcGFyYW0gcGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgZm9yIHRoZSBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgZnVuY3Rpb24gcmV0dXJucyBgdHJ1ZWAgb3IgcmVqZWN0cyB3aGVuIHRoZSB0aW1lb3V0IGlzIHJlYWNoZWQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXRyeVdpdGhUaW1lb3V0KHBhcmFtczogUmV0cnlXaXRoVGltZW91dFBhcmFtcyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXRyeVdpdGhUaW1lb3V0RGVidWdnZXIgPSBnZXRMaWJEZWJ1Z2dlcignQXN5bmM6cmV0cnlXaXRoVGltZW91dCcpO1xuICBjb25zdCBzdGFja1RyYWNlID0gcGFyYW1zLnN0YWNrVHJhY2UgPz8gZ2V0U3RhY2tUcmFjZSgxKTtcbiAgY29uc3QgREVGQVVMVF9SRVRSWV9PUFRJT05TID0ge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzIC0tIEV4dHJhY3RpbmcgbWFnaWMgbnVtYmVyIGFzIGEgY29uc3RhbnQgd291bGQgYmUgcmVwZXRpdGl2ZSwgYXMgdGhlIHZhbHVlIGlzIHVzZWQgb25seSBvbmNlIGFuZCBpdHMgbmFtZSB3b3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydHkuXG4gICAgcmV0cnlEZWxheUluTWlsbGlzZWNvbmRzOiAxMDAsXG4gICAgc2hvdWxkUmV0cnlPbkVycm9yOiBmYWxzZSxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVycyAtLSBFeHRyYWN0aW5nIG1hZ2ljIG51bWJlciBhcyBhIGNvbnN0YW50IHdvdWxkIGJlIHJlcGV0aXRpdmUsIGFzIHRoZSB2YWx1ZSBpcyB1c2VkIG9ubHkgb25jZSBhbmQgaXRzIG5hbWUgd291bGQgYmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnR5LlxuICAgIHRpbWVvdXRJbk1pbGxpc2Vjb25kczogNTAwMFxuICB9O1xuICBjb25zdCBmdWxsT3B0aW9ucyA9IHsgLi4uREVGQVVMVF9SRVRSWV9PUFRJT05TLCAuLi5wYXJhbXMucmV0cnlPcHRpb25zIH07XG4gIGZ1bGxPcHRpb25zLmFib3J0U2lnbmFsPy50aHJvd0lmQWJvcnRlZCgpO1xuXG4gIGF3YWl0IHJ1bldpdGhUaW1lb3V0KG5vcm1hbGl6ZU9wdGlvbmFsUHJvcGVydGllczxSdW5XaXRoVGltZW91dFBhcmFtczx2b2lkPj4oe1xuICAgIGNvbnRleHQ6IHsgb3BlcmF0aW9uTmFtZTogcGFyYW1zLm9wZXJhdGlvbk5hbWUgPz8gJycsIHJldHJ5Rm46IHBhcmFtcy5vcGVyYXRpb25GbiB9LFxuICAgIG9uVGltZW91dDogcGFyYW1zLm9uVGltZW91dCxcbiAgICBhc3luYyBvcGVyYXRpb25GbihhYm9ydFNpZ25hbDogQWJvcnRTaWduYWwpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGNvbnN0IGNvbWJpbmVkQWJvcnRTaWduYWwgPSBhYm9ydFNpZ25hbEFueShmdWxsT3B0aW9ucy5hYm9ydFNpZ25hbCwgYWJvcnRTaWduYWwpO1xuICAgICAgY29tYmluZWRBYm9ydFNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuICAgICAgbGV0IGF0dGVtcHQgPSAwO1xuICAgICAgd2hpbGUgKCFjb21iaW5lZEFib3J0U2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgYXR0ZW1wdCsrO1xuICAgICAgICBsZXQgaXNTdWNjZXNzOiBib29sZWFuO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlzU3VjY2VzcyA9IGF3YWl0IHBhcmFtcy5vcGVyYXRpb25Gbihjb21iaW5lZEFib3J0U2lnbmFsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVubmVjZXNzYXJ5LWNvbmRpdGlvbiAtLSBJdCBtaWdodCBjaGFuZ2VkIGluc2lkZSBgZm4oKWAuIEVTTGludCBtaXN0YWtlbmx5IGRvZXMgbm90IHJlY29nbml6ZSBpdC5cbiAgICAgICAgICBpZiAoY29tYmluZWRBYm9ydFNpZ25hbC5hYm9ydGVkIHx8ICFmdWxsT3B0aW9ucy5zaG91bGRSZXRyeU9uRXJyb3IgfHwgdGVybWluYXRlUmV0cnlFcnJvcnMuaGFzKGVycm9yIGFzIEVycm9yKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEN1c3RvbVN0YWNrVHJhY2VFcnJvcigncmV0cnlXaXRoVGltZW91dCBmYWlsZWQnLCBzdGFja1RyYWNlLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHByaW50RXJyb3IoZXJyb3IpO1xuICAgICAgICAgIGlzU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N1Y2Nlc3MpIHtcbiAgICAgICAgICBwcmludFdpdGhTdGFja1RyYWNlKHJldHJ5V2l0aFRpbWVvdXREZWJ1Z2dlciwgc3RhY2tUcmFjZSwgYFJldHJ5IGNvbXBsZXRlZCBzdWNjZXNzZnVsbHkgYWZ0ZXIgJHtTdHJpbmcoYXR0ZW1wdCl9IGF0dGVtcHRzYCwge1xuICAgICAgICAgICAgb3BlcmF0aW9uRm46IHBhcmFtcy5vcGVyYXRpb25GbixcbiAgICAgICAgICAgIG9wZXJhdGlvbk5hbWU6IHBhcmFtcy5vcGVyYXRpb25OYW1lID8/ICcnXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpbnRXaXRoU3RhY2tUcmFjZShcbiAgICAgICAgICByZXRyeVdpdGhUaW1lb3V0RGVidWdnZXIsXG4gICAgICAgICAgc3RhY2tUcmFjZSxcbiAgICAgICAgICBgUmV0cnkgYXR0ZW1wdCAke1N0cmluZyhhdHRlbXB0KX0gY29tcGxldGVkIHVuc3VjY2Vzc2Z1bGx5LiBUcnlpbmcgYWdhaW4gaW4gJHtTdHJpbmcoZnVsbE9wdGlvbnMucmV0cnlEZWxheUluTWlsbGlzZWNvbmRzKX0gbWlsbGlzZWNvbmRzYCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcGVyYXRpb25GbjogcGFyYW1zLm9wZXJhdGlvbkZuLFxuICAgICAgICAgICAgb3BlcmF0aW9uTmFtZTogcGFyYW1zLm9wZXJhdGlvbk5hbWUgPz8gJydcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgYXdhaXQgc2xlZXAoZnVsbE9wdGlvbnMucmV0cnlEZWxheUluTWlsbGlzZWNvbmRzLCBhYm9ydFNpZ25hbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBvcGVyYXRpb25OYW1lOiBwYXJhbXMub3BlcmF0aW9uTmFtZSA/PyAnJyxcbiAgICBzdGFja1RyYWNlLFxuICAgIHRpbWVvdXRJbk1pbGxpc2Vjb25kczogZnVsbE9wdGlvbnMudGltZW91dEluTWlsbGlzZWNvbmRzXG4gIH0pKTtcbn1cblxuLyoqXG4gKiBFeGVjdXRlcyBhIGZ1bmN0aW9uIHdpdGggYSB0aW1lb3V0LiBJZiB0aGUgZnVuY3Rpb24gZG9lcyBub3QgY29tcGxldGUgd2l0aGluIHRoZSBzcGVjaWZpZWQgdGltZSwgaXQgaXMgY29uc2lkZXJlZCB0byBoYXZlIHRpbWVkIG91dC5cbiAqXG4gKiBJZiBgREVCVUc9b2JzaWRpYW4tZGV2LXV0aWxzOkFzeW5jOnJ1bldpdGhUaW1lb3V0YCBpcyBzZXQsIHRoZSBleGVjdXRpb24gaXMgbm90IHRlcm1pbmF0ZWQgYWZ0ZXIgdGhlIHRpbWVvdXQgYW5kIHRoZSBmdW5jdGlvbiBpcyBhbGxvd2VkIHRvIHJ1biBpbmRlZmluaXRlbHkuXG4gKlxuICogQHR5cGVQYXJhbSBSZXN1bHQgLSBUaGUgdHlwZSBvZiB0aGUgcmVzdWx0IGZyb20gdGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbi5cbiAqIEBwYXJhbSBwYXJhbXMgLSBUaGUgcGFyYW1ldGVycyBmb3IgdGhlIGZ1bmN0aW9uLlxuICogQHJldHVybnMgQSB7QGxpbmsgUHJvbWlzZX0gdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZXN1bHQgb2YgdGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbiBvciByZWplY3RzIGlmIGl0IHRpbWVzIG91dC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bldpdGhUaW1lb3V0PFJlc3VsdD4ocGFyYW1zOiBSdW5XaXRoVGltZW91dFBhcmFtczxSZXN1bHQ+KTogUHJvbWlzZTxSZXN1bHQ+IHtcbiAgY29uc3Qgc3RhY2tUcmFjZSA9IHBhcmFtcy5zdGFja1RyYWNlID8/IGdldFN0YWNrVHJhY2UoMSk7XG4gIGNvbnN0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIGNvbnN0IHJ1bkFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgY29uc3QgdGltZW91dEFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcblxuICBsZXQgcmVzdWx0OiBudWxsIHwgUmVzdWx0ID0gbnVsbDtcbiAgbGV0IGhhc1Jlc3VsdCA9IGZhbHNlO1xuICBsZXQgaXNDb21wbGV0ZWQgPSBmYWxzZTtcbiAgY29uc3QgcnVuV2l0aFRpbWVvdXREZWJ1Z2dlciA9IGdldExpYkRlYnVnZ2VyKCdBc3luYzpydW5XaXRoVGltZW91dCcpO1xuICBjb25zdCBvblRpbWVvdXQgPSBwYXJhbXMub25UaW1lb3V0ID8/IGRlZmF1bHRPblRpbWVvdXQ7XG5cbiAgYXdhaXQgUHJvbWlzZS5yYWNlKFtydW4oKSwgaW5uZXJUaW1lb3V0KCldKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS1jb25kaXRpb24gLS0gSXQgbWlnaHQgY2hhbmdlZCBpbnNpZGUgYHJ1bigpYC4gRVNMaW50IG1pc3Rha2VubHkgZG9lcyBub3QgcmVjb2duaXplIGl0LlxuICBpZiAoaGFzUmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdCBhcyBSZXN1bHQ7XG4gIH1cblxuICB0aHJvdyBuZXcgQ3VzdG9tU3RhY2tUcmFjZUVycm9yKCdSdW4gd2l0aCB0aW1lb3V0IGZhaWxlZCcsIHN0YWNrVHJhY2UsIHJ1bkFib3J0Q29udHJvbGxlci5zaWduYWwucmVhc29uKTtcblxuICBhc3luYyBmdW5jdGlvbiBydW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGF3YWl0IHBhcmFtcy5vcGVyYXRpb25GbihydW5BYm9ydENvbnRyb2xsZXIuc2lnbmFsKTtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gTWF0aC50cnVuYyhwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0VGltZSk7XG4gICAgICBwcmludFdpdGhTdGFja1RyYWNlKHJ1bldpdGhUaW1lb3V0RGVidWdnZXIsIHN0YWNrVHJhY2UsIGBFeGVjdXRpb24gdGltZTogJHtTdHJpbmcoZHVyYXRpb24pfSBtaWxsaXNlY29uZHNgLCB7XG4gICAgICAgIGNvbnRleHQ6IHBhcmFtcy5jb250ZXh0LFxuICAgICAgICBvcGVyYXRpb25GbjogcGFyYW1zLm9wZXJhdGlvbkZuLFxuICAgICAgICBvcGVyYXRpb25OYW1lOiBwYXJhbXMub3BlcmF0aW9uTmFtZSA/PyAnJ1xuICAgICAgfSk7XG4gICAgICBoYXNSZXN1bHQgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJ1bkFib3J0Q29udHJvbGxlci5hYm9ydChlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgdGltZW91dEFib3J0Q29udHJvbGxlci5hYm9ydChuZXcgRXJyb3IoJ0NvbXBsZXRlZCcpKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBpbm5lclRpbWVvdXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgc2xlZXAocGFyYW1zLnRpbWVvdXRJbk1pbGxpc2Vjb25kcywgdGltZW91dEFib3J0Q29udHJvbGxlci5zaWduYWwpO1xuXG4gICAgaWYgKGlzQ29tcGxldGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGR1cmF0aW9uID0gTWF0aC50cnVuYyhwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0VGltZSk7XG4gICAgcHJpbnRXaXRoU3RhY2tUcmFjZShydW5XaXRoVGltZW91dERlYnVnZ2VyLCBzdGFja1RyYWNlLCBgVGltZWQgb3V0IGFmdGVyICR7U3RyaW5nKGR1cmF0aW9uKX0gbWlsbGlzZWNvbmRzYCwge1xuICAgICAgY29udGV4dDogcGFyYW1zLmNvbnRleHQsXG4gICAgICBvcGVyYXRpb25GbjogcGFyYW1zLm9wZXJhdGlvbkZuLFxuICAgICAgb3BlcmF0aW9uTmFtZTogcGFyYW1zLm9wZXJhdGlvbk5hbWUgPz8gJydcbiAgICB9KTtcblxuICAgIGNvbnN0IHRpbWVvdXRDb250ZXh0OiBUaW1lb3V0Q29udGV4dCA9IG5vcm1hbGl6ZU9wdGlvbmFsUHJvcGVydGllczxUaW1lb3V0Q29udGV4dD4oe1xuICAgICAgZHVyYXRpb24sXG4gICAgICBvbk9wZXJhdGlvbkNvbXBsZXRlZChjYWxsYmFjaykge1xuICAgICAgICB0aW1lb3V0QWJvcnRDb250cm9sbGVyLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGNhbGxiYWNrKTtcbiAgICAgIH0sXG4gICAgICBvcGVyYXRpb25OYW1lOiBwYXJhbXMub3BlcmF0aW9uTmFtZSA/PyAnJyxcbiAgICAgIHRlcm1pbmF0ZU9wZXJhdGlvbigpIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoYFRpbWVkIG91dCBhZnRlciAke1N0cmluZyhkdXJhdGlvbil9IG1pbGxpc2Vjb25kc2ApO1xuICAgICAgICBydW5BYm9ydENvbnRyb2xsZXIuYWJvcnQoZXJyb3IpO1xuICAgICAgICB0aW1lb3V0QWJvcnRDb250cm9sbGVyLmFib3J0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG9uVGltZW91dCh0aW1lb3V0Q29udGV4dCk7XG4gICAgYXdhaXQgd2FpdEZvckFib3J0KHRpbWVvdXRBYm9ydENvbnRyb2xsZXIuc2lnbmFsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmF1bHRPblRpbWVvdXQoY3R4OiBUaW1lb3V0Q29udGV4dCk6IHZvaWQge1xuICAgIGN0eC50ZXJtaW5hdGVPcGVyYXRpb24oKTtcbiAgfVxufVxuXG4vKipcbiAqIEdldHMgdGhlIG5leHQgc2V0IGltbWVkaWF0ZS5cbiAqXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBuZXh0IHNldCBpbW1lZGlhdGUgaXMgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0SW1tZWRpYXRlQXN5bmMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIERlbGF5cyBleGVjdXRpb24gZm9yIGEgc3BlY2lmaWVkIG51bWJlciBvZiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIGRlbGF5IC0gVGhlIHRpbWUgdG8gd2FpdCBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIGFmdGVyIHRoZSBzcGVjaWZpZWQgZGVsYXkuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRUaW1lb3V0QXN5bmMoZGVsYXk/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KTtcbiAgfSk7XG59XG5cbi8qKlxuICogRGVsYXlzIGV4ZWN1dGlvbiBmb3IgYSBzcGVjaWZpZWQgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0gbWlsbGlzZWNvbmRzIC0gVGhlIHRpbWUgdG8gd2FpdCBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcGFyYW0gYWJvcnRTaWduYWwgLSBUaGUgYWJvcnQgc2lnbmFsIHRvIGxpc3RlbiB0by5cbiAqIEBwYXJhbSBzaG91bGRUaHJvd09uQWJvcnQgLSBXaGV0aGVyIHRvIHRocm93IGFuIGVycm9yIGlmIHRoZSBhYm9ydCBzaWduYWwgaXMgYWJvcnRlZC5cbiAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgdGhlIHNwZWNpZmllZCBkZWxheS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNsZWVwKG1pbGxpc2Vjb25kczogbnVtYmVyLCBhYm9ydFNpZ25hbD86IEFib3J0U2lnbmFsLCBzaG91bGRUaHJvd09uQWJvcnQ/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IHdhaXRGb3JBYm9ydChhYm9ydFNpZ25hbEFueShhYm9ydFNpZ25hbCwgYWJvcnRTaWduYWxUaW1lb3V0KG1pbGxpc2Vjb25kcykpKTtcbiAgaWYgKHNob3VsZFRocm93T25BYm9ydCkge1xuICAgIGFib3J0U2lnbmFsPy50aHJvd0lmQWJvcnRlZCgpO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHtAbGluayBQcm9taXNlfSB0aGF0IHJlamVjdHMgYWZ0ZXIgdGhlIHNwZWNpZmllZCB0aW1lb3V0IHBlcmlvZC5cbiAqXG4gKiBAcGFyYW0gdGltZW91dEluTWlsbGlzZWNvbmRzIC0gVGhlIHRpbWVvdXQgcGVyaW9kIGluIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSBhYm9ydFNpZ25hbCAtIFRoZSBhYm9ydCBzaWduYWwgdG8gbGlzdGVuIHRvLlxuICogQHBhcmFtIHNob3VsZFRocm93T25BYm9ydCAtIFdoZXRoZXIgdG8gdGhyb3cgYW4gZXJyb3IgaWYgdGhlIGFib3J0IHNpZ25hbCBpcyBhYm9ydGVkLlxuICogQHJldHVybnMgQSB7QGxpbmsgUHJvbWlzZX0gdGhhdCBhbHdheXMgcmVqZWN0cyB3aXRoIGEgdGltZW91dCBlcnJvci5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRpbWVvdXQodGltZW91dEluTWlsbGlzZWNvbmRzOiBudW1iZXIsIGFib3J0U2lnbmFsPzogQWJvcnRTaWduYWwsIHNob3VsZFRocm93T25BYm9ydD86IGJvb2xlYW4pOiBQcm9taXNlPG5ldmVyPiB7XG4gIGF3YWl0IHNsZWVwKHRpbWVvdXRJbk1pbGxpc2Vjb25kcywgYWJvcnRTaWduYWwsIHNob3VsZFRocm93T25BYm9ydCk7XG4gIHRocm93IG5ldyBFcnJvcihgVGltZWQgb3V0IGluICR7U3RyaW5nKHRpbWVvdXRJbk1pbGxpc2Vjb25kcyl9IG1pbGxpc2Vjb25kc2ApO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIEFzeW5jSXRlcmFibGVJdGVyYXRvciB0byBhbiBhcnJheSBieSBjb25zdW1pbmcgYWxsIGl0cyBlbGVtZW50cy5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBUaGUgdHlwZSBvZiBlbGVtZW50cyBwcm9kdWNlZCBieSB0aGUgQXN5bmNJdGVyYWJsZUl0ZXJhdG9yLlxuICogQHBhcmFtIGl0ZXIgLSBUaGUgQXN5bmNJdGVyYWJsZUl0ZXJhdG9yIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdpdGggYW4gYXJyYXkgb2YgYWxsIHRoZSBlbGVtZW50cyBpbiB0aGUgQXN5bmNJdGVyYWJsZUl0ZXJhdG9yLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9BcnJheTxUPihpdGVyOiBBc3luY0l0ZXJhYmxlSXRlcmF0b3I8VD4pOiBQcm9taXNlPFRbXT4ge1xuICBjb25zdCBhcnI6IFRbXSA9IFtdO1xuICBmb3IgYXdhaXQgKGNvbnN0IGl0ZW0gb2YgaXRlcikge1xuICAgIGFyci5wdXNoKGl0ZW0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBhZGRpdGlvbmFsIHV0aWxpdGllcyBmb3Igd29ya2luZyB3aXRoIHRoZSBPYnNpZGlhbiB7QGxpbmsgV29ya3NwYWNlfS5cbiAqL1xuXG5pbXBvcnQgdHlwZSB7XG4gIEFwcCxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFycyAtLSBXZSBuZWVkIHRvIGltcG9ydCBgV29ya3NwYWNlYCB0byB1c2UgaXQgaW4gdGhlIHRzZG9jcy5cbiAgV29ya3NwYWNlLFxuICBXb3Jrc3BhY2VDb250YWluZXJcbn0gZnJvbSAnb2JzaWRpYW4nO1xuXG4vKipcbiAqIFJldHVybnMgYWxsIGNvbnRhaW5lcnMgaW4gdGhlIHdvcmtzcGFjZS5cbiAqXG4gKiBAcGFyYW0gYXBwIC0gVGhlIE9ic2lkaWFuIGFwcC5cbiAqIEByZXR1cm5zIEFsbCBjb250YWluZXJzIGluIHRoZSB3b3Jrc3BhY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxDb250YWluZXJzKGFwcDogQXBwKTogV29ya3NwYWNlQ29udGFpbmVyW10ge1xuICBjb25zdCBjb250YWluZXJzID0gbmV3IFNldDxXb3Jrc3BhY2VDb250YWluZXI+KCk7XG4gIGFwcC53b3Jrc3BhY2UuaXRlcmF0ZUFsbExlYXZlcygobGVhZikgPT4ge1xuICAgIGNvbnRhaW5lcnMuYWRkKGxlYWYuZ2V0Q29udGFpbmVyKCkpO1xuICB9KTtcbiAgcmV0dXJuIEFycmF5LmZyb20oY29udGFpbmVycyk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbGwgRE9NIHdpbmRvd3MgaW4gdGhlIHdvcmtzcGFjZS5cbiAqXG4gKiBAcGFyYW0gYXBwIC0gVGhlIE9ic2lkaWFuIGFwcC5cbiAqIEByZXR1cm5zIEFsbCBET00gd2luZG93cyBpbiB0aGUgd29ya3NwYWNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsRG9tV2luZG93cyhhcHA6IEFwcCk6IFdpbmRvd1tdIHtcbiAgcmV0dXJuIGdldEFsbENvbnRhaW5lcnMoYXBwKS5tYXAoKGNvbnRhaW5lcikgPT4gY29udGFpbmVyLndpbik7XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBIYW5kbGVzIHJlZ2lzdGVyaW5nIERPTSBldmVudHMgYW5kIGhhbmRsZXJzIGZvciBhbGwgd2luZG93cyAobWFpbiB3aW5kb3cgYW5kIGFsbCBleGlzdGluZy9mdXR1cmUgcG9wdXAgd2luZG93cykgYW5kIHRoZWlyIGRvY3VtZW50cy5cbiAqL1xuXG5pbXBvcnQgdHlwZSB7XG4gIEFwcCxcbiAgQ29tcG9uZW50XG59IGZyb20gJ29ic2lkaWFuJztcblxuaW1wb3J0IHsgZ2V0QWxsRG9tV2luZG93cyB9IGZyb20gJy4uL3dvcmtzcGFjZS50cyc7XG5cbi8qKlxuICogSGFuZGxlcyByZWdpc3RlcmluZyBET00gZXZlbnRzIGFuZCBoYW5kbGVycyBmb3IgYWxsIHdpbmRvd3MgKG1haW4gd2luZG93IGFuZCBhbGwgZXhpc3RpbmcvZnV0dXJlIHBvcHVwIHdpbmRvd3MpIGFuZCB0aGVpciBkb2N1bWVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbGxXaW5kb3dzRXZlbnRIYW5kbGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGBBbGxXaW5kb3dzRXZlbnRIYW5kbGVyYCBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIGFwcCAtIFRoZSBPYnNpZGlhbiBhcHAgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgLSBUaGUgY29tcG9uZW50IHRvIHJlZ2lzdGVyIHRoZSBldmVudCBvbi5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFwcDogQXBwLCBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudDogQ29tcG9uZW50KSB7fVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBET00gZXZlbnQgZm9yIGFsbCBkb2N1bWVudHMgKG1haW4gd2luZG93IGRvY3VtZW50IGFuZCBhbGwgZXhpc3RpbmcvZnV0dXJlIHBvcHVwIHdpbmRvdyBkb2N1bWVudHMpLlxuICAgKlxuICAgKiBAdHlwZVBhcmFtIERvY3VtZW50RXZlbnRUeXBlIC0gVGhlIHR5cGUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgZm9yIHRoZSBldmVudC5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlckFsbERvY3VtZW50c0RvbUV2ZW50PERvY3VtZW50RXZlbnRUeXBlIGV4dGVuZHMga2V5b2YgRG9jdW1lbnRFdmVudE1hcD4oXG4gICAgdHlwZTogRG9jdW1lbnRFdmVudFR5cGUsXG4gICAgY2FsbGJhY2s6ICh0aGlzOiBIVE1MRWxlbWVudCwgZXZ0OiBEb2N1bWVudEV2ZW50TWFwW0RvY3VtZW50RXZlbnRUeXBlXSkgPT4gdW5rbm93bixcbiAgICBvcHRpb25zPzogQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuXG4gICk6IHZvaWQge1xuICAgIHRoaXMucmVnaXN0ZXJBbGxXaW5kb3dzSGFuZGxlcigod2luKSA9PiB7XG4gICAgICB0aGlzLmNvbXBvbmVudC5yZWdpc3RlckRvbUV2ZW50KHdpbi5kb2N1bWVudCwgdHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIERPTSBldmVudCBmb3IgYWxsIHdpbmRvd3MgKG1haW4gd2luZG93IGFuZCBhbGwgZXhpc3RpbmcvZnV0dXJlIHBvcHVwIHdpbmRvd3MpLlxuICAgKlxuICAgKiBAdHlwZVBhcmFtIFdpbmRvd0V2ZW50VHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudC5cbiAgICogQHBhcmFtIHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlLlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIGZvciB0aGUgZXZlbnQuXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJBbGxXaW5kb3dzRG9tRXZlbnQ8V2luZG93RXZlbnRUeXBlIGV4dGVuZHMga2V5b2YgV2luZG93RXZlbnRNYXA+KFxuICAgIHR5cGU6IFdpbmRvd0V2ZW50VHlwZSxcbiAgICBjYWxsYmFjazogKHRoaXM6IEhUTUxFbGVtZW50LCBldnQ6IFdpbmRvd0V2ZW50TWFwW1dpbmRvd0V2ZW50VHlwZV0pID0+IHVua25vd24sXG4gICAgb3B0aW9ucz86IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgYm9vbGVhblxuICApOiB2b2lkIHtcbiAgICB0aGlzLnJlZ2lzdGVyQWxsV2luZG93c0hhbmRsZXIoKHdpbikgPT4ge1xuICAgICAgdGhpcy5jb21wb25lbnQucmVnaXN0ZXJEb21FdmVudCh3aW4sIHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBoYW5kbGVyIGZvciBhbGwgd2luZG93cyAobWFpbiB3aW5kb3cgYW5kIGFsbCBleGlzdGluZy9mdXR1cmUgcG9wdXAgd2luZG93cykuXG4gICAqXG4gICAqIEBwYXJhbSBhbGxXaW5kb3dzSGFuZGxlciAtIFRoZSBoYW5kbGVyIGZvciBhbGwgd2luZG93cy5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlckFsbFdpbmRvd3NIYW5kbGVyKGFsbFdpbmRvd3NIYW5kbGVyOiAod2luOiBXaW5kb3cpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBjb25zdCBtYWluV2luZG93ID0gd2luZG93O1xuICAgIGFsbFdpbmRvd3NIYW5kbGVyKG1haW5XaW5kb3cpO1xuXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLm9uTGF5b3V0UmVhZHkoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCB3aW4gb2YgZ2V0QWxsRG9tV2luZG93cyh0aGlzLmFwcCkpIHtcbiAgICAgICAgaWYgKHdpbiA9PT0gbWFpbldpbmRvdykge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYWxsV2luZG93c0hhbmRsZXIod2luKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb21wb25lbnQucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ3dpbmRvdy1vcGVuJywgKHdvcmtzcGFjZVdpbmRvdykgPT4ge1xuICAgICAgICBhbGxXaW5kb3dzSGFuZGxlcih3b3Jrc3BhY2VXaW5kb3cud2luKTtcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgfVxufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQ29udGFpbnMgYSBjb21wb25lbnQgYW5kIGEgaGVscGVyIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyIGFzeW5jIGV2ZW50cy5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdvYnNpZGlhbic7XG5cbmltcG9ydCB0eXBlIHsgQXN5bmNFdmVudFJlZiB9IGZyb20gJy4uLy4uL2FzeW5jLWV2ZW50cy50cyc7XG5cbmltcG9ydCB7IEFzeW5jRXZlbnRzIH0gZnJvbSAnLi4vLi4vYXN5bmMtZXZlbnRzLnRzJztcblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0aGF0IGNhbiByZWdpc3RlciBhc3luYyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBc3luY0V2ZW50c0NvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBUaGUgYXN5bmMgZXZlbnRzLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFzeW5jRXZlbnRzID0gbmV3IEFzeW5jRXZlbnRzKCk7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBhc3luYyBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50UmVmIC0gVGhlIGV2ZW50IHJlZmVyZW5jZS5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlckFzeW5jRXZlbnQoZXZlbnRSZWY6IEFzeW5jRXZlbnRSZWYpOiB2b2lkIHtcbiAgICByZWdpc3RlckFzeW5jRXZlbnQodGhpcywgZXZlbnRSZWYpO1xuICB9XG59XG5cbi8qKlxuICogUmVnaXN0ZXJzIGFuIGFzeW5jIGV2ZW50LlxuICpcbiAqIEBwYXJhbSBjb21wb25lbnQgLSBUaGUgY29tcG9uZW50LlxuICogQHBhcmFtIGV2ZW50UmVmIC0gVGhlIGV2ZW50IHJlZmVyZW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQXN5bmNFdmVudChjb21wb25lbnQ6IENvbXBvbmVudCwgZXZlbnRSZWY6IEFzeW5jRXZlbnRSZWYpOiB2b2lkIHtcbiAgY29tcG9uZW50LnJlZ2lzdGVyKCgpID0+IHtcbiAgICBldmVudFJlZi5hc3luY0V2ZW50cy5vZmZyZWYoZXZlbnRSZWYpO1xuICB9KTtcbn1cbiIsICJjb25zdCBpc1N0cmluZyA9IG9iaiA9PiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJztcbmNvbnN0IGRlZmVyID0gKCkgPT4ge1xuICBsZXQgcmVzO1xuICBsZXQgcmVqO1xuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHJlcyA9IHJlc29sdmU7XG4gICAgcmVqID0gcmVqZWN0O1xuICB9KTtcbiAgcHJvbWlzZS5yZXNvbHZlID0gcmVzO1xuICBwcm9taXNlLnJlamVjdCA9IHJlajtcbiAgcmV0dXJuIHByb21pc2U7XG59O1xuY29uc3QgbWFrZVN0cmluZyA9IG9iamVjdCA9PiB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICcnO1xuICByZXR1cm4gU3RyaW5nKG9iamVjdCk7XG59O1xuY29uc3QgY29weSA9IChhLCBzLCB0KSA9PiB7XG4gIGEuZm9yRWFjaChtID0+IHtcbiAgICBpZiAoc1ttXSkgdFttXSA9IHNbbV07XG4gIH0pO1xufTtcbmNvbnN0IGxhc3RPZlBhdGhTZXBhcmF0b3JSZWdFeHAgPSAvIyMjL2c7XG5jb25zdCBjbGVhbktleSA9IGtleSA9PiBrZXkgJiYga2V5LmluY2x1ZGVzKCcjIyMnKSA/IGtleS5yZXBsYWNlKGxhc3RPZlBhdGhTZXBhcmF0b3JSZWdFeHAsICcuJykgOiBrZXk7XG5jb25zdCBjYW5Ob3RUcmF2ZXJzZURlZXBlciA9IG9iamVjdCA9PiAhb2JqZWN0IHx8IGlzU3RyaW5nKG9iamVjdCk7XG5jb25zdCBnZXRMYXN0T2ZQYXRoID0gKG9iamVjdCwgcGF0aCwgRW1wdHkpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSAhaXNTdHJpbmcocGF0aCkgPyBwYXRoIDogcGF0aC5zcGxpdCgnLicpO1xuICBsZXQgc3RhY2tJbmRleCA9IDA7XG4gIHdoaWxlIChzdGFja0luZGV4IDwgc3RhY2subGVuZ3RoIC0gMSkge1xuICAgIGlmIChjYW5Ob3RUcmF2ZXJzZURlZXBlcihvYmplY3QpKSByZXR1cm4ge307XG4gICAgY29uc3Qga2V5ID0gY2xlYW5LZXkoc3RhY2tbc3RhY2tJbmRleF0pO1xuICAgIGlmICghb2JqZWN0W2tleV0gJiYgRW1wdHkpIG9iamVjdFtrZXldID0gbmV3IEVtcHR5KCk7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIG9iamVjdCA9IG9iamVjdFtrZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3QgPSB7fTtcbiAgICB9XG4gICAgKytzdGFja0luZGV4O1xuICB9XG4gIGlmIChjYW5Ob3RUcmF2ZXJzZURlZXBlcihvYmplY3QpKSByZXR1cm4ge307XG4gIHJldHVybiB7XG4gICAgb2JqOiBvYmplY3QsXG4gICAgazogY2xlYW5LZXkoc3RhY2tbc3RhY2tJbmRleF0pXG4gIH07XG59O1xuY29uc3Qgc2V0UGF0aCA9IChvYmplY3QsIHBhdGgsIG5ld1ZhbHVlKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBvYmosXG4gICAga1xuICB9ID0gZ2V0TGFzdE9mUGF0aChvYmplY3QsIHBhdGgsIE9iamVjdCk7XG4gIGlmIChvYmogIT09IHVuZGVmaW5lZCB8fCBwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgIG9ialtrXSA9IG5ld1ZhbHVlO1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgZSA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcbiAgbGV0IHAgPSBwYXRoLnNsaWNlKDAsIHBhdGgubGVuZ3RoIC0gMSk7XG4gIGxldCBsYXN0ID0gZ2V0TGFzdE9mUGF0aChvYmplY3QsIHAsIE9iamVjdCk7XG4gIHdoaWxlIChsYXN0Lm9iaiA9PT0gdW5kZWZpbmVkICYmIHAubGVuZ3RoKSB7XG4gICAgZSA9IGAke3BbcC5sZW5ndGggLSAxXX0uJHtlfWA7XG4gICAgcCA9IHAuc2xpY2UoMCwgcC5sZW5ndGggLSAxKTtcbiAgICBsYXN0ID0gZ2V0TGFzdE9mUGF0aChvYmplY3QsIHAsIE9iamVjdCk7XG4gICAgaWYgKGxhc3Q/Lm9iaiAmJiB0eXBlb2YgbGFzdC5vYmpbYCR7bGFzdC5rfS4ke2V9YF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBsYXN0Lm9iaiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgbGFzdC5vYmpbYCR7bGFzdC5rfS4ke2V9YF0gPSBuZXdWYWx1ZTtcbn07XG5jb25zdCBwdXNoUGF0aCA9IChvYmplY3QsIHBhdGgsIG5ld1ZhbHVlLCBjb25jYXQpID0+IHtcbiAgY29uc3Qge1xuICAgIG9iaixcbiAgICBrXG4gIH0gPSBnZXRMYXN0T2ZQYXRoKG9iamVjdCwgcGF0aCwgT2JqZWN0KTtcbiAgb2JqW2tdID0gb2JqW2tdIHx8IFtdO1xuICBvYmpba10ucHVzaChuZXdWYWx1ZSk7XG59O1xuY29uc3QgZ2V0UGF0aCA9IChvYmplY3QsIHBhdGgpID0+IHtcbiAgY29uc3Qge1xuICAgIG9iaixcbiAgICBrXG4gIH0gPSBnZXRMYXN0T2ZQYXRoKG9iamVjdCwgcGF0aCk7XG4gIGlmICghb2JqKSByZXR1cm4gdW5kZWZpbmVkO1xuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGspKSByZXR1cm4gdW5kZWZpbmVkO1xuICByZXR1cm4gb2JqW2tdO1xufTtcbmNvbnN0IGdldFBhdGhXaXRoRGVmYXVsdHMgPSAoZGF0YSwgZGVmYXVsdERhdGEsIGtleSkgPT4ge1xuICBjb25zdCB2YWx1ZSA9IGdldFBhdGgoZGF0YSwga2V5KTtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIGdldFBhdGgoZGVmYXVsdERhdGEsIGtleSk7XG59O1xuY29uc3QgZGVlcEV4dGVuZCA9ICh0YXJnZXQsIHNvdXJjZSwgb3ZlcndyaXRlKSA9PiB7XG4gIGZvciAoY29uc3QgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICBpZiAocHJvcCAhPT0gJ19fcHJvdG9fXycgJiYgcHJvcCAhPT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgaWYgKHByb3AgaW4gdGFyZ2V0KSB7XG4gICAgICAgIGlmIChpc1N0cmluZyh0YXJnZXRbcHJvcF0pIHx8IHRhcmdldFtwcm9wXSBpbnN0YW5jZW9mIFN0cmluZyB8fCBpc1N0cmluZyhzb3VyY2VbcHJvcF0pIHx8IHNvdXJjZVtwcm9wXSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICAgIGlmIChvdmVyd3JpdGUpIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWVwRXh0ZW5kKHRhcmdldFtwcm9wXSwgc291cmNlW3Byb3BdLCBvdmVyd3JpdGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuY29uc3QgcmVnZXhFc2NhcGUgPSBzdHIgPT4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCAnXFxcXCQmJyk7XG5jb25zdCBfZW50aXR5TWFwID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90OycsXG4gIFwiJ1wiOiAnJiMzOTsnLFxuICAnLyc6ICcmI3gyRjsnXG59O1xuY29uc3QgZXNjYXBlID0gZGF0YSA9PiB7XG4gIGlmIChpc1N0cmluZyhkYXRhKSkge1xuICAgIHJldHVybiBkYXRhLnJlcGxhY2UoL1smPD5cIidcXC9dL2csIHMgPT4gX2VudGl0eU1hcFtzXSk7XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuY2xhc3MgUmVnRXhwQ2FjaGUge1xuICBjb25zdHJ1Y3RvcihjYXBhY2l0eSkge1xuICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICB0aGlzLnJlZ0V4cE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnJlZ0V4cFF1ZXVlID0gW107XG4gIH1cbiAgZ2V0UmVnRXhwKHBhdHRlcm4pIHtcbiAgICBjb25zdCByZWdFeHBGcm9tQ2FjaGUgPSB0aGlzLnJlZ0V4cE1hcC5nZXQocGF0dGVybik7XG4gICAgaWYgKHJlZ0V4cEZyb21DYWNoZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcmVnRXhwRnJvbUNhY2hlO1xuICAgIH1cbiAgICBjb25zdCByZWdFeHBOZXcgPSBuZXcgUmVnRXhwKHBhdHRlcm4pO1xuICAgIGlmICh0aGlzLnJlZ0V4cFF1ZXVlLmxlbmd0aCA9PT0gdGhpcy5jYXBhY2l0eSkge1xuICAgICAgdGhpcy5yZWdFeHBNYXAuZGVsZXRlKHRoaXMucmVnRXhwUXVldWUuc2hpZnQoKSk7XG4gICAgfVxuICAgIHRoaXMucmVnRXhwTWFwLnNldChwYXR0ZXJuLCByZWdFeHBOZXcpO1xuICAgIHRoaXMucmVnRXhwUXVldWUucHVzaChwYXR0ZXJuKTtcbiAgICByZXR1cm4gcmVnRXhwTmV3O1xuICB9XG59XG5jb25zdCBjaGFycyA9IFsnICcsICcsJywgJz8nLCAnIScsICc7J107XG5jb25zdCBsb29rc0xpa2VPYmplY3RQYXRoUmVnRXhwQ2FjaGUgPSBuZXcgUmVnRXhwQ2FjaGUoMjApO1xuY29uc3QgbG9va3NMaWtlT2JqZWN0UGF0aCA9IChrZXksIG5zU2VwYXJhdG9yLCBrZXlTZXBhcmF0b3IpID0+IHtcbiAgbnNTZXBhcmF0b3IgPSBuc1NlcGFyYXRvciB8fCAnJztcbiAga2V5U2VwYXJhdG9yID0ga2V5U2VwYXJhdG9yIHx8ICcnO1xuICBjb25zdCBwb3NzaWJsZUNoYXJzID0gY2hhcnMuZmlsdGVyKGMgPT4gIW5zU2VwYXJhdG9yLmluY2x1ZGVzKGMpICYmICFrZXlTZXBhcmF0b3IuaW5jbHVkZXMoYykpO1xuICBpZiAocG9zc2libGVDaGFycy5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xuICBjb25zdCByID0gbG9va3NMaWtlT2JqZWN0UGF0aFJlZ0V4cENhY2hlLmdldFJlZ0V4cChgKCR7cG9zc2libGVDaGFycy5tYXAoYyA9PiBjID09PSAnPycgPyAnXFxcXD8nIDogYykuam9pbignfCcpfSlgKTtcbiAgbGV0IG1hdGNoZWQgPSAhci50ZXN0KGtleSk7XG4gIGlmICghbWF0Y2hlZCkge1xuICAgIGNvbnN0IGtpID0ga2V5LmluZGV4T2Yoa2V5U2VwYXJhdG9yKTtcbiAgICBpZiAoa2kgPiAwICYmICFyLnRlc3Qoa2V5LnN1YnN0cmluZygwLCBraSkpKSB7XG4gICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hdGNoZWQ7XG59O1xuY29uc3QgZGVlcEZpbmQgPSAob2JqLCBwYXRoLCBrZXlTZXBhcmF0b3IgPSAnLicpID0+IHtcbiAgaWYgKCFvYmopIHJldHVybiB1bmRlZmluZWQ7XG4gIGlmIChvYmpbcGF0aF0pIHtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHBhdGgpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBvYmpbcGF0aF07XG4gIH1cbiAgY29uc3QgdG9rZW5zID0gcGF0aC5zcGxpdChrZXlTZXBhcmF0b3IpO1xuICBsZXQgY3VycmVudCA9IG9iajtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOykge1xuICAgIGlmICghY3VycmVudCB8fCB0eXBlb2YgY3VycmVudCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGxldCBuZXh0O1xuICAgIGxldCBuZXh0UGF0aCA9ICcnO1xuICAgIGZvciAobGV0IGogPSBpOyBqIDwgdG9rZW5zLmxlbmd0aDsgKytqKSB7XG4gICAgICBpZiAoaiAhPT0gaSkge1xuICAgICAgICBuZXh0UGF0aCArPSBrZXlTZXBhcmF0b3I7XG4gICAgICB9XG4gICAgICBuZXh0UGF0aCArPSB0b2tlbnNbal07XG4gICAgICBuZXh0ID0gY3VycmVudFtuZXh0UGF0aF07XG4gICAgICBpZiAobmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChbJ3N0cmluZycsICdudW1iZXInLCAnYm9vbGVhbiddLmluY2x1ZGVzKHR5cGVvZiBuZXh0KSAmJiBqIDwgdG9rZW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpICs9IGogLSBpICsgMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG4gIHJldHVybiBjdXJyZW50O1xufTtcbmNvbnN0IGdldENsZWFuZWRDb2RlID0gY29kZSA9PiBjb2RlPy5yZXBsYWNlKC9fL2csICctJyk7XG5cbmNvbnN0IGNvbnNvbGVMb2dnZXIgPSB7XG4gIHR5cGU6ICdsb2dnZXInLFxuICBsb2coYXJncykge1xuICAgIHRoaXMub3V0cHV0KCdsb2cnLCBhcmdzKTtcbiAgfSxcbiAgd2FybihhcmdzKSB7XG4gICAgdGhpcy5vdXRwdXQoJ3dhcm4nLCBhcmdzKTtcbiAgfSxcbiAgZXJyb3IoYXJncykge1xuICAgIHRoaXMub3V0cHV0KCdlcnJvcicsIGFyZ3MpO1xuICB9LFxuICBvdXRwdXQodHlwZSwgYXJncykge1xuICAgIGNvbnNvbGU/Llt0eXBlXT8uYXBwbHk/Lihjb25zb2xlLCBhcmdzKTtcbiAgfVxufTtcbmNsYXNzIExvZ2dlciB7XG4gIGNvbnN0cnVjdG9yKGNvbmNyZXRlTG9nZ2VyLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmluaXQoY29uY3JldGVMb2dnZXIsIG9wdGlvbnMpO1xuICB9XG4gIGluaXQoY29uY3JldGVMb2dnZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMucHJlZml4ID0gb3B0aW9ucy5wcmVmaXggfHwgJ2kxOG5leHQ6JztcbiAgICB0aGlzLmxvZ2dlciA9IGNvbmNyZXRlTG9nZ2VyIHx8IGNvbnNvbGVMb2dnZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmRlYnVnID0gb3B0aW9ucy5kZWJ1ZztcbiAgfVxuICBsb2coLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmZvcndhcmQoYXJncywgJ2xvZycsICcnLCB0cnVlKTtcbiAgfVxuICB3YXJuKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5mb3J3YXJkKGFyZ3MsICd3YXJuJywgJycsIHRydWUpO1xuICB9XG4gIGVycm9yKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5mb3J3YXJkKGFyZ3MsICdlcnJvcicsICcnKTtcbiAgfVxuICBkZXByZWNhdGUoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmZvcndhcmQoYXJncywgJ3dhcm4nLCAnV0FSTklORyBERVBSRUNBVEVEOiAnLCB0cnVlKTtcbiAgfVxuICBmb3J3YXJkKGFyZ3MsIGx2bCwgcHJlZml4LCBkZWJ1Z09ubHkpIHtcbiAgICBpZiAoZGVidWdPbmx5ICYmICF0aGlzLmRlYnVnKSByZXR1cm4gbnVsbDtcbiAgICBhcmdzID0gYXJncy5tYXAoYSA9PiBpc1N0cmluZyhhKSA/IGEucmVwbGFjZSgvW1xcclxcblxceDAwLVxceDFGXFx4N0ZdL2csICcgJykgOiBhKTtcbiAgICBpZiAoaXNTdHJpbmcoYXJnc1swXSkpIGFyZ3NbMF0gPSBgJHtwcmVmaXh9JHt0aGlzLnByZWZpeH0gJHthcmdzWzBdfWA7XG4gICAgcmV0dXJuIHRoaXMubG9nZ2VyW2x2bF0oYXJncyk7XG4gIH1cbiAgY3JlYXRlKG1vZHVsZU5hbWUpIHtcbiAgICByZXR1cm4gbmV3IExvZ2dlcih0aGlzLmxvZ2dlciwge1xuICAgICAgLi4ue1xuICAgICAgICBwcmVmaXg6IGAke3RoaXMucHJlZml4fToke21vZHVsZU5hbWV9OmBcbiAgICAgIH0sXG4gICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICB9KTtcbiAgfVxuICBjbG9uZShvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgdGhpcy5vcHRpb25zO1xuICAgIG9wdGlvbnMucHJlZml4ID0gb3B0aW9ucy5wcmVmaXggfHwgdGhpcy5wcmVmaXg7XG4gICAgcmV0dXJuIG5ldyBMb2dnZXIodGhpcy5sb2dnZXIsIG9wdGlvbnMpO1xuICB9XG59XG52YXIgYmFzZUxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcblxuY2xhc3MgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5vYnNlcnZlcnMgPSB7fTtcbiAgfVxuICBvbihldmVudHMsIGxpc3RlbmVyKSB7XG4gICAgZXZlbnRzLnNwbGl0KCcgJykuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICBpZiAoIXRoaXMub2JzZXJ2ZXJzW2V2ZW50XSkgdGhpcy5vYnNlcnZlcnNbZXZlbnRdID0gbmV3IE1hcCgpO1xuICAgICAgY29uc3QgbnVtTGlzdGVuZXJzID0gdGhpcy5vYnNlcnZlcnNbZXZlbnRdLmdldChsaXN0ZW5lcikgfHwgMDtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzW2V2ZW50XS5zZXQobGlzdGVuZXIsIG51bUxpc3RlbmVycyArIDEpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIG9mZihldmVudCwgbGlzdGVuZXIpIHtcbiAgICBpZiAoIXRoaXMub2JzZXJ2ZXJzW2V2ZW50XSkgcmV0dXJuO1xuICAgIGlmICghbGlzdGVuZXIpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyc1tldmVudF07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2ZXJzW2V2ZW50XS5kZWxldGUobGlzdGVuZXIpO1xuICB9XG4gIG9uY2UoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9ICguLi5hcmdzKSA9PiB7XG4gICAgICBsaXN0ZW5lciguLi5hcmdzKTtcbiAgICAgIHRoaXMub2ZmKGV2ZW50LCB3cmFwcGVyKTtcbiAgICB9O1xuICAgIHRoaXMub24oZXZlbnQsIHdyYXBwZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGVtaXQoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5vYnNlcnZlcnNbZXZlbnRdKSB7XG4gICAgICBjb25zdCBjbG9uZWQgPSBBcnJheS5mcm9tKHRoaXMub2JzZXJ2ZXJzW2V2ZW50XS5lbnRyaWVzKCkpO1xuICAgICAgY2xvbmVkLmZvckVhY2goKFtvYnNlcnZlciwgbnVtVGltZXNBZGRlZF0pID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lc0FkZGVkOyBpKyspIHtcbiAgICAgICAgICBvYnNlcnZlciguLi5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9ic2VydmVyc1snKiddKSB7XG4gICAgICBjb25zdCBjbG9uZWQgPSBBcnJheS5mcm9tKHRoaXMub2JzZXJ2ZXJzWycqJ10uZW50cmllcygpKTtcbiAgICAgIGNsb25lZC5mb3JFYWNoKChbb2JzZXJ2ZXIsIG51bVRpbWVzQWRkZWRdKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXNBZGRlZDsgaSsrKSB7XG4gICAgICAgICAgb2JzZXJ2ZXIoZXZlbnQsIC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUmVzb3VyY2VTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7XG4gICAgbnM6IFsndHJhbnNsYXRpb24nXSxcbiAgICBkZWZhdWx0TlM6ICd0cmFuc2xhdGlvbidcbiAgfSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kYXRhID0gZGF0YSB8fCB7fTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGlmICh0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5rZXlTZXBhcmF0b3IgPSAnLic7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlSlNPTlN0cnVjdHVyZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuaWdub3JlSlNPTlN0cnVjdHVyZSA9IHRydWU7XG4gICAgfVxuICB9XG4gIGFkZE5hbWVzcGFjZXMobnMpIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5ucy5pbmNsdWRlcyhucykpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5ucy5wdXNoKG5zKTtcbiAgICB9XG4gIH1cbiAgcmVtb3ZlTmFtZXNwYWNlcyhucykge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5vcHRpb25zLm5zLmluZGV4T2YobnMpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLm9wdGlvbnMubnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cbiAgZ2V0UmVzb3VyY2UobG5nLCBucywga2V5LCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBrZXlTZXBhcmF0b3IgPSBvcHRpb25zLmtleVNlcGFyYXRvciAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5rZXlTZXBhcmF0b3IgOiB0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yO1xuICAgIGNvbnN0IGlnbm9yZUpTT05TdHJ1Y3R1cmUgPSBvcHRpb25zLmlnbm9yZUpTT05TdHJ1Y3R1cmUgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuaWdub3JlSlNPTlN0cnVjdHVyZSA6IHRoaXMub3B0aW9ucy5pZ25vcmVKU09OU3RydWN0dXJlO1xuICAgIGxldCBwYXRoO1xuICAgIGlmIChsbmcuaW5jbHVkZXMoJy4nKSkge1xuICAgICAgcGF0aCA9IGxuZy5zcGxpdCgnLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXRoID0gW2xuZywgbnNdO1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgcGF0aC5wdXNoKC4uLmtleSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcoa2V5KSAmJiBrZXlTZXBhcmF0b3IpIHtcbiAgICAgICAgICBwYXRoLnB1c2goLi4ua2V5LnNwbGl0KGtleVNlcGFyYXRvcikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhdGgucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGdldFBhdGgodGhpcy5kYXRhLCBwYXRoKTtcbiAgICBpZiAoIXJlc3VsdCAmJiAhbnMgJiYgIWtleSAmJiBsbmcuaW5jbHVkZXMoJy4nKSkge1xuICAgICAgbG5nID0gcGF0aFswXTtcbiAgICAgIG5zID0gcGF0aFsxXTtcbiAgICAgIGtleSA9IHBhdGguc2xpY2UoMikuam9pbignLicpO1xuICAgIH1cbiAgICBpZiAocmVzdWx0IHx8ICFpZ25vcmVKU09OU3RydWN0dXJlIHx8ICFpc1N0cmluZyhrZXkpKSByZXR1cm4gcmVzdWx0O1xuICAgIHJldHVybiBkZWVwRmluZCh0aGlzLmRhdGE/LltsbmddPy5bbnNdLCBrZXksIGtleVNlcGFyYXRvcik7XG4gIH1cbiAgYWRkUmVzb3VyY2UobG5nLCBucywga2V5LCB2YWx1ZSwgb3B0aW9ucyA9IHtcbiAgICBzaWxlbnQ6IGZhbHNlXG4gIH0pIHtcbiAgICBjb25zdCBrZXlTZXBhcmF0b3IgPSBvcHRpb25zLmtleVNlcGFyYXRvciAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5rZXlTZXBhcmF0b3IgOiB0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yO1xuICAgIGxldCBwYXRoID0gW2xuZywgbnNdO1xuICAgIGlmIChrZXkpIHBhdGggPSBwYXRoLmNvbmNhdChrZXlTZXBhcmF0b3IgPyBrZXkuc3BsaXQoa2V5U2VwYXJhdG9yKSA6IGtleSk7XG4gICAgaWYgKGxuZy5pbmNsdWRlcygnLicpKSB7XG4gICAgICBwYXRoID0gbG5nLnNwbGl0KCcuJyk7XG4gICAgICB2YWx1ZSA9IG5zO1xuICAgICAgbnMgPSBwYXRoWzFdO1xuICAgIH1cbiAgICB0aGlzLmFkZE5hbWVzcGFjZXMobnMpO1xuICAgIHNldFBhdGgodGhpcy5kYXRhLCBwYXRoLCB2YWx1ZSk7XG4gICAgaWYgKCFvcHRpb25zLnNpbGVudCkgdGhpcy5lbWl0KCdhZGRlZCcsIGxuZywgbnMsIGtleSwgdmFsdWUpO1xuICB9XG4gIGFkZFJlc291cmNlcyhsbmcsIG5zLCByZXNvdXJjZXMsIG9wdGlvbnMgPSB7XG4gICAgc2lsZW50OiBmYWxzZVxuICB9KSB7XG4gICAgZm9yIChjb25zdCBtIGluIHJlc291cmNlcykge1xuICAgICAgaWYgKGlzU3RyaW5nKHJlc291cmNlc1ttXSkgfHwgQXJyYXkuaXNBcnJheShyZXNvdXJjZXNbbV0pKSB0aGlzLmFkZFJlc291cmNlKGxuZywgbnMsIG0sIHJlc291cmNlc1ttXSwge1xuICAgICAgICBzaWxlbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB0aGlzLmVtaXQoJ2FkZGVkJywgbG5nLCBucywgcmVzb3VyY2VzKTtcbiAgfVxuICBhZGRSZXNvdXJjZUJ1bmRsZShsbmcsIG5zLCByZXNvdXJjZXMsIGRlZXAsIG92ZXJ3cml0ZSwgb3B0aW9ucyA9IHtcbiAgICBzaWxlbnQ6IGZhbHNlLFxuICAgIHNraXBDb3B5OiBmYWxzZVxuICB9KSB7XG4gICAgbGV0IHBhdGggPSBbbG5nLCBuc107XG4gICAgaWYgKGxuZy5pbmNsdWRlcygnLicpKSB7XG4gICAgICBwYXRoID0gbG5nLnNwbGl0KCcuJyk7XG4gICAgICBkZWVwID0gcmVzb3VyY2VzO1xuICAgICAgcmVzb3VyY2VzID0gbnM7XG4gICAgICBucyA9IHBhdGhbMV07XG4gICAgfVxuICAgIHRoaXMuYWRkTmFtZXNwYWNlcyhucyk7XG4gICAgbGV0IHBhY2sgPSBnZXRQYXRoKHRoaXMuZGF0YSwgcGF0aCkgfHwge307XG4gICAgaWYgKCFvcHRpb25zLnNraXBDb3B5KSByZXNvdXJjZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc291cmNlcykpO1xuICAgIGlmIChkZWVwKSB7XG4gICAgICBkZWVwRXh0ZW5kKHBhY2ssIHJlc291cmNlcywgb3ZlcndyaXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFjayA9IHtcbiAgICAgICAgLi4ucGFjayxcbiAgICAgICAgLi4ucmVzb3VyY2VzXG4gICAgICB9O1xuICAgIH1cbiAgICBzZXRQYXRoKHRoaXMuZGF0YSwgcGF0aCwgcGFjayk7XG4gICAgaWYgKCFvcHRpb25zLnNpbGVudCkgdGhpcy5lbWl0KCdhZGRlZCcsIGxuZywgbnMsIHJlc291cmNlcyk7XG4gIH1cbiAgcmVtb3ZlUmVzb3VyY2VCdW5kbGUobG5nLCBucykge1xuICAgIGlmICh0aGlzLmhhc1Jlc291cmNlQnVuZGxlKGxuZywgbnMpKSB7XG4gICAgICBkZWxldGUgdGhpcy5kYXRhW2xuZ11bbnNdO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZU5hbWVzcGFjZXMobnMpO1xuICAgIHRoaXMuZW1pdCgncmVtb3ZlZCcsIGxuZywgbnMpO1xuICB9XG4gIGhhc1Jlc291cmNlQnVuZGxlKGxuZywgbnMpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShsbmcsIG5zKSAhPT0gdW5kZWZpbmVkO1xuICB9XG4gIGdldFJlc291cmNlQnVuZGxlKGxuZywgbnMpIHtcbiAgICBpZiAoIW5zKSBucyA9IHRoaXMub3B0aW9ucy5kZWZhdWx0TlM7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UobG5nLCBucyk7XG4gIH1cbiAgZ2V0RGF0YUJ5TGFuZ3VhZ2UobG5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVtsbmddO1xuICB9XG4gIGhhc0xhbmd1YWdlU29tZVRyYW5zbGF0aW9ucyhsbmcpIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5nZXREYXRhQnlMYW5ndWFnZShsbmcpO1xuICAgIGNvbnN0IG4gPSBkYXRhICYmIE9iamVjdC5rZXlzKGRhdGEpIHx8IFtdO1xuICAgIHJldHVybiAhIW4uZmluZCh2ID0+IGRhdGFbdl0gJiYgT2JqZWN0LmtleXMoZGF0YVt2XSkubGVuZ3RoID4gMCk7XG4gIH1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG4gIH1cbn1cblxudmFyIHBvc3RQcm9jZXNzb3IgPSB7XG4gIHByb2Nlc3NvcnM6IHt9LFxuICBhZGRQb3N0UHJvY2Vzc29yKG1vZHVsZSkge1xuICAgIHRoaXMucHJvY2Vzc29yc1ttb2R1bGUubmFtZV0gPSBtb2R1bGU7XG4gIH0sXG4gIGhhbmRsZShwcm9jZXNzb3JzLCB2YWx1ZSwga2V5LCBvcHRpb25zLCB0cmFuc2xhdG9yKSB7XG4gICAgcHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiB7XG4gICAgICB2YWx1ZSA9IHRoaXMucHJvY2Vzc29yc1twcm9jZXNzb3JdPy5wcm9jZXNzKHZhbHVlLCBrZXksIG9wdGlvbnMsIHRyYW5zbGF0b3IpID8/IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufTtcblxuY29uc3QgUEFUSF9LRVkgPSBTeW1ib2woJ2kxOG5leHQvUEFUSF9LRVknKTtcbmZ1bmN0aW9uIGNyZWF0ZVByb3h5KCkge1xuICBjb25zdCBzdGF0ZSA9IFtdO1xuICBjb25zdCBoYW5kbGVyID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgbGV0IHByb3h5O1xuICBoYW5kbGVyLmdldCA9ICh0YXJnZXQsIGtleSkgPT4ge1xuICAgIHByb3h5Py5yZXZva2U/LigpO1xuICAgIGlmIChrZXkgPT09IFBBVEhfS0VZKSByZXR1cm4gc3RhdGU7XG4gICAgc3RhdGUucHVzaChrZXkpO1xuICAgIHByb3h5ID0gUHJveHkucmV2b2NhYmxlKHRhcmdldCwgaGFuZGxlcik7XG4gICAgcmV0dXJuIHByb3h5LnByb3h5O1xuICB9O1xuICByZXR1cm4gUHJveHkucmV2b2NhYmxlKE9iamVjdC5jcmVhdGUobnVsbCksIGhhbmRsZXIpLnByb3h5O1xufVxuZnVuY3Rpb24ga2V5c0Zyb21TZWxlY3RvcihzZWxlY3Rvciwgb3B0cykge1xuICBjb25zdCB7XG4gICAgW1BBVEhfS0VZXTogcGF0aFxuICB9ID0gc2VsZWN0b3IoY3JlYXRlUHJveHkoKSk7XG4gIGNvbnN0IGtleVNlcGFyYXRvciA9IG9wdHM/LmtleVNlcGFyYXRvciA/PyAnLic7XG4gIGNvbnN0IG5zU2VwYXJhdG9yID0gb3B0cz8ubnNTZXBhcmF0b3IgPz8gJzonO1xuICBjb25zdCBzdHJpY3QgPSBvcHRzPy5lbmFibGVTZWxlY3RvciA9PT0gJ3N0cmljdCc7XG4gIGlmIChwYXRoLmxlbmd0aCA+IDEgJiYgbnNTZXBhcmF0b3IpIHtcbiAgICBjb25zdCBucyA9IG9wdHM/Lm5zO1xuICAgIGNvbnN0IG5zTGlzdCA9IHN0cmljdCA/IEFycmF5LmlzQXJyYXkobnMpID8gbnMgOiBucyA/IFtuc10gOiBudWxsIDogQXJyYXkuaXNBcnJheShucykgPyBucyA6IG51bGw7XG4gICAgaWYgKG5zTGlzdCkge1xuICAgICAgY29uc3QgY2FuZGlkYXRlcyA9IHN0cmljdCA/IG5zTGlzdCA6IG5zTGlzdC5sZW5ndGggPiAxID8gbnNMaXN0LnNsaWNlKDEpIDogW107XG4gICAgICBpZiAoY2FuZGlkYXRlcy5pbmNsdWRlcyhwYXRoWzBdKSkge1xuICAgICAgICByZXR1cm4gYCR7cGF0aFswXX0ke25zU2VwYXJhdG9yfSR7cGF0aC5zbGljZSgxKS5qb2luKGtleVNlcGFyYXRvcil9YDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhdGguam9pbihrZXlTZXBhcmF0b3IpO1xufVxuXG5jb25zdCBzaG91bGRIYW5kbGVBc09iamVjdCA9IHJlcyA9PiAhaXNTdHJpbmcocmVzKSAmJiB0eXBlb2YgcmVzICE9PSAnYm9vbGVhbicgJiYgdHlwZW9mIHJlcyAhPT0gJ251bWJlcic7XG5jbGFzcyBUcmFuc2xhdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Ioc2VydmljZXMsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgY29weShbJ3Jlc291cmNlU3RvcmUnLCAnbGFuZ3VhZ2VVdGlscycsICdwbHVyYWxSZXNvbHZlcicsICdpbnRlcnBvbGF0b3InLCAnYmFja2VuZENvbm5lY3RvcicsICdpMThuRm9ybWF0JywgJ3V0aWxzJ10sIHNlcnZpY2VzLCB0aGlzKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGlmICh0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5rZXlTZXBhcmF0b3IgPSAnLic7XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyID0gYmFzZUxvZ2dlci5jcmVhdGUoJ3RyYW5zbGF0b3InKTtcbiAgICB0aGlzLmNoZWNrZWRMb2FkZWRGb3IgPSB7fTtcbiAgfVxuICBjaGFuZ2VMYW5ndWFnZShsbmcpIHtcbiAgICBpZiAobG5nKSB0aGlzLmxhbmd1YWdlID0gbG5nO1xuICB9XG4gIGV4aXN0cyhrZXksIG8gPSB7XG4gICAgaW50ZXJwb2xhdGlvbjoge31cbiAgfSkge1xuICAgIGNvbnN0IG9wdCA9IHtcbiAgICAgIC4uLm9cbiAgICB9O1xuICAgIGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHJlc29sdmVkID0gdGhpcy5yZXNvbHZlKGtleSwgb3B0KTtcbiAgICBpZiAocmVzb2x2ZWQ/LnJlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgaXNPYmplY3QgPSBzaG91bGRIYW5kbGVBc09iamVjdChyZXNvbHZlZC5yZXMpO1xuICAgIGlmIChvcHQucmV0dXJuT2JqZWN0cyA9PT0gZmFsc2UgJiYgaXNPYmplY3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZXh0cmFjdEZyb21LZXkoa2V5LCBvcHQpIHtcbiAgICBsZXQgbnNTZXBhcmF0b3IgPSBvcHQubnNTZXBhcmF0b3IgIT09IHVuZGVmaW5lZCA/IG9wdC5uc1NlcGFyYXRvciA6IHRoaXMub3B0aW9ucy5uc1NlcGFyYXRvcjtcbiAgICBpZiAobnNTZXBhcmF0b3IgPT09IHVuZGVmaW5lZCkgbnNTZXBhcmF0b3IgPSAnOic7XG4gICAgY29uc3Qga2V5U2VwYXJhdG9yID0gb3B0LmtleVNlcGFyYXRvciAhPT0gdW5kZWZpbmVkID8gb3B0LmtleVNlcGFyYXRvciA6IHRoaXMub3B0aW9ucy5rZXlTZXBhcmF0b3I7XG4gICAgbGV0IG5hbWVzcGFjZXMgPSBvcHQubnMgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROUyB8fCBbXTtcbiAgICBjb25zdCB3b3VsZENoZWNrRm9yTnNJbktleSA9IG5zU2VwYXJhdG9yICYmIGtleS5pbmNsdWRlcyhuc1NlcGFyYXRvcik7XG4gICAgY29uc3Qgc2VlbXNOYXR1cmFsTGFuZ3VhZ2UgPSAhdGhpcy5vcHRpb25zLnVzZXJEZWZpbmVkS2V5U2VwYXJhdG9yICYmICFvcHQua2V5U2VwYXJhdG9yICYmICF0aGlzLm9wdGlvbnMudXNlckRlZmluZWROc1NlcGFyYXRvciAmJiAhb3B0Lm5zU2VwYXJhdG9yICYmICFsb29rc0xpa2VPYmplY3RQYXRoKGtleSwgbnNTZXBhcmF0b3IsIGtleVNlcGFyYXRvcik7XG4gICAgaWYgKHdvdWxkQ2hlY2tGb3JOc0luS2V5ICYmICFzZWVtc05hdHVyYWxMYW5ndWFnZSkge1xuICAgICAgY29uc3QgbSA9IGtleS5tYXRjaCh0aGlzLmludGVycG9sYXRvci5uZXN0aW5nUmVnZXhwKTtcbiAgICAgIGlmIChtICYmIG0ubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtleSxcbiAgICAgICAgICBuYW1lc3BhY2VzOiBpc1N0cmluZyhuYW1lc3BhY2VzKSA/IFtuYW1lc3BhY2VzXSA6IG5hbWVzcGFjZXNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhcnRzID0ga2V5LnNwbGl0KG5zU2VwYXJhdG9yKTtcbiAgICAgIGlmIChuc1NlcGFyYXRvciAhPT0ga2V5U2VwYXJhdG9yIHx8IG5zU2VwYXJhdG9yID09PSBrZXlTZXBhcmF0b3IgJiYgdGhpcy5vcHRpb25zLm5zLmluY2x1ZGVzKHBhcnRzWzBdKSkgbmFtZXNwYWNlcyA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICBrZXkgPSBwYXJ0cy5qb2luKGtleVNlcGFyYXRvcik7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBrZXksXG4gICAgICBuYW1lc3BhY2VzOiBpc1N0cmluZyhuYW1lc3BhY2VzKSA/IFtuYW1lc3BhY2VzXSA6IG5hbWVzcGFjZXNcbiAgICB9O1xuICB9XG4gIHRyYW5zbGF0ZShrZXlzLCBvLCBsYXN0S2V5KSB7XG4gICAgbGV0IG9wdCA9IHR5cGVvZiBvID09PSAnb2JqZWN0JyA/IHtcbiAgICAgIC4uLm9cbiAgICB9IDogbztcbiAgICBpZiAodHlwZW9mIG9wdCAhPT0gJ29iamVjdCcgJiYgdGhpcy5vcHRpb25zLm92ZXJsb2FkVHJhbnNsYXRpb25PcHRpb25IYW5kbGVyKSB7XG4gICAgICBvcHQgPSB0aGlzLm9wdGlvbnMub3ZlcmxvYWRUcmFuc2xhdGlvbk9wdGlvbkhhbmRsZXIoYXJndW1lbnRzKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHQgPT09ICdvYmplY3QnKSBvcHQgPSB7XG4gICAgICAuLi5vcHRcbiAgICB9O1xuICAgIGlmICghb3B0KSBvcHQgPSB7fTtcbiAgICBpZiAoa2V5cyA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgaWYgKHR5cGVvZiBrZXlzID09PSAnZnVuY3Rpb24nKSBrZXlzID0ga2V5c0Zyb21TZWxlY3RvcihrZXlzLCB7XG4gICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgICAuLi5vcHRcbiAgICB9KTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoa2V5cykpIGtleXMgPSBbU3RyaW5nKGtleXMpXTtcbiAgICBrZXlzID0ga2V5cy5tYXAoayA9PiB0eXBlb2YgayA9PT0gJ2Z1bmN0aW9uJyA/IGtleXNGcm9tU2VsZWN0b3Ioaywge1xuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgLi4ub3B0XG4gICAgfSkgOiBTdHJpbmcoaykpO1xuICAgIGNvbnN0IHJldHVybkRldGFpbHMgPSBvcHQucmV0dXJuRGV0YWlscyAhPT0gdW5kZWZpbmVkID8gb3B0LnJldHVybkRldGFpbHMgOiB0aGlzLm9wdGlvbnMucmV0dXJuRGV0YWlscztcbiAgICBjb25zdCBrZXlTZXBhcmF0b3IgPSBvcHQua2V5U2VwYXJhdG9yICE9PSB1bmRlZmluZWQgPyBvcHQua2V5U2VwYXJhdG9yIDogdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvcjtcbiAgICBjb25zdCB7XG4gICAgICBrZXksXG4gICAgICBuYW1lc3BhY2VzXG4gICAgfSA9IHRoaXMuZXh0cmFjdEZyb21LZXkoa2V5c1trZXlzLmxlbmd0aCAtIDFdLCBvcHQpO1xuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5hbWVzcGFjZXNbbmFtZXNwYWNlcy5sZW5ndGggLSAxXTtcbiAgICBsZXQgbnNTZXBhcmF0b3IgPSBvcHQubnNTZXBhcmF0b3IgIT09IHVuZGVmaW5lZCA/IG9wdC5uc1NlcGFyYXRvciA6IHRoaXMub3B0aW9ucy5uc1NlcGFyYXRvcjtcbiAgICBpZiAobnNTZXBhcmF0b3IgPT09IHVuZGVmaW5lZCkgbnNTZXBhcmF0b3IgPSAnOic7XG4gICAgY29uc3QgbG5nID0gb3B0LmxuZyB8fCB0aGlzLmxhbmd1YWdlO1xuICAgIGNvbnN0IGFwcGVuZE5hbWVzcGFjZVRvQ0lNb2RlID0gb3B0LmFwcGVuZE5hbWVzcGFjZVRvQ0lNb2RlIHx8IHRoaXMub3B0aW9ucy5hcHBlbmROYW1lc3BhY2VUb0NJTW9kZTtcbiAgICBpZiAobG5nPy50b0xvd2VyQ2FzZSgpID09PSAnY2ltb2RlJykge1xuICAgICAgaWYgKGFwcGVuZE5hbWVzcGFjZVRvQ0lNb2RlKSB7XG4gICAgICAgIGlmIChyZXR1cm5EZXRhaWxzKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlczogYCR7bmFtZXNwYWNlfSR7bnNTZXBhcmF0b3J9JHtrZXl9YCxcbiAgICAgICAgICAgIHVzZWRLZXk6IGtleSxcbiAgICAgICAgICAgIGV4YWN0VXNlZEtleToga2V5LFxuICAgICAgICAgICAgdXNlZExuZzogbG5nLFxuICAgICAgICAgICAgdXNlZE5TOiBuYW1lc3BhY2UsXG4gICAgICAgICAgICB1c2VkUGFyYW1zOiB0aGlzLmdldFVzZWRQYXJhbXNEZXRhaWxzKG9wdClcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgJHtuYW1lc3BhY2V9JHtuc1NlcGFyYXRvcn0ke2tleX1gO1xuICAgICAgfVxuICAgICAgaWYgKHJldHVybkRldGFpbHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXM6IGtleSxcbiAgICAgICAgICB1c2VkS2V5OiBrZXksXG4gICAgICAgICAgZXhhY3RVc2VkS2V5OiBrZXksXG4gICAgICAgICAgdXNlZExuZzogbG5nLFxuICAgICAgICAgIHVzZWROUzogbmFtZXNwYWNlLFxuICAgICAgICAgIHVzZWRQYXJhbXM6IHRoaXMuZ2V0VXNlZFBhcmFtc0RldGFpbHMob3B0KVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgY29uc3QgcmVzb2x2ZWQgPSB0aGlzLnJlc29sdmUoa2V5cywgb3B0KTtcbiAgICBsZXQgcmVzID0gcmVzb2x2ZWQ/LnJlcztcbiAgICBjb25zdCByZXNVc2VkS2V5ID0gcmVzb2x2ZWQ/LnVzZWRLZXkgfHwga2V5O1xuICAgIGNvbnN0IHJlc0V4YWN0VXNlZEtleSA9IHJlc29sdmVkPy5leGFjdFVzZWRLZXkgfHwga2V5O1xuICAgIGNvbnN0IG5vT2JqZWN0ID0gWydbb2JqZWN0IE51bWJlcl0nLCAnW29iamVjdCBGdW5jdGlvbl0nLCAnW29iamVjdCBSZWdFeHBdJ107XG4gICAgY29uc3Qgam9pbkFycmF5cyA9IG9wdC5qb2luQXJyYXlzICE9PSB1bmRlZmluZWQgPyBvcHQuam9pbkFycmF5cyA6IHRoaXMub3B0aW9ucy5qb2luQXJyYXlzO1xuICAgIGNvbnN0IGhhbmRsZUFzT2JqZWN0SW5JMThuRm9ybWF0ID0gIXRoaXMuaTE4bkZvcm1hdCB8fCB0aGlzLmkxOG5Gb3JtYXQuaGFuZGxlQXNPYmplY3Q7XG4gICAgY29uc3QgbmVlZHNQbHVyYWxIYW5kbGluZyA9IG9wdC5jb3VudCAhPT0gdW5kZWZpbmVkICYmICFpc1N0cmluZyhvcHQuY291bnQpO1xuICAgIGNvbnN0IGhhc0RlZmF1bHRWYWx1ZSA9IFRyYW5zbGF0b3IuaGFzRGVmYXVsdFZhbHVlKG9wdCk7XG4gICAgY29uc3QgZGVmYXVsdFZhbHVlU3VmZml4ID0gbmVlZHNQbHVyYWxIYW5kbGluZyA/IHRoaXMucGx1cmFsUmVzb2x2ZXIuZ2V0U3VmZml4KGxuZywgb3B0LmNvdW50LCBvcHQpIDogJyc7XG4gICAgY29uc3QgZGVmYXVsdFZhbHVlU3VmZml4T3JkaW5hbEZhbGxiYWNrID0gb3B0Lm9yZGluYWwgJiYgbmVlZHNQbHVyYWxIYW5kbGluZyA/IHRoaXMucGx1cmFsUmVzb2x2ZXIuZ2V0U3VmZml4KGxuZywgb3B0LmNvdW50LCB7XG4gICAgICBvcmRpbmFsOiBmYWxzZVxuICAgIH0pIDogJyc7XG4gICAgY29uc3QgbmVlZHNaZXJvU3VmZml4TG9va3VwID0gbmVlZHNQbHVyYWxIYW5kbGluZyAmJiAhb3B0Lm9yZGluYWwgJiYgb3B0LmNvdW50ID09PSAwO1xuICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IG5lZWRzWmVyb1N1ZmZpeExvb2t1cCAmJiBvcHRbYGRlZmF1bHRWYWx1ZSR7dGhpcy5vcHRpb25zLnBsdXJhbFNlcGFyYXRvcn16ZXJvYF0gfHwgb3B0W2BkZWZhdWx0VmFsdWUke2RlZmF1bHRWYWx1ZVN1ZmZpeH1gXSB8fCBvcHRbYGRlZmF1bHRWYWx1ZSR7ZGVmYXVsdFZhbHVlU3VmZml4T3JkaW5hbEZhbGxiYWNrfWBdIHx8IG9wdC5kZWZhdWx0VmFsdWU7XG4gICAgbGV0IHJlc0Zvck9iakhuZGwgPSByZXM7XG4gICAgaWYgKGhhbmRsZUFzT2JqZWN0SW5JMThuRm9ybWF0ICYmICFyZXMgJiYgaGFzRGVmYXVsdFZhbHVlKSB7XG4gICAgICByZXNGb3JPYmpIbmRsID0gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBjb25zdCBoYW5kbGVBc09iamVjdCA9IHNob3VsZEhhbmRsZUFzT2JqZWN0KHJlc0Zvck9iakhuZGwpO1xuICAgIGNvbnN0IHJlc1R5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHJlc0Zvck9iakhuZGwpO1xuICAgIGlmIChoYW5kbGVBc09iamVjdEluSTE4bkZvcm1hdCAmJiByZXNGb3JPYmpIbmRsICYmIGhhbmRsZUFzT2JqZWN0ICYmICFub09iamVjdC5pbmNsdWRlcyhyZXNUeXBlKSAmJiAhKGlzU3RyaW5nKGpvaW5BcnJheXMpICYmIEFycmF5LmlzQXJyYXkocmVzRm9yT2JqSG5kbCkpKSB7XG4gICAgICBpZiAoIW9wdC5yZXR1cm5PYmplY3RzICYmICF0aGlzLm9wdGlvbnMucmV0dXJuT2JqZWN0cykge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZXR1cm5lZE9iamVjdEhhbmRsZXIpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKCdhY2Nlc3NpbmcgYW4gb2JqZWN0IC0gYnV0IHJldHVybk9iamVjdHMgb3B0aW9ucyBpcyBub3QgZW5hYmxlZCEnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByID0gdGhpcy5vcHRpb25zLnJldHVybmVkT2JqZWN0SGFuZGxlciA/IHRoaXMub3B0aW9ucy5yZXR1cm5lZE9iamVjdEhhbmRsZXIocmVzVXNlZEtleSwgcmVzRm9yT2JqSG5kbCwge1xuICAgICAgICAgIC4uLm9wdCxcbiAgICAgICAgICBuczogbmFtZXNwYWNlc1xuICAgICAgICB9KSA6IGBrZXkgJyR7a2V5fSAoJHt0aGlzLmxhbmd1YWdlfSknIHJldHVybmVkIGFuIG9iamVjdCBpbnN0ZWFkIG9mIHN0cmluZy5gO1xuICAgICAgICBpZiAocmV0dXJuRGV0YWlscykge1xuICAgICAgICAgIHJlc29sdmVkLnJlcyA9IHI7XG4gICAgICAgICAgcmVzb2x2ZWQudXNlZFBhcmFtcyA9IHRoaXMuZ2V0VXNlZFBhcmFtc0RldGFpbHMob3B0KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgICB9XG4gICAgICBpZiAoa2V5U2VwYXJhdG9yKSB7XG4gICAgICAgIGNvbnN0IHJlc1R5cGVJc0FycmF5ID0gQXJyYXkuaXNBcnJheShyZXNGb3JPYmpIbmRsKTtcbiAgICAgICAgY29uc3QgY29weSA9IHJlc1R5cGVJc0FycmF5ID8gW10gOiB7fTtcbiAgICAgICAgY29uc3QgbmV3S2V5VG9Vc2UgPSByZXNUeXBlSXNBcnJheSA/IHJlc0V4YWN0VXNlZEtleSA6IHJlc1VzZWRLZXk7XG4gICAgICAgIGZvciAoY29uc3QgbSBpbiByZXNGb3JPYmpIbmRsKSB7XG4gICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXNGb3JPYmpIbmRsLCBtKSkge1xuICAgICAgICAgICAgY29uc3QgZGVlcEtleSA9IGAke25ld0tleVRvVXNlfSR7a2V5U2VwYXJhdG9yfSR7bX1gO1xuICAgICAgICAgICAgaWYgKGhhc0RlZmF1bHRWYWx1ZSAmJiAhcmVzKSB7XG4gICAgICAgICAgICAgIGNvcHlbbV0gPSB0aGlzLnRyYW5zbGF0ZShkZWVwS2V5LCB7XG4gICAgICAgICAgICAgICAgLi4ub3B0LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogc2hvdWxkSGFuZGxlQXNPYmplY3QoZGVmYXVsdFZhbHVlKSA/IGRlZmF1bHRWYWx1ZVttXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAuLi57XG4gICAgICAgICAgICAgICAgICBqb2luQXJyYXlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIG5zOiBuYW1lc3BhY2VzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvcHlbbV0gPSB0aGlzLnRyYW5zbGF0ZShkZWVwS2V5LCB7XG4gICAgICAgICAgICAgICAgLi4ub3B0LFxuICAgICAgICAgICAgICAgIC4uLntcbiAgICAgICAgICAgICAgICAgIGpvaW5BcnJheXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgbnM6IG5hbWVzcGFjZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvcHlbbV0gPT09IGRlZXBLZXkpIGNvcHlbbV0gPSByZXNGb3JPYmpIbmRsW21dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXMgPSBjb3B5O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaGFuZGxlQXNPYmplY3RJbkkxOG5Gb3JtYXQgJiYgaXNTdHJpbmcoam9pbkFycmF5cykgJiYgQXJyYXkuaXNBcnJheShyZXMpKSB7XG4gICAgICByZXMgPSByZXMuam9pbihqb2luQXJyYXlzKTtcbiAgICAgIGlmIChyZXMpIHJlcyA9IHRoaXMuZXh0ZW5kVHJhbnNsYXRpb24ocmVzLCBrZXlzLCBvcHQsIGxhc3RLZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdXNlZERlZmF1bHQgPSBmYWxzZTtcbiAgICAgIGxldCB1c2VkS2V5ID0gZmFsc2U7XG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZExvb2t1cChyZXMpICYmIGhhc0RlZmF1bHRWYWx1ZSkge1xuICAgICAgICB1c2VkRGVmYXVsdCA9IHRydWU7XG4gICAgICAgIHJlcyA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkTG9va3VwKHJlcykpIHtcbiAgICAgICAgdXNlZEtleSA9IHRydWU7XG4gICAgICAgIHJlcyA9IGtleTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1pc3NpbmdLZXlOb1ZhbHVlRmFsbGJhY2tUb0tleSA9IG9wdC5taXNzaW5nS2V5Tm9WYWx1ZUZhbGxiYWNrVG9LZXkgfHwgdGhpcy5vcHRpb25zLm1pc3NpbmdLZXlOb1ZhbHVlRmFsbGJhY2tUb0tleTtcbiAgICAgIGNvbnN0IHJlc0Zvck1pc3NpbmcgPSBtaXNzaW5nS2V5Tm9WYWx1ZUZhbGxiYWNrVG9LZXkgJiYgdXNlZEtleSA/IHVuZGVmaW5lZCA6IHJlcztcbiAgICAgIGNvbnN0IHVwZGF0ZU1pc3NpbmcgPSBoYXNEZWZhdWx0VmFsdWUgJiYgZGVmYXVsdFZhbHVlICE9PSByZXMgJiYgdGhpcy5vcHRpb25zLnVwZGF0ZU1pc3Npbmc7XG4gICAgICBpZiAodXNlZEtleSB8fCB1c2VkRGVmYXVsdCB8fCB1cGRhdGVNaXNzaW5nKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZyh1cGRhdGVNaXNzaW5nID8gJ3VwZGF0ZUtleScgOiAnbWlzc2luZ0tleScsIGxuZywgbmFtZXNwYWNlLCBuZWVkc1BsdXJhbEhhbmRsaW5nICYmICF1cGRhdGVNaXNzaW5nID8gYCR7a2V5fSR7dGhpcy5wbHVyYWxSZXNvbHZlci5nZXRTdWZmaXgobG5nLCBvcHQuY291bnQsIG9wdCl9YCA6IGtleSwgdXBkYXRlTWlzc2luZyA/IGRlZmF1bHRWYWx1ZSA6IHJlcyk7XG4gICAgICAgIGlmIChrZXlTZXBhcmF0b3IpIHtcbiAgICAgICAgICBjb25zdCBmayA9IHRoaXMucmVzb2x2ZShrZXksIHtcbiAgICAgICAgICAgIC4uLm9wdCxcbiAgICAgICAgICAgIGtleVNlcGFyYXRvcjogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoZmsgJiYgZmsucmVzKSB0aGlzLmxvZ2dlci53YXJuKCdTZWVtcyB0aGUgbG9hZGVkIHRyYW5zbGF0aW9ucyB3ZXJlIGluIGZsYXQgSlNPTiBmb3JtYXQgaW5zdGVhZCBvZiBuZXN0ZWQuIEVpdGhlciBzZXQga2V5U2VwYXJhdG9yOiBmYWxzZSBvbiBpbml0IG9yIG1ha2Ugc3VyZSB5b3VyIHRyYW5zbGF0aW9ucyBhcmUgcHVibGlzaGVkIGluIG5lc3RlZCBmb3JtYXQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxuZ3MgPSBbXTtcbiAgICAgICAgY29uc3QgZmFsbGJhY2tMbmdzID0gdGhpcy5sYW5ndWFnZVV0aWxzLmdldEZhbGxiYWNrQ29kZXModGhpcy5vcHRpb25zLmZhbGxiYWNrTG5nLCBvcHQubG5nIHx8IHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNhdmVNaXNzaW5nVG8gPT09ICdmYWxsYmFjaycgJiYgZmFsbGJhY2tMbmdzICYmIGZhbGxiYWNrTG5nc1swXSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmFsbGJhY2tMbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsbmdzLnB1c2goZmFsbGJhY2tMbmdzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNhdmVNaXNzaW5nVG8gPT09ICdhbGwnKSB7XG4gICAgICAgICAgbG5ncyA9IHRoaXMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkob3B0LmxuZyB8fCB0aGlzLmxhbmd1YWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsbmdzLnB1c2gob3B0LmxuZyB8fCB0aGlzLmxhbmd1YWdlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW5kID0gKGwsIGssIHNwZWNpZmljRGVmYXVsdFZhbHVlKSA9PiB7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdEZvck1pc3NpbmcgPSBoYXNEZWZhdWx0VmFsdWUgJiYgc3BlY2lmaWNEZWZhdWx0VmFsdWUgIT09IHJlcyA/IHNwZWNpZmljRGVmYXVsdFZhbHVlIDogcmVzRm9yTWlzc2luZztcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1pc3NpbmdLZXlIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubWlzc2luZ0tleUhhbmRsZXIobCwgbmFtZXNwYWNlLCBrLCBkZWZhdWx0Rm9yTWlzc2luZywgdXBkYXRlTWlzc2luZywgb3B0KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYmFja2VuZENvbm5lY3Rvcj8uc2F2ZU1pc3NpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuYmFja2VuZENvbm5lY3Rvci5zYXZlTWlzc2luZyhsLCBuYW1lc3BhY2UsIGssIGRlZmF1bHRGb3JNaXNzaW5nLCB1cGRhdGVNaXNzaW5nLCBvcHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmVtaXQoJ21pc3NpbmdLZXknLCBsLCBuYW1lc3BhY2UsIGssIHJlcyk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2F2ZU1pc3NpbmcpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNhdmVNaXNzaW5nUGx1cmFscyAmJiBuZWVkc1BsdXJhbEhhbmRsaW5nKSB7XG4gICAgICAgICAgICBsbmdzLmZvckVhY2gobGFuZ3VhZ2UgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBzdWZmaXhlcyA9IHRoaXMucGx1cmFsUmVzb2x2ZXIuZ2V0U3VmZml4ZXMobGFuZ3VhZ2UsIG9wdCk7XG4gICAgICAgICAgICAgIGlmIChuZWVkc1plcm9TdWZmaXhMb29rdXAgJiYgb3B0W2BkZWZhdWx0VmFsdWUke3RoaXMub3B0aW9ucy5wbHVyYWxTZXBhcmF0b3J9emVyb2BdICYmICFzdWZmaXhlcy5pbmNsdWRlcyhgJHt0aGlzLm9wdGlvbnMucGx1cmFsU2VwYXJhdG9yfXplcm9gKSkge1xuICAgICAgICAgICAgICAgIHN1ZmZpeGVzLnB1c2goYCR7dGhpcy5vcHRpb25zLnBsdXJhbFNlcGFyYXRvcn16ZXJvYCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3VmZml4ZXMuZm9yRWFjaChzdWZmaXggPT4ge1xuICAgICAgICAgICAgICAgIHNlbmQoW2xhbmd1YWdlXSwga2V5ICsgc3VmZml4LCBvcHRbYGRlZmF1bHRWYWx1ZSR7c3VmZml4fWBdIHx8IGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbmQobG5ncywga2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVzID0gdGhpcy5leHRlbmRUcmFuc2xhdGlvbihyZXMsIGtleXMsIG9wdCwgcmVzb2x2ZWQsIGxhc3RLZXkpO1xuICAgICAgaWYgKHVzZWRLZXkgJiYgcmVzID09PSBrZXkgJiYgdGhpcy5vcHRpb25zLmFwcGVuZE5hbWVzcGFjZVRvTWlzc2luZ0tleSkge1xuICAgICAgICByZXMgPSBgJHtuYW1lc3BhY2V9JHtuc1NlcGFyYXRvcn0ke2tleX1gO1xuICAgICAgfVxuICAgICAgaWYgKCh1c2VkS2V5IHx8IHVzZWREZWZhdWx0KSAmJiB0aGlzLm9wdGlvbnMucGFyc2VNaXNzaW5nS2V5SGFuZGxlcikge1xuICAgICAgICByZXMgPSB0aGlzLm9wdGlvbnMucGFyc2VNaXNzaW5nS2V5SGFuZGxlcih0aGlzLm9wdGlvbnMuYXBwZW5kTmFtZXNwYWNlVG9NaXNzaW5nS2V5ID8gYCR7bmFtZXNwYWNlfSR7bnNTZXBhcmF0b3J9JHtrZXl9YCA6IGtleSwgdXNlZERlZmF1bHQgPyByZXMgOiB1bmRlZmluZWQsIG9wdCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZXR1cm5EZXRhaWxzKSB7XG4gICAgICByZXNvbHZlZC5yZXMgPSByZXM7XG4gICAgICByZXNvbHZlZC51c2VkUGFyYW1zID0gdGhpcy5nZXRVc2VkUGFyYW1zRGV0YWlscyhvcHQpO1xuICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG4gIGV4dGVuZFRyYW5zbGF0aW9uKHJlcywga2V5LCBvcHQsIHJlc29sdmVkLCBsYXN0S2V5KSB7XG4gICAgaWYgKHRoaXMuaTE4bkZvcm1hdD8ucGFyc2UpIHtcbiAgICAgIHJlcyA9IHRoaXMuaTE4bkZvcm1hdC5wYXJzZShyZXMsIHtcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLmludGVycG9sYXRpb24uZGVmYXVsdFZhcmlhYmxlcyxcbiAgICAgICAgLi4ub3B0XG4gICAgICB9LCBvcHQubG5nIHx8IHRoaXMubGFuZ3VhZ2UgfHwgcmVzb2x2ZWQudXNlZExuZywgcmVzb2x2ZWQudXNlZE5TLCByZXNvbHZlZC51c2VkS2V5LCB7XG4gICAgICAgIHJlc29sdmVkXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCFvcHQuc2tpcEludGVycG9sYXRpb24pIHtcbiAgICAgIGlmIChvcHQuaW50ZXJwb2xhdGlvbikgdGhpcy5pbnRlcnBvbGF0b3IuaW5pdCh7XG4gICAgICAgIC4uLm9wdCxcbiAgICAgICAgLi4ue1xuICAgICAgICAgIGludGVycG9sYXRpb246IHtcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLFxuICAgICAgICAgICAgLi4ub3B0LmludGVycG9sYXRpb25cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2tpcE9uVmFyaWFibGVzID0gaXNTdHJpbmcocmVzKSAmJiAob3B0Py5pbnRlcnBvbGF0aW9uPy5za2lwT25WYXJpYWJsZXMgIT09IHVuZGVmaW5lZCA/IG9wdC5pbnRlcnBvbGF0aW9uLnNraXBPblZhcmlhYmxlcyA6IHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLnNraXBPblZhcmlhYmxlcyk7XG4gICAgICBsZXQgbmVzdEJlZjtcbiAgICAgIGlmIChza2lwT25WYXJpYWJsZXMpIHtcbiAgICAgICAgY29uc3QgbmIgPSByZXMubWF0Y2godGhpcy5pbnRlcnBvbGF0b3IubmVzdGluZ1JlZ2V4cCk7XG4gICAgICAgIG5lc3RCZWYgPSBuYiAmJiBuYi5sZW5ndGg7XG4gICAgICB9XG4gICAgICBsZXQgZGF0YSA9IG9wdC5yZXBsYWNlICYmICFpc1N0cmluZyhvcHQucmVwbGFjZSkgPyBvcHQucmVwbGFjZSA6IG9wdDtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW50ZXJwb2xhdGlvbi5kZWZhdWx0VmFyaWFibGVzKSBkYXRhID0ge1xuICAgICAgICAuLi50aGlzLm9wdGlvbnMuaW50ZXJwb2xhdGlvbi5kZWZhdWx0VmFyaWFibGVzLFxuICAgICAgICAuLi5kYXRhXG4gICAgICB9O1xuICAgICAgcmVzID0gdGhpcy5pbnRlcnBvbGF0b3IuaW50ZXJwb2xhdGUocmVzLCBkYXRhLCBvcHQubG5nIHx8IHRoaXMubGFuZ3VhZ2UgfHwgcmVzb2x2ZWQudXNlZExuZywgb3B0KTtcbiAgICAgIGlmIChza2lwT25WYXJpYWJsZXMpIHtcbiAgICAgICAgY29uc3QgbmEgPSByZXMubWF0Y2godGhpcy5pbnRlcnBvbGF0b3IubmVzdGluZ1JlZ2V4cCk7XG4gICAgICAgIGNvbnN0IG5lc3RBZnQgPSBuYSAmJiBuYS5sZW5ndGg7XG4gICAgICAgIGlmIChuZXN0QmVmIDwgbmVzdEFmdCkgb3B0Lm5lc3QgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghb3B0LmxuZyAmJiByZXNvbHZlZCAmJiByZXNvbHZlZC5yZXMpIG9wdC5sbmcgPSB0aGlzLmxhbmd1YWdlIHx8IHJlc29sdmVkLnVzZWRMbmc7XG4gICAgICBpZiAob3B0Lm5lc3QgIT09IGZhbHNlKSByZXMgPSB0aGlzLmludGVycG9sYXRvci5uZXN0KHJlcywgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgaWYgKGxhc3RLZXk/LlswXSA9PT0gYXJnc1swXSAmJiAhb3B0LmNvbnRleHQpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGBJdCBzZWVtcyB5b3UgYXJlIG5lc3RpbmcgcmVjdXJzaXZlbHkga2V5OiAke2FyZ3NbMF19IGluIGtleTogJHtrZXlbMF19YCk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlKC4uLmFyZ3MsIGtleSk7XG4gICAgICB9LCBvcHQpO1xuICAgICAgaWYgKG9wdC5pbnRlcnBvbGF0aW9uKSB0aGlzLmludGVycG9sYXRvci5yZXNldCgpO1xuICAgIH1cbiAgICBjb25zdCBwb3N0UHJvY2VzcyA9IG9wdC5wb3N0UHJvY2VzcyB8fCB0aGlzLm9wdGlvbnMucG9zdFByb2Nlc3M7XG4gICAgY29uc3QgcG9zdFByb2Nlc3Nvck5hbWVzID0gaXNTdHJpbmcocG9zdFByb2Nlc3MpID8gW3Bvc3RQcm9jZXNzXSA6IHBvc3RQcm9jZXNzO1xuICAgIGlmIChyZXMgIT0gbnVsbCAmJiBwb3N0UHJvY2Vzc29yTmFtZXM/Lmxlbmd0aCAmJiBvcHQuYXBwbHlQb3N0UHJvY2Vzc29yICE9PSBmYWxzZSkge1xuICAgICAgcmVzID0gcG9zdFByb2Nlc3Nvci5oYW5kbGUocG9zdFByb2Nlc3Nvck5hbWVzLCByZXMsIGtleSwgdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5wb3N0UHJvY2Vzc1Bhc3NSZXNvbHZlZCA/IHtcbiAgICAgICAgaTE4blJlc29sdmVkOiB7XG4gICAgICAgICAgLi4ucmVzb2x2ZWQsXG4gICAgICAgICAgdXNlZFBhcmFtczogdGhpcy5nZXRVc2VkUGFyYW1zRGV0YWlscyhvcHQpXG4gICAgICAgIH0sXG4gICAgICAgIC4uLm9wdFxuICAgICAgfSA6IG9wdCwgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgcmVzb2x2ZShrZXlzLCBvcHQgPSB7fSkge1xuICAgIGxldCBmb3VuZDtcbiAgICBsZXQgdXNlZEtleTtcbiAgICBsZXQgZXhhY3RVc2VkS2V5O1xuICAgIGxldCB1c2VkTG5nO1xuICAgIGxldCB1c2VkTlM7XG4gICAgaWYgKGlzU3RyaW5nKGtleXMpKSBrZXlzID0gW2tleXNdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGtleXMpKSBrZXlzID0ga2V5cy5tYXAoayA9PiB0eXBlb2YgayA9PT0gJ2Z1bmN0aW9uJyA/IGtleXNGcm9tU2VsZWN0b3Ioaywge1xuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgLi4ub3B0XG4gICAgfSkgOiBrKTtcbiAgICBrZXlzLmZvckVhY2goayA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkTG9va3VwKGZvdW5kKSkgcmV0dXJuO1xuICAgICAgY29uc3QgZXh0cmFjdGVkID0gdGhpcy5leHRyYWN0RnJvbUtleShrLCBvcHQpO1xuICAgICAgY29uc3Qga2V5ID0gZXh0cmFjdGVkLmtleTtcbiAgICAgIHVzZWRLZXkgPSBrZXk7XG4gICAgICBsZXQgbmFtZXNwYWNlcyA9IGV4dHJhY3RlZC5uYW1lc3BhY2VzO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5mYWxsYmFja05TKSBuYW1lc3BhY2VzID0gbmFtZXNwYWNlcy5jb25jYXQodGhpcy5vcHRpb25zLmZhbGxiYWNrTlMpO1xuICAgICAgY29uc3QgbmVlZHNQbHVyYWxIYW5kbGluZyA9IG9wdC5jb3VudCAhPT0gdW5kZWZpbmVkICYmICFpc1N0cmluZyhvcHQuY291bnQpO1xuICAgICAgY29uc3QgbmVlZHNaZXJvU3VmZml4TG9va3VwID0gbmVlZHNQbHVyYWxIYW5kbGluZyAmJiAhb3B0Lm9yZGluYWwgJiYgb3B0LmNvdW50ID09PSAwO1xuICAgICAgY29uc3QgbmVlZHNDb250ZXh0SGFuZGxpbmcgPSBvcHQuY29udGV4dCAhPT0gdW5kZWZpbmVkICYmIChpc1N0cmluZyhvcHQuY29udGV4dCkgfHwgdHlwZW9mIG9wdC5jb250ZXh0ID09PSAnbnVtYmVyJykgJiYgb3B0LmNvbnRleHQgIT09ICcnO1xuICAgICAgY29uc3QgY29kZXMgPSBvcHQubG5ncyA/IG9wdC5sbmdzIDogdGhpcy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShvcHQubG5nIHx8IHRoaXMubGFuZ3VhZ2UsIG9wdC5mYWxsYmFja0xuZyk7XG4gICAgICBuYW1lc3BhY2VzLmZvckVhY2gobnMgPT4ge1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkTG9va3VwKGZvdW5kKSkgcmV0dXJuO1xuICAgICAgICB1c2VkTlMgPSBucztcbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrZWRMb2FkZWRGb3JbYCR7Y29kZXNbMF19LSR7bnN9YF0gJiYgdGhpcy51dGlscz8uaGFzTG9hZGVkTmFtZXNwYWNlICYmICF0aGlzLnV0aWxzPy5oYXNMb2FkZWROYW1lc3BhY2UodXNlZE5TKSkge1xuICAgICAgICAgIHRoaXMuY2hlY2tlZExvYWRlZEZvcltgJHtjb2Rlc1swXX0tJHtuc31gXSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5sb2dnZXIud2Fybihga2V5IFwiJHt1c2VkS2V5fVwiIGZvciBsYW5ndWFnZXMgXCIke2NvZGVzLmpvaW4oJywgJyl9XCIgd29uJ3QgZ2V0IHJlc29sdmVkIGFzIG5hbWVzcGFjZSBcIiR7dXNlZE5TfVwiIHdhcyBub3QgeWV0IGxvYWRlZGAsICdUaGlzIG1lYW5zIHNvbWV0aGluZyBJUyBXUk9ORyBpbiB5b3VyIHNldHVwLiBZb3UgYWNjZXNzIHRoZSB0IGZ1bmN0aW9uIGJlZm9yZSBpMThuZXh0LmluaXQgLyBpMThuZXh0LmxvYWROYW1lc3BhY2UgLyBpMThuZXh0LmNoYW5nZUxhbmd1YWdlIHdhcyBkb25lLiBXYWl0IGZvciB0aGUgY2FsbGJhY2sgb3IgUHJvbWlzZSB0byByZXNvbHZlIGJlZm9yZSBhY2Nlc3NpbmcgaXQhISEnKTtcbiAgICAgICAgfVxuICAgICAgICBjb2Rlcy5mb3JFYWNoKGNvZGUgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWRMb29rdXAoZm91bmQpKSByZXR1cm47XG4gICAgICAgICAgdXNlZExuZyA9IGNvZGU7XG4gICAgICAgICAgY29uc3QgZmluYWxLZXlzID0gW2tleV07XG4gICAgICAgICAgaWYgKHRoaXMuaTE4bkZvcm1hdD8uYWRkTG9va3VwS2V5cykge1xuICAgICAgICAgICAgdGhpcy5pMThuRm9ybWF0LmFkZExvb2t1cEtleXMoZmluYWxLZXlzLCBrZXksIGNvZGUsIG5zLCBvcHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcGx1cmFsU3VmZml4O1xuICAgICAgICAgICAgaWYgKG5lZWRzUGx1cmFsSGFuZGxpbmcpIHBsdXJhbFN1ZmZpeCA9IHRoaXMucGx1cmFsUmVzb2x2ZXIuZ2V0U3VmZml4KGNvZGUsIG9wdC5jb3VudCwgb3B0KTtcbiAgICAgICAgICAgIGNvbnN0IHplcm9TdWZmaXggPSBgJHt0aGlzLm9wdGlvbnMucGx1cmFsU2VwYXJhdG9yfXplcm9gO1xuICAgICAgICAgICAgY29uc3Qgb3JkaW5hbFByZWZpeCA9IGAke3RoaXMub3B0aW9ucy5wbHVyYWxTZXBhcmF0b3J9b3JkaW5hbCR7dGhpcy5vcHRpb25zLnBsdXJhbFNlcGFyYXRvcn1gO1xuICAgICAgICAgICAgaWYgKG5lZWRzUGx1cmFsSGFuZGxpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKG9wdC5vcmRpbmFsICYmIHBsdXJhbFN1ZmZpeC5zdGFydHNXaXRoKG9yZGluYWxQcmVmaXgpKSB7XG4gICAgICAgICAgICAgICAgZmluYWxLZXlzLnB1c2goa2V5ICsgcGx1cmFsU3VmZml4LnJlcGxhY2Uob3JkaW5hbFByZWZpeCwgdGhpcy5vcHRpb25zLnBsdXJhbFNlcGFyYXRvcikpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZpbmFsS2V5cy5wdXNoKGtleSArIHBsdXJhbFN1ZmZpeCk7XG4gICAgICAgICAgICAgIGlmIChuZWVkc1plcm9TdWZmaXhMb29rdXApIHtcbiAgICAgICAgICAgICAgICBmaW5hbEtleXMucHVzaChrZXkgKyB6ZXJvU3VmZml4KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5lZWRzQ29udGV4dEhhbmRsaW5nKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRleHRLZXkgPSBgJHtrZXl9JHt0aGlzLm9wdGlvbnMuY29udGV4dFNlcGFyYXRvciB8fCAnXyd9JHtvcHQuY29udGV4dH1gO1xuICAgICAgICAgICAgICBmaW5hbEtleXMucHVzaChjb250ZXh0S2V5KTtcbiAgICAgICAgICAgICAgaWYgKG5lZWRzUGx1cmFsSGFuZGxpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0Lm9yZGluYWwgJiYgcGx1cmFsU3VmZml4LnN0YXJ0c1dpdGgob3JkaW5hbFByZWZpeCkpIHtcbiAgICAgICAgICAgICAgICAgIGZpbmFsS2V5cy5wdXNoKGNvbnRleHRLZXkgKyBwbHVyYWxTdWZmaXgucmVwbGFjZShvcmRpbmFsUHJlZml4LCB0aGlzLm9wdGlvbnMucGx1cmFsU2VwYXJhdG9yKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsS2V5cy5wdXNoKGNvbnRleHRLZXkgKyBwbHVyYWxTdWZmaXgpO1xuICAgICAgICAgICAgICAgIGlmIChuZWVkc1plcm9TdWZmaXhMb29rdXApIHtcbiAgICAgICAgICAgICAgICAgIGZpbmFsS2V5cy5wdXNoKGNvbnRleHRLZXkgKyB6ZXJvU3VmZml4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IHBvc3NpYmxlS2V5O1xuICAgICAgICAgIHdoaWxlIChwb3NzaWJsZUtleSA9IGZpbmFsS2V5cy5wb3AoKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRMb29rdXAoZm91bmQpKSB7XG4gICAgICAgICAgICAgIGV4YWN0VXNlZEtleSA9IHBvc3NpYmxlS2V5O1xuICAgICAgICAgICAgICBmb3VuZCA9IHRoaXMuZ2V0UmVzb3VyY2UoY29kZSwgbnMsIHBvc3NpYmxlS2V5LCBvcHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzOiBmb3VuZCxcbiAgICAgIHVzZWRLZXksXG4gICAgICBleGFjdFVzZWRLZXksXG4gICAgICB1c2VkTG5nLFxuICAgICAgdXNlZE5TXG4gICAgfTtcbiAgfVxuICBpc1ZhbGlkTG9va3VwKHJlcykge1xuICAgIHJldHVybiByZXMgIT09IHVuZGVmaW5lZCAmJiAhKCF0aGlzLm9wdGlvbnMucmV0dXJuTnVsbCAmJiByZXMgPT09IG51bGwpICYmICEoIXRoaXMub3B0aW9ucy5yZXR1cm5FbXB0eVN0cmluZyAmJiByZXMgPT09ICcnKTtcbiAgfVxuICBnZXRSZXNvdXJjZShjb2RlLCBucywga2V5LCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodGhpcy5pMThuRm9ybWF0Py5nZXRSZXNvdXJjZSkgcmV0dXJuIHRoaXMuaTE4bkZvcm1hdC5nZXRSZXNvdXJjZShjb2RlLCBucywga2V5LCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVN0b3JlLmdldFJlc291cmNlKGNvZGUsIG5zLCBrZXksIG9wdGlvbnMpO1xuICB9XG4gIGdldFVzZWRQYXJhbXNEZXRhaWxzKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnNLZXlzID0gWydkZWZhdWx0VmFsdWUnLCAnb3JkaW5hbCcsICdjb250ZXh0JywgJ3JlcGxhY2UnLCAnbG5nJywgJ2xuZ3MnLCAnZmFsbGJhY2tMbmcnLCAnbnMnLCAna2V5U2VwYXJhdG9yJywgJ25zU2VwYXJhdG9yJywgJ3JldHVybk9iamVjdHMnLCAncmV0dXJuRGV0YWlscycsICdqb2luQXJyYXlzJywgJ3Bvc3RQcm9jZXNzJywgJ2ludGVycG9sYXRpb24nXTtcbiAgICBjb25zdCB1c2VPcHRpb25zUmVwbGFjZUZvckRhdGEgPSBvcHRpb25zLnJlcGxhY2UgJiYgIWlzU3RyaW5nKG9wdGlvbnMucmVwbGFjZSk7XG4gICAgbGV0IGRhdGEgPSB1c2VPcHRpb25zUmVwbGFjZUZvckRhdGEgPyBvcHRpb25zLnJlcGxhY2UgOiBvcHRpb25zO1xuICAgIGlmICh1c2VPcHRpb25zUmVwbGFjZUZvckRhdGEgJiYgdHlwZW9mIG9wdGlvbnMuY291bnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBkYXRhLmNvdW50ID0gb3B0aW9ucy5jb3VudDtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLmRlZmF1bHRWYXJpYWJsZXMpIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIC4uLnRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLmRlZmF1bHRWYXJpYWJsZXMsXG4gICAgICAgIC4uLmRhdGFcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICghdXNlT3B0aW9uc1JlcGxhY2VGb3JEYXRhKSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICAuLi5kYXRhXG4gICAgICB9O1xuICAgICAgZm9yIChjb25zdCBrZXkgb2Ygb3B0aW9uc0tleXMpIHtcbiAgICAgICAgZGVsZXRlIGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbiAgc3RhdGljIGhhc0RlZmF1bHRWYWx1ZShvcHRpb25zKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJ2RlZmF1bHRWYWx1ZSc7XG4gICAgZm9yIChjb25zdCBvcHRpb24gaW4gb3B0aW9ucykge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvcHRpb25zLCBvcHRpb24pICYmIG9wdGlvbi5zdGFydHNXaXRoKHByZWZpeCkgJiYgdW5kZWZpbmVkICE9PSBvcHRpb25zW29wdGlvbl0pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5jbGFzcyBMYW5ndWFnZVV0aWwge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnN1cHBvcnRlZExuZ3MgPSB0aGlzLm9wdGlvbnMuc3VwcG9ydGVkTG5ncyB8fCBmYWxzZTtcbiAgICB0aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXIuY3JlYXRlKCdsYW5ndWFnZVV0aWxzJyk7XG4gIH1cbiAgZ2V0U2NyaXB0UGFydEZyb21Db2RlKGNvZGUpIHtcbiAgICBjb2RlID0gZ2V0Q2xlYW5lZENvZGUoY29kZSk7XG4gICAgaWYgKCFjb2RlIHx8ICFjb2RlLmluY2x1ZGVzKCctJykpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHAgPSBjb2RlLnNwbGl0KCctJyk7XG4gICAgaWYgKHAubGVuZ3RoID09PSAyKSByZXR1cm4gbnVsbDtcbiAgICBwLnBvcCgpO1xuICAgIGlmIChwW3AubGVuZ3RoIC0gMV0udG9Mb3dlckNhc2UoKSA9PT0gJ3gnKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gdGhpcy5mb3JtYXRMYW5ndWFnZUNvZGUocC5qb2luKCctJykpO1xuICB9XG4gIGdldExhbmd1YWdlUGFydEZyb21Db2RlKGNvZGUpIHtcbiAgICBjb2RlID0gZ2V0Q2xlYW5lZENvZGUoY29kZSk7XG4gICAgaWYgKCFjb2RlIHx8ICFjb2RlLmluY2x1ZGVzKCctJykpIHJldHVybiBjb2RlO1xuICAgIGNvbnN0IHAgPSBjb2RlLnNwbGl0KCctJyk7XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKHBbMF0pO1xuICB9XG4gIGZvcm1hdExhbmd1YWdlQ29kZShjb2RlKSB7XG4gICAgaWYgKGlzU3RyaW5nKGNvZGUpICYmIGNvZGUuaW5jbHVkZXMoJy0nKSkge1xuICAgICAgbGV0IGZvcm1hdHRlZENvZGU7XG4gICAgICB0cnkge1xuICAgICAgICBmb3JtYXR0ZWRDb2RlID0gSW50bC5nZXRDYW5vbmljYWxMb2NhbGVzKGNvZGUpWzBdO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIGlmIChmb3JtYXR0ZWRDb2RlICYmIHRoaXMub3B0aW9ucy5sb3dlckNhc2VMbmcpIHtcbiAgICAgICAgZm9ybWF0dGVkQ29kZSA9IGZvcm1hdHRlZENvZGUudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmb3JtYXR0ZWRDb2RlKSByZXR1cm4gZm9ybWF0dGVkQ29kZTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubG93ZXJDYXNlTG5nKSB7XG4gICAgICAgIHJldHVybiBjb2RlLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jbGVhbkNvZGUgfHwgdGhpcy5vcHRpb25zLmxvd2VyQ2FzZUxuZyA/IGNvZGUudG9Mb3dlckNhc2UoKSA6IGNvZGU7XG4gIH1cbiAgaXNTdXBwb3J0ZWRDb2RlKGNvZGUpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmxvYWQgPT09ICdsYW5ndWFnZU9ubHknIHx8IHRoaXMub3B0aW9ucy5ub25FeHBsaWNpdFN1cHBvcnRlZExuZ3MpIHtcbiAgICAgIGNvZGUgPSB0aGlzLmdldExhbmd1YWdlUGFydEZyb21Db2RlKGNvZGUpO1xuICAgIH1cbiAgICByZXR1cm4gIXRoaXMuc3VwcG9ydGVkTG5ncyB8fCAhdGhpcy5zdXBwb3J0ZWRMbmdzLmxlbmd0aCB8fCB0aGlzLnN1cHBvcnRlZExuZ3MuaW5jbHVkZXMoY29kZSk7XG4gIH1cbiAgZ2V0QmVzdE1hdGNoRnJvbUNvZGVzKGNvZGVzKSB7XG4gICAgaWYgKCFjb2RlcykgcmV0dXJuIG51bGw7XG4gICAgbGV0IGZvdW5kO1xuICAgIGNvZGVzLmZvckVhY2goY29kZSA9PiB7XG4gICAgICBpZiAoZm91bmQpIHJldHVybjtcbiAgICAgIGNvbnN0IGNsZWFuZWRMbmcgPSB0aGlzLmZvcm1hdExhbmd1YWdlQ29kZShjb2RlKTtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnN1cHBvcnRlZExuZ3MgfHwgdGhpcy5pc1N1cHBvcnRlZENvZGUoY2xlYW5lZExuZykpIGZvdW5kID0gY2xlYW5lZExuZztcbiAgICB9KTtcbiAgICBpZiAoIWZvdW5kICYmIHRoaXMub3B0aW9ucy5zdXBwb3J0ZWRMbmdzKSB7XG4gICAgICBjb2Rlcy5mb3JFYWNoKGNvZGUgPT4ge1xuICAgICAgICBpZiAoZm91bmQpIHJldHVybjtcbiAgICAgICAgY29uc3QgbG5nU2NPbmx5ID0gdGhpcy5nZXRTY3JpcHRQYXJ0RnJvbUNvZGUoY29kZSk7XG4gICAgICAgIGlmICh0aGlzLmlzU3VwcG9ydGVkQ29kZShsbmdTY09ubHkpKSByZXR1cm4gZm91bmQgPSBsbmdTY09ubHk7XG4gICAgICAgIGNvbnN0IGxuZ09ubHkgPSB0aGlzLmdldExhbmd1YWdlUGFydEZyb21Db2RlKGNvZGUpO1xuICAgICAgICBpZiAodGhpcy5pc1N1cHBvcnRlZENvZGUobG5nT25seSkpIHJldHVybiBmb3VuZCA9IGxuZ09ubHk7XG4gICAgICAgIGZvdW5kID0gdGhpcy5vcHRpb25zLnN1cHBvcnRlZExuZ3MuZmluZChzdXBwb3J0ZWRMbmcgPT4ge1xuICAgICAgICAgIGlmIChzdXBwb3J0ZWRMbmcgPT09IGxuZ09ubHkpIHJldHVybiB0cnVlO1xuICAgICAgICAgIGlmICghc3VwcG9ydGVkTG5nLmluY2x1ZGVzKCctJykgJiYgIWxuZ09ubHkuaW5jbHVkZXMoJy0nKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIGlmIChzdXBwb3J0ZWRMbmcuaW5jbHVkZXMoJy0nKSAmJiAhbG5nT25seS5pbmNsdWRlcygnLScpICYmIHN1cHBvcnRlZExuZy5zbGljZSgwLCBzdXBwb3J0ZWRMbmcuaW5kZXhPZignLScpKSA9PT0gbG5nT25seSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgaWYgKHN1cHBvcnRlZExuZy5zdGFydHNXaXRoKGxuZ09ubHkpICYmIGxuZ09ubHkubGVuZ3RoID4gMSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIWZvdW5kKSBmb3VuZCA9IHRoaXMuZ2V0RmFsbGJhY2tDb2Rlcyh0aGlzLm9wdGlvbnMuZmFsbGJhY2tMbmcpWzBdO1xuICAgIHJldHVybiBmb3VuZDtcbiAgfVxuICBnZXRGYWxsYmFja0NvZGVzKGZhbGxiYWNrcywgY29kZSkge1xuICAgIGlmICghZmFsbGJhY2tzKSByZXR1cm4gW107XG4gICAgaWYgKHR5cGVvZiBmYWxsYmFja3MgPT09ICdmdW5jdGlvbicpIGZhbGxiYWNrcyA9IGZhbGxiYWNrcyhjb2RlKTtcbiAgICBpZiAoaXNTdHJpbmcoZmFsbGJhY2tzKSkgZmFsbGJhY2tzID0gW2ZhbGxiYWNrc107XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZmFsbGJhY2tzKSkgcmV0dXJuIGZhbGxiYWNrcztcbiAgICBpZiAoIWNvZGUpIHJldHVybiBmYWxsYmFja3MuZGVmYXVsdCB8fCBbXTtcbiAgICBsZXQgZm91bmQgPSBmYWxsYmFja3NbY29kZV07XG4gICAgaWYgKCFmb3VuZCkgZm91bmQgPSBmYWxsYmFja3NbdGhpcy5nZXRTY3JpcHRQYXJ0RnJvbUNvZGUoY29kZSldO1xuICAgIGlmICghZm91bmQpIGZvdW5kID0gZmFsbGJhY2tzW3RoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKGNvZGUpXTtcbiAgICBpZiAoIWZvdW5kKSBmb3VuZCA9IGZhbGxiYWNrc1t0aGlzLmdldExhbmd1YWdlUGFydEZyb21Db2RlKGNvZGUpXTtcbiAgICBpZiAoIWZvdW5kKSBmb3VuZCA9IGZhbGxiYWNrcy5kZWZhdWx0O1xuICAgIHJldHVybiBmb3VuZCB8fCBbXTtcbiAgfVxuICB0b1Jlc29sdmVIaWVyYXJjaHkoY29kZSwgZmFsbGJhY2tDb2RlKSB7XG4gICAgY29uc3QgZmFsbGJhY2tDb2RlcyA9IHRoaXMuZ2V0RmFsbGJhY2tDb2RlcygoZmFsbGJhY2tDb2RlID09PSBmYWxzZSA/IFtdIDogZmFsbGJhY2tDb2RlKSB8fCB0aGlzLm9wdGlvbnMuZmFsbGJhY2tMbmcgfHwgW10sIGNvZGUpO1xuICAgIGNvbnN0IGNvZGVzID0gW107XG4gICAgY29uc3QgYWRkQ29kZSA9IGMgPT4ge1xuICAgICAgaWYgKCFjKSByZXR1cm47XG4gICAgICBpZiAodGhpcy5pc1N1cHBvcnRlZENvZGUoYykpIHtcbiAgICAgICAgY29kZXMucHVzaChjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYHJlamVjdGluZyBsYW5ndWFnZSBjb2RlIG5vdCBmb3VuZCBpbiBzdXBwb3J0ZWRMbmdzOiAke2N9YCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAoaXNTdHJpbmcoY29kZSkgJiYgKGNvZGUuaW5jbHVkZXMoJy0nKSB8fCBjb2RlLmluY2x1ZGVzKCdfJykpKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmxvYWQgIT09ICdsYW5ndWFnZU9ubHknKSBhZGRDb2RlKHRoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKGNvZGUpKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubG9hZCAhPT0gJ2xhbmd1YWdlT25seScgJiYgdGhpcy5vcHRpb25zLmxvYWQgIT09ICdjdXJyZW50T25seScpIGFkZENvZGUodGhpcy5nZXRTY3JpcHRQYXJ0RnJvbUNvZGUoY29kZSkpO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sb2FkICE9PSAnY3VycmVudE9ubHknKSBhZGRDb2RlKHRoaXMuZ2V0TGFuZ3VhZ2VQYXJ0RnJvbUNvZGUoY29kZSkpO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcoY29kZSkpIHtcbiAgICAgIGFkZENvZGUodGhpcy5mb3JtYXRMYW5ndWFnZUNvZGUoY29kZSkpO1xuICAgIH1cbiAgICBmYWxsYmFja0NvZGVzLmZvckVhY2goZmMgPT4ge1xuICAgICAgaWYgKCFjb2Rlcy5pbmNsdWRlcyhmYykpIGFkZENvZGUodGhpcy5mb3JtYXRMYW5ndWFnZUNvZGUoZmMpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29kZXM7XG4gIH1cbn1cblxuY29uc3Qgc3VmZml4ZXNPcmRlciA9IHtcbiAgemVybzogMCxcbiAgb25lOiAxLFxuICB0d286IDIsXG4gIGZldzogMyxcbiAgbWFueTogNCxcbiAgb3RoZXI6IDVcbn07XG5jb25zdCBkdW1teVJ1bGUgPSB7XG4gIHNlbGVjdDogY291bnQgPT4gY291bnQgPT09IDEgPyAnb25lJyA6ICdvdGhlcicsXG4gIHJlc29sdmVkT3B0aW9uczogKCkgPT4gKHtcbiAgICBwbHVyYWxDYXRlZ29yaWVzOiBbJ29uZScsICdvdGhlciddXG4gIH0pXG59O1xuY2xhc3MgUGx1cmFsUmVzb2x2ZXIge1xuICBjb25zdHJ1Y3RvcihsYW5ndWFnZVV0aWxzLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmxhbmd1YWdlVXRpbHMgPSBsYW5ndWFnZVV0aWxzO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyLmNyZWF0ZSgncGx1cmFsUmVzb2x2ZXInKTtcbiAgICB0aGlzLnBsdXJhbFJ1bGVzQ2FjaGUgPSB7fTtcbiAgfVxuICBjbGVhckNhY2hlKCkge1xuICAgIHRoaXMucGx1cmFsUnVsZXNDYWNoZSA9IHt9O1xuICB9XG4gIGdldFJ1bGUoY29kZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgY2xlYW5lZENvZGUgPSBnZXRDbGVhbmVkQ29kZShjb2RlID09PSAnZGV2JyA/ICdlbicgOiBjb2RlKTtcbiAgICBjb25zdCB0eXBlID0gb3B0aW9ucy5vcmRpbmFsID8gJ29yZGluYWwnIDogJ2NhcmRpbmFsJztcbiAgICBjb25zdCBjYWNoZUtleSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGNsZWFuZWRDb2RlLFxuICAgICAgdHlwZVxuICAgIH0pO1xuICAgIGlmIChjYWNoZUtleSBpbiB0aGlzLnBsdXJhbFJ1bGVzQ2FjaGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsdXJhbFJ1bGVzQ2FjaGVbY2FjaGVLZXldO1xuICAgIH1cbiAgICBsZXQgcnVsZTtcbiAgICB0cnkge1xuICAgICAgcnVsZSA9IG5ldyBJbnRsLlBsdXJhbFJ1bGVzKGNsZWFuZWRDb2RlLCB7XG4gICAgICAgIHR5cGVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHR5cGVvZiBJbnRsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignTm8gSW50bCBzdXBwb3J0LCBwbGVhc2UgdXNlIGFuIEludGwgcG9seWZpbGwhJyk7XG4gICAgICAgIHJldHVybiBkdW1teVJ1bGU7XG4gICAgICB9XG4gICAgICBpZiAoIWNvZGUubWF0Y2goLy18Xy8pKSByZXR1cm4gZHVtbXlSdWxlO1xuICAgICAgY29uc3QgbG5nUGFydCA9IHRoaXMubGFuZ3VhZ2VVdGlscy5nZXRMYW5ndWFnZVBhcnRGcm9tQ29kZShjb2RlKTtcbiAgICAgIHJ1bGUgPSB0aGlzLmdldFJ1bGUobG5nUGFydCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHRoaXMucGx1cmFsUnVsZXNDYWNoZVtjYWNoZUtleV0gPSBydWxlO1xuICAgIHJldHVybiBydWxlO1xuICB9XG4gIG5lZWRzUGx1cmFsKGNvZGUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBydWxlID0gdGhpcy5nZXRSdWxlKGNvZGUsIG9wdGlvbnMpO1xuICAgIGlmICghcnVsZSkgcnVsZSA9IHRoaXMuZ2V0UnVsZSgnZGV2Jywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHJ1bGU/LnJlc29sdmVkT3B0aW9ucygpLnBsdXJhbENhdGVnb3JpZXMubGVuZ3RoID4gMTtcbiAgfVxuICBnZXRQbHVyYWxGb3Jtc09mS2V5KGNvZGUsIGtleSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3VmZml4ZXMoY29kZSwgb3B0aW9ucykubWFwKHN1ZmZpeCA9PiBgJHtrZXl9JHtzdWZmaXh9YCk7XG4gIH1cbiAgZ2V0U3VmZml4ZXMoY29kZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHJ1bGUgPSB0aGlzLmdldFJ1bGUoY29kZSwgb3B0aW9ucyk7XG4gICAgaWYgKCFydWxlKSBydWxlID0gdGhpcy5nZXRSdWxlKCdkZXYnLCBvcHRpb25zKTtcbiAgICBpZiAoIXJ1bGUpIHJldHVybiBbXTtcbiAgICByZXR1cm4gcnVsZS5yZXNvbHZlZE9wdGlvbnMoKS5wbHVyYWxDYXRlZ29yaWVzLnNvcnQoKHBsdXJhbENhdGVnb3J5MSwgcGx1cmFsQ2F0ZWdvcnkyKSA9PiBzdWZmaXhlc09yZGVyW3BsdXJhbENhdGVnb3J5MV0gLSBzdWZmaXhlc09yZGVyW3BsdXJhbENhdGVnb3J5Ml0pLm1hcChwbHVyYWxDYXRlZ29yeSA9PiBgJHt0aGlzLm9wdGlvbnMucHJlcGVuZH0ke29wdGlvbnMub3JkaW5hbCA/IGBvcmRpbmFsJHt0aGlzLm9wdGlvbnMucHJlcGVuZH1gIDogJyd9JHtwbHVyYWxDYXRlZ29yeX1gKTtcbiAgfVxuICBnZXRTdWZmaXgoY29kZSwgY291bnQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHJ1bGUgPSB0aGlzLmdldFJ1bGUoY29kZSwgb3B0aW9ucyk7XG4gICAgaWYgKHJ1bGUpIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLm9wdGlvbnMucHJlcGVuZH0ke29wdGlvbnMub3JkaW5hbCA/IGBvcmRpbmFsJHt0aGlzLm9wdGlvbnMucHJlcGVuZH1gIDogJyd9JHtydWxlLnNlbGVjdChjb3VudCl9YDtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXIud2Fybihgbm8gcGx1cmFsIHJ1bGUgZm91bmQgZm9yOiAke2NvZGV9YCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3VmZml4KCdkZXYnLCBjb3VudCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuY29uc3QgZGVlcEZpbmRXaXRoRGVmYXVsdHMgPSAoZGF0YSwgZGVmYXVsdERhdGEsIGtleSwga2V5U2VwYXJhdG9yID0gJy4nLCBpZ25vcmVKU09OU3RydWN0dXJlID0gdHJ1ZSkgPT4ge1xuICBsZXQgcGF0aCA9IGdldFBhdGhXaXRoRGVmYXVsdHMoZGF0YSwgZGVmYXVsdERhdGEsIGtleSk7XG4gIGlmICghcGF0aCAmJiBpZ25vcmVKU09OU3RydWN0dXJlICYmIGlzU3RyaW5nKGtleSkpIHtcbiAgICBwYXRoID0gZGVlcEZpbmQoZGF0YSwga2V5LCBrZXlTZXBhcmF0b3IpO1xuICAgIGlmIChwYXRoID09PSB1bmRlZmluZWQpIHBhdGggPSBkZWVwRmluZChkZWZhdWx0RGF0YSwga2V5LCBrZXlTZXBhcmF0b3IpO1xuICB9XG4gIHJldHVybiBwYXRoO1xufTtcbmNvbnN0IHJlZ2V4U2FmZSA9IHZhbCA9PiB2YWwucmVwbGFjZSgvXFwkL2csICckJCQkJyk7XG5jbGFzcyBJbnRlcnBvbGF0b3Ige1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXIuY3JlYXRlKCdpbnRlcnBvbGF0b3InKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuZm9ybWF0ID0gb3B0aW9ucz8uaW50ZXJwb2xhdGlvbj8uZm9ybWF0IHx8ICh2YWx1ZSA9PiB2YWx1ZSk7XG4gICAgdGhpcy5pbml0KG9wdGlvbnMpO1xuICB9XG4gIGluaXQob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCFvcHRpb25zLmludGVycG9sYXRpb24pIG9wdGlvbnMuaW50ZXJwb2xhdGlvbiA9IHtcbiAgICAgIGVzY2FwZVZhbHVlOiB0cnVlXG4gICAgfTtcbiAgICBjb25zdCB7XG4gICAgICBlc2NhcGU6IGVzY2FwZSQxLFxuICAgICAgZXNjYXBlVmFsdWUsXG4gICAgICB1c2VSYXdWYWx1ZVRvRXNjYXBlLFxuICAgICAgcHJlZml4LFxuICAgICAgcHJlZml4RXNjYXBlZCxcbiAgICAgIHN1ZmZpeCxcbiAgICAgIHN1ZmZpeEVzY2FwZWQsXG4gICAgICBmb3JtYXRTZXBhcmF0b3IsXG4gICAgICB1bmVzY2FwZVN1ZmZpeCxcbiAgICAgIHVuZXNjYXBlUHJlZml4LFxuICAgICAgbmVzdGluZ1ByZWZpeCxcbiAgICAgIG5lc3RpbmdQcmVmaXhFc2NhcGVkLFxuICAgICAgbmVzdGluZ1N1ZmZpeCxcbiAgICAgIG5lc3RpbmdTdWZmaXhFc2NhcGVkLFxuICAgICAgbmVzdGluZ09wdGlvbnNTZXBhcmF0b3IsXG4gICAgICBtYXhSZXBsYWNlcyxcbiAgICAgIGFsd2F5c0Zvcm1hdFxuICAgIH0gPSBvcHRpb25zLmludGVycG9sYXRpb247XG4gICAgdGhpcy5lc2NhcGUgPSBlc2NhcGUkMSAhPT0gdW5kZWZpbmVkID8gZXNjYXBlJDEgOiBlc2NhcGU7XG4gICAgdGhpcy5lc2NhcGVWYWx1ZSA9IGVzY2FwZVZhbHVlICE9PSB1bmRlZmluZWQgPyBlc2NhcGVWYWx1ZSA6IHRydWU7XG4gICAgdGhpcy51c2VSYXdWYWx1ZVRvRXNjYXBlID0gdXNlUmF3VmFsdWVUb0VzY2FwZSAhPT0gdW5kZWZpbmVkID8gdXNlUmF3VmFsdWVUb0VzY2FwZSA6IGZhbHNlO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4ID8gcmVnZXhFc2NhcGUocHJlZml4KSA6IHByZWZpeEVzY2FwZWQgfHwgJ3t7JztcbiAgICB0aGlzLnN1ZmZpeCA9IHN1ZmZpeCA/IHJlZ2V4RXNjYXBlKHN1ZmZpeCkgOiBzdWZmaXhFc2NhcGVkIHx8ICd9fSc7XG4gICAgdGhpcy5mb3JtYXRTZXBhcmF0b3IgPSBmb3JtYXRTZXBhcmF0b3IgfHwgJywnO1xuICAgIHRoaXMudW5lc2NhcGVQcmVmaXggPSB1bmVzY2FwZVN1ZmZpeCA/ICcnIDogdW5lc2NhcGVQcmVmaXggPyByZWdleEVzY2FwZSh1bmVzY2FwZVByZWZpeCkgOiAnLSc7XG4gICAgdGhpcy51bmVzY2FwZVN1ZmZpeCA9IHRoaXMudW5lc2NhcGVQcmVmaXggPyAnJyA6IHVuZXNjYXBlU3VmZml4ID8gcmVnZXhFc2NhcGUodW5lc2NhcGVTdWZmaXgpIDogJyc7XG4gICAgdGhpcy5uZXN0aW5nUHJlZml4ID0gbmVzdGluZ1ByZWZpeCA/IHJlZ2V4RXNjYXBlKG5lc3RpbmdQcmVmaXgpIDogbmVzdGluZ1ByZWZpeEVzY2FwZWQgfHwgcmVnZXhFc2NhcGUoJyR0KCcpO1xuICAgIHRoaXMubmVzdGluZ1N1ZmZpeCA9IG5lc3RpbmdTdWZmaXggPyByZWdleEVzY2FwZShuZXN0aW5nU3VmZml4KSA6IG5lc3RpbmdTdWZmaXhFc2NhcGVkIHx8IHJlZ2V4RXNjYXBlKCcpJyk7XG4gICAgdGhpcy5uZXN0aW5nT3B0aW9uc1NlcGFyYXRvciA9IG5lc3RpbmdPcHRpb25zU2VwYXJhdG9yIHx8ICcsJztcbiAgICB0aGlzLm1heFJlcGxhY2VzID0gbWF4UmVwbGFjZXMgfHwgMTAwMDtcbiAgICB0aGlzLmFsd2F5c0Zvcm1hdCA9IGFsd2F5c0Zvcm1hdCAhPT0gdW5kZWZpbmVkID8gYWx3YXlzRm9ybWF0IDogZmFsc2U7XG4gICAgdGhpcy5yZXNldFJlZ0V4cCgpO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMpIHRoaXMuaW5pdCh0aGlzLm9wdGlvbnMpO1xuICB9XG4gIHJlc2V0UmVnRXhwKCkge1xuICAgIGNvbnN0IGdldE9yUmVzZXRSZWdFeHAgPSAoZXhpc3RpbmdSZWdFeHAsIHBhdHRlcm4pID0+IHtcbiAgICAgIGlmIChleGlzdGluZ1JlZ0V4cD8uc291cmNlID09PSBwYXR0ZXJuKSB7XG4gICAgICAgIGV4aXN0aW5nUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHJldHVybiBleGlzdGluZ1JlZ0V4cDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKHBhdHRlcm4sICdnJyk7XG4gICAgfTtcbiAgICB0aGlzLnJlZ2V4cCA9IGdldE9yUmVzZXRSZWdFeHAodGhpcy5yZWdleHAsIGAke3RoaXMucHJlZml4fSguKz8pJHt0aGlzLnN1ZmZpeH1gKTtcbiAgICB0aGlzLnJlZ2V4cFVuZXNjYXBlID0gZ2V0T3JSZXNldFJlZ0V4cCh0aGlzLnJlZ2V4cFVuZXNjYXBlLCBgJHt0aGlzLnByZWZpeH0ke3RoaXMudW5lc2NhcGVQcmVmaXh9KC4rPykke3RoaXMudW5lc2NhcGVTdWZmaXh9JHt0aGlzLnN1ZmZpeH1gKTtcbiAgICB0aGlzLm5lc3RpbmdSZWdleHAgPSBnZXRPclJlc2V0UmVnRXhwKHRoaXMubmVzdGluZ1JlZ2V4cCwgYCR7dGhpcy5uZXN0aW5nUHJlZml4fSgoPzpbXigpXCInXSt8XCJbXlwiXSpcInwnW14nXSonfFxcXFwoKD86W14oKV18XCJbXlwiXSpcInwnW14nXSonKSpcXFxcKSkqPykke3RoaXMubmVzdGluZ1N1ZmZpeH1gKTtcbiAgfVxuICBpbnRlcnBvbGF0ZShzdHIsIGRhdGEsIGxuZywgb3B0aW9ucykge1xuICAgIGxldCBtYXRjaDtcbiAgICBsZXQgdmFsdWU7XG4gICAgbGV0IHJlcGxhY2VzO1xuICAgIGNvbnN0IGRlZmF1bHREYXRhID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uICYmIHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLmRlZmF1bHRWYXJpYWJsZXMgfHwge307XG4gICAgY29uc3QgaGFuZGxlRm9ybWF0ID0ga2V5ID0+IHtcbiAgICAgIGlmICgha2V5LmluY2x1ZGVzKHRoaXMuZm9ybWF0U2VwYXJhdG9yKSkge1xuICAgICAgICBjb25zdCBwYXRoID0gZGVlcEZpbmRXaXRoRGVmYXVsdHMoZGF0YSwgZGVmYXVsdERhdGEsIGtleSwgdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvciwgdGhpcy5vcHRpb25zLmlnbm9yZUpTT05TdHJ1Y3R1cmUpO1xuICAgICAgICByZXR1cm4gdGhpcy5hbHdheXNGb3JtYXQgPyB0aGlzLmZvcm1hdChwYXRoLCB1bmRlZmluZWQsIGxuZywge1xuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICBpbnRlcnBvbGF0aW9ua2V5OiBrZXlcbiAgICAgICAgfSkgOiBwYXRoO1xuICAgICAgfVxuICAgICAgY29uc3QgcCA9IGtleS5zcGxpdCh0aGlzLmZvcm1hdFNlcGFyYXRvcik7XG4gICAgICBjb25zdCBrID0gcC5zaGlmdCgpLnRyaW0oKTtcbiAgICAgIGNvbnN0IGYgPSBwLmpvaW4odGhpcy5mb3JtYXRTZXBhcmF0b3IpLnRyaW0oKTtcbiAgICAgIHJldHVybiB0aGlzLmZvcm1hdChkZWVwRmluZFdpdGhEZWZhdWx0cyhkYXRhLCBkZWZhdWx0RGF0YSwgaywgdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvciwgdGhpcy5vcHRpb25zLmlnbm9yZUpTT05TdHJ1Y3R1cmUpLCBmLCBsbmcsIHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgaW50ZXJwb2xhdGlvbmtleToga1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB0aGlzLnJlc2V0UmVnRXhwKCk7XG4gICAgaWYgKCF0aGlzLmVzY2FwZVZhbHVlICYmIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnICYmIC9cXCR0XFwoW14pXSpcXHtbXn1dKlxce1xcey8udGVzdChzdHIpKSB7XG4gICAgICB0aGlzLmxvZ2dlci53YXJuKCduZXN0aW5nIG9wdGlvbnMgc3RyaW5nIGNvbnRhaW5zIGludGVycG9sYXRlZCB2YXJpYWJsZXMgd2l0aCBlc2NhcGVWYWx1ZTogZmFsc2UgXHUyMDE0ICcgKyAnaWYgYW55IG9mIHRob3NlIHZhbHVlcyBhcmUgYXR0YWNrZXItY29udHJvbGxlZCB0aGV5IGNhbiBpbmplY3QgYWRkaXRpb25hbCAnICsgJ25lc3Rpbmcgb3B0aW9ucyAoZS5nLiByZWRpcmVjdCBsbmcvbnMpLiBTYW5pdGlzZSB1bnRydXN0ZWQgaW5wdXQgYmVmb3JlIHBhc3NpbmcgJyArICdpdCB0byB0KCksIG9yIGtlZXAgZXNjYXBlVmFsdWU6IHRydWUuJyk7XG4gICAgfVxuICAgIGNvbnN0IG1pc3NpbmdJbnRlcnBvbGF0aW9uSGFuZGxlciA9IG9wdGlvbnM/Lm1pc3NpbmdJbnRlcnBvbGF0aW9uSGFuZGxlciB8fCB0aGlzLm9wdGlvbnMubWlzc2luZ0ludGVycG9sYXRpb25IYW5kbGVyO1xuICAgIGNvbnN0IHNraXBPblZhcmlhYmxlcyA9IG9wdGlvbnM/LmludGVycG9sYXRpb24/LnNraXBPblZhcmlhYmxlcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5pbnRlcnBvbGF0aW9uLnNraXBPblZhcmlhYmxlcyA6IHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLnNraXBPblZhcmlhYmxlcztcbiAgICBjb25zdCB0b2RvcyA9IFt7XG4gICAgICByZWdleDogdGhpcy5yZWdleHBVbmVzY2FwZSxcbiAgICAgIHNhZmVWYWx1ZTogdmFsID0+IHJlZ2V4U2FmZSh2YWwpXG4gICAgfSwge1xuICAgICAgcmVnZXg6IHRoaXMucmVnZXhwLFxuICAgICAgc2FmZVZhbHVlOiB2YWwgPT4gdGhpcy5lc2NhcGVWYWx1ZSA/IHJlZ2V4U2FmZSh0aGlzLmVzY2FwZSh2YWwpKSA6IHJlZ2V4U2FmZSh2YWwpXG4gICAgfV07XG4gICAgdG9kb3MuZm9yRWFjaCh0b2RvID0+IHtcbiAgICAgIHJlcGxhY2VzID0gMDtcbiAgICAgIHdoaWxlIChtYXRjaCA9IHRvZG8ucmVnZXguZXhlYyhzdHIpKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoZWRWYXIgPSBtYXRjaFsxXS50cmltKCk7XG4gICAgICAgIHZhbHVlID0gaGFuZGxlRm9ybWF0KG1hdGNoZWRWYXIpO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbWlzc2luZ0ludGVycG9sYXRpb25IYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gbWlzc2luZ0ludGVycG9sYXRpb25IYW5kbGVyKHN0ciwgbWF0Y2gsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdmFsdWUgPSBpc1N0cmluZyh0ZW1wKSA/IHRlbXAgOiAnJztcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMsIG1hdGNoZWRWYXIpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2tpcE9uVmFyaWFibGVzKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG1hdGNoWzBdO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYG1pc3NlZCB0byBwYXNzIGluIHZhcmlhYmxlICR7bWF0Y2hlZFZhcn0gZm9yIGludGVycG9sYXRpbmcgJHtzdHJ9YCk7XG4gICAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghaXNTdHJpbmcodmFsdWUpICYmICF0aGlzLnVzZVJhd1ZhbHVlVG9Fc2NhcGUpIHtcbiAgICAgICAgICB2YWx1ZSA9IG1ha2VTdHJpbmcodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNhZmVWYWx1ZSA9IHRvZG8uc2FmZVZhbHVlKHZhbHVlKTtcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobWF0Y2hbMF0sIHNhZmVWYWx1ZSk7XG4gICAgICAgIGlmIChza2lwT25WYXJpYWJsZXMpIHtcbiAgICAgICAgICB0b2RvLnJlZ2V4Lmxhc3RJbmRleCArPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgdG9kby5yZWdleC5sYXN0SW5kZXggLT0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvZG8ucmVnZXgubGFzdEluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXBsYWNlcysrO1xuICAgICAgICBpZiAocmVwbGFjZXMgPj0gdGhpcy5tYXhSZXBsYWNlcykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuICBuZXN0KHN0ciwgZmMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBtYXRjaDtcbiAgICBsZXQgdmFsdWU7XG4gICAgbGV0IGNsb25lZE9wdGlvbnM7XG4gICAgY29uc3QgaGFuZGxlSGFzT3B0aW9ucyA9IChrZXksIGluaGVyaXRlZE9wdGlvbnMpID0+IHtcbiAgICAgIGNvbnN0IHNlcCA9IHRoaXMubmVzdGluZ09wdGlvbnNTZXBhcmF0b3I7XG4gICAgICBpZiAoIWtleS5pbmNsdWRlcyhzZXApKSByZXR1cm4ga2V5O1xuICAgICAgY29uc3QgYyA9IGtleS5zcGxpdChuZXcgUmVnRXhwKGAke3JlZ2V4RXNjYXBlKHNlcCl9WyBdKntgKSk7XG4gICAgICBsZXQgb3B0aW9uc1N0cmluZyA9IGB7JHtjWzFdfWA7XG4gICAgICBrZXkgPSBjWzBdO1xuICAgICAgb3B0aW9uc1N0cmluZyA9IHRoaXMuaW50ZXJwb2xhdGUob3B0aW9uc1N0cmluZywgY2xvbmVkT3B0aW9ucyk7XG4gICAgICBjb25zdCBtYXRjaGVkU2luZ2xlUXVvdGVzID0gb3B0aW9uc1N0cmluZy5tYXRjaCgvJy9nKTtcbiAgICAgIGNvbnN0IG1hdGNoZWREb3VibGVRdW90ZXMgPSBvcHRpb25zU3RyaW5nLm1hdGNoKC9cIi9nKTtcbiAgICAgIGlmICgobWF0Y2hlZFNpbmdsZVF1b3Rlcz8ubGVuZ3RoID8/IDApICUgMiA9PT0gMCAmJiAhbWF0Y2hlZERvdWJsZVF1b3RlcyB8fCAobWF0Y2hlZERvdWJsZVF1b3Rlcz8ubGVuZ3RoID8/IDApICUgMiAhPT0gMCkge1xuICAgICAgICBvcHRpb25zU3RyaW5nID0gb3B0aW9uc1N0cmluZy5yZXBsYWNlKC8nL2csICdcIicpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgY2xvbmVkT3B0aW9ucyA9IEpTT04ucGFyc2Uob3B0aW9uc1N0cmluZyk7XG4gICAgICAgIGlmIChpbmhlcml0ZWRPcHRpb25zKSBjbG9uZWRPcHRpb25zID0ge1xuICAgICAgICAgIC4uLmluaGVyaXRlZE9wdGlvbnMsXG4gICAgICAgICAgLi4uY2xvbmVkT3B0aW9uc1xuICAgICAgICB9O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGBmYWlsZWQgcGFyc2luZyBvcHRpb25zIHN0cmluZyBpbiBuZXN0aW5nIGZvciBrZXkgJHtrZXl9YCwgZSk7XG4gICAgICAgIHJldHVybiBgJHtrZXl9JHtzZXB9JHtvcHRpb25zU3RyaW5nfWA7XG4gICAgICB9XG4gICAgICBpZiAoY2xvbmVkT3B0aW9ucy5kZWZhdWx0VmFsdWUgJiYgY2xvbmVkT3B0aW9ucy5kZWZhdWx0VmFsdWUuaW5jbHVkZXModGhpcy5wcmVmaXgpKSBkZWxldGUgY2xvbmVkT3B0aW9ucy5kZWZhdWx0VmFsdWU7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH07XG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5uZXN0aW5nUmVnZXhwLmV4ZWMoc3RyKSkge1xuICAgICAgbGV0IGZvcm1hdHRlcnMgPSBbXTtcbiAgICAgIGNsb25lZE9wdGlvbnMgPSB7XG4gICAgICAgIC4uLm9wdGlvbnNcbiAgICAgIH07XG4gICAgICBjbG9uZWRPcHRpb25zID0gY2xvbmVkT3B0aW9ucy5yZXBsYWNlICYmICFpc1N0cmluZyhjbG9uZWRPcHRpb25zLnJlcGxhY2UpID8gY2xvbmVkT3B0aW9ucy5yZXBsYWNlIDogY2xvbmVkT3B0aW9ucztcbiAgICAgIGNsb25lZE9wdGlvbnMuYXBwbHlQb3N0UHJvY2Vzc29yID0gZmFsc2U7XG4gICAgICBkZWxldGUgY2xvbmVkT3B0aW9ucy5kZWZhdWx0VmFsdWU7XG4gICAgICBjb25zdCBrZXlFbmRJbmRleCA9IC97Lip9Ly50ZXN0KG1hdGNoWzFdKSA/IG1hdGNoWzFdLmxhc3RJbmRleE9mKCd9JykgKyAxIDogbWF0Y2hbMV0uaW5kZXhPZih0aGlzLmZvcm1hdFNlcGFyYXRvcik7XG4gICAgICBpZiAoa2V5RW5kSW5kZXggIT09IC0xKSB7XG4gICAgICAgIGZvcm1hdHRlcnMgPSBtYXRjaFsxXS5zbGljZShrZXlFbmRJbmRleCkuc3BsaXQodGhpcy5mb3JtYXRTZXBhcmF0b3IpLm1hcChlbGVtID0+IGVsZW0udHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIG1hdGNoWzFdID0gbWF0Y2hbMV0uc2xpY2UoMCwga2V5RW5kSW5kZXgpO1xuICAgICAgfVxuICAgICAgdmFsdWUgPSBmYyhoYW5kbGVIYXNPcHRpb25zLmNhbGwodGhpcywgbWF0Y2hbMV0udHJpbSgpLCBjbG9uZWRPcHRpb25zKSwgY2xvbmVkT3B0aW9ucyk7XG4gICAgICBpZiAodmFsdWUgJiYgbWF0Y2hbMF0gPT09IHN0ciAmJiAhaXNTdHJpbmcodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgICBpZiAoIWlzU3RyaW5nKHZhbHVlKSkgdmFsdWUgPSBtYWtlU3RyaW5nKHZhbHVlKTtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybihgbWlzc2VkIHRvIHJlc29sdmUgJHttYXRjaFsxXX0gZm9yIG5lc3RpbmcgJHtzdHJ9YCk7XG4gICAgICAgIHZhbHVlID0gJyc7XG4gICAgICB9XG4gICAgICBpZiAoZm9ybWF0dGVycy5sZW5ndGgpIHtcbiAgICAgICAgdmFsdWUgPSBmb3JtYXR0ZXJzLnJlZHVjZSgodiwgZikgPT4gdGhpcy5mb3JtYXQodiwgZiwgb3B0aW9ucy5sbmcsIHtcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIGludGVycG9sYXRpb25rZXk6IG1hdGNoWzFdLnRyaW0oKVxuICAgICAgICB9KSwgdmFsdWUudHJpbSgpKTtcbiAgICAgIH1cbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG1hdGNoWzBdLCB2YWx1ZSk7XG4gICAgICB0aGlzLnJlZ2V4cC5sYXN0SW5kZXggPSAwO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cbmNvbnN0IHBhcnNlRm9ybWF0U3RyID0gZm9ybWF0U3RyID0+IHtcbiAgbGV0IGZvcm1hdE5hbWUgPSBmb3JtYXRTdHIudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gIGNvbnN0IGZvcm1hdE9wdGlvbnMgPSB7fTtcbiAgaWYgKGZvcm1hdFN0ci5pbmNsdWRlcygnKCcpKSB7XG4gICAgY29uc3QgcCA9IGZvcm1hdFN0ci5zcGxpdCgnKCcpO1xuICAgIGZvcm1hdE5hbWUgPSBwWzBdLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgIGNvbnN0IG9wdFN0ciA9IHBbMV0uc2xpY2UoMCwgLTEpO1xuICAgIGlmIChmb3JtYXROYW1lID09PSAnY3VycmVuY3knICYmICFvcHRTdHIuaW5jbHVkZXMoJzonKSkge1xuICAgICAgaWYgKCFmb3JtYXRPcHRpb25zLmN1cnJlbmN5KSBmb3JtYXRPcHRpb25zLmN1cnJlbmN5ID0gb3B0U3RyLnRyaW0oKTtcbiAgICB9IGVsc2UgaWYgKGZvcm1hdE5hbWUgPT09ICdyZWxhdGl2ZXRpbWUnICYmICFvcHRTdHIuaW5jbHVkZXMoJzonKSkge1xuICAgICAgaWYgKCFmb3JtYXRPcHRpb25zLnJhbmdlKSBmb3JtYXRPcHRpb25zLnJhbmdlID0gb3B0U3RyLnRyaW0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb3B0cyA9IG9wdFN0ci5zcGxpdCgnOycpO1xuICAgICAgb3B0cy5mb3JFYWNoKG9wdCA9PiB7XG4gICAgICAgIGlmIChvcHQpIHtcbiAgICAgICAgICBjb25zdCBba2V5LCAuLi5yZXN0XSA9IG9wdC5zcGxpdCgnOicpO1xuICAgICAgICAgIGNvbnN0IHZhbCA9IHJlc3Quam9pbignOicpLnRyaW0oKS5yZXBsYWNlKC9eJyt8JyskL2csICcnKTtcbiAgICAgICAgICBjb25zdCB0cmltbWVkS2V5ID0ga2V5LnRyaW0oKTtcbiAgICAgICAgICBpZiAoIWZvcm1hdE9wdGlvbnNbdHJpbW1lZEtleV0pIGZvcm1hdE9wdGlvbnNbdHJpbW1lZEtleV0gPSB2YWw7XG4gICAgICAgICAgaWYgKHZhbCA9PT0gJ2ZhbHNlJykgZm9ybWF0T3B0aW9uc1t0cmltbWVkS2V5XSA9IGZhbHNlO1xuICAgICAgICAgIGlmICh2YWwgPT09ICd0cnVlJykgZm9ybWF0T3B0aW9uc1t0cmltbWVkS2V5XSA9IHRydWU7XG4gICAgICAgICAgaWYgKCFpc05hTih2YWwpKSBmb3JtYXRPcHRpb25zW3RyaW1tZWRLZXldID0gcGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIGZvcm1hdE5hbWUsXG4gICAgZm9ybWF0T3B0aW9uc1xuICB9O1xufTtcbmNvbnN0IGNyZWF0ZUNhY2hlZEZvcm1hdHRlciA9IGZuID0+IHtcbiAgY29uc3QgY2FjaGUgPSB7fTtcbiAgcmV0dXJuICh2LCBsLCBvKSA9PiB7XG4gICAgbGV0IG9wdEZvckNhY2hlID0gbztcbiAgICBpZiAobyAmJiBvLmludGVycG9sYXRpb25rZXkgJiYgby5mb3JtYXRQYXJhbXMgJiYgby5mb3JtYXRQYXJhbXNbby5pbnRlcnBvbGF0aW9ua2V5XSAmJiBvW28uaW50ZXJwb2xhdGlvbmtleV0pIHtcbiAgICAgIG9wdEZvckNhY2hlID0ge1xuICAgICAgICAuLi5vcHRGb3JDYWNoZSxcbiAgICAgICAgW28uaW50ZXJwb2xhdGlvbmtleV06IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3Qga2V5ID0gbCArIEpTT04uc3RyaW5naWZ5KG9wdEZvckNhY2hlKTtcbiAgICBsZXQgZnJtID0gY2FjaGVba2V5XTtcbiAgICBpZiAoIWZybSkge1xuICAgICAgZnJtID0gZm4oZ2V0Q2xlYW5lZENvZGUobCksIG8pO1xuICAgICAgY2FjaGVba2V5XSA9IGZybTtcbiAgICB9XG4gICAgcmV0dXJuIGZybSh2KTtcbiAgfTtcbn07XG5jb25zdCBjcmVhdGVOb25DYWNoZWRGb3JtYXR0ZXIgPSBmbiA9PiAodiwgbCwgbykgPT4gZm4oZ2V0Q2xlYW5lZENvZGUobCksIG8pKHYpO1xuY2xhc3MgRm9ybWF0dGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyLmNyZWF0ZSgnZm9ybWF0dGVyJyk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmluaXQob3B0aW9ucyk7XG4gIH1cbiAgaW5pdChzZXJ2aWNlcywgb3B0aW9ucyA9IHtcbiAgICBpbnRlcnBvbGF0aW9uOiB7fVxuICB9KSB7XG4gICAgdGhpcy5mb3JtYXRTZXBhcmF0b3IgPSBvcHRpb25zLmludGVycG9sYXRpb24uZm9ybWF0U2VwYXJhdG9yIHx8ICcsJztcbiAgICBjb25zdCBjZiA9IG9wdGlvbnMuY2FjaGVJbkJ1aWx0Rm9ybWF0cyA/IGNyZWF0ZUNhY2hlZEZvcm1hdHRlciA6IGNyZWF0ZU5vbkNhY2hlZEZvcm1hdHRlcjtcbiAgICB0aGlzLmZvcm1hdHMgPSB7XG4gICAgICBudW1iZXI6IGNmKChsbmcsIG9wdCkgPT4ge1xuICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQobG5nLCB7XG4gICAgICAgICAgLi4ub3B0XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsID0+IGZvcm1hdHRlci5mb3JtYXQodmFsKTtcbiAgICAgIH0pLFxuICAgICAgY3VycmVuY3k6IGNmKChsbmcsIG9wdCkgPT4ge1xuICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQobG5nLCB7XG4gICAgICAgICAgLi4ub3B0LFxuICAgICAgICAgIHN0eWxlOiAnY3VycmVuY3knXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsID0+IGZvcm1hdHRlci5mb3JtYXQodmFsKTtcbiAgICAgIH0pLFxuICAgICAgZGF0ZXRpbWU6IGNmKChsbmcsIG9wdCkgPT4ge1xuICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsbmcsIHtcbiAgICAgICAgICAuLi5vcHRcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2YWwgPT4gZm9ybWF0dGVyLmZvcm1hdCh2YWwpO1xuICAgICAgfSksXG4gICAgICByZWxhdGl2ZXRpbWU6IGNmKChsbmcsIG9wdCkgPT4ge1xuICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSW50bC5SZWxhdGl2ZVRpbWVGb3JtYXQobG5nLCB7XG4gICAgICAgICAgLi4ub3B0XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsID0+IGZvcm1hdHRlci5mb3JtYXQodmFsLCBvcHQucmFuZ2UgfHwgJ2RheScpO1xuICAgICAgfSksXG4gICAgICBsaXN0OiBjZigobG5nLCBvcHQpID0+IHtcbiAgICAgICAgY29uc3QgZm9ybWF0dGVyID0gbmV3IEludGwuTGlzdEZvcm1hdChsbmcsIHtcbiAgICAgICAgICAuLi5vcHRcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2YWwgPT4gZm9ybWF0dGVyLmZvcm1hdCh2YWwpO1xuICAgICAgfSlcbiAgICB9O1xuICB9XG4gIGFkZChuYW1lLCBmYykge1xuICAgIHRoaXMuZm9ybWF0c1tuYW1lLnRvTG93ZXJDYXNlKCkudHJpbSgpXSA9IGZjO1xuICB9XG4gIGFkZENhY2hlZChuYW1lLCBmYykge1xuICAgIHRoaXMuZm9ybWF0c1tuYW1lLnRvTG93ZXJDYXNlKCkudHJpbSgpXSA9IGNyZWF0ZUNhY2hlZEZvcm1hdHRlcihmYyk7XG4gIH1cbiAgZm9ybWF0KHZhbHVlLCBmb3JtYXQsIGxuZywgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCFmb3JtYXQpIHJldHVybiB2YWx1ZTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIHZhbHVlO1xuICAgIGNvbnN0IGZvcm1hdHMgPSBmb3JtYXQuc3BsaXQodGhpcy5mb3JtYXRTZXBhcmF0b3IpO1xuICAgIGlmIChmb3JtYXRzLmxlbmd0aCA+IDEgJiYgZm9ybWF0c1swXS5pbmRleE9mKCcoJykgPiAxICYmICFmb3JtYXRzWzBdLmluY2x1ZGVzKCcpJykgJiYgZm9ybWF0cy5maW5kKGYgPT4gZi5pbmNsdWRlcygnKScpKSkge1xuICAgICAgY29uc3QgbGFzdEluZGV4ID0gZm9ybWF0cy5maW5kSW5kZXgoZiA9PiBmLmluY2x1ZGVzKCcpJykpO1xuICAgICAgZm9ybWF0c1swXSA9IFtmb3JtYXRzWzBdLCAuLi5mb3JtYXRzLnNwbGljZSgxLCBsYXN0SW5kZXgpXS5qb2luKHRoaXMuZm9ybWF0U2VwYXJhdG9yKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0cy5yZWR1Y2UoKG1lbSwgZikgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICBmb3JtYXROYW1lLFxuICAgICAgICBmb3JtYXRPcHRpb25zXG4gICAgICB9ID0gcGFyc2VGb3JtYXRTdHIoZik7XG4gICAgICBpZiAodGhpcy5mb3JtYXRzW2Zvcm1hdE5hbWVdKSB7XG4gICAgICAgIGxldCBmb3JtYXR0ZWQgPSBtZW07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgdmFsT3B0aW9ucyA9IG9wdGlvbnM/LmZvcm1hdFBhcmFtcz8uW29wdGlvbnMuaW50ZXJwb2xhdGlvbmtleV0gfHwge307XG4gICAgICAgICAgY29uc3QgbCA9IHZhbE9wdGlvbnMubG9jYWxlIHx8IHZhbE9wdGlvbnMubG5nIHx8IG9wdGlvbnMubG9jYWxlIHx8IG9wdGlvbnMubG5nIHx8IGxuZztcbiAgICAgICAgICBmb3JtYXR0ZWQgPSB0aGlzLmZvcm1hdHNbZm9ybWF0TmFtZV0obWVtLCBsLCB7XG4gICAgICAgICAgICAuLi5mb3JtYXRPcHRpb25zLFxuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIC4uLnZhbE9wdGlvbnNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm9ybWF0dGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybihgdGhlcmUgd2FzIG5vIGZvcm1hdCBmdW5jdGlvbiBmb3IgJHtmb3JtYXROYW1lfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbTtcbiAgICB9LCB2YWx1ZSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5jb25zdCByZW1vdmVQZW5kaW5nID0gKHEsIG5hbWUpID0+IHtcbiAgaWYgKHEucGVuZGluZ1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZGVsZXRlIHEucGVuZGluZ1tuYW1lXTtcbiAgICBxLnBlbmRpbmdDb3VudC0tO1xuICB9XG59O1xuY2xhc3MgQ29ubmVjdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoYmFja2VuZCwgc3RvcmUsIHNlcnZpY2VzLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYmFja2VuZCA9IGJhY2tlbmQ7XG4gICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgIHRoaXMuc2VydmljZXMgPSBzZXJ2aWNlcztcbiAgICB0aGlzLmxhbmd1YWdlVXRpbHMgPSBzZXJ2aWNlcy5sYW5ndWFnZVV0aWxzO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyLmNyZWF0ZSgnYmFja2VuZENvbm5lY3RvcicpO1xuICAgIHRoaXMud2FpdGluZ1JlYWRzID0gW107XG4gICAgdGhpcy5tYXhQYXJhbGxlbFJlYWRzID0gb3B0aW9ucy5tYXhQYXJhbGxlbFJlYWRzIHx8IDEwO1xuICAgIHRoaXMucmVhZGluZ0NhbGxzID0gMDtcbiAgICB0aGlzLm1heFJldHJpZXMgPSBvcHRpb25zLm1heFJldHJpZXMgPj0gMCA/IG9wdGlvbnMubWF4UmV0cmllcyA6IDU7XG4gICAgdGhpcy5yZXRyeVRpbWVvdXQgPSBvcHRpb25zLnJldHJ5VGltZW91dCA+PSAxID8gb3B0aW9ucy5yZXRyeVRpbWVvdXQgOiAzNTA7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLmJhY2tlbmQ/LmluaXQ/LihzZXJ2aWNlcywgb3B0aW9ucy5iYWNrZW5kLCBvcHRpb25zKTtcbiAgfVxuICBxdWV1ZUxvYWQobGFuZ3VhZ2VzLCBuYW1lc3BhY2VzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHRvTG9hZCA9IHt9O1xuICAgIGNvbnN0IHBlbmRpbmcgPSB7fTtcbiAgICBjb25zdCB0b0xvYWRMYW5ndWFnZXMgPSB7fTtcbiAgICBjb25zdCB0b0xvYWROYW1lc3BhY2VzID0ge307XG4gICAgbGFuZ3VhZ2VzLmZvckVhY2gobG5nID0+IHtcbiAgICAgIGxldCBoYXNBbGxOYW1lc3BhY2VzID0gdHJ1ZTtcbiAgICAgIG5hbWVzcGFjZXMuZm9yRWFjaChucyA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHtsbmd9fCR7bnN9YDtcbiAgICAgICAgaWYgKCFvcHRpb25zLnJlbG9hZCAmJiB0aGlzLnN0b3JlLmhhc1Jlc291cmNlQnVuZGxlKGxuZywgbnMpKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZVtuYW1lXSA9IDI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZVtuYW1lXSA8IDApIDsgZWxzZSBpZiAodGhpcy5zdGF0ZVtuYW1lXSA9PT0gMSkge1xuICAgICAgICAgIGlmIChwZW5kaW5nW25hbWVdID09PSB1bmRlZmluZWQpIHBlbmRpbmdbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RhdGVbbmFtZV0gPSAxO1xuICAgICAgICAgIGhhc0FsbE5hbWVzcGFjZXMgPSBmYWxzZTtcbiAgICAgICAgICBpZiAocGVuZGluZ1tuYW1lXSA9PT0gdW5kZWZpbmVkKSBwZW5kaW5nW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodG9Mb2FkW25hbWVdID09PSB1bmRlZmluZWQpIHRvTG9hZFtuYW1lXSA9IHRydWU7XG4gICAgICAgICAgaWYgKHRvTG9hZE5hbWVzcGFjZXNbbnNdID09PSB1bmRlZmluZWQpIHRvTG9hZE5hbWVzcGFjZXNbbnNdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoIWhhc0FsbE5hbWVzcGFjZXMpIHRvTG9hZExhbmd1YWdlc1tsbmddID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBpZiAoT2JqZWN0LmtleXModG9Mb2FkKS5sZW5ndGggfHwgT2JqZWN0LmtleXMocGVuZGluZykubGVuZ3RoKSB7XG4gICAgICB0aGlzLnF1ZXVlLnB1c2goe1xuICAgICAgICBwZW5kaW5nLFxuICAgICAgICBwZW5kaW5nQ291bnQ6IE9iamVjdC5rZXlzKHBlbmRpbmcpLmxlbmd0aCxcbiAgICAgICAgbG9hZGVkOiB7fSxcbiAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgY2FsbGJhY2tcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgdG9Mb2FkOiBPYmplY3Qua2V5cyh0b0xvYWQpLFxuICAgICAgcGVuZGluZzogT2JqZWN0LmtleXMocGVuZGluZyksXG4gICAgICB0b0xvYWRMYW5ndWFnZXM6IE9iamVjdC5rZXlzKHRvTG9hZExhbmd1YWdlcyksXG4gICAgICB0b0xvYWROYW1lc3BhY2VzOiBPYmplY3Qua2V5cyh0b0xvYWROYW1lc3BhY2VzKVxuICAgIH07XG4gIH1cbiAgbG9hZGVkKG5hbWUsIGVyciwgZGF0YSkge1xuICAgIGNvbnN0IHMgPSBuYW1lLnNwbGl0KCd8Jyk7XG4gICAgY29uc3QgbG5nID0gc1swXTtcbiAgICBjb25zdCBucyA9IHNbMV07XG4gICAgaWYgKGVycikgdGhpcy5lbWl0KCdmYWlsZWRMb2FkaW5nJywgbG5nLCBucywgZXJyKTtcbiAgICBpZiAoIWVyciAmJiBkYXRhKSB7XG4gICAgICB0aGlzLnN0b3JlLmFkZFJlc291cmNlQnVuZGxlKGxuZywgbnMsIGRhdGEsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICAgIHNraXBDb3B5OiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZVtuYW1lXSA9IGVyciA/IC0xIDogMjtcbiAgICBpZiAoZXJyICYmIGRhdGEpIHRoaXMuc3RhdGVbbmFtZV0gPSAwO1xuICAgIGNvbnN0IGxvYWRlZCA9IHt9O1xuICAgIHRoaXMucXVldWUuZm9yRWFjaChxID0+IHtcbiAgICAgIHB1c2hQYXRoKHEubG9hZGVkLCBbbG5nXSwgbnMpO1xuICAgICAgcmVtb3ZlUGVuZGluZyhxLCBuYW1lKTtcbiAgICAgIGlmIChlcnIpIHEuZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIGlmIChxLnBlbmRpbmdDb3VudCA9PT0gMCAmJiAhcS5kb25lKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHEubG9hZGVkKS5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgIGlmICghbG9hZGVkW2xdKSBsb2FkZWRbbF0gPSB7fTtcbiAgICAgICAgICBjb25zdCBsb2FkZWRLZXlzID0gcS5sb2FkZWRbbF07XG4gICAgICAgICAgaWYgKGxvYWRlZEtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBsb2FkZWRLZXlzLmZvckVhY2gobiA9PiB7XG4gICAgICAgICAgICAgIGlmIChsb2FkZWRbbF1bbl0gPT09IHVuZGVmaW5lZCkgbG9hZGVkW2xdW25dID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHEuZG9uZSA9IHRydWU7XG4gICAgICAgIGlmIChxLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBxLmNhbGxiYWNrKHEuZXJyb3JzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBxLmNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoJ2xvYWRlZCcsIGxvYWRlZCk7XG4gICAgdGhpcy5xdWV1ZSA9IHRoaXMucXVldWUuZmlsdGVyKHEgPT4gIXEuZG9uZSk7XG4gIH1cbiAgcmVhZChsbmcsIG5zLCBmY05hbWUsIHRyaWVkID0gMCwgd2FpdCA9IHRoaXMucmV0cnlUaW1lb3V0LCBjYWxsYmFjaykge1xuICAgIGlmICghbG5nLmxlbmd0aCkgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHt9KTtcbiAgICBpZiAodGhpcy5yZWFkaW5nQ2FsbHMgPj0gdGhpcy5tYXhQYXJhbGxlbFJlYWRzKSB7XG4gICAgICB0aGlzLndhaXRpbmdSZWFkcy5wdXNoKHtcbiAgICAgICAgbG5nLFxuICAgICAgICBucyxcbiAgICAgICAgZmNOYW1lLFxuICAgICAgICB0cmllZCxcbiAgICAgICAgd2FpdCxcbiAgICAgICAgY2FsbGJhY2tcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlYWRpbmdDYWxscysrO1xuICAgIGNvbnN0IHJlc29sdmVyID0gKGVyciwgZGF0YSkgPT4ge1xuICAgICAgdGhpcy5yZWFkaW5nQ2FsbHMtLTtcbiAgICAgIGlmICh0aGlzLndhaXRpbmdSZWFkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLndhaXRpbmdSZWFkcy5zaGlmdCgpO1xuICAgICAgICB0aGlzLnJlYWQobmV4dC5sbmcsIG5leHQubnMsIG5leHQuZmNOYW1lLCBuZXh0LnRyaWVkLCBuZXh0LndhaXQsIG5leHQuY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgaWYgKGVyciAmJiBkYXRhICYmIHRyaWVkIDwgdGhpcy5tYXhSZXRyaWVzKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVhZChsbmcsIG5zLCBmY05hbWUsIHRyaWVkICsgMSwgd2FpdCAqIDIsIGNhbGxiYWNrKTtcbiAgICAgICAgfSwgd2FpdCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfTtcbiAgICBjb25zdCBmYyA9IHRoaXMuYmFja2VuZFtmY05hbWVdLmJpbmQodGhpcy5iYWNrZW5kKTtcbiAgICBpZiAoZmMubGVuZ3RoID09PSAyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByID0gZmMobG5nLCBucyk7XG4gICAgICAgIGlmIChyICYmIHR5cGVvZiByLnRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByLnRoZW4oZGF0YSA9PiByZXNvbHZlcihudWxsLCBkYXRhKSkuY2F0Y2gocmVzb2x2ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmVyKG51bGwsIHIpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVzb2x2ZXIoZXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGZjKGxuZywgbnMsIHJlc29sdmVyKTtcbiAgfVxuICBwcmVwYXJlTG9hZGluZyhsYW5ndWFnZXMsIG5hbWVzcGFjZXMsIG9wdGlvbnMgPSB7fSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuYmFja2VuZCkge1xuICAgICAgdGhpcy5sb2dnZXIud2FybignTm8gYmFja2VuZCB3YXMgYWRkZWQgdmlhIGkxOG5leHQudXNlLiBXaWxsIG5vdCBsb2FkIHJlc291cmNlcy4nKTtcbiAgICAgIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgIH1cbiAgICBpZiAoaXNTdHJpbmcobGFuZ3VhZ2VzKSkgbGFuZ3VhZ2VzID0gdGhpcy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShsYW5ndWFnZXMpO1xuICAgIGlmIChpc1N0cmluZyhuYW1lc3BhY2VzKSkgbmFtZXNwYWNlcyA9IFtuYW1lc3BhY2VzXTtcbiAgICBjb25zdCB0b0xvYWQgPSB0aGlzLnF1ZXVlTG9hZChsYW5ndWFnZXMsIG5hbWVzcGFjZXMsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICBpZiAoIXRvTG9hZC50b0xvYWQubGVuZ3RoKSB7XG4gICAgICBpZiAoIXRvTG9hZC5wZW5kaW5nLmxlbmd0aCkgY2FsbGJhY2soKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0b0xvYWQudG9Mb2FkLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICB0aGlzLmxvYWRPbmUobmFtZSk7XG4gICAgfSk7XG4gIH1cbiAgbG9hZChsYW5ndWFnZXMsIG5hbWVzcGFjZXMsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5wcmVwYXJlTG9hZGluZyhsYW5ndWFnZXMsIG5hbWVzcGFjZXMsIHt9LCBjYWxsYmFjayk7XG4gIH1cbiAgcmVsb2FkKGxhbmd1YWdlcywgbmFtZXNwYWNlcywgY2FsbGJhY2spIHtcbiAgICB0aGlzLnByZXBhcmVMb2FkaW5nKGxhbmd1YWdlcywgbmFtZXNwYWNlcywge1xuICAgICAgcmVsb2FkOiB0cnVlXG4gICAgfSwgY2FsbGJhY2spO1xuICB9XG4gIGxvYWRPbmUobmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICBjb25zdCBzID0gbmFtZS5zcGxpdCgnfCcpO1xuICAgIGNvbnN0IGxuZyA9IHNbMF07XG4gICAgY29uc3QgbnMgPSBzWzFdO1xuICAgIHRoaXMucmVhZChsbmcsIG5zLCAncmVhZCcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBpZiAoZXJyKSB0aGlzLmxvZ2dlci53YXJuKGAke3ByZWZpeH1sb2FkaW5nIG5hbWVzcGFjZSAke25zfSBmb3IgbGFuZ3VhZ2UgJHtsbmd9IGZhaWxlZGAsIGVycik7XG4gICAgICBpZiAoIWVyciAmJiBkYXRhKSB0aGlzLmxvZ2dlci5sb2coYCR7cHJlZml4fWxvYWRlZCBuYW1lc3BhY2UgJHtuc30gZm9yIGxhbmd1YWdlICR7bG5nfWAsIGRhdGEpO1xuICAgICAgdGhpcy5sb2FkZWQobmFtZSwgZXJyLCBkYXRhKTtcbiAgICB9KTtcbiAgfVxuICBzYXZlTWlzc2luZyhsYW5ndWFnZXMsIG5hbWVzcGFjZSwga2V5LCBmYWxsYmFja1ZhbHVlLCBpc1VwZGF0ZSwgb3B0aW9ucyA9IHt9LCBjbGIgPSAoKSA9PiB7fSkge1xuICAgIGlmICh0aGlzLnNlcnZpY2VzPy51dGlscz8uaGFzTG9hZGVkTmFtZXNwYWNlICYmICF0aGlzLnNlcnZpY2VzPy51dGlscz8uaGFzTG9hZGVkTmFtZXNwYWNlKG5hbWVzcGFjZSkpIHtcbiAgICAgIHRoaXMubG9nZ2VyLndhcm4oYGRpZCBub3Qgc2F2ZSBrZXkgXCIke2tleX1cIiBhcyB0aGUgbmFtZXNwYWNlIFwiJHtuYW1lc3BhY2V9XCIgd2FzIG5vdCB5ZXQgbG9hZGVkYCwgJ1RoaXMgbWVhbnMgc29tZXRoaW5nIElTIFdST05HIGluIHlvdXIgc2V0dXAuIFlvdSBhY2Nlc3MgdGhlIHQgZnVuY3Rpb24gYmVmb3JlIGkxOG5leHQuaW5pdCAvIGkxOG5leHQubG9hZE5hbWVzcGFjZSAvIGkxOG5leHQuY2hhbmdlTGFuZ3VhZ2Ugd2FzIGRvbmUuIFdhaXQgZm9yIHRoZSBjYWxsYmFjayBvciBQcm9taXNlIHRvIHJlc29sdmUgYmVmb3JlIGFjY2Vzc2luZyBpdCEhIScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsIHx8IGtleSA9PT0gJycpIHJldHVybjtcbiAgICBpZiAodGhpcy5iYWNrZW5kPy5jcmVhdGUpIHtcbiAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIGlzVXBkYXRlXG4gICAgICB9O1xuICAgICAgY29uc3QgZmMgPSB0aGlzLmJhY2tlbmQuY3JlYXRlLmJpbmQodGhpcy5iYWNrZW5kKTtcbiAgICAgIGlmIChmYy5sZW5ndGggPCA2KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbGV0IHI7XG4gICAgICAgICAgaWYgKGZjLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgICAgciA9IGZjKGxhbmd1YWdlcywgbmFtZXNwYWNlLCBrZXksIGZhbGxiYWNrVmFsdWUsIG9wdHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByID0gZmMobGFuZ3VhZ2VzLCBuYW1lc3BhY2UsIGtleSwgZmFsbGJhY2tWYWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyICYmIHR5cGVvZiByLnRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHIudGhlbihkYXRhID0+IGNsYihudWxsLCBkYXRhKSkuY2F0Y2goY2xiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xiKG51bGwsIHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY2xiKGVycik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZjKGxhbmd1YWdlcywgbmFtZXNwYWNlLCBrZXksIGZhbGxiYWNrVmFsdWUsIGNsYiwgb3B0cyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbGFuZ3VhZ2VzIHx8ICFsYW5ndWFnZXNbMF0pIHJldHVybjtcbiAgICB0aGlzLnN0b3JlLmFkZFJlc291cmNlKGxhbmd1YWdlc1swXSwgbmFtZXNwYWNlLCBrZXksIGZhbGxiYWNrVmFsdWUpO1xuICB9XG59XG5cbmNvbnN0IGdldCA9ICgpID0+ICh7XG4gIGRlYnVnOiBmYWxzZSxcbiAgaW5pdEFzeW5jOiB0cnVlLFxuICBuczogWyd0cmFuc2xhdGlvbiddLFxuICBkZWZhdWx0TlM6IFsndHJhbnNsYXRpb24nXSxcbiAgZmFsbGJhY2tMbmc6IFsnZGV2J10sXG4gIGZhbGxiYWNrTlM6IGZhbHNlLFxuICBzdXBwb3J0ZWRMbmdzOiBmYWxzZSxcbiAgbm9uRXhwbGljaXRTdXBwb3J0ZWRMbmdzOiBmYWxzZSxcbiAgbG9hZDogJ2FsbCcsXG4gIHByZWxvYWQ6IGZhbHNlLFxuICBrZXlTZXBhcmF0b3I6ICcuJyxcbiAgbnNTZXBhcmF0b3I6ICc6JyxcbiAgcGx1cmFsU2VwYXJhdG9yOiAnXycsXG4gIGNvbnRleHRTZXBhcmF0b3I6ICdfJyxcbiAgZW5hYmxlU2VsZWN0b3I6IGZhbHNlLFxuICBwYXJ0aWFsQnVuZGxlZExhbmd1YWdlczogZmFsc2UsXG4gIHNhdmVNaXNzaW5nOiBmYWxzZSxcbiAgdXBkYXRlTWlzc2luZzogZmFsc2UsXG4gIHNhdmVNaXNzaW5nVG86ICdmYWxsYmFjaycsXG4gIHNhdmVNaXNzaW5nUGx1cmFsczogdHJ1ZSxcbiAgbWlzc2luZ0tleUhhbmRsZXI6IGZhbHNlLFxuICBtaXNzaW5nSW50ZXJwb2xhdGlvbkhhbmRsZXI6IGZhbHNlLFxuICBwb3N0UHJvY2VzczogZmFsc2UsXG4gIHBvc3RQcm9jZXNzUGFzc1Jlc29sdmVkOiBmYWxzZSxcbiAgcmV0dXJuTnVsbDogZmFsc2UsXG4gIHJldHVybkVtcHR5U3RyaW5nOiB0cnVlLFxuICByZXR1cm5PYmplY3RzOiBmYWxzZSxcbiAgam9pbkFycmF5czogZmFsc2UsXG4gIHJldHVybmVkT2JqZWN0SGFuZGxlcjogZmFsc2UsXG4gIHBhcnNlTWlzc2luZ0tleUhhbmRsZXI6IGZhbHNlLFxuICBhcHBlbmROYW1lc3BhY2VUb01pc3NpbmdLZXk6IGZhbHNlLFxuICBhcHBlbmROYW1lc3BhY2VUb0NJTW9kZTogZmFsc2UsXG4gIG92ZXJsb2FkVHJhbnNsYXRpb25PcHRpb25IYW5kbGVyOiBhcmdzID0+IHtcbiAgICBsZXQgcmV0ID0ge307XG4gICAgaWYgKHR5cGVvZiBhcmdzWzFdID09PSAnb2JqZWN0JykgcmV0ID0gYXJnc1sxXTtcbiAgICBpZiAoaXNTdHJpbmcoYXJnc1sxXSkpIHJldC5kZWZhdWx0VmFsdWUgPSBhcmdzWzFdO1xuICAgIGlmIChpc1N0cmluZyhhcmdzWzJdKSkgcmV0LnREZXNjcmlwdGlvbiA9IGFyZ3NbMl07XG4gICAgaWYgKHR5cGVvZiBhcmdzWzJdID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgYXJnc1szXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBhcmdzWzNdIHx8IGFyZ3NbMl07XG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIHJldFtrZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH0sXG4gIGludGVycG9sYXRpb246IHtcbiAgICBlc2NhcGVWYWx1ZTogdHJ1ZSxcbiAgICBwcmVmaXg6ICd7eycsXG4gICAgc3VmZml4OiAnfX0nLFxuICAgIGZvcm1hdFNlcGFyYXRvcjogJywnLFxuICAgIHVuZXNjYXBlUHJlZml4OiAnLScsXG4gICAgbmVzdGluZ1ByZWZpeDogJyR0KCcsXG4gICAgbmVzdGluZ1N1ZmZpeDogJyknLFxuICAgIG5lc3RpbmdPcHRpb25zU2VwYXJhdG9yOiAnLCcsXG4gICAgbWF4UmVwbGFjZXM6IDEwMDAsXG4gICAgc2tpcE9uVmFyaWFibGVzOiB0cnVlXG4gIH0sXG4gIGNhY2hlSW5CdWlsdEZvcm1hdHM6IHRydWVcbn0pO1xuY29uc3QgdHJhbnNmb3JtT3B0aW9ucyA9IG9wdGlvbnMgPT4ge1xuICBpZiAoaXNTdHJpbmcob3B0aW9ucy5ucykpIG9wdGlvbnMubnMgPSBbb3B0aW9ucy5uc107XG4gIGlmIChpc1N0cmluZyhvcHRpb25zLmZhbGxiYWNrTG5nKSkgb3B0aW9ucy5mYWxsYmFja0xuZyA9IFtvcHRpb25zLmZhbGxiYWNrTG5nXTtcbiAgaWYgKGlzU3RyaW5nKG9wdGlvbnMuZmFsbGJhY2tOUykpIG9wdGlvbnMuZmFsbGJhY2tOUyA9IFtvcHRpb25zLmZhbGxiYWNrTlNdO1xuICBpZiAob3B0aW9ucy5zdXBwb3J0ZWRMbmdzICYmICFvcHRpb25zLnN1cHBvcnRlZExuZ3MuaW5jbHVkZXMoJ2NpbW9kZScpKSB7XG4gICAgb3B0aW9ucy5zdXBwb3J0ZWRMbmdzID0gb3B0aW9ucy5zdXBwb3J0ZWRMbmdzLmNvbmNhdChbJ2NpbW9kZSddKTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcbmNvbnN0IGJpbmRNZW1iZXJGdW5jdGlvbnMgPSBpbnN0ID0+IHtcbiAgY29uc3QgbWVtcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE9iamVjdC5nZXRQcm90b3R5cGVPZihpbnN0KSk7XG4gIG1lbXMuZm9yRWFjaChtZW0gPT4ge1xuICAgIGlmICh0eXBlb2YgaW5zdFttZW1dID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpbnN0W21lbV0gPSBpbnN0W21lbV0uYmluZChpbnN0KTtcbiAgICB9XG4gIH0pO1xufTtcbmNsYXNzIEkxOG4gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30sIGNhbGxiYWNrKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm9wdGlvbnMgPSB0cmFuc2Zvcm1PcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuc2VydmljZXMgPSB7fTtcbiAgICB0aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXI7XG4gICAgdGhpcy5tb2R1bGVzID0ge1xuICAgICAgZXh0ZXJuYWw6IFtdXG4gICAgfTtcbiAgICBiaW5kTWVtYmVyRnVuY3Rpb25zKHRoaXMpO1xuICAgIGlmIChjYWxsYmFjayAmJiAhdGhpcy5pc0luaXRpYWxpemVkICYmICFvcHRpb25zLmlzQ2xvbmUpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmluaXRBc3luYykge1xuICAgICAgICB0aGlzLmluaXQob3B0aW9ucywgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmluaXQob3B0aW9ucywgY2FsbGJhY2spO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9XG4gIGluaXQob3B0aW9ucyA9IHt9LCBjYWxsYmFjaykge1xuICAgIHRoaXMuaXNJbml0aWFsaXppbmcgPSB0cnVlO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5kZWZhdWx0TlMgPT0gbnVsbCAmJiBvcHRpb25zLm5zKSB7XG4gICAgICBpZiAoaXNTdHJpbmcob3B0aW9ucy5ucykpIHtcbiAgICAgICAgb3B0aW9ucy5kZWZhdWx0TlMgPSBvcHRpb25zLm5zO1xuICAgICAgfSBlbHNlIGlmICghb3B0aW9ucy5ucy5pbmNsdWRlcygndHJhbnNsYXRpb24nKSkge1xuICAgICAgICBvcHRpb25zLmRlZmF1bHROUyA9IG9wdGlvbnMubnNbMF07XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRlZk9wdHMgPSBnZXQoKTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAuLi5kZWZPcHRzLFxuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgLi4udHJhbnNmb3JtT3B0aW9ucyhvcHRpb25zKVxuICAgIH07XG4gICAgdGhpcy5vcHRpb25zLmludGVycG9sYXRpb24gPSB7XG4gICAgICAuLi5kZWZPcHRzLmludGVycG9sYXRpb24sXG4gICAgICAuLi50aGlzLm9wdGlvbnMuaW50ZXJwb2xhdGlvblxuICAgIH07XG4gICAgaWYgKG9wdGlvbnMua2V5U2VwYXJhdG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub3B0aW9ucy51c2VyRGVmaW5lZEtleVNlcGFyYXRvciA9IG9wdGlvbnMua2V5U2VwYXJhdG9yO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5uc1NlcGFyYXRvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9wdGlvbnMudXNlckRlZmluZWROc1NlcGFyYXRvciA9IG9wdGlvbnMubnNTZXBhcmF0b3I7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm92ZXJsb2FkVHJhbnNsYXRpb25PcHRpb25IYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9wdGlvbnMub3ZlcmxvYWRUcmFuc2xhdGlvbk9wdGlvbkhhbmRsZXIgPSBkZWZPcHRzLm92ZXJsb2FkVHJhbnNsYXRpb25PcHRpb25IYW5kbGVyO1xuICAgIH1cbiAgICBjb25zdCBjcmVhdGVDbGFzc09uRGVtYW5kID0gQ2xhc3NPck9iamVjdCA9PiB7XG4gICAgICBpZiAoIUNsYXNzT3JPYmplY3QpIHJldHVybiBudWxsO1xuICAgICAgaWYgKHR5cGVvZiBDbGFzc09yT2JqZWN0ID09PSAnZnVuY3Rpb24nKSByZXR1cm4gbmV3IENsYXNzT3JPYmplY3QoKTtcbiAgICAgIHJldHVybiBDbGFzc09yT2JqZWN0O1xuICAgIH07XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuaXNDbG9uZSkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlcy5sb2dnZXIpIHtcbiAgICAgICAgYmFzZUxvZ2dlci5pbml0KGNyZWF0ZUNsYXNzT25EZW1hbmQodGhpcy5tb2R1bGVzLmxvZ2dlciksIHRoaXMub3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYXNlTG9nZ2VyLmluaXQobnVsbCwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGxldCBmb3JtYXR0ZXI7XG4gICAgICBpZiAodGhpcy5tb2R1bGVzLmZvcm1hdHRlcikge1xuICAgICAgICBmb3JtYXR0ZXIgPSB0aGlzLm1vZHVsZXMuZm9ybWF0dGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybWF0dGVyID0gRm9ybWF0dGVyO1xuICAgICAgfVxuICAgICAgY29uc3QgbHUgPSBuZXcgTGFuZ3VhZ2VVdGlsKHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLnN0b3JlID0gbmV3IFJlc291cmNlU3RvcmUodGhpcy5vcHRpb25zLnJlc291cmNlcywgdGhpcy5vcHRpb25zKTtcbiAgICAgIGNvbnN0IHMgPSB0aGlzLnNlcnZpY2VzO1xuICAgICAgcy5sb2dnZXIgPSBiYXNlTG9nZ2VyO1xuICAgICAgcy5yZXNvdXJjZVN0b3JlID0gdGhpcy5zdG9yZTtcbiAgICAgIHMubGFuZ3VhZ2VVdGlscyA9IGx1O1xuICAgICAgcy5wbHVyYWxSZXNvbHZlciA9IG5ldyBQbHVyYWxSZXNvbHZlcihsdSwge1xuICAgICAgICBwcmVwZW5kOiB0aGlzLm9wdGlvbnMucGx1cmFsU2VwYXJhdG9yXG4gICAgICB9KTtcbiAgICAgIGlmIChmb3JtYXR0ZXIpIHtcbiAgICAgICAgcy5mb3JtYXR0ZXIgPSBjcmVhdGVDbGFzc09uRGVtYW5kKGZvcm1hdHRlcik7XG4gICAgICAgIGlmIChzLmZvcm1hdHRlci5pbml0KSBzLmZvcm1hdHRlci5pbml0KHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLmZvcm1hdCA9IHMuZm9ybWF0dGVyLmZvcm1hdC5iaW5kKHMuZm9ybWF0dGVyKTtcbiAgICAgIH1cbiAgICAgIHMuaW50ZXJwb2xhdG9yID0gbmV3IEludGVycG9sYXRvcih0aGlzLm9wdGlvbnMpO1xuICAgICAgcy51dGlscyA9IHtcbiAgICAgICAgaGFzTG9hZGVkTmFtZXNwYWNlOiB0aGlzLmhhc0xvYWRlZE5hbWVzcGFjZS5iaW5kKHRoaXMpXG4gICAgICB9O1xuICAgICAgcy5iYWNrZW5kQ29ubmVjdG9yID0gbmV3IENvbm5lY3RvcihjcmVhdGVDbGFzc09uRGVtYW5kKHRoaXMubW9kdWxlcy5iYWNrZW5kKSwgcy5yZXNvdXJjZVN0b3JlLCBzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgcy5iYWNrZW5kQ29ubmVjdG9yLm9uKCcqJywgKGV2ZW50LCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdChldmVudCwgLi4uYXJncyk7XG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLm1vZHVsZXMubGFuZ3VhZ2VEZXRlY3Rvcikge1xuICAgICAgICBzLmxhbmd1YWdlRGV0ZWN0b3IgPSBjcmVhdGVDbGFzc09uRGVtYW5kKHRoaXMubW9kdWxlcy5sYW5ndWFnZURldGVjdG9yKTtcbiAgICAgICAgaWYgKHMubGFuZ3VhZ2VEZXRlY3Rvci5pbml0KSBzLmxhbmd1YWdlRGV0ZWN0b3IuaW5pdChzLCB0aGlzLm9wdGlvbnMuZGV0ZWN0aW9uLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubW9kdWxlcy5pMThuRm9ybWF0KSB7XG4gICAgICAgIHMuaTE4bkZvcm1hdCA9IGNyZWF0ZUNsYXNzT25EZW1hbmQodGhpcy5tb2R1bGVzLmkxOG5Gb3JtYXQpO1xuICAgICAgICBpZiAocy5pMThuRm9ybWF0LmluaXQpIHMuaTE4bkZvcm1hdC5pbml0KHRoaXMpO1xuICAgICAgfVxuICAgICAgdGhpcy50cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IodGhpcy5zZXJ2aWNlcywgdGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMudHJhbnNsYXRvci5vbignKicsIChldmVudCwgLi4uYXJncykgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoZXZlbnQsIC4uLmFyZ3MpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm1vZHVsZXMuZXh0ZXJuYWwuZm9yRWFjaChtID0+IHtcbiAgICAgICAgaWYgKG0uaW5pdCkgbS5pbml0KHRoaXMpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuZm9ybWF0ID0gdGhpcy5vcHRpb25zLmludGVycG9sYXRpb24uZm9ybWF0O1xuICAgIGlmICghY2FsbGJhY2spIGNhbGxiYWNrID0gbm9vcDtcbiAgICBpZiAodGhpcy5vcHRpb25zLmZhbGxiYWNrTG5nICYmICF0aGlzLnNlcnZpY2VzLmxhbmd1YWdlRGV0ZWN0b3IgJiYgIXRoaXMub3B0aW9ucy5sbmcpIHtcbiAgICAgIGNvbnN0IGNvZGVzID0gdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLmdldEZhbGxiYWNrQ29kZXModGhpcy5vcHRpb25zLmZhbGxiYWNrTG5nKTtcbiAgICAgIGlmIChjb2Rlcy5sZW5ndGggPiAwICYmIGNvZGVzWzBdICE9PSAnZGV2JykgdGhpcy5vcHRpb25zLmxuZyA9IGNvZGVzWzBdO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3RvciAmJiAhdGhpcy5vcHRpb25zLmxuZykge1xuICAgICAgdGhpcy5sb2dnZXIud2FybignaW5pdDogbm8gbGFuZ3VhZ2VEZXRlY3RvciBpcyB1c2VkIGFuZCBubyBsbmcgaXMgZGVmaW5lZCcpO1xuICAgIH1cbiAgICBjb25zdCBzdG9yZUFwaSA9IFsnZ2V0UmVzb3VyY2UnLCAnaGFzUmVzb3VyY2VCdW5kbGUnLCAnZ2V0UmVzb3VyY2VCdW5kbGUnLCAnZ2V0RGF0YUJ5TGFuZ3VhZ2UnXTtcbiAgICBzdG9yZUFwaS5mb3JFYWNoKGZjTmFtZSA9PiB7XG4gICAgICB0aGlzW2ZjTmFtZV0gPSAoLi4uYXJncykgPT4gdGhpcy5zdG9yZVtmY05hbWVdKC4uLmFyZ3MpO1xuICAgIH0pO1xuICAgIGNvbnN0IHN0b3JlQXBpQ2hhaW5lZCA9IFsnYWRkUmVzb3VyY2UnLCAnYWRkUmVzb3VyY2VzJywgJ2FkZFJlc291cmNlQnVuZGxlJywgJ3JlbW92ZVJlc291cmNlQnVuZGxlJ107XG4gICAgc3RvcmVBcGlDaGFpbmVkLmZvckVhY2goZmNOYW1lID0+IHtcbiAgICAgIHRoaXNbZmNOYW1lXSA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMuc3RvcmVbZmNOYW1lXSguLi5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIGNvbnN0IGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICBjb25zdCBsb2FkID0gKCkgPT4ge1xuICAgICAgY29uc3QgZmluaXNoID0gKGVyciwgdCkgPT4ge1xuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6aW5nID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQgJiYgIXRoaXMuaW5pdGlhbGl6ZWRTdG9yZU9uY2UpIHRoaXMubG9nZ2VyLndhcm4oJ2luaXQ6IGkxOG5leHQgaXMgYWxyZWFkeSBpbml0aWFsaXplZC4gWW91IHNob3VsZCBjYWxsIGluaXQganVzdCBvbmNlIScpO1xuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5pc0Nsb25lKSB0aGlzLmxvZ2dlci5sb2coJ2luaXRpYWxpemVkJywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5lbWl0KCdpbml0aWFsaXplZCcsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUodCk7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgdCk7XG4gICAgICB9O1xuICAgICAgaWYgKCh0aGlzLmxhbmd1YWdlcyB8fCB0aGlzLmlzTGFuZ3VhZ2VDaGFuZ2luZ1RvKSAmJiAhdGhpcy5pc0luaXRpYWxpemVkKSByZXR1cm4gZmluaXNoKG51bGwsIHRoaXMudC5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuY2hhbmdlTGFuZ3VhZ2UodGhpcy5vcHRpb25zLmxuZywgZmluaXNoKTtcbiAgICB9O1xuICAgIGlmICh0aGlzLm9wdGlvbnMucmVzb3VyY2VzIHx8ICF0aGlzLm9wdGlvbnMuaW5pdEFzeW5jKSB7XG4gICAgICBsb2FkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQobG9hZCwgMCk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZDtcbiAgfVxuICBsb2FkUmVzb3VyY2VzKGxhbmd1YWdlLCBjYWxsYmFjayA9IG5vb3ApIHtcbiAgICBsZXQgdXNlZENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgY29uc3QgdXNlZExuZyA9IGlzU3RyaW5nKGxhbmd1YWdlKSA/IGxhbmd1YWdlIDogdGhpcy5sYW5ndWFnZTtcbiAgICBpZiAodHlwZW9mIGxhbmd1YWdlID09PSAnZnVuY3Rpb24nKSB1c2VkQ2FsbGJhY2sgPSBsYW5ndWFnZTtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5yZXNvdXJjZXMgfHwgdGhpcy5vcHRpb25zLnBhcnRpYWxCdW5kbGVkTGFuZ3VhZ2VzKSB7XG4gICAgICBpZiAodXNlZExuZz8udG9Mb3dlckNhc2UoKSA9PT0gJ2NpbW9kZScgJiYgKCF0aGlzLm9wdGlvbnMucHJlbG9hZCB8fCB0aGlzLm9wdGlvbnMucHJlbG9hZC5sZW5ndGggPT09IDApKSByZXR1cm4gdXNlZENhbGxiYWNrKCk7XG4gICAgICBjb25zdCB0b0xvYWQgPSBbXTtcbiAgICAgIGNvbnN0IGFwcGVuZCA9IGxuZyA9PiB7XG4gICAgICAgIGlmICghbG5nKSByZXR1cm47XG4gICAgICAgIGlmIChsbmcgPT09ICdjaW1vZGUnKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGxuZ3MgPSB0aGlzLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMudG9SZXNvbHZlSGllcmFyY2h5KGxuZyk7XG4gICAgICAgIGxuZ3MuZm9yRWFjaChsID0+IHtcbiAgICAgICAgICBpZiAobCA9PT0gJ2NpbW9kZScpIHJldHVybjtcbiAgICAgICAgICBpZiAoIXRvTG9hZC5pbmNsdWRlcyhsKSkgdG9Mb2FkLnB1c2gobCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGlmICghdXNlZExuZykge1xuICAgICAgICBjb25zdCBmYWxsYmFja3MgPSB0aGlzLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMuZ2V0RmFsbGJhY2tDb2Rlcyh0aGlzLm9wdGlvbnMuZmFsbGJhY2tMbmcpO1xuICAgICAgICBmYWxsYmFja3MuZm9yRWFjaChsID0+IGFwcGVuZChsKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBlbmQodXNlZExuZyk7XG4gICAgICB9XG4gICAgICB0aGlzLm9wdGlvbnMucHJlbG9hZD8uZm9yRWFjaD8uKGwgPT4gYXBwZW5kKGwpKTtcbiAgICAgIHRoaXMuc2VydmljZXMuYmFja2VuZENvbm5lY3Rvci5sb2FkKHRvTG9hZCwgdGhpcy5vcHRpb25zLm5zLCBlID0+IHtcbiAgICAgICAgaWYgKCFlICYmICF0aGlzLnJlc29sdmVkTGFuZ3VhZ2UgJiYgdGhpcy5sYW5ndWFnZSkgdGhpcy5zZXRSZXNvbHZlZExhbmd1YWdlKHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgICB1c2VkQ2FsbGJhY2soZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlZENhbGxiYWNrKG51bGwpO1xuICAgIH1cbiAgfVxuICByZWxvYWRSZXNvdXJjZXMobG5ncywgbnMsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIGlmICh0eXBlb2YgbG5ncyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBsbmdzO1xuICAgICAgbG5ncyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBucztcbiAgICAgIG5zID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoIWxuZ3MpIGxuZ3MgPSB0aGlzLmxhbmd1YWdlcztcbiAgICBpZiAoIW5zKSBucyA9IHRoaXMub3B0aW9ucy5ucztcbiAgICBpZiAoIWNhbGxiYWNrKSBjYWxsYmFjayA9IG5vb3A7XG4gICAgdGhpcy5zZXJ2aWNlcy5iYWNrZW5kQ29ubmVjdG9yLnJlbG9hZChsbmdzLCBucywgZXJyID0+IHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVycmVkO1xuICB9XG4gIHVzZShtb2R1bGUpIHtcbiAgICBpZiAoIW1vZHVsZSkgdGhyb3cgbmV3IEVycm9yKCdZb3UgYXJlIHBhc3NpbmcgYW4gdW5kZWZpbmVkIG1vZHVsZSEgUGxlYXNlIGNoZWNrIHRoZSBvYmplY3QgeW91IGFyZSBwYXNzaW5nIHRvIGkxOG5leHQudXNlKCknKTtcbiAgICBpZiAoIW1vZHVsZS50eXBlKSB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBhcmUgcGFzc2luZyBhIHdyb25nIG1vZHVsZSEgUGxlYXNlIGNoZWNrIHRoZSBvYmplY3QgeW91IGFyZSBwYXNzaW5nIHRvIGkxOG5leHQudXNlKCknKTtcbiAgICBpZiAobW9kdWxlLnR5cGUgPT09ICdiYWNrZW5kJykge1xuICAgICAgdGhpcy5tb2R1bGVzLmJhY2tlbmQgPSBtb2R1bGU7XG4gICAgfVxuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJ2xvZ2dlcicgfHwgbW9kdWxlLmxvZyAmJiBtb2R1bGUud2FybiAmJiBtb2R1bGUuZXJyb3IpIHtcbiAgICAgIHRoaXMubW9kdWxlcy5sb2dnZXIgPSBtb2R1bGU7XG4gICAgfVxuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJ2xhbmd1YWdlRGV0ZWN0b3InKSB7XG4gICAgICB0aGlzLm1vZHVsZXMubGFuZ3VhZ2VEZXRlY3RvciA9IG1vZHVsZTtcbiAgICB9XG4gICAgaWYgKG1vZHVsZS50eXBlID09PSAnaTE4bkZvcm1hdCcpIHtcbiAgICAgIHRoaXMubW9kdWxlcy5pMThuRm9ybWF0ID0gbW9kdWxlO1xuICAgIH1cbiAgICBpZiAobW9kdWxlLnR5cGUgPT09ICdwb3N0UHJvY2Vzc29yJykge1xuICAgICAgcG9zdFByb2Nlc3Nvci5hZGRQb3N0UHJvY2Vzc29yKG1vZHVsZSk7XG4gICAgfVxuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJ2Zvcm1hdHRlcicpIHtcbiAgICAgIHRoaXMubW9kdWxlcy5mb3JtYXR0ZXIgPSBtb2R1bGU7XG4gICAgfVxuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJzNyZFBhcnR5Jykge1xuICAgICAgdGhpcy5tb2R1bGVzLmV4dGVybmFsLnB1c2gobW9kdWxlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0UmVzb2x2ZWRMYW5ndWFnZShsKSB7XG4gICAgaWYgKCFsIHx8ICF0aGlzLmxhbmd1YWdlcykgcmV0dXJuO1xuICAgIGlmIChbJ2NpbW9kZScsICdkZXYnXS5pbmNsdWRlcyhsKSkgcmV0dXJuO1xuICAgIGZvciAobGV0IGxpID0gMDsgbGkgPCB0aGlzLmxhbmd1YWdlcy5sZW5ndGg7IGxpKyspIHtcbiAgICAgIGNvbnN0IGxuZ0luTG5ncyA9IHRoaXMubGFuZ3VhZ2VzW2xpXTtcbiAgICAgIGlmIChbJ2NpbW9kZScsICdkZXYnXS5pbmNsdWRlcyhsbmdJbkxuZ3MpKSBjb250aW51ZTtcbiAgICAgIGlmICh0aGlzLnN0b3JlLmhhc0xhbmd1YWdlU29tZVRyYW5zbGF0aW9ucyhsbmdJbkxuZ3MpKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZWRMYW5ndWFnZSA9IGxuZ0luTG5ncztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdGhpcy5yZXNvbHZlZExhbmd1YWdlICYmICF0aGlzLmxhbmd1YWdlcy5pbmNsdWRlcyhsKSAmJiB0aGlzLnN0b3JlLmhhc0xhbmd1YWdlU29tZVRyYW5zbGF0aW9ucyhsKSkge1xuICAgICAgdGhpcy5yZXNvbHZlZExhbmd1YWdlID0gbDtcbiAgICAgIHRoaXMubGFuZ3VhZ2VzLnVuc2hpZnQobCk7XG4gICAgfVxuICB9XG4gIGNoYW5nZUxhbmd1YWdlKGxuZywgY2FsbGJhY2spIHtcbiAgICB0aGlzLmlzTGFuZ3VhZ2VDaGFuZ2luZ1RvID0gbG5nO1xuICAgIGNvbnN0IGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICB0aGlzLmVtaXQoJ2xhbmd1YWdlQ2hhbmdpbmcnLCBsbmcpO1xuICAgIGNvbnN0IHNldExuZ1Byb3BzID0gbCA9PiB7XG4gICAgICB0aGlzLmxhbmd1YWdlID0gbDtcbiAgICAgIHRoaXMubGFuZ3VhZ2VzID0gdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShsKTtcbiAgICAgIHRoaXMucmVzb2x2ZWRMYW5ndWFnZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuc2V0UmVzb2x2ZWRMYW5ndWFnZShsKTtcbiAgICB9O1xuICAgIGNvbnN0IGRvbmUgPSAoZXJyLCBsKSA9PiB7XG4gICAgICBpZiAobCkge1xuICAgICAgICBpZiAodGhpcy5pc0xhbmd1YWdlQ2hhbmdpbmdUbyA9PT0gbG5nKSB7XG4gICAgICAgICAgc2V0TG5nUHJvcHMobCk7XG4gICAgICAgICAgdGhpcy50cmFuc2xhdG9yLmNoYW5nZUxhbmd1YWdlKGwpO1xuICAgICAgICAgIHRoaXMuaXNMYW5ndWFnZUNoYW5naW5nVG8gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgdGhpcy5lbWl0KCdsYW5ndWFnZUNoYW5nZWQnLCBsKTtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ2xhbmd1YWdlQ2hhbmdlZCcsIGwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlzTGFuZ3VhZ2VDaGFuZ2luZ1RvID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZSgoLi4uYXJncykgPT4gdGhpcy50KC4uLmFyZ3MpKTtcbiAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyLCAoLi4uYXJncykgPT4gdGhpcy50KC4uLmFyZ3MpKTtcbiAgICB9O1xuICAgIGNvbnN0IHNldExuZyA9IGxuZ3MgPT4ge1xuICAgICAgaWYgKCFsbmcgJiYgIWxuZ3MgJiYgdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yKSBsbmdzID0gW107XG4gICAgICBjb25zdCBmbCA9IGlzU3RyaW5nKGxuZ3MpID8gbG5ncyA6IGxuZ3MgJiYgbG5nc1swXTtcbiAgICAgIGNvbnN0IGwgPSB0aGlzLnN0b3JlLmhhc0xhbmd1YWdlU29tZVRyYW5zbGF0aW9ucyhmbCkgPyBmbCA6IHRoaXMuc2VydmljZXMubGFuZ3VhZ2VVdGlscy5nZXRCZXN0TWF0Y2hGcm9tQ29kZXMoaXNTdHJpbmcobG5ncykgPyBbbG5nc10gOiBsbmdzKTtcbiAgICAgIGlmIChsKSB7XG4gICAgICAgIGlmICghdGhpcy5sYW5ndWFnZSkge1xuICAgICAgICAgIHNldExuZ1Byb3BzKGwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy50cmFuc2xhdG9yLmxhbmd1YWdlKSB0aGlzLnRyYW5zbGF0b3IuY2hhbmdlTGFuZ3VhZ2UobCk7XG4gICAgICAgIHRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3Rvcj8uY2FjaGVVc2VyTGFuZ3VhZ2U/LihsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubG9hZFJlc291cmNlcyhsLCBlcnIgPT4ge1xuICAgICAgICBkb25lKGVyciwgbCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGlmICghbG5nICYmIHRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3RvciAmJiAhdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yLmFzeW5jKSB7XG4gICAgICBzZXRMbmcodGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yLmRldGVjdCgpKTtcbiAgICB9IGVsc2UgaWYgKCFsbmcgJiYgdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yICYmIHRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3Rvci5hc3luYykge1xuICAgICAgaWYgKHRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3Rvci5kZXRlY3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3Rvci5kZXRlY3QoKS50aGVuKHNldExuZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlcnZpY2VzLmxhbmd1YWdlRGV0ZWN0b3IuZGV0ZWN0KHNldExuZyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldExuZyhsbmcpO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQ7XG4gIH1cbiAgZ2V0Rml4ZWRUKGxuZywgbnMsIGtleVByZWZpeCwgZml4ZWRPcHRzKSB7XG4gICAgY29uc3Qgc2NvcGVOcyA9IGZpeGVkT3B0cz8uc2NvcGVOcztcbiAgICBjb25zdCBmaXhlZFQgPSAoa2V5LCBvcHRzLCAuLi5yZXN0KSA9PiB7XG4gICAgICBsZXQgbztcbiAgICAgIGlmICh0eXBlb2Ygb3B0cyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgbyA9IHRoaXMub3B0aW9ucy5vdmVybG9hZFRyYW5zbGF0aW9uT3B0aW9uSGFuZGxlcihba2V5LCBvcHRzXS5jb25jYXQocmVzdCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbyA9IHtcbiAgICAgICAgICAuLi5vcHRzXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBvLmxuZyA9IG8ubG5nIHx8IGZpeGVkVC5sbmc7XG4gICAgICBvLmxuZ3MgPSBvLmxuZ3MgfHwgZml4ZWRULmxuZ3M7XG4gICAgICBjb25zdCBleHBsaWNpdENhbGxOcyA9IG8ubnMgIT09IHVuZGVmaW5lZCAmJiBvLm5zICE9PSBudWxsO1xuICAgICAgby5ucyA9IG8ubnMgfHwgZml4ZWRULm5zO1xuICAgICAgaWYgKG8ua2V5UHJlZml4ICE9PSAnJykgby5rZXlQcmVmaXggPSBvLmtleVByZWZpeCB8fCBrZXlQcmVmaXggfHwgZml4ZWRULmtleVByZWZpeDtcbiAgICAgIGNvbnN0IHNlbGVjdG9yT3B0cyA9IHtcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgICAuLi5vXG4gICAgICB9O1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2NvcGVOcykgJiYgIWV4cGxpY2l0Q2FsbE5zKSBzZWxlY3Rvck9wdHMubnMgPSBzY29wZU5zO1xuICAgICAgaWYgKHR5cGVvZiBvLmtleVByZWZpeCA9PT0gJ2Z1bmN0aW9uJykgby5rZXlQcmVmaXggPSBrZXlzRnJvbVNlbGVjdG9yKG8ua2V5UHJlZml4LCBzZWxlY3Rvck9wdHMpO1xuICAgICAgY29uc3Qga2V5U2VwYXJhdG9yID0gdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvciB8fCAnLic7XG4gICAgICBsZXQgcmVzdWx0S2V5O1xuICAgICAgaWYgKG8ua2V5UHJlZml4ICYmIEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICByZXN1bHRLZXkgPSBrZXkubWFwKGsgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgayA9PT0gJ2Z1bmN0aW9uJykgayA9IGtleXNGcm9tU2VsZWN0b3Ioaywgc2VsZWN0b3JPcHRzKTtcbiAgICAgICAgICByZXR1cm4gYCR7by5rZXlQcmVmaXh9JHtrZXlTZXBhcmF0b3J9JHtrfWA7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicpIGtleSA9IGtleXNGcm9tU2VsZWN0b3Ioa2V5LCBzZWxlY3Rvck9wdHMpO1xuICAgICAgICByZXN1bHRLZXkgPSBvLmtleVByZWZpeCA/IGAke28ua2V5UHJlZml4fSR7a2V5U2VwYXJhdG9yfSR7a2V5fWAgOiBrZXk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy50KHJlc3VsdEtleSwgbyk7XG4gICAgfTtcbiAgICBpZiAoaXNTdHJpbmcobG5nKSkge1xuICAgICAgZml4ZWRULmxuZyA9IGxuZztcbiAgICB9IGVsc2Uge1xuICAgICAgZml4ZWRULmxuZ3MgPSBsbmc7XG4gICAgfVxuICAgIGZpeGVkVC5ucyA9IG5zO1xuICAgIGZpeGVkVC5rZXlQcmVmaXggPSBrZXlQcmVmaXg7XG4gICAgcmV0dXJuIGZpeGVkVDtcbiAgfVxuICB0KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yPy50cmFuc2xhdGUoLi4uYXJncyk7XG4gIH1cbiAgZXhpc3RzKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yPy5leGlzdHMoLi4uYXJncyk7XG4gIH1cbiAgc2V0RGVmYXVsdE5hbWVzcGFjZShucykge1xuICAgIHRoaXMub3B0aW9ucy5kZWZhdWx0TlMgPSBucztcbiAgfVxuICBoYXNMb2FkZWROYW1lc3BhY2UobnMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghdGhpcy5pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmxvZ2dlci53YXJuKCdoYXNMb2FkZWROYW1lc3BhY2U6IGkxOG5leHQgd2FzIG5vdCBpbml0aWFsaXplZCcsIHRoaXMubGFuZ3VhZ2VzKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmxhbmd1YWdlcyB8fCAhdGhpcy5sYW5ndWFnZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmxvZ2dlci53YXJuKCdoYXNMb2FkZWROYW1lc3BhY2U6IGkxOG4ubGFuZ3VhZ2VzIHdlcmUgdW5kZWZpbmVkIG9yIGVtcHR5JywgdGhpcy5sYW5ndWFnZXMpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBsbmcgPSBvcHRpb25zLmxuZyB8fCB0aGlzLnJlc29sdmVkTGFuZ3VhZ2UgfHwgdGhpcy5sYW5ndWFnZXNbMF07XG4gICAgY29uc3QgZmFsbGJhY2tMbmcgPSB0aGlzLm9wdGlvbnMgPyB0aGlzLm9wdGlvbnMuZmFsbGJhY2tMbmcgOiBmYWxzZTtcbiAgICBjb25zdCBsYXN0TG5nID0gdGhpcy5sYW5ndWFnZXNbdGhpcy5sYW5ndWFnZXMubGVuZ3RoIC0gMV07XG4gICAgaWYgKGxuZy50b0xvd2VyQ2FzZSgpID09PSAnY2ltb2RlJykgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgbG9hZE5vdFBlbmRpbmcgPSAobCwgbikgPT4ge1xuICAgICAgY29uc3QgbG9hZFN0YXRlID0gdGhpcy5zZXJ2aWNlcy5iYWNrZW5kQ29ubmVjdG9yLnN0YXRlW2Ake2x9fCR7bn1gXTtcbiAgICAgIHJldHVybiBsb2FkU3RhdGUgPT09IC0xIHx8IGxvYWRTdGF0ZSA9PT0gMCB8fCBsb2FkU3RhdGUgPT09IDI7XG4gICAgfTtcbiAgICBpZiAob3B0aW9ucy5wcmVjaGVjaykge1xuICAgICAgY29uc3QgcHJlUmVzdWx0ID0gb3B0aW9ucy5wcmVjaGVjayh0aGlzLCBsb2FkTm90UGVuZGluZyk7XG4gICAgICBpZiAocHJlUmVzdWx0ICE9PSB1bmRlZmluZWQpIHJldHVybiBwcmVSZXN1bHQ7XG4gICAgfVxuICAgIGlmICh0aGlzLmhhc1Jlc291cmNlQnVuZGxlKGxuZywgbnMpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoIXRoaXMuc2VydmljZXMuYmFja2VuZENvbm5lY3Rvci5iYWNrZW5kIHx8IHRoaXMub3B0aW9ucy5yZXNvdXJjZXMgJiYgIXRoaXMub3B0aW9ucy5wYXJ0aWFsQnVuZGxlZExhbmd1YWdlcykgcmV0dXJuIHRydWU7XG4gICAgaWYgKGxvYWROb3RQZW5kaW5nKGxuZywgbnMpICYmICghZmFsbGJhY2tMbmcgfHwgbG9hZE5vdFBlbmRpbmcobGFzdExuZywgbnMpKSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGxvYWROYW1lc3BhY2VzKG5zLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5ucykge1xuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICBpZiAoaXNTdHJpbmcobnMpKSBucyA9IFtuc107XG4gICAgbnMuZm9yRWFjaChuID0+IHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLm5zLmluY2x1ZGVzKG4pKSB0aGlzLm9wdGlvbnMubnMucHVzaChuKTtcbiAgICB9KTtcbiAgICB0aGlzLmxvYWRSZXNvdXJjZXMoZXJyID0+IHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJyZWQ7XG4gIH1cbiAgbG9hZExhbmd1YWdlcyhsbmdzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICBpZiAoaXNTdHJpbmcobG5ncykpIGxuZ3MgPSBbbG5nc107XG4gICAgY29uc3QgcHJlbG9hZGVkID0gdGhpcy5vcHRpb25zLnByZWxvYWQgfHwgW107XG4gICAgY29uc3QgbmV3TG5ncyA9IGxuZ3MuZmlsdGVyKGxuZyA9PiAhcHJlbG9hZGVkLmluY2x1ZGVzKGxuZykgJiYgdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLmlzU3VwcG9ydGVkQ29kZShsbmcpKTtcbiAgICBpZiAoIW5ld0xuZ3MubGVuZ3RoKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHRoaXMub3B0aW9ucy5wcmVsb2FkID0gcHJlbG9hZGVkLmNvbmNhdChuZXdMbmdzKTtcbiAgICB0aGlzLmxvYWRSZXNvdXJjZXMoZXJyID0+IHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJyZWQ7XG4gIH1cbiAgZGlyKGxuZykge1xuICAgIGlmICghbG5nKSBsbmcgPSB0aGlzLnJlc29sdmVkTGFuZ3VhZ2UgfHwgKHRoaXMubGFuZ3VhZ2VzPy5sZW5ndGggPiAwID8gdGhpcy5sYW5ndWFnZXNbMF0gOiB0aGlzLmxhbmd1YWdlKTtcbiAgICBpZiAoIWxuZykgcmV0dXJuICdydGwnO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBsID0gbmV3IEludGwuTG9jYWxlKGxuZyk7XG4gICAgICBpZiAobCAmJiBsLmdldFRleHRJbmZvKSB7XG4gICAgICAgIGNvbnN0IHRpID0gbC5nZXRUZXh0SW5mbygpO1xuICAgICAgICBpZiAodGkgJiYgdGkuZGlyZWN0aW9uKSByZXR1cm4gdGkuZGlyZWN0aW9uO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgY29uc3QgcnRsTG5ncyA9IFsnYXInLCAnc2h1JywgJ3NxcicsICdzc2gnLCAneGFhJywgJ3loZCcsICd5dWQnLCAnYWFvJywgJ2FiaCcsICdhYnYnLCAnYWNtJywgJ2FjcScsICdhY3cnLCAnYWN4JywgJ2FjeScsICdhZGYnLCAnYWRzJywgJ2FlYicsICdhZWMnLCAnYWZiJywgJ2FqcCcsICdhcGMnLCAnYXBkJywgJ2FyYicsICdhcnEnLCAnYXJzJywgJ2FyeScsICdhcnonLCAnYXV6JywgJ2F2bCcsICdheWgnLCAnYXlsJywgJ2F5bicsICdheXAnLCAnYmJ6JywgJ3BnYScsICdoZScsICdpdycsICdwcycsICdwYnQnLCAncGJ1JywgJ3BzdCcsICdwcnAnLCAncHJkJywgJ3VnJywgJ3VyJywgJ3lkZCcsICd5ZHMnLCAneWloJywgJ2ppJywgJ3lpJywgJ2hibycsICdtZW4nLCAneG1uJywgJ2ZhJywgJ2pwcicsICdwZW8nLCAncGVzJywgJ3BycycsICdkdicsICdzYW0nLCAnY2tiJ107XG4gICAgY29uc3QgbGFuZ3VhZ2VVdGlscyA9IHRoaXMuc2VydmljZXM/Lmxhbmd1YWdlVXRpbHMgfHwgbmV3IExhbmd1YWdlVXRpbChnZXQoKSk7XG4gICAgaWYgKGxuZy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJy1sYXRuJykgPiAxKSByZXR1cm4gJ2x0cic7XG4gICAgcmV0dXJuIHJ0bExuZ3MuaW5jbHVkZXMobGFuZ3VhZ2VVdGlscy5nZXRMYW5ndWFnZVBhcnRGcm9tQ29kZShsbmcpKSB8fCBsbmcudG9Mb3dlckNhc2UoKS5pbmRleE9mKCctYXJhYicpID4gMSA/ICdydGwnIDogJ2x0cic7XG4gIH1cbiAgc3RhdGljIGNyZWF0ZUluc3RhbmNlKG9wdGlvbnMgPSB7fSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBJMThuKG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICBpbnN0YW5jZS5jcmVhdGVJbnN0YW5jZSA9IEkxOG4uY3JlYXRlSW5zdGFuY2U7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG4gIGNsb25lSW5zdGFuY2Uob3B0aW9ucyA9IHt9LCBjYWxsYmFjayA9IG5vb3ApIHtcbiAgICBjb25zdCBmb3JrUmVzb3VyY2VTdG9yZSA9IG9wdGlvbnMuZm9ya1Jlc291cmNlU3RvcmU7XG4gICAgaWYgKGZvcmtSZXNvdXJjZVN0b3JlKSBkZWxldGUgb3B0aW9ucy5mb3JrUmVzb3VyY2VTdG9yZTtcbiAgICBjb25zdCBtZXJnZWRPcHRpb25zID0ge1xuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIC4uLntcbiAgICAgICAgaXNDbG9uZTogdHJ1ZVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgY2xvbmUgPSBuZXcgSTE4bihtZXJnZWRPcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucy5kZWJ1ZyAhPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucHJlZml4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsb25lLmxvZ2dlciA9IGNsb25lLmxvZ2dlci5jbG9uZShvcHRpb25zKTtcbiAgICB9XG4gICAgY29uc3QgbWVtYmVyc1RvQ29weSA9IFsnc3RvcmUnLCAnc2VydmljZXMnLCAnbGFuZ3VhZ2UnXTtcbiAgICBtZW1iZXJzVG9Db3B5LmZvckVhY2gobSA9PiB7XG4gICAgICBjbG9uZVttXSA9IHRoaXNbbV07XG4gICAgfSk7XG4gICAgY2xvbmUuc2VydmljZXMgPSB7XG4gICAgICAuLi50aGlzLnNlcnZpY2VzXG4gICAgfTtcbiAgICBjbG9uZS5zZXJ2aWNlcy51dGlscyA9IHtcbiAgICAgIGhhc0xvYWRlZE5hbWVzcGFjZTogY2xvbmUuaGFzTG9hZGVkTmFtZXNwYWNlLmJpbmQoY2xvbmUpXG4gICAgfTtcbiAgICBpZiAoZm9ya1Jlc291cmNlU3RvcmUpIHtcbiAgICAgIGNvbnN0IGNsb25lZERhdGEgPSBPYmplY3Qua2V5cyh0aGlzLnN0b3JlLmRhdGEpLnJlZHVjZSgocHJldiwgbCkgPT4ge1xuICAgICAgICBwcmV2W2xdID0ge1xuICAgICAgICAgIC4uLnRoaXMuc3RvcmUuZGF0YVtsXVxuICAgICAgICB9O1xuICAgICAgICBwcmV2W2xdID0gT2JqZWN0LmtleXMocHJldltsXSkucmVkdWNlKChhY2MsIG4pID0+IHtcbiAgICAgICAgICBhY2Nbbl0gPSB7XG4gICAgICAgICAgICAuLi5wcmV2W2xdW25dXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCBwcmV2W2xdKTtcbiAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICB9LCB7fSk7XG4gICAgICBjbG9uZS5zdG9yZSA9IG5ldyBSZXNvdXJjZVN0b3JlKGNsb25lZERhdGEsIG1lcmdlZE9wdGlvbnMpO1xuICAgICAgY2xvbmUuc2VydmljZXMucmVzb3VyY2VTdG9yZSA9IGNsb25lLnN0b3JlO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5pbnRlcnBvbGF0aW9uKSB7XG4gICAgICBjb25zdCBkZWZPcHRzID0gZ2V0KCk7XG4gICAgICBjb25zdCBtZXJnZWRJbnRlcnBvbGF0aW9uID0ge1xuICAgICAgICAuLi5kZWZPcHRzLmludGVycG9sYXRpb24sXG4gICAgICAgIC4uLnRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLFxuICAgICAgICAuLi5vcHRpb25zLmludGVycG9sYXRpb25cbiAgICAgIH07XG4gICAgICBjb25zdCBtZXJnZWRGb3JJbnRlcnBvbGF0b3IgPSB7XG4gICAgICAgIC4uLm1lcmdlZE9wdGlvbnMsXG4gICAgICAgIGludGVycG9sYXRpb246IG1lcmdlZEludGVycG9sYXRpb25cbiAgICAgIH07XG4gICAgICBjbG9uZS5zZXJ2aWNlcy5pbnRlcnBvbGF0b3IgPSBuZXcgSW50ZXJwb2xhdG9yKG1lcmdlZEZvckludGVycG9sYXRvcik7XG4gICAgfVxuICAgIGNsb25lLnRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcihjbG9uZS5zZXJ2aWNlcywgbWVyZ2VkT3B0aW9ucyk7XG4gICAgY2xvbmUudHJhbnNsYXRvci5vbignKicsIChldmVudCwgLi4uYXJncykgPT4ge1xuICAgICAgY2xvbmUuZW1pdChldmVudCwgLi4uYXJncyk7XG4gICAgfSk7XG4gICAgY2xvbmUuaW5pdChtZXJnZWRPcHRpb25zLCBjYWxsYmFjayk7XG4gICAgY2xvbmUudHJhbnNsYXRvci5vcHRpb25zID0gbWVyZ2VkT3B0aW9ucztcbiAgICBjbG9uZS50cmFuc2xhdG9yLmJhY2tlbmRDb25uZWN0b3Iuc2VydmljZXMudXRpbHMgPSB7XG4gICAgICBoYXNMb2FkZWROYW1lc3BhY2U6IGNsb25lLmhhc0xvYWRlZE5hbWVzcGFjZS5iaW5kKGNsb25lKVxuICAgIH07XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgc3RvcmU6IHRoaXMuc3RvcmUsXG4gICAgICBsYW5ndWFnZTogdGhpcy5sYW5ndWFnZSxcbiAgICAgIGxhbmd1YWdlczogdGhpcy5sYW5ndWFnZXMsXG4gICAgICByZXNvbHZlZExhbmd1YWdlOiB0aGlzLnJlc29sdmVkTGFuZ3VhZ2VcbiAgICB9O1xuICB9XG59XG5jb25zdCBpbnN0YW5jZSA9IEkxOG4uY3JlYXRlSW5zdGFuY2UoKTtcblxuY29uc3QgY3JlYXRlSW5zdGFuY2UgPSBpbnN0YW5jZS5jcmVhdGVJbnN0YW5jZTtcbmNvbnN0IGRpciA9IGluc3RhbmNlLmRpcjtcbmNvbnN0IGluaXQgPSBpbnN0YW5jZS5pbml0O1xuY29uc3QgbG9hZFJlc291cmNlcyA9IGluc3RhbmNlLmxvYWRSZXNvdXJjZXM7XG5jb25zdCByZWxvYWRSZXNvdXJjZXMgPSBpbnN0YW5jZS5yZWxvYWRSZXNvdXJjZXM7XG5jb25zdCB1c2UgPSBpbnN0YW5jZS51c2U7XG5jb25zdCBjaGFuZ2VMYW5ndWFnZSA9IGluc3RhbmNlLmNoYW5nZUxhbmd1YWdlO1xuY29uc3QgZ2V0Rml4ZWRUID0gaW5zdGFuY2UuZ2V0Rml4ZWRUO1xuY29uc3QgdCA9IGluc3RhbmNlLnQ7XG5jb25zdCBleGlzdHMgPSBpbnN0YW5jZS5leGlzdHM7XG5jb25zdCBzZXREZWZhdWx0TmFtZXNwYWNlID0gaW5zdGFuY2Uuc2V0RGVmYXVsdE5hbWVzcGFjZTtcbmNvbnN0IGhhc0xvYWRlZE5hbWVzcGFjZSA9IGluc3RhbmNlLmhhc0xvYWRlZE5hbWVzcGFjZTtcbmNvbnN0IGxvYWROYW1lc3BhY2VzID0gaW5zdGFuY2UubG9hZE5hbWVzcGFjZXM7XG5jb25zdCBsb2FkTGFuZ3VhZ2VzID0gaW5zdGFuY2UubG9hZExhbmd1YWdlcztcblxuZXhwb3J0IHsgY2hhbmdlTGFuZ3VhZ2UsIGNyZWF0ZUluc3RhbmNlLCBpbnN0YW5jZSBhcyBkZWZhdWx0LCBkaXIsIGV4aXN0cywgZ2V0Rml4ZWRULCBoYXNMb2FkZWROYW1lc3BhY2UsIGluaXQsIGtleXNGcm9tU2VsZWN0b3IgYXMga2V5RnJvbVNlbGVjdG9yLCBsb2FkTGFuZ3VhZ2VzLCBsb2FkTmFtZXNwYWNlcywgbG9hZFJlc291cmNlcywgcmVsb2FkUmVzb3VyY2VzLCBzZXREZWZhdWx0TmFtZXNwYWNlLCB0LCB1c2UgfTtcbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBkZWZpbmVzIHRoZSBgaTE4bmAgbW9kdWxlIGZvciBgaTE4bmV4dGAuXG4gKi9cblxuaW1wb3J0IHR5cGUge1xuICBTZWxlY3RvckZuLFxuICBTZWxlY3Rvck9wdGlvbnMsXG4gIFRGdW5jdGlvblxufSBmcm9tICdpMThuZXh0JztcbmltcG9ydCB0eXBlIHtcbiAgTGl0ZXJhbFRvUHJpbWl0aXZlRGVlcCxcbiAgUGFydGlhbERlZXAsXG4gIFJlYWRvbmx5RGVlcFxufSBmcm9tICd0eXBlLWZlc3QnO1xuXG5pbXBvcnQgaTE4bmV4dCwge1xuICBpbml0LFxuICB0IGFzIHRMaWJcbn0gZnJvbSAnaTE4bmV4dCc7XG5pbXBvcnQgeyBnZXRMYW5ndWFnZSB9IGZyb20gJ29ic2lkaWFuJztcblxuaW1wb3J0IHR5cGUgeyBQbHVnaW5UeXBlc0Jhc2UgfSBmcm9tICcuLi9wbHVnaW4vcGx1Z2luLXR5cGVzLWJhc2UudHMnO1xuXG5pbXBvcnQgeyBpbnZva2VBc3luY1NhZmVseSB9IGZyb20gJy4uLy4uL2FzeW5jLnRzJztcbmltcG9ydCB7IGVuIH0gZnJvbSAnLi9sb2NhbGVzL2VuLnRzJztcbmltcG9ydCB7XG4gIERFRkFVTFRfTEFOR1VBR0UsXG4gIGRlZmF1bHRUcmFuc2xhdGlvbnNNYXBcbn0gZnJvbSAnLi9sb2NhbGVzL3RyYW5zbGF0aW9ucy1tYXAudHMnO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IG5hbWVzcGFjZS5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTlMgPSAndHJhbnNsYXRpb24nO1xuXG4vKipcbiAqIFRoZSBmdWxsIHRyYW5zbGF0aW9ucy5cbiAqL1xuZXhwb3J0IHR5cGUgRnVsbFRyYW5zbGF0aW9uczxQbHVnaW5UeXBlcyBleHRlbmRzIFBsdWdpblR5cGVzQmFzZT4gPSBMaXRlcmFsVG9QcmltaXRpdmVEZWVwPFBsdWdpblR5cGVzWydkZWZhdWx0VHJhbnNsYXRpb25zJ10+O1xuXG4vKipcbiAqIFRoZSB0cmFuc2xhdGlvbnMuXG4gKi9cbmV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uczxQbHVnaW5UeXBlcyBleHRlbmRzIFBsdWdpblR5cGVzQmFzZT4gPSBQYXJ0aWFsRGVlcDxGdWxsVHJhbnNsYXRpb25zPFBsdWdpblR5cGVzPj47XG5cbi8qKlxuICogVGhlIHRyYW5zbGF0aW9ucyBtYXAuXG4gKi9cbmV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uc01hcDxQbHVnaW5UeXBlcyBleHRlbmRzIFBsdWdpblR5cGVzQmFzZT4gPSBSZWNvcmQ8c3RyaW5nLCBUcmFuc2xhdGlvbnM8UGx1Z2luVHlwZXM+PjtcblxubGV0IGlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuaW50ZXJmYWNlIFRPcHRpb25zIGV4dGVuZHMgU2VsZWN0b3JPcHRpb25zPFt0eXBlb2YgREVGQVVMVF9OU10+IHtcbiAgcmVhZG9ubHkgbnM6IFt0eXBlb2YgREVGQVVMVF9OU107XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIGBpMThuYCBtb2R1bGUuXG4gKlxuICogQHR5cGVQYXJhbSBQbHVnaW5UeXBlcyAtIFRoZSBwbHVnaW4gdHlwZXMuXG4gKiBAcGFyYW0gdHJhbnNsYXRpb25zTWFwIC0gVGhlIHRyYW5zbGF0aW9ucyBtYXAuXG4gKiBAcGFyYW0gaXNBc3luYyAtIFdoZXRoZXIgdGhlIGluaXRpYWxpemF0aW9uIGlzIGFzeW5jaHJvbm91cy5cbiAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgYGkxOG5gIG1vZHVsZSBpcyBpbml0aWFsaXplZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRJMThOPFBsdWdpblR5cGVzIGV4dGVuZHMgUGx1Z2luVHlwZXNCYXNlPih0cmFuc2xhdGlvbnNNYXA6IFRyYW5zbGF0aW9uc01hcDxQbHVnaW5UeXBlcz4sIGlzQXN5bmMgPSB0cnVlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmIChpc0luaXRpYWxpemVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaXNJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgYXdhaXQgaW5pdCh7XG4gICAgZmFsbGJhY2tMbmc6IERFRkFVTFRfTEFOR1VBR0UsXG4gICAgaW5pdEFzeW5jOiBpc0FzeW5jLFxuICAgIGludGVycG9sYXRpb246IHtcbiAgICAgIGVzY2FwZVZhbHVlOiBmYWxzZVxuICAgIH0sXG4gICAgbG5nOiBnZXRMYW5ndWFnZSgpLFxuICAgIHJlc291cmNlczogT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgT2JqZWN0LmVudHJpZXModHJhbnNsYXRpb25zTWFwKS5tYXAoKFtsYW5ndWFnZSwgdHJhbnNsYXRpb25zXSkgPT4gW1xuICAgICAgICBsYW5ndWFnZSxcbiAgICAgICAge1xuICAgICAgICAgIFtERUZBVUxUX05TXTogdHJhbnNsYXRpb25zIGFzIFBsdWdpblR5cGVzWydkZWZhdWx0VHJhbnNsYXRpb25zJ11cbiAgICAgICAgfVxuICAgICAgXSlcbiAgICApLFxuICAgIHJldHVybkVtcHR5U3RyaW5nOiBmYWxzZSxcbiAgICByZXR1cm5OdWxsOiBmYWxzZVxuICB9KTtcblxuICBpMThuZXh0LmFkZFJlc291cmNlQnVuZGxlKERFRkFVTFRfTEFOR1VBR0UsIERFRkFVTFRfTlMsIGVuLCB0cnVlLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHRJbXBsKFxuICBzZWxlY3RvcjogU2VsZWN0b3JGbjxSZWFkb25seURlZXA8VHJhbnNsYXRpb25zPFBsdWdpblR5cGVzQmFzZT4+LCBzdHJpbmcsIFNlbGVjdG9yT3B0aW9uczxbdHlwZW9mIERFRkFVTFRfTlNdPj4sXG4gIG9wdGlvbnM/OiBUT3B0aW9uc1xuKTogc3RyaW5nIHtcbiAgaWYgKCFpc0luaXRpYWxpemVkKSB7XG4gICAgY29uc29sZS53YXJuKCdJMThOIHdhcyBub3QgaW5pdGlhbGl6ZWQsIGluaXRpYWxpemluZyBkZWZhdWx0IG9ic2lkaWFuLWRldi11dGlscyB0cmFuc2xhdGlvbnMnKTtcbiAgICBpbnZva2VBc3luY1NhZmVseSgoKSA9PiBpbml0STE4TihkZWZhdWx0VHJhbnNsYXRpb25zTWFwLCBmYWxzZSkpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRMaWIoc2VsZWN0b3IpO1xuICB9XG5cbiAgcmV0dXJuIHRMaWIoc2VsZWN0b3IsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIFRoZSBgdGAgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBjb25zdCB0ID0gdEltcGwgYXMgVEZ1bmN0aW9uO1xuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGRlZmluZXMgdGhlIEVuZ2xpc2ggdHJhbnNsYXRpb25zIGZvciB0aGUgYGkxOG5gIG1vZHVsZS5cbiAqL1xuXG4vKipcbiAqIFRoZSBFbmdsaXNoIHRyYW5zbGF0aW9ucy5cbiAqL1xuZXhwb3J0IGNvbnN0IGVuID0ge1xuICBvYnNpZGlhbkRldlV0aWxzOiB7XG4gICAgYXN5bmNXaXRoTm90aWNlOiB7XG4gICAgICBtaWxsaXNlY29uZHM6ICdtaWxsaXNlY29uZHMuLi4nLFxuICAgICAgb3BlcmF0aW9uOiAnT3BlcmF0aW9uJyxcbiAgICAgIHJ1bm5pbmdGb3I6ICdSdW5uaW5nIGZvcicsXG4gICAgICB0ZXJtaW5hdGVPcGVyYXRpb246ICdZb3UgY2FuIHRlcm1pbmF0ZSB0aGUgb3BlcmF0aW9uIGJ5IGNsaWNraW5nIHRoZSBidXR0b24gYmVsb3csIGJ1dCBiZSBhd2FyZSBpdCBtaWdodCBsZWF2ZSB0aGUgdmF1bHQgaW4gYW4gaW5jb25zaXN0ZW50IHN0YXRlLicsXG4gICAgICB0aW1lZE91dDogJ1RoZSBvcGVyYXRpb24gdGltZWQgb3V0IGFmdGVyIHt7ZHVyYXRpb24sIG51bWJlcn19IG1pbGxpc2Vjb25kcy4nXG4gICAgfSxcbiAgICBidXR0b25zOiB7XG4gICAgICBjYW5jZWw6ICdDYW5jZWwnLFxuICAgICAgb2s6ICdPSydcbiAgICB9LFxuICAgIGNhbGxvdXQ6IHtcbiAgICAgIGxvYWRDb250ZW50OiAnTG9hZCBjb250ZW50IGZvciBjYWxsb3V0J1xuICAgIH0sXG4gICAgZGF0YXZpZXc6IHtcbiAgICAgIGl0ZW1zUGVyUGFnZTogJ0l0ZW1zIHBlciBwYWdlOicsXG4gICAgICBqdW1wVG9QYWdlOiAnSnVtcCB0byBwYWdlOicsXG4gICAgICBwYWdlSGVhZGVyOiAnUGFnZSB7e3BhZ2VOdW1iZXIsIG51bWJlcn19IG9mIHt7dG90YWxQYWdlcywgbnVtYmVyfX0sIFRvdGFsIGl0ZW1zOiB7e3RvdGFsSXRlbXMsIG51bWJlcn19J1xuICAgIH0sXG4gICAgbWV0YWRhdGFDYWNoZToge1xuICAgICAgZ2V0QmFja2xpbmtzRm9yRmlsZVBhdGg6ICdHZXQgYmFja2xpbmtzIGZvciB7e2ZpbGVQYXRofX0nXG4gICAgfSxcbiAgICBub3RpY2VzOiB7XG4gICAgICBhdHRhY2htZW50SXNTdGlsbFVzZWQ6ICdBdHRhY2htZW50IHt7YXR0YWNobWVudFBhdGh9fSBpcyBzdGlsbCB1c2VkIGJ5IG90aGVyIG5vdGVzLiBJdCB3aWxsIG5vdCBiZSBkZWxldGVkLicsXG4gICAgICB1bmhhbmRsZWRFcnJvcjogJ0FuIHVuaGFuZGxlZCBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIGNoZWNrIHRoZSBjb25zb2xlIGZvciBtb3JlIGluZm9ybWF0aW9uLidcbiAgICB9LFxuICAgIHF1ZXVlOiB7XG4gICAgICBmbHVzaFF1ZXVlOiAnRmx1c2ggcXVldWUnXG4gICAgfSxcbiAgICByZW5hbWVEZWxldGVIYW5kbGVyOiB7XG4gICAgICBoYW5kbGVEZWxldGU6ICdIYW5kbGUgZGVsZXRlOiB7e2ZpbGVQYXRofX0nLFxuICAgICAgaGFuZGxlT3JwaGFuZWRSZW5hbWVzOiAnSGFuZGxlIG9ycGhhbmVkIHJlbmFtZXMnLFxuICAgICAgaGFuZGxlUmVuYW1lOiAnSGFuZGxlIHJlbmFtZToge3tvbGRQYXRofX0gLT4ge3tuZXdQYXRofX0nLFxuICAgICAgdXBkYXRlZExpbmtzOiAnVXBkYXRlZCB7e2xpbmtzQ291bnQsIG51bWJlcn19IGxpbmtzIGluIHt7ZmlsZXNDb3VudCwgbnVtYmVyfX0gZmlsZXMuJ1xuICAgIH0sXG4gICAgdmF1bHQ6IHtcbiAgICAgIHByb2Nlc3NGaWxlOiAnUHJvY2VzcyBmaWxlIHt7ZmlsZVBhdGh9fSdcbiAgICB9XG4gIH1cbn0gYXMgY29uc3Q7XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBUaGlzIGZpbGUgZGVmaW5lcyB0aGUgdHJhbnNsYXRpb25zIG1hcCBmb3IgdGhlIGBpMThuYCBtb2R1bGUuXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBQbHVnaW5UeXBlc0Jhc2UgfSBmcm9tICcuLi8uLi9wbHVnaW4vcGx1Z2luLXR5cGVzLWJhc2UudHMnO1xuaW1wb3J0IHR5cGUgeyBUcmFuc2xhdGlvbnNNYXAgfSBmcm9tICcuLi9pMThuLnRzJztcblxuaW1wb3J0IHsgZW4gfSBmcm9tICcuL2VuLnRzJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBsYW5ndWFnZS5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTEFOR1VBR0U6IGtleW9mIHR5cGVvZiB0cmFuc2xhdGlvbnNNYXBJbXBsID0gJ2VuJztcblxuY29uc3QgdHJhbnNsYXRpb25zTWFwSW1wbCA9IHtcbiAgZW5cbn0gYXMgY29uc3Q7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgdHJhbnNsYXRpb25zIG1hcC5cbiAqL1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRUcmFuc2xhdGlvbnNNYXA6IFRyYW5zbGF0aW9uc01hcDxQbHVnaW5UeXBlc0Jhc2U+ID0gdHJhbnNsYXRpb25zTWFwSW1wbDtcbiIsICIvKipcbiAqIEFsbG93ZWQgYXJpdGhtZXRpYyBvcGVyYXRvcnNcbiAqL1xuZXhwb3J0IHR5cGUgQ29tcGFyZU9wZXJhdG9yID0gJz4nIHwgJz49JyB8ICc9JyB8ICc8JyB8ICc8PScgfCAnIT0nO1xuXG5leHBvcnQgY29uc3Qgc2VtdmVyID1cbiAgL15bdl5+PD49XSo/KFxcZCspKD86XFwuKFt4Kl18XFxkKykoPzpcXC4oW3gqXXxcXGQrKSg/OlxcLihbeCpdfFxcZCspKT8oPzotKFtcXGRhLXpcXC1dKyg/OlxcLltcXGRhLXpcXC1dKykqKSk/KD86XFwrW1xcZGEtelxcLV0rKD86XFwuW1xcZGEtelxcLV0rKSopPyk/KT8kL2k7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFuZFBhcnNlID0gKHZlcnNpb246IHN0cmluZykgPT4ge1xuICBpZiAodHlwZW9mIHZlcnNpb24gIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhcmd1bWVudCBleHBlY3RlZCBzdHJpbmcnKTtcbiAgfVxuICBjb25zdCBtYXRjaCA9IHZlcnNpb24ubWF0Y2goc2VtdmVyKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIGFyZ3VtZW50IG5vdCB2YWxpZCBzZW12ZXIgKCcke3ZlcnNpb259JyByZWNlaXZlZClgXG4gICAgKTtcbiAgfVxuICBtYXRjaC5zaGlmdCgpO1xuICByZXR1cm4gbWF0Y2g7XG59O1xuXG5jb25zdCBpc1dpbGRjYXJkID0gKHM6IHN0cmluZykgPT4gcyA9PT0gJyonIHx8IHMgPT09ICd4JyB8fCBzID09PSAnWCc7XG5cbmNvbnN0IHRyeVBhcnNlID0gKHY6IHN0cmluZykgPT4ge1xuICBjb25zdCBuID0gcGFyc2VJbnQodiwgMTApO1xuICByZXR1cm4gaXNOYU4obikgPyB2IDogbjtcbn07XG5cbmNvbnN0IGZvcmNlVHlwZSA9IChhOiBzdHJpbmcgfCBudW1iZXIsIGI6IHN0cmluZyB8IG51bWJlcikgPT5cbiAgdHlwZW9mIGEgIT09IHR5cGVvZiBiID8gW1N0cmluZyhhKSwgU3RyaW5nKGIpXSA6IFthLCBiXTtcblxuY29uc3QgY29tcGFyZVN0cmluZ3MgPSAoYTogc3RyaW5nLCBiOiBzdHJpbmcpID0+IHtcbiAgaWYgKGlzV2lsZGNhcmQoYSkgfHwgaXNXaWxkY2FyZChiKSkgcmV0dXJuIDA7XG4gIGNvbnN0IFthcCwgYnBdID0gZm9yY2VUeXBlKHRyeVBhcnNlKGEpLCB0cnlQYXJzZShiKSk7XG4gIGlmIChhcCA+IGJwKSByZXR1cm4gMTtcbiAgaWYgKGFwIDwgYnApIHJldHVybiAtMTtcbiAgcmV0dXJuIDA7XG59O1xuXG5leHBvcnQgY29uc3QgY29tcGFyZVNlZ21lbnRzID0gKFxuICBhOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFJlZ0V4cE1hdGNoQXJyYXksXG4gIGI6IHN0cmluZyB8IHN0cmluZ1tdIHwgUmVnRXhwTWF0Y2hBcnJheVxuKSA9PiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5tYXgoYS5sZW5ndGgsIGIubGVuZ3RoKTsgaSsrKSB7XG4gICAgY29uc3QgciA9IGNvbXBhcmVTdHJpbmdzKGFbaV0gfHwgJzAnLCBiW2ldIHx8ICcwJyk7XG4gICAgaWYgKHIgIT09IDApIHJldHVybiByO1xuICB9XG4gIHJldHVybiAwO1xufTtcbiIsICJpbXBvcnQgeyBjb21wYXJlU2VnbWVudHMsIHZhbGlkYXRlQW5kUGFyc2UgfSBmcm9tICcuL3V0aWxzLmpzJztcblxuLyoqXG4gKiBDb21wYXJlIFtzZW12ZXJdKGh0dHBzOi8vc2VtdmVyLm9yZy8pIHZlcnNpb24gc3RyaW5ncyB0byBmaW5kIGdyZWF0ZXIsIGVxdWFsIG9yIGxlc3Nlci5cbiAqIFRoaXMgbGlicmFyeSBzdXBwb3J0cyB0aGUgZnVsbCBzZW12ZXIgc3BlY2lmaWNhdGlvbiwgaW5jbHVkaW5nIGNvbXBhcmluZyB2ZXJzaW9ucyB3aXRoIGRpZmZlcmVudCBudW1iZXIgb2YgZGlnaXRzIGxpa2UgYDEuMC4wYCwgYDEuMGAsIGAxYCwgYW5kIHByZS1yZWxlYXNlIHZlcnNpb25zIGxpa2UgYDEuMC4wLWFscGhhYC5cbiAqIEBwYXJhbSB2MSAtIEZpcnN0IHZlcnNpb24gdG8gY29tcGFyZVxuICogQHBhcmFtIHYyIC0gU2Vjb25kIHZlcnNpb24gdG8gY29tcGFyZVxuICogQHJldHVybnMgTnVtZXJpYyB2YWx1ZSBjb21wYXRpYmxlIHdpdGggdGhlIFtBcnJheS5zb3J0KGZuKSBpbnRlcmZhY2VdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3NvcnQjUGFyYW1ldGVycykuXG4gKi9cbmV4cG9ydCBjb25zdCBjb21wYXJlVmVyc2lvbnMgPSAodjE6IHN0cmluZywgdjI6IHN0cmluZykgPT4ge1xuICAvLyB2YWxpZGF0ZSBpbnB1dCBhbmQgc3BsaXQgaW50byBzZWdtZW50c1xuICBjb25zdCBuMSA9IHZhbGlkYXRlQW5kUGFyc2UodjEpO1xuICBjb25zdCBuMiA9IHZhbGlkYXRlQW5kUGFyc2UodjIpO1xuXG4gIC8vIHBvcCBvZmYgdGhlIHBhdGNoXG4gIGNvbnN0IHAxID0gbjEucG9wKCk7XG4gIGNvbnN0IHAyID0gbjIucG9wKCk7XG5cbiAgLy8gdmFsaWRhdGUgbnVtYmVyc1xuICBjb25zdCByID0gY29tcGFyZVNlZ21lbnRzKG4xLCBuMik7XG4gIGlmIChyICE9PSAwKSByZXR1cm4gcjtcblxuICAvLyB2YWxpZGF0ZSBwcmUtcmVsZWFzZVxuICBpZiAocDEgJiYgcDIpIHtcbiAgICByZXR1cm4gY29tcGFyZVNlZ21lbnRzKHAxLnNwbGl0KCcuJyksIHAyLnNwbGl0KCcuJykpO1xuICB9IGVsc2UgaWYgKHAxIHx8IHAyKSB7XG4gICAgcmV0dXJuIHAxID8gLTEgOiAxO1xuICB9XG5cbiAgcmV0dXJuIDA7XG59O1xuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQ1NTIGNsYXNzZXMgdXNlZCBieSB0aGUgYG9ic2lkaWFuLWRldi11dGlsc2AgbGlicmFyeS5cbiAqL1xuXG4vKipcbiAqIENTUyBjbGFzc2VzIHVzZWQgYnkgdGhlIGBvYnNpZGlhbi1kZXYtdXRpbHNgIGxpYnJhcnkuXG4gKi9cbmV4cG9ydCBlbnVtIENzc0NsYXNzIHtcbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgYWxlcnQgbW9kYWwuXG4gICAqL1xuICBBbGVydE1vZGFsID0gJ2FsZXJ0LW1vZGFsJyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSBjYW5jZWwgYnV0dG9uLlxuICAgKi9cbiAgQ2FuY2VsQnV0dG9uID0gJ2NhbmNlbC1idXR0b24nLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIGNoZWNrYm94IGNvbXBvbmVudC5cbiAgICovXG4gIENoZWNrYm94Q29tcG9uZW50ID0gJ2NoZWNrYm94LWNvbXBvbmVudCcsXG5cbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgY29kZSBoaWdobGlnaHRlciBjb21wb25lbnQuXG4gICAqL1xuICBDb2RlSGlnaGxpZ2h0ZXJDb21wb25lbnQgPSAnY29kZS1oaWdobGlnaHRlci1jb21wb25lbnQnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIGNvbmZpcm0gbW9kYWwuXG4gICAqL1xuICBDb25maXJtTW9kYWwgPSAnY29uZmlybS1tb2RhbCcsXG5cbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgZGF0ZSBjb21wb25lbnQuXG4gICAqL1xuICBEYXRlQ29tcG9uZW50ID0gJ2RhdGUtY29tcG9uZW50JyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSBkYXRlIGFuZCB0aW1lIGNvbXBvbmVudC5cbiAgICovXG4gIERhdGVUaW1lQ29tcG9uZW50ID0gJ2RhdGV0aW1lLWNvbXBvbmVudCcsXG5cbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgZW1haWwgY29tcG9uZW50LlxuICAgKi9cbiAgRW1haWxDb21wb25lbnQgPSAnZW1haWwtY29tcG9uZW50JyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSBmaWxlIGNvbXBvbmVudC5cbiAgICovXG4gIEZpbGVDb21wb25lbnQgPSAnZmlsZS1jb21wb25lbnQnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIHBsYWNlaG9sZGVyLlxuICAgKi9cbiAgSXNQbGFjZWhvbGRlciA9ICdpcy1wbGFjZWhvbGRlcicsXG5cbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgbGlicmFyeSBuYW1lLlxuICAgKi9cbiAgTGlicmFyeU5hbWUgPSAnb2JzaWRpYW4tZGV2LXV0aWxzJyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSBtb250aCBjb21wb25lbnQuXG4gICAqL1xuICBNb250aENvbXBvbmVudCA9ICdtb250aC1jb21wb25lbnQnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIG11bHRpcGxlIGRyb3Bkb3duIGNvbXBvbmVudC5cbiAgICovXG4gIE11bHRpcGxlRHJvcGRvd25Db21wb25lbnQgPSAnbXVsdGlwbGUtZHJvcGRvd24tY29tcG9uZW50JyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSBtdWx0aXBsZSBlbWFpbCBjb21wb25lbnQuXG4gICAqL1xuICBNdWx0aXBsZUVtYWlsQ29tcG9uZW50ID0gJ211bHRpcGxlLWVtYWlsLWNvbXBvbmVudCcsXG5cbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgbXVsdGlwbGUgZmlsZSBjb21wb25lbnQuXG4gICAqL1xuICBNdWx0aXBsZUZpbGVDb21wb25lbnQgPSAnbXVsdGlwbGUtZmlsZS1jb21wb25lbnQnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIG11bHRpcGxlIHRleHQgY29tcG9uZW50LlxuICAgKi9cbiAgTXVsdGlwbGVUZXh0Q29tcG9uZW50ID0gJ211bHRpcGxlLXRleHQtY29tcG9uZW50JyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSBudW1iZXIgY29tcG9uZW50LlxuICAgKi9cbiAgTnVtYmVyQ29tcG9uZW50ID0gJ251bWJlci1jb21wb25lbnQnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIG9rIGJ1dHRvbi5cbiAgICovXG4gIE9rQnV0dG9uID0gJ29rLWJ1dHRvbicsXG5cbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgb3ZlcmxheSB2YWxpZGF0b3IuXG4gICAqL1xuICBPdmVybGF5VmFsaWRhdG9yID0gJ292ZXJsYXktdmFsaWRhdG9yJyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSBwYXNzd29yZCBjb21wb25lbnQuXG4gICAqL1xuICBQYXNzd29yZENvbXBvbmVudCA9ICdwYXNzd29yZC1jb21wb25lbnQnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIHBsdWdpbiBzZXR0aW5ncyB0YWIuXG4gICAqL1xuICBQbHVnaW5TZXR0aW5nc1RhYiA9ICdwbHVnaW4tc2V0dGluZ3MtdGFiJyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSBwcm9tcHQgbW9kYWwuXG4gICAqL1xuICBQcm9tcHRNb2RhbCA9ICdwcm9tcHQtbW9kYWwnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIHNlbGVjdCBpdGVtIG1vZGFsLlxuICAgKi9cbiAgU2VsZWN0SXRlbU1vZGFsID0gJ3NlbGVjdC1pdGVtLW1vZGFsJyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSBzZXR0aW5nIGNvbXBvbmVudCB3cmFwcGVyLlxuICAgKi9cbiAgU2V0dGluZ0NvbXBvbmVudFdyYXBwZXIgPSAnc2V0dGluZy1jb21wb25lbnQtd3JhcHBlcicsXG5cbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgdGVsZXBob25lIGNvbXBvbmVudC5cbiAgICovXG4gIFRlbGVwaG9uZUNvbXBvbmVudCA9ICd0ZWxlcGhvbmUtY29tcG9uZW50JyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSB0ZXh0IGJveC5cbiAgICovXG4gIFRleHRCb3ggPSAndGV4dC1ib3gnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIHRpbWUgY29tcG9uZW50LlxuICAgKi9cbiAgVGltZUNvbXBvbmVudCA9ICd0aW1lLWNvbXBvbmVudCcsXG5cbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgdG9vbHRpcC5cbiAgICovXG4gIFRvb2x0aXAgPSAndG9vbHRpcCcsXG5cbiAgLyoqXG4gICAqIEEgQ1NTIGNsYXNzIGZvciB0aGUgdG9vbHRpcCBhcnJvdy5cbiAgICovXG4gIFRvb2x0aXBBcnJvdyA9ICd0b29sdGlwLWFycm93JyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSB0b29sdGlwIHZhbGlkYXRvci5cbiAgICovXG4gIFRvb2x0aXBWYWxpZGF0b3IgPSAndG9vbHRpcC12YWxpZGF0b3InLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIHRyaS1zdGF0ZSBjaGVja2JveCBjb21wb25lbnQuXG4gICAqL1xuICBUcmlTdGF0ZUNoZWNrYm94Q29tcG9uZW50ID0gJ3RyaS1zdGF0ZS1jaGVja2JveC1jb21wb25lbnQnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIHR5cGVkIGRyb3Bkb3duIGNvbXBvbmVudC5cbiAgICovXG4gIFR5cGVkRHJvcGRvd25Db21wb25lbnQgPSAndHlwZWQtZHJvcGRvd24tY29tcG9uZW50JyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSB0eXBlZCBtdWx0aXBsZSBkcm9wZG93biBjb21wb25lbnQuXG4gICAqL1xuICBUeXBlZE11bHRpcGxlRHJvcGRvd25Db21wb25lbnQgPSAndHlwZWQtbXVsdGlwbGUtZHJvcGRvd24tY29tcG9uZW50JyxcblxuICAvKipcbiAgICogQSBDU1MgY2xhc3MgZm9yIHRoZSB1cmwgY29tcG9uZW50LlxuICAgKi9cbiAgVXJsQ29tcG9uZW50ID0gJ3VybC1jb21wb25lbnQnLFxuXG4gIC8qKlxuICAgKiBBIENTUyBjbGFzcyBmb3IgdGhlIHdlZWsgY29tcG9uZW50LlxuICAgKi9cbiAgV2Vla0NvbXBvbmVudCA9ICd3ZWVrLWNvbXBvbmVudCdcbn1cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIEluaXRpYWxpemVzIHRoZSBwbHVnaW4gY29udGV4dCBhbmQgc2V0cyB1cCB0aGUgcGx1Z2luIElELlxuICovXG5cbmltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgeyBjb21wYXJlVmVyc2lvbnMgfSBmcm9tICdjb21wYXJlLXZlcnNpb25zJztcblxuaW1wb3J0IHR5cGUgeyBEZWJ1Z0NvbnRyb2xsZXIgfSBmcm9tICcuLi8uLi9kZWJ1Zy1jb250cm9sbGVyLnRzJztcblxuaW1wb3J0IHsgQ3NzQ2xhc3MgfSBmcm9tICcuLi8uLi9jc3MtY2xhc3MudHMnO1xuaW1wb3J0IHtcbiAgZ2V0RGVidWdDb250cm9sbGVyLFxuICBzaG93SW5pdGlhbERlYnVnTWVzc2FnZVxufSBmcm9tICcuLi8uLi9kZWJ1Zy50cyc7XG5pbXBvcnQge1xuICBMSUJSQVJZX05BTUUsXG4gIExJQlJBUllfU1RZTEVTLFxuICBMSUJSQVJZX1ZFUlNJT05cbn0gZnJvbSAnLi4vLi4vbGlicmFyeS50cyc7XG5pbXBvcnQgeyBnZXRPYnNpZGlhbkRldlV0aWxzU3RhdGUgfSBmcm9tICcuLi9hcHAudHMnO1xuaW1wb3J0IHtcbiAgZ2V0UGx1Z2luSWQsXG4gIHNldFBsdWdpbklkXG59IGZyb20gJy4vcGx1Z2luLWlkLnRzJztcblxuaW50ZXJmYWNlIFBsdWdpbkNvbnRleHRXaW5kb3cge1xuICBERUJVRzogRGVidWdDb250cm9sbGVyO1xufVxuXG5jb25zdCBTVFlMRVNfSUQgPSBgJHtMSUJSQVJZX05BTUV9LXN0eWxlc2A7XG5cbi8qKlxuICogU2V0cyB0aGUgQ1NTIGNsYXNzIG9mIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIGVsIC0gVGhlIGVsZW1lbnQgdG8gc2V0IHRoZSBDU1MgY2xhc3Mgb2YuXG4gKiBAcGFyYW0gY3NzQ2xhc3NlcyAtIFRoZSBDU1MgY2xhc3NlcyB0byBzZXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRQbHVnaW5Dc3NDbGFzc2VzKGVsOiBIVE1MRWxlbWVudCwgLi4uY3NzQ2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcbiAgZWwuYWRkQ2xhc3MoQ3NzQ2xhc3MuTGlicmFyeU5hbWUsIGdldFBsdWdpbklkKCksIC4uLmNzc0NsYXNzZXMpO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemVzIHRoZSBkZWJ1ZyBjb250cm9sbGVyLlxuICpcbiAqIEBwYXJhbSB3aW4gLSBUaGUgd2luZG93IHRvIGluaXRpYWxpemUgdGhlIGRlYnVnIGNvbnRyb2xsZXIgZm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdERlYnVnQ29udHJvbGxlcih3aW46IFdpbmRvdyk6IHZvaWQge1xuICBjb25zdCBwbHVnaW5Db250ZXh0V2luZG93ID0gd2luIGFzIFBhcnRpYWw8UGx1Z2luQ29udGV4dFdpbmRvdz47XG4gIHBsdWdpbkNvbnRleHRXaW5kb3cuREVCVUcgPSBnZXREZWJ1Z0NvbnRyb2xsZXIoKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgcGx1Z2luIGNvbnRleHQuXG4gKlxuICogQHBhcmFtIGFwcCAtIFRoZSBPYnNpZGlhbiBhcHAgaW5zdGFuY2UuXG4gKiBAcGFyYW0gcGx1Z2luSWQgLSBUaGUgcGx1Z2luIElELlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdFBsdWdpbkNvbnRleHQoYXBwOiBBcHAsIHBsdWdpbklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgc2V0UGx1Z2luSWQocGx1Z2luSWQpO1xuICBzaG93SW5pdGlhbERlYnVnTWVzc2FnZShwbHVnaW5JZCk7XG5cbiAgY29uc3QgbGFzdExpYnJhcnlWZXJzaW9uV3JhcHBlciA9IGdldE9ic2lkaWFuRGV2VXRpbHNTdGF0ZShhcHAsICdsYXN0TGlicmFyeVZlcnNpb24nLCAnMC4wLjAnKTtcbiAgaWYgKGNvbXBhcmVWZXJzaW9ucyhMSUJSQVJZX1ZFUlNJT04sIGxhc3RMaWJyYXJ5VmVyc2lvbldyYXBwZXIudmFsdWUpIDw9IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsYXN0TGlicmFyeVZlcnNpb25XcmFwcGVyLnZhbHVlID0gTElCUkFSWV9WRVJTSU9OO1xuXG4gIGRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvcihgIyR7U1RZTEVTX0lEfWApPy5yZW1vdmUoKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG9ic2lkaWFubWQvbm8tZm9yYmlkZGVuLWVsZW1lbnRzIC0tIFdlIG5lZWQgdG8gY3JlYXRlIGEgc3R5bGUgZWxlbWVudCB0byBhcHBseSB0aGUgbGlicmFyeSBzdHlsZXMuXG4gIGRvY3VtZW50LmhlYWQuY3JlYXRlRWwoJ3N0eWxlJywge1xuICAgIGF0dHI6IHtcbiAgICAgIGlkOiBTVFlMRVNfSURcbiAgICB9LFxuICAgIHRleHQ6IExJQlJBUllfU1RZTEVTXG4gIH0pO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgUmVhZG9ubHlEZWVwIH0gZnJvbSAndHlwZS1mZXN0JztcblxuaW1wb3J0IHsgTW9kYWwsIE5vdGljZSwgc2V0SWNvbiB9IGZyb20gJ29ic2lkaWFuJztcblxuaW1wb3J0IHR5cGUgeyBQdWxzZUNhcmQsIFBsdWdpblNldHRpbmdzLCBRdWlja0FjdGlvbiB9IGZyb20gJy4uL1BsdWdpblNldHRpbmdzLnRzJztcblxuaW1wb3J0IHsgY3JlYXRlTm90ZSB9IGZyb20gJy4uL2NyZWF0ZU5vdGUudHMnO1xuaW1wb3J0IHsgQXBwZW5kUHJvbXB0TW9kYWwgfSBmcm9tICcuL0FwcGVuZFByb21wdE1vZGFsLnRzJztcblxuLy8gXHUyNTAwXHUyNTAwIERhdGUgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gaGVhZGVyRGF0ZSgpOiBzdHJpbmcge1xuICByZXR1cm4gbmV3IERhdGUoKVxuICAgIC50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLVVTJywgeyB3ZWVrZGF5OiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJywgbW9udGg6ICdzaG9ydCcgfSlcbiAgICAudG9VcHBlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gZnJvbU5vdyh0aW1lc3RhbXA6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gdGltZXN0YW1wKSAvIDEwMDApO1xuICBpZiAocyA8IDYwKSByZXR1cm4gJ2p1c3Qgbm93JztcbiAgY29uc3QgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcbiAgaWYgKG0gPCA2MCkgcmV0dXJuIGAke219bSBhZ29gO1xuICBjb25zdCBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xuICBpZiAoaCA8IDI0KSByZXR1cm4gYCR7aH1oIGFnb2A7XG4gIGNvbnN0IGRheSA9IE1hdGguZmxvb3IoaCAvIDI0KTtcbiAgaWYgKGRheSA8IDcpIHJldHVybiBgJHtkYXl9ZCBhZ29gO1xuICByZXR1cm4gbmV3IERhdGUodGltZXN0YW1wKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLVVTJywgeyBtb250aDogJ3Nob3J0JywgZGF5OiAnbnVtZXJpYycgfSk7XG59XG5cbmZ1bmN0aW9uIHN0cmlwTWFya2Rvd24ocmF3OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGJvZHkgPSByYXcuc3RhcnRzV2l0aCgnLS0tJykgPyByYXcucmVwbGFjZSgvXi0tLVtcXHNcXFNdKj8tLS1cXG4/LywgJycpIDogcmF3O1xuICByZXR1cm4gYm9keVxuICAgIC5yZXBsYWNlKC9gYGBbXFxzXFxTXSo/YGBgL2csICcnKVxuICAgIC5yZXBsYWNlKC8lJVtcXHNcXFNdKj8lJS9nLCAnJylcbiAgICAucmVwbGFjZSgvIVxcW1xcWy4qP1xcXVxcXS9nLCAnJylcbiAgICAucmVwbGFjZSgvXFxbXFxbKFteXFxdfF0rKSg/OlxcfFteXFxdXSspP1xcXVxcXS9nLCAnJDEnKVxuICAgIC5yZXBsYWNlKC8hXFxbLio/XFxdXFwoLio/XFwpL2csICcnKVxuICAgIC5yZXBsYWNlKC9cXFsoW15cXF1dKylcXF1cXCguKj9cXCkvZywgJyQxJylcbiAgICAucmVwbGFjZSgvXiN7MSw2fVxccysvZ20sICcnKSAgICAgICAgICAgLy8gc3RyaXAgIyBtYXJrZXJzIGJ1dCBrZWVwIGhlYWRpbmcgdGV4dFxuICAgIC5yZXBsYWNlKC9eXFxzKlxcfC4qXFx8XFxzKiQvZ20sICcnKVxuICAgIC5yZXBsYWNlKC9cXCp7MSwzfShbXipcXG5dKylcXCp7MSwzfS9nLCAnJDEnKVxuICAgIC5yZXBsYWNlKC9fKFteX1xcbl0rKV8vZywgJyQxJylcbiAgICAucmVwbGFjZSgvXj5cXHM/L2dtLCAnJylcbiAgICAucmVwbGFjZSgvXlstKitdXFxzKy9nbSwgJycpXG4gICAgLnJlcGxhY2UoL15cXGQrXFwuXFxzKy9nbSwgJycpXG4gICAgLnJlcGxhY2UoL2BbXmBcXG5dKmAvZywgJycpXG4gICAgLnNwbGl0KCdcXG4nKVxuICAgIC5tYXAoKGwpID0+IGwudHJpbSgpKVxuICAgIC5maWx0ZXIoKGwpID0+IGwubGVuZ3RoID4gMCk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RUYWlsUHJldmlldyhyYXc6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGxpbmVzID0gc3RyaXBNYXJrZG93bihyYXcpO1xuICByZXR1cm4gbGluZXMuc2xpY2UoLTMpLmpvaW4oJyAgXHUwMEI3ICAnKS5yZXBsYWNlKC9cXHN7Mix9L2csICcgJykudHJpbSgpLnNsaWNlKDAsIDE0MCk7XG59XG5cblxuZnVuY3Rpb24gbm90ZVRhZ3MoZmlsZTogVEZpbGUsIGFwcDogQXBwKTogc3RyaW5nW10ge1xuICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgY29uc3QgaW5saW5lID0gKGNhY2hlPy50YWdzID8/IFtdKS5tYXAoKHQpID0+IHQudGFnKTtcbiAgY29uc3QgZm0gPSAoKGNhY2hlPy5mcm9udG1hdHRlcj8uWyd0YWdzJ10gPz8gW10pIGFzIHN0cmluZ1tdKS5tYXAoKHQpID0+IGAjJHt0fWApO1xuICByZXR1cm4gWy4uLm5ldyBTZXQoWy4uLmlubGluZSwgLi4uZm1dKV0uc2xpY2UoMCwgMik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQbHVnaW4gQVBJIHNoaW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVHJhc2hBcGkge1xuICBnZXRDYW5kaWRhdGVzKCk6IFRGaWxlW107XG4gIG9wZW5UcmlhZ2UoKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuaW50ZXJmYWNlIENvbnRpbnVlUGx1Z2luIHtcbiAgb3BlbmVkTG9nOiBzdHJpbmdbXTtcbn1cblxuZnVuY3Rpb24gZ2V0VHJhc2hBcGkoYXBwOiBBcHApOiBUcmFzaEFwaSB8IG51bGwge1xuICBjb25zdCBwbHVnaW4gPSAoYXBwIGFzIHVua25vd24gYXMgeyBwbHVnaW5zOiB7IHBsdWdpbnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0gfSlcbiAgICAucGx1Z2lucz8ucGx1Z2lucz8uWyd0cmFzaC1jb2xsZWN0aW9uJ107XG4gIGlmICghcGx1Z2luKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgYXBpID0gKHBsdWdpbiBhcyB7IGFwaT86IHVua25vd24gfSkuYXBpO1xuICBpZiAoIWFwaSB8fCB0eXBlb2YgKGFwaSBhcyBUcmFzaEFwaSkuZ2V0Q2FuZGlkYXRlcyAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG51bGw7XG4gIHJldHVybiBhcGkgYXMgVHJhc2hBcGk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRpbnVlUGx1Z2luKGFwcDogQXBwKTogQ29udGludWVQbHVnaW4gfCBudWxsIHtcbiAgY29uc3QgcGx1Z2luID0gKGFwcCBhcyB1bmtub3duIGFzIHsgcGx1Z2luczogeyBwbHVnaW5zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB9IH0pXG4gICAgLnBsdWdpbnM/LnBsdWdpbnM/Llsnb2JzaWRpYW4tY29udGludWUnXTtcbiAgaWYgKCFwbHVnaW4gfHwgIUFycmF5LmlzQXJyYXkoKHBsdWdpbiBhcyBDb250aW51ZVBsdWdpbikub3BlbmVkTG9nKSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBwbHVnaW4gYXMgQ29udGludWVQbHVnaW47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNb2RhbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGNsYXNzIERhc2hib2FyZE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIHJlYWRvbmx5IHNldHRpbmdzOiBSZWFkb25seURlZXA8UGx1Z2luU2V0dGluZ3M+O1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgc2V0dGluZ3M6IFJlYWRvbmx5RGVlcDxQbHVnaW5TZXR0aW5ncz4pIHtcbiAgICBzdXBlcihhcHApO1xuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgfVxuXG4gIHB1YmxpYyBvdmVycmlkZSBhc3luYyBvbk9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBtb2RhbEVsLCBjb250ZW50RWwsIGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuYWRkQ2xhc3MoJ3F3LWRhc2gtY29udGFpbmVyJyk7XG4gICAgbW9kYWxFbC5hZGRDbGFzcygncXctZGFzaC1tb2RhbCcpO1xuICAgIGNvbnRlbnRFbC5hZGRDbGFzcygncXctZGFzaCcpO1xuXG4gICAgbW9kYWxFbC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLWhhbmRsZScgfSk7XG5cbiAgICBjb25zdCB3aWRnZXRzID0gdGhpcy5zZXR0aW5ncy5kYXNoYm9hcmRXaWRnZXRzID8/IFtdO1xuXG4gICAgdGhpcy5yZW5kZXJDYXB0dXJlKGNvbnRlbnRFbCk7XG4gICAgdGhpcy5yZW5kZXJUb2RheVNlY3Rpb24oY29udGVudEVsKTtcblxuICAgIGZvciAoY29uc3Qgd2lkZ2V0IG9mIHdpZGdldHMpIHtcbiAgICAgIGlmICghd2lkZ2V0LmVuYWJsZWQpIGNvbnRpbnVlO1xuICAgICAgc3dpdGNoICh3aWRnZXQudHlwZSkge1xuICAgICAgICBjYXNlICdjb250aW51ZSc6IGF3YWl0IHRoaXMucmVuZGVyQ29udGludWUoY29udGVudEVsKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dyYXBoJzogdGhpcy5yZW5kZXJHcmFwaChjb250ZW50RWwpOyBicmVhaztcbiAgICAgICAgY2FzZSAnbmV3LW5vdGUnOiB0aGlzLnJlbmRlck1vcmVBY3Rpb25zKGNvbnRlbnRFbCk7IGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvdmVycmlkZSBvbkNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2VjdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJDYXB0dXJlKHJvb3Q6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgYXBwZW5kQWN0aW9uID0gKHRoaXMuc2V0dGluZ3MucXVpY2tBY3Rpb25zID8/IFtdKS5maW5kKChhKSA9PiBhLmFjdGlvbiA9PT0gJ2FwcGVuZC10by1ub3RlJyk7XG5cbiAgICBjb25zdCBiYXIgPSByb290LmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtY2FwdHVyZScgfSk7XG5cbiAgICBiYXIuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1jYXB0dXJlLWljb24nLCB0ZXh0OiAnXHUyNzI2JyB9KTtcblxuICAgIGJhci5jcmVhdGVFbCgnZGl2Jywge1xuICAgICAgY2xzOiAncXctZGFzaC1jYXB0dXJlLXBsYWNlaG9sZGVyJyxcbiAgICAgIHRleHQ6IGFwcGVuZEFjdGlvblxuICAgICAgICA/IGBBZGQgdG8gJHt0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKGFwcGVuZEFjdGlvbi5ub3RlUGF0aCA/PyAnJyk/LmJhc2VuYW1lID8/ICdub3RlJ31cdTIwMjZgXG4gICAgICAgIDogJ0NhcHR1cmUgYSB0aG91Z2h0XHUyMDI2JyxcbiAgICB9KTtcblxuICAgIGJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmIChhcHBlbmRBY3Rpb24pIHtcbiAgICAgICAgdm9pZCB0aGlzLmhhbmRsZVF1aWNrQWN0aW9uKGFwcGVuZEFjdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2b2lkIHRoaXMuaGFuZGxlUXVpY2tBY3Rpb24oeyBsYWJlbDogJ05ldyBub3RlJywgaWNvbjogJ2ZpbGUtcGx1cycsIGFjdGlvbjogJ25ldy1ub3RlJyB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVG9kYXlTZWN0aW9uKHJvb3Q6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgZGF0ZVJvdyA9IHJvb3QuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1kYXRlLXJvdycgfSk7XG4gICAgZGF0ZVJvdy5jcmVhdGVFbCgnc3BhbicsIHsgY2xzOiAncXctZGFzaC1kYXRlJywgdGV4dDogYFRPREFZIFx1MDBCNyAke2hlYWRlckRhdGUoKX1gIH0pO1xuXG4gICAgY29uc3QgY2FyZHMgPSAodGhpcy5zZXR0aW5ncy5wdWxzZUNhcmRzID8/IFtdKS5maWx0ZXIoKGMpID0+IGMuZW5hYmxlZCk7XG4gICAgaWYgKGNhcmRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgLy8gUmVzb2x2ZSB0cmFzaCBkYXRhIG9uY2UgKG5lZWRlZCBmb3IgdHJhc2ggY2FyZHMpXG4gICAgY29uc3QgbmVlZHNUcmFzaCA9IGNhcmRzLnNvbWUoKGMpID0+IGMudHlwZSA9PT0gJ3RyYXNoJyk7XG4gICAgY29uc3QgdHJhc2hBcGkgPSBuZWVkc1RyYXNoID8gZ2V0VHJhc2hBcGkodGhpcy5hcHApIDogbnVsbDtcbiAgICBjb25zdCB0cmFzaENvdW50ID0gdHJhc2hBcGkgPyB0cmFzaEFwaS5nZXRDYW5kaWRhdGVzKCkubGVuZ3RoIDogMDtcblxuICAgIC8vIFByZS1jb21wdXRlIHNoYXJlZCB2YXVsdCBzdGF0cyBvbmNlXG4gICAgY29uc3QgYWxsRmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpOyB0b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcblxuICAgIGNvbnN0IHZpc2libGVDYXJkcyA9IGNhcmRzLmZpbHRlcigoYykgPT4ge1xuICAgICAgaWYgKGMudHlwZSA9PT0gJ3RyYXNoJykgcmV0dXJuIHRyYXNoQ291bnQgPiAwO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICBpZiAodmlzaWJsZUNhcmRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgY29uc3QgcHVsc2VSb3cgPSByb290LmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtcHVsc2Utcm93JyB9KTtcblxuICAgIGZvciAoY29uc3QgY2FyZCBvZiB2aXNpYmxlQ2FyZHMpIHtcbiAgICAgIHRoaXMucmVuZGVyUHVsc2VDYXJkKHB1bHNlUm93LCBjYXJkLCB7IGFsbEZpbGVzLCB0b2RheSwgdHJhc2hBcGksIHRyYXNoQ291bnQgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJQdWxzZUNhcmQoXG4gICAgcm93OiBIVE1MRWxlbWVudCxcbiAgICBjYXJkOiBQdWxzZUNhcmQsXG4gICAgY3R4OiB7IGFsbEZpbGVzOiBURmlsZVtdOyB0b2RheTogRGF0ZTsgdHJhc2hBcGk6IFRyYXNoQXBpIHwgbnVsbDsgdHJhc2hDb3VudDogbnVtYmVyIH0sXG4gICk6IHZvaWQge1xuICAgIHN3aXRjaCAoY2FyZC50eXBlKSB7XG4gICAgICBjYXNlICdkYWlseS1ub3RlJzoge1xuICAgICAgICBjb25zdCBlbCA9IHJvdy5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLXB1bHNlLWNhcmQgcXctZGFzaC1wdWxzZS1jYXJkLS1hY2NlbnQnIH0pO1xuICAgICAgICBlbC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLXB1bHNlLWxhYmVsJywgdGV4dDogJ0RhaWx5IG5vdGUnIH0pO1xuICAgICAgICBlbC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLXB1bHNlLXZhbHVlIHF3LWRhc2gtcHVsc2UtdmFsdWUtLWFjY2VudCcsIHRleHQ6ICdPcGVuJyB9KTtcbiAgICAgICAgZWwuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1wdWxzZS1zdWInLCB0ZXh0OiAnSnVtcCB0byB0b2RheScgfSk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcC5jb21tYW5kcy5maW5kQ29tbWFuZCgnZGFpbHktbm90ZXM6Z290by10b2RheScpXG4gICAgICAgICAgICAgID8gJ2RhaWx5LW5vdGVzOmdvdG8tdG9kYXknXG4gICAgICAgICAgICAgIDogJ3BlcmlvZGljLW5vdGVzOm9wZW4tZGFpbHktbm90ZSc7XG4gICAgICAgICAgICB0aGlzLmFwcC5jb21tYW5kcy5leGVjdXRlQ29tbWFuZEJ5SWQoaWQpO1xuICAgICAgICAgIH0gY2F0Y2ggeyAvKiBwbHVnaW4gbm90IGluc3RhbGxlZCAqLyB9XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ21vZGlmaWVkLXRvZGF5Jzoge1xuICAgICAgICBjb25zdCBjb3VudCA9IGN0eC5hbGxGaWxlcy5maWx0ZXIoKGYpID0+IGYuc3RhdC5tdGltZSA+PSBjdHgudG9kYXkuZ2V0VGltZSgpKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGVsID0gcm93LmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtcHVsc2UtY2FyZCcgfSk7XG4gICAgICAgIGVsLmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtcHVsc2UtbGFiZWwnLCB0ZXh0OiAnTW9kaWZpZWQnIH0pO1xuICAgICAgICBlbC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLXB1bHNlLXZhbHVlJywgdGV4dDogU3RyaW5nKGNvdW50KSB9KTtcbiAgICAgICAgZWwuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1wdWxzZS1zdWInLCB0ZXh0OiAnbm90ZXMgdG9kYXknIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3ZhdWx0Jzoge1xuICAgICAgICBjb25zdCBub3RlQ291bnQgPSBjdHguYWxsRmlsZXMubGVuZ3RoO1xuICAgICAgICBjb25zdCBub3RlU3RyID0gbm90ZUNvdW50ID49IDEwMDAgPyBgJHsobm90ZUNvdW50IC8gMTAwMCkudG9GaXhlZCgxKX1rYCA6IFN0cmluZyhub3RlQ291bnQpO1xuICAgICAgICBsZXQgbGlua0NvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBmIG9mIGN0eC5hbGxGaWxlcykgbGlua0NvdW50ICs9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGYpPy5saW5rcz8ubGVuZ3RoID8/IDA7XG4gICAgICAgIGNvbnN0IGxpbmtTdHIgPSBsaW5rQ291bnQgPj0gMTAwMCA/IGAkeyhsaW5rQ291bnQgLyAxMDAwKS50b0ZpeGVkKDEpfWtgIDogU3RyaW5nKGxpbmtDb3VudCk7XG4gICAgICAgIGNvbnN0IGVsID0gcm93LmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtcHVsc2UtY2FyZCcgfSk7XG4gICAgICAgIGVsLmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtcHVsc2UtbGFiZWwnLCB0ZXh0OiAnVmF1bHQnIH0pO1xuICAgICAgICBlbC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLXB1bHNlLXZhbHVlIHF3LWRhc2gtcHVsc2UtdmFsdWUtLWdvbGQnLCB0ZXh0OiBub3RlU3RyIH0pO1xuICAgICAgICBlbC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLXB1bHNlLXN1YicsIHRleHQ6IGBub3RlcyBcdTAwQjcgJHtsaW5rU3RyfSBsaW5rc2AgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAndHJhc2gnOiB7XG4gICAgICAgIGNvbnN0IGVsID0gcm93LmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtcHVsc2UtY2FyZCcgfSk7XG4gICAgICAgIGVsLmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtcHVsc2UtbGFiZWwnLCB0ZXh0OiAnTmVlZHMgcmV2aWV3JyB9KTtcbiAgICAgICAgZWwuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1wdWxzZS12YWx1ZScsIHRleHQ6IFN0cmluZyhjdHgudHJhc2hDb3VudCkgfSk7XG4gICAgICAgIGVsLmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtcHVsc2Utc3ViJywgdGV4dDogJ3N0YWxlIG5vdGVzJyB9KTtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IHRoaXMuY2xvc2UoKTsgdm9pZCBjdHgudHJhc2hBcGk/Lm9wZW5UcmlhZ2UoKTsgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAncXVpY2stYWN0aW9uJzoge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBjYXJkLnF1aWNrQWN0aW9uO1xuICAgICAgICBpZiAoIWFjdGlvbikgYnJlYWs7XG4gICAgICAgIGNvbnN0IGVsID0gcm93LmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtcHVsc2UtY2FyZCcgfSk7XG4gICAgICAgIGNvbnN0IGljb25XcmFwID0gZWwuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1wdWxzZS1hY3Rpb24taWNvbicgfSk7XG4gICAgICAgIHNldEljb24oaWNvbldyYXAsIGFjdGlvbi5pY29uIHx8ICd6YXAnKTtcbiAgICAgICAgZWwuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1wdWxzZS1sYWJlbCcsIHRleHQ6IGFjdGlvbi5sYWJlbCB9KTtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IHZvaWQgdGhpcy5oYW5kbGVRdWlja0FjdGlvbihhY3Rpb24pOyB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyByZW5kZXJDb250aW51ZShyb290OiBIVE1MRWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5nZXRSZWNlbnRGaWxlcygpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIHJvb3QuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1zZWN0aW9uLWxhYmVsJywgdGV4dDogJ1JFQ0VOVExZIFRPVUNIRUQnIH0pO1xuXG4gICAgZm9yIChjb25zdCBbaWR4LCBmaWxlXSBvZiBmaWxlcy5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHJvb3QuY3JlYXRlRWwoJ2RpdicsIHtcbiAgICAgICAgY2xzOiBpZHggPT09IDAgPyAncXctZGFzaC1ub3RlLXJvdyBxdy1kYXNoLW5vdGUtcm93LS1yZWNlbnQnIDogJ3F3LWRhc2gtbm90ZS1yb3cnLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1ldGEgPSByb3cuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1ub3RlLW1ldGEnIH0pO1xuXG4gICAgICBjb25zdCB0aXRsZVJvdyA9IG1ldGEuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1ub3RlLXRpdGxlLXJvdycgfSk7XG4gICAgICB0aXRsZVJvdy5jcmVhdGVFbCgnc3BhbicsIHsgY2xzOiAncXctZGFzaC1ub3RlLXRpdGxlJywgdGV4dDogZmlsZS5iYXNlbmFtZSB9KTtcbiAgICAgIHRpdGxlUm93LmNyZWF0ZUVsKCdzcGFuJywgeyBjbHM6ICdxdy1kYXNoLW5vdGUtdGltZScsIHRleHQ6IGZyb21Ob3coZmlsZS5zdGF0Lm10aW1lKSB9KTtcblxuICAgICAgLy8gVGFncyArIGJhY2tsaW5rIGNvdW50XG4gICAgICBjb25zdCB0YWdzID0gbm90ZVRhZ3MoZmlsZSwgdGhpcy5hcHApO1xuICAgICAgbGV0IGJhY2tsaW5rQ291bnQgPSAwO1xuICAgICAgZm9yIChjb25zdCBsaW5rcyBvZiBPYmplY3QudmFsdWVzKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUucmVzb2x2ZWRMaW5rcykpIHtcbiAgICAgICAgaWYgKGxpbmtzW2ZpbGUucGF0aF0pIGJhY2tsaW5rQ291bnQrKztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRldGFpbCA9IG1ldGEuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1ub3RlLWRldGFpbCcgfSk7XG4gICAgICBpZiAoYmFja2xpbmtDb3VudCA+IDApIGRldGFpbC5jcmVhdGVFbCgnc3BhbicsIHsgY2xzOiAncXctZGFzaC1ub3RlLWxpbmtzJywgdGV4dDogYFx1MjE5MCAke2JhY2tsaW5rQ291bnR9YCB9KTtcbiAgICAgIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIGRldGFpbC5jcmVhdGVFbCgnc3BhbicsIHsgY2xzOiAncXctZGFzaC1ub3RlLXRhZycsIHRleHQ6IHRhZyB9KTtcblxuICAgICAgLy8gQWx3YXlzIHNob3cgdGFpbCBwcmV2aWV3XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwcmV2aWV3ID0gZXh0cmFjdFRhaWxQcmV2aWV3KGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNhY2hlZFJlYWQoZmlsZSkpO1xuICAgICAgICBpZiAocHJldmlldykgbWV0YS5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLW5vdGUtcHJldmlldycsIHRleHQ6IHByZXZpZXcgfSk7XG4gICAgICB9IGNhdGNoIHsgLyogc2tpcCAqLyB9XG4gICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgdm9pZCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TW9zdFJlY2VudExlYWYoKT8ub3BlbkZpbGUoZmlsZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckdyYXBoKHJvb3Q6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgY2VudGVyRmlsZSA9IHRoaXMuZ2V0UmVjZW50RmlsZXMoKVswXTtcbiAgICBpZiAoIWNlbnRlckZpbGUpIHJldHVybjtcblxuICAgIGNvbnN0IHJlc29sdmVkTGlua3MgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLnJlc29sdmVkTGlua3M7XG4gICAgY29uc3Qgb3V0Z29pbmcgPSBPYmplY3Qua2V5cyhyZXNvbHZlZExpbmtzW2NlbnRlckZpbGUucGF0aF0gPz8ge30pO1xuICAgIGNvbnN0IGluY29taW5nOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgW3NyYywgbGlua3NdIG9mIE9iamVjdC5lbnRyaWVzKHJlc29sdmVkTGlua3MpKSB7XG4gICAgICBpZiAoc3JjICE9PSBjZW50ZXJGaWxlLnBhdGggJiYgbGlua3NbY2VudGVyRmlsZS5wYXRoXSkgaW5jb21pbmcucHVzaChzcmMpO1xuICAgIH1cbiAgICBjb25zdCBuZWlnaGJvclBhdGhzID0gWy4uLm5ldyBTZXQoWy4uLm91dGdvaW5nLCAuLi5pbmNvbWluZ10pXTtcbiAgICBjb25zdCB0b3RhbENvbm5lY3Rpb25zID0gbmVpZ2hib3JQYXRocy5sZW5ndGg7XG5cbiAgICByb290LmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtc2VjdGlvbi1sYWJlbCcsIHRleHQ6ICdBQ1RJVkUgQ0xVU1RFUicgfSk7XG5cbiAgICBjb25zdCBjYXJkID0gcm9vdC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLWdyYXBoLWNhcmQnIH0pO1xuICAgIGNvbnN0IGNhbnZhcyA9IGNhcmQuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1ncmFwaC1jYW52YXMnIH0pO1xuICAgIGNvbnN0IGF0dGFjaExpc3RlbmVycyA9IChleHBhbmRlZDogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgICAgY2FudmFzLmlubmVySFRNTCA9IHRoaXMuYnVpbGRHcmFwaFN2ZyhjZW50ZXJGaWxlLCBuZWlnaGJvclBhdGhzLnNsaWNlKDAsIGV4cGFuZGVkID8gMjAgOiAxMCksIGV4cGFuZGVkKTtcblxuICAgICAgY2FudmFzLnF1ZXJ5U2VsZWN0b3JBbGw8U1ZHRWxlbWVudD4oJ1tkYXRhLXBhdGhdJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVCeVBhdGgoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKSA/PyAnJyk7XG4gICAgICAgICAgaWYgKGZpbGUpIHsgdGhpcy5jbG9zZSgpOyB2b2lkIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRNb3N0UmVjZW50TGVhZigpPy5vcGVuRmlsZShmaWxlKTsgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBjYW52YXMucXVlcnlTZWxlY3RvcjxTVkdFbGVtZW50PignW2RhdGEtY2VudGVyXScpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgdm9pZCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TW9zdFJlY2VudExlYWYoKT8ub3BlbkZpbGUoY2VudGVyRmlsZSk7XG4gICAgICB9KTtcblxuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBleHBhbmRlZDIgPSBjYXJkLmNsYXNzTGlzdC50b2dnbGUoJ3F3LWRhc2gtZ3JhcGgtY2FyZC0tZXhwYW5kZWQnKTtcbiAgICAgICAgYXR0YWNoTGlzdGVuZXJzKGV4cGFuZGVkMik7XG4gICAgICB9LCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfTtcblxuICAgIGF0dGFjaExpc3RlbmVycyhmYWxzZSk7XG5cbiAgICBjb25zdCBmb290ZXIgPSBjYXJkLmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtZ3JhcGgtZm9vdGVyJyB9KTtcbiAgICBjb25zdCBzdGF0ID0gZm9vdGVyLmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtZ3JhcGgtc3RhdCcgfSk7XG4gICAgc3RhdC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1kYXNoLWdyYXBoLWRvdCcgfSk7XG4gICAgc3RhdC5jcmVhdGVFbCgnc3BhbicsIHsgdGV4dDogYCR7dG90YWxDb25uZWN0aW9uc30gY29ubmVjdGVkIG5vdGVzYCB9KTtcblxuICAgIGNvbnN0IGJ0biA9IGZvb3Rlci5jcmVhdGVFbCgnYnV0dG9uJywgeyBjbHM6ICdxdy1kYXNoLWdyYXBoLWJ0bicsIHRleHQ6ICdGVUxMIEdSQVBIIFx1MjE5MicgfSk7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgdHJ5IHsgdGhpcy5hcHAuY29tbWFuZHMuZXhlY3V0ZUNvbW1hbmRCeUlkKCdncmFwaDpvcGVuJyk7IH0gY2F0Y2ggeyAvKiAqLyB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkR3JhcGhTdmcoY2VudGVyOiBURmlsZSwgbmVpZ2hib3JQYXRoczogc3RyaW5nW10sIGV4cGFuZGVkID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGNvbnN0IGN4ID0gMTcxO1xuICAgIGNvbnN0IHZpZXdIID0gZXhwYW5kZWQgPyAzNTYgOiAxNzg7XG4gICAgY29uc3QgY3kgPSB2aWV3SCAvIDI7ICAvLyBhbHdheXMgdmVydGljYWxseSBjZW50ZXJlZCBpbiB0aGUgdmlld0JveFxuICAgIGNvbnN0IHIgPSBleHBhbmRlZCA/IDExNSA6IDU4O1xuICAgIGNvbnN0IG4gPSBuZWlnaGJvclBhdGhzLmxlbmd0aDtcblxuICAgIGNvbnN0IG5laWdoYm9ycyA9IG5laWdoYm9yUGF0aHMubWFwKChwYXRoLCBpKSA9PiB7XG4gICAgICBjb25zdCBhbmdsZSA9IChpIC8gTWF0aC5tYXgobiwgMSkpICogMiAqIE1hdGguUEkgLSBNYXRoLlBJIC8gMjtcbiAgICAgIGNvbnN0IHggPSBjeCArIHIgKiBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICBjb25zdCB5ID0gY3kgKyByICogTWF0aC5zaW4oYW5nbGUpO1xuICAgICAgY29uc3QgbmFtZSA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVCeVBhdGgocGF0aCk/LmJhc2VuYW1lID8/IHBhdGguc3BsaXQoJy8nKS5wb3AoKT8ucmVwbGFjZSgvXFwubWQkLywgJycpID8/ICcnO1xuICAgICAgcmV0dXJuIHsgeCwgeSwgbmFtZSwgcGF0aCB9O1xuICAgIH0pO1xuXG4gICAgY29uc3QgZWRnZXMgPSBuZWlnaGJvcnNcbiAgICAgIC5tYXAoKG5iKSA9PiBgPGxpbmUgeDE9XCIke2N4fVwiIHkxPVwiJHtjeX1cIiB4Mj1cIiR7bmIueC50b0ZpeGVkKDEpfVwiIHkyPVwiJHtuYi55LnRvRml4ZWQoMSl9XCIgc3Ryb2tlPVwiIzJlMmUzYVwiIHN0cm9rZS13aWR0aD1cIjFcIiBvcGFjaXR5PVwiMC44XCIvPmApXG4gICAgICAuam9pbignJyk7XG5cbiAgICBjb25zdCBub2RlcyA9IG5laWdoYm9yc1xuICAgICAgLm1hcCgobmIpID0+IHtcbiAgICAgICAgY29uc3QgdHJ1bmNhdGVkID0gbmIubmFtZS5sZW5ndGggPiAxNCA/IG5iLm5hbWUuc2xpY2UoMCwgMTQpICsgJ1x1MjAyNicgOiBuYi5uYW1lO1xuICAgICAgICBjb25zdCBhYm92ZSA9IG5iLnkgPCBjeTtcbiAgICAgICAgY29uc3QgbHkgPSBhYm92ZSA/IG5iLnkgLSAxMCA6IG5iLnkgKyAxNDtcbiAgICAgICAgcmV0dXJuIGA8ZyBkYXRhLXBhdGg9XCIke25iLnBhdGh9XCIgc3R5bGU9XCJjdXJzb3I6cG9pbnRlclwiPlxuICAgICAgICAgIDxjaXJjbGUgY3g9XCIke25iLngudG9GaXhlZCgxKX1cIiBjeT1cIiR7bmIueS50b0ZpeGVkKDEpfVwiIHI9XCIxNFwiIGZpbGw9XCJ0cmFuc3BhcmVudFwiLz5cbiAgICAgICAgICA8Y2lyY2xlIGN4PVwiJHtuYi54LnRvRml4ZWQoMSl9XCIgY3k9XCIke25iLnkudG9GaXhlZCgxKX1cIiByPVwiNFwiIGZpbGw9XCIjMWUxZTI4XCIgc3Ryb2tlPVwiIzNhM2E1MFwiIHN0cm9rZS13aWR0aD1cIjFcIi8+XG4gICAgICAgICAgPHRleHQgeD1cIiR7bmIueC50b0ZpeGVkKDEpfVwiIHk9XCIke2x5LnRvRml4ZWQoMSl9XCIgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiBmaWxsPVwiIzliN2NlOFwiIGZvbnQtc2l6ZT1cIjdcIiBmb250LWZhbWlseT1cIm1vbm9zcGFjZVwiIG9wYWNpdHk9XCIwLjg1XCI+W1ske3RydW5jYXRlZH1dXTwvdGV4dD5cbiAgICAgICAgPC9nPmA7XG4gICAgICB9KVxuICAgICAgLmpvaW4oJycpO1xuXG4gICAgY29uc3QgY2VudGVyTGFiZWwgPSBjZW50ZXIuYmFzZW5hbWUubGVuZ3RoID4gMjAgPyBjZW50ZXIuYmFzZW5hbWUuc2xpY2UoMCwgMjApICsgJ1x1MjAyNicgOiBjZW50ZXIuYmFzZW5hbWU7XG5cbiAgICByZXR1cm4gYDxzdmcgdmlld0JveD1cIjAgMCAzNDMgJHt2aWV3SH1cIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWQgbWVldFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxnPiR7ZWRnZXN9PC9nPlxuICAgICAgPGc+JHtub2Rlc308L2c+XG4gICAgICA8ZyBkYXRhLWNlbnRlciBzdHlsZT1cImN1cnNvcjpwb2ludGVyXCI+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIke2N4fVwiIGN5PVwiJHtjeX1cIiByPVwiMjJcIiBmaWxsPVwidHJhbnNwYXJlbnRcIi8+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIke2N4fVwiIGN5PVwiJHtjeX1cIiByPVwiMTZcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIiM3YzVjYmZcIiBzdHJva2Utd2lkdGg9XCIxXCIgb3BhY2l0eT1cIjAuMlwiLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIiR7Y3h9XCIgY3k9XCIke2N5fVwiIHI9XCIxM1wiIGZpbGw9XCIjMWExMjMwXCIgc3Ryb2tlPVwiIzliN2NlOFwiIHN0cm9rZS13aWR0aD1cIjJcIi8+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIke2N4fVwiIGN5PVwiJHtjeX1cIiByPVwiN1wiIGZpbGw9XCIjN2M1Y2JmXCIvPlxuICAgICAgICA8Y2lyY2xlIGN4PVwiJHtjeH1cIiBjeT1cIiR7Y3l9XCIgcj1cIjNcIiBmaWxsPVwiI2Q0YjhmZlwiLz5cbiAgICAgICAgPHRleHQgeD1cIiR7Y3h9XCIgeT1cIiR7Y3kgKyAyNn1cIiB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiIGZpbGw9XCIjZThlOGVjXCIgZm9udC1zaXplPVwiOFwiIGZvbnQtZmFtaWx5PVwic2Fucy1zZXJpZlwiIGZvbnQtd2VpZ2h0PVwiNTAwXCI+JHtjZW50ZXJMYWJlbH08L3RleHQ+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+YDtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyTW9yZUFjdGlvbnMocm9vdDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5zZXR0aW5ncy5xdWlja0FjdGlvbnMgPz8gW107XG4gICAgaWYgKGFjdGlvbnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICByb290LmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ3F3LWRhc2gtc2VjdGlvbi1sYWJlbCcsIHRleHQ6ICdNT1JFIEFDVElPTlMnIH0pO1xuICAgIGNvbnN0IHJvdyA9IHJvb3QuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAncXctZGFzaC1hY3Rpb25zJyB9KTtcblxuICAgIGZvciAoY29uc3QgYWN0aW9uIG9mIGFjdGlvbnMpIHtcbiAgICAgIGNvbnN0IGJ0biA9IHJvdy5jcmVhdGVFbCgnYnV0dG9uJywgeyBjbHM6ICdxdy1kYXNoLWFjdGlvbi1idG4nIH0pO1xuICAgICAgY29uc3QgaWNvbkVsID0gYnRuLmNyZWF0ZUVsKCdzcGFuJywgeyBjbHM6ICdxdy1kYXNoLWFjdGlvbi1pY29uJyB9KTtcbiAgICAgIHNldEljb24oaWNvbkVsLCBhY3Rpb24uaWNvbiB8fCAnemFwJyk7XG4gICAgICBidG4uY3JlYXRlRWwoJ3NwYW4nLCB7IHRleHQ6IGFjdGlvbi5sYWJlbCB9KTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgdm9pZCB0aGlzLmhhbmRsZVF1aWNrQWN0aW9uKGFjdGlvbik7IH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgaXNFeGNsdWRlZChmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5zZXR0aW5ncy5jb250aW51ZUV4Y2x1ZGVkID8/IFtdKS5zb21lKChydWxlKSA9PlxuICAgICAgcnVsZS5lbmRzV2l0aCgnLycpID8gZmlsZS5wYXRoLnN0YXJ0c1dpdGgocnVsZSkgOiBmaWxlLnBhdGggPT09IHJ1bGUsXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVjZW50RmlsZXMoKTogVEZpbGVbXSB7XG4gICAgY29uc3QgTUFYID0gNDtcbiAgICBjb25zdCBjb250aW51ZVBsdWcgPSBnZXRDb250aW51ZVBsdWdpbih0aGlzLmFwcCk7XG4gICAgY29uc3QgcGF0aHMgPVxuICAgICAgY29udGludWVQbHVnICYmIGNvbnRpbnVlUGx1Zy5vcGVuZWRMb2cubGVuZ3RoID4gMFxuICAgICAgICA/IGNvbnRpbnVlUGx1Zy5vcGVuZWRMb2dcbiAgICAgICAgOiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGFzdE9wZW5GaWxlcygpO1xuICAgIHJldHVybiBwYXRoc1xuICAgICAgLm1hcCgocCkgPT4gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZUJ5UGF0aChwKSlcbiAgICAgIC5maWx0ZXIoKGYpOiBmIGlzIFRGaWxlID0+IGYgIT09IG51bGwgJiYgIXRoaXMuaXNFeGNsdWRlZChmKSlcbiAgICAgIC5zbGljZSgwLCBNQVgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVRdWlja0FjdGlvbihhY3Rpb246IFJlYWRvbmx5RGVlcDxRdWlja0FjdGlvbj4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBzd2l0Y2ggKGFjdGlvbi5hY3Rpb24pIHtcbiAgICAgIGNhc2UgJ25ldy1ub3RlJzoge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBjcmVhdGVOb3RlKHRoaXMuYXBwLCB0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldE1vc3RSZWNlbnRMZWFmKCk/Lm9wZW5GaWxlKGZpbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2hvbWVwYWdlJzoge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuc2V0dGluZ3MuaG9tZVBhdGg7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZUJ5UGF0aCh0YXJnZXQpO1xuICAgICAgICAgIGlmIChmaWxlKSB7IGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRNb3N0UmVjZW50TGVhZigpPy5vcGVuRmlsZShmaWxlKTsgcmV0dXJuOyB9XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAodGhpcy5hcHAuY29tbWFuZHMuZmluZENvbW1hbmQoJ2hvbWVwYWdlOm9wZW4nKSkge1xuICAgICAgICAgICAgdGhpcy5hcHAuY29tbWFuZHMuZXhlY3V0ZUNvbW1hbmRCeUlkKCdob21lcGFnZTpvcGVuJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoJ05vIGhvbWUgbm90ZSBjb25maWd1cmVkLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7IG5ldyBOb3RpY2UoJ05vIGhvbWUgbm90ZSBjb25maWd1cmVkLicpOyB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnY29tbWFuZCc6IHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICBpZiAoYWN0aW9uLmNvbW1hbmRJZCkgdGhpcy5hcHAuY29tbWFuZHMuZXhlY3V0ZUNvbW1hbmRCeUlkKGFjdGlvbi5jb21tYW5kSWQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2FwcGVuZC10by1ub3RlJzoge1xuICAgICAgICBjb25zdCBub3RlUGF0aCA9IGFjdGlvbi5ub3RlUGF0aDtcbiAgICAgICAgaWYgKCFub3RlUGF0aCkgeyBuZXcgTm90aWNlKCdObyBub3RlIHBhdGggY29uZmlndXJlZCBmb3IgdGhpcyBhY3Rpb24uJyk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFjdGlvbi5hcHBlbmRUZW1wbGF0ZSB8fCAne3t0ZXh0fX0nO1xuICAgICAgICBuZXcgQXBwZW5kUHJvbXB0TW9kYWwodGhpcy5hcHAsIGFjdGlvbi5sYWJlbCwgYXN5bmMgKHRleHQpID0+IHtcbiAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZUJ5UGF0aChub3RlUGF0aCk7XG4gICAgICAgICAgaWYgKCFmaWxlKSB7IG5ldyBOb3RpY2UoYE5vdGUgbm90IGZvdW5kOiAke25vdGVQYXRofWApOyByZXR1cm47IH1cbiAgICAgICAgICBjb25zdCBsaW5lID0gdGVtcGxhdGUucmVwbGFjZSgne3t0ZXh0fX0nLCB0ZXh0KTtcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgICBjb25zdCBzZXAgPSBjb250ZW50LmVuZHNXaXRoKCdcXG4nKSA/ICcnIDogJ1xcbic7XG4gICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIGNvbnRlbnQgKyBzZXAgKyBsaW5lICsgJ1xcbicpO1xuICAgICAgICAgIG5ldyBOb3RpY2UoYEFkZGVkIHRvICR7ZmlsZS5iYXNlbmFtZX1gKTtcbiAgICAgICAgfSkub3BlbigpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFJlYWRvbmx5RGVlcCB9IGZyb20gJ3R5cGUtZmVzdCc7XG5cbmltcG9ydCB0eXBlIHsgUGx1Z2luU2V0dGluZ3MgfSBmcm9tICcuL1BsdWdpblNldHRpbmdzLnRzJztcblxuZnVuY3Rpb24gaXNvRGF0ZSgpOiBzdHJpbmcge1xuICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgcmV0dXJuIGAke2QuZ2V0RnVsbFllYXIoKX0tJHtTdHJpbmcoZC5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKX0tJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyl9YDtcbn1cblxuZnVuY3Rpb24gemV0dGVsa2FzdGVuSWQoKTogc3RyaW5nIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gIHJldHVybiBbXG4gICAgZC5nZXRGdWxsWWVhcigpLFxuICAgIFN0cmluZyhkLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpLFxuICAgIFN0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKSxcbiAgICBTdHJpbmcoZC5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpLFxuICAgIFN0cmluZyhkLmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKSxcbiAgICBTdHJpbmcoZC5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsICcwJyksXG4gIF0uam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGdldFRlbXBsYXRlcihhcHA6IEFwcCk6IHsgb3ZlcndyaXRlX2ZpbGVfY29tbWFuZHM/OiAoZjogVEZpbGUsIG9wZW46IGJvb2xlYW4pID0+IFByb21pc2U8dm9pZD4gfSB8IG51bGwge1xuICBjb25zdCBwbHVnaW4gPSAoYXBwIGFzIHVua25vd24gYXMgeyBwbHVnaW5zOiB7IHBsdWdpbnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0gfSlcbiAgICAucGx1Z2lucz8ucGx1Z2lucz8uWyd0ZW1wbGF0ZXItb2JzaWRpYW4nXTtcbiAgaWYgKCFwbHVnaW4pIHJldHVybiBudWxsO1xuICByZXR1cm4gKChwbHVnaW4gYXMgeyB0ZW1wbGF0ZXI/OiB1bmtub3duIH0pLnRlbXBsYXRlciBhcyB7IG92ZXJ3cml0ZV9maWxlX2NvbW1hbmRzPzogKGY6IFRGaWxlLCBvcGVuOiBib29sZWFuKSA9PiBQcm9taXNlPHZvaWQ+IH0gfCB1bmRlZmluZWQpID8/IG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVOb3RlKGFwcDogQXBwLCBzZXR0aW5nczogUmVhZG9ubHlEZWVwPFBsdWdpblNldHRpbmdzPik6IFByb21pc2U8VEZpbGU+IHtcbiAgY29uc3QgZm9sZGVyID0gc2V0dGluZ3MubmV3Tm90ZUZvbGRlcjtcblxuICBjb25zdCB0ZW1wbGF0ZVBhdGggPSBzZXR0aW5ncy5uZXdOb3RlVGVtcGxhdGU7XG4gIGNvbnN0IHRlbXBsYXRlRmlsZSA9IHRlbXBsYXRlUGF0aCA/IGFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHRlbXBsYXRlUGF0aCkgOiBudWxsO1xuICBjb25zdCBjb250ZW50ID0gdGVtcGxhdGVGaWxlID8gYXdhaXQgYXBwLnZhdWx0LnJlYWQodGVtcGxhdGVGaWxlKSA6ICcnO1xuXG4gIGNvbnN0IHVzZVpldHRlbCA9IHNldHRpbmdzLm5ld05vdGVGaWxlbmFtZUZvcm1hdCA9PT0gJ3pldHRlbGthc3Rlbic7XG4gIGNvbnN0IGJhc2VOYW1lID0gdXNlWmV0dGVsID8gemV0dGVsa2FzdGVuSWQoKSA6IGBVbnRpdGxlZCAke2lzb0RhdGUoKX1gO1xuXG4gIGxldCBmaW5hbFBhdGggPSBmb2xkZXIgPyBgJHtmb2xkZXJ9LyR7YmFzZU5hbWV9Lm1kYCA6IGAke2Jhc2VOYW1lfS5tZGA7XG4gIGxldCBuID0gMTtcbiAgd2hpbGUgKGFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKGZpbmFsUGF0aCkpIHtcbiAgICBjb25zdCBhbHQgPSB1c2VaZXR0ZWwgPyBgJHtiYXNlTmFtZX0tJHtufWAgOiBgJHtiYXNlTmFtZX0gJHtufWA7XG4gICAgZmluYWxQYXRoID0gZm9sZGVyID8gYCR7Zm9sZGVyfS8ke2FsdH0ubWRgIDogYCR7YWx0fS5tZGA7XG4gICAgbisrO1xuICB9XG5cbiAgY29uc3QgZmlsZSA9IGF3YWl0IGFwcC52YXVsdC5jcmVhdGUoZmluYWxQYXRoLCBjb250ZW50KTtcblxuICBpZiAodGVtcGxhdGVGaWxlKSB7XG4gICAgY29uc3QgdGVtcGxhdGVyID0gZ2V0VGVtcGxhdGVyKGFwcCk7XG4gICAgYXdhaXQgdGVtcGxhdGVyPy5vdmVyd3JpdGVfZmlsZV9jb21tYW5kcz8uKGZpbGUsIGZhbHNlKTtcbiAgfVxuXG4gIHJldHVybiBmaWxlO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgeyBNb2RhbCB9IGZyb20gJ29ic2lkaWFuJztcblxuZXhwb3J0IGNsYXNzIEFwcGVuZFByb21wdE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIGlucHV0RWwhOiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICBhcHA6IEFwcCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGhpbnQ6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9uQ29uZmlybTogKHRleHQ6IHN0cmluZykgPT4gdm9pZCxcbiAgKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgfVxuXG4gIHB1YmxpYyBvdmVycmlkZSBvbk9wZW4oKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmFkZENsYXNzKCdxdy1wcm9tcHQnKTtcblxuICAgIGNvbnRlbnRFbC5jcmVhdGVFbCgncCcsIHsgY2xzOiAncXctcHJvbXB0LWhpbnQnLCB0ZXh0OiB0aGlzLmhpbnQgfSk7XG5cbiAgICB0aGlzLmlucHV0RWwgPSBjb250ZW50RWwuY3JlYXRlRWwoJ2lucHV0JywgeyB0eXBlOiAndGV4dCcgfSk7XG4gICAgdGhpcy5pbnB1dEVsLmFkZENsYXNzKCdxdy1wcm9tcHQtaW5wdXQnKTtcbiAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHRoaXMuY29uZmlybSgpO1xuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYnRucyA9IGNvbnRlbnRFbC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdxdy1wcm9tcHQtYnRucycgfSk7XG4gICAgY29uc3QgY2FuY2VsID0gYnRucy5jcmVhdGVFbCgnYnV0dG9uJywgeyBjbHM6ICdxdy1wcm9tcHQtYnRuJywgdGV4dDogJ0NhbmNlbCcgfSk7XG4gICAgY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICBjb25zdCBjb25maXJtID0gYnRucy5jcmVhdGVFbCgnYnV0dG9uJywgeyBjbHM6ICdxdy1wcm9tcHQtYnRuIHF3LXByb21wdC1idG4tLWNvbmZpcm0nLCB0ZXh0OiAnQWRkJyB9KTtcbiAgICBjb25maXJtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5jb25maXJtKCkpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuaW5wdXRFbC5mb2N1cygpOyB9LCA1MCk7XG4gIH1cblxuICBwdWJsaWMgb3ZlcnJpZGUgb25DbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maXJtKCk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLmlucHV0RWwudmFsdWUudHJpbSgpO1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLm9uQ29uZmlybSh0ZXh0KTtcbiAgfVxufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBSZWFkb25seURlZXAgfSBmcm9tICd0eXBlLWZlc3QnO1xuXG5pbXBvcnQgeyBNb2RhbCwgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgdHlwZSB7IFBsdWdpblNldHRpbmdzLCBTbGljZUNvbmZpZyB9IGZyb20gJy4uL1BsdWdpblNldHRpbmdzLnRzJztcblxuaW1wb3J0IHsgY3JlYXRlTm90ZSB9IGZyb20gJy4uL2NyZWF0ZU5vdGUudHMnO1xuaW1wb3J0IHsgRGFzaGJvYXJkTW9kYWwgfSBmcm9tICcuL0Rhc2hib2FyZE1vZGFsLnRzJztcblxuY29uc3QgU1ZHX05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuY29uc3QgR0FQX0RFRyA9IDI7XG5cbmZ1bmN0aW9uIGRlZzJyYWQoZGVnOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gKGRlZyAqIE1hdGguUEkpIC8gMTgwO1xufVxuXG5mdW5jdGlvbiBwb2xhclhZKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHI6IG51bWJlciwgYW5nbGVEZWc6IG51bWJlcik6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB7XG4gIGNvbnN0IGEgPSBkZWcycmFkKGFuZ2xlRGVnKTtcbiAgcmV0dXJuIHsgeDogY3ggKyByICogTWF0aC5jb3MoYSksIHk6IGN5ICsgciAqIE1hdGguc2luKGEpIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VBcmNQYXRoKFxuICBjeDogbnVtYmVyLCBjeTogbnVtYmVyLFxuICBvdXRlclI6IG51bWJlciwgaW5uZXJSOiBudW1iZXIsXG4gIHN0YXJ0RGVnOiBudW1iZXIsIGVuZERlZzogbnVtYmVyXG4pOiBzdHJpbmcge1xuICBjb25zdCBzID0gc3RhcnREZWcgKyBHQVBfREVHO1xuICBjb25zdCBlID0gZW5kRGVnIC0gR0FQX0RFRztcbiAgY29uc3QgbGFyZ2UgPSAoZSAtIHMpID4gMTgwID8gMSA6IDA7XG5cbiAgY29uc3QgbzEgPSBwb2xhclhZKGN4LCBjeSwgb3V0ZXJSLCBzKTtcbiAgY29uc3QgbzIgPSBwb2xhclhZKGN4LCBjeSwgb3V0ZXJSLCBlKTtcbiAgY29uc3QgaTEgPSBwb2xhclhZKGN4LCBjeSwgaW5uZXJSLCBlKTtcbiAgY29uc3QgaTIgPSBwb2xhclhZKGN4LCBjeSwgaW5uZXJSLCBzKTtcblxuICByZXR1cm4gW1xuICAgIGBNICR7bzEueH0gJHtvMS55fWAsXG4gICAgYEEgJHtvdXRlclJ9ICR7b3V0ZXJSfSAwICR7bGFyZ2V9IDEgJHtvMi54fSAke28yLnl9YCxcbiAgICBgTCAke2kxLnh9ICR7aTEueX1gLFxuICAgIGBBICR7aW5uZXJSfSAke2lubmVyUn0gMCAke2xhcmdlfSAwICR7aTIueH0gJHtpMi55fWAsXG4gICAgJ1onLFxuICBdLmpvaW4oJyAnKTtcbn1cblxuZXhwb3J0IGNsYXNzIFJhZGlhbE1lbnVNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSByZWFkb25seSBzZXR0aW5nczogUmVhZG9ubHlEZWVwPFBsdWdpblNldHRpbmdzPjtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoYXBwOiBBcHAsIHNldHRpbmdzOiBSZWFkb25seURlZXA8UGx1Z2luU2V0dGluZ3M+KSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gIH1cblxuICBwdWJsaWMgb3ZlcnJpZGUgb25PcGVuKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgbW9kYWxFbCwgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoJ3F3LW1vZGFsJyk7XG4gICAgY29udGVudEVsLmFkZENsYXNzKCdxdy1jb250ZW50Jyk7XG5cbiAgICBjb25zdCBiZyA9IHRoaXMuY29udGFpbmVyRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tb2RhbC1iZycpO1xuICAgIGlmIChiZykge1xuICAgICAgYmcuc3R5bGUuc2V0UHJvcGVydHkoJ29wYWNpdHknLCAnMScpO1xuICAgICAgYmcuc3R5bGUuc2V0UHJvcGVydHkoJ2JhY2tncm91bmQnLCAncmdiYSgwLDAsMCwwLjUpJyk7XG4gICAgICBiZy5zdHlsZS5zZXRQcm9wZXJ0eSgnYmFja2Ryb3AtZmlsdGVyJywgJ2JsdXIoNnB4KScpO1xuICAgICAgYmcuc3R5bGUuc2V0UHJvcGVydHkoJy13ZWJraXQtYmFja2Ryb3AtZmlsdGVyJywgJ2JsdXIoNnB4KScpO1xuICAgIH1cblxuICAgIGNvbnN0IHcgPSBhY3RpdmVXaW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjb25zdCBoID0gYWN0aXZlV2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbih3LCBoKSAqIDAuODU7XG4gICAgY29uc3QgY3ggPSBzaXplIC8gMjtcbiAgICBjb25zdCBjeSA9IHNpemUgLyAyO1xuICAgIGNvbnN0IG91dGVyUiA9IHNpemUgLyAyIC0gODtcbiAgICBjb25zdCBpbm5lclIgPSBvdXRlclIgKiAwLjI4O1xuXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgJ3N2ZycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7c2l6ZX0gJHtzaXplfWApO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgU3RyaW5nKHNpemUpKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBTdHJpbmcoc2l6ZSkpO1xuICAgIHN2Zy5hZGRDbGFzcygncXctc3ZnJyk7XG5cbiAgICB0aGlzLnNldHRpbmdzLnNsaWNlcy5mb3JFYWNoKChzbGljZSwgaSkgPT4ge1xuICAgICAgY29uc3Qgc3BhbiA9IHNsaWNlLmVuZEFuZ2xlIC0gc2xpY2Uuc3RhcnRBbmdsZTtcbiAgICAgIGlmIChzcGFuIDw9IEdBUF9ERUcgKiAyKSByZXR1cm47XG4gICAgICBjb25zdCBnID0gdGhpcy5tYWtlU2xpY2VHcm91cChjeCwgY3ksIG91dGVyUiwgaW5uZXJSLCBzbGljZSwgaSk7XG4gICAgICBzdmcuYXBwZW5kQ2hpbGQoZyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBoYXNDYW5jZWxTbGljZSA9IHRoaXMuc2V0dGluZ3Muc2xpY2VzLnNvbWUoKHMpID0+IHMuYWN0aW9uID09PSAnY2FuY2VsJyk7XG4gICAgaWYgKCFoYXNDYW5jZWxTbGljZSkge1xuICAgICAgY29uc3QgY2VudGVyQmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHX05TLCAnY2lyY2xlJyk7XG4gICAgICBjZW50ZXJCZy5zZXRBdHRyaWJ1dGUoJ2N4JywgU3RyaW5nKGN4KSk7XG4gICAgICBjZW50ZXJCZy5zZXRBdHRyaWJ1dGUoJ2N5JywgU3RyaW5nKGN5KSk7XG4gICAgICBjZW50ZXJCZy5zZXRBdHRyaWJ1dGUoJ3InLCBTdHJpbmcoaW5uZXJSIC0gNCkpO1xuICAgICAgY2VudGVyQmcuYWRkQ2xhc3MoJ3F3LWNlbnRlcicpO1xuICAgICAgc3ZnLmFwcGVuZENoaWxkKGNlbnRlckJnKTtcblxuICAgICAgY29uc3QgY2VudGVyVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdfTlMsICd0ZXh0Jyk7XG4gICAgICBjZW50ZXJUZXh0LnNldEF0dHJpYnV0ZSgneCcsIFN0cmluZyhjeCkpO1xuICAgICAgY2VudGVyVGV4dC5zZXRBdHRyaWJ1dGUoJ3knLCBTdHJpbmcoY3kpKTtcbiAgICAgIGNlbnRlclRleHQuc2V0QXR0cmlidXRlKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKTtcbiAgICAgIGNlbnRlclRleHQuc2V0QXR0cmlidXRlKCdkb21pbmFudC1iYXNlbGluZScsICdtaWRkbGUnKTtcbiAgICAgIGNlbnRlclRleHQuYWRkQ2xhc3MoJ3F3LWNlbnRlci1pY29uJyk7XG4gICAgICBjZW50ZXJUZXh0LnRleHRDb250ZW50ID0gJ1x1MjcxNSc7XG4gICAgICBzdmcuYXBwZW5kQ2hpbGQoY2VudGVyVGV4dCk7XG5cbiAgICAgIGNvbnN0IGNsb3NlQ2VudGVyID0gKCk6IHZvaWQgPT4geyB0aGlzLmNsb3NlKCk7IH07XG4gICAgICBjZW50ZXJCZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlQ2VudGVyKTtcbiAgICAgIGNlbnRlclRleHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUNlbnRlcik7XG4gICAgfVxuXG4gICAgY29udGVudEVsLmFwcGVuZENoaWxkKHN2Zyk7XG5cbiAgICBtb2RhbEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gbW9kYWxFbCB8fCBlLnRhcmdldCA9PT0gY29udGVudEVsKSB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgc3ZnLmFkZENsYXNzKCdxdy1zdmctLW9wZW4nKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvdmVycmlkZSBvbkNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gIH1cblxuICBwcml2YXRlIG1ha2VTbGljZUdyb3VwKFxuICAgIGN4OiBudW1iZXIsIGN5OiBudW1iZXIsXG4gICAgb3V0ZXJSOiBudW1iZXIsIGlubmVyUjogbnVtYmVyLFxuICAgIHNsaWNlOiBSZWFkb25seURlZXA8U2xpY2VDb25maWc+LFxuICAgIGluZGV4OiBudW1iZXJcbiAgKTogU1ZHR0VsZW1lbnQge1xuICAgIGNvbnN0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHX05TLCAnZycpIGFzIFNWR0dFbGVtZW50O1xuICAgIGcuYWRkQ2xhc3MoJ3F3LXNsaWNlLWdyb3VwJyk7XG4gICAgZy5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1pJywgU3RyaW5nKGluZGV4KSk7XG5cbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgJ3BhdGgnKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIG1ha2VBcmNQYXRoKGN4LCBjeSwgb3V0ZXJSLCBpbm5lclIsIHNsaWNlLnN0YXJ0QW5nbGUsIHNsaWNlLmVuZEFuZ2xlKSk7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBzbGljZS5jb2xvcik7XG4gICAgcGF0aC5hZGRDbGFzcygncXctc2xpY2UnKTtcbiAgICBnLmFwcGVuZENoaWxkKHBhdGgpO1xuXG4gICAgY29uc3QgbWlkID0gKHNsaWNlLnN0YXJ0QW5nbGUgKyBzbGljZS5lbmRBbmdsZSkgLyAyO1xuICAgIGNvbnN0IGxhYmVsUiA9IChvdXRlclIgKyBpbm5lclIpIC8gMjtcbiAgICBjb25zdCBscCA9IHBvbGFyWFkoY3gsIGN5LCBsYWJlbFIsIG1pZCk7XG5cbiAgICAvLyBTY2FsZSBpY29uL2xhYmVsIG9mZnNldCB0byB0aGUgcmFkaWFsIGRlcHRoIHNvIHRoZXkgZG9uJ3Qgb3ZlcmxhcCBvbiBuYXJyb3cgc2xpY2VzXG4gICAgY29uc3QgZGVwdGggPSBvdXRlclIgLSBpbm5lclI7XG4gICAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5taW4oMTIsIGRlcHRoICogMC4yKTtcblxuICAgIGNvbnN0IGljb25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdfTlMsICd0ZXh0Jyk7XG4gICAgaWNvbkVsLnNldEF0dHJpYnV0ZSgneCcsIFN0cmluZyhscC54KSk7XG4gICAgaWNvbkVsLnNldEF0dHJpYnV0ZSgneScsIFN0cmluZyhscC55IC0gb2Zmc2V0KSk7XG4gICAgaWNvbkVsLnNldEF0dHJpYnV0ZSgndGV4dC1hbmNob3InLCAnbWlkZGxlJyk7XG4gICAgaWNvbkVsLnNldEF0dHJpYnV0ZSgnZG9taW5hbnQtYmFzZWxpbmUnLCAnbWlkZGxlJyk7XG4gICAgaWNvbkVsLmFkZENsYXNzKCdxdy1pY29uJyk7XG4gICAgaWNvbkVsLnRleHRDb250ZW50ID0gc2xpY2UuaWNvbjtcbiAgICBnLmFwcGVuZENoaWxkKGljb25FbCk7XG5cbiAgICAvLyBIaWRlIGxhYmVsIG9uIHNsaWNlcyBuYXJyb3dlciB0aGFuIDQ1XHUwMEIwIHRvIGF2b2lkIG92ZXJmbG93XG4gICAgY29uc3Qgc3BhbiA9IHNsaWNlLmVuZEFuZ2xlIC0gc2xpY2Uuc3RhcnRBbmdsZTtcbiAgICBpZiAoc3BhbiA+PSA0NSkge1xuICAgICAgY29uc3QgbGFiZWxFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdfTlMsICd0ZXh0Jyk7XG4gICAgICBsYWJlbEVsLnNldEF0dHJpYnV0ZSgneCcsIFN0cmluZyhscC54KSk7XG4gICAgICBsYWJlbEVsLnNldEF0dHJpYnV0ZSgneScsIFN0cmluZyhscC55ICsgb2Zmc2V0ICsgNCkpO1xuICAgICAgbGFiZWxFbC5zZXRBdHRyaWJ1dGUoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpO1xuICAgICAgbGFiZWxFbC5zZXRBdHRyaWJ1dGUoJ2RvbWluYW50LWJhc2VsaW5lJywgJ21pZGRsZScpO1xuICAgICAgbGFiZWxFbC5hZGRDbGFzcygncXctbGFiZWwnKTtcbiAgICAgIGxhYmVsRWwudGV4dENvbnRlbnQgPSBzbGljZS5sYWJlbDtcbiAgICAgIGcuYXBwZW5kQ2hpbGQobGFiZWxFbCk7XG4gICAgfVxuXG4gICAgZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgdm9pZCB0aGlzLmhhbmRsZVNsaWNlKHNsaWNlKTsgfSk7XG4gICAgcmV0dXJuIGc7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVNsaWNlKHNsaWNlOiBSZWFkb25seURlZXA8U2xpY2VDb25maWc+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jbG9zZSgpO1xuXG4gICAgc3dpdGNoIChzbGljZS5hY3Rpb24pIHtcbiAgICAgIGNhc2UgJ2NhbmNlbCc6XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdkYXNoYm9hcmQnOiB7XG4gICAgICAgIG5ldyBEYXNoYm9hcmRNb2RhbCh0aGlzLmFwcCwgdGhpcy5zZXR0aW5ncykub3BlbigpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnaG9tZXBhZ2UnOiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuc2V0dGluZ3MuaG9tZVBhdGg7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZUJ5UGF0aCh0YXJnZXQpO1xuICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TW9zdFJlY2VudExlYWYoKT8ub3BlbkZpbGUoZmlsZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHRoaXMuYXBwLmNvbW1hbmRzLmZpbmRDb21tYW5kKCdob21lcGFnZTpvcGVuJykpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwLmNvbW1hbmRzLmV4ZWN1dGVDb21tYW5kQnlJZCgnaG9tZXBhZ2U6b3BlbicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXcgTm90aWNlKCdObyBob21lIG5vdGUgY29uZmlndXJlZC4gU2V0IGEgcGF0aCBpbiBNb2JpbGUgUXVpY2sgV2lkZ2V0IHNldHRpbmdzLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgbmV3IE5vdGljZSgnTm8gaG9tZSBub3RlIGNvbmZpZ3VyZWQuIFNldCBhIHBhdGggaW4gTW9iaWxlIFF1aWNrIFdpZGdldCBzZXR0aW5ncy4nKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnbmV3LW5vdGUnOiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBjcmVhdGVOb3RlKHRoaXMuYXBwLCB0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldE1vc3RSZWNlbnRMZWFmKCk/Lm9wZW5GaWxlKGZpbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnY29tbWFuZCc6IHtcbiAgICAgICAgaWYgKHNsaWNlLmNvbW1hbmRJZCkge1xuICAgICAgICAgIHRoaXMuYXBwLmNvbW1hbmRzLmV4ZWN1dGVDb21tYW5kQnlJZChzbGljZS5jb21tYW5kSWQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQSBiYXNlIGNsYXNzIGZvciB0cmFuc2Zvcm1lcnMuXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBHZW5lcmljT2JqZWN0IH0gZnJvbSAnLi4vdHlwZS1ndWFyZHMudHMnO1xuXG5pbXBvcnQgeyBnZXRBbGxLZXlzIH0gZnJvbSAnLi4vb2JqZWN0LXV0aWxzLnRzJztcblxuLyoqXG4gKiBBIHdyYXBwZXIgZm9yIGEgdHJhbnNmb3JtZWQgdmFsdWUuXG4gKi9cbmludGVyZmFjZSBUcmFuc2Zvcm1lZFZhbHVlV3JhcHBlciB7XG4gIC8qKlxuICAgKiBBbiBpZCBvZiB0aGUgdHJhbnNmb3JtZXIgdGhhdCB0cmFuc2Zvcm1lZCB0aGUgdmFsdWUuXG4gICAqL1xuICBfX3RyYW5zZm9ybWVySWQ6IHN0cmluZztcblxuICAvKipcbiAgICogQSB0cmFuc2Zvcm1lZCB2YWx1ZS5cbiAgICovXG4gIHRyYW5zZm9ybWVkVmFsdWU6IHVua25vd247XG59XG5cbi8qKlxuICogQSBiYXNlIGNsYXNzIGZvciB0cmFuc2Zvcm1lcnMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUcmFuc2Zvcm1lciB7XG4gIC8qKlxuICAgKiBBbiBpZCBvZiB0aGUgdHJhbnNmb3JtZXIuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgZ2V0IGlkKCk6IHN0cmluZztcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgdHJhbnNmb3JtZXIgY2FuIHRyYW5zZm9ybSB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBBIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgdHJhbnNmb3JtZXIgY2FuIHRyYW5zZm9ybSB0aGUgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgY2FuVHJhbnNmb3JtKHZhbHVlOiB1bmtub3duLCBrZXk6IHN0cmluZyk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRyYW5zZm9ybWVyIHdpdGggdGhlIGdpdmVuIGlkLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhbnNmb3JtZXJJZCAtIFRoZSBpZCBvZiB0aGUgdHJhbnNmb3JtZXIgdG8gZ2V0LlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNmb3JtZXIgd2l0aCB0aGUgZ2l2ZW4gaWQuXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3ByZWZlci1yZXR1cm4tdGhpcy10eXBlIC0tIFRoZSBvdmVycmlkZGVuIG1ldGhvZCBtaWdodCByZXR1cm4gYSBkaWZmZXJlbnQgdHlwZS5cbiAgcHVibGljIGdldFRyYW5zZm9ybWVyKHRyYW5zZm9ybWVySWQ6IHN0cmluZyk6IFRyYW5zZm9ybWVyIHtcbiAgICBpZiAodHJhbnNmb3JtZXJJZCA9PT0gdGhpcy5pZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBUcmFuc2Zvcm1lciB3aXRoIGlkICR7dHJhbnNmb3JtZXJJZH0gbm90IGZvdW5kYCk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtcyB0aGUgZ2l2ZW4gb2JqZWN0IHJlY3Vyc2l2ZWx5LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gdHJhbnNmb3JtLlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNmb3JtZWQgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtT2JqZWN0UmVjdXJzaXZlbHkodmFsdWU6IG9iamVjdCk6IEdlbmVyaWNPYmplY3Qge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybVZhbHVlUmVjdXJzaXZlbHkodmFsdWUsICcnKSBhcyBHZW5lcmljT2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgdGhlIGdpdmVuIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gdHJhbnNmb3JtLlxuICAgKiBAcGFyYW0ga2V5IC0gVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gdHJhbnNmb3JtLlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNmb3JtZWQgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgdHJhbnNmb3JtVmFsdWUodmFsdWU6IHVua25vd24sIGtleTogc3RyaW5nKTogdW5rbm93bjtcblxuICAvKipcbiAgICogR2V0cyB0aGUgaWQgb2YgdGhlIHRyYW5zZm9ybWVyIHRoYXQgY2FuIHRyYW5zZm9ybSB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBnZXQgdGhlIHRyYW5zZm9ybWVyIGlkIGZvci5cbiAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldCB0aGUgdHJhbnNmb3JtZXIgaWQgZm9yLlxuICAgKiBAcmV0dXJucyBUaGUgaWQgb2YgdGhlIHRyYW5zZm9ybWVyIHRoYXQgY2FuIHRyYW5zZm9ybSB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VHJhbnNmb3JtZXJJZCh2YWx1ZTogdW5rbm93biwga2V5OiBzdHJpbmcpOiBudWxsIHwgc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jYW5UcmFuc2Zvcm0odmFsdWUsIGtleSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmlkO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RvcmVzIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHRyYW5zZm9ybWVkVmFsdWUgLSBUaGUgdmFsdWUgdG8gcmVzdG9yZS5cbiAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlc3RvcmUuXG4gICAqIEByZXR1cm5zIFRoZSByZXN0b3JlZCB2YWx1ZS5cbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZXN0b3JlVmFsdWUodHJhbnNmb3JtZWRWYWx1ZTogdW5rbm93biwga2V5OiBzdHJpbmcpOiB1bmtub3duO1xuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIHRoZSBnaXZlbiB2YWx1ZSByZWN1cnNpdmVseS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHRyYW5zZm9ybS5cbiAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHRyYW5zZm9ybS5cbiAgICogQHJldHVybnMgVGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSB0cmFuc2Zvcm1WYWx1ZVJlY3Vyc2l2ZWx5KHZhbHVlOiB1bmtub3duLCBrZXk6IHN0cmluZyk6IHVua25vd24ge1xuICAgIGNvbnN0IHRyYW5zZm9ybWVySWQgPSB0aGlzLmdldFRyYW5zZm9ybWVySWQodmFsdWUsIGtleSk7XG4gICAgaWYgKHRyYW5zZm9ybWVySWQpIHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVkVmFsdWUgPSB0aGlzLnRyYW5zZm9ybVZhbHVlKHZhbHVlLCBrZXkpO1xuICAgICAgaWYgKHRyYW5zZm9ybWVkVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB3cmFwcGVyOiBUcmFuc2Zvcm1lZFZhbHVlV3JhcHBlciA9IHtcbiAgICAgICAgX190cmFuc2Zvcm1lcklkOiB0cmFuc2Zvcm1lcklkLFxuICAgICAgICB0cmFuc2Zvcm1lZFZhbHVlXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWUubWFwKChjaGlsZFZhbHVlLCBpbmRleCkgPT4gdGhpcy50cmFuc2Zvcm1WYWx1ZVJlY3Vyc2l2ZWx5KGNoaWxkVmFsdWUsIFN0cmluZyhpbmRleCkpKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFuc2Zvcm1lZFZhbHVlV3JhcHBlciA9IHZhbHVlIGFzIFBhcnRpYWw8VHJhbnNmb3JtZWRWYWx1ZVdyYXBwZXI+O1xuICAgIGlmICh0cmFuc2Zvcm1lZFZhbHVlV3JhcHBlci5fX3RyYW5zZm9ybWVySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRyYW5zZm9ybWVyKHRyYW5zZm9ybWVkVmFsdWVXcmFwcGVyLl9fdHJhbnNmb3JtZXJJZCkucmVzdG9yZVZhbHVlKHRyYW5zZm9ybWVkVmFsdWVXcmFwcGVyLnRyYW5zZm9ybWVkVmFsdWUsIGtleSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkOiBHZW5lcmljT2JqZWN0ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkS2V5IG9mIGdldEFsbEtleXModmFsdWUpKSB7XG4gICAgICBjb25zdCBjaGlsZFZhbHVlID0gdmFsdWVbY2hpbGRLZXldO1xuICAgICAgY29uc3QgdHJhbnNmb3JtZWRDaGlsZFZhbHVlID0gdGhpcy50cmFuc2Zvcm1WYWx1ZVJlY3Vyc2l2ZWx5KGNoaWxkVmFsdWUsIGNoaWxkS2V5KTtcbiAgICAgIHJlY29yZFtjaGlsZEtleV0gPSB0cmFuc2Zvcm1lZENoaWxkVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQSBiYXNlIGNsYXNzIGZvciB0cmFuc2Zvcm1lcnMgdGhhdCBjYW4gdHJhbnNmb3JtIGFuZCByZXN0b3JlIGEgc3BlY2lmaWMgdHlwZS5cbiAqL1xuXG5pbXBvcnQgeyBUcmFuc2Zvcm1lciB9IGZyb20gJy4vdHJhbnNmb3JtZXIudHMnO1xuXG4vKipcbiAqIEEgdHJhbnNmb3JtZXIgdGhhdCBjYW4gdHJhbnNmb3JtIGFuZCByZXN0b3JlIGEgc3BlY2lmaWMgdHlwZS5cbiAqXG4gKiBAdHlwZVBhcmFtIFNvdXJjZSAtIFRoZSB0eXBlIG9mIHRoZSBzb3VyY2UgdmFsdWUuXG4gKiBAdHlwZVBhcmFtIFRyYW5zZm9ybWVkIC0gVGhlIHR5cGUgb2YgdGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVHlwZWRUcmFuc2Zvcm1lcjxTb3VyY2UsIFRyYW5zZm9ybWVkPiBleHRlbmRzIFRyYW5zZm9ybWVyIHtcbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhlIHRyYW5zZm9ybWVyIGNhbiB0cmFuc2Zvcm0gdGhlIGdpdmVuIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEBwYXJhbSBrZXkgLSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMgQSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIHRyYW5zZm9ybWVyIGNhbiB0cmFuc2Zvcm0gdGhlIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IG92ZXJyaWRlIGNhblRyYW5zZm9ybSh2YWx1ZTogdW5rbm93biwga2V5OiBzdHJpbmcpOiB2YWx1ZSBpcyBTb3VyY2U7XG5cbiAgLyoqXG4gICAqIFJlc3RvcmVzIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHRyYW5zZm9ybWVkVmFsdWUgLSBUaGUgdmFsdWUgdG8gcmVzdG9yZS5cbiAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlc3RvcmUuXG4gICAqIEByZXR1cm5zIFRoZSByZXN0b3JlZCB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBvdmVycmlkZSByZXN0b3JlVmFsdWUodHJhbnNmb3JtZWRWYWx1ZTogVHJhbnNmb3JtZWQsIGtleTogc3RyaW5nKTogU291cmNlO1xuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHRyYW5zZm9ybS5cbiAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHRyYW5zZm9ybS5cbiAgICogQHJldHVybnMgVGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IG92ZXJyaWRlIHRyYW5zZm9ybVZhbHVlKHZhbHVlOiBTb3VyY2UsIGtleTogc3RyaW5nKTogVHJhbnNmb3JtZWQ7XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBBIHRyYW5zZm9ybWVyIHRoYXQgY2FuIHRyYW5zZm9ybSBEYXRlIHRvIGFuIElTTyBzdHJpbmcgYW5kIGJhY2suXG4gKi9cblxuaW1wb3J0IHsgVHlwZWRUcmFuc2Zvcm1lciB9IGZyb20gJy4vdHlwZWQtdHJhbnNmb3JtZXIudHMnO1xuXG4vKipcbiAqIEEgdHJhbnNmb3JtZXIgdGhhdCBjYW4gdHJhbnNmb3JtIERhdGUgdG8gYW4gSVNPIHN0cmluZyBhbmQgYmFjay5cbiAqL1xuZXhwb3J0IGNsYXNzIERhdGVUcmFuc2Zvcm1lciBleHRlbmRzIFR5cGVkVHJhbnNmb3JtZXI8RGF0ZSwgc3RyaW5nPiB7XG4gIC8qKlxuICAgKiBBbiBpZCBvZiB0aGUgdHJhbnNmb3JtZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIGBkYXRlYC5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2RhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhlIHZhbHVlIGlzIGEgRGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBBIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgdmFsdWUgaXMgYSBEYXRlLlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIGNhblRyYW5zZm9ybSh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIERhdGUge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGU7XG4gIH1cblxuICAvKipcbiAgICogUmVzdG9yZXMgdGhlIHZhbHVlIGZyb20gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB0cmFuc2Zvcm1lZFZhbHVlIC0gVGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICAgKiBAcmV0dXJucyBUaGUgcmVzdG9yZWQgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgcmVzdG9yZVZhbHVlKHRyYW5zZm9ybWVkVmFsdWU6IHN0cmluZyk6IERhdGUge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0cmFuc2Zvcm1lZFZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIHRoZSB2YWx1ZSB0byBhIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHRyYW5zZm9ybS5cbiAgICogQHJldHVybnMgVGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIHRyYW5zZm9ybVZhbHVlKHZhbHVlOiBEYXRlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdmFsdWUudG9JU09TdHJpbmcoKTtcbiAgfVxufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQSB0cmFuc2Zvcm1lciB0aGF0IGNhbiB0cmFuc2Zvcm0gRHVyYXRpb24gdG8gYW4gSVNPIHN0cmluZyBhbmQgYmFjay5cbiAqL1xuXG5pbXBvcnQgeyBtb21lbnQgfSBmcm9tICdvYnNpZGlhbic7XG5cbmltcG9ydCB7IFR5cGVkVHJhbnNmb3JtZXIgfSBmcm9tICcuL3R5cGVkLXRyYW5zZm9ybWVyLnRzJztcblxuLyoqXG4gKiBBIHRyYW5zZm9ybWVyIHRoYXQgY29udmVydHMgYSBEdXJhdGlvbiB0byBhbiBJU08gc3RyaW5nIGFuZCBiYWNrLlxuICovXG5leHBvcnQgY2xhc3MgRHVyYXRpb25UcmFuc2Zvcm1lciBleHRlbmRzIFR5cGVkVHJhbnNmb3JtZXI8bW9tZW50LkR1cmF0aW9uLCBzdHJpbmc+IHtcbiAgLyoqXG4gICAqIEFuIGlkIG9mIHRoZSB0cmFuc2Zvcm1lci5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGlkIG9mIHRoZSB0cmFuc2Zvcm1lci5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2R1cmF0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgRHVyYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZSBpcyBhIER1cmF0aW9uLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSBjYW5UcmFuc2Zvcm0odmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBtb21lbnQuRHVyYXRpb24ge1xuICAgIGNvbnN0IG1heWJlRHVyYXRpb24gPSAodmFsdWUgPz8ge30pIGFzIFBhcnRpYWw8bW9tZW50LkR1cmF0aW9uPjtcbiAgICByZXR1cm4gISFtYXliZUR1cmF0aW9uLmFzSG91cnMgJiYgISFtYXliZUR1cmF0aW9uLmFzTWludXRlcyAmJiAhIW1heWJlRHVyYXRpb24uYXNTZWNvbmRzICYmICEhbWF5YmVEdXJhdGlvbi5hc01pbGxpc2Vjb25kcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlcyB0aGUgdmFsdWUgZnJvbSBhIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHRyYW5zZm9ybWVkVmFsdWUgLSBUaGUgc3RyaW5nIHRvIHJlc3RvcmUgdGhlIHZhbHVlIGZyb20uXG4gICAqIEByZXR1cm5zIFRoZSByZXN0b3JlZCB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSByZXN0b3JlVmFsdWUodHJhbnNmb3JtZWRWYWx1ZTogc3RyaW5nKTogbW9tZW50LkR1cmF0aW9uIHtcbiAgICByZXR1cm4gbW9tZW50LmR1cmF0aW9uKHRyYW5zZm9ybWVkVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgdGhlIHZhbHVlIHRvIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gdHJhbnNmb3JtLlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNmb3JtZWQgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgdHJhbnNmb3JtVmFsdWUodmFsdWU6IG1vbWVudC5EdXJhdGlvbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIEEgdHJhbnNmb3JtZXIgdGhhdCBjb21iaW5lcyBtdWx0aXBsZSB0cmFuc2Zvcm1lcnMuXG4gKi9cblxuaW1wb3J0IHtcbiAgYXNzZXJ0Tm9uTnVsbGFibGUsXG4gIGVuc3VyZU5vbk51bGxhYmxlXG59IGZyb20gJy4uL3R5cGUtZ3VhcmRzLnRzJztcbmltcG9ydCB7IFRyYW5zZm9ybWVyIH0gZnJvbSAnLi90cmFuc2Zvcm1lci50cyc7XG5cbi8qKlxuICogQSB0cmFuc2Zvcm1lciB0aGF0IGNvbWJpbmVzIG11bHRpcGxlIHRyYW5zZm9ybWVycy5cbiAqL1xuZXhwb3J0IGNsYXNzIEdyb3VwVHJhbnNmb3JtZXIgZXh0ZW5kcyBUcmFuc2Zvcm1lciB7XG4gIC8qKlxuICAgKiBBbiBpZCBvZiB0aGUgdHJhbnNmb3JtZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIGBncm91cGAuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdncm91cCc7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtZXJzIHRvIGNvbWJpbmUuXG4gICAqXG4gICAqIEBwYXJhbSB0cmFuc2Zvcm1lcnMgLSBUaGUgdHJhbnNmb3JtZXJzIHRvIGNvbWJpbmUuXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB0cmFuc2Zvcm1lcnM6IFRyYW5zZm9ybWVyW10pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhlIHZhbHVlIGNhbiBiZSB0cmFuc2Zvcm1lZCBieSBhbnkgb2YgdGhlIHRyYW5zZm9ybWVycy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcGFyYW0ga2V5IC0gVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIEEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSB2YWx1ZSBjYW4gYmUgdHJhbnNmb3JtZWQuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgY2FuVHJhbnNmb3JtKHZhbHVlOiB1bmtub3duLCBrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldEZpcnN0VHJhbnNmb3JtZXJUaGF0Q2FuVHJhbnNmb3JtKHZhbHVlLCBrZXkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRyYW5zZm9ybWVyIHdpdGggdGhlIGdpdmVuIGlkLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhbnNmb3JtZXJJZCAtIFRoZSBpZCBvZiB0aGUgdHJhbnNmb3JtZXIgdG8gZ2V0LlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNmb3JtZXIgd2l0aCB0aGUgZ2l2ZW4gaWQuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgZ2V0VHJhbnNmb3JtZXIodHJhbnNmb3JtZXJJZDogc3RyaW5nKTogVHJhbnNmb3JtZXIge1xuICAgIHJldHVybiBlbnN1cmVOb25OdWxsYWJsZSh0aGlzLnRyYW5zZm9ybWVycy5maW5kKCh0KSA9PiB0LmlkID09PSB0cmFuc2Zvcm1lcklkKSwgYE5vIHRyYW5zZm9ybWVyIHdpdGggaWQgJHt0cmFuc2Zvcm1lcklkfSBmb3VuZGApO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgdGhlIHZhbHVlIHVzaW5nIHRoZSBmaXJzdCB0cmFuc2Zvcm1lciB0aGF0IGNhbiB0cmFuc2Zvcm0gaXQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byB0cmFuc2Zvcm0uXG4gICAqIEBwYXJhbSBrZXkgLSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byB0cmFuc2Zvcm0uXG4gICAqIEByZXR1cm5zIFRoZSB0cmFuc2Zvcm1lZCB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSB0cmFuc2Zvcm1WYWx1ZSh2YWx1ZTogdW5rbm93biwga2V5OiBzdHJpbmcpOiB1bmtub3duIHtcbiAgICBjb25zdCB0cmFuc2Zvcm1lciA9IHRoaXMuZ2V0Rmlyc3RUcmFuc2Zvcm1lclRoYXRDYW5UcmFuc2Zvcm0odmFsdWUsIGtleSk7XG4gICAgYXNzZXJ0Tm9uTnVsbGFibGUodHJhbnNmb3JtZXIsICdObyB0cmFuc2Zvcm1lciBjYW4gdHJhbnNmb3JtIHRoZSB2YWx1ZScpO1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyLnRyYW5zZm9ybVZhbHVlKHZhbHVlLCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGlkIG9mIHRoZSB0cmFuc2Zvcm1lciB0aGF0IGNhbiB0cmFuc2Zvcm0gdGhlIGdpdmVuIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gZ2V0IHRoZSB0cmFuc2Zvcm1lciBpZCBmb3IuXG4gICAqIEBwYXJhbSBrZXkgLSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQgdGhlIHRyYW5zZm9ybWVyIGlkIGZvci5cbiAgICogQHJldHVybnMgVGhlIGlkIG9mIHRoZSB0cmFuc2Zvcm1lciB0aGF0IGNhbiB0cmFuc2Zvcm0gdGhlIGdpdmVuIHZhbHVlLlxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldFRyYW5zZm9ybWVySWQodmFsdWU6IHVua25vd24sIGtleTogc3RyaW5nKTogbnVsbCB8IHN0cmluZyB7XG4gICAgY29uc3QgdHJhbnNmb3JtZXIgPSB0aGlzLmdldEZpcnN0VHJhbnNmb3JtZXJUaGF0Q2FuVHJhbnNmb3JtKHZhbHVlLCBrZXkpO1xuICAgIGlmICh0cmFuc2Zvcm1lciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyLmlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgdHJhbnNmb3JtZXIgZG9lcyBub3Qgc3VwcG9ydCByZXN0b3JpbmcgdmFsdWVzLlxuICAgKlxuICAgKiBAdGhyb3dzXG4gICAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVzdG9yZVZhbHVlKCk6IG5ldmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0dyb3VwVHJhbnNmb3JtZXIgZG9lcyBub3Qgc3VwcG9ydCByZXN0b3JpbmcgdmFsdWVzJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZmlyc3QgdHJhbnNmb3JtZXIgdGhhdCBjYW4gdHJhbnNmb3JtIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGdldCB0aGUgZmlyc3QgdHJhbnNmb3JtZXIgZm9yLlxuICAgKiBAcGFyYW0ga2V5IC0gVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0IHRoZSBmaXJzdCB0cmFuc2Zvcm1lciBmb3IuXG4gICAqIEByZXR1cm5zIFRoZSBmaXJzdCB0cmFuc2Zvcm1lciB0aGF0IGNhbiB0cmFuc2Zvcm0gdGhlIGdpdmVuIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRGaXJzdFRyYW5zZm9ybWVyVGhhdENhblRyYW5zZm9ybSh2YWx1ZTogdW5rbm93biwga2V5OiBzdHJpbmcpOiBudWxsIHwgVHJhbnNmb3JtZXIge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWVycy5maW5kKCh0KSA9PiB0LmNhblRyYW5zZm9ybSh2YWx1ZSwga2V5KSkgPz8gbnVsbDtcbiAgfVxufVxuIiwgIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogQSB0cmFuc2Zvcm1lciB0aGF0IGNhbiB0cmFuc2Zvcm0gYSBNYXAgdG8gYW4gYXJyYXkgb2YgZW50cmllcyBhbmQgYmFjay5cbiAqL1xuXG5pbXBvcnQgeyBUeXBlZFRyYW5zZm9ybWVyIH0gZnJvbSAnLi90eXBlZC10cmFuc2Zvcm1lci50cyc7XG5cbnR5cGUgTWFwRW50cnkgPSByZWFkb25seSBba2V5OiB1bmtub3duLCB2YWx1ZTogdW5rbm93bl07XG5cbi8qKlxuICogQSB0cmFuc2Zvcm1lciB0aGF0IGNhbiB0cmFuc2Zvcm0gYSBNYXAgdG8gYW4gYXJyYXkgb2YgZW50cmllcyBhbmQgYmFjay5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hcFRyYW5zZm9ybWVyIGV4dGVuZHMgVHlwZWRUcmFuc2Zvcm1lcjxNYXA8dW5rbm93biwgdW5rbm93bj4sIE1hcEVudHJ5W10+IHtcbiAgLyoqXG4gICAqIEFuIGlkIG9mIHRoZSB0cmFuc2Zvcm1lci5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIElEIG9mIHRoZSB0cmFuc2Zvcm1lci5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ21hcCc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIE1hcC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlIGlzIGEgTWFwLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSBjYW5UcmFuc2Zvcm0odmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBNYXA8dW5rbm93biwgdW5rbm93bj4ge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIE1hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlcyB0aGUgdmFsdWUgZnJvbSBhbiBhcnJheSBvZiBlbnRyaWVzLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhbnNmb3JtZWRWYWx1ZSAtIFRoZSBhcnJheSBvZiBlbnRyaWVzIHRvIHJlc3RvcmUgdGhlIHZhbHVlIGZyb20uXG4gICAqIEByZXR1cm5zIFRoZSByZXN0b3JlZCB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSByZXN0b3JlVmFsdWUodHJhbnNmb3JtZWRWYWx1ZTogTWFwRW50cnlbXSk6IE1hcDx1bmtub3duLCB1bmtub3duPiB7XG4gICAgcmV0dXJuIG5ldyBNYXA8dW5rbm93biwgdW5rbm93bj4odHJhbnNmb3JtZWRWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtcyB0aGUgdmFsdWUgdG8gYW4gYXJyYXkgb2YgZW50cmllcy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHRyYW5zZm9ybS5cbiAgICogQHJldHVybnMgVGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIHRyYW5zZm9ybVZhbHVlKHZhbHVlOiBNYXA8dW5rbm93biwgdW5rbm93bj4pOiBNYXBFbnRyeVtdIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh2YWx1ZS5lbnRyaWVzKCkpO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBBIHRyYW5zZm9ybWVyIHRoYXQgY2FuIHRyYW5zZm9ybSBhIFNldCB0byBhbiBhcnJheSBhbmQgYmFjay5cbiAqL1xuXG5pbXBvcnQgeyBUeXBlZFRyYW5zZm9ybWVyIH0gZnJvbSAnLi90eXBlZC10cmFuc2Zvcm1lci50cyc7XG5cbi8qKlxuICogQSB0cmFuc2Zvcm1lciB0aGF0IGNhbiB0cmFuc2Zvcm0gYSBTZXQgdG8gYW4gYXJyYXkgYW5kIGJhY2suXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXRUcmFuc2Zvcm1lciBleHRlbmRzIFR5cGVkVHJhbnNmb3JtZXI8U2V0PHVua25vd24+LCB1bmtub3duW10+IHtcbiAgLyoqXG4gICAqIEFuIGlkIG9mIHRoZSB0cmFuc2Zvcm1lci5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIElEIG9mIHRoZSB0cmFuc2Zvcm1lci5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ3NldCc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIFNldC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlIGlzIGEgU2V0LCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSBjYW5UcmFuc2Zvcm0odmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTZXQ8dW5rbm93bj4ge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlcyB0aGUgdmFsdWUgZnJvbSBhbiBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHRyYW5zZm9ybWVkVmFsdWUgLSBUaGUgYXJyYXkgdG8gcmVzdG9yZSB0aGUgdmFsdWUgZnJvbS5cbiAgICogQHJldHVybnMgVGhlIHJlc3RvcmVkIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIHJlc3RvcmVWYWx1ZSh0cmFuc2Zvcm1lZFZhbHVlOiB1bmtub3duW10pOiBTZXQ8dW5rbm93bj4ge1xuICAgIHJldHVybiBuZXcgU2V0KHRyYW5zZm9ybWVkVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgdGhlIHZhbHVlIHRvIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gdHJhbnNmb3JtLlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNmb3JtZWQgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgdHJhbnNmb3JtVmFsdWUodmFsdWU6IFNldDx1bmtub3duPik6IHVua25vd25bXSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odmFsdWUpO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBBIHRyYW5zZm9ybWVyIHRoYXQgc2tpcHMgcHJpdmF0ZSBwcm9wZXJ0aWVzLlxuICovXG5cbmltcG9ydCB7IFRyYW5zZm9ybWVyIH0gZnJvbSAnLi90cmFuc2Zvcm1lci50cyc7XG5cbmNvbnN0IFBSSVZBVEVfUFJPUEVSVFlfUFJFRklYID0gJ18nO1xuXG4vKipcbiAqIEEgdHJhbnNmb3JtZXIgdGhhdCBza2lwcyBwcml2YXRlIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTa2lwUHJpdmF0ZVByb3BlcnR5VHJhbnNmb3JtZXIgZXh0ZW5kcyBUcmFuc2Zvcm1lciB7XG4gIC8qKlxuICAgKiBBbiBpZCBvZiB0aGUgdHJhbnNmb3JtZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIGBza2lwLXByaXZhdGUtcHJvcGVydHlgLlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIGdldCBpZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnc2tpcC1wcml2YXRlLXByb3BlcnR5JztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSB0cmFuc2Zvcm1lciBjYW4gdHJhbnNmb3JtIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIF92YWx1ZSAtIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBBIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgdHJhbnNmb3JtZXIgY2FuIHRyYW5zZm9ybSB0aGUgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgY2FuVHJhbnNmb3JtKF92YWx1ZTogdW5rbm93biwga2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoUFJJVkFURV9QUk9QRVJUWV9QUkVGSVgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgdGhlIGdpdmVuIHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNmb3JtZWQgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgdHJhbnNmb3JtVmFsdWUoKTogdW5rbm93biB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlcyB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVzdG9yZVZhbHVlKCk6IHVua25vd24ge1xuICAgIHRocm93IG5ldyBFcnJvcignU2tpcFByaXZhdGVQcm9wZXJ0eVRyYW5zZm9ybWVyIGRvZXMgbm90IHN1cHBvcnQgcmVzdG9yaW5nIHZhbHVlcycpO1xuICB9XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBUd28td2F5IG1hcC5cbiAqL1xuXG4vKipcbiAqIEEgbWFwIHRoYXQgYWxsb3dzIHlvdSB0byBsb29rIHVwIGEgdmFsdWUgYnkgaXRzIGtleSBhbmQgdmljZSB2ZXJzYS5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgdHNcbiAqIGNvbnN0IG1hcCA9IG5ldyBUd29XYXlNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gKiBtYXAuc2V0KCdmb28nLCA0Mik7XG4gKiBtYXAuZ2V0VmFsdWUoJ2ZvbycpOyAvLyA0MlxuICogbWFwLmdldEtleSg0Mik7IC8vICdmb28nXG4gKiBtYXAuZGVsZXRlS2V5KCdmb28nKTtcbiAqIG1hcC5kZWxldGVWYWx1ZSg0Mik7XG4gKiBtYXAuY2xlYXIoKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgVHdvV2F5TWFwPEtleSwgVmFsdWU+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBrZXlWYWx1ZU1hcCA9IG5ldyBNYXA8S2V5LCBWYWx1ZT4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSB2YWx1ZUtleU1hcCA9IG5ldyBNYXA8VmFsdWUsIEtleT4oKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyB0d28td2F5IG1hcC5cbiAgICpcbiAgICogQHBhcmFtIGVudHJpZXMgLSBFbnRyaWVzIHRvIGluaXRpYWxpemUgdGhlIG1hcCB3aXRoLlxuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKGVudHJpZXM6IChyZWFkb25seSBba2V5OiBLZXksIHZhbHVlOiBWYWx1ZV0pW10gPSBbXSkge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGVudHJpZXMpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIG1hcC5cbiAgICovXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICB0aGlzLmtleVZhbHVlTWFwLmNsZWFyKCk7XG4gICAgdGhpcy52YWx1ZUtleU1hcC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYSBrZXkgZnJvbSB0aGUgbWFwLlxuICAgKlxuICAgKiBAcGFyYW0ga2V5IC0gVGhlIGtleS5cbiAgICovXG4gIHB1YmxpYyBkZWxldGVLZXkoa2V5OiBLZXkpOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoa2V5KTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy52YWx1ZUtleU1hcC5kZWxldGUodmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLmtleVZhbHVlTWFwLmRlbGV0ZShrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYSB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyBkZWxldGVWYWx1ZSh2YWx1ZTogVmFsdWUpOiB2b2lkIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleSh2YWx1ZSk7XG4gICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmtleVZhbHVlTWFwLmRlbGV0ZShrZXkpO1xuICAgIH1cbiAgICB0aGlzLnZhbHVlS2V5TWFwLmRlbGV0ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbGwgZW50cmllcyBpbiB0aGUgbWFwLlxuICAgKlxuICAgKiBAcmV0dXJucyBBbiBpdGVyYXRvciBvdmVyIGFsbCBlbnRyaWVzIGluIHRoZSBtYXAuXG4gICAqL1xuICBwdWJsaWMgZW50cmllcygpOiBJdGVyYWJsZUl0ZXJhdG9yPHJlYWRvbmx5IFtrZXk6IEtleSwgdmFsdWU6IFZhbHVlXT4ge1xuICAgIHJldHVybiB0aGlzLmtleVZhbHVlTWFwLmVudHJpZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEga2V5IGJ5IGl0cyB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlLlxuICAgKiBAcmV0dXJucyBUaGUga2V5LlxuICAgKi9cbiAgcHVibGljIGdldEtleSh2YWx1ZTogVmFsdWUpOiBLZXkgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnZhbHVlS2V5TWFwLmdldCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHZhbHVlIGJ5IGl0cyBrZXkuXG4gICAqXG4gICAqIEBwYXJhbSBrZXkgLSBUaGUga2V5LlxuICAgKiBAcmV0dXJucyBUaGUgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgZ2V0VmFsdWUoa2V5OiBLZXkpOiB1bmRlZmluZWQgfCBWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMua2V5VmFsdWVNYXAuZ2V0KGtleSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBtYXAgaGFzIGEga2V5LlxuICAgKlxuICAgKiBAcGFyYW0ga2V5IC0gVGhlIGtleS5cbiAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBtYXAgaGFzIHRoZSBrZXksIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcHVibGljIGhhc0tleShrZXk6IEtleSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmtleVZhbHVlTWFwLmhhcyhrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgbWFwIGhhcyBhIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUuXG4gICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbWFwIGhhcyB0aGUgdmFsdWUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcHVibGljIGhhc1ZhbHVlKHZhbHVlOiBWYWx1ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnZhbHVlS2V5TWFwLmhhcyh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbGwga2V5cyBpbiB0aGUgbWFwLlxuICAgKlxuICAgKiBAcmV0dXJucyBBbiBpdGVyYXRvciBvdmVyIGFsbCBrZXlzIGluIHRoZSBtYXAuXG4gICAqL1xuICBwdWJsaWMga2V5cygpOiBJdGVyYWJsZUl0ZXJhdG9yPEtleT4ge1xuICAgIHJldHVybiB0aGlzLmtleVZhbHVlTWFwLmtleXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEga2V5LXZhbHVlIHBhaXIgaW4gdGhlIG1hcC5cbiAgICpcbiAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkuXG4gICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyBzZXQoa2V5OiBLZXksIHZhbHVlOiBWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMuZGVsZXRlS2V5KGtleSk7XG4gICAgdGhpcy5kZWxldGVWYWx1ZSh2YWx1ZSk7XG5cbiAgICB0aGlzLmtleVZhbHVlTWFwLnNldChrZXksIHZhbHVlKTtcbiAgICB0aGlzLnZhbHVlS2V5TWFwLnNldCh2YWx1ZSwga2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFsbCB2YWx1ZXMgaW4gdGhlIG1hcC5cbiAgICpcbiAgICogQHJldHVybnMgQW4gaXRlcmF0b3Igb3ZlciBhbGwgdmFsdWVzIGluIHRoZSBtYXAuXG4gICAqL1xuICBwdWJsaWMgdmFsdWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8VmFsdWU+IHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZUtleU1hcC5rZXlzKCk7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIEEgdHJhbnNmb3JtZXIgdGhhdCBjYW4gdHJhbnNmb3JtIGEgVHdvV2F5TWFwIHRvIGFuIGFycmF5IG9mIGVudHJpZXMgYW5kIGJhY2suXG4gKi9cblxuaW1wb3J0IHsgVHdvV2F5TWFwIH0gZnJvbSAnLi4vdHdvLXdheS1tYXAudHMnO1xuaW1wb3J0IHsgVHlwZWRUcmFuc2Zvcm1lciB9IGZyb20gJy4vdHlwZWQtdHJhbnNmb3JtZXIudHMnO1xuXG50eXBlIE1hcEVudHJ5ID0gcmVhZG9ubHkgW2tleTogdW5rbm93biwgdmFsdWU6IHVua25vd25dO1xuXG4vKipcbiAqIEEgdHJhbnNmb3JtZXIgdGhhdCBjYW4gdHJhbnNmb3JtIGEgVHdvV2F5TWFwIHRvIGFuIGFycmF5IG9mIGVudHJpZXMgYW5kIGJhY2suXG4gKi9cbmV4cG9ydCBjbGFzcyBUd29XYXlNYXBUcmFuc2Zvcm1lciBleHRlbmRzIFR5cGVkVHJhbnNmb3JtZXI8VHdvV2F5TWFwPHVua25vd24sIHVua25vd24+LCBNYXBFbnRyeVtdPiB7XG4gIC8qKlxuICAgKiBHZXRzIHRoZSBJRCBvZiB0aGUgdHJhbnNmb3JtZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBJRCBvZiB0aGUgdHJhbnNmb3JtZXIuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICd0d28td2F5LW1hcCc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIFR3b1dheU1hcC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlIGlzIGEgVHdvV2F5TWFwLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSBjYW5UcmFuc2Zvcm0odmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBUd29XYXlNYXA8dW5rbm93biwgdW5rbm93bj4ge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFR3b1dheU1hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlcyBhIFR3b1dheU1hcCBmcm9tIGFuIGFycmF5IG9mIGVudHJpZXMuXG4gICAqXG4gICAqIEBwYXJhbSB0cmFuc2Zvcm1lZFZhbHVlIC0gVGhlIGFycmF5IG9mIGVudHJpZXMuXG4gICAqIEByZXR1cm5zIFRoZSBUd29XYXlNYXAuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgcmVzdG9yZVZhbHVlKHRyYW5zZm9ybWVkVmFsdWU6IE1hcEVudHJ5W10pOiBUd29XYXlNYXA8dW5rbm93biwgdW5rbm93bj4ge1xuICAgIHJldHVybiBuZXcgVHdvV2F5TWFwPHVua25vd24sIHVua25vd24+KHRyYW5zZm9ybWVkVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgYSBUd29XYXlNYXAgdG8gYW4gYXJyYXkgb2YgZW50cmllcy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIFR3b1dheU1hcC5cbiAgICogQHJldHVybnMgVGhlIGFycmF5IG9mIGVudHJpZXMuXG4gICAqL1xuICBwdWJsaWMgb3ZlcnJpZGUgdHJhbnNmb3JtVmFsdWUodmFsdWU6IFR3b1dheU1hcDx1bmtub3duLCB1bmtub3duPik6IE1hcEVudHJ5W10ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHZhbHVlLmVudHJpZXMoKSk7XG4gIH1cbn1cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIFBsdWdpbiBzZXR0aW5ncyBtYW5hZ2VyIGJhc2UgY2xhc3MuXG4gKi9cblxuLyogdjggaWdub3JlIHN0YXJ0IC0tIERlZXBseSBjb3VwbGVkIHRvIE9ic2lkaWFuIHJ1bnRpbWU7IHJlcXVpcmVzIHJ1bm5pbmcgdmF1bHQgZm9yIG1lYW5pbmdmdWwgdGVzdGluZy4gKi9cblxuaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7XG4gIFByb21pc2FibGUsXG4gIFJlYWRvbmx5RGVlcFxufSBmcm9tICd0eXBlLWZlc3QnO1xuXG5pbXBvcnQgdHlwZSB7IEFzeW5jRXZlbnRSZWYgfSBmcm9tICcuLi8uLi9hc3luYy1ldmVudHMudHMnO1xuaW1wb3J0IHR5cGUgeyBUcmFuc2Zvcm1lciB9IGZyb20gJy4uLy4uL3RyYW5zZm9ybWVycy90cmFuc2Zvcm1lci50cyc7XG5pbXBvcnQgdHlwZSB7IEdlbmVyaWNPYmplY3QgfSBmcm9tICcuLi8uLi90eXBlLWd1YXJkcy50cyc7XG5pbXBvcnQgdHlwZSB7XG4gIE1heWJlUmV0dXJuLFxuICBTdHJpbmdLZXlzXG59IGZyb20gJy4uLy4uL3R5cGUudHMnO1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5TZXR0aW5nc1dyYXBwZXIgfSBmcm9tICcuL3BsdWdpbi1zZXR0aW5ncy13cmFwcGVyLnRzJztcbmltcG9ydCB0eXBlIHtcbiAgRXh0cmFjdFBsdWdpbixcbiAgRXh0cmFjdFBsdWdpblNldHRpbmdzLFxuICBFeHRyYWN0UGx1Z2luU2V0dGluZ3NQcm9wZXJ0eU5hbWVzLFxuICBFeHRyYWN0UGx1Z2luU2V0dGluZ3NQcm9wZXJ0eVZhbHVlcyxcbiAgRXh0cmFjdFBsdWdpblNldHRpbmdzV3JhcHBlcixcbiAgRXh0cmFjdFJlYWRvbmx5UGx1Z2luU2V0dGluZ3NXcmFwcGVyLFxuICBQbHVnaW5UeXBlc0Jhc2Vcbn0gZnJvbSAnLi9wbHVnaW4tdHlwZXMtYmFzZS50cyc7XG5cbmltcG9ydCB7IEFzeW5jRXZlbnRzIH0gZnJvbSAnLi4vLi4vYXN5bmMtZXZlbnRzLnRzJztcbmltcG9ydCB7IGdldExpYkRlYnVnZ2VyIH0gZnJvbSAnLi4vLi4vZGVidWcudHMnO1xuaW1wb3J0IHtcbiAgbm9vcCxcbiAgbm9vcEFzeW5jXG59IGZyb20gJy4uLy4uL2Z1bmN0aW9uLnRzJztcbmltcG9ydCB7XG4gIGNhc3RUbyxcbiAgZGVlcEVxdWFsLFxuICBnZXRBbGxLZXlzXG59IGZyb20gJy4uLy4uL29iamVjdC11dGlscy50cyc7XG5pbXBvcnQgeyBEYXRlVHJhbnNmb3JtZXIgfSBmcm9tICcuLi8uLi90cmFuc2Zvcm1lcnMvZGF0ZS10cmFuc2Zvcm1lci50cyc7XG5pbXBvcnQgeyBEdXJhdGlvblRyYW5zZm9ybWVyIH0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtZXJzL2R1cmF0aW9uLXRyYW5zZm9ybWVyLnRzJztcbmltcG9ydCB7IEdyb3VwVHJhbnNmb3JtZXIgfSBmcm9tICcuLi8uLi90cmFuc2Zvcm1lcnMvZ3JvdXAtdHJhbnNmb3JtZXIudHMnO1xuaW1wb3J0IHsgTWFwVHJhbnNmb3JtZXIgfSBmcm9tICcuLi8uLi90cmFuc2Zvcm1lcnMvbWFwLXRyYW5zZm9ybWVyLnRzJztcbmltcG9ydCB7IFNldFRyYW5zZm9ybWVyIH0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtZXJzL3NldC10cmFuc2Zvcm1lci50cyc7XG5pbXBvcnQgeyBTa2lwUHJpdmF0ZVByb3BlcnR5VHJhbnNmb3JtZXIgfSBmcm9tICcuLi8uLi90cmFuc2Zvcm1lcnMvc2tpcC1wcml2YXRlLXByb3BlcnR5LXRyYW5zZm9ybWVyLnRzJztcbmltcG9ydCB7IFR3b1dheU1hcFRyYW5zZm9ybWVyIH0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtZXJzL3R3by13YXktbWFwLXRyYW5zZm9ybWVyLnRzJztcblxuY29uc3QgZGVmYXVsdFRyYW5zZm9ybWVyID0gbmV3IEdyb3VwVHJhbnNmb3JtZXIoW1xuICBuZXcgU2tpcFByaXZhdGVQcm9wZXJ0eVRyYW5zZm9ybWVyKCksXG4gIG5ldyBEYXRlVHJhbnNmb3JtZXIoKSxcbiAgbmV3IER1cmF0aW9uVHJhbnNmb3JtZXIoKSxcbiAgbmV3IE1hcFRyYW5zZm9ybWVyKCksXG4gIG5ldyBTZXRUcmFuc2Zvcm1lcigpLFxuICBuZXcgVHdvV2F5TWFwVHJhbnNmb3JtZXIoKVxuXSk7XG5cbnR5cGUgVmFsaWRhdGlvblJlc3VsdDxQbHVnaW5TZXR0aW5ncyBleHRlbmRzIG9iamVjdD4gPSBQYXJ0aWFsPFJlY29yZDxTdHJpbmdLZXlzPFBsdWdpblNldHRpbmdzPiwgc3RyaW5nPj47XG5cbnR5cGUgVmFsaWRhdG9yPFBsdWdpblNldHRpbmdzIGV4dGVuZHMgb2JqZWN0LCBQcm9wZXJ0eU5hbWUgZXh0ZW5kcyBTdHJpbmdLZXlzPFBsdWdpblNldHRpbmdzPiA9IFN0cmluZ0tleXM8UGx1Z2luU2V0dGluZ3M+PiA9IChcbiAgdmFsdWU6IFBsdWdpblNldHRpbmdzW1Byb3BlcnR5TmFtZV0sXG4gIHNldHRpbmdzOiBQbHVnaW5TZXR0aW5nc1xuKSA9PiBQcm9taXNhYmxlPE1heWJlUmV0dXJuPHN0cmluZz4+O1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIG1hbmFnaW5nIHBsdWdpbiBzZXR0aW5ncy5cbiAqXG4gKiBAdHlwZVBhcmFtIFBsdWdpblR5cGVzIC0gUGx1Z2luLXNwZWNpZmljIHR5cGVzLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGx1Z2luU2V0dGluZ3NNYW5hZ2VyQmFzZTxQbHVnaW5UeXBlcyBleHRlbmRzIFBsdWdpblR5cGVzQmFzZT4gZXh0ZW5kcyBBc3luY0V2ZW50cyB7XG4gIC8qKlxuICAgKiBHZXRzIHRoZSBhcHAuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBhcHAuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXBwOiBBcHA7XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJlYWRvbmx5IGRlZmF1bHQgc2V0dGluZ3MuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBkZWZhdWx0IHNldHRpbmdzIChhcyBhIHJlYWRvbmx5IG9iamVjdCkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdFNldHRpbmdzOiBSZWFkb25seURlZXA8RXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPj47XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgc2V0dGluZ3Mgd3JhcHBlci5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGN1cnJlbnQgc2V0dGluZ3Mgd3JhcHBlci5cbiAgICovXG4gIHB1YmxpYyBnZXQgc2V0dGluZ3NXcmFwcGVyKCk6IEV4dHJhY3RSZWFkb25seVBsdWdpblNldHRpbmdzV3JhcHBlcjxQbHVnaW5UeXBlcz4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTZXR0aW5nc1dyYXBwZXIgYXMgRXh0cmFjdFJlYWRvbmx5UGx1Z2luU2V0dGluZ3NXcmFwcGVyPFBsdWdpblR5cGVzPjtcbiAgfVxuXG4gIHByaXZhdGUgY3VycmVudFNldHRpbmdzV3JhcHBlcjogRXh0cmFjdFBsdWdpblNldHRpbmdzV3JhcHBlcjxQbHVnaW5UeXBlcz47XG4gIHByaXZhdGUgbGFzdFNhdmVkU2V0dGluZ3NXcmFwcGVyOiBFeHRyYWN0UGx1Z2luU2V0dGluZ3NXcmFwcGVyPFBsdWdpblR5cGVzPjtcbiAgcHJpdmF0ZSByZWFkb25seSBsZWdhY3lTZXR0aW5nc0NvbnZlcnRlcnM6ICgocmVjb3JkOiBHZW5lcmljT2JqZWN0KSA9PiB2b2lkKVtdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcGVydHlOYW1lczogRXh0cmFjdFBsdWdpblNldHRpbmdzUHJvcGVydHlOYW1lczxQbHVnaW5UeXBlcz5bXTtcbiAgcHJpdmF0ZSByZWFkb25seSB2YWxpZGF0b3JzID0gbmV3IE1hcDxFeHRyYWN0UGx1Z2luU2V0dGluZ3NQcm9wZXJ0eU5hbWVzPFBsdWdpblR5cGVzPiwgVmFsaWRhdG9yPEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4+PigpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHBsdWdpbiBzZXR0aW5ncyBtYW5hZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gcGx1Z2luIC0gVGhlIHBsdWdpbi5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgcGx1Z2luOiBFeHRyYWN0UGx1Z2luPFBsdWdpblR5cGVzPikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hcHAgPSBwbHVnaW4uYXBwO1xuICAgIHRoaXMuZGVmYXVsdFNldHRpbmdzID0gdGhpcy5jcmVhdGVEZWZhdWx0U2V0dGluZ3MoKSBhcyBSZWFkb25seURlZXA8RXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPj47XG4gICAgdGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyID0gdGhpcy5jcmVhdGVEZWZhdWx0U2V0dGluZ3NXcmFwcGVyKCk7XG4gICAgdGhpcy5sYXN0U2F2ZWRTZXR0aW5nc1dyYXBwZXIgPSB0aGlzLmNyZWF0ZURlZmF1bHRTZXR0aW5nc1dyYXBwZXIoKTtcbiAgICB0aGlzLnByb3BlcnR5TmFtZXMgPSBnZXRBbGxLZXlzKHRoaXMuY3VycmVudFNldHRpbmdzV3JhcHBlci5zZXR0aW5ncyk7XG4gICAgdGhpcy5yZWdpc3RlclZhbGlkYXRvcnMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyTGVnYWN5U2V0dGluZ3NDb252ZXJ0ZXJzKCk7XG4gIH1cblxuICAvKipcbiAgICogRWRpdHMgdGhlIHBsdWdpbiBzZXR0aW5ncyBhbmQgc2F2ZXMgdGhlbS5cbiAgICpcbiAgICogQHBhcmFtIHNldHRpbmdzRWRpdG9yIC0gVGhlIGVkaXRvci5cbiAgICogQHBhcmFtIGNvbnRleHQgLSBUaGUgY29udGV4dC5cbiAgICogQHJldHVybnMgQSB7QGxpbmsgUHJvbWlzZX0gdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBzZXR0aW5ncyBhcmUgc2F2ZWQuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZWRpdEFuZFNhdmUoc2V0dGluZ3NFZGl0b3I6IChzZXR0aW5nczogRXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPikgPT4gUHJvbWlzYWJsZTx2b2lkPiwgY29udGV4dD86IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmVkaXQoc2V0dGluZ3NFZGl0b3IpO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVRvRmlsZShjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmVzIHRoZSBzZXR0aW5ncyBhcmUgc2FmZS5cbiAgICpcbiAgICogSXQgcnVucyB2YWxpZGF0aW9uIGZvciBlYWNoIHByb3BlcnR5IGFuZCBzZXRzIHRoZSBkZWZhdWx0IHZhbHVlIGlmIHRoZSB2YWxpZGF0aW9uIGZhaWxzLlxuICAgKlxuICAgKiBAcGFyYW0gc2V0dGluZ3MgLSBUaGUgc2V0dGluZ3MuXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgc2V0dGluZ3MgYXJlIHNhZmUuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZW5zdXJlU2FmZShzZXR0aW5nczogRXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZhbGlkYXRpb25SZXN1bHQgPSBhd2FpdCB0aGlzLnZhbGlkYXRlKHNldHRpbmdzKTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBvZiB0aGlzLnByb3BlcnR5TmFtZXMpIHtcbiAgICAgIGlmICh2YWxpZGF0aW9uUmVzdWx0W3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgc2V0dGluZ3NbcHJvcGVydHlOYW1lXSA9IHRoaXMuZGVmYXVsdFNldHRpbmdzW3Byb3BlcnR5TmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzYWZlIGNvcHkgb2YgdGhlIHNldHRpbmdzLlxuICAgKlxuICAgKiBAcGFyYW0gc2V0dGluZ3MgLSBUaGUgc2V0dGluZ3MuXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgcmVzb2x2ZXMgdG8gdGhlIHNhZmUgY29weSBvZiB0aGUgc2V0dGluZ3MuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZ2V0U2FmZUNvcHkoc2V0dGluZ3M6IEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4pOiBQcm9taXNlPEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4+IHtcbiAgICBjb25zdCBzYWZlU2V0dGluZ3MgPSBhd2FpdCB0aGlzLmNsb25lU2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgIGF3YWl0IHRoaXMuZW5zdXJlU2FmZShzYWZlU2V0dGluZ3MpO1xuICAgIHJldHVybiBzYWZlU2V0dGluZ3M7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdGhlIHBsdWdpbiBzZXR0aW5ncyBmcm9tIHRoZSBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0gaXNJbml0aWFsTG9hZCAtIFdoZXRoZXIgdGhlIHNldHRpbmdzIGFyZSBiZWluZyBsb2FkZWQgZm9yIHRoZSBmaXJzdCB0aW1lLlxuICAgKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHNldHRpbmdzIGFyZSBsb2FkZWQuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgbG9hZEZyb21GaWxlKGlzSW5pdGlhbExvYWQ6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKSBhcyB1bmtub3duO1xuICAgIHRoaXMubGFzdFNhdmVkU2V0dGluZ3NXcmFwcGVyID0gdGhpcy5jcmVhdGVEZWZhdWx0U2V0dGluZ3NXcmFwcGVyKCk7XG4gICAgdGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyID0gdGhpcy5jcmVhdGVEZWZhdWx0U2V0dGluZ3NXcmFwcGVyKCk7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCB8fCBkYXRhID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBJbnZhbGlkIHNldHRpbmdzIGZyb20gZGF0YS5qc29uLiBFeHBlY3RlZCBPYmplY3QsIGdvdDogJHt0eXBlb2YgZGF0YX1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByYXdSZWNvcmQgPSBkYXRhIGFzIEdlbmVyaWNPYmplY3Q7XG4gICAgICBjb25zdCBwYXJzZWRTZXR0aW5ncyA9IGF3YWl0IHRoaXMucmF3UmVjb3JkVG9TZXR0aW5ncyhyYXdSZWNvcmQpO1xuICAgICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IGF3YWl0IHRoaXMudmFsaWRhdGUocGFyc2VkU2V0dGluZ3MpO1xuXG4gICAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBvZiB0aGlzLnByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUltcGwocHJvcGVydHlOYW1lLCBwYXJzZWRTZXR0aW5nc1twcm9wZXJ0eU5hbWVdLCB2YWxpZGF0aW9uUmVzdWx0W3Byb3BlcnR5TmFtZV0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxhc3RTYXZlZFNldHRpbmdzV3JhcHBlciA9IGF3YWl0IHRoaXMuY2xvbmVTZXR0aW5nc1dyYXBwZXIodGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyKTtcblxuICAgICAgY29uc3QgbmV3UmVjb3JkID0gYXdhaXQgdGhpcy5zZXR0aW5nc1RvUmF3UmVjb3JkKHRoaXMuY3VycmVudFNldHRpbmdzV3JhcHBlci5zZXR0aW5ncyk7XG5cbiAgICAgIGlmICghZGVlcEVxdWFsKG5ld1JlY29yZCwgZGF0YSkpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5zYXZlVG9GaWxlSW1wbCgpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXJBc3luYygnbG9hZFNldHRpbmdzJywgdGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyLCBpc0luaXRpYWxMb2FkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byB0aGUgYGxvYWRTZXR0aW5nc2AgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIC0gQWx3YXlzIGBsb2FkU2V0dGluZ3NgLlxuICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FsbCB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqIEBwYXJhbSB0aGlzQXJnIC0gVGhlIGNvbnRleHQgcGFzc2VkIGFzIGB0aGlzYCB0byB0aGUgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMgQSByZWZlcmVuY2UgdG8gdGhlIGV2ZW50IGxpc3RlbmVyLlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIG9uKFxuICAgIG5hbWU6ICdsb2FkU2V0dGluZ3MnLFxuICAgIGNhbGxiYWNrOiAoXG4gICAgICBsb2FkZWRTZXR0aW5nczogRXh0cmFjdFJlYWRvbmx5UGx1Z2luU2V0dGluZ3NXcmFwcGVyPFBsdWdpblR5cGVzPixcbiAgICAgIGlzSW5pdGlhbExvYWQ6IGJvb2xlYW5cbiAgICApID0+IFByb21pc2FibGU8dm9pZD4sXG4gICAgdGhpc0FyZz86IHVua25vd25cbiAgKTogQXN5bmNFdmVudFJlZjtcbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gdGhlIGBzYXZlU2V0dGluZ3NgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSAtIEFsd2F5cyBgc2F2ZVNldHRpbmdzYC5cbiAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiBAcGFyYW0gdGhpc0FyZyAtIFRoZSBjb250ZXh0IHBhc3NlZCBhcyBgdGhpc2AgdG8gdGhlIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICovXG4gIHB1YmxpYyBvdmVycmlkZSBvbihcbiAgICBuYW1lOiAnc2F2ZVNldHRpbmdzJyxcbiAgICBjYWxsYmFjazogKFxuICAgICAgbmV3U2V0dGluZ3M6IEV4dHJhY3RSZWFkb25seVBsdWdpblNldHRpbmdzV3JhcHBlcjxQbHVnaW5UeXBlcz4sXG4gICAgICBvbGRTZXR0aW5nczogRXh0cmFjdFJlYWRvbmx5UGx1Z2luU2V0dGluZ3NXcmFwcGVyPFBsdWdpblR5cGVzPixcbiAgICAgIGNvbnRleHQ6IHVua25vd25cbiAgICApID0+IFByb21pc2FibGU8dm9pZD4sXG4gICAgdGhpc0FyZz86IHVua25vd25cbiAgKTogQXN5bmNFdmVudFJlZjtcbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gYW4gZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FsbCB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqIEBwYXJhbSB0aGlzQXJnIC0gVGhlIGNvbnRleHQgcGFzc2VkIGFzIGB0aGlzYCB0byB0aGUgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMgQSByZWZlcmVuY2UgdG8gdGhlIGV2ZW50IGxpc3RlbmVyLlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIG9uPEFyZ3MgZXh0ZW5kcyB1bmtub3duW10+KFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBjYWxsYmFjazogKC4uLmFyZ3M6IEFyZ3MpID0+IFByb21pc2FibGU8dm9pZD4sXG4gICAgdGhpc0FyZz86IHVua25vd25cbiAgKTogQXN5bmNFdmVudFJlZiB7XG4gICAgcmV0dXJuIHN1cGVyLm9uKG5hbWUsIGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZhbGlkYXRlcyB0aGUgc2V0dGluZ3MuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSB2YWxpZGF0aW9uIG1lc3NhZ2VzLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHJldmFsaWRhdGUoKTogUHJvbWlzZTxSZWNvcmQ8RXh0cmFjdFBsdWdpblNldHRpbmdzUHJvcGVydHlOYW1lczxQbHVnaW5UeXBlcz4sIHN0cmluZz4+IHtcbiAgICBhd2FpdCB0aGlzLmVkaXQobm9vcCk7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFNldHRpbmdzV3JhcHBlci52YWxpZGF0aW9uTWVzc2FnZXM7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIG5ldyBwbHVnaW4gc2V0dGluZ3MuXG4gICAqXG4gICAqIEBwYXJhbSBjb250ZXh0IC0gVGhlIGNvbnRleHQgb2YgdGhlIHNhdmUgdG8gZmlsZSBvcGVyYXRpb24uXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgc2V0dGluZ3MgYXJlIHNhdmVkLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHNhdmVUb0ZpbGUoY29udGV4dD86IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoZGVlcEVxdWFsKHRoaXMubGFzdFNhdmVkU2V0dGluZ3NXcmFwcGVyLnNldHRpbmdzLCB0aGlzLmN1cnJlbnRTZXR0aW5nc1dyYXBwZXIuc2V0dGluZ3MpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5zYXZlVG9GaWxlSW1wbCgpO1xuICAgIGF3YWl0IHRoaXMudHJpZ2dlckFzeW5jKCdzYXZlU2V0dGluZ3MnLCB0aGlzLmN1cnJlbnRTZXR0aW5nc1dyYXBwZXIsIHRoaXMubGFzdFNhdmVkU2V0dGluZ3NXcmFwcGVyLCBjb250ZXh0KTtcbiAgICB0aGlzLmxhc3RTYXZlZFNldHRpbmdzV3JhcHBlciA9IGF3YWl0IHRoaXMuY2xvbmVTZXR0aW5nc1dyYXBwZXIodGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5LlxuICAgKlxuICAgKiBAdHlwZVBhcmFtIFByb3BlcnR5TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHByb3BlcnR5TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNldC5cbiAgICogQHJldHVybnMgQSB7QGxpbmsgUHJvbWlzZX0gdGhhdCByZXNvbHZlcyB0byB0aGUgdmFsaWRhdGlvbiBtZXNzYWdlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHNldFByb3BlcnR5PFByb3BlcnR5TmFtZSBleHRlbmRzIEV4dHJhY3RQbHVnaW5TZXR0aW5nc1Byb3BlcnR5TmFtZXM8UGx1Z2luVHlwZXM+PihcbiAgICBwcm9wZXJ0eU5hbWU6IFByb3BlcnR5TmFtZSxcbiAgICB2YWx1ZTogRXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPltQcm9wZXJ0eU5hbWVdXG4gICk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy5lZGl0KChzZXR0aW5ncykgPT4ge1xuICAgICAgc2V0dGluZ3NbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTZXR0aW5nc1dyYXBwZXIudmFsaWRhdGlvbk1lc3NhZ2VzW3Byb3BlcnR5TmFtZV07XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIHRoZSBzZXR0aW5ncy5cbiAgICpcbiAgICogQHBhcmFtIHNldHRpbmdzIC0gVGhlIHNldHRpbmdzLlxuICAgKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHRvIHRoZSB2YWxpZGF0aW9uIHJlc3VsdC5cbiAgICovXG4gIHB1YmxpYyBhc3luYyB2YWxpZGF0ZShzZXR0aW5nczogRXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPik6IFByb21pc2U8VmFsaWRhdGlvblJlc3VsdDxFeHRyYWN0UGx1Z2luU2V0dGluZ3M8UGx1Z2luVHlwZXM+Pj4ge1xuICAgIGNvbnN0IHJlc3VsdDogVmFsaWRhdGlvblJlc3VsdDxFeHRyYWN0UGx1Z2luU2V0dGluZ3M8UGx1Z2luVHlwZXM+PiA9IHt9O1xuICAgIGZvciAoY29uc3QgW3Byb3BlcnR5TmFtZSwgdmFsaWRhdG9yXSBvZiB0aGlzLnZhbGlkYXRvcnMuZW50cmllcygpKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uTWVzc2FnZSA9IGF3YWl0IHZhbGlkYXRvcihzZXR0aW5nc1twcm9wZXJ0eU5hbWVdLCBzZXR0aW5ncyk7XG4gICAgICBpZiAodmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICAgICAgcmVzdWx0W3Byb3BlcnR5TmFtZV0gPSB2YWxpZGF0aW9uTWVzc2FnZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGNyZWF0ZURlZmF1bHRTZXR0aW5ncygpOiBFeHRyYWN0UGx1Z2luU2V0dGluZ3M8UGx1Z2luVHlwZXM+O1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB0cmFuc2Zvcm1lci5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIHRyYW5zZm9ybWVyLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFRyYW5zZm9ybWVyKCk6IFRyYW5zZm9ybWVyIHtcbiAgICByZXR1cm4gZGVmYXVsdFRyYW5zZm9ybWVyO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBwbHVnaW4gc2V0dGluZ3MgYXJlIGxvYWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHJlY29yZCAtIFRoZSByZWNvcmQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgb25Mb2FkUmVjb3JkKHJlY29yZDogR2VuZXJpY09iamVjdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGZvciAoY29uc3QgY29udmVydGVyIG9mIHRoaXMubGVnYWN5U2V0dGluZ3NDb252ZXJ0ZXJzKSB7XG4gICAgICBjb252ZXJ0ZXIocmVjb3JkKTtcbiAgICB9XG4gICAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBzZXR0aW5ncyBhcmUgc2F2aW5nLlxuICAgKlxuICAgKiBAcGFyYW0gX3JlY29yZCAtIFRoZSByZWNvcmQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgb25TYXZpbmdSZWNvcmQoX3JlY29yZDogR2VuZXJpY09iamVjdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IG5vb3BBc3luYygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGxlZ2FjeSBzZXR0aW5ncyBjb252ZXJ0ZXIuXG4gICAqXG4gICAqIEB0eXBlUGFyYW0gTGVnYWN5U2V0dGluZ3MgLSBUaGUgbGVnYWN5IHNldHRpbmdzIGNsYXNzLlxuICAgKiBAcGFyYW0gbGVnYWN5U2V0dGluZ3NDbGFzcyAtIFRoZSBsZWdhY3kgc2V0dGluZ3MgY2xhc3MuXG4gICAqIEBwYXJhbSBjb252ZXJ0ZXIgLSBUaGUgY29udmVydGVyLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyTGVnYWN5U2V0dGluZ3NDb252ZXJ0ZXI8TGVnYWN5U2V0dGluZ3MgZXh0ZW5kcyBvYmplY3Q+KFxuICAgIGxlZ2FjeVNldHRpbmdzQ2xhc3M6IG5ldyAoKSA9PiBMZWdhY3lTZXR0aW5ncyxcbiAgICBjb252ZXJ0ZXI6IChsZWdhY3lTZXR0aW5nczogUGFydGlhbDxFeHRyYWN0UGx1Z2luU2V0dGluZ3M8UGx1Z2luVHlwZXM+PiAmIFBhcnRpYWw8TGVnYWN5U2V0dGluZ3M+KSA9PiB2b2lkXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHRoaXMubGVnYWN5U2V0dGluZ3NDb252ZXJ0ZXJzLnB1c2gobGVnYWN5U2V0dGluZ3NDb252ZXJ0ZXIpO1xuXG4gICAgZnVuY3Rpb24gbGVnYWN5U2V0dGluZ3NDb252ZXJ0ZXIocmVjb3JkOiBHZW5lcmljT2JqZWN0KTogdm9pZCB7XG4gICAgICBjb25zdCBsZWdhY3lTZXR0aW5nc0tleXMgPSBuZXcgU2V0PHN0cmluZz4oT2JqZWN0LmtleXMobmV3IGxlZ2FjeVNldHRpbmdzQ2xhc3MoKSkpO1xuICAgICAgY29uc3QgcGx1Z2luU2V0dGluZ0tleXMgPSBuZXcgU2V0PHN0cmluZz4odGhhdC5wcm9wZXJ0eU5hbWVzKTtcbiAgICAgIGNvbnN0IGxlZ2FjeVNldHRpbmdzID0gcmVjb3JkIGFzIFBhcnRpYWw8RXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPj4gJiBQYXJ0aWFsPExlZ2FjeVNldHRpbmdzPjtcbiAgICAgIGNvbnZlcnRlcihsZWdhY3lTZXR0aW5ncyk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhsZWdhY3lTZXR0aW5ncykpIHtcbiAgICAgICAgaWYgKHBsdWdpblNldHRpbmdLZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWxlZ2FjeVNldHRpbmdzS2V5cy5oYXMoa2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1keW5hbWljLWRlbGV0ZSAtLSBXZSBoYXZlIG5vIG90aGVyIHdheSB0byBkZWxldGUgdGhlIHByb3BlcnR5LlxuICAgICAgICBkZWxldGUgcmVjb3JkW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyB0aGUgbGVnYWN5IHNldHRpbmdzIGNvbnZlcnRlcnMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHN1YmNsYXNzZXMgdG8gcmVnaXN0ZXIgbGVnYWN5IHNldHRpbmdzIGNvbnZlcnRlcnMuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVnaXN0ZXJMZWdhY3lTZXR0aW5nc0NvbnZlcnRlcnMoKTogdm9pZCB7XG4gICAgbm9vcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIHZhbGlkYXRvciBmb3IgYSBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHBhcmFtIHByb3BlcnR5TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHZhbGlkYXRvciAtIFRoZSB2YWxpZGF0b3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVnaXN0ZXJWYWxpZGF0b3I8UHJvcGVydHlOYW1lIGV4dGVuZHMgRXh0cmFjdFBsdWdpblNldHRpbmdzUHJvcGVydHlOYW1lczxQbHVnaW5UeXBlcz4+KFxuICAgIHByb3BlcnR5TmFtZTogUHJvcGVydHlOYW1lLFxuICAgIHZhbGlkYXRvcjogVmFsaWRhdG9yPEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4sIFByb3BlcnR5TmFtZT5cbiAgKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0b3JzLnNldChwcm9wZXJ0eU5hbWUsIHZhbGlkYXRvciBhcyBWYWxpZGF0b3I8RXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPj4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyB0aGUgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIG92ZXJyaWRkZW4gYnkgc3ViY2xhc3NlcyB0byByZWdpc3RlciB2YWxpZGF0b3JzIGZvciBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyVmFsaWRhdG9ycygpOiB2b2lkIHtcbiAgICBub29wKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNsb25lU2V0dGluZ3Moc2V0dGluZ3M6IEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4pOiBQcm9taXNlPEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4+IHtcbiAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLnNldHRpbmdzVG9SYXdSZWNvcmQoc2V0dGluZ3MpO1xuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShyZWNvcmQpO1xuICAgIGNvbnN0IGNsb25lUmVjb3JkID0gSlNPTi5wYXJzZShqc29uKSBhcyBHZW5lcmljT2JqZWN0O1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnJhd1JlY29yZFRvU2V0dGluZ3MoY2xvbmVSZWNvcmQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBjbG9uZVNldHRpbmdzV3JhcHBlcihcbiAgICBzZXR0aW5nc1dyYXBwZXI6IFBsdWdpblNldHRpbmdzV3JhcHBlcjxFeHRyYWN0UGx1Z2luU2V0dGluZ3M8UGx1Z2luVHlwZXM+PlxuICApOiBQcm9taXNlPFBsdWdpblNldHRpbmdzV3JhcHBlcjxFeHRyYWN0UGx1Z2luU2V0dGluZ3M8UGx1Z2luVHlwZXM+Pj4ge1xuICAgIHJldHVybiB7XG4gICAgICBzYWZlU2V0dGluZ3M6IGF3YWl0IHRoaXMuY2xvbmVTZXR0aW5ncyhzZXR0aW5nc1dyYXBwZXIuc2FmZVNldHRpbmdzKSxcbiAgICAgIHNldHRpbmdzOiBhd2FpdCB0aGlzLmNsb25lU2V0dGluZ3Moc2V0dGluZ3NXcmFwcGVyLnNldHRpbmdzKSxcbiAgICAgIHZhbGlkYXRpb25NZXNzYWdlczogeyAuLi5zZXR0aW5nc1dyYXBwZXIudmFsaWRhdGlvbk1lc3NhZ2VzIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEZWZhdWx0U2V0dGluZ3NXcmFwcGVyKCk6IFBsdWdpblNldHRpbmdzV3JhcHBlcjxFeHRyYWN0UGx1Z2luU2V0dGluZ3M8UGx1Z2luVHlwZXM+PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNhZmVTZXR0aW5nczogdGhpcy5jcmVhdGVEZWZhdWx0U2V0dGluZ3MoKSxcbiAgICAgIHNldHRpbmdzOiB0aGlzLmNyZWF0ZURlZmF1bHRTZXR0aW5ncygpLFxuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2VzOiBjYXN0VG88UmVjb3JkPEV4dHJhY3RQbHVnaW5TZXR0aW5nc1Byb3BlcnR5TmFtZXM8UGx1Z2luVHlwZXM+LCBzdHJpbmc+Pih7fSlcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBlZGl0KHNldHRpbmdzRWRpdG9yOiAoc2V0dGluZ3M6IEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4pID0+IFByb21pc2FibGU8dm9pZD4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgc2V0dGluZ3NFZGl0b3IodGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyLnNldHRpbmdzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IGF3YWl0IHRoaXMudmFsaWRhdGUodGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyLnNldHRpbmdzKTtcbiAgICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIG9mIHRoaXMucHJvcGVydHlOYW1lcykge1xuICAgICAgICBjb25zdCB2YWxpZGF0aW9uTWVzc2FnZSA9IHZhbGlkYXRpb25SZXN1bHRbcHJvcGVydHlOYW1lXSA/PyAnJztcbiAgICAgICAgdGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyLnZhbGlkYXRpb25NZXNzYWdlc1twcm9wZXJ0eU5hbWVdID0gdmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgICAgIHRoaXMuY3VycmVudFNldHRpbmdzV3JhcHBlci5zYWZlU2V0dGluZ3NbcHJvcGVydHlOYW1lXSA9IHZhbGlkYXRpb25NZXNzYWdlXG4gICAgICAgICAgPyB0aGlzLmRlZmF1bHRTZXR0aW5nc1twcm9wZXJ0eU5hbWVdXG4gICAgICAgICAgOiB0aGlzLmN1cnJlbnRTZXR0aW5nc1dyYXBwZXIuc2V0dGluZ3NbcHJvcGVydHlOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzVmFsaWRQcm9wZXJ0eU5hbWUocHJvcDogdW5rbm93bik6IHByb3AgaXMgRXh0cmFjdFBsdWdpblNldHRpbmdzUHJvcGVydHlOYW1lczxQbHVnaW5UeXBlcz4ge1xuICAgIGlmICh0eXBlb2YgcHJvcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHRoaXMucHJvcGVydHlOYW1lcyBhcyBzdHJpbmdbXSkuaW5jbHVkZXMocHJvcCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJhd1JlY29yZFRvU2V0dGluZ3MocmF3UmVjb3JkOiBHZW5lcmljT2JqZWN0KTogUHJvbWlzZTxFeHRyYWN0UGx1Z2luU2V0dGluZ3M8UGx1Z2luVHlwZXM+PiB7XG4gICAgcmF3UmVjb3JkID0gdGhpcy5nZXRUcmFuc2Zvcm1lcigpLnRyYW5zZm9ybU9iamVjdFJlY3Vyc2l2ZWx5KHJhd1JlY29yZCk7XG4gICAgYXdhaXQgdGhpcy5vbkxvYWRSZWNvcmQocmF3UmVjb3JkKTtcblxuICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5jcmVhdGVEZWZhdWx0U2V0dGluZ3MoKTtcblxuICAgIGZvciAoY29uc3QgW3Byb3BlcnR5TmFtZSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHJhd1JlY29yZCkpIHtcbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgZ2V0TGliRGVidWdnZXIoJ1BsdWdpblNldHRpbmdzTWFuYWdlckJhc2U6cmF3UmVjb3JkVG9TZXR0aW5ncycpKGBVbmtub3duIHByb3BlcnR5OiAke3Byb3BlcnR5TmFtZX1gKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IHR5cGVvZiB0aGlzLmRlZmF1bHRTZXR0aW5nc1twcm9wZXJ0eU5hbWVdKSB7XG4gICAgICAgIGdldExpYkRlYnVnZ2VyKCdQbHVnaW5TZXR0aW5nc01hbmFnZXJCYXNlOnJhd1JlY29yZFRvU2V0dGluZ3MnKShcbiAgICAgICAgICAnUG9zc2libGUgaW52YWxpZCB2YWx1ZSB0eXBlLiBJdCBtaWdodCBsZWFkIHRvIGFuIHVuZXhwZWN0ZWQgYmVoYXZpb3Igb2YgdGhlIHBsdWdpbi4gVGhlcmUgaXMgYWxzbyBhIGNoYW5jZSBpdCBpcyBhIGZhbHNlLW5lZ2F0aXZlIHdhcm5pbmcsIGFzIHdlIGFyZSB1bmFibGUgdG8gZGV0ZXJtaW5lIHRoZSBleGFjdCB0eXBlIG9mIHRoZSB2YWx1ZSBpbiBydW50aW1lLicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLmRlZmF1bHRTZXR0aW5nc1twcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZSBhcyBFeHRyYWN0UGx1Z2luU2V0dGluZ3NQcm9wZXJ0eVZhbHVlczxQbHVnaW5UeXBlcz47XG4gICAgfVxuXG4gICAgcmV0dXJuIHNldHRpbmdzO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzYXZlVG9GaWxlSW1wbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlRGF0YShhd2FpdCB0aGlzLnNldHRpbmdzVG9SYXdSZWNvcmQodGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyLnNldHRpbmdzKSk7XG4gIH1cblxuICBwcml2YXRlIHNldFByb3BlcnR5SW1wbChcbiAgICBwcm9wZXJ0eU5hbWU6IEV4dHJhY3RQbHVnaW5TZXR0aW5nc1Byb3BlcnR5TmFtZXM8UGx1Z2luVHlwZXM+LFxuICAgIHZhbHVlOiBFeHRyYWN0UGx1Z2luU2V0dGluZ3NQcm9wZXJ0eVZhbHVlczxQbHVnaW5UeXBlcz4sXG4gICAgdmFsaWRhdGlvbk1lc3NhZ2U/OiBzdHJpbmdcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50U2V0dGluZ3NXcmFwcGVyLnNldHRpbmdzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcbiAgICB0aGlzLmN1cnJlbnRTZXR0aW5nc1dyYXBwZXIudmFsaWRhdGlvbk1lc3NhZ2VzW3Byb3BlcnR5TmFtZV0gPSB2YWxpZGF0aW9uTWVzc2FnZSA/PyAnJztcbiAgICB0aGlzLmN1cnJlbnRTZXR0aW5nc1dyYXBwZXIuc2FmZVNldHRpbmdzW3Byb3BlcnR5TmFtZV0gPSB2YWxpZGF0aW9uTWVzc2FnZSA/IHRoaXMuZGVmYXVsdFNldHRpbmdzW3Byb3BlcnR5TmFtZV0gOiB2YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2V0dGluZ3NUb1Jhd1JlY29yZChzZXR0aW5nczogRXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPik6IFByb21pc2U8R2VuZXJpY09iamVjdD4ge1xuICAgIGNvbnN0IHJhd1JlY29yZDogR2VuZXJpY09iamVjdCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgb2YgdGhpcy5wcm9wZXJ0eU5hbWVzKSB7XG4gICAgICByYXdSZWNvcmRbcHJvcGVydHlOYW1lXSA9IHNldHRpbmdzW3Byb3BlcnR5TmFtZV07XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5vblNhdmluZ1JlY29yZChyYXdSZWNvcmQpO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0VHJhbnNmb3JtZXIoKS50cmFuc2Zvcm1PYmplY3RSZWN1cnNpdmVseShyYXdSZWNvcmQpO1xuICB9XG59XG4vKiB2OCBpZ25vcmUgc3RvcCAqL1xuIiwgImV4cG9ydCBpbnRlcmZhY2UgU2xpY2VDb25maWcge1xuICBsYWJlbDogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG4gIC8vIFNWRyBzY3JlZW4gY29vcmRzOiAwXHUwMEIwPXJpZ2h0LCA5MFx1MDBCMD1kb3duLCAxODBcdTAwQjA9bGVmdCwgMjcwXHUwMEIwPXVwXG4gIC8vIERlZmF1bHQgbGF5b3V0OiBib3R0b20gaGFsZiAoMFx1MjE5MjE4MCkgPSBjYW5jZWwsIHRvcC1sZWZ0ICgxODBcdTIxOTIyNzApID0gaG9tZSwgdG9wLXJpZ2h0ICgyNzBcdTIxOTIzNjApID0gbmV3IG5vdGVcbiAgc3RhcnRBbmdsZTogbnVtYmVyO1xuICBlbmRBbmdsZTogbnVtYmVyO1xuICBjb2xvcjogc3RyaW5nO1xuICBhY3Rpb246ICdjYW5jZWwnIHwgJ2NvbW1hbmQnIHwgJ2Rhc2hib2FyZCcgfCAnaG9tZXBhZ2UnIHwgJ25ldy1ub3RlJztcbiAgY29tbWFuZElkPzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBRdWlja0FjdGlvblR5cGUgPSAnbmV3LW5vdGUnIHwgJ2hvbWVwYWdlJyB8ICdjb21tYW5kJyB8ICdhcHBlbmQtdG8tbm90ZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVpY2tBY3Rpb24ge1xuICBsYWJlbDogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG4gIGFjdGlvbjogUXVpY2tBY3Rpb25UeXBlO1xuICBjb21tYW5kSWQ/OiBzdHJpbmc7XG4gIG5vdGVQYXRoPzogc3RyaW5nO1xuICBhcHBlbmRUZW1wbGF0ZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IFFVSUNLX0FDVElPTl9ERUZBVUxUUzogUXVpY2tBY3Rpb25bXSA9IFtcbiAgeyBsYWJlbDogJ05ldyBub3RlJywgaWNvbjogJ2ZpbGUtcGx1cycsIGFjdGlvbjogJ25ldy1ub3RlJyB9LFxuICB7IGxhYmVsOiAnSG9tZScsIGljb246ICdob21lJywgYWN0aW9uOiAnaG9tZXBhZ2UnIH0sXG5dO1xuXG5leHBvcnQgdHlwZSBEYXNoYm9hcmRXaWRnZXRUeXBlID0gJ2NvbnRpbnVlJyB8ICduZXctbm90ZScgfCAndHJhc2gnIHwgJ2dyYXBoJztcblxuZXhwb3J0IGludGVyZmFjZSBEYXNoYm9hcmRXaWRnZXQge1xuICB0eXBlOiBEYXNoYm9hcmRXaWRnZXRUeXBlO1xuICBlbmFibGVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgdHlwZSBEYXNoYm9hcmRQcmVzZXQgPSAnZm9jdXMnIHwgJ2Z1bGwnIHwgJ3RyaWFnZSc7XG5cbmV4cG9ydCBjb25zdCBEQVNIQk9BUkRfUFJFU0VUUzogUmVjb3JkPERhc2hib2FyZFByZXNldCwgeyBsYWJlbDogc3RyaW5nOyB3aWRnZXRzOiBEYXNoYm9hcmRXaWRnZXRbXSB9PiA9IHtcbiAgZm9jdXM6IHtcbiAgICBsYWJlbDogJ0ZvY3VzJyxcbiAgICB3aWRnZXRzOiBbXG4gICAgICB7IHR5cGU6ICdjb250aW51ZScsIGVuYWJsZWQ6IHRydWUgfSxcbiAgICAgIHsgdHlwZTogJ25ldy1ub3RlJywgZW5hYmxlZDogdHJ1ZSB9LFxuICAgICAgeyB0eXBlOiAndHJhc2gnLCBlbmFibGVkOiBmYWxzZSB9LFxuICAgIF0sXG4gIH0sXG4gIGZ1bGw6IHtcbiAgICBsYWJlbDogJ0Z1bGwnLFxuICAgIHdpZGdldHM6IFtcbiAgICAgIHsgdHlwZTogJ2dyYXBoJywgZW5hYmxlZDogdHJ1ZSB9LFxuICAgICAgeyB0eXBlOiAnY29udGludWUnLCBlbmFibGVkOiB0cnVlIH0sXG4gICAgICB7IHR5cGU6ICd0cmFzaCcsIGVuYWJsZWQ6IHRydWUgfSxcbiAgICAgIHsgdHlwZTogJ25ldy1ub3RlJywgZW5hYmxlZDogZmFsc2UgfSxcbiAgICBdLFxuICB9LFxuICB0cmlhZ2U6IHtcbiAgICBsYWJlbDogJ1RyaWFnZScsXG4gICAgd2lkZ2V0czogW1xuICAgICAgeyB0eXBlOiAndHJhc2gnLCBlbmFibGVkOiB0cnVlIH0sXG4gICAgICB7IHR5cGU6ICdjb250aW51ZScsIGVuYWJsZWQ6IHRydWUgfSxcbiAgICAgIHsgdHlwZTogJ25ldy1ub3RlJywgZW5hYmxlZDogdHJ1ZSB9LFxuICAgIF0sXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgV0lER0VUX0xBQkVMUzogUmVjb3JkPERhc2hib2FyZFdpZGdldFR5cGUsIHN0cmluZz4gPSB7XG4gIGNvbnRpbnVlOiAnUmVjZW50bHkgVG91Y2hlZCcsXG4gIGdyYXBoOiAnQWN0aXZlIENsdXN0ZXIgKGdyYXBoKScsXG4gIHRyYXNoOiAnTmVlZHMgUmV2aWV3JyxcbiAgJ25ldy1ub3RlJzogJ01vcmUgQWN0aW9ucycsXG59O1xuXG5leHBvcnQgdHlwZSBOZXdOb3RlRmlsZW5hbWVGb3JtYXQgPSAndW50aXRsZWQnIHwgJ3pldHRlbGthc3Rlbic7XG5cbmV4cG9ydCB0eXBlIFB1bHNlQ2FyZFR5cGUgPSAnZGFpbHktbm90ZScgfCAnbW9kaWZpZWQtdG9kYXknIHwgJ3ZhdWx0JyB8ICd0cmFzaCcgfCAncXVpY2stYWN0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBQdWxzZUNhcmQge1xuICB0eXBlOiBQdWxzZUNhcmRUeXBlO1xuICBlbmFibGVkOiBib29sZWFuO1xuICBxdWlja0FjdGlvbj86IFF1aWNrQWN0aW9uOyAvLyBvbmx5IGZvciB0eXBlID09PSAncXVpY2stYWN0aW9uJ1xufVxuXG5leHBvcnQgY29uc3QgUFVMU0VfQ0FSRF9MQUJFTFM6IFJlY29yZDxQdWxzZUNhcmRUeXBlLCBzdHJpbmc+ID0ge1xuICAnZGFpbHktbm90ZSc6ICdEYWlseSBOb3RlJyxcbiAgJ21vZGlmaWVkLXRvZGF5JzogJ01vZGlmaWVkIFRvZGF5JyxcbiAgJ3ZhdWx0JzogJ1ZhdWx0IFN0YXRzJyxcbiAgJ3RyYXNoJzogJ1RyYXNoIChjb25kaXRpb25hbCknLFxuICAncXVpY2stYWN0aW9uJzogJ1F1aWNrIEFjdGlvbicsXG59O1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9QVUxTRV9DQVJEUzogUHVsc2VDYXJkW10gPSBbXG4gIHsgdHlwZTogJ2RhaWx5LW5vdGUnLCBlbmFibGVkOiB0cnVlIH0sXG4gIHsgdHlwZTogJ21vZGlmaWVkLXRvZGF5JywgZW5hYmxlZDogdHJ1ZSB9LFxuICB7IHR5cGU6ICd2YXVsdCcsIGVuYWJsZWQ6IHRydWUgfSxcbl07XG5cbmV4cG9ydCBjbGFzcyBQbHVnaW5TZXR0aW5ncyB7XG4gIHB1YmxpYyBob21lUGF0aCA9ICcnO1xuICBwdWJsaWMgbmV3Tm90ZUZvbGRlciA9ICcnO1xuICBwdWJsaWMgbmV3Tm90ZVRlbXBsYXRlID0gJyc7XG4gIHB1YmxpYyBjb250aW51ZUV4Y2x1ZGVkOiBzdHJpbmdbXSA9IFtdO1xuICBwdWJsaWMgcXVpY2tBY3Rpb25zOiBRdWlja0FjdGlvbltdID0gUVVJQ0tfQUNUSU9OX0RFRkFVTFRTLm1hcCgoYSkgPT4gKHsgLi4uYSB9KSk7XG4gIHB1YmxpYyBuZXdOb3RlRmlsZW5hbWVGb3JtYXQ6IE5ld05vdGVGaWxlbmFtZUZvcm1hdCA9ICd1bnRpdGxlZCc7XG4gIHB1YmxpYyBwdWxzZUNhcmRzOiBQdWxzZUNhcmRbXSA9IERFRkFVTFRfUFVMU0VfQ0FSRFMubWFwKChjKSA9PiAoeyAuLi5jIH0pKTtcbiAgcHVibGljIHNsaWNlczogU2xpY2VDb25maWdbXSA9IFtcbiAgICB7IGxhYmVsOiAnQ2FuY2VsJywgaWNvbjogJ1x1MjcxNScsIGFjdGlvbjogJ2NhbmNlbCcsIGNvbG9yOiAnIzY2NjY2NicsIHN0YXJ0QW5nbGU6IDAsIGVuZEFuZ2xlOiAxODAgfSxcbiAgICB7IGxhYmVsOiAnSG9tZScsIGljb246ICdcdTIzMDInLCBhY3Rpb246ICdob21lcGFnZScsIGNvbG9yOiAnIzNiODJmNicsIHN0YXJ0QW5nbGU6IDE4MCwgZW5kQW5nbGU6IDI3MCB9LFxuICAgIHsgbGFiZWw6ICdOZXcgTm90ZScsIGljb246ICcrJywgYWN0aW9uOiAnbmV3LW5vdGUnLCBjb2xvcjogJyMxMGI5ODEnLCBzdGFydEFuZ2xlOiAyNzAsIGVuZEFuZ2xlOiAzNjAgfSxcbiAgXTtcbiAgcHVibGljIGRhc2hib2FyZFdpZGdldHM6IERhc2hib2FyZFdpZGdldFtdID0gREFTSEJPQVJEX1BSRVNFVFMuZnVsbC53aWRnZXRzLm1hcCgodykgPT4gKHsgLi4udyB9KSk7XG59XG4iLCAiaW1wb3J0IHsgUGx1Z2luU2V0dGluZ3NNYW5hZ2VyQmFzZSB9IGZyb20gJ29ic2lkaWFuLWRldi11dGlscy9vYnNpZGlhbi9wbHVnaW4vcGx1Z2luLXNldHRpbmdzLW1hbmFnZXItYmFzZSc7XG5cbmltcG9ydCB0eXBlIHsgUGx1Z2luVHlwZXMgfSBmcm9tICcuL1BsdWdpblR5cGVzLnRzJztcblxuaW1wb3J0IHsgUGx1Z2luU2V0dGluZ3MgfSBmcm9tICcuL1BsdWdpblNldHRpbmdzLnRzJztcblxuZXhwb3J0IGNsYXNzIFBsdWdpblNldHRpbmdzTWFuYWdlciBleHRlbmRzIFBsdWdpblNldHRpbmdzTWFuYWdlckJhc2U8UGx1Z2luVHlwZXM+IHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGNyZWF0ZURlZmF1bHRTZXR0aW5ncygpOiBQbHVnaW5TZXR0aW5ncyB7XG4gICAgcmV0dXJuIG5ldyBQbHVnaW5TZXR0aW5ncygpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTm90aWNlLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgUGx1Z2luU2V0dGluZ3NUYWJCYXNlIH0gZnJvbSAnb2JzaWRpYW4tZGV2LXV0aWxzL29ic2lkaWFuL3BsdWdpbi9wbHVnaW4tc2V0dGluZ3MtdGFiLWJhc2UnO1xuXG5pbXBvcnQgdHlwZSB7IERhc2hib2FyZFdpZGdldCwgTmV3Tm90ZUZpbGVuYW1lRm9ybWF0LCBQdWxzZUNhcmQsIFF1aWNrQWN0aW9uLCBTbGljZUNvbmZpZyB9IGZyb20gJy4vUGx1Z2luU2V0dGluZ3MudHMnO1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5UeXBlcyB9IGZyb20gJy4vUGx1Z2luVHlwZXMudHMnO1xuXG5pbXBvcnQgeyBDb21tYW5kUGlja2VyTW9kYWwgfSBmcm9tICcuL01vZGFscy9Db21tYW5kUGlja2VyTW9kYWwudHMnO1xuaW1wb3J0IHsgREFTSEJPQVJEX1BSRVNFVFMsIERFRkFVTFRfUFVMU0VfQ0FSRFMsIFBVTFNFX0NBUkRfTEFCRUxTLCBRVUlDS19BQ1RJT05fREVGQVVMVFMsIFdJREdFVF9MQUJFTFMsIFBsdWdpblNldHRpbmdzIH0gZnJvbSAnLi9QbHVnaW5TZXR0aW5ncy50cyc7XG5cbmV4cG9ydCBjbGFzcyBQbHVnaW5TZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdzVGFiQmFzZTxQbHVnaW5UeXBlcz4ge1xuICBwdWJsaWMgb3ZlcnJpZGUgZGlzcGxheSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBjb25zdCBzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MgYXMgUGx1Z2luU2V0dGluZ3M7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0hvbWVwYWdlIGZpbGUgcGF0aCcpXG4gICAgICAuc2V0RGVzYygnUGF0aCB0byB5b3VyIGhvbWUgbm90ZSwgZS5nLiBcIkhvbWUubWRcIiBvciBcIk5vdGVzL0luZGV4Lm1kXCInKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignSG9tZS5tZCcpXG4gICAgICAgICAgLnNldFZhbHVlKHMuaG9tZVBhdGgpXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWwpID0+IHtcbiAgICAgICAgICAgIHMuaG9tZVBhdGggPSB2YWwudHJpbSgpO1xuICAgICAgICAgICAgdm9pZCB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2F2ZVRvRmlsZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ05ldyBub3RlIGZvbGRlcicpXG4gICAgICAuc2V0RGVzYygnRm9sZGVyIGZvciBuZXcgbm90ZXMuIExlYXZlIGJsYW5rIGZvciB2YXVsdCByb290LicpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdJbmJveCcpXG4gICAgICAgICAgLnNldFZhbHVlKHMubmV3Tm90ZUZvbGRlcilcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbCkgPT4ge1xuICAgICAgICAgICAgcy5uZXdOb3RlRm9sZGVyID0gdmFsLnRyaW0oKTtcbiAgICAgICAgICAgIHZvaWQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdOZXcgbm90ZSB0ZW1wbGF0ZScpXG4gICAgICAuc2V0RGVzYygnUGF0aCB0byBhIHRlbXBsYXRlIGZpbGUuIExlYXZlIGJsYW5rIGZvciBhbiBlbXB0eSBub3RlLiBJZiBUZW1wbGF0ZXIgaXMgaW5zdGFsbGVkLCBpdHMgc3ludGF4IHdpbGwgYmUgcHJvY2Vzc2VkLicpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdUZW1wbGF0ZXMvTmV3IE5vdGUubWQnKVxuICAgICAgICAgIC5zZXRWYWx1ZShzLm5ld05vdGVUZW1wbGF0ZSlcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbCkgPT4ge1xuICAgICAgICAgICAgcy5uZXdOb3RlVGVtcGxhdGUgPSB2YWwudHJpbSgpO1xuICAgICAgICAgICAgdm9pZCB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2F2ZVRvRmlsZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ05ldyBub3RlIGZpbGVuYW1lIGZvcm1hdCcpXG4gICAgICAuc2V0RGVzYygnVW50aXRsZWQgdXNlcyBcIlVudGl0bGVkIFlZWVktTU0tRERcIi4gWmV0dGVsa2FzdGVuIHVzZXMgYSAxNC1kaWdpdCB0aW1lc3RhbXAgSUQgKFlZWVlNTURESEhtbXNzKS4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkZCkgPT4ge1xuICAgICAgICBkZFxuICAgICAgICAgIC5hZGRPcHRpb24oJ3VudGl0bGVkJywgJ1VudGl0bGVkICsgZGF0ZScpXG4gICAgICAgICAgLmFkZE9wdGlvbignemV0dGVsa2FzdGVuJywgJ1pldHRlbGthc3RlbiBJRCAodW5pcXVlIG5vdGVzKScpXG4gICAgICAgICAgLnNldFZhbHVlKHMubmV3Tm90ZUZpbGVuYW1lRm9ybWF0KVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsKSA9PiB7XG4gICAgICAgICAgICBzLm5ld05vdGVGaWxlbmFtZUZvcm1hdCA9IHZhbCBhcyBOZXdOb3RlRmlsZW5hbWVGb3JtYXQ7XG4gICAgICAgICAgICB2b2lkIHRoaXMucGx1Z2luLnNldHRpbmdzTWFuYWdlci5zYXZlVG9GaWxlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnQ29udGludWUgXHUyMDE0IGV4Y2x1ZGVkIHBhdGhzJylcbiAgICAgIC5zZXREZXNjKCdGaWxlcyBvciBmb2xkZXJzIHRvIGhpZGUgZnJvbSB0aGUgQ29udGludWUgbGlzdC4gT25lIHBhdGggcGVyIGxpbmUuIEZvbGRlcnMgc2hvdWxkIGVuZCB3aXRoIC8uJylcbiAgICAgIC5hZGRUZXh0QXJlYSgodCkgPT4ge1xuICAgICAgICB0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdNZXRhL0hvbWUubWRcXG5UZW1wbGF0ZXMvJylcbiAgICAgICAgICAuc2V0VmFsdWUoKHMuY29udGludWVFeGNsdWRlZCA/PyBbXSkuam9pbignXFxuJykpXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWwpID0+IHtcbiAgICAgICAgICAgIHMuY29udGludWVFeGNsdWRlZCA9IHZhbC5zcGxpdCgnXFxuJykubWFwKChwKSA9PiBwLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICAgICAgdm9pZCB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2F2ZVRvRmlsZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwucm93cyA9IDQ7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJEYXNoYm9hcmRTZWN0aW9uKHMpO1xuICAgIHRoaXMucmVuZGVyUHVsc2VDYXJkc1NlY3Rpb24ocyk7XG4gICAgdGhpcy5yZW5kZXJRdWlja0FjdGlvbnNTZWN0aW9uKHMpO1xuXG4gICAgdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdTbGljZXMnIH0pO1xuICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoJ3AnLCB7XG4gICAgICBjbHM6ICdzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb24nLFxuICAgICAgdGV4dDogJ0FuZ2xlcyB1c2UgU1ZHIHNjcmVlbiBjb29yZGluYXRlczogMFx1MDBCMD1yaWdodCwgOTBcdTAwQjA9Ym90dG9tLCAxODBcdTAwQjA9bGVmdCwgMjcwXHUwMEIwPXRvcC4gRGVmYXVsdCBsYXlvdXQ6IGJvdHRvbSBoYWxmICgwXHUyMTkyMTgwKSA9IGNhbmNlbCwgdG9wLWxlZnQgKDE4MFx1MjE5MjI3MCkgPSBob21lLCB0b3AtcmlnaHQgKDI3MFx1MjE5MjM2MCkgPSBuZXcgbm90ZS4nLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2xpY2VzID0gcy5zbGljZXMgYXMgU2xpY2VDb25maWdbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5yZW5kZXJTbGljZShzbGljZXMsIGkpO1xuICAgIH1cblxuICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAuYWRkQnV0dG9uKChidG4pID0+IHtcbiAgICAgICAgYnRuLnNldEJ1dHRvblRleHQoJ0FkZCBzbGljZScpLnNldEN0YSgpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgIHNsaWNlcy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiAnTmV3IFNsaWNlJyxcbiAgICAgICAgICAgIGljb246ICdcdTI2MDUnLFxuICAgICAgICAgICAgYWN0aW9uOiAnY2FuY2VsJyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzg4ODg4OCcsXG4gICAgICAgICAgICBzdGFydEFuZ2xlOiAwLFxuICAgICAgICAgICAgZW5kQW5nbGU6IDkwLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZvaWQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmFkZEJ1dHRvbigoYnRuKSA9PiB7XG4gICAgICAgIGJ0bi5zZXRCdXR0b25UZXh0KCdSZXNldCB0byBkZWZhdWx0cycpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICh0aGlzLnBsdWdpbi5zZXR0aW5ncyBhcyBQbHVnaW5TZXR0aW5ncykuc2xpY2VzID0gbmV3IFBsdWdpblNldHRpbmdzKCkuc2xpY2VzO1xuICAgICAgICAgIHZvaWQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU2xpY2Uoc2xpY2VzOiBTbGljZUNvbmZpZ1tdLCBpOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBzbGljZSA9IHNsaWNlc1tpXTtcbiAgICBpZiAoIXNsaWNlKSByZXR1cm47XG5cbiAgICBjb25zdCBzYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGhpcy52YWxpZGF0ZUFuZ2xlcyhzbGljZXMpO1xuICAgICAgdm9pZCB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2F2ZVRvRmlsZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoNCcsIHsgdGV4dDogYFNsaWNlICR7aSArIDF9OiAke3NsaWNlLmxhYmVsfWAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0xhYmVsJylcbiAgICAgIC5hZGRUZXh0KCh0KSA9PiB7IHQuc2V0VmFsdWUoc2xpY2UubGFiZWwpLm9uQ2hhbmdlKCh2KSA9PiB7IHNsaWNlLmxhYmVsID0gdjsgc2F2ZSgpOyB9KTsgfSk7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0ljb24nKVxuICAgICAgLnNldERlc2MoJ0Vtb2ppIG9yIHNpbmdsZSBjaGFyYWN0ZXInKVxuICAgICAgLmFkZFRleHQoKHQpID0+IHsgdC5zZXRWYWx1ZShzbGljZS5pY29uKS5vbkNoYW5nZSgodikgPT4geyBzbGljZS5pY29uID0gdjsgc2F2ZSgpOyB9KTsgfSk7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0FjdGlvbicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRkKSA9PiB7XG4gICAgICAgIGRkXG4gICAgICAgICAgLmFkZE9wdGlvbignY2FuY2VsJywgJ0NhbmNlbCAoY2xvc2UgbWVudSknKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2Rhc2hib2FyZCcsICdPcGVuIGRhc2hib2FyZCcpXG4gICAgICAgICAgLmFkZE9wdGlvbignaG9tZXBhZ2UnLCAnT3BlbiBob21lcGFnZScpXG4gICAgICAgICAgLmFkZE9wdGlvbignbmV3LW5vdGUnLCAnQ3JlYXRlIG5ldyBub3RlJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdjb21tYW5kJywgJ1J1biBPYnNpZGlhbiBjb21tYW5kJylcbiAgICAgICAgICAuc2V0VmFsdWUoc2xpY2UuYWN0aW9uKVxuICAgICAgICAgIC5vbkNoYW5nZSgodikgPT4ge1xuICAgICAgICAgICAgc2xpY2UuYWN0aW9uID0gdiBhcyBTbGljZUNvbmZpZ1snYWN0aW9uJ107XG4gICAgICAgICAgICBzYXZlKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHNsaWNlLmFjdGlvbiA9PT0gJ2NvbW1hbmQnKSB7XG4gICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZSgnQ29tbWFuZCcpXG4gICAgICAgIC5zZXREZXNjKHNsaWNlLmNvbW1hbmRJZCA/IGBJRDogJHtzbGljZS5jb21tYW5kSWR9YCA6ICdObyBjb21tYW5kIHNlbGVjdGVkJylcbiAgICAgICAgLmFkZEJ1dHRvbigoYnRuKSA9PiB7XG4gICAgICAgICAgYnRuXG4gICAgICAgICAgICAuc2V0QnV0dG9uVGV4dChzbGljZS5jb21tYW5kSWQgPyAnQ2hhbmdlXHUyMDI2JyA6ICdDaG9vc2UgY29tbWFuZFx1MjAyNicpXG4gICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgIG5ldyBDb21tYW5kUGlja2VyTW9kYWwodGhpcy5hcHAsIChjbWQpID0+IHtcbiAgICAgICAgICAgICAgICBzbGljZS5jb21tYW5kSWQgPSBjbWQuaWQ7XG4gICAgICAgICAgICAgICAgc2F2ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICB9KS5vcGVuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdBbmdsZXMnKVxuICAgICAgLnNldERlc2MoJ1N0YXJ0IGFuZ2xlIFx1MjE5MiBlbmQgYW5nbGUgaW4gZGVncmVlcycpXG4gICAgICAuYWRkVGV4dCgodCkgPT4ge1xuICAgICAgICB0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdTdGFydCcpXG4gICAgICAgICAgLnNldFZhbHVlKFN0cmluZyhzbGljZS5zdGFydEFuZ2xlKSlcbiAgICAgICAgICAub25DaGFuZ2UoKHYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG4gPSBOdW1iZXIodik7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKG4pKSB7IHNsaWNlLnN0YXJ0QW5nbGUgPSBuOyBzYXZlKCk7IH1cbiAgICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAuYWRkVGV4dCgodCkgPT4ge1xuICAgICAgICB0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdFbmQnKVxuICAgICAgICAgIC5zZXRWYWx1ZShTdHJpbmcoc2xpY2UuZW5kQW5nbGUpKVxuICAgICAgICAgIC5vbkNoYW5nZSgodikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbiA9IE51bWJlcih2KTtcbiAgICAgICAgICAgIGlmICghaXNOYU4obikpIHsgc2xpY2UuZW5kQW5nbGUgPSBuOyBzYXZlKCk7IH1cbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdDb2xvcicpXG4gICAgICAuYWRkQ29sb3JQaWNrZXIoKGNwKSA9PiB7IGNwLnNldFZhbHVlKHNsaWNlLmNvbG9yKS5vbkNoYW5nZSgodikgPT4geyBzbGljZS5jb2xvciA9IHY7IHNhdmUoKTsgfSk7IH0pXG4gICAgICAuYWRkQnV0dG9uKChidG4pID0+IHtcbiAgICAgICAgYnRuLnNldEJ1dHRvblRleHQoJ1JlbW92ZScpLnNldFdhcm5pbmcoKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICBzbGljZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIHZvaWQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoJ2hyJyk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckRhc2hib2FyZFNlY3Rpb24oczogUGx1Z2luU2V0dGluZ3MpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ0Rhc2hib2FyZCcgfSk7XG5cbiAgICAvLyBQcmVzZXRzIHJvd1xuICAgIGNvbnN0IHByZXNldFNldHRpbmcgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1ByZXNldHMnKVxuICAgICAgLnNldERlc2MoJ0FwcGx5IGEgcHJlc2V0IHdpZGdldCBsYXlvdXQuJyk7XG5cbiAgICBjb25zdCBwcmVzZXRzID0gT2JqZWN0LnZhbHVlcyhEQVNIQk9BUkRfUFJFU0VUUykgYXMgQXJyYXk8eyBsYWJlbDogc3RyaW5nOyB3aWRnZXRzOiBEYXNoYm9hcmRXaWRnZXRbXSB9PjtcbiAgICBmb3IgKGNvbnN0IHByZXNldCBvZiBwcmVzZXRzKSB7XG4gICAgICBwcmVzZXRTZXR0aW5nLmFkZEJ1dHRvbigoYnRuKSA9PiB7XG4gICAgICAgIGJ0bi5zZXRCdXR0b25UZXh0KHByZXNldC5sYWJlbCkub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgcy5kYXNoYm9hcmRXaWRnZXRzID0gcHJlc2V0LndpZGdldHMubWFwKCh3KSA9PiAoeyB0eXBlOiB3LnR5cGUsIGVuYWJsZWQ6IHcuZW5hYmxlZCB9KSk7XG4gICAgICAgICAgdm9pZCB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2F2ZVRvRmlsZSgpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFBlci13aWRnZXQgY29udHJvbHMgKG9yZGVyZWQpXG4gICAgY29uc3Qgd2lkZ2V0cyA9IHMuZGFzaGJvYXJkV2lkZ2V0cyBhcyBEYXNoYm9hcmRXaWRnZXRbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpZGdldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHdpZGdldCA9IHdpZGdldHNbaV07XG4gICAgICBpZiAoIXdpZGdldCkgY29udGludWU7XG5cbiAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFdJREdFVF9MQUJFTFNbd2lkZ2V0LnR5cGVdKVxuICAgICAgICAuYWRkVG9nZ2xlKCh0KSA9PiB7XG4gICAgICAgICAgdC5zZXRWYWx1ZSh3aWRnZXQuZW5hYmxlZCkub25DaGFuZ2UoKHYpID0+IHtcbiAgICAgICAgICAgIHdpZGdldC5lbmFibGVkID0gdjtcbiAgICAgICAgICAgIHZvaWQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidG4pID0+IHtcbiAgICAgICAgICBidG4uc2V0SWNvbignYXJyb3ctdXAnKS5zZXRUb29sdGlwKCdNb3ZlIHVwJykub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgcHJldiA9IHdpZGdldHNbaSAtIDFdO1xuICAgICAgICAgIGNvbnN0IGN1cnIgPSB3aWRnZXRzW2ldO1xuICAgICAgICAgIGlmIChwcmV2ICYmIGN1cnIpIHsgd2lkZ2V0c1tpIC0gMV0gPSBjdXJyOyB3aWRnZXRzW2ldID0gcHJldjsgfVxuICAgICAgICAgICAgdm9pZCB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2F2ZVRvRmlsZSgpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnRuKSA9PiB7XG4gICAgICAgICAgYnRuLnNldEljb24oJ2Fycm93LWRvd24nKS5zZXRUb29sdGlwKCdNb3ZlIGRvd24nKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIGlmIChpID09PSB3aWRnZXRzLmxlbmd0aCAtIDEpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSB3aWRnZXRzW2kgKyAxXTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnIgPSB3aWRnZXRzW2ldO1xuICAgICAgICAgICAgaWYgKG5leHQgJiYgY3VycikgeyB3aWRnZXRzW2kgKyAxXSA9IGN1cnI7IHdpZGdldHNbaV0gPSBuZXh0OyB9XG4gICAgICAgICAgICB2b2lkIHRoaXMucGx1Z2luLnNldHRpbmdzTWFuYWdlci5zYXZlVG9GaWxlKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJQdWxzZUNhcmRzU2VjdGlvbihzOiBQbHVnaW5TZXR0aW5ncyk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gzJywgeyB0ZXh0OiAnUHVsc2UgQ2FyZHMnIH0pO1xuICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoJ3AnLCB7XG4gICAgICBjbHM6ICdzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb24nLFxuICAgICAgdGV4dDogJ0NhcmRzIHNob3duIGJlbG93IHRoZSBkYXRlIGhlYWRlci4gVHJhc2ggb25seSBhcHBlYXJzIHdoZW4gdGhlcmUgYXJlIHN0YWxlIG5vdGVzLiBRdWljayBBY3Rpb24gY2FyZHMgdXNlIGFueSBhY3Rpb24gZnJvbSB5b3VyIFF1aWNrIEFjdGlvbnMgbGlzdC4nLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2FyZHMgPSBzLnB1bHNlQ2FyZHMgYXMgUHVsc2VDYXJkW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjYXJkID0gY2FyZHNbaV07XG4gICAgICBpZiAoIWNhcmQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2F2ZSA9ICgpOiB2b2lkID0+IHsgdm9pZCB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2F2ZVRvRmlsZSgpOyB9O1xuXG4gICAgICBjb25zdCBzZXR0aW5nID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoY2FyZC50eXBlID09PSAncXVpY2stYWN0aW9uJyAmJiBjYXJkLnF1aWNrQWN0aW9uID8gY2FyZC5xdWlja0FjdGlvbi5sYWJlbCA6IFBVTFNFX0NBUkRfTEFCRUxTW2NhcmQudHlwZV0pXG4gICAgICAgIC5hZGRUb2dnbGUoKHQpID0+IHsgdC5zZXRWYWx1ZShjYXJkLmVuYWJsZWQpLm9uQ2hhbmdlKCh2KSA9PiB7IGNhcmQuZW5hYmxlZCA9IHY7IHNhdmUoKTsgfSk7IH0pXG4gICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnRuKSA9PiB7XG4gICAgICAgICAgYnRuLnNldEljb24oJ2Fycm93LXVwJykuc2V0VG9vbHRpcCgnTW92ZSB1cCcpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGkgPT09IDApIHJldHVybjtcbiAgICAgICAgICAgIFtjYXJkc1tpIC0gMV0sIGNhcmRzW2ldXSA9IFtjYXJkc1tpXSEsIGNhcmRzW2kgLSAxXSFdO1xuICAgICAgICAgICAgc2F2ZSgpOyB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidG4pID0+IHtcbiAgICAgICAgICBidG4uc2V0SWNvbignYXJyb3ctZG93bicpLnNldFRvb2x0aXAoJ01vdmUgZG93bicpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGkgPT09IGNhcmRzLmxlbmd0aCAtIDEpIHJldHVybjtcbiAgICAgICAgICAgIFtjYXJkc1tpICsgMV0sIGNhcmRzW2ldXSA9IFtjYXJkc1tpXSEsIGNhcmRzW2kgKyAxXSFdO1xuICAgICAgICAgICAgc2F2ZSgpOyB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmFkZEJ1dHRvbigoYnRuKSA9PiB7XG4gICAgICAgICAgYnRuLnNldEJ1dHRvblRleHQoJ1JlbW92ZScpLnNldFdhcm5pbmcoKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIGNhcmRzLnNwbGljZShpLCAxKTsgc2F2ZSgpOyB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChjYXJkLnR5cGUgPT09ICdxdWljay1hY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGNhcmQucXVpY2tBY3Rpb247XG4gICAgICAgIHNldHRpbmcuc2V0RGVzYyhhY3Rpb24gPyBgJHthY3Rpb24uYWN0aW9ufSR7YWN0aW9uLmNvbW1hbmRJZCA/IGAgXHUwMEI3ICR7YWN0aW9uLmNvbW1hbmRJZH1gIDogJyd9YCA6ICdOb3QgY29uZmlndXJlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAuYWRkRHJvcGRvd24oKGRkKSA9PiB7XG4gICAgICAgIGRkXG4gICAgICAgICAgLmFkZE9wdGlvbignZGFpbHktbm90ZScsIFBVTFNFX0NBUkRfTEFCRUxTWydkYWlseS1ub3RlJ10pXG4gICAgICAgICAgLmFkZE9wdGlvbignbW9kaWZpZWQtdG9kYXknLCBQVUxTRV9DQVJEX0xBQkVMU1snbW9kaWZpZWQtdG9kYXknXSlcbiAgICAgICAgICAuYWRkT3B0aW9uKCd2YXVsdCcsIFBVTFNFX0NBUkRfTEFCRUxTWyd2YXVsdCddKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3RyYXNoJywgUFVMU0VfQ0FSRF9MQUJFTFNbJ3RyYXNoJ10pXG4gICAgICAgICAgLmFkZE9wdGlvbigncXVpY2stYWN0aW9uJywgUFVMU0VfQ0FSRF9MQUJFTFNbJ3F1aWNrLWFjdGlvbiddKTtcbiAgICAgICAgZGQub25DaGFuZ2UoKHZhbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSB2YWwgYXMgUHVsc2VDYXJkWyd0eXBlJ107XG4gICAgICAgICAgaWYgKHR5cGUgPT09ICdxdWljay1hY3Rpb24nKSB7XG4gICAgICAgICAgICBjYXJkcy5wdXNoKHsgdHlwZSwgZW5hYmxlZDogdHJ1ZSwgcXVpY2tBY3Rpb246IHsgbGFiZWw6ICdBY3Rpb24nLCBpY29uOiAnemFwJywgYWN0aW9uOiAnbmV3LW5vdGUnIH0gfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhcmRzLnB1c2goeyB0eXBlLCBlbmFibGVkOiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2b2lkIHRoaXMucGx1Z2luLnNldHRpbmdzTWFuYWdlci5zYXZlVG9GaWxlKCk7IHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGQuc2V0VmFsdWUoJ2RhaWx5LW5vdGUnKTtcbiAgICAgIH0pXG4gICAgICAuYWRkQnV0dG9uKChidG4pID0+IHtcbiAgICAgICAgYnRuLnNldEJ1dHRvblRleHQoJ1Jlc2V0Jykub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgcy5wdWxzZUNhcmRzID0gREVGQVVMVF9QVUxTRV9DQVJEUy5tYXAoKGMpID0+ICh7IC4uLmMgfSkpO1xuICAgICAgICAgIHZvaWQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoKTsgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclF1aWNrQWN0aW9uc1NlY3Rpb24oczogUGx1Z2luU2V0dGluZ3MpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ1F1aWNrIEFjdGlvbnMnIH0pO1xuICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoJ3AnLCB7XG4gICAgICBjbHM6ICdzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb24nLFxuICAgICAgdGV4dDogJ0J1dHRvbnMgc2hvd24gaW4gdGhlIGRhc2hib2FyZCBRdWljayBBY3Rpb25zIHNlY3Rpb24uIFwiQXBwZW5kIHRvIG5vdGVcIiBvcGVucyBhIHRleHQgcHJvbXB0IGFuZCBhcHBlbmRzIHRoZSByZXN1bHQgdG8gYSBzcGVjaWZpZWQgbm90ZSB1c2luZyBhIHRlbXBsYXRlICh7e3RleHR9fSBpcyByZXBsYWNlZCB3aXRoIHdoYXQgeW91IHR5cGUpLicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhY3Rpb25zID0gcy5xdWlja0FjdGlvbnMgYXMgUXVpY2tBY3Rpb25bXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5yZW5kZXJRdWlja0FjdGlvbihzLCBhY3Rpb25zLCBpKTtcbiAgICB9XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgLmFkZEJ1dHRvbigoYnRuKSA9PiB7XG4gICAgICAgIGJ0bi5zZXRCdXR0b25UZXh0KCdBZGQgYWN0aW9uJykuc2V0Q3RhKCkub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHsgbGFiZWw6ICdOZXcgQWN0aW9uJywgaWNvbjogJ3phcCcsIGFjdGlvbjogJ2NvbW1hbmQnIH0pO1xuICAgICAgICAgIHZvaWQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmFkZEJ1dHRvbigoYnRuKSA9PiB7XG4gICAgICAgIGJ0bi5zZXRCdXR0b25UZXh0KCdSZXNldCB0byBkZWZhdWx0cycpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgIHMucXVpY2tBY3Rpb25zID0gUVVJQ0tfQUNUSU9OX0RFRkFVTFRTLm1hcCgoYSkgPT4gKHsgLi4uYSB9KSk7XG4gICAgICAgICAgdm9pZCB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2F2ZVRvRmlsZSgpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJRdWlja0FjdGlvbihfczogUGx1Z2luU2V0dGluZ3MsIGFjdGlvbnM6IFF1aWNrQWN0aW9uW10sIGk6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGFjdGlvbiA9IGFjdGlvbnNbaV07XG4gICAgaWYgKCFhY3Rpb24pIHJldHVybjtcblxuICAgIGNvbnN0IHNhdmUgPSAoKTogdm9pZCA9PiB7IHZvaWQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoKTsgfTtcblxuICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoJ2g0JywgeyB0ZXh0OiBgQWN0aW9uICR7aSArIDF9OiAke2FjdGlvbi5sYWJlbH1gIH0pO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdMYWJlbCcpXG4gICAgICAuYWRkVGV4dCgodCkgPT4geyB0LnNldFZhbHVlKGFjdGlvbi5sYWJlbCkub25DaGFuZ2UoKHYpID0+IHsgYWN0aW9uLmxhYmVsID0gdjsgc2F2ZSgpOyB9KTsgfSk7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0ljb24nKVxuICAgICAgLnNldERlc2MoJ0x1Y2lkZSBpY29uIG5hbWUgXHUyMDE0IGJyb3dzZSBhdCBsdWNpZGUuZGV2JylcbiAgICAgIC5hZGRUZXh0KCh0KSA9PiB7IHQuc2V0UGxhY2Vob2xkZXIoJ3phcCcpLnNldFZhbHVlKGFjdGlvbi5pY29uKS5vbkNoYW5nZSgodikgPT4geyBhY3Rpb24uaWNvbiA9IHY7IHNhdmUoKTsgfSk7IH0pO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdBY3Rpb24gdHlwZScpXG4gICAgICAuYWRkRHJvcGRvd24oKGRkKSA9PiB7XG4gICAgICAgIGRkXG4gICAgICAgICAgLmFkZE9wdGlvbignbmV3LW5vdGUnLCAnQ3JlYXRlIG5ldyBub3RlJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdob21lcGFnZScsICdPcGVuIGhvbWVwYWdlJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdjb21tYW5kJywgJ1J1biBjb21tYW5kJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdhcHBlbmQtdG8tbm90ZScsICdBcHBlbmQgdG8gbm90ZScpXG4gICAgICAgICAgLnNldFZhbHVlKGFjdGlvbi5hY3Rpb24pXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2KSA9PiB7XG4gICAgICAgICAgICBhY3Rpb24uYWN0aW9uID0gdiBhcyBRdWlja0FjdGlvblsnYWN0aW9uJ107XG4gICAgICAgICAgICBzYXZlKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKGFjdGlvbi5hY3Rpb24gPT09ICdjb21tYW5kJykge1xuICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoJ0NvbW1hbmQnKVxuICAgICAgICAuc2V0RGVzYyhhY3Rpb24uY29tbWFuZElkID8gYElEOiAke2FjdGlvbi5jb21tYW5kSWR9YCA6ICdObyBjb21tYW5kIHNlbGVjdGVkJylcbiAgICAgICAgLmFkZEJ1dHRvbigoYnRuKSA9PiB7XG4gICAgICAgICAgYnRuLnNldEJ1dHRvblRleHQoYWN0aW9uLmNvbW1hbmRJZCA/ICdDaGFuZ2VcdTIwMjYnIDogJ0Nob29zZSBjb21tYW5kXHUyMDI2Jykub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICBuZXcgQ29tbWFuZFBpY2tlck1vZGFsKHRoaXMuYXBwLCAoY21kKSA9PiB7XG4gICAgICAgICAgICAgIGFjdGlvbi5jb21tYW5kSWQgPSBjbWQuaWQ7XG4gICAgICAgICAgICAgIHNhdmUoKTtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9KS5vcGVuKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhY3Rpb24uYWN0aW9uID09PSAnYXBwZW5kLXRvLW5vdGUnKSB7XG4gICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZSgnVGFyZ2V0IG5vdGUnKVxuICAgICAgICAuc2V0RGVzYygnUGF0aCB0byB0aGUgbm90ZSB0byBhcHBlbmQgdG8sIGUuZy4gXCJJbmJveC9UYXNrcy5tZFwiJylcbiAgICAgICAgLmFkZFRleHQoKHQpID0+IHtcbiAgICAgICAgICB0LnNldFBsYWNlaG9sZGVyKCdJbmJveC9UYXNrcy5tZCcpLnNldFZhbHVlKGFjdGlvbi5ub3RlUGF0aCA/PyAnJykub25DaGFuZ2UoKHYpID0+IHtcbiAgICAgICAgICAgIGFjdGlvbi5ub3RlUGF0aCA9IHYudHJpbSgpO1xuICAgICAgICAgICAgc2F2ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoJ0FwcGVuZCB0ZW1wbGF0ZScpXG4gICAgICAgIC5zZXREZXNjKCdUZXh0IHRvIGFwcGVuZC4ge3t0ZXh0fX0gaXMgcmVwbGFjZWQgd2l0aCB5b3VyIGlucHV0LiBEZWZhdWx0OiB7e3RleHR9fScpXG4gICAgICAgIC5hZGRUZXh0KCh0KSA9PiB7XG4gICAgICAgICAgdC5zZXRQbGFjZWhvbGRlcignLSBbIF0ge3t0ZXh0fX0nKS5zZXRWYWx1ZShhY3Rpb24uYXBwZW5kVGVtcGxhdGUgPz8gJycpLm9uQ2hhbmdlKCh2KSA9PiB7XG4gICAgICAgICAgICBhY3Rpb24uYXBwZW5kVGVtcGxhdGUgPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIHNhdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgIC5hZGRCdXR0b24oKGJ0bikgPT4ge1xuICAgICAgICBidG4uc2V0QnV0dG9uVGV4dCgnUmVtb3ZlJykuc2V0V2FybmluZygpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgIGFjdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIHZvaWQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoJ2hyJyk7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlQW5nbGVzKHNsaWNlczogU2xpY2VDb25maWdbXSk6IHZvaWQge1xuICAgIGZvciAoY29uc3Qgc2xpY2Ugb2Ygc2xpY2VzKSB7XG4gICAgICBpZiAoc2xpY2Uuc3RhcnRBbmdsZSA+PSBzbGljZS5lbmRBbmdsZSkge1xuICAgICAgICBuZXcgTm90aWNlKGBTbGljZSBcIiR7c2xpY2UubGFiZWx9XCI6IHN0YXJ0IGFuZ2xlIG11c3QgYmUgbGVzcyB0aGFuIGVuZCBhbmdsZS5gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBzbGljZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgYSA9IHNsaWNlc1tpXTtcbiAgICAgICAgY29uc3QgYiA9IHNsaWNlc1tqXTtcbiAgICAgICAgaWYgKCFhIHx8ICFiKSBjb250aW51ZTtcbiAgICAgICAgaWYgKGEuc3RhcnRBbmdsZSA8IGIuZW5kQW5nbGUgJiYgYi5zdGFydEFuZ2xlIDwgYS5lbmRBbmdsZSkge1xuICAgICAgICAgIG5ldyBOb3RpY2UoYFNsaWNlcyBcIiR7YS5sYWJlbH1cIiBhbmQgXCIke2IubGFiZWx9XCIgb3ZlcmxhcC4gQWRqdXN0IHRoZWlyIGFuZ2xlcy5gKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIFRoaXMgbW9kdWxlIGRlZmluZXMgYSBiYXNlIGNsYXNzIGZvciBjcmVhdGluZyBwbHVnaW4gc2V0dGluZyB0YWJzIGluIE9ic2lkaWFuLlxuICogSXQgcHJvdmlkZXMgYSB1dGlsaXR5IG1ldGhvZCB0byBiaW5kIHZhbHVlIGNvbXBvbmVudHMgdG8gcGx1Z2luIHNldHRpbmdzIGFuZCBoYW5kbGUgY2hhbmdlcy5cbiAqL1xuXG4vKiB2OCBpZ25vcmUgc3RhcnQgLS0gRGVlcGx5IGNvdXBsZWQgdG8gT2JzaWRpYW4gcnVudGltZTsgcmVxdWlyZXMgcnVubmluZyB2YXVsdCBmb3IgbWVhbmluZ2Z1bCB0ZXN0aW5nLiAqL1xuXG5pbXBvcnQgdHlwZSB7IERlYm91bmNlciB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHtcbiAgQ29uZGl0aW9uYWxLZXlzLFxuICBQcm9taXNhYmxlLFxuICBSZWFkb25seURlZXBcbn0gZnJvbSAndHlwZS1mZXN0JztcblxuaW1wb3J0IHtcbiAgZGVib3VuY2UsXG4gIFBsdWdpblNldHRpbmdUYWIsXG4gIHNldFRvb2x0aXBcbn0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgdHlwZSB7IEFzeW5jRXZlbnRSZWYgfSBmcm9tICcuLi8uLi9hc3luYy1ldmVudHMudHMnO1xuaW1wb3J0IHR5cGUgeyBTdHJpbmdLZXlzIH0gZnJvbSAnLi4vLi4vdHlwZS50cyc7XG5pbXBvcnQgdHlwZSB7IFZhbHVlQ29tcG9uZW50V2l0aENoYW5nZVRyYWNraW5nIH0gZnJvbSAnLi4vY29tcG9uZW50cy9zZXR0aW5nLWNvbXBvbmVudHMvdmFsdWUtY29tcG9uZW50LXdpdGgtY2hhbmdlLXRyYWNraW5nLnRzJztcbmltcG9ydCB0eXBlIHsgVmFsaWRhdGlvbk1lc3NhZ2VIb2xkZXIgfSBmcm9tICcuLi92YWxpZGF0aW9uLnRzJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgLS0gV2UgbmVlZCB0byBpbXBvcnQgYFBsdWdpblNldHRpbmdzTWFuYWdlckJhc2VgIHRvIHVzZSBpdCBpbiB0aGUgdHNkb2NzLlxuaW1wb3J0IHR5cGUgeyBQbHVnaW5TZXR0aW5nc01hbmFnZXJCYXNlIH0gZnJvbSAnLi9wbHVnaW4tc2V0dGluZ3MtbWFuYWdlci1iYXNlLnRzJztcbmltcG9ydCB0eXBlIHtcbiAgRXh0cmFjdFBsdWdpbixcbiAgRXh0cmFjdFBsdWdpblNldHRpbmdzLFxuICBFeHRyYWN0UGx1Z2luU2V0dGluZ3NQcm9wZXJ0eU5hbWVzLFxuICBFeHRyYWN0UmVhZG9ubHlQbHVnaW5TZXR0aW5nc1dyYXBwZXIsXG4gIFBsdWdpblR5cGVzQmFzZVxufSBmcm9tICcuL3BsdWdpbi10eXBlcy1iYXNlLnRzJztcblxuaW1wb3J0IHtcbiAgY29udmVydEFzeW5jVG9TeW5jLFxuICBpbnZva2VBc3luY1NhZmVseVxufSBmcm9tICcuLi8uLi9hc3luYy50cyc7XG5pbXBvcnQgeyBDc3NDbGFzcyB9IGZyb20gJy4uLy4uL2Nzcy1jbGFzcy50cyc7XG5pbXBvcnQge1xuICBub29wLFxuICBub29wQXN5bmNcbn0gZnJvbSAnLi4vLi4vZnVuY3Rpb24udHMnO1xuaW1wb3J0IHsgZGVlcEVxdWFsIH0gZnJvbSAnLi4vLi4vb2JqZWN0LXV0aWxzLnRzJztcbmltcG9ydCB7IEFzeW5jRXZlbnRzQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9hc3luYy1ldmVudHMtY29tcG9uZW50LnRzJztcbmltcG9ydCB7IGVuc3VyZVdyYXBwZWQgfSBmcm9tICcuLi9jb21wb25lbnRzL3NldHRpbmctY29tcG9uZW50cy9zZXR0aW5nLWNvbXBvbmVudC13cmFwcGVyLnRzJztcbmltcG9ydCB7IGdldFRleHRCYXNlZENvbXBvbmVudFZhbHVlIH0gZnJvbSAnLi4vY29tcG9uZW50cy9zZXR0aW5nLWNvbXBvbmVudHMvdGV4dC1iYXNlZC1jb21wb25lbnQudHMnO1xuaW1wb3J0IHsgZ2V0VmFsaWRhdG9yQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9zZXR0aW5nLWNvbXBvbmVudHMvdmFsaWRhdG9yLWNvbXBvbmVudC50cyc7XG5pbXBvcnQgeyBpc1ZhbGlkYXRpb25NZXNzYWdlSG9sZGVyIH0gZnJvbSAnLi4vdmFsaWRhdGlvbi50cyc7XG5pbXBvcnQgeyBhZGRQbHVnaW5Dc3NDbGFzc2VzIH0gZnJvbSAnLi9wbHVnaW4tY29udGV4dC50cyc7XG5cbi8qKlxuICogQSBjb250ZXh0IHBhc3NlZCB0byB0aGUge0BsaW5rIFBsdWdpblNldHRpbmdzTWFuYWdlckJhc2Uuc2F2ZVRvRmlsZX0gbWV0aG9kLlxuICovXG5leHBvcnQgY29uc3QgU0FWRV9UT19GSUxFX0NPTlRFWFQgPSAnUGx1Z2luU2V0dGluZ3NUYWInO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGBQbHVnaW5TZXR0aW5nc1RhYkJhc2UuYmluZGAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQmluZE9wdGlvbnM8VD4ge1xuICAvKipcbiAgICogQSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSB2YWx1ZSBvZiB0aGUgY29tcG9uZW50IGNoYW5nZXMuXG4gICAqL1xuICByZWFkb25seSBvbkNoYW5nZWQ/OiAobmV3VmFsdWU6IFJlYWRvbmx5RGVlcDxUPiwgb2xkVmFsdWU6IFJlYWRvbmx5RGVlcDxUPikgPT4gUHJvbWlzYWJsZTx2b2lkPjtcblxuICAvKipcbiAgICogV2hldGhlciB0byByZXNldCB0aGUgc2V0dGluZyB3aGVuIHRoZSBjb21wb25lbnQgdmFsdWUgaXMgZW1wdHkuIERlZmF1bHQgaXMgYHRydWVgLlxuICAgKiBBcHBsaWNhYmxlIG9ubHkgdG8gdGV4dC1iYXNlZCBjb21wb25lbnRzLlxuICAgKi9cbiAgcmVhZG9ubHkgc2hvdWxkUmVzZXRTZXR0aW5nV2hlbkNvbXBvbmVudElzRW1wdHk/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHNob3cgdGhlIHBsYWNlaG9sZGVyIGZvciBkZWZhdWx0IHZhbHVlcy4gRGVmYXVsdCBpcyBgdHJ1ZWAuXG4gICAqIEFwcGxpY2FibGUgb25seSB0byB0ZXh0LWJhc2VkIGNvbXBvbmVudHMuXG4gICAqL1xuICByZWFkb25seSBzaG91bGRTaG93UGxhY2Vob2xkZXJGb3JEZWZhdWx0VmFsdWVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBzaG93IHRoZSB2YWxpZGF0aW9uIG1lc3NhZ2Ugd2hlbiB0aGUgY29tcG9uZW50IHZhbHVlIGlzIGludmFsaWQuIERlZmF1bHQgaXMgYHRydWVgLlxuICAgKi9cbiAgcmVhZG9ubHkgc2hvdWxkU2hvd1ZhbGlkYXRpb25NZXNzYWdlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBFeHRlbmRlZCBvcHRpb25zIGZvciBgUGx1Z2luU2V0dGluZ3NUYWJCYXNlLmJpbmRgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJpbmRPcHRpb25zRXh0ZW5kZWQ8XG4gIFBsdWdpblNldHRpbmdzIGV4dGVuZHMgb2JqZWN0LFxuICBVSVZhbHVlLFxuICBQcm9wZXJ0eU5hbWUgZXh0ZW5kcyBTdHJpbmdLZXlzPFBsdWdpblNldHRpbmdzPlxuPiBleHRlbmRzIEJpbmRPcHRpb25zPFBsdWdpblNldHRpbmdzW1Byb3BlcnR5TmFtZV0+IHtcbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBVSSBjb21wb25lbnQncyB2YWx1ZSBiYWNrIHRvIHRoZSBwbHVnaW4gc2V0dGluZ3MgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB1aVZhbHVlIC0gVGhlIHZhbHVlIG9mIHRoZSBVSSBjb21wb25lbnQuXG4gICAqIEByZXR1cm5zIFRoZSB2YWx1ZSB0byBzZXQgb24gdGhlIHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIHJlYWRvbmx5IGNvbXBvbmVudFRvUGx1Z2luU2V0dGluZ3NWYWx1ZUNvbnZlcnRlcjogKHVpVmFsdWU6IFVJVmFsdWUpID0+IFBsdWdpblNldHRpbmdzW1Byb3BlcnR5TmFtZV0gfCBWYWxpZGF0aW9uTWVzc2FnZUhvbGRlcjtcblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIHBsdWdpbiBzZXR0aW5ncyB2YWx1ZSB0byB0aGUgdmFsdWUgdXNlZCBieSB0aGUgVUkgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0gcGx1Z2luU2V0dGluZ3NWYWx1ZSAtIFRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgaW4gdGhlIHBsdWdpbiBzZXR0aW5ncy5cbiAgICogQHJldHVybnMgVGhlIHZhbHVlIHRvIHNldCBvbiB0aGUgVUkgY29tcG9uZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgcGx1Z2luU2V0dGluZ3NUb0NvbXBvbmVudFZhbHVlQ29udmVydGVyOiAocGx1Z2luU2V0dGluZ3NWYWx1ZTogUmVhZG9ubHlEZWVwPFBsdWdpblNldHRpbmdzW1Byb3BlcnR5TmFtZV0+KSA9PiBVSVZhbHVlO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNyZWF0aW5nIHBsdWdpbiBzZXR0aW5ncyB0YWJzIGluIE9ic2lkaWFuLlxuICogUHJvdmlkZXMgYSBtZXRob2QgZm9yIGJpbmRpbmcgdmFsdWUgY29tcG9uZW50cyB0byBwbHVnaW4gc2V0dGluZ3MgYW5kIGhhbmRsaW5nIGNoYW5nZXMuXG4gKlxuICogQHR5cGVQYXJhbSBQbHVnaW5UeXBlcyAtIFBsdWdpbi1zcGVjaWZpYyB0eXBlcy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBsdWdpblNldHRpbmdzVGFiQmFzZTxQbHVnaW5UeXBlcyBleHRlbmRzIFBsdWdpblR5cGVzQmFzZT4gZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHBsdWdpbiBzZXR0aW5ncyB0YWIgaXMgb3Blbi5cbiAgICpcbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgcGx1Z2luIHNldHRpbmdzIHRhYiBpcyBvcGVuLlxuICAgKi9cbiAgcHVibGljIGdldCBpc09wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzT3BlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGRlYm91bmNlIHRpbWVvdXQgZm9yIHNhdmluZyBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGRlYm91bmNlIHRpbWVvdXQgZm9yIHNhdmluZyBzZXR0aW5ncy5cbiAgICovXG4gIHByb3RlY3RlZCBnZXQgc2F2ZVNldHRpbmdzRGVib3VuY2VUaW1lb3V0SW5NaWxsaXNlY29uZHMoKTogbnVtYmVyIHtcbiAgICBjb25zdCBERUZBVUxUID0gMl8wMDA7XG4gICAgcmV0dXJuIERFRkFVTFQ7XG4gIH1cblxuICBwcml2YXRlIF9pc09wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSByZWFkb25seSBhc3luY0V2ZW50c0NvbXBvbmVudDogQXN5bmNFdmVudHNDb21wb25lbnQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2F2ZVNldHRpbmdzRGVib3VuY2VkOiBEZWJvdW5jZXI8W10sIHZvaWQ+O1xuXG4gIHByaXZhdGUgZ2V0IHBsdWdpblNldHRpbmdzKCk6IEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4ge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2V0dGluZ3NXcmFwcGVyLnNldHRpbmdzIGFzIEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz47XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBwbHVnaW4gc2V0dGluZ3MgdGFiLlxuICAgKlxuICAgKiBAcGFyYW0gcGx1Z2luIC0gVGhlIHBsdWdpbi5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgb3ZlcnJpZGUgcGx1Z2luOiBFeHRyYWN0UGx1Z2luPFBsdWdpblR5cGVzPikge1xuICAgIHN1cGVyKHBsdWdpbi5hcHAsIHBsdWdpbik7XG4gICAgYWRkUGx1Z2luQ3NzQ2xhc3Nlcyh0aGlzLmNvbnRhaW5lckVsLCBDc3NDbGFzcy5QbHVnaW5TZXR0aW5nc1RhYik7XG4gICAgdGhpcy5zYXZlU2V0dGluZ3NEZWJvdW5jZWQgPSBkZWJvdW5jZShcbiAgICAgIGNvbnZlcnRBc3luY1RvU3luYygoKSA9PiB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIuc2F2ZVRvRmlsZShTQVZFX1RPX0ZJTEVfQ09OVEVYVCkpLFxuICAgICAgdGhpcy5zYXZlU2V0dGluZ3NEZWJvdW5jZVRpbWVvdXRJbk1pbGxpc2Vjb25kc1xuICAgICk7XG4gICAgdGhpcy5hc3luY0V2ZW50c0NvbXBvbmVudCA9IG5ldyBBc3luY0V2ZW50c0NvbXBvbmVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIGEgdmFsdWUgY29tcG9uZW50IHRvIGEgcGx1Z2luIHNldHRpbmcuXG4gICAqXG4gICAqIEB0eXBlUGFyYW0gVUlWYWx1ZSAtIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBvZiB0aGUgVUkgY29tcG9uZW50LlxuICAgKiBAdHlwZVBhcmFtIFRWYWx1ZUNvbXBvbmVudCAtIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBjb21wb25lbnQuXG4gICAqIEBwYXJhbSB2YWx1ZUNvbXBvbmVudCAtIFRoZSB2YWx1ZSBjb21wb25lbnQgdG8gYmluZC5cbiAgICogQHBhcmFtIHByb3BlcnR5TmFtZSAtIFRoZSBwcm9wZXJ0eSBvZiB0aGUgcGx1Z2luIHNldHRpbmdzIHRvIGJpbmQgdG8uXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgZm9yIGJpbmRpbmcgdGhlIHZhbHVlIGNvbXBvbmVudC5cbiAgICogQHJldHVybnMgVGhlIHZhbHVlIGNvbXBvbmVudC5cbiAgICovXG4gIHB1YmxpYyBiaW5kPFxuICAgIFVJVmFsdWUsXG4gICAgVFZhbHVlQ29tcG9uZW50XG4gID4oXG4gICAgdmFsdWVDb21wb25lbnQ6IFRWYWx1ZUNvbXBvbmVudCAmIFZhbHVlQ29tcG9uZW50V2l0aENoYW5nZVRyYWNraW5nPFVJVmFsdWU+LFxuICAgIHByb3BlcnR5TmFtZTogQ29uZGl0aW9uYWxLZXlzPEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4sIFVJVmFsdWU+LFxuICAgIG9wdGlvbnM/OiBCaW5kT3B0aW9uczxVSVZhbHVlPlxuICApOiBUVmFsdWVDb21wb25lbnQ7XG4gIC8qKlxuICAgKiBCaW5kcyBhIHZhbHVlIGNvbXBvbmVudCB0byBhIHBsdWdpbiBzZXR0aW5nLlxuICAgKlxuICAgKiBAdHlwZVBhcmFtIFVJVmFsdWUgLSBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgb2YgdGhlIFVJIGNvbXBvbmVudC5cbiAgICogQHR5cGVQYXJhbSBUVmFsdWVDb21wb25lbnQgLSBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgY29tcG9uZW50LlxuICAgKiBAdHlwZVBhcmFtIFByb3BlcnR5TmFtZSAtIFRoZSBwcm9wZXJ0eSBuYW1lIG9mIHRoZSBwbHVnaW4gc2V0dGluZ3MgdG8gYmluZCB0by5cbiAgICogQHBhcmFtIHZhbHVlQ29tcG9uZW50IC0gVGhlIHZhbHVlIGNvbXBvbmVudCB0byBiaW5kLlxuICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIC0gVGhlIHByb3BlcnR5IG5hbWUgb2YgdGhlIHBsdWdpbiBzZXR0aW5ncyB0byBiaW5kIHRvLlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIGZvciBiaW5kaW5nIHRoZSB2YWx1ZSBjb21wb25lbnQuXG4gICAqIEByZXR1cm5zIFRoZSB2YWx1ZSBjb21wb25lbnQuXG4gICAqL1xuICBwdWJsaWMgYmluZDxcbiAgICBVSVZhbHVlLFxuICAgIFRWYWx1ZUNvbXBvbmVudCxcbiAgICBQcm9wZXJ0eU5hbWUgZXh0ZW5kcyBTdHJpbmdLZXlzPEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4+XG4gID4oXG4gICAgdmFsdWVDb21wb25lbnQ6IFRWYWx1ZUNvbXBvbmVudCAmIFZhbHVlQ29tcG9uZW50V2l0aENoYW5nZVRyYWNraW5nPFVJVmFsdWU+LFxuICAgIHByb3BlcnR5TmFtZTogUHJvcGVydHlOYW1lLFxuICAgIG9wdGlvbnM6IEJpbmRPcHRpb25zRXh0ZW5kZWQ8RXh0cmFjdFBsdWdpblNldHRpbmdzPFBsdWdpblR5cGVzPiwgVUlWYWx1ZSwgUHJvcGVydHlOYW1lPlxuICApOiBUVmFsdWVDb21wb25lbnQ7XG4gIC8qKlxuICAgKiBCaW5kcyBhIHZhbHVlIGNvbXBvbmVudCB0byBhIHBsdWdpbiBzZXR0aW5nLlxuICAgKlxuICAgKiBAdHlwZVBhcmFtIFVJVmFsdWUgLSBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgb2YgdGhlIFVJIGNvbXBvbmVudC5cbiAgICogQHR5cGVQYXJhbSBUVmFsdWVDb21wb25lbnQgLSBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgY29tcG9uZW50LlxuICAgKiBAdHlwZVBhcmFtIFByb3BlcnR5TmFtZSAtIFRoZSBwcm9wZXJ0eSBuYW1lIG9mIHRoZSBwbHVnaW4gc2V0dGluZ3MgdG8gYmluZCB0by5cbiAgICogQHBhcmFtIHZhbHVlQ29tcG9uZW50IC0gVGhlIHZhbHVlIGNvbXBvbmVudCB0byBiaW5kLlxuICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIC0gVGhlIHByb3BlcnR5IG5hbWUgb2YgdGhlIHBsdWdpbiBzZXR0aW5ncyB0byBiaW5kIHRvLlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIGZvciBiaW5kaW5nIHRoZSB2YWx1ZSBjb21wb25lbnQuXG4gICAqIEByZXR1cm5zIFRoZSB2YWx1ZSBjb21wb25lbnQuXG4gICAqL1xuICBwdWJsaWMgYmluZDxcbiAgICBVSVZhbHVlLFxuICAgIFRWYWx1ZUNvbXBvbmVudCxcbiAgICBQcm9wZXJ0eU5hbWUgZXh0ZW5kcyBTdHJpbmdLZXlzPEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz4+XG4gID4oXG4gICAgdmFsdWVDb21wb25lbnQ6IFRWYWx1ZUNvbXBvbmVudCAmIFZhbHVlQ29tcG9uZW50V2l0aENoYW5nZVRyYWNraW5nPFVJVmFsdWU+LFxuICAgIHByb3BlcnR5TmFtZTogUHJvcGVydHlOYW1lLFxuICAgIG9wdGlvbnM/OiBCaW5kT3B0aW9uczxFeHRyYWN0UGx1Z2luU2V0dGluZ3M8UGx1Z2luVHlwZXM+W1Byb3BlcnR5TmFtZV0+XG4gICk6IFRWYWx1ZUNvbXBvbmVudCB7XG4gICAgdHlwZSBQbHVnaW5TZXR0aW5ncyA9IEV4dHJhY3RQbHVnaW5TZXR0aW5nczxQbHVnaW5UeXBlcz47XG4gICAgdHlwZSBQcm9wZXJ0eVR5cGUgPSBQbHVnaW5TZXR0aW5nc1tQcm9wZXJ0eU5hbWVdO1xuICAgIGNvbnN0IERFRkFVTFRfT1BUSU9OUzogUmVxdWlyZWQ8QmluZE9wdGlvbnNFeHRlbmRlZDxQbHVnaW5TZXR0aW5ncywgVUlWYWx1ZSwgUHJvcGVydHlOYW1lPj4gPSB7XG4gICAgICBjb21wb25lbnRUb1BsdWdpblNldHRpbmdzVmFsdWVDb252ZXJ0ZXI6ICh2YWx1ZTogVUlWYWx1ZSk6IFByb3BlcnR5VHlwZSA9PiB2YWx1ZSBhcyBQcm9wZXJ0eVR5cGUsXG4gICAgICBvbkNoYW5nZWQ6IG5vb3AsXG4gICAgICBwbHVnaW5TZXR0aW5nc1RvQ29tcG9uZW50VmFsdWVDb252ZXJ0ZXI6ICh2YWx1ZTogUmVhZG9ubHlEZWVwPFByb3BlcnR5VHlwZT4pOiBVSVZhbHVlID0+IHZhbHVlIGFzIFVJVmFsdWUsXG4gICAgICBzaG91bGRSZXNldFNldHRpbmdXaGVuQ29tcG9uZW50SXNFbXB0eTogdHJ1ZSxcbiAgICAgIHNob3VsZFNob3dQbGFjZWhvbGRlckZvckRlZmF1bHRWYWx1ZXM6IHRydWUsXG4gICAgICBzaG91bGRTaG93VmFsaWRhdGlvbk1lc3NhZ2U6IHRydWVcbiAgICB9O1xuXG4gICAgY29uc3Qgb3B0aW9uc0V4dDogUmVxdWlyZWQ8QmluZE9wdGlvbnNFeHRlbmRlZDxQbHVnaW5TZXR0aW5ncywgVUlWYWx1ZSwgUHJvcGVydHlOYW1lPj4gPSB7IC4uLkRFRkFVTFRfT1BUSU9OUywgLi4ub3B0aW9ucyB9O1xuXG4gICAgY29uc3QgdmFsaWRhdG9yRWwgPSBnZXRWYWxpZGF0b3JDb21wb25lbnQodmFsdWVDb21wb25lbnQpPy52YWxpZGF0b3JFbDtcblxuICAgIGNvbnN0IHRleHRCYXNlZENvbXBvbmVudCA9IGdldFRleHRCYXNlZENvbXBvbmVudFZhbHVlKHZhbHVlQ29tcG9uZW50KTtcblxuICAgIGNvbnN0IHJlYWRvbmx5VmFsdWUgPSB0aGlzLnBsdWdpblNldHRpbmdzW3Byb3BlcnR5TmFtZV0gYXMgUmVhZG9ubHlEZWVwPFByb3BlcnR5VHlwZT47XG4gICAgY29uc3QgZGVmYXVsdFZhbHVlID0gKHRoaXMucGx1Z2luLnNldHRpbmdzTWFuYWdlci5kZWZhdWx0U2V0dGluZ3MgYXMgUGx1Z2luU2V0dGluZ3MpW3Byb3BlcnR5TmFtZV0gYXMgUHJvcGVydHlUeXBlO1xuICAgIGNvbnN0IGRlZmF1bHRDb21wb25lbnRWYWx1ZSA9IG9wdGlvbnNFeHQucGx1Z2luU2V0dGluZ3NUb0NvbXBvbmVudFZhbHVlQ29udmVydGVyKGRlZmF1bHRWYWx1ZSBhcyBSZWFkb25seURlZXA8UHJvcGVydHlUeXBlPik7XG4gICAgdGV4dEJhc2VkQ29tcG9uZW50Py5zZXRQbGFjZWhvbGRlclZhbHVlKGRlZmF1bHRDb21wb25lbnRWYWx1ZSk7XG5cbiAgICBsZXQgdmFsaWRhdGlvbk1lc3NhZ2U6IHN0cmluZztcbiAgICBsZXQgdG9vbHRpcEVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGxldCB0b29sdGlwQ29udGVudEVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGlmICh2YWxpZGF0b3JFbCkge1xuICAgICAgY29uc3Qgd3JhcHBlciA9IGVuc3VyZVdyYXBwZWQodmFsaWRhdG9yRWwpO1xuICAgICAgdG9vbHRpcEVsID0gd3JhcHBlci5jcmVhdGVEaXYoKTtcbiAgICAgIGFkZFBsdWdpbkNzc0NsYXNzZXModG9vbHRpcEVsLCBDc3NDbGFzcy5Ub29sdGlwLCBDc3NDbGFzcy5Ub29sdGlwVmFsaWRhdG9yKTtcbiAgICAgIHRvb2x0aXBDb250ZW50RWwgPSB0b29sdGlwRWwuY3JlYXRlU3BhbigpO1xuICAgICAgY29uc3QgdG9vbHRpcEFycm93RWwgPSB0b29sdGlwRWwuY3JlYXRlRGl2KCk7XG4gICAgICBhZGRQbHVnaW5Dc3NDbGFzc2VzKHRvb2x0aXBBcnJvd0VsLCBDc3NDbGFzcy5Ub29sdGlwQXJyb3cpO1xuICAgICAgdG9vbHRpcEVsLmhpZGUoKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodG9vbHRpcEVsKTtcbiAgICB9XG5cbiAgICB0aGlzLmFzeW5jRXZlbnRzQ29tcG9uZW50LnJlZ2lzdGVyQXN5bmNFdmVudCh0aGlzLm9uKCd2YWxpZGF0aW9uTWVzc2FnZUNoYW5nZWQnLCAoYW5vdGhlclByb3BlcnR5TmFtZSwgYW5vdGhlclZhbGlkYXRpb25NZXNzYWdlKSA9PiB7XG4gICAgICBpZiAocHJvcGVydHlOYW1lICE9PSBhbm90aGVyUHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2UgPSBhbm90aGVyVmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgICB1cGRhdGVWYWxpZGF0b3JFbERlYm91bmNlZCgpO1xuICAgIH0pKTtcblxuICAgIGxldCBzaG91bGRFbXB0eU9uQmx1ciA9IGZhbHNlO1xuICAgIGxldCBzaG91bGRSZXZlcnRUb0RlZmF1bHRWYWx1ZU9uQmx1ciA9IGZhbHNlO1xuXG4gICAgaWYgKHRleHRCYXNlZENvbXBvbmVudCAmJiBvcHRpb25zRXh0LnNob3VsZFNob3dQbGFjZWhvbGRlckZvckRlZmF1bHRWYWx1ZXMgJiYgZGVlcEVxdWFsKHJlYWRvbmx5VmFsdWUsIGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgIHRleHRCYXNlZENvbXBvbmVudC5lbXB0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZUNvbXBvbmVudC5zZXRWYWx1ZShvcHRpb25zRXh0LnBsdWdpblNldHRpbmdzVG9Db21wb25lbnRWYWx1ZUNvbnZlcnRlcihyZWFkb25seVZhbHVlKSk7XG4gICAgfVxuXG4gICAgbGV0IHNob3VsZFNraXBPbkNoYW5nZSA9IGZhbHNlO1xuICAgIGNvbnN0IFVQREFURV9WQUxJREFUT1JfRUxfVElNRU9VVF9JTl9NSUxMSVNFQ09ORFMgPSAxMDA7XG4gICAgY29uc3QgdXBkYXRlVmFsaWRhdG9yRWxEZWJvdW5jZWQgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB1cGRhdGVWYWxpZGF0b3JFbCgpO1xuICAgICAgfSk7XG4gICAgfSwgVVBEQVRFX1ZBTElEQVRPUl9FTF9USU1FT1VUX0lOX01JTExJU0VDT05EUyk7XG5cbiAgICB2YWx1ZUNvbXBvbmVudC5vbkNoYW5nZShhc3luYyAodWlWYWx1ZSkgPT4ge1xuICAgICAgaWYgKHNob3VsZFNraXBPbkNoYW5nZSkge1xuICAgICAgICBzaG91bGRTa2lwT25DaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzaG91bGRFbXB0eU9uQmx1ciA9IGZhbHNlO1xuXG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMucGx1Z2luU2V0dGluZ3NbcHJvcGVydHlOYW1lXTtcbiAgICAgIGxldCBuZXdWYWx1ZTogUHJvcGVydHlUeXBlIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHNob3VsZFNldFByb3BlcnR5ID0gdHJ1ZTtcbiAgICAgIHNob3VsZFJldmVydFRvRGVmYXVsdFZhbHVlT25CbHVyID0gISF0ZXh0QmFzZWRDb21wb25lbnQ/LmlzRW1wdHkoKSAmJiBvcHRpb25zRXh0LnNob3VsZFJlc2V0U2V0dGluZ1doZW5Db21wb25lbnRJc0VtcHR5O1xuICAgICAgaWYgKHNob3VsZFJldmVydFRvRGVmYXVsdFZhbHVlT25CbHVyKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY29udmVydGVkVmFsdWUgPSBvcHRpb25zRXh0LmNvbXBvbmVudFRvUGx1Z2luU2V0dGluZ3NWYWx1ZUNvbnZlcnRlcih1aVZhbHVlKTtcbiAgICAgICAgaWYgKGlzVmFsaWRhdGlvbk1lc3NhZ2VIb2xkZXIoY29udmVydGVkVmFsdWUpKSB7XG4gICAgICAgICAgdmFsaWRhdGlvbk1lc3NhZ2UgPSBjb252ZXJ0ZWRWYWx1ZS52YWxpZGF0aW9uTWVzc2FnZTtcbiAgICAgICAgICBzaG91bGRTZXRQcm9wZXJ0eSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1ZhbHVlID0gY29udmVydGVkVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNob3VsZFNldFByb3BlcnR5KSB7XG4gICAgICAgIHZhbGlkYXRpb25NZXNzYWdlID0gYXdhaXQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpO1xuICAgICAgICBpZiAodGV4dEJhc2VkQ29tcG9uZW50ICYmIG9wdGlvbnNFeHQuc2hvdWxkU2hvd1BsYWNlaG9sZGVyRm9yRGVmYXVsdFZhbHVlcyAmJiAhdGV4dEJhc2VkQ29tcG9uZW50LmlzRW1wdHkoKSAmJiBkZWVwRXF1YWwobmV3VmFsdWUsIGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICBzaG91bGRFbXB0eU9uQmx1ciA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXBkYXRlVmFsaWRhdG9yRWxEZWJvdW5jZWQoKTtcbiAgICAgIGlmIChzaG91bGRTZXRQcm9wZXJ0eSkge1xuICAgICAgICBhd2FpdCBvcHRpb25zRXh0Lm9uQ2hhbmdlZChuZXdWYWx1ZSBhcyBSZWFkb25seURlZXA8UHJvcGVydHlUeXBlPiwgb2xkVmFsdWUgYXMgUmVhZG9ubHlEZWVwPFByb3BlcnR5VHlwZT4pO1xuICAgICAgfVxuICAgICAgdGhpcy5zYXZlU2V0dGluZ3NEZWJvdW5jZWQoKTtcbiAgICB9KTtcblxuICAgIHZhbGlkYXRvckVsPy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcbiAgICAgIHVwZGF0ZVZhbGlkYXRvckVsRGVib3VuY2VkKCk7XG4gICAgfSk7XG4gICAgdmFsaWRhdG9yRWw/LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiB7XG4gICAgICB1cGRhdGVWYWxpZGF0b3JFbERlYm91bmNlZCgpO1xuICAgIH0pO1xuICAgIHZhbGlkYXRvckVsPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHVwZGF0ZVZhbGlkYXRvckVsRGVib3VuY2VkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhbGlkYXRpb25NZXNzYWdlID0gdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNldHRpbmdzV3JhcHBlci52YWxpZGF0aW9uTWVzc2FnZXNbcHJvcGVydHlOYW1lXSA/PyAnJztcbiAgICB1cGRhdGVWYWxpZGF0b3JFbERlYm91bmNlZCgpO1xuXG4gICAgcmV0dXJuIHZhbHVlQ29tcG9uZW50O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlVmFsaWRhdG9yRWwoKTogdm9pZCB7XG4gICAgICBpZiAoIXZhbGlkYXRvckVsPy5pc0FjdGl2ZUVsZW1lbnQoKSkge1xuICAgICAgICBpZiAoc2hvdWxkRW1wdHlPbkJsdXIpIHtcbiAgICAgICAgICBzaG91bGRFbXB0eU9uQmx1ciA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKCF0ZXh0QmFzZWRDb21wb25lbnQ/LmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgc2hvdWxkU2tpcE9uQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRleHRCYXNlZENvbXBvbmVudD8uZW1wdHkoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoc2hvdWxkUmV2ZXJ0VG9EZWZhdWx0VmFsdWVPbkJsdXIpIHtcbiAgICAgICAgICBzaG91bGRSZXZlcnRUb0RlZmF1bHRWYWx1ZU9uQmx1ciA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHRleHRCYXNlZENvbXBvbmVudD8uaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICBzaG91bGRTa2lwT25DaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgdmFsdWVDb21wb25lbnQuc2V0VmFsdWUoZGVmYXVsdENvbXBvbmVudFZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCF2YWxpZGF0b3JFbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWxpZGF0aW9uTWVzc2FnZSA9PT0gJycpIHtcbiAgICAgICAgdmFsaWRhdG9yRWwuc2V0Q3VzdG9tVmFsaWRpdHkoJycpO1xuICAgICAgICB2YWxpZGF0b3JFbC5jaGVja1ZhbGlkaXR5KCk7XG4gICAgICAgIHZhbGlkYXRpb25NZXNzYWdlID0gdmFsaWRhdG9yRWwudmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIHZhbGlkYXRvckVsLnNldEN1c3RvbVZhbGlkaXR5KHZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICAgIGlmIChvcHRpb25zRXh0LnNob3VsZFNob3dWYWxpZGF0aW9uTWVzc2FnZSkge1xuICAgICAgICBpZiAodG9vbHRpcENvbnRlbnRFbCkge1xuICAgICAgICAgIHRvb2x0aXBDb250ZW50RWwudGV4dENvbnRlbnQgPSB2YWxpZGF0aW9uTWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgICB0b29sdGlwRWw/LnRvZ2dsZSghIXZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICAgICAgc2V0VG9vbHRpcCh2YWxpZGF0b3JFbCwgdmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIHRoZSBwbHVnaW4gc2V0dGluZ3MgdGFiLlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXJFbC5lbXB0eSgpO1xuICAgIHRoaXMuX2lzT3BlbiA9IHRydWU7XG4gICAgdGhpcy5hc3luY0V2ZW50c0NvbXBvbmVudC5sb2FkKCk7XG4gICAgdGhpcy5hc3luY0V2ZW50c0NvbXBvbmVudC5yZWdpc3RlckFzeW5jRXZlbnQodGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLm9uKCdsb2FkU2V0dGluZ3MnLCB0aGlzLm9uTG9hZFNldHRpbmdzLmJpbmQodGhpcykpKTtcbiAgICB0aGlzLmFzeW5jRXZlbnRzQ29tcG9uZW50LnJlZ2lzdGVyQXN5bmNFdmVudCh0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIub24oJ3NhdmVTZXR0aW5ncycsIHRoaXMub25TYXZlU2V0dGluZ3MuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGVzIHRoZSBwbHVnaW4gc2V0dGluZ3MgdGFiLlxuICAgKi9cbiAgcHVibGljIG92ZXJyaWRlIGhpZGUoKTogdm9pZCB7XG4gICAgc3VwZXIuaGlkZSgpO1xuICAgIHRoaXMuc2F2ZVNldHRpbmdzRGVib3VuY2VkLmNhbmNlbCgpO1xuICAgIHRoaXMuX2lzT3BlbiA9IGZhbHNlO1xuICAgIHRoaXMuYXN5bmNFdmVudHNDb21wb25lbnQudW5sb2FkKCk7XG4gICAgdGhpcy5hc3luY0V2ZW50c0NvbXBvbmVudC5sb2FkKCk7XG4gICAgaW52b2tlQXN5bmNTYWZlbHkoKCkgPT4gdGhpcy5oaWRlQXN5bmMoKSk7XG4gIH1cblxuICAvKipcbiAgICogQXN5bmMgYWN0aW9ucyB0byBwZXJmb3JtIHdoZW4gdGhlIHNldHRpbmdzIHRhYiBpcyBiZWluZyBoaWRkZW4uXG4gICAqXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIFByb21pc2V9IHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgc2V0dGluZ3MgdGFiIGlzIGhpZGRlbi5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBoaWRlQXN5bmMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2V0dGluZ3NNYW5hZ2VyLnNhdmVUb0ZpbGUoU0FWRV9UT19GSUxFX0NPTlRFWFQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3dzIHRoZSBwbHVnaW4gc2V0dGluZ3MgdGFiLlxuICAgKi9cbiAgcHVibGljIHNob3coKTogdm9pZCB7XG4gICAgdGhpcy5hcHAuc2V0dGluZy5vcGVuVGFiKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBwbHVnaW4gc2V0dGluZ3MgYXJlIGxvYWRlZC5cbiAgICpcbiAgICogQHBhcmFtIF9sb2FkZWRTZXR0aW5ncyAtIFRoZSBsb2FkZWQgc2V0dGluZ3MuXG4gICAqIEBwYXJhbSBfaXNJbml0aWFsTG9hZCAtIFdoZXRoZXIgdGhlIHNldHRpbmdzIGFyZSBiZWluZyBsb2FkZWQgZm9yIHRoZSBmaXJzdCB0aW1lLlxuICAgKiBAcmV0dXJucyBBIHtAbGluayBQcm9taXNlfSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHNldHRpbmdzIGFyZSBsb2FkZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgb25Mb2FkU2V0dGluZ3MoX2xvYWRlZFNldHRpbmdzOiBFeHRyYWN0UmVhZG9ubHlQbHVnaW5TZXR0aW5nc1dyYXBwZXI8UGx1Z2luVHlwZXM+LCBfaXNJbml0aWFsTG9hZDogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuZGlzcGxheSgpO1xuICAgIGF3YWl0IG5vb3BBc3luYygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmFsaWRhdGVzIHRoZSBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJldHVybnMgQSB7QGxpbmsgUHJvbWlzZX0gdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBzZXR0aW5ncyBhcmUgcmV2YWxpZGF0ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgcmV2YWxpZGF0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB2YWxpZGF0aW9uTWVzc2FnZXMgPSBhd2FpdCB0aGlzLnBsdWdpbi5zZXR0aW5nc01hbmFnZXIucmV2YWxpZGF0ZSgpO1xuICAgIGF3YWl0IHRoaXMudXBkYXRlVmFsaWRhdGlvbnModmFsaWRhdGlvbk1lc3NhZ2VzKTtcbiAgfVxuXG4gIHByaXZhdGUgb24oXG4gICAgbmFtZTogJ3ZhbGlkYXRpb25NZXNzYWdlQ2hhbmdlZCcsXG4gICAgY2FsbGJhY2s6IChcbiAgICAgIHByb3BlcnR5TmFtZTogc3RyaW5nLFxuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2U6IHN0cmluZ1xuICAgICkgPT4gUHJvbWlzYWJsZTx2b2lkPixcbiAgICB0aGlzQXJnPzogdW5rbm93blxuICApOiBBc3luY0V2ZW50UmVmO1xuICBwcml2YXRlIG9uPEFyZ3MgZXh0ZW5kcyB1bmtub3duW10+KFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBjYWxsYmFjazogKC4uLmFyZ3M6IEFyZ3MpID0+IFByb21pc2FibGU8dm9pZD4sXG4gICAgdGhpc0FyZz86IHVua25vd25cbiAgKTogQXN5bmNFdmVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuYXN5bmNFdmVudHNDb21wb25lbnQuYXN5bmNFdmVudHMub24obmFtZSwgY2FsbGJhY2ssIHRoaXNBcmcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBvblNhdmVTZXR0aW5ncyhcbiAgICBuZXdTZXR0aW5nczogRXh0cmFjdFJlYWRvbmx5UGx1Z2luU2V0dGluZ3NXcmFwcGVyPFBsdWdpblR5cGVzPixcbiAgICBfb2xkU2V0dGluZ3M6IEV4dHJhY3RSZWFkb25seVBsdWdpblNldHRpbmdzV3JhcHBlcjxQbHVnaW5UeXBlcz4sXG4gICAgY29udGV4dDogdW5rbm93blxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoY29udGV4dCA9PT0gU0FWRV9UT19GSUxFX0NPTlRFWFQpIHtcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlVmFsaWRhdGlvbnMobmV3U2V0dGluZ3MudmFsaWRhdGlvbk1lc3NhZ2VzIGFzIFJlY29yZDxFeHRyYWN0UGx1Z2luU2V0dGluZ3NQcm9wZXJ0eU5hbWVzPFBsdWdpblR5cGVzPiwgc3RyaW5nPik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwbGF5KCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZVZhbGlkYXRpb25zKHZhbGlkYXRpb25NZXNzYWdlczogUmVjb3JkPEV4dHJhY3RQbHVnaW5TZXR0aW5nc1Byb3BlcnR5TmFtZXM8UGx1Z2luVHlwZXM+LCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgZm9yIChjb25zdCBbcHJvcGVydHlOYW1lLCB2YWxpZGF0aW9uTWVzc2FnZV0gb2YgT2JqZWN0LmVudHJpZXModmFsaWRhdGlvbk1lc3NhZ2VzKSkge1xuICAgICAgYXdhaXQgdGhpcy5hc3luY0V2ZW50c0NvbXBvbmVudC5hc3luY0V2ZW50cy50cmlnZ2VyQXN5bmMoJ3ZhbGlkYXRpb25NZXNzYWdlQ2hhbmdlZCcsIHByb3BlcnR5TmFtZSwgdmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuLyogdjggaWdub3JlIHN0b3AgKi9cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIFdyYXBzIGFuIGVsZW1lbnQgaW4gYSBzZXR0aW5nIGNvbXBvbmVudCB3cmFwcGVyLlxuICovXG5cbmltcG9ydCB7IENzc0NsYXNzIH0gZnJvbSAnLi4vLi4vLi4vY3NzLWNsYXNzLnRzJztcbmltcG9ydCB7IGFzc2VydE5vbk51bGxhYmxlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZS1ndWFyZHMudHMnO1xuaW1wb3J0IHsgYWRkUGx1Z2luQ3NzQ2xhc3NlcyB9IGZyb20gJy4uLy4uL3BsdWdpbi9wbHVnaW4tY29udGV4dC50cyc7XG5cbi8qKlxuICogRW5zdXJlcyB0aGF0IHRoZSBlbGVtZW50IGlzIHdyYXBwZWQgaW4gYSBzZXR0aW5nIGNvbXBvbmVudCB3cmFwcGVyLlxuICpcbiAqIEBwYXJhbSBlbCAtIFRoZSBlbGVtZW50IHRvIGVuc3VyZSBpcyB3cmFwcGVkLlxuICogQHJldHVybnMgVGhlIHdyYXBwZXIgZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZVdyYXBwZWQoZWw6IEhUTUxFbGVtZW50KTogSFRNTERpdkVsZW1lbnQge1xuICBjb25zdCBwYXJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBhc3NlcnROb25OdWxsYWJsZShwYXJlbnQsICdFbGVtZW50IG11c3QgYmUgYXR0YWNoZWQgdG8gdGhlIERPTScpO1xuXG4gIGlmIChwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENzc0NsYXNzLlNldHRpbmdDb21wb25lbnRXcmFwcGVyKSkge1xuICAgIHJldHVybiBwYXJlbnQgYXMgSFRNTERpdkVsZW1lbnQ7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKTtcbiAgY29uc3Qgd3JhcHBlciA9IGNyZWF0ZURpdigpO1xuICBhZGRQbHVnaW5Dc3NDbGFzc2VzKHdyYXBwZXIsIENzc0NsYXNzLlNldHRpbmdDb21wb25lbnRXcmFwcGVyKTtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9XG4gIHBhcmVudC5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcbiAgcmV0dXJuIHdyYXBwZXI7XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBUZXh0IGJhc2VkIGNvbXBvbmVudCB1dGlsaXRpZXMuXG4gKi9cblxuaW1wb3J0IHsgQWJzdHJhY3RUZXh0Q29tcG9uZW50IH0gZnJvbSAnb2JzaWRpYW4nO1xuXG4vKipcbiAqIEEgY29tcG9uZW50IGJhc2VkIG9uIGEgdGV4dCBpbnB1dC5cbiAqXG4gKiBAdHlwZVBhcmFtIFQgLSBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRleHRCYXNlZENvbXBvbmVudDxUPiB7XG4gIC8qKlxuICAgKiBFbXB0aWVzIHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBlbXB0eSgpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGNvbXBvbmVudCBpcyBlbXB0eS5cbiAgICpcbiAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBjb21wb25lbnQgaXMgZW1wdHksIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNFbXB0eSgpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwbGFjZWhvbGRlciB2YWx1ZSBvZiB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0gcGxhY2Vob2xkZXJWYWx1ZSAtIFRoZSBwbGFjZWhvbGRlciB2YWx1ZSB0byBzZXQuXG4gICAqIEByZXR1cm5zIFRoZSBjb21wb25lbnQuXG4gICAqL1xuICBzZXRQbGFjZWhvbGRlclZhbHVlKHBsYWNlaG9sZGVyVmFsdWU6IFQpOiB0aGlzO1xufVxuXG5jbGFzcyBBYnN0cmFjdFRleHRDb21wb25lbnRXcmFwcGVyPFQ+IGltcGxlbWVudHMgVGV4dEJhc2VkQ29tcG9uZW50PFQ+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgLS0gYHVua25vd25gIGRvZXNuJ3Qgd29yaywgZ2V0dGluZyBjb21waWxlciBlcnJvcnMuXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFic3RyYWN0VGV4dENvbXBvbmVudDogQWJzdHJhY3RUZXh0Q29tcG9uZW50PGFueT4pIHt9XG5cbiAgcHVibGljIGVtcHR5KCk6IHZvaWQge1xuICAgIHRoaXMuYWJzdHJhY3RUZXh0Q29tcG9uZW50LnNldFZhbHVlKCcnKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFic3RyYWN0VGV4dENvbXBvbmVudC5nZXRWYWx1ZSgpID09PSAnJztcbiAgfVxuXG4gIHB1YmxpYyBzZXRQbGFjZWhvbGRlclZhbHVlKHBsYWNlaG9sZGVyVmFsdWU6IFQpOiB0aGlzIHtcbiAgICB0aGlzLmFic3RyYWN0VGV4dENvbXBvbmVudC5zZXRQbGFjZWhvbGRlcihwbGFjZWhvbGRlclZhbHVlIGFzIHN0cmluZyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB0ZXh0IGJhc2VkIGNvbXBvbmVudCB2YWx1ZSBvZiB0aGUgY29tcG9uZW50LlxuICpcbiAqIEB0eXBlUGFyYW0gVCAtIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcGFyYW0gb2JqIC0gQW55IG9iamVjdC5cbiAqIEByZXR1cm5zIFRoZSB0ZXh0IGJhc2VkIGNvbXBvbmVudCB2YWx1ZSBvZiB0aGUgY29tcG9uZW50IG9yIGBudWxsYCBpZiB0aGUgY29tcG9uZW50IGlzIG5vdCBhIHRleHQgYmFzZWQgY29tcG9uZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGV4dEJhc2VkQ29tcG9uZW50VmFsdWU8VD4ob2JqOiB1bmtub3duKTogbnVsbCB8IFRleHRCYXNlZENvbXBvbmVudDxUPiB7XG4gIGlmIChpc1RleHRCYXNlZENvbXBvbmVudChvYmopKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGlmIChvYmogaW5zdGFuY2VvZiBBYnN0cmFjdFRleHRDb21wb25lbnQpIHtcbiAgICByZXR1cm4gbmV3IEFic3RyYWN0VGV4dENvbXBvbmVudFdyYXBwZXI8VD4ob2JqKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1RleHRCYXNlZENvbXBvbmVudDxUPihjb21wb25lbnQ6IHVua25vd24pOiBjb21wb25lbnQgaXMgVGV4dEJhc2VkQ29tcG9uZW50PFQ+IHtcbiAgY29uc3QgdGV4dEJhc2VkQ29tcG9uZW50ID0gY29tcG9uZW50IGFzIFBhcnRpYWw8VGV4dEJhc2VkQ29tcG9uZW50PFQ+PjtcbiAgcmV0dXJuIHR5cGVvZiB0ZXh0QmFzZWRDb21wb25lbnQuc2V0UGxhY2Vob2xkZXJWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdGV4dEJhc2VkQ29tcG9uZW50LmlzRW1wdHkgPT09ICdmdW5jdGlvbic7XG59XG4iLCAiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBDb250YWlucyBhIGNvbXBvbmVudCB0aGF0IGhhcyBhIHZhbGlkYXRvciBlbGVtZW50LlxuICovXG5cbmltcG9ydCB7XG4gIENvbG9yQ29tcG9uZW50LFxuICBEcm9wZG93bkNvbXBvbmVudCxcbiAgUHJvZ3Jlc3NCYXJDb21wb25lbnQsXG4gIFNlYXJjaENvbXBvbmVudCxcbiAgU2xpZGVyQ29tcG9uZW50LFxuICBUZXh0QXJlYUNvbXBvbmVudCxcbiAgVGV4dENvbXBvbmVudCxcbiAgVG9nZ2xlQ29tcG9uZW50XG59IGZyb20gJ29ic2lkaWFuJztcblxuaW1wb3J0IHR5cGUgeyBWYWxpZGF0b3JFbGVtZW50IH0gZnJvbSAnLi4vLi4vLi4vaHRtbC1lbGVtZW50LnRzJztcblxuaW1wb3J0IHsgQ3NzQ2xhc3MgfSBmcm9tICcuLi8uLi8uLi9jc3MtY2xhc3MudHMnO1xuaW1wb3J0IHsgYWRkUGx1Z2luQ3NzQ2xhc3NlcyB9IGZyb20gJy4uLy4uL3BsdWdpbi9wbHVnaW4tY29udGV4dC50cyc7XG5pbXBvcnQgeyBlbnN1cmVXcmFwcGVkIH0gZnJvbSAnLi9zZXR0aW5nLWNvbXBvbmVudC13cmFwcGVyLnRzJztcblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0aGF0IGhhcyBhIHZhbGlkYXRvciBlbGVtZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvckNvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBBIHZhbGlkYXRvciBlbGVtZW50IG9mIHRoZSBjb21wb25lbnQuXG4gICAqL1xuICByZWFkb25seSB2YWxpZGF0b3JFbDogVmFsaWRhdG9yRWxlbWVudDtcbn1cblxuY2xhc3MgT3ZlcmxheVZhbGlkYXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIFZhbGlkYXRvckNvbXBvbmVudCB7XG4gIHB1YmxpYyBnZXQgdmFsaWRhdG9yRWwoKTogVmFsaWRhdG9yRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvckVsO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfdmFsaWRhdG9yRWw6IFZhbGlkYXRvckVsZW1lbnQ7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGVuc3VyZVdyYXBwZWQoZWwpO1xuXG4gICAgdGhpcy5fdmFsaWRhdG9yRWwgPSB3cmFwcGVyLmNyZWF0ZUVsKCdpbnB1dCcsIHtcbiAgICAgIGF0dHI6IHtcbiAgICAgICAgdGFiaW5kZXg6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgYWRkUGx1Z2luQ3NzQ2xhc3Nlcyh0aGlzLl92YWxpZGF0b3JFbCwgQ3NzQ2xhc3MuT3ZlcmxheVZhbGlkYXRvcik7XG5cbiAgICB0aGlzLl92YWxpZGF0b3JFbC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcbiAgICAgIHRoaXMuZWwuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3ZhbGlkYXRvckVsLmlzQWN0aXZlRWxlbWVudCA9IHRoaXMuaXNFbGVtZW50T3JEZXNjZW5kYW50QWN0aXZlLmJpbmQodGhpcyk7XG5cbiAgICBsZXQgdGFiSW5kZXhFbCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1t0YWJpbmRleF0nKTtcbiAgICBpZiAoIXRhYkluZGV4RWwpIHtcbiAgICAgIGlmICh0aGlzLmVsLmdldEF0dHIoJ3RhYmluZGV4JykgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5lbC50YWJJbmRleCA9IC0xO1xuICAgICAgfVxuICAgICAgdGFiSW5kZXhFbCA9IHRoaXMuZWw7XG4gICAgfVxuXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgKCkgPT4ge1xuICAgICAgdGhpcy5mb3JjZUJsdXJWYWxpZGF0b3JFbCgpO1xuICAgIH0pO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0YWJJbmRleEVsLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsICgpID0+IHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbGVtZW50T3JEZXNjZW5kYW50QWN0aXZlKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvcmNlQmx1clZhbGlkYXRvckVsKCk7XG4gICAgICB9LCAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZm9yY2VCbHVyVmFsaWRhdG9yRWwoKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsaWRhdG9yRWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2JsdXInKSk7XG4gIH1cblxuICBwcml2YXRlIGlzRWxlbWVudE9yRGVzY2VuZGFudEFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lbC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgfVxufVxuXG5jbGFzcyBWYWxpZGF0b3JFbGVtZW50V3JhcHBlciBpbXBsZW1lbnRzIFZhbGlkYXRvckNvbXBvbmVudCB7XG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdmFsaWRhdG9yRWw6IFZhbGlkYXRvckVsZW1lbnQpIHt9XG59XG5cbi8qKlxuICogR2V0cyBhIHZhbGlkYXRvciBjb21wb25lbnQgcmVsYXRlZCB0byB0aGUgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBvYmogLSBBbnkgb2JqZWN0LlxuICogQHJldHVybnMgVGhlIHJlbGF0ZWQgdmFsaWRhdG9yIGNvbXBvbmVudCBvciBgbnVsbGAgaWYgbm8gcmVsYXRlZCB2YWxpZGF0b3IgY29tcG9uZW50IGlzIGZvdW5kLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsaWRhdG9yQ29tcG9uZW50KG9iajogdW5rbm93bik6IG51bGwgfCBWYWxpZGF0b3JDb21wb25lbnQge1xuICBpZiAoaXNWYWxpZGF0b3JDb21wb25lbnQob2JqKSkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBpZiAob2JqIGluc3RhbmNlb2YgQ29sb3JDb21wb25lbnQpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRvckVsZW1lbnRXcmFwcGVyKG9iai5jb2xvclBpY2tlckVsKTtcbiAgfVxuXG4gIGlmIChvYmogaW5zdGFuY2VvZiBEcm9wZG93bkNvbXBvbmVudCkge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdG9yRWxlbWVudFdyYXBwZXIob2JqLnNlbGVjdEVsKTtcbiAgfVxuXG4gIGlmIChvYmogaW5zdGFuY2VvZiBQcm9ncmVzc0JhckNvbXBvbmVudCkge1xuICAgIHJldHVybiBuZXcgT3ZlcmxheVZhbGlkYXRvckNvbXBvbmVudChvYmoucHJvZ3Jlc3NCYXIpO1xuICB9XG5cbiAgaWYgKG9iaiBpbnN0YW5jZW9mIFNlYXJjaENvbXBvbmVudCkge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdG9yRWxlbWVudFdyYXBwZXIob2JqLmlucHV0RWwpO1xuICB9XG5cbiAgaWYgKG9iaiBpbnN0YW5jZW9mIFNsaWRlckNvbXBvbmVudCkge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdG9yRWxlbWVudFdyYXBwZXIob2JqLnNsaWRlckVsKTtcbiAgfVxuXG4gIGlmIChvYmogaW5zdGFuY2VvZiBUZXh0QXJlYUNvbXBvbmVudCkge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdG9yRWxlbWVudFdyYXBwZXIob2JqLmlucHV0RWwpO1xuICB9XG5cbiAgaWYgKG9iaiBpbnN0YW5jZW9mIFRleHRDb21wb25lbnQpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRvckVsZW1lbnRXcmFwcGVyKG9iai5pbnB1dEVsKTtcbiAgfVxuXG4gIGlmIChvYmogaW5zdGFuY2VvZiBUb2dnbGVDb21wb25lbnQpIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlWYWxpZGF0b3JDb21wb25lbnQob2JqLnRvZ2dsZUVsKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkYXRvckNvbXBvbmVudChvYmo6IHVua25vd24pOiBvYmogaXMgVmFsaWRhdG9yQ29tcG9uZW50IHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCAmJiAndmFsaWRhdG9yRWwnIGluIG9iaiAmJiAhIShvYmogYXMgUGFydGlhbDxWYWxpZGF0b3JDb21wb25lbnQ+KS52YWxpZGF0b3JFbDtcbn1cbiIsICIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIFZhbGlkYXRpb24gdXRpbGl0aWVzLlxuICovXG5cbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgeyBvbmVPZiB9IGZyb20gJy4uL3JlZy1leHAudHMnO1xuXG4vKipcbiAqIEhvbGRzIGEgdmFsaWRhdGlvbiBtZXNzYWdlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRpb25NZXNzYWdlSG9sZGVyIHtcbiAgLyoqXG4gICAqIEEgdmFsaWRhdGlvbiBtZXNzYWdlLlxuICAgKi9cbiAgdmFsaWRhdGlvbk1lc3NhZ2U6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUeXBlIGd1YXJkIHRvIGNoZWNrIGlmIGEgdmFsdWUgaXMgYSB2YWxpZGF0aW9uIG1lc3NhZ2UgaG9sZGVyLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWUgaXMgYSB2YWxpZGF0aW9uIG1lc3NhZ2UgaG9sZGVyLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRhdGlvbk1lc3NhZ2VIb2xkZXIodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBWYWxpZGF0aW9uTWVzc2FnZUhvbGRlciB7XG4gIHJldHVybiAodmFsdWUgYXMgUGFydGlhbDxWYWxpZGF0aW9uTWVzc2FnZUhvbGRlcj4pLnZhbGlkYXRpb25NZXNzYWdlICE9PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogTWF0Y2hlcyBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBzYWZlIHRvIHVzZSBpbiBmaWxlIG5hbWVzIHdpdGhpbiBPYnNpZGlhbi5cbiAqL1xuZXhwb3J0IGNvbnN0IE9CU0lESUFOX1VOU0FGRV9GSUxFTkFNRV9DSEFSUyA9IC9bI15bXFxdfF0vZztcblxuLyoqXG4gKiBXaW5kb3dzLXNwZWNpZmljIHVuc2FmZSBmaWxlIG5hbWUgcGF0aCBjaGFyYWN0ZXJzLlxuICovXG5leHBvcnQgY29uc3QgV0lORE9XU19VTlNBRkVfUEFUSF9DSEFSUyA9IC9bKlxcXFwvPD46fD9cIl0vZztcblxuLyoqXG4gKiBVbml4LXNwZWNpZmljIHVuc2FmZSBmaWxlIG5hbWUgcGF0aCBjaGFyYWN0ZXJzLlxuICovXG5leHBvcnQgY29uc3QgVU5JWF9VTlNBRkVfUEFUSF9DSEFSUyA9IC9bXFwwL10vZztcblxuLyoqXG4gKiBSZXR1cm5zIGEgcmVnZXhwIG1hdGNoaW5nIGFsbCB1bnNhZmUgY2hhcmFjdGVycyBpbiBmaWxlIG5hbWVzL3BhdGhzLlxuICpcbiAqIEluY2x1ZGVzIGJvdGggT1Mtc3BlY2lmaWMgcmVzdHJpY3Rpb25zIGFuZCBPYnNpZGlhbi1zcGVjaWZpYyBvbmVzLlxuICpcbiAqIEBwYXJhbSBpc1dpbmRvd3MgLSBXaGV0aGVyIHRvIGluY2x1ZGUgV2luZG93cy1zcGVjaWZpYyByZXN0cmljdGlvbnMuIERlZmF1bHRzIHRvIGBQbGF0Zm9ybS5pc1dpbmAuXG4gKiBAcmV0dXJucyBBIHJlZ2V4cCBtYXRjaGluZyBhbGwgdW5zYWZlIGNoYXJhY3RlcnMgaW4gZmlsZSBuYW1lcy9wYXRocy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE9zQW5kT2JzaWRpYW5VbnNhZmVQYXRoQ2hhcnNSZWdFeHAoaXNXaW5kb3dzPzogYm9vbGVhbik6IFJlZ0V4cCB7XG4gIHJldHVybiBvbmVPZihbXG4gICAgZ2V0T3NVbnNhZmVQYXRoQ2hhcnNSZWdFeHAoaXNXaW5kb3dzKSxcbiAgICBPQlNJRElBTl9VTlNBRkVfRklMRU5BTUVfQ0hBUlNcbiAgXSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHJlZ2V4cCBtYXRjaGluZyBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBzYWZlIHRvIHVzZSBpbiBmaWxlIG5hbWVzL3BhdGhzIGF0IHRoZSBPUyBsZXZlbC5cbiAqXG4gKiBAcGFyYW0gaXNXaW5kb3dzIC0gV2hldGhlciB0byBpbmNsdWRlIFdpbmRvd3Mtc3BlY2lmaWMgcmVzdHJpY3Rpb25zLiBEZWZhdWx0cyB0byBgUGxhdGZvcm0uaXNXaW5gLlxuICogQHJldHVybnMgQSByZWdleHAgbWF0Y2hpbmcgY2hhcmFjdGVycyB0aGF0IGFyZSBub3Qgc2FmZSB0byB1c2UgaW4gZmlsZSBuYW1lcy9wYXRocyBhdCB0aGUgT1MgbGV2ZWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPc1Vuc2FmZVBhdGhDaGFyc1JlZ0V4cChpc1dpbmRvd3M/OiBib29sZWFuKTogUmVnRXhwIHtcbiAgaXNXaW5kb3dzID8/PSBQbGF0Zm9ybS5pc1dpbjtcbiAgcmV0dXJuIGlzV2luZG93cyA/IFdJTkRPV1NfVU5TQUZFX1BBVEhfQ0hBUlMgOiBVTklYX1VOU0FGRV9QQVRIX0NIQVJTO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBDb21tYW5kIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgeyBGdXp6eVN1Z2dlc3RNb2RhbCB9IGZyb20gJ29ic2lkaWFuJztcblxuZXhwb3J0IGNsYXNzIENvbW1hbmRQaWNrZXJNb2RhbCBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPENvbW1hbmQ+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBvbkNob29zZTogKGNvbW1hbmQ6IENvbW1hbmQpID0+IHZvaWQ7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBvbkNob29zZTogKGNvbW1hbmQ6IENvbW1hbmQpID0+IHZvaWQpIHtcbiAgICBzdXBlcihhcHApO1xuICAgIHRoaXMub25DaG9vc2UgPSBvbkNob29zZTtcbiAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCdTZWFyY2ggY29tbWFuZHNcdTIwMjYnKTtcbiAgfVxuXG4gIHB1YmxpYyBvdmVycmlkZSBnZXRJdGVtcygpOiBDb21tYW5kW10ge1xuICAgIHJldHVybiB0aGlzLmFwcC5jb21tYW5kcy5saXN0Q29tbWFuZHMoKS5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpKTtcbiAgfVxuXG4gIHB1YmxpYyBvdmVycmlkZSBnZXRJdGVtVGV4dChjb21tYW5kOiBDb21tYW5kKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29tbWFuZC5uYW1lO1xuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIG9uQ2hvb3NlSXRlbShjb21tYW5kOiBDb21tYW5kKTogdm9pZCB7XG4gICAgdGhpcy5vbkNob29zZShjb21tYW5kKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUEsc0NBQUFBLFNBQUE7QUFJQSxRQUFJLElBQUk7QUFDUixRQUFJLElBQUksSUFBSTtBQUNaLFFBQUksSUFBSSxJQUFJO0FBQ1osUUFBSSxJQUFJLElBQUk7QUFDWixRQUFJLElBQUksSUFBSTtBQUNaLFFBQUksSUFBSSxJQUFJO0FBZ0JaLElBQUFBLFFBQU8sVUFBVSxTQUFVLEtBQUssU0FBUztBQUN2QyxnQkFBVSxXQUFXLENBQUM7QUFDdEIsVUFBSSxPQUFPLE9BQU87QUFDbEIsVUFBSSxTQUFTLFlBQVksSUFBSSxTQUFTLEdBQUc7QUFDdkMsZUFBTyxNQUFNLEdBQUc7QUFBQSxNQUNsQixXQUFXLFNBQVMsWUFBWSxTQUFTLEdBQUcsR0FBRztBQUM3QyxlQUFPLFFBQVEsT0FBTyxRQUFRLEdBQUcsSUFBSSxTQUFTLEdBQUc7QUFBQSxNQUNuRDtBQUNBLFlBQU0sSUFBSTtBQUFBLFFBQ1IsMERBQ0UsS0FBSyxVQUFVLEdBQUc7QUFBQSxNQUN0QjtBQUFBLElBQ0Y7QUFVQSxhQUFTLE1BQU0sS0FBSztBQUNsQixZQUFNLE9BQU8sR0FBRztBQUNoQixVQUFJLElBQUksU0FBUyxLQUFLO0FBQ3BCO0FBQUEsTUFDRjtBQUNBLFVBQUksUUFBUSxtSUFBbUk7QUFBQSxRQUM3STtBQUFBLE1BQ0Y7QUFDQSxVQUFJLENBQUMsT0FBTztBQUNWO0FBQUEsTUFDRjtBQUNBLFVBQUksSUFBSSxXQUFXLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLFVBQUksUUFBUSxNQUFNLENBQUMsS0FBSyxNQUFNLFlBQVk7QUFDMUMsY0FBUSxNQUFNO0FBQUEsUUFDWixLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQ0gsaUJBQU8s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STtBQUFBLE1BQ0osTUFBTTtBQUFBLElBQ1IsQ0FBQztBQUVELFNBQUssV0FBVztBQUFBLE1BQ2QsVUFBVSxNQUFNO0FBQUUsWUFBSSxlQUFlLEtBQUssS0FBSyxLQUFLLFFBQVEsRUFBRSxLQUFLO0FBQUEsTUFBRztBQUFBLE1BQ3RFLElBQUk7QUFBQSxNQUNKLE1BQU07QUFBQSxJQUNSLENBQUM7QUFBQSxFQUNIO0FBQ0Y7OztBRC9CQSxJQUFPLGVBQVE7IiwKICAibmFtZXMiOiBbIm1vZHVsZSIsICJtb2R1bGUiLCAiZGVidWciLCAibW9kdWxlIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiY29uc29sZSIsICJwbHVnaW5JZCIsICJwbHVnaW5JZCIsICJkZWJ1ZyIsICJ0IiwgIm1vZHVsZSIsICJjb3B5IiwgIm5vb3AiLCAiaW5zdGFuY2UiLCAiaW1wb3J0X29ic2lkaWFuIiwgInQiLCAiQ3NzQ2xhc3MiLCAicGx1Z2luSWQiLCAiT2JzaWRpYW5QbHVnaW4iLCAidCIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgInQiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJ0IiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgInQiXQp9Cg==
