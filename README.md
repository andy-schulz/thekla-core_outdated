# thekla-core
Thekla-core started as a pet project to get a grip on the screenplay pattern and to understand the SOLID principles in more detail. Working with protractor for the last 5 years i got used to the simplicity of element definition and the possibilities of element chaining like:

```typescript
const button1 = element(by.xpath("//locateSomething").element(By.css(".locateSomethingElse");
const button2 = element.all(By.xpath("//locateTableRows").element(By.css(".locateSubElement");
```
Therefor I deviated from the original screenplay pattern and implemented this type of element chaining as I found it more intuitive.

As of now thekla not a fully blown testing framework with its own CLI so you can use it with your test definition framework of choice like jasmine, mocha or cucumber.

## Installation 
```sh
npm install thekla-core --save
```

## Usage
You can use thekla-core in 2 ways:
* as a WebdriverJS Wrapper or
* as a screenplay implementation

The following examples are using Jasmine as a testing framework

### Use it as a WebdriverJS wrapper
```typescript
import {BrowserFactory, By, Config, Key, UntilElement} from "thekla";

describe('Using Google Search to find an online calculator', () => {
    const conf: Config = {
        browserName: "chrome",
        serverUrl: "http://localhost:4444/wd/hub",
    };
    describe('with the WebdriverJS wrapper,', () => {
        // define your elements preferably in a separate class like a page object
        const b = BrowserFactory.create(conf);
        const searchField = b.element(By.css("[name='q']"))
            .shallWait(UntilElement.isVisible().forAsLongAs(5000))
            .called("The Google search field");

        const submitSearch = b.element(By.css(".FPdoLc [name='btnK']"))
            .called("The Google Submit Search button on the main Page");

        const calculatorInput = b.element(By.css("#cwos"))
            .called("Google calculator input field")
            .shallWait(UntilElement.isVisible().forAsLongAs(5000));

        it('the google calculator should be loaded', async () => {
            await b.get("http://www.google.com");
            await searchField.sendKeys("calculator");
            await searchField.sendKeys(Key.TAB);
            await submitSearch.click();
            expect(await calculatorInput.isVisible()).toBe(true,
                "Google calculator input field not found")
        }, 20000);
    });

    afterAll(async () => {
        await BrowserFactory.cleanup();
    })
});
```
### Use it as screenplay pattern implementation

For demonstration purposes I only use simple interactions in this example. For using and creating Tasks / Workflows see documentation below.
````typescript
import {
    Actor, BrowserFactory, BrowseTheWeb, By, Click, Config, element, Enter, Key, Navigate, See, Text, UntilElement
} from "../..";

class GooglePgo {
    // define your elements in a page object
    public static searchField = element(By.css("[name='q']"))
        .shallWait(UntilElement.isVisible().forAsLongAs(5000))
        .called("The Google search field");

    public static submitSearch = element(By.css(".FPdoLc [name='btnK']"))
        .called("The Google Submit Search button on the main Page");

    public static calculatorInput = element(By.css("#cwos"))
        .called("Google calculator input field")
        .shallWait(UntilElement.isVisible().forAsLongAs(5000));
}
````
```typescript
describe('Using Google Search to find an online calculator', () => {
    const conf: Config = {
        browserName: "chrome",
        serverUrl: "http://localhost:4444/wd/hub",
    };
    describe('with the screenplay pattern implementation,', () => {
        // define your actor
        const philipp = Actor.named("Philipp");
        // and give him the ability to browse the web using a browser of your choice
        philipp.whoCan(BrowseTheWeb.using(BrowserFactory.create(conf)));

        // using the jasmine matcher for our checks on the UI
        const match = (expected: string) => (actual: string) => expect(actual).toEqual(expected);

        it('the google calculator should be loaded', async () => {
            return philipp.attemptsTo(
                Navigate.to("http://www.google.com"),
                Enter.value("calculator").into(GooglePgo.searchField),
                Enter.value(Key.TAB).into(GooglePgo.searchField),
                Click.on(GooglePgo.submitSearch),
                See.if(Text.of(GooglePgo.calculatorInput)).fulfills(match("0"))
            )
        }, 20000);
    });

    afterAll(async () => {
        // close all Browsers which were created during the test
        await BrowserFactory.cleanup();
    })
});
```

## How to use thekla in detail
!! TODO update documentation !!
* Chaining elements
  * Basics of element chaining
  * Use separate locator strategies to find elements
  * [How to work with Frames](docs/creating_elements/WORKING_WITH_FRAMES.md)
  * How to wait for an elements appearance
  * Give an element a name
* Use the screenplay pattern to write your tests
  * Basics of the screenplay pattern
  * How to use an Actor and assign a capability
  * tbd


## Further Reads 
If you want to know more about the screenplay pattern, check out the following resources:
* [The Screenplay Pattern explained by the Serenity creators](https://serenity-js.org/design/screenplay-pattern.html)
  * Serenity is a great an powerful implementation of the screenplay patter, so check it out in detail
* [Presentation given by Antony Marcano SeleniumConf 2016](https://www.youtube.com/watch?v=8f8tdZBvAbI)
  * Gives you short an precise overview what the screenplay pattern really is
* [The SOLID principles](https://en.wikipedia.org/wiki/SOLID)
