import { Location } from 'expo-location'; // Import Location from expo-location

const goongApiUrl = 'https://rsapi.goong.io';
const goongApiKey = '8G9qYfQigMnLNilhONL8C8if0e4tyImFoK5t4KCf';

const searchPlace = async (searchText, latitudeUser, longitudeUser) => {
  if (!searchText.trim().length) return [];

  const input = encodeURIComponent(searchText.trim()); // Encode input for URL
  const latitude = latitudeUser;
  const longitude = longitudeUser;
  const location = `${latitude},${longitude}`;

  const goongUrl = `${goongApiUrl}/Place/AutoComplete?api_key=${goongApiKey}&location=${location}&input=${input}&radius=20`;

  try {
    const resp = await fetch(goongUrl);

    if (resp.ok) {
      const json = await resp.json();
      console.log(json); // Output the response to check if it's returning expected data
      if (json && json.predictions && json.predictions.length > 0) {
        const placeIds = json.predictions.map((prediction) => prediction.place_id);
        console.log(placeIds);
        return placeIds;
      } else {
        return [];
      }
    } else {
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const rederGeocoding = async (placeId) => {
  const goongUrl = `${goongApiUrl}/Place/Detail?place_id=${placeId}&api_key=${goongApiKey}`;
  try {
    const resp = await fetch(goongUrl);

    if (resp.ok) {
      const json = await resp.json();

      // Kiểm tra dữ liệu JSON trả về
      console.log(json);

      // Trích xuất thông tin vị trí từ JSON
      const location = json.result.geometry.location;
      const formatted_address = json.result.formatted_address;
      const { lat, lng } = location;
      console.log("Tọa độ: ", lat, lng)

      const result = {
        place_id: placeId,
        formatted_address: formatted_address,
        geometry: {
          location: {
            lat: lat,
            lng: lng,
          },
        },
        name: json.result.name,
        url: json.result.url,
      };

      return {
        result: result,
        status: 'OK',
      };
    } else {
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { status: 'ERROR' }; // Return status error in case of error
  }
};

export { searchPlace, rederGeocoding };
