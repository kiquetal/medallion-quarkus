import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  template: `
    <app-nav-bar />
    <router-outlet />
  `,
  styles: [`:host { display: block; min-height: 100vh; background: #f8f9fa; }`]
})
export class AppComponent {}
