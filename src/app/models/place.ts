import { Position } from './position';

export class Place {
    id: string;
    pictureUrl: string;
    title: string;
    description: string;
    type: string;
    gps: Position;

    // A la différence d'une interface, une classe peut être instanciée, c'est à dire 
    // qu'on peut créer un véritable objet du type donné.
    constructor() {
        this.id = '';
        this.pictureUrl = '';
        this.title = '';
        this.description = '';
        this.type = '';
        this.gps = new Position();
    }
}