import { Injectable } from '@angular/core';
import { Application } from '@nativescript/core';

@Injectable()
export class DarkModeService {
    constructor(){}
    
    checkSystemSettingsDarkMode(){
        const isSystemDarkMode = Application.systemAppearance();

        if(isSystemDarkMode === 'dark') {
            // handle dark mode
        } else {
            // handle light mode
        }
    }
    darkModeSwitchService() {
        let systemApperance = Application.systemAppearance();
        if(systemApperance ==='dark'){
            Application.setSystemAppearance('dark')
        } else {
            Application.setSystemAppearance('light')
        }   
    }
}
