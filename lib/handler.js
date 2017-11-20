const DEV_ENV = process.env.NODE_ENV === 'development';
const LOCAL_ENV = process.env.NODE_ENV === 'local';
const http = require('http').Server;
const url = require('url');
const pathToRegexp = require('path-to-regexp');
const isStream = require('isstream');
const loadBody = require('raw-body');
const mediatype = require('media-typer');
const rawBody = new WeakMap();

const serve = fn => http((req, res) => exports.handle(req, res, fn));
module.exports = serve;
exports = serve;
exports.default = serve;

exports.handle = (req, res, fn, err) =>
  new Promise(async (resolve, reject) => {
    if (err) return reject(err);
    if (!fn) return reject(createError(404, 'Not found', err));

    try {
      const handled = await fn(req, res);
      resolve(handled ? handled : null);
    } catch (err) {
      reject(err);
    }
  })
    .then(val => {
      if (val === null) return send(res, 204, null);
      if (undefined !== val) send(res, res.statusCode || 200, val);
    })
    .catch(err => sendError(req, res, err));

exports.buffer = exports.withBuffer = (req, {limit = '1mb', enc} = {}) =>
  Promise.resolve().then(() => {
    const type = req.headers['content-type'] || 'text/plain';
    const length = req.headers['content-length'];
    enc = enc === undefined ? mediatype.parse(type).parameters.charset : enc;
    const body = rawBody.get(req);

    if (body) return body;

    return loadBody(req, {limit, length, enc})
      .then(buf => {
        rawBody.set(req, buf);
        return buf;
      })
      .catch(err => {
        if (err.type === 'entity.too.large') {
          throw createError(413, `Body exceeded ${limit} limit`, err);
        } else {
          throw createError(400, 'Invalid body', err);
        }
      });
  });

exports.text = (req, {limit, enc} = {}) =>
  exports.buffer(req, {limit, enc}).then(body => body.toString(enc));

exports.withTextBody = options => handler => async (req, res) => {
  req.body = exports.text(req, options);
  return await (handler && handler(req, res));
};

exports.json = (req, options) =>
  exports.text(req, options).then(body => parseJSON(body));
exports.withJsonBody = options => handler => async (req, res) => {
  req.body = await exports.json(req, options);
  return await (handler && handler(req, res));
};

exports.compose = (...fns) =>
  fns.reduce(
    (f, g) => (...args) => (g ? f(g(...args)) : f(...args)),
    fn => async (...args) => fn(...args)
  );

exports.cors = exports.withCORS = options => handler => async (req, res) => {
  if (!res) return await (handler && handler(req, res));

  const DEFAULT_ALLOW_METHODS = [
    'POST',
    'GET',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ];
  const DEFAULT_ALLOW_HEADERS = [
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'X-HTTP-Method-Override',
    'Content-Type',
    'Authorization',
    'Accept'
  ];
  const DEFAULT_MAX_AGE_24H_IN_SECONDS = 60 * 60 * 24;
  const {maxAge, origin, allowHeaders, allowMethods} = options || {};

  res.setHeader(
    'Access-Control-Max-Age',
    '' + (maxAge || DEFAULT_MAX_AGE_24H_IN_SECONDS)
  );
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    (allowMethods || DEFAULT_ALLOW_METHODS).join(',')
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    (allowHeaders || DEFAULT_ALLOW_HEADERS).join(',')
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return {};
  return await (handler && handler(req, res));
};

exports.query = exports.withQuery = options => handler => async (req, res) => {
  req.query = url.parse(req.url, true).query;
  return await (handler && handler(req, res));
};

exports.time = exports.withTime = ({suffix = false} = {}) => handler => async (
  req,
  res
) => {
  const startAt = process.hrtime();
  const handled = await (handler && handler(req, res));
  const diff = process.hrtime(startAt);
  const time = diff[0] * 1e3 + diff[1] * 1e-6;
  res &&
    res.setHeader('X-Response-Time', `${time.toFixed(2)}${suffix ? 'ms' : ''}`);
  return handled;
};

exports.redirect = exports.withRedirect = ({target, path}) => handler => async (
  req,
  res
) => {
  if (!res) return await (handler && handler(req, res));
  if (!req) return await (handler && handler(req, res));

  const uri = url.parse(req.url, true);
  const pathMatchingPattern = pathToRegexp(path);
  const isPatternMatchesPath = pathMatchingPattern.exec(
    req.url.replace(uri.search, '')
  );

  if (!isPatternMatchesPath) return handler(req, res);
  if (!isPatternMatchesPath.length) return handler(req, res);
  res.statusCode = 302;
  res.setHeader('Location', target);
  return await (handler && handler(req, res));
};

exports.log = exports.withLog = ({json}) => handler => async (req, res) => {
  const handled = await (handler && handler(req, res));

  res &&
    res.once('finish', () => {
      if (json) {
        return console.log(
          JSON.stringify({
            host: req.headers.host || '',
            path: req.url || '',
            statusCode: res.statusCode || '0',
            method: req.method || '',
            clientIP:
              req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            useragent: req.headers['user-agent'] || '',
            inBytes: req.headers['content-length'] || 0,
            outBytes: res.getHeader('Content-Length') || 0,
            time: res.getHeader('X-Response-Time') || 0
          })
        );
      }

      console.log(
        `${req.headers.host || '-'} ${req.url || '-'} ${res.statusCode ||
          0} ${req.method || '-'} ${req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          '-'} ${req.headers['user-agent'] || '-'} ${req.headers[
          'content-length'
        ] || 0} ${res.getHeader('Content-Length') || 0}`
      );
    });

  return handled;
};

exports.interval = exports.withInterval = ({period}) => handler => {
  setInterval(handler, period || 1000);
  return () => ({});
};

exports.withParams = ({path}) => handler => (req, res) => {
  req.hasParamMatch = false;
  const uri = url.parse(req.url, true);
  const paramKeys = [];
  const pathMatchingPattern = pathToRegexp(path, paramKeys);

  const isPatternMatchesPath = pathMatchingPattern.exec(
    req.url.replace(uri.search, '')
  );

  if (!isPatternMatchesPath) return handler(req, res);
  if (!isPatternMatchesPath.length) return handler(req, res);

  req.hasParamMatch = true;
  const paramValues = isPatternMatchesPath.splice(
    1,
    isPatternMatchesPath.length - 1
  );

  req.params = paramKeys.reduce((state, next, idx) => {
    state[next.name] = paramValues[idx];
    return state;
  }, {});

  return handler(req, res);
};

function send(res, statusCode, obj = null) {
  res.statusCode = statusCode;

  if (obj === null) {
    res.end();
    return;
  }

  if (Buffer.isBuffer(obj)) {
    if (!res.getHeader('Content-Type'))
      res.setHeader('Content-Type', 'application/octet-stream');

    res.setHeader('Content-Length', obj.length);
    res.end(obj);
    return;
  }

  if (isStream(obj)) {
    if (!res.getHeader('Content-Type'))
      res.setHeader('Content-Type', 'application/octet-stream');

    obj.pipe(res);
    return;
  }

  let str = obj;

  if (typeof obj === 'object' || typeof obj === 'number') {
    str = DEV_ENV ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
    if (!res.getHeader('Content-Type'))
      res.setHeader('Content-Type', 'application/json');
  }

  res.setHeader('Content-Length', Buffer.byteLength(str));
  res.end(str);
}

function sendError(req, res, {statusCode, status, message, stack}) {
  statusCode = statusCode || status;

  if (statusCode) {
    send(
      res,
      statusCode,
      DEV_ENV ? {status, message, stack} : {status, message}
    );
  } else {
    send(res, 500, DEV_ENV ? {status, message, stack} : {status, message});
  }
}

function createError(code, msg, orig) {
  const err = new Error(msg);
  err.statusCode = code;
  err.originalError = orig;
  return err;
}

function parseJSON(str, {throwOnError = false} = {}) {
  try {
    return JSON.parse(str);
  } catch (err) {
    if (throwOnError) throw createError(400, 'Invalid JSON', err);
  }
}
