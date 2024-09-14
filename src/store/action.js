
const CHECK_LOCATION = "CHECK_LOCATION"
const STATE_CAR = "STATE_CAR"


const checkLocation = (location) => ({
    type: CHECK_LOCATION,
    payload: location,
  });

const stateCar = (status) => ({
  type: STATE_CAR,
  payload: status,
})

export {checkLocation, stateCar};