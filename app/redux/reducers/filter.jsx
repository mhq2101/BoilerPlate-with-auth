const ADD_FILTER = 'ADD_FILTER'
const REMOVE_FILTER = 'REMOVE_FILTER'
const UPDATE_FILTER = 'UPDATE_FILTER'
const GET_FILTERS = 'GET_FILTERS'
const SWITCH_PRIORITY = 'SWITCH_PRIORITY'

// ACTION CREATORS
// export const addFilter = filter => ({
//   type: ADD_FILTER, filter
// })

// export const removeFilter = filter => ({
//   type: REMOVE_FILTER, filter
// })

export const updateFilter = (filter) => ({
  type: UPDATE_FILTER, filter
})

// export const getFilters = (filters) => ({
//   type: GET_FILTERS, filters
// })

// export const switchPriority = (currentPriority, newPriority) => ({
//   type: SWITCH_PRIORITY, currentPriority, newPriority
// })

// REDUCER

export default function reducer(filter = {}, action) {
  switch (action.type) {

  case UPDATE_FILTER:
    return action.filter

  default:
    return filter
  }
}
