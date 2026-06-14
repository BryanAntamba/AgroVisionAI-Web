import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-antena-wifi',
  imports: [],
  templateUrl: './alerta-antena-wifi.html',
  styleUrls: ['./alerta-antena-wifi.css'],
})
export class AlertaAntenaWifi {
  // Recibe los datos de la alerta (título, descripción, fecha) desde el componente padre
  @Input({ required: true }) alerta!: AlertaSensorData;
  // Evento que se emite cuando el usuario hace clic en el botón de cerrar la alerta
  @Output() cerrar = new EventEmitter<void>();
}
