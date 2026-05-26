import { Routes } from '@angular/router';
import { Login } from './autenticacion/login/login';
import { PanelAdmin } from './admin/panel-admin/panel-admin';
import { PanelAgricultor } from './agricultor/panel-agricultor/panel-agricultor';

export const routes: Routes = [
    {path: '',redirectTo: 'login',pathMatch: 'full'},
    {path: 'login', component: Login},
    {path: 'panel-admin', component: PanelAdmin},
    {path: 'panel-agricultor', component: PanelAgricultor}

];
