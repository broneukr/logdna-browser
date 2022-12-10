var LogDNAMethods = /** @class */ (function () {
    function LogDNAMethods() {
    }
    return LogDNAMethods;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray$1(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

var DEFAULT_INGESTION_URL = 'https://logs.mezmo.com/logs/ingest';
var LOG_LINE_FLUSH_TIMEOUT = 250; // ms
var FLUSH_BYTE_LIMIT = 60 * 1024; // Max chrome allows with fetch and keep alive is 64kb, we are making it smaller to account for headers and unknowns
var SAMPLE_RATE = 100;
var STARTING_BACK_OFF = 1000; // 1 sec
var MAX_BACK_OFF = 60000; // 60 sec
var MAX_FETCH_ERROR_RETRY = 30;
var DEFAULT_TAG = 'LogDNA-Browser';
var SESSION_SCORE_KEY = 'logdna::browser::sessionscore';
var SESSION_KEY = 'logdna::browser::sessionid';
var HOSTNAME_CHECK = new RegExp('^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\\.)*' + '([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$');
var DEFAULT_CONFIG = {
    url: DEFAULT_INGESTION_URL,
    hostname: 'logdna-browser-logger',
    flushInterval: LOG_LINE_FLUSH_TIMEOUT,
    enableStacktrace: true,
    sampleRate: SAMPLE_RATE,
    tags: [],
    app: '',
    plugins: [],
    console: true,
    globalErrorHandlers: true,
    debug: false,
    disabled: false,
    hooks: {
        beforeSend: [],
    },
};

var fastSafeStringify = stringify$1;
stringify$1.default = stringify$1;
stringify$1.stable = deterministicStringify;
stringify$1.stableStringify = deterministicStringify;

var LIMIT_REPLACE_NODE = '[...]';
var CIRCULAR_REPLACE_NODE = '[Circular]';

var arr = [];
var replacerStack = [];

function defaultOptions () {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  }
}

// Regular stringify
function stringify$1 (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions();
  }

  decirc(obj, '', 0, [], undefined, 0, options);
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer);
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res
}

function setReplace (replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
  if (propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace });
      arr.push([parent, k, val, propertyDescriptor]);
    } else {
      replacerStack.push([val, k, replace]);
    }
  } else {
    parent[k] = replace;
    arr.push([parent, k, val]);
  }
}

function decirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return
      }
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return
    }

    stack.push(val);
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      var keys = Object.keys(val);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        decirc(val[key], key, i, stack, val, depth, options);
      }
    }
    stack.pop();
  }
}

// Stable-stringify
function compareFunction (a, b) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

function deterministicStringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions();
  }

  var tmp = deterministicDecirc(obj, '', 0, [], undefined, 0, options) || obj;
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer);
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    // Ensure that we restore the object as it was.
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res
}

function deterministicDecirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return
      }
    }
    try {
      if (typeof val.toJSON === 'function') {
        return
      }
    } catch (_) {
      return
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return
    }

    stack.push(val);
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      // Create a temporary object in the required way
      var tmp = {};
      var keys = Object.keys(val).sort(compareFunction);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        deterministicDecirc(val[key], key, i, stack, val, depth, options);
        tmp[key] = val[key];
      }
      if (typeof parent !== 'undefined') {
        arr.push([parent, k, val]);
        parent[k] = tmp;
      } else {
        return tmp
      }
    }
    stack.pop();
  }
}

// wraps replacer function to handle values we couldn't replace
// and mark them as replaced value
function replaceGetterValues (replacer) {
  replacer =
    typeof replacer !== 'undefined'
      ? replacer
      : function (k, v) {
        return v
      };
  return function (key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i];
        if (part[1] === key && part[0] === val) {
          val = part[2];
          replacerStack.splice(i, 1);
          break
        }
      }
    }
    return replacer.call(this, key, val)
  }
}

var validateHostname = function (hostname) { return HOSTNAME_CHECK.test(hostname); };
var parseTags = function (tags) {
    if (tags === void 0) { tags = []; }
    if ((typeof tags !== 'string' && !Array.isArray(tags)) || (Array.isArray(tags) && tags.some(function (tag) { return typeof tag !== 'string'; }))) {
        throw new Error("LogDNA Browser Logger `tags` must be a string or an array of strings");
    }
    if (typeof tags === 'string') {
        tags = [tags];
    }
    return __spreadArray$1([DEFAULT_TAG], tags).filter(function (tag) { return tag !== ''; }).join(',');
};
var stringify = function (obj) { return fastSafeStringify(obj); };
var getStackTrace = function () {
    var stack = new Error().stack || '';
    var array = stack
        .split('\n')
        .map(function (line) { return line.trim(); })
        .filter(function (line) { return !line.includes('@logdna/browser'); });
    return array.join('\n');
};
var _randomBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
/**
 * This implements exponential backoff with "decorrelated jitter" for use in
 * failing HTTP calls and their retries.  Although the HTTP calls shouldn't be in
 * contention with other clients, the jitter will help alleviate a flood
 * of connections to the server in the event LogDNA suddenly comes back
 * online after being unavailable.
 *
 * @see https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
 *
 * @param   {Number} base The base sleep time to be used
 * @param   {Number} cap The maximum sleep time allowable in milliseconds
 * @param   {Number} lastSleep The last (or starting) sleep time used
 * @returns {Number} calculated sleep time
 */
var backOffWithJitter = function (base, cap, lastSleep) { return Math.min(cap, _randomBetween(base, lastSleep * 3)); };
var jsonByteSize = function (obj) {
    var stringified = stringify(obj);
    if (window.TextEncoder) {
        return new TextEncoder().encode(stringified).length;
    }
    return new Blob([stringified]).size;
};
var includeInSampleRate = function (sampleRate, sampleRateScore) {
    if (sampleRate === void 0) { sampleRate = 100; }
    return sampleRateScore <= sampleRate;
};
// This will generate a session score and store it in session storage in case the
// user refreshes a spa or is not an spa app.
var generateSampleRateScore = function () {
    var score;
    var hasSessionStorage = isBrowserStorageAvailable('sessionStorage');
    if (hasSessionStorage) {
        score = window.sessionStorage.getItem(SESSION_SCORE_KEY);
        if (score && isNaN(+score))
            score = null;
    }
    if (!score) {
        score = Math.floor(Math.random() * 100) + 1;
        hasSessionStorage && window.sessionStorage.setItem(SESSION_SCORE_KEY, "".concat(score));
    }
    return +score;
};
var isBrowserStorageAvailable = function (storage) {
    if (!window && !window[storage]) {
        return false;
    }
    var testKey = 'test-key';
    try {
        window[storage].setItem(testKey, 'Test Data');
        window[storage].removeItem(testKey);
        return true;
    }
    catch (error) {
        return false;
    }
};
var isFunction = function (fn) { return typeof fn === 'function'; };
var consoleMethods = ['log', 'error', 'debug', 'warn', 'info'];
var cachedConsole = consoleMethods.reduce(function (a, m) {
    var _a;
    return (__assign(__assign({}, a), (_a = {}, _a[m] = function () { }, _a)));
}, {});
var originalConsole = consoleMethods.reduce(function (a, m) {
    var _a;
    return (__assign(__assign({}, a), (_a = {}, _a[m] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cachedConsole[m].apply(cachedConsole, args);
    }, _a)));
}, {});
// This will delay the caching of the original instance of the console
// until after logdna is enabled and initialized for use with SSR.
var cacheConsole = function () {
    var _a = window.console, log = _a.log, error = _a.error, debug = _a.debug, warn = _a.warn, info = _a.info;
    cachedConsole = { log: log, error: error, debug: debug, warn: warn, info: info };
};
var utils = {
    validateHostname: validateHostname,
    parseTags: parseTags,
    stringify: stringify,
    getStackTrace: getStackTrace,
    backOffWithJitter: backOffWithJitter,
    jsonByteSize: jsonByteSize,
    includeInSampleRate: includeInSampleRate,
    generateSampleRateScore: generateSampleRateScore,
    isBrowserStorageAvailable: isBrowserStorageAvailable,
    isFunction: isFunction,
    originalConsole: originalConsole,
    cacheConsole: cacheConsole,
};

var validateOptions = function (opts) {
    if (opts.ingestionKey == null) {
        throw new Error('Ingestion key can not be undefined when calling init');
    }
    if (!opts.hostname || (opts.hostname && !utils.validateHostname(opts.hostname))) {
        throw new Error("LogDNA Browser Logger: `".concat(opts.hostname || 'undefined', "` is not a valid hostname, see documentation for the `hostname` configuration option for details."));
    }
    if (opts.sampleRate == null || opts.sampleRate < 0 || opts.sampleRate > 100 || isNaN(opts.sampleRate)) {
        throw new Error("LogDNA Browser Logger: `sampleRate` option must be a number between 0 and 100");
    }
};

var buffer = [];
var retryCount = 0;
var backOffInterval = 0;
var loggerError = false;
var timer;
var process$1 = function (lines) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (Array.isArray(lines)) {
                    buffer = buffer.concat(lines);
                }
                else {
                    buffer.push(lines);
                }
                if (timer) {
                    clearTimeout(timer);
                }
                if (!!isUnderByteLimit(buffer)) return [3 /*break*/, 2];
                return [4 /*yield*/, flush()];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                timer = setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, flush()];
                            case 1:
                                _a.sent();
                                timer = undefined;
                                return [2 /*return*/];
                        }
                    });
                }); }, timeout());
                return [2 /*return*/];
        }
    });
}); };
var timeout = function () {
    if (retryCount > 0) {
        backOffInterval = utils.backOffWithJitter(STARTING_BACK_OFF, MAX_BACK_OFF, backOffInterval || STARTING_BACK_OFF);
        return backOffInterval;
    }
    return getOptions().flushInterval || LOG_LINE_FLUSH_TIMEOUT;
};
var splitAndFlush = function (logLines) { return __awaiter(void 0, void 0, void 0, function () {
    var lines, half, lines2;
    return __generator(this, function (_a) {
        lines = __spreadArray$1([], logLines);
        half = Math.floor(lines.length / 2);
        lines2 = lines.splice(half);
        [lines, lines2].forEach(function (block) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, flush(block)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); });
        return [2 /*return*/];
    });
}); };
var isUnderByteLimit = function (buffer) { return utils.jsonByteSize(buffer) < FLUSH_BYTE_LIMIT; };
var flush = function (lines) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!lines) {
                    lines = __spreadArray$1([], buffer);
                    buffer = [];
                }
                if (!lines.length)
                    return [2 /*return*/];
                if (!isUnderByteLimit(lines)) return [3 /*break*/, 2];
                return [4 /*yield*/, send(lines)];
            case 1:
                _a.sent();
                return [3 /*break*/, 5];
            case 2:
                if (!(lines.length === 1)) return [3 /*break*/, 3];
                internalErrorLogger("LogDNA Browser Logger was unable to send the previous log lines because the log size was greater than ".concat(FLUSH_BYTE_LIMIT, " bytes"));
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, splitAndFlush(lines)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
var send = function (lines) { return __awaiter(void 0, void 0, void 0, function () {
    var opts, ingestUrlParams, ingestUrl, errorMsg, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                opts = getOptions();
                if (loggerError) {
                    return [2 /*return*/];
                }
                ingestUrlParams = new URLSearchParams([
                    // @ts-ignore
                    ['hostname', opts.hostname],
                    // @ts-ignore
                    ['now', "".concat(Date.now())],
                    // @ts-ignore
                    ['tags', opts.tags],
                ]);
                ingestUrl = "".concat(opts.url, "?").concat(ingestUrlParams);
                errorMsg = 'Unable to send previous logs batch to LogDNA';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                return [4 /*yield*/, fetch(ingestUrl, {
                        method: 'POST',
                        keepalive: true,
                        headers: {
                            Authorization: "Basic ".concat(btoa("".concat(opts.ingestionKey, ":"))),
                            'Content-Type': 'application/json',
                        },
                        body: utils.stringify({ lines: lines }),
                    })];
            case 2:
                response = _a.sent();
                if (!response.ok) return [3 /*break*/, 3];
                retryCount = 0;
                backOffInterval = 0;
                return [3 /*break*/, 7];
            case 3:
                if (!(response.status >= 400 && response.status < 500)) return [3 /*break*/, 4];
                internalErrorLogger("".concat(errorMsg, ": ").concat(response.statusText));
                return [3 /*break*/, 7];
            case 4:
                if (!(response.status >= 500)) return [3 /*break*/, 7];
                retryCount = retryCount + 1;
                if (!(retryCount > MAX_FETCH_ERROR_RETRY)) return [3 /*break*/, 5];
                internalErrorLogger("".concat(errorMsg, ": ").concat(response.statusText));
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, process$1(lines)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                // If we have any issues sending logs shut down the service immediately
                // This is to avoid ending up in a circular loop of error logs and causing app
                // performance issues or ddos-ing out api.
                loggerError = true;
                internalErrorLogger("LogDNA Browser Logger is unable to send logs to LogDNA. \n      Possible issues:\n       - Your web apps url (".concat(window.location.origin, ") is not listed in your LogDNA account's CORS whitelist domains\n       - Ingestion key is incorrect\n       - The configured LogDNA ingestion url is incorrect\n       - LogDNA ingestion endpoint is down. https://status.mezmo.com/\n\n       Error: ").concat(error_1.message, "\n      "));
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };

var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var BrowserInfo = /** @class */ (function () {
    function BrowserInfo(name, version, os) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.type = 'browser';
    }
    return BrowserInfo;
}());
var NodeInfo = /** @class */ (function () {
    function NodeInfo(version) {
        this.version = version;
        this.type = 'node';
        this.name = 'node';
        this.os = process.platform;
    }
    return NodeInfo;
}());
var SearchBotDeviceInfo = /** @class */ (function () {
    function SearchBotDeviceInfo(name, version, os, bot) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.bot = bot;
        this.type = 'bot-device';
    }
    return SearchBotDeviceInfo;
}());
var BotInfo = /** @class */ (function () {
    function BotInfo() {
        this.type = 'bot';
        this.bot = true; // NOTE: deprecated test name instead
        this.name = 'bot';
        this.version = null;
        this.os = null;
    }
    return BotInfo;
}());
var ReactNativeInfo = /** @class */ (function () {
    function ReactNativeInfo() {
        this.type = 'react-native';
        this.name = 'react-native';
        this.version = null;
        this.os = null;
    }
    return ReactNativeInfo;
}());
// tslint:disable-next-line:max-line-length
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
    ['aol', /AOLShield\/([0-9\._]+)/],
    ['edge', /Edge\/([0-9\._]+)/],
    ['edge-ios', /EdgiOS\/([0-9\._]+)/],
    ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
    ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
    ['samsung', /SamsungBrowser\/([0-9\.]+)/],
    ['silk', /\bSilk\/([0-9._-]+)\b/],
    ['miui', /MiuiBrowser\/([0-9\.]+)$/],
    ['beaker', /BeakerBrowser\/([0-9\.]+)/],
    ['edge-chromium', /EdgA?\/([0-9\.]+)/],
    [
        'chromium-webview',
        /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
    ],
    ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
    ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
    ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
    ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
    ['fxios', /FxiOS\/([0-9\.]+)/],
    ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
    ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
    ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
    ['pie', /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
    ['pie', /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
    ['netfront', /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
    ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
    ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
    ['ie', /MSIE\s(7\.0)/],
    ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
    ['android', /Android\s([0-9\.]+)/],
    ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
    ['safari', /Version\/([0-9\._]+).*Safari/],
    ['facebook', /FB[AS]V\/([0-9\.]+)/],
    ['instagram', /Instagram\s([0-9\.]+)/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
    ['curl', /^curl\/([0-9\.]+)$/],
    ['searchbot', SEARCHBOX_UA_REGEX],
];
var operatingSystemRules = [
    ['iOS', /iP(hone|od|ad)/],
    ['Android OS', /Android/],
    ['BlackBerry OS', /BlackBerry|BB10/],
    ['Windows Mobile', /IEMobile/],
    ['Amazon OS', /Kindle/],
    ['Windows 3.11', /Win16/],
    ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
    ['Windows 98', /(Windows 98)|(Win98)/],
    ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
    ['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
    ['Windows Server 2003', /(Windows NT 5.2)/],
    ['Windows Vista', /(Windows NT 6.0)/],
    ['Windows 7', /(Windows NT 6.1)/],
    ['Windows 8', /(Windows NT 6.2)/],
    ['Windows 8.1', /(Windows NT 6.3)/],
    ['Windows 10', /(Windows NT 10.0)/],
    ['Windows ME', /Windows ME/],
    ['Windows CE', /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
    ['Open BSD', /OpenBSD/],
    ['Sun OS', /SunOS/],
    ['Chrome OS', /CrOS/],
    ['Linux', /(Linux)|(X11)/],
    ['Mac OS', /(Mac_PowerPC)|(Macintosh)/],
    ['QNX', /QNX/],
    ['BeOS', /BeOS/],
    ['OS/2', /OS\/2/],
];
function detect(userAgent) {
    if (!!userAgent) {
        return parseUserAgent(userAgent);
    }
    if (typeof document === 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.product === 'ReactNative') {
        return new ReactNativeInfo();
    }
    if (typeof navigator !== 'undefined') {
        return parseUserAgent(navigator.userAgent);
    }
    return getNodeVersion();
}
function matchUserAgent(ua) {
    // opted for using reduce here rather than Array#first with a regex.test call
    // this is primarily because using the reduce we only perform the regex
    // execution once rather than once for the test and for the exec again below
    // probably something that needs to be benchmarked though
    return (ua !== '' &&
        userAgentRules.reduce(function (matched, _a) {
            var browser = _a[0], regex = _a[1];
            if (matched) {
                return matched;
            }
            var uaMatch = regex.exec(ua);
            return !!uaMatch && [browser, uaMatch];
        }, false));
}
function parseUserAgent(ua) {
    var matchedRule = matchUserAgent(ua);
    if (!matchedRule) {
        return null;
    }
    var name = matchedRule[0], match = matchedRule[1];
    if (name === 'searchbot') {
        return new BotInfo();
    }
    // Do not use RegExp for split operation as some browser do not support it (See: http://blog.stevenlevithan.com/archives/cross-browser-split)
    var versionParts = match[1] && match[1].split('.').join('_').split('_').slice(0, 3);
    if (versionParts) {
        if (versionParts.length < REQUIRED_VERSION_PARTS) {
            versionParts = __spreadArray(__spreadArray([], versionParts, true), createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length), true);
        }
    }
    else {
        versionParts = [];
    }
    var version = versionParts.join('.');
    var os = detectOS(ua);
    var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
    if (searchBotMatch && searchBotMatch[1]) {
        return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
    }
    return new BrowserInfo(name, version, os);
}
function detectOS(ua) {
    for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
        var _a = operatingSystemRules[ii], os = _a[0], regex = _a[1];
        var match = regex.exec(ua);
        if (match) {
            return os;
        }
    }
    return null;
}
function getNodeVersion() {
    var isNode = typeof process !== 'undefined' && process.version;
    return isNode ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
    var output = [];
    for (var ii = 0; ii < count; ii++) {
        output.push('0');
    }
    return output;
}

var context = {};
var addContext = function (_context) {
    context = _context;
};
var getContext = function () { return context; };
var getDynamicContext = function () { return ({
    location: window.location,
}); };
var getStaticContext = function () {
    var browser = detect();
    if (browser == null) {
        return;
    }
    return {
        browser: __assign(__assign({}, browser), { version: "".concat(browser.name, "-").concat(browser.version) }),
    };
};

var sessionId;
var hasSessionStorage = function () { return utils.isBrowserStorageAvailable('sessionStorage'); };
// taken from https://gist.github.com/jed/982883
var generate = function () {
    return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/1|0/g, function () {
        return (0 | (Math.random() * 16)).toString(16);
    });
};
var init$1 = function () {
    if (!hasSessionStorage()) {
        setSessionId(generate());
    }
    else {
        var storage = window.sessionStorage.getItem(SESSION_KEY);
        sessionId = storage || generate();
    }
};
var setSessionId = function (id) {
    if (hasSessionStorage()) {
        window.sessionStorage.setItem(SESSION_KEY, id);
    }
    sessionId = id;
};
var getSessionId = function () { return sessionId; };

var captureMessage = function (_a) {
    var _b = _a.level, level = _b === void 0 ? 'log' : _b, message = _a.message, _c = _a.lineContext, lineContext = _c === void 0 ? {} : _c;
    if (isSendingDisabled())
        return;
    if (message instanceof Error) {
        captureError(message);
        return;
    }
    generateLogLine({ level: level, message: message, lineContext: lineContext });
};
var captureError = function (error, isUnhandledRejection) {
    if (isUnhandledRejection === void 0) { isUnhandledRejection = false; }
    if (isSendingDisabled())
        return;
    var message = error.name ? "".concat(error.name, ": ").concat(error.message) : error.message;
    if (isUnhandledRejection) {
        message = "Uncaught (in promise) ".concat(message);
    }
    generateLogLine({
        level: 'error',
        message: message,
        errorContext: {
            colno: error.columnNumber || error.colno || error.colNo,
            lineno: error.lineNumber || error.lineno || error.lineNo,
            stacktrace: error.stack || error.stacktrace,
            source: error.fileName || error.source,
        },
        disableStacktrace: !!(error.stack || error.stacktrace), // Don't generate a second stacktrace for errors since they already have it
    });
};
var generateLogLine = function (_a) {
    var _b = _a.level, level = _b === void 0 ? 'log' : _b, message = _a.message, _c = _a.lineContext, lineContext = _c === void 0 ? {} : _c, _d = _a.errorContext, errorContext = _d === void 0 ? null : _d, _e = _a.disableStacktrace, disableStacktrace = _e === void 0 ? false : _e;
    var opts = getOptions();
    // run the beforeSend hooks
    var data = (getOptions().hooks || { beforeSend: [] }).beforeSend.reduce(function (acc, fn) { return (acc == null ? null : fn(acc)); }, {
        level: level,
        message: message,
        lineContext: lineContext,
    });
    // beforeSend stopped the log
    if (data == null) {
        return;
    }
    process$1({
        timestamp: Math.floor(Date.now() / 1000),
        app: opts.app || window.location.host,
        line: typeof data.message === 'string' ? data.message : utils.stringify(data.message),
        level: data.level,
        meta: __assign(__assign(__assign({ sessionId: getSessionId() }, getStaticContext()), getDynamicContext()), { stacktrace: disableStacktrace || !opts.enableStacktrace ? undefined : utils.getStackTrace(), context: __assign({}, getContext()), lineContext: data.lineContext, errorContext: errorContext }),
    });
};
var internalErrorLogger = function () {
    var _a, _b;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (utils.isFunction(getOptions().internalErrorLogger)) {
        // @ts-ignore
        (_a = getOptions()).internalErrorLogger.apply(_a, args);
        return;
    }
    return (_b = utils.originalConsole).error.apply(_b, args);
};

var log = function (message, context, level) {
    var _a;
    if (level === void 0) { level = 'log'; }
    captureMessage({
        level: level,
        message: message,
        lineContext: context,
    });
    if (getOptions().debug) {
        (_a = utils.originalConsole)[level].apply(_a, [message, context].filter(function (i) { return i !== undefined; }));
    }
};
var error = function (message, context) {
    log(message, context, 'error');
};
var warn = function (message, context) {
    log(message, context, 'warn');
};
var debug = function (message, context) {
    log(message, context, 'debug');
};
var info = function (message, context) {
    log(message, context, 'info');
};
var Logger = function () { return ({
    name: 'LoggerPlugin',
    methods: function () {
        return {
            log: log,
            error: error,
            warn: warn,
            info: info,
            debug: debug,
        };
    },
}); };

var DEFAULT_CONSOLE_METHODS = ['log', 'debug', 'error', 'warn', 'info'];
var DEFAULT_OPTIONS$2 = {
    integrations: DEFAULT_CONSOLE_METHODS,
};
var Console = function (opts) {
    if (opts === void 0) { opts = DEFAULT_OPTIONS$2; }
    return ({
        name: 'ConsolePlugin',
        init: function () {
            var integrations = opts.integrations;
            if (!Array.isArray(integrations)) {
                throw new Error('LogDNA Browser Logger console integration types must be an array');
            }
            var _a = window.console, log = _a.log, debug = _a.debug, error = _a.error, warn = _a.warn, info = _a.info;
            var _windowConsole = { log: log, debug: debug, error: error, warn: warn, info: info };
            (integrations || [])
                .map(function (method) { return method.toLowerCase(); })
                .forEach(function (method) {
                if (!DEFAULT_CONSOLE_METHODS.includes(method)) {
                    throw Error('LogDNA Browser Logger console plugin was passed an invalid console methods');
                }
                // @ts-ignore
                window.console[method] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    captureMessage({
                        level: method,
                        message: args.length > 1 ? utils.stringify(args) : args[0],
                    });
                    // @ts-ignore
                    _windowConsole[method].apply(_windowConsole, args);
                    return;
                };
            });
        },
    });
};

var DEFAULT_OPTIONS$1 = {
    enableErrorHandler: true,
    enableUnhandledPromiseRejection: true,
};
var addGlobalError = function () {
    window.addEventListener('error', onError);
};
var addUnhandledrejection = function () {
    window.addEventListener('unhandledrejection', onUnhandledRejection, {
        capture: true,
    });
};
/*  istanbul ignore next */
var onUnhandledRejection = function (e) {
    var error = e.reason;
    captureError(error, true);
};
/*  istanbul ignore next */
var onError = function (error) {
    var _a, _b;
    var e = (_b = (_a = error === null || error === void 0 ? void 0 : error.error) !== null && _a !== void 0 ? _a : error) !== null && _b !== void 0 ? _b : {};
    captureError(e);
};
var GlobalErrorHandler = function (opts) {
    if (opts === void 0) { opts = DEFAULT_OPTIONS$1; }
    return ({
        name: 'GlobalErrorHandlerPlugin',
        init: function () {
            if (opts.enableErrorHandler) {
                addGlobalError();
            }
            if (opts.enableUnhandledPromiseRejection) {
                addUnhandledrejection();
            }
        },
    });
};

var installedPlugins = [];
var addPluginMethods = function (options) {
    if (!Array.isArray(options.plugins))
        return;
    options.plugins.forEach(function (p) {
        if (!utils.isFunction(p.methods))
            return;
        // @ts-ignore
        var plugin = p.methods();
        Object.keys(plugin).forEach(function (m) {
            // @ts-ignore
            LogDNAMethods.prototype[m] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (!isInitiated())
                    return;
                /* istanbul ignore next */
                plugin[m].apply(plugin, args);
            };
        });
    });
};
var initPlugins = function (options) {
    if (!Array.isArray(options.plugins))
        return;
    options.plugins.forEach(function (p) {
        if (utils.isFunction(p.init)) {
            try {
                // @ts-ignore
                p.init();
                installedPlugins.push(p.name);
            }
            catch (error) {
                /* istanbul ignore next */
                internalErrorLogger("There was an issue initializing the ".concat(p.name, " plugin"));
                internalErrorLogger(error);
            }
        }
        if (p.hooks && options.hooks) {
            if (utils.isFunction(p.hooks.beforeSend)) {
                options.hooks.beforeSend.push(p.hooks.beforeSend);
                if (!installedPlugins.includes(p.name)) {
                    installedPlugins.push(p.name);
                }
            }
        }
    });
};
var addDefaultPlugins = function (options) {
    var consoleOpts = options.console, globalErrorHandlers = options.globalErrorHandlers;
    if (!options.plugins) {
        options.plugins = [];
    }
    /* istanbul ignore next */
    if (consoleOpts === true || (typeof consoleOpts === 'object' && consoleOpts.enable !== false)) {
        var consoleOptions = typeof consoleOpts === 'object' ? { integrations: consoleOpts.integrations } : undefined;
        options.plugins.push(Console(consoleOptions));
    }
    if (globalErrorHandlers) {
        /* istanbul ignore next */
        var errorHandlerOptions = typeof globalErrorHandlers === 'object' ? globalErrorHandlers : undefined;
        options.plugins.push(GlobalErrorHandler(errorHandlerOptions));
    }
    // Always add logger methods
    options.plugins.push(Logger());
};
var getInstalledPlugins = function () { return installedPlugins; };

/**
 * Version will get injected post build and pre npm
 */
var version = '{{{INJECT_VERSION}}}';
var getVersion = function () { return version; };

var addDebugInfo = function () {
    if (typeof window !== 'undefined') {
        window.__LOGDNA__ = window.__LOGDNA__ || {
            version: getVersion(),
            getContext: getContext,
            getOptions: getOptions,
            getInstalledPlugins: getInstalledPlugins,
            getSessionId: getSessionId,
        };
    }
};

var options = DEFAULT_CONFIG;
var isInitCompleted = false;
var sampleRate;
var methods = new LogDNAMethods();
var config = function (ingestionKey, opts) {
    if (opts === void 0) { opts = DEFAULT_CONFIG; }
    options = Object.assign(DEFAULT_CONFIG, opts);
    options.ingestionKey = ingestionKey;
    options.tags = utils.parseTags(opts.tags);
    options.flushInterval =
        options.flushInterval == null || isNaN(options.flushInterval) || options.flushInterval < LOG_LINE_FLUSH_TIMEOUT ? LOG_LINE_FLUSH_TIMEOUT : options.flushInterval;
    validateOptions(options);
    addDefaultPlugins(options);
    addPluginMethods(options);
};
var init = function (ingestionKey, opts) {
    if (opts === void 0) { opts = DEFAULT_CONFIG; }
    if (ingestionKey) {
        config(ingestionKey, opts);
    }
    if (opts.disabled) {
        return;
    }
    utils.cacheConsole();
    sampleRate = utils.generateSampleRateScore();
    initPlugins(options);
    addFlushEvents();
    init$1();
    addDebugInfo();
    isInitCompleted = true;
};
var getOptions = function () { return options; };
var isInitiated = function () { return isInitCompleted; };
var isSendingDisabled = function () { return options.disabled || !utils.includeInSampleRate(options.sampleRate, sampleRate); };
var addFlushEvents = function () {
    /* istanbul ignore next */
    document.addEventListener('visibilitychange', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (document.visibilityState === 'hidden') {
                flush();
            }
            return [2 /*return*/];
        });
    }); });
    // for safari
    /* istanbul ignore next */
    window.addEventListener('beforeunload', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            flush();
            return [2 /*return*/];
        });
    }); });
};

var NAMESPACE = 'logdna:';
var DEFAULT_OPTIONS = {
    prefix: 'Performance Measurement',
    logLevel: 'debug',
};
var mark = function (name) {
    performance.mark("".concat(NAMESPACE).concat(name));
};
var measure = function (name, start, end) {
    try {
        performance.measure("".concat(NAMESPACE).concat(name), "".concat(NAMESPACE).concat(start));
    }
    catch (error) {
        console.debug('`logdna.measure()` was called with an invalid or missing `mark`.', error);
    }
};
var Metrics = function (opts) {
    if (opts === void 0) { opts = DEFAULT_OPTIONS; }
    return ({
        name: 'MetricsPlugin',
        init: function () {
            var options = __assign(__assign({}, DEFAULT_OPTIONS), opts);
            if ('performance' in window === false || 'PerformanceObserver' in window === false) {
                console.warn("LogDNA Browser Logger cannot initialize ".concat(this.name, ". This browser doesn't support `performance` or `PerformanceObserver`."));
                return;
            }
            var observer = new window.PerformanceObserver(function (items) {
                items.getEntries().forEach(function (item) {
                    if (!item.name.startsWith(NAMESPACE)) {
                        return;
                    }
                    var name = item.name.replace(NAMESPACE, '');
                    var prefix = options.prefix, _a = options.logLevel, logLevel = _a === void 0 ? 'debug' : _a;
                    var prefixMsg = prefix ? "".concat(options.prefix, ": ") : '';
                    captureMessage({
                        level: logLevel,
                        message: "".concat(prefixMsg).concat(name, " took ").concat(Math.floor(item.duration), "ms"),
                        lineContext: {
                            performanceMeasurement: {
                                duration: item.duration,
                                name: name,
                                entryTypes: item.entryType,
                                startTime: item.startTime,
                            },
                        },
                    });
                });
            });
            observer.observe({ entryTypes: ['measure'] });
        },
        methods: function () {
            return { mark: mark, measure: measure };
        },
    });
};

var SSN = function () { return ({
    name: 'SSNFilterPlugin',
    hooks: {
        beforeSend: function (_a) {
            var level = _a.level, message = _a.message, lineContext = _a.lineContext;
            if (typeof message === 'string') {
                message = message.replace(/\d{3}-\d{2}-\d{4}/g, 'XXX-XX-XXXX');
            }
            return {
                level: level,
                message: message,
                lineContext: lineContext,
            };
        },
    },
}); };

var plugins = {
    Metrics: Metrics,
    SSNFilter: SSN,
};

LogDNAMethods.prototype.init = init;
LogDNAMethods.prototype.config = config;
LogDNAMethods.prototype.addContext = addContext;
LogDNAMethods.prototype.setSessionId = setSessionId;
LogDNAMethods.prototype.plugins = plugins;

export { methods as default };
//# sourceMappingURL=index.esm.js.map
