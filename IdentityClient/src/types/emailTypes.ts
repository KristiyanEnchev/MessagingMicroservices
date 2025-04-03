export interface TemplateData {
  field: string;
  value: string;
}

export interface FileAttachmentModel {
  name: string;
  contentBytes: string;
}

export interface SendBaseEmailCommand {
  from?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  displayName?: string;
  replyTo?: string;
  replyToName?: string;
  templateData?: TemplateData[];
  attachmentFiles?: FileAttachmentModel[];
  headers?: Record<string, string>;
  emailProvider: string;
  body: string;
}

export interface SendTemplateEmailCommand {
  from?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  displayName?: string;
  replyTo?: string;
  replyToName?: string;
  templateData?: TemplateData[];
  attachmentFiles?: FileAttachmentModel[];
  headers?: Record<string, string>;
  emailProvider: string;
  templateKey: string;
}