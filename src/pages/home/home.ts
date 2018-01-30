import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
import { ProductsDetailsPage } from '../products-details/products-details';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public WooCommerce: any;
  public products: any[];
  public moreProducts: any[];
  public page: number;

  @ViewChild('productSlides') productSlides: Slides;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController
  ) {

    this.page = 2;

    this.WooCommerce = WC({
      url: 'http://localhost:8888/',
      consumerKey: 'ck_33659245c8ad0bab4000b38102b74f232bd1437e',
      consumerSecret: 'cs_3822be29f442c1fa0ead5e872c30ce183fe1d8c6',
      wpAPI: true, // Enable the WP REST API integration
      version: 'wc/v2', // WooCommerce WP REST API version
      queryStringAuth: true,
    });

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync('products').then(
      data => {
        this.products = JSON.parse(data.body);
        console.log(this.products);
      },
      err => {
        console.log(err);
      }
    );
  }

  ionViewDidLoad(){
   setInterval(() => {

    if(this.productSlides.getActiveIndex() == this.productSlides.length() -1) {
      this.productSlides.slideTo(0);
    }
    this.productSlides.slideNext();
   }, 3000);
  }

  loadMoreProducts(event) {

    if (event == null) {
      this.page = 2;
      this.moreProducts = [];
    }else{
      this.page ++;
    }

    this.WooCommerce.getAsync('products?page=' + this.page).then(data => {
        this.moreProducts = this.moreProducts.concat(JSON.parse(data.body));

        if (event != null) {
          event.complete();
        }

        if (JSON.parse(data.body).length < 10) {
          event.enable(false);

          this.toastCtrl.create({
            message: "No more products!",
            duration: 5000
          }).present();
        }
      }, err => {
        console.log(err);
      });
  }

  openProductPage(product) {
    this.navCtrl.push(ProductsDetailsPage, {"product": product});
  }

}
