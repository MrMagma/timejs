/**
 * @fileOverview A package for getting and defining the values of units of time
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");

var units = {
    millisecond: {
        scale: 1
    }
};

function noop() {}

function makeAliasGetter(name) {
    return () => units[name];
}

var timeunits = {
    /**
     * @description Adds a new alias or list of aliases for a specific time
       value
     * @param {object} data - Contains the alias(es) to add and the unit to add
       them to
     * @contributors Joshua Gammage
     */
    addAlias(data) {
        if (!_.isObject(data)) {
            return;
        }
        let {name, alias, aliases} = data;
        if (!units[name]) {
            return;
        }
        
        // Make sure that aliases is an array for simplicity
        if (!_.isArray(aliases)) {
            aliases = [];
        }
        
        // Push alias (whether it be defined or not) to aliases. Also for
        // simplicity
        aliases.push(alias);
        
        // Filter out any aliases that we can't use (non-string, name already
        // exists, starts with a number)
        aliases = aliases.filter(aliasName => (_.isString(aliasName) &&
            !units[aliasName] && !aliasName.match(/^[0-9]/)));
        
        var getter = makeAliasGetter(name);
        
        // Define our getter on every alias, and noop the setter
        for (let aliasName of aliases) {
            Object.defineProperty(units, aliasName, {
                get: getter,
                set: noop
            });
        }
    },
    /**
     * @description Defines a new time unit for use in time strings
     * @param {object} data - Contains data about the time unit, its name,
       its aliases, the base unit, and what factor it scales the base unit by
     * @contributors Joshua Gammage
     */
    define(data) {
        if (!_.isObject(data)) {
            return;
        }
        let {base = "millisecond", name, scale} = data;
        // Make sure that the data we've been passed is kosher and doesn't
        // already exist
        if (!_.isNumber(units[base]) || _.isNaN(units[base]) ||
            !_.isNumber(scale) || _.isNaN(scale) || !_.isString(name) ||
            units.hasOwnProperty(name)) {
            return;
        }
        
        units[name] = {
            base: base,
            scale: scale
        };
        
        // Add our aliases
        this.addAlias(data);
    },
    /**
     * @description Gets the value of a time unit
     * @param unitName {string} - The name (or alias) of the unit we want to get
     * @returns {object} Data about the unit
     * @contributors Joshua Gammage
     */
    unit(unitName) {
        if (!_.isString(unitName) || !units[unitName]) {
            return {
                error: true
            };
        }
        
        // We do NOT want to pass a reference to whoever called this
        return JSON.parse(JSON.stringify(units[unitName]));
    }
};

// This is so that no one messes up our beautiful methods
if (Object.freeze) {
    Object.freeze(timeunits);
}

module.exports = timeunits;
