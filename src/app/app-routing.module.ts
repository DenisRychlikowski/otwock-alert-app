import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { AlertsComponent } from './views/alerts/alerts.component'
import { NotificationsComponent } from './views/notifications/notifications.component'
import { LocalizationListComponent } from './views/localization-list/localization-list.component'
import { SettingsComponent } from './views/settings/settings.component'
import { MapPageComponent } from './views/map-page/map-page.component'
import { AddLocationPageComponent } from './views/localization-list/add-localtion-page/add-location-page.component'
import { DropDownModule } from 'nativescript-drop-down/angular'
import { PrivacyPolicyComponent } from './views/settings/privacy-policy/privacy-policy.component'
import { RegulationsComponent } from './views/settings/regulations/regulations.component'

const routes: Routes = [
  { path: '', redirectTo: '/views/map-page', pathMatch: 'full' },
  { path: 'views/map-page', component: MapPageComponent },
  { path: 'views/alerts', component: AlertsComponent },
  { path: 'views/notifications', component: NotificationsComponent },
  { path: 'views/localization-list', component: LocalizationListComponent },
  { path: 'views/settings', component: SettingsComponent },
  { path: 'views/add-location-page', component: AddLocationPageComponent },
  { path: 'views/settings/privacy-policy', component: PrivacyPolicyComponent },
  { path: 'views/settings/regulations', component: RegulationsComponent },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes), DropDownModule],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
