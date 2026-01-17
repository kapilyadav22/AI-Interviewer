#!/bin/sh

echo "window.env = {" > /usr/share/nginx/html/env-config.js

if [ -n "$VITE_FIREBASE_API_KEY" ]; then
  echo "  VITE_FIREBASE_API_KEY: \"$VITE_FIREBASE_API_KEY\"," >> /usr/share/nginx/html/env-config.js
fi

if [ -n "$VITE_FIREBASE_AUTH_DOMAIN" ]; then
  echo "  VITE_FIREBASE_AUTH_DOMAIN: \"$VITE_FIREBASE_AUTH_DOMAIN\"," >> /usr/share/nginx/html/env-config.js
fi

if [ -n "$VITE_FIREBASE_PROJECT_ID" ]; then
  echo "  VITE_FIREBASE_PROJECT_ID: \"$VITE_FIREBASE_PROJECT_ID\"," >> /usr/share/nginx/html/env-config.js
fi

if [ -n "$VITE_FIREBASE_STORAGE_BUCKET" ]; then
  echo "  VITE_FIREBASE_STORAGE_BUCKET: \"$VITE_FIREBASE_STORAGE_BUCKET\"," >> /usr/share/nginx/html/env-config.js
fi

if [ -n "$VITE_FIREBASE_MESSAGING_SENDER_ID" ]; then
  echo "  VITE_FIREBASE_MESSAGING_SENDER_ID: \"$VITE_FIREBASE_MESSAGING_SENDER_ID\"," >> /usr/share/nginx/html/env-config.js
fi

if [ -n "$VITE_FIREBASE_APP_ID" ]; then
  echo "  VITE_FIREBASE_APP_ID: \"$VITE_FIREBASE_APP_ID\"," >> /usr/share/nginx/html/env-config.js
fi

if [ -n "$VITE_GEMINI_API_KEY" ]; then
  echo "  VITE_GEMINI_API_KEY: \"$VITE_GEMINI_API_KEY\"," >> /usr/share/nginx/html/env-config.js
fi

echo "};" >> /usr/share/nginx/html/env-config.js

exec "$@"
