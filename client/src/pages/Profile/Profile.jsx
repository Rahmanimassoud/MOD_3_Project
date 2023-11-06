import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { updateUserSuccess, updateUserFailuer, updateUserStart, deleteUserFailuer, deleteUserStart, deleteUserSuccess, logOutUserStart, logOutUserFailuer, logOuteUserSuccess } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { app } from '../../firebase';
import axios from 'axios';


const Profile = () => {

    const {currentUser} = useSelector(state => state.user)
    const fileRef = useRef(null)
    const [file, setFile] = useState(undefined);
    console.log(file, "this is file");
    const [imageLoading, setImageLoading] = useState(0)
    console.log(imageLoading);
    const [fileError, setFileError] = useState(false)
    console.log(fileError, 'this the file errorr');
    const [formData, setFormData] = useState({
    })
    console.log(formData);

    const dispatch = useDispatch(); 

    useEffect(()=> {
        if(file) {
            handleFileUpload(file);
        }

    }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
            setImageLoading(Math.round(progress) + '% done')
        },
        (error) => {
            setFileError(true);
            console.log(error);
        },
        ()=> {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                setFormData({...formData, avatar: downloadUrl})

            })
        }
        
        );

    }

    const handleChange = (e)=> {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    // console.log(currentUser);

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            dispatch(updateUserStart())
            const response = await axios.post(`/server/update/${currentUser._id}`, {
                formData
            //   name: response.user.displayName,
            //   email: response.user.email,
            //   password: response.user.password
            }, {
              headers: {
                'Content-Type': 'application/json',
              }
            });
            const data = response.data;
            if(data.success === false) {
                dispatch(updateUserFailuer(data.message))
                return;
            }
            dispatch(updateUserSuccess(data));
          } catch (error) {
            dispatch(updateUserFailuer(error.message))
          }
    }


    const handleUserDelete = async () => {

        try{
            dispatch(deleteUserStart())
            const response = await axios({
                method: "DELETE",
                url: `/server/delete/${currentUser._id}`
            })
            const data = response.data;
            if(data.success === false) {
                dispatch(updateUserFailuer(data.message))
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch(err) {
            console.log(err);
            dispatch(deleteUserFailuer(err.message))
        }
    }

    const handleSignOut = async () => {
        try{
            dispatch(logOutUserStart())
            const res = await axios({
                method: "GET",
                url: '/server/signout'
            })
            const data = res.data;
            if(data.success === false) {
                dispatch(logOutUserFailuer(data.message))
                return;
            }
            dispatch(logOuteUserSuccess(data))
        } catch(error) {
            console.log(error);
            dispatch(logOutUserFailuer(error.message))
        }

    }


    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className="text-3xl font-semibold text-center">Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col mt-2 gap-4'>
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
                <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} alt="profile" />


                    {/* the p tag is not showing the text */}
                <p className='text-sm self-center'>
                    {fileError ? (
                    <span className='text-red-700'>
                    Error Image upload (image must be less than 2 mb)
                    </span>
                    ) : imageLoading > 0 && imageLoading < 100 ? (
                    <span className='text-slate-700'>{`Uploading ${imageLoading}%`}</span>
                    ) : imageLoading === 100 ? (
                    <span className='text-green-700'>Image successfully uploaded!</span>
                    ) : (
                    ''
                    )}
                </p>

                <input type="text" placeholder="username"
                className="border p-3 rounded-lg"
                id='username'
                defaultValue={currentUser.userName}
                onChange={handleChange}
                
                />

                <input type="email" placeholder="email"
                className="border p-3 rounded-lg"
                id='email'
                defaultValue={currentUser.email}
                onChange={handleChange}
                />

                <input type="password" placeholder="password"
                className="border p-3 rounded-lg"
                id='password'
                onChange={handleChange}
                />
                <button className="bg-slate-500 text-white font-semibold border rounded-lg p-3 uppercase hover:bg-opacity-80 disabled:opacity-80">Update</button>
                <Link className='bg-green-300 text-white font-semibold border rounded-lg p-3 uppercase hover:bg-opacity-80 disabled:opacity-80 text-center' to={"/create-listing"}>
                    List a Property
                </Link>

            </form>
            <div className='flex justify-between mt-3'>
                <button onClick={handleUserDelete}
                className='text-red-700 border rounded-lg p-3 cursor-pointer'>Delete Account</button>
                <button onClick={handleSignOut}
                className='text-slate-500 border rounded-lg p-3 cursor-pointer'>Sign Out</button>
            </div>
        </div>
    )
};

export default Profile;
