'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select, SelectItem, Pagination, Skeleton } from '@heroui/react';
import { Search, Filter } from 'lucide-react';
import { api } from '../../../services/api';
import { ProductCard, IProduct } from '../../../components/ProductCard';

interface ICategory {
  id: string;
  name: string;
  slug: string;
}

export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 8,
      };
      if (search) params.search = search;
      if (selectedCategory) params.categoryId = selectedCategory;

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.data);
        if (res.data.meta) {
          setTotalPages(res.data.meta.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Products Catalog</h1>
          <p className="text-sm text-slate-400 mt-1">Browse our collection of high performance gadgets</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search products..."
            variant="bordered"
            value={search}
            onValueChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            startContent={<Search className="w-4 h-4 text-slate-400" />}
            className="w-full sm:w-64"
          />

          <Select
            placeholder="All Categories"
            variant="bordered"
            aria-label="Select Category Filter"
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            startContent={<Filter className="w-4 h-4 text-slate-400" />}
            className="w-full sm:w-56"
          >
            {categories.map((cat) => (
              <SelectItem key={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card p-5 rounded-2xl flex flex-col gap-4">
              <Skeleton className="h-6 w-1/3 rounded-lg bg-slate-800" />
              <Skeleton className="h-6 w-3/4 rounded-lg bg-slate-800" />
              <Skeleton className="h-12 w-full rounded-lg bg-slate-800" />
              <Skeleton className="h-10 w-full rounded-lg bg-slate-800" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <p className="text-slate-400 text-lg">No products found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            isCompact
            showControls
            total={totalPages}
            page={page}
            onChange={setPage}
            color="primary"
          />
        </div>
      )}
    </div>
  );
}
