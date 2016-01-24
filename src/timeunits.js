/**
 * @fileOverview A package for getting and defining the values of units of time
 * @author Joshua Gammage
 * @version 1.0.0
 */

var _ = require("underscore");

var units = {
    millisecond: {
        scale: 1,
        base: null
    }
};

var unitNames = ["millisecond"];

function noop() {}

function makeAliasGetter(name) {
    return () => units[name];
}

function addAliases(name, aliases) {
    // Filter out any aliases that we can't use (non-string, name already
    // exists, starts with a number)
    aliases = aliases.filter(aliasName => (_.isString(aliasName) &&
        !units[aliasName] && !aliasName.match(/^[0-9]/)));
    
    var getter = makeAliasGetter(name);
    
    // Define our getter on every alias, and noop the setter
    for (let aliasName of aliases) {
        unitNames.push(aliasName);
        Object.defineProperty(units, aliasName, {
            get: getter,
            set: noop
        });
    }
}

var timeunits = {
    /**
     * @description Gets the names of all units that have been created
     * @returns {string[]} An array including the names of all units that have
       been defined.
     * @contributors Joshua Gammage
     */
    all() {
        return JSON.parse(JSON.stringify(unitNames));
    },
    /**
     * @description Converts a value measured in one time unit to an equal
       value measured in another time unit.
     * @param {number} value - The amount of the unit to be converted from.
     * @param {string} fromUnit - The time unit to convert from.
     * @param {string} toUnit - The time unit to convert to.
     * @returns The converted value.
     * @contributors Joshua Gammage
     */
    convert(value, fromUnit, toUnit) {
        if (!units.hasOwnProperty(fromUnit) || !units.hasOwnProperty(toUnit)) {
            throw new Error("Time unit does not exist");
        }
        fromUnit = units[fromUnit];
        toUnit = units[toUnit];
        
        while (fromUnit.base !== null) {
            value *= fromUnit.scale;
            fromUnit = units[fromUnit.base];
        }
        
        let div = 1;
        while (toUnit.base !== null) {
            div *= toUnit.scale;
            toUnit = units[toUnit.base];
        }
        
        return value / div;
    },
    /**
     * @description Defines a new time unit for use in time strings
     * @param {object} data - Contains data about the time unit, its name,
       its aliases, the base unit, and what factor it scales the base unit by
     * @contributors Joshua Gammage
     */
    define(data) {
        if (!_.isObject(data)) {
            return new Error("First argument to timeunits.define must be an object");
        }
        let {base = "millisecond", name, scale} = data;
        // Make sure that the data we've been passed is kosher and doesn't
        // already exist
        if (!units.hasOwnProperty(base) || !_.isNumber(scale) ||
            _.isNaN(scale) || !_.isString(name) || units.hasOwnProperty(name)) {
            return new Error("Invalid data supplied");
        }
        
        units[name] = {
            base: base,
            scale: scale
        };
        
        unitNames.push(name);
        
        // Add our aliases
        if (!_.isArray(data.aliases)) {
            data.aliases = [];
        }
        
        data.aliases.push(data.alias);
        
        addAliases(name, data.aliases);
    },
    /**
     * @description Returns whether or not a unit has been defined.
     * @param {string} name - The name of the unit to check the existence of
     * @returns {boolean} Whether or not a unit with the specified name has
       been defined yet
     * @contributors Joshua Gammage
     */
    exists(name) {
        return unitNames.indexOf(name) !== -1;
    },
    /**
     * @description Destroys a unit. Used primarily for cleaning up in testing.
     * @param {string} name - The name of the unit to trash.
     * @contributors Joshua Gammage
     */
    trashUnit(name) {
        if (name !== "millisecond" && unitNames.indexOf(name) !== -1) {
            try {
                delete units[name];
            } catch (err) {
                
            }
            unitNames.splice(unitNames.indexOf(name), 1);
        }
    },
    /**
     * @description Gets the value of a time unit
     * @param unitName {string} - The name (or alias) of the unit we want to get
     * @returns {object} Data about the unit
     * @contributors Joshua Gammage
     */
    unit(unitName) {
        if (!_.isString(unitName) || !units[unitName]) {
            return new Error("");
        }
        
        // We do NOT want to pass a reference to whoever called this
        return JSON.parse(JSON.stringify(units[unitName]));
    },
    /**
     * @description Updates the data for a specific unit
     * @param {object} data - Contains the data to be used for Updating the
       unit
     * @contributors Joshua Gammage
     */
    update(data) {
        if (!_.isObject(data)) {
            return new Error("The first argument to timeunits.addAlias must be an object");
        }
        
        let {name} = data;
        
        if (!this.exists(name)) {
            return new Error("Unit does not exist");
        }
        
        let {base = units[name].base, scale = units[name].scale, alias,
            aliases} = data;
        
        if (this.exists(base)) {
            units[name].base = base;
        }
        
        if (_.isNumber(scale) && !_.isNaN(scale)) {
            units[name].scale = scale;
        }
        
        // Make sure that aliases is an array for simplicity
        if (!_.isArray(aliases)) {
            aliases = [];
        }
        
        // Push alias (whether it be defined or not) to aliases. Also for
        // simplicity
        aliases.push(alias);
        
        addAliases(name, aliases);
    }
};

// This is so that no one messes up our beautiful methods
if (Object.freeze) {
    Object.freeze(timeunits);
}

module.exports = timeunits;
