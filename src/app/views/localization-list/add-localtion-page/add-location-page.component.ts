import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { Application, ObservableArray, keyboardTypeProperty } from '@nativescript/core';
import { Province } from '~/app/models/province.model';
import { DataService } from '~/app/services/data-serive.service';
import { DeviceService } from '~/app/shared/device.service';
import { RouterExtensions } from '@nativescript/angular';
import { dismissKeyboard } from '@nativescript/core/utils';

@Component({
  selector: 'ns-localization-list',
  templateUrl: './add-location-page.component.html',
  styleUrls: ['./add-location-page.component.css']
})
export class AddLocationPageComponent implements OnInit {
  myForm: FormGroup;
  isWarnShow: boolean = false;
  //ngmodels
  province: string = "";
  district: string = "";
  commune: string = "";
  cities: string = "";
  street: string = "";
  numberStreet: string = "";
  //lists
  public provinceList;
  public districtList;
  public communeList;
  public citiesList;
  public streetList;
  //focus
  provinceFocus: boolean = false;
  districtFocus: boolean = false;
  communeFocus: boolean = false;
  citiesFocus: boolean = false;
  streetFocus: boolean = false;
  numberStreetFocus: boolean = false;
  //temporary lists
  provinceFilteredList;
  districtFilteredList;
  communeFilteredList;
  citiesFilteredList;
  streetFilteredList;
  //Ids
  provinceId;
  distirctId;
  communeId;
  citiesId;
  streetId
  //
  city: string;
  street_name: string;

  ngOnInit(): void {
    this.extractData()
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private device: DeviceService,
    private router: Router,
    private routerEsxt: RouterExtensions
  ) {
    this.myForm = this.formBuilder.group({
      province: ["", Validators.required],
      district: ["", Validators.required],
      commune: ["", Validators.required],
      cities: ["", Validators.required],
      street: ["", Validators.required],
      number_street: [""]
    })
  }

  extractData() {
    this.dataService.getProvinces()
      .subscribe((result) => {
        this.provinceList = result
      }, (error) => {
        console.log(error);
      });
  }

  //Teryt filter
  filterProvinceData() {
    this.provinceFilteredList = this.provinceList.filter((e) => {
      return e.name.toLowerCase().includes(this.province.toLowerCase().trim())
    })
    if(this.provinceFilteredList[0] != null || this.provinceFilteredList[0] != undefined){
      this.provinceFocus = true;
      return this.provinceFilteredList;
    } else {
      this.provinceFocus = false;
    }

  }
  filterDistrictData() {
    this.districtFilteredList = this.districtList.filter((e) => {
      return e.name.toLowerCase().includes(this.district.toLowerCase().trim())
    })
    return this.districtFilteredList
  }
  filterCommuneData() {
    this.communeFilteredList = this.communeList.filter((e) => {
      return e.name.toLowerCase().includes(this.commune.toLowerCase().trim())
    })
    return this.communeFilteredList
  }
  filterCitiesData() {
    this.citiesFilteredList = this.citiesList.filter((e) => {
      return e.name.toLowerCase().includes(this.cities.toLowerCase().trim())
    })
    return this.citiesFilteredList
  }
  filterStreetData() {
      this.streetFilteredList = this.streetList.filter((e) => {
        return e.name.toLowerCase().includes(this.street.toLowerCase().trim())
      })
      if(this.streetFilteredList[0] == undefined){
        const brakUlicy = {
          "id": -1,
          "type": "",
          "name": "brak ulicy"
      };
        this.streetFilteredList.push(brakUlicy)
        return this.streetFilteredList
      } else {
        return this.streetFilteredList    
      }
  }
  
  //Teryt add
  addToProvinceTextField(province){
    this.provinceId = province.id;
    this.province = province.name.toLowerCase();
    this.provinceFocus = false;
    dismissKeyboard();
    this.dataService.getDiscricts(province.id)
    .subscribe((result) => {
      this.districtList = result
    }, (error) => {
      console.log(error);
    });
  }
  addToDistrictTextField(district){
    this.distirctId = district.id;
    this.district = district.name.toLowerCase();
    this.districtFocus = false;
    dismissKeyboard();
    this.dataService.getCommune(this.provinceId, district.id)
    .subscribe((result) => {
      this.communeList = result
    }, (error) => {
      console.log(error);
    });
  }
  addToCommuneTextField(commune){
    this.communeId = commune.id;
    this.commune = commune.name.toLowerCase();
    this.communeFocus = false;
    dismissKeyboard();
    this.dataService.getCities(this.provinceId, this.distirctId, commune.id)
    .subscribe((result) => {
      this.citiesList = result
    }, (error) => {
      console.log(error);
    });
  }
  addToCitiesTextField(cities){
    this.city = cities.name.toLowerCase();
    this.citiesId = cities.id
    this.cities = cities.name.toLowerCase();
    this.citiesFocus = false;
    dismissKeyboard();
    this.dataService.getStreets(cities.id)
    .subscribe((result) => {
      this.streetList = result
    }, (error) => {
      console.log(error);
    });
  }
  addToStreetTextField(street){
    this.street = street.name;
    this.street_name = street.name;
    this.streetId = street.id;
    dismissKeyboard();
    this.streetFocus = false;
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isWarnShow = true;
      this.dataService.postLocation(this.distirctId, this.communeId, this.citiesId, this.streetId, this.numberStreet, this.city, this.street_name).subscribe({
        next: (data) => {},
        error: (error) => {
          console.log(error);
        }
      });
      this.province = "";
      this.district = "";
      this.commune = "";
      this.cities = "";
      this.street = "";
      this.numberStreet = "";
      setTimeout(() => {
        this.router.navigate(['/views/localization-list']);
      }, 500);
    }
  }

  goBack(){
    this.routerEsxt.back();
  }

  closeModal() {
    this.isWarnShow = false;
  }
}
