import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegistrationPart1Component } from './views/registration/registration.component';
import { PasswordRecoveryComponent } from './views/password-recovery/password-recovery.component';
import { CarStockComponent } from './views/car-stock/car-stock.component';
import { CarInfoComponent } from './views/car-info/car-info.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { RouterGuardService } from './services/router-guard.service';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { CarBodyComponent } from './views/car-body/car-body.component';
import { CarCrudComponent } from './views/car-crud/car-crud.component';
import { OverviewComponent } from './views/overview/overview.component';
import { BillingManagementComponent } from './views/billing-management/billing-management.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationPart1Component },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  {
    path: 'changePassword', component: ChangePasswordComponent,
    canActivate: [RouterGuardService],
    data: { expectedRole: ['admin', 'user'] },
  },
  {
    path: 'car-stock', component: CarStockComponent,
    canActivate: [RouterGuardService],
    data: { expectedRole: ['admin', 'user'] },
  },
  {
    path: 'car-info/:id', component: CarInfoComponent,
    canActivate: [RouterGuardService],
    data: { expectedRole: ['admin', 'user'] },
  },
  {
    path: 'perfil', component: PerfilComponent,
    canActivate: [RouterGuardService],
    data: { expectedRole: ['admin', 'user'] },
  },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [RouterGuardService],
    data: { expectedRole: ['admin'] },
  },
  {
    path: 'car-body', component: CarBodyComponent,
    canActivate: [RouterGuardService],
    data: { expectedRole: ['admin'] },
  },
  {
    path: 'car-crud', component: CarCrudComponent,
    canActivate: [RouterGuardService],
    data: { expectedRole: ['admin'] },
  },
  { path: 'billing-management', component: BillingManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
