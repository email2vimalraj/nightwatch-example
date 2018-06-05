module.exports = {

  // "Test Home Page": function (client) {
  //   client.init();
  //   client.waitForElementVisible("body", 1000);
  //   client.assert.title("The Internet");
  //   client.expect.element(".heading").text.to.equal("Welcome to the Internet");
  // },

  // "Navigate to Broken Images page": function (client) {
  //   client.click("a[href='/broken_images']");
  //   client.expect.element(".example > h3").text.to.equal("Broken Images");
  //   client.back();
  // },

  "Handling multiple elements": function (client) {
    client.url("http://the-internet.herokuapp.com/checkboxes");
    // client.click("a[href='/checkboxes']");
    client.expect.element("form#checkboxes").to.be.present;

    client.elements("css selector", "form#checkboxes > input[type='checkbox']", function (result) {
      console.log("No. of checkboxes: " + result.value.length);

      result.value.map(function(checkbox) {
        client.elementIdSelected(checkbox.ELEMENT, function (checkedResult) {
          if (!checkedResult.value) {
            client.elementIdClick(checkbox.ELEMENT);
          }
          client.expect.element(checkbox.ELEMENT).to.be.selected;
        });
        // client.elementIdAttribute(checkbox.ELEMENT, "checked", function(checkedResult) {
        //   if (checkedResult.value !== null || checkedResult.value === false) {
        //     client.setAttribute(checkbox.ELEMENT``)
        //   }
        //   console.log(checkedResult.value);
        // });
      });
    });
  },

  after: function (client) {
    client.end();
  }

};