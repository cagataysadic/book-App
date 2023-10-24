import { useEffect } from 'react';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import "../styles/Animation.scss";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createUserBook, deleteUserBook, fetchUserBooks, setAuthor, setDescription, setGenre, setTitle, setUpdateBook, updateUserBook } from '../slice/profile/profileSlice';


const Profile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const books = useSelector((state: RootState) => state.profile.books);
    const { title, author, description, genre, updateBook } = useSelector((state: RootState) => state.profile);
    
    const maxTitleLength = 40;
    const maxAuthorLength = 40;
    const maxDescritionLength = 200;


    const genres = ['Mystery', 'Fantasy', 'Romance', 'Sci-Fi', 'Thriller', 'Biography', 'Literature', 'Social-Science'];

    
    useEffect(() => {
        dispatch(fetchUserBooks());
    }, [dispatch]);

    const initMasonry = () => {
        const grid = document.querySelector('.list-masonry');
        if (grid) {
            imagesLoaded(grid, function () {
                new Masonry(grid, {
                  itemSelector: '.list-item-wrapper',
                  columnWidth: '.list-item-wrapper',
                  gutter: 20,
                  percentPosition: true,
                });
            });
        }  
    };

    useEffect(() => {
        if (books.length > 0) {
            initMasonry();
        }
    
        const observer = new MutationObserver(initMasonry);
        const observedElement = document.querySelector('.list-masonry')
        if (observedElement) {
            observer.observe(observedElement, {
                childList: true,
                subtree: true,
            });
        }
        return () => {
            observer.disconnect();
        };
    }, [books]);
      

    useEffect(() => {
        if (updateBook) {
            dispatch(setTitle(updateBook.title));
            dispatch(setAuthor(updateBook.author));
            dispatch(setDescription(updateBook.description));
            dispatch(setGenre(updateBook.genre));
        } else {
            dispatch(setTitle(''));
            dispatch(setAuthor(''));
            dispatch(setDescription(''));
        }
    }, [updateBook, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (updateBook) {
                dispatch(updateUserBook({bookId: updateBook._id, title, author, description, genre }))
            } else {
                dispatch(createUserBook({title, author, description, genre}))
            }
            dispatch(setTitle(''));
            dispatch(setAuthor(''));
            dispatch(setDescription(''));
            dispatch(setGenre(''));
            dispatch(setUpdateBook(null));
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelUpdate = () => {
        dispatch(setTitle(''));
        dispatch(setAuthor(''));
        dispatch(setDescription(''));
        dispatch(setGenre(''));
        dispatch(setUpdateBook(null));
    };

    const handleDelete= async (id: string) => {
        try {
            dispatch(deleteUserBook({id}))
            dispatch(setUpdateBook(null));
        } catch (error) {
            console.log(error);
        }
    };

    const formatDate = (timestamp: string | number) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };
    
    const sortedBooks = [...books].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return Number(dateB) - Number(dateA);
      });
    
      const genreAnimationName = (genre: string) => {
        switch (genre) {
            case 'Mystery':
                return 'rotateMysteryColor';
            case 'Fantasy':
                return 'rotateFantasyColor';
            case 'Romance':
                return 'rotateRomanceColor';
            case 'Sci-Fi':
                return 'rotateSci-FiColor';
            case 'Thriller':
                return 'rotateThrillerColor';
            case 'Biography':
                return 'rotateBiographyColor';
            case 'Literature':
                return 'rotateLiteratureColor';
            case 'Social-Science':
                return 'rotateSocial-ScienceColor';
            default:
                return 'rotateDefaultColor';
        }
    }

    return (
        <div className="bg-neutral-100 min-h-screen lg:pt-8 pt-3 flex flex-col">
            <h1 className="text-neutral-900 text-center lg:text-4xl text-lg lg:mb-2 mb-1 mt-5 lg:mt-10">Welcome to Your Profile Page!</h1>
            <h2 className="text-neutral-900 text-center lg:text-2xl text-md lg:mb-5 mb-2 lg:mt-4 mt-2">Share a New Book</h2>
            <form className='flex flex-col items-center lg:mb-5 mb-2' onSubmit={handleSubmit}>
                <label className='flex flex-col lg:mb-2.5 mb-1 hover:shadow-lg'>
                    <textarea className="outline-teal-500 focus:caret-teal-600 rounded-xl bg-teal-200 text-teal-900 lg:max-w-xl max-w-md lg:p-4 p-2 lg:text-base text-sm resize-y" placeholder='Title...' value={title} maxLength={maxTitleLength} onChange={(e) => dispatch(setTitle(e.target.value))} required />
                </label>
                <label className='flex flex-col lg:mb-2.5 mb-1 hover:shadow-lg'>
                    <textarea className="outline-teal-500 focus:caret-teal-600 rounded-xl bg-teal-200 text-teal-900 lg:max-w-xl max-w-md lg:p-4 p-2 lg:text-base text-sm resize-y" placeholder='Author...' value={author} maxLength={maxAuthorLength} onChange={(e) => dispatch(setAuthor(e.target.value))} required />
                </label>
                <label className='flex flex-col lg:mb-2.5 mb-1 hover:shadow-lg'>
                    <textarea className="outline-teal-500 focus:caret-teal-600 rounded-xl bg-teal-200 text-teal-900 lg:max-w-xl max-w-md lg:p-4 p-2 lg:text-base text-sm resize-y" placeholder='Description...' value={description} maxLength={maxDescritionLength} onChange={(e) => dispatch(setDescription(e.target.value))} required />
                </label>
                <label className='flex flex-col lg:mb-2.5 mb-1 hover:shadow-lg'>
                    <select value={genre} className="outline-teal-500 focus:caret-teal-600 rounded-xl bg-teal-200 text-teal-900 lg:max-w-xl max-w-md lg:p-4 p-2 lg:text-base text-sm resize-y" onChange={(e) => dispatch(setGenre(e.target.value))} required>
                        <option value="">Select genre...</option>
                        {genres.map((g, index) => <option key={index} value={g}>{g}</option>)}
                    </select>
                </label>
                <div className='flex'>
                    <button className="update-button" type="submit">{updateBook ? 'Update' : 'Create'}</button>
                    <button className="delete-button" type="button" onClick={handleCancelUpdate}>Cancel</button>
                </div>
            </form>
            <h2 className="text-center lg:text-4xl text-lg text-neutral-900 lg:mb-10 mb-5">Your Previous Books</h2>
            <ul className="list-masonry mx-auto">
                {sortedBooks.map((book) => (
                    <div key={book._id} className='list-item-wrapper'>
                        <li className="bg-neutral-200 text-neutral-900 lg:rounded-xl rounded-2xl break-words lg:w-96 w-72 lg:p-3.5 p-2 transition-all duration-300 rotating-border"
                            style={{animationName: genreAnimationName(book.genre)}}
                        >
                            <h3 className="lg:text-base text-center text-sm break-all">{book.title}</h3>
                            <h3 className="lg:text-sm text-xs lg:mb-2 mb-1">{book.author}</h3>
                            <p className="lg:text-sm text-xs lg:mb-2 mb-1">{book.description}</p>
                            <h3 className="lg:text-sm text-xs lg:mb-2 mb-1">{book.genre}</h3>
                            <p className="lg:text-lg text-xs lg:mb-2 mb-1">{book.userId.userName}</p>
                            <p className="text-xs lg:mb-2 mb-1">Created At: {formatDate(book.createdAt)}</p>
                            {book.updatedAt && <p className="text-xs lg:mb-2 mb-1">updated At: {formatDate(book.updatedAt)}</p>}
                            <div className='flex justify-center'>
                                <button className="delete-button" onClick={() => handleDelete(book._id)}>Delete</button>
                                <button className="update-button" onClick={() => dispatch(setUpdateBook(book))}>Update</button>
                            </div>
                        </li>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default Profile;