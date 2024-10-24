import { Routes } from '@angular/router';
import ContactsGridComponent from './components/contacts-grid/contacts-grid.component';
import ContactsFormComponent from './components/contacts-form/contacts-form.component';
import ContactComponent from './components/contact/contact.component';

export default [
    { path: '', component: ContactsGridComponent },
    { path: 'form', component: ContactsFormComponent },
    { path: 'form/:id', component: ContactsFormComponent },
    { path: '', redirectTo: '', pathMatch: 'full' },
] as Routes;