import React from 'react';
import { Building2, CalendarDays, Users, UserCheck, Briefcase } from 'lucide-react';

const InternshipDetails = () => {
  // Details are now blank, ready for your real data or backend integration
  const details = [
    {
      label: "Place of Internship",
      value: "", 
      icon: <Building2 size={20} className="text-emerald-600" />,
      description: "The host organization for your placement."
    },
    {
      label: "Duration",
      value: "", 
      icon: <CalendarDays size={20} className="text-emerald-600" />,
      description: "Total period of the internship program."
    },
    {
      label: "Department",
      value: "", 
      icon: <Users size={20} className="text-emerald-600" />,
      description: "The specific team you were assigned to."
    },
    {
      label: "Supervisor",
      value: "", 
      icon: <UserCheck size={20} className="text-emerald-600" />,
      description: "The officer overseeing your daily tasks."
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#065f46', fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <Briefcase size={28} />
          Internship Details
        </h2>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Overview of your current industrial training placement.</p>
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#0D9488', color: 'white' }}>
              <th style={{ padding: '1.2rem 1.5rem', fontWeight: '600', width: '50%' }}>Information Category</th>
              <th style={{ padding: '1.2rem 1.5rem', fontWeight: '600', width: '50%' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <tr key={index} style={{ 
                borderBottom: '1px solid #f3f4f6',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0fdfa'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      backgroundColor: '#ecfdf5', 
                      padding: '8px', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#374151' }}>{item.label}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{item.description}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.2rem 1.5rem', color: '#065f46', fontWeight: '500' }}>
                  {item.value || <span style={{ color: '#d1d5db', fontStyle: 'italic', fontWeight: '400' }}>Not specified</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        background: 'linear-gradient(135deg, #0D9488 0%, #065f46 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Placement Status: Active</h3>
          <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Keep your logs updated weekly for supervisor review.</p>
        </div>
        <div style={{ opacity: 0.2 }}>
           <Briefcase size={60} />
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
