import {ActionReducer, Action} from "@ngrx/store";
import {DIRECTORY_CONTENT_UPDATE, DIRECTORY_TREE_TOGGLE_EXPANSION} from "../actions";
import {StringHelper} from "../../helpers/string.helper";
import {ObjectHelper} from "../../helpers/object.helper";

export const directoryContentReducer: ActionReducer = (state: any[] = [], action: Action) => {

    switch (action.type) {

        case DIRECTORY_TREE_TOGGLE_EXPANSION:
            let path         = StringHelper.dirPathToArray(action.payload.relativePath);
            let newState     = state.slice();
            let model        = ObjectHelper.findChild(newState, path, (i, k) => i.name === k);
            model.isExpanded = !model.isExpanded;
            return newState;

        case DIRECTORY_CONTENT_UPDATE:
            let path    = StringHelper.dirPathToArray(action.payload.path);
            let content = action.payload.content;

            // Add directory specific default states
            content.filter(i => i.type === "directory").map(dir => Object.assign(dir, {
                isExpandable: !dir.isEmpty,
            }));

            // Add common keys to all elements of the tree
            content.map(i => Object.assign(i, {
                isModified: false
            }));

            let childToDiff;

            if (path.length === 0) {
                return ObjectHelper.childrenDiff(state.slice(), content, 'relativePath', {
                    isExpanded: false,
                    isSelected: false,
                    children: []
                });
            }
            else {
                let newState = state.slice();
                childToDiff  = ObjectHelper.findChild(state, path, (item, key) => item.name === key);

                if (Array.isArray(childToDiff["children"])) {
                    let diff = ObjectHelper.childrenDiff(childToDiff["children"], content, 'relativePath', {
                        isExpanded: false,
                        isSelected: false,
                        children: []
                    });

                    childToDiff["children"] = diff;
                }
                return newState;
            }

        default:

            return state;

    }

};

