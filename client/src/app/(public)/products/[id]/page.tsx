'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardBody, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, useDisclosure } from '@heroui/react';
import { Star, ShoppingCart, MessageSquare, ArrowLeft } from 'lucide-react';
import { api } from '../../../../services/api';
import { useCart } from '../../../../context/CartContext';
import { useAuth } from '../../../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const fetchProductDetail = useCallback(async () => {
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch product details', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProductDetail();
  }, [id, fetchProductDetail]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        productId: id,
        rating: Number(rating),
        comment,
      });
      if (res.data.success) {
        onClose();
        setComment('');
        fetchProductDetail();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-slate-400">Product not found.</div>;
  }

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto">
      <Button
        variant="light"
        size="sm"
        onClick={() => router.back()}
        startContent={<ArrowLeft className="w-4 h-4" />}
        className="w-fit text-slate-400 hover:text-slate-200"
      >
        Back to Products
      </Button>

      {/* Main Detail Card */}
      <Card className="glass-card p-6 rounded-3xl">
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="w-full h-80 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-slate-800 flex items-center justify-center text-indigo-400 font-extrabold text-3xl">
            {product.name}
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-2 items-center">
              <Chip size="sm" color="secondary" variant="flat">
                {product.category?.name}
              </Chip>
              <Chip
                size="sm"
                color={product.status === 'AVAILABLE' ? 'success' : 'warning'}
                variant="dot"
              >
                {product.status.replace('_', ' ')}
              </Chip>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-100">{product.name}</h1>
            <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="text-lg">{product.averageRating}</span>
              <span className="text-slate-500 font-normal text-sm">
                ({product.reviewCount} customer reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-black text-indigo-400">
                ${product.price?.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400">In Stock: {product.stock} items</span>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                color="primary"
                size="lg"
                className="font-bold flex-1 shadow-lg shadow-indigo-500/20"
                startContent={<ShoppingCart className="w-5 h-5" />}
                onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })}
              >
                Add to Cart
              </Button>
              {user && (
                <Button
                  color="secondary"
                  size="lg"
                  variant="flat"
                  startContent={<MessageSquare className="w-5 h-5" />}
                  onClick={onOpen}
                >
                  Write Review
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Customer Reviews Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-slate-100">Customer Reviews</h2>
        {product.reviews?.length === 0 ? (
          <p className="text-slate-400 text-sm glass-card p-6 rounded-2xl">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews?.map((review: any) => (
              <Card key={review.id} className="glass-card">
                <CardBody className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">{review.user?.name}</span>
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 italic">&ldquo;{review.comment}&rdquo;</p>
                  <span className="text-xs text-slate-600 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* HeroUI Review Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="glass-card text-slate-100">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleReviewSubmit}>
              <ModalHeader className="flex flex-col gap-1">Write a Review</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <Input
                  type="number"
                  label="Rating (1 - 5)"
                  min={1}
                  max={5}
                  value={rating.toString()}
                  onChange={(e) => setRating(Number(e.target.value))}
                  variant="bordered"
                  required
                />
                <Textarea
                  label="Comments"
                  placeholder="Share your thoughts about this product..."
                  variant="bordered"
                  value={comment}
                  onValueChange={setComment}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={submitting}>
                  Submit Review
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
