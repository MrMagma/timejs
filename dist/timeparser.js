"use strict";

/**
 * @fileOverview Contains a set of utilities used for manipulating time strings
 * @author Joshua Gammage
 * @version 1.0.0
 */

var timeunits = require("./timeunits.js");
var timetokenizer = require("./timetokenizer.js");

var timeparser = {
    /**
     * @description Converts a time string to an array of tokens for easier
       manipulation
     * @param {string} time - The time to be tokenized
     * @returns {object[]} An array of tokens that were parsed from the time
     * @contributors Joshua Gammage
     */

    tokenize: function tokenize(time) {
        return tokenizer.tokenize(time);
    }
};

if (Object.freeze) {
    Object.freeze(timeparser);
}

module.exports = timeparser;