import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-capacite-v2',
  imports: [],
  templateUrl: './alerta-capacite-v2.html',
  styleUrls: ['./alerta-capacite-v2.css'],
})
export class AlertaCapaciteV2 {
  // Recibe los datos de la alerta (título, descripción, fecha) desde el componente padre
  @Input({ required: true }) alerta!: AlertaSensorData;
  // Evento que se emite cuando el usuario hace clic en el botón de cerrar la alerta
  @Output() cerrar = new EventEmitter<void>();
}
