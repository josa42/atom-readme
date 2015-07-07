"use babel";

import ReadmeListView from './views/readme-list-view';

module.exports = {

  config: {
    showBundledPackages: {
      type: 'boolean',
      default: false
    }
  },

  activate(state) {

    this.disposable = atom.commands.add(
      'atom-workspace', 'readme:show-list', () => {
        this.list = new ReadmeListView();
        this.list.show();
      }
    );
  },

  // ,
  deactivate() {
    // if (this.list) {
    //   this.list.
    // }
    this.disposable.dispose();
  }
  // serialize() {}
};
