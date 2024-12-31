import { Component, OnInit } from '@angular/core';
import { SuccessMessageService } from '../services/success-message.service';
import { BusService } from '../services/bus.service';
import { PlatformHelper } from '@natec/mef-dev-platform-connector';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import Swal from 'sweetalert2';

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
    { route: 'Париж', price: 500, image: this.getAsset('/photo/italy.jpg'), description: 'Откройте для себя романтику французской столицы!', type: 'luxury' },
    { route: 'Лондон', price: 450, image: this.getAsset('/photo/london.jpg'), description: 'Наслаждайтесь путешествием в столицу Великобритании!', type: 'regular' },
    { route: 'Мадрид', price: 600, image: this.getAsset('/photo/madrid.jpg'), description: 'Испанская страсть и культура на каждом шагу!', type: 'regular' },
    { route: 'Варшава', price: 200, image: this.getAsset('/photo/warsawa.jpg'), description: 'Чудесная польская столица с богатой историей.', type: 'luxury' },
    { route: 'Барселона', price: 150, image: this.getAsset('/photo/barselona.jpg'), description: 'Испанская культура и архитектура в одном из самых красивых городов Европы.', type: 'regular' }
  ];
  
  selectedRoute: any = null;
  filteredBuses = [...this.buses];
  successMessage: string = '';
  combinedDestinations: any[] = [];
  showRouteImage = false;
  
  destinations: { name: string, prettyName: string, coordinates: [number, number], images: string[], description: string, price: number }[] = [
    { name: 'Київ', prettyName: 'Київ', coordinates: [50.4501, 30.5234], images: [this.getAsset('/photo/kiev.jpg'), this.getAsset('/photo/kiev.jpg')], description: 'Київ – культурное и историческое сердце Украины.', price: 700 },
    { name: 'Лондон', prettyName: 'Лондон', coordinates: [51.5074, -0.1278], images: [this.getAsset('/photo/london.jpg'), this.getAsset('/photo/london.jpg')], description: 'Лондон – столица Великобритании, известная своими музеями и историческими памятниками.', price: 450 },
    { name: 'Париж', prettyName: 'Париж', coordinates: [48.8566, 2.3522], images: [this.getAsset('/photo/paris.jpg'), this.getAsset('/photo/paris.jpg')], description: 'Париж – город любви и искусства.', price: 500 },
    { name: 'Мадрид', prettyName: 'Мадрид', coordinates: [40.4168, -3.7038], images: [this.getAsset('/photo/madrid.jpg'), this.getAsset('/photo/madrid.jpg')], description: 'Мадрид – душа Испании с богатой культурой и историей.', price: 600 },
    { name: 'Варшава', prettyName: 'Варшава', coordinates: [52.2298, 21.0118], images: [this.getAsset('/photo/warsawa.jpg'), this.getAsset('/photo/warsawa.jpg')], description: 'Варшава – столица Польши, с древней историей и современным обликом.', price: 200 },
    { name: 'Барселона', prettyName: 'Барселона', coordinates: [41.3784, 2.1926], images: [this.getAsset('/photo/barselona.jpg'), this.getAsset('/photo/barselona.jpg')], description: 'Барселона – город уникальной архитектуры и яркой культуры.', price: 150 }
  ];
  
  popularDestinations = [
    { route: 'Київ', price: 700, image: this.getAsset('/photo/kiev.jpg'), description: 'Погрузитесь в историю и культуру столицы Украины!' },
    { route: 'Лондон', price: 450, image: this.getAsset('/photo/london.jpg'), description: 'Наслаждайтесь путешествием в столицу Великобритании!' },
    { route: 'Париж', price: 500, image: this.getAsset('/photo/italy.jpg'), description: 'Откройте для себя романтику французской столицы!' },
    { route: 'Мадрид', price: 600, image: this.getAsset('/photo/madrid.jpg'), description: 'Испанская страсть и культура на каждом шагу!' },
    { route: 'Варшава', price: 200, image: this.getAsset('/photo/warsawa.jpg'), description: 'Чудесная польская столица с богатой историей.' },
    { route: 'Барселона', price: 150, image: this.getAsset('/photo/barselona.jpg'), description: 'Испанская культура и архитектура в одном из самых красивых городов Европы.' }
  ];
  

  cartItems: any[] = [];
  totalAmount: number = 0;

  map: L.Map | undefined;
  polyline: L.Polyline | undefined;
  distanceMarker: L.Marker | undefined;
  distance: number = 0;
  travelTime: string = '';

  constructor(private busService: BusService, private successMessageService: SuccessMessageService) {}

  ngOnInit(): void {
    this.initializeMap();
    this.successMessageService.message$.subscribe((message) => {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    });

    this.combinedDestinations = [...this.filteredBuses, ...this.popularDestinations];
    this.removeDuplicates();
  }

  getAsset(url:string): string{
    return PlatformHelper.getAssetUrl() + url
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
    Swal.fire({
      icon: 'success',
      title: 'Успішно!',
      text: `Маршрут "${route}" додано в кошик!`,
      confirmButtonText: 'ОК'
    });
  }
  
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  bookTicket(schedule: any): void {
    Swal.fire({
      title: 'Бронювання квитка',
      text: `Ви впевнені, що хочете забронювати квиток на маршрут ${schedule.route}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Так, забронювати!',
      cancelButtonText: 'Відміна'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Успіх!', `Білет на рейс ${schedule.route} заброньовано!`, 'success');
      }
    });
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
  
    if (this.filters.from && this.filters.to) {
      const fromCity = this.destinations.find(city => city.name === this.filters.from);
      const toCity = this.destinations.find(city => city.name === this.filters.to);
      if (fromCity && toCity) {
        this.distance = this.calculateDistance(fromCity.coordinates, toCity.coordinates);  
        this.travelTime = this.calculateTravelTime(this.distance);
        this.drawRouteOnMapWithRouting(fromCity.coordinates, toCity.coordinates);
      }
    }
}

calculateTravelTime(distance: number): string {
    const travelTimeInHours = distance / 50; 
    const hours = Math.floor(travelTimeInHours);
    const minutes = Math.round((travelTimeInHours - hours) * 60);
    return `${hours} ч ${minutes} мин`;
}

initializeMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);


    this.destinations.forEach((destination) => {
      const markerIcon = L.icon({
        iconUrl: destination.images[0], 
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      L.marker(destination.coordinates, { icon: markerIcon })
        .addTo(this.map!)
        .bindPopup(destination.prettyName);
    });
}

calculateDistance(fromCoordinates: [number, number], toCoordinates: [number, number]): number {
    const from = L.latLng(fromCoordinates[0], fromCoordinates[1]);
    const to = L.latLng(toCoordinates[0], toCoordinates[1]);
    return from.distanceTo(to);
}

drawRouteOnMapWithRouting(from: [number, number], to: [number, number]): void {
  if (this.map) {
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }

    const routeControl = L.Routing.control({
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1])
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [
          { color: 'blue', weight: 4, opacity: 0.7, dashArray: '5, 10' }
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 10
      },
    }).addTo(this.map);
  }
}
}
