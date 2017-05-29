'use babel'

import quickSelect from 'atom-quick-select'
import path from 'path'
import glob from 'glob'

module.exports = {

  config: {
    showBundledPackages: {
      type: 'boolean',
      default: false
    }
  },

  activate (state) {
    this.disposable = atom.commands.add(
      'atom-workspace', 'readme:show-list', () => this.showList()
    )
  },

  deactivate () {
    this.disposable.dispose()
  },

  async showList () {
    const pkg = await quickSelect(this.loadPackages(), {
      normalizeItem: ({ name }) => ({ label: name })
    })
    if (pkg) {
      this.openReadme(pkg)
    }
  },

  openReadme (pkg) {
    const readme = glob.sync('readme*', { nocase: true, cwd: pkg.path }).pop()

    if (readme) {
      let fileUri = path.join(pkg.path, readme)

      if (atom.packages.isPackageActive('markdown-preview')) {
        fileUri = `markdown-preview://${encodeURI(fileUri)}`
      }

      atom.workspace.open(fileUri, { searchAllPanes: true })
    }
  },

  loadPackages () {
    var items = atom.packages.getActivePackages()

    if (!atom.config.get('readme.showBundledPackages')) {
      items = items.filter((pkg) => !pkg.bundledPackage)
    }

    return items
      .sort((a, b) => a.name.localeCompare(b.name))
  }
}
