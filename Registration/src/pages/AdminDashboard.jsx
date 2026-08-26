import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import pixelSpace from '../assets/pixel_space.jpg';

const ADMIN_EMAILS = [
  'sam8920341517@gmail.com',
  // Add other admin emails here
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setNeedsLogin(true);
        setLoading(false);
        return;
      }

      if (!ADMIN_EMAILS.includes(session.user.email)) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      
      setSession(session);
      
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTeams(data || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', color: 'white', fontFamily: 'var(--font-pixel)' }}>
        <h2>LOADING ADMIN...</h2>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', color: 'white', fontFamily: 'var(--font-pixel)', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--neon-green)', marginBottom: '2rem', fontSize: 'clamp(1.5rem, 8vw, 2.5rem)' }}>ADMIN LOGIN REQUIRED</h2>
        <button 
          className="pixel-btn" 
          onClick={() => supabase.auth.signInWithOAuth({ 
            provider: 'google',
            options: { redirectTo: window.location.origin + '/admin' }
          })}
        >
          LOGIN WITH GOOGLE
        </button>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', color: 'white', fontFamily: 'var(--font-pixel)', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'red', marginBottom: '2rem', fontSize: 'clamp(1.5rem, 8vw, 3rem)' }}>ACCESS DENIED</h2>
        <p style={{ marginBottom: '2rem', fontSize: 'clamp(0.8rem, 4vw, 1.2rem)', lineHeight: '1.5' }}>You do not have administrative privileges.</p>
        <button className="pixel-btn" onClick={() => navigate('/')}>RETURN HOME</button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: `url(${pixelSpace})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      imageRendering: 'pixelated',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: '4px solid var(--pixel-border)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '10px 10px 0px rgba(0, 0, 0, 0.8)',
        color: 'white',
        position: 'relative',
  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      backgroundImage: `url(${pixelSpace})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      imageRendering: 'pixelated',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: '4px solid var(--pixel-border)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '10px 10px 0px rgba(0, 0, 0, 0.8)',
        color: 'white',
        position: 'relative',
        fontFamily: 'var(--font-main)'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ background: 'transparent', color: 'white', border: 'none', fontFamily: 'var(--font-pixel)', cursor: 'pointer', padding: 0 }}
          >
            &lt; BACK
          </button>
          
          <button 
            onClick={handleLogout} 
            style={{ background: 'transparent', color: 'var(--neon-green)', border: '2px solid var(--neon-green)', padding: '0.4rem 0.8rem', fontFamily: 'var(--font-pixel)', cursor: 'pointer' }}
          >
            LOGOUT
          </button>
        </div>

        <h1 style={{ fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)', textAlign: 'center', fontSize: 'clamp(1.2rem, 8vw, 2.5rem)', marginTop: '0', textShadow: '4px 4px 0px rgba(0,0,0,0.8)', wordBreak: 'break-word' }}>
          ADMIN DASHBOARD
        </h1>
        
        <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.8rem', color: '#ccc', wordBreak: 'break-all' }}>
          Logged in as Admin: <span style={{ color: 'white' }}>{session?.user?.email}</span>
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '10px', border: '2px dashed var(--neon-green)', textAlign: 'center', flex: '1', minWidth: '200px' }}>
            <h3 style={{ fontFamily: 'var(--font-pixel)', marginBottom: '0.5rem', fontSize: 'clamp(0.8rem, 4vw, 1.2rem)' }}>TOTAL TEAMS</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neon-green)' }}>{teams.length}</p>
          </div>
          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '10px', border: '2px dashed #bd84db', textAlign: 'center', flex: '1', minWidth: '200px' }}>
            <h3 style={{ fontFamily: 'var(--font-pixel)', marginBottom: '0.5rem', fontSize: 'clamp(0.8rem, 4vw, 1.2rem)' }}>TOTAL PARTICIPANTS</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#bd84db' }}>{teams.length * 6}</p>
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-pixel)', borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(1rem, 5vw, 1.5rem)' }}>
          REGISTERED TEAMS
        </h2>
        
        {/* DESKTOP TABLE */}
        <div className="dashboard-desktop-table">
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#111', borderRadius: '10px', overflow: 'hidden', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--solid-bg)', borderBottom: '2px solid var(--pixel-border)' }}>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>ID</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Team Name</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Leader Name</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Leader Email</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Leader Phone</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontFamily: 'var(--font-pixel)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No teams registered yet.</td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#888' }}>#{team.id}</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold', color: 'white' }}>{team.team_name}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{team.leader_name}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{team.leader_email}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{team.leader_phone}</td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <button 
                        onClick={() => navigate('/admin/edit', { state: { team } })}
                        style={{
                          background: 'transparent',
                          color: '#f0ad4e',
                          border: '2px solid #f0ad4e',
                          padding: '0.3rem 0.6rem',
                          fontFamily: 'var(--font-pixel)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap',
                          minWidth: '60px'
                        }}
                      >
                        [EDIT]
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="dashboard-mobile-cards team-members-grid">
          {teams.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>No teams registered yet.</div>
          ) : (
            teams.map((team) => (
              <div key={team.id} className="member-card">
                <div className="member-role leader">Team #{team.id}</div>
                <div className="member-name">{team.team_name}</div>
                <div className="member-detail">Leader: <span>{team.leader_name}</span></div>
                <div className="member-detail">Email: <span>{team.leader_email}</span></div>
                <div className="member-detail">Mobile: <span>{team.leader_phone}</span></div>
                
                <button 
                  onClick={() => navigate('/admin/edit', { state: { team } })}
                  style={{
                    background: 'transparent',
                    color: '#f0ad4e',
                    border: '2px solid #f0ad4e',
                    padding: '0.5rem 1rem',
                    fontFamily: 'var(--font-pixel)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    marginTop: '1rem',
                    width: '100%'
                  }}
                >
                  [EDIT TEAM]
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
