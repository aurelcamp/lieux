import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';

import { Position } from '../../models/position';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(
    private geolocation: Geolocation,
    private storage: Storage,
  ) {}

  timeoutPromise(milliseconds: number): Promise<void> {
    return new Promise((res, rej) => {
      setTimeout(() => res(), milliseconds);
    })
  }

  async getPosition(): Promise<Position> {
    const options = { maximumAge: 30000, timeout: 30000, enableHighAccuracy: true };
    try {
      const resp = await this.geolocation.getCurrentPosition(options);
      const position = {
        lat: resp.coords.latitude,
        lon: resp.coords.longitude,
      }
      // sauvegarder la position
      this.storage.set('lastPosition', position);
      return position;
    } catch(e) {
      // En cas d'erreur retourner la dernière valeur sauvegardée
      return this.getLastValue();
    }
  }

  async getLastValue(): Promise<Position> {
    // Retourner une valeur par défaut pour un affichage plus rapide ou en cas d'erreur de la localisataion par gps
    let lastPosition =  await this.storage.get('lastPosition');
    if (!lastPosition) {
      // Si aucune précédente valeur n'a été enregistrée c'est à dire lors du lancement de l'application,
      // présenter une valeur par défaut, par exemple la localisation de Trappes
      lastPosition = {
        lat: 48.776731,
        lon: 2.001844
      }
    }
    return lastPosition;
  }
}
