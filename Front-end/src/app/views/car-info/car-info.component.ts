import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BillService } from 'src/app/services/bill.service';
import { CarBodyService } from 'src/app/services/car-body.service';
import { CarCrudService } from 'src/app/services/car-crud.service';

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css']
})

export class CarInfoComponent implements OnInit {

  car: any;
  showModal = false;
  carInfoForm!: FormGroup;
  dataSource: any = [];
  totalFatura: number = 0;
  carroImagemUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carCrudService: CarCrudService,
    private carBodyService: CarBodyService,
    private billService: BillService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadCarInfo(id)
    });
  }

  ngOnInit(): void {
    this.getCarBodies();
    this.carInfoForm = this.fb.group({
      nomeFatura: [null, Validators.required],
      emailFatura: [null, Validators.required],
      telefoneFatura: [null, Validators.required],
      metodoPagamentoFatura: [null, Validators.required],
      dataRetirada: [null, Validators.required],
      dataRetorno: [null, Validators.required],
      totalFatura: [0 , Validators.required]
    });
  }

  loadCarInfo(carId: number) {
    this.carCrudService.getById(carId).subscribe({
      next: (data: any) => {
        this.car = data;

        this.carroImagemUrl = this.getFormattedImagePath(this.car.imagemVeiculo);

        this.getCarBodies().subscribe({
          next: (carBodies: any) => {
            const carBody = carBodies.find((body: any) => body.idCarroceria === this.car.carroceriaId);

            if (carBody) {
              this.car.carroceria = carBody.nomeCarroceria;
            }

            this.dataSource.push(this.car);
          },
          error: (error: any) => {
            this.toastr.error("Erro ao buscar as informações da carroceria.", "Erro");
          }
        });
      },
      error: (error: any) => {
        this.toastr.error("Erro ao buscar as informações do carro.", "Erro");
      }
    });
  }

  getCarBodies(): Observable<any> {
    return this.carBodyService.getCarBody();
  }

  getFormattedImagePath(imagePath: string): string {
    const formattedPath = imagePath.replace(/\\/g, '/');

    return formattedPath.includes('/assets/Upload-Images/')
      ? formattedPath
      : '/assets/Upload-Images/' + formattedPath;
  }

  calculateTotal() {
    const dataRetirada = new Date(this.carInfoForm.value.dataRetirada);
    const dataRetorno = new Date(this.carInfoForm.value.dataRetorno);
    const valorLocacao = this.car.valorLocacao;

    if (!isNaN(dataRetirada.getTime()) && !isNaN(dataRetorno.getTime()) && valorLocacao) {
      const timeDiff = dataRetorno.getTime() - dataRetirada.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      let totalFatura = diffDays * valorLocacao;

      if (totalFatura < 0) {
        totalFatura = 0;
      }

      this.carInfoForm.get('totalFatura')?.setValue(totalFatura);
    } else {
      this.carInfoForm.get('totalFatura')?.setValue(0);
    }
  }

  onSubmit() {
    var formData = this.carInfoForm.value;
    var data = {
      nomeFatura: formData.nomeFatura,
      emailFatura: formData.emailFatura,
      telefoneFatura: formData.telefoneFatura,
      metodoPagamentoFatura: formData.metodoPagamentoFatura,
      dataRetirada: formData.dataRetirada,
      dataRetorno: formData.dataRetorno,
      totalFatura: formData.totalFatura,
      veiculoDetalhe: JSON.stringify(this.dataSource)
    };

    const carId = this.route.snapshot.params['id'];

    const statusData = {
      idVeiculo: carId,
      statusVeiculo: 'false'
    };

    this.carCrudService.updateStatus(statusData).subscribe({
      next: (statusResponse: any) => {
        this.car.statusVeiculo = statusData.statusVeiculo;
      },
      error: (statusError: any) => {
        this.toastr.error("Erro ao atualizar status do veículo.", "Erro");
      }
    });

    this.billService.generateReport(data).subscribe({
      next: (response: any) => {
        this.downloadFile(response?.uuid);
        this.showModal = false;
        this.router.navigate(['/car-stock']);
        this.toastr.success("Obrigado por alugar com a Eletrip!", "Sucesso");
      },
      error: (erro: any) => {
        this.toastr.error("Não foi possível realizar o aluguel. Preencha todos os campos.", "Erro");
      }
    });
  }

  downloadFile(fileName: any) {
    var data = {
      uuid: fileName
    }
      this.billService.getPDF(data).subscribe((response:any)=>{
        saveAs(response,fileName+'.pdf')
      })
  }

}
