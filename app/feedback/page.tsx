'use client';

import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: 'general',
    message: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create email body
    const subject = encodeURIComponent(`LA Barber Guide Feedback - ${formData.type}`);
    const body = encodeURIComponent(`
Feedback Type: ${formData.type}
User Email: ${formData.email || 'Not provided'}

Message:
${formData.message}

---
Sent from LA Barber Guide Feedback Form
    `);
    
    // Redirect to mailto
    window.location.href = `mailto:support@pagestash.app?subject=${subject}&body=${body}`;
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white">
        {/* Header */}
        <nav className="border-b-2 border-black">
          <div className="container-brutal py-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </Link>
          </div>
        </nav>

        {/* Success State */}
        <div className="container-brutal py-20">
          <div className="max-w-md mx-auto text-center">
            <CheckCircle2 className="w-16 h-16 text-la-orange mx-auto mb-6" />
            <h1 className="text-brutal-hero mb-4">FEEDBACK SENT</h1>
            <p className="text-lg mb-8 text-gray-700">
              Your email client should have opened. Thanks for keeping us real.
            </p>
            <Link href="/">
              <Button variant="primary">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b-2 border-black">
        <div className="container-brutal py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm uppercase tracking-wider font-bold hover:text-la-orange transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </nav>

      {/* Feedback Form */}
      <div className="container-brutal py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-brutal-hero mb-4">
              TELL US WHAT'S UP
            </h1>
            <p className="text-lg text-gray-700">
              Found something wrong? Got a complaint? We're here for it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                What's This About?
              </label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-4 border-2 border-black bg-white text-lg font-bold focus:outline-none focus:border-la-orange transition-colors"
                required
              >
                <option value="general">General Feedback</option>
                <option value="complaint">Complaint</option>
                <option value="barber-issue">Barber Data Issue</option>
                <option value="website-bug">Website Problem</option>
                <option value="business-inquiry">Business Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                Say Your Piece
              </label>
              <textarea 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Be real. Be honest. We can handle it."
                className="w-full p-4 border-2 border-black bg-white text-lg h-32 resize-none focus:outline-none focus:border-la-orange transition-colors"
                required
              />
            </div>

            {/* Optional Email */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                Email (Optional - for follow up)
              </label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                className="w-full p-4 border-2 border-black bg-white text-lg focus:outline-none focus:border-la-orange transition-colors"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button 
                type="submit"
                variant="primary" 
                className="w-full flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Feedback
              </Button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-gray-50 border-2 border-black">
            <p className="text-sm text-gray-600">
              <strong>Real Talk:</strong> This goes straight to our team. We read everything. 
              If you're reporting incorrect barber info, we'll fix it ASAP.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white py-8">
        <div className="container-brutal">
          <div className="text-center">
            <Logo size="sm" className="mx-auto mb-4" />
            <p className="text-sm text-gray-600">
              © 2025 LA Barber Guide. We keep it real.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
