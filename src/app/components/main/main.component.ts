import { Component, OnInit } from '@angular/core';
import { BusServiceComponent } from 'src/app/bus-service/bus-service.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  successMessage: string = '';

  constructor() {}

  ngOnInit(): void {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.calculateTotal();
    }
  }

  addToCart(route: string, price: string, image: string): void {
    const newItem = { route, price: parseFloat(price.replace('$', '')), image };
    this.cartItems.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();
    this.showSuccessMessage(`Билет "${route}" добавлен в корзину!`);
  }

  openModal(): void {
    const modal = document.getElementById('cart-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  closeModal(): void {
    const modal = document.getElementById('cart-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  processPayment(): void {
    alert('Оплата выполнена!');
    this.cartItems = [];
    localStorage.removeItem('cartItems');
    this.totalAmount = 0;
    this.closeModal();
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
