export class IdeaBox {
  pickRandomIdea() {
    const ideas = [
      { title: 'Learn a new skill', minutes: 60 },
      { title: 'Clean your desk', minutes: 15 },
      { title: 'Call a friend', minutes: 20 },
    ];
    const index = Math.floor(Math.random() * ideas.length);
    return ideas[index];
  }
}