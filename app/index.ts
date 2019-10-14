/**
 * Configurations
 */

export {ServerConfig, AutomationFramework, LogLevel}               from "./config/ServerConfig"
export {DesiredCapabilities}                                       from "./config/DesiredCapabilities"
export {RestClientConfig}                                          from "./config/RestClientConfig";

/**
 * WebDriver Wrapper
 */

export {Browser}                                                             from "./driver/interface/Browser";
export {BrowserScreenshotData, ScreenshotOptions, ScreenshotSize}            from "./driver/interface/Browser";
export {WebElementFinder}                                                    from "./driver/interface/WebElements";

export {RunningBrowser} from "./driver/lib/client/RunningBrowser1";
export {ClientHelper}   from "./driver/lib/client/ClientHelper";
export {By}             from "./driver/lib/element/Locator";
export {Key}            from "./driver/lib/Key";
export {until}          from "./driver/lib/Condition";
export {UntilElement}   from "./driver/lib/element/ElementConditions";

export {Utils}          from "./driver/utils/Utils";

export {WindowSize, WindowRect}     from "./driver/interface/BrowserWindow"

/**
 *
 * Request Wrapper
 *
 */
export {Get}                                                         from "./screenplay/rest/actions/Get";
export {Post}                                                        from "./screenplay/rest/actions/Post";
export {Delete}                                                      from "./screenplay/rest/actions/Delete";
export {Send}                                                        from "./screenplay/rest/actions/Send";

export {On}                                                                   from "./rest/lib/Ressource"
export {Method}                                                               from "./rest/lib/Method"
export {ExecutingRestClient}                                                  from "./rest/lib/ExecutingRestClient"

/**
 * screenplay Elements
 */
export {element, all, frame}                                                  from "./screenplay/web/SppWebElements";
export {SppElement, SppElementList}                                           from "./screenplay/web/SppWebElements";
export {Actor}                                                                from "./screenplay/Actor";
export {request, SppRestRequest}                                              from "./screenplay/rest/SppRestRequests";

// AbilitySet
export {Ability}                            from "./screenplay/lib/abilities/Ability";
export {BrowseTheWeb}                       from "./screenplay/web/abilities/BrowseTheWeb";
export {OperateOnMobileDevice}              from "./screenplay/web/abilities/OperateOnMobileDevice";
export {Authenticate, AuthenticationInfo}   from "./screenplay/web/abilities/Authenticate";
export {UseTheRestApi}                      from "./screenplay/rest/abilities/UseTheRestApi";

// Tasks
export {
    PerformsTask, LogsActivity, AnswersQuestions, UsesAbilities
}                        from "./screenplay/Actor";
export {ReturnTaskValue} from "./screenplay/lib/actions/ReturnTaskValue";

export {ActivityLogNode} from "./packages/ActivityLog/ActivityLogEntry";

// Activities
export {Activity, Task, Interaction}            from "./screenplay/lib/actions/Activities";
export {Click}                                  from "./screenplay/web/actions/Click";
export {Hover}                                  from "./screenplay/web/actions/Hover";
export {Enter}                                  from "./screenplay/web/actions/Enter";
export {Navigate}                               from "./screenplay/web/actions/Navigate";
export {Wait}                                   from "./screenplay/web/actions/Wait";
export {Scroll, Page}                           from "./screenplay/web/actions/Scroll";
export {Drag}                                   from "./screenplay/web/actions/Drag";
export {Sleep}                                  from "./screenplay/lib/actions/Sleep";

// Oracle
export {See}                                  from "./screenplay/lib/matcher/See";
export {Extract}                              from "./screenplay/lib/matcher/Extract";

/**
 * Questions
 */
// the interface
export {Question}                             from "./screenplay/lib/questions/Question";
// Basic Questions
export {ReturnedResult}                       from "./screenplay/lib/questions/ReturnedResult";
export {DelayedResult}                        from "./screenplay/lib/questions/DelayedResult";
// Web Questions
export {Text}                                 from "./screenplay/web/questions/Text";
export {Value}                                from "./screenplay/web/questions/Value";
export {Attribute}                            from "./screenplay/web/questions/Attribute";
export {Count}                                from "./screenplay/web/questions/Count";
export {TheSites}                             from "./screenplay/web/questions/TheSites";
export {Status}                               from "./screenplay/web/questions/Status";
// Rest Questions
export {Response}                             from "./screenplay/rest/questions/Response";

/**
 * Errors
 */
// Custom Errors
export {DoesNotHave}                          from "./screenplay/errors/DoesNotHave";
export {DidNotFind}                           from "./driver/errors/DidNotFind";

/**
 * Matcher
 */
//Function Matcher
export {Expected}                             from "./screenplay/lib/matcher/FunctionMatcher/Expected"

// Decorators
export {stepDetails, step} from "./screenplay/lib/decorators/step_decorators"

// Tasks
export {SkipTask} from "./screenplay/lib/tasks/SkipTask";

// eslint-disable-next-line
export {Actions} from "./driver/interface/Actions";