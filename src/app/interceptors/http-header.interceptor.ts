import {
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApplicationSettings} from "@nativescript/core";
import {DeviceService} from "~/app/shared/device.service";

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

    constructor(
        private deviceService: DeviceService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let newHeaders: HttpHeaders = req.headers;
        let uuid = this.deviceService.getDeviceUuid();
        let model = this.deviceService.getModel();
        let version = this.deviceService.getDeviceVersion();
        let apiKey = 'Y4G6H34wqqBkkhBRKDLFXDjOz0KZElRe5NTV4Q9raTDHAD3iPOwMI8YRiUzcU8CeYPmsRErGkh0lfgus8yJOVHkqGHTTESDJJR1ddFLq9jotBgZK5zKAZLTBs4zHyfeM';
        let apiPush = ApplicationSettings.getString('pushToken');

        newHeaders = newHeaders.append('x-apikey', apiKey);
        newHeaders = newHeaders.append('x-device', uuid);
        newHeaders = newHeaders.append('x-os', model);
        newHeaders = newHeaders.append('x-os-version', version);
        newHeaders = newHeaders.append('x-push', (typeof apiPush !== 'undefined') ? apiPush : '');
        const reqWithNewHeaders = req.clone({headers: newHeaders});

        return next.handle(reqWithNewHeaders);
    }
}
