import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public WooCommerce: any;
  public products: any[];

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController) {
    this.WooCommerce = WC({
      url: 'http://localhost:8888/',
      consumerKey: 'ck_33659245c8ad0bab4000b38102b74f232bd1437e',
      consumerSecret: 'cs_3822be29f442c1fa0ead5e872c30ce183fe1d8c6',
      wpAPI: true, // Enable the WP REST API integration
      version: 'wc/v2', // WooCommerce WP REST API version
      queryStringAuth: true,
    });

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

}
