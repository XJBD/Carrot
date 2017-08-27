var Monster = cc.Sprite.extend({
    road:[],
    data:{},
    speed:0,
    index:0,
    roadIndex:0,
    fileNamePrefix:"",
    ctor:function (fileName,data,fileNamePrefix) {
        this._super(fileName);
        this.loadProperty(data,fileNamePrefix);
    },
    loadProperty:function (data,fileNamePrefix) {
        cc.assert(data.speed,"Monster.loadProperty():速度不能为空！");
        cc.assert(data.road, "Monster.loadProperty(): 移动路径不能为空！");
        cc.assert(data.index >= 0, "Monster.loadProperty(): 索引不能为空！");
        cc.assert(fileNamePrefix, "Monster.loadProperty(): 文件名前缀不能为空！");

        this.data = data;
        this.speed = data.speed;
        this.road = data.road;
        this.index = data.index;
        this.fileNamePrefix = fileNamePrefix;
    },
    runNextRoad:function () {
        if (this.road[this.roadIndex].x <= this.road[this.roadIndex + 1].x) {
            this.setFlippedX(false);
        }else {
            this.setFlippedX(true);
        }

        var distance = cc.pDistance(this.road[this.roadIndex],this.road[this.roadIndex+1]);
        var time = distance/this.speed;
        var moveTo = cc.moveTo(time,this.road[this.roadIndex+1]);
        var callback = cc.callFunc(function () {
            if (this.roadIndex < this.road.length - 1){
                this.runNextRoad();
            }else {
                var event = new cc.EventCustom(zh.EventName.GP_MONSTER_EAT_CARROT);
                event.setUserData({
                    target:this
                });
                cc.eventManager.dispatchEvent(event);
            }
        }.bind(this));
        var seq = cc.sequence(moveTo,callback);
        this.runAction(seq);
        this.roadIndex++;
    },
    playRunAction:function () {
        var frames = [];
        for (var i = 1; i<4; i++){
            var str = this.fileNamePrefix + i+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }
        var animation = new cc.Animation(frames,0.15);
        animation.setRestoreOriginalFrame(true);
        var animate = new cc.animate(animation);
        this.runAction(animate.repeatForever());
    },
    run:function () {
        this.runNextRoad();
        this.playRunAction();
    }
});