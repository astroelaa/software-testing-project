class MentorService {
  constructor(hintProvider, tracker) {
    this.hintProvider = hintProvider;
    this.tracker = tracker;
    this.sessions = new Map();
    this.nextSessionId = 1;
  }

  startSession(topic) {
    const sessionId = `session-${this.nextSessionId}`;
    this.nextSessionId += 1;
    this.sessions.set(sessionId, {
      topic,
      hints: this.hintProvider.getHints(topic),
      hintsUsed: 0
    });
    return sessionId;
  }

  askHint(sessionId) {
    const session = this.getSession(sessionId);
    if (session.hintsUsed >= session.hints.length) {
      throw new Error('No hints left');
    }

    const hint = session.hints[session.hintsUsed];
    session.hintsUsed += 1;
    return hint;
  }

  submitAnswer(sessionId, solved) {
    const session = this.getSession(sessionId);
    this.tracker.record(session.topic, solved, session.hintsUsed);
    this.sessions.delete(sessionId);
  }

  progress() {
    return {
      overallScore: this.tracker.overallScore(),
      level: this.tracker.level()
    };
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Unknown session');
    }
    return session;
  }
}

module.exports = MentorService;
