import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { elementAt, map, Observable, startWith } from 'rxjs';
import { IncomeService } from '../../service/income.service';
import { response } from 'express';
import { OutcomeService } from '../../service/outcome.service';

export interface DialogData {
  listITems: {
    item_id: number;
    item_name: string;
    date: string;
}[];
listKitchen: {
  kitchen_name: string;
  kitchen_id: string;
  date: string;
}[];
element:any;
m1:()=> any;
}
export interface items{
  item_name:string;
  item_id:number;
  date:string;
}

@Component({
  selector: 'app-edit-income',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,FormsModule,MatDatepickerModule],
  templateUrl: './edit-income.component.html',
  styleUrl: './edit-income.component.css'
})
export class EditIncomeComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<EditIncomeComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private datePipe=inject(DatePipe);
   kitchen_name="Not Founded";
  group1=new FormGroup({datepicker:new FormControl("",[Validators.required]),items:new FormControl("",[Validators.required]),amount:new FormControl("",[Validators.required,Validators.min(0.01)])});
  filteredOptions!:Observable<items []>;
  dataError:string="";
  responseWork:boolean=false;
  errorOuccers:boolean=false;
  textTitle:string="income";
  private incomeService=inject(IncomeService);
  private Outcomeservice=inject(OutcomeService);
  constructor(){
    this.initialItemsAutoSelector();
  }
  ngOnInit(): void {
    this.fillFiledWithData();
    this.group1.controls.items.disable();
    if(Object.hasOwn(this.data,"m1")){
      this.textTitle="outcome";
    }
  }

  fillFiledWithData(){
    this.kitchen_name=this.data.listKitchen.filter(value=>value.kitchen_id==this.data.element.kitchen_id)[0].kitchen_name;
    let item_name=this.data.listITems.filter(v1=>v1.item_id==this.data.element.item_id)[0].item_name
    this.group1.controls.items.setValue(item_name);
    this.group1.controls.amount.setValue(this.data.element.amount);
    this.group1.controls.datepicker.setValue(this.data.element.date_in);
  }
  private _filter(element:string){
    const filterValue=element.toLowerCase();  
    return this.data.listITems.filter(value=>value.item_name.toLowerCase().includes(filterValue));
  }
  private initialItemsAutoSelector(){
    this.filteredOptions=this.group1.controls.items.valueChanges.pipe(startWith(''),map(value=>this._filter(value||'')));
  }
  SaveData(){
    if(Object.hasOwn(this.data,"m1")){
      this.responseWork=false;
      this.errorOuccers=false;
      let amount = this.group1.controls.amount.value||"";
      let date =this.datePipe.transform(this.group1.controls.datepicker.value||"","YYYY-MM-dd")||"";
      let income_id=this.data.element.outcome_id;
        this.Outcomeservice.UpdateIncome({amount:parseFloat(amount),date_in:date,income_id:income_id}).subscribe(response=>{
         if(response.success){
          this.responseWork=true;
          this.Outcomeservice.readObservableEditDiaolot().next(response);
         }
         setTimeout(()=>{
          this.responseWork=!this.responseWork;
         },3000);
        },error=>{
          this.dataError=error.error.message;
          this.errorOuccers=true;
          setTimeout(()=>{
            this.errorOuccers=!this.errorOuccers;
           },3000);
        });


    }else{
      this.responseWork=false;
      this.errorOuccers=false;
      let amount = this.group1.controls.amount.value||"";
      let date =this.datePipe.transform(this.group1.controls.datepicker.value||"","YYYY-MM-dd")||"";
      let income_id=this.data.element.income_id;
        this.incomeService.UpdateIncome({amount:parseFloat(amount),date_in:date,income_id:income_id}).subscribe(response=>{
         if(response.success){
          this.responseWork=true;
          this.incomeService.readObservableEditDiaolot().next(response);
         }
         setTimeout(()=>{
          this.responseWork=!this.responseWork;
         },3000);
        },error=>{
          this.dataError=error.error.message;
          this.errorOuccers=true;
          setTimeout(()=>{
            this.errorOuccers=!this.errorOuccers;
           },3000);
        });
    }
   
  } 
  onNoClick(): void {
    this.dialogRef.close();
  }
}