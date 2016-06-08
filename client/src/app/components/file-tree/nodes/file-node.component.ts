import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {TreeViewNode} from "../../tree-view/interfaces/tree-view-node";
import {TreeviewSelectableDirective} from "../../tree-view/behaviours/treeview-selectable.directive";
import {FilePath} from "../../../services/api/api-response-types";

@Component({
    selector: "file-tree:file",
    directives: [TreeviewSelectableDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "(dblclick)": "onDoubleClick()"
    },
    template: `
        <div treeview-selectable>
            <span class="expander"></span>
            <span class="fa fa-file-o node-icon"></span>
            
             <span class="name">
                {{ name }} {{ isModified ? "*" : "" }}
            </span>
        </div>
        
    `
})
export class FileNodeComponent implements TreeViewNode {
    isExpandable = false;

    @Input() model: FilePath;

    onDoubleClick() {
    }

}
