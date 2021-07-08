import { withRequestValidation } from '@helpers/api';
import { idToUri, removeEmptyObjects, getQueryObject } from '@helpers/utils';
import SparqlClient from '@helpers/sparql';
import config from '~/config';

function formatTime(time) {
  const timeArray = time.split('.');
  const milliseconds = timeArray[1] || '000';
  return `${timeArray[0]}.${milliseconds.substr(0, 3)}`;
}

export default withRequestValidation({
  allowedMethods: ['GET'],
})(async (req, res) => {
  const { query } = req;

  const route = config.routes[query.type];
  if (!route) {
    res.status(404).json({ error: { message: 'Route not found' } });
    return;
  }

  const jsonQuery = route.subtitleQuery;
  const searchQuery = JSON.parse(JSON.stringify(getQueryObject(jsonQuery)));
  searchQuery.$filter = searchQuery.$filter || [];
  searchQuery.$filter.push(
    `?id = <${idToUri(query.id, {
      base: route.uriBase,
    })}>`
  );

  const queryRes = await SparqlClient.query(searchQuery, {
    endpoint: config.api.endpoint,
    debug: config.debug,
  });

  const result = queryRes && removeEmptyObjects(queryRes['@graph'][0]);

  let vtt = 'WEBVTT\n\n';

  if (result) {
    result.subtitle.sort((a, b) => {
      if (a.start === b.start) {
        return a.end > b.end ? 1 : -1;
      }
      return a.start > b.start ? 1 : -1;
    })
    result.subtitle.filter(subtitle => subtitle.lang === query.lang).forEach(subtitle => {
      vtt += `${formatTime(subtitle.start)} --> ${formatTime(subtitle.end)}\n${subtitle.text}\n\n`;
    });
  }

  res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
  res.status(200).send(vtt);
});
