$(document).ready(function () {

    var Results = 0;

    var AwardsMemory = {
        bank: 0,
        building: 0
    };

    var Core = {
        fire:{
            name: "fire",
            color: "orange",
            link: {
                metal:"gold",
                clay: "brick"
            }
        },
        gold: {
            name: "gold",
            color: "#B96E00",
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
            color: "red"
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
            color: "red"
        },
        metal: {
            name: "metal",
            color: "white",
            link: {
                fire:"gold"
            }
        }
    }

    //  Scan all blocks in .battleblock and change styles
    function scanBlocks() {
        // console.log($(".battleplace .block .block").length);

               $(".battleplace .sector .block").each(function(index) {
            $(this).attr("index",index);
            $(this).css({
                "background-color":Core[$(this).attr("element")].color,
                "background-image":"url('img/"+Core[$(this).attr("element")].name+".png')",
                "background-size":"50%",
                "background-repeat":"no-repeat",
                "background-position":"center",
                "margin": 0
            });
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

        var newElement = $("<div />", {
            class: "block",
            element: Obj.name,
            css: {
                "background-color":Obj.color,
                "background-image":"url('img/"+Obj.name+".png')",
                "background-size":"70%",
                "background-repeat":"no-repeat",
                "background-position":"center",
            }
        });

        $(".dinamicBlock").html(newElement);

    }

    createNewElement(getNewRandomElement());



    function checkAccessBlocks(block1, block2){

        var element = block2[0].attributes.element;
        var elementName = element.name;
        var elementValue = element.value;

        if($(block1).find(".block").length == 0) {

            block1.html("<div class='block' "+elementName+"='"+elementValue+"' level='midddle'></div>");
            plusPoints();
            createNewElement(getNewRandomElement());

        } else {

            var mainElement = $(block1).find(".block").attr("element");
            var mainKeys = Core[mainElement].link;

            if (mainKeys != undefined) {

                if (mainKeys.hasOwnProperty(elementValue)) {
                    block1.html("<div class='block' "+elementName+"='"+Core[mainElement].link[elementValue]+"' level='midddle'></div>");

                    // Combo.push(Core[mainElement].link[elementValue]);
                    AwardsMemory[Core[mainElement].link[elementValue]]++;

                    plusPoints();
                    createNewElement(getNewRandomElement());

                } else {
                    minusPoints();

                    $(".dinamicBlock").html("<div class='block' element='"+elementValue+"'></div>");
                    $(".dinamicBlock .block").css({
                        "background-color": Core[elementValue].color,
                        "background-image":"url('img/"+Core[elementValue].name+".png')",
                        "background-size":"70%",
                        "background-repeat":"no-repeat",
                        "background-position":"center",
                    });
                }
            } else {
                $(".dinamicBlock").html("<div class='block' element='"+elementValue+"'></div>");
                $(".dinamicBlock .block").css({
                    "background-color": Core[elementValue].color,
                    "background-image":"url('img/"+Core[elementValue].name+".png')",
                    "background-size":"70%",
                    "background-repeat":"no-repeat",
                    "background-position":"center",
                });
            }
        }

        updateResults();
    }


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

    function clearAwards(){

        $(".awards").html('');

        for(var name in AwardsMemory) {
            // propertyName is what you want
            // you can get the value like this: myObject[propertyName]

            AwardsMemory[name] = 0;

        }
    }


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
                    clearAwards();
                } else {
                    location.reload();
                }
            } else {
                time--;
            }
        }, 1000);

    });

    // --------------------------------

    var App = function App(block) {
        this.dinamicArea = $(".dinamicBlock");
        this.battleArea = $(".battleplace");
        this.area = function area() {
            if(block.parentBlock == this.dinamicArea) {
                return "dinamic";
            } else {
                return "battle";
            }
        };
        this.selectBlock = block;
        this.parentBlock = block.parent();
        var element = block[0].attributes.element;
        this.propertiesOfBlock = Core[element.value];
        this.accessBlock = this.propertiesOfBlock.link;
    };

    $( "body" ).on("mouseover", '.block' ,function() {

        //  Create a new class
        var block = new App($(this));
        console.log("From class:");
        console.log(block);

        if(block.propertiesOfBlock.hasOwnProperty("link")){
            doDraggable(block);
        }

        doDroppable(block);

    });

    function doDraggable(block) {

        $(block.selectBlock).draggable({
            revert: true,
            zIndex: 1000,
            start: function(e, ui)
            {


                $(ui.helper).css({
                    "box-shadow":"0px 0px 20px #777",
                    "overflow": "hidden",
                });

            }
        });

    }

    function doDroppable(block) {

        $(checkAllSectors(block)).droppable({
            accept: block.selectBlock,
            hoverClass: "ui-state-active",
            drop: function (event, ui) {

                // checkAccessBlocks($(this), ui.draggable);

                var sector = $(this);

                if(block.area() == 'dinamic') {
                    console.log(block.area());
                    // generateNewBlock(getNewRandomElement());
                } else {
                    console.log(block.area());
                    block.parentBlock.html('');
                }


                if(sector.html().length > 0){

                    var blockIntoSector = new App(sector.find('.block'));
                    var mainKeys = Core[block.propertiesOfBlock.name].link;

                    if(mainKeys.hasOwnProperty(blockIntoSector.propertiesOfBlock.name)){

                        AwardsMemory[Core[block.propertiesOfBlock.name].link[blockIntoSector.propertiesOfBlock.name]]++;
                        var newElement = $("<div />", {
                            class: "block",
                            element: Core[block.propertiesOfBlock.name].link[blockIntoSector.propertiesOfBlock.name]
                        });

                        sector.html(newElement);
                    }
                } else {
                    dropper(block, sector);
                }

                generateNewBlock(getNewRandomElement());
                scanBlocks();
                checkAwards();
                // createNewElement(getNewRandomElement());
            }
        });
    }

    function checkAllSectors(block) {

        var DroppableSectors = [];

        $(".battleplace .sector").each(function(index){

            var mainKeys = Core[block.propertiesOfBlock.name].link;
            if($(this).html().length > 0){
                var blockIntoSector = new App($(this).find('.block'));
                if(mainKeys.hasOwnProperty(blockIntoSector.propertiesOfBlock.name)){

                    DroppableSectors.push(blockIntoSector.parentBlock);
                }
            } else {
                DroppableSectors.push($(this));
            }
        });

        return DroppableSectors;

    }

    function dropper(block, sector) {

        var newLevel = $("<div />", {
            class: "block",
            element: block.propertiesOfBlock.name
        });

        sector.html(newLevel);

        // Check access blocks

        $(".dinamicBlock").html();

        block.selectBlock.hide();
        block.parentBlock.html('');

    }

    function generateNewBlock(block) {

        var newElement = $("<div />", {
            class: "block",
            element: block.name,
            css: {
                "background-color": block.color,
                "background-image":"url('img/"+block.name+".png')",
                "background-size":"70%",
                "background-repeat":"no-repeat",
                "background-position":"center",
            }
        });

        $(".dinamicBlock").html(newElement);
    }

});