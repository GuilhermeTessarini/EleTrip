import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarCrudService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // addCarCrud(data: any) {
  //   return this.httpClient.post(`${this.url}/car/add`, data, {
  //     headers: new HttpHeaders().set('Content-Type', "application/json")
  //   });
  // }

  addCarCrud(data: FormData) {
    return this.httpClient.post(`${this.url}/car/add`, data);
  }

  getCarCrud() {
    return this.httpClient.get(`${this.url}/car/get`);
  }

  getCarCrudTrue() {
    return this.httpClient.get(`${this.url}/car/getTrue`);
  }

  updateCarCrud(formData: FormData) {
    return this.httpClient.patch(`${this.url}/car/update`, formData)
  }

  deleteCarCrud(id: number) {
    return this.httpClient.delete(`${this.url}/car/delete/${id}`, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  updateStatus(data: any) {
    return this.httpClient.patch(`${this.url}/car/updateStatus`, data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  getCarByBody(id: number) {
    return this.httpClient.get(`${this.url}/car/getByCarBody/${id}`);
  }

  getById(id: number) {
    return this.httpClient.get(`${this.url}/car/getById/${id}`);
  }

}
