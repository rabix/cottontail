import {Injectable} from "@angular/core";
import {SocketService} from "./socket.service";
import {SOCKET_REQUESTS} from "./socket-events";
import {FilePath, HttpError} from "./api-response-types";
import {Observable} from "rxjs/Rx";
import {DirectoryChild, DirectoryModel, FileModel} from "../../store/models/fs.models";

@Injectable()
export class FileApi {

    constructor(private socket: SocketService) {
    }

    /**
     * Fetch remote directory content
     */
    getDirContent(path = ""):Observable<DirectoryChild[]> {
        return this.socket.request(SOCKET_REQUESTS.DIR_CONTENT, {dir: path}).map(resp => resp.content);
    }

    getFileContent(path: string): Observable<FilePath|HttpError> {
        return this.socket.request(SOCKET_REQUESTS.FILE_CONTENT, {
            file: path
        }).map(response => response.content).catch(err => {
            console.error(err);
            //noinspection TypeScriptUnresolvedFunction
            return Observable.of(err);
        })
    }

    createFile(path: string, content?: string): Observable<FilePath|HttpError> {
        return this.socket.request(SOCKET_REQUESTS.CREATE_FILE, {
            file: path,
            content: content || ''
        }).map(response => response.content).catch(err => {
            console.log(err);
            //noinspection TypeScriptUnresolvedFunction
            return Observable.of(err);
        })
    }

    updateFile(path: string, content: string): Observable<boolean|HttpError> {
        return this.socket.request(SOCKET_REQUESTS.UPDATE_FILE, {
            file: path,
            content: content
        }).map(response => response.content).catch(err => {
            console.error(err);
            //noinspection TypeScriptUnresolvedFunction
            return Observable.of(err);
        })
    }

    checkIfFileExists(path: string): Observable<boolean|HttpError> {
        return this.socket.request(SOCKET_REQUESTS.FILE_EXISTS, {
            path: path
        }).map(response => {
            return response.content
        }).catch(err => {
            console.log(err);
            //noinspection TypeScriptUnresolvedFunction
            return Observable.of(err);
        })
    }
}
