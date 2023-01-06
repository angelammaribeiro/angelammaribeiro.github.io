$(document).ready(function(){
    $('body,html').animate({scrollTop: 300}, 1000); 
    

    $('#formsfaqs').submit(function(event){
      var retval = true

      if ($("#pessoa").val().trim().length < 10 || $("#pessoa").val().trim().length > 100) {
            $("#pessoaError").removeClass('d-none');
            retval = false;
        }
      else {
          $("#pessoaError").addClass('d-none');
      }
      if ($("#email").val().trim().length < 10 || $("#email").val().trim().length > 100) {
            $("#emailError").removeClass('d-none');
            retval = false;
        }
      else {
          $("#emailError").addClass('d-none');
      }
      if ($('input[name="duvtipo"]:checked').length <1) {
            $("#duvtipoError").removeClass('d-none');
            retval = false;
        }
      else {
          $("#duvtipoError").addClass('d-none');
      }
      if ($("#duvida").val().trim().length < 20 || $("#duvida").val().trim().length > 200) {
            $("#duvidaError").removeClass('d-none');
            retval = false;
        }
      else {
          $("#duvidaError").addClass('d-none');
      }
      return retval
    })

    $('#clean').click(function () {
        $("#pessoaError").addClass('d-none');
        $("#emailError").addClass('d-none');
        $("#duvtipoError").addClass('d-none');
        $("#duvidaError").addClass('d-none');
    });
  });