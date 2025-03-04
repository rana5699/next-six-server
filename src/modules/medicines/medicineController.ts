
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { medicineServices } from './medicineService';
import responseHandler from '../../utils/responseHandler';

// add medicine
const addMedicine = catchAsync(async (req, res) => {
  const medicineData = req.body;

  const result = await medicineServices.addMedicine(medicineData);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'Failed to add medicine. Please try again',
      null,
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.CREATED,
    true,
    'Medicine added successfully.',
    null,
    result,
  );
});

//  update medicine information
const updateMedicine = catchAsync(async (req, res) => {
  const medicineId = req.params.id;
  const medicineData = req.body;

  const result = await medicineServices.updateMedicine(
    medicineId,
    medicineData,
  );

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Medicine not found',
      null,
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Medicine updated successfully.',
    null,
    result,
  );
});

// delete medicine
const deleteMedicine = catchAsync(async (req, res) => {
  const medicineId = req.params.id;

  const result = await medicineServices.deleteMedicine(medicineId);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Medicine not found!',
      null,
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Medicine deleted successfully.',
    null,
    null,
  );
});

// get medicine by id
const getSingleMedicineById = catchAsync(async (req, res) => {
  const medicineId = req.params.id;
  const result = await medicineServices.medicineById(medicineId);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Medicine not found!',
      null,
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Medicine fetched successfully.',
    null,
    result,
  );
});

// get all medicines
const getAllMedicines = catchAsync(async (req, res) => {
  const result = await medicineServices.getAllMedicines(req.query);

  if (result?.data?.length === 0) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'No medicines found!',
      null,
      result,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Medicines fetched successfully.',
    result?.meta,
    result?.data,
  );
});

export const medicineControllers = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getSingleMedicineById,
  getAllMedicines,
};
