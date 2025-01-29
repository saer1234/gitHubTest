import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { map, Observable, ReplaySubject, startWith } from 'rxjs';
import { KitchenService } from '../../../../service/kitchen.service';
import { differenceRequest, DifferenceService } from '../../../../service/difference.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [MatPaginatorModule,AsyncPipe,MatDivider,MatFormFieldModule,MatTableModule,MatButtonModule,MatAutocompleteModule,ReactiveFormsModule,AsyncPipe,MatInputModule,MatDatepickerModule,MatFormFieldModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit{
  formSearchIncome = new FormGroup({
    date_in:new FormControl("",[Validators.required]),date_out:new FormControl("",[Validators.required])
  });
  kitchenNames2!:FormControl;
  kitchen_id:string="0";
  filteredOptions2!:Observable<any[]>;
  loadingSearch:boolean=false;
  listColumn:string[]=["item","income","outcome","amount"];
  listDataKitchen:{kitchen_name:string,kitchen_id:string,date:string}[]=[];
  listDifferenceDaily:{income:string,outcome:string,amount:string,item_name:string}[]=[];
  dataSouce1= new MatTableDataSource<any>([]);
  dataSouce2= new MatTableDataSource<any>([]);
  @ViewChild("paginator1") p1!:MatPaginator;
  @ViewChild("paginator2") p2!:MatPaginator;
  constructor(private datePipe:DatePipe,private snackBar:MatSnackBar,private kitchenService:KitchenService,private differenceService:DifferenceService){
    this.kitchenNames2= new FormControl("",[Validators.required]);
    
  }
  ngOnInit(): void {
    this.fillAutoCompleteInputKitche();
 
  }
   fillAutoCompleteInputKitche(){
    this.kitchenService.readKitchen().subscribe(res=>{
      if(res.success){
        this.listDataKitchen=res.data;
        this.filteredOptions2= this.kitchenNames2.valueChanges.pipe(startWith(''),map(value=>this._filterKitche(value||"")))
 
      }
    });
  }
   private _filterKitche(nameKitchen:string):{kitchen_name:string,kitchen_id:string,date:string}[]{
    const values = nameKitchen.toLowerCase();
    const result = this.listDataKitchen.filter(value=>value.kitchen_name.toLocaleLowerCase().includes(values));
    if(result.length!=0){
      this.kitchen_id=result[0].kitchen_id;
    }
    return result;
   }
  searchData(){
    this.loadingSearch=true;
    setTimeout(()=>{ 
      const {date_out,date_in}= this.formSearchIncome.controls;
      date_out.setValue(this.datePipe.transform(date_out.value,"YYYY-MM-dd"));
      date_in.setValue(this.datePipe.transform(date_in.value,"YYYY-MM-dd"));
     this.differenceService.ReadDifferenceDaily({date_in:date_in.value||"",date_out:date_out.value||"",kitchen_id:this.kitchen_id}).subscribe((res:any)=>{
      if(res.success){
       //this.listDifferenceDaily=res.data;
       this.dataSouce1.data=res.data;
       this.dataSouce1.paginator=this.p1;
       this.fillTotalDiffrenece({date_in:date_in.value||"",date_out:date_out.value||"",kitchen_id:this.kitchen_id});
      }
      this.loadingSearch=false;
    },error=>{
      this.loadingSearch=false;
      this.snackBar.open(error.error.message,"close");
      setTimeout(()=>{
        this.snackBar.dismiss();
      },3000);
    })
   },1000);
  }

  applyFilter1(event:Event){
      const value = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
      this.dataSouce1.filter= value;
  }
  filterTableTotal(event:Event){
    this.dataSouce2.filter= (event.target as HTMLInputElement).value.trim().toLowerCase();
  }
  fillTotalDiffrenece(data:differenceRequest){
    this.differenceService.readTotalDifference(data).subscribe((Rs:any)=>{
      if(Rs.success==true){
          this.dataSouce2.data=Rs.data;
          this.dataSouce2.paginator=this.p2;
      }
    },error=>{
      this.snackBar.open(error.error.message,"close");
      setTimeout(()=>{
        this.snackBar.dismiss();
      });
    })
  }
}
