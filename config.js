const channels = require('./config/routes/channels');
const collections = require('./config/routes/collections');
const programmes = require('./config/routes/programmes');

module.exports = {
  debug: typeof process !== 'undefined' && process.env.NODE_ENV === 'development',
  metadata: {
    title: 'MEMAD',
    logo: '/images/logo.png',
  },
  home: {
    hero: {
      showHeadline: true,
      showLogo: true,
    },
  },
  footer: {
    logo: '/images/footer.png',
  },
  search: {
    route: 'programmes',
    allowTextSearch: true,
    textSearchQuery: {
      '@graph': [
        {
          '@id': '?id',
          '@type': '?rdfType',
          label: '?label',
        },
      ],
      $where: [
        '?id a ?rdfType',
        '?id ?labelType ?label',
      ],
      $values: {
        '?rdfType': [
          'ebucore:PublicationChannel',
          'ebucore:Collection',
          'ebucore:TVProgramme',
          'ebucore:RadioProgramme'
        ],
        '?labelType': [
          'ebucore:title',
          'ebucore:publicationChannelName'
        ]
      },
      $langTag: 'hide',
    },
    allowImageSearch: false,
    placeholderImage: '/images/placeholder.jpg',
    languages: {
      en: 'English',
      fr: 'Français',
    },
    defaultLanguage: 'en',
  },
  api: {
    endpoint: 'https://memad.eurecom.fr/sparql-endpoint',
    prefixes: {
      'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
      'schema': 'http://schema.org/',
      'dc': 'http://purl.org/dc/elements/1.1/',
      'skos': 'http://www.w3.org/2004/02/skos/core#',
      'ebucore': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#'
    }
  },
  routes: {
    channels,
    collections,
    programmes,
  },
  graphs: {
    'http://data.memad.eu/graph/ina-ld': {
      label: 'INA',
      icon: '/images/graphs/http-data-memad-eu-graph-ina-ld.png',
    },
    'http://data.memad.eu/graph/yle': {
      label: 'Yle',
      icon: '/images/graphs/http-data-memad-eu-graph-yle.png',
    }
  },
  vocabularies: {},
  plugins: {
    videoSegments: {
      query: {
        '@graph': [
          {
            '@id': '?id',
            start: '$ebucore:start$sample',
            end: '$ebucore:end$sample',
            title: '$ebucore:title',
            description: '$ebucore:description',
          },
        ],
        $where: [
          '?id a ebucore:Part',
          '?video ebucore:hasPart ?id',
        ],
        $langTag: 'hide',
      }
    }
  }
};
