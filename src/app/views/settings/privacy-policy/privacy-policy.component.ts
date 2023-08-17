import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { DataService } from '~/app/services/data-serive.service';

@Component({
    selector: 'ns-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss'],
    providers: []
})
export class PrivacyPolicyComponent implements OnInit {
    public privacyPolicyString: string;
    private privacyPolicy: any;
    
    constructor(private routerEsxt: RouterExtensions, private dataService: DataService) { }
    
    ngOnInit(): void {
        this.privacyPolicyString = "<h1>Loading...</h1>";
        this.extractData()
    }

    goBack() {
        this.routerEsxt.back();
    }

    extractData() {
        this.dataService.getPolicyPrivate()
            .subscribe((result) => {
                this.privacyPolicy = result;
                this.privacyPolicyString = result.pages[0].content;
            }, (error) => {
                console.log(error);
            });
    }

}