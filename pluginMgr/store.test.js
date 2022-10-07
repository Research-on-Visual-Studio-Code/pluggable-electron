import { getActivePlugins, getAllPlugins, getPlugin, installPlugin } from './store'
import { init } from "."
import { join } from 'path'
import Plugin from "./Plugin"
import { mkdirSync, writeFileSync, rmSync } from "fs"

// Temporary directory to install plugins to
const pluginsDir = './testPlugins'

// Temporary directory containing the active plugin to install
const activePluginDir = './activePluginSrc'
const activePluginName = 'active-plugin'
const activeManifest = join(activePluginDir, 'package.json')

// Temporary directory containing the inactive plugin to install
const inactivePluginDir = './inactivePluginSrc'
const inactivePluginName = 'inactive-plugin'
const inactiveManifest = join(inactivePluginDir, 'package.json')

// Mock name for the entry file in the plugins
const main = 'index'

/** @type Plugin */
let activePlugin
/** @type Plugin */
let inactivePlugin

beforeAll(async () => {
  // Initialize pluggable Electron
  const pm = init({ confirmInstall: () => true }, pluginsDir)

  // Create active plugin
  mkdirSync(activePluginDir)
  writeFileSync(activeManifest, JSON.stringify({
    name: activePluginName,
    activationPoints: {},
    main,
  }), 'utf8')

  // Create active plugin
  mkdirSync(inactivePluginDir)
  writeFileSync(inactiveManifest, JSON.stringify({
    name: inactivePluginName,
    activationPoints: {},
    main,
  }), 'utf8')

  // Install plugins
  activePlugin = await installPlugin(activePluginDir, {}, true)
  activePlugin.setActive(true)
  inactivePlugin = await installPlugin(inactivePluginDir, {}, true)
})

afterAll(() => {
  // Remove all test files and folders
  rmSync(pluginsDir, { recursive: true })
  rmSync(activePluginDir, { recursive: true })
  rmSync(inactivePluginDir, { recursive: true })
})

describe('installPlugin', () => {
  it('should create a new plugin found at the given location and return it if store is false', async () => {
    const res = await installPlugin(activePluginDir, {}, false)

    expect(res).toBeInstanceOf(Plugin)
  })

  it('should create a new plugin found at the given location and register it if store is true', () => {
    expect(activePlugin).toBeInstanceOf(Plugin)
    expect(getPlugin(activePluginName)).toBe(activePlugin)
  })
})

describe('getPlugin', () => {
  it('should return the plugin with the given name if it is registered', () => {
    expect(getPlugin(activePluginName)).toBeInstanceOf(Plugin)
  })

  it('should return an error if the plugin with the given name is not registered', () => {
    expect(() => getPlugin('wrongName')).toThrowError('Plugin wrongName does not exist')
  })
})

describe('getAllPlugins', () => {
  it('should return a list of all registered plugins', () => {
    expect(getAllPlugins()).toEqual([activePlugin, inactivePlugin])
  })
})

describe('getActivePlugins', () => {
  it('should return a list of all and only the registered plugins that are active', () => {
    expect(getActivePlugins()).toEqual([activePlugin])
  })
})