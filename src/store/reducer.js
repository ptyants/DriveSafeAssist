// State khởi tạo - một Object
const initialState = {
    userLocation: null,  //Tọa độ người dùng
    carStatus: {
        distance: 0,
        vehicleMaintain: { status: 'Tốt', color: 'green' },
        fuel: { status: 'Không', color: 'green' },
        damage: { status: 'Không', color: 'green' },

    },
    maxDistance: 999999,

}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHECK_LOCATION':
            return {
                ...state,
                userLocation: action.payload,
            };
        case 'STATE_CAR':
            console.log("dispath ok")
            return {
                ...state,
                carStatus: {
                    ...state.carStatus,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
};

export default reducer;