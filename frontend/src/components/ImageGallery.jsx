import { useState } from 'react';

export default function ImageGallery({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div>
      <div className="card overflow-hidden mb-4">
        <img
          src={images[selectedImage]}
          alt={productName}
          className="w-full aspect-square object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`card overflow-hidden ${
              selectedImage === index ? 'ring-2 ring-primary-600' : ''
            }`}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              className="w-full aspect-square object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
