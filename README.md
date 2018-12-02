# thekla
Thekla started as a pet project to get a grip on the scrennplay pattern and to understand the SOLID principles in more detail. Working with protractor for the last 5 years i got used to ease of element definition and the possibilities of element chaining like:

```typescript
const button1 = element(by.xpath("//locateSomething").element(By.css(".locateSomethingElse")
const button2 = element.all(By.xpath("//locateTableRows").element(By.css(".locateSubElement")
```
Here I deviated from the original screenplay pattern and implemented this type of element chaining as I found it more intuitive.

As of now its not a fully blown testing framework with its own CLI so you can use it with your test definition framework of choice like jasmine, mocha or cucumber.

## Installation 
```sh
npm install git+https://github.com/andy-schulz/thekla.git --save
```
## Usage
You can use thekla in 2 ways:
* as a WebdriverJS Wrapper or
* as an screenplay implementation

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

For demonstration purposes I only use simple interactions in this example. For using and creating Tasks (Workflows) see documentation below.

```typescript
import {
    Actor, BrowserFactory, BrowseTheWeb, By, Click, Config, element, Enter, Key, Navigate, See, Text, UntilElement
} from "thekla";

describe('Using Google Search to find an online calculator', () => {
    const conf: Config = {
        browserName: "chrome",
        serverUrl: "http://localhost:4444/wd/hub",
    };
    describe('with the WebdriverJS wrapper,', () => {
        // define your actor
        const philipp = Actor.named("Philipp");
        // and give him the ability to browse the web using a browser of your choice
        philipp.whoCan(BrowseTheWeb.using(BrowserFactory.create(conf)));

        // define your elements preferably in a separate class like a page object
        const searchField = element(By.css("[name='q']"))
            .shallWait(UntilElement.isVisible().forAsLongAs(5000))
            .called("The Google search field");

        const submitSearch = element(By.css(".FPdoLc [name='btnK']"))
            .called("The Google Submit Search button on the main Page");

        const calculatorInput = element(By.css("#cwos"))
            .called("Google calculator input field")
            .shallWait(UntilElement.isVisible().forAsLongAs(5000));

        // using the jasmine matcher for our checks on the UI
        const match = (expected: string) => (actual: string) => expect(actual).toEqual(expected);

        it('the google calculator should be loaded', async () => {
            return philipp.attemptsTo(
                Navigate.to("http://www.google.com"),
                Enter.value("calculator").into(searchField),
                Enter.value(Key.TAB).into(searchField),
                Click.on(submitSearch),
                See.if(Text.of(calculatorInput)).fulfills(match("0"))
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
  * How to deal with frames
  * How to wait for an elements appearance
  * Give an element a name
* Use the screenplay pattern to write your tests
  * Basics of the screenplay pattern
  * How to use an Actor and assign a capability
  * tbd


## Further Reads 
If you want to know more about the screenplay pattern, check out the following ressources:
* [The Screenplay Pattern](https://serenity-js.org/design/screenplay-pattern.html)
  * Serenity is a great an powerfull implementation of the screenplay patter, so check it out in detail
* [Presentation given by Antony Marcano SeleniumConf 2016](https://www.youtube.com/watch?v=8f8tdZBvAbI)
