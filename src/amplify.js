import Amplify, { API, Storage } from "aws-amplify";
import awsmobile from "./aws-exports";

Amplify.configure(awsmobile);

const apiName = "journalAPI";

function randomString(bytes = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)))
    .map((b) => b.toString(16))
    .join("");
}

export async function uploadImage(image) {
  const result = await Storage.put(randomString(), image);
  return result;
}

export async function getImage(item) {
  const url = await Storage.get(item);
  return url;
}

export async function deleteImage(item) {
  const url = await Storage.remove(item);
  return url;
}


export async function getPosts() {
    const path = '/posts'
    const result = await API.get(apiName, path)
    return await Promise.all(result.Items.map(async item => {
      const imageUrl = await Storage.get(item.imageName);
      return {
        ...item,
        imageUrl
      }
    }))
  }
export async function createPost(description, file) {
    const { key } = await Storage.put(randomString(), file);
    const path = '/posts/create'
    const result = await API.post(apiName, path, {
      body: {
        imageName: key,
        description
      }
    })
    console.log(result)
    return result
  }

export async function updatePost(id, username, description, imageName) {
  const path = "/posts/update";
  const data = await API.post(apiName, path, {
    body: {
      id,
      username,
      description,
      pictures: imageName,
    },
  });
  return data;
}

export async function deletePost(id) {
    const path = "/posts/delete";
    const data = await API.post(apiName, path, {
        body: {
        id,
        },
    });
    return data;
}

