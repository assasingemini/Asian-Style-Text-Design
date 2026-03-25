'use server';

import cloudinary from '@/lib/cloudinary';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { error: 'Không tìm thấy file ảnh' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'asian-style-text-design',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string; public_id: string });
            }
          )
          .end(buffer);
      }
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Lỗi khi tải ảnh lên' };
  }
}
