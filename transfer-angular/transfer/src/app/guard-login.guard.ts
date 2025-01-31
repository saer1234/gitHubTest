import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './service/login.service';

export const guardLoginGuard: CanActivateFn = (route, state) => {

  const login = new LoginService();
  const router= new Router();
  if(login.checkToken())
    router.navigate(["/main"]);
  return !login.checkToken();
};
