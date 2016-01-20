var units = require("./dist/timeunits.js");

units.addAlias();
units.addAlias("");
units.addAlias(2);
units.addAlias({name: "millisecond"});

console.log(units.all());
