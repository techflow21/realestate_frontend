export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  ownerId: number;
  ownerName: string;
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  coverImageUrl?: string;
}

export interface PropertyRequest {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  images?: File[];
  existingImageUrls?: string[];
  coverImage?: string;
}
