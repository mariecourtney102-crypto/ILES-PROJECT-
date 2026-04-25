import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Briefcase,
  Award,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Printer,
  Mail
} from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportFormat, setReportFormat] = useState('pdf');

  // Report templates ready for actual data
  const reportTemplates = [
    {
      id: 'student_enrollment',
      title: 'Student Enrollment Report',
      description: 'Track enrollment trends, demographics, and program distribution',
      icon: Users,
      color: 'blue',
      metrics: ['Total Students', 'New Enrollments', 'Graduation Rate', 'Retention Rate']
    },
    {
      id: 'placement_report',
      title: 'Placement & Internship Report',
      description: 'Job placements, internship success rates, and company partnerships',
      icon: Briefcase,
      color: 'green',
      metrics: ['Placement Rate', 'Avg Salary', 'Top Companies', 'Internship Conversion']
    },
    {
      id: 'academic_performance',
      title: 'Academic Performance Report',
      description: 'Student grades, course completion, and academic standing',
      icon: Award,
      color: 'purple',
      metrics: ['GPA Distribution', 'Pass Rate', 'Course Completion', 'Honors Students']
    },
    {
      id: 'feedback_analytics',
      title: 'Feedback Analytics Report',
      description: 'Student satisfaction, sentiment analysis, and improvement areas',
      icon: TrendingUp,
      color: 'orange',
      metrics: ['Satisfaction Score', 'Response Rate', 'Common Themes', 'Recommendation Rate']
    }
  ];

  const generateReport = async () => {
    // Here you would make an API call to generate the actual report
    console.log('Generating report:', {
      type: selectedReport,
      dateRange,
      format: reportFormat
    });
    
    // Example API call (uncomment when backend is ready)
    // const response = await axios.post('/api/admin/generate-report', {
    //   reportType: selectedReport,
    //   startDate: dateRange.start,
    //   endDate: dateRange.end,
    //   format: reportFormat
    // });
    // window.open(response.data.url);
  };

  const scheduledReports = [
    { name: 'Weekly Progress Report', frequency: 'Every Monday', recipients: 'admin@university.edu', status: 'Active' },
    { name: 'Monthly Analytics', frequency: '1st of month', recipients: 'deans@university.edu', status: 'Active' },
    { name: 'Quarterly Placement', frequency: 'Quarterly', recipients: 'career@university.edu', status: 'Inactive' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Generate and manage institutional reports</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center space-x-2 hover:bg-gray-700">
            <Printer size={18} />
            <span>Print</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Download size={18} />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.id}
              onClick={() => setSelectedReport(template.id)}
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedReport === template.id ? 'ring-2 ring-blue-500 transform scale-[1.02]' : ''
              }`}
            >
              <div className={`p-3 rounded-lg bg-${template.color}-100 w-fit mb-3`}>
                <Icon size={24} className={`text-${template.color}-600`} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{template.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-1">
                {template.metrics.slice(0, 2).map((metric, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Generation Panel */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Generate Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex space-x-3">
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <span className="self-center text-gray-500">to</span>
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
            <div className="flex gap-3">
              {['pdf', 'excel', 'csv'].map((format) => (
                <label key={format} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={format}
                    checked={reportFormat === format}
                    onChange={(e) => setReportFormat(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 uppercase">{format}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={generateReport}
            disabled={!selectedReport}
            className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
              selectedReport
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition`}
          >
            <FileText size={18} />
            <span>Generate {selectedReport ? 'Report' : '(Select Report First)'}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Reports Generated (This Month)</p>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs opacity-75 mt-2">Ready for data</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Data Points Tracked</p>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs opacity-75 mt-2">Across all metrics</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Active Reports</p>
          <p className="text-2xl font-bold">{reportTemplates.length}</p>
          <p className="text-xs opacity-75 mt-2">Templates available</p>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Scheduled Reports</h3>
          <button className="text-blue-600 text-sm hover:underline">+ Schedule New</button>
        </div>
        <div className="divide-y divide-gray-200">
          {scheduledReports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No scheduled reports yet
            </div>
          ) : (
            scheduledReports.map((report, idx) => (
              <div key={idx} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{report.name}</p>
                  <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                    <span>🕒 {report.frequency}</span>
                    <span>📧 {report.recipients}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {report.status}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;