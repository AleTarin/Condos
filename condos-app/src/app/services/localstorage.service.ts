import { Injectable } from '@angular/core';

@Injectable()
export class LocalstorageService {

  constructor() { }

  public saveToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getfromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }


}
