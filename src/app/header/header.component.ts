import { Component } from '@angular/core';
import { ThemesService } from '../themes.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  constructor(private themesService: ThemesService) {}

  toggleTheme() {
    this.themesService.toggleTheme();
    console.log("Toggle theme");
  }
}
