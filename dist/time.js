"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview The base time object which is exposed to the global scope
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");
var timeunits = require("./timeunits.js");
var timeparser = require("./timeparser.js");

var regexes = {
    number: /[\+\-]{0,1}(?:[0-9]*\.[0-9]+|[0-9]+)(?:e[\+\-]{0,1}[0-9]*|)/
};

var Format = function () {
    function Format() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Format);

        var regex = cfg.regex;
        var _cfg$references = cfg.references;
        var references = _cfg$references === undefined ? [] : _cfg$references;

        this.regex = new RegExp(regex);
        this.raw = regex;
        this.references = references;
    }

    _createClass(Format, [{
        key: "format",
        value: function format(str) {
            var match = str.match(this.regex);
            // For some reason Babel doesn't like if we name this variable "format"
            var formatData = {};

            if (match !== null) {
                for (var i = 0; i < this.references.length; i++) {
                    formatData[this.references[i]] = match[i + 1];
                }
            }

            return formatData;
        }
    }], [{
        key: "create",
        value: function create(ast) {
            var regex = "";
            var references = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = ast.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var node = _step.value;

                    if (node.type === "StringLiteral" || node.type === "IntegerLiteral") {
                        regex += escapeRegexChars(node.value);
                    } else if (node.type === "NamedReference") {
                        regex += "(" + regexes.number.source + ")";
                        references.push(node.reference);
                    } else if (node.type === "ConditionalStatement") {
                        var conseqCapture = Format.create(node.consequent);
                        var altCapture = Format.create(node.alternate);

                        regex += "(?:" + conseqCapture.raw + "|" + altCapture.raw + ")";
                        references = references.concat(conseqCapture.references).concat(altCapture.references);
                    } else if (node.type === "TemplateBlock") {
                        var capture = Format.create(node);
                        regex += capture.raw;
                        references = references.concat(capture.references);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return new Format({
                regex: regex,
                references: references
            });
        }
    }]);

    return Format;
}();

function escapeRegexChars(str) {
    return str.replace(/\\|\^|\$|\*|\+|\?|\.|\(|\)|\:|\=|\!|\||\{|\}|\,|\[|\]/, "\\$&");
}

var defaultFormat = timeparser.parse("{IF yr THEN yr ELSE ''} {IF m then m else ''}");

var defaultCapture = Format.create(defaultFormat);

console.log(defaultCapture.format("2 .35e-7"));

var time = {
    get defaultFormat() {
        return JSON.parse(JSON.stringify(defaultFormat));
    },
    set defaultFormat(v) {
        defaultFormat = timeparser.parse(v);
    },
    /**
     * @description Adds one or more lengths of time together and returns the
       resulting time length using the same format as the first time supplied.
     * @param {...string|string[]} times - The list of times to add together
     * @param {string} [format=time.defaultFormat] - Specifies the format of
       the returned time
     * @returns {string} The result of adding all of the supplied times together
     * @contributors Joshua Gammage
     */
    add: function add(times) {
        var format = arguments.length <= 1 || arguments[1] === undefined ? defaultFormat : arguments[1];
    },

    /**
     * @description Wrapper for the native `setTimeout` function, allowing
       intervals to be passed in the form of formatted time strings
     * @param {function} callback - The callback to be passed to `setTimeout`
     * @param {number|string} interval - The interval to be converted and then
       passed to `setTimeout`
     * @param {string} [format=time.defaultFormat] - Specifies the format of
       the returned time
     * @param {...*} params - The extra parameters to be passed to `setTimeout`
     * @returns {number} The timeoutID returned by the call to `setTimeout`
     * @contributors Joshua Gammage
     */
    after: function after() {},

    /**
     * @description Wrapper for the native `setInterval` function, allowing
       intervals to be passed in the form of formatted time strings
     * @param {function} callback - The callback to be passed to `setInterval`
     * @param {number|string} interval - The interval to be converted and then
       passed to `setInteval`
     * @param {string} [format=time.defaultFormat] - Specifies the format of
       the returned time
     * @param {...*} params - The extra parameters to be passed to `setInteval`
     * @returns {number} The intervalID returned by the call to `setInteval`
     * @contributors Joshua Gammage
     */
    every: function every() {},

    /**
     * @description Converts a length of time to a formatted string
     * @param {string|number} time - The time to format
     * @param {string} [format=time.defaultFormat] - The format of the time to
       be returned
     * @returns {string} The formatted time value
     * @contributors Joshua Gammage
     */
    format: function format() {},

    /**
     * @description Takes in a formatted length of time and converts it to
       milliseconds
     * @param {string} formattedTime - The formatted time string to convert to
       milliseconds
     * @returns {number} The result of converting the time to milliseconds
     * @contributors Joshua Gammage
     */
    parse: function parse() {},

    /**
     * @description Takes in a length of time measured in milliseconds and
       converts it to a formatted string.
     * @param {number} ms - The length of time, in milliseconds, to format
     * @param {string} [format=time.defaultFormat] - The format of the time to
       be returned
     * @returns {string} A string representing the formatted time
     * @contributors Joshua Gammage
     */
    stringify: function stringify() {},

    /**
     * @description Subtracts two or more lengths of time from each other and
       returns the resulting time length using the same format as the first
       time supplied.
     * @param {...string|string[]} times - The list of times to subtract from
       each other
     * @param {string} [format=time.defaultFormat] - Specifies the format of
       the returned time
     * @returns {string} The result of subtracting all supplied times from each
       other
     * @contributors Joshua Gammage
     */
    subtract: function subtract() {}
};

timeunits.update({
    name: "millisecond",
    aliases: ["milliseconds", "ms", "millis"]
});

timeunits.define({
    name: "second",
    base: "millisecond",
    scale: 1000,
    aliases: ["seconds", "sec", "s"]
});

timeunits.define({
    name: "minute",
    base: "second",
    scale: 60,
    aliases: ["minutes", "min", "m"]
});

timeunits.define({
    name: "hour",
    base: "minute",
    scale: 60,
    aliases: ["hours", "hrs", "hr", "h"]
});

timeunits.define({
    name: "day",
    base: "hour",
    scale: 24,
    aliases: ["days", "d"]
});

// This is the point where units will most likely be useless 90% of the time
timeunits.define({
    name: "week",
    base: "day",
    scale: 7,
    aliases: ["weeks", "wks", "wk", "w"]
});

timeunits.define({
    name: "year",
    base: "day",
    scale: 365.25,
    aliases: ["years", "yrs", "yr", "y"]
});

timeunits.define({
    name: "decade",
    base: "year",
    scale: 10,
    aliases: ["decades"]
});

timeunits.define({
    name: "century",
    base: "year",
    scale: 100,
    aliases: ["centuries"]
});

// If anyone actually uses this unit for something practical I will give them
// an honorable mention and a cookie.
timeunits.define({
    name: "millenium",
    base: "year",
    scale: 1000,
    aliases: ["millenia"]
});

/* 
 This is for browser environments so that people don't have to use
 require(blah) to use our module
 */
if (typeof window !== "undefined") {
    window.time = time;
}
module.exports = time;