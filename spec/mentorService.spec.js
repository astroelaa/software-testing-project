const MentorService = require('../src/mentorService');

describe('MentorService', () => {
  let hintProvider;
  let tracker;
  let service;

  beforeEach(() => {
    hintProvider = {
      getHints: (topic) => [`Start with ${topic}`, 'Check the edge cases']
    };
    tracker = jasmine.createSpyObj('tracker', ['record', 'overallScore', 'level']);
    tracker.overallScore.and.returnValue(80);
    tracker.level.and.returnValue('Advanced');
    service = new MentorService(hintProvider, tracker);
  });

  it('starts a session and returns its first hint', () => {
    const sessionId = service.startSession('arrays');

    expect(sessionId).toBe('session-1');
    expect(service.askHint(sessionId)).toBe('Start with arrays');
  });

  it('returns hints in order and counts them', () => {
    const sessionId = service.startSession('arrays');

    expect(service.askHint(sessionId)).toBe('Start with arrays');
    expect(service.askHint(sessionId)).toBe('Check the edge cases');
    expect(() => service.askHint(sessionId)).toThrowError(Error);
  });

  it('records and closes a submitted session', () => {
    const sessionId = service.startSession('arrays');
    service.askHint(sessionId);

    service.submitAnswer(sessionId, true);

    expect(tracker.record).toHaveBeenCalledWith('arrays', true, 1);
    expect(tracker.record).toHaveBeenCalledTimes(1);
    expect(() => service.submitAnswer(sessionId, true)).toThrowError(Error);
  });

  it('rejects unknown session ids', () => {
    expect(() => service.askHint('missing')).toThrowError(Error);
    expect(() => service.submitAnswer('missing', false)).toThrowError(Error);
  });

  it('returns tracker progress', () => {
    expect(service.progress()).toEqual({
      overallScore: 80,
      level: 'Advanced'
    });
    expect(tracker.overallScore).toHaveBeenCalledTimes(1);
    expect(tracker.level).toHaveBeenCalledTimes(1);
  });
});
