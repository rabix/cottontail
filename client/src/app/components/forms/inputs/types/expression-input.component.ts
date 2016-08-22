import {Component, Input} from "@angular/core";
import {FormControl, REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES} from "@angular/forms";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EventHubService} from "../../../../services/event-hub/event-hub.service";
import {OpenExpressionEditor} from "../../../../action-events/index";

require("./expression-input.component.scss");

@Component({
    selector: 'expression-input',
    directives: [
        REACTIVE_FORM_DIRECTIVES,
        FORM_DIRECTIVES
    ],
    template: `
            <div class="input-group expression-input-group">
                <input class="form-control" [formControl]="inputControl"/>
                    
                <span class="input-group-addon add-expression">
                    <button type="button" 
                        class="btn btn-secondary expression-form-btn" 
                        (click)="openExpressionSidebar()">Add expression</button>
                </span>
            </div>
        `
})
export class ExpressionInputComponent {

    /** The form control passed from the parent */
    @Input()
    public inputControl: FormControl;

    constructor(private eventHubService: EventHubService) { }

    private openExpressionSidebar(): void {
        //TODO(mate): change to observable
        const expressionStream: BehaviorSubject<string> = new BehaviorSubject<string>(this.inputControl.value);

        expressionStream.subscribe(expression => {
            this.inputControl.updateValue(expression, {
                onlySelf: false,
                emitEvent: true
            })
        });

        this.eventHubService.publish(new OpenExpressionEditor(expressionStream));
    }
}
