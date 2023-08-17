import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { Observable } from '@nativescript/core';

@Injectable()
export class DataService {
    private baseUrl: string = 'https://alert.azure.netk.pl/api';
    private notificationsCategories: string = 'https://alert.azure.netk.pl/api/notifications/categories';
    private deviceNotCategories: string = 'https://alert.azure.netk.pl/api/device/notifications/categories';
    private postDeviceNotCategories: string = 'https://alert.azure.netk.pl/api/device/notifications/categories/save';
    private PushNotifications = 'https://alert.azure.netk.pl/api/device';
    private setPushNotifications = 'https://alert.azure.netk.pl/api/device/notifications/push';
    //Teryt
    private provinces = 'https://alert.azure.netk.pl/api/teryt/provinces';
    private discricts = 'https://alert.azure.netk.pl/api/teryt/districts';
    private commune = 'https://alert.azure.netk.pl/api/teryt/communes';
    private cities = 'https://alert.azure.netk.pl/api/teryt/cities';
    private streets = 'https://alert.azure.netk.pl/api/teryt/streets'
    private postAdresses = 'https://alert.azure.netk.pl/api/device/addresses/store';
    private getAddress = 'https://alert.azure.netk.pl/api/device/addresses';
    private removeAddress = 'https://alert.azure.netk.pl/api/device/addresses/destroy';

    constructor(private http: HttpClient) { }

    getData() {
        let headers = this.createRequestHeader();
        return this.http.get(this.notificationsCategories, { headers: headers }).pipe(
            map((data: any) => {
                return data.data.categories;
            })
        )
    }
    getDeviceNotCategories() {
        let headers = this.createRequestHeader();
        return this.http.get(this.deviceNotCategories, { headers: headers }).pipe(
            map((data: any) => {
                return data.data.categories;
            })
        )
    }
    getPushNotifications() {
        let headers = this.createRequestHeader();
        return this.http.get(this.PushNotifications, { headers: headers }).pipe(
            map((data: any) => {
                return data.data.device.notifications;
            })
        )
    }
    postDeviceNotCategory(categoryIds: Array<number>) {
        let headers = this.createRequestHeader();
        let params = new HttpParams;
        categoryIds.map((categoryId) => {
            params = params.append('categories[]', categoryId)
        });
        return this.http.post(this.postDeviceNotCategories, params.toString(), { headers: headers })
    }
    postPushNotifications(pushAllow) {
        let headers = this.createRequestHeader();
        let params = new HttpParams;
        if (pushAllow == true) {
            params = params.append('notifications', 1)
        } else {
            params = params.append('notifications', 0)
        }
        return this.http.post(this.setPushNotifications, params.toString(), { headers: headers })
    }
    private createRequestHeader() {
        let headers = new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded",
        });
        return headers;
    }
    getAlerts() {
        let headers = this.createRequestHeader();
        return this.http.get<Array<any>>(this.baseUrl + '/alerts', { headers: headers }).pipe(
            map((data: any) => {
                return data.data.alerts;
            })
        )
    }
    //Teryt methods
    getProvinces() {
        let headers = this.createRequestHeader();
        return this.http.post(this.provinces, { headers: headers }).pipe(
            map((data: any) => {
                return data.data.options;
            })
        )
    }
    getDiscricts(provId) {
        let headers = this.createRequestHeader();
        let params = new HttpParams;
            params = params.append('provinceId', provId)
        return this.http.post(this.discricts, params.toString(), { headers: headers }).pipe(
            map((data: any) => {
                return data.data.options;
            })
        )
    }
    getCommune(provId, distId) {
        let headers = this.createRequestHeader();
        let params = new HttpParams;
        if(provId < 10){
            provId = 0 + String(provId)
        }
        if(distId < 10){
            distId = 0 + String(distId);
        }
        let id = String(provId) + String(distId);
            params = params.append('districtId', id)
        return this.http.post(this.commune, params.toString(), { headers: headers }).pipe(
            map((data: any) => {
                return data.data.options;
            })
        )
    }
    getCities(provId, distId, commId) {
        let headers = this.createRequestHeader();
        let params = new HttpParams;
        if(provId < 10){
            provId = 0 + String(provId)
        }
        if(distId < 10){
            distId = 0 + String(distId);
        }
        if(commId < 10){
            commId = 0 + String(commId)
        }
        let id = String(provId) + String(distId)+ commId;
            params = params.append('communeId', id)
        return this.http.post(this.cities, params.toString(), { headers: headers }).pipe(
            map((data: any) => {
                return data.data.options;
            })
        )
    }
    getStreets(citId) {
        let headers = this.createRequestHeader();
        let params = new HttpParams;
        if(citId < 10){
            citId = 0 + String(citId);
        }
            params = params.append('cityId', citId)
        return this.http.post(this.streets, params.toString(), { headers: headers }).pipe(
            map((data: any) => {
                return data.data.options;
            })
        )
    }
    getLocations(){
        let headers = this.createRequestHeader();
        return this.http.get(this.getAddress, { headers: headers }).pipe(
            map((data: any) => {
                return data.data.addresses;
            })
        )
    }
    postLocation(distId, communeId, cityId, streetId, numberStreet, city, street){
        let headers = this.createRequestHeader();
        let params = new HttpParams;
        params = params.append('street', street)
        params = params.append('street_number', numberStreet)
        params = params.append('city', city)
        params = params.append('teryt_district', distId)
        params = params.append('teryt_commune', communeId)
        params = params.append('teryt_city', cityId)
        params = params.append('teryt_street', streetId)
        return this.http.post(this.postAdresses, params, { headers: headers }).pipe(
            map((data: any) => {
                return data;
            })
        )
    }
    removeLocation(id){
        let headers = this.createRequestHeader();
        let params = new HttpParams;
        params = params.append('id', id)
        return this.http.post(this.removeAddress, params.toString(), { headers: headers })
    }
    getDevicePushNotifications(){
        let headers = this.createRequestHeader();
        return this.http.get('https://alert.azure.netk.pl/api/device/notifications/push', { headers: headers }).pipe(
            map((data: any) => {
                return data.data.notifications;
            })
        )
    }

    getPolicyPrivate(){
        let headers = this.createRequestHeader();
        return this.http.get('https://alert.azure.netk.pl/api/page/list', { headers: headers }).pipe(
            map((data: any) => {
                return data.data;
            })
        )
    }
}