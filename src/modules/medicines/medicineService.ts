import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { IMedicine } from './medicineInterface';
import Medicine from './medicineModel';

// add medicine (only admins can add)
const addMedicine = async (payload: IMedicine) => {
  const newMedicine = await Medicine.create(payload);
  return newMedicine;
};

// update medicine (only admins can update)
const updateMedicine = async (
  medicineId: string,
  updatedData: Partial<IMedicine>,
) => {
  return await Medicine.findByIdAndUpdate(medicineId, updatedData, {
    new: true,
  });
};

// delete medicine (only admins can delete)
const deleteMedicine = async (medicineId: string) => {
  return await Medicine.findByIdAndDelete(medicineId);
};

// get all medicines
const getAllMedicines = async (query: Record<string, unknown>) => {
  const medicineSearchFields = ['name', 'category', 'symptoms',"dosage_form"];

  const medicineQuery = new QueryBuilder(Medicine.find(), query)
    .search(medicineSearchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await medicineQuery.countTotal();
  const result = await medicineQuery.modelQuery;

  return {
    meta,
    data: result,
  };
};

// get medicine by _id
const medicineById = async (id: string) => {
  return await Medicine.findById(id);
};

export const medicineServices = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getAllMedicines,
  medicineById,
};
