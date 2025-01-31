import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogData } from '../item-dialog/item-dialog.component';
import { PlateService } from '../../service/plate.service';
import { response } from 'express';

@Component({
  selector: 'app-edit-plate',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,CommonModule],
  templateUrl: './edit-plate.component.html',
  styleUrl: './edit-plate.component.css'
})
export class EditPlateComponent  implements OnInit{
ngOnInit(): void {
    this.data.controls.plate_name.setValue(this.dialogData.plate_name);
    this.data.controls.date.setValue(this.dialogData.date);
}
readonly data = new FormGroup({plate_name:new FormControl('',[]),date:new FormControl('',[])});
readonly dialogRef= inject(MatDialogRef<EditPlateComponent>);
readonly dialogData= inject<{plate_name:string,date:string,plate_id:number}>(MAT_DIALOG_DATA);
 responseWork:boolean=false;
 errorOuccers:boolean=false;
 dataError:string="";
 private plateService= inject(PlateService);
 private pipDate= inject(DatePipe);
editData(){
  this.responseWork=false;
  this.errorOuccers=false;
 this.data.controls.date.setValue(this.pipDate.transform(this.data.controls.date.value,"YYYY-MM-dd"));
  let DataEdit= {plate_name:this.data.controls.plate_name.value,date:this.data.controls.date.value,plate_id:this.dialogData.plate_id};
  this.plateService.editPlateO(DataEdit).subscribe((response:any)=>{
    if(response.success==true){
      this.responseWork=true;
      this.plateService.readDialogEditDialogPlate().next(response);
      setTimeout(()=>{
        this.responseWork=false;
        this.errorOuccers=false;
      },2000);
    }
  },error=>{
    this.errorOuccers=true;
    this.dataError=error.error.message;
    setTimeout(()=>{
      this.responseWork=false;
      this.errorOuccers=false;
    },2000);
  });
}
}
