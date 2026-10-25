const ProgressTracker = require('../src/progressTracker');

describe('ProgressTracker', () => {
  let tracker;
  let sampleTopics;

  beforeAll(() => {
    sampleTopics = ['arrays', 'loops'];
  });

  beforeEach(() => {
    tracker = new ProgressTracker();
  });

  afterEach(() => {
    tracker = null;
  });

  afterAll(() => {
    sampleTopics = null;
  });

  it('records solved attempts with a hint penalty', () => {
    tracker.record('arrays', true, 2);

    expect(tracker.topicScore('arrays')).toBe(60);
  });

  it('scores unsolved attempts at zero', () => {
    tracker.record('arrays', false, 0);

    expect(tracker.topicScore('arrays')).toBe(0);
  });

  it('averages attempts for a topic', () => {
    tracker.record('arrays', true, 0);
    tracker.record('arrays', true, 1);

    expect(tracker.topicScore('arrays')).toBeCloseTo(90, 5);
  });

  it('returns zero for unknown topics and empty progress', () => {
    expect(tracker.topicScore('loops')).toBe(0);
    expect(tracker.overallScore()).toBe(0);
    expect(tracker.level()).toBe('Beginner');
  });

  it('averages scores across all topics', () => {
    tracker.record(sampleTopics[0], true, 0);
    tracker.record(sampleTopics[1], false, 0);

    expect(tracker.overallScore()).toBeCloseTo(50, 5);
    expect(tracker.level()).toBe('Intermediate');
  });

  it('assigns the advanced level at 75 or above', () => {
    tracker.record('arrays', true, 1);

    expect(tracker.level()).toBe('Advanced');
  });

  it('rejects negative hints and empty topics', () => {
    expect(() => tracker.record('arrays', true, -1)).toThrowError(Error);
    expect(() => tracker.record('', true, 0)).toThrowError(Error);
  });

  xit('would support a future weighted score', () => {
    expect(tracker.overallScore()).toBe(0);
  });

  it('supports asynchronous test setup', (done) => {
    setTimeout(() => {
      expect(tracker.overallScore()).toBe(0);
      done();
    }, 10);
  }, 1000);
});