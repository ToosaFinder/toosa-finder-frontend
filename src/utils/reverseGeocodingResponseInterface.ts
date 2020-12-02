export interface AddressComponent{
  long_name: string;
  short_name: string;
  types: string[];
}

interface ResultGeneral{
  address_components: AddressComponent[];
  formatted_address: string;
}

export interface ReverseGeocodingSuccess {
  results: ResultGeneral[];
  status: string;
}