'use strict'
const pdf = require('html-pdf');
class ReporteController{
  imprimir(req,res){
    var contenido = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Wish</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Wish shop project">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="styles/bootstrap4/bootstrap.min.css">
    <link href="plugins/font-awesome-4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="plugins/OwlCarousel2-2.2.1/owl.carousel.css">
    <link rel="stylesheet" type="text/css" href="plugins/OwlCarousel2-2.2.1/owl.theme.default.css">
    <link rel="stylesheet" type="text/css" href="plugins/OwlCarousel2-2.2.1/animate.css">
    <link href="plugins/colorbox/colorbox.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="styles/main_styles.css">
    <link rel="stylesheet" type="text/css" href="styles/responsive.css">
    </head>
    <body>
    <div class="extra clearfix">
      <div class="extra_promo extra_promo_1">
        <div class="extra_promo_image" style="background-image:url(images/extra_1.jpg)"></div>
        <div class="extra_1_content d-flex flex-column align-items-center justify-content-center text-center">
          <div class="extra_1_price">BOLETO<span>N324</span></div>
          <div class="extra_1_title">Juan Perez<span>Nombre</span></div>
          <div class="extra_1_title">Loja<span>Origen</span></div>
          <div class="extra_1_title">Quito<span>Destino</span></div>
          <div class="extra_1_title">2019-02-16<span>Fecha</span></div>
          <div class="extra_1_title">15:30<span>Hora</span></div>
          <div class="extra_1_title">456<span>Unidad</span></div>
          <div class="extra_1_title">#02<span>Asiento</span></div>
          <div class="extra_1_title">$21.50<span>Valor</span></div>
          <div class="extra_1_text">Todos los derechos reservados a la cooperativa TransNIC</div>
          <div class="button extra_1_button"><a href="checkout.html">323r3f445g44g5g356tb4yvq4W##&^R&FS#&&#F</a></div>
        </div>
      </div>
    </div>
    <script src="js/jquery-3.2.1.min.js"></script>
    <script src="styles/bootstrap4/popper.js"></script>
    <script src="styles/bootstrap4/bootstrap.min.js"></script>
    <script src="plugins/OwlCarousel2-2.2.1/owl.carousel.js"></script>
    <script src="plugins/easing/easing.js"></script>
    <script src="plugins/parallax-js-master/parallax.min.js"></script>
    <script src="plugins/colorbox/jquery.colorbox-min.js"></script>
    <script src="js/custom.js"></script>
    </body>
    </html>`;
  pdf.create(contenido).toFile('./test.pdf', function(err, res) {
  if (err){
  console.log(err);
  } else {
  console.log(res);
  }
  });
  }

}

module.exports = ReporteController;
