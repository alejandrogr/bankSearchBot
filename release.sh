#!/bin/bash

rm bot.zip 
zip -r bot.zip *
aws lambda update-function-code --function-name $1 --zip-file fileb://bot.zip

