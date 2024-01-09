import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
  ModalController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public nik: any;
  public email: any;


  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private storage: Storage,
    private _apiService: ApiService
  ) {

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
  async Insert() {
    if (
      this.nik == '' ||
      this.email == ''
    ) {
      this.presentToast(
        'Tidak boleh ada form yang kosong, harap isi semua form!',
        'warning',
        'alert-circle-outline'
      );
    } else {
      const loader = await this.loadingCtrl.create({
        message: 'Please wait...',
        spinner: 'lines',
      });
      loader.present();
      const formData = new FormData();
      formData.append('nik', this.nik);
      formData.append('kk', this.email);
      this._apiService.createPenduduk(formData).then((res) => {
        if (res.msg == 'ok') {
          this.loadingCtrl.dismiss();
          this.presentToast(
            'Data berhasil ditambahkan !',
            'success',
            'checkmark-circle-outline'
          );
          this.navCtrl.navigateBack('/login');
        } else if (res.msg == 'notOk') {
          this.loadingCtrl.dismiss();
          this.presentToast(
            'Data gagal ditambahkan !',
            'danger',
            'alert-circle-outline'
          );
        } else if (res.msg == 'err') {
          this.loadingCtrl.dismiss();
          this.presentToast(
            'Something went wrong !',
            'danger',
            'alert-circle-outline'
          );
        }
      });
    }
  }

  ngOnInit() {}
}
