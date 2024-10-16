import Api from "../services/axios"
import userRoutes from "../services/endpoints/userEndPoints"

export const signUp = async (values) => {
  try {
    const response = await Api.post(userRoutes.register, values)
    return response
  } catch (error) {
    console.log(error);
    throw error

  }

}
export const sigIn = async (values) => {
  try {
    const response = await Api.post(userRoutes.login, values)
    return response
  } catch (error) {
    console.log(error);
    throw error

  }
}
export const imageSave = async (selectedImages, titles) => {
  try {
    const response = await Api.post(userRoutes.saveImage, {
      selectedImages,
      titles
    })
    return response
  } catch (error) {
    console.log(error);
    throw error

  }
}
export const getAllImages = async () => {
  try {
    const response = await Api.get(userRoutes.allImages)
    return response
  } catch (error) {
    throw error
  }
}
export const updateImages = async (updatedImages) => {
  try {
    const response = await Api.patch(userRoutes.imagesUpdate, { updatedImages })
    return response
  } catch (error) {
    throw error
  }
}
export const updateSingleImage = async (objId, newImg, newCaption) => {
  try {
    const response = await Api.patch(userRoutes.updateSingleImg, {
      objId, newImg, newCaption
    })
    return response
  } catch (error) {
    throw error
  }
}
export const deletImage = async (objId) => {
  try {
    const response = await Api.patch(userRoutes.imageDelete, {
      objId
    })
    return response

  } catch (error) {
    throw error
  }
}