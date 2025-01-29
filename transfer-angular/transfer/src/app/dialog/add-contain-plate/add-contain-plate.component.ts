import { Component, inject, model, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogData } from '../item-dialog/item-dialog.component';
import {  MatAutocompleteModule, MatOption } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { KitchenService } from '../../service/kitchen.service';
import { PlateService } from '../../service/plate.service';
import { MatTableDataSource } from '@angular/material/table';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ItemService } from '../../service/item.service';
import { response } from 'express';

@Component({
  selector: 'app-add-contain-plate',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatAutocompleteModule,MatOption,ReactiveFormsModule,AsyncPipe,CommonModule],
  templateUrl: './add-contain-plate.component.html',
  styleUrl: './add-contain-plate.component.css'
})
export class AddContainPlateComponent {
constructor(){
  this.readKitchen();
    this.readPlate();
}
  private kitche= inject(KitchenService);
  private items= inject(ItemService);
  private plateServier=inject(PlateService);
  readonly dialogRef = inject(MatDialogRef<AddContainPlateComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  myControl = new FormControl('');
  options: {
    item_id: number;
    unit: string;
    date: string;
    item_name: string;
}[] = [];
  filteredOptions!: Observable<{
    item_id: number;
    unit: string;
    date: string;
    item_name: string;
}[]>;
  myControl1 = new FormControl('');
  options1: {plate_id:string,plate_name:string,date:string}[] = [];
  filteredOptions1!: Observable<{plate_id:string,plate_name:string,date:string}[]>;
  private kitchen_id:string='';
  private plate_id:string='';
  dataSource: any;
  ngZone= inject(NgZone);
   responseWork:boolean= false;
   errorOuccers:boolean=false;
  dataError:string='';
  
  private _filter(value: string): {
    item_id: number;
    unit: string;
    date: string;
    item_name: string;
}[] {
    const filterValue = value.toLowerCase();
    let result =this.options.filter(option => option.item_name.toLowerCase().includes(filterValue));
    this.kitchen_id= result.length? result[0].item_id.toString():'0';
    return result;
  }
  private _filter1(value: string): {plate_id:string,plate_name:string,date:string}[] {
    const filterValue = value.toLowerCase();
    let result =this.options1.filter(option => option.plate_name.toLowerCase().includes(filterValue));
    this.plate_id= result.length?result[0].plate_id : '0';
    return result;
  }

  readPlate(){
    this.plateServier.readPlate_only().subscribe((res:any)=>{
      if(res.success==true){
        this.editDate(res.data);
        this.dataSource= new MatTableDataSource(res.data);
      }
      this.ngZone.run(()=>{
          this.options1=res.data;
           // auto compilet 
   this.filteredOptions1 = this.myControl1.valueChanges.pipe(
    startWith(''),
    map(value => this._filter1(value || '')),
  );
      })
    })
  }
  editDate(data: any) {

  }
  readKitchen(){
    this.items.readItems().subscribe(response=>{
      this.ngZone.run(()=>{
        if(response.success==true){
          this.options=response.data;
           // auto compilet 
   this.filteredOptions = this.myControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value || '')),
  );
      }
      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  SendData(amount:string){
    this.responseWork= false;
   this.errorOuccers=false;
    this.plateServier.addNewContainPlat({plate_id:parseInt(this.plate_id),item_id:parseInt(this.kitchen_id),amount:parseFloat(amount)}).subscribe((response:any)=>{
      if(response.success==true){
        this.responseWork=true;
        this.plateServier.readContainSubjectDialog().next(response);
      }
      setTimeout(()=>this.responseWork=false,2000);
    },error=>{
        this.dataError=error.error.message;
        this.errorOuccers=true;
        setTimeout(()=>this.errorOuccers=false,2000);
    });
  }
}
