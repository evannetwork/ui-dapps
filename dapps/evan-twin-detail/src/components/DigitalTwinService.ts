import { EvanUIDigitalTwin } from '@evan.network/digitaltwin.lib';
import * as bcc from '@evan.network/api-blockchain-core';

export class DigitalTwinService {
  twinId: string;
  runtime: bcc.Runtime;

  constructor(runtime: bcc.Runtime, address: string) {
      this.runtime = runtime;
      this.twinId = address;
  }

  getDigitalTwin(id: string): bcc.DigitalTwin {
    return EvanUIDigitalTwin.getDigitalTwin(this.runtime, id);
  }
}
