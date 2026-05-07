export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

// Returns error message string if invalid, null if valid.
export const validateImage = (file) => {
  if (!file) return "Chưa chọn file";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Chỉ chấp nhận .jpg/.jpeg/.png/.webp";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "File tối đa 10MB";
  }
  return null;
};
