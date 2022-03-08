var express = require('express');
var router = express.Router();

// Making it more efficient to initiate conversation with the consumer 
const MessagingResponse = require('Twilio').twiml.MessagingResponse;
console.log ('server is running' );

router.post('/start-shopping', (req, res) => {
    // creates a instance for the messaging response 
    const twiml = new MessagingResponse();

    console.log(incomingMsg);
    // phone number would be any consumer who is interested in looking to narrow down their choices

    // The word that'll initiate the automated conversation.
    const word = 'shop';

    // Help functions 
    const handleNewShopper = () => {
        // set up new consumer chatbot experience 

        req.session.options = 3; 
        req.session.shoppping = true;
        req.session.page = 1;
        twiml.message("Text back one number to personalize the consumer's choice of merchandise. Greetings, welcome to our mobile chatbot is there anything you are looking for in particular? \n"+
        "1: yes I need some assistance.\n2: yes, but I know what I am looking for.\n3: No, thank you.\n");
    }

    const handleInvalidSMS = () => {
        // sends an invalid number 
        twiml.message ("Sorry, please select one of the following options listed.");
    }

    const handleShopperChoice = () => {
            // this will be only if the shopper chooses one of the 3 initial options
        console.log('This is your choice: ' + req.session.options); 
        if (req.session.options == 1) {
            twiml.message('Sure, great choice! What type of fabric are you interested in?\n1: Durags\n2: Bonnets\n'); 
            req.session.page = 2;
        }else if  (req.session.options == 2)  { 
            twiml.message('Awesome! We hope you find what you are looking for. Happy Shopping! ' + url);
        }else if  (req.session.options == 3) { 
            twiml.message('Okay great. You can always come back, if you change your mind; at any given point. Thank you for shopping with us! '+ url);
        }else {
            endShopping();
        }   
    }

    const handleWrongNumber = () => {
    // Let the shopper know that they entered the wrong number choice.
        if (req.session.options > 3 ) {
            twiml.message ("Oops, you've chosen an incorrect number.");
        }else {
            endShopping();
        }
    }
    const handleShopperDesire = () => {
        // This will be only if the shopper chooses Durags or Bonnets, as a choice.
        if (req.session.options == 1) {
            twiml.message('The product that you chose, is durag. What type of material are you interested in?\n1: Silk-satin\n2: Velour\n');
            req.session.page = 3;
            req.session.product = 'durag';
        } else if (req.session.options == 2) {
            twiml.message('Sure, bonnets are a nice choice. What type of fabric are you interested in?\n1: Silk-satin\n2: Velour\n');
            req.session.page = 3;
            req.session.product = 'bonnet';
        }else if (req.session.options > 2) {
            twiml.message('Please select a correct choice, so we can further assist you.');
        }else {
            twiml.message("Oops, you've chosen an incorrect number.");
        }
    }
    const handleShopperMaterial = () => {
        // update with the shopper's  choice either Silk-Satin or Velour material 
        var url = 'https://culturesdesatin.squarespace.com';
        let url1 = 'https://culturesdesatin.squarespace.com/shop/durags';
        let url2 = 'https://culturesdesatin.squarespace.com/shop/bonnets'; 
        if (req.session.product == 'durag') {
            url = 'https://culturesdesatin.squarespace.com/shop/durags';
        }else if (req.session.product == 'bonnet') {
            url = 'https://culturesdesatin.squarespace.com/shop/bonnets';
        }
        if (req.session.options == 1) {
            twiml.message('Okay great. Attached to this message is the company website. It will take you to your desired destination. '+ 
            'Thank you for choosing Cultures de satin.\n'+ url);       
        }else if (req.session.options == 2) {
            twiml.message('Okay great. Attached to this message is the company website. It will take you to your desired destination.'+
            'Thank you for choosing Cultures de satin.\n'+ url);       
        }else if (req.session.options > 2) {
            twiml.message('Thank you for choosing Cultures de Satin. '+ url);
        }else {
            endShopping();
        }
    }

    const endShopping = () => {
        req.session.shoppping = false;
    }
            console.log('shopping is '+ req.session.shopping); 
    // The official bot execution Logic 
    
    if (!req.session.shopping) {
        // set up the execution path
        if (incomingMsg == word) {
            handleNewShopper();
        }else {
            handleInvalidSMS();
        }
    } else {
        req.session.options = parseInt(incomingMsg, 10);
        if (req.session.page == 1) {
            handleShopperChoice();
        }else if  (req.session.page == 2) {
            handleShopperDesire();
        }else if (req.session.page == 3) {
            handleShopperMaterial();
        }else if (req.session.page > 3) {
            handleWrongNumber()
        }
    }

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

module.exports = router;