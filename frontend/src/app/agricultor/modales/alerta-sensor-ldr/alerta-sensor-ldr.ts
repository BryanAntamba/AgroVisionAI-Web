import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-sensor-ldr',
  imports: [],
  templateUrl: './alerta-sensor-ldr.html',
  styleUrls: ['./alerta-sensor-ldr.css'],
})
export class AlertaSensorLdr {
  @Input({ required: true }) alerta!: AlertaSensorData;
  @Output() cerrar = new EventEmitter<void>();
}
