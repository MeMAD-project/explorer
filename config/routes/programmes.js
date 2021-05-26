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
};
