/**
 * @fileOverview Contains a set of utilities used for manipulating time strings
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");
var timeunits = require("./timeunits.js");
var timetokenizer = require("./timetokenizer.js");

// Private utility methods
let util = {
    /**
     * @description Parses a single token into it's AST node. Used primarily for
       parsing literals and identifiers.
     * @param token - The token to be parsed
     * @contributors Joshua Gammage
     */
    parseToken(token) {
        if (token.type === "Number") {
            return {
                type: "IntegerLiteral",
                value: token.value
            };
        } else if (token.type === "String") {
            return {
                type: "StringLiteral",
                value: token.value
            };
        } else if (token.type === "Identifier") {
            return {
                type: "NamedReference",
                reference: token.name
            };
        }
    },
    /**
     * @description Parses a keyword token into an AST node. Contains logic
       for parsing IF blocks.
     * @param {object} token - The token to be used as a starting point for
       parsing.
     * @param {object[]} tokens - The full list of tokens that come after
       the first token passed.
     * @param {object} root - The root AST node from which to base all
       operations off of
     * @contributors Joshua Gammage
     */
    parseKeyword(token, tokens, root) {
        if (token.keyword === "IF") {
            let node = {
                type: "ConditionalStatement",
                test: {
                    type: "Predicate",
                    body: []
                },
                consequent: {
                    type: "ThenClause",
                    body: []
                },
                alternate: {
                    type: "ElseClause",
                    body: []
                }
            };
            
            this.parseTokens(tokens, node.test, (token, tokens) => {
                return (token.type === "CodeClose" || (token.type === "Keyword" &&
                    token.keyword === "THEN"));
            });
            
            this.parseTokens(tokens, node.consequent, (token) => {
                return (token.type === "CodeClose" || (token.type === "Keyword" &&
                    token.keyword === "ELSE"));
            });
            
            this.parseTokens(tokens, node.alternate, (token) => {
                return (token.type === "CodeClose");
            });
            
            root.body.push(node);
        }
    },
    /**
     * @description Parses a comparator token into an expression node, using
       special logic to add the previously parsed AST node as the left side of
       the expression.
     * @param {object} token - The token to be used as a starting point for
       parsing.
     * @param {object[]} tokens - The full list of tokens that come after
       the first token passed.
     * @param {object} root - The root AST node from which to base all
       operations off of
     * @contributors Joshua Gammage
     */
    parseComparator(token, tokens, root) {
        let left = root.body.pop();
        let right = tokens.shift();
        
        if (!left || ["StringLiteral", "IntegerLiteral", "NamedReference",
            "BooleanExpression"].indexOf(left.type) === -1) {
            return new Error("Invalid left side for boolean expression");
        }
        
        if (!right || ["Number", "String", "Identifier"].indexOf(right.type) === -1) {
            return new Error("Unexpected end to boolean expression");
        }
        
        let boolExpr = {
            type: "BooleanExpression",
            left: left,
            right: parseToken(right),
            operator: token.operator
        };
        
        root.body.push(boolExpr);
    },
    /**
     * @description Parses a tokens into a template block node. Called whenever
       a CodeOpen token is encountered and stops execution upon encountering a
       CodeClose token.
     * @param {object} token - The token to be used as a starting point for
       parsing.
     * @param {object[]} tokens - The full list of tokens that come after
       the first token passed.
     * @param {object} root - The root AST node from which to base all
       operations off of
     * @contributors Joshua Gammage
     */
    parseBlock(token, tokens, root) {
        let node = {
            type: "TemplateBlock",
            body: []
        };
        
        this.parseTokens(tokens, node, token => token.type === "CodeClose");
        
        root.body.push(node);
    },
    /**
     * @description Parses a group of tokens into an abstract syntax tree.
     * @param {object[]} tokens - The list of tokens to be parsed, typically
       returned from the tokenizer.
     * @param {object} [root] - The root node to append all parsed nodes to.
     * @param {function} [end] - An optional callback used to determine whether
       parsing should be ended.
     * @contributors Joshua Gammage
     */
    parseTokens(tokens, root = {
            type: "Template",
            body: []
        }, end = () => false) {
        
        while (tokens.length > 0 && !end(tokens[0], tokens, root)) {
            let token = tokens.shift();
            
            if (token.type === "Comparator") {
                this.parseComparator(token, tokens, root);
            } else if (token.type === "CodeOpen") {
                this.parseBlock(token, tokens, root);
            } else if (token.type === "Keyword") {
                this.parseKeyword(token, tokens, root);
            } else if (token.type !== "CodeClose") {
                root.body.push(this.parseToken(token));
            }
        }
        
        return root;
    }
};

var timeparser = {
    /**
     * @description Parses a time string into an AST-ish representation for
       easier use in code
     * @param {string|array} time - The time string or array of tokens to be
       parsed
     * @returns {object} The time "AST" that was generated
     * @contributors Joshua Gammage
     */
    parse(time) {
        if (!_.isString(time) && !_.isArray(time)) {
            return new Error("Invalid argument supplied to timeparser.parse");
        }
        
        let tokens = time;
        
        if (!_.isArray(tokens)) {
            tokens = timetokenizer.tokenize(time);
        }
        
        let ast = util.parseTokens(tokens);
        
        return ast;
    }
};

if (Object.freeze) {
    Object.freeze(timeparser);
}

module.exports = timeparser;
