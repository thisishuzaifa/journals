import React, { useState, useEffect } from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import * as amplify from './amplify';
import { Button, Authenticator } from '@aws-amplify/ui-react';

// Image Upload Form Component
function ImageUploadForm({ onFileSelected, onDescriptionChange, onSubmit }) {
  return (
    <form className="post-form" onSubmit={onSubmit}>
      <input onChange={onFileSelected} type="file" accept="image/*"></input>
      <input onChange={onDescriptionChange} type="text" placeholder="description"></input>
      <button type="submit">Upload</button>
    </form>
  );
}

// Post Component
function Post({ image, onDelete, onEdit }) {
  return (
    <div className="post-container" key={image.key}>
      <div className="post-img-btns-container">
        <div className="img-descr">
          <img className="post-img" src={image.imageUrl} alt="post"></img>
          {image.description && <p className="post-description">{image.description}</p>}
        </div>
        <div className="img-btns">
          <Button onClick={() => onDelete(image.imageUrl, image.key)} size="small" type="submit" className="signout-btn">Delete</Button>
          <Button onClick={() => onEdit(image)} size="small" type="submit" className="signout-btn">Edit</Button>
        </div>
      </div>
    </div>
  );
}

// Edit Post Form Component
function EditPostForm({ post, onSubmit }) {
  const [editedDescription, setEditedDescription] = useState(post.description);

  const handleEditSubmit = (event) => {
    event.preventDefault();
    onSubmit(post.key, editedDescription);
  };

  return (
    <div className="post-container">
      <form className="post-form" onSubmit={handleEditSubmit}>
        <input
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          type="text"
          placeholder="description"
        ></input>
        <button type="submit">Edit</button>
      </form>
    </div>
  );
}

function App() {
  const [file, setFile] = useState();
  const [description, setDescription] = useState('');
  const [arrayOfImages, setArrayOfImages] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const result = await amplify.getPosts();
    setArrayOfImages(result);
  };

  const uploadImage = async (event) => {
    event.preventDefault();
    const result = await amplify.uploadImage(file);
    const url = await amplify.getImage(result.key);
    setArrayOfImages([{ imageUrl: url, description }, ...arrayOfImages]);
  };

  const deletePost = async (imageName, id) => {
    const result = await amplify.deletePost(imageName, id);
    getPosts();
  };

  const editPost = async (id, updatedDescription) => {
    const result = await amplify.updatePost(id, updatedDescription);
    getPosts();
  };

  return (
    <>
    <div className="login-container">
      <h2 className="login-header">Welcome to Journals</h2>
      <Authenticator className="loginWindow">
        {({ signOut, user }) => (
          <div className="App">
            <div className="top-section">
            <div className='signout-btn' >
            <Button onClick={signOut} size="small" type="submit">
                Sign Out
              </Button>
              </div>
              <ImageUploadForm
                onFileSelected={(e) => setFile(e.target.files[0])}
                onDescriptionChange={(e) => setDescription(e.target.value)}
                onSubmit={uploadImage}
              />

            </div>
            <div className="gallery">
            {arrayOfImages.map((image) => (
              <Post
                key={image.key}
                image={image}
                onDelete={deletePost}
                onEdit={(post) => setArrayOfImages(arrayOfImages.map((item) => (item.key === post.key ? { ...item, isEditing: !item.isEditing } : item)))}
              />
            ))}
            {arrayOfImages.map((image) =>
              image.isEditing ? (
                <EditPostForm key={image.key} post={image} onSubmit={editPost} />
              ) : null
            )}
            </div>
          </div>
        )}
      </Authenticator>
      </div>
    </>
  );
}

export default App;
