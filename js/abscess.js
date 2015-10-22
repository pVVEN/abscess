/******************************************************************
ABSCESS
by
Owen McNamara

In this game, you take on the role of a doctor in a third world 
country, administering vaccines to a patient suffering from seven 
different diseases. Click on a vial of vaccine that matches a 
virus to clear it from the patient's system. Choose wisely, as 
you only have so much vaccine to administer!


*******************************************************************/

/*
- fix post-mortem page to not use in-line styles
- fix website to make hrefs refer to top level
- change death message to show number of tiles remaining
- fix onUp/onOver button states after clicking - reset to first frame before hiding
- mobile version - scaling?
- add sounds, music
*/

var game = new Phaser.Game(600, 350, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var colorsArray = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple'];
var cellArray = {};
var score = 0;
var ingame = false;
var gameSize, lengthCellSide, numPerSide, totalSteps, numStepsRemaining, numTilesRemaining;

var btn_new, btn_reset, btn_close, btn_help, btn_easy, btn_medium, btn_hard;
var spr_monitorScreen;
var vial_red, vial_orange, vial_yellow, vial_green, vial_teal, vial_blue, vial_purple;
var txt_title, txt_score, txt_win, txt_playAgain, txt_stepsRemaining, txt_monitorStepsRemaining, txt_monitorTitle;
var group_cells, group_menu, group_menuSubgroup, group_menuCredits;
var tween_monitorScroll;
var tween_vialRedGrow, tween_vialOrangeGrow, tween_vialYellowGrow, tween_vialGreenGrow, tween_vialTealGrow, tween_vialBlueGrow, tween_vialPurpleGrow;
var tween_vialRedShrink, tween_vialOrangeShrink, tween_vialYellowShrink, tween_vialGreenShrink, tween_vialTealShrink, tween_vialBlueShrink, tween_vialPurpleShrink;

var Tile = function(game, x, y, img, color, frame, name)
{
    Phaser.Sprite.call(this, game, 0, 0, img, frame);
    this.x = x;
    this.y = y;
    this.key = name;
    this.name = name;
    this.color = color;
    this.checked = false;
}
Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;

/*****************************************************
Custom LabelButton class by Xeke and Mand, found here: http://www.html5gamedevs.com/topic/2847-button-text/
******************************************************/
var LabelButton = function(game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame)
{
    Phaser.Button.call(this, game, x, y, key, callback,
        callbackContext, overFrame, outFrame, downFrame, upFrame);
 
    //Style how you wish...
    this.style = {
        'font': '12px Arial',
        'fill': '#FF6600'
    };
    this.anchor.setTo( 0.5, 0.5 );
    this.label = new Phaser.Text(game, 0, 0, label, this.style);
 
    //puts the label in the center of the button
    this.label.anchor.setTo( 0.5, 0.5 );
 
    this.addChild(this.label);
    this.setLabel( label );

    /*
    this.gfx_btnUnderline = game.add.group();
    this.setUnderline();
    this.addChild(this.gfx_btnUnderline);
    */
 
    //adds button to game
    game.add.existing( this );
};
 
LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;
LabelButton.prototype.setLabel = function( label ) {
   this.label.setText(label);
   //this.setUnderline();
};
LabelButton.prototype.setStyle = function(style){
    this.style = style;
    this.label.setStyle(style);
    //this.setUnderline();
};
/*
LabelButton.prototype.setUnderline = function(){
    var bmd_btnUnderline = game.add.bitmapData(this.label.width, 2);
    bmd_btnUnderline.ctx.beginPath();
    bmd_btnUnderline.ctx.rect(0, 0, this.label.width, 2);
    bmd_btnUnderline.ctx.fillStyle = this.style.fill;//"#00FFCC";
    console.log("setUnderline() this.style.fill: "+this.style.fill);
    bmd_btnUnderline.ctx.fill();
    var tempSpr = game.add.sprite(-(this.label.width/2), this.label.height-13, bmd_btnUnderline);
    console.log("tempSpr: "+tempSpr);
    this.gfx_btnUnderline.add(tempSpr);
    console.log(this.gfx_btnUnderline.children.length);
    //this.gfx_btnUnderline.updateCache();
};
*/
/*** END CUSTOM LABELBUTTON CODE ***/

function preload()
{
    game.load.image('menu', 'img/menu.png');
    game.load.image('monitor', 'img/monitor.png');
    game.load.image('monitor_screen', 'img/monitor_screen.png');
    game.load.image('muscle', 'img/muscle.png');
    game.load.image('vial_blue', 'img/vial_blue.png');
    game.load.image('vial_green', 'img/vial_green.png');
    game.load.image('vial_orange', 'img/vial_orange.png');
    game.load.image('vial_purple', 'img/vial_purple.png');
    game.load.image('vial_red', 'img/vial_red.png');
    game.load.image('vial_teal', 'img/vial_teal.png');
    game.load.image('vial_yellow', 'img/vial_yellow.png');
    game.load.image('whitebloodcells', 'img/whitebloodcells.png');
    game.load.spritesheet('btn_close', 'img/btn_close.png', 78, 37);
    game.load.spritesheet('btn_easy', 'img/btn_easy.png', 78, 37);
    game.load.spritesheet('btn_hard', 'img/btn_hard.png', 78, 37);
    game.load.spritesheet('btn_help', 'img/btn_help.png', 30, 30);
    game.load.spritesheet('btn_medium', 'img/btn_medium.png', 92, 37);
    game.load.spritesheet('btn_new', 'img/btn_new.png', 94, 72);
    game.load.spritesheet('btn_reset', 'img/btn_reset.png', 122, 84);
    game.load.spritesheet('cells12', 'img/cells12.png', 12, 12);
    game.load.spritesheet('cells16', 'img/cells16.png', 16, 16);
    game.load.spritesheet('cells24', 'img/cells24.png', 24, 24);
}

function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'muscle');
    game.add.sprite(0, 0, 'monitor');

    var bmd_monitorUnderline = game.add.bitmapData(203, 2);
    bmd_monitorUnderline.rect(0, 0, 203, 2);
    var clr_monitorUnderline = Phaser.Color.hexToRGB("#00FFCC");
    bmd_monitorUnderline.fill(Phaser.Color.getRed(clr_monitorUnderline), Phaser.Color.getGreen(clr_monitorUnderline), Phaser.Color.getBlue(clr_monitorUnderline), 1);
    var spr_monitorUnderline = game.add.sprite(24, 72, bmd_monitorUnderline);

    var gfx_monitorMask = game.add.graphics(24, 20);
    gfx_monitorMask.beginFill(0xffffff);
    gfx_monitorMask.drawRect(0, 0, 203, 118);
    spr_monitorScreen = game.add.sprite(-106, 20, 'monitor_screen');
    spr_monitorScreen.mask = gfx_monitorMask;
    tween_monitorScroll = game.add.tween(spr_monitorScreen).to({x: 159}, 6000, Phaser.Easing.Linear.Out);
    tween_monitorScroll.repeat();

    txt_monitorTitle = game.add.text(130, 34, 'ABSCESS', { fontSize: '16px', fill: '#00FFCC', align: 'center' });
    txt_monitorTitle.anchor.setTo(0.5, 0.5);
    txt_monitorStepsRemaining = game.add.text(26, 116, 'STEPS REMAINING:', { fontSize: '12px', fill: '#00FFCC' });
    txt_score = game.add.text(192, 116, "00/00", { fontSize: '12px', fill: '#00FFCC' });

    vial_red = game.add.button(45, 224, 'vial_red', pickedColor, this);
    vial_red.anchor.setTo(0.5, 0.5);
    vial_orange = game.add.button(73, 224, 'vial_orange', pickedColor, this);
    vial_orange.anchor.setTo(0.5, 0.5);
    vial_yellow = game.add.button(101, 224, 'vial_yellow', pickedColor, this);
    vial_yellow.anchor.setTo(0.5, 0.5);
    vial_green = game.add.button(129, 224, 'vial_green', pickedColor, this);
    vial_green.anchor.setTo(0.5, 0.5);
    vial_teal = game.add.button(157, 224, 'vial_teal', pickedColor, this);
    vial_teal.anchor.setTo(0.5, 0.5);
    vial_blue = game.add.button(185, 224, 'vial_blue', pickedColor, this);
    vial_blue.anchor.setTo(0.5, 0.5);
    vial_purple = game.add.button(213, 224, 'vial_purple', pickedColor, this);
    vial_purple.anchor.setTo(0.5, 0.5);

    tween_vialRedGrow = game.add.tween(vial_red.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.Out);
    tween_vialRedShrink = game.add.tween(vial_red.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.Out);
    tween_vialOrangeGrow = game.add.tween(vial_orange.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.Out);
    tween_vialOrangeShrink = game.add.tween(vial_orange.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.Out);
    tween_vialYellowGrow = game.add.tween(vial_yellow.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.Out);
    tween_vialYellowShrink = game.add.tween(vial_yellow.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.Out);
    tween_vialGreenGrow = game.add.tween(vial_green.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.Out);
    tween_vialGreenShrink = game.add.tween(vial_green.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.Out);
    tween_vialTealGrow = game.add.tween(vial_teal.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.Out);
    tween_vialTealShrink = game.add.tween(vial_teal.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.Out);
    tween_vialBlueGrow = game.add.tween(vial_blue.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.Out);
    tween_vialBlueShrink = game.add.tween(vial_blue.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.Out);
    tween_vialPurpleGrow = game.add.tween(vial_purple.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.Out);
    tween_vialPurpleShrink = game.add.tween(vial_purple.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.Out);

    btn_new = game.add.button(61, 317, 'btn_new', clickedNew, this, 1, 0, 2);
    btn_new.anchor.setTo(0.5, 0.5);
    btn_reset = game.add.button(193, 317, 'btn_reset', clickedReset, this, 1, 0, 2);
    btn_reset.anchor.setTo(0.5, 0.5);

    game.add.sprite(254, 4, 'whitebloodcells');

    var bmd_blackBorder = game.add.bitmapData(340, 340);
    bmd_blackBorder.rect(0, 0, 340, 340);
    bmd_blackBorder.clear(2, 2, 336, 336);
    game.add.sprite(254, 4, bmd_blackBorder);

    group_cells = game.add.group();
    group_cells.x = 256;
    group_cells.y = 6;

    group_menu = game.add.group();
    group_menuSubgroup = game.add.group();
    group_menuCredits = game.add.group();

    var bmd_menuBG = game.add.bitmapData(600, 350);
    bmd_menuBG.rect(0, 0, 600, 350);
    var spr_menuBG = game.add.sprite(0, 0, bmd_menuBG);
    spr_menuBG.alpha = 0.5;

    var spr_menuMonitor = game.add.sprite(300, 175, 'menu');
    spr_menuMonitor.anchor.setTo(0.5, 0.5);

    txt_title = game.add.text(300, 83, 'ABSCESS', { fontSize: '24px', fill: '#00FFCC', align: 'center' });
    txt_title.anchor.setTo(0.5, 0.5);

    var bmd_menuUnderline = game.add.bitmapData(140, 2);
    bmd_menuUnderline.rect(0, 0, 140, 2);
    var clr_menuUnderline = Phaser.Color.hexToRGB("#00FFCC");
    bmd_menuUnderline.fill(Phaser.Color.getRed(clr_menuUnderline), Phaser.Color.getGreen(clr_menuUnderline), Phaser.Color.getBlue(clr_menuUnderline), 1);
    var spr_menuUnderline = game.add.sprite(230, 94, bmd_menuUnderline);

    txt_win = game.add.text(300, 133, "Choose Difficulty", { fontSize: '32px', fill: '#FF6600', align: 'center' });
    txt_win.anchor.setTo(0.5, 0.5);
    txt_stepsRemaining = game.add.text(300, 168, "0 steps left!", { fontSize: '16px', fill: '#00FFCC', align: 'center' });
    txt_stepsRemaining.anchor.setTo(0.5, 0.5);
    txt_playAgain = game.add.text(300, 198, 'New game?', { fontSize: '16px', fill: '#00FFCC', align: 'center' });
    txt_playAgain.anchor.setTo(0.5, 0.5);

    btn_help = game.add.button(425, 85, 'btn_help', clickedHelp, this, 1, 0, 2);
    btn_help.anchor.setTo(0.5, 0.5);
    btn_easy = game.add.button(195, 238, 'btn_easy', clickedEasy, this, 1, 0, 2);
    btn_easy.anchor.setTo(0.5, 0.5);
    btn_medium = game.add.button(295, 238, 'btn_medium', clickedMedium, this, 1, 0, 2);
    btn_medium.anchor.setTo(0.5, 0.5);
    btn_hard = game.add.button(395, 238, 'btn_hard', clickedHard, this, 1, 0, 2);
    btn_hard.anchor.setTo(0.5, 0.5);

    var txt_creditsTitle = game.add.text(300, 83, "ABSCESS", { fontSize: '24px', fill: '#00FFCC', align: 'center' });
    txt_creditsTitle.anchor.setTo(0.5, 0.5);

    var bmd_creditsUnderline = game.add.bitmapData(140, 2);
    bmd_creditsUnderline.rect(0, 0, 140, 2);
    var clr_creditsUnderline = Phaser.Color.hexToRGB("#00FFCC");
    bmd_creditsUnderline.fill(Phaser.Color.getRed(clr_creditsUnderline), Phaser.Color.getGreen(clr_creditsUnderline), Phaser.Color.getBlue(clr_creditsUnderline), 1);
    var spr_creditsUnderline = game.add.sprite(230, 94, bmd_creditsUnderline);

    var txt_credits = game.add.text(300, 144, "Abscess is (C)\n2011 by Owen\nMcNamara", { fontSize: '16px', fill: '#00FFCC', align: 'center' });
    txt_credits.anchor.setTo(0.5, 0.5);

    var btn_creditsLink = new LabelButton(this.game, 300, 198, "", "http://www.owencm.com", function() {
        window.open("http://www.owencm.com", "_blank");
    }, this);
    btn_creditsLink.setStyle({
        'font': '14px Arial',
        'fill': '#006CFF'
    });

    btn_close = game.add.button(295, 238, 'btn_close', clickedClose, this, 1, 0, 2);
    btn_close.anchor.setTo(0.5, 0.5);

    group_menu.add(spr_menuBG);
    group_menu.add(spr_menuMonitor);
    group_menuSubgroup.add(txt_title);
    group_menuSubgroup.add(spr_menuUnderline);
    group_menuSubgroup.add(txt_win);
    group_menuSubgroup.add(txt_stepsRemaining);
    group_menuSubgroup.add(txt_playAgain);
    group_menuSubgroup.add(btn_easy);
    group_menuSubgroup.add(btn_help);
    group_menuSubgroup.add(btn_medium);
    group_menuSubgroup.add(btn_hard);
    group_menuCredits.add(txt_creditsTitle);
    group_menuCredits.add(spr_creditsUnderline);
    group_menuCredits.add(txt_credits);
    //group_menuCredits.add(txt_creditsLink);
    group_menuCredits.add(btn_creditsLink);
    group_menuCredits.add(btn_close);
    group_menuCredits.visible = false;
    group_menu.add(group_menuSubgroup);
    group_menu.add(group_menuCredits);

    toggleMenu(false);
    toggleMenu(true);
}

function update()
{
    //monitor animation?
    tween_monitorScroll.start();

    if(vial_red.input.pointerOver())
    {
        tween_vialRedGrow.start();
    }
    if(vial_red.input.pointerOut())
    {
        tween_vialRedShrink.start();
    }

    if(vial_orange.input.pointerOver())
    {
        tween_vialOrangeGrow.start();
    }
    if(vial_orange.input.pointerOut())
    {
        tween_vialOrangeShrink.start();
    }

    if(vial_yellow.input.pointerOver())
    {
        tween_vialYellowGrow.start();
    }
    if(vial_yellow.input.pointerOut())
    {
        tween_vialYellowShrink.start();
    }

    if(vial_green.input.pointerOver())
    {
        tween_vialGreenGrow.start();
    }
    if(vial_green.input.pointerOut())
    {
        tween_vialGreenShrink.start();
    }

    if(vial_teal.input.pointerOver())
    {
        tween_vialTealGrow.start();
    }
    if(vial_teal.input.pointerOut())
    {
        tween_vialTealShrink.start();
    }

    if(vial_blue.input.pointerOver())
    {
        tween_vialBlueGrow.start();
    }
    if(vial_blue.input.pointerOut())
    {
        tween_vialBlueShrink.start();
    }

    if(vial_purple.input.pointerOver())
    {
        tween_vialPurpleGrow.start();
    }
    if(vial_purple.input.pointerOut())
    {
        tween_vialPurpleShrink.start();
    }
}

function clickedHelp()
{
    group_menuSubgroup.visible = false;
    group_menuCredits.visible = true;
}

function clickedClose()
{
    group_menuSubgroup.visible = true;
    group_menuCredits.visible = false;
}

function clickedEasy()
{
    gameSize = "easy";
    txt_win.setText("");
    toggleMenu(false);
    setupGame();
}

function clickedMedium()
{
    gameSize = "medium";
    txt_win.setText("");
    toggleMenu(false);
    setupGame();
}

function clickedHard()
{
    gameSize = "hard";
    txt_win.setText("");
    toggleMenu(false);
    setupGame();
}

function clickedNew()
{
    if(ingame)
    {
        toggleMenu(true);
        ingame = false;
    }
}

function clickedReset()
{
    if(ingame)
    {
        setupGame();
    }
}

function pickedColor(vial)
{
    if(ingame && numStepsRemaining > 0)
    {
        currentColor = vial.key.toString().substr(5, vial.key.toString().length-1);
        numStepsRemaining--;
        txt_score.setText(numStepsRemaining+"/"+totalSteps);
        recursiveRemoveCells(0, 0);
        uncheckCells();
        checkForEnd();
    }
}

function toggleMenu(show)
{
    group_menu.visible = show;
    toggleButtonInput(btn_new, !show);
    toggleButtonInput(btn_reset, !show);
    toggleButtonInput(vial_red, !show);
    toggleButtonInput(vial_orange, !show);
    toggleButtonInput(vial_yellow, !show);
    toggleButtonInput(vial_green, !show);
    toggleButtonInput(vial_teal, !show);
    toggleButtonInput(vial_blue, !show);
    toggleButtonInput(vial_purple, !show);

    txt_stepsRemaining.visible = false;
}

function toggleButtonInput(btn, enable)
{
    btn.frame = 0;
    btn.inputEnabled = enable;
    btn.input.useHandCursor = enable;
}

function setupGame()
{
    switch(gameSize){
        case "easy":
            lengthCellSide = 24;
            numPerSide = 14;
            totalSteps = 32;
            break;
        case "medium":
            lengthCellSide = 16;
            numPerSide = 21;
            totalSteps = 50;
            break;
        case "hard":
            lengthCellSide = 12;
            numPerSide = 28;
            totalSteps = 70;
            break;
    }
    
    numStepsRemaining = totalSteps;
    numTilesRemaining = numPerSide * numPerSide;
    txt_score.setText(numStepsRemaining+"/"+totalSteps);
    
    createGrid();
}

function createGrid()
{
    if(group_cells.length > 0)
    {
        group_cells.removeAll(true);
    }

    cellsArray = {};

    for(var c = 0; c < numPerSide; c++)
    {
        for(var r = 0; r < numPerSide; r++)
        {
            var randomColor = Math.round(Math.random() * 6);
            var tile = new Tile(game, c*lengthCellSide, r*lengthCellSide, 'cells'+lengthCellSide, colorsArray[randomColor], randomColor+1, "t_"+c+"_"+r);
            group_cells.add(tile);
            cellArray["t_"+c+"_"+r] = tile;
        }
    }

    ingame = true;
    currentColor = cellArray["t_0_0"].color;
    recursiveRemoveCells(0, 0);
    uncheckCells();
}

function recursiveRemoveCells(OX, OY)
{
    var cellName = 't_'+OX+'_'+OY;
    var thisCell = cellArray[cellName];
    thisCell.checked = true;
    
    if(thisCell.visible && thisCell.color == currentColor)
    {
        thisCell.visible = false;
        numTilesRemaining--;
    }
    
    if(!thisCell.visible)
    {
        //Left
        if(OX > 0)
        {
            if(!cellArray["t_"+(OX-1)+"_"+OY].checked)
            {
                recursiveRemoveCells(OX-1, OY);
            }
        }
        
        //Right
        if(OX < numPerSide-1)
        {
            if(!cellArray["t_"+(OX+1)+"_"+OY].checked)
            {
                recursiveRemoveCells(OX+1, OY);
            }
        }
        
        //Up
        if(OY > 0)
        {
            if(!cellArray["t_"+OX+"_"+(OY-1)].checked)
            {
                recursiveRemoveCells(OX, OY-1);
            }
        }
        
        //Down
        if(OY < numPerSide-1)
        {
            if(!cellArray["t_"+OX+"_"+(OY+1)].checked)
            {
                recursiveRemoveCells(OX, OY+1);
            }
        }
    }
}

function uncheckCells()
{
    group_cells.forEach(function(cell){
        cell.checked = false;
    })
}

function checkForEnd()
{
    if(numTilesRemaining > 0 && numStepsRemaining <= 0)
    {
        //lose
        ingame = false;
        txt_title.setText("GAME OVER");
        txt_win.setText("The patient died!");
        txt_win.setStyle({fontSize: "32px", fill: txt_win.fill});
        txt_stepsRemaining.setText(numStepsRemaining+" steps remaining!");
        toggleMenu(true);
        txt_stepsRemaining.visible = true;
    }else if(numTilesRemaining <= 0 && numStepsRemaining >= 0){
        //win
        ingame = false;
        txt_title.setText("GAME OVER");
        txt_win.setText("The patient is cured!");
        txt_win.setStyle({fontSize: "26px", fill: txt_win.fill});
        txt_stepsRemaining.setText(numStepsRemaining+" steps remaining!");
        toggleMenu(true);
        txt_stepsRemaining.visible = true;
    }
}
