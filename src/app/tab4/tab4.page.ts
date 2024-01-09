import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage'; // Import the Storage module
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  public msg: string = '';
  public chatMessages: any[] = [];
  isMenuOpen= false;

  @ViewChild('tabs', { static: false }) tabs!: ElementRef<HTMLElement>; // Perhatikan tanda seru (!) di sini
  @ViewChild('fab', { static: false }) fab!: ElementRef<HTMLElement>; // Perhatikan tanda seru (!) di sini

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private storage: Storage, // Inject the Storage module
    private router: Router,
    private http: HttpClient,
    private _apiService: ApiService,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.getPesan();
    this.subscribeToKeyboardEvents();
  }

  ngOnDestroy() {
    this.unsubscribeFromKeyboardEvents();
  }

  async presentToast(msg: any, color: any, icon: any) {
    const toast = await this.toastCtrl.create({
      icon: icon,
      message: msg,
      duration: 1500,
      color: color,
      position: 'top',
    });
    toast.present();
  }

  async getPesan() {
    const val = await this.storage.get('isLoggedIn');
    if (val == null) {
      // Handle the case when the user is not logged in
    } else {
      try {
        const res = await this._apiService.getPesan(val.kd_pnddk);
        if (res.msg == 'ok') {
          this.chatMessages = res.data;
          console.log(this.chatMessages);
        } else if (res.msg == 'notFound') {
          this.chatMessages = [];
          // Handle the case when no messages are found
        } else if (res.msg == 'err') {
          this.chatMessages = [];
          // Handle the case when an error occurs
        }
      } catch (error) {
        this.chatMessages = [];
        // Handle other errors, e.g., network issues
      }
    }
  }



  async send() {
    await this.storage.create();
    this.storage.get('isLoggedIn').then(async (val) => {
      if (this.msg == '' || !this.msg.trim().length) {
        this.presentToast(
          'Isilah pesannya...',
          'warning',
          'alert-circle-outline'
        );
        this.msg = '';
      } else {
        const loader = await this.loadingCtrl.create({
          message: 'Please wait...',
          spinner: 'lines',
        });
        loader.present();
        this._apiService.sendPesan(this.msg, val).then((res) => {
          if (res.msg == 'ok') {
            this.getPesan();
            this.msg = '';
            loader.dismiss();
            this.presentToast(
              'Pesan berhasil dikirim!',
              'success',
              'checkmark-circle-outline'
            );
          } else if (res.msg == 'notOk') {
            this.msg = '';
            loader.dismiss();
            this.presentToast(
              'Pesan gagal dikirim!',
              'danger',
              'alert-circle-outline'
            );
          } else if (res.msg == 'err') {
            loader.dismiss();
            this.presentToast(
              'Something went wrong!' + res.err,
              'danger',
              'alert-circle-outline'
            );
          }
        });
      }
    });
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault(); // Mencegah default behavior tombol Tab
      // Anda dapat menambahkan logika tambahan di sini jika diperlukan
    }
  }

  subscribeToKeyboardEvents() {
    window.addEventListener('keyboardWillShow', this.onKeyboardShow);
    window.addEventListener('keyboardWillHide', this.onKeyboardHide);
  }

  unsubscribeFromKeyboardEvents() {
    window.removeEventListener('keyboardWillShow', this.onKeyboardShow);
    window.removeEventListener('keyboardWillHide', this.onKeyboardHide);
  }

  onKeyboardShow = (ev: any) => {
    const tabsElement = this.tabs.nativeElement;
    const fabElement = this.fab.nativeElement;

    // Posisi elemen ke atas sesuai dengan ketinggian keyboard
    tabsElement.style.bottom = ev.keyboardHeight + 'px';
    fabElement.style.bottom = ev.keyboardHeight + 'px';
  }

  onKeyboardHide = () => {
    const tabsElement = this.tabs.nativeElement;
    const fabElement = this.fab.nativeElement;

    // Kembalikan elemen ke posisi awal
    tabsElement.style.bottom = '0';
    fabElement.style.bottom = '0';
  }

  async logout() {
    this.storage.remove('isLoggedIn');
    localStorage.removeItem('isLoggedIn');
    this.navCtrl.navigateRoot(['/login']);
  }
}
