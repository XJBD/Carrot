var GPMenu = ccui.Layout.extend({
    GPMenu:null,
    onEnter:function () {
        this._super();
        cc.director.pause();
        this.loadConfig();
        this.loadMenuBG();
        this.loadLevelLabel();
        this.loadContinueButton();
        this.loadRestartButton();
        this.loadHomeButton();
        this.loadWeiBoButton();
    },
    loadConfig:function () {
        this.setTouchEnabled(true);
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(cc.winSize);
        this.setBackGroundColorOpacity(128);
        this.setBackGroundColor(cc.color(0,0,0));
    },
    loadMenuBG:function () {
        var node = new cc.Sprite("res/GamePlay/UI/adv_menu_bg.png");
        this.addChild(node);
        this.GPMenu = node;
        node.setPosition(cc.winSize.width/2,cc.winSize.height - node.height/2);
    },
    loadLevelLabel:function () {
        var levelStr = GameManager.getLevel()< 10 ? "0"+GameManager.getLevel():GameManager.getLevel()+"";
        var node = new ccui.Text("第"+levelStr+"关","Arial",22);
        this.GPMenu.addChild(node);
        node.setPosition(this.GPMenu.width/2,this.GPMenu.height - 130);
    },
    loadContinueButton:function () {
        var node = new ccui.Button();
        this.GPMenu.addChild(node);
        var texture1 = "res/GamePlay/UI/btn_green_b.png";
        var texture2 = "res/GamePlay/UI/btn_green_b_pressed.png";
        node.loadTextures(texture1,texture2,"");
        node.setPosition(this.GPMenu.width/2,this.GPMenu.height/2+85);

        node.addTouchEventListener(function (sender,type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    var event = new cc.EventCustom(zh.EventName.GP_REMOVE_GPMENU);
                    cc.eventManager.dispatchEvent(event);
                    break;
            }
        }.bind(this));

        var info = new ccui.ImageView("res/GamePlay/UI/CN/adv_menu_continue.png");
        node.addChild(info);
        info.setPosition(node.width/2,node.height/2);
    },
    loadRestartButton:function () {
        var node = new ccui.Button();
        this.GPMenu.addChild(node);
        var texture1 = "res/GamePlay/UI/btn_blue_b.png";
        var texture2 = "res/GamePlay/UI/btn_blue_b_pressed.png";
        node.loadTextures(texture1,texture2,"");
        node.setPosition(this.GPMenu.width/2,this.GPMenu.height/2 -25);

        node.addTouchEventListener(function (sender,type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    cc.audioEngine.stopMusic();
                    var level = GameManager.getLevel()-1;
                    GameManager.loadLevelData(level);
                    var scene = new GamePlayScene();
                    cc.director.runScene(scene);
                    break;
            }
        }.bind(this));

        var info = new ccui.ImageView("res/GamePlay/UI/CN/adv_menu_restart.png");
        node.addChild(info);
        info.setPosition(node.width/2,node.height/2);
    },
    loadHomeButton:function () {
        var node = new ccui.Button();
        this.GPMenu.addChild(node);
        var texture1 = "res/GamePlay/UI/btn_blue_l.png";
        var texture2 = "res/GamePlay/UI/btn_blue_l_pressed.png";
        node.loadTextures(texture1,texture2,"");
        node.setPosition(this.GPMenu.width/2-83,this.GPMenu.height/2-138);

        node.addTouchEventListener(function (sender,type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    cc.audioEngine.stopMusic();
                    var scene = new ChooseLevelScene();
                    cc.director.runScene(scene);
                    break;
            }
        }.bind(this));

        var info = new ccui.ImageView("res/GamePlay/UI/CN/adv_menu_home.png");
        node.addChild(info);
        info.setPosition(node.width/2,node.height/2);
    },
    loadWeiBoButton:function () {
        var node = new ccui.Button();
        this.GPMenu.addChild(node);
        var texture1 = "res/GamePlay/UI/btn_blue_l.png";
        var texture2 = "res/GamePlay/UI/btn_blue_l_pressed.png";
        node.loadTextures(texture1,texture2,"");
        node.setPosition(this.GPMenu.width/2+83,this.GPMenu.height/2-138);

        var info = new ccui.ImageView("res/GamePlay/UI/CN/adv_menu_weibo.png");
        node.addChild(info);
        info.setPosition(node.width/2,node.height/2);
    },
    onExit:function () {
        this._super();
        cc.director.resume();
    }
});
