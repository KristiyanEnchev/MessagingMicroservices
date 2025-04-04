export interface TemplateData {
  field: string;
  value: string;
}

export interface SendBaseSMSCommand {
  to: string;
  from?: string;
  smsProvider: string;
  message: string;
  templateData?: TemplateData[];
}

export interface SendTemplateSMSCommand {
  to: string;
  from?: string;
  smsProvider: string;
  templateName: string;
  templateData?: TemplateData[];
}