import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import '../styles/registration.css';

const Registration = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Countdown Timer State
  const deadline = new Date('2026-09-06T00:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState(deadline - new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = deadline - new Date().getTime();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Auth & Existing Registration Check
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const checkExistingRegistration = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const email = session.user.email;
          const { data, error } = await supabase
            .from('registrations')
            .select('team_name')
            .or(`leader_email.eq.${email},members_data.cs.[{"email": "${email}"}]`);

          if (error) throw error;
          if (data && data.length > 0) {
            setAlreadyRegistered(true);
          }
        } else {
          setNeedsLogin(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkExistingRegistration();
  }, []);

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

  const handleAddMember = () => {
    if (members.length < 5) {
      setMembers([...members, { name: '', gender: '', email: '', phone: '', stream: '', year: '' }]);
    }
  };

  const handleRemoveMember = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  const validateForm = () => {
    // Check required fields for leader
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

    // Check required fields for members
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
      const allEmails = [leaderEmail, ...memberEmails];

      const leaderPhone = Number(leader.phone);
      const memberPhones = members.map(m => Number(m.phone));
      const allPhones = [leaderPhone, ...memberPhones];

      const leaderName = leader.name.trim();
      const memberNames = members.map(m => m.name.trim());
      const allNames = [leaderName, ...memberNames];

      // 1. Check for duplicate emails within the form itself
      const uniqueEmails = new Set(allEmails);
      if (uniqueEmails.size !== allEmails.length) {
        setError("Registration Denied: Duplicate emails found within your form. Each member must have a unique email address.");
        setLoading(false);
        return;
      }

      // Check for duplicate phones within the form
      const uniquePhones = new Set(allPhones);
      if (uniquePhones.size !== allPhones.length) {
        setError("Registration Denied: Duplicate mobile numbers found within your form. Each member must have a unique mobile number.");
        setLoading(false);
        return;
      }

      // 2. Check the database to see if any of these emails, phones, or names are already registered
      const checkPromises = allEmails.map(async (email, idx) => {
        const phone = allPhones[idx];
        const name = allNames[idx];
        // Ensure name doesn't contain commas to prevent breaking the .or() parser
        const safeName = name.replace(/,/g, '');

        const { data, error } = await supabase
          .from('registrations')
          .select('team_name')
          .or(`leader_email.eq.${email},members_data.cs.[{"email":"${email}"}],leader_phone.eq.${phone},members_data.cs.[{"phone":${phone}}]`);
        
        if (error) throw error;
        if (data && data.length > 0) {
          return { email, phone, name, team: data[0].team_name };
        }
        return null;
      });

      const results = await Promise.all(checkPromises);
      const duplicate = results.find(res => res !== null);

      if (duplicate) {
        setError(`Registration Denied: The member "${duplicate.name}" (Email: ${duplicate.email} | Phone: ${duplicate.phone}) is already registered with the team "${duplicate.team}". A person can only be registered once.`);
        setLoading(false);
        return;
      }

      // 3. Structure the data to match our Supabase schema
      // Transform email to lowercase and numbers to Int/BigInt
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
        .insert([teamData]);

      if (dbError) throw dbError;

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while submitting. Check Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="registration-page centered">
        <div className="registration-container" style={{ textAlign: 'center' }}>
          <h2 className="reg-title">SUCCESS!</h2>
          <p>Your team has been registered successfully.</p>
          <button className="pixel-btn" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>RETURN HOME</button>
        </div>
      </div>
    );
  }

  // Registration Deadline Check
  const isClosed = timeLeft <= 0;

  if (isClosed) {
    return (
      <div className="registration-page centered">
        <div className="registration-container" style={{ textAlign: 'center' }}>
          <h2 className="reg-title" style={{ color: '#ff4444' }}>REGISTRATION CLOSED</h2>
          <p>The registration deadline has passed. We are no longer accepting new teams.</p>
          <button className="pixel-btn" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>RETURN HOME</button>
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

  if (needsLogin) {
    return (
      <div className="registration-page centered">
        <div className="registration-container" style={{ textAlign: 'center' }}>
          <h2 className="reg-title" style={{ color: 'var(--neon-green)' }}>LOGIN REQUIRED</h2>
          <p style={{ margin: '2rem 0', fontSize: '1.2rem' }}>
            You must log in with your Google account before you can register a team.
          </p>
          <button className="submit-btn" onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin + '/register' }
            });
          }} style={{ marginBottom: '1rem' }}>
            LOGIN WITH GOOGLE
          </button>
          <button className="back-btn" onClick={() => navigate('/')} style={{ margin: '0 auto' }}>
            &lt; Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="registration-page centered">
        <div className="registration-container" style={{ textAlign: 'center' }}>
          <h2 className="reg-title" style={{ color: 'red' }}>ALREADY REGISTERED</h2>
          <p style={{ margin: '2rem 0', fontSize: '1.2rem' }}>
            You are already registered as a member of a team.<br />
            A person can only participate in one team at a time.
          </p>
          <button className="submit-btn" onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem' }}>
            VIEW TEAM DASHBOARD
          </button>
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
        <button className="back-btn" onClick={() => navigate('/')}>&lt; Back to Home</button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', border: '2px dashed #f0ad4e', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: '1rem' }}>
          <h3 style={{ margin: 0, color: '#f0ad4e', fontSize: '1.2rem', fontFamily: 'var(--font-pixel)' }}>REGISTRATION CLOSES IN:</h3>
          <p style={{ margin: '0.5rem 0 0 0', color: 'white', fontSize: '1.8rem', fontFamily: 'var(--font-pixel)', letterSpacing: '2px' }}>
            {formatTime(timeLeft)}
          </p>
        </div>

        <h2 className="reg-title">REGISTRATION</h2>
        <div className="reg-notice">
          NOTICE: This registration form must be filled out by the Team Leader ONLY.
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
            <h3>Team Leader (You)</h3>

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
                <input type="tel" maxLength="10" value={leader.phone} onChange={e => setLeader({ ...leader, phone: e.target.value.replace(/\D/g, '') })} />
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
                    <input type="tel" maxLength="10" value={member.phone} onChange={e => updateMember(index, 'phone', e.target.value.replace(/\D/g, ''))} />
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
            {loading ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
