import { Component, OnInit } from '@angular/core';
import { SuccessMessageService } from '../services/success-message.service';
import { BusService } from '../services/bus.service';
import { PlatformHelper } from '@natec/mef-dev-platform-connector';
import { MefDevCardModule } from '@natec/mef-dev-ui-kit';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';

interface Review {
  text: string;
  author: string;
  rating: number;
}

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
  reviews: Review[] = [];

  trackedRoutes: { route: string; routeTime: string }[] = [];


  private reviewTexts: string[] = [
    'Знайшов квиток за хвилину — і вже в дорозі!',
    'Обожнюю цей сервіс! Бронювання — одне задоволення 💙',
    'Найкращий сайт для мандрівників! Все швидко і зручно 🚍✈️',
    'Купівля квитка — як кліком пальця! Просто супер!',
    'Підтримка відповіла миттєво, допомогли з вибором — дякую!',
    'Рейси зручно відсортовані, все наочне та зрозуміле 🧳',
    'Ціни класні, а ще й знижку надіслали — приємно здивували!',
    'Ідеально для тих, хто шукає комфорт і швидкість 🕐',
    'Бронювання без стресу! Однозначно рекомендую друзям.',
    'Сайт красивий, інтуїтивний — знайшов потрібний маршрут за секунди!',
    'Усе працює як годинник! Вже чекаю на свою наступну поїздку 😊'
  ];
  

  private authors: string[] = [
    'Олег', 'Світлана', 'Тарас', 'Ірина', 'Володимир',
    'Катерина', 'Андрій', 'Наталія', 'Сергій', 'Марія', 'Антон', 'Юлія'
  ];

  filters = {
    from: '',  
    to: '',
    date: '',
    time: '',
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
    { route: 'Київ', price: 700, image: this.getAsset('/photo/kiev.jpg'), description: 'Пориньте в історію й культуру столиці України!', departureTime: '2025-05-07T13:00:00' },
    { route: 'Лондон', price: 450, image: this.getAsset('/photo/london.jpg'), description: 'Насолоджуйтесь подорожжю до столиці Великобританії!', departureTime: '2025-05-08T18:00:00' },
    { route: 'Париж', price: 500, image: this.getAsset('/photo/italy.jpg'), description: 'Відкрийте для себе романтику французької столиці!', departureTime: '2025-05-06T12:00:00' },
    { route: 'Мадрид', price: 600, image: this.getAsset('/photo/madrid.jpg'), description: 'Іспанська пристрасть і культура на кожному кроці!', departureTime: '2025-05-10T21:00:00' },
    { route: 'Варшава', price: 200, image: this.getAsset('/photo/warsawa.jpg'), description: 'Чудова польська столиця з багатою історією.', departureTime: '2025-05-11T12:00:00' },
    { route: 'Барселона', price: 150, image: this.getAsset('/photo/barselona.jpg'), description: 'Іспанська культура й архітектура в одному з найкрасивіших міст Європи.', departureTime: '2025-05-12T17:00:00' }
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

  selectedFrom: [number, number] | null = null;
  selectedTo: [number, number] | null = null;
  routeControl: L.Routing.Control | undefined;
  polyline: L.Polyline | undefined;
  distanceMarker: L.Marker | undefined;
  distance: number = 0;
  travelTime: string = '';

  userList: string[] = [];

  constructor(private busService: BusService, private successMessageService: SuccessMessageService) {}
  
  timeToDepartureMessage: string | null = null;
  reviewUpdateInterval: any;

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || 'AdminUserId';
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', 'AdminUserId');
    }
  
    // this.trackedRoutes = JSON.parse(localStorage.getItem('trackedRoutes') || '[]');
  
    // setInterval(() => this.checkTrackedRoutes(), 60000);
  
    this.reviews = Array.from({ length: 6 }, () => this.generateRandomReview());
    this.startReviewUpdateInterval();
  
    this.successMessageService.message$.subscribe((message) => {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    });
  
    setTimeout(() => {
     
      this.initializeMap();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.reviewUpdateInterval) {
      clearInterval(this.reviewUpdateInterval);
    }
  }
  
  private generateRandomReview(): Review {
    const text = this.getRandomItem(this.reviewTexts);
    const author = this.getRandomItem(this.authors);
    const rating = this.getRandomInt(4, 5); 
    return { text, author, rating };
  }
  
  private getRandomItem<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }
  
  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  private startReviewUpdateInterval(): void {
    this.reviewUpdateInterval = setInterval(() => {
      this.reviews = Array.from({ length: 6 }, () => this.generateRandomReview());
    }, 60000); 
  }

  
  // checkForUpcomingRoutes(): void {
  //   const now = new Date();
  //   console.log("Поточний час:", now);
  //   this.buses.forEach(bus => {
  //     const departureTime = new Date(bus.routeTime); 
  //     const timeDifference = departureTime.getTime() - now.getTime();
  //     console.log(`Для рейсу ${bus.route} різниця у часі: ${timeDifference} мілісекунд`);
  
  //     if (this.selectedRoute && this.selectedRoute.route === bus.route) {
  //       if (timeDifference >= 24 * 60 * 60 * 1000 && timeDifference <= 48 * 60 * 60 * 1000) {
  //         this.timeToDepartureMessage = `Ваш рейс в напрямку ${bus.route} відправляється через 24–48 годин. Не забудьте підготуватися!`;
  //         this.showUpcomingRouteReminder(bus.route);
  //       }
  //     }
  //   });
  // }
  
  
  // showUpcomingRouteReminder(route: string): void {
  //   Swal.fire({
  //     icon: 'info',
  //     title: 'Рейс через 24–48 годин!',
  //     text: `Ваш рейс в напрямку ${route} відправляється через 24–48 годин. Не забудьте підготуватися!`,
  //   });
  // }
  
  // getReminderTime(routeTime: string): Date {
  //   const routeDate = new Date(routeTime);
  //   const reminderDate = new Date(routeDate.getTime() - 10 * 60 * 1000); 
  //   return reminderDate;
  // }
  
  // showReminderNotification(): void {
  //   const currentTime = new Date();
  //   const departureTime = new Date('2025-04-12T15:00:00'); 
  
  //   const timeDiff = departureTime.getTime() - currentTime.getTime();
  //   const hoursUntilDeparture = timeDiff / (1000 * 3600); 
  
  //   if (hoursUntilDeparture <= 48 && hoursUntilDeparture > 24) {
  //     Swal.fire({
  //       title: 'Нагадування',
  //       text: 'До вашого рейсу залишилось 24–48 годин!',
  //       icon: 'info',
  //       confirmButtonText: 'Ок'
  //     });
  //   } else if (hoursUntilDeparture <= 10) {
  //     Swal.fire({
  //       title: 'Нагадування',
  //       text: 'Ваш маршрут відправляється через 10 хвилин!',
  //       icon: 'info',
  //       confirmButtonText: 'Ок'
  //     });
  //   }
  // }
  

  selectRoute(route: any): void {
    this.selectedRoute = route;
    this.updateDiscountMessage(); 
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
  
    emailjs.send('service_i9ksnkh', 'template_vfd581s', templateParams, 'XoqWj2i1jc8eAysk3')
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
          text: `Щось пішло не так. Спробуйте ще раз. Деталі: ${error.text || error.message}`,
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

  trackRoute(route: string, routeTime: string): void {
    const alreadyTracked = this.trackedRoutes.find(r => r.route === route && r.routeTime === routeTime);
    if (alreadyTracked) {
      Swal.fire({
        icon: 'info',
        title: 'Вже відстежується',
        text: `Рейс ${route} вже додано до відстеження.`,
      });
      return;
    }
  
    this.trackedRoutes.push({ route, routeTime });
    Swal.fire({
      icon: 'success',
      title: 'Рейс додано',
      text: `Ви будете отримувати сповіщення про рейс ${route}.`,
    });
  
    localStorage.setItem('trackedRoutes', JSON.stringify(this.trackedRoutes));
  }

  checkTrackedRoutes(): void {
    const now = new Date();
  
    this.trackedRoutes.forEach(tracked => {
      const departureTime = new Date(tracked.routeTime);
      const diff = departureTime.getTime() - now.getTime();
  
      if (diff > 24 * 60 * 60 * 1000 && diff <= 48 * 60 * 60 * 1000) {
        Swal.fire({
          icon: 'info',
          title: 'Нагадування',
          text: `Рейс "${tracked.route}" відправляється через 24–48 годин.`,
        });
      }
  
      if (diff > 0 && diff <= 10 * 60 * 1000) {
        Swal.fire({
          icon: 'warning',
          title: 'Пора йти!',
          text: `Рейс "${tracked.route}" відправляється через 10 хвилин.`,
        });
      }
    });
  }
  
  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / this.reviews.length) * 10) / 10;
  }
  
  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
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
    const discountText = discount > 0 ? ` Ваша знижка: ${discount * 100}%.` : '';
    
    Swal.fire({
      icon: 'success',
      title: 'Успішно!',
      text: `Маршрут "${route}" додано в кошик!${discountText}`,
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
    if (this.selectedRoute) {
      const selectedDateTime = new Date(`${this.filters.date}T${this.filters.time}:00`);
      const now = new Date();
      const timeDifference = selectedDateTime.getTime() - now.getTime();

      if (timeDifference <= 48 * 60 * 60 * 1000 && timeDifference > 24 * 60 * 60 * 1000) {
        this.timeToDepartureMessage = `До вашого рейсу через 24–48 години. Не забудьте підготуватись!`;
      } else if (timeDifference <= 24 * 60 * 60 * 1000 && timeDifference > 0) {
        this.timeToDepartureMessage = `До вашого рейсу залишилось менше ніж 24 години!`;
      } else if (timeDifference <= 0) {
        this.timeToDepartureMessage = `Рейс вже вирушив або відправлення занадто скоро.`;
      } else {
        this.timeToDepartureMessage = null; 
      }
    }
  }
  
  applyHolidayDiscount() {
    const discount = this.getHolidayDiscount();
    if (discount > 0) {
      this.totalAmount = this.totalAmount * (1 - discount);
      Swal.fire({
        icon: 'info',
        title: 'Знижка до свята',
        text: `Сьогодні діє знижка ${discount * 15}% на всі квитки!`,
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

  filterByDate(): void {
    if (this.filters.date) {
      const selectedDate = new Date(this.filters.date);
      
      this.filteredBuses = this.buses.filter(bus => {
        const busDate = new Date(bus.routeTime);
        return busDate >= selectedDate;
      });
    } else {
      this.filteredBuses = [...this.buses];
    }
  }

  applyFilters(): void {
    const discount = this.getHolidayDiscount();
    
    let filtered = [...this.buses];
    
    if (this.filters.from) {
      filtered = filtered.filter(bus => bus.route.toLowerCase().includes(this.filters.from.toLowerCase()));
    }
    if (this.filters.to) {
      filtered = filtered.filter(bus => bus.route.toLowerCase().includes(this.filters.to.toLowerCase()));
    }
    
    if (this.filters.date) {
      const filterDate = new Date(this.filters.date).setHours(0, 0, 0, 0);
      filtered = filtered.filter(bus => {
        const busDate = new Date(bus.routeTime).setHours(0, 0, 0, 0);
        return busDate === filterDate;
      });
    }
  
    if (this.filters.time) {
      const filterTime = new Date(`${this.filters.date}T${this.filters.time}`).getHours();
      filtered = filtered.filter(bus => {
        const busTime = new Date(bus.routeTime).getHours();
        return busTime === filterTime;
      });
    }
  
    if (this.filters.busType) {
      filtered = filtered.filter(bus => bus.type === this.filters.busType);
    }
  
    if (discount > 0) {
      filtered = filtered.map(bus => ({
        ...bus,
        price: bus.price * (1 - discount)
      }));
    }
  
    if (this.filters.price) {
      filtered = filtered.filter(bus => bus.price <= this.filters.price);
    }
  
    if (this.filters.sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (this.filters.sortOrder === 'desc') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }
    
    this.filteredBuses = filtered;
    this.removeDuplicates();
  
    
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
      time: '',
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
  
  initializeMap(): void {
    if (this.map) {
      return;
    }
  
    const defaultCoords: L.LatLngExpression = [50.4501, 30.5234]; 
  
    this.map = L.map('map').setView(defaultCoords, 6);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  
    if (this.destinations && this.destinations.length > 0) {
      this.destinations.forEach((destination) => {
        const markerIcon = L.icon({
          iconUrl: destination.images[0] || 'assets/photo/bus-stop.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });
  
        const marker = L.marker(destination.coordinates, { icon: markerIcon })
          .addTo(this.map as L.Map);
  
        if (destination.prettyName) {
          marker.bindPopup(destination.prettyName);
        }
  
        marker.on('click', () => this.selectDestination(destination.coordinates));
      });
    } else {
      L.marker(defaultCoords)
        .addTo(this.map as L.Map)
        .openPopup();
    }
  }
  
  selectDestination(coordinates: [number, number]): void {
    if (!this.selectedFrom) {
      this.selectedFrom = coordinates;
    } else if (!this.selectedTo) {
      this.selectedTo = coordinates;
    
    }
  
    if (this.selectedFrom && this.selectedTo) {
      this.drawRouteOnMapWithRouting(this.selectedFrom, this.selectedTo);
    }
  }

  drawRouteOnMapWithRouting(from: [number, number], to: [number, number]): void {
    if (!this.map) {
      return;
    }
    
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
    }
  
    this.routeControl = L.Routing.control({
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      lineOptions: {
        styles: [
          { color: 'blue', weight: 4, opacity: 0.7, dashArray: '5, 10' }
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 10
      }
    }).addTo(this.map);
  }

  calculateDistance(fromCoordinates: [number, number], toCoordinates: [number, number]): number {
    const from = L.latLng(fromCoordinates[0], fromCoordinates[1]);
    const to = L.latLng(toCoordinates[0], toCoordinates[1]);
    return from.distanceTo(to) / 1000; 
  }

  calculateTravelTime(distance: number): string {
    const travelTimeInHours = distance / 50; 
    const hours = Math.floor(travelTimeInHours);
    const minutes = Math.round((travelTimeInHours - hours) * 60);
    return `${hours} ч ${minutes} мин`;
  }
}