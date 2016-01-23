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
            
            it("should return an object", function() {
                
                assert.equal(_.isObject(parser.parse("")), true);
                assert.notEqual(_.isArray(parser.parse("")), true);
                
            });
            
            it("should properly parse a string", function() {
                
                assert.equal(_.isEqual(parser.parse("a"), {
                    type: "Template",
                    body: [
                        {
                            type: "StringLiteral",
                            value: "a"
                        }
                    ]
                }), true);
                
                assert.equal(_.isEqual(parser.parse("{'a'}"), {
                    type: "Template",
                    body: [
                        {
                            type: "TemplateBlock",
                            body: [
                                {
                                    type: "StringLiteral",
                                    value: "a"
                                }
                            ]
                        }
                    ]
                }), true);
                
            });
            
            it("should parse a properly formed statement", function() {
                
                assert.equal(_.isEqual(parser.parse("ab{IF something > .2 THEN 'a' ELSE b} HA!"),
                {
                    type: "Template",
                    body: [
                        {
                            type: "StringLiteral",
                            value: "ab"
                        },
                        {
                            type: "TemplateBlock",
                            body: [
                                {
                                    type: "ConditionalStatement",
                                    test: {
                                        type: "Predicate",
                                        body: [
                                            {
                                                type: "BooleanExpression",
                                                left: {
                                                    type: "NamedReference",
                                                    reference: "something"
                                                },
                                                right: {
                                                    type: "IntegerLiteral",
                                                    value: 0.2
                                                },
                                                operator: ">"
                                            }
                                        ]
                                    },
                                    consequent: {
                                        type: "ThenClause",
                                        body: [
                                            {
                                                type: "StringLiteral",
                                                value: "a"
                                            }
                                        ]
                                    },
                                    alternate: {
                                        type: "ElseClause",
                                        body: [
                                            {
                                                type: "NamedReference",
                                                reference: "b"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            type: "StringLiteral",
                            value: " HA!"
                        }
                    ]
                }), true);
                
            });
            
        });
        
    });
    
});
