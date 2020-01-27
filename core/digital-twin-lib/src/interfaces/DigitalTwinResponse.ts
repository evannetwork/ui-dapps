export interface DigitalTwinResponse {
  total: number;
  results: Result[];
}

export interface Result {
  address: string;
  containers: any[];
  created: number;
  description: string;
  name: string;
  owner: string;
  updated: number;
}
