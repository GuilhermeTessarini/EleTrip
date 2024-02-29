import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RouterGuardService {

  constructor(public auth: AuthService,
              public router: Router,
              private toastr: ToastrService) {}

  canActivate(route:ActivatedRouteSnapshot):boolean{
    let expectedRoleArray: string[] = route.data['expectedRole'];

    const token:any = localStorage.getItem('token');
    var tokenPayload: any;
    try{
      tokenPayload = jwt_decode(token);
    }catch (err){
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let checkRole = false;

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        checkRole = true;
      }
    }

    if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){

      if(this.auth.isAuthenticated() && checkRole){
        return true;
      }

      this.toastr.error('Você não tem permissão para acessar esta página.', 'Erro');
      this.router.navigate(['/car-stock']);
      return false

    } else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
