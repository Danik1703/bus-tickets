import { Component, OnInit } from '@angular/core';
import { BusServiceComponent } from 'src/app/bus-service/bus-service.component';
import { PlatformHelper } from '@natec/mef-dev-platform-connector';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
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


  cartItems: any[] = [];
  totalAmount: number = 0;
  successMessage: string = '';

  ngOnInit(): void {
  
    this.startAutoSlide();

 
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.calculateTotal();
    }
  }



  getAsset(url:string): string{
    return PlatformHelper.getAssetUrl() + url
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
    const newItem = { route, price: parseFloat(price.replace('$', '')), image };
    this.cartItems.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateTotal();
  }

  openModal(): void {
    const modal = document.getElementById('cart-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  closeModal(): void {
    const modal = document.getElementById('cart-modal');
    if (modal) {
      modal.style.display = 'none';
    }
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
    alert('Оплата выполнена!');
    this.cartItems = [];
    localStorage.removeItem('cartItems');
    this.totalAmount = 0;
    this.closeModal();
  }
}