import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import '../styles/registration.css';

const ADMIN_EMAILS = [
  'sam8920341517@gmail.com',
  'gankitsysdev@gmail.com',
  'rishiry6789@gmail.com'
];

const AdminEditTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editTeam = location.state?.team;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auth & Admin Check
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Global Info
  const [teamName, setTeamName] = useState('');

  // Leader State
  const [leader, setLeader] = useState({
    name: '',
    gender: '',
    email: '',
    phone: '',
    stream: '',
    year: ''
  });

  // Members State
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const checkAdminAndPopulate = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
          setAccessDenied(true);
          return;
        }

        if (!editTeam) {
          navigate('/admin');
          return;
        }

        // Populate Form with existing team data
        setTeamName(editTeam.team_name);
        setLeader({
          name: editTeam.leader_name,
          gender: editTeam.leader_gender,
          email: editTeam.leader_email,
          phone: editTeam.leader_phone,
          stream: editTeam.leader_stream,
          year: editTeam.leader_year
        });

        // Populate Members
        if (editTeam.members_data && Array.isArray(editTeam.members_data)) {
          setMembers(editTeam.members_data);
        }

      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAdminAndPopulate();
  }, [editTeam, navigate]);

  const handleAddMember = () => {
    if (members.length < 5) {
      setMembers([...members, { name: '', gender: '', email: '', phone: '', stream: '', year: '' }]);
    }
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleRemoveMember = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidPhone = (phone) => /^\d{10}$/.test(String(phone));

  const validateForm = () => {
    if (!teamName || !leader.name || !leader.gender || !leader.email || !leader.phone || !leader.stream || !leader.year) {
      setError('Please fill in all fields for the Team Leader and Team Name.');
      return false;
    }

    if (!isValidEmail(leader.email)) {
      setError('Please enter a valid email address for the Team Leader.');
      return false;
    }

    if (!isValidPhone(leader.phone)) {
      setError('Please enter a valid 10-digit mobile number for the Team Leader.');
      return false;
    }

    // Check exact team size (Leader + 5 Members = 6)
    if (members.length !== 5) {
      setError('Registration Denied: A team MUST consist of exactly 6 members (1 Team Leader + 5 Members).');
      return false;
    }

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name || !m.gender || !m.email || !m.phone || !m.stream || !m.year) {
        setError(`Please fill in all fields for Member ${i + 1}.`);
        return false;
      }
      if (!isValidEmail(m.email)) {
        setError(`Please enter a valid email address for Member ${i + 1}.`);
        return false;
      }
      if (!isValidPhone(m.phone)) {
        setError(`Please enter a valid 10-digit mobile number for Member ${i + 1}.`);
        return false;
      }
    }

    // GENDER CONSTRAINT: At least one female member
    const allGenders = [leader.gender, ...members.map(m => m.gender)];
    const hasFemale = allGenders.includes('F');
    if (!hasFemale) {
      setError('Registration Denied: Every team MUST have at least one female member as per guidelines.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const leaderEmail = leader.email.toLowerCase().trim();
      const memberEmails = members.map(m => m.email.toLowerCase().trim());
      const leaderName = leader.name.trim();
      const memberNames = members.map(m => m.name.trim());
      const leaderPhone = Number(leader.phone);
      const memberPhones = members.map(m => Number(m.phone));

      // Note: We skip the massive global uniqueness check here because admins might be 
      // updating an existing team and checking its own emails would trigger a duplicate error.

      const teamData = {
        team_name: teamName,
        leader_name: leaderName,
        leader_gender: leader.gender,
        leader_email: leaderEmail,
        leader_phone: leaderPhone,
        leader_stream: leader.stream,
        leader_year: Number(leader.year),
        members_data: members.map((m, index) => ({
          ...m,
          name: memberNames[index],
          email: memberEmails[index],
          phone: memberPhones[index],
          year: Number(m.year)
        }))
      };

      const { error: dbError } = await supabase
        .from('registrations')
        .update(teamData)
        .eq('id', editTeam.id);

      if (dbError) throw dbError;

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while updating the team.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="registration-page centered">
        <div className="registration-container" style={{ textAlign: 'center' }}>
          <h2 className="reg-title">SUCCESS!</h2>
          <p>Team data updated successfully.</p>
          <button className="pixel-btn" onClick={() => navigate('/admin')} style={{ marginTop: '2rem' }}>RETURN TO ADMIN</button>
        </div>
      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="registration-page centered">
        <div className="registration-container" style={{ textAlign: 'center' }}>
          <h2 className="reg-title">LOADING...</h2>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="registration-page centered">
        <div className="registration-container" style={{ textAlign: 'center' }}>
          <h2 className="reg-title" style={{ color: 'red' }}>ACCESS DENIED</h2>
          <p style={{ margin: '2rem 0', fontSize: '1.2rem' }}>
            You are not an administrator.
          </p>
          <button className="back-btn" onClick={() => navigate('/')} style={{ margin: '0 auto' }}>
            &lt; Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <div className="registration-container">
        <button className="back-btn" onClick={() => navigate('/admin')}>&lt; Back to Admin</button>

        <h2 className="reg-title">EDIT TEAM</h2>
        <div className="reg-notice">
          ADMIN MODE: Editing details for Team ID #{editTeam.id}
        </div>

        {error && (
          <div className="error-modal-overlay">
            <div className="error-modal-box">
              <h3 className="error-modal-title">! ERROR !</h3>
              <p className="error-modal-text">{error}</p>
              <button className="error-modal-btn" onClick={() => setError('')}>[ OK ]</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="reg-section">
            <h3>Team Details</h3>
            <div className="form-group">
              <label>Team Name *</label>
              <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Enter Team Name" />
            </div>
          </div>

          <div className="reg-section">
            <h3>Team Leader</h3>

            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" value={leader.name} onChange={e => setLeader({ ...leader, name: e.target.value })} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender *</label>
                <select value={leader.gender} onChange={e => setLeader({ ...leader, gender: e.target.value })}>
                  <option value="">Select</option>
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                  <option value="O">Other (O)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mobile No. *</label>
                <input type="tel" maxLength="10" value={leader.phone} onChange={e => setLeader({ ...leader, phone: String(e.target.value).replace(/\D/g, '') })} />
              </div>
            </div>

            <div className="form-group">
              <label>Email ID *</label>
              <input type="email" value={leader.email} onChange={e => setLeader({ ...leader, email: e.target.value })} />
            </div>

            <div className="form-row">
              <div className="form-group stream-group">
                <label>Stream / Course *</label>
                <select value={leader.stream} onChange={e => setLeader({ ...leader, stream: e.target.value })}>
                  <option value="">Select Course</option>
                  <option value="B.Tech AIML">B.Tech AI</option>
                  <option value="B.Tech DS">B.Tech DS</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="BBA">BBA</option>
                  <option value="MBA">MBA</option>
                  <option value="B.Sc">B.Sc DA</option>
                </select>
              </div>
              <div className="form-group year-group">
                <label>Academic Year *</label>
                <select value={leader.year} onChange={e => setLeader({ ...leader, year: e.target.value })}>
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
          </div>

          <div className="reg-section">
            <h3>Team Members ({members.length}/5)</h3>

            {members.map((member, index) => (
              <div key={index} className="member-card">
                <div className="member-header">
                  <h4>Member {index + 1}</h4>
                  <button type="button" className="remove-btn" onClick={() => handleRemoveMember(index)}>Remove X</button>
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" value={member.name} onChange={e => updateMember(index, 'name', e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender *</label>
                    <select value={member.gender} onChange={e => updateMember(index, 'gender', e.target.value)}>
                      <option value="">Select</option>
                      <option value="M">Male (M)</option>
                      <option value="F">Female (F)</option>
                      <option value="O">Other (O)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Mobile No. *</label>
                    <input type="tel" maxLength="10" value={member.phone} onChange={e => updateMember(index, 'phone', String(e.target.value).replace(/\D/g, ''))} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email ID *</label>
                  <input type="email" value={member.email} onChange={e => updateMember(index, 'email', e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="form-group stream-group">
                    <label>Stream / Course *</label>
                    <select value={member.stream} onChange={e => updateMember(index, 'stream', e.target.value)}>
                      <option value="">Select Course</option>
                      <option value="B.Tech AIML">B.Tech AI</option>
                      <option value="B.Tech DS">B.Tech DS</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="BBA">BBA</option>
                      <option value="MBA">MBA</option>
                      <option value="B.Sc">B.Sc DA</option>
                    </select>
                  </div>
                  <div className="form-group year-group">
                    <label>Academic Year *</label>
                    <select value={member.year} onChange={e => updateMember(index, 'year', e.target.value)}>
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {members.length < 5 && (
              <button type="button" className="add-member-btn" onClick={handleAddMember}>
                + ADD MEMBER
              </button>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'UPDATING...' : 'UPDATE TEAM DATA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditTeam;
