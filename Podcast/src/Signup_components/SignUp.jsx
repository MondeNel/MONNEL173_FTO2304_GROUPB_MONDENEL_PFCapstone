import React from 'react';
import supabase from '../config/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

/**
 * SignUp component for user registration and login.
 * @returns {JSX.Element} The SignUp component JSX.
 */
const SignUp = () => {
    const navigate = useNavigate();

    // Event handler for authentication state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            // Redirect to the Home page if the user is signed in or signs up successfully
            navigate('/home');
        } else if (event === 'SIGNED_OUT') {
            // Navigate to the Sign Up page if the user signs out
            navigate('/signup');
        }
    });

    return (
        <div className="signup-container">
            <h1 className="signup-title">Sign Up</h1>
            <div className="signup-form">
                {/* Auth component for GitHub authentication */}
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
