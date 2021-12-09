export const responseBuilder = (responseData) => {
  return { message: responseData, error: null }
}

export const errorBuilder = (errorMessage) => {
  return { message: null, error: errorMessage }
}