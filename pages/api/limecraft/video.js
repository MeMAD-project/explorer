import { withRequestValidation } from '@helpers/api';
import { locatorToVideo } from '@helpers/connectors/limecraft';

export default withRequestValidation({
  allowedMethods: ['GET'],
})(async (req, res) => {
  const { locator } = req.query;

  const videoUrl = await locatorToVideo(locator);
  console.log('Fetching video:', videoUrl);

  res.send(videoUrl);
  // const fetchRes = await fetch(videoUrl);
  // res.status(fetchRes.status);
  // return fetchRes.body.pipe(res);
});
