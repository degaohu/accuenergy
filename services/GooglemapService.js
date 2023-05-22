const axios = require('axios');

import { Loader } from '@googlemaps/js-api-loader';
const apiKey = process.env.VUE_APP_GOOGLE_API_KEY;


const loaderInstance  = new Loader({
  apiKey: process.env.VUE_APP_GOOGLE_API_KEY, // 替换为你的 Google Maps API 密钥
  version: 'weekly', // 指定要加载的 Google Maps API 版本
  libraries: ["places"]
});

export default {
  async getAutocompleteResults(input) {
    try {
      const google = await loaderInstance.load();
      const autocompleteService = new google.maps.places.AutocompleteService();
      const request = {
        input: input
      };

      return new Promise((resolve, reject) => {
        autocompleteService.getPlacePredictions(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else {
            reject(new Error(status));
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  },

  async getLatLng(address) {
    try {
      const google = await loaderInstance.load();
      const geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {

            
            const { lat, lng } = results[0].geometry.location;
          const location = [lat(), lng()];
            resolve(location);
          } else {
            reject(new Error(status));
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  },

  async getAddress(lat, lng) {
    try {
      const google = await loaderInstance.load();
      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(lat, lng);

      return new Promise((resolve, reject) => {
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const address = results[0].formatted_address;
          
            resolve(address);
          } else {
            reject(new Error(status));
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
};

    










