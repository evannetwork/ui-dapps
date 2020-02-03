export interface ObjectSchema {
  $id: string;
  properties: Properties;
  type: string;
}

export interface ListSchema {
  $id: string;
  items: {
    properties: Properties;
    type: string;
  };
  type: string;
}

interface Properties {
  [propertyName: string]: {
    type: string;
  };
}
