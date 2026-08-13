'use client';

import React from 'react';
import { Card, CardBody, CardFooter, Button, Chip } from '@heroui/react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  category?: { id: string; name: string };
  averageRating?: number;
  reviewCount?: number;
}

export const ProductCard = ({ product }: { product: IProduct }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  return (
    <Card className="glass-card hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
      <CardBody className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <Chip size="sm" color="secondary" variant="flat">
            {product.category?.name || 'General'}
          </Chip>
          <Chip
            size="sm"
            color={
              product.status === 'AVAILABLE'
                ? 'success'
                : product.status === 'OUT_OF_STOCK'
                ? 'warning'
                : 'danger'
            }
            variant="dot"
          >
            {product.status.replace('_', ' ')}
          </Chip>
        </div>

        <div>
          <h3
            onClick={() => router.push(`/products/${product.id}`)}
            className="text-lg font-bold text-slate-100 hover:text-indigo-400 cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>{product.averageRating || 5.0}</span>
          <span className="text-slate-500 font-normal text-xs">
            ({product.reviewCount || 0} reviews)
          </span>
        </div>
      </CardBody>

      <CardFooter className="px-5 py-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/40">
        <div>
          <span className="text-xs text-slate-400 block">Price</span>
          <span className="text-xl font-extrabold text-indigo-400">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="default"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            <Eye className="w-4 h-4 text-slate-300" />
          </Button>
          <Button
            size="sm"
            color="primary"
            disabled={product.status !== 'AVAILABLE'}
            startContent={<ShoppingCart className="w-4 h-4" />}
            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })}
          >
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
