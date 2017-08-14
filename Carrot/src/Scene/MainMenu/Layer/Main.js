var MMMainLayer = cc.Layer.extend({
    actionDuration:1,
    positionSettingIconX: 157, //小齿轮图标X轴坐标
    positionSettingIconY: 80,  //
    isUpUnlock:false,          //
    upLock:null,
    ctor:function () {
        this._super();
        //加载配置
        this.loadConfig();
        //加载菜单
        this.loadMenu();
        //加载设置
        this.loadSet();
        //加载帮助
        this.loadHelp();
        //加载左下1、3怪物
        this.loadLeftMonster();
        //加载云朵
        this.loadSmoke();
        //加载中间2、5号怪
        this.loadMidMonster();
        //加载5号怪前面的云
        this.loadSmoke2();
        //加载萝卜
        this.loadCarrot();
        //加载前景
        this.loadBase();
        //注册天天向上解锁监听器
        this.RegisterEvent();

    },
    //加载配置
    loadConfig:function () {
        this.isUpUnlock = cc.sys.localStorage.getItem(config.IS_UP_UNLOCK_KEY) || "no";
        //this.isUpUnlock = "no";
        //cc.log(cc.sys.localStorage.getItem(config.IS_UP_UOLOCK_KEY));
        cc.log(this.isUpUnlock);
    },
    //菜单
    loadMenu:function(){
        //开始冒险
        var startNormal = new cc.Sprite("res/MainMenu/front_btn_start_normal.png");
        var startPressed = new cc.Sprite("res/MainMenu/front_btn_start_pressed.png");
        var startDisabled = new cc.Sprite("res/MainMenu/front_btn_start_normal.png");
        var start = new cc.MenuItemSprite(
            startNormal,
            startPressed,
            startDisabled,
            function(){
                cc.log("开始冒险");
                cc.audioEngine.playEffect("res/Sound/MainMenu/Select.mp3");
                cc.director.runScene(new ChooseLevelScene());
            }.bind(this));
        start.setPosition(cc.winSize.width/2-8,cc.winSize.height/2+75);

        //天天向上
        var floorNormal = new cc.Sprite("res/MainMenu/front_btn_floor_normal.png");
        var floorPressed = new cc.Sprite("res/MainMenu/front_btn_floor_pressed.png");
        var floorDisabled = new cc.Sprite("res/MainMenu/front_btn_floor_normal.png");
        var floor = new cc.MenuItemSprite(
            floorNormal,
            floorPressed,
            floorDisabled,
            function(){
                cc.log("天天向上");
                cc.audioEngine.playEffect("res/Sound/MainMenu/Select.mp3");//1.37 0.874
                if (this.isUpUnlock == "no") {
                    cc.eventManager.dispatchEvent(new cc.EventCustom(zh.EventName.Open_UNLOCK_Layer));
                }
            }.bind(this));
        floor.setPosition(cc.winSize.width/2-8,cc.winSize.height/2-45);

        if (this.isUpUnlock == "no") {
            var lock = new cc.Sprite("res/MainMenu/front_btn_floor_locked.png");
            floor.addChild(lock);
            lock.setPosition(floor.width + 5, floor.height / 2 + 25);
            this.upLock = lock;
        }


        var menu = new cc.Menu(start,floor);
        menu.setPosition(0,0);
        this.addChild(menu);
    },
    //设置
    loadSet:function () {
        var setNormal = new cc.Sprite("res/MainMenu/front_btn_setting_normal.png");
        //var setPressed = new cc.Sprite("res/MainMenu/front_btn_setting_pressed.png");
        //var setDisabled = new cc.Sprite("res/MainMenu/front_btn_setting_normal.png");
        var mon4 = new cc.Sprite("res/MainMenu/front_monster_4.png");
        mon4.setPosition(cc.winSize.width/2-350,490);
        this.addChild(mon4);
        var move1 = cc.moveBy(this.actionDuration,cc.p(0,-10));
        var move2 = cc.moveBy(this.actionDuration,cc.p(0,10));
        var seq = cc.sequence(move1,move2);
        var move = seq.repeatForever();
        mon4.runAction(move);

        setNormal.setPosition(this.positionSettingIconX,this.positionSettingIconY);
        mon4.addChild(setNormal);
    },
    //帮助
    loadHelp:function () {
        var helpBg = new cc.Sprite("res/MainMenu/front_monster_6.png");
        var helpBgMove1 = cc.moveBy(this.actionDuration,cc.p(0,-10));
        var helpBgMove2 = cc.moveBy(this.actionDuration,cc.p(0,10));
        var helpBgSeq = cc.sequence(helpBgMove1,helpBgMove2);
        var helpBgMove = helpBgSeq.repeatForever();
        helpBg.runAction(helpBgMove);
        helpBg.setPosition(cc.winSize.width/2+400,280);
        this.addChild(helpBg);


        var helpHand = new cc.Sprite("res/MainMenu/front_monster_6_hand.png");
        var handMove1 = cc.rotateBy(this.actionDuration,-5);
        var handMove2 = cc.rotateBy(this.actionDuration,5);
        var handSeq = cc.sequence(handMove1,handMove2);
        var handMove = handSeq.repeatForever();
        helpHand.runAction(handMove);
        helpHand.setPosition(cc.winSize.width/2+270,270);
        this.addChild(helpHand);

        var help = new cc.Sprite("res/MainMenu/front_btn_help_normal.png");
        helpHand.addChild(help);
        help.setPosition(155,365);
    },
    //加载左下1、3怪物
    loadLeftMonster:function () {
        var monster1 = new cc.Sprite("res/MainMenu/front_monster_1.png");
        monster1.setPosition(cc.winSize.width/2-300,185);
        this.addChild(monster1);
        var monster1move1 = cc.moveBy(this.actionDuration*0.7,cc.p(-3,0));
        var monster1move2 = cc.moveBy(this.actionDuration*0.7,cc.p(3,0));
        var monster1Seq = cc.sequence(monster1move1,monster1move2);
        var monster1move = cc.repeatForever(monster1Seq);
        monster1.runAction(monster1move);

        var monster3 = new cc.Sprite("res/MainMenu/front_monster_3.png");
        monster3.setPosition(cc.winSize.width/2-360,220);
        this.addChild(monster3);
        var monster3move1 = cc.moveBy(this.actionDuration*0.8,cc.p(0,5));
        var monster3move2 = cc.moveBy(this.actionDuration*0.8,cc.p(0,-5));
        var monster3Seq = cc.sequence(monster3move1,monster3move2);
        var monster3move = cc.repeatForever(monster3Seq);
        monster3.runAction(monster3move);
    },
    //加载云朵
    loadSmoke:function () {
        var leftSmoke = new cc.Sprite("res/MainMenu/front_smoke_1.png");
        leftSmoke.setPosition(cc.winSize.width/2-410,188);
        this.addChild(leftSmoke);

        var rightSmoke = new cc.Sprite("res/MainMenu/front_smoke_3.png");
        rightSmoke.setPosition(cc.winSize.width/2+405,190);
        this.addChild(rightSmoke);
    },
    //加载中间2、5号怪
    loadMidMonster:function () {
        var monster2 = new cc.Sprite("res/MainMenu/front_monster_2.png");
        monster2.setPosition(cc.winSize.width/2-300,150);
        this.addChild(monster2);
        var monster2move1 = cc.moveTo(this.actionDuration*0.2,cc.p(cc.winSize.width/2-220,170));
        var monster2move2 = cc.sequence(monster2move1,cc.callFunc(function () {
            var mon2move1 = cc.moveBy(this.actionDuration*0.55,cc.p(0,-5));
            var mon2move2 = cc.moveBy(this.actionDuration*0.55,cc.p(0,5));
            var mon2seq = cc.sequence(mon2move1,mon2move2);
            var mon2action = cc.repeatForever(mon2seq);
            monster2.runAction(mon2action);
        },this));
        monster2.runAction(monster2move2);

        var monster5 = new cc.Sprite("res/MainMenu/front_monster_5.png");
        monster5.setPosition(cc.winSize.width/2+290,185);
        this.addChild(monster5);
        var monster5move1 = cc.moveBy(this.actionDuration*0.85,cc.p(-3,0));
        var monster5move2 = cc.moveBy(this.actionDuration*0.85,cc.p(3,0));
        var monster5seq = cc.sequence(monster5move1,monster5move2);
        var monster5action = cc.repeatForever(monster5seq);
        monster5.runAction(monster5action);
    },
    //加载5号怪前面的云
    loadSmoke2:function () {
        var midSmoke =  new cc.Sprite("res/MainMenu/front_smoke_2.png");
        midSmoke.setPosition(cc.winSize.width/2+320,150);
        this.addChild(midSmoke);
    },
    //加载萝卜
    loadCarrot:function () {
        var carrot = new cc.Sprite("res/MainMenu/front_carrot.png");
        carrot.setPosition(cc.winSize.width/2+320,120);
        carrot.setScale(0.7);
        this.addChild(carrot);
        var control = [
            cc.p(cc.winSize.width/2+400,100),
            cc.p(cc.winSize.width/2+120,0),
            cc.p(cc.winSize.width/2+100,20)
        ];
        var bezierto = cc.bezierTo(this.actionDuration,control);
        var scaleto = cc.scaleTo(this.actionDuration,1);
        var spawn = cc.spawn(bezierto,scaleto);
        carrot.runAction(spawn);
    },
    //加载前景
    loadBase:function () {
        var base = new cc.Sprite("res/MainMenu/front_front.png");
        base.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(base);
    },
    //注册天天向上事件
    RegisterEvent:function () {
        var listener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            target:this,
            eventName:zh.EventName.Unlock_Up,
            callback:this.onUnlockUp
        });
        cc.eventManager.addListener(listener,this);
    },
    onUnlockUp:function (event) {
        var target = event.getCurrentTarget();
        var data = event.getUserData();
        if (data.isSuccess !== undefined && data.isSuccess){
            cc.sys.localStorage.setItem(config.IS_UP_UNLOCK_KEY,"yes");
            target.isUpUnlock = true;
            target.upLock.removeFromParent();
        }
    }

});
