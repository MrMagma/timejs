"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require("underscore");
var timeparser = require("./timeparser.js");

var regexes = {
    number: /[\+\-]{0,1}(?:[0-9]*\.[0-9]+|[0-9]+)(?:e[\+\-]{0,1}[0-9]*|)/
};

var util = {
    escapeRegexChars: function escapeRegexChars(str) {
        return str.replace(/\\|\^|\$|\*|\+|\?|\.|\(|\)|\:|\=|\!|\||\{|\}|\,|\[|\]/, "\\$&");
    },
    evalBoolExpr: function evalBoolExpr(node, data) {
        var left = this.evalNode(node.left, data);
        var right = this.evalNode(node.right, data);
        var op = node.operator;

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
    evalNode: function evalNode(node, data) {
        var type = node.type;

        if (type === "StringLiteral" || type === "IntegerLiteral") {
            return node.value;
        } else if (type === "Template" || type === "TemplateBlock" || type === "ThenClause" || type === "ElseClause") {
            var str = "";

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = node.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var child = _step.value;

                    str += this.evalNode(child, data);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
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
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = node.body[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var child = _step2.value;

                    if (!!this.evalNode(child, data)) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }
};

var Format = function () {
    function Format() {
        _classCallCheck(this, Format);

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

    _createClass(Format, [{
        key: "format",
        value: function format() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            return util.evalNode(this.templateAST, data);
        }
    }, {
        key: "init",
        value: function init() {
            var ast = this.templateAST;
            var regex = "";
            var references = [];

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = ast.body[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var node = _step3.value;

                    if (node.type === "StringLiteral" || node.type === "IntegerLiteral") {
                        regex += util.escapeRegexChars(node.value);
                    } else if (node.type === "NamedReference") {
                        regex += "(" + regexes.number.source + ")";
                        references.push(node.reference);
                    } else if (node.type === "ConditionalStatement") {
                        var conseqCapture = Format.create(node.consequent);
                        var altCapture = Format.create(node.alternate);

                        regex += "(?:" + conseqCapture.raw + "|" + altCapture.raw + ")";
                        references = references.concat(conseqCapture.references).concat(altCapture.references);
                    } else if (node.type === "TemplateBlock") {
                        var capture = Format.create(node);
                        regex += capture.raw;
                        references = references.concat(capture.references);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this.regex = new RegExp(regex);
            this.raw = regex;
            this.references = references;
        }
    }, {
        key: "unformat",
        value: function unformat(str) {
            var match = str.match(this.regex);

            var formatData = {};

            if (match !== null) {
                for (var i = 0; i < this.references.length; i++) {
                    var val = match[i + 1];
                    if (regexes.number.test(val)) {
                        val = Number(val);
                    }
                    formatData[this.references[i]] = val;
                }
            }

            return formatData;
        }
    }], [{
        key: "create",
        value: function create() {
            return new Format(arguments[0]);
        }
    }]);

    return Format;
}();

module.exports = Format;