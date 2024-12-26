import React, { useState, useEffect } from 'react';
import { Layout } from '../Layout';
import { DashboardStats } from './DashboardStats';
import { BookingsList } from './BookingsList';
import { WorkersList } from './WorkersList';
import { CustomersList } from './CustomersList';
import { ClinicHoursManager } from './ClinicHoursManager';
import { EditCustomerModal } from './EditCustomerModal';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { API_ENDPOINTS } from '../../utils/constants';
import type { Booking, User } from '../../types';

export function AdminDashboard() {
  const { auth } = useApp();
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    activeWorkers: 0
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workers, setWorkers] = useState([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  const fetchDashboardData = async () => {
    if (!auth.user?.id) return;

    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-User-Id': auth.user.id
      };

      const [statsRes, bookingsRes, workersRes, customersRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.ADMIN}/stats`, { headers }),
        fetch(`${API_ENDPOINTS.ADMIN}/bookings`, { headers }),
        fetch(`${API_ENDPOINTS.ADMIN}/workers`, { headers }),
        fetch(`${API_ENDPOINTS.ADMIN}/customers`, { headers })
      ]);

      const [statsData, bookingsData, workersData, customersData] = await Promise.all([
        statsRes.json(),
        bookingsRes.json(),
        workersRes.json(),
        customersRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (bookingsData.success) setBookings(bookingsData.data);
      if (workersData.success) setWorkers(workersData.data);
      if (customersData.success) setCustomers(customersData.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [auth.user?.id]);

  const handleEditCustomer = async (updatedCustomer: User) => {
    if (!auth.user?.id) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN}/customers/${updatedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': auth.user.id
        },
        body: JSON.stringify({
          name: updatedCustomer.name,
          email: updatedCustomer.email
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Customer updated successfully', 'success');
        setCustomers(customers.map(c => 
          c.id === updatedCustomer.id ? updatedCustomer : c
        ));
      } else {
        throw new Error(data.message || 'Failed to update customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      showToast('Failed to update customer', 'error');
      throw error;
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!auth.user?.id || !window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN}/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': auth.user.id
        }
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Customer deleted successfully', 'success');
        setCustomers(customers.filter(c => c.id !== customerId));
      } else {
        throw new Error(data.message || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast('Failed to delete customer', 'error');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    if (!auth.user?.id) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': auth.user.id
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Booking status updated successfully', 'success');
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status } : b
        ));
      } else {
        throw new Error(data.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      showToast('Failed to update booking status', 'error');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'overview'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'settings'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-8">
            <DashboardStats stats={stats} />
            <CustomersList 
              customers={customers}
              onEdit={(customer) => setEditingCustomer(customer)}
              onDelete={handleDeleteCustomer}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BookingsList 
                bookings={bookings} 
                onStatusChange={handleUpdateBookingStatus}
              />
              <WorkersList workers={workers} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <ClinicHoursManager />
          </div>
        )}

        {editingCustomer && (
          <EditCustomerModal
            customer={editingCustomer}
            onClose={() => setEditingCustomer(null)}
            onSave={handleEditCustomer}
          />
        )}
      </div>
    </Layout>
  );
}