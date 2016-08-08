import {Component, Input, OnInit} from "@angular/core";
import {Validators, FormBuilder, FormGroup, REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES} from "@angular/forms";
import {ExpressionInputComponent} from "../types/expression-input.component";

require("./form.components.scss");

@Component({
    selector: 'base-command-form',
    directives: [
        ExpressionInputComponent,
        REACTIVE_FORM_DIRECTIVES,
        FORM_DIRECTIVES
    ],
    template: `
             <form [formGroup]="baseCommandForm">
                <fieldset class="form-group">
                      <button type="button" class="btn btn-secondary hide-btn">Hide</button>
               
                        <label>Base Command</label>
                        <label class="secondary-label">What command do you want to call from the image</label>
                        
                        <expression-input [inputControl]="baseCommandForm.controls['baseCommand']"
                                            [expression]="baseCommand">
                        </expression-input>
                    <button type="button" class="btn btn-secondary expression-form-btn">Add base command</button>
                </fieldset>
             </form>
    `
})
export class BaseCommandFormComponent implements OnInit {
    @Input()
    private baseCommand: string;

    /** The parent forms group */
    @Input()
    private group: FormGroup;

    private baseCommandForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.baseCommandForm = this.formBuilder.group({
            baseCommand: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
        });
    }

    ngOnInit(): void {
        this.group.addControl('baseCommand', this.baseCommandForm.controls['baseCommand']);
    }
}