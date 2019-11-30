const dialogflow = require('dialogflow');
const structjson = require('structjson')

const {googleProjectID, dialogFlowSessionID, dialogFlowSessionLanguageCode, googleClientEmail, googlePrivateKey} = require('./keys')

const credentials = {
    client_email: googleClientEmail,
    private_key: googlePrivateKey
}
const sessionClient = new dialogflow.SessionsClient({projectId: googleProjectID, credentials});
const sessionPath = sessionClient.sessionPath(googleProjectID, dialogFlowSessionID)

const textQuery = async (text, parameters = {}) => {

    let self = module.exports;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: text,
                // The language used by the client (en-US)
                languageCode: dialogFlowSessionLanguageCode,
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

const eventQuery = async (event, parameters = {}) => {

    let self = module.exports;

    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                // The query to send to the dialogflow agent
                name: event,
                parameters: structjson.jsonToStructProto(parameters),
                // The language used by the client (en-US)
                languageCode: dialogFlowSessionLanguageCode,
            },
        },
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
    eventQuery,
    handleAction
}

