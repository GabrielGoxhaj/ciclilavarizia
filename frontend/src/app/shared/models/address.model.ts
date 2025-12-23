export interface Address {
  addressId: number;
  addressType: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateProvince: string;
  countryRegion: string;
  postalCode: string;
}

export interface CreateAddressRequest {
  addressType: string;
  addressLine1: string;
  city: string;
  stateProvince: string;
  countryRegion: string;
  postalCode: string;
}