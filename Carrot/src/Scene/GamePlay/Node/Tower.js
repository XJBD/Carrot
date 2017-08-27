var Tower = TowerBase.extend({
    ctor:function (data) {
        this._super("#Bottle_3.png",data);
        this.schedule(this.onRotateAndFire,0.5);
    },
    loadWeapon:function () {
        var node = new cc.Sprite("#Bottle31.png");
        this.addChild(node);
        this.weapon = node;
        node.setPosition(this.width/2,this.height/2);
        node.setRotation(90);
    },
    onRotateAndFire:function () {
        var nearestEnemy = this.findNearestMonster();
        if (nearestEnemy != null){
            this.weapon.stopAllActions();
            this.fireTargetPos = nearestEnemy.getPosition();
            var rotateVector = cc.pSub(nearestEnemy.getPosition(),this.getPosition());
            //旋转弧度
            var rotateRadians = cc.pToAngle(rotateVector);
            //旋转角度
            var rotateDegrees = cc.radiansToDegrees(-1 * rotateRadians);
            //旋转速度
            var speed = 0.5/cc.PI;
            //旋转需要的时间
            var rotateDuration = Math.abs(rotateRadians * speed);

            var rotate = cc.rotateTo(rotateDuration,rotateDegrees);
            var callback = cc.callFunc(this.onFire,this);
            var seq = cc.sequence(rotate,callback);
            this.weapon.runAction(seq);
        }
    },
    onFire:function () {
        var currBullet = this.createBullet();
        this.getParent().addChild(currBullet);
        GameManager.currBulletPool.push(currBullet);

        var shootVector = cc.pNormalize(cc.pSub(this.fireTargetPos,this.getPosition()));    //标准化向量
        var normalShootVec = cc.pNeg(shootVector);      //取反
        var farthestDistance = 1.5 * cc.winSize.width;
        var overShootVec = cc.pMult(normalShootVec,farthestDistance);
        var offScreenPoint = cc.pSub(this.weapon.getPosition(),overShootVec);

        var move = cc.moveTo(this.bulletMoveTime,offScreenPoint);
        var callback = cc.callFunc(this.removeBullet,currBullet);
        var seq = cc.sequence(move,callback);
        currBullet.runAction(seq);
    },
    createBullet:function () {
        var node = new cc.Sprite("#PBottle31.png");
        node.setPosition(this.getPosition());
        node.setRotation(this.weapon.getRotation());
        return node;
    },
    removeBullet:function (sender) {
        var event = new cc.EventCustom(zh.EventName.GP_REMOVE_BULLET);
        event.setUserData({
            target:sender
        });
        cc.eventManager.dispatchEvent(event);
    }
});
