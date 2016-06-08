import {ActionPanelComponent} from "../action-panel/action-panel.component";
import {ApiService} from "../../services/api/api.service";
import {APP_CONFIG, CONFIG} from "../../config/app.config";
import {AsyncSocketProviderService} from "../file-tree/async-socket-provider.service";
import {BACKEND_SERVICE} from "../../services/data/providers/data.types";
import {ComponentRegistryFactoryService} from "../workspace/registry/component-registry-factory.service";
import {DataService} from "../../services/data/data.service";
import {FileApi} from "../../services/api/file.api";
import {FileEffects} from "../../store/effects/file.effects";
import {FileRegistry} from "../../services/file-registry.service";
import {FileTreeService} from "../file-tree/file-tree.service";
import {provide, Component} from "@angular/core";
import {SocketService as NewSocketService} from "../../services/data/providers/socket/socket.service";
import {SocketService} from "../../services/api/socket.service";
import {StateUpdates} from "@ngrx/effects";
import {WorkspaceComponent} from "../workspace/workspace.component";
import {WorkspaceService} from "../workspace/workspace.service";
require("./../../../assets/sass/main.scss");
require("./main.component.scss");

@Component({
    selector: "cottontail",
    template: `
        <section class="editor-container">
            <action-panel></action-panel>
            <workspace></workspace>
        </section>
    `,
    directives: [WorkspaceComponent, ActionPanelComponent],
    providers: [
        ApiService,
        AsyncSocketProviderService,
        ComponentRegistryFactoryService,
        FileApi,
        FileTreeService,
        FileRegistry,
        provide(APP_CONFIG, {useValue: CONFIG}),
        provide(BACKEND_SERVICE, {useClass: NewSocketService}),
        SocketService,
        WorkspaceService,
        DataService,
        FileEffects,
        StateUpdates
    ]
})
export class MainComponent {

    constructor() {
        /**
         * Example API usage
         */

        // let fileName = new Date().getTime().toString() + '.txt';

        // fileApi.createFile(fileName).subscribe(res => {
        //     console.log(`1. Created ${fileName}:`, res);
        // });
        //
        // fileApi.updateFile(fileName, new Date().toString()).subscribe(res => {
        //     console.log(`2. Updated ${fileName}:`, res);
        // });
        //
        // fileApi.getFileContent(fileName).subscribe((res) => {
        //     console.log(`3. Reading ${fileName} content:`, res);
        // });

        // fileApi.getDirContent().subscribe((res) => {
        //     console.log(`4. Directory contents`, res);
        // });

        // fileApi.getFileContent('wagner-workflow.json').subscribe(res => {
        //     console.log(res);
        // }, err => {
        //     console.log(err);
        // });
        //
        // fileApi.getFileContent('does not exist').subscribe(res => {
        //     console.log(res);
        // }, err => {
        //     console.log(err);
        // });
        //
        // fileApi.checkIfFileExists('wagner-workflow.json').subscribe(res => {
        //     console.log(res);
        // }, err => {
        //     console.log(err);
        // })


    }
}
