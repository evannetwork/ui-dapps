export interface EvanTableItem<T> {
  item: T;
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
