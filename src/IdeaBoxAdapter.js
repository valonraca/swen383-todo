// src/IdeaBoxAdapter.js
export class IdeaBoxAdapter {
  constructor(ideaBox) {
    this.ideaBox = ideaBox;
  }

  getSuggestion() {
    const idea = this.ideaBox.pickRandomIdea();
    return `${idea.title} (${idea.minutes} min)`;
  }
}
