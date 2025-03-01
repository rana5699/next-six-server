import express from 'express';
import auth from '../../middleware/authMiddleware';
import { medicineControllers } from './medicineController';
import validateRequest from '../../utils/validRequest';
import { medicineValidations } from './medicineValidation';

const medicineRouters = express.Router();

// For Admin Only (needs middleware)
medicineRouters.post(
  '/medicine',
  validateRequest(medicineValidations.medicineSchema),
  auth('admin'),
  medicineControllers.addMedicine,
);

medicineRouters.put(
  '/medicine/:id',
  validateRequest(medicineValidations.medicineUpdateSchema),
  auth('admin'),
  medicineControllers.updateMedicine,
);

medicineRouters.delete(
  '/medicine/:id',
  auth('admin'),
  medicineControllers.deleteMedicine,
);

medicineRouters.get('/medicines', medicineControllers.getAllMedicines);

medicineRouters.get('/medicine/:id', medicineControllers.getSingleMedicineById);

// medicineRouters.get("/categories")

export default medicineRouters;
