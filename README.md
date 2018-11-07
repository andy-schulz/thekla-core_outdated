# thekla
A Node.js module implementing the screenplay pattern with WebdriverJS. It is completely written in Typescript.
## Installation 
```sh
npm install thekla --save
```
## Usage
### Typescript
```typescript
import {BrowserFactory, By, until} from "thekla";
const browser = await BrowserFactory.create("wdjs");
const searchField = browser.element(By.css("[name='q']"));
const submitSearch = browser.element(By.css("[name='btnK']"));

await browser.get("www.google.com");
await browser.wait(until(searchField.isVisible()));
await searchField.sendKeys("how to search with google");
await submitSearch.click();
```

## Test 
```sh
npm run test
```