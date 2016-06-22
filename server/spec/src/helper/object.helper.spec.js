'use strict';
var ObjectHelper = require('../../../src/helper/object.helper');

describe('ObjectHelper', () => {

    describe("iterateAll", () => {
        it("should find nested properties and apply the callback", () => {
            let obj = {
                a: 123,
                b: {
                    c: {
                        d: 456
                    },
                    e: 789
                },
                g: "ABC"
            };

            ObjectHelper.iterateAll(obj, (propName, value, obj) => {
                if (propName === 'd') {
                    obj['d'] = 444;
                }

                if (propName === 'a') {
                    obj['a'] = 111;
                }
            });

            expect(obj.b.c.d).toEqual(444);
            expect(obj.a).toEqual(111);
        });

        it("should handle circular references", () => {
            let obj1 = { a: 444 };
            let obj2 = { a: 123, b: { c: { d: 456 }, e: 789 }, g: "ABC", h: obj1, j: [1] };

            obj1['circular'] = obj2 ;

            obj2.b.c['circular'] = obj2;
            obj2.j.push(obj2);

            let resultValues = [];
            ObjectHelper.iterateAll(obj2, (propName, value) => {
                resultValues.push(value);
            });

            expect(resultValues).toEqual([123, 'ABC', 1, 444, 789, 456]);
        });
    });
    
});
