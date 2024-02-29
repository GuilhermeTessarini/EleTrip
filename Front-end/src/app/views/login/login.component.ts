import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: any;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailUsuario: [null, [Validators.required, Validators.email]],
      senhaUsuario: [null, [Validators.required, Validators.minLength(8)]],
    })
  }

  onSubmit() {
    var formData = this.loginForm.value;
    var data = {
      emailUsuario: formData.emailUsuario,
      senhaUsuario: formData.senhaUsuario
    }
    this.userService.login(data).subscribe((response:any)=>{
      localStorage.setItem('token', response.token)
      this.router.navigate(['/car-stock']);
    }, (error) => {
      this.router.navigate(['/login']);
      this.toastr.error("Não foi possivel realizar o login. Tente novamente.", "Erro");
    })

  }
}
