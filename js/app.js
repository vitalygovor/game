$(document).ready(function () {

    //  CACHE
    var Results = 0;
    var AwardsMemory = {
        bank: 0,
        building: 0
    };

    //  GENERAL SETTINGS
    var Core = {
        fire:{
            name: "fire",
            color: "white",
            link: {
                metal:"gold",
                clay: "brick"
            }
        },
        gold: {
            name: "gold",
            color: "white",
            link: {
                abacus:"bank"
            }
        },
        brick: {
            name: "brick",
            color: "white",
            link: {
                instruments:"building"
            }
        },
        clay: {
            name: "clay",
            color: "white",
            link: {
                fire:"brick"
            }
        },
        instruments: {
            name: "instruments",
            color: "white",
            link: {
                brick:"building"
            }
        },
        building: {
            name: "building",
            color: "white"
        },
        abacus: {
            name: "abacus",
            color: "white",
            link: {
                gold: "bank"
            }
        },
        bank: {
            name: "bank",
            color: "white"
        },
        metal: {
            name: "metal",
            color: "white",
            link: {
                fire:"gold"
            }
        }
    }

    //  STYLE SCANNER
    function scanBlocks() {
        // console.log($(".battleplace .block .block").length);

               $(".battleplace .sector .block").each(function(index) {
            $(this).attr("index",index);
            $(this).css({
                "background-color":Core[$(this).attr("element")].color,
                "background-image":"url('img/"+Core[$(this).attr("element")].name+".png')",
                "background-size":"80%",
                "background-repeat":"no-repeat",
                "background-position":"center",
                "margin": 0
            });
        });

    }

    //  MAIN CLASS
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

    //  MAIN CONTROLLERS
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
                plusPoints();
                updateResults();
                checkAwards();
                // createNewElement(getNewRandomElement());
            }
        });
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

    //  GENERATE NEW BLOCKS
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
                "background-size":"80%",
                "background-repeat":"no-repeat",
                "background-position":"center",
            }
        });

        $(".dinamicBlock").html(newElement);

    }

    //  AWARDS & TIMER

    //  TIMER FUNCs
    $(".start").click(function () {
        $(".time").show('');
        $(".points").show('');
        $(".points").html('0');
        $(".battleplace .sector").html('');

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
                    $(".battleplace .sector").html('');
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
    $(".time").hide('');
    $(".points").hide('');

    //  AWARDS FUNCs
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


    //  DEFAULT SETTINGS
    createNewElement(getNewRandomElement());
});