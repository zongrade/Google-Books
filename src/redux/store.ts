import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

//export const store = createStore(reducer, applyMiddleware(thunk))
const defaultState = {
  totalItems: [''],
  items: [
    {
      accessInfo: { accessViewStatus: '', country: '' },
      id: '',
      saleInfo: { country: '', isEbook: false, saleability: '' },
      volumeInfo: {
        imageLinks: {
          smallThumbnail: '',
        },
        title: '',
        categories: [''],
        authors: [''],
      },
    },
  ],
}
interface action {
  type: string
  payload: responce
}
interface book {
  accessInfo: {
    accessViewStatus: string
    country: string
  }
  id: string
  saleInfo: {
    country: string
    isEbook: boolean
    saleability: string
  }
  volumeInfo: {
    imageLinks: {
      smallThumbnail: string
    }
    title: string
    categories: string[]
    authors: string[]
  }
}
export interface responce {
  totalItems: string[]
  items: book[]
}
const asyncReducer = (state: responce = defaultState, action: action) => {
  switch (action.type) {
    case 'saveResponce':
      if (state.items[0].id === '') {
        return { ...state, ...action.payload }
      } else {
        return { ...state, items: [...action.payload.items] }
      }
    case 'zeroResponce':
      return { ...defaultState }
    default:
      return state
  }
}
export function zeroResponce() {
  return function (dispatch: any) {
    dispatch({
      type: 'zeroResponce',
    })
  }
}
export function saveResponce(data: any) {
  return function (dispatch: any) {
    dispatch({
      type: 'saveResponce',
      payload: {
        items: data.items,
        totalItems: data.totalItems,
      },
    })
  }
}
export const store = createStore(asyncReducer, applyMiddleware(thunk))
