const request = require('request-promise')
const coap        = require('coap')

export const GET_CATEGORIES = 'GET_CATEGORIES'
export const POST_CATEGORY = 'POST_CATEGORY'
export const PUT_CATEGORY = 'PUT_CATEGORY'
export const DELETE_CATEGORY = 'DELETE_CATEGORY'
export const GET_NOTES = 'GET_NOTES'

export const getCategories = pageIndex => async dispatch => {
	const req = coap.request('coap://localhost/Matteo')
	const response = await request.get('http://localhost:3000/categories', {json: true, qs: {page: pageIndex}})
	dispatch({ type: GET_CATEGORIES, payload: response })
}

export const postCategory = (id, name) => async dispatch => {
	const response = await request.post(`http://localhost:3000/categories/${id}`, {json: true, body:{name}})
	dispatch({ type: POST_CATEGORY, payload: response })
}

export const putCategory = (id, name) => async dispatch => {
	const response = await request.put(`http://localhost:3000/categories/${id}`, {json: true, body:{name}})
	dispatch({ type: PUT_CATEGORY, payload: response })
}

export const deleteCategory = id => async dispatch => {
	const response = await request.put(`http://localhost:3000/categories/${id}`, {json: true})
	dispatch({ type: DELETE_CATEGORY, payload: response })
}

export const getNotes = (id, pageIndex) => async dispatch => {
	const response = await request.get('http://localhost:3000/notes', {json: true, qs: {page: pageIndex}, category: id})
	dispatch({ type: GET_NOTES, payload: response })
}