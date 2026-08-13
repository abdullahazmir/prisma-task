'use client';

import React from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, Database, Server } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center gap-6 max-w-4xl mx-auto py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" /> Next.js 14 + HeroUI + Express + Prisma Stack
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Next-Generation E-Commerce <br />
          <span className="gradient-text">Engineered for Scale & Speed</span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl">
          Powered by a modular Express.js & TypeScript REST API with Prisma ORM, PostgreSQL database, and a dynamic HeroUI reactive frontend.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Button
            size="lg"
            color="primary"
            className="font-bold shadow-lg shadow-indigo-500/20"
            endContent={<ArrowRight className="w-5 h-5" />}
            onClick={() => router.push('/products')}
          >
            Explore Product Catalog
          </Button>
          <Button
            size="lg"
            variant="bordered"
            className="font-semibold text-slate-200 border-slate-700 hover:border-slate-500"
            startContent={<ShoppingBag className="w-5 h-5" />}
            onClick={() => router.push('/cart')}
          >
            View Shopping Cart
          </Button>
        </div>
      </section>

      {/* Feature Tech Stack Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardBody className="p-6 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Express.js & TypeScript</h3>
            <p className="text-sm text-slate-400">
              Modular architecture with layered routes, controllers, services, and middlewares.
            </p>
          </CardBody>
        </Card>

        <Card className="glass-card">
          <CardBody className="p-6 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Prisma ORM & PostgreSQL</h3>
            <p className="text-sm text-slate-400">
              Normalized database with 6 models, enums, soft delete support, and indexes.
            </p>
          </CardBody>
        </Card>

        <Card className="glass-card">
          <CardBody className="p-6 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">HeroUI Design System</h3>
            <p className="text-sm text-slate-400">
              Accessible, accessible component library powered by Tailwind CSS and Framer Motion.
            </p>
          </CardBody>
        </Card>

        <Card className="glass-card">
          <CardBody className="p-6 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">JWT & bcrypt Security</h3>
            <p className="text-sm text-slate-400">
              Secure authentication flow with password hashing and Role-Based Access Control.
            </p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
