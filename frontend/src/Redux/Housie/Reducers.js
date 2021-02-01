import { SELECT_NUMBER } from './Types'

const initialState = {
    dataArray: new Set()
}

const selectNumberReducer = (state = initialState, action) => {
    switch(action.type){
        case SELECT_NUMBER: return {
            ...state,
            dataArray: new Set([...state.dataArray, action.payload])
            // dataArray: state.dataArray.add(action.payload)
            //why it was not working bcoz, we are modifying the existing state
            //but always return new state
        }
        default: return state
    }
}

export default selectNumberReducer;