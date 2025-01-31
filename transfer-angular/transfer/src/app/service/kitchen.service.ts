import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LOCATION } from '../staticContent';
export interface kitchens{
  success:boolean;
  data:{kitchen_id:string,kitchen_name:string,date:string}[]
}
@Injectable({
  providedIn: 'root'
})
export class KitchenService {

  constructor(private http:HttpClient) { }
  readKitchen(){
    return this.http.get<kitchens>(LOCATION[5].readKitchen);
  }

}
