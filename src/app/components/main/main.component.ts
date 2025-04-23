import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlatformHelper } from '@natec/mef-dev-platform-connector';
import { BehaviorSubject } from 'rxjs';


import Swal from 'sweetalert2';

import { trigger, transition, style, animate } from '@angular/animations';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
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

  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('addressInput') addressInput!: ElementRef;
  @ViewChild('cardNumberInput') cardNumberInput!: ElementRef;
  @ViewChild('cvvInput') cvvInput!: ElementRef;
  
  currentSlideIndex = 0;
  slideInterval: any;

  cartItems: any[] = [];
  totalAmount: number = 0;
  successMessage: string = '';
  isModalOpen: boolean = false;

  ngOnInit(): void {
    this.startAutoSlide();
    
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.calculateTotal();
    }
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

  addToCart(route: string, price: string, image: string): void {
    const existingItemIndex = this.cartItems.findIndex(item => item.route === route);
    
    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity += 1;
    } else {
      const newItem = { route, price: parseFloat(price.replace('$', '')), image, quantity: 1 };
      this.cartItems.push(newItem);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
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
}  
