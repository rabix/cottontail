import {Injectable, ComponentResolver, ComponentFactory} from "@angular/core";
import {FileApi} from "../../services/api/file.api";
import {Observable} from "rxjs/Rx";
import {FilePath} from "../../services/api/api-response-types";
import {FileNodeComponent} from "./nodes/file-node.component";
import {DirectoryNodeComponent} from "./nodes/directory-node.component";
import {TreeDataProvider} from "../tree-view/interfaces/tree-data-provider";
import {DirectoryChild, DirectoryModel} from "../../store/models/fs.models";


@Injectable()
export class AsyncSocketProviderService implements TreeDataProvider {

    constructor(private fileApi: FileApi, private resolver: ComponentResolver) {

    }

    public getNodeContent(dir = ""): Observable<Array<{factory: ComponentFactory<any>, data: FilePath}>> {
        let path = `./${dir}`;
        if (dir.substr(0, 1) === "/") {
            path = dir;
        }

        return this.fileApi.getDirContent(path).map((items: DirectoryChild[])=> {

            return Observable.defer(() => {

                return Observable.fromPromise(Promise.all(items.map((item: DirectoryChild) => {

                    // Determine the component type
                    // This should probably be moved to a factory
                    let componentType = FileNodeComponent;
                    if (item instanceof DirectoryModel) {
                        componentType = DirectoryNodeComponent;
                    }

                    return this.resolver.resolveComponent(componentType)
                        .then((factory: ComponentFactory<any>) => {
                        return {
                            factory: factory,
                        };
                    });

                })));
            });
        }).concatAll();
    }
}
