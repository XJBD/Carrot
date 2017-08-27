var GamePlayScene = cc.Scene.extend({
    backgroundLayer:null,
    mainLayer:null,
    uiLayer:null,
    GPMenu:null,
    ctor:function () {
        this._super();
        cc.audioEngine.playMusic("res/Sound/GamePlay/BGMusic01.mp3",true);
    },
    onEnter:function () {
        this._super();
        this.loadResource();
        this.loadGPBackGroundLayer();
        this.loadGPMainLayer();
        this.loadGPUiLayer();
        this.registerEvent();
    },
    registerEvent:function () {
        //创建菜单
        var onCreateGPMenu = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            target:this,
            eventName:zh.EventName.GP_CREATE_GPMENU,
            callback:this.onCreateGPMenu
        });
        cc.eventManager.addListener(onCreateGPMenu,this);

        //移除菜单
        var onRemoveGPMenu = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            target:this,
            eventName:zh.EventName.GP_REMOVE_GPMENU,
            callback:this.onRemoveGPMenu
        });
        cc.eventManager.addListener(onRemoveGPMenu,this);
    },
    loadResource:function () {
        cc.spriteFrameCache.addSpriteFrames("res/GamePlay/Carrot/Carrot1/hlb1.plist","res/GamePlay/Carrot/Carrot1/hlb1.png");
        cc.spriteFrameCache.addSpriteFrames("res/GamePlay/Tower/Bottle.plist","res/GamePlay/Tower/Bottle.png");
        var themeID = GameManager.getThemeID();
        cc.spriteFrameCache.addSpriteFrames("res/GamePlay/Object/Theme"+themeID+"/Monster/theme_"+themeID+".plist",
            "res/GamePlay/Object/Theme"+themeID+"/Monster/theme_"+themeID+".png");

    },
    loadGPMenu:function () {
        var node = new GPMenu();
        this.addChild(node);
        this.GPMenu = node;
    },
    onCreateGPMenu:function (event) {
        var self = event.getCurrentTarget();
        self.loadGPMenu();
    },
    onRemoveGPMenu:function (event) {
        var self = event.getCurrentTarget();
        self.removeChild(self.GPMenu);
    },
    loadGPBackGroundLayer:function () {
        var node = new GPBackgroundLayer();
        this.addChild(node);
        this.backgroundLayer = node;
    },
    loadGPUiLayer:function () {
        var node = new GPUiLayer();
        this.addChild(node);
        this.uiLayer = node;
    },
    loadGPMainLayer:function () {
        var node = new GPMainLayer();
        this.addChild(node);
        this.mainLayer = node;
    }
});
