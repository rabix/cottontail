import {describe, it, expect} from "@angular/core/testing";
import {directoryContentReducer as DCR} from "./tree.reducer";
import {DIRECTORY_CONTENT_UPDATE} from "../actions";

describe("tree.reducer", () => {

    let treeNodeDefaults = {
        isModified: false,
        isExpanded: false,
        isSelected: false
    };

    describe("DIRECTORY_CONTENT_UPDATE", () => {


        it("should fill up a blank state with incoming data", () => {
            let state = DCR([], {
                type: DIRECTORY_CONTENT_UPDATE,
                payload: {
                    path: "",
                    content: [
                        {name: "first", type: "directory", relativePath: "first"},
                        {name: "second.ts", type: ".ts", relativePath: "second.ts"}
                    ]
                }
            });


            expect(state).toEqual([
                Object.assign({
                    name: "first",
                    type: "directory",
                    relativePath: "first"
                }, treeNodeDefaults),
                Object.assign({
                    name: "second.ts",
                    type: ".ts",
                    relativePath: "second.ts"
                }, treeNodeDefaults)
            ]);
        });

        it("should update existing state with new data", () => {

            let state = DCR([
                {name: "first", type: "directory", relativePath: "first"},
                {name: "second.ts", type: ".ts", relativePath: "second.ts"}
            ], {
                type: DIRECTORY_CONTENT_UPDATE,
                payload: {
                    path: "",
                    content: [
                        {name: "first", type: "directory", foo: "bar", relativePath: "first"},
                        {name: "alternative.ts", type: ".ts", relativePath: "second.ts"}
                    ]
                }
            });

            expect(state).toEqual([
                Object.assign({
                    name: "first",
                    type: "directory",
                    foo: "bar",
                    relativePath: "first",
                }, treeNodeDefaults),
                Object.assign({
                    name: "alternative.ts",
                    type: ".ts",
                    relativePath: "second.ts"
                }, treeNodeDefaults)
            ]);
        });

        it("should replace nested states", () => {

            let state = DCR([
                {
                    name: "first", type: "directory", relativePath: "first",
                    children: [
                        {
                            name: "sub",
                            type: "directory",
                            relativePath: "first/sub",
                            children: [
                                {
                                    name: "subsub",
                                    type: "directory",
                                    relativePath: "first/sub/subsub"
                                }
                            ]
                        }
                    ]
                },
            ], {
                type: DIRECTORY_CONTENT_UPDATE,
                payload: {
                    path: "first",
                    content: [
                        {name: "altsub", type: "directory", relativePath: "first/altsub"},
                    ]
                }
            });

            expect(state).toEqual([
                Object.assign({
                    name: "first",
                    type: "directory",
                    relativePath: "first",
                    children: [Object.assign({
                        name: "altsub",
                        type: "directory",
                        relativePath: "first/altsub"
                    }, treeNodeDefaults)]
                }),
            ]);
        });
    });
});
