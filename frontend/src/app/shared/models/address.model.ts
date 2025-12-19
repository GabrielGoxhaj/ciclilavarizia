export interface Address {
  addressId: number;
  addressType: string; // es. "Shipping", "Main Office"
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  countryRegion: string;
  postalCode: string;
}