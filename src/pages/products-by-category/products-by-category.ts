import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductsDetailsPage } from '../products-details/products-details';


@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

    this.page = 1;
    this.category = this.navParams.get("category");

    this.WooCommerce = WC({
      url: 'http://localhost:8888/',
      consumerKey: 'ck_33659245c8ad0bab4000b38102b74f232bd1437e',
      consumerSecret: 'cs_3822be29f442c1fa0ead5e872c30ce183fe1d8c6',
      wpAPI: true, // Enable the WP REST API integration
      version: 'wc/v2', // WooCommerce WP REST API version
      queryStringAuth: true,
    });

    this.WooCommerce.getAsync('products?filter[category]=' + this.category.slug).then(data => {
        this.products = JSON.parse(data.body);
        console.log(this.products);
      }, err => {
        console.log(err);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event) {
    this.page++;
    console.log("Getting page " + this.page);

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then((data) => {
      let temp = (JSON.parse(data.body));

      this.products = this.products.concat(JSON.parse(data.body));
      console.log(this.products);
      event.complete();

      if (temp.length < 10) {
        event.enable(false);
      }

    })
  }

  openProductPage(product) {
    this.navCtrl.push(ProductsDetailsPage, {"product": product});
  }

}
