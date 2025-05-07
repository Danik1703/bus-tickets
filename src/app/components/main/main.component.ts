import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core'; 
import { PlatformHelper } from '@natec/mef-dev-platform-connector';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class MainComponent implements OnInit {
  images: string[] = [
    this.getAsset('/photo/usa.jpg'),
    this.getAsset('/photo/warsawa.jpg'),
    this.getAsset('/photo/paris.jpg'),
    this.getAsset('/photo/mehiko.jpg'),
    this.getAsset('/photo/berlin.jpg'),
    this.getAsset('/photo/paris.2.jpg'),
    this.getAsset('/photo/tyrkish.jpg')
  ];
  currentSlideIndex = 0;
  slideInterval: any;

  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('addressInput') addressInput!: ElementRef;
  @ViewChild('cardNumberInput') cardNumberInput!: ElementRef;
  @ViewChild('cvvInput') cvvInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @Input() destinations: any[] = [];

  cartItems: any[] = [];
  totalAmount: number = 0;
  isModalOpen: boolean = false;
  userId: string = '';
  userEmail: string = '';

  ngOnInit(): void {
    this.startAutoSlide();

    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.calculateTotal();
    }

    this.userId = localStorage.getItem('userId') || 'AdminUserId';
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', 'AdminUserId');
    }
    this.userEmail = 'user@example.com'; 
  }

  getAsset(url: string): string {
    return PlatformHelper.getAssetUrl() + url;
  }

  setCurrentSlide(index: number): void {
    this.currentSlideIndex = index;
    this.restartAutoSlide();
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => this.nextSlide(), 5000);
  }

  restartAutoSlide(): void {
    clearInterval(this.slideInterval);
    this.startAutoSlide();
  }

  getCurrentDateTime(): { date: string, time: string } {
    const now = new Date();
    return {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };
  }

  addToCart(route: string, price: string, image: string): void {
    const existingItemIndex = this.cartItems.findIndex(item => item.route === route);
    
    const destination = this.destinations.find(dest => dest.prettyName === route);
    
    const description = destination?.description || 'Без опису';
    const { date, time } = this.getCurrentDateTime();  
    const type = destination?.type || 'Звичайний'; 
    
    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity += 1;
    } else {
      const newItem = {
        route,
        price: parseFloat(price.replace('$', '')), 
        image,
        quantity: 1,
        description,
        date,
        time,
        type
      };
      this.cartItems.push(newItem);
    }
  
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();
  }
  

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  processPayment(): void {
    const name = this.nameInput.nativeElement.value.trim();
    const address = this.addressInput.nativeElement.value.trim();
    const cardNumber = this.cardNumberInput.nativeElement.value.trim();
    const cvv = this.cvvInput.nativeElement.value.trim();

    if (!name || !address || !cardNumber || !cvv) {
      Swal.fire({
        title: 'Помилка!',
        text: 'Будь ласка, заповніть всі поля!',
        icon: 'error',
        confirmButtonText: 'Ок'
      });
      return;
    }

    Swal.fire({
      title: 'Успіх!',
      text: 'Оплата виконана!',
      icon: 'success',
      confirmButtonText: 'Ок'
    }).then(() => {
      this.cartItems = [];
      localStorage.removeItem('cartItems');
      this.totalAmount = 0;
      this.closeModal();
    });
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
  
  sendEmailWithCart(): void {
    const email = this.emailInput.nativeElement.value.trim();
  
    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Помилка!',
        text: 'Ваш кошик порожній.',
      });
      return;
    }
  
    if (!email || !this.isValidEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Помилка!',
        text: 'Будь ласка, введіть коректну email-адресу.',
      });
      return;
    }
  
    const tickets = this.cartItems.map(item => ({
      route: item.route,
      price: item.price,
      date: item.date,
      type: item.type,
      description: item.description,
    }));
  
    const templateParams = {
      user_id: this.userId,
      email: email,
      tickets: tickets, 
    };
  
    this.cartItems.forEach(item => {
      this.sendEmail(email, item);
    });
  }
  
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
}