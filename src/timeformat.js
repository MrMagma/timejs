var _ = require("underscore");
var timeparser = require("./timeparser.js");

let regexes = {
    number: /[\+\-]{0,1}(?:[0-9]*\.[0-9]+|[0-9]+)(?:e[\+\-]{0,1}[0-9]*|)/
};

let util = {
    escapeRegexChars(str) {
        return str.replace(/\\|\^|\$|\*|\+|\?|\.|\(|\)|\:|\=|\!|\||\{|\}|\,|\[|\]/,
            "\\$&");
    },
    evalBoolExpr(node, data) {
        let left = this.evalNode(node.left, data);
        let right = this.evalNode(node.right, data);
        let op = node.operator;
        
        if (op === "=") {
            return left === right;
        } else if (op === "!=") {
            return left !== right;
        } else if (op === ">") {
            return left > right;
        } else if (op === "<") {
            return left < right;
        } else if (op === ">=") {
            return left >= right;
        } else if (op === "<=") {
            return left <= right;
        }
    },
    evalNode(node, data) {
        let type = node.type;
        
        if (type === "StringLiteral" || type === "IntegerLiteral") {
            return node.value;
        } else if (type === "Template" || type === "TemplateBlock" ||
            type === "ThenClause" || type === "ElseClause") {
            let str = "";
            
            for (let child of node.body) {
                str += this.evalNode(child, data);
            }
            
            return str;
        } else if (type === "NamedReference") {
            return data[node.reference];
        } else if (type === "BooleanExpression") {
            return this.evalBoolExpr(node, data);
        } else if (type === "ConditionalStatement") {
            if (this.evalNode(node.test, data)) {
                return this.evalNode(node.consequent, data);
            } else {
                return this.evalNode(node.alternate, data);
            }
        } else if (type === "Predicate") {
            for (let child of node.body) {
                if (!!this.evalNode(child, data)) {
                    return true;
                }
            }
        }
    }
};

class Format {
    constructor() {
        if (_.isString(arguments[0])) {
            this.templateAST = timeparser.parse(arguments[0]);
        } else if (_.isObject(arguments[0])) {
            this.templateAST = arguments[0];
        } else {
            throw new Error("Invalid arguments for Format!");
        }
        
        this.raw = "";
        this.regex = "";
        this.references = [];
        
        this.init();
    }
    format(data = {}) {
        return util.evalNode(this.templateAST, data);
    }
    init() {
        let ast = this.templateAST;
        let regex = "";
        let references = [];
        
        for (let node of ast.body) {
            if (node.type === "StringLiteral" ||
                node.type === "IntegerLiteral") {
                regex += util.escapeRegexChars(node.value);
            } else if (node.type === "NamedReference") {
                regex += `(${regexes.number.source})`;
                references.push(node.reference);
            } else if (node.type === "ConditionalStatement") {
                let conseqCapture = Format.create(node.consequent);
                let altCapture = Format.create(node.alternate);
                
                regex += `(?:${conseqCapture.raw}|${altCapture.raw})`;
                references = references.concat(conseqCapture.references)
                    .concat(altCapture.references);
            } else if (node.type === "TemplateBlock") {
                let capture = Format.create(node);
                regex += capture.raw;
                references = references.concat(capture.references);
            }
        }
        
        this.regex = new RegExp(regex);
        this.raw = regex;
        this.references = references;
    }
    unformat(str) {
        let match = str.match(this.regex);
        
        let formatData = {};
        
        if (match !== null) {
            for (let i = 0; i < this.references.length; i++) {
                let val = match[i + 1];
                if (regexes.number.test(val)) {
                    val = Number(val);
                }
                formatData[this.references[i]] = val;
            }
        }
        
        return formatData;
    }
    static create() {
        return new Format(arguments[0]);
    }
}

module.exports = Format;
