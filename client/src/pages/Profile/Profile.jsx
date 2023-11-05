import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase';

const Profile = () => {

    const {currentUser} = useSelector(state => state.user)

    const fileRef = useRef(null)

    const [file, setFile] = useState(undefined);
    console.log(file);

    const [imageLoading, setImageLoading] = useState(0)
    console.log(imageLoading);

    const [fileError, setFileError] = useState(false)
    console.log(fileError, 'this the file errorr');

    const [formData, setFormData] = useState({

    })
    console.log(formData);

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


    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className="text-3xl font-semibold text-center">Profile</h1>
            <form className='flex flex-col mt-2 gap-4'>
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
                
                />

                <input type="email" placeholder="email"
                className="border p-3 rounded-lg"
                id='email'
                
                />

                <input type="password" placeholder="password"
                className="border p-3 rounded-lg"
                id='password'
                
                />
                <button className="bg-slate-500 text-white font-semibold border rounded-lg p-3 uppercase hover:bg-opacity-80 disabled:opacity-80">Update</button>

            </form>
            <div className='flex justify-between mt-3'>
                <button className='text-red-700 border rounded-lg p-3 cursor-pointer'>Delete Account</button>
                <button className='text-slate-500 border rounded-lg p-3 cursor-pointer'>Sign Out</button>
            </div>
        </div>
    )
};

export default Profile;
