import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { User } from "../../services/users.model";
import { UsersService } from "../../services/users.service";
import { checkItemIsDigit } from "../../utils/utils";

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [],
    templateUrl: './user-detail.component.html',
    styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
    user: User | null = null;
    isFetchingUser = false;

    constructor(private route: ActivatedRoute, private toaster: ToastrService, private service: UsersService) {}

    ngOnInit(): void {
        this.getUser(checkItemIsDigit(this.route.snapshot.paramMap.get("userID")!, -1));
    }

    getUser(userID: number) {
        if (userID > -1) {
            this.isFetchingUser = true;
            this.service.getUser(userID).subscribe(
                (data) => {
                    if (data.success) {
                        this.user = data.data;
                    } else {
                        this.toaster.error(`Could not fetch user: ${data.message}`);
                    }
                    this.isFetchingUser = false;
                }
            );
        }
    }
}
