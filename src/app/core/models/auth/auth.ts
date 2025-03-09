export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  otp: string;
}

export interface SignupRequest {
  first_name: 'string';
  last_name: 'string';
  email: 'string';
  password: 'string';
}

export interface SignupResponse {
  code: number;
  status: string;
  message: string;
  otp: number;
  token: Token;
}

export interface Token {
  refresh: string;
  access: string;
}

export interface verifyEmailRequest {
  otp_code: string;
}

export interface UserMetaDataRequest {
  suggested_help: string[];
  primary_job_field: number;
  job_role: number;
  writing_intention: string[];
  ai_custom_name: string;
  ai_trait_description: string;
  ai_tone: string[];
}
