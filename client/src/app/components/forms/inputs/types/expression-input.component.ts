import {Component, Input} from "@angular/core";
import {FormControl, REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES} from "@angular/forms";
import {GuiEditorService} from "../../../gui-editor/shared/gui-editor.service";
import {ShowSidebarEvent} from "../../../gui-editor/shared/gui-editor.events";

require("./expression-input.component.scss");

@Component({
    selector: 'expression-input',
    directives: [
        REACTIVE_FORM_DIRECTIVES,
        FORM_DIRECTIVES
    ],
    template: `
            <div class="input-group expression-input-group">
                <input name="expression"
                    type="text" 
                    class="form-control"
                    [formControl]="inputControl"
                    [(ngModel)]="expression">
                    
                <span class="input-group-addon add-expression">
                    <button type="button" 
                        class="btn btn-secondary expression-form-btn" 
                        (click)="openExpressionSidebar()">Add expression</button>
                </span>
            </div>
        `
})
export class ExpressionInputComponent {
    @Input()
    private expression: string;

    /** The form control passed from the parent */
    @Input()
    private inputControl: FormControl;

    constructor(private guiEditorService: GuiEditorService) { }

    openExpressionSidebar() {
        let showSidebarEvent: ShowSidebarEvent = {
            data: {
                sidebarType: "expression"
            }
        };

        this.guiEditorService.publishSidebarEvent(showSidebarEvent);
    }
}