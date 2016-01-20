/**
 * @fileOverview Contains a set of utilities used for manipulating time strings
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");
var timeunits = require("./timeunits.js");
var timetokenizer = require("./timetokenizer.js");

var timeparser = {
    /**
     * @description Parses a time string into an AST-ish representation for
       easier use in code
     * @param {string|array} time - The time string or array of tokens to be
       parsed
     * @returns {object} The time "AST" that was generated
     * @contributors Joshua Gammage
     */
    parse(time) {
        if (!_.isString(time) && !_.isArray(time)) {
            return new Error("Invalid argument supplied to timeparser.parse");
        }
        
        let tokens = time;
        
        if (!_.isArray(tokens)) {
            tokens = timetokenizer.tokenize(time);
        }
        
        var nodes = [];
        
        while (tokens.length > 0) {
            let token = tokens.shift();
            
            if (token.type === "word") {
                if (token.value.match(/^\{.+\}$/)) {
                    let tMatch = /^\{(.+?)(\*|)\}$/.exec(token.value);
                    nodes.push({
                        type: "Placeholder",
                        start: token.start,
                        end: token.end,
                        raw: token.raw,
                        unit: tMatch[1],
                        optional: tMatch[2] === "*"
                    });
                } else if (nodes.length > 0 &&
                    nodes[nodes.length - 1].type === "TimeUnit" &&
                    nodes[nodes.length - 1].unit.length === 0) {
                    let pToken = nodes[nodes.length - 1];
                    pToken.unit = token.value;
                    pToken.end = token.end;
                    pToken.raw += token.raw;
                } else {
                    nodes.push({
                        type: "Word",
                        start: token.start,
                        end: token.end,
                        value: token.value,
                        raw: token.raw
                    });
                }
            } else if (token.type === "number") {
                nodes.push({
                    start: token.start,
                    end: token.end,
                    value: token.value,
                    unit: "",
                    type: "TimeUnit",
                    raw: token.raw
                });
            }
        }
        
        return nodes;
    }
};

if (Object.freeze) {
    Object.freeze(timeparser);
}

module.exports = timeparser;
