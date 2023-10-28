import React from 'react';
import supabase from '../config/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Import your custom CSS file

const SignUp = () => {
    const navigate = useNavigate();

    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            // If the user is signed in or signs up successfully, redirect to the Home page
            navigate('/home');
        } else if (event === 'SIGNED_OUT') {
            // If the user signs out, navigate to the Sign Up page
            navigate('/signup');
        }
    });

    return (
        <div className="signup-container">
            <h1 className="signup-title">Sign Up</h1>
            <div className="signup-form">
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme='dark'
                    providers={['github']}
                />
            </div>
        </div>
    );
};

export default SignUp;
