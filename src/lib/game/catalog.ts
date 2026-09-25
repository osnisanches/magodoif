import { slugify } from "@/lib/utils";
import type { AxisId, Course, Keyword, LevelId, LevelOption } from "./types";

export const LEVELS: LevelOption[] = [
  {
    id: "tecnico",
    text: "Técnico",
    hint: "Ensino médio integrado ou subsequente",
  },
  {
    id: "graduacao",
    text: "Graduação",
    hint: "Licenciaturas e cursos superiores de tecnologia",
  },
  {
    id: "pos",
    text: "Pós-graduação",
    hint: "Especialização para quem já se formou",
  },
];

export const AXIS_META: Record<
  AxisId,
  { name: string; color: string; glow: string }
> = {
  tech: { name: "Tecnologias e Infraestrutura", color: "var(--color-axis-tech)", glow: "#5eead4" },
  agro: { name: "Campo · Produção Agrícola", color: "var(--color-axis-agro)", glow: "#86efac" },
  pesca: { name: "Campo · Pesca e Aquicultura", color: "var(--color-axis-pesca)", glow: "#67e8f9" },
  ambiente: { name: "Campo · Meio Ambiente", color: "var(--color-axis-ambiente)", glow: "#6ee7b7" },
  turismo: { name: "Turismo, Hospitalidade e Serviços", color: "var(--color-axis-turismo)", glow: "#fbbf24" },
  naturais: { name: "Ciências Naturais", color: "var(--color-axis-naturais)", glow: "#c4b5fd" },
  humanas: { name: "Ciências Humanas", color: "var(--color-axis-humanas)", glow: "#fdba74" },
};

export const COURSES: Course[] = [
  {
    id: "informatica",
    name: "Técnico em Informática",
    shortName: "Informática",
    level: "tecnico",
    axis: "tech",
    blurb:
      "Você gosta de resolver problemas com lógica e tecnologia. No IFPA, o técnico em Informática forma quem constrói sistemas, cuida de redes e dá suporte digital para a região.",
    highlights: ["Desenvolvimento de sistemas", "Redes e suporte", "Lógica e bancos de dados"],
  },
  {
    id: "edificacoes-int",
    name: "Técnico em Edificações (Integrado)",
    shortName: "Edificações · Integrado",
    level: "tecnico",
    axis: "tech",
    blurb:
      "Para quem quer desenhar, calcular e acompanhar obras já no ensino médio. O integrado une formação geral e o canteiro de obras da Amazônia bragantina.",
    highlights: ["Desenho técnico", "Canteiro de obras", "Ensino médio + profissão"],
  },
  {
    id: "edificacoes-sub",
    name: "Técnico em Edificações (Subsequente)",
    shortName: "Edificações · Subsequente",
    level: "tecnico",
    axis: "tech",
    blurb:
      "Se você já concluiu o ensino médio e se interessa por construir com técnica, o subsequente em Edificações prepara para projetos, execução e fiscalização de obras.",
    highlights: ["Projetos e plantas", "Materiais e estruturas", "Fiscalização de obras"],
  },
  {
    id: "agropecuaria",
    name: "Técnico em Agropecuária",
    shortName: "Agropecuária",
    level: "tecnico",
    axis: "agro",
    blurb:
      "Do solo ao rebanho: o curso forma quem cuida da produção rural com técnica, bem-estar animal e gestão da propriedade familiar.",
    highlights: ["Produção vegetal e animal", "Gestão da propriedade", "Prática de campo"],
  },
  {
    id: "pesca",
    name: "Técnico em Pesca",
    shortName: "Pesca",
    level: "tecnico",
    axis: "pesca",
    blurb:
      "Bragança vive da maré. Este técnico forma quem entende embarcação, recurso pesqueiro, segurança no mar e a cadeia do pescado da costa paraense.",
    highlights: ["Pesca artesanal e industrial", "Navegação e segurança", "Cadeia do pescado"],
  },
  {
    id: "aquicultura",
    name: "Técnico em Aquicultura",
    shortName: "Aquicultura",
    level: "tecnico",
    axis: "pesca",
    blurb:
      "Criar peixes, camarões e moluscos com ciência. O curso une biologia aquática, manejo de viveiros e produção sustentável na zona costeira.",
    highlights: ["Cultivo de organismos aquáticos", "Qualidade da água", "Produção sustentável"],
  },
  {
    id: "meio-ambiente",
    name: "Técnico em Meio Ambiente",
    shortName: "Meio Ambiente",
    level: "tecnico",
    axis: "ambiente",
    blurb:
      "Para quem quer proteger rios, manguezais e comunidades. O técnico atua em licenciamento, educação ambiental e monitoramento da qualidade ambiental.",
    highlights: ["Licenciamento", "Educação ambiental", "Monitoramento de biomas"],
  },
  {
    id: "guia-turismo",
    name: "Técnico em Guia de Turismo",
    shortName: "Guia de Turismo",
    level: "tecnico",
    axis: "turismo",
    blurb:
      "Contar a história de Bragança, conduzir grupos e revelar o litoral, o folclore e a fé popular. O guia é ponte entre visitante e território.",
    highlights: ["Condução de grupos", "Patrimônio e cultura", "Roteiros regionais"],
  },
  {
    id: "eventos",
    name: "Técnico em Eventos",
    shortName: "Eventos",
    level: "tecnico",
    axis: "turismo",
    blurb:
      "Festas, congressos, feiras e cerimoniais. O curso forma quem organiza, produz e recebe pessoas com criatividade e método.",
    highlights: ["Produção de eventos", "Cerimonial e hospitalidade", "Logística e recepção"],
  },
  {
    id: "fic-pescador",
    name: "FIC Pescador Profissional",
    shortName: "FIC Pescador",
    level: "tecnico",
    axis: "pesca",
    blurb:
      "Formação inicial e continuada para quem já vive ou quer viver da pesca: segurança, marinharia, manejo do pescado e direitos de quem trabalha no mar.",
    highlights: ["Marinharia", "Segurança a bordo", "Manejo do pescado"],
  },
  {
    id: "fic-aquicultor",
    name: "FIC Aquicultor / EJA Pesqueira",
    shortName: "FIC Aquicultor",
    level: "tecnico",
    axis: "pesca",
    blurb:
      "Cursos FIC e EJA da linha pesqueira: cultivo, beneficiamento do pescado e escolarização junto da profissão para jovens e adultos da costa.",
    highlights: ["Cultivo em viveiros", "Beneficiamento do pescado", "EJA profissional"],
  },
  {
    id: "agroecologia",
    name: "Tecnologia em Agroecologia",
    shortName: "Agroecologia",
    level: "graduacao",
    axis: "agro",
    blurb:
      "Agricultura que cuida da terra, da água e das pessoas. A tecnologia em Agroecologia forma quem redesenha sistemas produtivos com base ecológica e justiça no campo.",
    highlights: ["Sistemas agroecológicos", "Soberania alimentar", "Extensão rural"],
  },
  {
    id: "gestao-ambiental",
    name: "Tecnologia em Gestão Ambiental",
    shortName: "Gestão Ambiental",
    level: "graduacao",
    axis: "ambiente",
    blurb:
      "Planejar, avaliar e gerir o uso dos recursos naturais. Uma formação superior para políticas ambientais, resíduos, unidades de conservação e território.",
    highlights: ["Gestão de recursos", "Políticas ambientais", "Estudos de impacto"],
  },
  {
    id: "gestao-turismo",
    name: "Tecnologia em Gestão do Turismo",
    shortName: "Gestão do Turismo",
    level: "graduacao",
    axis: "turismo",
    blurb:
      "Pensar o turismo como desenvolvimento local: hospitalidade, roteiros, economia criativa e cuidado com o patrimônio natural e cultural da Amazônia costeira.",
    highlights: ["Gestão de destinos", "Hospitalidade", "Economia criativa"],
  },
  {
    id: "biologicas",
    name: "Licenciatura em Ciências Biológicas",
    shortName: "Ciências Biológicas",
    level: "graduacao",
    axis: "naturais",
    blurb:
      "Entender a vida — da célula ao manguezal — e ensinar Ciências e Biologia. A licenciatura forma docentes e pesquisadores da biodiversidade amazônica.",
    highlights: ["Docência em Biologia", "Biodiversidade", "Laboratório e campo"],
  },
  {
    id: "fisica",
    name: "Licenciatura em Física",
    shortName: "Física",
    level: "graduacao",
    axis: "naturais",
    blurb:
      "Para quem se encanta com o movimento, a energia e o universo — e quer ensinar Física com experimentação. Forma professores e pensadores da ciência.",
    highlights: ["Docência em Física", "Experimentação", "Astronomia e energia"],
  },
  {
    id: "geografia",
    name: "Licenciatura em Geografia",
    shortName: "Geografia",
    level: "graduacao",
    axis: "humanas",
    blurb:
      "Ler o chão que se pisa: mapas, clima, cidades, campo e conflitos territoriais. A licenciatura forma quem ensina Geografia e pesquisa o espaço amazônico.",
    highlights: ["Docência em Geografia", "Cartografia", "Território e Amazônia"],
  },
  {
    id: "educacao-campo",
    name: "Licenciatura em Educação do Campo",
    shortName: "Educação do Campo",
    level: "graduacao",
    axis: "humanas",
    blurb:
      "Educar nas comunidades rurais, quilombolas e pesqueiras com pedagogia própria do campo. Forma docentes comprometidos com os territórios camponeses.",
    highlights: ["Pedagogia do campo", "Comunidades tradicionais", "Docência no rural"],
  },
  {
    id: "bio-celular",
    name: "Especialização em Biologia Celular e Molecular",
    shortName: "Biologia Celular e Molecular",
    level: "pos",
    axis: "naturais",
    blurb:
      "Pós-graduação para quem já é da área da vida e quer aprofundar célula, genética, microscopias e pesquisa molecular aplicada à saúde e à biodiversidade.",
    highlights: ["Genética e célula", "Pesquisa laboratorial", "Saúde e biodiversidade"],
  },
];

const WORD_BANK: Record<string, string[]> = {
  informatica: [
    "Programação",
    "Algoritmos",
    "Redes",
    "Hardware",
    "Aplicativos",
    "Banco de dados",
    "Lógica",
    "Sites",
    "Sistemas",
    "Suporte técnico",
  ],
  "edificacoes-int": [
    "Plantas baixas",
    "Desenho técnico",
    "Alvenaria",
    "Canteiro de obras",
    "AutoCAD",
    "Concreto",
    "Ensino médio",
    "Maquetes",
    "Fundações",
    "Topografia",
  ],
  "edificacoes-sub": [
    "Projetos de obra",
    "Estruturas",
    "Acabamento",
    "Fiscalização",
    "Materiais de construção",
    "Instalações",
    "Orçamento de obra",
    "Leitura de projeto",
    "Segurança do trabalho",
    "Patologia das construções",
  ],
  agropecuaria: [
    "Criação de animais",
    "Horta e pomar",
    "Solo fértil",
    "Veterinária básica",
    "Máquinas agrícolas",
    "Pecuária",
    "Agricultura",
    "Propriedade rural",
    "Sementes",
    "Manejo de pasto",
  ],
  pesca: [
    "Maré",
    "Embarcação",
    "Rede de pesca",
    "Navegação",
    "Pescado",
    "Alto-mar",
    "Marinharia",
    "Costa paraense",
    "Segurança no mar",
    "Recurso pesqueiro",
  ],
  aquicultura: [
    "Viveiros",
    "Camarão",
    "Peixes de cultivo",
    "Qualidade da água",
    "Tanques",
    "Larvicultura",
    "Ração",
    "Oxigênio dissolvido",
    "Moluscos",
    "Piscicultura",
  ],
  "meio-ambiente": [
    "Manguezal",
    "Reciclagem",
    "Licenciamento",
    "Nascentes",
    "Educação ambiental",
    "Unidades de conservação",
    "Coleta seletiva",
    "Biomas",
    "Impacto ambiental",
    "Monitoramento",
  ],
  "guia-turismo": [
    "Roteiros",
    "Patrimônio",
    "Folclore",
    "Hospitalidade",
    "História local",
    "Amazônia costeira",
    "Condução de grupos",
    "Círio",
    "Praias e rios",
    "Cultura popular",
  ],
  eventos: [
    "Cerimonial",
    "Festas",
    "Recepção",
    "Logística",
    "Decoração",
    "Congressos",
    "Feiras",
    "Som e palco",
    "Etiqueta",
    "Produção cultural",
  ],
  "fic-pescador": [
    "Pesca artesanal",
    "Nós e cabos",
    "Casco e convés",
    "Primeiros socorros",
    "Maré e vento",
    "Conservação do pescado",
    "Direitos do pescador",
    "Motor de popa",
    "Farol e bússola",
  ],
  "fic-aquicultor": [
    "Beneficiamento",
    "Filetagem",
    "Fumagem",
    "Higiene do pescado",
    "EJA",
    "Cultivo familiar",
    "Viveiro de fundo",
    "Comunitário",
    "Cadeia fria",
  ],
  agroecologia: [
    "Agrofloresta",
    "Compostagem",
    "Sementes crioulas",
    "Soberania alimentar",
    "Extensão rural",
    "Adubação verde",
    "Sistemas agroecológicos",
    "Agricultura familiar",
    "Policultura",
    "Transição agroecológica",
  ],
  "gestao-ambiental": [
    "Políticas públicas",
    "Gestão de resíduos",
    "EIA/RIMA",
    "Recursos hídricos",
    "Planejamento ambiental",
    "Auditoria ambiental",
    "Mudanças climáticas",
    "Território",
    "Indicadores ambientais",
  ],
  "gestao-turismo": [
    "Destinos turísticos",
    "Economia criativa",
    "Meios de hospedagem",
    "Marketing turístico",
    "Turismo de base comunitária",
    "Gestão hoteleira",
    "Inventário turístico",
    "Sustentabilidade turística",
    "Agências e roteiros",
  ],
  biologicas: [
    "Biodiversidade",
    "Laboratório",
    "Ecologia",
    "Anatomia",
    "Microscopia",
    "Docência em Ciências",
    "Genética",
    "Zoologia",
    "Botânica",
    "Campo e coleta",
  ],
  fisica: [
    "Experimentos",
    "Astronomia",
    "Energia",
    "Movimento",
    "Óptica",
    "Eletricidade",
    "Docência em Física",
    "Laboratório de Física",
    "Ondas",
    "Universo",
  ],
  geografia: [
    "Mapas",
    "Clima",
    "Território",
    "Cartografia",
    "Urbanização",
    "Amazônia",
    "Docência em Geografia",
    "Geomorfologia",
    "População",
    "Paisagem",
  ],
  "educacao-campo": [
    "Pedagogia do campo",
    "Comunidades tradicionais",
    "Escola rural",
    "Quilombo",
    "Assentamento",
    "Saberes populares",
    "Juventude camponesa",
    "Alternância",
    "Território camponês",
    "Educação popular",
  ],
  "bio-celular": [
    "Célula",
    "DNA",
    "Biologia molecular",
    "Cultura de células",
    "Proteínas",
    "Microscopia avançada",
    "Pesquisa científica",
    "Genômica",
    "Imunologia",
    "Bioquímica",
    "Ensaios laboratoriais",
    "Biotecnologia",
    "Histologia",
    "Sinalização celular",
    "PCR",
    "Artigo científico",
    "Orientação de pesquisa",
    "Saúde e molécula",
  ],
};

export function keywordsFromBank(): Keyword[] {
  const byId = new Map(COURSES.map((c) => [c.id, c]));
  const list: Keyword[] = [];
  for (const [courseId, words] of Object.entries(WORD_BANK)) {
    const course = byId.get(courseId);
    if (!course) continue;
    for (const text of words) {
      list.push({
        id: `${courseId}-${slugify(text)}`,
        text,
        ownerCourseId: courseId,
        axis: course.axis,
        enabled: true,
      });
    }
  }
  return list;
}

export const SEED_KEYWORDS: Keyword[] = keywordsFromBank();

export function courseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function coursesByLevel(level: LevelId): Course[] {
  return COURSES.filter((c) => c.level === level);
}

export function levelLabel(level: LevelId): string {
  return LEVELS.find((l) => l.id === level)?.text ?? level;
}
