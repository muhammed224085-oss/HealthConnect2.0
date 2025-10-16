import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/admin/login', {
                email,
                password
            });
            
            // Store admin data in localStorage
            localStorage.setItem('adminData', JSON.stringify(response.data));
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h1 style={styles.title}>🛡️ Admin Portal</h1>
                <p style={styles.subtitle}>HealthConnect Administration</p>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="admin@healthconnect.com"
                            required
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    
                    <button type="submit" style={styles.button}>
                        🔐 Login as Admin
                    </button>
                </form>
                
                <div style={styles.info}>
                    <p><strong>Admin Credentials:</strong></p>
                    <p style={{marginTop: '10px'}}>Email: admin@healthconnect.com</p>
                    <p>Password: admin123</p>
                    <hr style={{margin: '15px 0', border: '0', borderTop: '1px solid #ddd'}} />
                    <p>Email: mevinbenty507@gmail.com</p>
                    <p>Password: mevinbenty12+</p>
                </div>
                
                <button 
                    onClick={() => navigate('/')} 
                    style={styles.backButton}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    },
    loginBox: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        maxWidth: '450px',
        width: '100%'
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '10px',
        fontSize: '32px'
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '30px',
        fontSize: '16px'
    },
    error: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #fcc'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontWeight: '600',
        color: '#333',
        fontSize: '14px'
    },
    input: {
        padding: '12px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'border-color 0.3s',
        outline: 'none'
    },
    button: {
        backgroundColor: '#667eea',
        color: 'white',
        padding: '14px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px'
    },
    backButton: {
        backgroundColor: 'transparent',
        color: '#667eea',
        padding: '10px',
        border: '2px solid #667eea',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '20px',
        width: '100%'
    },
    info: {
        marginTop: '25px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#666',
        textAlign: 'center'
    }
};

export default AdminLogin;
