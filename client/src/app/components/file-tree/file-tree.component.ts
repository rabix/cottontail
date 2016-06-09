import {AsyncSocketProviderService} from "./async-socket-provider.service";
import {BlockLoaderComponent} from "../block-loader/block-loader.component";
import {Component, Injector} from "@angular/core";
import {DataService} from "../../services/data/data.service";
import {DirectoryDataProviderFactory} from "./types";
import {FileTreeService} from "./file-tree.service";
import {TreeViewService, TreeViewComponent} from "../tree-view";
import {FileEffects} from "../../store/effects/file.effects";
import {Store} from "@ngrx/store";
import * as STORE_ACTIONS from "../../store/actions";
import {NgTemplateOutlet} from "@angular/common";

@Component({
    selector: "file-tree",
    directives: [TreeViewComponent, BlockLoaderComponent, NgTemplateOutlet],
    providers: [TreeViewService, AsyncSocketProviderService, DataService],
    template: `
        <block-loader *ngIf="treeIsLoading"></block-loader>
        
        <tree-view class="deep-unselectable" [dataProvider]="dataProviderFn"></tree-view>
    `
})
export class FileTreeComponent {

    private dataProviderFn: DirectoryDataProviderFactory;
    private treeIsLoading: boolean;

    private storeSubscription;

    constructor(private treeService: FileTreeService,
                private store: Store,
                private fileEffects: FileEffects) {

        this.treeIsLoading  = false;
        this.dataProviderFn = treeService.createDataProviderForDirectory("");
    }

    ngOnInit() {
        // We need to react to changes on the directory structure and update the tree
        this.storeSubscription = this.fileEffects.directoryContent$.subscribe(this.store);

        // This is the main user of the directory structure, it should dispatch the first request
        this.store.dispatch({type: STORE_ACTIONS.REQUEST_DIRECTORY_CONTENT, payload: "./"});

    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
    }

}
