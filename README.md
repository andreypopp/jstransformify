# jstranformify

Browserify transform which applies jstransform visitors.

## Installation

    % npm install jstranformify

## Usage

    % browserify -t [ jstranformify \
        --visitors jstransform/visitors/es6-class-visitors \
        --visitors es6-module-jstransform/visitors ] \
      my-source.js > bundle.js
