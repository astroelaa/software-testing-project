const express = require('express');
const ProgressTracker = require('./progressTracker');
const MentorService = require('./mentorService');
const HintProvider = require('./hintProvider');

const app = express();
const tracker = new ProgressTracker();
const service = new MentorService(new HintProvider(), tracker);

app.use(express.json());

app.post('/sessions', (request, response) => {
  const { topic } = request.body || {};
  if (typeof topic !== 'string' || !topic.trim()) {
    return response.status(400).json({ error: 'Topic is required' });
  }

  return response.status(201).json({
    sessionId: service.startSession(topic)
  });
});

app.post('/sessions/:id/hint', (request, response) => {
  try {
    return response.status(200).json({
      hint: service.askHint(request.params.id)
    });
  } catch (error) {
    if (error.message === 'Unknown session') {
      return response.status(404).json({ error: error.message });
    }
    if (error.message === 'No hints left') {
      return response.status(409).json({ error: error.message });
    }
    return response.status(500).json({ error: error.message });
  }
});

app.post('/sessions/:id/answer', (request, response) => {
  const { solved } = request.body || {};
  if (typeof solved !== 'boolean') {
    return response.status(400).json({ error: 'Solved must be a boolean' });
  }

  try {
    service.submitAnswer(request.params.id, solved);
    return response.status(200).json(service.progress());
  } catch (error) {
    if (error.message === 'Unknown session') {
      return response.status(404).json({ error: error.message });
    }
    return response.status(500).json({ error: error.message });
  }
});

app.get('/progress', (request, response) => {
  response.status(200).json(service.progress());
});

module.exports = app;
