import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { searchPlace, rederGeocoding } from '../feature/SearchLocation';
import * as Location from 'expo-location'; // Import Location from expo-location
import { useDispatch } from 'react-redux';
import { checkLocation } from '../store/action'


const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.2;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

const SearchPlace = () => {
  const [searchText, setSearchText] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchedLocations, setSearchedLocations] = useState([]);
  // console.log(userLocation)

  const dispatch = useDispatch()



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

  useEffect(() => {
    if (userLocation) {
      dispatch(checkLocation(userLocation));
    }
  }, [userLocation]);

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
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation ? userLocation.coords.latitude : 11.3373301,
          longitude: userLocation ? userLocation.coords.longitude : 107.6577981,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {searchedLocations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: location.result.geometry.location.lat,
              longitude: location.result.geometry.location.lng,
            }}
            title={location.result.name}
            description={location.result.formatted_address}
          />
        ))}

        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Your Location"
          />
        )}
      </MapView>

      <View style={styles.searchBox}>
        <Text style={styles.searchBoxLabel}>Search Place</Text>
        <TextInput
          style={styles.searchBoxField}
          onChangeText={setSearchText}
          autoCapitalize="sentences"
          placeholder="Enter place name"
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSearch}>
          <Text style={styles.buttonLabel}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchPlace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchBox: {
    position: 'absolute',
    width: '90%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: 'white',
    padding: 8,
    alignSelf: 'center',
    marginTop: 60,
  },
  searchBoxField: {
    borderColor: '#777',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 30,
    marginBottom: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#26f',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 30,
    color: 'white',
  },
  searchBoxLabel: {
    fontSize: 35,
  },
});
