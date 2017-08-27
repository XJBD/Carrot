var GRMainLayer = cc.Layer.extend({
    onEnter:function () {
        this._super();
        this.loadTitle();
        this.loadTitleIcon();
        this.loadAdvance();
        this.loadTipPanel();
        this.loadMenu();
    },
    loadTitle:function () {
        var fileName = GameManager.getIsWin()?"res/GameResult/Win/win_title_whb.png" : "res/GameResult/Lose/lose_title_whb.png";
        var node = new ccui.ImageView(fileName);
        this.addChild(node);
        node.setPosition(cc.winSize.width/2,cc.winSize.height-node.height);
    },
    loadTitleIcon:function () {
        var fileName = GameManager.getIsWin() ? "res/GameResult/Win/cup_gold.png" : "res/GameResult/Lose/lose_rip.png";
        var node = new ccui.ImageView(fileName);
        this.addChild(node);
        node.setPosition(cc.winSize.width/2,cc.winSize.height-node.height/2-30);
    },
    loadAdvance:function () {
        var fileName = GameManager.getIsWin() ? "res/GameResult/Win/win_getstone.png" : "res/GameResult/Lose/lose_adv.png";
        var node = new ccui.ImageView(fileName);
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 60);

        if (GameManager.getIsWin()) {
            var stoneText = new ccui.Text("04","",38);
            node.addChild(stoneText);
            stoneText.setPosition(node.width - 140,node.height/2);
        }else {
            var currGroup = new ccui.Text(GameManager.getGroup()-1,"",38);
            node.addChild(currGroup);
            currGroup.setPosition(node.width/2 - 15,node.height/2);

            var maxGroup = new ccui.Text(GameManager.getMaxGroup(),"",38);
            node.addChild(maxGroup);
            maxGroup.setPosition(node.width/2 + 60,node.height/2);
        }

    },
    loadTipPanel:function () {
        var fileName = GameManager.getIsWin() ? "res/GameResult/Win/winlose_winover.png" : "res/GameResult/Lose/winlose_loseover.png";
        var node = new ccui.ImageView(fileName);
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 10);
        if (GameManager.getIsWin()){
            var mission = null;
            var icon = null;
            var nextPos = 310;
            var iconName = ["micon_b5","micon_b5", "micon_b4"];
            for (var i = 0;i<3;i++){
                mission = new ccui.ImageView("res/GameResult/Win/mission1_" + (i + 1) + ".png");
                this.addChild(mission);
                mission.setPosition(nextPos,240);
                icon = new ccui.ImageView("res/GameResult/Win/" + iconName[i] + ".png");
                this.addChild(icon);
                icon.setPosition(nextPos-120,240);
                nextPos += 300;
            }
        }else {
            var randomIndex = 1+Math.floor(Math.random() * 10);
            var tip = new ccui.ImageView("res/GameResult/Lose/lose_tip_" + randomIndex + ".png");
            node.addChild(tip);
            tip.setPosition(node.width/2,node.height/2-75);
        }

        if (GameManager.getIsWin()){
            var level = new ccui.Text("3","",32);
            node.addChild(level);
            level.setPosition(node.width/2,node.height/2 + 13);
        }
    },
    loadMenu:function () {
        var posY = 90;
        var offsetX = 260;

        var homeBtn = new ccui.Button();
        this.addChild(homeBtn);
        var hTexture1 = "res/GameResult/btn_blue_s.png";
        var hTexture2 = "res/GameResult/btn_blue_s_pressed.png";
        homeBtn.loadTextures(hTexture1,hTexture2,"");
        homeBtn.setPosition(cc.winSize.width/2 - offsetX,posY);

        homeBtn.addTouchEventListener(function (sender,type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    cc.audioEngine.stopMusic();
                    var scene = new ChooseLevelScene();
                    cc.director.runScene(scene);
                    break;
            }
        }.bind(this));
        var homeInfo = new ccui.ImageView("res/GameResult/GameOver/winlose_home.png");
        homeBtn.addChild(homeInfo);
        homeInfo.setPosition(homeBtn.width/2,homeBtn.height/2);

        var playBtn = new ccui.Button();
        this.addChild(playBtn);
        var pTexture1 = "res/GameResult/btn_green_b.png";
        var pTexture2 = "res/GameResult/btn_green_b_pressed.png";
        playBtn.loadTextures(pTexture1,pTexture2,"");
        playBtn.setPosition(cc.winSize.width / 2 , posY);

        playBtn.addTouchEventListener(function (sender,type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    var level = 0;
                    if (GameManager.getIsWin()){
                        level = GameManager.getLevel();
                    }else {
                        level = GameManager.getLevel()-1;
                    }
                    GameManager.loadLevelData(level);
                    var scene = new GamePlayScene();
                    cc.director.runScene(scene);
                    break;
            }
        }.bind(this));
        var playInfo = null;
        if (GameManager.getIsWin()){
            playInfo = new ccui.ImageView("res/GameResult/Win/win_continue.png");
        }else {
            playInfo = new ccui.ImageView("res/GameResult/Lose/lose_retry.png");
        }
        playBtn.addChild(playInfo);
        playInfo.setPosition(playBtn.width/2,playBtn.height/2);

        var weiboBtn = new ccui.Button();
        this.addChild(weiboBtn);
        var wTexture1 = "res/GameResult/btn_blue_s.png";
        var wTexture2 = "res/GameResult/btn_blue_s_pressed.png";
        weiboBtn.loadTextures(wTexture1,wTexture2,"");
        weiboBtn.setPosition(cc.winSize.width/2 + offsetX,posY);

        weiboBtn.addTouchEventListener(function (sender,type) {
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    //
                    break;
            }
        }.bind(this));
        var weiboInfo = new ccui.ImageView("res/GameResult/GameOver/win_weibo.png");
        weiboBtn.addChild(weiboInfo);
        weiboInfo.setPosition(weiboBtn.width/2,weiboBtn.height/2);
    }
});
