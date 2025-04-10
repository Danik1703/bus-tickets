import { Component, OnInit } from '@angular/core';
import { SuccessMessageService } from '../services/success-message.service';
import { BusService } from '../services/bus.service';
import { PlatformHelper } from '@natec/mef-dev-platform-connector';
import { MefDevCardModule } from '@natec/mef-dev-ui-kit';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-bus-service',
  templateUrl: './bus-service.component.html',
  styleUrls: ['./bus-service.component.scss'],
})
export class BusServiceComponent implements OnInit {
  userId: string = '';
  userEmail: string = '';
  busSchedules: any[] = [];
  searchQuery: string = '';  
  searchSuggestions: string[] = [];  
  isSuggestionsVisible: boolean = false;  
  reviews = [
    { text: 'Чудовий сервіс!', author: 'Анна' },
    { text: 'Дуже зручно та швидко.', author: 'Іван' },
    { text: 'Найкращі ціни на ринку!', author: 'Марія' },
    { text: 'Подорожую з вами постійно. Рекомендую!', author: 'Дмитро' }    
  ];

  filters = {
    from: '',  
    to: '',
    date: '',
    price: 0,
    busType: '',
    sortOrder: 'asc'
  };

  buses = [
    { route: 'Париж', price: 500, image: this.getAsset('/photo/italy.jpg'), description: 'Відкрийте для себе романтику французької столиці!', type: 'luxury', routeTime: '2025-04-12T10:00:00Z' },
    { route: 'Лондон', price: 450, image: this.getAsset('/photo/london.jpg'), description: 'Насолоджуйтесь подорожжю до столиці Великобританії!', type: 'regular', routeTime: '2025-04-12T14:00:00Z' },
    { route: 'Мадрид', price: 600, image: this.getAsset('/photo/madrid.jpg'), description: 'Іспанська пристрасть і культура на кожному кроці!', type: 'regular', routeTime: '2025-04-13T09:00:00Z' },
    { route: 'Варшава', price: 200, image: this.getAsset('/photo/warsawa.jpg'), description: 'Чудова польська столиця з багатою історією.', type: 'luxury', routeTime: '2025-04-13T11:00:00Z' },
    { route: 'Барселона', price: 150, image: this.getAsset('/photo/barselona.jpg'), description: 'Іспанська культура й архітектура в одному з найкрасивіших міст Європи.', type: 'regular', routeTime: '2025-04-14T08:00:00Z' }
  ];
  
  
  selectedRoute: any = null;
  filteredBuses = [...this.buses];
  successMessage: string = '';
  combinedDestinations: any[] = [];
  showRouteImage = false;
  
  destinations: { name: string, prettyName: string, coordinates: [number, number], images: string[], description: string, price: number }[] = [
    { name: 'Київ', prettyName: 'Київ', coordinates: [50.4501, 30.5234], images: [this.getAsset('/photo/kiev.jpg'), this.getAsset('/photo/kiev.jpg')], description: 'Київ – культурне й історичне серце України.', price: 700 },
    { name: 'Лондон', prettyName: 'Лондон', coordinates: [51.5074, -0.1278], images: [this.getAsset('/photo/london.jpg'), this.getAsset('/photo/london.jpg')], description: 'Лондон – столиця Великобританії, відома своїми музеями та історичними пам\'ятками.', price: 450 },
    { name: 'Париж', prettyName: 'Париж', coordinates: [48.8566, 2.3522], images: [this.getAsset('/photo/paris.jpg'), this.getAsset('/photo/paris.jpg')], description: 'Париж – місто кохання та мистецтва.', price: 500 },
    { name: 'Мадрид', prettyName: 'Мадрид', coordinates: [40.4168, -3.7038], images: [this.getAsset('/photo/madrid.jpg'), this.getAsset('/photo/madrid.jpg')], description: 'Мадрид – душа Іспанії з багатою культурою й історією.', price: 600 },
    { name: 'Варшава', prettyName: 'Варшава', coordinates: [52.2298, 21.0118], images: [this.getAsset('/photo/warsawa.jpg'), this.getAsset('/photo/warsawa.jpg')], description: 'Варшава – столиця Польщі з давньою історією та сучасним виглядом.', price: 200 },
    { name: 'Барселона', prettyName: 'Барселона', coordinates: [41.3784, 2.1926], images: [this.getAsset('/photo/barselona.jpg'), this.getAsset('/photo/barselona.jpg')], description: 'Барселона – місто унікальної архітектури та яскравої культури.', price: 150 }
  ];
  
  popularDestinations = [
    { route: 'Київ', price: 700,  image: this.getAsset('/photo/kiev.jpg'), description: 'Пориньте в історію й культуру столиці України!' },
    { route: 'Лондон', price: 450,  image: this.getAsset('/photo/london.jpg'), description: 'Насолоджуйтесь подорожжю до столиці Великобританії!' },
    { route: 'Париж', price: 500,  image: this.getAsset('/photo/italy.jpg'), description: 'Відкрийте для себе романтику французької столиці!' },
    { route: 'Мадрид', price: 600,  image: this.getAsset('/photo/madrid.jpg'), description: 'Іспанська пристрасть і культура на кожному кроці!' },
    { route: 'Варшава', price: 200,  image: this.getAsset('/photo/warsawa.jpg'), description: 'Чудова польська столиця з багатою історією.' },
    { route: 'Барселона', price: 150,  image: this.getAsset('/photo/barselona.jpg'), description: 'Іспанська культура й архітектура в одному з найкрасивіших міст Європи.' }
  ];
  
  holidayDiscounts = [
    { date: '12-25', discount: 0.2 },   
    { date: '01-01', discount: 0.3 },    
    { date: '03-08', discount: 0.15 },  
    { date: '05-01', discount: 0.1 },   
    { date: '12-31', discount: 0.25 }, 
    { date: '11-25', discount: 0.2 }, 
  ];
  
  

  cartItems: any[] = [];
  totalAmount: number = 0;

  map: L.Map | undefined;
  polyline: L.Polyline | undefined;
  distanceMarker: L.Marker | undefined;
  distance: number = 0;
  travelTime: string = '';

  userList: string[] = [];

  constructor(private busService: BusService, private successMessageService: SuccessMessageService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || 'AdminUserId'; 
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', 'AdminUserId');
    }
  
    this.userList = this.getUserList();  
    this.initializeMap();
    
    this.successMessageService.message$.subscribe((message) => {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    });
    
    this.combinedDestinations = [...this.filteredBuses, ...this.popularDestinations];
    this.removeDuplicates();
    
    this.checkForUpcomingRoutes();
  }
  
  checkForUpcomingRoutes(): void {
    const now = new Date();
  
    this.buses.forEach((bus) => {
      const departureTime = new Date(bus.routeTime); 
      const timeDifference = departureTime.getTime() - now.getTime();
  
      
      if (timeDifference >= 24 * 60 * 60 * 1000 && timeDifference <= 48 * 60 * 60 * 1000) {
        this.showUpcomingRouteReminder(bus);
      }
    });
  }
  
  showUpcomingRouteReminder(bus: any): void {
    Swal.fire({
      icon: 'info',
      title: `Рейс через 24–48 годин!`,
      text: `Ваш рейс в напрямку ${bus.route} відправляється через 24–48 годин. Не забудьте підготуватися!`,
    });
  }
  
  
  getReminderTime(routeTime: string): Date {
    const routeDate = new Date(routeTime);
    const reminderDate = new Date(routeDate.getTime() - 10 * 60 * 1000); 
    return reminderDate;
  }
  
  showReminderNotification(): void {
    const currentTime = new Date();
    const departureTime = new Date('2025-04-12T15:00:00'); 
  
    const timeDiff = departureTime.getTime() - currentTime.getTime();
    const hoursUntilDeparture = timeDiff / (1000 * 3600); 
  
    if (hoursUntilDeparture <= 48 && hoursUntilDeparture > 24) {
      Swal.fire({
        title: 'Напоминание',
        text: 'До вашего рейса осталось 24–48 часов!',
        icon: 'info',
        confirmButtonText: 'Ок'
      });
    } else if (hoursUntilDeparture <= 10) {
      Swal.fire({
        title: 'Напоминание',
        text: 'Ваш маршрут отправляется через 10 минут!',
        icon: 'info',
        confirmButtonText: 'Ок'
      });
    }
  }
  
  
  getUserList(): string[] {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.map((user: { id: string }) => user.id);  
  }

  saveUserList(): void {
    const users = this.userList.map(id => ({ id }));
    localStorage.setItem('users', JSON.stringify(users));
  }

  sendEmail(userEmail: string, ticket: any): void {
    if (!userEmail || userEmail.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Помилка!',
        text: 'Будь ласка, введіть коректну email-адресу.',
      });
      return;
    }
  
   
    if (!ticket.route) {
      Swal.fire({
        icon: 'error',
        title: 'Помилка!',
        text: 'Маршрут не вказано.',
      });
      return;
    }
  
    const templateParams = {
      user_id: this.userId,
      email: userEmail,
      route: ticket.route,
      price: ticket.price,
      date: ticket.date || 'Не вказано',
      busType: ticket.type || 'Звичайний',
      description: ticket.description || 'Без опису',
    };
  
    emailjs.send('service_i9ksnkh', 'template_05xvp29', templateParams, 'XoqWj2i1jc8eAysk3')
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Успіх!',
          text: 'Ваше повідомлення надіслано успішно.',
        });
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Помилка!',
          text: `Щось пішло не так. Спробуйте ще раз. Деталі: ${error.text}`,
        });
      });
  }
  
  
  sendUserFeedback(): void {
    const userEmail = 'userExample@gmail.com';
    const userMessage = 'Вітаємо! Ви отримали знижку на ваш квиток. Слідкуйте за змінами на нашому сайті!';
    const ticketPrice = 100;
    this.sendEmail(userEmail, { route: 'Не вказано', price: ticketPrice, description: userMessage });
  }
  
  subscribeForDiscount(): void {
    if (this.userEmail && this.userEmail.trim() !== '') {
      const discountMessage = 'Вітаємо! Ви отримали знижку на ваш квиток.';
      const ticketPrice = 100;
      this.sendEmail(this.userEmail, { route: 'Не вказано', price: ticketPrice, description: discountMessage });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Помилка!',
        text: 'Будь ласка, введіть ваш email.',
      });
    }
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
    return city ? city.images[0] : 'assets/photo/bus-stop.png'; 
  }

  removeDuplicates(): void {
    this.combinedDestinations = this.combinedDestinations.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.route === value.route
      ))
    );
  }


  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
  
    if (this.searchQuery.length >= 3) {
      this.searchSuggestions = this.destinations
        .map(dest => dest.prettyName)
        .filter(name => name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  
      this.isSuggestionsVisible = this.searchSuggestions.length > 0;
    } else {
      this.isSuggestionsVisible = false;
    }
  }
  

  onSuggestionClick(suggestion: string): void {
    this.searchQuery = suggestion;
    this.isSuggestionsVisible = false;
  }

  addToCart(route: string, originalPrice: number, image: string): void {
    const discountedPrice = this.getDiscountedPrice(originalPrice);
    
    const newItem = { route, price: discountedPrice, image };
    this.cartItems.push(newItem);
    
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    
    this.calculateTotal();
    
    const discount = this.getHolidayDiscount();
    const discountText = discount > 0 ? ` Ваша скидка: ${discount * 100}%.` : '';
    
    Swal.fire({
      icon: 'success',
      title: 'Успешно!',
      text: `Маршрут "${route}" добавлен в корзину!${discountText}`,
      confirmButtonText: 'ОК'
    });
  }
  

  isValidRouteId(routeId: string): boolean {
    const validRouteIds = this.destinations.map(d => d.name);
    return validRouteIds.includes(routeId);
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
        this.sendEmail(this.userEmail, schedule);
  
        Swal.fire('Успіх!', `Білет на рейс ${schedule.route} заброньовано!`, 'success');
      }
    });
  }

  getDiscountedPrice(originalPrice: number): number {
    const discount = this.getHolidayDiscount();
    return discount > 0 ? originalPrice * (1 - discount) : originalPrice;
  }

  getHolidayDiscount(): number {
    if (!this.filters.date) return 0;
    
    const selectedDate = new Date(this.filters.date);
    const formattedDate = `${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  
    const holiday = this.holidayDiscounts.find(h => h.date === formattedDate);
    return holiday ? holiday.discount : 0;
  }

  isHolidayDiscountApplied(): boolean {
    return this.getHolidayDiscount() > 0;
  }
  

  updateDiscountMessage(): void {
    this.getHolidayDiscount(); 
  }

  applyHolidayDiscount() {
    const discount = this.getHolidayDiscount();
    if (discount > 0) {
      this.totalAmount = this.totalAmount * (1 - discount);
      Swal.fire({
        icon: 'info',
        title: 'Скидка праздника',
        text: `Сегодня действует скидка ${discount * 15}% на все билеты!`,
      });
  
      if (this.userEmail) {
        const discountMessage = `Вітаємо! Ви отримали знижку ${discount * 15}% на ваш квиток. Слідкуйте за змінами на нашому сайті!`;
        this.sendEmail(this.userEmail, { route: 'Не вказано', price: this.totalAmount, description: discountMessage });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Помилка!',
          text: 'Будь ласка, введіть ваш email.',
        });
      }
    }
  }

  applyFilters(): void {
    const discount = this.getHolidayDiscount();
    
    this.filteredBuses = this.buses.filter((bus) => {
      const matchesFrom = this.filters.from ? bus.route.toLowerCase().includes(this.filters.from.toLowerCase()) : true;
      const matchesTo = this.filters.to ? bus.route.toLowerCase().includes(this.filters.to.toLowerCase()) : true;
      const matchesDate = this.filters.date ? bus.route.toLowerCase().includes(this.filters.date.toLowerCase()) : true;
      const matchesPrice = bus.price <= this.filters.price;
      const matchesBusType = this.filters.busType ? bus.type === this.filters.busType : true;
      
      if (discount > 0) {
        bus.price = bus.price * (1 - discount);
      }

      return matchesFrom && matchesTo && matchesDate && matchesPrice && matchesBusType;
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

  resetFilters(): void {
    this.filters = {
      from: '',
      to: '',
      date: '',
      price: 0, 
      busType: '',
      sortOrder: 'asc'
    };
  
    this.filteredBuses = [...this.buses];
    this.showRouteImage = false;
  
    Swal.fire({
      icon: 'info',
      title: 'Фільтри скинуті!',
      text: 'Ви можете знову вибирати маршрут.',
    });
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
      iconUrl: destination.images[0] || 'assets/photo/bus-stop.png', 
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
  return from.distanceTo(to) / 1000; 
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