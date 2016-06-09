import {Component, Input, ChangeDetectionStrategy, Output} from "@angular/core";
import {DirectoryModel} from "../../../store/models/fs.models";
import {DynamicState} from "../../runtime-compiler/dynamic-state.interface";
import {FileTreeService} from "../file-tree.service";
import {TreeViewComponent} from "../../tree-view/tree-view.component";
import {TreeviewExpandableDirective} from "../../tree-view/behaviours/treeview-expandable.directive";
import {TreeViewNode} from "../../tree-view/interfaces/tree-view-node";
import {TreeviewSelectableDirective} from "../../tree-view/behaviours/treeview-selectable.directive";
import {NgIf} from "@angular/common";
import {Subject, BehaviorSubject} from "rxjs/Rx";

@Component({
    selector: "file-tree:directory",
    directives: [TreeviewSelectableDirective, TreeviewExpandableDirective, TreeViewComponent, NgIf],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div treeview-selectable (dblclick)="toggleExpansion()">
            <template [ngIf]="isExpandable">
                <span class="fa expander"
                      [ngClass]="{
                        'fa-caret-down': isExpanded, 
                        'fa-caret-right': !isExpanded
                       }">
                </span>
                
                <span class="fa node-icon" 
                      [ngClass]="{
                       'fa-folder-o': !isExpanded, 
                       'fa-folder-open-o': isExpanded
                       }">
                </span>
            </template>
            
            <span class="name">
                {{ model.getName() }}
                <span *ngIf="model.isModified">*</span>
            </span>
        </div>
        <template [ngIf]="isExpanded">
            <tree-view [dataProvider]="dataProviderFn"></tree-view>
        </template>
    `
})
export class DirectoryNodeComponent implements TreeViewNode, DynamicState {

    @Input() model: DirectoryModel;
    @Output() expand: Subject<boolean>;

    private isExpandable = true;
    private isExpanded   = true;


    private dataProviderFn;

    constructor(private fileTreeService: FileTreeService) {

        this.expand = new BehaviorSubject(false);

    }

    ngOnInit() {
        this.dataProviderFn = this.fileTreeService
            .createDataProviderForDirectory(this.model.relativePath);

    }

    public toggleExpansion() {
        this.fileTreeService.toggleExpansion(this.model);
    }

    setState(data: any) {
        this.model        = DirectoryModel.createFromObject(data);
        this.isExpanded   = data.isExpanded || false;
        this.isExpandable = data.isExpandable || false;
    }
}
