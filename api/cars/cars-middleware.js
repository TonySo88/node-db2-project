const model = require("./cars-model")
const dbConfig = require('../../data/db-config')
var vinValidator = require('vin-validator')

const checkCarId = () => async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const idCheck = await model.getById(req.params.id)
      if(idCheck) {
        next()
      } else {
        res.status(404).json({
          message: `Car with ID ${req.params.id} could not be found`
        })
      }
  } catch(err) {
    next(err)
  }
}

const checkCarPayload = () => async (req, res, next) => {
  // DO YOUR MAGIC
  if (!req.body.mileage || !req.body.vin || !req.body.make || !req.body.model ) {
    return status(400).json({
      message: "Required field is missing"
    })
  }

  next()
}

const checkVinNumberValid = () => (req, res, next) => {
  // DO YOUR MAGIC
  try {
    var validVin = vinValidator.validate(req.body.vin)

    if(validVin === true) {
      next()
    } else {
      res.status(400).json({
        message: `${validVin} is invalid`
      })
    }
  } catch(err) {
    next(err)
  }
}

const checkVinNumberUnique = () => async (req, res, next) => {
  // DO YOUR MAGIC
  const allCars = await model.getAll()
  const vinCheck = allCars.filter(car => car.vin === req.body.vin)

  if(vinCheck[0] === req.body.vin) {
    return res.status(400).json({
      message: "VIN already exists"
    })
  } else {
    next()
  }
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
}
