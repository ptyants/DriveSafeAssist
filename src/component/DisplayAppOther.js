import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const _WIDTH = Dimensions.get('window').width;
const _HEIGHT = Dimensions.get('window').height;

const hscreen =  _HEIGHT * 0.6
const wscreen = 1500

const DisplayAppOther = () => {
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DisplayAppOther</Text>
      <View style={{ width: wscreen, height: hscreen, backgroundColor: '#8e44ad' }}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },

});

export default DisplayAppOther;
