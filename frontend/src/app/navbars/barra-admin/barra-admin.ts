import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-barra-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './barra-admin.html',
  styleUrl: './barra-admin.css',
})
export class BarraAdmin {}
