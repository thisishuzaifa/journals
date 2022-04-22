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
                      {image.comments && image.comments.map(cm => (
                        <div>
                          <Button onClick={() => addToBucket(cm.PK, cm.SK)} size="small">Add to Bucket</Button>
                          <Button onClick={() => removeFromBucket(cm.PK, cm.SK)} size="small">Remove from bucket</Button>
                          <p>{cm.commentText}</p>
                        </div>
                      ))}
                    </div>
                    <div className="post-btns">
                      {user && <Button size="small" onClick={() => setUpdatedPost(true)}>Edit Post</Button >}
                      {user && <Button size="small" onClick={() => deletePost(image.imageName, image.id, user.username)}>Delete Post</Button >}
                    </div>
                  </div>
                  {
                    user && updatedPost && <form className="post-form" onSubmit={editPost}>
                      <input onChange={fileSelected} type="file" accept="image/*"></input>

                      <input onChange={e => setUpdatedPostText({ postText: e.target.value, postId: image.id })} type="text" placeholder="description"></input>
                      <button type="submit">Update Post</button>
                    </form>
                  }
                  {
                    user && updatedPost && <form className="post-form" onSubmit={editPost}>
                      <input onChange={fileSelected} type="file" accept="image/*"></input>
                      <input onChange={e => setUpdatedPostText({ postText: e.target.value, postId: image.id })} type="text" placeholder="description"></input>
                      <button type="submit">Update Post</button>
                    </form>
                  }
                  {
                    user && <form className="post-form" onSubmit={addToBucket}>
                      <button type="submit">Add to Bucket List</button>
                    </form>
                  }
                  {
                    user && <form className="post-form" onSubmit={removeFromBucket}>
                      <button type="submit">Remove from Bucket List</button>
                    </form>
                  }
                </div>
              ))
            }
          </div>
        )}
      </Authenticator>
    </>
  )
}



export default App;
