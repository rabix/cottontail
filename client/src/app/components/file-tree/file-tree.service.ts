import {DirectoryNodeComponent} from "./nodes/directory-node.component";
import {DynamicComponentContext} from "../runtime-compiler/dynamic-component-context";
import {FileNodeComponent} from "./nodes/file-node.component";
import {FilePath} from "../../services/api/api-response-types";
import {Injectable, ComponentResolver, ComponentFactory} from "@angular/core";
import {Subject, BehaviorSubject, Observable} from "rxjs/Rx";
import {Store} from "@ngrx/store";
import {DIRECTORY_TREE_TOGGLE_EXPANSION, REQUEST_DIRECTORY_CONTENT} from "../../store/actions";
import {ObjectHelper} from "../../helpers/object.helper";
import {StringHelper} from "../../helpers/string.helper";

@Injectable()
export class FileTreeService {

    public fileOpenStream: Subject<FilePath>;

    public state: BehaviorSubject<any>;


    constructor(private resolver: ComponentResolver,
                private store: Store) {

        this.fileOpenStream = new Subject<FilePath>();

        this.state = new BehaviorSubject([]);

    }

    public toggleExpansion(model) {
        this.store.dispatch({
            type: DIRECTORY_TREE_TOGGLE_EXPANSION,
            payload: model
        });

        if(!model.isExpanded){ // Means that the state reducer will toggle (expand) it
            this.store.dispatch({
                type: REQUEST_DIRECTORY_CONTENT,
                payload: model.relativePath
            })
        }
    }

    private generateDemoStructure(size: number) {
        let struct    = [];
        struct.length = size;

        function oneOf(...values) {
            return values[Math.floor(Math.random() * values.length)];
        }


        for (let i = 0; i < size; i++) {
            let type       = oneOf("directory", "file");
            let name       = type + "-" + Math.round(Math.random() * size * 50);
            let isExpanded = oneOf(false);

            let relativePath       = name;
            let randomPreviousItem = struct[Math.floor(Math.random() * i)];
            if (randomPreviousItem && randomPreviousItem.type === "directory") {
                relativePath = `${randomPreviousItem.relativePath}/${name}`;
            }

            struct[i] = {type, name, isExpanded, relativePath}
        }

        return struct;
    }

    /**
     * Pushes the information about a file to open onto the `fileOpenStream`
     * @param fileInfo
     */
    public openFile(fileInfo: FilePath): void {
        this.fileOpenStream.next(fileInfo);
    }

    public createDataProviderForDirectory(directory = "") {

        // Upon the change in the directory tree, we should update the rendering
        return () => this.store.select("directoryContentReducer")
            .map(content => {
                let path  = StringHelper.dirPathToArray(directory);
                let level = content;

                if (path.length > 0) {
                    level = ObjectHelper.findChild(content, path, (i, k) => i.name === k).children;
                }

                let componentPromises = level.map(item => {
                    let componentType = FileNodeComponent;
                    if (item.type === "directory") {
                        componentType = DirectoryNodeComponent;
                    }

                    return this.resolver.resolveComponent(componentType)
                        .then((factory: ComponentFactory<any>) => {
                            return new DynamicComponentContext(factory, item);
                        })
                        .catch((err) => {
                            throw new Error(`Could not resolve component ${componentType}: ${err}`)
                        });
                });

                return Observable.defer(() => Observable.fromPromise(Promise.all(componentPromises)));
            })
            .concatAll();

    }
}
