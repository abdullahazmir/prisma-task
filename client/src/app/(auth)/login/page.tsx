'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Link } from '@heroui/react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed! Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md glass-card p-4">
        <CardHeader className="flex flex-col gap-1 items-center text-center pb-2">
          <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
          <p className="text-sm text-slate-400">Log in to your account to manage orders</p>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="user@scic.com"
              variant="bordered"
              value={email}
              onValueChange={setEmail}
              startContent={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              variant="bordered"
              value={password}
              onValueChange={setPassword}
              startContent={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={submitting}
              startContent={!submitting && <LogIn className="w-4 h-4" />}
              className="font-semibold shadow-lg shadow-indigo-500/20 mt-2"
            >
              Sign In
            </Button>
          </form>
          <div className="text-center mt-6 text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-400 font-medium">
              Create Account
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
