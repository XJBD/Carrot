var EffectNode = cc.Sprite.extend({
    ctor:function (filename,rect,rotated) {
        this._super(filename,rect,rotated);
        this.loadAction();
    },
    loadAction:function () {
        this.stopAllActions();
        this.setScale(0.35);
        this.setOpacity(255);
        var time = 0.8;

        var delay = cc.delayTime(time*0.8);
        var fadeOut = cc.fadeOut(time*0.7).easing(cc.easeExponentialOut());
        var delayOut = cc.sequence(delay,fadeOut);
        this.runAction(delayOut);

        var callFun = cc.callFunc(this.loadAction.bind(this),this);
        var delayCall = cc.delayTime(1);
        var scaleTo = cc.scaleTo(time,1.35);
        var seq = cc.sequence(scaleTo,delayCall,callFun);
        this.runAction(seq);
    }
});

var RouteButtonEffect = cc.Node.extend({
    effectArray:[],
    ctor:function () {
        this._super();
        this.loadEffectNode();
    },
    loadEffectNode:function () {
        function addEffectNode() {
            node = new EffectNode("res/ChooseLevel/stagemap_local.png");
            this.addChild(node);
            this.effectArray.push(node);
        }
        var node = null;
        for (var i = 0;i<3;i++){
            var delay = cc.delayTime(0.25 * i);
            var callFunc = cc.callFunc(addEffectNode.bind(this),this);
            var seq = cc.sequence(delay,callFunc);
            this.runAction(seq);
        }
    }
});