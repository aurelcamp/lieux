export class Position {
    lat: number;
    lon: number;

    // A la différence d'une interface, une classe peut être instanciée, c'est à dire 
    // qu'on peut créer un véritable objet du type donné.
    constructor () {
        this.lat = undefined;
        this.lon = undefined;
    }
}