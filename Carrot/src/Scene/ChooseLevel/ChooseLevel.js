var ChooseLevelScene = cc.Scene.extend({
    backgroundLayer:null,
    chooseUILayer:null,
    ctor:function () {
        this._super();
        if (!cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.playMusic("res/Sound/MainMenu/BGMusic.mp3", true);
        }
    },
    onEnter:function () {
        this._super();
        this.loadResource();
        this.loadBackgroundLayer();
        this.loadChooseUILayer();
    },
    loadResource:function () {
        cc.spriteFrameCache.addSpriteFrames(res.route_plist,res.route_png);
    },
    loadBackgroundLayer:function () {
        this.backgroundLayer = new ChooseBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadChooseUILayer:function () {
        this.chooseUILayer = new ChooseUILayer();
        this.addChild(this.chooseUILayer);
    }
});
