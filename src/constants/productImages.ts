import sportCoupe from '@/assets/legend-sport-coupe.jpg';
import blackSedan from '@/assets/legend-black-sedan.jpg';
import luxurySuv from '@/assets/legend-luxury-suv.jpg';

interface ProductImageAsset { src: string; alt: string }
export const PRODUCT_IMAGES: readonly ProductImageAsset[] = [
  { src: sportCoupe, alt: 'Silver luxury sports coupe on a mountain road at sunset' },
  { src: blackSedan, alt: 'Black performance sedan with golden sunset reflections' },
  { src: luxurySuv, alt: 'Pearl white luxury SUV beside sandstone mountains' },
];
export function getProductImage(productId: number): ProductImageAsset {
  return PRODUCT_IMAGES[Math.abs(Math.trunc(productId) - 1) % PRODUCT_IMAGES.length];
}
