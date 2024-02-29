import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  data:any;

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.dashboarData();
  }

  dashboarData(){
    this.dashboardService.getDetails().subscribe((response:any)=>{
      this.data = response;
    }, (error:any)=>{
      console.log("Error", error);
    })
  }

}
