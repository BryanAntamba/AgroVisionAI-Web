import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-capacite-v2',
  imports: [],
  templateUrl: './alerta-capacite-v2.html',
  styleUrls: ['./alerta-capacite-v2.css'],
})
export class AlertaCapaciteV2 {
  @Input({ required: true }) alerta!: AlertaSensorData;
  @Output() cerrar = new EventEmitter<void>();
}
