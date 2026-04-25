import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  UserCheck,
  Clock,
  Award,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSupervisors: 0,
    activeOpportunities: 0,
    pendingFeedback: 0,
    placementRate: 0,
    satisfactionRate: 0,
    totalApplications: 0,
    monthlyGrowth: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoints
        // const statsResponse = await axios.get('/api/admin/dashboard/stats');
        // const activitiesResponse = await axios.get('/api/admin/dashboard/activities');
        
        // Set real data from API
        // setStats(statsResponse.data);
        // setRecentActivities(activitiesResponse.data);
        
        // For now, keeping empty arrays/zeros - ready for real data
        setStats({
          totalStudents: 0,
          totalSupervisors: 0,
          activeOpportunities: 0,
          pendingFeedback: 0,
          placementRate: 0,
          satisfactionRate: 0,
          totalApplications: 0,
          monthlyGrowth: 0
        });
        setRecentActivities([]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, trend, color, isLoading }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
          )}
          {trend !== undefined && !isLoading && (
            <div className={`flex items-center mt-2 text-xs ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {trend > 0 ? <ArrowUp size={12} /> : trend < 0 ? <ArrowDown size={12} /> : null}
              {trend !== 0 && <span className="ml-1">{Math.abs(trend)}% from last month</span>}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
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

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Administrative Overview</h1>
        <p className="text-blue-100">Monitor and manage all university activities from this central dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<Users size={24} className="text-blue-600" />}
          color="bg-blue-100"
          trend={stats.monthlyGrowth}
          isLoading={loading}
        />
        <StatCard 
          title="Supervisors" 
          value={stats.totalSupervisors} 
          icon={<UserCheck size={24} className="text-green-600" />}
          color="bg-green-100"
          isLoading={loading}
        />
        <StatCard 
          title="Active Opportunities" 
          value={stats.activeOpportunities} 
          icon={<Briefcase size={24} className="text-purple-600" />}
          color="bg-purple-100"
          isLoading={loading}
        />
        <StatCard 
          title="Pending Feedback" 
          value={stats.pendingFeedback} 
          icon={<MessageSquare size={24} className="text-yellow-600" />}
          color="bg-yellow-100"
          isLoading={loading}
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition flex items-center justify-between">
              <span className="flex items-center">
                <Activity size={18} className="mr-2 text-gray-500" />
                Generate Semester Report
              </span>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition flex items-center justify-between">
              <span className="flex items-center">
                <Users size={18} className="mr-2 text-gray-500" />
                Bulk User Registration
              </span>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition flex items-center justify-between">
              <span className="flex items-center">
                <Briefcase size={18} className="mr-2 text-gray-500" />
                Announce New Opportunity
              </span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-2 h-2 mt-2 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity size={40} className="mx-auto mb-3 text-gray-300" />
              <p>No recent activities</p>
              <p className="text-sm mt-1">Activities will appear here when users interact with the system</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-300 h-2 rounded-full w-0 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Placement Rate</span>
                <span className="text-sm font-semibold text-blue-600">{stats.placementRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.placementRate}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Student Satisfaction</span>
                <span className="text-sm font-semibold text-green-600">{stats.satisfactionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.satisfactionRate}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="text-sm font-semibold text-purple-600">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;