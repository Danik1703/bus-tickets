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

  map: L.Map | undefined;
  polyline: L.Polyline | undefined;
  distanceMarker: L.Marker | undefined;

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
  
    if (this.filters.from && this.filters.to) {
      const fromCity = this.destinations.find(city => city.name === this.filters.from);
      const toCity = this.destinations.find(city => city.name === this.filters.to);
      if (fromCity && toCity) {
        const distance = this.calculateDistance(fromCity.coordinates, toCity.coordinates);  
        this.drawRouteOnMap(fromCity.coordinates, toCity.coordinates, distance);
      }
    }
  }

  calculateDistance(from: [number, number], to: [number, number]): number {
    const R = 6371; 
    const lat1 = this.degreesToRadians(from[0]);
    const lon1 = this.degreesToRadians(from[1]);
    const lat2 = this.degreesToRadians(to[0]);
    const lon2 = this.degreesToRadians(to[1]);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  }

  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  initializeMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 2); 
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
  
  drawRouteOnMap(from: [number, number], to: [number, number], distance: number): void {
    if (this.polyline) {
      this.map?.removeLayer(this.polyline);
    }
    if (this.distanceMarker) {
      this.map?.removeLayer(this.distanceMarker);
    }
  

    const travelTime = distance / 50; 
    const hours = Math.floor(travelTime);
    const minutes = Math.round((travelTime - hours) * 60);
    const timeMessage = `${hours} ч ${minutes} мин`;
  
    const midPoint: [number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  

    const stops: [number, number][] = [
      [50.4501, 30.5234],
      [51.5074, -0.1278],  
      [48.8566, 2.3522],  
      
    ];
  
    if (this.map) {
      const polylineStyle: L.PolylineOptions = {
        color: 'blue',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round', 
      };
      
  
      this.polyline = L.polyline([from, to], polylineStyle).addTo(this.map!);
      this.map.fitBounds(this.polyline.getBounds());
  
      this.distanceMarker = L.marker(midPoint)
        .addTo(this.map!)
        .bindPopup(`Расстояние: ${distance.toFixed(2)} км\nВремя пути: ${timeMessage}`)
        .openPopup();
  
      stops.forEach((stop) => {
        L.marker(stop, {
          icon: L.icon({
            iconUrl: 'assets/photo/bus-stop.png', 
            iconSize: [25, 25],
            iconAnchor: [12, 25],
            popupAnchor: [0, -25],
          }),
        })
        .addTo(this.map!)
        .bindPopup('Остановка');
      });
  
    
      const animateMarker = L.marker(from).addTo(this.map);
      const latlngs = [from, to];
      let currentIndex = 0;
      const animationSpeed = 100; 
  
      const moveMarker = () => {
        if (currentIndex < latlngs.length) {
          animateMarker.setLatLng(latlngs[currentIndex]);
          currentIndex++;
          setTimeout(moveMarker, animationSpeed); 
        }
      };
  
      moveMarker(); 
    }
  }
}