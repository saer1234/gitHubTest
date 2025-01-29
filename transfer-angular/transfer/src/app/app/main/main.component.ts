import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";
import { RouterOutlet } from '@angular/router';
import { BodyComponent } from "./body/body.component";
import { FooterComponent } from "./footer/footer.component";
import { MenuComponent } from "./menu/menu.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [AppComponent, RouterOutlet, BodyComponent, FooterComponent, MenuComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
