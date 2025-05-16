
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";

// Sample gallery images
const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    alt: "Farm landscape with green fields",
    category: "Farm"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    alt: "Green grass field",
    category: "Grass"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Fresh vegetables",
    category: "Vegetables"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    alt: "Free-range chickens",
    category: "Chicken"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1466692476655-9fe045813c81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    alt: "Green farm field",
    category: "Farm"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1487147264018-f937fba0c817?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    alt: "Fresh produce",
    category: "Vegetables"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1545167496-c1e5c0c43a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    alt: "Chicken in farm",
    category: "Chicken"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1465781332089-5fae8a783948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1746&q=80",
    alt: "Farm landscape",
    category: "Farm"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1508105859382-b487af436eff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    alt: "Grass field",
    category: "Grass"
  },
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<null | { src: string; alt: string }>(null);

  // Extract unique categories
  const categories = Array.from(
    new Set(galleryImages.map((image) => image.category))
  );
  
  // Filter images based on active category
  const filteredImages = activeFilter === "All"
    ? galleryImages
    : galleryImages.filter(image => image.category === activeFilter);

  // Open image modal
  const openModal = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
  };

  // Close image modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <Layout>
      <section className="bg-farm-cream py-16 md:py-20">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Gallery</h1>
          <p className="text-gray-600 max-w-2xl">
            Take a visual tour of our farm and products. These images showcase our organic farming
            practices and the quality products we offer.
          </p>
        </div>
      </section>

      <section className="container-custom py-12">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveFilter("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "All"
                ? "bg-farm-green-dark text-white" 
                : "bg-farm-cream text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Photos
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category
                  ? "bg-farm-green-dark text-white" 
                  : "bg-farm-cream text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div 
              key={image.id} 
              className="overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => openModal(image.src, image.alt)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-72 object-cover"
              />
            </div>
          ))}
        </div>
      </section>
      
      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center z-10 text-white"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
