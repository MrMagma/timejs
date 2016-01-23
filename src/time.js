/**
 * @fileOverview The base time object which is exposed to the global scope
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");
var timeunits = require("./timeunits.js");
var timeparser = require("./timeparser.js");

let regexes = {
    number: /[\+\-]{0,1}(?:[0-9]*\.[0-9]+|[0-9]+)(?:e[\+\-]{0,1}[0-9]*|)/
};

class Format {
    constructor(cfg = {}) {
        let {regex, references = []} = cfg;
        this.regex = new RegExp(regex);
        this.raw = regex;
        this.references = references;
    }
    unformat(str) {
        let match = str.match(this.regex);
        // For some reason Babel doesn't like if we name this variable "format"
        let formatData = {};
        
        if (match !== null) {
            for (let i = 0; i < this.references.length; i++) {
                formatData[this.references[i]] = match[i + 1];
            }
        }
        
        return formatData;
    }
    format() {
        
    }
    static create(ast) {
        let regex = "";
        let references = [];
        
        for (let node of ast.body) {
            if (node.type === "StringLiteral" ||
                node.type === "IntegerLiteral") {
                regex += escapeRegexChars(node.value);
            } else if (node.type === "NamedReference") {
                regex += `(${regexes.number.source})`;
                references.push(node.reference);
            } else if (node.type === "ConditionalStatement") {
                let conseqCapture = Format.create(node.consequent);
                let altCapture = Format.create(node.alternate);
                
                regex += `(?:${conseqCapture.raw}|${altCapture.raw})`;
                references = references.concat(conseqCapture.references)
                    .concat(altCapture.references);
            } else if (node.type === "TemplateBlock") {
                let capture = Format.create(node);
                regex += capture.raw;
                references = references.concat(capture.references);
            }
        }
        
        return new Format({
            regex: regex,
            references: references
        });
    }
}

function escapeRegexChars(str) {
    return str.replace(/\\|\^|\$|\*|\+|\?|\.|\(|\)|\:|\=|\!|\||\{|\}|\,|\[|\]/,
        "\\$&");
}

var defaultFormat = timeparser.parse("{IF yr THEN yr ELSE ''} {IF m then m else ''}");

var defaultCapture = Format.create(defaultFormat);

console.log(defaultCapture.unformat("2 .35e-7"));

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
    add(times, format = defaultFormat) {
        
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
    after() {
        
    },
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
    every() {
        
    },
    /**
     * @description Converts a length of time to a formatted string
     * @param {string|number} time - The time to format
     * @param {string} [format=time.defaultFormat] - The format of the time to
       be returned
     * @returns {string} The formatted time value
     * @contributors Joshua Gammage
     */
    format() {
        
    },
    /**
     * @description Takes in a formatted length of time and converts it to
       milliseconds
     * @param {string} formattedTime - The formatted time string to convert to
       milliseconds
     * @returns {number} The result of converting the time to milliseconds
     * @contributors Joshua Gammage
     */
    parse() {
        
    },
    /**
     * @description Takes in a length of time measured in milliseconds and
       converts it to a formatted string.
     * @param {number} ms - The length of time, in milliseconds, to format
     * @param {string} [format=time.defaultFormat] - The format of the time to
       be returned
     * @returns {string} A string representing the formatted time
     * @contributors Joshua Gammage
     */
    stringify() {
        
    },
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
    subtract() {
        
    }
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
