var assert = require("assert");
var _ = require("underscore");

describe("timeparser.js", function() {
    
    var parser = require("../dist/timeparser.js");
    
    describe("methods", function() {
        
        it("should have a parse method", function() {
            
            assert.equal(_.isFunction(parser.parse), true);
            
        });
        
        describe("the parse method", function() {
            
            it("should only accept strings and arrays", function() {
                
                assert.equal(parser.parse({}) instanceof Error, true);
                assert.equal(parser.parse(2) instanceof Error, true);
                assert.equal(parser.parse("") instanceof Error, false);
                assert.equal(parser.parse([]) instanceof Error, false);
                
            });
            
            it("should return an array", function() {
                
                assert.equal(_.isArray(parser.parse("")), true);
                
            });
            
            it("should properly parse a string", function() {
                
                assert.equal(_.isEqual(parser.parse("a"), [
                    {
                        type: "Word",
                        start: 0,
                        end: 1,
                        value: "a",
                        raw: "a"
                    }
                ]), true);
                
                assert.equal(_.isEqual(parser.parse("a2"), [
                    {
                        type: "Word",
                        start: 0,
                        end: 2,
                        value: "a2",
                        raw: "a2"
                    }
                ]), true);
                
                assert.equal(_.isEqual(parser.parse("2 a b"), [
                    {
                        type: "TimeUnit",
                        start: 0,
                        end: 3,
                        value: 2,
                        unit: "a",
                        raw: "2 a"
                    },
                    {
                        type: "Word",
                        start: 3,
                        end: 5,
                        value: "b",
                        raw: " b"
                    }
                ]), true);
                
            });
            
            it("should parse strings with placeholder units", function() {
                
                assert.equal(_.isEqual(parser.parse("{a}"), [
                    {
                        type: "Placeholder",
                        start: 0,
                        end: 3,
                        raw: "{a}",
                        unit: "a",
                        optional: false
                    }
                ]), true);
                
                assert.equal(_.isEqual(parser.parse("{a*}"), [
                    {
                        type: "Placeholder",
                        start: 0,
                        end: 4,
                        raw: "{a*}",
                        unit: "a",
                        optional: true
                    }
                ]), true);
                
            });
            
            it("should properly parse different combinations", function() {
                
                assert.equal(_.isEqual(parser.parse("2 {a*}"), [
                    {
                        type: "TimeUnit",
                        start: 0,
                        end: 1,
                        value: 2,
                        unit: "",
                        raw: "2"
                    },
                    {
                        type: "Placeholder",
                        start: 1,
                        end: 6,
                        raw: " {a*}",
                        unit: "a",
                        optional: true
                    }
                ]), true);
                
                assert.equal(_.isEqual(parser.parse("{a*} 0xc7A hrs until..."), [
                    {
                        type: "Placeholder",
                        start: 0,
                        end: 4,
                        raw: "{a*}",
                        unit: "a",
                        optional: true
                    },
                    {
                        type: "TimeUnit",
                        start: 4,
                        end: 14,
                        value: 0xc7A,
                        unit: "hrs",
                        raw: " 0xc7A hrs"
                    },
                    {
                        type: "Word",
                        start: 14,
                        end: 23,
                        value: "until...",
                        raw: " until..."
                    }
                ]), true);
                
            });
            
        });
        
    });
    
});
