var GameResultScene = cc.Scene.extend({
    backgroundLayer:null,
    mainLayer:null,
    onEnter:function () {
        this._super();
        this.loadBackgroundLayer();
        this.loadMainLayer();
    },
    loadBackgroundLayer:function () {
        var node = new GRBackgroundLayer();
        this.addChild(node);
        this.backgroundLayer = node;
    },
    loadMainLayer:function () {
        var node = new GRMainLayer();
        this.addChild(node);
        this.mainLayer = node;
    }
});

//检查玩法的ctor和onenter！！！！！