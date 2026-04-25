import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Filter, 
  Search,
  Download,
  Reply,
  Flag,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fresh state - ready for API integration
  useEffect(() => {
    // Replace with actual API call
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        // const response = await axios.get('/api/admin/feedback');
        // setFeedbackList(response.data);
        
        // Empty array - ready for real data
        setFeedbackList([]);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

  const stats = {
    total: feedbackList.length,
    pending: feedbackList.filter(f => f.status === 'pending').length,
    resolved: feedbackList.filter(f => f.status === 'resolved').length,
    avgRating: feedbackList.length > 0 
      ? (feedbackList.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackList.length).toFixed(1)
      : 0
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending Review' },
      reviewed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Reviewed' },
      resolved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Resolved' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Feedback & Reviews</h1>
          <p className="text-gray-500 mt-1">Manage student, supervisor, and staff feedback</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700 transition">
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <MessageSquare size={24} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock size={24} className="text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg. Rating</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgRating}</p>
            </div>
            <Star size={24} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or feedback..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {['all', 'pending', 'reviewed', 'resolved'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg capitalize transition ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbackList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No feedback yet</h3>
            <p className="text-gray-400 mt-2">Feedback from students and supervisors will appear here</p>
          </div>
        ) : (
          feedbackList.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {feedback.userName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{feedback.userName || 'User'}</p>
                      <p className="text-xs text-gray-500">{feedback.userEmail || 'user@university.edu'}</p>
                    </div>
                    <div className="ml-auto">
                      <StatusBadge status={feedback.status || 'pending'} />
                    </div>
                  </div>
                  
                  {feedback.rating && (
                    <div className="mb-3">
                      <RatingStars rating={feedback.rating} />
                    </div>
                  )}
                  
                  <p className="text-gray-700 mb-3">{feedback.message || 'No message provided'}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {feedback.createdAt || new Date().toLocaleDateString()}
                    </span>
                    <span className="capitalize">From: {feedback.userRole || 'Student'}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 hover:bg-blue-50 rounded-lg transition group">
                    <Reply size={18} className="text-gray-500 group-hover:text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-green-50 rounded-lg transition group">
                    <ThumbsUp size={18} className="text-gray-500 group-hover:text-green-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition group">
                    <Flag size={18} className="text-gray-500 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="flex gap-3">
          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
            Send Feedback Survey
          </button>
          <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
            Generate Feedback Report
          </button>
          <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200">
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;