import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { incomeData, LOCATION } from '../staticContent';
import { Subject } from 'rxjs';
export interface incomeinsert{
  success:boolean;
  data:{message:string};
}
export interface income_edit{
  success:boolean;
  data:{amoun:number,date_in:string,item_id:number,kitchen_id:number}[];
}
@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private http  = inject(HttpClient);
  private ObservableEditDiaolot= new Subject<income_edit>();
  constructor() {

  }
  readObservableEditDiaolot(){
    return this.ObservableEditDiaolot;
  }
  InserDataIncome(data:incomeData[]){
   return this.http.post<incomeinsert>(LOCATION[8].inserIncome,data);
  }
  sreachDataIncomeDetails(data:{id:number,date_in:string,date_out:string}){
    return this.http.get(LOCATION[8].inserIncome+`${data.id}/${data.date_in}/${data.date_out}`);
  }
  sreachDataTotal(data:{id:number,date_in:string,date_out:string}){
    return this.http.get(LOCATION[8].inserIncome+`total/${data.id}/${data.date_in}/${data.date_out}`);
  }
  deleteAmount(income_id:string){
    return this.http.delete(LOCATION[8].inserIncome+`${income_id}`);
  }
  UpdateIncome(data:{amount:number,date_in:string,income_id:number}){
    return this.http.put<income_edit>(LOCATION[8].inserIncome+`${data.income_id}`,data);
  }
}
