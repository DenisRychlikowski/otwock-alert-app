import { Component, OnInit } from '@angular/core'
import { DataService } from '~/app/services/data-serive.service';
import { empty, isEmpty } from 'rxjs';
import { DarkModeService } from '~/app/services/dark-mode.service';
import { Dialogs } from '@nativescript/core';
import { getConnectionType } from 'tns-core-modules/connectivity';

@Component({
  selector: 'ns-localization-list',
  templateUrl: './localization-list.component.html',
  styleUrls: ['./localization-list.component.css']
})
export class LocalizationListComponent implements OnInit {
  public locationsList;
  isLocationsLoad: boolean;
  isWarnShow: boolean = false;
  locationToDelte: any;

  constructor(
    private dataServ: DataService,
    private darkModeService: DarkModeService
  ) { }

  ngOnInit(): void {
    this.startLocationsLoading()
    this.dataServ.getLocations()
      .subscribe((result) => {
        this.locationsList = result
      }, (error) => {
        console.log(error);
      });
    this.loadLocationsData();
  }
  ngAfterViewInit() {
    this.darkModeService.checkSystemSettingsDarkMode()
  }
  showWarnModal(location: any) {
    this.isWarnShow = true;
    this.locationToDelte = location;
  }
  removeLocation() {
    if (true) {
      this.dataServ.removeLocation(this.locationToDelte.id).subscribe({
        next: (data) => { },
        error: (error) => {
          console.log(error);
        }
      });

      this.locationsList = this.locationsList.filter(e => this.locationToDelte.id !== e.id);

      this.isWarnShow = false;
    }
  }

  closeModal() {
    this.isWarnShow = false;
    this.locationToDelte = null;
  }

  startLocationsLoading() {
    this.isLocationsLoad = true;
  }
  stopLocationsLoading() {
    this.isLocationsLoad = false;
  }
  loadLocationsData() {
    setTimeout(() => {
      this.stopLocationsLoading();
    }, 1500);
  }

  isArrayEmpty() {
    if (this.locationsList == false) {
      return false;
    } else {
      return true;
    }
  }

  refresh() {
    this.startLocationsLoading()
    this.loadLocationsData()
    this.dataServ.getLocations()
      .subscribe((result) => {
        this.locationsList = result
      }, (error) => {
        console.log(error);
      });
  }

  public connectionType: any = getConnectionType();
}
