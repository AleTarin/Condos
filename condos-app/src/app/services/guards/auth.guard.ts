import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';
import { LocalstorageService } from '../localstorage.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private storage: LocalstorageService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.alreadyLoggedIn(state.url);
  }

  alreadyLoggedIn(urlToNavigate: string): boolean {
    if (!! this.storage.getfromLocalStorage('currentUser')) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
