import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ApiResponse } from "./users.model";
import { of, throwError } from "rxjs";

describe('UsersService', () => {
    let service: UsersService;
    let httpClient: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(UsersService);
        httpClient = TestBed.inject(HttpClient);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should manage errors', () => {
        expect(UsersService.errorHandler({})).toEqual({ data: null, success: false, message: "An error occurred" });

        const err = new HttpErrorResponse({ statusText: "BAD REQUEST", error: {} });
        expect(UsersService.errorHandler<ApiResponse<string>>(err).message).toEqual("BAD REQUEST");
    });

    it("should get all users", (done) => {
        const getSpy = spyOn(httpClient, 'get');
        getSpy.and.callFake((url: string) => {
            const errorResponse = new HttpErrorResponse({
                url,
                error: { message: "NotFound" },
                status: 404,
                statusText: 'Not Found',
            });
            return throwError(() => errorResponse);
        });
        service.getAllUsers({}).subscribe(
            (data) => {
                expect(data.success).toBeFalse();
                expect(data.message).toEqual("Not Found");
            }
        );

        getSpy.and.returnValue(of([]));
        service.getAllUsers({}).subscribe(
            (data) => {
                expect(data.success).toBeTrue();
                expect(data.data).toEqual([]);
            }
        );
        done();
    });

    it("should get one users", (done) => {
        const getSpy = spyOn(httpClient, 'get');
        getSpy.and.callFake((url: string) => {
            const errorResponse = new HttpErrorResponse({
                url,
                error: { message: "NotFound" },
                status: 404,
                statusText: 'Not Found',
            });
            return throwError(() => errorResponse);
        });
        service.getUser(18).subscribe(
            (data) => {
                expect(data.success).toBeFalse();
                expect(data.message).toEqual("Not Found");
            }
        );

        getSpy.and.returnValue(of({}));
        service.getUser(19).subscribe(
            (data) => {
                expect(data.success).toBeTrue();
            }
        );
        done();
    });

    it("should add a user", (done) => {
        const postSpy = spyOn(httpClient, 'post');
        postSpy.and.callFake((url: string) => {
            const errorResponse = new HttpErrorResponse({
                url,
                error: { message: "CANT_SAVE" },
                status: 400,
                statusText: 'Could not save',
            });
            return throwError(() => errorResponse);
        });
        service.addUser({}).subscribe(
            (data) => {
                expect(data.success).toBeFalse();
                expect(data.message).toEqual("Could not save");
            }
        );

        postSpy.and.returnValue(of({}));
        service.addUser({}).subscribe(
            (data) => {
                expect(data.success).toBeTrue();
            }
        );
        done();
    });
});
