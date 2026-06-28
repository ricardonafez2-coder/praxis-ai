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

// Agents synced from ElevenLabs API — 2026-06-27
export const AGENTS: Agent[] = [
  // ============ PSICOLOGÍA (7 agentes) ============
  {
    id: 'fatima',
    name: 'FATIMA',
    description: 'Paciente con ansiedad generalizada',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_1401kp54e9pge0jbfwbff03506be',
    simliFaceId: '9d0ba12e-ebad-4bfa-b1fb-c6c5be21abca',
    scenario:
      'Entrevista clínica para evaluar síntomas de ansiedad generalizada. FATIMA tiene 28 años, trabaja en una oficina, y reporta dificultad para dormir, irritabilidad y preocupación constante desde hace 6 meses.',
  },
  {
    id: 'mario',
    name: 'Mario',
    description: 'Paciente con síntomas depresivos',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_6701kp500a06e01a21wqjesh6c04',
    avatarUrl: '/patients/mario.png',
    scenario:
      'Evaluación de síntomas depresivos. Mario es un hombre de 35 años que ha perdido interés en actividades que antes disfrutaba, reporta fatiga constante y aislamiento social.',
  },
  {
    id: 'valeria',
    name: 'VALERIA',
    description: 'Paciente con trastorno de pánico',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_1301kp57daage26b4dasahf1f89t',
    scenario:
      'VALERIA, 22 años, universitaria, experimenta ataques de pánico recurrentes antes de exámenes. Reporta taquicardia, sudoración y sensación de muerte inminente.',
  },
  {
    id: 'ian',
    name: 'IAN ADOLESCENTE',
    description: 'Adolescente con problemas de conducta',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_3501kp584dnkem6rjbnb64yf5z7w',
    simliFaceId: '8efd2dfc-9a9e-4a58-81dd-34705c33f893',
    avatarUrl: '/patients/ian.jpg',
    scenario:
      'Ian, 16 años, ha tenido conflictos en la escuela y en casa. Evaluación de trastorno de conducta. Muestra actitud desafiante y minimiza sus problemas.',
  },
  {
    id: 'santiago',
    name: 'Santiago',
    description: 'Paciente para Terapia Cognitivo-Conductual',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_2701krf0jvnpffdbkm1psg9axk09',
    scenario:
      'Paciente para practicar técnicas de reestructuración cognitiva y exposición. Santiago presenta pensamientos automáticos negativos y conductas de evitación.',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    description: 'Entrevista psicológica - orientación vocacional',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_8701krpfn14rethb3e7am7rqgs43',
    scenario:
      'Simulación de entrevista psicológica para practicar habilidades de evaluación y orientación. Carlos es un candidato para un puesto de gerencia media.',
  },
  {
    id: 'francisco-tlali',
    name: 'Francisco Tlali',
    description: 'Paciente con contexto cultural mexicano',
    specialty: 'psicologia',
    elevenLabsAgentId: 'agent_6001kp59c6yfe629fmwfabr36xsp',
    scenario:
      'Escenario de entrevista con contexto cultural mexicano. Francisco Tlali presenta síntomas que requieren sensibilidad intercultural en la evaluación.',
  },

  // ============ MEDICINA (5 agentes) ============
  {
    id: 'mateo',
    name: 'Caso Médico Mateo',
    description: 'Dolor torácico - posible SCA',
    specialty: 'medicina',
    elevenLabsAgentId: 'agent_4901kps74krhepfr2x19m72f6cye',
    scenario:
      'Mateo, 52 años, fumador, presenta dolor torácico opresivo de 2 horas de evolución. Evaluación de posible síndrome coronario agudo. Antecedentes: hipertensión, diabetes tipo 2.',
  },
  {
    id: 'dona-carmen',
    name: 'Doña Carmen',
    description: 'Paciente geriátrica - polifarmacia',
    specialty: 'medicina',
    elevenLabsAgentId: 'agent_6401kw59yph9fjzsnm7h2dks6fby',
    scenario:
      'Doña Carmen, 74 años, acude por múltiples síntomas inespecíficos. Toma 7 medicamentos distintos. Evaluación integral de paciente geriátrico con polifarmacia y riesgo de interacciones.',
  },
  {
    id: 'sofia-med',
    name: 'SOFIA',
    description: 'Paciente joven - dolor abdominal',
    specialty: 'medicina',
    elevenLabsAgentId: 'agent_5301kw5903hhfnf8nqmqtw05n3wj',
    scenario:
      'SOFIA, 24 años, acude a urgencias por dolor abdominal agudo de 6 horas de evolución. Evaluación de abdomen agudo. Antecedentes: apendicectomía hace 2 años.',
  },
  {
    id: 'julian',
    name: 'JULIAN',
    description: 'Paciente pediátrico - fiebre y exantema',
    specialty: 'medicina',
    elevenLabsAgentId: 'agent_5401kw587h7xebc9mh914bhszvnt',
    scenario:
      'JULIAN, 5 años, llevado por su madre por fiebre de 3 días y exantema generalizado. Evaluación de enfermedades exantemáticas de la infancia.',
  },
  {
    id: 'don-mateo',
    name: 'DON MATEO',
    description: 'Paciente con diabetes descontrolada',
    specialty: 'medicina',
    elevenLabsAgentId: 'agent_8901kw573jsve67bh2tpwtk25018',
    scenario:
      'DON MATEO, 60 años, diabético tipo 2 con 10 años de evolución, acude con glucemia en ayuno de 280 mg/dL. Evaluación de descontrol metabólico y ajuste terapéutico.',
  },

  // --- Nutrición (sin agentes ElevenLabs aún) ---
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
