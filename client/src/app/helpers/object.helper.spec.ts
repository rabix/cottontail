import {it, describe, expect} from "@angular/core/testing";
import {ObjectHelper} from "./object.helper";

describe("ObjectHelper", () => {

    describe("addProperty()", () => {

        it("should add a root-level value to an empty object", () => {
            const target   = {},
                  addition = "bar";

            ObjectHelper.addProperty(target, "foo", addition);
            expect(target).toEqual({foo: "bar"});
        });

        it("should add a nested value to an empty object", () => {
            const target   = {},
                  addition = "bar";

            ObjectHelper.addProperty(target, "foo.baz.maz", addition);
            expect(target).toEqual({foo: {baz: {maz: "bar"}}});
        });

        it("should override a nested object", () => {
            const target   = {foo: {moo: "boo"}},
                  addition = {baz: {taz: "gaz"}};

            ObjectHelper.addProperty(target, "foo.moo", addition);
            expect(target).toEqual({foo: {moo: {baz: {taz: "gaz"}}}});
        });

        it("should throw an error is the value to override is not an object or undefined", () => {
            const target   = {foo: {moo: 2000}},
                  addition = {baz: "taz"};

            expect(() => {
                ObjectHelper.addProperty(target, "foo.moo.goo", addition)
            }).toThrowError();
        });

        it("should work with arrays", () => {
            const target   = {foo: "moo"},
                  addition = {baz: {taz: "gaz"}};

            ObjectHelper.addProperty(target, ["goo", "boo"], addition);
            expect(target).toEqual({
                foo: "moo",
                goo: {boo: {baz: {taz: "gaz"}}}
            });
        });
    });

    /**
     * @name ObjectHelper-addEnumerablesTest
     */
    describe("addEnumerables()", () => {
        it("should add source properties that exist on the target object", () => {
            let target = {foo: "", bar: ""};
            let source = {bar: "baz", goo: "moo"};

            ObjectHelper.extendEnumerables(target, source);

            expect(target).toEqual({foo: "", bar: "baz"});
        });

        it("should extend class instance properties", () => {
            class TestClass {
                private first    = null;
                protected second = "moo";
                public third     = null;
            }

            let instance = new TestClass();
            let source   = {first: "foo", second: "bar", third: "baz"};

            ObjectHelper.extendEnumerables(instance, source);
            expect((<any>instance).first).toEqual("foo");
            expect((<any>instance).second).toEqual("bar");
            expect((<any>instance).third).toEqual("baz");

        });

    });

    describe("findChild()", () => {
        it("should find a children in an array", () => {
            let target = [
                {
                    name: "first",
                    children: [
                        {
                            name: "second",
                            children: [
                                {
                                    name: "third",
                                    foo: "bar"
                                }]
                        }
                    ]
                },
            ];

            let comparator = (item, key) => item.name === key;
            let deep       = ObjectHelper.findChild(target, ["first", "second", "third"], comparator);
            let shallow    = ObjectHelper.findChild(target, ["first"], comparator);
            let nothing    = ObjectHelper.findChild(target, ["first", "myChild"], comparator);

            expect(deep).toEqual({name: "third", foo: "bar"});
            expect(shallow).toEqual(target[0]);
            expect(nothing).toBeUndefined();
        });
    });

    describe("extendWithNonExisting()", () => {
        it("should add non-enumerable properties to an object", () => {
            let target = {
                foo: "bar",
                baz: "gaz"
            };

            ObjectHelper.extendWithNonExisting(target,
                {foo: "boo", moo: "goo"},
                {baz: "traz", haz: "jaz"});

            expect(target).toEqual({foo: "bar", baz: "gaz", moo: "goo", haz: "jaz"});
        });
    });

    describe("childrenDiff()", () => {
        it("should diff array objects", () => {
            let state = [
                {name: "first", foo: "bar", see: "mine"},
                {name: "second", moo: "baz", joel: "software"},
            ];

            let update = [
                {name: "boo", moo: "goo"},
                {name: "first", see: "yours"}
            ];

            let result = ObjectHelper.childrenDiff(state, update, "name", {foo: "baz"});

            expect(result).toEqual([
                {name: "boo", moo: "goo", foo: "baz"},
                {name: "first", see: "yours", foo: "bar"}
            ]);
        });
    });

});
