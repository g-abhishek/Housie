import {SELECT_NUMBER, SELECT_GAME} from './Types'

const initialState = {
    dataArray: new Set(),
    gameId: "",
    gameName: "",
    gameDateTime: "",
    numUsers: 0,
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
        case SELECT_GAME: return {
            ...state,
            dataArray: new Set([...action.payload.done]),
            gameId: action.payload.gameId,
            gameName: action.payload.gameName,
            gameDateTime: action.payload.gameDateTime,
            numUsers: action.payload.numUsers,
        }
        default: return state
    }
}

export default selectNumberReducer;