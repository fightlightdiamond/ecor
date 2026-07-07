#!/bin/bash
set -e

# remove all folders build and modules
rm -rf apps/backend/build apps/backend/node_modules apps/backend/.medusa
rm -rf apps/storefront/node_modules 
rm -rf apps/web/.output apps/web/.nuxt apps/web/node_modules .pnpm-store