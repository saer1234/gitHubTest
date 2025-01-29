import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LOCATION } from '../staticContent';
export interface differenceRequest{
  date_in:string;
  date_out:string;
  kitchen_id:string;
}
@Injectable({
  providedIn: 'root'
})
export class DifferenceService {

  constructor(private http:HttpClient) { }
  ReadDifferenceDaily(data:differenceRequest){
    return this.http.get(LOCATION[11].differenceDaily+`${data.kitchen_id}/${data.date_in}/${data.date_out}`);
  }
  readTotalDifference(data:differenceRequest){
    return this.http.get(LOCATION[10].difference+`${data.kitchen_id}/${data.date_in}/${data.date_out}`);
  }


}
