import { Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimpleAlertService {

  isOpenedModal = false 
  message = "test"

  constructor() { }

  closeModal() {
    this.isOpenedModal = false;
  }
}
