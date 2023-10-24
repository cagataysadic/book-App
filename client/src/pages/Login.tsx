import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Animation.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { loginUser, setEmail, setErrorMessage, setPassword } from "../slice/register/registrationSlice";
import { setLoggedIn, setToken, setUserId } from "../slice/auth/authSlice";


const Login: React.FC = () => {
    const { email, password, errorMessage } = useSelector((state: RootState) => state.registration);
    const dispatch = useDispatch<AppDispatch>()

    const navigate = useNavigate();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(
            loginUser({ email, password })
        ).then((result: { payload: any; meta: any; }) => {
            const { payload, meta } = result;
            if (meta.requestStatus === 'fulfilled' && payload) {
                localStorage.setItem('token', payload.token);
                localStorage.setItem('userId', payload.user._id);
                dispatch(setToken(payload.token));
                dispatch(setUserId(payload.user._id));
                dispatch(setLoggedIn(true));
                dispatch(setEmail(''));
                dispatch(setPassword(''));
                dispatch(setErrorMessage(null));
                navigate('/profile');
            }
        }).catch ((error: any) => {
            console.log(error)
            const errorMessage = 'An error occured during login process.';
            dispatch(setErrorMessage(errorMessage));
        });
    };

    return (
        <div className="bg-neutral-100 flex w-full justify-center items-center min-h-screen">
            {errorMessage && (
                <div className="bg-red-600 text-stone-100 fixed top-16 right-5 rounded-xl py-2 px-3 text-base z-40" ref={errorPopupRef}>
                {errorMessage}
              </div>
            )}
            <form className="bg-neutral-300 lg:w-96 w-80 lg:rounded-3xl rounded-2xl py-10 flex flex-col items-center justify-center" onSubmit={handleSubmit}>
              <div className="input-border bg-teal-100">
                <input className="custom-input" type="email" value={email} onChange={(e) => dispatch(setEmail(e.target.value))} placeholder="E-Mail..." required />
              </div>
              <div className="input-border bg-teal-100">
                <input className="custom-input" type="password" value={password} onChange={(e) => dispatch(setPassword(e.target.value))} placeholder="Password..." required />
              </div>
              <button className="message-button" type="submit">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Login
              </button>
            </form>
        </div>
    )
};

export default Login;