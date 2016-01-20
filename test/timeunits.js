var assert = require("assert");
var _ = require("underscore");

describe("timeunits.js", function() {
    
    var units = require("../dist/timeunits.js");
    
    it("should have a all method", function() {
        
        assert.equal(_.isFunction(units.all), true);
        
    });
    
    it("should have a define method", function() {
        
        assert.equal(_.isFunction(units.define), true);
        
    });
    
    it("should have an exists method", function() {
        
        assert.equal(_.isFunction(units.exists), true);
        
    });
    
    it("should have a unit method", function() {
        
        assert.equal(_.isFunction(units.unit), true);
        
    });
    
    it("should have an update method", function() {
        
        assert.equal(_.isFunction(units.update), true);
        
    });
    
    describe("methods", function() {
        
        describe("all", function() {
            
            it("should return an array", function() {
                
                assert.equal(_.isArray(units.all()), true);
                
            });
            
            it("should return an array of all previously defined units and aliases", function() {
                
                units.define({
                    name: "existsTest",
                    base: "millisecond",
                    scale: 1,
                    alias: "existsTEST"
                });
                
                var all = units.all();
                
                assert.notEqual(all.indexOf("existsTest"), -1);
                assert.notEqual(all.indexOf("existsTEST"), -1);
                assert.notEqual(all.indexOf("millisecond"), -1);
                
                units.trashUnit("existsTest");
                units.trashUnit("existsTEST");
                
            });
            
        });
        
        describe("define", function() {
            
            it("should only accept objects", function() {
                
                assert.equal(units.define("bob") instanceof Error, true);
                assert.equal(units.define(2) instanceof Error, true);
                
            });
            
            it("should define a new unit", function() {
                
                units.define({
                    name: "defineTest",
                    base: "millisecond",
                    scale: 1
                });
                
                assert.equal(units.exists("defineTest"), true);
                
                units.trashUnit("defineTest");
                
            });
            
            it("should accept aliases the same way as addAlias", function() {
                
                units.define({
                    name: "defineTest2",
                    base: "millisecond",
                    scale: 1,
                    aliases: ["DEFINETEST2", "DEFINETest2"]
                });
                
                units.define({
                    name: "defineTest3",
                    base: "millisecond",
                    scale: 1,
                    alias: "DEFINETEST3"
                });
                
                assert.equal(units.exists("defineTest2"), true);
                assert.equal(units.exists("DEFINETEST2"), true);
                assert.equal(units.exists("DEFINETest2"), true);
                assert.equal(units.exists("defineTest3"), true);
                assert.equal(units.exists("DEFINETEST3"), true);
                
                units.trashUnit("defineTest2");
                units.trashUnit("DEFINETEST2");
                units.trashUnit("DEFINETest2");
                units.trashUnit("defineTest3");
                units.trashUnit("DEFINETEST3");
                
            });
            
        });
        
        describe("exists", function() {
            
            it("should return a boolean", function() {
                
                assert.equal(_.isBoolean(units.exists()), true);
                
            });
            
            it("should return whether or not a unit or alias has been defined", function() {
                
                units.define({
                    name: "bob",
                    base: "millisecond",
                    scale: 1,
                    alias: "bo"
                });
                
                assert.equal(units.exists("bob"), true);
                assert.equal(units.exists("bo"), true);
                assert.equal(units.exists("millisecond"), true);
                
                units.trashUnit("bob");
                units.trashUnit("bo");
                
            });
            
        });
        
        describe("unit", function() {
            
            it("should return an object", function() {
                
                assert.equal(_.isObject(units.unit()), true);
                assert.equal(_.isArray(units.unit()), false);
                
            });
            
            it("should return the data of a specific unit", function() {
                
                assert.equal(_.isEqual(units.unit("millisecond"), {
                    base: null,
                    scale: 1
                }), true);
                
            });
            
        });
        
        describe("update", function() {
            
            it("should only accept objects", function() {
                
                assert.equal(units.update() instanceof Error, true);
                assert.equal(units.update("") instanceof Error, true);
                assert.equal(units.update(2) instanceof Error, true);
                assert.equal(units.update({name: "millisecond"}) instanceof Error, false);
                
            });
            
            it("should only update existing units", function() {
                
                assert.equal(units.update({
                    name: "updateTestDoesNotExist",
                    scale: 2
                }) instanceof Error, true);
                
            });
            
            it("should add valid aliases", function() {
                
                units.define({
                    name: "updateTest1",
                    base: "millisecond",
                    scale: 1
                });
                
                units.update({
                    name: "updateTest1",
                    aliases: ["UPDATETEST1", "UPDATETest1", "1updateTest"],
                    alias: "updateTEST1"
                });
                
                assert.equal(units.exists("UPDATETEST1"), true);
                assert.equal(units.exists("UPDATETest1"), true);
                assert.equal(units.exists("updateTEST1"), true);
                assert.equal(units.exists("1updateTest"), false);
                
                units.trashUnit("updateTest1");
                units.trashUnit("UPDATETEST1");
                units.trashUnit("UPDATETest1");
                units.trashUnit("updateTEST1");
                
            });
            
            it("should update with a valid scale value", function() {
                
                units.define({
                    name: "updateTest2",
                    base: "millisecond",
                    scale: 1
                });
                
                units.update({
                    name: "updateTest2",
                    scale: 2
                });
                
                units.update({
                    name: "updateTest2",
                    scale: "invalid"
                });
                
                assert.equal(units.unit("updateTest2").scale, 2);
                
                units.trashUnit("updateTest2");
                
            });
            
            it("should update with a valid base value", function() {
                
                units.define({
                    name: "updateTest3",
                    base: "millisecond",
                    scale: 1
                });
                
                units.define({
                    name: "updateTest3Base",
                    base: "millisecond",
                    scale: 1
                });
                
                units.update({
                    name: "updateTest3",
                    base: "updateTest3Base"
                });
                
                units.update({
                    name: "updateTest3",
                    base: "updateTestInvalid"
                });
                
                assert.equal(units.unit("updateTest3").base, "updateTest3Base");
                
                units.trashUnit("updateTest3");
                units.trashUnit("updateTest3Base");
                
            });
            
        });
        
    });
    
});
