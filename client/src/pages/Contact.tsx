import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-gray-600">
              Have questions about a scheme or need technical support? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Office Address</p>
                      <p className="text-gray-600">Mantralaya, Mumbai, Maharashtra - 400032</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Helpline</p>
                      <p className="text-gray-600">1800-123-4567 (Toll Free)</p>
                      <p className="text-gray-600">022-22024243</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">support@saralyojana.maharashtra.gov.in</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <h3 className="text-lg font-bold text-primary mb-2">Note</h3>
                <p className="text-sm text-gray-700">
                  We are an information portal. For specific scheme application status, please contact the respective department directly through their official website.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-6">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <Input placeholder="How can we help?" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <Textarea placeholder="Type your message here..." className="h-32" />
                </div>

                <Button className="w-full bg-primary hover:bg-blue-700">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
