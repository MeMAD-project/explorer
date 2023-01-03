module.exports = {
  view: 'browse',
  showInNavbar: true,
  uriBase: 'http://data.memad.eu',
  rdfType: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Collection',
  filterByGraph: true,
  details: {
    view: 'collection',
    showPermalink: true,
    excludedMetadata: ['items', 'itemsCount'],
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
};
