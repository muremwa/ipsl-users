import { Component, OnInit, TemplateRef } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { User } from "../../services/users.model";
import { environment } from "../../../environments/environment";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Params, Router, RouterLink } from "@angular/router";
import {
    FormControl,
    FormGroup,
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { skip } from "rxjs";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { checkItemIsDigit } from "../../utils/utils";
import { CompanyHighlightDirective } from "../../directives/company-highlight.directive";

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        NgOptimizedImage,
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        CompanyHighlightDirective,
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
    modalRef: NgbModalRef;
    userForm = new FormGroup({
        name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
        username: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
        email: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.email] }),
        phone: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
        website: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
        address: new FormGroup({
            street: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
            suite: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
            city: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
            zipcode: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
            geo: new FormGroup({
                lat: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
                lng: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
            })
        }),
        company: new FormGroup({
            name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
            catchPhrase: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
            bs: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
        })
    });

    constructor(private service: UsersService, private toaster: ToastrService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit(): void {
        // initial page load
        this.processInitialParams(this.route.snapshot.queryParams);

        // subsequent query params
        this.route.queryParams.pipe(skip(1)).subscribe(this.processSubsequentParams.bind(this));
    }

    processInitialParams(params: Params) {
        if (params.hasOwnProperty('search')) {
            this.searchParams = this.generateSearchParams(params['search']);
        }
        this.pageDetails = {
            max: 1,
            size: checkItemIsDigit(params['size'], 3),
            pageNumber: checkItemIsDigit(params['page'], 1)
        };
        this.pageDetails.max = Math.ceil(this.totalItems / this.pageDetails.size);
        this.fetchUsers(this.searchParams);
    }

    processSubsequentParams(params: Params) {
        if (params.hasOwnProperty("search")) {
            this.searchParams = this.generateSearchParams(params["search"]);
        } else {
            this.searchParams = {};
        }

        if (params.hasOwnProperty("page")) {
            this.pageDetails.pageNumber = checkItemIsDigit(params["page"], 1);
        }

        if (params.hasOwnProperty("size")) {
            this.pageDetails.size = checkItemIsDigit(params["size"], 3);
            this.pageDetails.max = Math.ceil(this.totalItems / this.pageDetails.size);
        }
        this.fetchUsers(this.searchParams);
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

                    // hack to show company name highlight
                    if (this.users.length === this.pageDetails.size) {
                        this.users[Math.floor(Math.random() * (this.pageDetails.size - 1))].company.name = "";
                    }
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

    openModal(ref: TemplateRef<void>) {
        this.modalRef = this.modalService.open(ref, { size: "xl" });
    }

    assertControlInValidity(control: FormControl, form: FormGroupDirective): boolean {
        return (control.dirty && control.invalid) || (form.submitted && control.invalid);
    }

    saveUser() {
        if (this.userForm.valid) {
            this.loadingDetails.isSaving = true;
            this.service.addUser(this.userForm.value).subscribe(
                (data) => {
                    if (data.success) {
                        this.users.pop();
                        this.users.unshift(data.data);
                        this.toaster.success(`Added user: ${data.data.username}`);
                        this.modalRef.close();
                    } else {
                        this.toaster.error(`Could not save user: ${data.message}`);
                    }
                    this.loadingDetails.isSaving = false;
                }
            );
        } else {
            this.toaster.error("Form details are not valid");
        }
    }
}
