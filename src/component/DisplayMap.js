import React, { useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Slider from '@react-native-community/slider';

const _WIDTH = Dimensions.get('window').width;
const _HEIGHT = Dimensions.get('window').height;

const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,
};

const DisplayMap = () => {
  const [region, setRegion] = useState(initialRegion);
  const [searchText, setSearchText] = useState('');
  const mapRef = useRef(null);

  const handleDeltaChange = (value) => {
    setRegion({ ...region, latitudeDelta: value, longitudeDelta: value });
  };

  // const handleSearch = async () => {
  //   if (!searchText) {
  //     Alert.alert('Error', 'Please enter an address to search.');
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchText)}&key=YOUR_GOOGLE_MAPS_API_KEY`
  //     );
  //     const data = await response.json();
  //     if (data.results.length > 0) {
  //       const { lat, lng } = data.results[0].geometry.location;
  //       mapRef.current.animateToRegion({
  //         latitude: lat,
  //         longitude: lng,
  //         latitudeDelta: 0.01,
  //         longitudeDelta: 0.01,
  //       });
  //     } else {
  //       Alert.alert('Error', 'Address not found.');
  //     }
  //   } catch (error) {
  //     console.error('Error searching address:', error);
  //     Alert.alert('Error', 'Failed to search for address. Please try again.');
  //   }
  // };

  const handleSearch = async () => {
    if (!searchText) {
      Alert.alert('Error', 'Please enter a keyword to search.');
      return;
    }
  
    try {
      const apiKey = "AIzaSyD20Sh5x82xK_GuWVo6_aVxnLmhL9VPub4"; // Thay YOUR_API_KEY bằng API key của bạn
      const location = `${region.latitude},${region.longitude}`; // Sử dụng vị trí hiện tại từ state region
      const radius = 15000000000; // Tìm kiếm trong phạm vi 1500 mét
      const keyword = encodeURIComponent(searchText); // Từ khóa tìm kiếm từ người dùng
      const type = 'cafe'; // Chỉ tìm kiếm loại 'restaurant'
  
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query="hotel"&key="AIzaSyA2e9ZEjQrCVRRdUtXUm3-kYtWraRc8G-M"`;
  
      const response = await fetch(url);
      console.log(response)
      const data = await response.json();
      console.log(data)
      
  
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert('Error', 'No places found.');
      }
    } catch (error) {
      console.error('Error searching places:', error);
      Alert.alert('Error', 'Failed to search for places. Please try again.');
    }
  };
  
  
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={{ fontSize: 50, textAlign: 'center' }}>Map Car Tab</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter address..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <View style={styles.sliderContainer}>
        <Text style={{ fontSize: 30,}}>Delta Value: {region.latitudeDelta.toFixed(3)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.001}
          maximumValue={0.5}
          value={region.latitudeDelta}
          onValueChange={handleDeltaChange}
        />
      </View>
      <View style={styles.mapView}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          
        >
          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            title="My Location"
            description="This is my current location"
          />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    height: _HEIGHT * 0.1,
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 30,
  },
  sliderContainer: {
    padding: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  mapView: {
    flex: 1,
    width: '100%',
    height: _HEIGHT * 0.9,
    paddingHorizontal: 10,
  },
  map: {
    flex: 1,
  },
});

export default DisplayMap;
