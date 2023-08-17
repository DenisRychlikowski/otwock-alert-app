import { ApplicationRef, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { DataService } from '~/app/services/data-serive.service';
import { SettingsComponent } from '../settings/settings.component'
import { Router } from '@angular/router';
import { AlertsCordsService } from '~/app/services/alerts-cords.service';
import { DarkModeService } from '~/app/services/dark-mode.service';

@Component({
  selector: 'ns-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  public alerts: Array<any>;
  public filteredAlerts;
  public selectedCategories: any;
  pushNotificationsAllow: boolean;
  isAlertsLoad: boolean;

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertsCordsService: AlertsCordsService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.starAlertsLoading()
    this.extractData()
    this.loadAlertsData()
  }
  
  ngAfterViewInit() {
    this.extractData()
  }

  extractData() {
    this.dataService.getDeviceNotCategories()
      .subscribe((result) => {
        this.selectedCategories = result;
      }, (error) => {
        console.log(error);
      });
      this.dataService.getAlerts()
      .subscribe((result) => {
        this.alerts = result;
        this.filteredAlerts = this.alerts.filter(alert => {
          return this.selectedCategories.some(category => alert.category.id === category.id);
        });
      }, (error) => {
        console.log(error);
      });
    this.dataService.getPushNotifications()
      .subscribe((result) => {
        this.pushNotificationsAllow = result;
      }, (error) => {
        console.log(error);
      });
  }
  navigateToLocation(alertData) {
    if(alertData.location.coordinates != null){
      this.alertsCordsService.setAlertsCords(alertData.location.lat, alertData.location.lng)
      this.router.navigate(["/views/map-page"]);
    }
  }

  starAlertsLoading() {
    this.isAlertsLoad = true;
  }
  stopAlertsLoading() {
    this.isAlertsLoad = false;
  }
  loadAlertsData() {
    setTimeout(() => {
      this.stopAlertsLoading();
    }, 2000);
  }

  isArrayEmpty(){
    if(this.filteredAlerts == false){
      return false;
    } else {
      return true;
    }
  }

  refresh() {
    this.starAlertsLoading()
    this.loadAlertsData()
    this.extractData()
  }
}
