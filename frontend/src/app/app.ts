import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TemaService } from './shared/services/tema.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  constructor(private temaService: TemaService) {
    // El servicio inicializa y aplica el tema guardado en su constructor.
  }
}
