import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './service/login.service';


export const authGuard: CanActivateFn = (route, state) => {
  
 const los = new LoginService();
 const router = new Router();
 if(!los.checkToken())
 router.navigate(["/"]);
  return los.checkToken();

};
