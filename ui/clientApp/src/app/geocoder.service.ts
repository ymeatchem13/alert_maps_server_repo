import {Injectable} from '@angular/core';
import {Point} from 'geojson';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

export interface IGeocoderContext {
  id: string;
  wikidata: string;
  text: string;
}

export interface IGeocoderFeature {
  id: string;
  type: 'Feature';
  place_type: Array<string>;
  relevance: number;
  properties: Object;
  address: string;
  text: string;
  place_name: string;
  bbox: [number, number, number, number];
  center: [number, number];
  geometry: Point;
  context: Array<IGeocoderContext>;
}

export interface IGeocoderResult {
  type: 'FeatureCollection';
  query: Array<string | number>;
  features: Array<IGeocoderFeature>;
  attribution: string;
}

export interface IAddress {
  address?: string;
  postcode?: string;
  place?: string;
  locality?: string;
  country?: string;
  region?: string;
  disctrict?: string;
  neighborhood?: string;
  poi?: string;
}

/**
 * Various types of geographic features availabled in the Mapbox geocoder.
 *
 * @see https://docs.mapbox.com/api/search/#data-types
 */
export enum PlaceType {
  COUNTRY = 'country',
  REGION = 'region',
  POSTCODE = 'postcode',
  DISTRICT = 'district',
  PLACE = 'place',
  LOCALITY = 'locality',
  NEIGHBORHOOD = 'neighborhood',
  ADDRESS = 'address',
  POI = 'poi',
}

/**
 * The geocoding API includes two different endpoints: mapbox.places and mapbox.places-permanent.
 *
 * @see https://docs.mapbox.com/api/search/#mapboxplaces
 */
export enum Endpoint {
  PLACES = 'mapbox.places',
  PLACES_PERMANENT = 'mapbox.places-permanent',
}

@Injectable()
/**
 * Wrapper for Mapbox Geocoding API.
 *
 * @see https://docs.mapbox.com/api/search/#geocoding
 */
export class GeocoderService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * The forward geocoding query type allows you to look up a single location by name and
   * returns its geographic coordinates.
   *
   * @param endpoint
   * @param address
   * @param mapboxToken
   * @param countries
   * @param types
   * @return {Observable<IGeocoderResult>}
   *
   * @example
   *   this.geocoder.forwardGeocoding(Endpoint.PLACES, feature.properties.addresse, mapboxToken, ['fr'], [PlaceType.ADDRESS])
   *    .subscribe((res) => console.log('coordinates', res.features[0].center));
   *
   * @see https://docs.mapbox.com/api/search/#forward-geocoding
   */
  public forwardGeocoding(
    endpoint: Endpoint,
    address: string,
    mapboxToken: string,
    countries: Array<string>,
    types: Array<PlaceType>
  ): Observable<IGeocoderResult> {
    // build uri
    const uri = `https://api.mapbox.com/geocoding/v5/${endpoint}/${address}.json`;
    // build params
    let params = new HttpParams();
    params = params.append('access_token', mapboxToken);
    params = params.append('autocomplete', 'true');
    params = params.append('country', countries.toString());
    params = params.append('types', this._getValuesFromEnum(types).toString());

    return this.http.get<IGeocoderResult>(uri, {params: params})
      .pipe(
        catchError((err: Response) => {
          return throwError(err);
        })
      );
  }

  /**
   * The reverse geocoding query type allows you to look up a single pair of coordinates and
   * returns the geographic feature or features that exist at that location.
   *
   * @param endpoint
   * @param location
   * @param mapboxToken
   * @param countries
   * @param types
   * @return {Observable<IGeocoderResult>}
   *
   * @example
   *  this.geocoder.reverseGeocoding(Endpoint.PLACES, feature, mapboxToken, ['fr'], [PlaceType.ADDRESS])
   *   .subscribe((res) => console.log('adresse', res.features[0].place_name));
   *
   * @see https://docs.mapbox.com/api/search/#reverse-geocoding
   */
  // public reverseGeocoding(
  //   endpoint: Endpoint,
  //   location: Feature | Point | LngLatLike,
  //   mapboxToken: string,
  //   countries: Array<string>,
  //   types: Array<PlaceType>
  // ): Observable<IGeocoderResult> {
  //   // set coordinates according to the type of {location}
  //   let coordinates;
  //   if (location['type']) {
  //     if (location['type'] === 'Feature') {
  //       coordinates = (location as Feature).geometry['coordinates'].toString();
  //     } else if (location['type'] === 'Point') {
  //       coordinates = (location as Point).coordinates.toString();
  //     }
  //   } else if (location instanceof LngLat) {
  //     coordinates = location.toString();
  //   } else {
  //     coordinates = location;
  //   }
  //   // build uri
  //   const uri = `https://api.mapbox.com/geocoding/v5/${endpoint}/${coordinates}.json`;
  //   // build params
  //   let params = new HttpParams();
  //   params = params.append('access_token', mapboxToken);
  //   params = params.append('autocomplete', 'true');
  //   params = params.append('country', countries.toString());
  //   params = params.append('types', this._getValuesFromEnum<PlaceType>(types).toString());

  //   return this.http.get<IGeocoderResult>(uri, {params: params})
  //     .pipe(
  //       catchError((err: Response) => {
  //         return throwError(err);
  //       })
  //     );
  // }

  /**
   * Get a usable adress object from a geocoding result
   *
   * @param features
   * @returns {IAddress}
   */
  // public getAddressFromFeatures(features: Array<IGeocoderFeature>): IAddress {
  //   const addressFeature = this._findFeatureByPlaceType(features, PlaceType.ADDRESS);
  //   const postCodeFeature = this._findFeatureByPlaceType(features, PlaceType.POSTCODE);
  //   const placeFeature = this._findFeatureByPlaceType(features, PlaceType.PLACE);
  //   const localityFeature = this._findFeatureByPlaceType(features, PlaceType.LOCALITY);
  //   const districtFeature = this._findFeatureByPlaceType(features, PlaceType.DISTRICT);
  //   const neighborhoodFeature = this._findFeatureByPlaceType(features, PlaceType.NEIGHBORHOOD);
  //   const regionFeature = this._findFeatureByPlaceType(features, PlaceType.REGION);
  //   const countryFeature = this._findFeatureByPlaceType(features, PlaceType.COUNTRY);
  //   const poiFeature = this._findFeatureByPlaceType(features, PlaceType.POI);
  //   const address: string = (addressFeature && addressFeature.address) ? addressFeature.address : '';
  //   return {
  //     address: (addressFeature) ? `${address} ${addressFeature.text}` : null,
  //     postcode: (postCodeFeature) ? postCodeFeature.text : null,
  //     place: (placeFeature) ? placeFeature.text : null,
  //     country: (countryFeature) ? countryFeature.text : null,
  //     locality: (localityFeature) ? localityFeature.text : null,
  //     disctrict: (districtFeature) ? districtFeature.text : null,
  //     neighborhood: (neighborhoodFeature) ? neighborhoodFeature.text : null,
  //     region: (regionFeature) ? regionFeature.text : null,
  //     poi: (poiFeature) ? poiFeature.text : null,
  //   };
  // }

  /**
   * Find the place type information from a geocoding resultset of features according to the given place type.
   *
   * @param features
   * @param type
   * @returns {IGeocoderFeature}
   */
  // private _findFeatureByPlaceType(features: Array<IGeocoderFeature>, type: string): IGeocoderFeature {
  //   return _.find(features, (feature: IGeocoderFeature) => feature.place_type.indexOf(type) > -1);
  // }

  /**
   * Takes an array of a specific enum type
   * and returns an array of each value.
   *
   * @param anEnum
   * @returns {T[string][]}
   * @private
   */
  private _getValuesFromEnum<T>(anEnum: Array<T>): Array<string> {
    return Object.keys(anEnum).map(key => anEnum[key]);
  }
}