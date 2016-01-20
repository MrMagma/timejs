"use strict";

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
     * @param {string} time - The time to be parse
     * @returns {object} The time "AST" that was generated
     * @contributors Joshua Gammage
     */

    parse: function parse(time) {
        if (!_.isString(time)) {
            return { error: true };
        }

        var tokens = timetokenizer.tokenize(time);

        var nodes = [];

        while (tokens.length > 0) {
            var token = tokens.shift();

            if (token.type === "word") {
                if (nodes.length > 0 && nodes[nodes.length - 1].type === "TimeUnit") {
                    var token2 = nodes[nodes.length - 1];
                    if (token.value === "*" && !token2.optional && token.start === token2.end + 1) {
                        token2.end = token.end;
                        token2.optional = true;
                    } else if (token2.unit.length === 0) {
                        token2.unit = token.value;
                        token2.end = token.end;
                    }
                } else {
                    nodes.push({
                        type: "Word",
                        start: token.start,
                        end: token.end,
                        value: token.value
                    });
                }
            } else if (token.type === "number") {
                nodes.push({
                    start: token.start,
                    end: token.end,
                    value: token.value,
                    unit: "",
                    optional: false,
                    type: "TimeUnit"
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