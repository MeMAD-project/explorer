module.exports = {
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
          '@graph': '?g',
          label: '?label',
          subject: '$ebucore:hasSubject',
          episodeNumber: '$ebucore:episodeNumber',
          genre: '?genreLabel',
          theme: '?themeLabel',
          description: '$ebucore:description',
          language: '?languageLabel',
          publisher: '?publisher',
          mediaLocator: '?mediaLocator',
          annotation: {
            '@id': '?annotation',
            'type': '?annotationType',
            'body': '?annotationBody',
            'start': '?annotationStart',
            'end': '?annotationEnd',
          },
          caption: {
            '@id': '?caption',
            'text': '?captionText',
            'start': '?captionStart',
            'end': '?captionEnd',
          },
          producerSummary: '?producerSummary',
          keyword: '?keyword',
          contributor: '?contributor',
          publicationStartDateTime: '?publicationStartDateTime',
        }
      ],
      $where: [
        `
        GRAPH ?g {
          ?id a ?rdfType .
          VALUES ?rdfType { ebucore:TVProgramme ebucore:RadioProgramme }
        }
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
        UNION
        {
          OPTIONAL {
            ?id ebucore:hasRelatedTextLine ?subtitle .
            ?annotation a ebucore:TextAnnotation .
            ?annotation ebucore:hasAnnotationTarget ?subtitle .
            ?annotation ebucore:annotationType ?annotationType .
            ?annotation ebucore:hasAnnotationBody ?annotationBody .
            ?annotation ebucore:characterStartIndex ?annotationStart .
            ?annotation ebucore:characterEndIndex ?annotationEnd .
          }
        }
        UNION
        {
          OPTIONAL {
            ?caption a ebucore:Shot .
            ?caption ebucore:isPartOf ?id .
            ?caption ebucore:hasRelatedTextLine ?captionText .
            ?caption ebucore:start ?captionStart .
            ?caption ebucore:end ?captionEnd .
          }
        }
        UNION
        {
          OPTIONAL {
            ?id memad:producerSummary ?producerSummary .
          }
        }
        UNION
        {
          OPTIONAL {
            ?id ebucore:hasKeyword/rdfs:label ?keyword .
          }
        }
        UNION
        {
          OPTIONAL {
            ?id ebucore:hasContributor/ebucore:agentName ?contributor .
          }
        }
        UNION
        {
          OPTIONAL {
            ?id ebucore:hasPublicationHistory/ebucore:hasPublicationEvent/ebucore:publicationStartDateTime ?publicationStartDateTime .
          }
        }
        `
      ],
      $langTag: 'hide',
    },
    mediaFunc: (props) => props.mediaLocator ? `https://explorer.memad.eu/api/limecraft/video?locator=${encodeURIComponent(props.mediaLocator)}` : null,
    excludedMetadata: ['mediaLocator', 'producerSummary', 'annotation', 'caption'],
  },
  subtitleQuery: {
    '@context': 'http://schema.org/',
    '@graph': [
      {
        '@type': '?rdfType',
        '@id': '?id',
        subtitle: {
          '@id': '?subtitle',
          'text': '?subtitleText',
          'start': '?subtitleStart',
          'end': '?subtitleEnd',
          'lang': '?subtitleLang',
        }
      }
    ],
    $where: [
      `
      ?id ebucore:hasRelatedTextLine ?subtitle .
      {
        OPTIONAL { ?subtitle ebucore:textLineContent ?subtitleText . }
      }
      UNION
      {
        OPTIONAL { ?subtitle ebucore:textLineStartTime ?subtitleStart . }
      }
      UNION
      {
        OPTIONAL { ?subtitle ebucore:textLineEndTime ?subtitleEnd . }
      }
      UNION
      {
        OPTIONAL { ?subtitle ebucore:textLineLanguage/rdfs:label ?subtitleLang . FILTER(LANG(?subtitleLang) = "") }
      }
      `
    ],
    $langTag: 'hide',
  },
  labelProp: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#title',
  imageFunc: (props) => props.mediaLocator ? `https://explorer.memad.eu/api/limecraft/thumbnail?locator=${encodeURIComponent(props.mediaLocator)}` : null,
  baseWhere: [
    'GRAPH ?g { ?id a ?rdfType . VALUES ?rdfType { ebucore:TVProgramme ebucore:RadioProgramme } }',
  ],
  metadata: {
    publicationStartDateTime: (value) => new Date(value).toLocaleDateString(),
  },
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
    $where: [
      'GRAPH ?g { ?id a ?rdfType . VALUES ?rdfType { ebucore:TVProgramme ebucore:RadioProgramme } }',
    ],
    $langTag: 'hide',
  },
  filters: [
    {
      id: 'type',
      isBeforeTextSearch: true,
      isToggle: true,
      style: {
        paddingBottom: 24,
        borderBottom: '1px solid #b5afbe',
      },
      values: [
        { label: 'TV', value: 'tv' },
        { label: 'Radio', value: 'radio' },
        { label: 'Both', value: '' },
      ],
      defaultOption: 2,
      whereFunc: (val) => {
        if (val === 'tv') {
          return ['?id a ebucore:TVProgramme'];
        } if (val === 'radio') {
          return ['?id a ebucore:RadioProgramme'];
        }
        return [];
      },
    },
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
          `{
            SELECT DISTINCT ?genre WHERE {
              ?programme ebucore:hasGenre ?genre.
            }
          }`,
          '?genre rdfs:label ?genreLabel',
          'FILTER(LANG(?genreLabel) = "en" || LANG(?genreLabel) = "")',
        ],
        $langTag: 'hide',
      },
      whereFunc: () => [
        '?id ebucore:hasGenre ?genre',
      ],
      filterFunc: (val) => `?genre = <${val}>`,
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
          `{
            SELECT DISTINCT ?theme WHERE {
              ?programme ebucore:hasTheme ?theme.
            }
          }`,
          '?theme rdfs:label ?themeLabel',
          'FILTER(LANG(?themeLabel) = "en" || LANG(?themeLabel) = "")',
        ],
        $langTag: 'hide',
      },
      whereFunc: () => [
        '?id ebucore:hasTheme ?theme',
      ],
      filterFunc: (val) => `?theme = <${val}>`,
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
      filterFunc: (val) => `?language = <${val}>`,
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
};
