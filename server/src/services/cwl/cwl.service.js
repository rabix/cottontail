'use strict';
const ObjectHelper = require('../../helper/object.helper');
const RefResolveService = require('./ref.resolver.service');
const StoreService = require('../store/store.service');
const ValidationService = require('../validation/validation.service');
const HttpService = require('../http/http.service');

const _ = require('lodash');
const q = require('q');
const Rx = require('rxjs/Rx');

module.exports = {
    getParsedCwlFile: function(filePath) {
        let that = this;

        if (ValidationService.isValidUrl(filePath)) {
            return Rx.Observable.fromPromise(HttpService.getRequest(filePath))
                .mergeMap((jsonContent) => {
                    let fileName = filePath.split('/').pop();
                    let fileModel = {
                        name: fileName,
                        content: JSON.stringify(jsonContent),
                        absolutePath: filePath
                    };

                    return that.getReferences(fileModel);
                });
            
        } else {
            return Rx.Observable.fromPromise(StoreService.readFile(filePath))
                .mergeMap((fileModel) => {
                    return that.getReferences(fileModel);
                });
        }
    },

    toCwlModel: function(fileModel) {
        let content = JSON.parse(fileModel.content);
        
        return {
            id: fileModel.name,
            content: content,
            path: fileModel.absolutePath,
            contentReferences: []
        };
    },

    getReferences: function(fileModel) {
        let that = this;

        return Rx.Observable.create((observer) => {
            let cwlFileModel = that.toCwlModel(fileModel);
            observer.next(cwlFileModel);
            
            that.resolveReferences(cwlFileModel, observer).subscribe((res) => {
                observer.next(res);
            }, (err) => {
                console.log(err);
                observer.error(err);
            }, () => {
                observer.complete();
            });
        });
    },

    /* Be careful if you decide to re-factor this. Make sure the tests are passing. */
    resolveReferences: function(cwlFile, recursionObserver) {
        let that = this;

        return Rx.Observable.create((observer) => {
            let traversedProperties = [];

            ObjectHelper.iterateAll(cwlFile.content, (propName, value, object) => {
                if (propName === "$import" || propName === "$include") {
                    traversedProperties.push(value);
                }
            });

            /* Call complete if the object has no t $import or $include */
            if(traversedProperties.length === 0 && !_.isUndefined(recursionObserver)) {
                recursionObserver.complete();
            }
            
            Rx.Observable.from(traversedProperties).mergeMap(value => {
                return RefResolveService.resolveRef(value, cwlFile.path);
            }).subscribe((refFile) => {
                
                let parsedRefFile = that.toCwlModel(refFile);
                cwlFile.contentReferences.push(parsedRefFile);
                observer.next(parsedRefFile);

                if (!_.isUndefined(recursionObserver)) {
                    recursionObserver.next(cwlFile);
                }

                that.resolveReferences(parsedRefFile).subscribe(() => {
                    if(cwlFile.contentReferences.length === traversedProperties.length && !_.isUndefined(recursionObserver)) {
                        recursionObserver.complete()
                    }
                }, err => console.log(err));

            }, (err) => {
                console.log(err);
                recursionObserver.error(err);
            });
        });
    }
};
   
