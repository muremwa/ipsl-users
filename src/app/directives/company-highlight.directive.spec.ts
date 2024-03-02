import { CompanyHighlightDirective } from './company-highlight.directive';
import { ElementRef } from "@angular/core";

describe('CompanyHighlightDirective', () => {
    it('should create an instance', () => {
        const d = new CompanyHighlightDirective(
            new ElementRef<any>(document.createElement("div"))
        );
        expect(d).toBeTruthy();
        d.ngOnInit();
    });
});
