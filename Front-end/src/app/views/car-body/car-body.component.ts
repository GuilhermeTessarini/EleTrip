import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CarBodyService } from 'src/app/services/car-body.service';

@Component({
  selector: 'app-car-body',
  templateUrl: './car-body.component.html',
  styleUrls: ['./car-body.component.css']
})
export class CarBodyComponent implements OnInit {

  showModal = false;
  showModal2 = false;
  showModal3 = false;

  carBodyForm!: FormGroup;
  carBodies: any[] = [];
  carBodyToEdit: any;
  carBodyToDelete: any;

  constructor(
    private formBuilder: FormBuilder,
    private carBodyService: CarBodyService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.carBodyForm = this.formBuilder.group({
      idCarroceria: [''],
      nomeCarroceria: [null, [Validators.required]]
    });
    this.loadCarBodies();
  }

  onSubmit() {
    const formData = this.carBodyForm.value;
    const data = {
      "nomeCarroceria": formData.nomeCarroceria
    }
    this.carBodyService.addCarBody(data).subscribe((response: any) => {
      if (response) {
        this.toastr.success("Cadastro realizado com sucesso", "Sucesso");
        window.location.href = '/car-body';
      } else {
        this.toastr.error("Não foi possivel realizar o cadastro, tente novamente.", "Erro");
      }
    })
  }

  loadCarBodies() {
    this.carBodyService.getCarBody().subscribe((data: any) => {
      this.carBodies = data;
    });
  }

  onEdit(carBody: any) {
    this.carBodyForm.patchValue({
      idCarroceria: carBody.idCarroceria,
      nomeCarroceria: carBody.nomeCarroceria
    });

    this.showModal2 = true;
  }

  submitEdit() {
    const carBodyData = this.carBodyForm.value;

    this.carBodyService.updateCarBody(carBodyData).subscribe(
      (response: any) => {
        this.toastr.success('Carroceria editada com sucesso.', 'Sucesso');
        this.showModal2 = false;
        this.loadCarBodies();
      },
      (error: any) => {
        this.toastr.error('Não foi possível editar a carroceria, tente novamente.', 'Erro');
      }
    );
  }

  onDelete() {
    if (this.carBodyToDelete) {
      const id = this.carBodyToDelete.idCarroceria;
      this.carBodyService.deleteCarBody(id).subscribe(
        (response: any) => {
          this.loadCarBodies();
          this.toastr.success("Carroceria deletada com sucesso", "Sucesso");
          this.showModal3 = false;
        },
        (error: any) => {
          this.toastr.error("Não foi possível deletar a carroceria, tente novamente.", "Erro");
        }
      );
    }
  }

}
