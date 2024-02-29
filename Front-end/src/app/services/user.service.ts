import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  registration(data:any){
    return this.httpClient.post(`${this.url}/user/registration`, data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  forgotPassword(data:any){
    return this.httpClient.post(`${this.url}/user/forgotPassword`, data, {
        headers: new HttpHeaders().set('Content-Type', "application/json")
      })
  }

  login(data:any){
    return this.httpClient.post(`${this.url}/user/login`, data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  checkToken(){
    return this.httpClient.get(`${this.url}/user/checkToken`)
  }

  changePassword(data:any){
    return this.httpClient.post(`${this.url}/user/changePassword`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getByUserEmail(){
    return this.httpClient.get(`${this.url}/user/getByUserEmail`);
  }

  updateUser(userData: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.url}/user/updateUserData`, userData);
  }
}
