/**
 * @fileOverview The base time object which is exposed to the global scope
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");
var timeunits = require("./timeunits.js");
var timeformat = require("./timeformat.js");

var util = {
    parseFormatString(str) {
        if (str.length !== 0 && str[0] === "$") {
            let key = str.slice(1);
            
            return timeformat.getFormat(key);
        } else {
            let format = timeformat.getFormat(str);
            
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
    add(times, format = "$default") {
        format = util.parseFormatString(format);
        
        let ms = 0;
        
        for (let time of times) {
            ms += this.parse(time, format);
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
    after(interval, callback, format="$default", ...params) {
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
    every(interval, callback, format="$default", ...params) {
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
    format(time, toFormat = "$default", fromFormat = "$default") {
        return this.stringify(this.parse(time, fromFormat), toFormat);
    },
    /**
     * @description Cross browser utility for getting the number of milliseconds
       since January 1st 1970.
     * @returns {number} The number of milliseconds since January 1st 1970
     * @contributors Joshua Gammage
     */
    now() {
        return (new Date()).getTime();
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
    parse(formattedTime, format = "$default") {
        if (_.isNumber(formattedTime)) {
            return formattedTime;
        }
        if (!_.isString(formattedTime)) {
            return;
        }
        format = util.parseFormatString(format);
        
        let timeData = format.unformat(formattedTime);
        let ms = 0;
        
        for (let unit in timeData) {
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
    stringify(ms, format = "$default") {
        if (!_.isNumber(ms)) {
            return;
        }
        format = util.parseFormatString(format);
        
        let units = format.references;
        
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
    subtract(times, format = "$default") {
        format = util.parseFormatString(format);
        
        let ms = this.parse(times.shift(), format);
        
        for (let time of times) {
            ms += this.parse(time, format);
        }
        
        return this.stringify(ms, format);
    },
    /**
     * @description Wrapper for the native `Date` class simply for convenience.
     * @param {...*} args - The arguments to pass to the `Date` constructor.
     * @returns The number of milliseconds between the given date and January
       1st 1970
     */
    then(...args) {
        return Date.apply({}, args).getTime();
    },
    /**
     * @description Defines a new format for use with the "$format" pattern.
     * @param {string} name - The name of the format to be created.
     * @param {string} value - The value of the format to define.
     * @contributors Joshua Gammage
     */
    defineFormat(name, value) {
        timeformat.define(name, value);
    }
};

timeformat.define("default",
    "{if hrs then hrs ' hour' else ''}{if hrs != 1 then 's' else ''}" +
    "{if hrs mins then ' ' else ''}{if mins then mins ' minute' else ''}" +
    "{if mins != 1 then 's' else ''}{if mins secs then ' ' else ''}" +
    "{if secs then secs ' second' else ''}{if secs != 1 then 's' else ''}");

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
