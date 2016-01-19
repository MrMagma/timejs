"use strict";

/**
 * @fileOverview The base time object which is exposed to the global scope
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");

var units = {
    millisecond: 1
};

function noop() {}

function makeAliasGetter(name) {
    return function () {
        return units[name];
    };
}

var time = {
    defaultFormat: "yr* m* wk* day* hr* min* sec* ms*",
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
        var format = arguments.length <= 1 || arguments[1] === undefined ? this.defaultFormat : arguments[1];
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
    subtract: function subtract() {},

    /**
     * @description Defines a new time unit for use in time strings
     * @param {object} data - Contains data about the time unit, its name,
       its aliases, the base unit, and what factor it scales the base unit by
     * @contributors Joshua Gammage
     */
    defineUnit: function defineUnit(data) {
        if (!_.isObject(data)) {
            return;
        }
        var _data$base = data.base;
        var base = _data$base === undefined ? "millisecond" : _data$base;
        var name = data.name;
        var scale = data.scale;
        // Make sure that the data we've been passed is kosher and doesn't
        // already exist

        if (!_.isNumber(units[base]) || _.isNaN(units[base]) || !_.isNumber(scale) || _.isNaN(scale) || !_.isString(name) || units.hasOwnProperty(name)) {
            return;
        }

        units[name] = {
            base: base,
            scale: scale
        };

        // Add our aliases
        this.addAlias(data);
    },

    /**
     * @description Adds a new alias or list of aliases for a specific time
       value
     * @param {object} data - Contains the alias(es) to add and the unit to add
       them to
     * @contributors Joshua Gammage
     */
    addAlias: function addAlias(data) {
        if (!_.isObject(data)) {
            return;
        }
        var name = data.name;
        var alias = data.alias;
        var aliases = data.aliases;

        if (!units[name]) {
            return;
        }

        // Make sure that aliases is an array for simplicity
        if (!_.isArray(aliases)) {
            aliases = [];
        }

        // Push alias (whether it be defined or not) to aliases. Also for
        // simplicity
        aliases.push(alias);

        // Filter out any aliases that we can't use (non-string, name already
        // exists, starts with a number)
        aliases = aliase.fiter(function (aliasName) {
            return _.isString(aliasName) && !units[aliasName] && !aliasName.match(/^[0-9]/);
        });

        var getter = makeAliasGetter(name);

        // Define our getter on every alias, and noop the setter
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = aliases[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var aliasName = _step.value;

                Object.defineProperty(units, aliasName, {
                    get: getter,
                    set: noop
                });
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
    }
};

time.addAlias({
    name: "millisecond",
    aliases: ["milliseconds", "ms", "millis"]
});

time.defineUnit({
    name: "second",
    base: "millisecond",
    scale: 1000,
    aliases: ["seconds", "sec", "s"]
});

time.defineUnit({
    name: "minute",
    base: "second",
    scale: 60,
    aliases: ["minutes", "min", "m"]
});

time.defineUnit({
    name: "hour",
    base: "minute",
    scale: 60,
    aliases: ["hours", "hrs", "hr", "h"]
});

time.defineUnit({
    name: "day",
    base: "hour",
    scale: 24,
    aliases: ["days", "d"]
});

// This is the point where units will most likely be useless 90% of the time
time.defineUnit({
    name: "week",
    base: "day",
    scale: 7,
    aliases: ["weeks", "wks", "wk", "w"]
});

time.defineUnit({
    name: "year",
    base: "day",
    scale: 365.25,
    aliases: ["years", "yrs", "yr", "y"]
});

time.defineUnit({
    name: "decade",
    base: "year",
    scale: 10,
    aliases: ["decades"]
});

time.defineUnit({
    name: "century",
    base: "year",
    scale: 100,
    aliases: ["centuries"]
});

// If anyone actually uses this unit for something practical I will give them
// an honorable mention and a cookie.
time.defineUnit({
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