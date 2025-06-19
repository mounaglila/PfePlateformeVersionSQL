import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class usersComponent implements OnInit {
    tables: string[] = [];
    dataMap: any = {};

    constructor(private service: SharedService, private router: Router) {}

    ngOnInit(): void {
        this.service.getUsers().subscribe(data => {
            console.log("Données reçues:", data);
            if (data && typeof data === "object") {
                this.tables = Object.keys(data);
                this.dataMap = data;
            } else {
                this.tables = [];
                this.dataMap = {};
            }
        });
    }

    getColumns(table: string): string[] {
        return this.dataMap[table] && this.dataMap[table].length > 0
            ? Object.keys(this.dataMap[table][0]) : [];
    }

    getValues(row: any): any[] {
        return Object.values(row);
    }

    viewusers(users: any): void {
        console.log('View users:', users);
        alert(`Viewing users: ${JSON.stringify(users, null, 2)}`);
    }

    updateusers(users: any): void {
        this.router.navigate(['/update', 'users', users._id]);
    }

    deleteusers(usersId: string): void {
        console.log('Delete users ID:', usersId);
        this.service.deleteItem('users', usersId).subscribe(
            response => {
                console.log('users deleted successfully', response);
                this.dataMap['users'] = this.dataMap['users'].filter((users: any) => users._id !== usersId);
                alert('users Deleted!');
            },
            error => {
                console.error('Error deleting users:', error);
                alert('Failed to delete users!');
            }
        );
    }
}
