"use babel";

import { SelectListView } from 'atom-space-pen-views';
import path from 'path';
import glob from 'glob';

var panelSym = Symbol('panel');

class ReadmeListView extends SelectListView {

  get panel() {
    if (!this[panelSym]) {
      this[panelSym] = atom.workspace.addModalPanel({
        item: this,
        visible: false
      });
    }

    return this[panelSym];
  }

  set panel(panel) {}

  getFilterKey() {
    return 'name';
  }

  show() {
    this.populate();
    this.panel.show();
    this.focusFilterEditor();
  }

  hide() {
    this.panel.hide();
  }

  cancel() {
    this.hide();
  }

  viewForItem(item) {
    return `<li>${item.name}</li>`;
  }

  confirmed(pkg) {

    var readme = glob.sync('readme*', {
      nocase: true,
      cwd: pkg.path
    }).pop();

    if (readme) {
      var fileUri = path.join(pkg.path, readme);

      if (atom.packages.isPackageActive('markdown-preview')) {
          fileUri = `markdown-preview://${encodeURI(fileUri)}`;
      }

      atom.workspace.open(fileUri, { searchAllPanes: true });
    }

    this.hide();
  }

  populate() {
    var items = atom.packages.getActivePackages();

    if (!atom.config.get("readme.showBundledPackages")) {
      items = items.filter((pkg) => !pkg.bundledPackage);
    }

    items.sort((a, b) => a.name.localeCompare(b.name));

    this.setItems(items);
  }
}


export default ReadmeListView;
