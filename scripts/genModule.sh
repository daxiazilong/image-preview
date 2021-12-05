#!/bin/bash
cd scripts 
node generateModule.js
cd ..
cp './release/image-preview/image-preview-iife.js'  './example/js/'