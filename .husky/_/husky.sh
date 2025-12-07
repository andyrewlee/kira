#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  husky_skip_init=1
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $1"
  }
  readonly husky_skip_init
  export husky_skip_init
  readonly HUSKY_DEBUG
  readonly husky_skip_init
  husky_root="$(cd "$(dirname "$0")/.." && pwd -P)"
  readonly husky_root
  debug "husky_root: $husky_root"
  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hooks"
    exit 0
  fi
  if [ ! -x "$husky_root/.husky/pre-commit" ]; then
    debug "pre-commit is not executable"
    exit 0
  fi
  export PATH="$husky_root/node_modules/.bin:$PATH"
fi
