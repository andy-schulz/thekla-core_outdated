/**
 * WebDriver Wrapper
 */

export {Browser}            from "./interface/Browser";
export {Config}             from "./interface/Config";
export {WebElementFinder}   from "./interface/WebElements";

export {BrowserFactory} from "./src/lib/BrowserFactory";
export {By}             from "./src/lib/Locator";
export {Key}            from "./src/lib/Key";
export {until}          from "./src/lib/Condition";

/**
 *
 * Request Wrapper
 *
 */

export {Get}    from "./screenplay/rest/actions/Get"
export {Post}   from "./screenplay/rest/actions/Post"
export {Delete} from "./screenplay/rest/actions/Delete"

/**
 * Screenplay Elements
 */
export {element, all}                                         from "./screenplay/web/SppWebElements";
export {SppWebElementFinder, SppWebElementListFinder}         from "./screenplay/web/SppWebElements";
export {Actor}                                                from "./screenplay/Actor";

// Abilities
export {Ability}                                                from "./screenplay/lib/abilities/Ability";
export {BrowseTheWeb}                                           from "./screenplay/web/abilities/BrowseTheWeb";
export {Authenticate, AuthenticationInfo}                       from "./screenplay/web/abilities/Authenticate";
export {UseTheRestApi, RestAbilityOptions}                      from "./screenplay/rest/abilities/UseTheRestApi";


// Activities
export {Activity, Task, Interaction}    from "./screenplay/lib/actions/Activities";
export {Click}                          from "./screenplay/web/actions/Click";
export {Enter}                          from "./screenplay/web/actions/Enter";
export {Navigate}                       from "./screenplay/web/actions/Navigate";
export {Wait}                           from "./screenplay/web/actions/Wait";

// Matcher
export {See}     from "./screenplay/lib/matcher/See";
export {Extract} from "./screenplay/lib/matcher/Extract";

// Questions
export {Text}                         from "./screenplay/web/matcher/questions/Text";
export {Value}                         from "./screenplay/web/matcher/questions/Value";
export {Count}                        from "./screenplay/web/matcher/questions/Count";
export {Response}                     from "./screenplay/rest/questions/Response";
export {SppRequestResult, SppRequest} from "./screenplay/rest/interfaces/requests";

// Custom Errors
export {NoSuchAbilityError} from "./screenplay/errors/NoSuchAbilityError";
