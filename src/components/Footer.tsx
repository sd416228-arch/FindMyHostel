import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, cityFilter?: string) => void;
  onOpenAuth: (mode: 'student-register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer className="bg-slate-900 text-white mt-16 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#e85d26]">
                <MapPin className="w-5 h-5" />
              </span>
              <span className="text-xl font-extrabold tracking-tight">FindMyHostel</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-4">
              Search, compare, and book verified hostels across Nepal. Your perfect student stay or backpacker haven is just a click away — with transparent pricing and zero middleman fees.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-sm"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-sm"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-sm"></i>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('hostels')} className="hover:text-white transition-colors">
                  Browse Hostels
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('student-register')} className="hover:text-white transition-colors">
                  Sign Up
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Top Cities */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Top Cities</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('hostels', 'Kathmandu')} className="hover:text-white transition-colors">
                  Kathmandu Hostels
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hostels', 'Pokhara')} className="hover:text-white transition-colors">
                  Pokhara Hostels
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hostels', 'Butwal')} className="hover:text-white transition-colors">
                  Butwal Hostels
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#e85d26]" />
                <a href="mailto:sd416228@gmail.com" className="hover:text-white transition-colors">
                  sd416228@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e85d26]" />
                <a href="tel:9843959317" className="hover:text-white transition-colors">
                  9843959317
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#e85d26]" />
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; 2026 FindMyHostel. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Community Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
