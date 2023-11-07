
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../../firebase";
import axios from "axios";
import {useSelector} from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";


const UpdateListing = () => {
    const {currentUser} = useSelector(state => state.user)
    const navigate = useNavigate();
    const params = useParams();


    const [files, setFiles] = useState([]);
    // console.log(files);

    const [formData, setFormData] = useState({
        imageUrl: [],
        name: "",
        description: "",
        address: "",
        regularPrice: 0,
        discountPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        offer: false,
        petsAllowed: false,
        type:"rent",
    })
    // console.log(formData);

    const [imageUploadError, setImageUploadError] = useState(false)

    const [uploading, setUploading] = useState(false)

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    // useEffect(()=> {
    //     const fetchListing = async () => {
    //         const listingId = params.listingId;
    //         // console.log(listingId);
    //         const res = await axios.get(`/server/getListing/${listingId}`);
    //         const data = await res.data;
    //         console.log(data, "use effect data");
            
    //         // if(data.success === false) {
    //         //     console.log(data.message);
    //         //     return;
    //         // }
    //         if (data && data.success !== false) {
    //             setFormData({
    //                 address: data.address || "",
    //                 bathrooms: data.bathrooms || 1,
    //                 bedrooms: data.bedrooms || 1,
    //                 description: data.description || "",
    //                 discountPrice: data.discountPrice || 0,
    //                 furnished: data.furnished || false,
    //                 imageUrl: data.imageUrl || [],
    //                 name: data.name || "",
    //                 offer: data.offer || false,
    //                 petsAllowed: data.petsAllowed || false,
    //                 regularPrice: data.regularPrice || 0,
    //                 type: data.type || "rent",
    //                 updatedAt: data.updatedAt || "",
    //                 userRef: data.userRef || ""
    //             });
    //             console.log(formData);
    //         }
    //     fetchListing();

    // }, [])

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await axios.get(`/server/getListing/${listingId}`);
            const data = res.data;
            // console.log(data, "use effect data");
    
            if (data && data.success !== false) {
                setFormData({
                    address: data.address || "",
                    bathrooms: data.bathrooms || 1,
                    bedrooms: data.bedrooms || 1,
                    description: data.description || "",
                    discountPrice: data.discountPrice || 0,
                    furnished: data.furnished || false,
                    imageUrl: data.imageUrl || [],
                    name: data.name || "",
                    offer: data.offer || false,
                    petsAllowed: data.petsAllowed || false,
                    regularPrice: data.regularPrice || 0,
                    type: data.type || "rent",
                    updatedAt: data.updatedAt || "",
                    userRef: data.userRef || ""
                });
                // console.log(formData);
            }
        };
    
        fetchListing();
    }, []);


    const handleImageSubmit = (e) => {
        e.preventDefault();

        // make sure there is a image to submit
        if(files.length > 0 && files.length + formData.imageUrl.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i<files.length; i++){
                promises.push(storeImage(files[i]))
            }
            console.log(promises, "this is the array of images");

            Promise.all(promises).then((urls)=> {
                setFormData({
                    ...formData,
                    imageUrl: formData.imageUrl.concat(urls),
                });
                setImageUploadError(false)
                setUploading(false)
            }).catch((err)=> {
                setImageUploadError("Image upload failed, 2 mb max per image", err);
                setUploading(false)
            }
            )
        } else {
            setImageUploadError("You can only upload 6 images")
            setUploading(false)
        }
    };

    const storeImage = async (eachFile) => {
        return new Promise((resolve, reject)=> {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + eachFile.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, eachFile);
            uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error)=> {
                reject(error);
            },
            ()=> {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> {
                    resolve(downloadURL)
                })
            }
            )
        })

    }

    // Image delete function
    const DeleteImage = (idx) => {
        setFormData({
            ...formData,
            imageUrl: formData.imageUrl.filter((_, i) => i !== idx)
        })
    }

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        if(e.target.id === 'petsAllowed' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            if(formData.imageUrl.length < 1) return setError("must at least upload one image")
            if(+formData.regularPrice < +formData.discountPrice) return setError("Discount price must be less than regular price")
            setLoading(true);
            setError(false)
            const res = await axios({
                method: "POST",
                url: `/server/listing/update/${params.listingId}`,
                data: {
                    ...formData,
                    userRef: currentUser._id
                }
            })
            const data = res.data; 
            setLoading(false)
            if(data.success === false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)

        } catch (error) {
            setError(error.message);
            setLoading(false)
        }
    }



    return (
        <main className="p-5 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Update this property</h1>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                {/* left side */}
                <div className="flex flex-col gap-4 flex-1">
                    <input onChange={handleChange}
                    value={formData.name}
                    type="text" 
                    placeholder="Name" 
                    className="border p-3 rounded-lg"  
                    id="name" 
                    maxLength="65" 
                    minLength="10" 
                    required/>

                    <textarea onChange={handleChange}
                    value={formData.description}
                    type="text" 
                    placeholder="Description" 
                    className="border p-3 rounded-lg"  
                    id="description" 
                    required/>

                    <input onChange={handleChange}
                    value={formData.address}
                    type="text" 
                    placeholder="Address" 
                    className="border p-3 rounded-lg"  
                    id="address" 
                    required/>
                    
                    {/* check boxes section */}
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex gap-2">
                            <input onChange={handleChange}
                            checked={formData.type === "sale"}
                            type="checkbox" 
                            id="sale" 
                            className="w-5"/>
                            <span>Sell</span>
                        </div>

                        <div className="flex gap-2">
                            <input onChange={handleChange}
                            checked={formData.type === "rent"}
                            type="checkbox" 
                            id="rent" 
                            className="w-5"/>
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-2">
                            <input onChange={handleChange}
                            checked={formData.petsAllowed}
                            type="checkbox" 
                            id="petsAllowed" 
                            className="w-5"/>
                            <span>Pets allowed</span>
                        </div>

                        <div className="flex gap-2">
                            <input onChange={handleChange}
                            checked={formData.furnished}
                            type="checkbox" 
                            id="furnished" 
                            className="w-5"/>
                            <span>Furnished</span>
                        </div>
                        
                        <div className="flex gap-2">
                            <input onChange={handleChange}
                            checked={formData.offer} 
                            type="checkbox" 
                            id="offer" 
                            className="w-5"/>
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className=" flex flex-wrap gap-5">
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange}
                            value={formData.bedrooms}
                            className="p-2 border border-gray-500 rounded-lg" 
                            type="number" 
                            id="bedrooms" 
                            min="1" 
                            max="10" 
                            required/>
                            <p>Beds</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input onChange={handleChange}
                            value={formData.bathrooms}
                            className="p-2 border border-gray-500 rounded-lg" 
                            type="number" 
                            id="bathrooms" 
                            min="1" 
                            max="10" 
                            required/>
                            <p>Baths</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input onChange={handleChange}
                            value={formData.regularPrice}
                            className="p-2 border border-gray-500 rounded-lg" 
                            type="number" 
                            id="regularPrice" 
                            min="10" 
                            max="1000000" 
                            required/>
                            <div  className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-sm">($ / month)</span>
                            </div>
                        </div>

                        {formData.offer && (
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange}
                            value={formData.discountPrice}
                            className="p-2 border border-gray-500 rounded-lg" 
                            type="number" 
                            id="discountPrice" 
                            min="0" 
                            max="100000" 
                            required/>
                            <div className="flex flex-col items-center">
                                <p>Discount Price</p>
                                <span className="text-sm">($ / month)</span>
                            </div>
                        </div>
                        )}
                    </div>

                </div>

                {/* right side */}
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images: <span className="font-normal text-gray-400 ml-2">The first image will be the cover</span> </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files)}
                        className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple/>
                        <button type="button" onClick={handleImageSubmit} disabled={uploading}
                        className="p-3 text-green-500 border rounded border-green-700 uppercase hover:shadow-lg disabled:opacity-80">{uploading ? "Uploading..." : "Upload"}</button>
                    </div>
                        <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                        {
                            formData.imageUrl.length > 0 && formData.imageUrl.map((url, idx)=> (
                                <div key={url} className="flex justify-between p-2 border items-center">
                                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                                <button onClick={()=> DeleteImage(idx)} type="button"
                                className="text-red-700 rounded-lg hover:shadow-xl uppercase hover:opacity-95">Delete</button>
                                </div>
                            ))
                        }
                    <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-75 disabled:opacity-80">
                        {
                            loading ? "Updating" : "Update Listing"
                        }
                    </button>
                    {
                        error && <p className="text-red-700 text-sm">{error}</p>
                    }
                </div>

            </form>
        </main>
    )
};


export default UpdateListing;
