
export const buildRedirectUrl = (
  utmSource?: string | null,
  utmMedium?: string | null,
  utmCampaign?: string | null,
  utmTerm?: string | null,
  utmContent?: string | null,
  trafficType?: string | null,
  trafficSource?: string | null,
  campaign?: string | null,
  adgroup?: string | null,
  ad?: string | null,
  creative?: string | null
): string => {
  let redirectUrl = "https://mitolyn.com/science/?shield=34006jve54p94p7hmhxf2g7wbe";
  
  // Map Facebook parameters to ClickBank parameters
  if (utmSource) redirectUrl += `&tid=${encodeURIComponent(utmSource)}`;
  if (trafficType) redirectUrl += `&utm_medium=${encodeURIComponent(trafficType)}`;
  
  // If the source is an email, set traffic_source=email
  const sourceValue = utmSource === 'email' || !utmSource ? 'email' : utmSource;
  redirectUrl += `&traffic_source=${encodeURIComponent(sourceValue)}`;
  
  if (campaign) redirectUrl += `&cbname=${encodeURIComponent(campaign)}`;
  if (adgroup) redirectUrl += `&cbfid=${encodeURIComponent(adgroup)}`;
  if (ad) redirectUrl += `&cbaff=${encodeURIComponent(ad)}`;
  if (creative) redirectUrl += `&creative=${encodeURIComponent(creative)}`;
  
  return redirectUrl;
};
