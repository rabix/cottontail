'use strict';

const _ = require('lodash');
const q = require('q');
const proxyquire = require('proxyquire');
const Rx = require('rxjs/Rx');

const CwlServicePath = '../../../../src/services/cwl/cwl.service';

let testFileContent = {
    "form": {
        "bar": {
            "$import": "import.yml",
            "fooo": {
                "bla": {
                    "$include": "./include-nested.yml"
                }
            }
        },
        "$include": "./include2.yml",
        "c": {
            "$import": "./import1.yml"
        },
        "d": {
            "$import": "./import2.yml"
        }
    }
};

let refFile = {
    name: 'included.yml',
    absolutePath: '/Users/mate/testws/included.yml',
    content: '{ "content": "mock" }'
};

let refFileWithNesting = {
    name: 'include-nested.yml',
    absolutePath: '/Users/mate/testws/included.yml',
    content: '{ "content": "mock", "$include": "./nested.yml" }'
};

let nestedRefFile = {
    name: 'nested.yml',
    absolutePath: '/Users/mate/testws/nested.yml',
    content: '{ "nestedContent": "nestedMock" }'
};

let expectedNestedRef = {
    id: 'nested.yml',
    content: { nestedContent: 'nestedMock' },
    path: '/Users/mate/testws/nested.yml',
    contentReferences: []
};

let RefResolverServiceMock = {
    resolveRef: function(value) {
        if (value === "./include-nested.yml") {
            return Rx.Observable.of(refFileWithNesting);
        }

        if (value === "./nested.yml") {
            return Rx.Observable.of(nestedRefFile);
        }

        return Rx.Observable.of(refFile);
    }
};

describe("CwlFileModel", () => {

    describe("getParsedCwlFile", () => {
        it("should resolve the reference for file paths",() => {

            let StoreServiceMock = {
                readFile: () => {
                    return new Promise((resolve) => {
                        resolve({
                            name: 'cmd1-test.json',
                            type: 'JSON',
                            content: JSON.stringify(testFileContent),
                            relativePath: '/Users/mate/testws/cmd1-test.json',
                            absolutePath: '/Users/mate/testws/cmd1-test.json'
                        });
                    });
                }
            };

            let cwlService = proxyquire(CwlServicePath, {
                '../store/store.service': StoreServiceMock,
                './ref.resolver.service': RefResolverServiceMock
            });

            let result = null;
            cwlService.getParsedCwlFile('/Users/mate/testws/cmd1-test.json').subscribe((res) => {
                result = res;
            }, (err) => {
                console.log(err);
            }, () => {
                let refFileWithNesting = _.find(result.contentReferences, (refFile) => {
                    return refFile.id === 'include-nested.yml';
                });

                expect(refFileWithNesting.contentReferences[0]).toEqual(expectedNestedRef);
                expect(result.contentReferences.length).toBe(5);
            });

        });

        it("should resolve the reference for url paths",() => {
            
            let HttpServiceMock = {
                getRequest: () => {
                    return new Promise((resolve) => {
                        resolve(testFileContent);
                    });
                }
            };

            let cwlService = proxyquire(CwlServicePath, {
                '../http/http.service': HttpServiceMock,
                './ref.resolver.service': RefResolverServiceMock
            });
            
            let result = null;
            cwlService.getParsedCwlFile('https://www.someurl.com/fake.json').subscribe((res) => {
                result = res;
            }, (err) => {
                console.log(err);
            }, () => {
                let refFileWithNesting = _.find(result.contentReferences, (refFile) => {
                    return refFile.id === 'include-nested.yml';
                });
                
                expect(refFileWithNesting.contentReferences[0]).toEqual(expectedNestedRef);
                expect(result.contentReferences.length).toBe(5);
            });
            
        });

        it("should return a cwlFile with no references if it has no $include or $import",() => {
            let StoreServiceMock = {
                readFile: () => {
                    return new Promise((resolve) => {
                        resolve({
                            name: 'cmd1-test.json',
                            type: 'JSON',
                            content: '{"content": "fakeContent"}',
                            relativePath: '/Users/mate/testws/cmd1-test.json',
                            absolutePath: '/Users/mate/testws/cmd1-test.json'
                        });
                    });
                }
            };

            let cwlService = proxyquire(CwlServicePath, {
                '../store/store.service': StoreServiceMock,
                './ref.resolver.service': RefResolverServiceMock
            });

            let expectedResult = { 
                id: 'cmd1-test.json',
                content: { content: 'fakeContent' },
                path: '/Users/mate/testws/cmd1-test.json',
                contentReferences: [] 
            };

            let result = null;
            cwlService.getParsedCwlFile('fake/path/to/some.json').subscribe((res) => {
                result = res;
            }, (err) => {
                console.log(err);
            }, () => {
                expect(result).toEqual(expectedResult);
            });
        })
    });
});
