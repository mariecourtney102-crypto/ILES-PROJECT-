import React, { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Edit2, Trash2, Shield, Mail, Phone, Loader } from 'lucide-react';

const Users = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState({
    students: [],
    supervisors: [],
    staff: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoints
        // const studentsRes = await axios.get('/api/admin/users/students');
        // const supervisorsRes = await axios.get('/api/admin/users/supervisors');
        // const staffRes = await axios.get('/api/admin/users/staff');
        
        // Set real data from API
        // setUsers({
        //   students: studentsRes.data,
        //   supervisors: supervisorsRes.data,
        //   staff: staffRes.data
        // });
        
        // Empty arrays - ready for real data
        setUsers({
          students: [],
          supervisors: [],
          staff: []
        });
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, role) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // await axios.delete(`/api/admin/users/${role}/${userId}`);
        // Refresh users list
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const StatBadge = ({ label, count, active, onClick, isLoading }) => (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-medium transition ${
        active 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      disabled={isLoading}
    >
      {label} {!isLoading && `(${count})`}
      {isLoading && <Loader size={14} className="inline ml-2 animate-spin" />}
    </button>
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentUsers = users[activeTab];
  const filteredUsers = currentUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 mt-1">Manage students, supervisors, and staff accounts</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition">
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 border-b border-gray-200 pb-4">
        <StatBadge 
          label="Students" 
          count={users.students.length} 
          active={activeTab === 'students'} 
          onClick={() => setActiveTab('students')}
          isLoading={loading}
        />
        <StatBadge 
          label="Supervisors" 
          count={users.supervisors.length} 
          active={activeTab === 'supervisors'} 
          onClick={() => setActiveTab('supervisors')}
          isLoading={loading}
        />
        <StatBadge 
          label="Staff" 
          count={users.staff.length} 
          active={activeTab === 'staff'} 
          onClick={() => setActiveTab('staff')}
          isLoading={loading}
        />
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No users found</h3>
            <p className="text-gray-400 mt-2">
              {searchTerm ? 'Try a different search term' : `No ${activeTab} registered yet`}
            </p>
            {!searchTerm && (
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Add Your First User
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                {activeTab === 'students' && (
                  <>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  </>
                )}
                {activeTab === 'supervisors' && (
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                )}
                {activeTab === 'staff' && (
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                )}
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-medium text-gray-900">{user.name || 'Unnamed'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email || 'No email'}</td>
                  {activeTab === 'students' && (
                    <>
                      <td className="px-6 py-4 text-gray-600">{user.program || 'Not specified'}</td>
                      <td className="px-6 py-4 text-gray-600">{user.year ? `Year ${user.year}` : 'Not specified'}</td>
                    </>
                  )}
                  {activeTab === 'supervisors' && (
                    <td className="px-6 py-4 text-gray-600">{user.department || 'Not assigned'}</td>
                  )}
                  {activeTab === 'staff' && (
                    <td className="px-6 py-4 text-gray-600">{user.role || 'Staff'}</td>
                  )}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status || 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 size={16} className="text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Shield size={16} className="text-yellow-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, activeTab)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600">Total Users</p>
          <p className="text-2xl font-bold text-blue-700">
            {loading ? '...' : users.students.length + users.supervisors.length + users.staff.length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600">Active Today</p>
          <p className="text-2xl font-bold text-green-700">{loading ? '...' : '0'}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600">New This Week</p>
          <p className="text-2xl font-bold text-purple-700">{loading ? '...' : '0'}</p>
        </div>
      </div>
    </div>
  );
};

export default Users;