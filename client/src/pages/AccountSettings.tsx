import React, { useEffect, useRef } from 'react';
import "../styles/Animation.scss";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
    fetchUser,
    handleValidatePassword,
    handleUserUpdate,
    setPassword,
    setNewUserName,
    setNewEmail,
    setNewPassword,
    setConfirmNewPassword,
    setIsLocked,
    setErrorMessage,
    passwordUpdate,
} from '../slice/accountSettings/accountSettingsSlice';


const AccountSettings: React.FC = () => {
    const {
        password,
        newUserName,
        newEmail,
        newPassword,
        confirmNewPassword,
        isLocked,
        errorMessage,
    } = useSelector((state: RootState) => state.accountSettings);
    const dispatch = useDispatch<AppDispatch>();
    const errorPopupRef = useRef<HTMLDivElement>(null);

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

    const validatePassword = (newPassword: string) => {
        
        // Minimum length of 8 characters
        if (newPassword.length < 8) return false;

        // At least one uppercase letter
        if (!/[A-Z]/.test(newPassword)) return false;

        // At least one lowercase letter
        if (!/[a-z]/.test(newPassword)) return false;

        // At least one digit
        if (!/[0-9]/.test(newPassword)) return false;
        // At least one special character
        if (!/[@$!%*?&#^()_+=[\]{}|;]/.test(newPassword)) return false;

        return true;
    };

    useEffect(() => {
        dispatch(
            fetchUser()
        ).then((result: { payload: any; meta: any;}) => {
            const { payload, meta } = result;
            if (meta.requestStatus === 'fulfilled' && payload) {
                dispatch(setNewUserName(payload.userName));
                dispatch(setNewEmail(payload.email));
            }
        })
    }, [dispatch]);

    const validateCurrentPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(
            handleValidatePassword({ currentPassword: password })
        ).then((result: { payload: any; meta: any}) => {
            const { payload, meta } = result;
            if (meta.requestStatus === 'fulfilled' && payload) {
                dispatch(setIsLocked(false));
                dispatch(setPassword(''));
            }
        })
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            dispatch(handleUserUpdate({userName: newUserName, email: newEmail}))
            dispatch(setPassword(''));
            dispatch(setIsLocked(true));
        } catch (error) {
            console.log(error);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            dispatch(setErrorMessage("Passwords must match. Please try again."));
            return;
        }

        if (!validatePassword(newPassword)) {
            dispatch(setErrorMessage("Your password should contain at least 8 characters, should contain a capital letter, a lower letter, a number and a special character."));
            return;
        }

        try {
            dispatch(passwordUpdate(newPassword))
            dispatch(setNewPassword(''));
            dispatch(setConfirmNewPassword(''));
            dispatch(setIsLocked(true));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-neutral-100 flex lg:flex-row flex-col gap-8 justify-around items-center min-h-screen p-8">
            {errorMessage && (
                <div className="bg-red-600 text-stone-100 fixed top-16 right-6 py-2 px-4 rounded-xl text-base z-40" ref={errorPopupRef}>
                    {errorMessage}
                </div>
            )}
                <form className="bg-neutral-300 lg:w-96 w-80 my-5 rounded-3xl flex flex-col items-center" onSubmit={validateCurrentPassword}>
                    <h1 className="text-neutral-950 text-xl font-bold my-6">Validate Password</h1>
                    <div className='input-border bg-teal-100'>
                        <input type="password" className="custom-input" value={password} onChange={e => dispatch(setPassword(e.target.value))} required />
                    </div>
                    <button className="message-button mb-3" type="submit">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Validate
                    </button>
                </form>
                
                <form className="bg-neutral-300 lg:w-96 w-80 my-5 rounded-3xl flex flex-col items-center" onSubmit={handleUpdate}>
                    <h1 className="text-neutral-950 text-xl font-bold my-6">Update Credentials</h1>
                    <div className='input-border bg-teal-100'>
                        <input type="text" className="custom-input" value={newUserName} onChange={e => dispatch(setNewUserName(e.target.value))} disabled={isLocked} />
                    </div>
                    <div className='input-border bg-teal-100'>
                        <input type="email" className="custom-input" value={newEmail} onChange={e => dispatch(setNewEmail(e.target.value))} disabled={isLocked} />
                    </div>
                    <button className="message-button mb-3" type="submit" disabled={isLocked}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Update
                    </button>
                </form>
                
                <form className="bg-neutral-300 lg:w-96 w-80 my-5 rounded-3xl flex flex-col items-center" onSubmit={handlePasswordUpdate}>
                    <h2 className="text-neutral-950 text-xl font-bold my-6">Update Password</h2>
                    <div className='input-border bg-teal-100'>
                        <input type="password" className="custom-input" placeholder='New Password...' value={newPassword} onChange={e => dispatch(setNewPassword(e.target.value))} disabled={isLocked} />
                    </div>
                    <div className='input-border bg-teal-100'>
                        <input type="password" className="custom-input" placeholder='Confirm Password...' value={confirmNewPassword} onChange={e => dispatch(setConfirmNewPassword(e.target.value))} disabled={isLocked} />
                    </div>
                    <button className="message-button mb-3" type="submit" disabled={isLocked}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Update
                    </button>
                </form>
        </div>
    );
};

export default AccountSettings;