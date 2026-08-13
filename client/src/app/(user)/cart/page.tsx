'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setOrdering(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post('/orders', payload);
      if (res.data.success) {
        clearCart();
        setOrderSuccess(true);
        onOpen();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to process order checkout!');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-indigo-400" /> Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <Card className="glass-card text-center py-16 p-6">
          <CardBody className="flex flex-col items-center gap-4">
            <p className="text-slate-400 text-lg">Your shopping cart is currently empty.</p>
            <Button
              color="primary"
              onClick={() => router.push('/products')}
              endContent={<ArrowRight className="w-4 h-4" />}
            >
              Browse Products
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Card className="glass-card p-4">
          <CardBody className="overflow-x-auto">
            <Table aria-label="Shopping Cart Items Table" className="bg-transparent">
              <TableHeader>
                <TableColumn>PRODUCT</TableColumn>
                <TableColumn>PRICE</TableColumn>
                <TableColumn>QUANTITY</TableColumn>
                <TableColumn>SUBTOTAL</TableColumn>
                <TableColumn>ACTION</TableColumn>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-slate-200">{item.name}</TableCell>
                    <TableCell className="text-slate-400">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-bold px-2">{item.quantity}</span>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-indigo-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>

          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-800">
            <div className="text-xl font-extrabold text-slate-100">
              Total Amount: <span className="text-indigo-400">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="flat" color="danger" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button
                color="primary"
                size="lg"
                className="font-bold shadow-lg shadow-indigo-500/20"
                isLoading={ordering}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Order Success HeroUI Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="glass-card text-slate-100">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col items-center gap-2 pt-6">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
                <h3 className="text-xl font-bold text-slate-100">Order Placed Successfully!</h3>
              </ModalHeader>
              <ModalBody className="text-center text-slate-300">
                Your order has been recorded in the database. You can track its status in your profile history.
              </ModalBody>
              <ModalFooter className="justify-center pb-6">
                <Button color="primary" onClick={() => router.push('/orders')}>
                  View My Orders
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
