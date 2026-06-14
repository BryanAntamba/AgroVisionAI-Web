import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-sensor-ldr',
  imports: [],
  templateUrl: './alerta-sensor-ldr.html',
  styleUrls: ['./alerta-sensor-ldr.css'],
})
export class AlertaSensorLDR {
  // Recibe los datos de la alerta (título, descripción, fecha) desde el componente padre
  @Input({ required: true }) alerta!: AlertaSensorData;
  // Evento que se emite cuando el usuario hace clic en el botón de cerrar la alerta
  @Output() cerrar = new EventEmitter<void>();
}
