import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommentPart from './CommentPart';
import "../styles/Animation.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { createUserComment, fetchUserComments } from "../slice/comment/commentsSlice";


const CommentsSection: React.FC<{postId: string}> = ({ postId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { token, userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
    const comments = useSelector((state: RootState) => state.comments.commentsByPostId[postId]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = useCallback(async () => {
         await dispatch(fetchUserComments(postId));
    }, [postId])

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const navigate = useNavigate();

    const isUserAuthenticated = () => {
        return token !== null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUserAuthenticated()) {
            try {
                await dispatch(createUserComment({postId, commentText: newComment}))
                setNewComment('');
                fetchComments();
            } catch (error) {
                console.log(error);
            }
        } else {
            navigate('/login');
        }
    };

  return (
    <div className="bg-neutral-300 lg:p-4 p-1 rounded-xl lg:mt-2 mt-1 flex-wrap">
        <h3 className="text-neutral-950 lg:text-xl text-sm lg:mb-2 mb-1">Comments</h3>
        {comments && comments.map((comment) => (
            <CommentPart key={comment._id} comment={comment} postId={postId} refreshComments={fetchComments} userId={userId} />
        ))}
        <form className="flex items-center justify-between w-full" onSubmit={handleSubmit}>
            <textarea
                className="outline-teal-200 focus:caret-teal-800 bg-teal-100 lg:w-72 w-44 p-1 text-sm rounded text-teal-950 hover:shadow-lg hover:shadow-teal-600 placeholder:text-teal-950"
                placeholder="Write a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="update-button" onClick={() => {
                if (!isLoggedIn) {
                    navigate('/register')
                }
            }}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Send
            </button>
        </form>
    </div>
  )
}

export default CommentsSection;