import { Routes } from '@angular/router';
import { Login } from './autenticacion/login/login';
import { PanelAdmin } from './admin/panel-admin/panel-admin';
import { Recomendaciones } from './admin/recomendaciones/recomendaciones';
import { PlataformaEditable } from './admin/plataforma-editable/plataforma-editable';
import { PanelAgricultor } from './agricultor/panel-agricultor/panel-agricultor';
import { Historial } from './agricultor/historial/historial';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'panel-admin', component: PanelAdmin },
  { path: 'panel-admin/recomendaciones', component: Recomendaciones },
  { path: 'panel-admin/editar-plataforma', component: PlataformaEditable },
  { path: 'panel-agricultor', component: PanelAgricultor },
  { path: 'historial', component: Historial },
];
