import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  IonButton, IonContent, IonHeader, IonInput, IonItem,
  IonLabel, IonList, IonTitle, IonToolbar,
} from '@ionic/angular';
import { catchError, of } from 'rxjs';
import { ContactsService } from '../services/contacts.services';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  imports: [
    FormsModule, IonButton, IonContent, IonHeader, IonInput,
    IonItem, IonLabel, IonList, IonTitle, IonToolbar,
  ],
})
export class ContactsPage {
  private service = inject(ContactsService);

  name = '';
  phone = '';
  email = '';
  pronouns = '';
  error = signal('');

  contacts = toSignal(
    this.service.listContacts().pipe(
      catchError((err: Error) => {
        this.error.set(err.message);
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  add() {
    if (!this.name.trim() || !this.phone.trim()) return;

    this.service.addContact({
      name: this.name,
      phone: this.phone,
      email: this.email,
      pronouns: this.pronouns,
    }).catch((err: Error) => this.error.set(err.message));

    this.name = '';
    this.phone = '';
    this.email = '';
    this.pronouns = '';
  }
}