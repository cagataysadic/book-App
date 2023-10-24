import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    registerUser,
    setUserName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setErrorMessage,
} from "../slice/register/registrationSlice";
import "../styles/Animation.scss";
import { AppDispatch, RootState } from "../store";
import { setLoggedIn, setToken, setUserId } from "../slice/auth/authSlice";

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const errorPopupRef = useRef<HTMLDivElement>(null);

    const {
        userName, email, password, confirmPassword, errorMessage
    } = useSelector((state: RootState) => state.registration);    

    const handleClickOutside = (e: MouseEvent) => {
        if (errorPopupRef.current && !errorPopupRef.current.contains(e.target as Node)) {
            dispatch(setErrorMessage(null));
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const validatePassword = (password: string) => {
        if (password.length < 8) return false;

        if (!/[A-Z]/.test(password)) return false;

        if (!/[a-z]/.test(password)) return false;

        if (!/[0-9]/.test(password)) return false;

        if (!/[@$!%*?&#^()_+=[\]{}|;]/.test(password)) return false;

        return true;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            dispatch(setErrorMessage('Passwords must match. Please try again.'));
            return;
        }

        if (!validatePassword(password)) {
            dispatch(setErrorMessage("Your password should contain at least 8 characters, should contain a capital letter, a lower letter, a number and a special character."));
            return;
        }

        dispatch(
            registerUser({ userName, email, password })
        ).then((result: { payload: any; meta: any; }) => {
            const { payload, meta } = result;
            if (meta.requestStatus === 'fulfilled' && payload) {
                localStorage.setItem('token', payload.token);
                localStorage.setItem('userId', payload.user._id);
                dispatch(setToken(payload.token));
                dispatch(setUserId(payload.user._id));
                dispatch(setLoggedIn(true));
                dispatch(setUserName(''));
                dispatch(setEmail(''));
                dispatch(setPassword(''));
                dispatch(setConfirmPassword(''));
                navigate('/profile')
            }
            if (meta.requestStatus === 'rejected' && payload) {
                    const { userName, email } = payload;
                    if (userName) {
                        dispatch(setErrorMessage(userName));
                    } else if (email) {
                        dispatch(setErrorMessage(email));
                    } else {
                        dispatch(setErrorMessage("An error accured during registration. Please try again."));
                    }
                }
        }).catch ((error: any) => {
            console.log(error);
        });
    };

    return (
        <div className="bg-neutral-100 flex justify-center items-center min-h-screen">
            {errorMessage && (
                <div className="bg-red-600 text-stone-100 fixed top-16 right-5 rounded-xl py-2 px-3 text-base z-40" ref={errorPopupRef}>
                    {errorMessage}
                </div>
            )}
            <form className="bg-neutral-300 lg:w-96 w-80 lg:rounded-3xl rounded-2xl mt-6 flex flex-col items-center" onSubmit={handleSubmit}>
                <div className="input-border bg-teal-100">
                    <input className="custom-input" type="userName" value={userName} onChange={(e) => dispatch(setUserName(e.target.value))} placeholder="User name..." required />
                </div>
                <div className="input-border bg-teal-100">
                    <input className="custom-input" type="email" value={email} onChange={(e) => dispatch(setEmail(e.target.value))} placeholder="E-Mail..." required />
                </div>
                <div className="input-border bg-teal-100">
                    <input className="custom-input" type="password" value={password} onChange={(e) => dispatch(setPassword(e.target.value))} placeholder="Password..." required />
                </div>
                <div className="input-border bg-teal-100">
                    <input className="custom-input" type="password" value={confirmPassword} onChange={(e) => dispatch(setConfirmPassword(e.target.value))} placeholder="Confirm Password..." required />
                </div>
                <label className="bg-teal-200 border-teal-800 block w-5/6 my-2 mx-auto p-4 rounded-xl border-solid border-2 text-justify">
                    <h3 className="text-base text-teal-900 ">Your password should contain at least 8 characters, should contain a capital letter, a lower letter, a number and a special character.</h3>
                </label>
                <label className="flex justify-center mb-4">
                    <button className="message-button" type="submit">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Register
                    </button>
                </label>
            </form>
        </div>
    );
};

export default Register;