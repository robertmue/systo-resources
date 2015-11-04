# Models

## About

This directory contains a collection of Systo models.   Each model is represented in JSON (.json) and JavaScript (.js) formats.

The difference between the two is minimal.    Essentially, the JavaScript format consists of the JSON format as the right-hand side of an assignment statement, with the left-hand side being an object reference of the form:
SYSTO.models.XXXX = {...};
where:
   XXXX is a (hopefully unique) identifier for the model; and
   {...} is an object literal, textually identical to teh JSON stored in the ,json file for the same model.
