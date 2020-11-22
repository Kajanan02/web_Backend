const express = require('express');
const Ajv = require('ajv');
var cors = require('cors');
const app = express();
const port = 3001;
const ajv = new Ajv();
const multer = require('multer');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
var nodemailer = require('nodemailer');
const base64 = require('base64topdf');
app.use(cors());

var mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'partnerships@senzmate.com',
    pass: 'Senz&Partner00'
  }
});

const schema = {
  "title":"send email",
  "description":"send email from offical email",
  "type":"object",
  "properties":{
    "to":{
      "type":"array",
      "description":"recipient email address"
    },
    "subject":{
      "type":"string",
      "description":"subject of email"
    },
    "body":{
      "type":"array",
      "description":"every body lines"
    },
    "pdf64":{
      "type":"string",
      "description":"base64 of pdf report"
    }
  },
  "required": ["to", "subject", "body","pdf64"]
};
ajv.addSchema(schema, 'send-mail');


function errorResponse(schemaErrors) {
  let errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  })
  return {
    status: 'failed',
    errors: errors
  }
}


function bodyValidate(req,res,next){
  let valid = ajv.validate('send-mail',req.body);
  if(!valid){
    res.status(400).json(errorResponse(ajv.errors));
  }else{
    next();
  }

}


function mailTemp(text,subject){
  return(
      `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>${subject}</title>
  <style>
  /* -------------------------------------
      INLINED WITH htmlemail.io/inline
  ------------------------------------- */
  /* -------------------------------------
      RESPONSIVE AND MOBILE FRIENDLY STYLES
  ------------------------------------- */
  @media only screen and (max-width: 620px) {
    table[class=body] h1 {
      font-size: 28px !important;
      margin-bottom: 10px !important;
    }
    table[class=body] p,
          table[class=body] ul,
          table[class=body] ol,
          table[class=body] td,
          table[class=body] span,
          table[class=body] a {
      font-size: 16px !important;
    }
    table[class=body] .wrapper,
          table[class=body] .article {
      padding: 10px !important;
    }
    table[class=body] .content {
      padding: 0 !important;
    }
    table[class=body] .container {
      padding: 0 !important;
      width: 100% !important;
    }
    table[class=body] .main {
      border-left-width: 0 !important;
      border-radius: 0 !important;
      border-right-width: 0 !important;
    }
    table[class=body] .btn table {
      width: 100% !important;
    }
    table[class=body] .btn a {
      width: 100% !important;
    }
    table[class=body] .img-responsive {
      height: auto !important;
      max-width: 100% !important;
      width: auto !important;
    }
  }

  /* -------------------------------------
      PRESERVE THESE STYLES IN THE HEAD
  ------------------------------------- */
  @media all {
    .ExternalClass {
      width: 100%;
    }
    .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
      line-height: 100%;
    }
    .apple-link a {
      color: inherit !important;
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      text-decoration: none !important;
    }
    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
    .btn-primary table td:hover {
      background-color: #34495e !important;
    }
    .btn-primary a:hover {
      background-color: #34495e !important;
      border-color: #34495e !important;
    }
  }
  </style>
</head>
<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
  <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">${text.map((item)=>{
    return(
        `<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${item}</p>`
    )
 })}</span>
  <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
    <tr>
      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
      <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
        <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

          <!-- START CENTERED WHITE CONTAINER -->
          <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

            <!-- START MAIN CONTENT AREA -->
            <tr>
              <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                  <tr>
                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                      ${text.map((item)=>{
                          return(
                              `<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${item}</p>`
                          )
                       })}
                   
                   
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          <!-- END MAIN CONTENT AREA -->
          </table>

          <!-- START FOOTER -->
          <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
              <tr>
                <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                  <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">SenzMate (Pvt) Ltd, 27/1, 1/1, Melbourne Avenue,Colombo 04,Sri Lanka.</span>
               
                </td>
              </tr>
            
            </table>
          </div>
          <!-- END FOOTER -->

        <!-- END CENTERED WHITE CONTAINER -->
        </div>
      </td>
      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
    </tr>
  </table>
</body>
</html>
      `
  )
}

app.post('/send',bodyValidate,(req, res) => {
  let decodedBase64 = base64.base64Decode(req.body.pdf64, 'report.pdf');
  
  var mailOptions = {
    from: '"SenzMate" <partnerships@senzmate.com>',
    to: `${req.body.to.map((item)=>`${item},`)}`,
    subject: req.body.subject,
    html:mailTemp(req.body.body,req.body.subject),
    bcc:'partnerships@senzmate.com',
    attachments:[
        {
            filename:'report.pdf',
            path:'./report.pdf'
        }
    ]
  };
  mail.sendMail(mailOptions,function(err,response){
    if(err){
      res.status(500).send(err);
    }else{
      res.send(response);
    }
  });


  
});




app.listen(port);