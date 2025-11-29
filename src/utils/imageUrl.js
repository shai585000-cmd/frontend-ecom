/**
 * Gere les URLs d'images qui peuvent etre:
 * - URL externe (https://...)
 * - Chemin local (/media/...)
 * - URL externe stockee dans ImageField Django (/media/https%3A/... ou /media/https:/...)
 */
export const getImageUrl = (image) => {
  if (!image) return '/placeholder.jpg';
  
  // Si c'est deja une URL complete
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  // Si Django a prefixe une URL externe avec /media/
  // Ex: /media/https%3A/images.unsplash.com/... ou /media/https:/...
  if (image.includes('https%3A') || image.includes('https:/') || image.includes('http%3A') || image.includes('http:/')) {
    // Extraire l'URL originale
    let url = image;
    
    // Retirer le prefixe /media/ si present
    if (url.startsWith('/media/')) {
      url = url.substring(7);
    }
    
    // Decoder les caracteres encodes
    url = decodeURIComponent(url);
    
    // S'assurer que le protocole est correct
    if (url.startsWith('https:/') && !url.startsWith('https://')) {
      url = url.replace('https:/', 'https://');
    }
    if (url.startsWith('http:/') && !url.startsWith('http://')) {
      url = url.replace('http:/', 'http://');
    }
    
    return url;
  }
  
  // Sinon c'est un chemin local, ajouter l'URL de l'API
  return `${import.meta.env.VITE_API_URL}${image}`;
};

export default getImageUrl;
