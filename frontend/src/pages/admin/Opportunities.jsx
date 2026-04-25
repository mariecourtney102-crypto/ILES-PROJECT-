import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, DollarSign, Clock, Briefcase, Users, Loader } from 'lucide-react';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch opportunities from API
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoint
        // const response = await axios.get('/api/admin/opportunities');
        // setOpportunities(response.data);
        
        // Empty array - ready for real data
        setOpportunities([]);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        // await axios.delete(`/api/admin/opportunities/${id}`);
        // Update local state
        setOpportunities(opportunities.filter(opp => opp.id !== id));
        alert('Opportunity deleted successfully');
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        alert('Failed to delete opportunity');
      }
    }
  };

  const stats = {
    total: opportunities.length,
    active: opportunities.filter(o => o.status === 'Active').length,
    applicants: opportunities.reduce((sum, o) => sum + (o.applicants || 0), 0)
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || opp.status?.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Opportunities</h1>
          <p className="text-gray-500 mt-1">Manage internships, jobs, and fellowships</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition">
          <Plus size={18} />
          <span>Post New Opportunity</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Opportunities</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Briefcase size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Listings</p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? '...' : stats.active}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Clock size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Applicants</p>
              <p className="text-2xl font-bold text-purple-600">
                {loading ? '...' : stats.applicants}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or company..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="closing soon">Closing Soon</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading opportunities...</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No opportunities found</h3>
            <p className="text-gray-400 mt-2">
              {searchTerm ? 'Try a different search term' : 'No opportunities posted yet'}
            </p>
            {!searchTerm && (
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Post Your First Opportunity
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Company</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Location</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Deadline</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Applicants</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOpportunities.map(opp => (
                <tr key={opp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{opp.title || 'Untitled'}</td>
                  <td className="px-6 py-4 text-gray-600">{opp.company || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {opp.type || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{opp.location || 'Not specified'}</td>
                  <td className="px-6 py-4 text-gray-600">{opp.deadline || 'TBD'}</td>
                  <td className="px-6 py-4 text-gray-600">{opp.applicants || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      opp.status === 'Active' ? 'bg-green-100 text-green-700' : 
                      opp.status === 'Closing Soon' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {opp.status || 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit size={16} className="text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(opp.id)}
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
    </div>
  );
};

export default Opportunities;