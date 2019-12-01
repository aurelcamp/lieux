import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { icon, latLng, marker, tileLayer, Map } from 'leaflet';
import { GeolocationService } from '../services/geolocation/geolocation.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  showMap = false;
  places = [];
  options: any;
  layers: any[] = [];
  map: Map;
  centerPositionIsLoading = false;

  constructor(
    private storage: Storage,
    private geolocationService: GeolocationService
  ) { }

  ngOnInit() {
    this.initMap();
  }

  async onMapReady(map: Map) {
    // On garde une référence de la map pour pouvoir modifier plus tard
    this.map = map;
    // On récupère la position courante
    const position = await this.geolocationService.getPosition();
    // On centre la carte sur cette position
    map.panTo(latLng(position.lat, position.lon));
  }

  async initMap() {
    // récupérer la dernière valeur sauvegarder pour permettre un affichage immédiat sans attendre le résultat du gps
    const center = await this.geolocationService.getLastValue();
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 10,
      center: latLng(center.lat, center.lon)
    };

    // Ici on récupère les différentes places enregistrées
    this.places = (await this.storage.get('places')) || [];

    // On parcourt les différentes places, qu'on filtre d'abord pour garder uniquement celles qui on des coordonnées gps
    // Ensuite on parcours chacune de celles ci pour ajouter à la map une icon à l'emplacement gps
    this.layers = this.places.filter((place: any) => place.gps && place.gps.lat).map((place: any) => {
      return marker([ place.gps.lat, place.gps.lon ], {
        icon: icon({
           iconSize: [ 25, 41 ],
           iconAnchor: [ 13, 41 ],
           iconUrl: './assets/images/marker/marker-icon-2x.png',
           shadowUrl: './assets/images/marker/marker-shadow.png'
        })
      })
    })

    // Petit hack pour que la carte s'affiche bien. Il est sans doute possible de trouver mieux.
    setTimeout(() => this.showMap = true);
  }

  async center() {
    this.centerPositionIsLoading = true;
    // Centrer la carte sur la position gps courante
    // On récupère la position courante
    const position = await this.geolocationService.getPosition();
    // On centre la carte sur cette position
    this.map.panTo(latLng(position.lat, position.lon));

    this.centerPositionIsLoading = false;
  }

}
