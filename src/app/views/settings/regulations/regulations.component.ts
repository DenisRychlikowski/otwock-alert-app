import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { DataService } from '~/app/services/data-serive.service';

@Component({
    selector: 'ns-reglations',
    templateUrl: './regulations.component.html',
    styleUrls: ['./regulations.component.scss'],
    providers: []
})
export class RegulationsComponent implements OnInit {
    public regulationsString: string;
    private regulations: any;
    
    constructor(private routerEsxt: RouterExtensions, private dataService: DataService) { }
    
    ngOnInit(): void {
        this.regulationsString = "<h1>Loading...</h1>";
        this.extractData()
    }

    goBack() {
        this.routerEsxt.back();
    }

    extractData() {
        this.dataService.getPolicyPrivate()
            .subscribe((result) => {
                this.regulations = result;
                this.regulationsString = result.pages[1].content;
            }, (error) => {
                console.log(error);
            });
    }

}