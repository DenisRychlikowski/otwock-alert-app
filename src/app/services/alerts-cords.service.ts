import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AlertsCordsService {
    alertsCords: object = {
        lat: null,
        lng: null
    }

    constructor() {}

    setAlertsCords(lat: number, lng: number) {
        this.alertsCords = {
            lat: lat,
            lng: lng
        }
    }
    
    getAlertsCords(){
        return this.alertsCords;
    }
}