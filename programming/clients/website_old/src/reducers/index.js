import { 
	GET_CATEGORIES,
	POST_CATEGORY,
	PUT_CATEGORY,
	DELETE_CATEGORY,
	GET_NOTES
 } from '../actions'

export default (state = [], action) => {
	switch (action.type) {
		case GET_CATEGORIES: {
			return {...state, categories: action.payload}
		}
		case POST_CATEGORY: {
			return {...state}
		}
		case PUT_CATEGORY: {
			return {...state}
		}
		case DELETE_CATEGORY: {
			return {...state}
		}
		case GET_NOTES: {
			return {...state, notes: action.payload}
		}
		default:
			return state
	}
}
