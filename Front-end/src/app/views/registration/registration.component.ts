import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationPart1Component implements OnInit{

  registrationForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router : Router,
    private userService: UserService,
    private toastr: ToastrService
    ) {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      nomeUsuario:[null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      emailUsuario: [null, [Validators.required, Validators.email]],
      telefoneUsuario: [null, [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      dataNascimentoUsuario: [null, [Validators.required, this.minimumAgeValidator(18)]],
      cpfUsuario: [null, [Validators.required, Validators.pattern(/\d{11}/)]],
      rgUsuario: [null, [Validators.required, Validators.pattern(/\d{8,10}/)]],
      generoUsuario: [null, Validators.required],
      senhaUsuario: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(18)]],
      cidadeUsuario: [null, Validators.required],
      estadoUsuario: [null, Validators.required],
      ruaUsuario: [null, Validators.required],
      numeroUsuario: [null, Validators.required],
      bairroUsuario: [null, Validators.required],
      numeroRegistroHabilitacao: [null, [Validators.required, Validators.pattern(/^\d{11}$/)]],
      validadeHabilitacao: [null, Validators.required],
      cnhHabilitacao: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate = new Date(control.value);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();

      if (age < minAge) {
        return { minimumAge: true };
      }

      return null;
    };
  }

  onSubmit(){
    const formData = this.registrationForm.value;
    const data = {
      "nomeUsuario": formData.nomeUsuario,
      "emailUsuario" : formData.emailUsuario,
      "telefoneUsuario": formData.telefoneUsuario,
      "dataNascimentoUsuario": formData.dataNascimentoUsuario,
      "cpfUsuario": formData.cpfUsuario,
      "rgUsuario": formData.rgUsuario,
      "generoUsuario": formData.generoUsuario,
      "senhaUsuario": formData.senhaUsuario,
      "cidadeUsuario": formData.cidadeUsuario,
      "estadoUsuario": formData.estadoUsuario,
      "ruaUsuario": formData.ruaUsuario,
      "numeroUsuario": formData.numeroUsuario,
      "bairroUsuario": formData.bairroUsuario,
      "numeroRegistroHabilitacao": formData.numeroRegistroHabilitacao,
      "validadeHabilitacao": formData.validadeHabilitacao,
      "cnhHabilitacao": formData.cnhHabilitacao,
    }
    this.userService.registration(data).subscribe((response:any)=>{
      if (response){
        this.toastr.success("Cadastro realizado com sucesso", "Sucesso");
        this.router.navigate(['/login']);
      } else {
        this.toastr.error("Não foi possível realizar o cadastro. Preencha todos os campos.", "Erro");
      }
    });
  }

  onVoltarClick(){
    this.router.navigate(['/login'])
  }

}
