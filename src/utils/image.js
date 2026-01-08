import imageCompression from 'browser-image-compression'
import { APP_CONFIG } from '../config/app'

// Compress image before upload
export const compressImage = async (file) => {
  const options = {
    maxSizeMB: APP_CONFIG.performance.imageMaxSizeMB,
    maxWidthOrHeight: APP_CONFIG.performance.imageMaxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/jpeg'
  }
  
  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('Image compression error:', error)
    throw error
  }
}

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// Handle image upload from camera or gallery
export const handleImageUpload = async (file) => {
  try {
    // Compress image
    const compressedFile = await compressImage(file)
    
    // Convert to base64
    const base64 = await fileToBase64(compressedFile)
    
    return {
      file: compressedFile,
      base64,
      size: compressedFile.size,
      type: compressedFile.type
    }
  } catch (error) {
    console.error('Image upload error:', error)
    throw error
  }
}

// Open camera or gallery
export const selectImage = (fromCamera = false) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    if (fromCamera) {
      input.capture = 'environment' // Use back camera
    }
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (file) {
        try {
          const result = await handleImageUpload(file)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      } else {
        reject(new Error('No file selected'))
      }
    }
    
    input.click()
  })
}

// Generate placeholder avatar with initials
export const generateAvatar = (name) => {
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200
  const ctx = canvas.getContext('2d')
  
  // Background
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  const color = colors[Math.floor(Math.random() * colors.length)]
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 200, 200)
  
  // Text (initials)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 80px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  
  ctx.fillText(initials, 100, 100)
  
  return canvas.toDataURL('image/png')
}
