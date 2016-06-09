export type DirectoryChild = DirectoryModel|FileModel;

export class FSItemModel {
    protected name:string;
    protected relativePath:string;
    protected absolutePath:string;

    public getName() {
        return this.name;
    }

    public getRelativePath() {
        return this.relativePath;
    }

    public getAbsolutePath() {
        return this.absolutePath;
    }

}

export class FileModel extends FSItemModel {

    private content:string;
    private type:string;
    private modified = false;

    public static createFromObject(data:{
        name:string,
        relativePath?:string
        absolutePath?:string
        content?:string,
        type?:string
    }):FileModel {
        return Object.assign(new FileModel(), data);
    }

    public getType() {
        return this.type;
    }

    public getContent() {
        return this.content;
    }

    public isModified() {
        return this.modified;
    }
}

export class DirectoryModel extends FSItemModel {

    public name:string;
    public isEmpty:boolean;
    public absolutePath:string;
    public relativePath:string;
    public children:DirectoryChild[];


    public static createFromObject(data:{
        name:string,
        isEmpty?:boolean,
        absolutePath?:string
        relativePath?:string
        children?:DirectoryChild[]
    }):DirectoryModel {

        return Object.assign(new DirectoryModel(), data);
    }

    public addChild(child:DirectoryChild):void {
        this.children.push(child);
    }

    public setChildren(children:DirectoryChild[]):void {
        this.children = children;
    }

    public hasContent():boolean {
        return this.isEmpty;
    }

    public getChildren():DirectoryChild[] {
        return this.children;
    }
}
