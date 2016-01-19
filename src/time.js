/**
 * @fileOverview The base time object which is exposed to the global scope
 * @author Joshua Gammage
 * @version 1.0.0
 */

var time = {
    /**
     * @description Adds one or more lengths of time together and returns the
       resulting time length using the same format as the first time supplied.
     * @param {...string|string[]} times - The list of times to add together
     * @param {string} [format=time.defaultFormat] - Specifies the format of
       the returned time
     * @returns {string} The result of adding all of the supplied times together
     * @contributors Joshua Gammage
     */
    add() {
        
    },
    /**
     * @description Wrapper for the native `setTimeout` function, allowing
       intervals to be passed in the form of formatted time strings
     * @param {function} callback - The callback to be passed to `setTimeout`
     * @param {number|string} interval - The interval to be converted and then
       passed to `setTimeout`
     * @param {string} [format=time.defaultFormat] - Specifies the format of
       the returned time
     * @param {...*} params - The extra parameters to be passed to `setTimeout`
     * @returns {number} The timeoutID returned by the call to `setTimeout`
     * @contributors Joshua Gammage
     */
    after() {
        
    },
    /**
     * @description Wrapper for the native `setInterval` function, allowing
       intervals to be passed in the form of formatted time strings
     * @param {function} callback - The callback to be passed to `setInterval`
     * @param {number|string} interval - The interval to be converted and then
       passed to `setInteval`
     * @param {string} [format=time.defaultFormat] - Specifies the format of
       the returned time
     * @param {...*} params - The extra parameters to be passed to `setInteval`
     * @returns {number} The intervalID returned by the call to `setInteval`
     * @contributors Joshua Gammage
     */
    every() {
        
    },
    /**
     * @description Converts a length of time to a formatted string
     * @param {string|number} time - The time to format
     * @param {string} [format=time.defaultFormat] - The format of the time to
       be returned
     * @returns {string} The formatted time value
     * @contributors Joshua Gammage
     */
    format() {
        
    },
    /**
     * @description Takes in a formatted length of time and converts it to
       milliseconds
     * @param {string} formattedTime - The formatted time string to convert to
       milliseconds
     * @returns {number} The result of converting the time to milliseconds
     * @contributors Joshua Gammage
     */
    parse() {
        
    },
    /**
     * @description Takes in a length of time measured in milliseconds and
       converts it to a formatted string.
     * @param {number} ms - The length of time, in milliseconds, to format
     * @param {string} [format=time.defaultFormat] - The format of the time to
       be returned
     * @returns {string} A string representing the formatted time
     * @contributors Joshua Gammage
     */
    stringify() {
        
    },
    /**
     * @description Subtracts two or more lengths of time from each other and
       returns the resulting time length using the same format as the first
       time supplied.
     * @param {...string|string[]} times - The list of times to subtract from
       each other
     * @param {string} [format=time.defaultFormat] - Specifies the format of
       the returned time
     * @returns {string} The result of subtracting all supplied times from each
       other
     * @contributors Joshua Gammage
     */
    subtract() {
        
    }
};

/* 
 This is for browser environments so that people don't have to use
 require(blah) to use our module
 */
if (typeof window !== "undefined") {
    window.time = time;
}
module.exports = time;
