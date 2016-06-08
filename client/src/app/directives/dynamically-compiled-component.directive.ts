import {
    ComponentFactory,
    ComponentRef
    Directive,
    Injector,
    Input,
    OnInit,
    ViewContainerRef,
} from "@angular/core";

export interface ModalFunctionsInterface {
    cancel: Function,
    confirm: Function
}

@Directive({
    selector: "[dynamicallyCompiled]",
})
export class DynamicallyCompiledComponentDirective implements OnInit {
    private cref: ComponentRef;
    private result: any;

    @Input() model: any;
    @Input() dynamicallyCompiled: ComponentFactory<any>;

    @Input() injector: Injector;
    @Input() modalFunctions: ModalFunctionsInterface;

    constructor(private viewContainer: ViewContainerRef) {
    }

    ngOnInit() {
        this.viewContainer.clear();


        let component   = this.viewContainer.createComponent(this.dynamicallyCompiled, null, this.injector).instance;
        component.model = this.model;

        this.cref   = this.model.cref ? this.model.cref : null;
        this.result = this.model.result ? this.model.result : null;

        if (this.modalFunctions) {
            component.confirm = this.modalFunctions.confirm.bind(this);
            component.cancel  = this.modalFunctions.cancel.bind(this);
        }
    }
}
