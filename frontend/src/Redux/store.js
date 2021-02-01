import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'

import selectNumberReducer from './Housie/Reducers'

const store = createStore(selectNumberReducer, applyMiddleware(logger))

export default store;