var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = function(req, res){
// Definimos el transporter
var transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
       user: 'carlos.a.cuenca.c@unl.edu.ec',
       pass: 'andres199700'
   }
});
// Definimos el email
var mailOptions = {
       from: 'carlos97cc123@gmail.com',
       to: req.body.email,
       subject: req.body.asunto,
       text: req.body.message
};
// Enviamos el email
transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
        //res.send(500, err.message);
    } else {
        console.log("Email sent");
        res.status(200).jsonp(req.body);

    }
});
req.flash('info_correcta', 'Su correo ha sido enviado');
res.redirect('/contactenos');




};
