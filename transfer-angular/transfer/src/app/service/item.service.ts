import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LOCATION } from '../staticContent';
import { ObjectEncodingOptions } from 'fs';
export interface items{
  success:boolean;
  data:{item_id:number;
    unit:string;
    date:string;
    item_name:string;}[]
}
export interface singelItem{
  item_id:number;
    unit:string;
    date:string;
    item_name:string;
}
export interface itemResponse{
  success:boolean;
  message:string;
}
export interface plateOutAmount{
  success:boolean;
  data:{data:string}
}
export interface plateOut{
success:boolean;
data:{ plate_out:string;
  plate_id:string;
  kitchen_id:string;
  number:number;
  date:string;
  date_out:string;
  plate_name:string;
}[];
}
@Injectable({
  providedIn: 'root'
})
export class ItemService {
  listItem = new Subject<any>();
  constructor(private http:HttpClient) {

   }
   readDataUpdate(){
    return this.listItem;
   }
   readItems():Observable<items>{
    return this.http.get<items>(LOCATION[1].readItem);
   }
   editItems(item:{item_id:number;
    unit:string;
    date:string;
    item_name:string;}):Observable<itemResponse>{
    return this.http.put<itemResponse>(LOCATION[2].updateItem+`${item.item_id}`,item);
   }
   deleteItems(item:singelItem){
    return this.http.delete<itemResponse>(LOCATION[2].updateItem+`${item.item_id}`);
   }
   insertItems(item:singelItem){
    return this.http.post<itemResponse>(LOCATION[2].updateItem,item);
   } 
   
}
