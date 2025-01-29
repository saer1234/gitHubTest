import { Component, inject, model, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ItemComponent } from '../../app/main/body/item/item.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ItemService } from '../../service/item.service';
import { response } from 'express';
import { CommonModule, DatePipe } from '@angular/common';


export interface DialogData {
  item_name: string;
  unit: string;
  date:string;
  item_id:number;
}

@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [MatFormFieldModule,CommonModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './item-dialog.component.html',
  styleUrl: './item-dialog.component.css'
})
export class ItemDialogComponent{
  errorBoolean:boolean=false;
  successBoolean:boolean=false;
  readonly dialogRef = inject(MatDialogRef<ItemDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  loading:boolean=true;
  editOrInsert:boolean=false;
  constructor(private itemser:ItemService,private dateP:DatePipe){
    if(this.data.item_name=="")
    {  
      this.editOrInsert=true;
    }else{
      this.editOrInsert=false;
    }
    console.log(this.editOrInsert)
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
  sendData() :void{                                                                              
    this.errorBoolean=false;
    this.successBoolean=false;
    this.loading=false;
   setTimeout(()=>{
    let x= this.data;
    x.date=this.dateP.transform(x.date,"YYYY-MM-dd")+"";
    this.itemser.editItems(x).subscribe(response=>{
      if(response.success==true){
          this.itemser.readDataUpdate().next(response);
          this.successBoolean=true;
      }else{
        this.errorBoolean=true;
      }
      this.loading=true;
    });
   },1000);
  }
  inserData():void{
    this.errorBoolean=false;
    this.successBoolean=false;
    this.loading=false;
    setTimeout(()=>{
      let x= this.data;
      x.date=this.dateP.transform(x.date,"YYYY-MM-dd")+"";
      this.itemser.insertItems(x).subscribe(response=>{
        if(response.success==true){
          this.itemser.readDataUpdate().next(response);
          this.successBoolean=true;
        }else{
          this.errorBoolean=true;
        }
        this.loading=true;
      });
    },1000);
  }
}
