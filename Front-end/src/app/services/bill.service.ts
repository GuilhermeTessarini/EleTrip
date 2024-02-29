import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  generateReport(data: any){
    return this.httpClient.post(`${this.url}/bill/generateReport`, data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  getPDF(data: any):Observable<Blob>{
    return this.httpClient.post(`${this.url}/bill/getPdf`, data, {responseType:'blob'});
  }

  getBillsByEmail(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/bill/getBillsByEmail`);
  }

  atualizarStatusFatura(idFatura: number, novoStatus: string): Observable<any> {
    const body = { status: novoStatus, idFatura };
    return this.httpClient.patch(`${this.url}/bill/updateStatus`, body);
  }
}
