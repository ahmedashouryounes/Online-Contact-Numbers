import { Routes } from '@angular/router';
import ContactsListComponent from './components/contacts-list/contacts-list.component';
import ContactsFormComponent from './components/contacts-form/contacts-form.component';

export default [
    { path: '', component: ContactsListComponent },
    { path: 'form', component: ContactsFormComponent },
    { path: 'form/:id', component: ContactsFormComponent },
    { path: '', redirectTo: '', pathMatch: 'full' },
] as Routes;