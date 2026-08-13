'use client';

import React from 'react';
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@heroui/react';
import { ShoppingCart, Package, Shield, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <HeroNavbar isBordered className="bg-slate-900/80 backdrop-blur-md border-slate-800">
      <NavbarBrand className="cursor-pointer" onClick={() => router.push('/')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white mr-2">
          P
        </div>
        <p className="font-bold text-inherit text-xl gradient-text">SCIC Store</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link href="/products" className="text-slate-300 hover:text-indigo-400 font-medium">
            Products Catalog
          </Link>
        </NavbarItem>
        {user && (
          <NavbarItem>
            <Link href="/orders" className="text-slate-300 hover:text-indigo-400 font-medium">
              My Orders
            </Link>
          </NavbarItem>
        )}
        {user?.role === 'ADMIN' && (
          <NavbarItem>
            <Link href="/admin" className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
              <Shield className="w-4 h-4" /> Admin Console
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            aria-label="Shopping Cart"
            onClick={() => router.push('/cart')}
            className="relative"
          >
            {totalCartItems > 0 ? (
              <Badge content={totalCartItems} color="danger" shape="circle" size="sm">
                <ShoppingCart className="w-5 h-5 text-slate-200" />
              </Badge>
            ) : (
              <ShoppingCart className="w-5 h-5 text-slate-200" />
            )}
          </Button>
        </NavbarItem>

        {user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={user.name}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold text-xs text-slate-400">Signed in as</p>
                <p className="font-semibold text-slate-200">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="orders" startContent={<Package className="w-4 h-4" />} onClick={() => router.push('/orders')}>
                My Orders
              </DropdownItem>
              {user.role === 'ADMIN' ? (
                <DropdownItem key="admin" startContent={<Shield className="w-4 h-4 text-purple-400" />} onClick={() => router.push('/admin')}>
                  Admin Dashboard
                </DropdownItem>
              ) : (
                <DropdownItem key="empty-admin" className="hidden">
                  Admin Dashboard
                </DropdownItem>
              )}
              <DropdownItem key="logout" color="danger" startContent={<LogOut className="w-4 h-4" />} onClick={logout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Button onClick={() => router.push('/login')} variant="flat" color="primary" size="sm" startContent={<LogIn className="w-4 h-4" />}>
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button onClick={() => router.push('/register')} color="secondary" size="sm" startContent={<UserPlus className="w-4 h-4" />}>
                Register
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </HeroNavbar>
  );
};
