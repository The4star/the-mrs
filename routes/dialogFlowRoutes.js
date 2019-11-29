const express = require('express');
const router = express.Router();

const { textQuery } = require('../config/chatbot')



const User = require('../models/User');

router.get('/',  (req, res, next) => {
    res.send({response: 'hello'})
})

router.post('/api/df_text_query', async (req, res) => {

    try {
        const response = await textQuery(req.body.text, req.body.parameters)
        res.send(response)
    } catch (error) {
        res.status(500).send(error)
    }
    
})

router.post('/api/df_event_query', async (req, res) => {
    res.send({'do': 'event query'})
})


module.exports = router;