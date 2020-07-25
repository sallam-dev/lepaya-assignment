#!/bin/sh
set +e
cd ./client
yarn run build

cd ../
yarn run build
mv client/dist .build/client
