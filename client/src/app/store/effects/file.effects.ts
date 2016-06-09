import {Effect, StateUpdates, StateUpdate} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import * as Actions from "../actions";
import {FileApi} from "../../services/api/file.api";

@Injectable()
export class FileEffects {
    constructor(private files:FileApi,
                private updates$:StateUpdates<StateUpdate>) {
    }

    @Effect()
    public directoryContent$ = this.updates$
        .whenAction(Actions.REQUEST_DIRECTORY_CONTENT)
        .map((update:StateUpdate<StateUpdate>) => update.action.payload)
        .switchMap(path => this.files.getDirContent(path).map(content => ({content, path})))
        .map(content => ({
            type: Actions.DIRECTORY_CONTENT_UPDATE,
            payload: content
        }));
}
