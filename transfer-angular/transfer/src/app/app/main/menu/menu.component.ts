import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, input, NgZone, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { LoginService, loginUser } from '../../../service/login.service';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
 listArray: any =[{name:"/main",display:false},{name:"/main/item",display:false},{name:"/main/plate",display:false},{name:"/main/quantity",display:false},{name:"/main/outquantity",display:false},{name:"/main/inventory",display:false},{name:"/main/account",display:false}];
chekck:boolean=true;
 constructor(private router:Router,private cdf:ChangeDetectorRef,private ng:NgZone,private account:LoginService){
  this.router.events.pipe(filter(events=>events instanceof NavigationEnd)).subscribe((event:NavigationEnd)=>{
      for(let x of this.listArray){
        if(x.name==event.url){
          x.display=true;
        }
        else
        x.display=false;
      }

      })

  }
  ngOnInit(): void {
 
  }
  logOut():void{
    this.account.logoutFn();
  }

 

}
