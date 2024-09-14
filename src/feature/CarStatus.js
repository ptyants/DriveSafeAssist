import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'

const CarStatus = (props) => {
  const [searchText, setSearchText] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchedLocations, setSearchedLocations] = useState([]);
  console.log(userLocation)

  useEffect(() => {
    const getUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please enable location services in your device settings.');
        return;
      }

      let locationEnabled = await Location.hasServicesEnabledAsync();
      if (!locationEnabled) {
        setErrorMsg('Location services are disabled. Please enable location services in your device settings.');
        setUserLocation(null);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setUserLocation(currentLocation);
    };

    getUserLocation(); // Lấy vị trí ngay sau khi component được mount

    const interval = setInterval(() => {
      getUserLocation(); // Lấy vị trí mỗi 10 giây
    }, 10000);

    return () => clearInterval(interval); // Clear interval khi component unmount
  }, []);

  const handleSearch = async () => {
    if (!searchText) {
      Alert.alert('Error', 'Please enter a keyword to search.');
      return;
    }
    if (!searchText.trim().length) return;
    try {
      const latitudeUser = userLocation.coords.latitude;
      const longitudeUser = userLocation.coords.longitude;
      const placeIds = await searchPlace(searchText, latitudeUser, longitudeUser);
      if (placeIds.length > 0) {
        // const locations = await Promise.all(placeIds.map((placeId) => rederGeocoding(placeId)));
        const locations = await Promise.all(placeIds.map((placeId) => rederGeocoding(placeId)));
        // Lưu trữ danh sách các địa điểm vào state hoặc làm gì đó với danh sách này
        setSearchedLocations(locations);
        console.log('Locations:', locations);
        // Ví dụ: setUserLocations(locations);
        // Duyệt qua mảng locations để console log thông tin về vị trí
        locations.forEach((location, index) => {
          if (location && location.result) {
            console.log(`Location ${index + 1}:`);
            console.log('Formatted Address:', location.result.formatted_address);
            console.log('Name:', location.result.name);
            console.log('Latitude:', location.result.geometry.location.lat);
            console.log('Longitude:', location.result.geometry.location.lng);
            console.log('-----------------------------------');
          }
        });
      }
    } catch (error) {
      console.error('Error searching place:', error);
    }
  };

  return (
    handleSearch()
  )
}

export default CarStatus

const styles = StyleSheet.create({})