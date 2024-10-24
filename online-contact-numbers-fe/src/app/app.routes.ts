import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './core/components/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'contacts',
        loadComponent: () => import('./features/contacts/contacts.component'),
        // loadChildren: () => import('./features/contacts/contacts.routes'),
        canActivate: [AuthGuard]
    },
    { path: '', redirectTo: '/contacts', pathMatch: 'full' },
    { path: '**', redirectTo: '/contacts' }
];

