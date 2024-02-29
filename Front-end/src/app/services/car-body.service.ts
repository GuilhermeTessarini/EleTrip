import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarBodyService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  addCarBody(data:any){
    return this.httpClient.post(`${this.url}/carBody/add`, data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  updateCarBody(data:any){
    return this.httpClient.patch(`${this.url}/carBody/update`, data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  getCarBody(){
    return this.httpClient.get(`${this.url}/carBody/get`);
  }

  deleteCarBody(id: number) {
    return this.httpClient.delete(`${this.url}/carBody/delete/${id}`, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
