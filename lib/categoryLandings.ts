import { getBaseUrl } from "@/lib/site";

export type CategorySlug = "sillas" | "cortinas" | "sillones" | "mesas" | "lamparas";

export interface CategoryLandingData {
  slug: CategorySlug;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  bullets: [string, string, string];
  materials: { title: string; description: string }[];
  process: [string, string, string, string];
  faqs: { question: string; answer: string }[];
  jsonLdDescription: string;
}

const CATEGORIES: CategoryLandingData[] = [
  {
    slug: "sillas",
    h1: "Sillas que sostienen tu mesa y tu día",
    metaTitle: "Sillas a medida",
    metaDescription:
      "Sillas de diseño para living, comedor y oficina. Interiorismo en Zona Norte y Buenos Aires. Estilos clásicos y contemporáneos.",
    intro:
      "Diseñamos y seleccionamos sillas que se sienten cómodas durante una comida larga, una reunión o una jornada de home office. Pensamos la altura del asiento, el ángulo del respaldo y el soporte lumbar según la mesa y el uso que tendrá el ambiente en Zona Norte y CABA.",
    bullets: [
      "Definimos la tipología de silla según función: comedor diario, comedor principal, escritorio o barra.",
      "Ajustamos medidas y ergonomía para que el cuerpo quede bien apoyado respecto de la altura de la mesa.",
      "Coordinamos tapizados, maderas y terminaciones con el resto del mobiliario del proyecto.",
    ],
    materials: [
      {
        title: "Estructuras y patas",
        description:
          "Sillas en madera maciza o metal pintado, con secciones proporcionadas para dar estabilidad sin recargar el espacio.",
      },
      {
        title: "Asientos y respaldos",
        description:
          "Butacas tapizadas, asientos de madera, esterilla o cuerda. Elegimos la opción según el tiempo de uso y el clima del ambiente.",
      },
      {
        title: "Tapizados",
        description:
          "Linos mezclados, telas con trama visible y opciones de fácil limpieza para comedores familiares o espacios de alto tránsito.",
      },
    ],
    process: [
      "Relevamos medidas de la mesa, alturas libres y circulación alrededor.",
      "Definimos cantidad de sillas, tipología (con o sin apoyabrazos) y estilo general.",
      "Seleccionamos modelos, materiales y tapizados y armamos una propuesta integrada al resto del proyecto.",
      "Acompañamos el pedido, la entrega y la ubicación final en el ambiente.",
    ],
    faqs: [
      {
        question: "¿Pueden combinar distintos modelos de sillas en un mismo ambiente?",
        answer:
          "Sí. Muchas veces proponemos una mezcla controlada: por ejemplo, cabeceras tapizadas y laterales en madera, manteniendo proporciones y acabados para que el conjunto se vea coherente.",
      },
      {
        question: "¿Qué pasa si ya tengo una mesa y solo quiero renovar las sillas?",
        answer:
          "Partimos de la mesa existente: analizamos medidas, espesores y material para elegir una silla que acompañe sin competir. Ajustamos alturas para que el conjunto sea cómodo.",
      },
      {
        question: "¿Trabajan con telas fáciles de limpiar para uso intensivo?",
        answer:
          "Sí. Para comedores diarios o familias con chicos priorizamos telas con tratamiento antimanchas o tapizados removibles. Te mostramos opciones concretas según tu caso.",
      },
    ],
    jsonLdDescription:
      "Diseño y selección de sillas a medida para comedores, livings y espacios de trabajo en Zona Norte y Buenos Aires, cuidando ergonomía y materiales.",
  },
  {
    slug: "cortinas",
    h1: "Cortinas que doman la luz",
    metaTitle: "Cortinas a medida",
    metaDescription:
      "Cortinas y telones para tu casa o local. Diseño de interiores en Zona Norte y CABA. Control de luz, privacidad y estética.",
    intro:
      "Las cortinas son el filtro entre tu casa y el exterior. Diseñamos soluciones a medida en Zona Norte y Buenos Aires que combinan telas livianas, blackouts y sistemas cuidadosamente resueltos para controlar la luz sin perder calidez.",
    bullets: [
      "Leemos la orientación de cada ambiente y cómo entra el sol a lo largo del día para definir capas de tela.",
      "Elegimos tramas, pesos y caídas que acompañen la arquitectura y la altura del ambiente.",
      "Definimos rieles ocultos, barrales vistos o sistemas motorizados según la situación.",
    ],
    materials: [
      {
        title: "Telas de base",
        description:
          "Linos y linos mezclados, voiles y sheers que dejan pasar la luz y suavizan vistas hacia el exterior.",
      },
      {
        title: "Blackouts y dobles cortinas",
        description:
          "Tejidos técnicos y composiciones dobles (blackout + tela liviana) para dormitorios y espacios que necesitan oscurecerse.",
      },
      {
        title: "Rieles y sistemas",
        description:
          "Rieles a medida, rieles embutidos y barrales según altura, profundidad de techo y estética buscada.",
      },
    ],
    process: [
      "Medimos vanos, alturas y condicionantes de zócalos, radiadores o muebles existentes.",
      "Definimos el recorrido de las cortinas y si conviene sumar bandejas o falsos techos para ocultar rieles.",
      "Seleccionamos telas y sistemas y presentamos una propuesta con referencias visuales.",
      "Coordinamos confección, instalación y ajustes finos en tu domicilio.",
    ],
    faqs: [
      {
        question: "¿Qué diferencia hay entre blackout y telas de oscurecimiento?",
        answer:
          "El blackout bloquea casi por completo la entrada de luz; las telas de oscurecimiento reducen la intensidad pero mantienen algo de luminosidad. Recomendamos una u otra según el uso del ambiente y tus hábitos.",
      },
      {
        question: "¿Incluyen instalación y rieles?",
        answer:
          "Sí. Nuestro servicio contempla medición, definición de rieles o barrales, confección e instalación en Zona Norte y CABA. Coordinamos todo para que solo tengas que aprobar la propuesta.",
      },
      {
        question: "¿Puedo ver cómo se ve la tela en mi casa antes de decidir?",
        answer:
          "Siempre que es posible llevamos muestras al espacio para ver cómo responde la tela con tu luz natural y el color de paredes y pisos antes de cerrar el pedido.",
      },
    ],
    jsonLdDescription:
      "Diseño, confección e instalación de cortinas a medida en Zona Norte y Buenos Aires, combinando telas livianas, blackouts y sistemas integrados a la arquitectura.",
  },
  {
    slug: "sillones",
    h1: "Sillones que invitan a quedarse",
    metaTitle: "Sillones a medida",
    metaDescription:
      "Sillones, sofás y butacas para living y espacios comerciales. Interiorismo en Zona Norte y Buenos Aires. Diseño y tapizado a medida.",
    intro:
      "El sillón es donde termina el día. Diseñamos y elegimos sillones a medida para livings y espacios de espera en Zona Norte y Buenos Aires, cuidando densidades de espuma, profundidad de asiento y respaldo para que el cuerpo se relaje de verdad.",
    bullets: [
      "Definimos proporciones de asiento y respaldo según la forma en que usás el sillón: leer, mirar series, recibir gente.",
      "Trabajamos con densidades de espuma combinadas y capas de soft para lograr comodidad sin que el sillón se deforme rápido.",
      "Seleccionamos tapizados (lino, pana, cuero, microfibras) según el uso, la luz y el tono general del proyecto.",
    ],
    materials: [
      {
        title: "Estructuras",
        description:
          "Sofás y sillones con estructura en madera maciza y sistemas de soporte pensados para uso diario intenso.",
      },
      {
        title: "Espumas y rellenos",
        description:
          "Combinaciones de densidades y mantas soft que equilibran soporte y suavidad; definimos según peso de uso y cantidad de personas.",
      },
      {
        title: "Tapizados",
        description:
          "Linos lavados, panas suaves, cueros y telas técnicas que resisten manchas y luz natural, con costuras y detalles cuidados.",
      },
    ],
    process: [
      "Relevamos medidas del ambiente, ubicación del sillón y elementos que lo acompañan (mesas, alfombras, TV).",
      "Definimos tipo de pieza (sofá lineal, en L, butacas) y profundidad según la postura buscada.",
      "Elegimos estructura, densidades de espuma y tapizado y armamos una propuesta con referencias de diseño.",
      "Supervisamos el proceso hasta la entrega y ubicación final en el espacio.",
    ],
    faqs: [
      {
        question: "¿Pueden hacer sillones con medidas especiales?",
        answer:
          "Sí. Ajustamos ancho total, profundidad y altura de respaldo para adaptarnos a tu espacio y a la forma en que te gusta sentarte o recostarte.",
      },
      {
        question: "¿Cómo eligen la densidad de la espuma?",
        answer:
          "Trabajamos con combinaciones de densidades y capas superiores soft. Para sillones de uso diario buscamos que sean cómodos, pero que mantengan su forma con el tiempo.",
      },
      {
        question: "¿Qué tapizados recomiendan para casas con chicos o mascotas?",
        answer:
          "Priorizamos telas con alta resistencia al roce y tratamiento antimanchas, microfibras o telas de fácil limpieza. Te mostramos casos concretos según tu estilo y necesidad.",
      },
    ],
    jsonLdDescription:
      "Diseño y selección de sillones y sofás a medida para livings y espacios de espera en Zona Norte y Buenos Aires, cuidando densidades de espuma, proporciones y tapizados.",
  },
  {
    slug: "mesas",
    h1: "Mesas que ordenan la escena",
    metaTitle: "Mesas a medida",
    metaDescription:
      "Mesas de living, comedor y apoyo. Diseño de interiores en Zona Norte y Buenos Aires. Materiales nobles y diseños a medida.",
    intro:
      "La mesa organiza la vida cotidiana: comidas, trabajo, encuentros. Diseñamos y elegimos mesas de comedor, living y apoyo para proyectos en Zona Norte y Buenos Aires, cuidando proporciones, paso libre y relación con sillas e iluminación.",
    bullets: [
      "Calculamos medidas de tablero y paso alrededor según la cantidad de personas y el tamaño del ambiente.",
      "Definimos forma (rectangular, cuadrada, redonda) en función de las circulaciones y vistas principales.",
      "Elegimos materiales y espesores para lograr presencia sin que la mesa se sienta pesada visualmente.",
    ],
    materials: [
      {
        title: "Tableros",
        description:
          "Maderas macizas, enchapados, superficies laqueadas o piedras naturales para mesas que resisten el uso diario.",
      },
      {
        title: "Bases y patas",
        description:
          "Patas en madera o metal, pedestales centrales y soluciones que liberan esquinas para ganar comodidad al sentarse.",
      },
      {
        title: "Mesas de apoyo",
        description:
          "Mesas bajas, auxiliares y consolas que completan el conjunto y resuelven apoyos en livings y halls.",
      },
    ],
    process: [
      "Relevamos medidas del ambiente, ubicación de aberturas y elementos fijos (columnas, escaleras).",
      "Definimos tipología de mesa, cantidad de lugares y relación con sillas y luminarias.",
      "Seleccionamos materiales, espesores y terminaciones y presentamos una propuesta integral.",
      "Coordinamos fabricación, entrega y ubicación final en el espacio.",
    ],
    faqs: [
      {
        question: "¿Pueden diseñar mesas totalmente a medida?",
        answer:
          "Sí. Cuando el espacio o el uso lo piden, diseñamos mesas con medidas, formas y detalles específicos para tu proyecto, y coordinamos su fabricación.",
      },
      {
        question: "¿Qué materiales recomiendan para superficies de alto uso?",
        answer:
          "Depende del tipo de uso. Para comedores diarios solemos proponer maderas resistentes o superficies fáciles de limpiar; para mesas de apoyo podemos sumar mármol u otras piedras naturales.",
      },
      {
        question: "¿Pueden coordinar también las sillas y la iluminación sobre la mesa?",
        answer:
          "Sí. Pensamos la mesa dentro del proyecto completo: definimos sillas, alfombra e iluminación para que el conjunto funcione como una sola escena.",
      },
    ],
    jsonLdDescription:
      "Diseño y selección de mesas de comedor, living y apoyo para proyectos de interiorismo en Zona Norte y Buenos Aires, cuidando proporciones y materiales.",
  },
  {
    slug: "lamparas",
    h1: "Lámparas que dibujan la luz",
    metaTitle: "Lámparas e iluminación",
    metaDescription:
      "Lámparas de pie, techo y apliques para tu casa o local. Diseño de interiores en Zona Norte y Buenos Aires. Iluminación a medida.",
    intro:
      "La iluminación termina de definir la atmósfera de un proyecto. Seleccionamos lámparas de pie, techo y apliques para casas y locales en Zona Norte y Buenos Aires, trabajando temperaturas de color, niveles de luz y puntos de acento.",
    bullets: [
      "Armamos un esquema de luz general, de ambiente y puntual para cada espacio del proyecto.",
      "Elegimos piezas que dialogan con la arquitectura: alturas, proporciones y materiales acordes al espacio.",
      "Coordinamos la ubicación de llaves, tomas y artefactos para que el uso sea intuitivo y cómodo.",
    ],
    materials: [
      {
        title: "Lámparas de pie",
        description:
          "Piezas para lectura y luz de ambiente en livings y dormitorios, con alturas y pantallas adaptadas a cada rincón.",
      },
      {
        title: "Lámparas de techo",
        description:
          "Plafones, colgantes y rieles para comedores, barras y espacios comerciales, definidos según altura y dimensiones del ambiente.",
      },
      {
        title: "Apliques y puntos de acento",
        description:
          "Apliques de pared y spots que resaltan texturas, obras o recorridos, sumando profundidad a la escena.",
      },
    ],
    process: [
      "Analizamos plantas, alturas y fotos del espacio para entender cómo entra la luz natural.",
      "Definimos capas de iluminación, temperaturas de color y niveles según actividad de cada zona.",
      "Seleccionamos modelos de lámparas y ubicaciones y las integramos al resto del proyecto de interiorismo.",
      "Coordinamos compra, instalación y los ajustes de luz necesarios una vez colocadas.",
    ],
    faqs: [
      {
        question: "¿Trabajan solo con lámparas decorativas o también con iluminación técnica?",
        answer:
          "Trabajamos con ambas. Combinamos luminarias técnicas (spots, rieles, empotrados) con piezas decorativas para lograr un esquema completo y coherente.",
      },
      {
        question: "¿Pueden asesorar sobre temperatura de color y nivel de luz?",
        answer:
          "Sí. Definimos temperaturas de color y potencias según la actividad del ambiente y el efecto buscado: más cálido para relax, más neutro para trabajo o cocina.",
      },
      {
        question: "¿Acompañan la instalación de las lámparas?",
        answer:
          "Coordinamos con el equipo de obra o electricista para que la instalación respete alturas, alineaciones y detalles pensados en el proyecto.",
      },
    ],
    jsonLdDescription:
      "Selección e integración de lámparas e iluminación técnica y decorativa para proyectos de interiorismo en Zona Norte y Buenos Aires.",
  },
];

const BY_SLUG: Record<CategorySlug, CategoryLandingData> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
) as Record<CategorySlug, CategoryLandingData>;

export function getCategoryBySlug(slug: CategorySlug): CategoryLandingData {
  const c = BY_SLUG[slug];
  if (!c) throw new Error(`Unknown category: ${slug}`);
  return c;
}

export function getCategorySlugs(): CategorySlug[] {
  return CATEGORIES.map((c) => c.slug);
}

export function getOtherCategoryLinks(currentSlug: CategorySlug): { label: string; href: string }[] {
  const labels: Record<CategorySlug, string> = {
    sillas: "Sillas",
    cortinas: "Cortinas",
    sillones: "Sillones",
    mesas: "Mesas",
    lamparas: "Lámparas",
  };
  return (CATEGORIES.filter((c) => c.slug !== currentSlug).map((c) => ({
    label: labels[c.slug],
    href: `/${c.slug}`,
  })));
}

export function getServiceJsonLd(category: CategoryLandingData) {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: category.h1.replace(" — Toulouse Design", "").trim(),
    description: category.jsonLdDescription,
    provider: { "@id": `${baseUrl}#organization` },
    areaServed: "Zona Norte, Buenos Aires",
    url: `${baseUrl}/${category.slug}`,
  };
}
