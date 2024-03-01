import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { User } from "../../services/users.model";
import { environment } from "../../../environments/environment";
import { NgOptimizedImage } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { skip } from "rxjs";

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        NgOptimizedImage,
        RouterLink,
        FormsModule,
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
    loadingDetails = { isFetching: false, isSaving: false };
    avatarUrl = environment.avatar;
    pageDetails = { size: 3, pageNumber: 1, max: 1 };
    users: Array<User> = [];
    totalItems = 0;
    searchParams: { [key: string]: string } = {};

    constructor(private service: UsersService, private toaster: ToastrService, private route: ActivatedRoute, private router: Router) {}

    static checkItemIsDigit(item: string, fallback: number): number {
        const convertedItem = parseInt(item);
        return isNaN(convertedItem)? fallback: convertedItem;
    }

    ngOnInit(): void {
        // initial page load
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams.hasOwnProperty('search')) {
            this.searchParams = this.generateSearchParams(queryParams['search']);
        }
        this.pageDetails = {
            max: 1,
            size: UserListComponent.checkItemIsDigit(queryParams['size'], 3),
            pageNumber: UserListComponent.checkItemIsDigit(queryParams['page'], 1)
        };
        this.pageDetails.max = Math.ceil(this.pageDetails.size / this.pageDetails.pageNumber);
        this.fetchUsers(this.searchParams);

        this.route.queryParams.pipe(skip(1)).subscribe(
            (data) => {
                // subsequent query params
                if (data.hasOwnProperty("search")) {
                    this.searchParams = this.generateSearchParams(data["search"]);
                } else {
                    this.searchParams = {};
                }

                if (data.hasOwnProperty("page")) {
                    this.pageDetails.pageNumber = UserListComponent.checkItemIsDigit(data["page"], 1);
                }

                if (data.hasOwnProperty("size")) {
                    this.pageDetails.size = UserListComponent.checkItemIsDigit(data["size"], 3);
                    this.pageDetails.max = Math.ceil(this.pageDetails.size / this.pageDetails.pageNumber);
                }
                this.fetchUsers(this.searchParams);
            }
        );
    }

    generateSearchParams(item: string): { [key: string]: string } {
        if (item) {
            if (item.search(/@/g) > -1) {
                return { email: item }
            } else {
                return { name: item }
            }
        }
        return {};
    }

    fetchUsers(filter:  { [key: string]: string; }) {
        this.users = [];
        this.loadingDetails.isFetching = true;
        this.service.getAllUsers(filter).subscribe(
            (data) => {
                if (data.success) {
                    // hack to paginate
                    this.totalItems = data.data.length;
                    const end = this.pageDetails.size * this.pageDetails.pageNumber;
                    const start = end - this.pageDetails.size;
                    this.users = data.data.slice(start, end);
                } else {
                    this.toaster.error(`Could not load users: ${data.message}`);
                }
                this.loadingDetails.isFetching = false;
            }
        );
    }

    generatePages() {
        const pages = Math.ceil(this.totalItems / this.pageDetails.size);
        this.pageDetails.max = pages;
        return Array.from(Array(pages), (_, i) => ({ page: i + 1, value: i + 1 }));
    }

    changePageSize() {
        this.router.navigate([], {
            queryParams: { page: 1, size: this.pageDetails.size },
            queryParamsHandling: 'merge'
        }).then((_) => void 0);
    }
}
