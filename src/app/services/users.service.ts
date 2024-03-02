import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, map, Observable, of } from "rxjs";
import { ApiResponse, User } from "./users.model";

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor(private client: HttpClient) {}

    static errorHandler<T>(error: unknown): T {
        const response = { success: false, message: "An error occurred", data: null };
        if (error instanceof HttpErrorResponse) {
            response["message"] = error.statusText;
        }
        return response as T;
    }

    getAllUsers(filter: { [key: string]: string }): Observable<ApiResponse<Array<User>>> {
        return this.client.get<Array<User>>(environment.url, { params: filter }).pipe(
            map((data) => ({ message: "Success", success: true, data })),
            catchError((err) => of(UsersService.errorHandler<ApiResponse<Array<User>>>(err)))
        );
    }

    addUser(data: object): Observable<ApiResponse<User>> {
        return this.client.post<User>(environment.url, data).pipe(
            map((data) => ({ message: "Success", success: true, data })),
            catchError((err) => of(UsersService.errorHandler<ApiResponse<User>>(err)))
        );
    }

    getUser(userID: number): Observable<ApiResponse<User>> {
        return this.client.get<User>(`${environment.url}/${userID}`).pipe(
            map((data) => ({ message: "Success", success: true, data })),
            catchError((err) => of(UsersService.errorHandler<ApiResponse<User>>(err)))
        );
    }
}
