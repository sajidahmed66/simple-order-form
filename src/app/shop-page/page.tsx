'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Crown, ShoppingBag, Users, Truck, Award, Star, ChevronRight, Shirt, Briefcase, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-stone-50 to-amber-50/30 dark:from-neutral-950 dark:via-stone-950 dark:to-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                MAVERICK
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">About</a>
              <a href="#services" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Services</a>
              <a href="#collection" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Collection</a>
              <a href="#testimonials" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Contact
              </Button>
              <a href="/" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-8 px-3">
                Order Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-rose-400/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-stone-300/10 to-amber-200/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Glass Badge */}
            <div className="inline-flex">
              <div className="glass-card rounded-full px-6 py-2 flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">New</Badge>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Spring Collection 2025</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="block bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
                  Elevate Your
                </span>
                <span className="block bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent mt-2">
                  Style
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed">
                Premium men's fashion for the modern gentleman. Experience the perfect blend of
                <span className="text-amber-600 dark:text-amber-400 font-semibold"> sophistication</span> and
                <span className="text-amber-600 dark:text-amber-400 font-semibold"> comfort</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/30 text-lg px-8 py-6 rounded-2xl">
                Explore Collection
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                Wholesale Inquiry
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto">
              {[
                { value: '10K+', label: 'Happy Customers' },
                { value: '500+', label: 'Products' },
                { value: '50+', label: 'Countries' },
                { value: '15+', label: 'Years' },
              ].map((stat, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-6 space-y-2 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">Our Services</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-200 bg-clip-text text-transparent">
              Wholesale & Retail Excellence
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Whether you're shopping for yourself or stocking your store, we have the perfect solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Retail Card */}
            <Card className="glass-card rounded-3xl p-8 border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="space-y-6 p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">Retail</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Discover our curated collection of premium men's clothing. From casual wear to formal suits,
                    find the perfect pieces to express your unique style.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Exclusive Designs</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Personal Styling</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Easy Returns</span>
                  </div>
                </div>
                <a href="/" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 px-6 rounded-md">
                  Order Retail
                  <ChevronRight className="ml-2 w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            {/* Wholesale Card */}
            <Card className="glass-card rounded-3xl p-8 border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="space-y-6 p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 dark:from-neutral-700 dark:to-neutral-800 rounded-2xl flex items-center justify-center shadow-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">Wholesale</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Partner with us for bulk orders and exclusive distributor benefits. Competitive pricing
                    for retailers and businesses worldwide.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-neutral-800 dark:bg-neutral-600 rounded-full"></div>
                    <span>Volume Discounts</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-neutral-800 dark:bg-neutral-600 rounded-full"></div>
                    <span>Priority Support</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <div className="w-2 h-2 bg-neutral-800 dark:bg-neutral-600 rounded-full"></div>
                    <span>Custom Branding</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-black dark:from-neutral-700 dark:hover:to-neutral-800 text-white shadow-lg">
                  Wholesale Inquiry
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />

      {/* Categories Section */}
      <section id="collection" className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">Collection</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-200 bg-clip-text text-transparent">
              Curated Categories
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Explore our diverse range of premium men's fashion
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Briefcase,
                title: 'Formal Suits',
                items: '150+ items',
                color: 'from-neutral-800 to-neutral-900',
                lightColor: 'from-neutral-700 to-neutral-800'
              },
              {
                icon: Shirt,
                title: 'Casual Wear',
                items: '200+ items',
                color: 'from-amber-500 to-orange-600',
                lightColor: 'from-amber-400 to-orange-500'
              },
              {
                icon: Crown,
                title: 'Accessories',
                items: '100+ items',
                color: 'from-rose-500 to-pink-600',
                lightColor: 'from-rose-400 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Sportswear',
                items: '80+ items',
                color: 'from-emerald-500 to-teal-600',
                lightColor: 'from-emerald-400 to-teal-500'
              },
              {
                icon: Truck,
                title: 'Outerwear',
                items: '70+ items',
                color: 'from-violet-500 to-purple-600',
                lightColor: 'from-violet-400 to-purple-500'
              },
              {
                icon: Award,
                title: 'Limited Edition',
                items: '30+ items',
                color: 'from-orange-500 to-red-600',
                lightColor: 'from-orange-400 to-red-500'
              },
            ].map((category, idx) => (
              <Card key={idx} className="glass-card rounded-3xl overflow-hidden border-0 hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className={`relative h-48 bg-gradient-to-br ${category.color} ${category.lightColor} p-6 flex items-end`}>
                  <div className="absolute top-4 right-4 w-12 h-12 glass rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-1">{category.title}</h3>
                    <p className="text-white/80 text-sm">{category.items}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Starting from $49</span>
                    <ChevronRight className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">Testimonials</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-200 bg-clip-text text-transparent">
              What Our Clients Say
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Join thousands of satisfied customers worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'James Wilson',
                role: 'Retail Business Owner',
                content: 'Exceptional quality and service. Our wholesale partnership has been incredibly profitable. The attention to detail in every piece is remarkable.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Fashion Blogger',
                content: 'MAVERICK has completely transformed my wardrobe. The fit is perfect, the materials are premium, and the style is unmatched.',
                rating: 5
              },
              {
                name: 'David Miller',
                role: 'Corporate Executive',
                content: 'Professional, elegant, and comfortable. Their formal collection has elevated my professional presence. Highly recommend!',
                rating: 5
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="glass-card rounded-3xl p-8 border-0 hover:scale-105 transition-transform duration-300">
                <CardContent className="space-y-4 p-0">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="font-semibold text-neutral-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-amber-600 dark:text-amber-400">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-card rounded-3xl overflow-hidden border-0">
            <CardContent className="p-8 sm:p-12 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-200 bg-clip-text text-transparent">
                    Ready to Elevate Your Style?
                  </h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Join our community of style-conscious individuals and discover the perfect pieces for every occasion.
                    Whether for retail or wholesale, we have the solution for you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="/" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/30 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 px-6 rounded-md text-lg">
                      Start Ordering
                    </a>
                    <Button size="lg" variant="outline" className="border-2 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      Contact Sales
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="glass-strong rounded-3xl p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">24/7</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Support</div>
                      </div>
                      <div className="glass-card rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">Free</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Shipping $100+</div>
                      </div>
                      <div className="glass-card rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">30</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Day Returns</div>
                      </div>
                      <div className="glass-card rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">100%</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Authentic</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="glass-dark border-t border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">MAVERICK</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Premium men's fashion for the modern gentleman. Elevate your style with our curated collection.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900 dark:text-white">Quick Links</h4>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">New Arrivals</a></li>
                  <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Best Sellers</a></li>
                  <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Sale</a></li>
                  <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Lookbook</a></li>
                </ul>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900 dark:text-white">Services</h4>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Wholesale</a></li>
                  <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Custom Orders</a></li>
                  <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Personal Styling</a></li>
                  <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Gift Cards</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900 dark:text-white">Contact</h4>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>support@maverick.com</li>
                  <li>+1 (555) 123-4567</li>
                  <li>123 Fashion Avenue</li>
                  <li>New York, NY 10001</li>
                </ul>
              </div>
            </div>

            <Separator className="my-8 bg-neutral-200 dark:bg-neutral-800" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                © 2025 MAVERICK. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-neutral-600 dark:text-neutral-400">
                <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
