'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Skeleton } from '@heroui/react';
import { Package } from 'lucide-react';
import { api } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch user orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'SHIPPED':
      case 'PROCESSING':
        return 'primary';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
        <Package className="w-8 h-8 text-indigo-400" /> My Order History
      </h1>

      {loading ? (
        <Card className="glass-card p-6">
          <Skeleton className="h-40 w-full rounded-xl bg-slate-800" />
        </Card>
      ) : orders.length === 0 ? (
        <Card className="glass-card text-center py-16 p-6">
          <p className="text-slate-400 text-lg">You have not placed any orders yet.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="glass-card p-4">
              <CardBody className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-between items-center pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <span className="text-xs text-slate-500 block">ORDER ID</span>
                    <span className="font-mono text-sm font-semibold text-slate-300">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">DATE</span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <Chip size="sm" color={getStatusColor(order.status)} variant="flat">
                      {order.status}
                    </Chip>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">TOTAL AMOUNT</span>
                    <span className="text-lg font-black text-indigo-400">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items Breakdown Table */}
                <Table aria-label="Order Items Details" className="bg-slate-900/40 rounded-xl">
                  <TableHeader>
                    <TableColumn>ITEM</TableColumn>
                    <TableColumn>UNIT PRICE</TableColumn>
                    <TableColumn>QTY</TableColumn>
                    <TableColumn>SUBTOTAL</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {order.orderItems?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-slate-200">
                          {item.product?.name}
                        </TableCell>
                        <TableCell className="text-slate-400">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-slate-300">{item.quantity}</TableCell>
                        <TableCell className="font-bold text-slate-200">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
