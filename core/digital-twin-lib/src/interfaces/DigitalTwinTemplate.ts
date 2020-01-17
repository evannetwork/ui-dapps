import { DBCPDescriptionInterface } from '../DAppContract';
import { ContainerPlugin } from '@evan.network/api-blockchain-core';

export interface DigitalTwinTemplateInterface {
  description: DBCPDescriptionInterface;
  plugins: { [pluginName: string]: ContainerPlugin };
}

export interface ValidationErrorInterface {
  dataPath: string;
  keyword: string;
  message: string;
  params: any;
  schemaPath: string;
}

export interface TemplateErrorInterface {
  name: string;
  errors: ValidationErrorInterface[];
}
