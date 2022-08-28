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

  useEffect(() => {
    getPosts()
  }, [])

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
    console.log("Id passed on" + id)
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
    setBucketList(true)
    console.log(result)
    getPosts()

  }

  const removeFromBucket = async event => {
    event.preventDefault()
    const result = await amplify.removePostFromBucketList()
    console.log(result)
    getPosts()
  }

  const updatePost = async event => {
    event.preventDefault()
    const result = await amplify.updatePost(updatedPostText.postId, updatedPostText.postText)
    console.log(result)
    setUpdatedPost(false)
    getPosts()
  }


  return(
    <>
      <Authenticator className="loginWindow">
        {({ signOut, user }) => (
          <div className="App">
            <div className="top-section">
              <form className="post-form" onSubmit={createPost}>
                <input onChange={fileSelected} type="file" accept="image/*"></input>
                <input onChange={e => setDescription(e.target.value)} type="text" placeholder="description"></input>
                <button type="submit">Upload</button>
              </form>
              <Button onClick={signOut} size="small" type="submit" className="signout-btn">Sign Out</Button>
            </div>
            {
              arrayOfImages && arrayOfImages.map(image => (
                <div className="post-container" key={image.key} >
                  {/* <p>{image.SK}</p> */}
                  <div className="post-img-btns-container">
                    <div className="img-descr">
                      <img className="post-img" src={image.imageUrl}></img>
                      {image.description && <p className="post-description">{image.description}</p>}
                    </div>
                    <div className="img-btns">
                      <Button onClick={() => deletePost(image.imageUrl, image.key, user.username)} size="small" type="submit" className="signout-btn">Delete</Button>
                      <Button onClick={() => setUpdatedPostText({ postText: image.description, postId: image.key })} size="small" type="submit" className="signout-btn">Edit</Button>
                    </div>
                  </div>
                </div>
              ))
            }
            {
              updatedPost &&
              <div className="post-container">
                <form className="post-form" onSubmit={editPost}>
                  <input onChange={e => setUpdatedPostText({ postText: e.target.value, postId: updatedPostText.postId })} type="text" placeholder="description"></input>
                  <button type="submit">Edit</button>
                </form>
              </div>
            }
            {
              bucketList &&
              <div className="post-container">
                <form className="post-form" onSubmit={addToBucket}>
                  <input onChange={e => setUpdatedPostText({ postText: e.target.value, postId: updatedPostText.postId })} type="text" placeholder="description"></input>
                  <button type="submit">Add to Bucket List</button>
                </form>
              </div>
            }
          </div>
        )}
      </Authenticator>
    </>
  )
}

export default App;


