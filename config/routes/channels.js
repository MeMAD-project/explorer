module.exports = {
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
        'GRAPH ?g { ?id a ebucore:PublicationChannel }',
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
};
