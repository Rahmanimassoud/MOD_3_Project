import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleclick = async ()=> {

        try{
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)
            console.log(result);

            // const response = await fetch('/server/google', {
            //     method: "POST",
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({name: result.user.displayName, email: result.user.email, image: result.user.photoURL}),
            // })
            // const data = await response.json()
            // dispatch(signInSuccess(data));

            const response = await axios.post('/server/google', {
                name: result.user.displayName,
                email: result.user.email,
                image: result.user.photoURL,
              }, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const data = response.data;
              dispatch(signInSuccess(data));
              navigate('/')
        } catch (error) {
            console.log("error while signing with google", error);
        }

    }



    return (
        <button onClick={handleclick} type="button" className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Continue with Google
        </button>
    )
};

export default OAuth;
