import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage: Component;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams)
    {
      this.homePage = HomePage;
      this.categories = [];

      this.WooCommerce = WC({
        url: 'http://localhost:8888/',
        consumerKey: 'ck_33659245c8ad0bab4000b38102b74f232bd1437e',
        consumerSecret: 'cs_3822be29f442c1fa0ead5e872c30ce183fe1d8c6',
        wpAPI: true, // Enable the WP REST API integration
        version: 'wc/v2', // WooCommerce WP REST API version
        queryStringAuth: true,
      });

      this.WooCommerce.getAsync("products/categories").then((data) => {
        console.log(JSON.parse(data.body));

        let temp: any[] = JSON.parse(data.body);

        for( let i = 0; i < temp.length; i ++) {
          if(temp[i].parent == 0) {

            if (temp[i].slug == "clothing") {
              temp[i].icon = "shirt";
            }
            if (temp[i].slug == "music") {
              temp[i].icon = "musical-notes";
            }
            if (temp[i].slug == "posters") {
              temp[i].icon = "images";
            }

            this.categories.push(temp[i]);
          }
        }

      }, (err) => {
        console.log(err);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openCategoryPage(category) {
    this.childNavCtrl.setRoot(ProductsByCategoryPage, {"category": category});
  }

}
