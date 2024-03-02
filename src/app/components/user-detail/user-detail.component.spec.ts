import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailComponent } from './user-detail.component';
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService } from "ngx-toastr";
import { UsersService } from "../../services/users.service";
import { of } from "rxjs";
import { User } from "../../services/users.model";

describe('UserDetailComponent', () => {
    let component: UserDetailComponent;
    let fixture: ComponentFixture<UserDetailComponent>;
    let toasterSpy: jasmine.SpyObj<ToastrService>;
    let serviceSpy: jasmine.SpyObj<UsersService>;

    beforeEach(async () => {
        toasterSpy = jasmine.createSpyObj('ToastrService', ['error']);
        serviceSpy = jasmine.createSpyObj('UsersService', ['getUser']);

        await TestBed.configureTestingModule({
            imports: [UserDetailComponent, RouterTestingModule],
            providers: [
                { provide: ToastrService, useValue: toasterSpy },
                { provide: UsersService, useValue: serviceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should get user", () => {
        component.getUser(-1);
        expect(component.user).toBeNull();

        serviceSpy.getUser.and.returnValue(of({ message: "Error", data: null as any, success: false }));
        component.getUser(1);
        expect(toasterSpy.error).toHaveBeenCalledWith("Could not fetch user: Error");

        serviceSpy.getUser.and.returnValue(of({ message: "Success", data: {} as User, success: true }));
        component.getUser(1);
        expect(component.user).toBeTruthy();
    });
});
