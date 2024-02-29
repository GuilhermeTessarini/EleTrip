import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  @ViewChild('burgerMenu') burgerMenu!: ElementRef;
  @ViewChild('mobileMenu') mobileMenu!: ElementRef;

  constructor(private title: Title,
              private meta: Meta,
              private router: Router,
              private userService: UserService,
              private renderer: Renderer2
              ) {

    this.title.setTitle('EleTrip')
    this.meta.addTags([
      {
        property: 'og:title',
        content: 'EleTrip',
      },
    ])
  }
  ngOnInit(): void {
    if(localStorage.getItem('token') != null) {
      this.userService.checkToken().subscribe((response:any)=>{
        this.router.navigate(['/car-stock']);
      }, (error:any)=>{
        console.log(error);
      })
    }
  }

  onBurgerMenuClick() {
    const mobileMenu = document.querySelector('.pgina-inicial-mobile-menu') as HTMLDivElement;

    if (mobileMenu) {
      mobileMenu.style.display = 'block';
    } else {
      console.error('Elemento do menu móvel não encontrado.');
    }
  }

  onCloseMobileMenuClick() {
    const mobileMenu = document.querySelector('.pgina-inicial-mobile-menu') as HTMLDivElement;

    if (mobileMenu) {
      mobileMenu.style.display = 'none';
    } else {
      console.error('Elemento do menu móvel não encontrado.');
    }
  }
}
