import { ApplicationModule, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { DataService } from '~/app/services/data-serive.service';
import { DeviceService } from '../../shared/device.service'
import { DarkModeService } from '~/app/services/dark-mode.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ns-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public pushAllow: boolean;
  isSwitchChecked: boolean = true;
  isCategoryLoad: boolean = false;
  public categories;
  public deviceCategories;
  public selectedCategoryIds = [];

  constructor(
    private dataService: DataService,
    private darkModeService: DarkModeService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.extractData()
    this.starCategoryLoading()
    this.loadCategoryData()
  }
  ngAfterViewInit(): void {
    this.darkModeService.checkSystemSettingsDarkMode()
  }

  extractData() {
    this.dataService.getData()
      .subscribe((result) => {
        this.categories = result;
      }, (error) => {
        console.log(error);
      });
    this.dataService.getDeviceNotCategories()
      .subscribe((result) => {
        this.deviceCategories = result;
      }, (error) => {
        console.log(error);
      });
    this.dataService.getPushNotifications()
      .subscribe((result) => {
        if (result == 1) {
          this.pushAllow = true;
          this.isSwitchChecked = true;
        } else {
          this.pushAllow = false;
          this.isSwitchChecked = false;
        }
      }, (error) => {
        console.log(error);
      });
  }

  starCategoryLoading() {
    this.isCategoryLoad = true;
  }
  stopCategoryLoading() {
    this.isCategoryLoad = false;
  }
  loadCategoryData() {
    setTimeout(() => {
      this.stopCategoryLoading();
    }, 1500);
  }

  showSettings: boolean = true;

  postDeviceActive(id) {
    this.starCategoryLoading()
    this.loadCategoryData()
    if (this.selectedCategoryIds.includes(id)) {
      let indexForDelete = this.selectedCategoryIds.indexOf(id);
      this.selectedCategoryIds = this.selectedCategoryIds.filter(ids => ids != id)
      this.deviceCategories = this.deviceCategories.filter(ids => ids.id != id)
    } else {
      this.selectedCategoryIds.push(id)
    }
    let duplicateCategoriesId = [...new Set(this.selectedCategoryIds)];

    this.dataService.postDeviceNotCategory(duplicateCategoriesId).subscribe({
      next: (data: any) => {
        this.deviceCategories = data.data.categories;
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.showSettings = false;
    setTimeout(() => {
      this.showSettings = true;
    }, 10)
  }

  checkDeviceActive(categoryId) {
    let itemFiltered = this.deviceCategories.filter((item) => item.id == categoryId)
    if (itemFiltered.length) {
      this.selectedCategoryIds.push(categoryId)
      return true
    } else {
      return false
    }
  }

  toogleSwitchView() {
    this.dataService.postPushNotifications(!this.pushAllow).subscribe({
      next: (data) => { },
      error: (error) => {
        console.log(error);
      }
    });
    this.pushAllow = !this.pushAllow
    this.isSwitchChecked = !this.pushAllow;
    return !this.pushAllow
  }

  refresh() {
    this.starCategoryLoading()
    this.loadCategoryData()
    this.extractData()
  }
}
