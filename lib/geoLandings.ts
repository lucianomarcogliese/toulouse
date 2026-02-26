/**
 * Landings SEO geográficas: datos por página.
 * Rutas: /sillones-zona-norte, /cortinas-nordelta, /interiorismo-tigre, /diseno-interiores-zona-norte
 */

export const GEO_LANDING_SLUGS = [
  "sillones-zona-norte",
  "cortinas-nordelta",
  "interiorismo-tigre",
  "diseno-interiores-zona-norte",
] as const;

export type GeoLandingSlug = (typeof GEO_LANDING_SLUGS)[number];

export interface GeoLandingData {
  slug: GeoLandingSlug;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  body: string;
  categoryLabel: string;
  categoryHref: string;
}

const DATA: Record<GeoLandingSlug, GeoLandingData> = {
  "sillones-zona-norte": {
    slug: "sillones-zona-norte",
    metaTitle: "Sillones zona norte — Toulouse Design",
    metaDescription:
      "Sillones y sofás a medida para Zona Norte: San Isidro, Vicente López, Tigre, Nordelta. Interiorismo en Buenos Aires. Consultá por tu proyecto.",
    h1: "Sillones en Zona Norte: diseño a medida para tu living",
    intro:
      "En Toulouse Design trabajamos con clientes de San Isidro, Vicente López, Tigre, Nordelta y toda la Zona Norte del Gran Buenos Aires. Si buscás sillones que se adapten a las medidas de tu living, con tapizados de calidad y un proceso claro, podemos coordinar una primera charla para conocer tu espacio y tu estilo.",
    body:
      "Muchos de nuestros proyectos de sillones y sofás son en casas con grandes ventanales o livings integrados con el jardín. Por eso cuidamos las proporciones, la resistencia al sol de las telas y la sensación de confort sin recargar el ambiente. Trabajamos con estructuras en madera maciza, densidades de espuma adecuadas y tapizados en lino, pana o cuero según el uso que le vayas a dar.",
    categoryLabel: "Ver todos los sillones",
    categoryHref: "/sillones",
  },
  "cortinas-nordelta": {
    slug: "cortinas-nordelta",
    metaTitle: "Cortinas Nordelta — Toulouse Design",
    metaDescription:
      "Cortinas a medida en Nordelta y Zona Norte. Control de luz, blackout e instalación. Diseño de interiores en Buenos Aires.",
    h1: "Cortinas a medida en Nordelta y Zona Norte",
    intro:
      "En Nordelta y en barrios como Tigre, Benavídez y Escobar las casas suelen tener ventanales grandes y mucha luz natural. Las cortinas no solo resuelven privacidad y control del sol: ayudan a definir la atmósfera de cada ambiente. En Toulouse Design proyectamos e instalamos cortinas a medida en Nordelta y alrededores, con telas livianas, blackout o combinaciones según tu necesidad.",
    body:
      "Incluimos medición en tu domicilio, asesoría en tipo de tela y sistema (rieles embutidos, barrales vistos o motorizados) y la instalación final. Trabajamos con sheers, linos y blackouts técnicos para dormitorios y espacios de trabajo. Si ya tenés las aberturas definidas, podemos enfocarnos en la elección de tramas y colores para que las cortinas dialoguen con el resto del proyecto.",
    categoryLabel: "Ver cortinas y opciones",
    categoryHref: "/cortinas",
  },
  "interiorismo-tigre": {
    slug: "interiorismo-tigre",
    metaTitle: "Interiorismo Tigre — Toulouse Design",
    metaDescription:
      "Estudio de interiorismo en Tigre y Zona Norte. Proyectos residenciales y comerciales. Concepto, materiales y dirección de obra.",
    h1: "Interiorismo en Tigre: proyectos con calma y carácter",
    intro:
      "Tigre y la Zona Norte tienen una identidad propia: casas con jardín, luz natural generosa y una mezcla de vida tranquila y conexión con Buenos Aires. En Toulouse Design llevamos años trabajando en Tigre, Nordelta, San Isidro y Vicente López con proyectos de diseño de interiores que respetan la arquitectura y el modo de vivir de cada familia.",
    body:
      "Ofrecemos diseño integral: concepto del espacio, selección de materiales, mobiliario, iluminación y cortinas, y dirección de obra cuando hace falta. No vendemos solo muebles: armamos una propuesta coherente para que tu casa o local se sienta propio. Si estás pensando en renovar un ambiente o en proyectar una casa nueva en Tigre, podemos coordinar una primera reunión para contarte cómo trabajamos.",
    categoryLabel: "Nuestros servicios",
    categoryHref: "/servicios",
  },
  "diseno-interiores-zona-norte": {
    slug: "diseno-interiores-zona-norte",
    metaTitle: "Diseño de interiores Zona Norte — Toulouse Design",
    metaDescription:
      "Estudio de diseño de interiores en Zona Norte: San Isidro, Vicente López, Tigre, Nordelta, Olivos. Proyectos residenciales y comerciales.",
    h1: "Diseño de interiores en Zona Norte: tu espacio, a tu medida",
    intro:
      "Toulouse Design es un estudio de interiorismo boutique que trabaja en la Zona Norte del Gran Buenos Aires: San Isidro, Vicente López, Olivos, Martínez, Tigre, Nordelta y alrededores. Nos especializamos en proyectos residenciales y comerciales donde el concepto, los materiales y la forma de habitar se piensan en conjunto.",
    body:
      "No nos limitamos a elegir muebles: diseñamos atmósferas. Eso implica pensar la circulación, la luz natural y artificial, las texturas y los colores como un solo relato. Trabajamos con clientes que buscan un resultado con personalidad, sin plantillas repetidas. Si querés renovar un living, un comedor, una oficina o un local en Zona Norte, te invitamos a escribirnos y contarnos tu proyecto.",
    categoryLabel: "Ver servicios",
    categoryHref: "/servicios",
  },
};

export function getGeoLandingData(slug: GeoLandingSlug): GeoLandingData {
  const data = DATA[slug];
  if (!data) throw new Error(`Unknown geo landing: ${slug}`);
  return data;
}

export function isGeoLandingSlug(s: string): s is GeoLandingSlug {
  return GEO_LANDING_SLUGS.includes(s as GeoLandingSlug);
}
