import { AsyncPipe, DatePipe } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, startWith, map } from 'rxjs';
import { v4 } from 'uuid';
import { EditIncomeComponent } from '../../../../dialog/edit-income/edit-income.component';
import { IncomeService } from '../../../../service/income.service';
import { ItemService } from '../../../../service/item.service';
import { KitchenService } from '../../../../service/kitchen.service';
import { PlateService } from '../../../../service/plate.service';
import { incomeData } from '../../../../staticContent';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OutcomeService } from '../../../../service/outcome.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-removequantity',
  standalone: true,
  imports: [MatPaginatorModule,MatDivider,MatFormFieldModule,MatTableModule,MatButtonModule,MatAutocompleteModule,ReactiveFormsModule,AsyncPipe,MatInputModule,MatDatepickerModule,MatFormFieldModule],
  templateUrl: './removequantity.component.html',
  styleUrl: './removequantity.component.css'
})
export class RemovequantityComponent implements AfterViewInit {
  private incomeService= inject(OutcomeService);
  private plateService=inject(PlateService);
  ControlDatePicker:FormControl= new FormControl("",Validators.required);
  kitchenNames!:FormControl;
  filteredOptions!:Observable<any[]>;
  filteredOptions2!:Observable<any[]>;
  kitchenNames2!:FormControl;
  formSearchIncome= new FormGroup({
    date_in:new FormControl("",[Validators.required]),date_out:new FormControl("",[Validators.required])
  });
  ListKitchenNmae:{kitchen_name:string,kitchen_id:string,date:string}[]=[];
  filterItems!:Observable<{item_id:number,item_name:string,date:string}[]>;
  controlItems!:FormControl;
  ListItems:{item_id:number,item_name:string,date:string, unit: string}[]=[];
  listColumn:string[]=["kitchen_name","item_name","amount","date","action"];
  listColumn2:string[]=["kitchen_name","item_name","amount","date"];
  ListIncomeData:incomeData[]=[];
  dataSouce=new MatTableDataSource(this.ListIncomeData);
  loadingSend:boolean=false;
  loadingSearch:boolean=false;
  dataSouce1 =new MatTableDataSource();
  dataSouce2=new MatTableDataSource();
  @ViewChild("paginator1") p!: MatPaginator;
  @ViewChild("paginator2") p1!: MatPaginator;
  @ViewChild("paginator3") p2!: MatPaginator;
  constructor(private dialog:MatDialog,private kitcheService:KitchenService,private itemservice:ItemService,private datepipe:DatePipe,private snackBar:MatSnackBar)
  { 

    this.kitchenNames= new FormControl("",Validators.required);
    this.fillAutoCompleteKitchen();
    this.controlItems= new FormControl("",Validators.required);
    this.fillAutocompleteItems();
    this.fillAutoCompleteKitchen2();
    this.kitchenNames2=new FormControl("",Validators.required);

  }
  ngAfterViewInit(): void {
    this.dataSouce.paginator= this.p;
  }
  ngOnInit(): void {
    this.listenerUpdateDialogIncome();
  }

  private _filter(value:string):any[]{
    const filterValue=value.toLowerCase();
    return this.ListKitchenNmae.filter(value=>value.kitchen_name.toLowerCase().includes(filterValue));
  }
  private _filterItems(value:string):{item_id:number,item_name:string,date:string}[]{
    const filterValue= value.toLocaleLowerCase();
    return this.ListItems.filter(option=>option.item_name.toLocaleLowerCase().includes(filterValue));

  }

  fillAutoCompleteKitchen(){
   
    this.kitcheService.readKitchen().subscribe(response=>{
      if(response.success==true){
        this.ListKitchenNmae=response.data
        this.filteredOptions= this.kitchenNames.valueChanges.pipe(startWith(''),map(value=>this._filter(value||'')));

      }
    }
    )
  
  }

  fillAutoCompleteKitchen2(){
   
    this.kitcheService.readKitchen().subscribe(response=>{
      if(response.success==true){
        this.ListKitchenNmae=response.data
        this.filteredOptions2= this.kitchenNames2.valueChanges.pipe(startWith(''),map(value=>this._filter(value||'')));

      }
    }
    )
  
  }
  fillAutocompleteItems(){
    this.itemservice.readItems().subscribe(response=>{
      if(response.success==true){
        this.ListItems= response.data;
        this.filterItems= this.controlItems.valueChanges.pipe(startWith(''),map(value=>this._filterItems(value||'')))
      }
    });
  }
  applyFilter(event:Event){
    const filterValue= (event.target as HTMLInputElement).value;
    this.dataSouce.filter= filterValue.trim().toLocaleLowerCase();
  }

  applyFilter2(event:Event){
    this.dataSouce2.filter=(event.target as HTMLInputElement).value.trim().toLowerCase();
  }
  applyFilter1(event:Event){
this.dataSouce1.filter=(event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  fillArrayDataIncome(amount:HTMLInputElement):void{
      if(amount.value!=""&&this.ControlDatePicker.valid&&this.kitchenNames.valid && this.controlItems.valid){
        this.ControlDatePicker.setValue(this.datepipe.transform(this.ControlDatePicker.value,"YYYY-MM-dd"));
        let x=this.ListIncomeData.filter(value=>value.item_name==this.controlItems.value&&value.kitchen_name==this.kitchenNames.value&&value.date_in==this.ControlDatePicker.value);
        if(x.length!=0)
          x[0].amount+=parseFloat(amount.value);
        else
        {
          let kitchen_id=this.ListKitchenNmae.filter(value=>value.kitchen_name==this.kitchenNames.value)[0].kitchen_id;
          let item_id=this.ListItems.filter(value=>value.item_name==this.controlItems.value)[0].item_id
          this.ListIncomeData.push({token:"",date_in:this.ControlDatePicker.value,kitchen_id:kitchen_id,kitchen_name:this.kitchenNames.value,item_id:item_id,item_name:this.controlItems.value,amount:parseFloat(amount.value)});
        }  
      }else{
        this.snackBar.open("Empty fields feel all of them!","close");
      }
      this.dataSouce._updateChangeSubscription(); 
  }
  clearData(){
    this.ListIncomeData.splice(0,this.ListIncomeData.length);
    this.dataSouce._updateChangeSubscription();
  }
  displayUnit(item:incomeData){
    return this.ListItems.filter(value=>value.item_id==item.item_id)[0].unit;
  }
  sendDataToApi(){
    this.loadingSend=true;
    if(this.ListIncomeData.length!=0)
      this.ListIncomeData[0].token=v4();
    setTimeout(()=>{
      this.incomeService.InserDataIncome(this.ListIncomeData).subscribe(response=>{
        if(response.success==true){
          this.clearData();
          this.snackBar.open(response.data.message,"close");
            this.loadingSend=false;
          setTimeout(()=>{
              this.snackBar.dismiss();
          },3000);
        }
      },error=>{
        if(error.error.message=="duplicated"){
              this.clearData();
              this.snackBar.open("success Insereted","close");
              this.loadingSend=false;
            setTimeout(()=>{
              this.snackBar.dismiss();
          },3000);
        }else if(this.ListIncomeData.length!=0){
          this.plateService.readToken(this.ListIncomeData[0].token).subscribe((response:any)=>{
            if(response.data.success==true)
            {
              this.snackBar.open("Data not inserted Yet try again")
            }else{
              this.clearData();
              this.snackBar.open("success Insereted","close");
            }
            this.loadingSend=false;
            setTimeout(()=>{
              this.snackBar.dismiss();
          },3000);
          })
        }else{
          this.snackBar.open(error.error.message,"close");
          this.loadingSend=false;
          setTimeout(()=>{
            this.snackBar.dismiss();
          },3000);
        }

      });
    },4000);
  }

  searchData(){
    if(this.formSearchIncome.valid&&this.kitchenNames2.valid){
      let date_in=this.datepipe.transform(this.formSearchIncome.controls.date_in.value,"YYYY-MM-dd")||"";
      let date_out=this.datepipe.transform(this.formSearchIncome.controls.date_out.value,"YYYY-MM-dd")||"";
      let id  = parseFloat(this.ListKitchenNmae.filter(value=>value.kitchen_name.includes(this.kitchenNames2.value))[0].kitchen_id)||0;
      this.incomeService.sreachDataIncomeDetails({date_in:date_in,date_out:date_out,id:id}).subscribe((response:any)=>{
        if(response.success==true)
        {
          response.data.forEach((element:any) => {
            element.kitchen_name=this.ListKitchenNmae.filter(value=>value.kitchen_id==element.kitchen_id)[0].kitchen_name
            element.date_in=this.datepipe.transform(element.date_in,"YYYY-MM-dd");
          });
          this.dataSouce1=new MatTableDataSource(response.data);
          this.dataSouce1.paginator=this.p1;
        }
      })
      this.searchDataTotal({date_in:date_in,date_out:date_out,id:id});
    }else{
      this.snackBar.open("Fill date in and out before search","close");
    }
  }
  searchDataTotal(data:any){
    this.incomeService.sreachDataTotal(data).subscribe((response:any)=>{
        if(response.success==true)
        {
          response.data.forEach((element:any) => {
            element.kitchen_name=this.ListKitchenNmae.filter(value=>value.kitchen_id==element.kitchen_id)[0].kitchen_name
            element.date_in=this.datepipe.transform(element.date_in,"YYYY-MM-dd");
          });
          this.dataSouce2=new MatTableDataSource(response.data);
          this.dataSouce2.paginator=this.p2;
        }
         
    })
  }
  deleteLocalData(index:number){
    let indexL= this.p.pageIndex*this.p.pageSize+index;
    this.ListIncomeData.splice(indexL,1);
    this.dataSouce._updateChangeSubscription();
  }
  say(){
    console.log("hello");
  }
  openDialogEdit(element:any){

      this.dialog.open(EditIncomeComponent,{data:{m1:this.say,element:element,listITems:this.ListItems,listKitchen:this.ListKitchenNmae}});
  }
  DeleteItemsA(i:any){
    this.incomeService.deleteAmount(i.outcome_id).subscribe((response:any)=>{
      if(response.success==true){
        this.searchData();
        console.log(response.data);
        let nameItem=this.ListItems.filter(v=>v.item_id==response.data[0].item_id)[0].item_name;
        this.snackBar.open("Items "+nameItem+" Size "+response.data[0].amount+" was deleted","close");
        setTimeout(()=>{
          this.snackBar.dismiss();
        },3000);
      }
    },error=>{
      this.snackBar.open(error.error.message,"close");
      setTimeout(()=>{
        this.snackBar.dismiss();
      },3000);
    });
  }
  listenerUpdateDialogIncome(){
    this.incomeService.readObservableEditDiaolot().asObservable().subscribe(response=>{
        if(response.success){
          this.searchData();
        }
    })
  }
}
