import { existsSync, mkdirSync } from "fs"
import { normalize, join } from "path"

export let pluginsPath = null

/**
 * @private
 * @module globals
 **/

/**
 * Set path to plugins directory and create the directory if it does not exist.
 * @param {string} plgPath path to plugins directory
 */
export function setPluginsPath(plgPath) {
  // Create folder if it does not exist
  let plgDir
  try {
    plgDir = normalize(plgPath)
    if (plgDir.length < 2) throw new Error()

  } catch (error) {
    throw new Error('Invalid path provided to the plugins folder')
  }

  if (!existsSync(plgDir)) mkdirSync(plgDir)
  pluginsPath = plgDir
}

/**
 * Get the path to the plugins.json file.
 * @returns location of plugins.json
 */
export function getPluginsFile() { return join(pluginsPath, 'plugins.json') }

/**
 * This function is executed when a plugin is installed to verify that the user indeed wants to install the plugin.
 * @callback confirmInstall
 * @param {string} plg The specifier used to locate the package (from NPM or local file)
 * @returns {Promise<boolean>} Whether to proceed with the plugin installation
 */
export let confirmInstall = function (plg) {
  return new Error(
    'The facade.confirmInstall callback needs to be set in when initializing Pluggable Electron in the main process.'
  )
}

export function setConfirmInstall(cb) { confirmInstall = cb }
