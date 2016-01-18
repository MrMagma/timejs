function time() {
    
}

/* This is for browser environments so that people don't have to use
   require(blah) to use our module
 */
if (window) {
    window.time = time;
}
module.exports = time;
