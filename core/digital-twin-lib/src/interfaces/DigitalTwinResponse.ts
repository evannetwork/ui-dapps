/**
 * Response from edge server /api/smart-agents/search/twins
 * https://github.com/evannetwork/edge-server-search/tree/feature/CORE-849-twin-transactions#apismart-agentssearchtwins
 */
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
