'use strict';
const ObjectHelper = require('../../helper/object.helper');
const RefResolveService = require('./ref.resolver.service');

const q = require('q');
const Rx = require('rxjs/Rx');

module.exports = {
    parseCwlFile(file) {
        //todo: actually parse by the spec. This only checks for the $include and $import.
        let content = JSON.parse(file.content);
        let cwlFile = {
            id: file.name,
            content: content,
            path: file.absolutePath,
            contentReferences: []
        };

        let that = this;

        return Rx.Observable.create(function(observer) {
            ObjectHelper.iterateAll(cwlFile.content, (propName, value, object) => {
                if (propName === "$import" || propName === "$include") {

                    RefResolveService.resolveRef(value, cwlFile.path).subscribe((refFile) => {
                        that.parseCwlFile(refFile).subscribe((parsedRefFile) => {
                            cwlFile.contentReferences.push(parsedRefFile);
                        }, (err) => observer.error(err));
                    }, (err) => {
                        console.error('Error occurred: ' + err);
                        observer.error(err);
                    });
                }
            });

            observer.next(cwlFile);
        });
    }
};
