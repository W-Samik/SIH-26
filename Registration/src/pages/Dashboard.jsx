import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import pixelSpace from '../assets/pixel_space.jpg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // PPT Upload State
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      setFile(null);
      return;
    }

    setUploadError('');
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !team) return;
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${team.id}_${team.team_name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ppts')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ppts')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('registrations')
        .update({ ppt_url: publicUrl })
        .eq('id', team.id);

      if (dbError) throw dbError;

      setTeam({ ...team, ppt_url: publicUrl });
      setUploadSuccess(true);
      setFile(null);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

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

        <h1 style={{ fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)', textAlign: 'center', fontSize: '1.5rem', marginTop: 0, textShadow: '3px 3px 0px rgba(0,0,0,0.8)', wordBreak: 'break-word' }}>
          DASHBOARD
        </h1>
        
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.65rem', wordBreak: 'break-all', color: '#ccc' }}>
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
            
            <div className="dashboard-desktop-table">
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#111', borderRadius: '10px', overflow: 'hidden', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--solid-bg)', borderBottom: '2px solid var(--pixel-border)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Role</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Mobile</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontFamily: 'var(--font-pixel)' }}>Stream</th>
                  </tr>
                </thead>
                <tbody>
                  {/* LEADER */}
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '0.75rem', color: '#bd84db', fontWeight: 'bold' }}>Leader</td>
                    <td style={{ padding: '0.75rem' }}>{team.leader_name}</td>
                    <td style={{ padding: '0.75rem' }}>{team.leader_email}</td>
                    <td style={{ padding: '0.75rem' }}>{team.leader_phone}</td>
                    <td style={{ padding: '0.75rem' }}>{team.leader_stream}</td>
                  </tr>
                  
                  {/* MEMBERS */}
                  {team.members_data && Array.isArray(team.members_data) && team.members_data.map((member, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '0.75rem', color: '#888' }}>Member {index + 1}</td>
                      <td style={{ padding: '0.75rem' }}>{member.name || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>{member.email || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>{member.phone || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>{member.stream || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dashboard-mobile-cards team-members-grid">
              
              {/* LEADER CARD */}
              <div className="member-card">
                <div className="member-role leader">Leader</div>
                <div className="member-name">{team.leader_name}</div>
                <div className="member-detail">Email: <span>{team.leader_email}</span></div>
                <div className="member-detail">Mobile: <span>{team.leader_phone}</span></div>
                <div className="member-detail">Stream: <span>{team.leader_stream}</span></div>
              </div>

              {/* MEMBER CARDS */}
              {team.members_data && Array.isArray(team.members_data) && team.members_data.map((member, index) => (
                <div key={index} className="member-card">
                  <div className="member-role">Member {index + 1}</div>
                  <div className="member-name">{member.name || 'N/A'}</div>
                  <div className="member-detail">Email: <span>{member.email || 'N/A'}</span></div>
                  <div className="member-detail">Mobile: <span>{member.phone || 'N/A'}</span></div>
                  <div className="member-detail">Stream: <span>{member.stream || 'N/A'}</span></div>
                </div>
              ))}
              
            </div>

            {/* PPT SUBMISSION SECTION */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#111', border: '2px dashed #444', borderRadius: '10px' }}>
              <h3 style={{ fontFamily: 'var(--font-pixel)', color: 'white', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                IDEA PPT SUBMISSION
              </h3>
              
              {team.ppt_url ? (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: 'var(--neon-green)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Status: Submitted ✅</p>
                  <a 
                    href={team.ppt_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#bd84db', textDecoration: 'underline', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1rem' }}
                  >
                    View Submitted PPT
                  </a>
                </div>
              ) : (
                <p style={{ color: '#f0ad4e', fontWeight: 'bold', marginBottom: '1rem' }}>Status: Pending ❌</p>
              )}

              {/* Only the Team Leader can upload/re-upload */}
              {session?.user?.email === team.leader_email ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>
                    {team.ppt_url ? "Upload a new PDF to overwrite the existing submission." : "Please upload your Idea PPT as a PDF document."} <br/>
                    <span style={{ color: '#f0ad4e' }}>Max file size: 5MB. Format: .pdf only.</span>
                  </p>
                  
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{
                      fontFamily: 'var(--font-main)',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      border: '1px solid #555',
                      color: 'white',
                      borderRadius: '5px'
                    }}
                  />

                  {uploadError && <p style={{ color: 'red', fontSize: '0.85rem', margin: 0 }}>{uploadError}</p>}
                  {uploadSuccess && <p style={{ color: 'var(--neon-green)', fontSize: '0.85rem', margin: 0 }}>File uploaded successfully!</p>}

                  <button 
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    style={{
                      backgroundColor: (!file || uploading) ? '#555' : 'var(--neon-green)',
                      color: 'black',
                      fontFamily: 'var(--font-pixel)',
                      padding: '0.8rem',
                      border: 'none',
                      cursor: (!file || uploading) ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    {uploading ? 'UPLOADING...' : 'SUBMIT PPT'}
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                  Only the Team Leader ({team.leader_name}) can submit or update the Idea PPT.
                </p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
