'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface Yard {
  id: string;
  name: string;
  location: string | null;
}

const ROLES = [
  { value: 'YARD_MANAGER', label: 'Yard Manager', description: 'Full access to all features' },
  { value: 'GROOM', label: 'Groom', description: 'Can manage horses and tasks' },
  { value: 'OWNER', label: 'Owner', description: 'Can view horse records' },
  { value: 'VET', label: 'Veterinarian', description: 'Can view and update medical records' },
  { value: 'FARRIER', label: 'Farrier', description: 'Can view and update farrier records' },
];

type ActiveTab = 'grooms' | 'owners' | 'team';

export default function SettingsPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [yard, setYard] = useState<Yard | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('grooms');

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    email: '',
    name: '',
    role: 'GROOM',
  });
  const [editMember, setEditMember] = useState<Partial<TeamMember> | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, router]);

  // Fetch yard and team data
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch yard info
        const yardRes = await fetch(`/api/yards`);
        if (!yardRes.ok) throw new Error('Failed to fetch yard');
        const yardData = await yardRes.json();
        const currentYard = yardData.yards?.[0] || { id: '1', name: 'Default Yard', location: null };
        setYard(currentYard);

        // Fetch team members
        const teamRes = await fetch(`/api/yards/${currentYard.id}/team`);
        if (!teamRes.ok) throw new Error('Failed to fetch team');
        const teamData = await teamRes.json();
        setTeamMembers(teamData.members || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
        // Set mock data for demo
        setYard({ id: '1', name: 'Sunny Acres Farm', location: 'Malibu, CA' });
        setTeamMembers([
          {
            id: '1',
            email: 'manager@example.com',
            name: 'Sarah Johnson',
            role: 'YARD_MANAGER',
            createdAt: '2025-01-15',
          },
          {
            id: '2',
            email: 'groom@example.com',
            name: 'Tom Smith',
            role: 'GROOM',
            createdAt: '2025-02-01',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yard) return;

    try {
      setError('');
      setSuccess('');

      if (!newMember.email || !newMember.name) {
        setError('Please fill in all fields');
        return;
      }

      const res = await fetch(`/api/yards/${yard.id}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add team member');
      }

      const data = await res.json();
      setTeamMembers([...teamMembers, data.member]);
      setNewMember({ email: '', name: '', role: 'GROOM' });
      setShowAddForm(false);
      setSuccess('Team member added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add team member');
    }
  };

  const handleEditMember = async (memberId: string) => {
    if (!yard || !editMember) return;

    try {
      setError('');
      setSuccess('');

      const res = await fetch(`/api/yards/${yard.id}/team/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMember),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update team member');
      }

      const data = await res.json();
      setTeamMembers(teamMembers.map(m => m.id === memberId ? data.member : m));
      setEditingId(null);
      setEditMember(null);
      setSuccess('Team member updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team member');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!yard || !window.confirm('Are you sure you want to remove this team member?')) return;

    try {
      setError('');
      setSuccess('');

      const res = await fetch(`/api/yards/${yard.id}/team/${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete team member');
      }

      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
      setSuccess('Team member removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove team member');
    }
  };

  const getRoleLabel = (roleValue: string) => {
    return ROLES.find(r => r.value === roleValue)?.label || roleValue;
  };

  const getFilteredMembers = (role: string) => {
    return teamMembers.filter(m => m.role === role);
  };

  const renderMemberList = (members: TeamMember[], role: string) => {
    return (
      <>
        {/* Add Member Form */}
        {showAddForm && (
          <form onSubmit={handleAddMember} className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-4 font-semibold text-gray-900">Add New {getRoleLabel(role)}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Add {getRoleLabel(role)}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewMember({ email: '', name: '', role: 'GROOM' });
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Members List */}
        {members.length > 0 ? (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
                {editingId === member.id && editMember ? (
                  // Edit Mode
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editMember.name || ''}
                        onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                        className="w-full rounded border border-gray-300 px-3 py-1 text-sm"
                      />
                    </div>
                    <button
                      onClick={() => handleEditMember(member.id)}
                      className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditMember(null);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-gray-300 px-3 py-1 text-sm text-gray-900 hover:bg-gray-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditingId(member.id);
                          setEditMember(member);
                        }}
                        className="rounded-lg p-2 hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="rounded-lg p-2 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No {getRoleLabel(role).toLowerCase()} yet</p>
            <button
              onClick={() => {
                setNewMember({ ...newMember, role });
                setShowAddForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add First {getRoleLabel(role)}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Settings" subtitle="Manage your yard, grooms, and owners." />

        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600"></div>
          </div>
        ) : (
          <>
            {/* Yard Settings Card */}
            {yard && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Yard Information</h2>
                </div>
                <div className="px-6 py-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yard Name
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
                        <span className="text-gray-900">{yard.name}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
                        <span className="text-gray-900">{yard.location || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs for Grooms, Owners, and All Team */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100">
                <div className="flex items-center px-6">
                  <button
                    onClick={() => {
                      setActiveTab('grooms');
                      setShowAddForm(false);
                      setEditingId(null);
                      setNewMember({ email: '', name: '', role: 'GROOM' });
                    }}
                    className={`px-6 py-3 text-sm font-semibold transition-colors ${
                      activeTab === 'grooms'
                        ? 'border-b-2 border-emerald-600 text-emerald-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grooms ({getFilteredMembers('GROOM').length})
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('owners');
                      setShowAddForm(false);
                      setEditingId(null);
                      setNewMember({ email: '', name: '', role: 'OWNER' });
                    }}
                    className={`px-6 py-3 text-sm font-semibold transition-colors ${
                      activeTab === 'owners'
                        ? 'border-b-2 border-emerald-600 text-emerald-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Owners ({getFilteredMembers('OWNER').length})
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('team');
                      setShowAddForm(false);
                      setEditingId(null);
                      setNewMember({ email: '', name: '', role: 'GROOM' });
                    }}
                    className={`px-6 py-3 text-sm font-semibold transition-colors ${
                      activeTab === 'team'
                        ? 'border-b-2 border-emerald-600 text-emerald-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All Team ({teamMembers.length})
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                {activeTab === 'grooms' && (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Manage Grooms</h3>
                      {!showAddForm && (
                        <button
                          onClick={() => {
                            setNewMember({ email: '', name: '', role: 'GROOM' });
                            setShowAddForm(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4" />
                          Add Groom
                        </button>
                      )}
                    </div>
                    {renderMemberList(getFilteredMembers('GROOM'), 'GROOM')}
                  </>
                )}

                {activeTab === 'owners' && (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Manage Owners</h3>
                      {!showAddForm && (
                        <button
                          onClick={() => {
                            setNewMember({ email: '', name: '', role: 'OWNER' });
                            setShowAddForm(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4" />
                          Add Owner
                        </button>
                      )}
                    </div>
                    {renderMemberList(getFilteredMembers('OWNER'), 'OWNER')}
                  </>
                )}

                {activeTab === 'team' && (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">All Team Members</h3>
                      {!showAddForm && (
                        <button
                          onClick={() => {
                            setNewMember({ email: '', name: '', role: 'GROOM' });
                            setShowAddForm(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4" />
                          Add Member
                        </button>
                      )}
                    </div>
                    {showAddForm && (
                      <form onSubmit={handleAddMember} className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h3 className="mb-4 font-semibold text-gray-900">Add New Team Member</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name *
                            </label>
                            <input
                              type="text"
                              value={newMember.name}
                              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                              placeholder="John Doe"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={newMember.email}
                              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                              placeholder="john@example.com"
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                          </label>
                          <select
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                          >
                            {ROLES.map(role => (
                              <option key={role.value} value={role.value}>
                                {role.label} - {role.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                          >
                            <Save className="h-4 w-4" />
                            Add Member
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddForm(false);
                              setNewMember({ email: '', name: '', role: 'GROOM' });
                            }}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {teamMembers.length > 0 ? (
                      <div className="space-y-3">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
                            {editingId === member.id && editMember ? (
                              // Edit Mode
                              <div className="flex-1 flex items-center gap-4">
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={editMember.name || ''}
                                    onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                                    className="w-full rounded border border-gray-300 px-3 py-1 text-sm"
                                  />
                                </div>
                                <select
                                  value={editMember.role || ''}
                                  onChange={(e) => setEditMember({ ...editMember, role: e.target.value })}
                                  className="rounded border border-gray-300 px-3 py-1 text-sm"
                                >
                                  {ROLES.map(role => (
                                    <option key={role.value} value={role.value}>
                                      {role.label}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleEditMember(member.id)}
                                  className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700"
                                >
                                  <Save className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditMember(null);
                                  }}
                                  className="inline-flex items-center gap-1 rounded bg-gray-300 px-3 py-1 text-sm text-gray-900 hover:bg-gray-400"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              // View Mode
                              <>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{member.name}</p>
                                  <p className="text-sm text-gray-500">{member.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                                    {getRoleLabel(member.role)}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingId(member.id);
                                      setEditMember(member);
                                    }}
                                    className="rounded-lg p-2 hover:bg-gray-200 transition-colors"
                                  >
                                    <Edit2 className="h-4 w-4 text-gray-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMember(member.id)}
                                    className="rounded-lg p-2 hover:bg-red-100 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No team members yet</p>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add First Member
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
        </main>
      </div>
    </div>
  );
}
