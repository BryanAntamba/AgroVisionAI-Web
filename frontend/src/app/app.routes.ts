import { Routes } from '@angular/router';
import { Login } from './autenticacion/login/login';
import { PanelAdmin } from './admin/panel-admin/panel-admin';
import { Recomendaciones } from './admin/recomendaciones/recomendaciones';
import { PanelAgricultor } from './agricultor/panel-agricultor/panel-agricultor';
import { Historial } from './agricultor/historial/historial';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'panel-admin', component: PanelAdmin, canActivate: [AuthGuard] },
  { path: 'panel-admin/recomendaciones', component: Recomendaciones, canActivate: [AuthGuard] },
  { path: 'panel-agricultor', component: PanelAgricultor, canActivate: [AuthGuard] },
  { path: 'historial', component: Historial, canActivate: [AuthGuard] },
];
