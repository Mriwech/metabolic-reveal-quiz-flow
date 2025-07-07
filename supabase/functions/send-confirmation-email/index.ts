
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const BASE_REDIRECT_URL = Deno.env.get("BASE_REDIRECT_URL") || "https://mitolyn.com/science/?shield=34006jve54p94p7hmhxf2g7wbe";
const SENDER_EMAIL = Deno.env.get("SENDGRID_SENDER_EMAIL") || "noreply@mitolyn.com";

interface EmailRequestBody {
  email: string;
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Email subject variations for better engagement
const emailSubjects = [
  "+10 Years Metabolic Age? Reverse It Starting Today",
  "Why Your Body's Burning Fat 43% Slower (And How to Fix It)",
  "Fatigue, Stubborn Fat? Your Report Explains Everything"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestText = await req.text();
    console.log("Raw request body:", requestText);
    
    let requestData: EmailRequestBody;
    try {
      requestData = JSON.parse(requestText);
      console.log("Parsed request data:", requestData);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }
    
    const { email, utmSource, utmCampaign, utmContent } = requestData;

    // Validate required email field
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    // Convert UTM parameters to ClickBank format
    const clickBankParams = {
      tid: utmCampaign || '',
      traffic_source: 'email',
      creative: utmContent || ''
    };

    // Build redirect URL with converted parameters
    const redirectUrl = `${BASE_REDIRECT_URL}${clickBankParams.tid ? `&tid=${encodeURIComponent(clickBankParams.tid)}` : ''}${`&traffic_source=${encodeURIComponent(clickBankParams.traffic_source)}`}${clickBankParams.creative ? `&creative=${encodeURIComponent(clickBankParams.creative)}` : ''}`;

    // Prepare email template data
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const currentYear = new Date().getFullYear().toString();
    const unsubscribeUrl = `https://mitolyn.com/unsubscribe?email=${encodeURIComponent(email)}`;
    const privacyUrl = "https://mitolyn.com/privacy";

    // Select random email subject for better engagement
    const randomSubject = emailSubjects[Math.floor(Math.random() * emailSubjects.length)];

    const templateData = {
      email: email,
      current_date: currentDate,
      redirect_url: redirectUrl,
      unsubscribe_url: unsubscribeUrl,
      privacy_url: privacyUrl,
      year: currentYear
    };

    console.log("Template data:", templateData);
    console.log("Selected email subject:", randomSubject);

    // Verify SendGrid API key
    if (!SENDGRID_API_KEY) {
      console.error("SendGrid API key is not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service configuration error", 
          details: "SendGrid API key is missing" 
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    // Prepare SendGrid request payload
    const sendgridPayload = {
      personalizations: [
        {
          to: [{ email }],
          subject: randomSubject,
          dynamic_template_data: templateData
        },
      ],
      from: { 
        email: SENDER_EMAIL,
        name: "Mitolyn Metabolic Report"
      },
      template_id: "d-a2c9dbf438b64b3994e622d205ebbd80",
    };

    console.log("Sending email with payload:", JSON.stringify(sendgridPayload));

    // Send email via SendGrid API
    const sendgridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(sendgridPayload),
    });

    if (!sendgridResponse.ok) {
      const errorText = await sendgridResponse.text();
      console.error("SendGrid API error:", errorText);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email via SendGrid", 
          status: sendgridResponse.status,
          details: errorText 
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    // Return success response with redirect URL
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email sent successfully",
        redirectUrl 
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );

  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email",
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
