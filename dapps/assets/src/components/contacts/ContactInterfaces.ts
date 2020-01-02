export interface Contact {
  address: string;
  alias: string;
  createdAt: string;
  isFavorite: string;
  icon: string;
  type: ContactType;
  updatedAt: string;
}

export enum ContactType {
  COMPANY = 'company',
  IOT_DEVICE = 'device',
  USER = 'user',
  UNSHARED = 'unshared'
}

export interface ContactFormData {
  accountId: string;
  alias: string;
  createdAt: string;
  currLang: string;
  email: string;
  emailInvite: boolean;
  isFavorite: boolean;
  fromAlias: string;
  msgBody: string;
  msgTitle: string;
  updatedAt: string;
}

export interface ContactTableItem {
  item: Contact;
  index: number;
  field: Field;
  unformatted: string;
  value: string;
  detailsShowing: boolean;
  rowSelected: boolean;
}

export interface Field {
  key: string;
  label: string;
  sortable: boolean;
}
