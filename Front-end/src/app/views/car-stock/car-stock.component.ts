import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarCrudService } from 'src/app/services/car-crud.service';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-car-stock',
  templateUrl: './car-stock.component.html',
  styleUrls: ['./car-stock.component.css']
})
export class CarStockComponent {

  cars: any[] = [];

  isAdmin: boolean = false;

  constructor(private carCrudService: CarCrudService,
              private router: Router,
              private authService: AuthService) {}

  ngOnInit(): void {
  this.carCrudService.getCarCrudTrue().subscribe((data: any) => {
    this.cars = data;
  });

  this.isAdmin = this.authService.isAdmin();
}

  onGalleryCardClick(idVeiculo: number) {
    this.router.navigate(['/car-info', idVeiculo]);
  }

  onBurgerMenuClick() {
    const mobileMenu = document.querySelector('.estoque-mobile-menu') as HTMLElement;

    if (mobileMenu) {
      mobileMenu.classList.add('mobile-menu-visible');
      mobileMenu.classList.remove('mobile-menu-hidden');
    } else {
      console.error('Elemento do menu móvel não encontrado.');
    }
  }

  onCloseMobileMenuClick() {
    const mobileMenu = document.querySelector('.estoque-mobile-menu') as HTMLElement;

    if (mobileMenu) {
      mobileMenu.classList.remove('mobile-menu-visible');
      mobileMenu.classList.add('mobile-menu-hidden');
    } else {
      console.error('Elemento do menu móvel não encontrado.');
    }
  }
}
