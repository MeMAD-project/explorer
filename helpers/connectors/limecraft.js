// API documentation : https://platform.limecraft.com/api/documentation/#flatdoc/readme/cases/upload-transcribe.md

import queryString from 'query-string';

let sessionToken = null;
let sessionTokenExp = new Date(0);

export const login = async () => {
  const url = process.env.LIMECRAFT_URL;
  const payload = {
    username: process.env.LIMECRAFT_USERNAME,
    password: process.env.LIMECRAFT_PASSWORD,
    rememberMe: false,
    useCookies: false,
  };
  const data = await (
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: queryString.stringify(payload),
    })
  ).json();
  sessionToken = data.token;
  sessionTokenExp = new Date();
  sessionTokenExp.setTime(sessionTokenExp.getTime() + 1 * 60 * 60 * 1000);
};

export const getToken = async () => {
  // If the token expiration is in the past, the session is no more valid
  if (sessionTokenExp < new Date()) {
    await login();
  }
  return sessionToken;
};

export const locatorToVideo = async (locator) => {
  if (typeof locator !== 'string' || locator.length === 0) {
    return null;
  }

  const token = await getToken();
  console.log('locatorToVideo', `${locator}?${queryString.stringify({ access_token: token })}`);

  // moa
  const data = await (
    await fetch(`${locator}?${queryString.stringify({ access_token: token })}`)
  ).json();
  const { moi } = data.hrefs;

  // moi
  const data2 = await (
    await fetch(`${moi}?${queryString.stringify({ access_token: token })}`)
  ).json();
  const videos = data2.filter((d) => d.mimeType.startsWith('video'));
  if (videos.length === 0) {
    return null;
  }
  const { downloadLink } = videos[0].hrefs;

  // downloadLink
  const text = await (
    await fetch(`${downloadLink}?${queryString.stringify({ access_token: token })}`)
  ).text();

  return text;
};

export const locatorToThumbnail = async (locator) => {
  if (typeof locator !== 'string' || locator.length === 0) {
    return null;
  }

  const token = await getToken();

  // moa
  const data = await (
    await fetch(`${locator}?${queryString.stringify({ access_token: token })}`)
  ).json();

  const { thumb } = data.hrefs;
  return `${thumb}?access_token=${token}`;
};
