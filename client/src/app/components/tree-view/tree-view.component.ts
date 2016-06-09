import "./tree-view.component.scss";
import {AsyncPipe} from "@angular/common";
import {Observable} from "rxjs/Rx";
import {Component, Input} from "@angular/core";
import {ComponentCompilerDirective} from "../runtime-compiler/component-compiler.directive";
import {TreeNodeComponent} from "./structure/tree-node.component";
import {DynamicComponentContext} from "../runtime-compiler/dynamic-component-context";

@Component({
    selector: "tree-view",
    template: `
            <!--This <div class="tree-node"> exists as a CSS specificity convenience-->
            <div *ngFor="let ctx of (components | async)" [component-compiler]="ctx"></div>
            
    `,
    directives: [TreeViewComponent, TreeNodeComponent, ComponentCompilerDirective],
    pipes: [AsyncPipe]
})
export class TreeViewComponent {

    @Input() dataProvider: any;

    private components: Observable<DynamicComponentContext>;

    ngOnInit() {
        this.components = this.dataProvider();
    }
}
