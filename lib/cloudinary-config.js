// Cloudinary Configuration
// Make sure to create .env.local with these variables:
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dasbphmuc
// CLOUDINARY_API_KEY=254177779152687
// CLOUDINARY_API_SECRET=1anXIoycdMaJzGneTBtoBkgBU4k

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dasbphmuc",
  apiKey: process.env.CLOUDINARY_API_KEY || "254177779152687",
};

// Helper function to extract public_id from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{ext}
    // or: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{ext}
    const parts = url.split("/upload/");
    if (parts.length > 1) {
      let pathPart = parts[1];
      // Remove version if present (v1234567890/)
      pathPart = pathPart.replace(/^v\d+\//, "");
      // Remove file extension
      const pathParts = pathPart.split(".");
      if (pathParts.length > 1) {
        pathParts.pop(); // Remove extension
      }
      return pathParts.join("."); // Return public_id with folder path but without extension
    }
    return null;
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
};

