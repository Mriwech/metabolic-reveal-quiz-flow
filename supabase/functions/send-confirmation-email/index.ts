
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");

interface EmailRequestBody {
  email: string;
  firstName?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
}

// Headers CORS pour permettre les requêtes depuis le frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Décodage du corps de la requête
    const requestText = await req.text();
    console.log("Raw request body:", requestText);
    
    let requestData;
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
    
    const { email, firstName, utmSource, utmCampaign, utmContent } = requestData as EmailRequestBody;

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

    // Validation simple de l'email
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

    // Conversion des paramètres UTM vers ClickBank
    // Pour email, on force traffic_source=email
    const clickBankParams = {
      tid: utmCampaign || '',                 // Transaction ID
      traffic_source: 'email',                // Source du trafic venant de l'email est toujours "email"
      creative: utmContent || ''              // Version créative
    };

    console.log("Converting UTM to ClickBank for email link:", { 
      from: { utmSource, utmCampaign, utmContent },
      to: clickBankParams 
    });

    // Construire l'URL de redirection avec les paramètres convertis
    const baseUrl = "https://mitolyn.com/science/?shield=34006jve54p94p7hmhxf2g7wbe";
    const redirectUrl = `${baseUrl}${clickBankParams.tid ? `&tid=${encodeURIComponent(clickBankParams.tid)}` : ''}${`&traffic_source=${encodeURIComponent(clickBankParams.traffic_source)}`}${clickBankParams.creative ? `&creative=${encodeURIComponent(clickBankParams.creative)}` : ''}`;

    // Préparation du contenu HTML pour l'email
    const ctaButtonStyle = "background-color:#ffd32a;border-radius:6px;color:#000;display:inline-block;font-family:sans-serif;font-size:16px;font-weight:bold;line-height:50px;text-align:center;text-decoration:none;width:230px;-webkit-text-size-adjust:none;";
    
    // Contenu de l'email
    const emailContent = `
      <html>
        <head>
          <title>Your Metabolic Report is Ready</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background-color: #e8f5fe;
              border-bottom: 3px solid #0072c6;
            }
            .content {
              padding: 20px;
            }
            .result-metric {
              background-color: #f5f5f5;
              border-radius: 5px;
              padding: 15px;
              margin-bottom: 15px;
            }
            .bad {
              border-left: 4px solid #ff4d4d;
            }
            .cta-button {
              text-align: center;
              margin: 25px 0;
            }
            .footer {
              font-size: 12px;
              color: #999999;
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eeeeee;
            }
            @media only screen and (max-width: 480px) {
              .container {
                width: 100%;
                padding: 10px;
              }
              .content {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Metabolic Report is Ready!</h1>
            </div>
            <div class="content">
              <p>Hello${firstName ? ` ${firstName}` : ''},</p>
              <p>Thank you for completing your metabolic assessment. Your results show that you may have a rare mitochondrial deficiency—the root cause of stubborn fat. But there's hope...</p>
              
              <div class="result-metric">
                <h3>⏳ Current Metabolic Age</h3>
                <div style="font-size: 24px; font-weight: bold; color: #ff4d4d;">+10 years above ideal</div>
              </div>
              
              <div class="result-metric bad">
                <h3>🔥 Fat-Burning Speed</h3>
                <div style="font-size: 18px; font-weight: bold; color: #ff4d4d;">43% slower than optimal</div>
              </div>
              
              <div class="result-metric bad">
                <h3>⚡ Cellular Energy Production</h3>
                <div style="font-size: 18px; font-weight: bold; color: #ff4d4d;">2.1x below healthy levels</div>
              </div>
              
              <p>We've analyzed your results and created a personalized solution to help fix your metabolism. Watch this short video to learn how to regain control:</p>
              
              <div class="cta-button">
                <a href="${redirectUrl}" target="_blank" style="${ctaButtonStyle}">BOOST YOUR METABOLISM</a>
              </div>
              
              <p>Your body has the ability to transform—you just need to unlock your mitochondrial function.</p>
              
              <p>To your health,<br>The Mitolyn Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Mitolyn. All rights reserved.</p>
              <p>This email was sent to ${email}. If you did not request this report, please ignore this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Vérifier que la clé API SendGrid est disponible
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

    // Préparation de la requête vers l'API SendGrid
    // Utilisation d'une adresse email vérifiée pour l'expéditeur
    const sendgridPayload = {
      personalizations: [
        {
          to: [{ email }],
          subject: "Your Metabolic Report is Ready! 🔍",
        },
      ],
      from: { 
        email: "onboarding@resend.dev",  // Utiliser une adresse vérifiée par SendGrid
        name: "Mitolyn Metabolic Report"
      },
      content: [
        {
          type: "text/html",
          value: emailContent,
        },
      ],
    };

    console.log("Sending email with payload:", JSON.stringify(sendgridPayload));

    // Envoi de l'email via SendGrid API
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

    // Réponse de succès avec l'URL de redirection
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
