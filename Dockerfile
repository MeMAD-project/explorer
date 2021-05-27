FROM d2klab/explorer

ADD ./.env /usr/src/app/
ADD ./config.js /usr/src/app/
ADD ./config/ /usr/src/app/config/
ADD ./theme.js /usr/src/app/
ADD ./images /usr/src/app/public/images
ADD ./locales /usr/src/app/public/static/locales
ADD ./pages/api/limecraft /usr/src/app/src/pages/api/limecraft
ADD ./pages/api/memad /usr/src/app/src/pages/api/memad
ADD ./helpers/connectors/limecraft.js /usr/src/app/src/helpers/connectors/limecraft.js

RUN npm run build

CMD [ "npm", "start" ]
