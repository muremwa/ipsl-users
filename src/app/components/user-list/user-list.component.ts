import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { User } from "../../services/users.model";
import { environment } from "../../../environments/environment";
import { NgOptimizedImage } from "@angular/common";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        NgOptimizedImage,
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
    loadingDetails = { isFetching: false, isSaving: false };
    avatarUrl = environment.avatar;
    users: Array<User> = [];

    constructor(private service: UsersService, private toaster: ToastrService) {}

    ngOnInit(): void {
        this.fetchUsers({});
    }

    fetchUsers(filter:  { [key: string]: string; }) {
        this.users = [];
        this.loadingDetails.isFetching = true;
        this.service.getAllUsers(filter).subscribe(
            (data) => {
                if (data.success) {
                    this.users = data.data;
                } else {
                    this.toaster.error(`Could not load users: ${data.message}`);
                }
                this.loadingDetails.isFetching = false;
            }
        );
    }
}
