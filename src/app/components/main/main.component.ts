import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  title = 'Main Component';


  openModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
      modal.style.display = 'flex'; 
    }
  }

 
  closeModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
      modal.style.display = 'none'; 
    }
  }


  processPayment() {
  
    alert('Оплата выполнена!');
    this.closeModal(); 
  }
}


