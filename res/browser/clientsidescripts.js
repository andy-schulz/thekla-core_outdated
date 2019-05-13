// eslint-disable
var functions = {};

/**
 *
 * This great function i copied from the protractor folks ... its awesome
 * See: https://github.com/angular/protractor
 * protractor/lib/clientsidescripts.js
 *
 */

/**
 * Find elements by css selector and textual content.
 *
 * @param {string} cssSelector The css selector to match.
 * @param {string} searchText The exact text to match or a serialized regex.
 * @param {Element} using The scope of the search.
 *
 * @return {Array.<Element>} An array of matching elements.
 */
functions.findByCssContainingText = function(cssSelector, searchText, using) {
    using = using || document;

    if (searchText.indexOf('__REGEXP__') === 0) {
        var match = searchText.split('__REGEXP__')[1].match(/\/(.*)\/(.*)?/);
        searchText = new RegExp(match[1], match[2] || '');
    }
    var elements = using.querySelectorAll(cssSelector);
    var matches = [];
    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var elementText = element.textContent || element.innerText || '';
        var elementMatches = searchText instanceof RegExp ?
            searchText.test(elementText) :
            elementText.indexOf(searchText) > -1;

        if (elementMatches) {
            matches.push(element);
        }
    }
    return matches;
};

var util = require('util');
var scriptsList = [];
var scriptFmt = (
    'try { return (%s).apply(this, arguments); }\n' +
    'catch(e) { throw (e instanceof Error) ? e : new Error(e); }');
for (var fnName in functions) {
    if (functions.hasOwnProperty(fnName)) {
        exports[fnName] = util.format(scriptFmt, functions[fnName]);
        scriptsList.push(util.format('%s: %s', fnName, functions[fnName]));
    }
}

exports.installInBrowser = (util.format(
    'window.clientSideScripts = {%s};', scriptsList.join(', ')));