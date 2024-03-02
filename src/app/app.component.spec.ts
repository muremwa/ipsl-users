import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent, RouterTestingModule],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        app.ngOnInit();

        const router = TestBed.inject(Router);
        const fakePromise = new Promise<boolean>((resolve, _) => resolve(true));
        const navSpy = spyOn(router, 'navigate');
        navSpy.and.returnValue(fakePromise);

        app.search = "generic";
        app.searchItem();
        app.clearSearch();
        expect(app).toBeTruthy();

        app.isNavCollapsed = false;
        app.collapseNav(null);
        expect(app.isNavCollapsed).toBeTrue();
    });
});
