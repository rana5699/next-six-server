/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../middleware/AppError';
import catchAsync from '../../utils/catchAsync';
import { medicineServices } from './medicineService';
import responseHandler from '../../utils/responseHandler';

// add medicine
const addMedicine = catchAsync(async (req, res) => {
  try {
    const medicineData = req.body;

    const result = await medicineServices.addMedicine(medicineData);

    if (!result) {
      responseHandler(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        'Failed to add medicine. Please try again',
        null,
      );
    }

    responseHandler(
      res,
      StatusCodes.CREATED,
      true,
      'Medicine added successfully.',
      result,
    );
  } catch (error: any) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'Something went wrong',
    );
  }
});

//  update medicine information
const updateMedicine = catchAsync(async (req, res) => {
  try {
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
      );
    }

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'Medicine updated successfully.',
      result,
    );
  } catch (error: any) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'Something went wrong',
    );
  }
});

// delete medicine
const deleteMedicine = catchAsync(async (req, res) => {
  try {
    const medicineId = req.params.id;

    const result = await medicineServices.deleteMedicine(medicineId);

    if (!result) {
      responseHandler(
        res,
        StatusCodes.NOT_FOUND,
        false,
        'Medicine not found!',
        null,
      );
    }

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'Medicine deleted successfully.',
      null,
    );
  } catch (error: any) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'Something went wrong',
    );
  }
});

// get medicine by id

const getSingleMedicineById = catchAsync(async (req, res) => {
  try {
    const medicineId = req.params.id;
    const result = await medicineServices.medicineById(medicineId);

    if (!result) {
      responseHandler(
        res,
        StatusCodes.NOT_FOUND,
        false,
        'Medicine not found!',
        null,
      );
    }

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'Medicine fetched successfully.',
      result,
    );
  } catch (error: any) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'Something went wrong',
    );
  }
});

// get all medicines
const getAllMedicines = catchAsync(async (req, res) => {
  try {
    const result = await medicineServices.getAllMedicines();

    if (result.length === 0) {
      return responseHandler(
        res,
        StatusCodes.NOT_FOUND,
        false,
        'No medicines found!',
        result,
      );
    }

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'Medicines fetched successfully.',
      result,
    );
  } catch (error: any) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'Something went wrong',
    );
  }
});

export const medicineControllers = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getSingleMedicineById,
  getAllMedicines,
};
