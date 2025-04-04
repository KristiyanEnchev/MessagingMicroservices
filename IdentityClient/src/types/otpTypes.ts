export interface OneTimePinGenerateCommand {
  identifier: string;
  expirationMinutes: number;
}

export interface OneTimePinValidateCommand {
  identifier: string;
  transactionId: string;
  otp: string;
}

export interface OtpResult {
  success: boolean;
  data: string | null;
  transactionId: string;
  errors: string[] | null;
}