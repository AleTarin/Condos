import { Injectable } from '@angular/core';

@Injectable()
export class LocalstorageService {

  constructor() { }

  public saveToLocalStorage(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  public getfromLocalStorage(key: string) {
    return JSON.parse(sessionStorage.getItem(key));
  }


}
