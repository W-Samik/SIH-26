import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import spaceBg from '../assets/pixel_space.jpg';
import { supabase } from '../utils/supabaseClient';

const Background = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const handleAuthClick = async () => {
    if (session) {
      navigate('/dashboard');
    } else {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    }
  };

  return (
    <>
      <img src={spaceBg} alt="Space Background" className="space-bg" />
      <div className="user-pill" onClick={handleAuthClick} style={{ cursor: 'pointer', zIndex: 100 }}>
        <UserCircle size={16} />
        <span>{session ? 'DASHBOARD' : 'LOGIN'}</span>
      </div>
    </>
  );
};

export default Background;
