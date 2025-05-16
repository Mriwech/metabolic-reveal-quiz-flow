
export const buildRedirectUrl = (
  utmSource?: string | null,
  utmCampaign?: string | null,
  utmContent?: string | null
): string => {
  let redirectUrl = "https://mitolyn.com/science/?shield=34006jve54p94p7hmhxf2g7wbe";
  
  // Conversion des paramètres UTM vers ClickBank
  // Si utm_source existe, l'utiliser comme traffic_source, sinon utiliser "direct"
  const trafficSource = utmSource || "direct";
  
  redirectUrl += `&traffic_source=${encodeURIComponent(trafficSource)}`;
  
  // Ajouter tid si utmCampaign existe
  if (utmCampaign) {
    redirectUrl += `&tid=${encodeURIComponent(utmCampaign)}`;
  }
  
  // Ajouter creative si utmContent existe
  if (utmContent) {
    redirectUrl += `&creative=${encodeURIComponent(utmContent)}`;
  }
  
  return redirectUrl;
};
