var GPUiLayer = cc.Layer.extend({
    topBar:null,
    goldText:null,
    bottomBar:null,
    groupInfo:null,
    ctor:function () {
        this._super();
    },
    onEnter:function () {
        this._super();
        this.loadTopBar();
        this.loadGoldText();
        this.loadTopButtons();
        this.loadBottomBar();
        this.loadBottomButtons();
        this.loadGroupInfo();
        this.loadMissionBg();
        this.registerEvent();
    },
    registerEvent:function () {
      var onUpdateGroupListener = cc.EventListener.create({
          event:cc.EventListener.CUSTOM,
          target:this,
          eventName:zh.EventName.GP_UPDATE_GROUP,
          callback:this.onUpdateGroup
      });
      cc.eventManager.addListener(onUpdateGroupListener,this);
    },
    onUpdateGroup:function (event) {
        var group = event.getUserData().group;
        var self = event.getCurrentTarget();
        self.groupInfo.setString(group+"");
    },
    loadTopBar:function () {
        var node = new ccui.ImageView("res/GamePlay/UI/top_bg.png");
        this.addChild(node);
        this.topBar = node;
        node.setAnchorPoint(0.5,1);
        node.setPosition(cc.winSize.width/2,cc.winSize.height);

        var centerNode = new ccui.ImageView("res/GamePlay/UI/waves_bg.png");
        node.addChild(centerNode);
        centerNode.setPosition(node.width/2,node.height/2);

        var groupInfo = new ccui.ImageView("res/GamePlay/UI/CN/group_info.png");
        centerNode.addChild(groupInfo);
        groupInfo.setPosition(centerNode.width/2,centerNode.height/2);
    },
    loadGoldText:function () {
        var goldStr = GameManager.getGold()+"";//怀疑+""是为了将object转型为string
        var goldInfo = new ccui.Text(goldStr,"Arial",32);
        this.topBar.addChild(goldInfo);
        this.goldText = goldInfo;
        goldInfo.setAnchorPoint(0,0.5);
        goldInfo.setPosition(100,43);
    },
    loadTopButtons:function () {
        this.loadSpeedButton();
        this.loadPauseButton();
        this.loadMenuButton();
    },
    loadSpeedButton:function () {
        var node = new ccui.CheckBox();
        this.topBar.addChild(node);
        var texture1 = "res/GamePlay/UI/speed_0.png";
        var texture2 = "res/GamePlay/UI/speed_1.png";
        node.loadTextures(texture1,texture1,texture2,texture1,texture2);
        node.setPosition(700,this.topBar.height/2);
        //TODO
    },
    loadPauseButton:function () {
        var node = new ccui.CheckBox();
        this.topBar.addChild(node);
        var texture1 = "res/GamePlay/UI/pause_0.png";
        var texture2 = "res/GamePlay/UI/pause_1.png";
        node.loadTextures(texture1,texture1,texture2,texture1,texture2);
        node.setPosition(800,this.topBar.height/2);
        //TODO
    },
    loadMenuButton:function () {
        var node = new ccui.Button();
        this.topBar.addChild(node);
        var textureM = "res/GamePlay/UI/menu.png";
        node.loadTextures(textureM,textureM,"");
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.2);
        node.setPosition(870,this.topBar.height/2);

        node.addTouchEventListener(function (sender,type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    var event = new cc.EventCustom(zh.EventName.GP_CREATE_GPMENU);
                    cc.eventManager.dispatchEvent(event);
                    break;
            }
        }.bind(this));
    },
    loadBottomBar:function () {
        var node = new ccui.ImageView("res/GamePlay/UI/bottom_bg.png");
        this.addChild(node);
        this.bottomBar = node;
        node.setAnchorPoint(0.5,0);
        node.setPosition(cc.winSize.width/2,0);
    },
    loadBottomButtons : function(){
        var buttonFileName = [
            "bar_bomb_02.png",
            "bar_blood_02.png",
            "bar_speed_02.png",
            "bar_ice_02.png",
            "bar_slow_02.png"
        ];

        var nextPosX = 420;
        var offsetX = 10;
        var button = null;
        for (var i = 0; i < 5; i++) {
            var image = new ccui.ImageView("res/GamePlay/UI/bar_blank.png");
            this.bottomBar.addChild(image);
            image.setAnchorPoint(0.5, 0);
            image.setPosition(nextPosX, 0);

            button = new ccui.Button();
            image.addChild(button);
            button.setName(buttonFileName[i]);
            button.loadTextureNormal("res/GamePlay/UI/" + buttonFileName[i]);
            button.loadTexturePressed("res/GamePlay/UI/" + buttonFileName[i]);
            button.x = image.width / 2;
            button.y = image.height / 2;

            nextPosX += button.width + offsetX;
        }
    },
    loadGroupInfo:function () {
        var groupInfo = new ccui.Text("1","Arial",32);
        this.topBar.addChild(groupInfo);
        this.groupInfo = groupInfo;
        groupInfo.setPosition(this.topBar.width/2-65,this.topBar.height/2+7);

        var maxGroup = GameManager.getMaxGroup()+1+"";
        var maxGroupInfo = new ccui.Text(maxGroup,"Arial",32);
        this.topBar.addChild(maxGroupInfo);
        maxGroupInfo.setPosition(groupInfo.x+60,groupInfo.y);
    },
    loadMissionBg:function () {
        var node = new ccui.ImageView("res/GamePlay/UI/adv_mission_bg.png");
        this.bottomBar.addChild(node);
        node.setPosition(105,25);
    }

});