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
