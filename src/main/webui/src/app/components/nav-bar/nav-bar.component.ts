import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a class="brand" routerLink="/">⚡ Zelus</a>
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Races</a>
        <a routerLink="/new" routerLinkActive="active">+ New Race</a>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { display: flex; align-items: center; gap: 2rem; padding: 0.75rem 1.5rem; background: #1a1a2e; color: #fff; }
    .brand { font-size: 1.3rem; font-weight: 700; color: #fff; text-decoration: none; }
    .nav-links { display: flex; gap: 1rem; }
    .nav-links a { color: #ccc; text-decoration: none; padding: 0.4rem 0.8rem; border-radius: 6px; transition: background 0.2s; }
    .nav-links a:hover, .nav-links a.active { background: #16213e; color: #fff; }
  `]
})
export class NavBarComponent {}
