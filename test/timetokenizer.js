var assert = require("assert");
var _ = require("underscore");

describe("timetokenizer.js", function() {
    
    var tokenizer = require("../dist/timetokenizer.js");
    
    describe("methods", function() {
        
        it("should have a tokenize method", function() {
            
            assert.equal(_.isFunction(tokenizer.tokenize), true);
            
        });
        
        describe("the tokenize method", function() {
            
            it("should return an array", function() {
                
                assert.equal(_.isArray(tokenizer.tokenize("")), true);
                
            });
            
            it("should return an error if a non-string argument is supplied", function() {
                
                assert.equal(tokenizer.tokenize() instanceof Error, true);
                assert.equal(tokenizer.tokenize(2) instanceof Error, true);
                assert.equal(tokenizer.tokenize([]) instanceof Error, true);
                assert.equal(tokenizer.tokenize("Bob") instanceof Error, false);
                
            });
            
            it("should tokenize an input into words or numbers", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize(""), [
                    
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("2"), [
                    {
                        base: 10,
                        type: "number",
                        raw: "2",
                        value: 2,
                        start: 0,
                        end: 1
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("hr"), [
                    {
                        type: "word",
                        raw: "hr",
                        value: "hr",
                        start: 0,
                        end: 2
                    }
                ]), true);
                
            });
            
            it("should parse input into a series of words and numbers", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("2hr"), [
                    {
                        base: 10,
                        type: "number",
                        raw: "2",
                        value: 2,
                        start: 0,
                        end: 1
                    },
                    {
                        type: "word",
                        raw: "hr",
                        value: "hr",
                        start: 1,
                        end: 3
                    }
                ]), true);
                
            });
            
            it("should add preceding whitespace to the raw value of a token", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("2 hr"), [
                    {
                        base: 10,
                        type: "number",
                        raw: "2",
                        value: 2,
                        start: 0,
                        end: 1
                    },
                    {
                        type: "word",
                        raw: " hr",
                        value: "hr",
                        start: 1,
                        end: 4
                    }
                ]), true);
                
            });
            
            it("should parse numbers with decimals", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("2.2"), [
                    {
                        base: 10,
                        type: "number",
                        raw: "2.2",
                        value: 2.2,
                        start: 0,
                        end: 3
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize(".2"), [
                    {
                        base: 10,
                        type: "number",
                        raw: ".2",
                        value: 0.2,
                        start: 0,
                        end: 2
                    }
                ]), true);
                
            });
            
            it("should parse numbers in scientific notation", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("2e2"), [
                    {
                        base: 10,
                        type: "number",
                        raw: "2e2",
                        value: 2e2,
                        start: 0,
                        end: 3
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("2.2e-2"), [
                    {
                        base: 10,
                        type: "number",
                        raw: "2.2e-2",
                        value: 2.2e-2,
                        start: 0,
                        end: 6
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("2E2"), [
                    {
                        base: 10,
                        type: "number",
                        raw: "2E2",
                        value: 2e2,
                        start: 0,
                        end: 3
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("2.2E-2"), [
                    {
                        base: 10,
                        type: "number",
                        raw: "2.2E-2",
                        value: 2.2e-2,
                        start: 0,
                        end: 6
                    }
                ]), true);
                
            });
            
            it("should parse hexadecimal literals", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("0xf4C3"), [
                    {
                        base: 16,
                        type: "number",
                        raw: "0xf4C3",
                        value: 0xf4C3,
                        start: 0,
                        end: 6
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("0Xf4C3"), [
                    {
                        base: 16,
                        type: "number",
                        raw: "0Xf4C3",
                        value: 0xf4C3,
                        start: 0,
                        end: 6
                    }
                ]), true);
                
            });
            
            it("should parse octal literals", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("0o752"), [
                    {
                        base: 8,
                        type: "number",
                        raw: "0o752",
                        value: 490,
                        start: 0,
                        end: 5
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("0O752"), [
                    {
                        base: 8,
                        type: "number",
                        raw: "0O752",
                        value: 490,
                        start: 0,
                        end: 5
                    }
                ]), true);
                
            });
            
            it("should parse binary literals", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("0b101"), [
                    {
                        base: 2,
                        type: "number",
                        raw: "0b101",
                        value: 5,
                        start: 0,
                        end: 5
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("0B101"), [
                    {
                        base: 2,
                        type: "number",
                        raw: "0B101",
                        value: 5,
                        start: 0,
                        end: 5
                    }
                ]), true);
                
            });
            
        });
        
    });
    
});
