import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [Storage],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private platform: Platform,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.storage.create();
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault(); // Uncomment if you have StatusBar
    });

    this.storage.get('isLoggedIn').then((val) => {
      if (val === null || val === undefined || val === '') {
        this.router.navigateByUrl('/splash'); // Navigasi ke halaman splash
      } else {
        this.router.navigateByUrl('/tabs/tab1'); // Navigasi ke halaman tab1
      }
    });
  }
}
