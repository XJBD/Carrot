var MMBackgroundLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.loadBackground();
    },
    loadBackground : function(){
        var node = new cc.Sprite("res/MainMenu/front_bg.png");
        this.addChild(node);
        node.setPosition(cc.winSize.width/2,cc.winSize.height/2);
    }
});