import { Component, OnInit } from '@angular/core';
import { BusService } from '../services/bus.service';

@Component({
  selector: 'app-bus-service',
  templateUrl: './bus-service.component.html',
  styleUrls: ['./bus-service.component.scss']
})
export class BusServiceComponent implements OnInit {
  busSchedules: any[] = [];
  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private busService: BusService) {}

  ngOnInit(): void {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.calculateTotal();
    }

    this.busService.getBusSchedule().subscribe((data) => {
      this.busSchedules = data;
    });
  }

  // Метод для добавления билета в корзину
  addToCart(route: string, price: string, image: string): void {
    const newItem = { route, price: parseFloat(price.replace('$', '')), image };
    this.cartItems.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();
    alert(`Билет "${route}" добавлен в корзину!`);
  }

  // Метод для подсчета общей суммы
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  // Метод для бронирования билета (по аналогии с вашим примером)
  bookTicket(schedule: any): void {
    alert(`Вы забронировали билет на рейс: ${schedule.route}`);
  }
}
