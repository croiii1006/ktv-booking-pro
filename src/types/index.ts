export type UserRole = 'staff' | 'leader';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  idCard: string;
  memberType: 'regular' | 'vip' | 'svip';
  registrationDate: string;
  rechargeBalance: number;
  giftBalance: number;
  createdAt: string;
  staffId: string;
}

export type RoomType = 'luxury' | 'large' | 'medium' | 'small';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  floor: number;
  pricePerHour: number;
}

export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';

export interface Order {
  id: string;
  roomId: string;
  customerId: string;
  staffId: string;
  date: string;
  status: OrderStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
}

export type BookingStatus = 'available' | 'booked' | 'occupied';

export interface RechargeRecord {
  id: string;
  customerId: string;
  amount: number;
  staffId: string;
  createdAt: string;
}
