import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AlertsService } from "../../services/alerts.service";
import { MapStyle, MapboxMarker, MapboxView, MapboxViewApi } from "@nativescript-community/ui-mapbox";
import { AbsoluteLayout, Application, CoreTypes } from "@nativescript/core";
import * as geolocation from "@nativescript/geolocation";
import { DataService } from '~/app/services/data-serive.service';
import { AlertsCordsService } from '~/app/services/alerts-cords.service';
import { DarkModeService } from '~/app/services/dark-mode.service';
import Theme from "@nativescript/theme";
import { getConnectionType } from 'tns-core-modules/connectivity';

@Component({
    selector: 'app-alerts',
    templateUrl: './map-page.component.html',
    styleUrls: ['./map-page.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [DataService]
})
export class MapPageComponent implements OnInit, AfterViewInit, OnDestroy {
    locationData: any;
    mapboxApiKey: string;
    modalType: string = '';
    absoluteHeight: number = 0;
    private subscription: Subscription = new Subscription();
    private mapAbsoluteLayout: AbsoluteLayout;
    private userMarker: MapboxMarker;
    private map: MapboxViewApi;
    private mapConfig;
    public isMapLoading: boolean;

    isAlertShow: boolean = false;
    alertName: string = "";
    alertDescription: string = "";
    alertId: number;

    @ViewChild('mapAbsoluteLayout', { static: false }) public mapAbsoluteLayoutRef: ElementRef;
    @ViewChild('mapContainer', { static: false }) public mapContainerRef: ElementRef;
    host: any;
    userAgent: any;
    origin: any;
    url: any;

    constructor(
        public alertsService: AlertsService,
        private activatedRoute: ActivatedRoute,
        private ngZone: NgZone,
        private dataService: DataService,
        private alertsCordsService: AlertsCordsService,
        private darkModeService: DarkModeService,
        private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit() {
        Theme.setMode(Theme.Auto);
        this.extractData()
        this.startMapLoading();
        this.loadMapData();
        this.mapboxApiKey = 'pk.eyJ1IjoibmV0a29uY2VwdDIiLCJhIjoiY2tkcHRqc25lMHhxbDJ5dGFsN3lqbzBuMCJ9.p0EgKFRKdSgqhZYEtgCYAQ';
        if (this.map) {
            this.map.onResume().then();
        }
        if (this.navigateData.lat != null) {
            this.navigateToLocation()
        }
    }

    ngAfterViewInit() {
        this.darkModeService.checkSystemSettingsDarkMode();
        this.mapAbsoluteLayout = this.mapAbsoluteLayoutRef.nativeElement;
        setTimeout(() => {
            this.absoluteHeight = this.mapAbsoluteLayout.getActualSize().height;
        }, 100)
        this.initMap();
        Application.on('orientationChanged', () => {
            setTimeout(() => {
                this.alertsService.mapContainerHeightSubject.next(this.mapContainerRef.nativeElement.getActualSize().height);
            }, 100)
        });

    }

    extractData() {
        this.dataService.getAlerts()
            .subscribe((result) => {
                this.locationData = result;
            }, (error) => {
                console.log(error);
            });
    }

    private initMap() {
        const mapContainer = this.mapContainerRef.nativeElement;
        if (this.navigateData.lat == null && this.navigateData.lng == null) {
            if (Application.systemAppearance() == 'dark') {
                this.mapConfig = {
                    accessToken: this.mapboxApiKey,
                    style: MapStyle.DARK,
                    container: mapContainer,
                    center: {
                        lat: 52.100946382475376,
                        lng: 21.2698571774022
                    },
                    zoomLevel: 12,
                    delay: 500,
                    showUserLocation: false,
                    hideCompass: true,
                    disableZoom: false,
                    disableRotation: true,
                    disableScroll: false,
                    disableTilt: false
                }
            } else {
                this.mapConfig = {
                    accessToken: this.mapboxApiKey,
                    style: MapStyle.LIGHT,
                    container: mapContainer,
                    center: {
                        lat: 52.100946382475376,
                        lng: 21.2698571774022
                    },
                    zoomLevel: 10,
                    delay: 500,
                    showUserLocation: false,
                    hideCompass: true,
                    disableZoom: false,
                    disableRotation: true,
                    disableScroll: false,
                    disableTilt: false,
                }
            }
        } else {
            if (Application.systemAppearance() == 'dark') {
                this.mapConfig = {
                    accessToken: this.mapboxApiKey,
                    style: MapStyle.DARK,
                    container: mapContainer,
                    center: {
                        lat: this.navigateData.lat,
                        lng: this.navigateData.lng
                    },
                    zoomLevel: 12,
                    delay: 500,
                    showUserLocation: false,
                    hideCompass: true,
                    disableZoom: false,
                    disableRotation: true,
                    disableScroll: false,
                    disableTilt: false
                }
            } else {
                this.mapConfig = {
                    accessToken: this.mapboxApiKey,
                    style: MapStyle.LIGHT,
                    container: mapContainer,
                    center: {
                        lat: this.navigateData.lat,
                        lng: this.navigateData.lng
                    },
                    zoomLevel: 12,
                    delay: 500,
                    showUserLocation: false,
                    hideCompass: true,
                    disableZoom: false,
                    disableRotation: true,
                    disableScroll: false,
                    disableTilt: false,
                }
            }
        }
        const mapMapbox: MapboxView = new MapboxView();
        mapMapbox.setConfig(this.mapConfig);
        mapMapbox.on('mapReady', (args) => {
            this.onMapReady(args);
        })
        mapContainer.content = mapMapbox;
    }

    currentLat: number;
    currentLng: number;

    private onMapReady(args): void {
        this.map = args.map;

        this.geolocation()

        this.renderMarkers(this.locationData)

        this.alertsService.mapContainerHeightSubject.next(this.mapContainerRef.nativeElement.getActualSize().height);
    }

    geolocation() {
        geolocation.isEnabled().then(enabled => {
            if (enabled) {
                this.watch();
            } else {
                this.request();
            }
        }, e => {
            this.request();
        });
    }

    request() {
        console.log('enableLocationRequest()');
        geolocation.enableLocationRequest().then(() => {
            console.log('location enabled!');
            this.watch();
        }, e => {
            console.log('Failed to enable', e);
        });
    }

    watch() {
        console.log('watchLocation()');
        geolocation.watchLocation(position => {
            this.currentLat = position.latitude;
            this.currentLng = position.longitude;
            let newMarker = <MapboxMarker>{
                id: 0,
                lat: this.currentLat,
                lng: this.currentLng,
                icon: 'res://user_location_icon'
            }
            this.map.addMarkers([newMarker]).then();
        }, e => {
            console.log('failed to get location');
        }, {
            desiredAccuracy: CoreTypes.Accuracy.high,
            minimumUpdateTime: 500
        });
    }

    addPolygon(polygonData): void {
        let newPolygon = {
            id: String(polygonData.location.id),
            fillColor: "rgb(255, 0, 0)",
            fillOpacity: 0.5,
            strokeColor: "red",
            strokeWidth: 2,
            strokeOpacity: 1,
            points: polygonData.location.coordinates,
        }
        this.map.addPolygon(newPolygon);
    }

    addLine(lineData) {
        this.map.addPolyline({
            id: String(lineData.location.id),
            color: 'red',
            width: 7,
            opacity: 0.7,
            points: lineData.location.coordinates
        });
    }

    addCircle(circleData) {
        this.map.addSource(String(circleData.location.id), {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [circleData.location.coordinates[0].lng, circleData.location.coordinates[0].lat],
                },
            },
        });

        let radius = circleData.location.radius / 0.075 / Math.cos(circleData.location.coordinates[0].lat * Math.PI / 180);

        this.map.addLayer({
            "id": String(circleData.location.id),
            "type": 'circle',
            "source": {
                "type": 'geojson',
                "data": {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [circleData.location.coordinates[0].lng, circleData.location.coordinates[0].lat],
                    }
                }
            },
            "paint": {
                "circle-radius": [
                    "interpolate",
                    ["exponential", 2],
                    ["zoom"],
                    0, 0,
                    20, radius,
                ],
                'circle-opacity': 0.5,
                'circle-color': 'rgba(255, 0, 0, 0.5)',
                'circle-stroke-width': 2,
                'circle-stroke-color': 'red'
            }
        });
    }

    navigateData: any = this.alertsCordsService.getAlertsCords();

    navigateToLocation() {
        setTimeout(() => {
            this.map.setZoomLevel({
                level: 13,
                animated: true
            })
        }, 3000);
    }

    startMapLoading() {
        this.isMapLoading = true;
    }

    stopMapLoading() {
        this.isMapLoading = false;
    }

    loadMapData() {
        setTimeout(() => {
            this.stopMapLoading();
        }, 3000);
    }

    renderMarkers(locationData) {
        locationData.forEach(locationData => {
                let newMarker = <MapboxMarker>{
                    id: locationData.location.id,
                    lat: locationData.location.lat,
                    lng: locationData.location.lng,
                    icon: 'res://map_warn_icon',
                    onTap: () => {
                        this.ngZone.run(() => {
                            this.isAlertShow = true;
                            this.alertId = locationData.id;
                            this.alertName = locationData.name;
                            this.alertDescription = locationData.description;
                            this.renderMapElements(locationData);
                        })
                    }
                };
                this.map.addMarkers([newMarker]).then();
        });
    }

    renderMapElements(locationData) {
        if (locationData.location.type == "Circle") {
            this.addCircle(locationData)
        }
        else if (locationData.location.type == "Polygon") {
            this.addPolygon(locationData)
        }
        else if (locationData.location.type == "LineString") {
            this.addLine(locationData)
        }
    }

    closeModal() {
        this.isAlertShow = false;
        this.map.removePolylines(this.alertId[0])
        this.map.removePolygons(this.alertId[0])
        this.map.removeLayer(String(this.alertId))
        this.map.removeSource(String(this.alertId))
        this.map.removeSource(String(this.alertId + "_source"))
    }

    refresh() {
        this.startMapLoading()
        this.loadMapData()
        this.extractData()
        this.initMap()
        this.connectionType= getConnectionType();
    }

    public connectionType: any = getConnectionType();

    ngOnDestroy(): void { }
}
