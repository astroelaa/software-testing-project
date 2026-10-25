class ProgressTracker {
  constructor() {
    this.attempts = new Map();
  }

  record(topic, solved, hintsUsed) {
    if (!topic || !topic.trim()) {
      throw new Error('Topic is required');
    }
    if (hintsUsed < 0) {
      throw new Error('Hints used cannot be negative');
    }

    const score = solved ? Math.max(0, 100 - hintsUsed * 20) : 0;
    const topicAttempts = this.attempts.get(topic) || [];
    topicAttempts.push(score);
    this.attempts.set(topic, topicAttempts);
  }

  topicScore(topic) {
    const topicAttempts = this.attempts.get(topic);
    return topicAttempts ? this.average(topicAttempts) : 0;
  }

  overallScore() {
    const scores = Array.from(this.attempts.values()).flat();
    return scores.length ? this.average(scores) : 0;
  }

  level() {
    const score = this.overallScore();
    if (score < 40) {
      return 'Beginner';
    }
    if (score < 75) {
      return 'Intermediate';
    }
    return 'Advanced';
  }

  average(scores) {
    return scores.reduce((total, score) => total + score, 0) / scores.length;
  }
}

module.exports = ProgressTracker;
