export interface EvanTableItem<T> {
  item: T;
  index: number;
  field: Field;
  unformatted: string;
  value: string;
  detailsShowing: boolean;
  rowSelected: boolean;
}

export interface EvanTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  tdClass?: string;
  thClass?: string;
}

export interface Field {
  key: string;
  label: string;
  sortable: boolean;
}
