import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';

@Injectable()
export class MessageService {
    messages: any;

    constructor(private router: RouterExtensions) { }

    public goToNotificationsView() {
        this.router.navigate(['/views/notifications'])
    }
}