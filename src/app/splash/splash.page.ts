import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: 'splash.page.html',
  styleUrls: ['splash.page.scss'],
})
export class SplashPage {
  constructor(private router: Router) {
    // Tambahkan penundaan sebelum mengarahkan pengguna ke halaman login.
    setTimeout(() => {
      this.navigateToLogin();
    }, 2000); // Contoh penundaan selama 2 detik.
  }

  navigateToLogin() {
    this.router.navigate(['login']); // Navigasi ke halaman login
  }
}
