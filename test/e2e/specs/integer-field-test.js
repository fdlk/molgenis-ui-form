/* eslint-disable no-unused-expressions */

module.exports = {
  tags: ['integer'], // run this suite with 'yarn e2e --tag integer'

  beforeEach: function (browser) {
    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/integer')
  },

  'Integer field should be valid with valid integer': function (browser) {
    browser.options.desiredCapabilities.name = 'Integer field only valid for integers'
    browser.expect.element('#integer-example').to.be.present
    browser.getValue('#integer-example', function (result) {
      this.assert.equal(result.value, '3')
    })
    browser.expect.element('#integer-example').to.have.attribute('class').which.contains('vf-valid')
    browser.end()
  },

  'Integer field should allow typing a negative number': function (browser) {
    browser.options.desiredCapabilities.name = 'Integer field should allow typing negative number'
    browser.expect.element('#integer-example').to.be.visible
    browser.click('#integer-example')
    // Workaround since clearValue is not working
    browser.execute(function () {
      document.getElementById('integer-example').value = ''
    })
    browser.setValue('#integer-example', '-1')
    browser.pause(100)
    browser.getValue('#integer-example', function (result) {
      this.assert.equal(result.value, '-1')
    })
    browser.end()
  },

  'Integer field should be invalid with decimal value': function (browser) {
    browser.options.desiredCapabilities.name = 'Integer field not valid for decimal value'
    browser.expect.element('#integer-example').to.be.present
    browser.click('#integer-example')
    // Workaround since clearValue is not working
    browser.execute(function () {
      document.getElementById('integer-example').value = ''
    })
    // test separator
    browser.setValue('#integer-example', '1.2')
    browser.pause(100)

    browser.getValue('#integer-example', function (result) {
      if (result.value !== '1.2') {
        browser.click('#integer-example')
        // Workaround since clearValue is not working
        browser.execute(function () {
          document.getElementById('integer-example').value = ''
        })
        browser.setValue('#integer-example', '1,2')
      }

      browser.pause(100)
      browser.expect.element('#integer-example').to.have.attribute('class').which.contains('vf-invalid-integer')
      browser.expect.element('.invalid-feedback').to.be.present
      browser.expect.element('.invalid-feedback').text.to.be.equal('Not a valid integer value')
      browser.end()
    })
  }
}
