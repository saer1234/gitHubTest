import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PlateService } from '../../service/plate.service';

@Component({
  selector: 'app-add-plate',
  standalone: true,
  imports: [ MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,CommonModule],
  templateUrl: './add-plate.component.html',
  styleUrl: './add-plate.component.css'
})
export class AddPlateComponent {
  readonly dialogRef = inject(MatDialogRef<AddPlateComponent>);
  private datePip= inject(DatePipe);
  private pateService= inject(PlateService);
  responseWork:boolean=false;
  errorOuccers:boolean=false;
  dataError:string="";
  dataP= new FormGroup({
    plate_name:new FormControl('',[Validators.required]),
    date:new FormControl('',[Validators.required])
  });

  constructor(){

  }
  animal(){
  
  }

  sendData(){
    this.errorOuccers=false;
    this.responseWork=false;
    if(this.dataP.valid)
   { 
      setTimeout(()=>{

        let date=  this.datePip.transform(this.dataP.controls.date.value,"YYYY-MM-dd");
        this.dataP.controls.date.setValue(date);
        this.pateService.addNewPlate({plate_name:this.dataP.controls.plate_name.value,date:this.dataP.controls.date.value}).subscribe((response:any)=>{
            if(response.success==true){
              this.responseWork=true; 
              this.pateService.readDailogAddNew().next(response);
            }
        },error=>{
          this.dataError=error.error.message
          this.errorOuccers=true;
        });

     },1000
    )}
  }
}
