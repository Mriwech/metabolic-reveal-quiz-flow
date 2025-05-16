export const buildRedirectUrl = (
  utmSource?: string | null,
  utmCampaign?: string | null,
  utmContent?: string | null
): string => {
  let redirectUrl = "https://mitolyn.com/science/?shield=34006jve54p94p7hmhxf2g7wbe";
  
  // For email links, always use "email" as traffic_source
  // Otherwise use the utmSource value or "direct" as fallback
  const trafficSource = utmSource === "email" ? "email" : (utmSource || "direct");
  
  redirectUrl += `&traffic_source=${encodeURIComponent(trafficSource)}`;
  
  // Add tid parameter if utmCampaign exists
  if (utmCampaign) {
    redirectUrl += `&tid=${encodeURIComponent(utmCampaign)}`;
  }
  
  // Add creative parameter if utmContent exists
  if (utmContent) {
    redirectUrl += `&creative=${encodeURIComponent(utmContent)}`;
  }
  
  return redirectUrl;
};
