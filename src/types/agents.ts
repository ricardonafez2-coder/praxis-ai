// Praxis AI Platform - Core Types
// Updated 2026-06-26 with real ElevenLabs agent IDs

export interface Agent {
  id: string;
  name: string;
  description: string;
  specialty: 'psicologia' | 'medicina' | 'odontologia' | 'fisioterapia' | 'veterinaria' | 'nutricion' | 'laboral';
  elevenLabsAgentId: string;
  simliFaceId?: string;
  avatarUrl?: string;
  scenario: string;
}

export interface ClinicalSession {
  id: string;
  agentId: string;
  studentId: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  transcript: Message[];
  status: 'active' | 'completed' | 'interrupted';
}

export interface Message {
  id: string;
  role: 'student' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

export interface SessionToken {
  elevenLabsToken: string;
  simliToken: string;
  sessionId: string;
  expiresAt: Date;
}

// Pre-configured agents from ElevenLabs (IDs verified 2026-06-26)
export const AGENTS: Agent[] = [
  {
    id: 'fatima',
    name: 'Fátima',
    description: 'Paciente con ansiedad generalizada',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_1401kp54e9pge0jbfwbff03506be',
    simliFaceId: '9d0ba12e-ebad-4bfa-b1fb-c6c5be21abca',
    scenario:
      'Entrevista clínica para evaluar síntomas de ansiedad generalizada. Fátima tiene 28 años, trabaja en una oficina, y reporta dificultad para dormir, irritabilidad y preocupación constante desde hace 6 meses.',
  },
  {
    id: 'mario',
    name: 'Mario',
    description: 'Paciente con síntomas depresivos',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_6701kp500a06e01a21wqjesh6c04',
    scenario:
      'Evaluación de síntomas depresivos. Mario es un hombre de 35 años que ha perdido interés en actividades que antes disfrutaba, reporta fatiga constante y aislamiento social.',
  },
  {
    id: 'valeria',
    name: 'Valeria',
    description: 'Paciente con trastorno de pánico',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_1301kp57daage26b4dasahf1f89t',
    scenario:
      'Valeria, 22 años, universitaria, experimenta ataques de pánico recurrentes antes de exámenes. Reporta taquicardia, sudoración y sensación de muerte inminente.',
  },
  {
    id: 'ian',
    name: 'Ian',
    description: 'Adolescente con problemas de conducta',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_3501kp584dnkem6rjbnb64yf5z7w',
    scenario:
      'Ian, 16 años, ha tenido conflictos en la escuela y en casa. Evaluación de trastorno de conducta. Muestra actitud desafiante y minimiza sus problemas.',
  },
  {
    id: 'mateo',
    name: 'Mateo',
    description: 'Caso médico - dolor torácico',
    specialty: 'medicina',
    elevenLabsAgentId: 'agent_4901kps74krhepfr2x19m72f6cye',
    scenario:
      'Mateo, 52 años, fumador, presenta dolor torácico opresivo de 2 horas de evolución. Evaluación de posible síndrome coronario agudo. Antecedentes: hipertensión, diabetes tipo 2.',
  },
  {
    id: 'tcc',
    name: 'Caso TCC',
    description: 'Terapia Cognitivo-Conductual',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_2701krf0jvnpffdbkm1psg9axk09',
    scenario:
      'Paciente para practicar técnicas de reestructuración cognitiva y exposición. Presenta pensamientos automáticos negativos y conductas de evitación.',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    description: 'Entrevista laboral - recruiting',
    specialty: 'laboral',
    elevenLabsAgentId: 'agent_8701krpfn14rethb3e7am7rqgs43',
    scenario:
      'Simulación de entrevista laboral para practicar habilidades de recruiting y selección de personal. Carlos es un candidato para un puesto de gerencia media.',
  },
  {
    id: 'tlalito',
    name: 'Tlalito',
    description: 'Paciente pediátrico / cultural',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_6001kp59c6yfe629fmwfabr36xsp',
    scenario:
      'Escenario de entrevista con contexto cultural mexicano. Tlalito presenta síntomas que requieren sensibilidad intercultural en la evaluación.',
  },
  // --- Nutrición ---
  {
    id: 'elena',
    name: 'Elena',
    description: 'Paciente con obesidad y resistencia a cambios',
    specialty: 'nutricion',
    elevenLabsAgentId: '',
    scenario:
      'Elena, 42 años, IMC 34, acude a consulta nutricional por indicación médica tras diagnóstico de prediabetes. Reporta múltiples intentos fallidos de dieta, vida sedentaria, y creencias limitantes sobre la alimentación saludable.',
  },
  {
    id: 'sofia-nut',
    name: 'Sofía (Nutrición)',
    description: 'Deportista con trastorno alimenticio',
    specialty: 'nutricion',
    elevenLabsAgentId: '',
    scenario:
      'Sofía, 19 años, atleta universitaria de alto rendimiento, presenta restricción calórica severa, miedo a ganar peso y signos de ortorexia. Entrevista para valoración nutricional y detección de riesgo de trastorno alimenticio.',
  },
  {
    id: 'don-jose',
    name: 'Don José',
    description: 'Adulto mayor con desnutrición',
    specialty: 'nutricion',
    elevenLabsAgentId: '',
    scenario:
      'Don José, 73 años, vive solo, ha perdido 8 kg en 4 meses sin intención. Refiere falta de apetito, dificultad para masticar y escasos recursos económicos para alimentos. Evaluación nutricional integral del adulto mayor.',
  },
];
