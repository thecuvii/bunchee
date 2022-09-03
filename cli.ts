#!/usr/bin/env node

import type { CliArgs } from './src/types'

import path from 'path'
import { parseCliArgs, logger, exit } from './src/utils'
import { version } from './package.json'

const helpMessage = `
Usage: bunchee [options]

Options:
  -v, --version          output the version number
  -w, --watch            watch src files changes
  -m, --minify           compress output. false by default
  -o, --output <file>    specify output filename
  -f, --format <format>  specify bundle type: "esm", "cjs", "umd". "esm" by default
  -e, --external <mod>   specify an external dependency
  --target <target>      js features target: swc target es versions. "es5" by default
  --runtime <runtime>    build runtime: "nodejs", "browser". "browser" by default
  --sourcemap            enable sourcemap generation, false by default
  --cwd <cwd>            specify current working directory
  -h, --help             output usage information
`

function help() {
  console.log(helpMessage)
}


async function run(args: any) {
  const { source, format, watch, minify, sourcemap, target, runtime } = args
  const cwd = args.cwd || process.cwd()
  const file = args.file ? path.resolve(cwd, args.file) : args.file
  const outputConfig: CliArgs = {
    file,
    format,
    cwd,
    target,
    runtime,
    external: args.external || [],
    watch: !!watch,
    minify: !!minify,
    sourcemap: sourcemap === false ? false : true,
  }
  if (args.version) {
    return console.log(version)
  }
  if (args.help) {
    return help()
  }

  const entry = source ? path.resolve(cwd, source) : ''
  const { bundle } = require('./lib')

  let timeStart = Date.now()
  let timeEnd
  try {
    await bundle(entry, outputConfig)
    timeEnd = Date.now()
  } catch (err: any) {
    if (err.name === 'NOT_EXISTED') {
      help()
      return exit(err)
    }
    throw err
  }

  const duration = timeEnd - timeStart
  if (!watch) {
    logger.log(`✅ Finished in ${duration} ms`)
  }
}

async function main() {
  let params, error
  try {
    params = parseCliArgs(process.argv.slice(2))
  } catch (err) {
    error = err
  }
  if (error || !params) {
    if (!error) help()
    return exit(error as Error)
  }
  await run(params)
}

main().catch(exit)
