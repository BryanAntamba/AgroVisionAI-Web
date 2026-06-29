import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-dht22',
  imports: [],
  templateUrl: './alerta-dht22.html',
  styleUrls: ['./alerta-dht22.css'],
})
export class AlertaDht22 {
  // Recibe los datos de la alerta (título, descripción, fecha) desde el componente padre
  @Input({ required: true }) alerta!: AlertaSensorData;
  // Evento que se emite cuando el usuario hace clic en el botón de cerrar la alerta
  @Output() cerrar = new EventEmitter<void>();
}
