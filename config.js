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
    channels: {
      view: 'browse',
      showInNavbar: true,
      rdfType: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#PublicationChannel',
      uriBase: 'http://data.memad.eu/channel',
      filterByGraph: true,
      details: {
        view: 'collection',
        showPermalink: true,
        query: {
          '@context': 'http://schema.org/',
          '@graph': [
            {
              '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#PublicationChannel',
              '@id': '?id',
              '@graph': '?g',
              label: '$ebucore:publicationChannelName$required$var:label',
              serviceDescription: '$ebucore:serviceDescription',
              items: {
                '@id': '?item',
                '@type': '?itemType',
                label: '?itemLabel'
              },
            },
          ],
          $where: [
            '?event ebucore:isReleasedBy ?id',
            '?event ebucore:publishes ?programme',
            '?item ebucore:isParentOf ?programme',
            '?item a ?itemType',
            '?item ebucore:title ?itemLabel',
          ],
          $langTag: 'hide',
        },
      },
      labelProp: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#publicationChannelName',
      subtitleFunc: () => null,
      baseWhere: [
        'GRAPH ?g { ?id a ebucore:PublicationChannel }',
      ],
      query: {
        '@context': 'http://schema.org/',
        '@graph': [
          {
            '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#PublicationChannel',
            '@id': '?id',
            '@graph': '?g',
            label: '$ebucore:publicationChannelName$required$var:label',
          },
        ],
        $where: [
          'GRAPH ?g { ?id a ebucore:PublicationChannel }',
        ],
        $langTag: 'hide',
      },
      filters: [
        {
          id: 'serviceDescription',
          isMulti: false,
          isSortable: true,
          query: {
            '@graph': [
              {
                '@id': '?serviceDescription',
                label: '?serviceDescription',
              },
            ],
            $where: [
              '?channel ebucore:serviceDescription ?serviceDescription',
            ],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?id ebucore:serviceDescription ?serviceDescription',
          ],
          filterFunc: (value) => {
            return [`?serviceDescription = ${JSON.stringify(value)}`];
          },
        },
      ],
    },
    collections: {
      view: 'browse',
      showInNavbar: true,
      uriBase: 'http://data.memad.eu',
      rdfType: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Collection',
      filterByGraph: true,
      details: {
        view: 'collection',
        showPermalink: true,
        query: {
          '@context': 'http://schema.org/',
          '@graph': [
            {
              '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Collection',
              '@id': '?id',
              '@graph': '?g',
              label: '$ebucore:title$required$var:label',
              items: {
                '@id': '?item',
                '@type': '?itemType',
                label: '?itemLabel'
              },
              itemsCount: '?itemsCount',
            },
          ],
          $where: [
            'GRAPH ?g { ?id a ebucore:Collection }',
            '?id ebucore:isParentOf ?item',
            '?item a ?itemType',
            '?item ebucore:title ?itemLabel',
            // Get items count
            '{ SELECT ?id (COUNT(DISTINCT ?item) AS ?itemsCount) WHERE { ?id ebucore:isParentOf ?item. } }',
          ],
          $langTag: 'hide',
        },
      },
      labelProp: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title',
      subtitleFunc: (props) => `${props.itemsCount} programmes`,
      baseWhere: [
        'GRAPH ?g { ?id a ebucore:Collection }',
      ],
      query: {
        '@context': 'http://schema.org/',
        '@graph': [
          {
            '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Collection',
            '@id': '?id',
            '@graph': '?g',
            label: '$ebucore:title$required$var:label',
            itemsCount: '?itemsCount',
          },
        ],
        $where: [
          'GRAPH ?g { ?id a ebucore:Collection }',
          '?id ebucore:isParentOf ?item',
          // Get items count
          '{ SELECT ?id (COUNT(DISTINCT ?item) AS ?itemsCount) WHERE { ?id ebucore:isParentOf ?item } }',
        ],
        $langTag: 'hide',
      },
      filters: [],
    },
    programmes: {
      view: 'browse',
      showInNavbar: true,
      uriBase: 'http://data.memad.eu',
      rdfType: ['http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#TVProgramme', 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#RadioProgramme'],
      filterByGraph: false,
      details: {
        view: 'video',
        showPermalink: true,
        query: {
          '@context': 'http://schema.org/',
          '@graph': [
            {
              '@type': '?rdfType',
              '@id': '?id',
              label: '?label',
              subject: '$ebucore:hasSubject',
              episodeNumber: '$ebucore:episodeNumber',
              genre: '?genreLabel',
              theme: '?themeLabel',
              description: '$ebucore:description',
              language: '?languageLabel',
              publisher: '?publisher',
              mediaLocator: '?mediaLocator',
            }
          ],
          $where: [
            `
            {
              ?id a ?rdfType
              VALUES ?rdfType { ebucore:TVProgramme ebucore:RadioProgramme }
            }
            UNION
            {
              ?id ebucore:title ?label .
            }
            UNION
            {
              OPTIONAL {
                ?id ebucore:hasGenre/rdfs:label ?genreLabel .
                FILTER(LANGMATCHES(LANG(?genreLabel), "en") || LANG(?genreLabel) = "")
              }
            }
            UNION
            {
              OPTIONAL {
                ?id ebucore:hasTheme/rdfs:label ?themeLabel .
                FILTER(LANGMATCHES(LANG(?themeLabel), "en") || LANG(?themeLabel) = "")
              }
            }
            UNION
            {
              OPTIONAL {
                ?id ebucore:hasLanguage/rdfs:label ?languageLabel .
                FILTER(LANGMATCHES(LANG(?languageLabel), "en") || LANG(?languageLabel) = "")
              }
            }
            UNION
            {
              OPTIONAL { ?id <http://purl.org/dc/terms/publisher> ?publisher }
            }
            UNION
            {
              OPTIONAL { ?id ebucore:isInstantiatedBy/ebucore:locator ?mediaLocator }
            }
            `
          ],
          $langTag: 'hide',
        },
        mediaFunc: (props) => props.mediaLocator ? `https://explorer.memad.eu/api/limecraft/video?locator=${encodeURIComponent(props.mediaLocator)}` : null,
        excludedMetadata: ['mediaLocator'],
      },
      labelProp: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title',
      imageFunc: (props) => props.mediaLocator ? `https://explorer.memad.eu/api/limecraft/thumbnail?locator=${encodeURIComponent(props.mediaLocator)}` : null,
      baseWhere: [
        'GRAPH ?g { ?id a ebucore:TVProgramme }',
      ],
      query: {
        '@context': 'http://schema.org/',
        '@graph': [
          {
            '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#TVProgramme',
            '@id': '?id',
            '@graph': '?g',
            label: '$ebucore:title$required$var:label',
            mediaLocator: '$ebucore:isInstantiatedBy/ebucore:locator',
          }
        ],
        $where: ['GRAPH ?g { ?id a ebucore:TVProgramme }'],
        $langTag: 'hide',
      },
      filters: [
        {
          id: 'genre',
          isMulti: true,
          isSortable: true,
          query: {
            '@graph': [
              {
                '@id': '?genre',
                label: '?genreLabel',
              },
            ],
            $where: [
              '?programme ebucore:hasGenre ?genre',
              '?genre rdfs:label ?genreLabel',
            ],
            $filter: [
              'LANGMATCHES(LANG(?genreLabel), "en") || LANG(?genreLabel) = ""',
            ],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?id ebucore:hasGenre ?genre',
          ],
          filterFunc: (values) => {
            return [values.map((val) => `?genre = <${val}>`).join(' || ')];
          },
        },
        {
          id: 'theme',
          isMulti: true,
          isSortable: true,
          query: {
            '@graph': [
              {
                '@id': '?theme',
                label: '?themeLabel',
              },
            ],
            $where: [
              '?programme ebucore:hasTheme ?theme',
              '?theme rdfs:label ?themeLabel',
            ],
            $filter: [
              'LANGMATCHES(LANG(?themeLabel), "en") || LANG(?themeLabel) = ""',
            ],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?id ebucore:hasTheme ?theme',
          ],
          filterFunc: (values) => {
            return [values.map((val) => `?theme = <${val}>`).join(' || ')];
          },
        },
        {
          id: 'language',
          isMulti: true,
          isSortable: true,
          query: {
            '@graph': [
              {
                '@id': '?language',
                label: '?languageLabel',
              },
            ],
            $where: [
              `{
                SELECT DISTINCT ?language WHERE {
                  ?filter ebucore:hasLanguage ?language.
                }
              }`,
              '?language rdfs:label ?languageLabel',
              'FILTER(LANG(?languageLabel) = "en" || LANG(?languageLabel) = "")',
            ],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?id ebucore:hasLanguage ?language',
          ],
          filterFunc: (values) => {
            return [values.map((val) => `?language = <${val}>`).join(' || ')];
          },
        },
        {
          id: 'with-video',
          isOption: true,
          defaultValue: true,
          whereFunc: () => [
            '?id ebucore:isInstantiatedBy/ebucore:locator ?mediaLocator',
          ],
        },
        {
          id: 'with-segments',
          isOption: true,
          whereFunc: () => [
            '?id ebucore:hasPart ?part',
          ],
        }
      ],
    },
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
