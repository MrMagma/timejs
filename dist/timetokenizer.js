"use strict";

/**
 * @fileOverview Contains all code required to tokenize a time string
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");

var dat = {
    time: "",
    ind: 0
};

var timetokenizer = {
    /**
     * @description Resets the tokenizer
     * @contributors Joshua Gammage
     */

    reset: function reset() {
        dat.ind = 0;
    },

    /**
     * @description Utility method for determining whether parsing should be
       ended or not
     * @returns {boolean} Whether we've reached the end of the string to be
       tokenized
     * @contributors Joshua Gammage
     */
    end: function end() {
        return dat.ind >= dat.time.length;
    },

    /**
     * @description A utility method for finding whether or not a specific
       character code represents whitespace
     * @param {number} charCode - The character code to be checked
     * @returns {boolean} Whether or not the token is whitespace
     * @contributors Joshua Gammage
     */
    isWhitespace: function isWhitespace(charCode) {
        // Credit to Esprima for this.
        // https://github.com/jquery/esprima/blob/af83135148f8b681537d1aa161a3c5b2019aaf7d/src/character.ts#L21-L22
        return charCode === 0x20 || charCode === 0x09 || charCode === 0x0B || charCode === 0x0C || charCode === 0xA0 || charCode >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(charCode) >= 0;
    },

    /**
     * @description Utility method to determine whether a given character code
       represents a digit (0-9)
     * @param {number} charCode - The character code to be checked
     * @returns {boolean} Whether or not the supplied character code represents
       a whitespace character
     * @contributors Joshua Gammage
     */
    isDecDigit: function isDecDigit(charCode) {
        return charCode >= 48 && charCode <= 57;
    },

    /**
     * @description Utilitiy method for finding whether or not a given character
       code represents a sign ("+" or "-")
     * @param {number} charCode - The character code to be checked
     * @returns {boolean} Whether or not the supplied character code represents
       a whitespace character
     * @contributors Joshua Gammage
     */
    isSign: function isSign(charCode) {
        return charCode === 43 || charCode === 45;
    },

    /**
     * @description Utility method to determine whether a sequence of two
       characters can begin a number
     * @param {number} charCode - The character code representing the first
       character in the sequence
     * @param {number} charCode2 - The character code representing the second
       character in the sequence
     * @returns {boolean} Whether or not the sequence of characters can begin a
       number
     * @contributors Joshua Gammage
     */
    canBeginNum: function canBeginNum(charCode, charCode2) {
        return this.isSign(charCode) || this.isDecDigit(charCode) || charCode === 46 && this.isDecDigit(charCode2);
    },

    /**
     * @description Returns a string representing the start (part before the
       decimal point) of the value of a base-10 number token
     * @returns {string} The part of a number token before the decimal point
     * @contributors Joshua Gammage
     */
    parseDecStart: function parseDecStart() {
        var decStart = "";

        while (!this.end() && this.isDecDigit(dat.time.charCodeAt(dat.ind)) && dat.time[dat.ind] !== ".") {
            decStart += dat.time[dat.ind];
            ++dat.ind;
        }

        return decStart;
    },

    /**
     * @description Returns a string representing the end (part after and
       including the decimal point) of a base-10 number token
     * @returns {string} The part of a number token after and including the
       decimal point
     * @contributors Joshua Gammage
     */
    parseDecEnd: function parseDecEnd() {
        var decEnd = "";

        while (!this.end() && (this.isDecDigit(dat.time.charCodeAt(dat.ind)) || dat.time[dat.ind] === ".")) {
            decEnd += dat.time[dat.ind];
            ++dat.ind;
        }

        var charCode2 = dat.time.charCodeAt(dat.ind + 1);

        if (["e", "E"].indexOf(dat.time[dat.ind]) >= 0 && (this.isSign(charCode2) || this.isDecDigit(charCode2))) {
            decEnd += dat.time[dat.ind++];
            decEnd += dat.time[dat.ind++];
            decEnd += this.parseDecStart();
        }

        if (!decEnd) {
            decEnd = "";
        }

        return decEnd;
    },

    /**
     * @description Parses a base-10 number and returns the token for it
     * @returns {object} The token representing the number parsed
     * @contributors Joshua Gammage
     */
    parseDecNum: function parseDecNum() {
        var start = dat.ind;
        var value = this.parseDecStart() + this.parseDecEnd();

        return {
            base: 10,
            type: "number",
            raw: value,
            value: Number(value),
            start: start,
            end: dat.ind
        };
    },

    /**
     * @description Parses a base-X number and returns it's resulting token
     * @param {string} startStr - The beginning of the number (i.e.  the "0x"
       in "0xfe3f")
     * @param {string[]} legalDigits - The (case insensitive) collection of
       legal digits for the number
     * @returns {object} The token representing the number parsed
     * @contributors Joshua Gammage
     */
    parseSpecNum: function parseSpecNum(startStr, legalDigits) {
        var start = dat.ind;
        var value = startStr;

        dat.ind += value.length;

        while (!this.end()) {
            var char = dat.time[dat.ind];

            if (legalDigits.indexOf(char.toLowerCase()) >= 0) {
                value += char;
                ++dat.ind;
            } else {
                break;
            }
        }

        return {
            base: legalDigits.length,
            type: "number",
            raw: value,
            value: Number(value),
            start: start,
            end: dat.ind
        };
    },

    /**
     * @description Parses a number and returns it's respective token
     * @returns {object} The token representing the number parsed
     * @contributors Joshua Gammage
     */
    parseNum: function parseNum() {
        if (dat.time[dat.ind] === "0") {
            var next = dat.time[dat.ind + 1];

            if (next === "x" || next === "X") {
                return this.parseSpecNum("0" + next, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]);
            } else if (next === "o" || next === "O") {
                return this.parseSpecNum("0" + next, ["0", "1", "2", "3", "4", "5", "6", "7"]);
            } else if (next === "b" || next === "B") {
                return this.parseSpecNum("0" + next, ["0", "1"]);
            }
        }

        return this.parseDecNum();
    },

    /**
     * @description Parses a word (non-number) element in a string and returns
       the resulting token
     * @returns {object} The token representing the word that was parsed
     * @contributors Joshua Gammage
     */
    parseWord: function parseWord() {
        var start = dat.ind;
        var word = "";

        while (!this.isWhitespace(dat.time.charCodeAt(dat.ind)) && !this.end()) {
            word += dat.time[dat.ind];
            ++dat.ind;
        }

        return {
            type: "word",
            raw: word,
            value: word,
            start: start,
            end: dat.ind
        };
    },

    /**
     * @description Tokenizes a time string, returning an array of the tokens
       parsed
     * @param {string} time - The time string to be tokenized
     * @returns {object[]} The tokens that were parsed from the time argument
     * @contributors Joshua Gammage
     */
    tokenize: function tokenize(time) {
        if (!_.isString(time)) {
            return new Error("Invalid first argument. Must be of type 'string'");
        }

        this.reset();
        dat.time = time;

        var tokens = [];
        // Keep track of the whitespace we've "ignored"
        var whitespace = "";

        while (!this.end()) {
            var charCode = dat.time.charCodeAt(dat.ind);

            if (this.isWhitespace(charCode)) {
                whitespace += dat.time[dat.ind];
                ++dat.ind;
                continue;
            }

            var token = undefined;

            if (this.canBeginNum(charCode, dat.time.charCodeAt(dat.ind + 1))) {
                token = this.parseNum();
            } else {
                token = this.parseWord();
            }

            // Add our whitespace to the token and adjust its start and raw
            // content accordingly
            token.start -= whitespace.length;
            token.raw = whitespace + token.raw;
            whitespace = "";

            tokens.push(token);
        }

        return tokens;
    }
};

if (Object.freeze) {
    Object.freeze(timetokenizer);
}

module.exports = timetokenizer;