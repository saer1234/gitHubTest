import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { items, ItemService, singelItem } from '../../../../service/item.service';
import { DatePipe } from '@angular/common';
import { ItemDialogComponent } from '../../../../dialog/item-dialog/item-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-item',
  standalone: true,
  imports: [MatPaginatorModule,MatFormFieldModule, MatInputModule, MatTableModule,MatButtonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemComponent implements OnInit {
  constructor(private itemService:ItemService,private datePipe:DatePipe,private dialogRef:MatDialog,private snack:MatSnackBar){

  }
  @ViewChild(MatPaginator) paginator!:MatPaginator;

  
  ngOnInit(): void {
    this.readItemIni();
    this.itemService.readDataUpdate().asObservable().subscribe(response=>{
     if(response.success==true)
      this.readItemIni();
    })
  }
  readItemIni(){
    this.itemService.readItems().subscribe(response=>{
      for(let mr of response.data){
          mr.date=this.changeDate(mr.date);
      }
      
        this.dataSource = new MatTableDataSource<{item_id:number;unit:string;date:string;item_name:string;}>(response.data);
        this.dataSource.paginator= this.paginator;
    });
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','action'];
  dataSource!:any;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  addItem():void{
    const dos=this.dialogRef.open(ItemDialogComponent,{data:{item_name: "", unit: "",item_id:null,date:""},height: '500px',
      width: '400px',});
  }
  changeDate(date:string):any{
    let  x= new Date(date);
    return this.datePipe.transform(x,"yyyy-MM-dd");
  }

  openDialogEdit(element:any){
    const dos=this.dialogRef.open(ItemDialogComponent,{data:{item_name: element.item_name, unit: element.unit,item_id:element.item_id,date:element.date},height: '500px',
      width: '400px',});
      dos.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }
  deleteItems(element:singelItem):void{
      this.itemService.deleteItems(element).subscribe(response=>{
        if(response.success==true){
            this.readItemIni();
            this.snack.open("Delete Completed","Close");
        }else
        this.snack.open(response.message,"Close");
      },error=>{
            this.snack.open(error.error.message,"Close");
      })
  }
}
