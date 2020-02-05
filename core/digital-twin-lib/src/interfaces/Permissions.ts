export interface Permissions {
  [property: string]: {
    read: boolean;
    readWrite: boolean;
    fields?: string[];
  };
}

export interface PermissionsContainer {
  [contractAddress: string]: {
    permissions: Permissions;
    label?: string;
  };
}
