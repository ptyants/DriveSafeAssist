import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Modal, Pressable, Alert } from 'react-native';
import { Circle } from 'react-native-progress';
import { useSelector } from 'react-redux';
import { searchPlace, rederGeocoding } from '../feature/SearchLocation';

const sizeText = 30;

const DisplayParam = () => {
  const userLocation = useSelector(state => state.userLocation);
  const carStatus = useSelector(state => state.carStatus);

  const [distance, setDistance] = useState(0);
  const maxDistance = 999999;
  // Phần trăm quãng đường đã đi
  const percent = ((distance / maxDistance) * 100).toFixed(2);

  const [vehicleMaintain, setVehicleMaintain] = useState({ status: 'Tốt', color: 'green' });
  const [fuel, setFuel] = useState({ status: 'Không', color: 'green' });
  const [damage, setDamage] = useState({ status: 'Không', color: 'green' });

  const [modalVisible, setModalVisible] = useState(false);
  const [callSOS, setCallSOS] = useState(false);
  const [findSOS, setFindSOS] = useState(null)



  useEffect(() => {
    // Update local state based on Redux state (carStatus)
    console.log('Car Status:', carStatus);
    setDistance(carStatus.distance);
  }, [carStatus]);

  useEffect(() => {
    // Check and update vehicle maintenance status based on percent
    let vehicleStatus = { status: 'Tốt', color: 'green' };
    if (percent > 80 && percent < 90) {
      vehicleStatus = { status: 'Cần kiểm tra', color: 'yellow' };
    } else if (percent > 90) {
      vehicleStatus = { status: 'Cần bảo trì', color: 'red' };
    }
    setVehicleMaintain(vehicleStatus);
  }, [percent]);



  // Khởi tạo giá trị ban đầu cho distance
  // useEffect(() => {
  //   setDistance(999980);
  //   setFuel({ status: 'Sắp hết xăng', color: 'red' })
  //   setDamage({ status: 'Cần thay lốp', color: 'red' })
  // }, []);

  const handleSOSCallButtonPress = () => {
    setModalVisible(!modalVisible)
    setCallSOS(true)
    const handleSearch = async () => {
      try {
        const searchText = "Cứu hộ xe ô tô";
        const latitudeUser = userLocation.coords.latitude;
        const longitudeUser = userLocation.coords.longitude;
        const placeIds = await searchPlace(searchText, latitudeUser, longitudeUser);

        if (placeIds.length > 0) {
          // Lấy thông tin của địa điểm đầu tiên
          const firstPlaceId = placeIds[0];
          const location = await rederGeocoding(firstPlaceId);

          // thêm SĐT mô phỏng
          location.result["phoneNumber"] = "0369966231"

          // Ví dụ: setUserLocations(locations);
          // Duyệt qua mảng locations để console log thông tin về vị trí
          if (location && location.result) {
            console.log('Location:');
            console.log('Formatted Address:', location.result.formatted_address);
            console.log('Name:', location.result.name);
            console.log('Latitude:', location.result.geometry.location.lat);
            console.log('Longitude:', location.result.geometry.location.lng);
            console.log('SĐT: ', location.result.phoneNumber)
            console.log('-----------------------------------');

            // Lưu trữ vị trí đầu tiên vào state hoặc làm gì đó với nó
            setFindSOS([location]);
          };
        }
      } catch (error) {
        console.error('Error searching place:', error);
      }
    };
    handleSearch()
  }


  

  return (
    <View style={styles.container}>
      {/* Thông tin xe và chủ xe, trạng thái của xe */}
      <View style={styles.infoSection}>
        {/* Thông tin chủ xe */}
        <View style={styles.row}>
          <Image style={{ width: 300, height: 400, marginRight: 20, }} source={require('../../assets/example.jpg')} />
          <View>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Thông tin xe:</Text>
              <Text style={styles.info}>Tên xe: Tesla Model S</Text>
              <Text style={styles.info}>Năm sản xuất: 2022</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Chủ xe:</Text>
              <Text style={styles.info}>Tên: Nguyễn Văn A</Text>
              <Text style={styles.info}>Địa chỉ: Hà Nội, Việt Nam</Text>
            </View>
          </View>

        </View>

        {/* Thông báo trạng thái của xe */}
        <View style={styles.status}>
          <Text style={styles.statusTitle}>Trạng thái xe:</Text>
          <Text style={styles.statusItem}>
            Tình trạng hư hại:
            <Text style={{ color: carStatus.damage.color, fontWeight: 'bold' }}> {carStatus.damage.status}</Text>
          </Text>
          <Text style={styles.statusItem}>
            Cần nhiên liệu:
            <Text style={{ color: carStatus.fuel.color, fontWeight: 'bold' }}> {carStatus.fuel.status}</Text>
          </Text>
          <Text style={styles.statusItem}>
            Tình trạng bảo trì xe:
            <Text style={{ color: vehicleMaintain.color, fontWeight: 'bold' }}> {vehicleMaintain.status}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.dataContainer}>
        {/* Biểu đồ tròn */}
        <View style={styles.circleContainer}>
          <Circle
            size={300} // Tăng kích thước của Circular Progress Bar
            progress={percent / 100}
            showsText
            formatText={() => `${percent}%`}
            textStyle={styles.progressText}
            thickness={20} // Tăng độ dày của vòng tròn
            borderWidth={0}
            unfilledColor="#ddd"
            color="#007bff"
            strokeCap="round"
          />
          {/* Quãng đường đã đi */}
          <View style={styles.section}>
            <Text style={styles.label}>Quãng đường đã đi:</Text>
            <Text style={styles.value}>{distance} / {maxDistance} km</Text>
          </View>
        </View>
        {/* Nút khẩn cấp */}
        {/* <TouchableOpacity style={{ width: 300, height: 300, backgroundColor: 'red', borderRadius: 180, justifyContent: 'center', alignContent: 'center', marginLeft: 250, }} onPress={() => handleSOSButtonPress()}>
          <Text style={{ fontSize: 100, textAlign: 'center' }}>SOS</Text>
        </TouchableOpacity> */}

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={handleSOSCallButtonPress}>

                  <Text style={[styles.textStyle, styles.buttonOpen]}>Gọi cứu hộ ngay</Text>

                </Pressable>

                <TouchableOpacity>
                  <Text style={[styles.modalText, styles.button, { backgroundColor: 'yellow' }]}>Tìm trạm xăng</Text>
                  <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginVertical: 10, }} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={[styles.modalText, styles.button, { backgroundColor: 'gray' }]}>Tìm điểm sửa xe</Text>
                  <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginVertical: 10, }} />
                </TouchableOpacity>



                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={callSOS}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setCallSOS(!callSOS);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {/* Phone dialing options */}
                <Text style={styles.modalText}>Đang Gọi ...</Text>
                {findSOS && findSOS[0] && findSOS[0].result && (
                  <>
                    <Text style={styles.modalText}>{findSOS[0].result.name}</Text>
                    <Text style={styles.modalText}>SĐT: {findSOS[0].result.phoneNumber}</Text>
                    <Text style={styles.modalText}>Địa chỉ: {findSOS[0].result.formatted_address}</Text>
                    <Text style={styles.modalText}>
                      (Kinh độ, Vĩ độ): ({findSOS[0].result.geometry.location.lng}, {findSOS[0].result.geometry.location.lat})
                    </Text>
                  </>
                )}

                {/* Close modal button */}
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setCallSOS(!callSOS)}>
                  <Text style={styles.textStyle}>Đóng</Text>
                </Pressable>
              </View>
            </View>
          </Modal>


          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={[styles.textStyle, styles.buttonOpen]}>SOS</Text>
          </Pressable>
        </View>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginTop: 100,
    padding: 30,
    // paddingLeft: -80,
    // marginLeft:0,
    // marginStart:10,
  },
  infoSection: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'stretch',
    marginBottom: 20,
    marginHorizontal: 0,
  },
  infoColumn: {
    flex: 1,
  },
  label: {
    fontSize: sizeText + 20, // Tăng kích thước chữ thông tin xe
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: sizeText + 10, // Tăng kích thước chữ thông tin xe
  },
  status: {
    marginBottom: 10,
    marginLeft: 50,
  },
  statusTitle: {
    fontSize: sizeText + 20, // Tăng kích thước chữ trạng thái xe
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusItem: {
    fontSize: sizeText + 10, // Tăng kích thước chữ trạng thái xe
    marginBottom: 5,
  },
  // Kiểu dáng cho văn bản trong phần trạng thái xe
  statusText: {
    fontSize: sizeText + 10,
    borderColor: 'black', // Màu viền đen
    borderWidth: 1, // Độ dày của viền
    padding: 2, // Khoảng cách nội dung đến viền
  },
  dataContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  circleContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: sizeText + 10, // Tăng kích thước chữ biểu đồ tròn
    fontWeight: 'bold',
    color: '#007bff',
  },
  value: {
    fontSize: sizeText + 10, // Tăng kích thước chữ quãng đường đã đi
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    // backgroundColor: '#F194FF',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignContent: 'center',

    padding: 30,
    borderRadius: 360,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: sizeText + 30,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: sizeText + 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: sizeText + 10,
  },
});

export default DisplayParam;
