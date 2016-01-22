"use strict";

/**
 * @fileOverview Contains all code required to tokenize a time string
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");
var keywords = ["IF", "THEN", "ELSE"];

var dat = {
    time: "",
    ind: 0,
    tokens: []
};

var timetokenizer = {
    /**
     * @description Resets the tokenizer
     * @contributors Joshua Gammage
     */

    reset: function reset() {
        dat.ind = 0;
        dat.tokens = [];
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
     * @description Utility method to determine whether a given character is the
       beginning of a code section
     * @param {number} charCode - The character code of the character to check
     * @returns {boolean} Whether the character represented by the given
       character code represents the beginning of a code section
     */
    isCodeBegin: function isCodeBegin(charCode) {
        return charCode === 123;
    },

    /**
     * @description Utility method to determine whether a given character is the
       ending of a code section
     * @param {number} charCode - The character code of the character to check
     * @returns {boolean} Whether the character represented by the given
       character code represents the ending of a code section
     */
    isCodeEnd: function isCodeEnd(charCode) {
        return charCode === 125;
    },

    /**
     * @description Utility method to determine whether a given character is an
       ignore character
     * @param {number} charCode - The character code of the character to check
     * @returns {boolean} Whether or not the character is an ignore character
     */
    isIgnore: function isIgnore(charCode) {
        return charCode === 37;
    },

    /**
     * @description Utility method for determining whether a given character is
       a string toggle (open/close quote).
     * @param charCode - The character code of the character to check
     * @returns {boolean} Whether or not the character represented by the given
       character code is a string toggle.
     * @contributors Joshua Gammage
     */
    isStringToggle: function isStringToggle(charCode) {
        return charCode === 39 || charCode === 34;
    },

    /**
     * @description Utility method for determining whether a given character is
       a string toggle (open/close quote).
     * @param charCode - The character code of the character to check
     * @returns {boolean} Whether or not the character represented by the given
       character code is a string toggle.
     * @contributors Joshua Gammage
     */
    isComparatorStart: function isComparatorStart(charCode) {
        return charCode >= 60 && charCode <= 62;
    },

    /**
     * @description Utility method for determining whether a given character is
       the beginning of a number.
     * @param charCode - The character code of the character to check
     * @returns {boolean} Whether or not the character represented by the given
       character code can begin a number.
     * @contributors Joshua Gammage
     */
    isNumberStart: function isNumberStart(charCode) {
        return this.isDecDigit(charCode) || this.isSign(charCode) || charCode === 46;
    },

    /**
     * @description Utility method for determining whether a given character is
       the beginning of an identifier (variable name or keyword)
     * @param charCode - The character code of the character to check
     * @returns {boolean} Whether or not the character represented by the given
       character code can be the beginning of an identifier.
     * @contributors Joshua Gammage
     */
    isIdentifierStart: function isIdentifierStart(charCode) {
        return charCode >= 97 && charCode <= 122 || charCode >= 65 && charCode <= 90;
    },

    /**
     * @description Utility method for determining whether a given character
       can be a part of an identifier (after the beginning)
     * @param charCode - The character code of the character to check
     * @returns {boolean} Whether or not the character represented by the given
       character code can be part of an identifier.
     * @contributors Joshua Gammage
     */
    isIdentifierPart: function isIdentifierPart(charCode) {
        return this.isIdentifierStart(charCode) || this.isDecDigit(charCode);
    },

    /**
     * @description Utility method for determining whether a given character
       represents the end of a comparator
     * @param charCode - The character code of the character to check
     * @returns {boolean} Whether or not the character represented by the given
       character code could be the end of a comparator
     * @contributors Joshua Gammage
     */
    isComparatorEnd: function isComparatorEnd(charCode) {
        return charCode === 61;
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
     * @description Parses strings from the current character and returns a
       string token
     * @returns {object} A token representing the string that was parsed
     * @contributors Joshua Gammage
     */
    parseString: function parseString() {
        var raw = dat.time[dat.ind];
        var value = "";
        var start = dat.ind;

        ++dat.ind;

        while (!this.end()) {
            var charCode = dat.time.charCodeAt(dat.ind);

            if (this.isStringToggle(charCode)) {
                raw += dat.time[dat.ind++];
                break;
            } else {
                if (this.isIgnore(charCode)) {
                    raw += dat.time[dat.ind++];
                }

                raw += dat.time[dat.ind];
                value += dat.time[dat.ind];
                ++dat.ind;
            }
        }

        return {
            type: "String",
            start: start,
            end: dat.ind,
            raw: raw,
            value: value
        };
    },

    /**
     * @description Parses logical comparators such as "<", "=", and ">="
     * @returns {object} A token representing the logical comparator parsed
     * @contributors Joshua Gammage
     */
    parseComparator: function parseComparator() {
        var raw = dat.time[dat.ind];
        var start = dat.ind;

        if ((raw === "<" || raw === ">") && this.isComparatorEnd(dat.time.charCodeAt(dat.ind + 1))) {
            ++dat.ind;
            raw += dat.time[dat.ind];
        }

        dat.ind++;

        return {
            type: "Comparator",
            start: start,
            end: dat.ind,
            raw: raw,
            operator: raw
        };
    },

    /**
     * @description Parses a numbers, allowing for decimal, hexadecimal, octal,
       and binary literals along with numbers like ".2" (instead of "0.2")
     * @returns {object} A token representing the number parsed including it's
       base, and it's decimal representation
     * @contributors Joshua Gammage
     */
    parseNumber: function parseNumber() {
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
     * @description Parses identifiers (variable names or keywords)
     * @returns {object} A token representing the identifier parsed. Can have a
       type of either "Identifier" or "Keyword"
     * @contributors Joshua Gammage
     */
    parseIdentifier: function parseIdentifier() {
        var raw = "";
        var name = "";
        var start = dat.ind;

        while (!this.end()) {
            var charCode = dat.time.charCodeAt(dat.ind);

            if (!this.isIdentifierPart(charCode)) {
                break;
            }

            raw += dat.time[dat.ind];
            name += dat.time[dat.ind];

            ++dat.ind;
        }

        var keywordInd = keywords.indexOf(name.toUpperCase());

        if (keywordInd !== -1) {
            return {
                type: "Keyword",
                start: start,
                end: dat.ind,
                raw: raw,
                keyword: keywords[keywordInd]
            };
        } else {
            return {
                type: "Identifier",
                start: start,
                end: dat.ind,
                raw: raw,
                name: name
            };
        }
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
            decStart += dat.time[dat.ind++];
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
            type: "Number",
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
            type: "Number",
            raw: value,
            value: Number(value),
            start: start,
            end: dat.ind
        };
    },

    /**
     * @description Parses a block of code until it's end, adding all parsed
       tokens to the list of tokens and ending when the code block does.
     * @contributors Joshua Gammage
     */
    parseCode: function parseCode() {
        var done = false;

        while (!this.end() && !done) {
            var charCode = dat.time.charCodeAt(dat.ind);

            if (this.isCodeBegin(charCode)) {
                dat.tokens.push({
                    type: "CodeOpen",
                    start: dat.ind,
                    end: dat.ind + 1,
                    raw: dat.time[dat.ind]
                });
                ++dat.ind;
            } else if (this.isStringToggle(charCode)) {
                dat.tokens.push(this.parseString());
            } else if (this.isComparatorStart(charCode)) {
                dat.tokens.push(this.parseComparator());
            } else if (this.isNumberStart(charCode)) {
                dat.tokens.push(this.parseNumber());
            } else if (this.isIdentifierStart(charCode)) {
                dat.tokens.push(this.parseIdentifier());
            } else if (this.isCodeEnd(charCode)) {
                dat.tokens.push({
                    type: "CodeClose",
                    start: dat.ind,
                    end: dat.ind + 1,
                    raw: dat.time[dat.ind]
                });
                ++dat.ind;
                done = true;
            } else {
                dat.tokens[dat.tokens.length - 1].raw += dat.time[dat.ind];
                dat.tokens[dat.tokens.length - 1].end += 1;
                ++dat.ind;
                if (!this.isWhitespace(charCode)) {
                    // Warn or something about illegal tokens
                }
            }
        }
    },

    /**
     * @description Parses non-code parts of a string, simply adding them as
       a string token. Also handles starting the parseCode method when
       necessary
     * @contributors Joshua Gammage
     */
    parseDefault: function parseDefault() {
        var raw = "";
        var value = "";
        var start = dat.ind;

        while (!this.end()) {
            var charCode = dat.time.charCodeAt(dat.ind);

            if (this.isIgnore(charCode)) {
                raw += dat.time[dat.ind];
                ++dat.ind;
            } else if (this.isCodeBegin(charCode)) {
                break;
            }

            raw += dat.time[dat.ind];
            value += dat.time[dat.ind];

            ++dat.ind;
        }

        dat.tokens.push({
            type: "String",
            start: start,
            end: dat.ind,
            raw: raw,
            value: value
        });
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

        var tokens = dat.tokens;

        while (!this.end()) {
            var charCode = dat.time.charCodeAt(dat.ind);

            if (this.isCodeBegin(charCode)) {
                this.parseCode();
            } else {
                this.parseDefault();
            }
        }

        return tokens;
    }
};

if (Object.freeze) {
    Object.freeze(timetokenizer);
}

module.exports = timetokenizer;