'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Link } from '@heroui/react';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      router.push('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed! Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md glass-card p-4">
        <CardHeader className="flex flex-col gap-1 items-center text-center pb-2">
          <h2 className="text-2xl font-bold text-slate-100">Create Account</h2>
          <p className="text-sm text-slate-400">Join SCIC Store to start shopping</p>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="Jane Doe"
              variant="bordered"
              value={name}
              onValueChange={setName}
              startContent={<User className="w-4 h-4 text-slate-400" />}
              required
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="jane@example.com"
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
              color="secondary"
              size="lg"
              isLoading={submitting}
              startContent={!submitting && <UserPlus className="w-4 h-4" />}
              className="font-semibold shadow-lg shadow-purple-500/20 mt-2"
            >
              Create Account
            </Button>
          </form>
          <div className="text-center mt-6 text-sm text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-purple-400 font-medium">
              Sign In
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
