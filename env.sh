#!/bin/sh

echo "window.env = {" > /usr/share/nginx/html/env-config.js

if [ -n "$VITE_SUPABASE_URL" ]; then
  echo "  VITE_SUPABASE_URL: \"$VITE_SUPABASE_URL\"," >> /usr/share/nginx/html/env-config.js
fi

if [ -n "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "  VITE_SUPABASE_ANON_KEY: \"$VITE_SUPABASE_ANON_KEY\"," >> /usr/share/nginx/html/env-config.js
fi

if [ -n "$VITE_GEMINI_API_KEY" ]; then
  echo "  VITE_GEMINI_API_KEY: \"$VITE_GEMINI_API_KEY\"," >> /usr/share/nginx/html/env-config.js
fi

echo "};" >> /usr/share/nginx/html/env-config.js

exec "$@"
