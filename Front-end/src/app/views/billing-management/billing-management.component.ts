import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BillService } from 'src/app/services/bill.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-billing-management',
  templateUrl: './billing-management.component.html',
  styleUrls: ['./billing-management.component.css']
})
export class BillingManagementComponent {

  faturas: any[] = [];
  idFatura?: number;
  showModal = false;

  constructor(private billService: BillService,
              private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.getBills();
  }

  getBills() {
    this.billService.getBillsByEmail().subscribe(
      (data) => {
        this.faturas = data;
      },
      (error) => {
        this.toastr.error("Erro ao obter faturas.", "Erro");
      }
    );
  }

  getNomeVeiculo(nomeVeiculoJson: string): string {
    try {
      if (nomeVeiculoJson) {
        const veiculoArray = JSON.parse(nomeVeiculoJson);
        const nomeVeiculo = veiculoArray && veiculoArray[0] && veiculoArray[0].nomeVeiculo;
        return nomeVeiculo || 'Nome não disponível';
      } else {
        return 'Nome não disponível';
      }
    } catch (error) {
      this.toastr.error("Erro ao converter nomeVeiculoJson para objeto.", "Erro");
      return 'Erro ao obter nome do veículo';
    }
  }

  formatarData(data: string): string {
    try {
      const formattedDate = formatDate(data, 'dd/MM/yyyy', 'en-US');
      return formattedDate || 'Data inválida';
    } catch (error) {
      console.error('Erro ao formatar a data:', error);
      return 'Data inválida';
    }
  }

  abrirModal(idFatura: number) {
    this.idFatura = idFatura;
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
    this.idFatura = undefined;
  }

  confirmarCancelamento() {
    const idFatura = this.idFatura;
    const novoStatus = 'Cancelado';

    if (idFatura !== undefined) {
      this.billService.atualizarStatusFatura(idFatura, novoStatus).subscribe(
        () => {
          this.toastr.success("Fatura cancelada com sucesso!. O Valor será estornado em 24 Horas.", "Sucesso");
          this.getBills();
          this.fecharModal();
        },
        (error) => {
          this.toastr.error("Erro ao cancelar fatura.", "Erro");

        }
      );
    } else {
      this.toastr.error("ID da fatura é indefinido.", "Erro");
    }
  }
}
