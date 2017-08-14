var EffectNode = cc.Sprite.extend({
    ctor:function () {
        this._super();

    },
    loadAction:function () {
        this.stopAllActions();
        this.setScale(0.35);
        this.setOpacity(255);
        var time = 0.8;
        var delay = cc.delayTime(time*0.8);
        var fadeOut = cc.FadeOut(time*0.7).easing(cc.easeExponentialOut());
        var delayout = cc.sequence(delay,fadeOut);
        this.runAction(delayout);
    }
});