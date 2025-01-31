import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LOCATION } from '../staticContent';
import { plateOut, plateOutAmount } from './item.service';
import { KitchenService } from './kitchen.service';
import { retry, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlateService {
  private http= inject(HttpClient);
  private sendDataNewPlateDialog= new Subject();
  private sendSuccessPlateDialog= new Subject();
  private addContainDiolog= new Subject();
  constructor() { 

  }
  readDailogAddNew(){
    return  this.sendDataNewPlateDialog;
  }
  readDialogEditDialogPlate(){
    return this.sendSuccessPlateDialog;
  }
  readContainSubjectDialog(){
    return this.addContainDiolog;
  }
  readPlate(){
    return this.http.get(LOCATION[3].readPlate);
  }
  readPlate_only(){
    return this.http.get(LOCATION[4].readPlate_name);
  }
  sendPlateOut(data:any){
    return this.http.post<plateOutAmount>(LOCATION[6].outAmount,data);
  }
  readPlateOut(data:{date_in:string,date_out:string,kitchen_id:string}){
    return this.http.get<plateOut>(LOCATION[7].readPlateOut+`${data.kitchen_id}/${data.date_in}/${data.date_out}`);
  }
  addNewPlate(data:any){
    return this.http.post(LOCATION[4].readPlate_name,data);
  }
  deletePlateO(id:number){
    return  this.http.delete(LOCATION[4].readPlate_name+`${id}`);
  }
  editPlateO(data:{plate_name:string | null,plate_id:number | null,date:string| null}){
    return this.http.put(LOCATION[4].readPlate_name+`${data.plate_id}`,data);
  }
  deleteContain(id:number){
    return this.http.delete(LOCATION[3].readPlate+`/${id}`);
  }
  addNewContainPlat(data:{plate_id:number,item_id:number,amount:number}){
    return this.http.post(LOCATION[3].readPlate,[data]);
  }
  readToken(token:string){
    return this.http.get(LOCATION[3].readPlate+`/token/${token}`);
  }
}
