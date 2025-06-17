"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Shield, Headphones, RefreshCw, CreditCard, Gift, Star } from "lucide-react"

const services = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on orders over $50. Fast and reliable delivery to your doorstep.",
    features: ["Orders over $50", "2-3 business days", "Tracking included"],
    badge: "Popular",
  },
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "Your data is protected with industry-standard encryption and security measures.",
    features: ["SSL encryption", "Secure payments", "Privacy protection"],
    badge: "Trusted",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer support team is available around the clock to help you.",
    features: ["Live chat", "Phone support", "Email assistance"],
    badge: "Available",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy. No questions asked if you're not completely satisfied.",
    features: ["30-day returns", "Free return shipping", "Quick refunds"],
    badge: "Hassle-free",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options including buy now, pay later services.",
    features: ["Credit/Debit cards", "PayPal", "Buy now, pay later"],
    badge: "Flexible",
  },
  {
    icon: Gift,
    title: "Gift Services",
    description: "Beautiful gift wrapping and personalized messages for special occasions.",
    features: ["Gift wrapping", "Personal messages", "Gift receipts"],
    badge: "Special",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Excellent service! Fast shipping and great customer support.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Mike Chen",
    rating: 5,
    comment: "Love the easy return policy. Made my shopping experience stress-free.",
    avatar: "https://i.pravatar.cc/150?u=mike",
  },
  {
    name: "Emily Davis",
    rating: 5,
    comment: "The gift wrapping service is amazing. Perfect for special occasions!",
    avatar: "https://i.pravatar.cc/150?u=emily",
  },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 mb-12"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          We're committed to providing you with the best shopping experience possible. Here's what makes us different.
        </motion.p>
      </motion.section>

      {/* Services Grid */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{service.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-muted/50 rounded-2xl p-8 mb-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">Verified Customer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center py-16"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust us for their shopping needs.
        </p>
        <Button size="lg">Start Shopping Now</Button>
      </motion.section>
    </div>
  )
}
