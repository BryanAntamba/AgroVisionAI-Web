import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-antena-wifi',
  imports: [],
  templateUrl: './alerta-antena-wifi.html',
  styleUrls: ['./alerta-antena-wifi.css'],
})
export class AlertaAntenaWifi {
  @Input({ required: true }) alerta!: AlertaSensorData;
  @Output() cerrar = new EventEmitter<void>();
}
