var Jasmine = require('jasmine');
var jasmine = new Jasmine();

var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
    savePath: './spec/report',
    consolidateAll: true
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

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.execute();