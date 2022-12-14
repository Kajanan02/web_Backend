const express = require('express');
const Ajv = require('ajv');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const base64 = require('base64topdf');
const mongoose =require("mongoose");
const request = require('request');


const app = express();
const port = 3001;
const ajv = new Ajv();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jey@senzmate.com',
    pass: 'mfdeycpsvlwjcqje'
  }
});

function articleID(id) {
  const options = {
    url: 'https://api.medium.com/@senzmate/'+id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer 262511fcc9edf02db10fb601298a060355147b3f4339e796ac4f699e168d8cdd1",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    }
  };
  return options
}

const Schema = mongoose.Schema


const testCollectionSchema = new Schema({slug: {type: String,}}, {strict: false})
app.post("/add", async ( req,res,next)=>{
  let adas= await mongoose.model("articles", testCollectionSchema).find({})
  console.log(adas)
  await request({ url: 'http://52.142.47.126:1337/api/blogs'}, (error, response, body)=>{
    if (!error && response.statusCode == 200) {
      let dd =JSON.parse(body)
      console.log(dd.data);
      console.log(adas);
      let addddddd = false
      for(let i=0 ;i<dd.data.length; i++) {
        const findData =   adas.findIndex((e) => e.attributes.article_id === dd.data[i].attributes.article_id);
        if (findData === -1) {
          request(articleID(dd.data[i].attributes.article_id), (error, response, bodys) => {
            if (!error && response.statusCode == 200) {
              let resa = {};
              resa = JSON.parse(bodys.toString().slice(16));
              // req.setHeader( "Content-Type", "application/json");
              resa.attributes = dd.data[i].attributes
              // req = JSON.stringify(bodys.toString().slice(16))
              console.log(resa)
              const TestCollection = mongoose.model('articles', testCollectionSchema)
              const testCollectionData = new TestCollection(resa)
              testCollectionData.save()
              // return res.send(testCollectionData)
            } else {
              console.log(error)
            }
          });
          addddddd =false
        }else {
          addddddd =true
        }
      }
      if(addddddd){
        res.send("already Added")
      }else {
        res.send("DB Saved")}
    }else {
      console.log(error)
    }
  });
  // await res.json(resa)
})

// .get("/", async (req, res) => {
//
// });
app.get("/article",async ( req,res,next)=>{
  // const testCollectionSchema = new Schema({slug:{
  //         type:String,
  //     }}, { strict: false })

  const findData = await mongoose.model("articles", testCollectionSchema).find();
  res.json(findData);
})


app.listen(5000,()=>{
  console.log("Server Started 5000");
})

mongoose.connect('mongodb+srv://Test_01:admin@testcluster.nyrf1.mongodb.net/medium?retryWrites=true&w=majority',(err)=>{
  if(!err){
    console.log("DB Connected SuccessFully")
  }else {
    console.log(err)
  }
})

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
        </div>gg
      </td>
      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
    </tr>
  </table>
</body>
</html>
      `
  )
}

function mailTempConfirmation(name){
  return(
      `<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Submission Successful</title>
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
<body class=""
      style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
<span class="preheader"
      style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
SenzMate IoT Intelligence
</span>
<table border="0" cellpadding="0" cellspacing="0" class="body"
       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
    <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container"
            style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
            <div class="content"
                 style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
                <div style="padding: 20px;">

                    <img  src="https://senzmate-website.s3.ap-south-1.amazonaws.com/senzmae-logo.jpeg" style="mix-blend-mode: multiply;"/>
                </div>



                <!-- START CENTERED WHITE CONTAINER -->
                <table class="main"
                       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper"
                            style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0"
                                   style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr>
                                    <span class="apple-link"
                                          style="color: #333333; font-size: 16px; line-height: 24px; text-align: center;">Hi ${name}, <br>
                                        Thanks for your interest to join our team. We are honored to have you in our journey. <br><br>
                                        We will reach you when your preference matches our requirement <br> <br>
                                       Sincerely.<br/>
                                        SenzMate Team
                                    </span>

                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- END MAIN CONTENT AREA -->
                </table>

                <!-- START FOOTER -->
                <div class="footer" style="clear: both; width: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0"
                           style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                        <tr style="background-color:  #F7F9FC; width: 100%;">
                            <td class="content-block"
                                style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 14px; line-height: 20px; color: #333333; padding-left: 20px">

                                <span class="apple-link" style="color: #333333; font-size: 14px; text-align: left;"> SenzMate (Pvt) Ltd, <br> 27/1, 1/1, Melbourne Avenue, <br> Colombo 04, <br> Sri Lanka.</span>

                                <div style="text-align: right; padding-bottom:16px ">
                                    <a target="_blank" href="https://www.linkedin.com/company/senzmate-iot-solutions/">  <img width="20px" style="padding-right: 30px;" src="https://senzmate-website.s3.ap-south-1.amazonaws.com/linkdin01.png"/></a>
                                    <a target="_blank" href="https://www.facebook.com/SenzMate">    <img width="20px" style="padding-right: 30px;" src="https://senzmate-website.s3.ap-south-1.amazonaws.com/facebook01.png"/> </a>
                                    <a target="_blank" href="https://twitter.com/SenzMate">     <img width="20px" style="padding-right: 30px;" src="https://senzmate-website.s3.ap-south-1.amazonaws.com/twitter01.png"/> </a>



                                </div>
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
function mailTempOtherConfirmation(name){
  return(
      `<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Submission Successful</title>
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
<body class=""
      style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
<span class="preheader"
      style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
    SenzMate IoT Intelligence
</span>
<table border="0" cellpadding="0" cellspacing="0" class="body"
       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
    <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container"
            style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
            <div class="content"
                 style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                <div style="padding: 20px;">

                    <img  src="https://senzmate-website.s3.ap-south-1.amazonaws.com/senzmae-logo.jpeg" style="mix-blend-mode: multiply;"/>
                </div>

                <!-- START CENTERED WHITE CONTAINER -->
                <table class="main"
                       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper"
                            style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0"
                                   style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr>
                                    <span class="apple-link"
                                          style="color: #333333 !important; font-size: 16px; line-height: 24px; text-align: center;">Hi ${name}, <br>
                                                        Thank you for reaching us.<br><br>

                                                         We will make every effort to contact you as soon as possible.<br>
<br>
                                                         Sincerely,<br>
                                                         SenzMate Team
                                    </span>

                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- END MAIN CONTENT AREA -->
                </table>

                <!-- START FOOTER -->
                <div class="footer" style="clear: both;  width: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0"
                           style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                        <tr style="background-color: #F7F9FC;">
                            <td class="content-block"
                                style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; padding-left: 20px;">
                                <span class="apple-link" style="color: #333333; font-size: 14px; line-height: 20px; text-align: left;"> SenzMate (Pvt) Ltd, <br> 27/1, 1/1, Melbourne Avenue, <br> Colombo 04, <br> Sri Lanka.</span>
                                <div style="text-align: right; padding-bottom: 20px">
                                    <a target="_blank" href="https://www.linkedin.com/company/senzmate-iot-solutions/">  <img width="20px" style="padding-right: 30px;" src="https://senzmate-website.s3.ap-south-1.amazonaws.com/linkdin01.png"/></a>
                                    <a target="_blank" href="https://www.facebook.com/SenzMate">    <img width="20px" style="padding-right: 30px;" src="https://senzmate-website.s3.ap-south-1.amazonaws.com/facebook01.png"/> </a>
                                    <a target="_blank" href="https://twitter.com/SenzMate">     <img width="20px" style="padding-right: 30px;" src="https://senzmate-website.s3.ap-south-1.amazonaws.com/twitter01.png"/> </a>



                                </div>


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
function mailTempNewsLetterConfirmation(){
  return(
      `<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Submission Successful</title>
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
<body class=""
      style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
<span class="preheader"
      style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
    SenzMate IoT Intelligence
</span>
<table border="0" cellpadding="0" cellspacing="0" class="body"
       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #F2F5F8;">
    <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container"
            style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
            <div class="content"
                 style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
                <div style="padding: 20px;">

                    <img  src="https://senzmate-website.s3.ap-south-1.amazonaws.com/senzmae-logo.jpeg" style="mix-blend-mode: multiply;"/>
                </div>


                <!-- START CENTERED WHITE CONTAINER -->
                <table class="main"
                       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper"
                            style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0"
                                   style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr>
                                    <span class="apple-link"
                                          style="color: #333333; font-size: 16px; text-align: center; line-height: 24px">Hi, <br>
                                        Thank you for subscribing to our newsletter! <br/>
                                        You will be notified once a month with new updates of our company. <br/>
<br/><br/><br/>
                                        Sincerely.<br/>
                                        SenzMate Team
                                    </span>

                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- END MAIN CONTENT AREA -->
                </table>

                <!-- START FOOTER -->
                <div class="footer" style="clear: both;  width: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0"
                           style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                        <tr style="background-color: #F7F9FC; width: 100%;">
                            <td class="content-block"
                                style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; padding-left: 20px; font-size: 12px; color: #999999;">

                                <span class="apple-link" style="color: #333333; line-height: 20px; font-size: 14px; text-align: left;"> SenzMate (Pvt) Ltd, <br> 27/1, 1/1, Melbourne Avenue, <br> Colombo 04, <br> Sri Lanka.</span>

                                <div style="text-align: right;padding-bottom: 16px">
                                    <a target="_blank" href="https://www.linkedin.com/company/senzmate-iot-solutions/">  <img width="20px" style="padding-right: 30px;" src="https://senzmate-website.s3.ap-south-1.amazonaws.com/linkdin01.png"/></a>
                                    <a target="_blank" href="https://www.facebook.com/SenzMate">    <img width="20px" style="padding-right: 30px;" src="https://senzmate-website.s3.ap-south-1.amazonaws.com/facebook01.png"/> </a>
                                    <a target="_blank" href="https://twitter.com/SenzMate">     <img width="20px" style="padding-right: 30px;" src="https://senzmate-website.s3.ap-south-1.amazonaws.com/twitter01.png"/> </a>



                                </div>

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

function mailTempBookADemo(){
  return(
      `<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Submission Successful</title>
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
<body class=""
      style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
<span class="preheader"
      style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
      SenzMate IoT Intelligence
</span>
<table border="0" cellpadding="0" cellspacing="0" class="body"
       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
    <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container"
            style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
            <div class="content"
                 style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                <!-- START CENTERED WHITE CONTAINER -->
                <table class="main"
                       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper"
                            style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0"
                                   style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr>
                                    <span class="apple-link"
                                          style="color: #999999; font-size: 12px; text-align: center;">Hi, <br>
                                        Thanks for your interest in our product. <br>
                                        We will reach you with a possible time slot for the demo <br>
                                        SenzMate Team
                                    </span>

                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- END MAIN CONTENT AREA -->
                </table>

                <!-- START FOOTER -->
                <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0"
                           style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                        <tr>
                            <td class="content-block"
                                style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
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

function mailTempGetInTouch(){
  return(
      `<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Submission Successful</title>
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
<body class=""
      style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
<span class="preheader"
      style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
    SenzMate IoT Intelligence
</span>
<table border="0" cellpadding="0" cellspacing="0" class="body"
       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
    <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container"
            style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
            <div class="content"
                 style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                <!-- START CENTERED WHITE CONTAINER -->
                <table class="main"
                       style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper"
                            style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0"
                                   style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr>
                                    <span class="apple-link"
                                          style="color: #999999; font-size: 12px; text-align: center;">Hi, <br>
                                        Thanks for your interest in our articles. <br>
                                        We will send updates when there is a new article<br>
                                        SenzMate Team
                                    </span>

                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- END MAIN CONTENT AREA -->
                </table>

                <!-- START FOOTER -->
                <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0"
                           style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                        <tr>
                            <td class="content-block"
                                style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
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

app.post('/send-notification',(req, res) => {

  let sub = "A new "+req.body.type+" application is submitted";
  let body = "Hi,<br><br> A new " + req.body.type + " application has been submitted via website, please check it here.<br>";


  if (req.body.type === "CAREER") {
    body = body + "https://docs.google.com/spreadsheets/d/1xPNYkyGGXe93iS1W-UvADJaMf6XID_ggMi-o7h0Wc0s/edit#gid=0"
  }else if (req.body.type === "CONTACT US") {
    body = body + "https://docs.google.com/spreadsheets/d/1sF2x-2QVdprcubWkPcurcG0Kq9ENBxJ_OBPdInFi43c/edit#gid=0"
  }else if (req.body.type === "NEWS LETTER") {
    body = body + "https://docs.google.com/spreadsheets/d/1iYbUJSHUgKld2Ggt2GKzMpVfrfYGJvDJNDot6dejnbM/edit#gid=0"
  }else if (req.body.type === "BOOK A DEMO") {
    body = body + "https://docs.google.com/spreadsheets/d/1sF2x-2QVdprcubWkPcurcG0Kq9ENBxJ_OBPdInFi43c/edit#gid=0"
  }else if (req.body.type === "GET IN TOUCH") {
    body = body + "https://docs.google.com/spreadsheets/d/1iYbUJSHUgKld2Ggt2GKzMpVfrfYGJvDJNDot6dejnbM/edit#gid=0"
  }

  if (req.body.type === "CAREER") {
    var mailOptionsConfirmation = {
      from: '"SenzMate IoT Intelligence" <info@senzmate.com>',
      to: req.body.to,
      subject: "Confirmation of Receipt of Your Application",
      html:mailTempConfirmation(req.body.name),
      bcc:'info@senzmate.com'
    };

    mail.sendMail(mailOptionsConfirmation,function(err,response){
      if(err){
        console.log(err);
        // res.status(500).send(err);
      }else{
        // res.send(response);
        console.log(response);

      }
    });
  }else if(req.body.type === "NEWS LETTER") {
    var mailOptionsConfirmationNews = {
      from: '"SenzMate IoT Intelligence" <info@senzmate.com>',
      to: req.body.to,
      subject: "Confirmation of Receipt of Your Application",
      html:mailTempNewsLetterConfirmation(),
      bcc:'info@senzmate.com'
    };

    mail.sendMail(mailOptionsConfirmationNews,function(err,response){
      if(err){
        console.log(err);
        // res.status(500).send(err);
      }else{
        // res.send(response);
        console.log(response);

      }
    });
  }else {
    var mailOptionsConfirmationOther = {
      from: '"SenzMate IoT Intelligence" <info@senzmate.com>',
      to: req.body.to,
      subject: "Confirmation of Receipt of Your Application",
      html:mailTempOtherConfirmation(req.body.name),
      bcc:'info@senzmate.com'
    };

    mail.sendMail(mailOptionsConfirmationOther,function(err,response){
      if(err){
        console.log(err);
        // res.status(500).send(err);
      }else{
        // res.send(response);
        console.log(response);

      }
    });
  }


  var mailOptions = {
    from: '"SenzMate Website" <info@senzmate.com>',
    to: `jey@senzmate.com`,
    subject: sub,
    html:body
  };
  mail.sendMail(mailOptions,function(err,response){
    if(err){
      res.status(500).send(err);
    }else{
      res.send(response);
    }
  });

});

app.post('/confirmation',(req, res) => {

  var mailOptionsConfirmation = {
    from: '"SenzMate" <info@senzmate.com>',
    to: req.body.to,
    subject: "Confirmation of Receipt of Your Application",
    html:mailTempConfirmation(req.body.body,req.body.subject),
    bcc:'partnerships@senzmate.com'
  };

  mail.sendMail(mailOptionsConfirmation,function(err,response){
    if(err){
      res.status(500).send(err);
    }else{
      res.send(response);
    }
  });

});

app.post('/book-a-demo',(req, res) => {

  var mailOptionsConfirmation = {
    from: '"SenzMate" <info@senzmate.com>',
    to: req.body.to,
    subject: "Confirmation of Receipt of Your Application",
    html:mailTempBookADemo(),
    bcc:'partnerships@senzmate.com'
  };

  mail.sendMail(mailOptionsConfirmation,function(err,response){
    if(err){
      res.status(500).send(err);
    }else{
      res.send(response);
    }
  });

});

app.post('/get-in-touch',(req, res) => {

  var mailOptionsConfirmation = {
    from: '"SenzMate" <info@senzmate.com>',
    to: req.body.to,
    subject: "Confirmation of Receipt of Your Application",
    html:mailTempGetInTouch(),
    bcc:'partnerships@senzmate.com'
  };

  mail.sendMail(mailOptionsConfirmation,function(err,response){
    if(err){
      res.status(500).send(err);
    }else{
      res.send(response);
    }
  });

});




app.listen(port);