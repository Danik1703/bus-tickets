import { Component, OnInit } from '@angular/core';
import { SuccessMessageService } from '../services/success-message.service';
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
  successMessage: string = '';  

  constructor(private busService: BusService, private successMessageService: SuccessMessageService) {}

  ngOnInit(): void {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.calculateTotal();
    }


    this.busService.getBusSchedule().subscribe((data) => {
      this.busSchedules = data;
    });

    
    this.successMessageService.message$.subscribe((message) => {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = ''; 
      }, 2000);
    });
  }


  addToCart(route: string, price: string, image: string): void {
    const newItem = { route, price: parseFloat(price.replace('$', '')), image };
    this.cartItems.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();

 
    this.successMessageService.sendMessage(`Билет "${route}" добавлен в корзину!`);
  }


  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

 
  bookTicket(schedule: any): void {
    alert(`Билет на рейс ${schedule.route} забронирован!`);
  }
}
