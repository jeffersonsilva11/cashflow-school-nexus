
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ParentCredentialsRequest {
  name: string;
  email: string;
  password: string;
  schoolName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, password, schoolName }: ParentCredentialsRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Escola Connect <onboarding@resend.dev>",
      to: [email],
      subject: "Suas credenciais de acesso ao aplicativo",
      html: `
        <h1>Olá, ${name}!</h1>
        <p>Você foi registrado como responsável na escola <strong>${schoolName}</strong>.</p>
        <p>Abaixo estão suas credenciais de acesso ao aplicativo:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Senha:</strong> ${password}</p>
        <p>Recomendamos que você altere sua senha após o primeiro acesso.</p>
        <p>Atenciosamente,<br>Equipe Escola Connect</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-parent-credentials function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
