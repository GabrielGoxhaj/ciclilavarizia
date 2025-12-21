export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface CustomerRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string; 
  username: string;
  addresses?: AddressDto[]; 
}

export interface AddressDto {
  addressType: string;
  addressLine1: string;
  city: string;
  stateProvince?: string;
  countryRegion: string;
  postalCode: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  email: string;
}

// GET api/auth/me (UserMeDto)
export interface UserMe {
  id: number;
  username: string;
  email: string;
  role: string;
}