export interface Permissions {
  [property: string]: {
    read: boolean;
    readWrite: boolean;
    fields?: string[];
  };
}
