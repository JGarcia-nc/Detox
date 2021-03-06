const detox = require('detox');
const config = require('../package.json').detox;
const adapter = require('detox/runners/jest/adapter');
const specReporter = require('detox/runners/jest/specReporter');
const assignReporter = require('detox/runners/jest/assignReporter');
const timeoutUtils = require('./utils/timeoutUtils');

jasmine.getEnv().addReporter(adapter);

// This takes care of generating status logs on a per-spec basis. By default, jest only reports at file-level.
// This is strictly optional.
jasmine.getEnv().addReporter(specReporter);

// This will post which device has assigned to run a suite, which can be useful in a multiple-worker tests run.
// This is strictly optional.
jasmine.getEnv().addReporter(assignReporter);

// Set the default timeout
jest.setTimeout(timeoutUtils.testTimeout);

beforeAll(async () => {
  await detox.init(config);
}, timeoutUtils.initTimeout);

beforeEach(async () => {
  try {
    await adapter.beforeEach();
  } catch (err) {
    await detox.cleanup();
    throw err;
  }
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
