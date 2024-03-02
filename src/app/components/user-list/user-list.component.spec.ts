import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService } from "ngx-toastr";
import { UsersService } from "../../services/users.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { of } from "rxjs";
import { User } from "../../services/users.model";
import { TemplateRef } from "@angular/core";
import { Router } from "@angular/router";

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;
    let toasterSpy: jasmine.SpyObj<ToastrService>;
    let serviceSpy: jasmine.SpyObj<UsersService>;
    let modalService: jasmine.SpyObj<NgbModal>;

    beforeEach(async () => {
        toasterSpy = jasmine.createSpyObj('ToastrService', ['error', 'success']);
        serviceSpy = jasmine.createSpyObj('UsersService', ['addUser', 'getAllUsers']);
        modalService = jasmine.createSpyObj('NgbModal', ['open']);
        serviceSpy.getAllUsers.and.returnValue(of({ data: [], message: "", success: true }));

        await TestBed.configureTestingModule({
            imports: [UserListComponent, RouterTestingModule],
            providers: [
                { provide: ToastrService, useValue: toasterSpy },
                { provide: UsersService, useValue: serviceSpy },
                { provide: NgbModal, useValue: modalService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should process initial params', () => {
        component.processInitialParams({});
        expect(component.pageDetails).toEqual({ size: 3, pageNumber: 1, max: 0 });

        component.processInitialParams({ search: 'generic', page: 2, size: 10 });
        expect(component.pageDetails.pageNumber).toEqual(2);
        expect(component.pageDetails.size).toEqual(10);
        expect(component.searchParams).toEqual({ name: 'generic' });
    });

    it('should process subsequent params', () => {
        component.processSubsequentParams({});
        expect(component.pageDetails).toEqual({ size: 3, pageNumber: 1, max: 0 });

        component.processSubsequentParams({ search: 'generic', page: 2, size: 10 });
        expect(component.pageDetails.pageNumber).toEqual(2);
        expect(component.pageDetails.size).toEqual(10);
        expect(component.searchParams).toEqual({ name: 'generic' });
    });

    it('should generate search params', () => {
        expect(component.generateSearchParams("")).toEqual({});
        expect(component.generateSearchParams("generic")).toEqual({ name: 'generic' });
        expect(component.generateSearchParams("generic@ask.com")).toEqual({ email: 'generic@ask.com' });
    });

    it("should fetch users", (done) => {
        serviceSpy.getAllUsers.and.returnValue(of({ data: [], message: 'Error', success: false }));
        component.fetchUsers({});
        expect(toasterSpy.error).toHaveBeenCalledWith("Could not load users: Error");

        component.pageDetails.size = 1;
        serviceSpy.getAllUsers.and.returnValue(of({ data: [{ company: {}} as User], message: 'Success', success: true }));
        component.fetchUsers({});
        expect(component.users.length).toEqual(1);
        done();
    });

    it('should generate pages', () => {
        component.totalItems = 10;
        expect(component.generatePages()).toEqual([
            { page: 1, value: 1 },
            { page: 2, value: 2 },
            { page: 3, value: 3 },
            { page: 4, value: 4 }
        ]);
    });

    it('should assert validity', () => {
        // Invalid but not dirty
        expect(
            component.assertControlInValidity(
                jasmine.createSpyObj("formControl", [], { invalid: true, dirty: false }),
                jasmine.createSpyObj("formGroupDirective", [], { submitted: false })
            )
        ).toBeFalse();

        // Invalid and dirty
        expect(
            component.assertControlInValidity(
                jasmine.createSpyObj("formControl", [], { invalid: true, dirty: true }),
                jasmine.createSpyObj("formGroupDirective", [], { submitted: false })
            )
        ).toBeTrue();

        // Valid and not dirty
        expect(
            component.assertControlInValidity(
                jasmine.createSpyObj("formControl", [], { invalid: false, dirty: false }),
                jasmine.createSpyObj("formGroupDirective", [], { submitted: false })
            )
        ).toBeFalse();

        // Valid but dirty
        expect(
            component.assertControlInValidity(
                jasmine.createSpyObj("formControl", [], { invalid: false, dirty: true }),
                jasmine.createSpyObj("formGroupDirective", [], { submitted: false })
            )
        ).toBeFalse();

        // Invalid, not touched but submitted
        expect(
            component.assertControlInValidity(
                jasmine.createSpyObj("formControl", [], { invalid: true, dirty: false }),
                jasmine.createSpyObj("formGroupDirective", [], { submitted: true })
            )
        ).toBeTrue();
    });

    it('should open modal', () => {
        modalService.open.and.returnValue(jasmine.createSpyObj('', ['close']));
        component.openModal({} as TemplateRef<void>)
        expect(component.modalRef).toBeTruthy();
    });

    it("should change page", () => {
        const router = TestBed.inject(Router);
        const fakePromise = new Promise<boolean>((resolve, _) => resolve(true));
        const navSpy = spyOn(router, 'navigate');
        navSpy.and.returnValue(fakePromise);

        component.changePageSize();
        expect(component).toBeTruthy();
    });

    it("should save user", () => {
        component.modalRef = jasmine.createSpyObj('', ['close']);
        component.saveUser();
        expect(toasterSpy.error).toHaveBeenCalledWith("Form details are not valid");
        const userDetails = {
            name: 'name',
            username: 'username',
            website: 'wwe.com',
            phone: "1234889",
            email: "test@ask.com",
            address: {
                street: "street",
                suite: "suite",
                city: "city",
                zipcode: "1234",
                geo: { lat: "22", lng: "23" }
            },
            company: {
                name: "company_name",
                catchPhrase: "phrase",
                bs: "statement"
            }
        }
        serviceSpy.addUser.and.returnValue(of({ success: false, data: null as any, message: "Error" }));
        component.userForm.setValue(userDetails);
        component.saveUser();
        expect(toasterSpy.error).toHaveBeenCalledWith("Could not save user: Error");

        serviceSpy.addUser.and.returnValue(of({ success: true, data: { id: 12, ...userDetails }, message: "Success" }));
        component.userForm.setValue(userDetails);
        component.saveUser();
        expect(toasterSpy.success).toHaveBeenCalledWith("Added user: username");
        expect(component.users[0].id).toEqual(12);
    });
});
