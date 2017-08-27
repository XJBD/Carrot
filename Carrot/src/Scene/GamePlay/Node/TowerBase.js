var TowerBase = cc.Sprite.extend({
    scope:0,
    bulletSpeed:10,
    bulletMoveTime:0,
    nearestEnemy:null,
    fireTargetPos:cc.p(0,0),
    weapon:null,
    row:-1,
    cel:-1,
    ctor:function (fileName,data) {
        this._super(fileName,data);
        this.loadProperty(data);
        this.loadWeapon();
    },
    loadProperty:function (data) {
        cc.assert(data.scope > 0, "TowerBase.loadProperty() : scope必须大于0！");
        cc.assert(data.bulletSpeed > 0, "TowerBase.loadProperty() : bulletSpeed必须大于0！");
        this.scope = data.scope;
        this.bulletSpeed = data.bulletSpeed;
        this.bulletMoveTime = 100/this.bulletSpeed;
        this.setPosition(data.x,data.y);
        this.setName(data.name);
    },
    findNearestMonster:function () {
        var monsterArray = GameManager.currMonsterPool;
        var currMinDistant = this.scope;
        var nearestEnemy = null;
        var monster = null;
        var distance = 0;
        for (var i = 0;i<monsterArray.length;i++){
            for (var j = 0;j<monsterArray[i].length;j++){
                monster = monsterArray[i][j];
                distance = cc.pDistance(this.getPosition(),monster.getPosition());
                if (distance<currMinDistant){
                    currMinDistant = distance;
                    nearestEnemy = monster;
                }
            }
        }
        this.nearestEnemy = nearestEnemy;
        return nearestEnemy;
    },
    loadWeapon:function () {
        cc.warn("TowerBase.loadWeapon() : 请重写此方法！");
    },
    onFire:function () {
        cc.warn("TowerBase.onFire() : 请重写此方法！");
    }
});
