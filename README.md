# time.js

# About

time.js is a small library for doing neat things with time.

# Reference

## add method

#### Description

Adds one or more times together taking in an optional format for the returned time.

#### Usage

`time.add(time1[, time2[, ...timeN[, format = "$default"]])`

* Argument explanations coming soon!

## after method

#### Description

A wrapper for the native `setTimeout` method, allowing it to be used with time strings.

#### Usage

`time.after(time, callback[, arg1[, arg2[, ...argN[, format = "$default"]]]])`

* Argument explanations coming soon!

## every method

#### Description

A wrapper for the native `setInterval` functioning similarly to `time.after` allowing usage of formatted time strings as intervals.

#### Usage

`time.every(time, callback[, arg1[, arg2[, ...argN[, format = "$default"]]]])`

* Argument explanations coming soon!

## format method

#### Description

Converts a formatted time string (or integer value) into another format and returns the result.

#### Usage

`time.format(time[, toFormat = "$default"[, fromFormat = "$default"]])`

* Argument explanations coming soon!

## now method

#### Description

Cross-browser version of `Date.now()`. Gets the number of milliseconds between January 1st 1970 and the moment the method is called.

#### Usage

`time.now()`

* Argument explanations coming soon!

## parse method

#### Description

Functions similarly to the native `JSON.parse`. Takes in a formatted time string along with an optional format and converts the time string to a millisecond value.

#### Usage

`time.parse(time[, format])`

* Argument explanations coming soon!

## stringify method

#### Description

Functions similarly to the native `JSON.stringify`, taking in a value in milliseconds along with an optional format and converting them to a formatted time string then returning the result.

#### Usage

`time.stringify(milliseconds[, format])`

* Argument explanations coming soon!

## subtract method

#### Description

Subtracts one or more time values from each other and returns the result of the operation.

#### Usage

`time.subtract(base[, sub1[, sub2[, ...subN[, format]]]])`

* Argument explanations coming soon!

## then method

#### Description

A utility method for getting the number of milliseconds between January 1st 1970 and a date.

#### Usage

`time.then(date)`

* Argument explanations coming soon!

## defineFormat method

#### Description

Adds a format to the list of formats that can be referenced via the `$` operator.

#### Usage

`time.defineFormat(formatName, formatValue)`

* Argument explanations coming soon!
