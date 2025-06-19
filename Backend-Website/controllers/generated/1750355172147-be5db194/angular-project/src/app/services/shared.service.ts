import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {}

    getUsers() {
        return this.http.get(`${this.apiUrl}/getall`);
    }

    getTableData(table: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getall/${table}`);
    }

    getItemById(table: string, id: string) {
        return this.http.get(`${this.apiUrl}/${table}/${id}`);
    }

    updateItemById(table: string, id: string, data: any) {
        return this.http.put(`${this.apiUrl}/update/${table}/${id}`, data);
    }

    deleteItem(table: string, id: string) {
        return this.http.delete(`http://localhost:3000/api/delete/${table}/${id}`);
    }

    deleteTable(table: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${table}`);
    }
}
