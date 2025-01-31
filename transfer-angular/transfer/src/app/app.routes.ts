import { Routes } from '@angular/router';
import { MainComponent } from './app/main/main.component';
import { AccountComponent } from './app/main/body/account/account.component';
import { HomeComponent } from './app/main/body/home/home.component';
import { AddqanutityComponent } from './app/main/body/addqanutity/addqanutity.component';
import { InventoryComponent } from './app/main/body/inventory/inventory.component';
import { ItemComponent } from './app/main/body/item/item.component';
import { RemovequantityComponent } from './app/main/body/removequantity/removequantity.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { guardLoginGuard } from './guard-login.guard';
import { PlateComponent } from './app/main/body/plate/plate.component';

export const routes: Routes = [{path:"",component:LoginComponent,canActivate:[guardLoginGuard]},{canActivate:[authGuard],path:"main",component:MainComponent,children:[{path:"account",component:AccountComponent},{path:"",component:HomeComponent},{path:"quantity",component:AddqanutityComponent},{path:"inventory",component:InventoryComponent},{path:"item",component:ItemComponent},{path:"outquantity",component:RemovequantityComponent},{path:"plate",component:PlateComponent}]}];
