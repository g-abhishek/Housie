import {SELECT_NUMBER} from './Types'

export const selectNumber = (num) => {
    console.log(num)
    return {
        type: SELECT_NUMBER,
        payload: num
    }
}