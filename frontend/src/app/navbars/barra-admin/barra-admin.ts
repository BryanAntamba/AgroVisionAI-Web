import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-barra-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './barra-admin.html',
  styleUrl: './barra-admin.css',
})
export class BarraAdmin {}
