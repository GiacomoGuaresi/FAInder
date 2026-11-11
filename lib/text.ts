// Funzione per decodificare entità HTML
export const decodeHtmlEntities = (text: string): string => {
  const entityMap: { [key: string]: string } = {
    '&#39;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&agrave;': 'à',
    '&egrave;': 'è',
    '&eacute;': 'é',
    '&igrave;': 'ì',
    '&ograve;': 'ò',
    '&ugrave;': 'ù',
    '&Agrave;': 'À',
    '&Egrave;': 'È',
    '&Eacute;': 'É',
    '&Igrave;': 'Ì',
    '&Ograve;': 'Ò',
    '&Ugrave;': 'Ù',
    '&nbsp;': ' ',
    '&euro;': '€',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': '\'',
    '&rsquo;': '\'',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&hellip;': '…'
  };

  let decoded = text;
  Object.entries(entityMap).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  });
  
  return decoded;
};

// Funzione per tagliare testo a 200 caratteri
export const truncateText = (text: string, maxLength: number = 200): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
};
