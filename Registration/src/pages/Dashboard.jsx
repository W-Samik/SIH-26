import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import pixelSpace from '../assets/pixel_space.jpg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndTeam = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }
      
      setSession(session);
      
      // Query the database to find the user's team
      const email = session.user.email;
      
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .or(`leader_email.eq.${email},members_data.cs.[{"email": "${email}"}]`);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setTeam(data[0]); // User is in a team
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndTeam();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)', color: 'white', fontFamily: 'var(--font-pixel)' }}>
        <h2>LOADING...</h2>
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
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: '4px solid var(--pixel-border)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '10px 10px 0px rgba(0, 0, 0, 0.8)',
        color: 'white',
        position: 'relative'
      }}>
        
        <button 
          onClick={() => navigate('/')} 
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'transparent', color: 'white', border: 'none', fontFamily: 'var(--font-pixel)', cursor: 'pointer' }}
        >
          &lt; BACK
        </button>
        
        <button 
          onClick={handleLogout} 
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--neon-green)', border: '2px solid var(--neon-green)', padding: '0.4rem 0.8rem', fontFamily: 'var(--font-pixel)', cursor: 'pointer' }}
        >
          LOGOUT
        </button>

        <h1 style={{ fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)', textAlign: 'center', fontSize: '2.5rem', marginTop: '0.5rem', textShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}>
          DASHBOARD
        </h1>
        
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Logged in as: {session?.user?.email}</p>

        {!team ? (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#111', border: '2px dashed #444', borderRadius: '10px' }}>
            <h3 style={{ fontFamily: 'var(--font-pixel)', color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>No Team Found</h3>
            <p>You have not registered or joined a team yet.</p>
            <button className="pixel-btn" onClick={() => navigate('/register')} style={{ marginTop: '1.5rem' }}>REGISTER A TEAM</button>
          </div>
        ) : (
          <div>
            <h2 style={{ fontFamily: 'var(--font-pixel)', color: 'white', borderBottom: '2px solid var(--pixel-border)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>
              TEAM: <span style={{ color: 'var(--neon-green)' }}>{team.team_name}</span>
            </h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#111', borderRadius: '10px', overflow: 'hidden', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--solid-bg)', borderBottom: '2px solid var(--pixel-border)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Role</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Gender</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Stream</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {/* LEADER */}
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '0.75rem', color: '#bd84db', fontWeight: 'bold' }}>Leader</td>
                    <td style={{ padding: '0.75rem' }}>{team.leader_name}</td>
                    <td style={{ padding: '0.75rem' }}>{team.leader_gender}</td>
                    <td style={{ padding: '0.75rem' }}>{team.leader_stream}</td>
                    <td style={{ padding: '0.75rem' }}>{team.leader_year}</td>
                  </tr>
                  
                  {/* MEMBERS */}
                  {team.members_data && Array.isArray(team.members_data) && team.members_data.map((member, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '0.75rem', color: '#888' }}>Member {index + 1}</td>
                      <td style={{ padding: '0.75rem' }}>{member.name || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>{member.gender || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>{member.stream || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>{member.year || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
