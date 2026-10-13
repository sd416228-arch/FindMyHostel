import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RoleSwitcher } from './components/RoleSwitcher';
import { ToastContainer } from './components/ToastContainer';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { AuthModal, AuthMode } from './components/AuthModal';
import { HomeView } from './components/HomeView';
import { HostelsListView } from './components/HostelsListView';
import { HostelDetailView } from './components/HostelDetailView';
import { StudentBookingsView } from './components/StudentBookingsView';
import { OwnerDashboardView } from './components/OwnerDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';

const MainApp: React.FC = () => {
  const { currentUser, currentTab, setCurrentTab } = useApp();
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [authModal, setAuthModal] = useState<AuthMode | null>(null);

  const handleSelectHostel = (hostelId: string) => {
    setSelectedHostelId(hostelId);
    setCurrentTab('hostel-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHostels = (filters?: { city?: string; search?: string }) => {
    if (filters?.city !== undefined) setCityFilter(filters.city);
    if (filters?.search !== undefined) setSearchFilter(filters.search);
    setCurrentTab('hostels');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans antialiased">
      {/* Persona bar for rapid testing & switching */}
      <RoleSwitcher />

      {/* Main navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={(mode) => setAuthModal(mode)}
      />

      {/* Main content body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onSelectHostel={handleSelectHostel}
            onNavigateHostels={handleNavigateHostels}
            onOpenOwnerRegister={() => setAuthModal('owner-register')}
          />
        )}

        {currentTab === 'hostels' && (
          <HostelsListView
            onSelectHostel={handleSelectHostel}
            initialCity={cityFilter}
            initialSearch={searchFilter}
          />
        )}

        {currentTab === 'hostel-detail' && selectedHostelId && (
          <HostelDetailView
            hostelId={selectedHostelId}
            onBack={() => setCurrentTab('hostels')}
            onOpenAuth={(mode) => setAuthModal(mode)}
          />
        )}

        {(currentTab === 'bookings' || currentTab === 'student-dashboard') && (
          <StudentBookingsView
            onNavigateHostels={() => setCurrentTab('hostels')}
            onSelectHostel={handleSelectHostel}
            initialTab="bookings"
          />
        )}

        {currentTab === 'reservations' && (
          <StudentBookingsView
            onNavigateHostels={() => setCurrentTab('hostels')}
            onSelectHostel={handleSelectHostel}
            initialTab="reservations"
          />
        )}

        {currentTab === 'owner-dashboard' && (
          <OwnerDashboardView onSelectHostel={handleSelectHostel} />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardView onSelectHostel={handleSelectHostel} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab, city) => {
          if (city) setCityFilter(city);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setAuthModal('student-register')}
      />

      {/* Floating Utilities */}
      <ToastContainer />
      <WhatsAppFloat />

      {/* Auth Modals */}
      <AuthModal
        mode={authModal}
        onClose={() => setAuthModal(null)}
        onSwitchMode={(mode) => setAuthModal(mode)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
