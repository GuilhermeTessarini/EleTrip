import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegistrationPart1Component } from './views/registration/registration.component';
import { PasswordRecoveryComponent } from './views/password-recovery/password-recovery.component';
import { CarStockComponent } from './views/car-stock/car-stock.component';
import { CarInfoComponent } from './views/car-info/car-info.component';
import { GalleryCard } from './shared/components/gallery-card/gallery-card.component';
import { PlaceCard } from './shared/components/place-card/place-card.component';
import { NavigationLinks } from './shared/components/navigation-links/navigation-links.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { FeatureCard41 } from './shared/components/feature-card41/feature-card41.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastNoAnimationModule, ToastrModule, ToastNoAnimation } from 'ngx-toastr';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { TokenInterceptorInterceptor } from './services/token-interceptor.interceptor';
import { DropdownComponent } from './shared/components/dropdown/dropdown.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { CarBodyComponent } from './views/car-body/car-body.component';
import { CarCrudComponent } from './views/car-crud/car-crud.component';
import { SolidButton } from './shared/components/solid-button/solid-button.component';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './views/overview/overview.component';
import { BillingManagementComponent } from './views/billing-management/billing-management.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistrationPart1Component,
    PasswordRecoveryComponent,
    CarStockComponent,
    CarInfoComponent,
    GalleryCard,
    PlaceCard,
    NavigationLinks,
    PerfilComponent,
    FeatureCard41,
    SolidButton,
    DashboardComponent,
    DropdownComponent,
    ChangePasswordComponent,
    CarBodyComponent,
    CarCrudComponent,
    OverviewComponent,
    BillingManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    ToastNoAnimationModule.forRoot({
      timeOut: 8000,
      positionClass: 'toast-top-center',
      preventDuplicates: true
    }),
  ],
  exports:[
    GalleryCard,
    SolidButton,
    PlaceCard,
    NavigationLinks,
    FeatureCard41
  ],
  providers: [HttpClientModule, {provide:HTTP_INTERCEPTORS, useClass:TokenInterceptorInterceptor, multi:true}],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
