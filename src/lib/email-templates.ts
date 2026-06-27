// Praxis AI — Email Templates
// Welcome emails for new user registration

export function buildWelcomeEmail(nombre: string, inviteUrl: string): WelcomeEmail {
  const subject = 'Bienvenido a Praxis AI — Activa tu cuenta';

  const html = `
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #0a0a0f; padding: 40px 20px; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
    
    <!-- Logo -->
    <tr>
      <td align="center" style="padding-bottom: 32px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="width: 48px; height: 48px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); border-radius: 12px; text-align: center; vertical-align: middle;">
              <span style="color: #FFFFFF; font-size: 24px; font-weight: 700;">P</span>
            </td>
            <td style="padding-left: 12px;">
              <span style="color: #FFFFFF; font-size: 22px; font-weight: 700;">Praxis AI</span><br>
              <span style="color: #6B7280; font-size: 12px;">Pacientes Virtuales</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Hero -->
    <tr>
      <td style="background: #111827; border-radius: 16px; border: 1px solid #1F2937; padding: 40px 32px;">
        
        <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0 0 12px 0; text-align: center;">
          Bienvenido a Praxis AI 🚀
        </h1>
        
        <p style="color: #D1D5DB; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
          Hola ${nombre},
        </p>
        
        <p style="color: #9CA3AF; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
          Gracias por tu interés en <strong style="color: #60A5FA;">Praxis AI</strong>. Como parte de nuestra misión de transformar la educación en ciencias de la salud, nos entusiasma darte acceso a nuestra plataforma de simulación clínica con pacientes virtuales impulsados por inteligencia artificial.
        </p>

        <p style="color: #9CA3AF; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">
          Tu cuenta ha sido creada. Haz clic en el botón de abajo para establecer tu contraseña y activar tu acceso.
        </p>

        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <a href="${inviteUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #2563EB, #7C3AED); color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 40px; border-radius: 12px;">
                Crear contraseña y activar cuenta →
              </a>
            </td>
          </tr>
        </table>

        <p style="color: #6B7280; font-size: 13px; margin: 0 0 32px 0; text-align: center;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
          <a href="${inviteUrl}" style="color: #60A5FA; word-break: break-all;">${inviteUrl}</a>
        </p>

        <!-- Details Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #1F2937; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <tr>
            <td>
              <h3 style="color: #FFFFFF; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">
                📋 Detalles de tu acceso
              </h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #374151;">
                    <span style="color: #9CA3AF; font-size: 14px;">🔗 Plataforma</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #374151; text-align: right;">
                    <a href="https://praxis-ai.com" style="color: #60A5FA; font-size: 14px; text-decoration: none;">praxis-ai.com</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #374151;">
                    <span style="color: #9CA3AF; font-size: 14px;">👤 Tipo de cuenta</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #374151; text-align: right;">
                    <span style="color: #D1D5DB; font-size: 14px;">Docente</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #374151;">
                    <span style="color: #9CA3AF; font-size: 14px;">🎭 Pacientes virtuales</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #374151; text-align: right;">
                    <span style="color: #D1D5DB; font-size: 14px;">8 agentes clínicos</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #374151;">
                    <span style="color: #9CA3AF; font-size: 14px;">🧠 Especialidades</span>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #374151; text-align: right;">
                    <span style="color: #D1D5DB; font-size: 14px;">Psicología, Medicina, más</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #9CA3AF; font-size: 14px;">📊 Panel docente</span>
                  </td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="color: #D1D5DB; font-size: 14px;">Sesiones, transcripciones, evaluaciones</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Getting Started -->
        <h3 style="color: #FFFFFF; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
          🚀 Primeros pasos
        </h3>
        <ol style="color: #9CA3AF; font-size: 14px; line-height: 1.8; margin: 0 0 24px 0; padding-left: 20px;">
          <li>Activa tu cuenta con el botón de arriba</li>
          <li>Inicia sesión en <a href="https://praxis-ai.com/login" style="color: #60A5FA;">praxis-ai.com/login</a></li>
          <li>Explora los <strong style="color: #D1D5DB;">8 pacientes virtuales</strong> disponibles</li>
          <li>Selecciona un caso clínico y comienza una simulación</li>
          <li>Revisa el panel docente para ver transcripciones y evaluar a tus alumnos</li>
        </ol>

        <!-- Contact -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #1F2937; border-radius: 12px; padding: 24px;">
          <tr>
            <td>
              <h3 style="color: #FFFFFF; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                🤝 ¿Interesado en colaborar?
              </h3>
              <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                Si tu institución está interesada en integrar Praxis AI como herramienta educativa, 
                ponte en contacto con nosotros para explorar un acuerdo de colaboración.
              </p>
              <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin: 0;">
                📧 <a href="mailto:ricardo.nafez@uvmnet.edu" style="color: #60A5FA;">ricardo.nafez@uvmnet.edu</a><br>
                📱 Cel: 729 948 4727
              </p>
            </td>
          </tr>
        </table>

        <!-- Research -->
        <p style="color: #6B7280; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0; text-align: center;">
          En Praxis AI investigamos activamente la usabilidad, aceptación y validez de nuestra plataforma 
          para optimizar el uso de inteligencia artificial en la formación clínica. 
          Praxis AI es tanto una herramienta educativa como una plataforma de investigación 
          para avanzar en la comprensión de las tecnologías educativas en ciencias de la salud.
        </p>
        
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding-top: 24px; text-align: center;">
        <p style="color: #4B5563; font-size: 12px; margin: 0 0 4px 0;">
          Praxis AI 🚀 · Simulador de Pacientes Virtuales
        </p>
        <p style="color: #374151; font-size: 11px; margin: 0;">
          © 2026 Praxis AI
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`;

  const text = `
Bienvenido a Praxis AI 🚀

Hola ${nombre},

Gracias por tu interés en Praxis AI. Como parte de nuestra misión de transformar la educación en ciencias de la salud, nos entusiasma darte acceso a nuestra plataforma de simulación clínica con pacientes virtuales impulsados por inteligencia artificial.

Tu cuenta ha sido creada. Establece tu contraseña aquí:
${inviteUrl}

━━━━━━━━━━━━━━━━━━

DETALLES DE TU ACCESO

🔗 Plataforma: praxis-ai.com
👤 Tipo de cuenta: Docente
🎭 Pacientes virtuales: 8 agentes clínicos
🧠 Especialidades: Psicología, Medicina, más
📊 Panel docente: Sesiones, transcripciones, evaluaciones

━━━━━━━━━━━━━━━━━━

PRIMEROS PASOS

1. Activa tu cuenta con el enlace de arriba
2. Inicia sesión en praxis-ai.com/login
3. Explora los 8 pacientes virtuales disponibles
4. Selecciona un caso clínico y comienza una simulación
5. Revisa el panel docente para ver transcripciones y evaluar

━━━━━━━━━━━━━━━━━━

¿INTERESADO EN COLABORAR?

Si tu institución está interesada en integrar Praxis AI, contáctanos:
📧 ricardo.nafez@uvmnet.edu
📱 729 948 4727

━━━━━━━━━━━━━━━━━━

En Praxis AI investigamos la usabilidad y validez de nuestra plataforma para optimizar el uso de IA en la formación clínica.

© 2026 Praxis AI
`;

  return { subject, html, text };
}

export interface WelcomeEmail {
  subject: string;
  html: string;
  text: string;
}
