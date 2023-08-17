import { Component, OnInit } from '@angular/core';
import { getConnectionType, startMonitoring, stopMonitoring } from '@nativescript/core/connectivity';
import * as connectivityModule from "tns-core-modules/connectivity";

@Component({
    selector: 'ns-connection-modal',
    templateUrl: './connection-modal.component.html',
    styleUrls: ['./connection-modal.component.scss'],
    providers: []
})
export class ConnectionModal {
    connectionType: string;
    showModal: boolean = false;

    constructor() {
        let type = getConnectionType();

        switch (type) {
            case connectivityModule.connectionType.none:
                this.connectionType = "None";
                break;
            case connectivityModule.connectionType.wifi:
                this.connectionType = "Wi-Fi";
                break;
            case connectivityModule.connectionType.mobile:
                this.connectionType = "Mobile";
                break;
            default:
                break;
        }
    }

    ngOnInit() {
        if (this.connectionType == "None") {
            this.showModal = true
        }

        startMonitoring((type) => {
            switch (type) {
                case connectivityModule.connectionType.none:
                    this.connectionType = "None";
                    this.showModal = true;
                    break;
                case connectivityModule.connectionType.wifi:
                    this.connectionType = "Wi-Fi";
                    this.showModal = false;
                    break;
                case connectivityModule.connectionType.mobile:
                    this.connectionType = "Mobile";
                    this.showModal = false;
                    break;
                default:
                    break;
            }
        });
    }

    closeModal() {
        this.showModal = false;
    }

    ngOnDestroy() {
        stopMonitoring();
    }
}