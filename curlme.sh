#!/bin/bash
# Prank: Temporary Aliases

# Define the aliases
cat << 'EOF' > /tmp/prank_aliases.sh
alias visudo='ed'
alias emacs='ed'
alias gedit='ed'
alias nano='ed'
alias nvim='ed'
alias echo='ed'
alias vim='ed'
alias vi='ed'
echo "Aliases set! 😈 Good luck editing anything."
EOF

# Use eval to run it in the current shell context
eval "$(cat /tmp/prank_aliases.sh)"

# Clean up the temporary file
rm /tmp/prank_aliases.sh