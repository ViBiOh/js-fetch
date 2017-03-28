import test from 'ava';
import sinon from 'sinon';
import Fetch from '../src/Fetch';

let stubFetch;

const textPromise = Promise.resolve({
  status: 200,
  headers: {
    get: () => 'text/plain',
  },
  text: () => Promise.resolve(),
});

const jsonPromise = Promise.resolve({
  status: 200,
  headers: {
    get: () => 'application/json',
  },
  json: () => Promise.resolve(),
});

test.afterEach(() => {
  if (stubFetch) {
    stubFetch.restore();
  }
});

test('should return a promise', (t) => {
  global.fetch = () => Promise.resolve({
    status: 200,
    headers: {
      get: () => '',
    },
    text: () => Promise.resolve(''),
  });

  const result = Fetch.get('/');

  t.is(result instanceof Promise, true);
});

test('should return text when asked', (t) => {
  global.fetch = () => Promise.resolve({
    status: 200,
    headers: {
      get: () => 'text/plain',
    },
    text: () => Promise.resolve('Test Mocha'),
  });

  return Fetch.get('/')
    .then(data => t.is(data, 'Test Mocha'));
});

test('should return json when asked', (t) => {
  global.fetch = () => Promise.resolve({
    status: 200,
    headers: {
      get: () => 'application/json',
    },
    json: () => Promise.resolve({
      result: 'Test Mocha',
    }),
  });

  return Fetch.get('/')
    .then(data => t.deepEqual(data, {
      result: 'Test Mocha',
    }));
});

test('should return error when 400 or more', (t) => {
  global.fetch = () => Promise.resolve({
    status: 400,
    headers: {
      get: () => 'text/plain',
    },
    text: () => Promise.resolve('Test Mocha Error'),
  });

  return Fetch.get('/')
    .then(() => t.is(false, true))
    .catch((data) => {
      t.is(data.content, 'Test Mocha Error');
      t.is(String(data), 'Test Mocha Error');
    });
});

test('should return jsonError when 400 or more', (t) => {
  global.fetch = () => Promise.resolve({
    status: 500,
    headers: {
      get: () => 'application/json',
    },
    json: () => Promise.resolve({
      error: 'Test Mocha Error',
    }),
  });

  return Fetch.get('/')
    .then(() => t.is(false, true))
    .catch((data) => {
      t.deepEqual(data.content, { error: 'Test Mocha Error' });
      t.is(String(data), '{"error":"Test Mocha Error"}');
    });
});

test('should return error when text fail', (t) => {
  global.fetch = () => Promise.resolve({
    status: 200,
    headers: {
      get: () => 'text/plain',
    },
    text: () => Promise.reject(new Error('Mocha Text Error')),
  });

  return Fetch.get('/')
    .then(() => t.is(false, true))
    .catch(data => t.is(String(data), 'Error: Mocha Text Error'));
});

test('should return error when json fail', (t) => {
  global.fetch = () => Promise.resolve({
    status: 200,
    headers: {
      get: () => 'application/json',
    },
    json: () => Promise.reject(new Error('Mocha JSON Error')),
  });

  return Fetch.get('/')
    .then(() => t.is(false, true))
    .catch(data => t.is(String(data), 'Error: Mocha JSON Error'));
});

test.serial('should pass header', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.url('/').header('custom', 'test').get()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        custom: 'test',
      },
      method: 'GET',
    }), true));
});

test.serial('should pass auth', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.url('/').auth('token').get()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        Authorization: 'token',
      },
      method: 'GET',
    }), true));
});

test.serial('should pass contentType for json', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => jsonPromise);

  return Fetch.url('/').contentJson().get()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }), true));
});

test.serial('should pass contentType for text', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.url('/').contentText().get()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        'Content-Type': 'text/plain',
      },
      method: 'GET',
    }), true));
});

test.serial('should pass accept for json', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => jsonPromise);

  return Fetch.url('/').acceptJson().get()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        Accept: 'application/json',
      },
      method: 'GET',
    }), true));
});

test.serial('should pass accept for text', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.url('/').acceptText().get()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        Accept: 'text/plain',
      },
      method: 'GET',
    }), true));
});

test.serial('should pass body', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.url('/').body('Hello World').post()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'Hello World',
      method: 'POST',
    }), true));
});

test.serial('should pass json body', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => jsonPromise);

  return Fetch.url('/').body(JSON.stringify({ hello: 'World' })).post()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"hello":"World"}',
      method: 'POST',
    }), true));
});

test.serial('should not pass body if undefined', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.url('/').body().post()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {},
      method: 'POST',
    }), true));
});

test.serial('should guess json content', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => jsonPromise);

  return Fetch.post('/', JSON.stringify({ hello: 'World' }))
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"hello":"World"}',
      method: 'POST',
    }), true));
});

test.serial('should guess text content', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.post('/', '{hello":"World"}')
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        'Content-Type': 'text/plain',
      },
      body: '{hello":"World"}',
      method: 'POST',
    }), true));
});

test.serial('should not guess content if already defined', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.url('/').contentText().body('{"hello":"World"}').post()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {
        'Content-Type': 'text/plain',
      },
      body: '{"hello":"World"}',
      method: 'POST',
    }), true));
});

test.serial('should not guess content if forbidden', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.url('/').body('{"hello":"World"}', false).post()
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {},
      body: '{"hello":"World"}',
      method: 'POST',
    }), true));
});

test('should use given content handler', (t) => {
  global.fetch = () => Promise.resolve({
    status: 204,
  });

  let result;
  const customContentHandler = content => (result = content);

  return Fetch.url('/').content(customContentHandler).get().then(() => {
    t.deepEqual(result, {
      status: 204,
    });
  });
});

test('should use given error handler', (t) => {
  global.fetch = () => Promise.resolve({
    status: 404,
    reason: 'Failed',
  });

  let result;
  const customErrorHandler = (content) => {
    result = content.reason;

    return Promise.reject();
  };

  return Fetch.url('/').error(customErrorHandler).get()
    .then(() => t.is(false, true))
    .catch(() => t.is(result, 'Failed'));
});

test.serial('should send GET', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.get('/')
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {},
      method: 'GET',
    }), true));
});

test.serial('should send POST', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.post('/')
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {},
      method: 'POST',
    }), true));
});

test.serial('should send PUT', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.put('/')
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {},
      method: 'PUT',
    }), true));
});

test.serial('should send PATCH', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.patch('/')
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {},
      method: 'PATCH',
    }), true));
});

test.serial('should send DELETE', (t) => {
  stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return Fetch.delete('/')
    .then(() => t.is(stubFetch.calledWith('/', {
      headers: {},
      method: 'DELETE',
    }), true));
});
