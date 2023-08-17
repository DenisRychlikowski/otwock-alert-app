import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { Application } from '@nativescript/core';
import Theme from '@nativescript/theme';
import { filter } from 'rxjs'
import { DarkModeService } from '~/app/services/dark-mode.service';

@Component({
  selector: 'ns-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css']
})
export class BottomNav implements OnInit {

  private _activatedUrl: string = 'views/alerts'
  constructor(
    private router: Router,
    private darkModeService: DarkModeService
  ) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => (this._activatedUrl = event.urlAfterRedirects))
  }
  ngAfterViewInit() {
    Theme.setMode(Theme.Auto);
  }
  isComponentSelected(url: string): boolean {
    return this._activatedUrl === url
  }
}
