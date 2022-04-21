import logo from './logo.svg';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import * as amplify from './amplify'
import { Button,  Authenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react'





function App() {

  const [file, setFile] = useState()
  const [imgUrl, setImgUrl] = useState([])
  const [description, setDescription] = useState("")
  const [arrayOfImages, setArrayOfImages] = useState([])
  const [bucketList, setBucketList] = useState(false)
  const [updatedPost, setUpdatedPost] = useState(false)
  const [updatedPostText, setUpdatedPostText] = useState({ postText: "", postId: "" })


  const uploadImage = async event => {
    event.preventDefault()
    const result = await amplify.uploadImage(file)
    const url = await amplify.getImage(result.key)
    console.log(url)
    // setImgUrl(url)
    setImgUrl([url, ...imgUrl])
    console.log(imgUrl)
  }

  async function getPosts(){
    const result = await amplify.getPosts()
    console.log(result)
    setArrayOfImages(result)
  }

  const editPost = async event => {
    event.preventDefault()
    console.log(updatedPostText)
    const result = await amplify.updatePost(updatedPostText.postId, updatedPostText.postText)
    console.log(result)
    getPosts()
  }

  async function deletePost(imageName, id, username) {
    console.log("VALUE OF ID PASSED FROM BTN CLICK " + id)
    const result = await amplify.deletePost(imageName, id, username)
    console.log('after deleting image ' + result)
    getPosts()

  }

  const fileSelected = event => {
    const file = event.target.files[0]
    setFile(file)
  }

  async function getImages() {
    const url = await amplify.getImage()
    console.log('after loading page ' + url)
    setImgUrl(url)
  }

  const createPost = async event => {
    event.preventDefault()
    const result = await amplify.createPost(file, description)
    console.log(result)
    getPosts()
  }

  const addToBucket = async event => {
    event.preventDefault()
    const result = await amplify.addPostToBucketList()
    console.log(result)
    getPosts()

  }

  const removeFromBucket = async event => {
    event.preventDefault()
    const result = await amplify.removePostFromBucketList()
    console.log(result)
    getPosts()
  }

  useEffect(() => {
    getPosts()
  }, [])


//this is a journaling app
//Allow user to make a post with an image and a description
//Allow user to edit and delete a post
//Only authenticated users can use the app
//If the user is not logged in ask to sign in
//Use authenticator component
//Use functions from amplify.js


  return(
    <>
    <Authenticator className="loginWindow">
        {({ signOut, user }) => (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit, Delete, and View Posts
              </p>
              <p>
                {user ? `Welcome ${user.username}` : 'Please sign in'}
              </p>
              <Button onClick={signOut}>Sign Out</Button>
            </header>
            <div className="App-body">
              <div className="App-body-left">
                <form onSubmit={createPost}>
                  <input type="file" onChange={fileSelected} />
                  <input type="text" placeholder="Description" onChange={event => setDescription(event.target.value)} />
                  <button type="submit">Upload</button>
                </form>
                <form onSubmit={addToBucket}>
                  <button type="submit">Add to Bucket List</button>
                </form>
                <form onSubmit={removeFromBucket}>
                  <button type="submit">Remove from Bucket List</button>
                </form>
              </div>
              <div className="App-body-right">
                <div className="App-body-right-top">
                  <div className="App-body-right-top-left">
                    <img src={imgUrl} alt="image" />
                  </div>
                  <div className="App-body-right-top-right">
                    <form onSubmit={editPost}>
                      <input type="text" placeholder="Edit Description" onChange={event => setUpdatedPostText({ postText: event.target.value, postId: updatedPostText.postId })} />
                      <button type="submit">Edit</button>
                    </form>
                    <form onSubmit={deletePost}>
                      <button type="submit">Delete</button>
                    </form>
                  </div>
                </div>
                <div className="App-body-right-bottom">
                  <form onSubmit={getImages}>
                    <button type="submit">Get Images</button>
                  </form>
                  <form onSubmit={getPosts}>
                    <button type="submit">Get Posts</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </Authenticator>

    </>
  )
}


export default App;
