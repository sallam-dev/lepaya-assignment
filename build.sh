#!/bin/sh
set +e
yarn --cwd client run build
yarn run build
mv client/dist .build/client
