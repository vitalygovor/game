$(document).ready(function () {

    var Results = 0;

    var AwardsMemory = {
        bank: 0,
        building: 0
    };

    var Core = {
        fire:{
            name: "fire",
            color: "green",
            link: {
                metal:"gold",
                clay: "brick"
            }
        },
        gold: {
            name: "gold",
            color: "yellow",
            link: {
                abacus:"bank"
            }
        },
        brick: {
            name: "brick",
            color: "brown",
            link: {
                instruments:"building"
            }
        },
        instruments: {
            name: "instruments",
            color: "blue",
            link: {
                brick:"building"
            }
        },
        building: {
            name: "building",
            color: "red",
            awards: {
                award1: "Award #1",
                award2: "Award #2",
                award3: "Award #3"
            }
        },
        abacus: {
            name: "abacus",
            color: "brown",
            link: {
                gold: "bank"
            }
        },
        bank: {
            name: "bank",
            color: "red",
            awards: {
                award1: "Award #1",
                award2: "Award #2",
                award3: "Award #3"
            }
        },
        metal: {
            name: "metal",
            color: "black",
            link: {
                fire:"gold"
            }
        }
    }

    //  Scan all blocks in .battleblock and change styles
    function scanBlocks() {
        // console.log($(".battleplace .block .block").length);

        $(".battleplace .block .block").each(function(index) {
            $(this).css({
                "background":Core[$(this).attr("element")].color,
                "margin": 0
            })
        });

    }

    function getNewRandomElement() {

        // Generate random number
        var Random = Math.floor((Math.random() * Object.keys(Core).length) + 1);

        // Keys of Core
        var keysOfCore = Object.keys(Core);

        // Sort all of Core's values
        if(Core[keysOfCore[Random-1]].hasOwnProperty('link')){
            return Core[keysOfCore[Random-1]];
        } else {
            return getNewRandomElement();
        }

    }

    function createNewElement(Obj) {
        $(".dinamicBlock").html("<div class='block' element='"+Obj.name+"' style='background: "+Obj.color+"'>"+Obj.name+"</div>");
    }

    createNewElement(getNewRandomElement());

    function doDraggable() {
        $(".dinamicBlock .block").draggable({
            revert: true
        });
    }

    function checkAccessBlocks(block1, block2){

        var element = block2[0].attributes.element;
        var elementName = element.name;
        var elementValue = element.value;

        if($(block1).find(".block").length == 0) {

            block1.html("<div class='block' "+elementName+"='"+elementValue+"'>"+block2.text()+"</div>");
            plusPoints();
            createNewElement(getNewRandomElement());

        } else {

            var mainElement = $(block1).find(".block").attr("element");
            var mainKeys = Core[mainElement].link;

            if (mainKeys != undefined) {

                if (mainKeys.hasOwnProperty(elementValue)) {
                    block1.html("<div class='block' "+elementName+"='"+Core[mainElement].link[elementValue]+"'>"+Core[mainElement].link[elementValue]+"</div>");

                    // Combo.push(Core[mainElement].link[elementValue]);
                    AwardsMemory[Core[mainElement].link[elementValue]]++;

                    plusPoints();
                    createNewElement(getNewRandomElement());

                } else {
                    minusPoints();
                    console.log(block2);
                    $(".dinamicBlock").html("<div class='block' element='"+elementValue+"' style='background: "+Core[elementValue].color+"'>"+elementValue+"</div>");
                }
            } else {
                $(".dinamicBlock").html("<div class='block' element='"+elementValue+"' style='background: "+Core[elementValue].color+"'>"+elementValue+"</div>");
            }
        }

        updateResults();
    }

    doDraggable();

    function plusPoints() {
        Results += 100;
    }

    function minusPoints() {
        Results -= 100;
    }

    function updateResults(){
        $(".points").html(Results);
    }

    function checkAwards(){

        $(".awards").html('');

        for(var name in AwardsMemory) {
            // propertyName is what you want
            // you can get the value like this: myObject[propertyName]

            if((AwardsMemory[name] < 3)&&(AwardsMemory[name] > 0)) {
                $(".awards").append("<div class='award'><h4>"+name+" = "+AwardsMemory[name]+"!</h4></div>");
            }

            if(AwardsMemory[name] == 3) {
                $(".awards").append("<div class='award'><h4>"+name+" > 3! WOOOOW!</h4></div>");
            }

            if((AwardsMemory[name] < 6)&&(AwardsMemory[name] > 3)) {
                $(".awards").append("<div class='award'><h4>"+name+" = "+AwardsMemory[name]+"!</h4></div>");
            }

            if(AwardsMemory[name] == 6) {
                $(".awards").append("<div class='award'><h4>"+name+" > 6! AWESOME!</h4></div>");
            }

            if((AwardsMemory[name] < 9)&&(AwardsMemory[name] > 6)) {
                $(".awards").append("<div class='award'><h4>"+name+" = "+AwardsMemory[name]+"!</h4></div>");
            }

        }
    }

    function getResults() {

    }

    $(".battleplace .block").droppable({
        accept: ".block",
        drop: function (event, ui) {

            checkAccessBlocks($(this), ui.draggable);
            ui.draggable.hide();
            scanBlocks();
            checkAwards();
            // createNewElement(getNewRandomElement());
            doDraggable();

        }
    });

    $(".time").hide('');
    $(".points").hide('');

    $(".start").click(function () {
        $(".time").show('');
        $(".points").show('');
        $(".points").html('0');
        $(".battleplace .block").html('');

        $(".start").hide();

        var time = 60;

        setInterval(function() {

            $(".time").html(time);
            console.log(time);

            if(time == 0) {
                var r = confirm("Your score: "+Results+"! Do you want to play again?");
                if (r == true) {
                    $(".time").html('');
                    $(".points").html('');
                    $(".start").hide();
                    $(".battleplace .block").html('');
                    time = 60;
                    Results = 0;
                } else {
                    location.reload();
                }
            } else {
                time--;
            }
        }, 1000);

    });



});