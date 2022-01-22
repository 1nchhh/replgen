/**
 * @param {number} t time to wait
 */
module.exports = function (t) {
    return new Promise(resolve => setTimeout(resolve, t));
}