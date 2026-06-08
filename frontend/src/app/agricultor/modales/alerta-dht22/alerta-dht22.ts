import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertaSensorData } from '../../../../environments/datos-alertas-simuladas';

@Component({
  selector: 'app-alerta-dht22',
  imports: [],
  templateUrl: './alerta-dht22.html',
  styleUrls: ['./alerta-dht22.css'],
})
export class AlertaDht22 {
  @Input({ required: true }) alerta!: AlertaSensorData;
  @Output() cerrar = new EventEmitter<void>();
}
