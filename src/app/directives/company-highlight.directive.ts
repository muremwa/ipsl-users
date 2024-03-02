import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[companyHighlight]',
    standalone: true
})
export class CompanyHighlightDirective implements OnInit {
    @Input("companyHighlight") companyName = "";

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        if (!this.companyName) {
            this.el.nativeElement.classList.add("company-highlight")
        }
    }
}
