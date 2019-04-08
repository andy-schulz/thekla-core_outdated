/**
 *
 */

export {ProcessedSeleniumConfig}                         from "./config/ProcessedSeleniumConfig"
export {SeleniumConfig, RestConfig, DesiredCapabilities} from "./config/SeleniumConfig"


/**
 * WebDriver Wrapper
 */

export {Browser}                          from "./driver/interface/Browser";
export {BrowserScreenshotData}            from "./driver/interface/Browser";
export {WebElementFinder}                 from "./driver/interface/WebElements";

export {RunningBrowser} from "./driver/lib/RunningBrowser";
export {BrowserHelper}  from "./driver/lib/BrowserHelper";
export {By}             from "./driver/lib/Locator";
export {Key}            from "./driver/lib/Key";
export {until}          from "./driver/lib/Condition";
export {UntilElement}   from "./driver/lib/ElementConditions";

export {Utils}                                                       from "./driver/utils/Utils";

/**
 *
 * Request Wrapper
 *
 */
export {Get}                                                         from "./screenplay/rest/actions/Get";
export {Post}                                                        from "./screenplay/rest/actions/Post";
export {Delete}                                                      from "./screenplay/rest/actions/Delete";
export {Send}                                                        from "./screenplay/rest/actions/Send";

export {On}                                                          from "./rest/lib/Ressource"
export {Method}                                                      from "./rest/lib/Method"
export {RestApiFactory}                                              from "./rest/lib/RestApiFactory"

/**
 * screenplay Elements
 */
export {element, all, frame}                                         from "./screenplay/web/SppWebElements";
export {SppWebElementFinder, SppWebElementListFinder}                from "./screenplay/web/SppWebElements";
export {Actor}                                                       from "./screenplay/Actor";
export {
    request, SppRestRequest
}
                                                                     from "./screenplay/rest/SppRestRequests";


// Abilities
export {Ability}                                                from "./screenplay/lib/abilities/Ability";
export {BrowseTheWeb}                                           from "./screenplay/web/abilities/BrowseTheWeb";
export {Authenticate, AuthenticationInfo}                       from "./screenplay/web/abilities/Authenticate";
export {UseTheRestApi, RestAbilityOptions}                      from "./screenplay/rest/abilities/UseTheRestApi";

// Tasks
export {PerformsTask} from "./screenplay/Actor";

// Activities
export {Activity, Task, Interaction}     from "./screenplay/lib/actions/Activities";
export {Click}                           from "./screenplay/web/actions/Click";
export {Enter}                           from "./screenplay/web/actions/Enter";
export {Navigate}                        from "./screenplay/web/actions/Navigate";
export {Wait}                            from "./screenplay/web/actions/Wait";
export {Sleep}                           from "./screenplay/web/actions/Sleep";


// Oracle
export {See}     from "./screenplay/lib/matcher/See";
export {Extract} from "./screenplay/lib/matcher/Extract";

// Questions
export {Text}                                 from "./screenplay/web/questions/Text";
export {Value}                                from "./screenplay/web/questions/Value";
export {Attribute}                            from "./screenplay/web/questions/Attribute";
export {Count}                                from "./screenplay/web/questions/Count";
export {TheSites}                             from "./screenplay/web/questions/TheSites";
export {Response}                             from "./screenplay/rest/questions/Response";

// Custom Errors
export {NoSuchAbilityError} from "./screenplay/errors/NoSuchAbilityError";

//Function Matcher
export {strictEqualTo, objectContains} from "./screenplay/lib/matcher/FunctionMatcher/matcher"

// Decorators
export {stepDetails, step} from "./screenplay/lib/decorators/StepDecorators"