# How to work with Frames
## Intro
To interact with elements nested inside frames, selenium offers the possibility to set the browser focus to a frame and access elements inside those frames.
````typescript
driver.switchTo().frame("id | name" | WebElement)
````
Interacting between elements located inside different frames always forced me to "manually" changing frames before I could access the elements on the other frames.
Thekla facilitates this by specifying the frame during element definition.

## Using Frames with the WebdriverJS Wrapper
### Working with an Element inside a Frame
Locating and interacting with an Element inside a Frame is as simple as:
````typescript
import {BrowserFactory, Browser, By} from "thekla";
const browser: Browser; //create the browser here

const buttonInsideFrame = browser
                .frame(By.css(".frame"))
                .element(By.css(".button"));

buttonInsideFrame.click();
````
A Frame Element can be located as any other element by using the known 'By' selectors.

### Working with Elements inside and outside of a Frame
To interact with multiple Elements you can define Elements as follows:
````typescript
import {BrowserFactory, Browser, By} from "thekla";
const browser: Browser; //create the browser here

const inputInsideFrame = browser
            .frame(By.css(".frame"))
            .element(By.css(".inputInsideFrame"));
const buttonOutsideFrame = browser
            .element(By.css(".buttonOutsideFrame"));

inputInsideFrame.sendKeys("send text to input field");
buttonOutsideFrame.click();
````
There is no need to switch frames anymore. Just define / locate the frame the element is in and thekla does the frame switching for you.

### Working with nested frames
If you find yourself in a situation where you have to deal with nested frames you can locate the elements as follows:
````typescript
import {BrowserFactory, Browser, By} from "thekla";
const browser: Browser; //create the browser here

const inputInsideNestedFrame = browser
            .frame(By.css(".frame1"))
            .frame(By.css(".frame1.1"))
            .element(By.css(".inputInsideFrame"));
const buttonOutsideFrame = browser
            .element(By.css(".buttonOutsideFrame"));

inputInsideNestedFrame.sendKeys("send text to input field");
buttonOutsideFrame.click();
````
You can chain as many frames as you like to locate your element.


## Using Frames with the Screenplay Implementation
Using frames with the screenplay implementation is as simple as using frames with the Webdriver wrapper

Thekla provides an additional locator function called frame(locator) -> (similar to element() and all())

````typescript
import {frame, By} from "thekla"

const frame = frame(By.css(".frame"));
````
### Working with an Element inside a Frame
As with the WebDriver wrapper you define an element inside a frame as follows
````typescript
import {Actor, By, Click, frame, element} from "thekla";

const philipp: Actor; // instantiate actor and assign ability
const buttonInsideFrame = frame(By.css(".frame"))
                .element(By.css(".button"));

philipp.attemptsTo(
    Click.on(buttonInsideFrame)
)
````

### Working with Elements inside and outside of a Frame

To interact with multiple Elements you can define Elements as follows:
````typescript
import {Actor, By, Click, Enter, frame, element} from "thekla";
const philipp: Actor; // instantiate actor and assign ability

const inputInsideFrame = frame(By.css(".frame"))
            .element(By.css(".inputInsideFrame"));
const buttonOutsideFrame = element(By.css(".buttonOutsideFrame"));

philipp.attemptsTo(
    Enter.value("enter text to input field").into(inputInsideFrame),
    Click.on(buttonOutsideFrame)
)
````
No frame switching is needed here as well.

### Working with nested frames
The same principle applys to working with elements in nested frames.
````typescript
import {Actor, By, Click, Enter, frame, element} from "thekla";
const philipp: Actor; // instantiate actor and assign ability

const inputInsideNestedFrame = frame(By.css(".frame1"))
            .frame(By.css(".frame1.1"))
            .element(By.css(".inputInsideFrame"));
const buttonOutsideFrame = element(By.css(".buttonOutsideFrame"));

philipp.attemptsTo(
    Enter.value("enter text to input field").into(inputInsideFrame),
    Click.on(buttonOutsideFrame)
)
````