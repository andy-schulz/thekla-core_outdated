export const findByCssContainingText = function(cssSelector: string, searchText: any, using: any) {
    using = using || document;
    if (searchText.indexOf(`__REGEXP__`) === 0) {
        var match = searchText.split(`__REGEXP__`)[1].match(/\/(.*)\/(.*)?/);
        searchText = new RegExp(match[1], match[2] || ``);
    }
    var elements = using.querySelectorAll(cssSelector);
    var matches: any[] = [];
    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var elementText = element.textContent || element.innerText || ``;
        var elementMatches = searchText instanceof RegExp ?
            searchText.test(elementText) :
            elementText.indexOf(searchText) > -1;

        if (elementMatches) {
            matches.push(i);
        }
    }
    return matches;
};