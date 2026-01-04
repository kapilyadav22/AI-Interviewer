#!/bin/sh

# Default to empty object if file doesn't exist
echo "window.env = {" > /usr/share/nginx/html/env-config.js

# Inject VITE_SUPABASE_URL
if [ -n "$VITE_SUPABASE_URL" ]; then
  echo "  VITE_SUPABASE_URL: \"$VITE_SUPABASE_URL\"," >> /usr/share/nginx/html/env-config.js
fi

# Inject VITE_SUPABASE_ANON_KEY
if [ -n "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "  VITE_SUPABASE_ANON_KEY: \"$VITE_SUPABASE_ANON_KEY\"," >> /usr/share/nginx/html/env-config.js
fi

# Inject VITE_GEMINI_API_KEY
if [ -n "$VITE_GEMINI_API_KEY" ]; then
  echo "  VITE_GEMINI_API_KEY: \"$VITE_GEMINI_API_KEY\"," >> /usr/share/nginx/html/env-config.js
fi

echo "};" >> /usr/share/nginx/html/env-config.js

# Execute the passed command (nginx)
exec "$@"
