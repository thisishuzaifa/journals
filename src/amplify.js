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


  export async function createPost(file, description) {
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


  export async function updatePost(pId, description) {
    const postId = (pId).replace("POST#", "")

    const path = `/posts/update/${postId}`
    console.log('path for del url: ' + path)
    const result = await API.put(apiName, path, {
      body: {
        description,
      }
    })
    console.log(result)
    return result;
  }

export async function deletePost(pId) {
    const postId = (pId).replace("POST#", "")
    const path = `/posts/delete/${postId}`;
    const result = await API.del(apiName, path)
    console.log(result)
    return result;

}

export async function getBucketListPosts() {
    const path = "/posts/bucketList";
    const result = await API.get(apiName, path)
    return await Promise.all(result.Items.map(async item => {
      const imageUrl = await Storage.get(item.imageName);
      return {
        ...item,
        imageUrl
      }
    }))
}

export async function addPostToBucketList(id) {
    const path = "/posts/bucketList/:id";
    const result = await API.put(apiName, path, {
        body: {
        id,
        },

    });
    return result;
}

export async function removePostFromBucketList(id) {
    const path = "/posts/bucketList/:id";
    const result = await API.delete(apiName, path, {
        body: {
        id,
        },
    });
    return result;
}
