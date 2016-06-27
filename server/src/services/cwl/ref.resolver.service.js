'use strict';

const ValidationService = require('../validation/validation.service');
const FileHelper = require('../../helper/file.helper');
const StoreService = require('../../services/store/store.service');
const HttpService = require('../../services/http/http.service');

const Rx = require('rxjs/Rx');

let RefResolverService = {
    createCwlRefFile: function(props) {
        return {
            name: props.name,
            absolutePath: props.absolutePath,
            content: props.content
        }
    },
    
    resolveUrlReference: function(name, url) {
        return Rx.Observable.create((observer) => {
            HttpService.getRequest(url).then((res) => {
                let result = this.createCwlRefFile({
                    name: name,
                    absolutePath: url,
                    content: res
                });

                observer.next(result);
            }).catch((err) => {
                console.log(err);
                observer.error(err);
            });
        });
    },

    resolveRef: function(referenceString, parentPath) {
        let that = this;
        let isRelative = FileHelper.isRelativePath(referenceString);

        //If its a URL
        if (ValidationService.isValidUrl(referenceString) && !isRelative) {
            return that.resolveUrlReference(referenceString, referenceString);

        } else if (ValidationService.isValidUrl(parentPath) && isRelative) {
            let absoluteRefPath = FileHelper.relativeToAbsolutePath(referenceString, parentPath);
            return that.resolveUrlReference(referenceString, absoluteRefPath);

        } else {
            //If its a file
            return Rx.Observable.create((observer) => {

                let absoluteRefPath = '';
                if (isRelative) {
                    absoluteRefPath = FileHelper.relativeToAbsolutePath(referenceString, parentPath);
                } else {
                    absoluteRefPath = referenceString;
                }

                return StoreService.readFile(absoluteRefPath).then((data) => {
                    let result = this.createCwlRefFile({
                        name: data.name,
                        absolutePath: data.absolutePath,
                        content: data.content
                    });

                    observer.next(result);
                }).catch(function(err) {
                    console.log(err);
                    observer.error(err);
                });
            });
        }
    }
};

module.exports = RefResolverService;
