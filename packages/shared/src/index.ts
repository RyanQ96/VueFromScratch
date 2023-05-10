export const isObject = (value) => {
  return typeof value === 'object' && value !== null
}

export const isFunction = (value) => {
  return typeof value === 'function' && value != null 
}

export const isArray = (value) => {
  return value != null && Array.isArray(value) 
}