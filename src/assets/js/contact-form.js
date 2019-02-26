// Contact form code
$('form.contact-form').submit(function (e) {
    if(e.preventDefault) e.preventDefault(); 
    else e.returnValue = false;

    var thisForm        = $(this).closest('.contact-form'),
    error           = 0,
    originalError   = thisForm.attr('original-error'),
    loadingSpinner;

    if (typeof originalError !== typeof undefined && originalError !== false) {
        thisForm.find('.form-error').text(originalError); 
    }


    $(thisForm).find('.validate-required').each(function(){
        if($(this).val() === ''){
            $(this).addClass('field-error');
            error = 1;
        }else{
            $(this).removeClass('field-error');
        }
    });

    $(thisForm).find('.validate-email').each(function(){
        if(!(/(.+)@(.+){2,}\.(.+){2,}/.test($(this).val()))){
            $(this).addClass('field-error');
            error = 1;
        }else{
            $(this).removeClass('field-error');
        }
    });


    if (error === 1){
        $(this).closest('.contact-form').find('.form-error').fadeIn(200);
    }else {
        $(this).closest('.contact-form').find('.form-error').fadeOut(200);
        loadingSpinner = $('<div />').addClass('form-loading').insertAfter($(thisForm).find('input[type="submit"]'));
        $(thisForm).find('input[type="submit"]').hide();

        jQuery.ajax({
            type: "POST",
            url: "assets/mail/mail.php",
            data: thisForm.serialize(),
            success: function (response) {
                $(thisForm).find('.form-loading').remove();
                $(thisForm).find('input[type="submit"]').show();
                if($.isNumeric(response)){
                    if(parseInt(response) > 0){
                        thisForm.find('.form-success').fadeIn(1000);
                        thisForm.find('.form-error').fadeOut(1000);
                        setTimeout(function(){ thisForm.find('.form-success').fadeOut(500); }, 500000);
                        $(thisForm).find('input[type="submit"]').hide();
                    }
                }
                else{
                    thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
                    thisForm.find('.form-error').text(response).fadeIn(1000);
                    thisForm.find('.form-success').fadeOut(1000);
                }
            },
            error: function (errorObject, errorText, errorHTTP) {
                thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
                thisForm.find('.form-error').text(errorHTTP).fadeIn(1000);
                thisForm.find('.form-success').fadeOut(1000);
                $(thisForm).find('.form-loading').remove();
                $(thisForm).find('input[type="submit"]').show();
            }
        });
    }
    return false;
});