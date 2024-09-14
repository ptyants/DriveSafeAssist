import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { stateCar } from './action';

const UpdateCarStatus = () => {
  const dispatch = useDispatch();

  const [distance, setDistance] = useState(0);
  //việc bảo trì phụ thuộc vào quãng đường di chuyển nên k cẩn thay đổi tình trạng bảo trì này
  const [vehicleMaintain, setVehicleMaintain] = useState({ status: 'Tốt', color: 'green' }); 
  const [fuel, setFuel] = useState({ status: 'Không', color: 'green' });
  const [damage, setDamage] = useState({ status: 'Không', color: 'green' });

  useEffect(() => {
    // Simulate updating vehicle status based on some conditions
    // Quãng đường đã đi max là 999.999 km
    setDistance(90000);

    // Xăng
    // setFuel({ status: 'Không', color: 'green' });
    setFuel({ status: 'Sắp hết xăng', color: 'red' });

    // Tình trạng hư hỏng
    setDamage({ status: 'Không', color: 'green' });
    // setDamage({ status: 'Cần thay lốp', color: 'red' });
    // setDamage({ status: 'Cần thay bộ lọc dầu', color: 'red' });

    console.log('ok')
  }, []);

  useEffect(() => {
    // Create a new car status object with updated values
    const newCarStatus = {
      distance,
      vehicleMaintain,
      fuel,
      damage,
    };
    console.log("ook")

    // Dispatch action to update carStatus in Redux store
    dispatch(stateCar(newCarStatus));
    console.log('ok2')
  }, [dispatch, distance, vehicleMaintain, fuel, damage]);

  return null; // This component does not render anything
};

export default UpdateCarStatus;
