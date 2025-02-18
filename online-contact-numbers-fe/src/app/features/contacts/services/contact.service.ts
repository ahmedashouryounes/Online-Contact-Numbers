import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;
  newChanges = new Subject();
  
  constructor(
    private http: HttpClient,
  ) { }

  getContacts(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get(`${this.apiUrl}/contacts`, { params });
  }


  AddContact(contact: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacts`, contact);
  }

  getContactById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts/${id}`);
  }

  updateContact(id: string, contact: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/contacts/${id}`, contact);
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contacts/${id}`);
  }

  lockContact(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacts/${id}/lock`, {});
  }

  unlockContact(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacts/${id}/unlock`, {});
  }
}