import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'  
})
export class SuccessMessageService {
  private messageSource = new Subject<string>();  
  message$ = this.messageSource.asObservable();

  sendMessage(message: string): void {
    this.messageSource.next(message);
  }
}
