import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup;
  incorrectOldPasswordError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router : Router) { }

    ngOnInit(): void {
      this.changePasswordForm = this.formBuilder.group({
        antigaSenha: [null, [Validators.required]],
        novaSenha: [null, [Validators.required]],
        confirmarSenha: [null, [Validators.required]]
      });
    }

    areAllFieldsValid(): boolean {
      const controls = this.changePasswordForm.controls;
      for (const controlName in controls) {
        if (controls.hasOwnProperty(controlName)) {
          if (controls[controlName].invalid) {
            return false;
          }
        }
      }
      return true;
    }

    onSubmit() {
      if (this.changePasswordForm.get('novaSenha')?.value === this.changePasswordForm.get('confirmarSenha')?.value &&
          this.changePasswordForm.get('novaSenha')?.value !== this.changePasswordForm.get('antigaSenha')) {

        this.incorrectOldPasswordError = false;
        const changePasswordData = {
          antigaSenha: this.changePasswordForm.get('antigaSenha')?.value,
          novaSenha: this.changePasswordForm.get('novaSenha')?.value
        };
        this.userService.changePassword(changePasswordData).subscribe(
          (response: any) => {
            if (response && response.message === 'Senha atualizada com sucesso') {
              this.toastr.success('Sua senha foi alterada com sucesso', 'Sucesso');
              this.router.navigate(['/car-stock']);
            } else {
              this.toastr.error('Não foi possível alterar sua senha.', 'Erro');
            }
          },
          (error: any) => {
            if (error === 'Senha antiga incorreta') {
              this.incorrectOldPasswordError = true;
            } else {
              this.toastr.error('Sua senha antiga está incorreta.', 'Erro');
            }
          }
        );
      } else {
        this.changePasswordForm.get('confirmarSenha')?.setErrors({ passwordMismatch: true });
      }
    }
  }
