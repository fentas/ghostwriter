#!/bin/bash
# Copyright 2013 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

set -e

PS3='Please choose: '

if [ "$(uname -s)" == "Darwin" ]; then
  if [ "$(whoami)" == "root" ]; then
    TARGET_DIR="/Library/Google/Chrome/NativeMessagingHosts"
  else
    TARGET_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
  fi
else
  if [ "$(whoami)" == "root" ]; then
    [ -d "/etc/opt/chrome" ] && options=("${options[@]}" "/etc/opt/chrome")
    [ -d "/etc/chromium" ] && options=("${options[@]}" "/etc/chromium")
    select inst in "${options[@]}"; do [ -z "$inst" ] && continue; break; done

    TARGET_DIR="$inst/native-messaging-hosts"
  else
    [ -d "$HOME/.config/google-chrome" ] && options=("${options[@]}" "google-chrome")
    [ -d "$HOME/.config/google-chrome-beta" ] && options=("${options[@]}" "google-chrome-beta")
    [ -d "$HOME/.config/chromium" ] && options=("${options[@]}" "chromium")
    select inst in "${options[@]}"; do [ -z "$inst" ] && continue; break; done

    TARGET_DIR="$HOME/.config/$inst/NativeMessagingHosts"
  fi
fi

HOST_NAME=ghostwriter
rm "$TARGET_DIR/$HOST_NAME.json"

echo ""
echo "Chrome native messaging has been uninstalled. [$TARGET_DIR/$HOST_NAME.json]"
