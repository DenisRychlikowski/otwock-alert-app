import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptFormsModule, NativeScriptModule } from '@nativescript/angular'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AlertsComponent } from './views/alerts/alerts.component'
import { NotificationsComponent } from './views/notifications/notifications.component'
import { LocalizationListComponent } from './views/localization-list/localization-list.component'
import { SettingsComponent } from './views/settings/settings.component'
import { MapPageComponent } from './views/map-page/map-page.component'
import { AddLocationPageComponent } from './views/localization-list/add-localtion-page/add-location-page.component'
import { DropDownModule } from "nativescript-drop-down/angular";
import { NativeScriptSvgModule } from '@sergeymell/nativescript-svg/angular'
import { BottomNav } from './components/bottom-nav/bottom-nav.component'
import { ConnectionModal } from './components/connection-modal/connection-modal.component'
import { DataService } from './services/data-serive.service'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpHeaderInterceptor } from '../app/interceptors/http-header.interceptor'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { AlertsCordsService } from './services/alerts-cords.service'
import { DarkModeService } from './services/dark-mode.service'
import { PrivacyPolicyComponent } from './views/settings/privacy-policy/privacy-policy.component'
import { RegulationsComponent } from './views/settings/regulations/regulations.component'
import { MessageService } from './services/message.service'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, DropDownModule, NativeScriptSvgModule, HttpClientModule, NativeScriptFormsModule, ReactiveFormsModule],
  declarations: [AppComponent, AlertsComponent, NotificationsComponent, LocalizationListComponent, SettingsComponent, MapPageComponent, AddLocationPageComponent, BottomNav, ConnectionModal, PrivacyPolicyComponent, RegulationsComponent],
  providers: [DataService,
    AlertsCordsService,
    DarkModeService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true
    },
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
