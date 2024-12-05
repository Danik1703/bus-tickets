import { Component, OnInit } from '@angular/core';
import { SuccessMessageService } from '../services/success-message.service';
import { BusService } from '../services/bus.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-bus-service',
  templateUrl: './bus-service.component.html',
  styleUrls: ['./bus-service.component.scss'],
})
export class BusServiceComponent implements OnInit {
  busSchedules: any[] = [];
  reviews = [
    { text: 'Отличный сервис!', author: 'Анна' },
    { text: 'Очень удобно и быстро.', author: 'Иван' },
    { text: 'Лучшие цены на рынке!', author: 'Мария' },
    { text: 'Путешествую с вами постоянно. Рекомендую!', author: 'Дмитрий' }
  ];
  filters = { from: '', to: '', date: '', price: 0 };
  buses = [
    { route: 'Киев - Львов', price: 50, image: 'assets/photo/bus1.jpg' },
    { route: 'Одесса - Киев', price: 40, image: 'assets/photo/bus2.jpg' },
    { route: 'Харьков - Киев', price: 60, image: 'assets/photo/bus3.jpg' },
  ];
  filteredBuses = [...this.buses];
  cartItems: any[] = [];
  totalAmount: number = 0;
  successMessage: string = '';
  popularDestinations = [
    { route: 'Київ', price: 700, image: 'assets/photo/kiev.jpg', description: 'Погрузитесь в историю и культуру столицы Украины!' },
    { route: 'Лондон', price: 450, image: 'assets/photo/london.jpg', description: 'Наслаждайтесь путешествием в столицу Великобритании!' },
    { route: 'Париж', price: 500, image: 'assets/photo/italy.jpg', description: 'Откройте для себя романтику французской столицы!' },
    { route: 'Мадрид', price: 600, image: 'assets/photo/madrid.jpg', description: 'Испанская страсть и культура на каждом шагу!' },
    { route: 'Варшава', price: 200, image: 'assets/photo/warsawa.jpg', description: 'Чудесная польская столица с богатой историей.' },
    { route: 'Барселона', price: 150, image: 'assets/photo/barselona.jpg', description: 'Испанская культура и архитектура в одном из самых красивых городов Европы.' }
  ];

  destinations: { name: string, prettyName: string, coordinates: [number, number] }[] = [
    { name: 'Киев', prettyName: 'Киев', coordinates: [50.4501, 30.5234] },
    { name: 'Львов', prettyName: 'Львов', coordinates: [49.8397, 24.0297] },
    { name: 'Одесса', prettyName: 'Одесса', coordinates: [46.4825, 30.7326] },
    { name: 'Харьков', prettyName: 'Харьков', coordinates: [49.9935, 36.2304] },
  ];

  constructor(private busService: BusService, private successMessageService: SuccessMessageService) {}

  ngOnInit(): void {
    this.initializeMap();

    this.busService.getBusSchedule().subscribe((data) => {
      this.busSchedules = data;
      this.filteredBuses = [...this.buses];
    });

    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.calculateTotal();
    }

    this.successMessageService.message$.subscribe((message) => {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = ''; 
      }, 2000);
    });
  }

  addToCart(route: string, price: number, image: string): void {
    const newItem = { route, price, image };
    this.cartItems.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();
    this.successMessageService.sendMessage(`Маршрут "${route}" добавлен в корзину!`);
  }

  applyFilters(): void {
    this.filteredBuses = this.buses.filter((bus) => {
      return (
        (!this.filters.from || bus.route.includes(this.filters.from)) &&
        (!this.filters.to || bus.route.includes(this.filters.to)) &&
        (!this.filters.price || bus.price <= this.filters.price)
      );
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  bookTicket(schedule: any): void {
    alert(`Билет на рейс ${schedule.route} забронирован!`);
  }

  initializeMap(): void {
    const map = L.map('map', {
      center: [50.4501, 30.5234],
      zoom: 6,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const cityIcons: { [key: string]: string } = {
      'Киев': 'assets/photo/marker-kiev.jpg',
      'Львов': 'assets/photo/marker-lviv.jpg',
      'Одесса': 'assets/photo/marker-odessa.jpg',
      'Харьков': 'assets/photo/marker-kharkiv.jpg',
    };

    this.destinations.forEach((destination) => {
      const iconUrl = cityIcons[destination.name];
      const cityIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [0, -36],
      });

      if (destination.coordinates && destination.coordinates.length === 2) {
        const [lat, lng] = destination.coordinates;
        L.marker([lat, lng], { icon: cityIcon })
          .addTo(map)
          .bindPopup(`
            <div class="popup-content">
              <h4>${destination.prettyName}</h4>
              <p>Отправляйтесь в путешествие на автобусе!</p>
            </div>
          `);
      } else {
        console.error('Invalid coordinates for destination:', destination);
      }
    });
  }
}
