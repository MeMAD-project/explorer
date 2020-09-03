import { withRequestValidation } from '@helpers/api';
import { locatorToThumbnail } from '@helpers/connectors/limecraft';

export default withRequestValidation({
  allowedMethods: ['GET'],
})(async (req, res) => {

  const { locator } = req.query;

  const thumbnailUrl = await locatorToThumbnail(locator);
  console.log('Fetching thumbnail:', thumbnailUrl);

  const fetchRes = await fetch(thumbnailUrl);
  res.status(fetchRes.status);
  return fetchRes.body.pipe(res);
});
