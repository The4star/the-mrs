const dialogflow = require('dialogflow');

const config = require('../config/keys')

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID)

const textQuery = async (text, parameters = {}) => {

    let self = module.exports;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: text,
                // The language used by the client (en-US)
                languageCode: config.dialogFlowSessionLanguageCode,
            },
        },
        queryParams: {
            payload: {
                data: parameters
            }
        }
    };

    let response = await sessionClient.detectIntent(request);
    response = await self.handleAction(response)

    result = response[0].queryResult; 

    return result    
}

const handleAction = (response) => {
    return response
}

module.exports = {
    textQuery,
    handleAction
}

