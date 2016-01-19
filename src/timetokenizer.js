/**
 * @fileOverview Contains all code required to tokenize a time string
 * @author Joshua Gammage
 * @version 1.0.0
 */

var timetokenizer = {
    time: "",
    ind: 0,
    /**
     * @description Resets the tokenizer
     * @contributors Joshua Gammage
     */
    reset() {
        this.ind = 0;
    },
    /**
     * @description Utility method for determining whether parsing should be
       ended or not
     * @returns {boolean} Whether we've reached the end of the string to be
       tokenized
     * @contributors Joshua Gammage
     */
    end() {
        return this.ind >= this.time.length;
    },
    /**
     * @description A utility method for finding whether or not a specific
       character code represents whitespace
     * @param {number} charCode - The character code to be checked
     * @returns {boolean} Whether or not the token is whitespace
     * @contributors Joshua Gammage
     */
    isWhitespace(charCode) {
        // Credit to Esprima for this.
        // https://github.com/jquery/esprima/blob/af83135148f8b681537d1aa161a3c5b2019aaf7d/src/character.ts#L21-L22
        return ((charCode === 0x20) || (charCode === 0x09) ||
        (charCode === 0x0B) || (charCode === 0x0C) || (charCode === 0xA0) ||
            (charCode >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002,
                0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
                0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(charCode) >= 0));
    },
    /**
     * @description Converts a time string to an array of tokens for easier
       manipulation
     * @param {number} charCode - The character code to be checked
     * @returns {boolean} Whether or not the supplied character code represents
       a whitespace character
     * @contributors Joshua Gammage
     */
    isDecDigit(charCode) {
        return (charCode >= 48 && charCode <= 57);
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
    canBeginNum(charCode, charCode2) {
        return (charCode === 43) || (charCode === 45) ||
            this.isDecDigit(charCode) ||
            (charCode === 46 && this.isDecDigit(charCode2));
    },
    /**
     * @description Returns a string representing the start (part before the
       decimal point) of the value of a base-10 number token
     * @returns {string} The part of a number token before the decimal point
     * @contributors Joshua Gammage
     */
    parseDecStart() {
        var decStart = "";
        
        while (!this.end() && this.time[this.ind] !== ".") {
            decStart += this.time[this.ind];
            ++this.ind;
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
    parseDecEnd() {
        let decEnd = this.time[this.ind++];
        
        while (!this.end() && this.isDecDigit(this.time.charCodeAt(this.ind))) {
            decEnd += this.time[this.ind];
            ++this.ind;
        }
        
        if (["e", "E"].indexOf(this.time[this.ind]) >= 0) {
            decEnd += this.time[this.ind++];
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
    parseDecNum() {
        let start = this.ind;
        let value = this.parseDecStart();
        
        value += this.parseDecEnd();
        
        return {
            base: 10,
            type: "number",
            raw: value,
            value: Number(value),
            start: start,
            end: this.ind - 1
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
    parseSpecNum(startStr, legalDigits) {
        let start = this.ind;
        let value = startStr;
        
        this.ind += value.length;
        
        while (!this.end()) {
            let char = this.time[ind].toLowerCase();
            
            if (legalDigits.indexOf(char) >= 0) {
                value += char;
                ++this.ind;
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
            end: this.ind - 1
        };
    },
    /**
     * @description Parses a number and returns it's respective token
     * @returns {object} The token representing the number parsed
     * @contributors Joshua Gammage
     */
    parseNum() {
        if (this.time[this.ind] === "0") {
            let next = this.time[this.ind + 1];
            
            if (next === "x" || next === "X") {
                return this.parseSpecNum("0" + next, [
                    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                    "a", "b", "c", "d", "e", "f"
                ]);
            } else if (next === "o" || next === "O") {
                return this.parseSpecNum("0" + next, [
                    "0", "1", "2", "3", "4", "5", "6", "7"
                ]);
            } else if (next === "b" || next === "B") {
                return this.parseSpecNum("0" + next, [
                    "0", "1"
                ]);
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
    parseWord() {
        let start = this.ind;
        let word = "";
        
        while (!this.isWhitespace() && !this.end()) {
            word += this.time[this.ind];
            ++this.ind;
        }
        
        return {
            type: "word",
            raw: word,
            value: word,
            start: start,
            end: this.ind - 1
        };
    },
    /**
     * @description Tokenizes a time string, returning an array of the tokens
       parsed
     * @param {string} time - The time string to be tokenized
     * @returns {object[]} The tokens that were parsed from the time argument
     * @contributors Joshua Gammage
     */
    tokenize(time) {
        this.reset();
        this.time = time;
                
        let tokens = [];
        
        while (!this.end()) {
            let charCode = this.time.charCodeAt(this.index);
            
            if (this.isWhitespace(charCode)) {
                ++this.ind;
                continue;
            }
            
            if (this.canBeginNum(charCode,
                this.time.charCodeAt(this.ind + 1))) {
                tokens.push(this.parseNum());
            } else {
                tokens.push(this.parseWord());
            }
        }
        
        return tokens;
    }
};

module.exports = timetokenizer;
