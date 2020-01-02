// TODO: This should be part of the evan-table component but definition files don't ship properly

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
