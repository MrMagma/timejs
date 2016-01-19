"use strict";

var time = {
    add: function add() {},
    after: function after() {},
    every: function every() {},
    format: function format() {},
    parse: function parse() {},
    stringify: function stringify() {},
    subtract: function subtract() {}
};

/* 
 This is for browser environments so that people don't have to use
 require(blah) to use our module
 */
if (typeof window !== "undefined") {
    window.time = time;
}
module.exports = time;