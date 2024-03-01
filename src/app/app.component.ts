import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgbCollapse } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NgbCollapse, RouterLink, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    isNavCollapsed = true;
    search: string = "";

    constructor(public router: Router) {}

    searchItem() {
        this.router.navigate(["/"], {
            queryParams: { search: this.search? this.search: null, page: 1 },
            queryParamsHandling: 'merge'
        }).then((_) => void 0);
    }

    clearSearch() {
        this.search = "";
        this.searchItem();
    }
}
