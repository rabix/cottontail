var Jasmine = require('jasmine');
var jasmine = new Jasmine();

var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
    savePath: './spec/report',
    consolidateAll: true
});

jasmine.loadConfig({
    "spec_dir": "spec",
    "spec_files": [
        "**/*[sS]pec.js"
    ],
    "helpers": [
        "helpers/**/*.js"
    ],
    "stopSpecOnExpectationFailure": false,
    "random": false
});

jasmine.configureDefaultReporter({
    showColors: true
});

jasmine.addReporter(junitReporter);
jasmine.addReporter({
    specStarted: function (result) {
        console.log(result.description);
    }
});

jasmine.execute();