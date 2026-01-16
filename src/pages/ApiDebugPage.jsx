import React, { useState, useEffect } from 'react';
import { DEBUG_ACCESS_HASH } from '../config/apiConfig';
import ApiDebugManager from '../components/APIDebug/ApiDebugManager';

const ApiDebugPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const auth = sessionStorage.getItem('api_debug_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const simpleHash = async (str) => {
        // Fallback hash for non-HTTPS contexts
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        // Try to use Web Crypto API if available
        if (window.crypto && window.crypto.subtle) {
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(str);
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } catch (e) {
                console.warn('Web Crypto API failed, using fallback');
            }
        }

        // Fallback: simple hash expansion to look like SHA-256
        return Math.abs(hash).toString(16).padStart(64, '0');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const hashHex = await simpleHash(password);
            console.log(password);

            console.log(hashHex);

            if (hashHex === DEBUG_ACCESS_HASH) {
                setIsAuthenticated(true);
                sessionStorage.setItem('api_debug_auth', 'true');
                setError('');
            } else {
                setError('Incorrect password');
            }
        } catch (err) {
            console.error(err);
            setError('Error verifying password');
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-main)'
            }}>
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    width: '320px'
                }}>
                    <h2 style={{
                        marginBottom: '1.5rem',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--text-active)',
                        textAlign: 'center'
                    }}>
                        API Debug Access
                    </h2>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter access code"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-active)',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        {error && (
                            <div style={{
                                color: 'var(--status-error)',
                                fontSize: '0.875rem',
                                marginBottom: '1rem',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary)'}
                        >
                            Access Debugger
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <ApiDebugManager />;
};

export default ApiDebugPage;
