import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-sensor-ldr',
  imports: [],
  templateUrl: './alerta-sensor-ldr.html',
  styleUrls: ['../../../shared/styles/alerta-sensor.css'],
})
export class AlertaSensorLdr {
  @Input({ required: true }) alerta!: AlertaSensorData;
  @Output() cerrar = new EventEmitter<void>();
}
