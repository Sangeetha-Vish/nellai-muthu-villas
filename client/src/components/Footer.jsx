import Link from 'next/link';
import { MapPin, Phone, Clock } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-[#3D2B1F] text-[#FDFCF0] py-12 border-t border-[#D4AF37]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Brand */}
                    <div>
                        <h3 className="font-serif text-2xl text-[#FDFCF0] mb-4">Nellai Muthu Vilas</h3>
                        <p className="font-sans text-sm opacity-70 leading-relaxed mb-6">
                            Tradition served without hurry. Pre-order your favorite sweets and experience the authentic taste of heritage.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons could go here */}
                        </div>
                    </div>

                    {/* Quick Links / Explore */}
                    <div>
                        <h4 className="font-serif text-lg text-[#D4AF37] mb-4">Explore</h4>
                        <ul className="space-y-3 font-sans text-sm opacity-80">
                            <li><Link href="/" className="hover:text-[#D4AF37] transition-colors">Our Sweets</Link></li>
                            <li><Link href="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
                            <li><Link href="/orders" className="hover:text-[#D4AF37] transition-colors">Track Order</Link></li>
                            <li><Link href="/login" className="hover:text-[#D4AF37] transition-colors">Staff Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Info */}
                    <div>
                        <h4 className="font-serif text-lg text-[#D4AF37] mb-4">Visit Us</h4>
                        <div className="space-y-4 font-sans text-sm opacity-80">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="mb-1">123 Avinashi Road, RS Puram, Coimbatore</p>
                                    <p className="text-xs opacity-50">View all branches in selector</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4" />
                                <span>9:00 AM - 9:00 PM (All Days)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#FDFCF0]/10 text-center font-sans text-xs opacity-40">
                    <p>&copy; {new Date().getFullYear()} Nellai Muthu Vilas. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
