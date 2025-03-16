
export interface IMedicine {
  name: string;
  generic_name: string;
  brand_name: string[];
  category: string;
  symptoms: string[];
  strength: string[];
  dosage_form: string[];
  price: number;
  stock: number;
  imageUrl: string[];
  rating?: number;
  prescription_required: boolean;
  manufacturer_details?: string;
  expiry_date?: string;
}
