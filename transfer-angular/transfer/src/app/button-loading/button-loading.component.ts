import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-loading.component.html',
  styleUrl: './button-loading.component.css'
})
export class ButtonLoadingComponent {
  @Input()  display:boolean=false;

}
