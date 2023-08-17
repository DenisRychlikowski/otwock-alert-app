import { Component, NgZone } from '@angular/core';
import { firebase } from '@nativescript/firebase-core';
import './shared/firebase.module'
import './shared/firebase.service';
import { RouterExtensions } from '@nativescript/angular';
import { RemoteMessage } from '@nativescript/firebase-messaging';
import { MessageService } from './services/message.service';

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
  styleUrls: [],
  providers: []
})
export class AppComponent {
  constructor(private router: RouterExtensions, private ngZone: NgZone) {
    firebase().messaging().onNotificationTap((message: RemoteMessage) => this.ngZone.run(() => {
      this.goToNotificationsView()
    }))
  }

  goToNotificationsView() {
    this.router.navigate(['/views/notifications'])
  }
}