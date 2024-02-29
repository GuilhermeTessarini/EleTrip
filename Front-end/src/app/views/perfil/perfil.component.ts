import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  userData: any;
  formattedDate: string = '';
  formattedValidityDate: string = '';

  showModal = false;
  editForm!: FormGroup;

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserData();
  }

  private createForm() {
    this.editForm = this.fb.group({
      nomeUsuario: [this.userData.nomeUsuario, Validators.required],
      telefoneUsuario: [this.userData.telefoneUsuario, Validators.required],
      dataNascimentoUsuario: [this.userData.dataNascimentoUsuario, Validators.required],
      cpfUsuario: [this.userData.cpfUsuario, Validators.required],
      rgUsuario: [this.userData.rgUsuario, Validators.required],
      generoUsuario: [this.userData.generoUsuario, Validators.required],
      cidadeUsuario: [this.userData.cidadeUsuario, Validators.required],
      estadoUsuario: [this.userData.estadoUsuario, Validators.required],
      ruaUsuario: [this.userData.ruaUsuario, Validators.required],
      numeroUsuario: [this.userData.numeroUsuario, Validators.required],
      bairroUsuario: [this.userData.bairroUsuario, Validators.required],
      numeroRegistroHabilitacao: [this.userData.numeroRegistroHabilitacao, Validators.required],
      validadeHabilitacao: [this.userData.validadeHabilitacao, Validators.required],
      cnhHabilitacao: [this.userData.cnhHabilitacao, Validators.required],
      emailUsuario: [this.userData.emailUsuario, Validators.required],
    });
  }

  getUserData() {
    this.userService.getByUserEmail().subscribe(
      (data: any) => {
        this.userData = data[0];
        this.formatDate();
        this.createForm();
      },
      (error: any) => {
        console.error('Erro ao obter dados do usuário', error);
      }
    );
  }

  getGenderDescription(genderCode: number): string {
    switch (genderCode) {
      case 1:
        return 'Masculino';
      case 2:
        return 'Feminino';
      case 3:
        return 'Outros';
      default:
        return 'Desconhecido';
    }
  }

  formatDate(): void {
    if (this.userData?.dataNascimentoUsuario) {
      this.formattedDate = formatDate(this.userData.dataNascimentoUsuario, 'dd/MM/yyyy', 'en-US');
    }

    if (this.userData?.validadeHabilitacao) {
      this.formattedValidityDate = formatDate(this.userData.validadeHabilitacao, 'dd/MM/yyyy', 'en-US');
    }
  }

  updateUserData() {
    if (this.editForm.invalid) {
      return;
    }
    const newData = this.editForm.value;
    this.userService.updateUser(newData).subscribe(
      (response) => {
        this.toastr.success("Dados do usuário atualizados com sucesso.", "Sucesso");
        this.getUserData();
      },
      (error) => {
        this.toastr.error("Erro ao atualizar os dados do usuário", "Erro");

      }
    );
    this.onCloseModal();
  }

  onCloseModal() {
    this.showModal = false;
  }
}
