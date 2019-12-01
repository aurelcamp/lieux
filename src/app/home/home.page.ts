import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastController, ActionSheetController, IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { Place } from '../models/place';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  enableLocation = false;
  isLocationLoading = false;

  place: Place = {
    id: '',
    pictureUrl: '',
    title: '',
    description: '',
    type: '',
    gps: {
      lat: undefined,
      lon: undefined,
    },
  }
  // la définition de place précédente est équivalente à :
  // place = new Place();

  types = ['Paysage', 'Architecture', 'Autre'];
  defaultImageUrl = './assets/default_image.png';

  constructor(
    private camera: Camera,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    private storage: Storage,
    private router: Router,
    private geolocation: Geolocation,
  ) {}

  takePicture() {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true,
    }
    this.useCamera(options);
  }

  takeFile() {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }
    this.useCamera(options);
  }

  async useCamera(options: any) {
    try {
      const imageData = await this.camera.getPicture(options);
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.place.pictureUrl = base64Image;
    }
    catch (err) { 

    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async validate() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Albums',
      buttons: [
      {
        text: 'Enregistrer',
        icon: 'save',
        handler: () => {
          this.save();
        }
      },
      {
        text: 'Partager',
        icon: 'share',
        handler: () => {
          this.share();
        }
      }, 
      {
        text: 'Annuler',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  share() {
    const options = {
      message: this.place.description,
      subject: this.place.title,
      files: [this.place.pictureUrl],
      // url: 'https://www.website.com/foo/#bar?a=b',
      chooserTitle: 'Choisir une app',
      // appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
      // iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };

    this.socialSharing.shareWithOptions(options).then(() => {
      // this.presentToast('Le lieu a bien été partagé');

    }).catch((e) => {
      console.log(e);
    });
  }

  async save() {
    const uid = this.generateUid();
    this.place.id = uid;

    let places = await this.storage.get('places') || [];
    places.push(this.place);
    await this.storage.set('places', places);
    this.router.navigate(['/list']);
  }

  // On génère un identifiant unique pour les places
  // C'est pour l'exemple, on génère en fait un identifiant complexe
  // En pratique on peut utiliser une vraie fonction qui vérifie l'unicité
  generateUid() {
    return Math.random().toString(36).substr(2, 16);
  }

  getLocation() {
    if (!this.enableLocation) return;
    this.isLocationLoading = true;
    const options = { maximumAge: 30000, timeout: 30000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.isLocationLoading = false;
      this.place.gps = {
        lat: resp.coords.latitude,
        lon: resp.coords.longitude,
      }
    }).catch((error) => {
      this.isLocationLoading = false;
      console.log('Error getting location', error);
    });
  }

}
