import { Component, OnInit } from '@angular/core'
import { isUndefined } from '@nativescript/core/utils';
import { DarkModeService } from '~/app/services/dark-mode.service';
import { DataService } from '~/app/services/data-serive.service';
import { MessageService } from '~/app/services/message.service';

@Component({
  selector: 'ns-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public notifications;
  public selectedCategories;
  pushNotificationsAllow: boolean;
  isNotificationsLoad: boolean;

  constructor(
    private dataService: DataService,
    private darkModeService: DarkModeService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.starNotificationsLoading()
    this.extractData()
    this.loadNotificationsData()
  }
  ngAfterViewInit() {
    this.extractData()
    this.darkModeService.checkSystemSettingsDarkMode()
  }

  extractData() {
    this.dataService.getDevicePushNotifications()
      .subscribe((result) => {
        this.notifications = result;
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

  darkModeSwitch() {
    this.darkModeService.darkModeSwitchService();
  }

  starNotificationsLoading() {
    this.isNotificationsLoad = true;
  }

  stopNotificationsLoading() {
    this.isNotificationsLoad = false;
  }

  loadNotificationsData() {
    setTimeout(() => {
      this.stopNotificationsLoading();
    }, 1500);
  }

  isArrayEmpty() {
    if (this.notifications == false) {
      return false;
    } else {
      return true;
    }
  }

  refresh() {
    this.starNotificationsLoading()
    this.loadNotificationsData()
    this.extractData()
  }
}
