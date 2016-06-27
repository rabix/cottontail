'use strict';
const RefResolverService = require('../../../../src/services/cwl/ref.resolver.service');
const RefResolverServicePath = '../../../../src/services/cwl/ref.resolver.service';

const _ = require('lodash');
const proxyquire =  require('proxyquire');
const Rx = require('rxjs/Rx');


describe("RefResolverService", () => {

    describe("resolveUrlReference", () => {
        it("should return an FileModel with content from the URL",() => {

            let expectedResult = {
                name: 'test.json',
                absolutePath: 'https://stackoverflow.com/data/test.json',
                content: '{"content":"mock"}'
            };

            let HttpServiceMock = {
                getRequest: () => {
                    return new Promise((resolve) => {
                        resolve('{"content":"mock"}');
                    });
                }
            };

            let refResolverService = proxyquire(RefResolverServicePath, {
                '../../services/http/http.service': HttpServiceMock
            });

            refResolverService.resolveUrlReference('test.json', "https://stackoverflow.com/data/test.json")
                .subscribe((res) => {
                    expect(_.isEqual(res, expectedResult)).toBe(true);
                });
        });
    });

    describe("resolveRef", () => {

        it("should call resolveUrlReference if the reference is a URL", () => {
            spyOn(RefResolverService, "resolveUrlReference").and.callFake(function() {
                return Rx.Observable.of({});
            });


            RefResolverService.resolveRef("./test.json", "https://stackoverflow.com/data/")
                .subscribe(() => {
                    expect(RefResolverService.resolveUrlReference)
                        .toHaveBeenCalledWith("./test.json", "https://stackoverflow.com/data/test.json");
                });

            RefResolverService.resolveRef("https://stackoverflow.com/data/test.json", "https://google.com/")
                .subscribe(() => {
                    expect(RefResolverService.resolveUrlReference)
                        .toHaveBeenCalledWith("./test.json", "https://stackoverflow.com/data/test.json");
                });
        });


        it("should return a file from the file system if the reference is NOT a URL", () => {
            
            let storeServiceStub = {
                readFile: function(absolutePath) {
                    return new Promise((resolve) => {
                        resolve({
                            name: 'mock.yml',
                            absolutePath: absolutePath,
                            content: '{ "content": "mock" }'
                        });
                    });
                }
            };

            let refResolverService = proxyquire(RefResolverServicePath, {
                '../../services/store/store.service': storeServiceStub
            });

            refResolverService.resolveRef("../test.json", "/Users/mate/testws/").subscribe((res) => {
                let expectedFile = {
                    name: 'mock.yml',
                    absolutePath: '/Users/mate/test.json',
                    content: '{ "content": "mock" }'
                };

                expect(res).toEqual(expectedFile);
            });

            refResolverService.resolveRef("/Users/mate/testws/test2.json", "/mock").subscribe((res) => {
                let expectedFile = {
                    name: 'mock.yml',
                    absolutePath: '/Users/mate/testws/test2.json',
                    content: '{ "content": "mock" }'
                };

                expect(res).toEqual(expectedFile);
            });
        });
    });

});