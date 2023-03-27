const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError={
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message:err.message || 'Something went wrong try again later'
  }
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  if(err.name === 'ValidationError'){
    customError.message = Object.values(err.errors).map(val => val.message)
    customError.statusCode = 400
  }
  if(err.name === 'CastError'){
    customError.message = `Resource not found with id of ${err.value}`
    customError.statusCode = 404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  if(err.code === 11000){
    customError.message = `Duplicate registration entered for ${Object.keys(err.keyValue)}  `,
    customError.statusCode = 400
  }
  return res.status(customError.statusCode).json({ msg: customError.message })
}

module.exports = errorHandlerMiddleware
