import {Directive, Output} from "@angular/core";
import {Subject} from "rxjs/Rx";

@Directive({
    selector: "[treeview-expandable]",
    host: {
        "(dblclick)": "toggleExpansion()",
        "class": "btn-sm clickable"
    }
})
export class TreeviewExpandableDirective {

    @Output() onExpansionSwitch = new Subject<boolean>();
    private isExpanded = false;

    toggleExpansion() {
        this.isExpanded = !this.isExpanded;
        this.onExpansionSwitch.next(this.isExpanded);
    }
}
