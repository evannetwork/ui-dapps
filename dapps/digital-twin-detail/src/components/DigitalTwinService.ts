import { EvanUIDigitalTwin } from '@evan.network/digitaltwin.lib';
import { DigitalTwin, Runtime } from '@evan.network/api-blockchain-core';

export class DigitalTwinService {
  twinId: string;
  runtime: Runtime;

  constructor(runtime: Runtime, address: string) {
      this.runtime = runtime;
      this.twinId = address;
  }

  getDigitalTwin(id: string): DigitalTwin {
    return EvanUIDigitalTwin.getDigitalTwin(this.runtime, id);
  }

  async getOwner(twin: DigitalTwin) {
    await twin.ensureContract();
    return this.runtime.executor.executeContractCall(twin.contract, 'owner');
  }
}
