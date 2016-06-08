import {DirectoryNodeComponent} from "./nodes/directory-node.component";
import {DynamicComponentContext} from "../runtime-compiler/dynamic-component-context";
import {FileNodeComponent} from "./nodes/file-node.component";
import {FilePath} from "../../services/api/api-response-types";
import {Injectable, ComponentResolver, ComponentFactory} from "@angular/core";
import {Subject, BehaviorSubject, Observable} from "rxjs/Rx";

@Injectable()
export class FileTreeService {

    public fileOpenStream:Subject<FilePath>;

    public state:BehaviorSubject<any>;


    constructor(private resolver:ComponentResolver) {

        this.fileOpenStream = new Subject<FilePath>();

        this.state = new BehaviorSubject([]);

        console.time("dataset");
        let demo = this.generateDemoStructure(5000);
        console.timeEnd("dataset");

        console.time("push");
        this.state.next(demo);
        console.timeEnd("push");
        //
        // setInterval(() => {
        //     this.state.next(this.state.getValue().map(item => {
        //         return Object.assign({}, item, {
        //             isModified: Math.random() > 0.5 ? true : false
        //         });
        //     }));
        // }, 1000);
    }

    public generateDemoStructure(size:number) {
        let struct = [];
        struct.length = size;

        function oneOf(...values) {
            return values[Math.floor(Math.random() * values.length)];
        }


        for (let i = 0; i < size; i++) {
            let type = oneOf("directory", "file");
            let name = type + "-" + Math.round(Math.random() * size * 50);
            let isExpanded = oneOf(false);

            let relativePath = name;
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
    public openFile(fileInfo:FilePath):void {
        this.fileOpenStream.next(fileInfo);
    }

    public createDataProviderForDirectory(directory = "") {

        return () => this.state.map((rootLevel:any[]) => {


            let level = rootLevel.filter(item => {
                if (directory === "") {
                    return item.name === item.relativePath;
                } else {
                    return item.relativePath.indexOf(`${directory}/`) === 0
                }
            });

            let componentPromises = level.map(item => {
                let componentType = FileNodeComponent;
                if (item.type === "directory") {
                    componentType = DirectoryNodeComponent;
                }

                return this.resolver.resolveComponent(componentType)
                    .then((factory:ComponentFactory<any>) => {
                        return new DynamicComponentContext(factory, item);
                    })
                    .catch((err) => {
                        throw new Error(`Could not resolve component ${componentType}: ${err}`)
                    });
            });

            return Observable.defer(() => Observable.fromPromise(Promise.all(componentPromises)));

        }).concatAll();

    }
}
