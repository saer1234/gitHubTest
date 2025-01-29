import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { incomeData, LOCATION } from '../staticContent';
import { income_edit, incomeinsert } from './income.service';

@Injectable({
  providedIn: 'root'
})
export class OutcomeService {
  private http  = inject(HttpClient);
  private ObservableEditDiaolot= new Subject<income_edit>();
  constructor() {

  }
  readObservableEditDiaolot(){
    return this.ObservableEditDiaolot;
  }
  InserDataIncome(data:incomeData[]){
   return this.http.post<incomeinsert>(LOCATION[9].outcome,data);
  }
  sreachDataIncomeDetails(data:{id:number,date_in:string,date_out:string}){
    return this.http.get(LOCATION[9].outcome+`${data.id}/${data.date_in}/${data.date_out}`);
  }
  sreachDataTotal(data:{id:number,date_in:string,date_out:string}){
    return this.http.get(LOCATION[9].outcome+`total/${data.id}/${data.date_in}/${data.date_out}`);
  }
  deleteAmount(income_id:string){
    return this.http.delete(LOCATION[9].outcome+`${income_id}`);
  }
  UpdateIncome(data:{amount:number,date_in:string,income_id:number}){
    return this.http.put<income_edit>(LOCATION[9].outcome+`${data.income_id}`,data);
  }
}
