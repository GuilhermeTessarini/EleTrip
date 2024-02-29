import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {
  forgotPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router : Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      emailUsuario: [null, [Validators.required, Validators.email]],
    })
  }

  onSubmit(){
    var formData = this.forgotPasswordForm.value;
    var data = {
      emailUsuario: formData.emailUsuario
    }
    this.userService.forgotPassword(data).subscribe((response:any) =>{
      if (response){
        this.toastr.success("Sua nova senha é SenhaRecuperada!", "Sucesso")
        this.router.navigate(['/login']);
      } else {
        this.toastr.error("Não foi possivel recuperar a senha. Forneça um email valido.", "Erro");
      }
    })
  }
}
