import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Plus, 
  Save, 
  Download, 
  UserRound, 
  LayoutDashboard, 
  Settings as SettingsIcon,
  Clock,
  Sparkles,
  ArrowRight,
  UserX,
  ChevronRight,
  BookOpen,
  Users,
  RefreshCw,
  FileText,
  X,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [1, 2, 3, 4, 5, 6];

function App() {
  const [timetable, setTimetable] = useState({});
  const [workload, setWorkload] = useState({});
  const [config, setConfig] = useState({ subjects: [], teachers: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Edit Teacher State
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Replace Teacher State
  const [replaceData, setReplaceData] = useState({
    day: 'Monday',
    period: 1,
    absentTeacher: ''
  });
  const [replacementResult, setReplacementResult] = useState(null);

  const timetableRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateTimetable = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/generate');
      const data = await response.json();
      setTimetable(data);
      fetchWorkload();
      setActiveTab('timetable');
      showNotification("New Timetable Generated!");
    } catch (error) {
      console.error("Failed to generate:", error);
      showNotification("Failed to generate timetable", "error");
    }
    setLoading(false);
  };

  const loadTimetable = async () => {
    try {
      const response = await fetch('http://localhost:8000/load');
      const data = await response.json();
      setTimetable(data || {});
      if (data && Object.keys(data).length > 0) {
        fetchWorkload();
      }
    } catch (error) {
      console.error("Failed to load:", error);
    }
  };

  const fetchWorkload = async () => {
    try {
      const response = await fetch('http://localhost:8000/workload');
      const data = await response.json();
      setWorkload(data || {});
    } catch (error) {
      console.error("Failed to fetch workload:", error);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch('http://localhost:8000/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error("Failed to fetch config:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTimetable();
    await fetchWorkload();
    await fetchConfig();
    setRefreshing(false);
    showNotification("Data Synchronized");
  };

  const handleReplace = async () => {
    if (!replaceData.absentTeacher) {
      setReplacementResult({ status: 'error', message: 'Please enter teacher name' });
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replaceData)
      });
      const data = await response.json();
      setReplacementResult(data);
      if (data.status === 'success') {
        loadTimetable();
        showNotification("Teacher Replaced Successfully");
      }
    } catch (error) {
      console.error("Failed to replace:", error);
    }
  };

  const exportToPDF = async () => {
    if (!timetableRef.current) return;
    showNotification("Preparing PDF...", "info");
    
    try {
      const canvas = await html2canvas(timetableRef.current, {
        backgroundColor: '#0a0a0c',
        scale: 2
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Academic_Timetable.pdf');
      showNotification("PDF Exported Successfully");
    } catch (err) {
      console.error(err);
      showNotification("Failed to export PDF", "error");
    }
  };

  const updateTeacher = async (oldName, updatedData) => {
    try {
      const response = await fetch('http://localhost:8000/update_teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldName,
          newName: updatedData.name,
          subjects: updatedData.subjects
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        showNotification("Faculty Updated Successfully");
        setEditingTeacher(null);
        fetchConfig();
        loadTimetable();
      } else {
        showNotification(data.message, "error");
      }
    } catch (error) {
      console.error("Failed to update teacher:", error);
    }
  };

  useEffect(() => {
    loadTimetable();
    fetchConfig();
  }, []);

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="dashboard-grid">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Periods</span>
            <Clock size={20} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '2rem' }}>30</h2>
          <p style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>Weekly capacity</p>
        </div>
        
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <UserX size={20} color="#ef4444" />
            <span style={{ fontWeight: 600 }}>Quick Replacement</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select 
              className="btn btn-outline" 
              style={{ padding: '8px 12px' }}
              value={replaceData.day}
              onChange={(e) => setReplaceData({...replaceData, day: e.target.value})}
            >
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select 
              className="btn btn-outline" 
              style={{ padding: '8px 12px' }}
              value={replaceData.period}
              onChange={(e) => setReplaceData({...replaceData, period: parseInt(e.target.value)})}
            >
              {PERIODS.map(p => <option key={p}>Period {p}</option>)}
            </select>
            <input 
              type="text" 
              placeholder="Absent Teacher Name" 
              className="btn btn-outline"
              style={{ flex: 1, padding: '8px 12px', minWidth: '150px' }}
              value={replaceData.absentTeacher}
              onChange={(e) => setReplaceData({...replaceData, absentTeacher: e.target.value})}
            />
            <button className="btn btn-primary" onClick={handleReplace}>
              Replace
            </button>
          </div>
          {replacementResult && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              style={{ marginTop: '1rem', color: replacementResult.status === 'success' ? '#22c55e' : '#ef4444', fontSize: '0.875rem' }}
            >
              {replacementResult.message}
            </motion.p>
          )}
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <div className="logo-icon" style={{ width: 32, height: 32, background: 'var(--bg-card)' }}>
                <Clock size={16} color="var(--text-muted)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem' }}>System generated weekly schedule</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 hours ago</p>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderTimetable = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="timetable-container"
    >
      {Object.keys(timetable).length > 0 ? (
        <div className="glass-card" style={{ padding: 0 }} ref={timetableRef}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0 }}>Weekly Academic Schedule</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <table className="modern-table" style={{ marginTop: 0 }}>
            <thead>
              <tr>
                <th>Day / Period</th>
                {PERIODS.map(p => (
                  <th key={p}>Period {p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(day => (
                <tr key={day}>
                  <td>{day}</td>
                  {timetable[day]?.map((period, idx) => (
                    <td key={idx}>
                      <motion.div 
                        className="period-cell"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="subject-name">{period.subject}</span>
                        <span className="teacher-name">{period.teacher}</span>
                      </motion.div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Calendar size={64} style={{ margin: '0 auto', opacity: 0.5, marginBottom: '1.5rem' }} />
          <h3>No Schedule Found</h3>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Generate a new timetable to get started.</p>
          <button className="btn btn-primary" onClick={generateTimetable}>Generate Now</button>
        </div>
      )}
    </motion.div>
  );

  const renderFaculty = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="dashboard-grid">
        <div className="glass-card" style={{ gridColumn: 'span 3' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Teacher Workload Report</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Total Periods</th>
                  <th>Utilization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(workload).map(([name, count]) => (
                  <tr key={name}>
                    <td style={{ color: 'var(--text-main)' }}>{name}</td>
                    <td>{count}</td>
                    <td>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min((count / 10) * 100, 100)}%`, height: '100%', background: 'var(--primary)' }}></div>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        background: count > 6 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: count > 6 ? '#ef4444' : '#22c55e'
                      }}>
                        {count > 6 ? 'High Load' : 'Stable'}
                      </span>
                    </td>
                  </tr>
                ))}
                {Object.keys(workload).length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No faculty data available. Generate a timetable first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="dashboard-grid">
        <div className="glass-card">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <BookOpen size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Subjects</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {config?.subjects?.map(s => (
              <span key={s} className="nav-item" style={{ fontSize: '0.875rem', cursor: 'default' }}>{s}</span>
            ))}
            {(!config?.subjects || config.subjects.length === 0) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No subjects configured.</p>
            )}
          </div>
          <button className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>
            <Plus size={16} />
            Add Subject
          </button>
        </div>

        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Users size={20} color="var(--secondary)" />
            <h3 style={{ margin: 0 }}>Faculty Management</h3>
          </div>
          <table className="modern-table" style={{ marginTop: 0 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specializations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {config?.teachers?.map(t => (
                <tr key={t.name}>
                  <td style={{ color: 'var(--text-main)' }}>{t.name}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {t.subjects?.join(", ")}
                  </td>
                  <td>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '6px 14px', fontSize: '0.75rem', gap: '4px' }}
                      onClick={() => setEditingTeacher(t)}
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {(!config?.teachers || config.teachers.length === 0) && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No faculty data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <Sparkles size={20} color="white" />
          </div>
          <span className="logo-text">GeniTable</span>
        </div>

        <nav className="nav-links">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveTab('timetable')}
          >
            <Calendar size={20} />
            <span>Timetable</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            <UserRound size={20} />
            <span>Faculty</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="welcome-msg">
            <motion.h1 
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </motion.h1>
            <p>
              {activeTab === 'dashboard' && "Overview of your academic environment."}
              {activeTab === 'timetable' && "Full weekly schedule management."}
              {activeTab === 'teachers' && "Faculty distribution and workloads."}
              {activeTab === 'settings' && "Manage subjects, faculty, and system preferences."}
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={generateTimetable}
              disabled={loading}
            >
              <Plus size={18} />
              {loading ? 'Generating...' : 'Generate New'}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'timetable' && renderTimetable()}
          {activeTab === 'teachers' && renderFaculty()}
          {activeTab === 'settings' && renderSettings()}
        </AnimatePresence>

        <footer style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button className="btn btn-outline" onClick={exportToPDF}>
            <FileText size={18} />
            Export PDF
          </button>
        </footer>
      </main>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`notification ${notification.type}`}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              padding: '12px 24px',
              borderRadius: '12px',
              background: notification.type === 'error' ? '#ef4444' : 'var(--primary)',
              color: 'white',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              zIndex: 1000,
              fontWeight: 600
            }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Teacher Modal */}
      <AnimatePresence>
        {editingTeacher && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem'
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card" 
              style={{ width: '100%', maxWidth: '500px', position: 'relative' }}
            >
              <button 
                onClick={() => setEditingTeacher(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
              
              <h3 style={{ marginBottom: '1.5rem' }}>Edit Faculty Details</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Name</label>
                  <input 
                    type="text" 
                    className="btn btn-outline" 
                    style={{ width: '100%', textAlign: 'left', cursor: 'text' }}
                    defaultValue={editingTeacher.name}
                    id="edit-teacher-name"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Specializations (comma separated)</label>
                  <input 
                    type="text" 
                    className="btn btn-outline" 
                    style={{ width: '100%', textAlign: 'left', cursor: 'text' }}
                    defaultValue={editingTeacher.subjects.join(", ")}
                    id="edit-teacher-subjects"
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    onClick={() => {
                      const name = document.getElementById('edit-teacher-name').value;
                      const subjects = document.getElementById('edit-teacher-subjects').value.split(',').map(s => s.trim());
                      updateTeacher(editingTeacher.name, { name, subjects });
                    }}
                  >
                    Save Changes
                  </button>
                  <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditingTeacher(null)}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}} />
    </div>
  );
}

export default App;
