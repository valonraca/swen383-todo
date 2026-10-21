/ src/IdeaBox.js
// Written by another team. Use it, but do not change it.
export class IdeaBox {
  pickRandomIdea() {
    const ideas = [
      { title: 'Learn a new skill', minutes: 60 },
      { title: 'Clean your desk', minutes: 15 },
      { title: 'Call a friend', minutes: 20 },
    ];
    const i = Math.floor(Math.random() * ideas.length);
    return ideas[i];
  }
}
