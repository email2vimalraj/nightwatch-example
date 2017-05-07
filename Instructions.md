# Nightwatch Examples
In this blog series, I'm going to show you what I've learned automating using [NightwatchJs](http://nightwatchjs.org/).

A NightwatchJs is an E2E testing framework used for automating browser web apps. It uses the W3C WebDriver API as the underlying to perform automation.

It has the built in test runner, which can run the tests even in parallel, by group and tags. It comes with the out-of-the box solution to execute tests on cloud testing services, such as SauceLabs and BrowserStack.

By default, it provides the JUnit XML report generated after the execution which is easy to integrate with the CI tools such as Jenkins, TeamCity and so on.

## What are we going to automate?
We are going to automate [The Internet](http://the-internet.herokuapp.com/) website. While performing automation, we together solve problems / challenges.

Let's start!

## Pre-requisites
- Node with NPM (I'm using Node v7.1.0 and npm v3.10.9)
- (Optional) Yarn (I'm using Yarn v0.17.6)
- Chrome browser (My chrome version is  57.0)

## Sample code
This is an optional step. The example that we are going to see in this article are available in the github. Follow the steps to clone and run:

```bash
git clone https://github.com/email2vimalraj/nightwatch-example.git
cd nightwatch-example
yarn
```

## Setup
Create a directory:

```bash
mkdir nightwatch-example
cd nightwatch-example
```

Initiate the node js project using:

```bash
yarn init
```

Accept all the default parameters which yarn prompts.

Install NightwatchJS as dev dependency using:

```bash
yarn add --dev nightwatch
```

## Configuration
The nightwatch test runner uses the json file which is used as configuration for the test runner.

By default, if a file called <b>nightwatch.json</b> available in the current directory, test runner will pick it up.

Let's create the following <b>nightwatch.json</b> in the project's root directory:

```json
{
  "src_folders": ["tests"],
  "output_folder": "reports",

  "test_settings": {
    "default": {
      "launch_url": "http://the-internet.herokuapp.com/",
      "desiredCapabilities": {
        "browserName": "chrome"
      }
    }
  }
}
```

<em>src_folder</em> - will contain a list of folders where the test scripts are placed. In this example, we'll be keeping all our tests in the <b>tests</b> directory

<em>output_folder</em> - this config let's you place the generated reports in the specified directory. Here, the reports will be generated in the <b>reports</b> directory.

<em>test_settings</em> - This will contain all test related settings, in other words, we can have settings for each different environment. The <b>default</b> is mandatory and a default setting used by tests.

<em>launch_url</em> - Let's you define the default url that we use to automate. We'll look further on how we use this setting.

<em>desiredCapabilities</em> - It is the Webdriver's desired capabilities configuration. Here we're using Chrome as the default browser for our automation.

## Chromedriver setup
There are two ways to configure Chromedriver to automate on the chrome browser.
- Using Selenium Server (requires Java)
- Using Standalone (no dependency on Java)

In this example, we will be using the Standalone usage since there is no dependency on Java. But it requires a one-time configuration. Let's install the <b>ChromeDriver</b> npm package:

```bash
yarn add --dev chromedriver
```

Then disable the selenium server in the <em>nightwatch.json</em> file by adding the following configuration at the end:

```json
"selenium": {
  "start_process": false
},
```

Then in the <b>test_settings</b> configuration, we'll have to configure the selenium port and host since the default port used by chromedriver is <b>9515</b>. Let's update the <b>test_settings</b> config:

```json
"selenium_port": 9515,
"selenium_host": "localhost",
"default_path_prefix": ""
```

We have to clear the <em>default_path_prefix</em>, as it is by default set to <em>/wd/hub</em> which chromedriver doesn't require it.

### Create a chrome driver global file
A global file is the js file which will be loaded by the test runner and made available to the test. We'll be using this file to start the chromedriver before the test starts and quits the chromedriver after the test finishes its execution.

Let's create a file called <b>chromedriver.global.js</b>:

```js
var chromedriver = require('chromedriver');

module.exports = {
  before: function (done) {
    chromedriver.start();
    done();
  },

  after: function (done) {
    chromedriver.stop();
    done();
  }
};
```

Now we'll have to load this file through the configuration file. Add the following config at the end of the <em>nightwatch.json</em>:

```json
"globals_path": "./chromedriver.global.js"
```

Our <em>nightwatch.json</em> should look like this now:

```json
{
  "src_folders": ["tests"],
  "output_folder": "reports",

  "selenium": {
    "start_process": false
  },

  "test_settings": {
    "default": {
      "launch_url": "http://the-internet.herokuapp.com/",
      "selenium_port": 9515,
      "selenium_host": "localhost",
      "default_path_prefix": "",
      "desiredCapabilities": {
        "browserName": "chrome"
      }
    }
  },

  "globals_path": "./chromedriver.global.js"
}
```

## Create our first test
Let's create a <b>HomeTest.js</b> file in the <b>tests</b> directory:

```js
module.exports = {

  "Test Home Page": function (client) {
    client.init();
    client.waitForElementVisible("body", 1000);
    client.assert.title("The Internet");
    client.expect.element(".heading").text.to.equal("Welcome to the Internet");
    client.end();
  }

};
```

Each file in the <em>tests</em> directory is considered as test suite. Here, in the <em>HomeTest.js</em> we have created one test called <b>Test Home Page</b>. Each test function will have one parameter which holds the webdriver instance. Here, we are calling that instance as <b>client</b>. All the nightwatch webdriver commands are accessed through this instance.

The <em>client.init()</em> will launch the browser with the url configured in the <b>launch_url</b> property in the nightwatch.json. In our case, it will open the chrome browser and launch http://the-internet.herokuapp.com/.

Then it will wait for the <em>body</em> tag to be visible for maximum of 1 sec.
After that we assert the title to be equal to <b>The Internet</b>. Then we expect an element with class attribute <em>.heading</em> and with text to be equal to <b>Welcome to the Internet</b>.

The <em>client.end()</em> is mandatory to close the browser instance and stop the selenium server instance.

Let's execute our first test. Spin off your terminal / command prompt, and execute your test as follows:

```bash
./node_modules/.bin/nightwatch
```

This should execute your tests and you can watch the result in your console:

```bash
[Home Test] Test Suite
==========================

Running:  Test Home Page
 ✔ Element <body> was visible after 44 milliseconds.
 ✔ Testing if the page title equals "The Internet".
 ✔ Expected element <.heading> text to equal: "Welcome to the Internet"

OK. 3 assertions passed. (20.669s)
```

Awesome, we successfully created our test and executed. Let's add one more test:

```js
module.exports = {

  "Test Home Page": function (client) {
    client.init();
    client.waitForElementVisible("body", 1000);
    client.assert.title("The Internet");
    client.expect.element(".heading").text.to.equal("Welcome to the Internet");
  },

  "Navigate to Broken Images page": function (client) {
    client.click("a[href='/broken_images']");
    client.expect.element(".example > h3").text.to.equal("Broken Images");
    client.end();
  }

};
```

Here we have added another test called <b>Navigate to Broken Images page</b> in which we navigate to the <b>Broken Images</b> page and assert the heading.
Note that we have removed the <em>client.end()</em> from the first test and moved that to the second test.

Execute again and see both of your tests run.

Finally, we have two tests which runs successfully.

In the next part, we'll make our tests more maintainable using page object pattern.

<u>P.S</u>: If you liked this post, feel free to like and share.
