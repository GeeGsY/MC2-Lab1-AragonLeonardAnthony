export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  pronouns: string;
  createdAt: Date | null;
}

export type NewContact = Omit<Contact, 'id' | 'createdAt'>;