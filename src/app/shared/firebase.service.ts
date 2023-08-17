import {Injectable, NgZone} from '@angular/core';
import {ApplicationSettings, Dialogs} from '@nativescript/core';
import {firebase} from '@nativescript/firebase-core';
import '@nativescript/firebase-messaging';
// import {PageService} from "~/app/page/services/page.service";
// import {ConfigurationService} from "~/app/shared/services/configuration.service";
import {RemoteMessage} from "@nativescript/firebase-messaging";
import {RouterExtensions} from "@nativescript/angular";

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    constructor(
        // public pageService: PageService,
        // private configurationService: ConfigurationService,
        private routerExtensions: RouterExtensions,
        private ngZone: NgZone
    ) {
    }

    init(): Promise<any> {

        return new Promise((resolve) => {
            const messaging = firebase().messaging();
            messaging.onToken((token) => {
                ApplicationSettings.setString('pushToken', token);
                console.log('Firebase Service onToken: ', token);
            });

            messaging.onMessage((message) => {
                console.log('Firebase Service onMessage')
                this.showAlertDialog('Firebase onMessage', message);
            });

            messaging.onNotificationTap((message) => {
                console.log('Firebase Service onNotificationTap: ');
                this.redirectToView(message, 1000);
            });

            messaging
                .getToken()
                .then((token: string) => {
                    ApplicationSettings.setString('pushToken', token);
                    // this.pageService.getPage(1).subscribe(); //pierwszy request do zapisania tokena
                    console.log('Firebase Service getToken: ', token);
                })
                .catch((e) => {
                    console.log('Firebase Service getToken ERROR: ', e);
                });
            resolve(null);
        });
    }

    /**
     *
     * @param text
     * @param message
     */
    showAlertDialog(text: string, message: RemoteMessage | any = {}): void {
        console.log('Firebase message:', message);
        this.ngZone.run(() => {
            Dialogs.confirm({
                title: message?.data['header'],
                message: message?.data['title'],
                okButtonText: message?.data['okButton'],
                cancelButtonText: message?.data['cancelButton']
            }).then(result => {
                if (result === true) {
                    this.redirectToView(message);
                }
            });
        });
    }

    /**
     *
     * @param message
     * @param timeout
     */
    redirectToView(message: RemoteMessage | any = {}, timeout: number = 0): void {
        this.ngZone.run(() => {
            setTimeout(() => {
                let linkData = message.data;
                this.routerExtensions.navigate(['/alerts'], {queryParams: {alertId: linkData.alertId}})
            }, timeout)
        })
    }
}
