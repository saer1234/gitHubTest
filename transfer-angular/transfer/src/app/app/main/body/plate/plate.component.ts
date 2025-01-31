import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { PlateService } from '../../../../service/plate.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { KitchenService } from '../../../../service/kitchen.service';
import {MatDividerModule} from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { response } from 'express';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AddPlateComponent } from '../../../../dialog/add-plate/add-plate.component';
import { EditPlateComponent } from '../../../../dialog/edit-plate/edit-plate.component';
import { error } from 'console';
import { AddContainPlateComponent } from '../../../../dialog/add-contain-plate/add-contain-plate.component';
import {v4 } from 'uuid'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-plate',
  standalone: true,
  imports: [MatPaginatorModule,MatDatepickerModule,MatIconModule,MatDividerModule,MatFormFieldModule, MatInputModule, MatTableModule,CommonModule,FormsModule, MatFormFieldModule,MatAutocompleteModule,ReactiveFormsModule,AsyncPipe,MatButtonModule],
  templateUrl: './plate.component.html',
  styleUrl: './plate.component.css'
})
export class PlateComponent implements OnInit {
  myControl = new FormControl('');
  options: {kitchen_id:string,kitchen_name:string,date:string}[] = [];
  filteredOptions!: Observable<{kitchen_id:string,kitchen_name:string,date:string}[]>;
  myControl1 = new FormControl('');
  options1: {plate_id:string,plate_name:string,date:string}[] = [];
  filteredOptions1!: Observable<{plate_id:string,plate_name:string,date:string}[]>;
  myControl2 = new FormControl('');
  options2: {kitchen_id:string,kitchen_name:string,date:string}[] = [];
  filteredOptions2!: Observable<{kitchen_id:string,kitchen_name:string,date:string}[]>;
  kitchen_id!:string;
  plate_id!:string;
  dataPlatOut:{kitchen_id:string,date_in:string,date_out:string}
  formControlDate1Search = new FormControl('');
  formControlDate2Search = new FormControl('');
  constructor(){
    this.dataPlatOut={kitchen_id:"",date_in:"",date_out:""};
    this.readKitchen();
    this.readKitchenSecondInput();
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns2: string[] = ['position', 'name', 'kitchen_name','weight',"date"];
  displayedColumns3: string[] = ['position', 'name', 'weight'];
  dataSource!:any;
  dataSource2!:any;
  dataSource3!:any;
  dataSource4!:any;
  dataSource5!:any;
  listPlateLocal:any=[];
  loadingSend:boolean=false;
  @ViewChild(MatPaginator) paginater!: MatPaginator;
  @ViewChild("paginator2") paginater2!: MatPaginator;
  @ViewChild("paginator3") paginater3!: MatPaginator;
  @ViewChild("paginator4") paginater4!: MatPaginator;
  @ViewChild("paginator5") paginater5!: MatPaginator;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }
  applyFilter4(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource4.filter = filterValue.trim().toLowerCase();
  }

  applyFilter5(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource5.filter = filterValue.trim().toLowerCase();
  }


  private _filter(value: string): {kitchen_id:string,kitchen_name:string,date:string}[] {
    const filterValue = value.toLowerCase();
    let result =this.options.filter(option => option.kitchen_name.toLowerCase().includes(filterValue));
    this.kitchen_id=result.length? result[0].kitchen_id : '0';
    return result;
  }
  private _filter1(value: string): {plate_id:string,plate_name:string,date:string}[] {
    const filterValue = value.toLowerCase();
    let result =this.options1.filter(option => option.plate_name.toLowerCase().includes(filterValue));
    this.plate_id=result.length? result[0].plate_id : '0';
    return result;
  }

  private _filter2(value: string): {kitchen_id:string,kitchen_name:string,date:string}[] {
    const filterValue = value.toLowerCase();
    let result =this.options2.filter(option => option.kitchen_name.toLowerCase().includes(filterValue));
    this.dataPlatOut.kitchen_id= result.length>0? result[0].kitchen_id : "0";
    return result;
  }
ngOnInit(): void {
this.readContainPlate();
this.readPlate();
this.ListenereAddNewPlateDialog();
this.ListenerEditPlateDialog();
this.ListenerAddContainDilaog();
}
readContainPlate(){
  this.plateServier.readPlate().subscribe((res:any)=>{
    if(res.success==true)
      this.dataSource2 = new MatTableDataSource(res.data);
      this.dataSource2.paginator= this.paginater2;
   });
}
readPlate(){
  this.plateServier.readPlate_only().subscribe((res:any)=>{
    if(res.success==true){
      this.editDate(res.data);
      this.dataSource= new MatTableDataSource(res.data);
      this.dataSource.paginator=this.paginater;
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
readKitchen(){
  this.kitche.readKitchen().subscribe(response=>{
    this.ngZone.run(()=>{
      if(response.success==true){
        this.options=response.data;
         // auto compilet 
 this.filteredOptions = this.myControl.valueChanges.pipe(
  startWith(''),
  map(value => this._filter(value || '')),
);
    }
    })
  });
}
readKitchenSecondInput(){
  this.kitche.readKitchen().subscribe(response=>{
    this.ngZone.run(()=>{
      if(response.success==true){
        this.options2=response.data;
         // auto compilet 
 this.filteredOptions2 = this.myControl2.valueChanges.pipe(
  startWith(''),
  map(value => this._filter2(value || '')),
);
this.setListenerDatePickerTwoOut()
    }
    })
  });
}

setListenerDatePickerTwoOut(){
this.formControlDate1Search.valueChanges.subscribe(value=>{
  let d1= this.datePipe.transform(value,"YYYY-MM-dd");
  this.dataPlatOut.date_in=d1 || "";
});
this.formControlDate2Search.valueChanges.subscribe(value=>{
  let d1= this.datePipe.transform(value,"YYYY-MM-dd");
  this.dataPlatOut.date_out=d1 || "";
});
}

saveDaTa(amount:any,plate_name:any,kitchen_name:any,datePicker:HTMLInputElement){
  if(plate_name.value!="" && kitchen_name.value!=""&&datePicker.value!=""){
    let d1 = this.datePipe.transform(datePicker.value,"YYYY-MM-dd");
    let r1= this.listPlateLocal.filter((option:any)=>option.kitchen_id==this.kitchen_id&&option.plate_id==this.plate_id&&option.date==d1);
  if(r1.length>0){
    r1[0].number =parseFloat(amount.value)+parseFloat(r1[0].number);
  }else{
    this.listPlateLocal.push({date:d1,kitchen_name:kitchen_name.value,plate_name:plate_name.value,kitchen_id:this.kitchen_id,plate_id:this.plate_id,number:parseFloat(amount.value)});
  }
  this.dataSource3= new MatTableDataSource(this.listPlateLocal);
  this.dataSource3.paginator=this.paginater3;
  }else{
    this.snackBar.open("Fill kitchen and plate name","close");
  }
}
clearData(){
  this.listPlateLocal = [];
  this.dataSource3 = new MatTableDataSource(this.listPlateLocal);
  this.dataSource3.paginator=this.paginater3;
}
sendDataToApi(){
  this.loadingSend=true;
  setTimeout(()=>{
    if(this.listPlateLocal.length!=0)
      this.listPlateLocal[0].token=v4();
    this.plateServier.sendPlateOut(this.listPlateLocal).subscribe(res=>{
      if(res.success==true){
        this.clearData();
        this.snackBar.open(res.data.data,"close");
      }
      this.loadingSend=false;
    },error=>{
      if(error.error.message=="duplicated"){
        this.plateServier.readToken(this.listPlateLocal[0].token).subscribe((response:any)=>{
          if(response.data.success==false)
              {
                this.clearData();
              this.snackBar.open("Insert Well","close");
              }else{
                this.snackBar.open("Not send it yeat ","close");
              }
              this.loadingSend=false;
        })
      }else{
        this.snackBar.open(error.error.message,"close");
        this.loadingSend=false;
      }
    });

  },1000);
}
saerch(){
  if(this.dataPlatOut.date_in!=""&&this.dataPlatOut.date_out!=""&&this.dataPlatOut.kitchen_id!="")
  {
    this.snackBar.dismiss();
    this.plateServier.readPlateOut(this.dataPlatOut).subscribe(response=>{
      for(let x of response.data){
        x.date_out= this.datePipe.transform(x.date_out,"YYYY-MM-dd")+"";
      }
        this.dataSource4= new MatTableDataSource(response.data);
        this.dataSource4.paginator=this.paginater4;
       this.showTotalPlateInSum(response.data);
    },error=>{
      
    });
  }else{
    this.snackBar.open("you should filed date picker and kitchen name","close");
  }
}
showTotalPlateInSum(data:{plate_out: string;plate_id: string;kitchen_id: string;number: number;date: string;date_out: string;plate_name: string;}[]){
  let localList : {plate_out: string;plate_id: string;kitchen_id: string;number: number;date: string;date_out: string;plate_name: string;}[]= [];
  let LocalData:{plate_out: string;plate_id: string;kitchen_id: string;number: number;date: string;date_out: string;plate_name: string;}[]=[];
    data.forEach(val=>LocalData.push(Object.assign({},val)));
  for(let x of LocalData){
    let mr=localList.filter(res=>res.plate_id==x.plate_id);
    if(mr.length!=0){
      localList.filter(res=>res.plate_id==x.plate_id)[0].number=mr[0].number+x.number;
    }else{
      localList.push(x);
    }
  }
  this.dataSource5 = new MatTableDataSource(localList);
  this.dataSource5.paginator= this.paginater5;
  }

ListenereAddNewPlateDialog(){
  this.plateServier.readDailogAddNew().asObservable().subscribe((response:any)=>{
    if(response.success==true){
      this.readPlate();
    }
  })
}
ListenerEditPlateDialog(){
  this.plateServier.readDialogEditDialogPlate().asObservable().subscribe((response:any)=>{
    if(response.success==true)
      this.readPlate();
  });
}
deletePlate(id:number){
  this.plateServier.deletePlateO(id).subscribe((response:any)=>{
    if(response.success=true){
      this.readPlate();
      this.snackBar.open("Delete Successfully done");
      setTimeout(()=>{
        this.snackBar.dismiss();
      },3000);
    }
  },error=>{
    this.snackBar.open(error.error.message,"close");
  });

}
ListenerAddContainDilaog(){
  this.plateServier.readContainSubjectDialog().asObservable().subscribe((response:any)=>{
    if(response.success==true){
      this.readContainPlate();
    }
  })
}
addPlate(){
      this.dialog.open(AddPlateComponent);
}
openEditPlate(data:any){
  this.dialog.open(EditPlateComponent,{data:data});
}

addContent(){
  this.dialog.open(AddContainPlateComponent);
}

deleteRealtion(id:number){
  this.plateServier.deleteContain(id).subscribe((response:any)=>{
    if(response.success==true){
      this.readContainPlate();
      this.snackBar.open("Successfully Deleted","close");
      setTimeout(()=>{
        this.snackBar.dismiss()
      },2000);
    }
  },error=>{
    this.snackBar.open(error.error.message,"close");
    setTimeout(()=>{
      this.snackBar.dismiss()
    },2000);
  })
}

readElement(element:any){
  console.log(element);
}
private plateServier=inject(PlateService);
private kitche= inject(KitchenService)
private ngZone=inject(NgZone);
private snackBar= inject(MatSnackBar);
private datePipe= inject(DatePipe);
private dialog= inject(MatDialog)
editDate(data:any){
  for(let x of data){
    x.date=this.datePipe.transform(x.date,"YYYY-MM-dd");
  }
}
deleteLocalData(index:number){
  let i = this.paginater3.pageSize*this.paginater3.pageIndex+index;
  this.listPlateLocal.splice(i,1);
  this.dataSource3= new MatTableDataSource(this.listPlateLocal);
  this.dataSource3.paginator=  this.paginater3;
}
}
