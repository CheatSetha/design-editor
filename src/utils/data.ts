export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })


  // Function to compress Base64 image and return a Blob URL
export const compressBase64ToBlobURL = async (base64Image: string, quality: number = 0.6): Promise<string | null> => {
  return new Promise<string | null>((resolve) => {
    const img = new Image();

    // Convert the Base64 image to binary data
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set the canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas with compression
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Convert the canvas to a Blob URL
        canvas.toBlob((blob) => {
          if (blob) {
            const blobURL = URL.createObjectURL(blob);
            resolve(blobURL);
          } else {
            resolve(null);
          }
        }, "image/jpeg", quality); // Adjust the compression quality (0 to 1)
      } else {
        resolve(null);
      }
    };

    img.onerror = () => {
      resolve(null);
    };
  });
};


