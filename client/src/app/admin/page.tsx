'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Textarea, useDisclosure } from '@heroui/react';
import { Shield, Plus, Edit2, Trash2, Package, Folder, ShoppingBag, Users } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Category Modal State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Product Modal State
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodCatId, setProdCatId] = useState('');

  const catModal = useDisclosure();
  const prodModal = useDisclosure();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/products');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      const [catRes, prodRes, ordRes, usrRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products?limit=100'),
        api.get('/orders'),
        api.get('/users'),
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (ordRes.data.success) setOrders(ordRes.data.data);
      if (usrRes.data.success) setUsersList(usrRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/categories', { name: catName, description: catDesc });
      if (res.data.success) {
        catModal.onClose();
        setCatName('');
        setCatDesc('');
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', {
        name: prodName,
        description: prodDesc,
        price: Number(prodPrice),
        stock: Number(prodStock),
        categoryId: prodCatId,
      });
      if (res.data.success) {
        prodModal.onClose();
        setProdName('');
        setProdDesc('');
        setProdPrice('');
        setProdStock('');
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to soft delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadData();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handleOrderStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      loadData();
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-purple-950/30 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-200 flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" /> Admin Console
          </h1>
          <p className="text-sm text-purple-300/70 mt-1">
            Manage store catalog, products, customer orders, and registered accounts
          </p>
        </div>
      </div>

      <Tabs aria-label="Admin Control Tabs" color="secondary" variant="bordered">
        {/* Products Tab */}
        <Tab key="products" title={<div className="flex items-center gap-2"><Package className="w-4 h-4" /> Products</div>}>
          <Card className="glass-card mt-4 p-4">
            <CardBody className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-100">Products List ({products.length})</h3>
                <Button color="secondary" startContent={<Plus className="w-4 h-4" />} onClick={prodModal.onOpen}>
                  Add Product
                </Button>
              </div>

              <Table aria-label="Admin Products Table" className="bg-transparent">
                <TableHeader>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>PRICE</TableColumn>
                  <TableColumn>STOCK</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTION</TableColumn>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-semibold text-slate-200">{p.name}</TableCell>
                      <TableCell>{p.category?.name}</TableCell>
                      <TableCell className="text-indigo-400 font-bold">${p.price?.toFixed(2)}</TableCell>
                      <TableCell>{p.stock}</TableCell>
                      <TableCell>
                        <Chip size="sm" color={p.status === 'AVAILABLE' ? 'success' : 'warning'} variant="flat">
                          {p.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Button isIconOnly size="sm" color="danger" variant="light" onClick={() => handleDeleteProduct(p.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        {/* Categories Tab */}
        <Tab key="categories" title={<div className="flex items-center gap-2"><Folder className="w-4 h-4" /> Categories</div>}>
          <Card className="glass-card mt-4 p-4">
            <CardBody className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-100">Categories List ({categories.length})</h3>
                <Button color="secondary" startContent={<Plus className="w-4 h-4" />} onClick={catModal.onOpen}>
                  Add Category
                </Button>
              </div>

              <Table aria-label="Admin Categories Table" className="bg-transparent">
                <TableHeader>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>SLUG</TableColumn>
                  <TableColumn>DESCRIPTION</TableColumn>
                </TableHeader>
                <TableBody>
                  {categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-semibold text-slate-200">{c.name}</TableCell>
                      <TableCell className="font-mono text-xs text-purple-400">{c.slug}</TableCell>
                      <TableCell className="text-slate-400">{c.description || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        {/* Orders Tab */}
        <Tab key="orders" title={<div className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Customer Orders</div>}>
          <Card className="glass-card mt-4 p-4">
            <CardBody className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-slate-100">Customer Orders ({orders.length})</h3>
              <Table aria-label="Admin Orders Table" className="bg-transparent">
                <TableHeader>
                  <TableColumn>ORDER ID</TableColumn>
                  <TableColumn>CUSTOMER</TableColumn>
                  <TableColumn>TOTAL AMOUNT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>CHANGE STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs text-slate-300">{o.id.substring(0, 8)}...</TableCell>
                      <TableCell className="font-medium text-slate-200">{o.user?.name}</TableCell>
                      <TableCell className="font-extrabold text-indigo-400">${o.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip size="sm" color="primary" variant="flat">{o.status}</Chip>
                      </TableCell>
                      <TableCell>
                        <Select
                          size="sm"
                          aria-label="Update Order Status"
                          selectedKeys={[o.status]}
                          className="w-36"
                          onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)}
                        >
                          <SelectItem key="PENDING">PENDING</SelectItem>
                          <SelectItem key="PROCESSING">PROCESSING</SelectItem>
                          <SelectItem key="SHIPPED">SHIPPED</SelectItem>
                          <SelectItem key="DELIVERED">DELIVERED</SelectItem>
                          <SelectItem key="CANCELLED">CANCELLED</SelectItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        {/* Users Tab */}
        <Tab key="users" title={<div className="flex items-center gap-2"><Users className="w-4 h-4" /> Users</div>}>
          <Card className="glass-card mt-4 p-4">
            <CardBody className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-slate-100">Registered Users ({usersList.length})</h3>
              <Table aria-label="Admin Users Table" className="bg-transparent">
                <TableHeader>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>EMAIL</TableColumn>
                  <TableColumn>ROLE</TableColumn>
                </TableHeader>
                <TableBody>
                  {usersList.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-semibold text-slate-200">{u.name}</TableCell>
                      <TableCell className="text-slate-400">{u.email}</TableCell>
                      <TableCell>
                        <Chip size="sm" color={u.role === 'ADMIN' ? 'secondary' : 'default'} variant="flat">
                          {u.role}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Add Category Modal */}
      <Modal isOpen={catModal.isOpen} onOpenChange={catModal.onOpenChange} className="glass-card text-slate-100">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleCreateCategory}>
              <ModalHeader>Add New Category</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <Input label="Category Name" placeholder="e.g. Smart Wearables" variant="bordered" value={catName} onValueChange={setCatName} required />
                <Textarea label="Description" placeholder="Category summary..." variant="bordered" value={catDesc} onValueChange={setCatDesc} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>Cancel</Button>
                <Button color="secondary" type="submit">Create Category</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Add Product Modal */}
      <Modal isOpen={prodModal.isOpen} onOpenChange={prodModal.onOpenChange} className="glass-card text-slate-100">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleCreateProduct}>
              <ModalHeader>Add New Product</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <Input label="Product Name" placeholder="Pro Earbuds X" variant="bordered" value={prodName} onValueChange={setProdName} required />
                <Textarea label="Description" placeholder="Product details..." variant="bordered" value={prodDesc} onValueChange={setProdDesc} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" step="0.01" label="Price ($)" placeholder="99.99" variant="bordered" value={prodPrice} onValueChange={setProdPrice} required />
                  <Input type="number" label="Stock Quantity" placeholder="50" variant="bordered" value={prodStock} onValueChange={setProdStock} required />
                </div>
                <Select label="Category" variant="bordered" selectedKeys={prodCatId ? [prodCatId] : []} onChange={(e) => setProdCatId(e.target.value)} required>
                  {categories.map((c) => (
                    <SelectItem key={c.id}>{c.name}</SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>Cancel</Button>
                <Button color="secondary" type="submit">Create Product</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
