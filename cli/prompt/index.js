/**
 * Created by filip on 8/25/15.
 */
var inquirer = require("inquirer");

module.exports = function (questions, callback) {

    inquirer.prompt(questions, function (answers) {
        callback(answers);
    });

};