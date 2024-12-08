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

  filters = { from: '', to: '', date: '', price: 0, busType: '', sortOrder: 'asc' };
  
  buses = [
    { route: 'Париж', price: 500, image: 'assets/photo/italy.jpg', description: 'Откройте для себя романтику французской столицы!', type: 'luxury' },
    { route: 'Лондон', price: 450, image: 'assets/photo/london.jpg', description: 'Наслаждайтесь путешествием в столицу Великобритании!', type: 'regular' },
    { route: 'Мадрид', price: 600, image: 'assets/photo/madrid.jpg', description: 'Испанская страсть и культура на каждом шагу!', type: 'regular' },
    { route: 'Варшава', price: 200, image: 'assets/photo/warsawa.jpg', description: 'Чудесная польская столица с богатой историей.', type: 'luxury' },
    { route: 'Барселона', price: 150, image: 'assets/photo/barselona.jpg', description: 'Испанская культура и архитектура в одном из самых красивых городов Европы.', type: 'regular' }
  ];

  selectedRoute: any = null;
  filteredBuses = [...this.buses];
  successMessage: string = '';
  combinedDestinations: any[] = [];
  showRouteImage = false;

  destinations: { name: string, prettyName: string, coordinates: [number, number], images: string[], description: string, price: number }[] = [
    { name: 'Київ', prettyName: 'Київ', coordinates: [50.4501, 30.5234], images: ['assets/photo/kiev.jpg', 'assets/photo/kiev.jpg'], description: 'Київ – культурное и историческое сердце Украины.', price: 700 },
    { name: 'Лондон', prettyName: 'Лондон', coordinates: [51.5074, -0.1278], images: ['assets/photo/london.jpg', 'assets/photo/london.jpg'], description: 'Лондон – столица Великобритании, известная своими музеями и историческими памятниками.', price: 450 },
    { name: 'Париж', prettyName: 'Париж', coordinates: [48.8566, 2.3522], images: ['assets/photo/paris.jpg', 'assets/photo/paris.jpg'], description: 'Париж – город любви и искусства.', price: 500 },
    { name: 'Мадрид', prettyName: 'Мадрид', coordinates: [40.4168, -3.7038], images: ['assets/photo/madrid.jpg', 'assets/photo/madrid.jpg'], description: 'Мадрид – душа Испании с богатой культурой и историей.', price: 600 },
    { name: 'Варшава', prettyName: 'Варшава', coordinates: [52.2298, 21.0118], images: ['assets/photo/warsawa.jpg', 'assets/photo/warsawa.jpg'], description: 'Варшава – столица Польши, с древней историей и современным обликом.', price: 200 },
    { name: 'Барселона', prettyName: 'Барселона', coordinates: [41.3784, 2.1926], images: ['assets/photo/barselona.jpg', 'assets/photo/barselona.jpg'], description: 'Барселона – город уникальной архитектуры и яркой культуры.', price: 150 }
  ];

  popularDestinations = [
    { route: 'Київ', price: 700, image: 'assets/photo/kiev.jpg', description: 'Погрузитесь в историю и культуру столицы Украины!' },
    { route: 'Лондон', price: 450, image: 'assets/photo/london.jpg', description: 'Наслаждайтесь путешествием в столицу Великобритании!' },
    { route: 'Париж', price: 500, image: 'assets/photo/italy.jpg', description: 'Откройте для себя романтику французской столицы!' },
    { route: 'Мадрид', price: 600, image: 'assets/photo/madrid.jpg', description: 'Испанская страсть и культура на каждом шагу!' },
    { route: 'Варшава', price: 200, image: 'assets/photo/warsawa.jpg', description: 'Чудесная польская столица с богатой историей.' },
    { route: 'Барселона', price: 150, image: 'assets/photo/barselona.jpg', description: 'Испанская культура и архитектура в одном из самых красивых городов Европы.' }
  ];
  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private busService: BusService, private successMessageService: SuccessMessageService) {}

  ngOnInit(): void {
    this.initializeMap();
    this.successMessageService.message$.subscribe((message) => {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    });

    this.combinedDestinations = [...this.filteredBuses, ...this.popularDestinations];
    this.removeDuplicates();
  }

  removeDuplicates(): void {
    this.combinedDestinations = this.combinedDestinations.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.route === value.route
      ))
    );
  }

  addToCart(route: string, price: number, image: string): void {
    const newItem = { route, price, image };
    this.cartItems.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();
    this.successMessageService.sendMessage(`Маршрут "${route}" добавлен в корзину!`);
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  bookTicket(schedule: any): void {
    alert(`Билет на рейс ${schedule.route} забронирован!`);
  }

  applyFilters(): void {
    this.filteredBuses = this.buses.filter((bus) => {
      return (
        (!this.filters.price || bus.price <= this.filters.price) &&
        (!this.filters.busType || bus.type === this.filters.busType)
      );
    });

    if (this.filters.sortOrder === 'asc') {
      this.filteredBuses.sort((a, b) => a.price - b.price);
    } else if (this.filters.sortOrder === 'desc') {
      this.filteredBuses.sort((a, b) => b.price - a.price);
    }

    this.showRouteImage = true;
  }

  getCityDescription(cityName: string): string {
    const city = this.destinations.find(d => d.name === cityName);
    return city ? city.description : 'Описание не доступно'; 
  }

  getCityPrice(cityName: string): number {
    const city = this.destinations.find(d => d.name === cityName);
    return city ? city.price : 0; 
  }

  getCityImage(cityName: string): string {
    const city = this.destinations.find(d => d.name === cityName);
    return city ? city.images[0] : 'assets/photo/default.jpg'; 
  }

  initializeMap(): void {
    const map = L.map('map').setView([51.505, -0.09], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    this.destinations.forEach((destination) => {
      const markerIcon = L.icon({
        iconUrl: destination.images[0], 
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });
    
      L.marker(destination.coordinates, { icon: markerIcon })
        .addTo(map)
        .bindPopup(destination.prettyName);
    });
    

    map.scrollWheelZoom.disable();
  }
}
