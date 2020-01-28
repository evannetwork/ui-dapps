export interface DigitalTwinResponse {
  total: number;
  result: Twin[];
}

export interface Twin {
  address: string;
  containers: any[];
  created: number;
  description: string;
  name: string;
  owner: string;
  updated: number;
}
