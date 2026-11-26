import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Contact, NewContact } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private contactsRef = collection(db, 'contacts');

  listContacts(): Observable<Contact[]> {
    const q = query(this.contactsRef, orderBy('createdAt', 'desc'));

    return new Observable<Contact[]>((subscriber) => {
      return onSnapshot(
        q,
        (snapshot) => {
          const contacts = snapshot.docs.map((doc) => {
            const data = doc.data({ serverTimestamps: 'estimate' });
            const createdAt = data['createdAt'];

            return {
              id: doc.id,
              name: data['name'] ?? '',
              phone: data['phone'] ?? '',
              email: data['email'] ?? '',
              pronouns: data['pronouns'] ?? '',
              createdAt: createdAt instanceof Timestamp ? createdAt.toDate() : null,
            };
          });

          subscriber.next(contacts);
        },
        (error) => subscriber.error(error),
      );
    });
  }

  addContact(contact: NewContact) {
    return addDoc(this.contactsRef, {
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      email: contact.email.trim(),
      pronouns: contact.pronouns.trim(),
      createdAt: serverTimestamp(),
    });
  }
}