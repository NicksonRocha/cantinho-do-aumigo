
export type PetFilters = {
  breed: string[];
  size: string[];
  sex: string[];
  temperament: string[];
  ageRange: { min: number; max: number } | null;
};

export type PetListItem = {
  id: number;
  name: string;
  breed: string;
  color?: string | null;
  size?: string | null;
  sex?: string | null;
  ageMonths: number;
  weightKg?: number | null;
  temperament?: string | null;
  imageUrl?: string | null;
  description?: string | null;
};

export type PetDetail = {
  id: number;
  name: string;
  breed: string;
  color?: string | null;
  size?: "pequeno" | "medio" | "grande" | null;
  sex?: "M" | "F" | null;
  ageMonths: number;
  weightKg?: number | null;
  temperament?: string | null;
  description?: string | null;
  images: string[]; 
  contactPhone: string | null;
  authorId: number; 
};
