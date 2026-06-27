'use client';

// TermsGate: Bloquea acceso hasta aceptar Términos de Servicio y Aviso de Privacidad
// Se muestra antes de la página principal y redirige o bloquea según estado

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TermsGateProps {
  children: React.ReactNode;
}

export default function TermsGate({ children }: TermsGateProps) {
  const [accepted, setAccepted] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('praxis_terms_accepted');
    if (stored !== 'true') {
      setAccepted(false);
      setShowTerms(true);
      setShowPrivacy(true);
    }
    setLoading(false);
  }, []);

  const handleAccept = () => {
    if (!termsChecked || !privacyChecked) return;
    localStorage.setItem('praxis_terms_accepted', 'true');
    localStorage.setItem('praxis_terms_accepted_at', new Date().toISOString());
    setAccepted(true);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (accepted) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="text-center mb-6 flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            P
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Praxis AI</h1>
          <p className="text-gray-400">
            Antes de continuar, debes aceptar nuestros términos y políticas.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 text-sm text-gray-300 space-y-6">
          {showTerms && (
            <div>
              <h2 className="text-white font-bold text-lg mb-4">📋 Términos de Servicio</h2>
              <TermsContent />
            </div>
          )}

          {showPrivacy && (
            <div className={showTerms ? 'pt-6 border-t border-gray-800' : ''}>
              <h2 className="text-white font-bold text-lg mb-4">🔒 Aviso de Privacidad</h2>
              <PrivacyContent />
            </div>
          )}
        </div>

        {/* Checkboxes + Buttons */}
        <div className="flex-shrink-0 bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          {showTerms && (
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                He leído y acepto los <strong className="text-white">Términos de Servicio</strong> de Praxis AI
              </span>
            </label>
          )}
          {showPrivacy && (
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={(e) => setPrivacyChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                He leído y acepto el <strong className="text-white">Aviso de Privacidad</strong> de Praxis AI
              </span>
            </label>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl text-sm font-medium transition-colors border border-gray-700"
            >
              Rechazar y salir
            </button>
            <button
              onClick={handleAccept}
              disabled={!termsChecked || !privacyChecked}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Aceptar y continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="space-y-4 text-gray-400 leading-relaxed">
      <p className="text-gray-300">
        <strong>Última actualización:</strong> 26 de junio de 2026
      </p>

      <section>
        <h3 className="text-white font-semibold mb-2">1. Aceptación de los Términos</h3>
        <p>
          Al acceder y utilizar la plataforma Praxis AI (&ldquo;la Plataforma&rdquo;), operada por Praxis AI (&ldquo;Praxis AI&rdquo;, &ldquo;nosotros&rdquo;), 
          con domicilio en Querétaro, México, usted (&ldquo;el Usuario&rdquo;) acepta cumplir y estar sujeto a los presentes 
          Términos de Servicio y al Aviso de Privacidad (en conjunto, los &ldquo;Términos&rdquo;).
        </p>
        <p className="mt-2">
          Si no está de acuerdo con estos Términos, deberá abstenerse de utilizar la Plataforma.
          Praxis AI se reserva el derecho de modificar estos Términos en cualquier momento, notificando los cambios mediante 
          publicación en la Plataforma. El uso continuado de la Plataforma tras dicha notificación constituye la aceptación 
          de las modificaciones.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">2. Descripción del Servicio</h3>
        <p>
          Praxis AI es una plataforma educativa de simulación clínica que utiliza inteligencia artificial para crear 
          pacientes virtuales interactivos. La Plataforma permite a estudiantes de ciencias de la salud practicar 
          entrevistas clínicas, diagnóstico y habilidades de comunicación con pacientes simulados.
        </p>
        <p className="mt-2">
          La Plataforma tiene fines exclusivamente <strong>educativos y de investigación</strong>. No proporciona 
          diagnóstico, tratamiento ni asesoramiento médico. Ante cualquier problema de salud, el Usuario debe 
          consultar a un profesional sanitario calificado.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">3. Elegibilidad y Registro</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>La Plataforma está destinada a estudiantes y profesionales de instituciones educativas que colaboran con Praxis AI.</li>
          <li>El Usuario debe ser mayor de 18 años o contar con el consentimiento de su tutor legal, de conformidad con la legislación mexicana aplicable.</li>
          <li>El registro requiere una cuenta creada por Praxis AI o por la institución educativa asociada, así como una dirección de correo electrónico válida.</li>
          <li>El Usuario es responsable de mantener la confidencialidad de sus credenciales de acceso. Cualquier actividad realizada bajo su cuenta es su responsabilidad.</li>
          <li>El Usuario se compromete a proporcionar información veraz, precisa y actualizada, y a notificar cualquier cambio en sus datos de registro.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">4. Uso Permitido y Conducta del Usuario</h3>
        <p>El Usuario se compromete a utilizar la Plataforma de conformidad con las leyes mexicanas aplicables y a no:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Publicar contenido difamatorio, obsceno, amenazante, fraudulento o ilegal.</li>
          <li>Infringir derechos de propiedad intelectual de Praxis AI o de terceros.</li>
          <li>Utilizar la Plataforma para fines comerciales no autorizados, publicidad o prospección no solicitada.</li>
          <li>Intentar acceder a áreas restringidas, vulnerar la seguridad de la Plataforma o interferir con su funcionamiento normal.</li>
          <li>Realizar ingeniería inversa, descompilar o extraer el código fuente de la Plataforma.</li>
          <li>Utilizar bots, scrapers u otros medios automatizados para acceder a la Plataforma sin autorización.</li>
          <li>Suplantar la identidad de otra persona o entidad.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">5. Propiedad Intelectual</h3>
        <p>
          Todo el contenido, software, diseños, marcas, logotipos y materiales disponibles en la Plataforma 
          (&ldquo;Materiales&rdquo;) son propiedad de Praxis AI o de sus licenciantes y están protegidos por la 
          Ley Federal de Protección a la Propiedad Industrial de México, la Ley Federal del Derecho de Autor 
          y los tratados internacionales aplicables.
        </p>
        <p className="mt-2">
          Praxis AI otorga al Usuario una licencia limitada, no exclusiva, intransferible y revocable para 
          acceder y utilizar la Plataforma exclusivamente para fines educativos y de investigación. Queda 
          prohibida la reproducción, distribución, modificación, venta o creación de obras derivadas de los 
          Materiales sin autorización previa por escrito.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">6. Contenido del Usuario</h3>
        <p>
          El Usuario conserva la propiedad de cualquier contenido que genere o comparta a través de la Plataforma 
          (&ldquo;Contenido del Usuario&rdquo;). Al utilizar la Plataforma, el Usuario otorga a Praxis AI una 
          licencia no exclusiva, mundial, libre de regalías y transferible para usar, reproducir y procesar 
          dicho contenido con fines de operación, mejora de la Plataforma e investigación educativa.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">7. Protección de Datos Personales</h3>
        <p>
          El tratamiento de datos personales se rige por nuestro Aviso de Privacidad, el cual cumple con lo 
          dispuesto en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) 
          y su Reglamento. Al utilizar la Plataforma, el Usuario consiente el tratamiento de sus datos personales 
          conforme a dicho Aviso de Privacidad.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">8. Modificaciones y Disponibilidad del Servicio</h3>
        <p>
          Praxis AI se reserva el derecho de modificar, suspender o descontinuar cualquier aspecto de la 
          Plataforma en cualquier momento, con o sin previo aviso. Praxis AI no será responsable ante el 
          Usuario o terceros por dichas modificaciones, suspensiones o interrupciones.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">9. Exclusión de Garantías</h3>
        <p>
          La Plataforma se proporciona &ldquo;tal cual&rdquo; y &ldquo;según disponibilidad&rdquo;, sin garantías 
          de ningún tipo, expresas o implícitas, incluyendo, pero no limitado a, garantías de comerciabilidad, 
          idoneidad para un propósito particular o no infracción, en los términos permitidos por el Código Civil 
          Federal y el Código de Comercio de México.
        </p>
        <p className="mt-2">
          Praxis AI no garantiza que la Plataforma funcione de manera ininterrumpida, esté libre de errores 
          o de componentes dañinos. El uso de la Plataforma es bajo el propio riesgo del Usuario.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">10. Limitación de Responsabilidad</h3>
        <p>
          En la máxima medida permitida por la legislación mexicana aplicable, Praxis AI, sus directivos, 
          empleados y agentes no serán responsables por daños directos, indirectos, incidentales, especiales, 
          consecuentes o punitivos, incluyendo pérdida de datos, lucro cesante o interrupción del servicio, 
          derivados del uso o la imposibilidad de uso de la Plataforma, incluso si se ha advertido de la 
          posibilidad de dichos daños.
        </p>
        <p className="mt-2">
          En ningún caso la responsabilidad total de Praxis AI excederá el equivalente a $2,000.00 MXN 
          (dos mil pesos mexicanos 00/100).
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">11. Indemnización</h3>
        <p>
          El Usuario acepta indemnizar y mantener indemne a Praxis AI, sus directivos, empleados y agentes 
          frente a cualquier reclamación, daño, pérdida o gasto (incluyendo honorarios razonables de abogados) 
          derivados de: (a) su uso de la Plataforma; (b) la violación de estos Términos; o (c) la infracción 
          de derechos de terceros.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">12. Terminación</h3>
        <p>
          Praxis AI se reserva el derecho de suspender o cancelar la cuenta de cualquier Usuario, en cualquier 
          momento y por cualquier motivo, sin previo aviso. El Usuario no tendrá derecho a recurso académico 
          o administrativo alguno en relación con dicha terminación.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">13. Ley Aplicable y Jurisdicción</h3>
        <p>
          Estos Términos se rigen e interpretan de conformidad con las leyes federales de los Estados Unidos 
          Mexicanos, excluyendo sus disposiciones sobre conflicto de leyes.
        </p>
        <p className="mt-2">
          Para cualquier controversia derivada de estos Términos, el Usuario y Praxis AI se someten a la 
          jurisdicción de los tribunales competentes de la ciudad de Querétaro, Querétaro, renunciando a 
          cualquier otro fuero que pudiera corresponderles por razón de domicilio presente o futuro.
        </p>
        <p className="mt-2">
          Tratándose de reclamaciones cuyo monto sea inferior a $20,000.00 MXN, las partes podrán optar por 
          resolver la controversia mediante arbitraje ante la Procuraduría Federal del Consumidor (PROFECO) 
          o el organismo de mediación que mutuamente acuerden.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">14. Disposiciones Generales</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>La falta de ejercicio de cualquier derecho por parte de Praxis AI no constituye renuncia a dicho derecho.</li>
          <li>Si alguna disposición de estos Términos es declarada inválida por un tribunal competente, las demás disposiciones mantendrán su plena vigencia.</li>
          <li>El Usuario no puede ceder sus derechos u obligaciones bajo estos Términos sin el consentimiento previo por escrito de Praxis AI.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">15. Contacto</h3>
        <p>Para cualquier pregunta relacionada con estos Términos de Servicio:</p>
        <p className="mt-1">
          <strong>Praxis AI</strong><br />
          Querétaro, Qro., México<br />
          Correo electrónico: contacto@praxisai.mx
        </p>
      </section>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="space-y-4 text-gray-400 leading-relaxed">
      <p className="text-gray-300">
        <strong>Última actualización:</strong> 26 de junio de 2026
      </p>

      <section>
        <h3 className="text-white font-semibold mb-2">1. Identidad del Responsable</h3>
        <p>
          En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares 
          (LFPDPPP) y su Reglamento, se informa que Praxis AI, con domicilio en Querétaro, México, es el 
          responsable del tratamiento de los datos personales que recabe a través de la Plataforma Praxis AI.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">2. Datos Personales Recabados</h3>
        <p>Podemos recabar las siguientes categorías de datos personales:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li><strong>Datos de identificación:</strong> nombre completo, correo electrónico institucional, matrícula.</li>
          <li><strong>Datos académicos:</strong> institución educativa, programa académico, semestre.</li>
          <li><strong>Datos de uso:</strong> transcripciones de sesiones clínicas, interacciones con pacientes virtuales, métricas de desempeño, duración de sesiones.</li>
          <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo, páginas visitadas.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">3. Finalidades del Tratamiento</h3>
        <p>Los datos personales serán tratados para las siguientes finalidades:</p>
        <p className="mt-1"><strong className="text-gray-300">Finalidades primarias:</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Proveer acceso a la Plataforma y sus funcionalidades.</li>
          <li>Facilitar la interacción con pacientes virtuales de IA.</li>
          <li>Generar reportes de desempeño para docentes e instituciones.</li>
          <li>Gestionar cuentas de usuario y brindar soporte técnico.</li>
        </ul>
        <p className="mt-2"><strong className="text-gray-300">Finalidades secundarias (requieren consentimiento):</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Investigación educativa y mejora de los modelos de IA (datos anonimizados).</li>
          <li>Publicación de resultados de investigación con fines académicos (siempre de forma anonimizada).</li>
          <li>Envío de comunicaciones sobre actualizaciones y nuevos casos clínicos.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">4. Transferencia de Datos</h3>
        <p>
          Praxis AI no vende, alquila ni comercializa datos personales. Los datos podrán ser transferidos 
          a las siguientes entidades en los casos previstos por el artículo 36 de la LFPDPPP:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>A la institución educativa con la que el Usuario está afiliado, para fines de evaluación académica.</li>
          <li>A proveedores de infraestructura tecnológica (servidores en la nube, servicios de IA) que operan bajo acuerdos de confidencialidad.</li>
          <li>A investigadores colaboradores, exclusivamente con datos anonimizados o seudonimizados, y previa aprobación de un comité de ética en investigación.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">5. Derechos ARCO</h3>
        <p>
          De conformidad con la LFPDPPP, el Usuario tiene derecho a Acceder, Rectificar, Cancelar y Oponerse 
          al tratamiento de sus datos personales (Derechos ARCO). Para ejercer estos derechos, deberá enviar 
          una solicitud por escrito a: <strong>privacidad@praxisai.mx</strong>, incluyendo:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Nombre completo del titular.</li>
          <li>Correo electrónico asociado a la cuenta.</li>
          <li>Descripción clara del derecho que desea ejercer.</li>
          <li>Documentos que acrediten su identidad.</li>
        </ul>
        <p className="mt-2">
          Praxis AI dará respuesta en un plazo máximo de 20 días hábiles, conforme a la legislación aplicable.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">6. Medidas de Seguridad</h3>
        <p>
          Praxis AI implementa medidas de seguridad administrativas, técnicas y físicas para proteger los 
          datos personales contra daño, pérdida, alteración, destrucción o uso no autorizado, de conformidad 
          con el artículo 14 de la LFPDPPP y las mejores prácticas de la industria.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">7. Uso de Cookies y Tecnologías Similares</h3>
        <p>
          La Plataforma utiliza cookies esenciales para su funcionamiento (autenticación, sesiones) y cookies 
          analíticas para mejorar la experiencia del usuario. El Usuario puede configurar su navegador para 
          rechazar cookies, aunque esto podría afectar la funcionalidad de la Plataforma.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">8. Conservación de Datos</h3>
        <p>
          Los datos personales se conservarán durante el tiempo necesario para cumplir con las finalidades 
          descritas, o hasta que el titular solicite su cancelación. Los datos anonimizados utilizados para 
          investigación podrán conservarse indefinidamente.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">9. Cambios al Aviso de Privacidad</h3>
        <p>
          Praxis AI se reserva el derecho de modificar este Aviso de Privacidad en cualquier momento. 
          Las modificaciones serán notificadas a través de la Plataforma o por correo electrónico. Se 
          recomienda al Usuario revisar periódicamente este Aviso.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">10. Consentimiento</h3>
        <p>
          Al utilizar la Plataforma, el Usuario manifiesta su consentimiento expreso para el tratamiento 
          de sus datos personales conforme a los términos de este Aviso de Privacidad. Si el Usuario no 
          otorga su consentimiento, deberá abstenerse de utilizar la Plataforma.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">11. Autoridad de Protección de Datos</h3>
        <p>
          Si el Usuario considera que sus derechos han sido vulnerados, puede presentar una queja ante el 
          Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI) 
          a través de su portal: <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">www.inai.org.mx</a>
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-2">12. Contacto de Privacidad</h3>
        <p>
          <strong>Praxis AI</strong><br />
          Querétaro, Qro., México<br />
          Correo electrónico: privacidad@praxisai.mx
        </p>
      </section>
    </div>
  );
}
