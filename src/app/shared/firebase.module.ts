import {APP_INITIALIZER, NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {FirebaseService} from "./firebase.service";

export const initializeFirebase = (firebaseService: FirebaseService) => () => firebaseService.init();

/**
 * Firebase module
 * Handle firebase requests messages
 * Main initialization of firebase is in main.ts
 */
@NgModule({
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeFirebase,
            deps: [FirebaseService],
            multi: true,
        },
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class FirebaseModule {
}
