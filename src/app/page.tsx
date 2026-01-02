'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Crown, Phone, MapPin, Package, Truck, CheckCircle, AlertTriangle, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const formSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে'),
  mobile: z.string().min(11, 'সঠিক মোবাইল নাম্বার দিন').max(11, 'সঠিক মোবাইল নাম্বার দিন'),
  address: z.string().min(10, 'ঠিকানা কমপক্ষে ১০ অক্ষর হতে হবে'),
  product: z.array(z.string()).min(1, 'অন্তত একটি পণ্য নির্বাচন করুন'),
  size: z.array(z.string()).min(1, 'অন্তত একটি সাইজ নির্বাচন করুন'),
  quantity: z.string().min(1, 'পরিমাণ দিন'),
})

type FormData = z.infer<typeof formSchema>

export default function OrderNowPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      mobile: '',
      address: '',
      product: [],
      size: [],
      quantity: '1',
    },
  })

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('orderForm')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        form.reset(parsedData)
      } catch (e) {
        console.error('Error parsing localStorage data:', e)
      }
    }
  }, [form])

  // Save form data to localStorage whenever values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      const formData = {
        name: value.name,
        mobile: value.mobile,
        address: value.address,
        product: value.product,
        size: value.size,
        quantity: value.quantity,
      }
      localStorage.setItem('orderForm', JSON.stringify(formData))
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit order')
      }

      setSubmitSuccess(true)
      // Clear form and localStorage on success
      form.reset()
      localStorage.removeItem('orderForm')
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('অর্ডার জমা দিতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা হেল্পলাইনে কল করুন।')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-stone-50 to-amber-50/30 dark:from-neutral-950 dark:via-stone-950 dark:to-zinc-950">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between">
              <Link href="/shop-page" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                  Fashion House
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center px-4 py-20 pt-24 sm:pt-32">
          <Card className="glass-card rounded-3xl p-6 sm:p-12 max-w-md w-full border-0">
            <CardContent className="text-center space-y-6 p-0">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  ধন্যবাদ!
                </h2>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  আপনার অর্ডার আমরা পেয়েছি।
                </p>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  ২৪ ঘন্টার মধ্যে আমাদের পক্ষ থেকে আপনার অর্ডার নিশ্চিত করা হবে।
                </p>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  কল রিসিভ না করলে অর্ডার বাতিল করে দেওয়া হবে।
                </p>
              </div>
              <div className="glass-strong rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                  <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm">ক্যাশ অন ডেলিভারি সুবিধা আছে</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                  <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm">হেল্পলাইন: 01406037913</span>
                </div>
              </div>
              <Link href="/shop-page" className="block">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20">
                  হোম পেজে ফিরে যান
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-stone-50 to-amber-50/30 dark:from-neutral-950 dark:via-stone-950 dark:to-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between">
            <Link href="/shop-page" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                Fashion House
              </span>
            </Link>
            <div>

            </div>
          </div>
        </div>
      </nav>

      {/* Order Form Section */}
      <section className="relative flex-1 px-4 sm:px-6 py-20 pt-24 sm:pt-32">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-rose-400/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent leading-relaxed">
              আসসালামু আলাইকুম ভাই/আপু,
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-red-50 dark:bg-red-950/30 px-4 sm:px-6 py-3 rounded-2xl border border-red-200 dark:border-red-800/50 max-w-2xl mx-auto">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />
              <div className="text-left flex-1">
                <p className="text-sm sm:text-base font-semibold text-red-700 dark:text-red-400 leading-relaxed">অগ্রিম এক টাকাও দিতে হবে না।</p>
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-500 mt-1 leading-relaxed">⚠ অনুগ্রহ করে পুরোপুর ভালো করে পড়ে, সব তথ্য আলোচনায় শান্তি করুন।</p>
              </div>
            </div>
          </div>

          {/* Order Info Card */}
          <Card className="glass-card rounded-3xl p-0 mb-8 border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Info Sections */}
              <div className="p-5 sm:p-8 space-y-4 sm:space-y-6">
                {/* Price Card */}
                <div className="glass-strong rounded-2xl p-4 sm:p-6 active:scale-[0.98] sm:hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 flex-shrink-0">
                      <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">মূল্য মূল্য</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-tight">Hoodie <span className="text-amber-600 dark:text-amber-400">550৳</span></h3>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="glass-card rounded-2xl p-4 sm:p-6 border-2 border-amber-500/20 hover:border-amber-500/40 transition-colors duration-300">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                      <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      <p className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-relaxed">📦 ডেলিভারি চার্জ</p>
                      <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">
                          <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">ঢাকার ভিতরে</span>
                          <span className="ml-auto text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">70৳</span>
                        </div>
                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">ঢাকার বাইরে</span>
                          <span className="ml-auto text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">120৳</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-green-500/10 dark:from-amber-500/20 dark:to-green-500/20 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-amber-500/30">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 leading-relaxed">২ বা তার বেশি অর্ডার দিলে ডেলিভারি ফ্রি</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {/* Helpline */}
                  <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6 active:scale-[0.98] sm:hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-3">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg sm:shadow-xl shadow-emerald-500/20">
                        <Phone className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-sm text-neutral-600 dark:text-neutral-400 leading-tight sm:leading-relaxed">📞 হেল্পলাইন</p>
                        <p className="text-xs sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1 leading-tight">01406037913</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-6 active:scale-[0.98] sm:hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-3">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg sm:shadow-xl shadow-violet-500/20">
                        <MapPin className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-sm text-neutral-600 dark:text-neutral-400 leading-tight sm:leading-relaxed">সারা বাংলাদেশে</p>
                        <p className="text-[11px] sm:text-base font-semibold text-violet-700 dark:text-violet-400 mt-0.5 sm:mt-1 leading-tight sm:leading-relaxed">ক্যাশ অন ডেলিভারি</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning Section */}
                <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6 border-2 border-red-500/30 hover:border-red-500/50 transition-colors duration-300">
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-1.5 sm:space-y-2">
                      <p className="text-xs sm:text-base font-bold text-neutral-900 dark:text-white leading-tight sm:leading-relaxed">📋 অর্ডার করার জন্য Form পূরণ করুন</p>
                      <div className="flex items-start gap-1.5 sm:gap-2 bg-red-50 dark:bg-red-950/30 px-2.5 sm:px-4 py-1.5 sm:py-3 rounded-lg sm:rounded-xl border border-red-200/50 dark:border-red-800/30">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full flex-shrink-0 mt-1 sm:mt-2"></div>
                        <p className="text-[10px] sm:text-base font-semibold text-red-700 dark:text-red-400 leading-tight sm:leading-relaxed">⚠ অর্ডার দিতে হলে শুধু Submit বাটনে ক্লিক করুন</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card className="glass-card rounded-3xl p-8 border-0">
            <CardContent className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">ব্যক্তিগত তথ্য</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">১. আপনার নাম:</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="আপনার পুরো নাম লিখুন"
                              className="glass-card border-0 h-12 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">২. সচল মোবাইল নাম্বার:</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="01XXXXXXXXX"
                              className="glass-card border-0 h-12 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-neutral-800 to-neutral-900 dark:from-neutral-700 dark:to-neutral-800 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">ঠিকানা</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">ঠিকানা, থানা, জেলা:</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                              className="glass-card border-0 h-12 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Product Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">পণ্য নির্বাচন</h3>
                    </div>

                    {/* Product Images */}
                    <FormField
                      control={form.control}
                      name="product"
                      render={({ field }) => {
                        const toggleProduct = (productValue: string) => {
                          const currentProducts = field.value || []
                          if (currentProducts.includes(productValue)) {
                            field.onChange(currentProducts.filter(p => p !== productValue))
                          } else {
                            field.onChange([...currentProducts, productValue])
                          }
                        }

                        return (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-base font-semibold">পণ্য নির্বাচন করুন (একাধিক)</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                {[
                                  { value: 'product1', label: 'পণ্য ১', image: '/product-1.jpg' },
                                  { value: 'product2', label: 'পণ্য ২', image: '/product-2.jpg' },
                                  { value: 'product3', label: 'পণ্য ৩', image: '/product-3.jpg' },
                                  { value: 'product4', label: 'পণ্য ৪', image: '/product-4.jpg' },
                                  { value: 'product5', label: 'পণ্য ৫', image: '/product-5.jpg' },
                                  { value: 'product6', label: 'পণ্য ৬', image: '/product-6.jpg' },
                                  { value: 'product7', label: 'পণ্য ৭', image: '/product-7.jpg' },
                                  { value: 'product8', label: 'পণ্য ৮', image: '/product-8.jpg' },
                                  { value: 'product9', label: 'পণ্য ৯', image: '/product-9.jpg' },
                                  { value: 'product10', label: 'পণ্য ১০', image: '/product-10.jpg' },
                                ].map((product) => {
                                  const isSelected = field.value?.includes(product.value)
                                  return (
                                    <div
                                      key={product.value}
                                      onClick={() => toggleProduct(product.value)}
                                      className={`
                                        relative flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer
                                        active:scale-95 sm:hover:scale-105 transition-all duration-200 border-2
                                        ${isSelected
                                          ? 'bg-amber-500 border-amber-600 shadow-xl shadow-amber-500/30'
                                          : 'glass-card border-neutral-300 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-500'
                                        }
                                      `}
                                    >
                                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden">
                                        <Image
                                          src={product.image}
                                          alt={product.label}
                                          width={200}
                                          height={200}
                                          className="object-cover w-full h-full"
                                          priority
                                        />
                                        <div className={`absolute inset-0 ${isSelected ? 'bg-amber-500/20' : 'bg-black/10'}`}></div>
                                      </div>
                                      <span className={`text-base font-medium ${isSelected ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                        {product.label}
                                      </span>
                                      {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                          <Check className="w-4 h-4 text-amber-600" strokeWidth={3} />
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => {
                        const toggleSize = (sizeValue: string) => {
                          const currentSizes = field.value || []
                          if (currentSizes.includes(sizeValue)) {
                            field.onChange(currentSizes.filter(s => s !== sizeValue))
                          } else {
                            field.onChange([...currentSizes, sizeValue])
                          }
                        }

                        return (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-base font-semibold">৩. সাইজ (একাধিক নির্বাচন করুন):</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-3 gap-4">
                                {['M', 'L', 'XL'].map((size) => {
                                  const isSelected = (field.value || []).includes(size)
                                  return (
                                    <div
                                      key={size}
                                      onClick={() => toggleSize(size)}
                                      className={`
                                        relative flex items-center justify-center p-6 rounded-xl cursor-pointer
                                        active:scale-95 sm:hover:scale-105 transition-all duration-200 border-2
                                        ${isSelected
                                          ? 'bg-amber-500 border-amber-600 shadow-xl shadow-amber-500/30'
                                          : 'glass-card border-neutral-300 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-500'
                                        }
                                        text-lg font-semibold
                                      `}
                                    >
                                      {size}
                                      {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                          <Check className="w-4 h-4 text-amber-600" strokeWidth={3} />
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">৪. পরিমাণ:</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="১"
                              className="glass-card border-0 h-12 text-base text-lg font-semibold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/30 text-lg py-6 rounded-2xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        অর্ডার প্রসেস করা হচ্ছে...
                      </span>
                    ) : (
                      'Submit অর্ডার'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
