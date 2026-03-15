'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Header } from '@/components/Header';
import { AlertCircle, CheckCircle } from 'lucide-react';

declare global {
  interface Window {
    debugProfile: () => void;
  }
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  contactNumber?: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    permissionLevel: 'ADMINISTRATOR',
  });

  // Add a global debug function
  useEffect(() => {
    window.debugProfile = () => {
      console.log('=== PROFILE DEBUG INFO ===');
      console.log('Current formData:', formData);
      console.log('Current user object:', user);
      const stored = localStorage.getItem('yard_sync_user');
      console.log('LocalStorage yard_sync_user:', stored ? JSON.parse(stored) : 'NOT FOUND');
      console.log('========================');
    };
  }, [formData, user]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          // Auto-select current user on load
          if (user && data.users.length > 0) {
            const currentUserData = data.users.find((u: UserItem) => u.id === user.id);
            if (currentUserData) {
              setSelectedUser(currentUserData);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUsers();
    }
  }, [isLoggedIn, user]);

  // Load selected user's data into form
  useEffect(() => {
    if (selectedUser) {
      const nameParts = selectedUser.name.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: selectedUser.email || '',
        contactNumber: selectedUser.contactNumber || '',
        permissionLevel: selectedUser.role || 'ADMINISTRATOR',
      });
    }
  }, [selectedUser]);

  const handleUserClick = (userItem: UserItem) => {
    setSelectedUser(userItem);
    setMessage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setMessage({
        type: 'error',
        text: 'Please select a user to update',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      contactNumber: formData.contactNumber,
      permissionLevel: formData.permissionLevel,
      userId: selectedUser.id,
    };

    console.log('📤 Submitting user update:', submitData);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      console.log('📥 Response status:', response.status, response.statusText);

      const responseData = await response.json();
      console.log('📥 Response data:', responseData);

      if (!response.ok) {
        const errorMsg = responseData.details || responseData.error || 'Failed to update profile';
        console.error('❌ Update failed:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('✅ User updated successfully!');
      
      // Update the selected user in the list
      if (responseData.user) {
        const updatedUsers = users.map(u => 
          u.id === selectedUser.id 
            ? { ...u, name: responseData.user.name, role: responseData.user.role, contactNumber: responseData.user.contactNumber }
            : u
        );
        setUsers(updatedUsers);
        
        // Update selected user
        setSelectedUser({
          ...selectedUser,
          name: responseData.user.name,
          role: responseData.user.role,
          contactNumber: responseData.user.contactNumber,
        });
        
        // Update current user in auth context if this is the logged-in user
        if (selectedUser.id === user?.id) {
          updateUser({
            name: responseData.user.name,
            contactNumber: responseData.user.contactNumber,
            role: responseData.user.role,
          });
        }
      }
      
      setMessage({
        type: 'success',
        text: 'User updated successfully! Changes are saved.',
      });

      console.log('✋ Update complete!');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update profile';
      console.error('❌ Error:', errorMsg);
      setMessage({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="User Profile" subtitle="Manage your account settings" />

        <main className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Users List Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Users</h3>
                {usersLoading ? (
                  <p className="text-sm text-gray-500">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-sm text-gray-500">No users found</p>
                ) : (
                  <ul className="space-y-3">
                    {users.map((userItem) => (
                      <li
                        key={userItem.id}
                        onClick={() => handleUserClick(userItem)}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                          selectedUser?.id === userItem.id
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <p className="font-medium text-sm text-gray-900">{userItem.name}</p>
                        <p className="text-xs text-gray-500">{userItem.email}</p>
                        <p className="text-xs text-gray-600 mt-1">{userItem.role}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-3">
              <div className="rounded-lg bg-white p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Update {selectedUser ? `${selectedUser.name}` : 'User'}
                </h2>

                {message && (
                  <div
                    className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${
                      message.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle
                        size={20}
                        className="text-emerald-600 flex-shrink-0"
                      />
                    ) : (
                      <AlertCircle
                        size={20}
                        className="text-red-600 flex-shrink-0"
                      />
                    )}
                    <p
                      className={`text-sm font-medium ${
                        message.type === 'success'
                          ? 'text-emerald-800'
                          : 'text-red-800'
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Email address cannot be changed
                    </p>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label
                      htmlFor="contactNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                    />
                  </div>

                  {/* Permission Level */}
                  <div>
                    <label
                      htmlFor="permissionLevel"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Permission Level
                    </label>
                    <select
                      id="permissionLevel"
                      name="permissionLevel"
                      value={formData.permissionLevel}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                    >
                      <option value="ADMINISTRATOR">Administrator</option>
                      <option value="MANAGER">Manager</option>
                      <option value="GROOM">Groom</option>
                      <option value="VET">Vet</option>
                      <option value="FARRIER">Farrier</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
