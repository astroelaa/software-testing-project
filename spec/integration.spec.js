const MentorService = require('../src/mentorService');
const ProgressTracker = require('../src/progressTracker');

describe('MentorService integration', () => {
  let service;

  beforeEach(() => {
    const hintProvider = {
      getHints: (topic) => {
        const hints = {
          arrays: ['Review indexing', 'Consider the loop boundary'],
          functions: ['Identify the inputs', 'Trace the return value']
        };
        return hints[topic] || [];
      }
    };
    service = new MentorService(hintProvider, new ProgressTracker());
  });

  it('tracks a solved session with hints', () => {
    const sessionId = service.startSession('arrays');
    service.askHint(sessionId);

    service.submitAnswer(sessionId, true);

    expect(service.progress().overallScore).toBe(80);
    expect(service.progress().level).toBe('Advanced');
  });

  it('tracks an unsolved session', () => {
    const sessionId = service.startSession('functions');

    service.submitAnswer(sessionId, false);

    expect(service.progress()).toEqual({
      overallScore: 0,
      level: 'Beginner'
    });
  });

  it('runs several sessions and calculates final progress', () => {
    const firstSession = service.startSession('arrays');
    service.askHint(firstSession);
    service.submitAnswer(firstSession, true);

    const secondSession = service.startSession('functions');
    service.askHint(secondSession);
    service.askHint(secondSession);
    service.submitAnswer(secondSession, true);

    const thirdSession = service.startSession('arrays');
    service.submitAnswer(thirdSession, false);

    expect(service.progress().overallScore).toBeCloseTo(46.6667, 4);
    expect(service.progress().level).toBe('Intermediate');
  });
});
