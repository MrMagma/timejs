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
            
            /*
            Number
            String in code block
            Ignore characters
            */
            
            it("should tokenize open and close code characters", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("{}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "CodeClose",
                        start: 1,
                        end: 2,
                        raw: "}"
                    }
                ]), true);
                
            });
            
            it("should consider content outside of codeblocks a string", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("a{}"), [
                    {
                        type: "String",
                        start: 0,
                        end: 1,
                        raw: "a",
                        value: "a"
                    },
                    {
                        type: "CodeOpen",
                        start: 1,
                        end: 2,
                        raw: "{"
                    },
                    {
                        type: "CodeClose",
                        start: 2,
                        end: 3,
                        raw: "}"
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("{}a"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "CodeClose",
                        start: 1,
                        end: 2,
                        raw: "}"
                    },
                    {
                        type: "String",
                        start: 2,
                        end: 3,
                        raw: "a",
                        value: "a"
                    }
                ]), true);
                
            });
            
            it("should tokenize indentifiers", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("{aVar}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "Identifier",
                        start: 1,
                        end: 5,
                        raw: "aVar",
                        name: "aVar"
                    },
                    {
                        type: "CodeClose",
                        start: 5,
                        end: 6,
                        raw: "}"
                    }
                ]), true);
                
            });
            
            it("should tokenize keywords", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("{if}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "Keyword",
                        start: 1,
                        end: 3,
                        raw: "if",
                        keyword: "IF"
                    },
                    {
                        type: "CodeClose",
                        start: 3,
                        end: 4,
                        raw: "}"
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("{IF}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "Keyword",
                        start: 1,
                        end: 3,
                        raw: "IF",
                        keyword: "IF"
                    },
                    {
                        type: "CodeClose",
                        start: 3,
                        end: 4,
                        raw: "}"
                    }
                ]), true);
                
            });
            
            it("should tokenize numbers", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("{2}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "Number",
                        base: 10,
                        start: 1,
                        end: 2,
                        raw: "2",
                        value: 2
                    },
                    {
                        type: "CodeClose",
                        start: 2,
                        end: 3,
                        raw: "}"
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("{.2}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "Number",
                        base: 10,
                        start: 1,
                        end: 3,
                        raw: ".2",
                        value: 0.2
                    },
                    {
                        type: "CodeClose",
                        start: 3,
                        end: 4,
                        raw: "}"
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("{2e-1}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "Number",
                        base: 10,
                        start: 1,
                        end: 5,
                        raw: "2e-1",
                        value: 2e-1
                    },
                    {
                        type: "CodeClose",
                        start: 5,
                        end: 6,
                        raw: "}"
                    }
                ]), true);
                
            });
            
            it("should tokenize base-X literals", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("{0x6Cf4}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "Number",
                        base: 16,
                        start: 1,
                        end: 7,
                        raw: "0x6Cf4",
                        value: 0x6CF4
                    },
                    {
                        type: "CodeClose",
                        start: 7,
                        end: 8,
                        raw: "}"
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("{0o17}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "Number",
                        base: 8,
                        start: 1,
                        end: 5,
                        raw: "0o17",
                        value: 15
                    },
                    {
                        type: "CodeClose",
                        start: 5,
                        end: 6,
                        raw: "}"
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("{0b101}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "Number",
                        base: 2,
                        start: 1,
                        end: 6,
                        raw: "0b101",
                        value: 5
                    },
                    {
                        type: "CodeClose",
                        start: 6,
                        end: 7,
                        raw: "}"
                    }
                ]), true);
                
            });
            
            it("should tokenize strings in code blocks", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("{'a'}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "String",
                        start: 1,
                        end: 4,
                        raw: "'a'",
                        value: "a"
                    },
                    {
                        type: "CodeClose",
                        start: 4,
                        end: 5,
                        raw: "}"
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("{\"a\"}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "String",
                        start: 1,
                        end: 4,
                        raw: "\"a\"",
                        value: "a"
                    },
                    {
                        type: "CodeClose",
                        start: 4,
                        end: 5,
                        raw: "}"
                    }
                ]), true);
                
            });
            
            it("should accept % as the equivalent of \\", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("%{notCode ha ha} ha"), [
                    {
                        type: "String",
                        start: 0,
                        end: 19,
                        raw: "%{notCode ha ha} ha",
                        value: "{notCode ha ha} ha"
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("%%"), [
                    {
                        type: "String",
                        start: 0,
                        end: 2,
                        raw: "%%",
                        value: "%"
                    }
                ]), true);
                
                assert.equal(_.isEqual(tokenizer.tokenize("{'a%'b'}"), [
                    {
                        type: "CodeOpen",
                        start: 0,
                        end: 1,
                        raw: "{"
                    },
                    {
                        type: "String",
                        start: 1,
                        end: 7,
                        raw: "'a%'b'",
                        value: "a'b"
                    },
                    {
                        type: "CodeClose",
                        start: 7,
                        end: 8,
                        raw: "}"
                    }
                ]), true);
                
            });
            
            it("should properly parse complex expressions", function() {
                
                assert.equal(_.isEqual(tokenizer.tokenize("hi {IF a =  2 then 'b '   ElSe 'c%'%%d' } bye"), [
                    {
                        type: "String",
                        start: 0,
                        end: 3,
                        raw: "hi ",
                        value: "hi "
                    },
                    {
                        type: "CodeOpen",
                        start: 3,
                        end: 4,
                        raw: "{"
                    },
                    {
                        type: "Keyword",
                        start: 4,
                        end: 7,
                        raw: "IF ",
                        keyword: "IF"
                    },
                    {
                        type: "Identifier",
                        start: 7,
                        end: 9,
                        raw: "a ",
                        name: "a"
                    },
                    {
                        type: "Comparator",
                        start: 9,
                        end: 12,
                        raw: "=  ",
                        operator: "="
                    },
                    {
                        type: "Number",
                        start: 12,
                        end: 14,
                        raw: "2 ",
                        value: 2,
                        base: 10
                    },
                    {
                        type: "Keyword",
                        start: 14,
                        end: 19,
                        raw: "then ",
                        keyword: "THEN"
                    },
                    {
                        type: "String",
                        start: 19,
                        end: 26,
                        raw: "'b '   ",
                        value: "b "
                    },
                    {
                        type: "Keyword",
                        start: 26,
                        end: 31,
                        raw: "ElSe ",
                        keyword: "ELSE",
                    },
                    {
                        type: "String",
                        start: 31,
                        end: 40,
                        raw: "'c%'%%d' ",
                        value: "c'%d"
                    },
                    {
                        type: "CodeClose",
                        start: 40,
                        end: 41,
                        raw: "}"
                    },
                    {
                        type: "String",
                        start: 41,
                        end: 45,
                        raw: " bye",
                        value: " bye"
                    }
                ]), true);
                
            });
            
        });
        
    });
    
});
