import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AlertsService {
    showModalSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    showModalSubject$: Observable<boolean> = this.showModalSubject.asObservable();
    mapContainerHeightSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    mapContainerHeightSubject$: Observable<number> = this.mapContainerHeightSubject.asObservable();
    constructor() {}
}