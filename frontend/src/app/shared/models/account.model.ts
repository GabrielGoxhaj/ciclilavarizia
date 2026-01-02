export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string; 
  phone?: string;
  companyName?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserProfile {
  customerId: number;
  fullName?: string;
  firstName: string; 
  lastName: string; 
  email: string;
  username: string; 
  phone?: string;
  companyName?: string;
  // ... address etc se servono
}