"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';
import Navbar from '@/components/Navbar';
import { registerUser, checkUserExists } from '@/lib/authService';
import { auth, firebaseInitialized, firebaseError } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';

export default function Register() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        userType: 'Individual',
        address: '',
        city: '',
        pincode: '',
        foodType: 'Veg',
        availability: '',
        orgName: '',
        acceptedTerms: false
    });

    const [error, setError] = useState('');

    // Validation States
    const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid' | 'error'>('idle');
    const [cityStatus, setCityStatus] = useState<'idle' | 'correct' | 'mismatch'>('idle');
    const [validCities, setValidCities] = useState<string[]>([]);

    // New Validation States
    const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [mobileVerified, setMobileVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [mockOtp, setMockOtp] = useState('');

    useEffect(() => {
        if (formData.email.includes('@')) {
            const timer = setTimeout(() => {
                const mockTakenEmails = ['john@example.com', 'test@gmail.com', 'admin@foodsaver.com'];
                if (mockTakenEmails.includes(formData.email)) {
                    setEmailStatus('taken');
                } else {
                    setEmailStatus('available');
                }
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setEmailStatus('idle');
        }
    }, [formData.email]);

    // Mock OTP Logic
    const handleSendOtp = async () => {
        setError('');
        if (!formData.mobile || formData.mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.mobile)) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }
        // Check if already registered (mock DB)
        const users = JSON.parse(localStorage.getItem('foodseeker_users') || '[]');
        if (users.some((u: any) => u.mobile === formData.mobile)) {
            setError('Mobile number already registered. Please login.');
            return;
        }
        setOtpLoading(true);
        // Generate a random 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setMockOtp(otp);
        setOtpSent(true);
        setOtpLoading(false);
    };

    const handleVerifyOtp = () => {
        if (enteredOtp === mockOtp) {
            setMobileVerified(true);
            setOtpSent(false);
            setError('');
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    // Pincode Lookup
    useEffect(() => {
        if (formData.pincode.length === 6) {
            setPincodeStatus('loading');
            fetch(`/api/pincode?code=${formData.pincode}`)
                .then(res => res.json())
                .then(data => {
                    if (data.valid) {
                        setPincodeStatus('valid');
                        setValidCities(data.places.map((p: string) => p.toLowerCase()));
                        // Auto-fill state if available? User didn't ask for state input, but we can assume it's fine.
                    } else {
                        setPincodeStatus('invalid');
                        setValidCities([]);
                    }
                })
                .catch(() => {
                    setPincodeStatus('error');
                    setValidCities([]);
                });
        } else {
            setPincodeStatus('idle');
            setValidCities([]);
            setCityStatus('idle');
        }
    }, [formData.pincode]);

    // City-Pincode Match Validation
    useEffect(() => {
        if (pincodeStatus === 'valid' && formData.city) {
            const enteredCity = formData.city.toLowerCase().trim();
            // Check if entered city matches any of the valid places
            // We use includes to allow partial matches like "Adilabad" matching "Adilabad H.O" if we hadn't cleaned it
            // But we cleaned it in API. Let's do exact match or check if validCities includes enteredCity
            const isMatch = validCities.some(city => city === enteredCity || city.includes(enteredCity) || enteredCity.includes(city));

            if (isMatch) {
                setCityStatus('correct');
            } else {
                setCityStatus('mismatch');
            }
        } else {
            setCityStatus('idle');
        }
    }, [formData.city, pincodeStatus, validCities]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Type assertion for checkbox
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (cityStatus === 'mismatch') {
            setError('City and Pincode do not match. Please correct them.');
            return;
        }

        if (pincodeStatus === 'invalid') {
            setError('Please enter a valid Indian Pincode.');
            return;
        }

        if (emailStatus === 'taken') {
            setError('This email is already registered.');
            return;
        }

        if (!mobileVerified) {
            setError('Please verify your mobile number.');
            return;
        }

        // Basic Validation
        if (!formData.fullName || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword || !formData.address || !formData.city || !formData.pincode || !formData.availability) {
            setError('Please fill in all required fields.');
            return;
        }

        // Password Match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Mobile Number Validation (Strictly 10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.mobile)) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        // Email Validation (Google accounts only)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com)$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please use a valid Google account (gmail.com).');
            return;
        }

        // Terms Check
        if (!formData.acceptedTerms) {
            setError('You must accept the Terms & Conditions.');
            return;
        }

        // Register User
        try {
            if (!auth) {
                setError('Firebase Auth is not initialized.');
                return;
            }
            // 1. Create User in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Send Verification Email
            await sendEmailVerification(user);

            // 3. Update Profile (DisplayName)
            await updateProfile(user, {
                displayName: formData.fullName
            });

            // 4. Save User Profile to Local Storage (Mock Database)
            const userToRegister = {
                fullName: formData.fullName,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password, // Save password for local login
                userType: formData.userType,
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                foodType: formData.foodType,
                availability: formData.availability,
                orgName: formData.orgName,
                role: 'donor', // Default role
                emailVerified: false // Initially false until verified
            };

            // We still use registerUser to save to our "Database" (localStorage)
            const result = registerUser(userToRegister);

            if (!result.success) {
                setError(result.message);
                // Ideally rollback Firebase creation here
                return;
            }

            // 5. Sign Out (Force login to verify)
            if (auth) {
                await signOut(auth);
            }

            // Success
            alert('Registration Successful! A verification link has been sent to your email. Please verify before logging in.');
            router.push('/login');

        } catch (error: any) {
            console.error('Registration Error:', error);
            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already registered.');
            } else {
                setError(error.message || 'Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <Navbar />
            <div className="flex-1 flex items-center justify-center relative py-12 px-4">
                <VideoBackground />

                <div className="relative z-10 w-full max-w-2xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-white">
                    <Link href="/" className="inline-flex items-center gap-2 text-green-300 hover:text-white transition-colors mb-6 text-sm">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-gray-200 text-sm">Join the movement to feed communities.</p>
                    </div>

                    <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-6">
                        {error && (
                            <div className="md:col-span-2 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                                <AlertCircle size={16} className="text-red-500" />
                                {error}
                            </div>
                        )}

                        {!firebaseInitialized && (
                            <div className="md:col-span-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle size={16} className="text-yellow-500" />
                                <span>
                                    <strong>Setup Required:</strong> Firebase is not configured.
                                    OTP and Email Verification will not work.
                                    Please add your API keys to <code>.env.local</code>.
                                </span>
                            </div>
                        )}

                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">Full Name</label>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">Email ID</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-green-500 text-white ${emailStatus === 'taken' ? 'border-red-500' :
                                        emailStatus === 'available' ? 'border-green-500' : 'border-white/10'
                                        }`}
                                />
                                {emailStatus === 'taken' && <p className="text-xs text-red-400 mt-1">Email already registered</p>}
                                {emailStatus === 'available' && <p className="text-xs text-green-400 mt-1">Email available</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">Mobile Number</label>
                                <div className="flex gap-2">
                                    <input
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        disabled={mobileVerified}
                                        type="tel"
                                        className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-green-500 text-white ${mobileVerified ? 'border-green-500 bg-green-500/10' : 'border-white/10'
                                            }`}
                                    />
                                    {!mobileVerified && (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={otpLoading}
                                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                                        >
                                            {otpLoading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Verify'}
                                        </button>
                                    )}
                                </div>
                                {mobileVerified && <p className="text-xs text-green-400 mt-1">✓ Verified</p>}

                                {otpSent && !mobileVerified && (
                                    <div className="flex flex-col gap-2 mt-2 animate-fadeIn">
                                        <div className="text-xs text-yellow-300 font-mono">Mock OTP: <span className="font-bold">{mockOtp}</span></div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter 4-digit OTP"
                                                value={enteredOtp}
                                                onChange={(e) => setEnteredOtp(e.target.value)}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">Password</label>
                                <input name="password" value={formData.password} onChange={handleChange} type="password" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">Confirm Password</label>
                                <input
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    type="password"
                                    className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-green-500 text-white ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                        ? 'border-red-500'
                                        : formData.confirmPassword && formData.password === formData.confirmPassword
                                            ? 'border-green-500'
                                            : 'border-white/10'
                                        }`}
                                />
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                                )}
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <p className="text-xs text-green-400 mt-1">Passwords match</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">User Type</label>
                                <select name="userType" value={formData.userType} onChange={handleChange} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white [&>option]:text-black">
                                    <option>Individual</option>
                                    <option>Restaurant</option>
                                    <option>NGO</option>
                                    <option>Volunteer</option>
                                    <option>Event Organizer</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">Address</label>
                                <input name="address" value={formData.address} onChange={handleChange} type="text" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-300 uppercase">City</label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        type="text"
                                        className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-green-500 text-white ${cityStatus === 'correct' ? 'border-green-500' :
                                            cityStatus === 'mismatch' ? 'border-red-500' : 'border-white/10'
                                            }`}
                                    />
                                    {cityStatus === 'correct' && <p className="text-xs text-green-400 mt-1">Correct</p>}
                                    {cityStatus === 'mismatch' && <p className="text-xs text-red-400 mt-1">Does not match</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-300 uppercase">Pincode</label>
                                    <input
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        type="text"
                                        maxLength={6}
                                        className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-green-500 text-white ${pincodeStatus === 'valid' ? 'border-green-500' :
                                            pincodeStatus === 'invalid' ? 'border-red-500' : 'border-white/10'
                                            }`}
                                    />
                                    {pincodeStatus === 'loading' && <p className="text-xs text-blue-400 mt-1">Validating...</p>}
                                    {pincodeStatus === 'invalid' && <p className="text-xs text-red-400 mt-1">Invalid Pincode</p>}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">Type of Food for Donation</label>
                                <select name="foodType" value={formData.foodType} onChange={handleChange} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white [&>option]:text-black">
                                    <option>Veg</option>
                                    <option>Non-Veg</option>
                                    <option>Both</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">Availability Timing</label>
                                <input name="availability" value={formData.availability} onChange={handleChange} type="text" placeholder="e.g. 9 AM - 6 PM" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300 uppercase">Organization Name (Optional)</label>
                                <input name="orgName" value={formData.orgName} onChange={handleChange} type="text" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white" />
                            </div>

                            <div className="pt-4">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleChange} type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-sm text-gray-200">I accept the <a href="#" className="underline hover:text-white">Terms & Conditions</a></span>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-600/20 text-lg"
                            >
                                Register / Sign-Up
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-300">
                        Already have an account? {' '}
                        <Link href="/login" className="text-green-300 hover:text-white font-semibold transition-colors">
                            Login here
                        </Link>
                    </div>
                    <div id="recaptcha-container"></div>
                </div>
            </div>
        </div>
    );
}
