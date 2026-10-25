class HintProvider {
  getHints(topic) {
    const hints = {
      loops: [
        'Identify the loop condition.',
        'Check how the loop variable changes.',
        'Trace the first and last iterations.'
      ],
      recursion: [
        'Identify the base case.',
        'Trace the smaller recursive input.',
        'Check how the results return from the calls.'
      ]
    };

    return hints[topic] || [
      'Break the problem into smaller steps.',
      'Write down the inputs and expected output.',
      'Test the edge cases.'
    ];
  }
}

module.exports = HintProvider;
