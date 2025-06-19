import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
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

    viewTable(table: string): void {
        const route = `/${table.toLowerCase()}`;
        this.router.navigate([route]);
    }

    deleteTable(table: string): void {
        if (confirm(`Es-tu sûr de vouloir supprimer '${table}' ?`)) {
            this.service.deleteTable(table).subscribe(
                (response) => {
                    console.log('Table supprimée:', response);
                    this.tables = this.tables.filter(t => t !== table);
                    delete this.dataMap[table];
                    alert(`Table ${table} supprimée avec succès !`);
                },
                (error) => {
                    console.error('Erreur lors de la suppression de la table:', error);
                    alert(`Erreur lors de la suppression de la table '${table}'`);
                }
            );
        }
    }
}
