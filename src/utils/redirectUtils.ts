
/**
 * Utility function to build redirect URLs with UTM to ClickBank parameter conversion
 * @param utmSource - Original UTM source parameter
 * @param utmCampaign - UTM campaign parameter (maps to tid)
 * @param utmContent - UTM content parameter (maps to creative)
 * @returns Complete redirect URL with converted parameters
 */
export const buildRedirectUrl = (
  utmSource?: string | null,
  utmCampaign?: string | null,
  utmContent?: string | null
): string => {
  let redirectUrl = "https://mitolyn.com/science/?shield=34006jve54p94p7hmhxf2g7wbe";
  
  // Use "quiz" as traffic_source for button clicks (email remains for newsletters)
  const trafficSource = "quiz";
  
  redirectUrl += `&traffic_source=${encodeURIComponent(trafficSource)}`;
  
  // Add transaction ID if campaign exists
  if (utmCampaign) {
    redirectUrl += `&tid=${encodeURIComponent(utmCampaign)}`;
  }
  
  // Add creative parameter if content exists
  if (utmContent) {
    redirectUrl += `&creative=${encodeURIComponent(utmContent)}`;
  }
  
  return redirectUrl;
};
