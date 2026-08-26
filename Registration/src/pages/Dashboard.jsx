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
      width: '100%',
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

        <h1 style={{ fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)', textAlign: 'center', fontSize: '2rem', marginTop: 0, textShadow: '4px 4px 0px rgba(0,0,0,0.8)', wordBreak: 'break-word' }}>
          DASHBOARD
        </h1>
        
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.8rem', wordBreak: 'break-all', color: '#ccc' }}>
          Logged in as: <span style={{ color: 'white' }}>{session?.user?.email}</span>
        </p>

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
            
            <div className="team-members-grid">
              
              {/* LEADER CARD */}
              <div className="member-card">
                <div className="member-role leader">Leader</div>
                <div className="member-name">{team.leader_name}</div>
                <div className="member-detail">Gender: <span>{team.leader_gender}</span></div>
                <div className="member-detail">Stream: <span>{team.leader_stream}</span></div>
                <div className="member-detail">Year: <span>{team.leader_year}</span></div>
              </div>

              {/* MEMBER CARDS */}
              {team.members_data && Array.isArray(team.members_data) && team.members_data.map((member, index) => (
                <div key={index} className="member-card">
                  <div className="member-role">Member {index + 1}</div>
                  <div className="member-name">{member.name || 'N/A'}</div>
                  <div className="member-detail">Gender: <span>{member.gender || 'N/A'}</span></div>
                  <div className="member-detail">Stream: <span>{member.stream || 'N/A'}</span></div>
                  <div className="member-detail">Year: <span>{member.year || 'N/A'}</span></div>
                </div>
              ))}
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
