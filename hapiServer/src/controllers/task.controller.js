"use strict";

const q = require('q');
const _ = require('lodash');

function TaskController(){};
TaskController.prototype = (function(){

    return {
        getTasks: (request, reply) => {
            return reply({"BLA": "Some TASK"});
        }
    }
})();

var taskController = new TaskController();
module.exports = taskController;