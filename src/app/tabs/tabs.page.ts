import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(public navCtrl: NavController, private platform: Platform) {
  }

  updateUser() {
    this.navCtrl.navigateForward('/c-user');
  }

  paymentRoute(route: string) {
    this.navCtrl.navigateForward([route]);
  }
}

