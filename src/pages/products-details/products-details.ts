import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import * as WC from 'woocommerce-api';

import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-products-details',
  templateUrl: 'products-details.html',
})
export class ProductsDetailsPage {

  product: any;
  WooCommerce: any;
  reviews: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController

  ) {
    this.product = this.navParams.get("product");
    console.log(this.product);

    this.WooCommerce = WC({
      url: 'http://localhost:8888/',
      consumerKey: 'ck_33659245c8ad0bab4000b38102b74f232bd1437e',
      consumerSecret: 'cs_3822be29f442c1fa0ead5e872c30ce183fe1d8c6',
      wpAPI: true, // Enable the WP REST API integration
      version: 'wc/v2', // WooCommerce WP REST API version
      queryStringAuth: true,
    });

    this.WooCommerce.getAsync('products/' + this.product.id + '/reviews').then((data) => {
      this.reviews = JSON.parse(data.body);
      console.log(this.reviews);
    }, (err) => {
      console.log(err);
    })
  }

  addToCart(product) {
    this.storage.get("cart").then((data) => {

      if (data == null || data.length == 0) {
        data = [];

        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
      } else {
        let added = 0;

        for(let i = 0; i < data.length; i++) {
          if(product.id == data[i].product.id){
            let qty = data[i].qty;
            console.log("Product is already in the cart");

            data[i].qty = qty + 1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }
        }

        if(added == 0) {
          data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
        }
      }

      this.storage.set("cart", data).then(() => {
        console.log("Cart Updated");
        console.log(data);

        this.toastCtrl.create({
          message: "cart Updated",
          duration: 3000
        }).present();
      })
    });
  }

  openCart() {
    this.modalCtrl.create(CartPage).present();
  }

}
