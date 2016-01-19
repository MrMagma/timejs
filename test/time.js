var assert = require("assert");
var _ = require("underscore");

describe("time.js", function() {
    
    var time = require("../dist/time.js");
    
    describe("Appearance", function() {
        
        /*
         Make sure that methods exist
         */
        
        it("should have an 'add' method", function() {
         
         assert.equal(_.isFunction(time.add), true);
         
        });
        
        it("should have an 'after' method", function() {
            
            assert.equal(_.isFunction(time.after), true);
            
        });
        
        it("should have an 'every' method", function() {
            
            assert.equal(_.isFunction(time.every), true);
            
        });
        
        it("should have a 'format' method", function() {
            
            assert.equal(_.isFunction(time.subtract), true);
            
        });
        
        it("should have a 'parse' method", function() {
            
            assert.equal(_.isFunction(time.parse), true);
            
        });

        it("should have a 'stringify' method", function() {
            
            assert.equal(_.isFunction(time.stringify), true);
            
        });
        
        it("should have a 'subtract' method", function() {
            
            assert.equal(_.isFunction(time.subtract), true);
            
        });
        
    });
    
    describe("Functionality", function() {
        
        describe("add", function() {
            
            
            
        });
        
        describe("after", function() {
            
            
            
        });
        
        describe("every", function() {
            
            
            
        });
        
        describe("format", function() {
            
            
            
        });
        
        describe("parse", function() {
            
            
            
        });
        
        describe("stringify", function() {
            
            
            
        });
        
        describe("subtract", function() {
            
            
            
        });
        
    });
    
});
