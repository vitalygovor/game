$(document).ready(function () {

    var Memory = {};

    function doDraggable() {
        $(".dinamicBlock .block").draggable({
            revert: true
        });
    }

    doDraggable();
    checkColor();

    function checkColor() {
        var el = $(".dinamicBlock .block");
        // alert(el.attr('level'));

        if(el.attr('level') == 0) {
            el.css({
                "background": "#666"
            });
        }

        if(el.attr('level') == 1) {
            el.css({
                "background": "#709C34"
            });
        }

        if(el.attr('level') == 2) {
            el.css({
                "background": "#FFD300"
            });
        }

        if(el.attr('level') == 3) {
            el.css({
                "background": "#FF4900"
            });
        }
    }

    function RandomElement() {
        var Ran1 = Math.floor((Math.random() * 3) + 1);
        var Ran2 = Math.floor((Math.random() * 3) + 1);

        $(".dinamicBlock").html("<div class='block' level='"+Ran1+"' type='"+Ran2+"'>"+Ran2+"</div>");
    }

    $(".battleplace .block").droppable({
        accept: ".block",
        drop: function (event, ui) {

            var attrLevel = $(this).attr("level");
            var attrDropLevel = ui.draggable.attr("level");

            var attrType = $(this).attr("type");
            var attrDropType = ui.draggable.attr("type");

            if($(this).is("[level]")){

                if(attrDropType != attrType){
                    alert("Error");
                    $(this).remove();
                    ui.draggable.remove();
                } else {
                    alert(attrDropLevel+" and"+attrLevel);
                    if(attrLevel == attrDropLevel) {
                        alert("Error");
                        $(this).remove();
                        ui.draggable.remove();
                    } else {

                        if((attrDropLevel - attrLevel) == 1) {
                            alert("Success!");
                            $(this).html(ui.draggable.attr('type'));
                            $(this).attr("level", ui.draggable.attr('level'));

                            Memory[""+$('.block').index(this)+""] = {
                                level: ui.draggable.attr('level'),
                                type: ui.draggable.attr('type')
                            };

                        } else {
                            alert("Error");
                            $(this).remove();
                            ui.draggable.remove();
                        }
                    }
                }

            } else {
                $(this).append(ui.draggable.attr('type'));
                $(this).attr("level", ui.draggable.attr('level'));
                $(this).attr("type", ui.draggable.attr('type'));

                Memory[""+$('.block').index(this)+""] = {
                    level: ui.draggable.attr('level'),
                    type: ui.draggable.attr('type')
                };
            }



            ui.draggable.hide();

            //Buffer
            console.log(Memory);

            if(ui.draggable.attr('level') == 1) {
                $(this).css({
                    "background": "#709C34"
                });
            }

            if(ui.draggable.attr('level') == 2) {
                $(this).css({
                    "background": "#FFD300"
                });
            }

            if(ui.draggable.attr('level') == 3) {
                $(this).css({
                    "background": "#FF4900"
                });
            }

            RandomElement();
            checkColor();
            doDraggable();

        }
    });




});