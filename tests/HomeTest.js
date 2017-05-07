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