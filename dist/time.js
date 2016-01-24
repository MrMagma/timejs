"use strict";

/**
 * @fileOverview The base time object which is exposed to the global scope
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");
var timeunits = require("./timeunits.js");
var timeformat = require("./timeformat.js");

var util = {
    parseFormatString: function parseFormatString(str) {
        if (str.length !== 0 && str[0] === "$") {
            var key = str.slice(1);

            return timeformat.getFormat(key);
        } else {
            var format = timeformat.getFormat(str);

            if (format) {
                return format;
            } else {
                format = timeformat.create(str);
                timeformat.define(str, format);

                return format;
            }
        }
    }
};

var time = {
    /**
     * @description Adds one or more lengths of time together and returns the
       resulting time length using the same format as the first time supplied.
     * @param {...string|string[]} times - The list of times to add together
     * @param {string} [format="$default"] - Specifies the format of the
       times passed in and the time to be returned
     * @returns {string} The result of adding all of the supplied times together
     * @contributors Joshua Gammage
     */

    add: function add(times) {
        var format = arguments.length <= 1 || arguments[1] === undefined ? "$default" : arguments[1];

        format = util.parseFormatString(format);

        var ms = 0;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = times[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _time = _step.value;

                ms += this.parse(_time, format);
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

        return this.stringify(ms, format);
    },

    /**
     * @description Wrapper for the native `setTimeout` function, allowing
       intervals to be passed in the form of formatted time strings
     * @param {number|string} interval - The interval to be converted and then
       passed to `setTimeout`
     * @param {function} callback - The callback to be passed to `setTimeout`
     * @param {string} [format="$default"] - Specifies the format of
       the returned time
     * @param {...*} params - The extra parameters to be passed to `setTimeout`
     * @returns {number} The timeoutID returned by the call to `setTimeout`
     * @contributors Joshua Gammage
     */
    after: function after(interval, callback) {
        var format = arguments.length <= 2 || arguments[2] === undefined ? "$default" : arguments[2];

        for (var _len = arguments.length, params = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
            params[_key - 3] = arguments[_key];
        }

        params.unshift(callback, this.parse(interval, format));
        return setTimeout.apply(global, params);
    },

    /**
     * @description Wrapper for the native `setInterval` function, allowing
       intervals to be passed in the form of formatted time strings
     * @param {function} callback - The callback to be passed to `setInterval`
     * @param {number|string} interval - The interval to be converted and then
       passed to `setInteval`
     * @param {string} [format="$default"] - The format of the time to
       be returned
     * @param {...*} params - The extra parameters to be passed to `setInteval`
     * @returns {number} The intervalID returned by the call to `setInteval`
     * @contributors Joshua Gammage
     */
    every: function every(interval, callback) {
        var format = arguments.length <= 2 || arguments[2] === undefined ? "$default" : arguments[2];

        for (var _len2 = arguments.length, params = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
            params[_key2 - 3] = arguments[_key2];
        }

        params.unshift(callback, this.parse(interval, format));
        return setInterval.apply(global, params);
    },

    /**
     * @description Converts a time from one format to another
     * @param {string|number} time - The time to format
     * @param {string} [toFormat="$default"] - The format of `time`
     * @param {string} [fromFormat="$default"] - The format to return `time` in.
     * @returns {string} `time` formatted with the `toFormat` format.
     * @contributors Joshua Gammage
     */
    format: function format(time) {
        var toFormat = arguments.length <= 1 || arguments[1] === undefined ? "$default" : arguments[1];
        var fromFormat = arguments.length <= 2 || arguments[2] === undefined ? "$default" : arguments[2];

        return this.stringify(this.parse(time, fromFormat), toFormat);
    },

    /**
     * @description Takes in a formatted length of time and converts it to
       milliseconds
     * @param {string} formattedTime - The formatted time string to convert to
       milliseconds
     * @param {string} [format="$default"] - The format of the time to be parsed
     * @returns {number} The result of converting the time to milliseconds
     * @contributors Joshua Gammage
     */
    parse: function parse(formattedTime) {
        var format = arguments.length <= 1 || arguments[1] === undefined ? "$default" : arguments[1];

        if (_.isNumber(formattedTime)) {
            return formattedTime;
        }
        if (!_.isString(formattedTime)) {
            return;
        }
        format = util.parseFormatString(format);

        var timeData = format.unformat(formattedTime);
        var ms = 0;

        for (var unit in timeData) {
            if (timeData.hasOwnProperty(unit)) {
                ms += timeunits.convert(timeData[unit], unit, "millisecond");
            }
        }

        return ms;
    },

    /**
     * @description Takes in a length of time measured in milliseconds and
       converts it to a formatted string.
     * @param {number} ms - The length of time, in milliseconds, to format
     * @param {string} [format="$default"] - The format of the time to
       be returned
     * @returns {string} A string representing the formatted time
     * @contributors Joshua Gammage
     */
    stringify: function stringify(ms) {
        var format = arguments.length <= 1 || arguments[1] === undefined ? "$default" : arguments[1];

        if (!_.isNumber(ms)) {
            return;
        }
        format = util.parseFormatString(format);

        var units = format.references;
    },

    /**
     * @description Subtracts two or more lengths of time from each other and
       returns the resulting time length using the same format as the first
       time supplied.
     * @param {...string|string[]} times - The list of times to subtract from
       each other
     * @param {string} [format="$default"] - The format of the time to
       be returned
     * @returns {string} The result of subtracting all supplied times from each
       other
     * @contributors Joshua Gammage
     */
    subtract: function subtract(times) {
        var format = arguments.length <= 1 || arguments[1] === undefined ? "$default" : arguments[1];

        format = util.parseFormatString(format);

        var ms = this.parse(times.shift(), format);

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = times[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _time2 = _step2.value;

                ms += this.parse(_time2, format);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return this.stringify(ms, format);
    },

    /**
     * @description Defines a new format for use with the "$format" pattern.
     * @param {string} name - The name of the format to be created.
     * @param {string} value - The value of the format to define.
     * @contributors Joshua Gammage
     */
    defineFormat: function defineFormat(name, value) {
        timeformat.define(name, value);
    }
};

timeformat.define("default", "{if hrs then hrs ' hour' else ''}{if hrs != 1 then 's' else ''}" + "{if hrs mins then ' ' else ''}{if mins then mins ' minute' else ''}" + "{if mins != 1 then 's' else ''}{if mins secs then ' ' else ''}" + "{if secs then secs ' second' else ''}{if secs != 1 then 's' else ''}");

timeunits.update({
    name: "millisecond",
    aliases: ["milliseconds", "ms", "millis"]
});

timeunits.define({
    name: "second",
    base: "millisecond",
    scale: 1000,
    aliases: ["seconds", "secs", "sec", "s"]
});

timeunits.define({
    name: "minute",
    base: "second",
    scale: 60,
    aliases: ["minutes", "mins", "min", "m"]
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