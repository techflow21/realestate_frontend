export interface InquiryRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface InquiryResponse {
  id: number;
  propertyId: number;
  propertyTitle: string;
  userId: number;
  userName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'PENDING' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}
