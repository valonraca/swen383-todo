// src/IdeaBoxAdapter.js
export class IdeaBoxAdapter {
  constructor(ideaBox) {
    this.ideaBox = ideaBox;   // the Adaptee
  }

  getSuggestion() {
    const idea = this.ideaBox.pickRandomIdea();
    return `${idea.title} (${idea.minutes} min)`;
  }
}
