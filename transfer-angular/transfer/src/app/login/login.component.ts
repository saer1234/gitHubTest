import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ScriptLoaderServiceService } from '../service/script-loader-service.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginService, loginUser } from '../service/login.service';
import {  Router } from '@angular/router';
import { ButtonLoadingComponent } from '../button-loading/button-loading.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,ButtonLoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit,OnDestroy{
  checkFrom:any;
  invese:boolean=true;
  showLoading:boolean=false;
  constructor(private routes:Router,private formGrupe:FormBuilder,private scriptLoaderService:ScriptLoaderServiceService,private render:Renderer2,private loginService:LoginService){
    this.checkFrom=this.formGrupe.group({
      username:'',
      password:''
    })
  }
  ngOnDestroy(): void {
    this.render.removeStyle(document.body,"background");
  }
  ngOnInit(): void {
    this.render.setStyle(document.body,"background",'linear-gradient(90deg, #C7C5F4, #776BCC)');
  }
  checkLogin():void{
    this.invese=true;
    this.showLoading=true;
    let v1:loginUser = this.checkFrom.value;
    setTimeout(()=>{
      this.loginService.checkLogin(v1).subscribe((response:any)=>{
        this.showLoading=false;
        if(response.success){
          this.invese=true;
          localStorage.setItem(LoginService.Token(),JSON.stringify(response));
          this.routes.navigate(["/main"]);
        }
      },error=>{
        this.invese=false;
        this.showLoading=false;
        console.log(error.error);
      });
    },1000);
  }

}
