import { RouterExtensions, platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import { AppModule } from './app/app.module';
import { ApplicationSettings, isIOS } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import './app/shared/firebase.module';
import './app/shared/firebase.service';

runNativeScriptAngularApp({
    appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});

firebase()
    .initializeApp()
    .then((done) => {
        console.log('Firebase MAIN initializeApp: ', `DONE`);
    });

const messaging = firebase().messaging();

messaging
    .requestPermission()
    .then((requestPermission) => {
        console.log('Firebase MAIN requestPermission: ', 'DONE')
        messaging.showNotificationsWhenInForeground = true;
        messaging.registerDeviceForRemoteMessages().catch((e) => {
            console.log('Firebase MAIN registerDeviceForRemoteMessages', 'DONE');
        }).then(() => {
            messaging.subscribeToTopic("all")
                .then(() => {
                    console.log('Firebase MAIN subscribeToTopic: ', 'DONE');
                    if (isIOS) {
                        messaging.getToken()
                            .then((token: string) => {
                                ApplicationSettings.setString('pushToken', token);
                                console.log('Firebase MAIN getToken: ', token);
                            })
                            .catch((e) => {
                                console.log('Firebase MAIN getToken: ', e);
                            });
                    }
                });
        });
    })
    .catch((e) => {
        console.log('Firebase requestPermission ERROR: ', e)
    });

