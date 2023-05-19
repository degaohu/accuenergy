const axios = require('axios');




export default {

    async getAutocompleteResults (input) {
        const response = await axios.get('GoogleServer/maps/api/place/autocomplete/json', {
          params: {
            input: input,
            key: 'AIzaSyBKLrJ2T-kU96j3yC2VqArY0B1Ap9dU7UE' // 替换为你的Google API密钥
          }
        });
      
        if (response.data.status === 'OK') {
          console.log(response.data)
          return response.data.predictions;
        } else {
          throw new Error(response.data.status);
        }
      },

      async getLatLng(address) {
        
          const response = await axios.get('GoogleServer/maps/api/geocode/json', {
            params: {
              address: address,
              key: 'AIzaSyBKLrJ2T-kU96j3yC2VqArY0B1Ap9dU7UE', // 替换为你的API密钥
            },
          });
  
          if (response.data.results[0]) {
            const location = response.data.results[0].geometry.location;
            return location ;// 打印经纬度
          } else {
            console.log('No results found for this address.');
          }
      },


      async getAddress(lat, lng) {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: `${lat},${lng}`,
                key: 'AIzaSyBKLrJ2T-kU96j3yC2VqArY0B1Ap9dU7UE', // 替换为你的API密钥
            },
        });
    
        if (response.data.results[0]) {
            const address = response.data.results[0].formatted_address;
            return address; // 打印地址
        } else {
            console.log('No results found for this location.');
        }
    }
    


}







