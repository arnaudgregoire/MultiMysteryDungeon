/**
 * Compute random integer between min and max included
 * @param {integer} min 
 * @param {integer} max 
 */
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}


module.exports = {randomIntFromInterval};