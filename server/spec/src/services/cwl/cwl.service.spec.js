'use strict';

const _ = require('lodash');
const q = require('q');
const proxyquire = require('proxyquire');
const Rx = require('rxjs/Rx');

const CwlService = require('../../../../src/services/cwl/cwl.service');
const CwlServicePath = '../../../../src/services/cwl/cwl.service';

let testFileContent = {
    "form": {
        "bar": {
            "$import": "import.yml",
            "fooo": {
                "bla": {
                    "$include": "./include.yml"
                }
            }
        },
        "$include": "./include2.yml",
        "c": {
            "$import": "./import2.yml"
        },
        "d": {
            "$import": "./import2.yml"
        }
    }
};

let refFile = {
    name: 'included.yml',
    absolutePath: '/Users/mate/testws/included.yml',
    content: '{ "content": "mock", "$include": "./nested-include.yml" }'
};

let nestedRefFile = {
    name: 'nested-included.yml',
    absolutePath: '/Users/mate/testws/nested-included.yml',
    content: '{ "nestedContent": "nestedMock" }'
};

let mockRefResolverService = {
    resolveRef: function(value) {
        if (value === "./nested-include.yml") {
            return Rx.Observable.of(nestedRefFile);
        }
        return Rx.Observable.of(refFile);
    }
};

describe("CwlFileModel", () => {

    describe("parseCwlFile", () => {
        it("should parse the JSON string and get the content references",() => {
            
            let result = null;
            CwlService.getParsedCwlFile('/Users/mate/testws/cmd1-test.json').subscribe((res) => {
            //CwlService.getParsedCwlFile('http://www.mocky.io/v2/577052ed1000007124125448').subscribe((res) => {
                result = res;
            }, (err) => {
                console.log(err)
            }, () => {
                console.dir(result.contentReferences);
               // expect(result.contentReferences[0].contentReferences.length).toBe(1);
            });
            

               /* let testFile = {
                    name: "file1",
                    absolutePath: "/Users/mate/testws/",
                    content: JSON.stringify(testFileContent)
                };

                let expectedRef = {
                    id: 'included.yml',
                    content: { content: 'mock', '$include': './nested-include.yml' },
                    path: '/Users/mate/testws/included.yml',
                    contentReferences: [{ 
                        id: 'nested-included.yml',
                        content: { nestedContent: 'nestedMock' },
                        path: '/Users/mate/testws/nested-included.yml',
                        contentReferences: [] 
                    }]
                };
    
                let cwlSerivce = proxyquire(CwlServicePath, {
                    './ref.resolver.service': mockRefResolverService
                });

                cwlSerivce.parseCwlFile(testFile).subscribe((res) => {
                    expect(res.contentReferences.length).toBe(4);
                    expect(_.isEqual(res.contentReferences[0], expectedRef)).toBe(true);
                }, (err) => console.log(err));*/
            });
    });
});
