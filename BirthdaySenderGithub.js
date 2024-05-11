const nodemailer = require('nodemailer');
const cron = require('node-cron');
const axios = require('axios');

async function getToken() { // function that gets Token to call API
    
    try {

      const response = await axios({

        method: 'POST',
        url: '', // removed for privacy

        headers: {
            'Authorization': '', 
            // removed for privacy (token)
        },

        data: 'grant_type=client_credentials', // Send data as x-www-form-urlencoded
        responseType: 'json',
      });

      const result = response.data;     
      const token = result.access_token;
      console.log(token)

      return token;

    } catch (error) {

      console.error('Error fetching token:', error);
      throw error;

    }

  }

  
async function sendEmail(email){ // function sends an email with gif

    let transporter = nodemailer.createTransport({
    
      host: '', // Replace with your mail server host (removed for privacy)
      port: 25, // SMTP port (587 for TLS)
      secure: false, // true for 465, false for other ports
    
      auth: {
        user: '', 
        pass: ''          
      }
    
    });
    
    const mailOptions = {
    
        from: '', //'noreply email',
        to: email, // List of recipients
        subject: 'Happy Birthday', // Subject line
        text: '', // Plain text body
        html: `
        <img border=0 width=835 height=536 style='width:8.7013in;height:5.5833in' src=cid:unique@gif.cid> `,  // HTML body content
    
        attachments: [
    
          {   
            filename: 'birthday.gif',
            path: 'birthday.gif',
            cid: 'unique@gif.cid'
          }
        ]
      };
    
    
    transporter.sendMail(mailOptions, (error, info) => {
    
        if (error) {
          return console.log(error);
        }
      
        console.log('Message sent: %s', info.messageId);
      
      });
      
    
} 
    
    
async function API() { // cals API to retrieved emails of people who's birthday is today and sends emails at 8 AM
    
    let token = await getToken();
    
    const options = {
          method : 'GET',
          url :'', //removed for privacy (API Url)
    
          headers: {
            'Authorization': `Bearer ${token}`,    
          }    
        };
    
        let response;
        try {
            response = await axios(options);
            console.log(response.data);
        } catch (axiosError) {
            console.error('Error making Axios request:', axiosError.message);
            return res.status(500).send('Internal Server Error');
        }
        
        
        if(response.data)
        {
            let usersEmail = JSON.parse(response.data.users);
            for(let index = 0; index < usersEmail.length; index++)
            {
                sendEmail(usersEmail[index]);
               
            } 
        }
        else{
            console.log('data was not collected');
        } 
};


cron.schedule('0 8 * * *', ()=> { // send an email at 8 AM everyday in Riyadh's time
      
    API();
    }, {
        scheduled: true,
        timezone: "Asia/Riyadh"
    
});

