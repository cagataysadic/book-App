import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    toggleProfileDropdown,
    toggleGenresDropdown,
    toggleModal,
    setSelectedGenre,
    fetchGenresAndBooks,
    deleteAccount,
    DashboardState,
} from '../slice/dashboard/dashboardSlice';
import { setToken } from "../slice/auth/authSlice";
import { useEffect } from "react";
import Modal from 'react-modal';
import "../styles/Animation.scss"
import { AppDispatch, RootState } from "../store";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const {
    isProfileDropdownVisible,
    isGenresDropdownVisible,
    isModalOpen,
    genres,
    selectedGenre
  } = useSelector((state: RootState) => state.dashboard as DashboardState);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    dispatch(setToken(null));
    navigate('/login');
    dispatch(toggleProfileDropdown(false));
  };

  useEffect(() => {
    dispatch(fetchGenresAndBooks());
}, [dispatch]);

  const handleDeleteAccount = async () => {
    dispatch(toggleModal(true));
  };

  const closeModal = () => {
    dispatch(toggleModal(false));
  };

  const confirmDeleteAccount = async () => {
    dispatch(deleteAccount())
    dispatch(toggleModal(false));
    navigate('/register');
  }

  return (
    <div className="fixed w-full z-50">
      <div className="bg-teal-200 lg:py-2.5 py-1">
        <div className="lg:w-1/3 flex justify-around items-center mx-auto">
          <Link to='/' className="text-neutral-900 hover:text-teal-800 lg:text-lg text-sm transition-colors">Home</Link>
          <Link to='/forum' className="text-neutral-900 hover:text-teal-800 lg:text-lg text-sm transition-colors">Forum</Link>
          <div className="relative flex items-center transition-colors duration-300 ease-in-out"
            onMouseEnter={() => dispatch(toggleGenresDropdown(true))}
            onMouseLeave={() => dispatch(toggleGenresDropdown(false))}>
            <Link to='/' className="text-neutral-900 relative hover:text-teal-800 lg:text-lg text-sm transition-colors">Genres</Link>
            {isGenresDropdownVisible && (
              <div className="bg-teal-200 absolute left-1/2 transform -translate-x-1/2 top-full lg:text-lg text-sm whitespace-nowrap z-5 flex flex-col rounded-md items-center lg:pb-3 pb-1">
                  {genres.map((genre, index) => (
                      <div
                          key={index}
                          className={`text-neutral-900 hover:text-teal-800 cursor-pointer flex flex-col items-center transition-colors break-words lg:px-4 lg:pt-2 ${selectedGenre === genre ? 'text-teal-900' : ''}`}
                          onClick={() => dispatch(setSelectedGenre(genre))}
                      >
                          {genre}
                      </div>
                      ))}
              </div>
            )}
          </div>
          {!token &&
            <>
              <div>
                <Link to='/register' className="text-neutral-900 hover:text-teal-800 lg:text-lg text-sm transition-colors">Register</Link>
              </div>
              <div>
                <Link to='/login' className="text-neutral-900 hover:text-teal-800 lg:text-lg text-sm transition-colors">Login</Link>
              </div>
            </>
          }
          {token && (
            <div className="relative flex items-center transition-colors duration-300 ease-in-out"
              onMouseEnter={() => dispatch(toggleProfileDropdown(true))}
              onMouseLeave={() => dispatch(toggleProfileDropdown(false))}>
              <Link to='/profile' className="text-neutral-900 hover:text-teal-800 lg:text-lg text-sm transition-colors">Profile</Link>
              {isProfileDropdownVisible && (
                <div className="bg-teal-200 absolute left-1/2 transform -translate-x-1/2 lg:mt-60 mt-32 lg:text-lg text-sm whitespace-nowrap z-5 flex flex-col rounded-md items-center lg:pb-5 pb-1">
                  <button onClick={handleDeleteAccount} className="text-neutral-900 hover:text-teal-800 lg:px-4 lg:pt-4 px-1 pt-1">Delete Account</button>
                  <Link to='/chat' className="text-neutral-900 hover:text-teal-800 lg:px-4 lg:pt-6 px-1 pt-2">Chat</Link>
                  <button onClick={handleLogout} className="text-neutral-900 hover:text-teal-800 lg:px-4 lg:pt-6 px-1 pt-2">Logout</button>
                  <Link to='/account-settings' className="text-neutral-900 hover:text-teal-800 lg:px-4 lg:pt-6 px-1 pt-2">Account Settings</Link>
                </div>
              )}
            </div>
          )}
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="absolute lg:top-20 lg:left-12 top-10 left-4 h-36 w-auto bg-neutral-300 lg:p-8 p-4 lg:shadow-lg shadow-sm z-10 lg:rounded-xl rounded-lg"
          overlayClassName="content-none"
        >
          <h2 className="text-neutral-950 lg:text-lg lg:mx-8 text-sm text-center mx-2">Are You Sure?</h2>
          <div className="flex justify-between lg:mt-5 mt-2">
            <button onClick={confirmDeleteAccount} className="delete-button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Yes
            </button>
            <button onClick={closeModal} className="update-button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              No
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;