import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Place } from '../models/place';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  
  places: Place[];
  selectedType: string;
  defaultImageUrl = './assets/default_image.png';

  constructor(
    private storage: Storage
  ) {
    
  }

  async ngOnInit() {
    this.places = (await this.storage.get('places')) || [];
  }
}
