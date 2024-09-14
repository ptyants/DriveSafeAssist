import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import reducer from './src/store/reducer';

import DisplayParam from './src/component/DisplayParam';
import DisplayMap from './src/component/DisplayMap';
import DisplayAppOther from './src/component/DisplayAppOther';
import SearchPace from './src/component/SearchPace';
import UpdateCarStatus from './src/store/UpdateCarStatus';


const store = createStore(reducer);

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <Provider store={store}>
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {/* DisplayParam và DisplayAppOther được bao bọc bên trong một View cha */}
          <View style={styles.columnContainer}>
            <DisplayParam />
          </View>
          {/* <DisplayMap /> */}
          <SearchPace />
        </View>
        {/* <StatusBar style="auto" /> */}





      </View>
      <UpdateCarStatus/>
    </Provider>

    // <View style={styles.container}>
    //   <SearchPace/>
    // </View>


  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    maxWidth: '50%',
  },
});

