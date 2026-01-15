// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dbxktcwug',
  uploadPreset: 'Karteji',
};

// Generate Cloudinary URL for images
export const getCloudinaryUrl = (publicId, options = {}) => {
  const {
    width = 400,
    height = 400,
    crop = 'fill',
    quality = 'auto',
    fetch_format = 'auto',
    dpr = 'auto',
  } = options;

  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${fetch_format}`,
    `dpr_${dpr}`,
  ].join(',');

  return `${baseUrl}/${transformations}/${publicId}`;
};

// Upload image to Cloudinary
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Get optimized Cloudinary URL for profile photos
export const getProfilePhotoUrl = (publicId) => {
  return getCloudinaryUrl(publicId, {
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face',
  });
};

// Get optimized Cloudinary URL for event photos
export const getEventPhotoUrl = (publicId) => {
  return getCloudinaryUrl(publicId, {
    width: 400,
    height: 300,
    crop: 'fill',
  });
};

// Get optimized Cloudinary URL for gallery thumbnails
export const getGalleryThumbnailUrl = (publicId) => {
  return getCloudinaryUrl(publicId, {
    width: 150,
    height: 150,
    crop: 'fill',
  });
};
