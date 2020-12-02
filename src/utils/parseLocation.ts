import {
  AddressComponent,
  ReverseGeocodingSuccess,
} from "./reverseGeocodingResponseInterface";

export default function parseLocation(
  location: ReverseGeocodingSuccess
): string {
  let establishment: string;
  let streetNumber: string;
  let street: string;
  let city: string;
  let region: string;
  let country: string;
  let address: string[] = [];

  location.results[0].address_components.map((val) => {
    if (val.types.includes("establishment")) {
      establishment = val.long_name;
      address.push(establishment);
    }
    if (val.types.includes("street_number")) {
      streetNumber = val.long_name;
      address.push(streetNumber);
    }
    if (val.types.includes("route")) {
      street = val.short_name;
      address.push(street);
    }
    if (val.types.includes("locality")) {
      city = val.short_name;
      address.push(city);
    }
    if (val.types.includes("administrative_area_level_1")) {
      region = val.short_name;
      address.push(region);
    }
    if (val.types.includes("country")) {
      country = val.long_name;
      address.push(country);
    }
  });

  let district: AddressComponent;
  location.results.find((value) => {
    district = value.address_components.find((adrComp) => {
      if (adrComp.types.includes("sublocality_level_2")) return true;
    });
    if (district !== undefined) return true;
  });

  let districtName: string;

  if (district !== undefined) districtName = district.long_name;

  if (districtName !== undefined) {
    let index;
    if (city !== undefined) {
      index = address.indexOf(city);
    } else if (region !== undefined) {
      index = address.indexOf(region);
    } else if (country !== undefined) {
      index = address.indexOf(country);
    } else {
      index = address.length + 1;
    }
    address.splice(index, 0, districtName);
  }

  return address.join(", ");
}
