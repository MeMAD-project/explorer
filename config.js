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
        'FILTER(?rdfType = <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#TVProgramme> || ?rdfType = <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#PublicationChannel>)',
        '?id ?labelType ?label',
        'FILTER(?labelType = <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title> || ?labelType = <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#publicationChannelName>)',
      ],
      $limit: 5,
      $langTag: 'hide',
    },
    allowImageSearch: false,
    placeholderImage: '/images/placeholder.jpg',
    languages: {
      en: 'English',
      fr: 'French',
    },
    defaultLanguage: 'en',
  },
  api: {
    endpoint: 'https://memad.eurecom.fr/sparql-endpoint',
  },
  routes: {
    channels: {
      view: 'browse',
      showInNavbar: true,
      rdfType: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#PublicationChannel',
      uriBase: 'http://data.memad.eu/channel',
      filterByGraph: false,
      details: {
        view: 'collection',
        query: {
          '@context': 'http://schema.org/',
          '@graph': [
            {
              '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#PublicationChannel',
              '@id': '?id',
              '@graph': '?g',
              label: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#publicationChannelName>$required$var:label',
              serviceDescription: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#serviceDescription>',
              items: {
                '@id': '?item',
                '@type': '?itemType',
                label: '?itemLabel'
              },
            },
          ],
          $where: [
            '?event <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isReleasedBy> ?id',
            '?event <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#publishes> ?programme',
            '?item <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isParentOf> ?programme',
            '?item a ?itemType',
            '?item <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title> ?itemLabel',
          ],
          $langTag: 'hide',
        },
      },
      labelProp: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#publicationChannelName',
      labelFunc: (props) => props.label,
      subtitleFunc: () => null,
      baseWhere: [
        'GRAPH ?g { ?id a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#PublicationChannel> }',
      ],
      query: {
        '@context': 'http://schema.org/',
        '@graph': [
          {
            '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#PublicationChannel',
            '@id': '?id',
            '@graph': '?g',
            label: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#publicationChannelName>$required$var:label',
          },
        ],
        $where: [
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
              '?channel <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#serviceDescription> ?serviceDescription',
            ],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#serviceDescription> ?serviceDescription',
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
      filterByGraph: false,
      details: {
        view: 'collection',
        query: {
          '@context': 'http://schema.org/',
          '@graph': [
            {
              '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Collection',
              '@id': '?id',
              '@graph': '?g',
              label: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title>$required$var:label',
              items: {
                '@id': '?item',
                '@type': '?itemType',
                label: '?itemLabel'
              },
              itemsCount: '?itemsCount',
            },
          ],
          $where: [
            'GRAPH ?g { ?id a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Collection> }',
            '?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isParentOf> ?item',
            '?item a ?itemType',
            '?item <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title> ?itemLabel',
            // Get items count
            '{ SELECT ?id (COUNT(DISTINCT ?item) AS ?itemsCount) WHERE { ?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isParentOf> ?item. } }',
          ],
          $langTag: 'hide',
        },
      },
      labelProp: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title',
      labelFunc: (props) => props.label,
      subtitleFunc: (props) => `${props.itemsCount} programmes`,
      baseWhere: [
        'GRAPH ?g { ?id a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Collection> }',
      ],
      query: {
        '@context': 'http://schema.org/',
        '@graph': [
          {
            '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Collection',
            '@id': '?id',
            '@graph': '?g',
            label: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title>$required$var:label',
            itemsCount: '?itemsCount',
          },
        ],
        $where: [
          'GRAPH ?g { ?id a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Collection> }',
          '?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isParentOf> ?item',
          // Get items count
          '{ SELECT ?id (COUNT(DISTINCT ?item) AS ?itemsCount) WHERE { ?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isParentOf> ?item } }',
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
        query: {
          '@context': 'http://schema.org/',
          '@graph': [
            {
              '@type': '?rdfType',
              '@id': '?id',
              label: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title>$required$var:label',
              subject: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasSubject>',
              episodeNumber: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#episodeNumber>',
              genre: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasGenre>',
              theme: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasTheme>',
              description: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#description>',
              language: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasLanguage>',
              publisher: '$<http://purl.org/dc/terms/publisher>',
              mediaLocator: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isInstantiatedBy>/<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#locator>',
            }
          ],
          $where: [
            '?id a ?rdfType',
            'VALUES ?rdfType { <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#TVProgramme> <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#RadioProgramme> }',
          ],
          $langTag: 'hide',
        },
        mediaFunc: (props) => props.mediaLocator ? `https://explorer.memad.eu/api/limecraft/video?locator=${encodeURIComponent(props.mediaLocator)}` : null,
      },
      labelProp: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title',
      labelFunc: (props) => props.label,
      imageFunc: (props) => props.mediaLocator ? `https://explorer.memad.eu/api/limecraft/thumbnail?locator=${encodeURIComponent(props.mediaLocator)}` : null,
      baseWhere: [
        `GRAPH ?g {
          ?id a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#TVProgramme> .
          FILTER EXISTS { ?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isInstantiatedBy>/<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#locator> ?mediaLocator }
        }`,
      ],
      query: {
        '@context': 'http://schema.org/',
        '@graph': [
          {
            '@type': 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#TVProgramme',
            '@id': '?id',
            label: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title>$required$var:label',
            mediaLocator: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isInstantiatedBy>/<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#locator>',
          }
        ],
        $where: ['?id a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#TVProgramme>'],
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
                label: '?genre',
              },
            ],
            $where: [
              '?programme <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasGenre> ?genre',
            ],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasGenre> ?genre',
          ],
          filterFunc: (values) => {
            return [values.map((val) => `?genre = ${JSON.stringify(val)}`).join(' || ')];
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
                label: '?theme',
              },
            ],
            $where: [
              '?programme <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasTheme> ?theme',
            ],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasTheme> ?theme',
          ],
          filterFunc: (values) => {
            return [values.map((val) => `?theme = ${JSON.stringify(val)}`).join(' || ')];
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
                label: '?language',
              },
            ],
            $where: [
              '?filter <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasLanguage> ?language',
            ],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasLanguage> ?language',
          ],
          filterFunc: (values) => {
            return [values.map((val) => `?language = ${JSON.stringify(val)}`).join(' || ')];
          },
        },
        {
          id: 'with-video',
          isOption: true,
          whereFunc: () => [
            '?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#isInstantiatedBy>/<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#locator> ?mediaLocator',
          ],
        },
        {
          id: 'with-segments',
          isOption: true,
          whereFunc: () => [
            '?id <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasPart> ?part',
          ],
        }
      ],
    },
  },
  graphs: [],
  vocabularies: {},
  plugins: {
    videoSegments: {
      query: {
        '@graph': [
          {
            '@id': '?id',
            start: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#start>$sample',
            end: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#end>$sample',
            title: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title>',
            description: '$<http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#description>',
          },
        ],
        $where: [
          '?id a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Part>',
          '?video <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#hasPart> ?id',
        ],
        $langTag: 'hide',
      }
    }
  }
};
