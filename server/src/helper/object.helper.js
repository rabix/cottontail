'use strict';
var _ = require('lodash');

module.exports = {
    iterateAll: (object, callback) => {

        let walked = [];
        let stack = [{obj: object, stackPath: ''}];

        while(stack.length > 0)  {

            let lastStackItem = stack.pop();
            let lastStackItemObject = lastStackItem.obj;

            walked.push(lastStackItemObject);

            /* Will iterate over ALL enumerable properties of the object!
             * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in */
            for (let property in lastStackItemObject) {

                /* Make sure we don't loop on inherited properties */
                if (lastStackItemObject.hasOwnProperty(property)) {

                    if (typeof lastStackItemObject[property] === "object") {
                        let alreadyFound = false;

                        /* Check for circular reference */
                        for (let i = 0; i < walked.length; i++) {
                            if (_.isEqual(walked[i], lastStackItemObject[property])) {
                                alreadyFound = true;
                                break;
                            }
                        }

                        if (!alreadyFound) {
                            walked.push(lastStackItemObject[property]);
                            stack.push({obj: lastStackItemObject[property], stack: lastStackItem.stackPath + '.' + property});
                        }

                    } else {
                        callback(property, lastStackItemObject[property], lastStackItemObject);
                    }
                } /* if */
            } /* for */
        } /* while */
    }
};