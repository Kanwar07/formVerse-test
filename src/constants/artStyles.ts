export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: "realistic" | "stylized" | "geometric";
}

export const artStyles: ArtStyle[] = [
  {
    id: "realistic",
    name: "Realistic",
    description: "Photorealistic textures and lighting",
    preview: "🎯",
    category: "realistic"
  },
  {
    id: "cartoon", 
    name: "Cartoon",
    description: "Stylized, vibrant colors",
    preview: "🎨",
    category: "stylized"
  },
  {
    id: "low-poly",
    name: "Low Poly",
    description: "Geometric, minimal faces",
    preview: "📐",
    category: "geometric"
  },
  {
    id: "voxel",
    name: "Voxel", 
    description: "Blocky, pixelated style",
    preview: "🧊",
    category: "geometric"
  },
  {
    id: "hand-painted",
    name: "Hand-Painted",
    description: "Artistic, brushed textures",
    preview: "🖌️",
    category: "stylized"
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical, ethereal effects", 
    preview: "✨",
    category: "stylized"
  },
  {
    id: "sculpture",
    name: "Sculpture",
    description: "Clay, marble, or metal finish",
    preview: "🗿",
    category: "realistic"
  }
];