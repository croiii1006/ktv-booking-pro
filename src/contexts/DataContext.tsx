import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer, Room, Order, RechargeRecord, RoomType, OrderStatus } from '@/types';

interface DataContextType {
  customers: Customer[];
  rooms: Room[];
  orders: Order[];
  rechargeRecords: RechargeRecord[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomerBalance: (customerId: string, amount: number, staffId: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, userId?: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getRoomById: (id: string) => Room | undefined;
  getBookingStatus: (roomId: string, date: string) => 'available' | 'booked' | 'occupied';
  getOrderByRoomAndDate: (roomId: string, date: string) => Order | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const initialRooms: Room[] = [
  { id: 'R001', number: '101', type: 'luxury', floor: 1, pricePerHour: 888 },
  { id: 'R002', number: '102', type: 'large', floor: 1, pricePerHour: 588 },
  { id: 'R003', number: '103', type: 'medium', floor: 1, pricePerHour: 388 },
  { id: 'R004', number: '201', type: 'luxury', floor: 2, pricePerHour: 888 },
  { id: 'R005', number: '202', type: 'large', floor: 2, pricePerHour: 588 },
  { id: 'R006', number: '203', type: 'medium', floor: 2, pricePerHour: 388 },
  { id: 'R007', number: '204', type: 'small', floor: 2, pricePerHour: 288 },
  { id: 'R008', number: '301', type: 'luxury', floor: 3, pricePerHour: 888 },
  { id: 'R009', number: '302', type: 'large', floor: 3, pricePerHour: 588 },
  { id: 'R010', number: '303', type: 'small', floor: 3, pricePerHour: 288 },
];

const initialCustomers: Customer[] = [
  { id: 'C001', name: '陈伟', phone: '13900001111', memberType: 'vip', balance: 5000, createdAt: '2024-01-15', staffId: 'S001' },
  { id: 'C002', name: '刘芳', phone: '13900002222', memberType: 'svip', balance: 15000, createdAt: '2024-02-20', staffId: 'S001' },
  { id: 'C003', name: '周杰', phone: '13900003333', memberType: 'regular', balance: 1000, createdAt: '2024-03-10', staffId: 'S002' },
  { id: 'C004', name: '吴婷', phone: '13900004444', memberType: 'vip', balance: 3500, createdAt: '2024-03-25', staffId: 'S002' },
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const initialOrders: Order[] = [
  { id: 'O001', roomId: 'R001', customerId: 'C001', staffId: 'S001', date: today, status: 'approved', createdAt: '2024-12-04T10:00:00', approvedAt: '2024-12-04T11:00:00', approvedBy: 'L001' },
  { id: 'O002', roomId: 'R002', customerId: 'C002', staffId: 'S001', date: today, status: 'pending', createdAt: '2024-12-04T14:00:00' },
  { id: 'O003', roomId: 'R005', customerId: 'C003', staffId: 'S002', date: tomorrow, status: 'pending', createdAt: '2024-12-04T15:00:00' },
  { id: 'O004', roomId: 'R003', customerId: 'C004', staffId: 'S002', date: today, status: 'paid', createdAt: '2024-12-03T09:00:00', approvedAt: '2024-12-03T10:00:00', approvedBy: 'L001', paidAt: '2024-12-04T19:00:00' },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [rooms] = useState<Room[]>(initialRooms);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [rechargeRecords, setRechargeRecords] = useState<RechargeRecord[]>([]);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `C${String(customers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomerBalance = (customerId: string, amount: number, staffId: string) => {
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, balance: c.balance + amount } : c
    ));
    const record: RechargeRecord = {
      id: `RC${String(rechargeRecords.length + 1).padStart(3, '0')}`,
      customerId,
      amount,
      staffId,
      createdAt: new Date().toISOString(),
    };
    setRechargeRecords([...rechargeRecords, record]);
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: `O${String(orders.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, userId?: string) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status };
        if (status === 'approved' || status === 'rejected') {
          updated.approvedAt = new Date().toISOString();
          updated.approvedBy = userId;
        }
        if (status === 'paid') {
          updated.paidAt = new Date().toISOString();
        }
        return updated;
      }
      return o;
    }));
  };

  const getCustomerById = (id: string) => customers.find(c => c.id === id);
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  const getBookingStatus = (roomId: string, date: string): 'available' | 'booked' | 'occupied' => {
    const order = orders.find(o => o.roomId === roomId && o.date === date && o.status !== 'cancelled' && o.status !== 'rejected');
    if (!order) return 'available';
    if (order.status === 'paid') return 'occupied';
    return 'booked';
  };

  const getOrderByRoomAndDate = (roomId: string, date: string) => {
    return orders.find(o => o.roomId === roomId && o.date === date && o.status !== 'cancelled' && o.status !== 'rejected');
  };

  return (
    <DataContext.Provider value={{
      customers,
      rooms,
      orders,
      rechargeRecords,
      addCustomer,
      updateCustomerBalance,
      addOrder,
      updateOrderStatus,
      getCustomerById,
      getRoomById,
      getBookingStatus,
      getOrderByRoomAndDate,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
