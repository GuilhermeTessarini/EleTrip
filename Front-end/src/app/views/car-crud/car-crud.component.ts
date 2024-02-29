import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CarBodyService } from 'src/app/services/car-body.service';
import { CarCrudService } from 'src/app/services/car-crud.service';

@Component({
  selector: 'app-car-crud',
  templateUrl: './car-crud.component.html',
  styleUrls: ['./car-crud.component.css']
})
export class CarCrudComponent implements OnInit{

  showModal = false;
  showModal2 = false;
  showModal3 = false;
  showModal4 = false;

  carCrudForm!: FormGroup;
  carCruds: any[] = [];
  carBodies: any[] = [];
  carCrudToEdit: any;
  carCrudToDelete: any;
  carCrudToDisable: any;

  imagem?: File;
  novaImagem?: File;

  constructor(
    private formBuilder: FormBuilder,
    private carCrudService: CarCrudService,
    private toastr: ToastrService,
    private carBodyService: CarBodyService) { }


  ngOnInit(): void {
    this.carCrudForm = this.formBuilder.group({
      idVeiculo: [''],
      nomeVeiculo: [null, [Validators.required]],
      anoVeiculo: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      autonomiaVeiculo: [null, [Validators.required]],
      marcaVeiculo: [null, [Validators.required]],
      passageirosVeiculo: [null, [Validators.required]],
      placaVeiculo: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
      corVeiculo: [null, [Validators.required]],
      motorVeiculo: [null, [Validators.required]],
      valorLocacao: [null, [Validators.required]],
      carroceriaId: [null, [Validators.required]]
    });
    this.loadCarCruds();
    this.getCarBodies();
  }

  loadCarCruds() {
    this.carCrudService.getCarCrud().subscribe((data: any) => {
      this.carCruds = data;
      console.log(data)
    });
  }

  getCarBodies(){
    this.carBodyService.getCarBody().subscribe((data: any) => {
      this.carBodies = data;
    }, (error:any)=>{
      console.log("Erro ao buscar as opções de carrocerias");
    })
  }

  onFileSelected(event: any) {
    this.imagem = event.target.files[0];
  }

  onSubmit() {
    const formData = this.carCrudForm.value;
    const data = {
      "nomeVeiculo": formData.nomeVeiculo,
      "anoVeiculo": formData.anoVeiculo,
      "autonomiaVeiculo": formData.autonomiaVeiculo,
      "marcaVeiculo": formData.marcaVeiculo,
      "passageirosVeiculo": formData.passageirosVeiculo,
      "placaVeiculo": formData.placaVeiculo,
      "corVeiculo": formData.corVeiculo,
      "motorVeiculo": formData.motorVeiculo,
      "valorLocacao": formData.valorLocacao,
      "carroceriaId": formData.carroceriaId,
      "imagem": this.imagem
    };
    const formDataWithImage = new FormData();
    formDataWithImage.append("nomeVeiculo", formData.nomeVeiculo);
    formDataWithImage.append("anoVeiculo", formData.anoVeiculo);
    formDataWithImage.append("autonomiaVeiculo", formData.autonomiaVeiculo);
    formDataWithImage.append("marcaVeiculo", formData.marcaVeiculo);
    formDataWithImage.append("passageirosVeiculo", formData.passageirosVeiculo);
    formDataWithImage.append("placaVeiculo", formData.placaVeiculo);
    formDataWithImage.append("corVeiculo", formData.corVeiculo);
    formDataWithImage.append("motorVeiculo", formData.motorVeiculo);
    formDataWithImage.append("valorLocacao", formData.valorLocacao);
    formDataWithImage.append("carroceriaId", formData.carroceriaId);
    if (this.imagem) {
      formDataWithImage.append("imagem", this.imagem, this.imagem.name);
    }

    this.carCrudService.addCarCrud(formDataWithImage).subscribe(
      (response: any) => {
        if (response) {
          this.toastr.success("Cadastro realizado com sucesso.", "Sucesso");
          window.location.href = '/car-crud';
        } else {
          this.toastr.error("Não foi possível realizar o cadastro. Preencha todos os campos.", "Erro");
        }
      },
      (error) => {
        this.toastr.error("Erro ao realizar o cadastro. Verifique a imagem e tente novamente.", "Erro");
      }
    );
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.carCrudForm.patchValue({
       imagemVeiculo: file,
    });
 }

  onEdit(carCrud: any){
    this.carCrudForm.patchValue({
      idVeiculo: carCrud.idVeiculo,
      nomeVeiculo: carCrud.nomeVeiculo,
      anoVeiculo: carCrud.anoVeiculo,
      autonomiaVeiculo: carCrud.autonomiaVeiculo,
      marcaVeiculo: carCrud.marcaVeiculo,
      passageirosVeiculo: carCrud.passageirosVeiculo,
      placaVeiculo: carCrud.placaVeiculo,
      corVeiculo: carCrud.corVeiculo,
      motorVeiculo: carCrud.motorVeiculo,
      valorLocacao: carCrud.valorLocacao,
      carroceriaId: carCrud.carroceriaId,
      imagemVeiculo: carCrud.imagemVeiculo
    });
    this.showModal2 = true;
  }

  submitEdit() {
    const formData = new FormData();

    formData.append('idVeiculo', this.carCrudForm.get('idVeiculo')?.value);
    formData.append('nomeVeiculo', this.carCrudForm.get('nomeVeiculo')?.value);
    formData.append('anoVeiculo', this.carCrudForm.get('anoVeiculo')?.value);
    formData.append('autonomiaVeiculo', this.carCrudForm.get('autonomiaVeiculo')?.value);
    formData.append('marcaVeiculo', this.carCrudForm.get('marcaVeiculo')?.value);
    formData.append('passageirosVeiculo', this.carCrudForm.get('passageirosVeiculo')?.value);
    formData.append('placaVeiculo', this.carCrudForm.get('placaVeiculo')?.value);
    formData.append('corVeiculo', this.carCrudForm.get('corVeiculo')?.value);
    formData.append('motorVeiculo', this.carCrudForm.get('motorVeiculo')?.value);
    formData.append('valorLocacao', this.carCrudForm.get('valorLocacao')?.value);
    formData.append('carroceriaId', this.carCrudForm.get('carroceriaId')?.value);

    if (this.imagem) {
      formData.append("imagem", this.imagem, this.imagem.name);
    }

    this.carCrudService.updateCarCrud(formData).subscribe(
      (response: any) => {
        this.toastr.success('Veículo editado com sucesso!', 'Sucesso');
        this.showModal2 = false;
        this.loadCarCruds();
        window.location.href = '/car-crud';
      },
      (error: any) => {
        this.toastr.error('Não foi possível atualizar os dados. Preencha todos os campos.', 'Erro');
      }
    );
  }

  onDelete() {
    if (this.carCrudToDelete) {
      const id = this.carCrudToDelete.idVeiculo;
      this.carCrudService.deleteCarCrud(id).subscribe(
        (response: any) => {
          this.loadCarCruds();
          this.toastr.success("Veículo deletado com sucesso.", "Sucesso");
          this.showModal3 = false;
        },
        (error: any) => {
          this.toastr.error("Não foi possível deletar o veículo, tente novamente.", "Erro");
        }
      );
    }
  }

  onChange() {
    if (!this.carCrudToDisable) {
      this.toastr.error("Não foi possível alterar o status do veículo, tente novamente.", "Erro");
    }

    const { idVeiculo, statusVeiculo } = this.carCrudToDisable;
    const newStatus = statusVeiculo === "true" ? "false" : "true";

    this.carCrudService.updateStatus({ idVeiculo, statusVeiculo: newStatus }).subscribe(
      () => {
        this.loadCarCruds();
        this.toastr.success("Status do veículo alterado com sucesso.", "Sucesso");
        this.showModal4 = false;
      },
      (error: any) => {
        this.toastr.error("Não foi possível alterar o status do veículo, tente novamente.", "Erro");
      }
    );
  }

}
