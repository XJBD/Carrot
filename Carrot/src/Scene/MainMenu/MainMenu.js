var MainMenuScene = cc.Scene.extend({
    backgroundLayer : null,
    mainLayer : null,
    unlockLayer:null,
    ctor:function () {
        this._super();
        //cc.audioEngine.playMusic("res/Sound/MainMenu/BGMusic.mp3",true);
    },
    onEnter:function () {
        this._super();
        this.loadBackgroundLayer();
        this.loadMainLayer();
        this.RigisterEvent();
    },
    loadBackgroundLayer:function () {
        this.backgroundLayer = new MMBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadMainLayer:function () {
        this.mainLayer = new MMMainLayer();
        this.addChild(this.mainLayer);
    },
    RigisterEvent:function () {
        var listener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            target:this,
            eventName:zh.EventName.Open_UNLOCK_Layer,
            callback:this.loadUnLockLayer
        });
        cc.eventManager.addListener(listener,this);
    },
    loadUnLockLayer:function (event) {
        var target = event.getCurrentTarget();
        target.unlockLayer = new UnlockLayer();
        target.addChild(target.unlockLayer);
    }
});