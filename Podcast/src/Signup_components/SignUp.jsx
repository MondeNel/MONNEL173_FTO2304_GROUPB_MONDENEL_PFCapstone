import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));

        if (fieldErrors[id]) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                [id]: '',
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = {};
        if (formData.email === '') {
            errors.email = 'Email is required!';
        }
        if (formData.password === '') {
            errors.password = 'Password is required!';
        }
        if (formData.confirmPassword === '') {
            errors.confirmPassword = 'Please confirm your password!';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match!';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            const { user, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                console.error('Error signing up:', error.message);
                return;
            }

            console.log('User signed up:', user);

            navigate('/login');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const buttonHoverStyle = {
        backgroundColor: '#BFBFBF',
        color: 'white',
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '30px' }}>
                <Typography variant="h6">Signup</Typography>
                <br />
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Email"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                error={Boolean(fieldErrors.email)}
                                helperText={fieldErrors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                error={Boolean(fieldErrors.password)}
                                helperText={fieldErrors.password}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={handleShowPassword} edge="end">
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Confirm password"
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                error={Boolean(fieldErrors.confirmPassword)}
                                helperText={fieldErrors.confirmPassword}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '20px', backgroundColor: '#363636', ...(hovered ? buttonHoverStyle : {}) }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        Signup
                    </Button>
                    <div className="form-link" style={{ marginTop: '20px' }}>
                        <span>
                            Already have an account?{' '}
                            <a href="/login" className="link login-link">
                                <button onClick={handleLoginClick}> Login </button>
                            </a>
                        </span>
                    </div>
                </form>
            </Paper>
        </Container>
    );
}

export default SignUp;
