import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-cam',
  imports: [],
  templateUrl: './alerta-cam.html',
  styleUrls: ['./alerta-cam.css'],
})
export class AlertaCam {
  @Input({ required: true }) alerta!: AlertaSensorData;
  @Output() cerrar = new EventEmitter<void>();
}
