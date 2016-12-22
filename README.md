# Conversational Bot with api.ai
This is POC for a conversational bot made with api.ai as a conversational engine.
It is hosted in AWS lambda and the bot is integrated with Telgram and Facebook.

The file BankSearch.zip can by imported in api.ai as an agent to handle the conversation
and the actions.

The bot gives you directions (with maps in telegram) for near bank offices of the bank of
your choice.

The code in the repo is just a POC (not well structured, no tests...) and is just intented to demonstrate the integration
for api.ai and lambda functions to handle the anctions performed by the api.ai agent.

![FB Bot](https://cloud.githubusercontent.com/assets/701346/21420057/bba95e6a-c82b-11e6-92cf-0457f4053fea.png "Facebook Bot")
Facebook Bot

![Telegram Bot](https://cloud.githubusercontent.com/assets/701346/21420058/bbadb87a-c82b-11e6-9fa0-c39d04d5bbd0.png "Telegram Bot")
Telegram Bot

# To reproduce the POC

1. [Create an account in api.ai and upload the BankSearch.zip as a new agent](https://api.ai/)
2. [Create a lambda function](https://docs.aws.amazon.com/lambda/latest/dg/get-started-create-function.html) (full in the next step)
3. [Create an API Gateway in AWS that invokes the lambda function](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html)
4. [Configure api.ai agent with a webhook pointing to the API Gateway endpoint you've just created](https://docs.api.ai/docs/webhook)
5. [Enable integrations with telegram and facebook in api.ai for your agent](https://docs.api.ai/docs/facebook-integration)
6. [Install and configure AWS cli](https://aws.amazon.com/cli/) (optional, this is for automatic deploy your code to lambda. Make sure your cli has permissions to upload new function code to lambda)
7. [Generate a google maps api key](https://developers.google.com/maps/documentation/javascript/get-api-key)
8. Clone this repo and `npm install`
9. Change config.tpl to config.js and edit values with googleMapsApiKey and telegramBotToken
10. Upload your code to the lambda function (either manually or with the release.sh if you have configured the AWS cli (eg. ./release.sh MY_LAMBDA_FUNCTION_NAME)
11. Start chatting

