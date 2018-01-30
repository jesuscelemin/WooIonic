import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';

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
    public navParams: NavParams
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

}
