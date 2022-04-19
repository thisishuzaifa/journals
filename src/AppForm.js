import React, { useEffect } from 'react'
import { useState } from 'react'
import './App.css'
import * as amplify from './amplify'
import { Button, Loader, View, Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useAuthenticator } from '@aws-amplify/ui-react';


function AppForm(){
    const [description, setDescription] = useState('');
    const [image, setImage] = useState();

    //get username from signed in user

    const [username, setUsername] = useState('');


    const { user } = useAuthenticator((context) => [context.user]);



    const createPost = async (e) => {

        const imageUpload = await amplify.uploadImage(image);
        console.log(imageUpload);

        await amplify.createPost(user.username, description, imageUpload.key);

    }



    return (
        <div>
            <form onSubmit={createPost}>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}



export default AppForm;