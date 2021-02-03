import {SELECT_NUMBER, SELECT_GAME} from './Types'

export const selectNumber = (num) => {
    console.log(num)
    return {
        type: SELECT_NUMBER,
        payload: num
    }
}

export const selectGame = (data) => {
    console.log(data)
    return {
        type: SELECT_GAME,
        payload: JSON.parse(data)
    }
}