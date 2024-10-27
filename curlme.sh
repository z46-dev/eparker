#!/bin/bash

if [ "$0" != "bash" ]; then
  # Re-run the script through source
  echo "Re-running via 'source' to activate aliases..." 
  exec bash -c "source <(curl -s https://eparker.dev/curlme.sh)"
  exit 0
fi

alias visudo='ed'
alias emacs='ed'
alias gedit='ed'
alias nano='ed'
alias nvim='ed'
alias echo='ed'
alias vim='ed'
alias vi='ed'

echo "RAM Downloaded!! 😉"
