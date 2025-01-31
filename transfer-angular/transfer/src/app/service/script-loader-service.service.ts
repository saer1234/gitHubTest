import { Injectable, OnInit } from '@angular/core';
import { error } from 'node:console';
import { resolve } from 'node:dns/promises';


@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderServiceService {
  private script:any= {};
  constructor() { 

  }
  loadScript(id:string,src:string){
    return new Promise((resolve,rejects)=>{
      if(this.script[id]){
        resolve({id});
        return;
      }
      const script = document.createElement("script");
      script.id=id;
      script.src=src;
      script.type="text/javascript";
      script.onload=()=>{
        this.script[id]=true;
        resolve({id});
    };
    script.onerror= (error:any)=>rejects(error);
    document.head.appendChild(script);
  });

   
  }


}
