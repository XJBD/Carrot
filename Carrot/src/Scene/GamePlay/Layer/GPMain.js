var GPMainLayer = cc.Layer.extend({
    tiledMap:null,
    tiledSize:null,
    roadPointArray:[],
    ZOrderEnum:{},

    carrot:null,
    carrotHpBg:null,
    carrotHpText:null,

    tiledMapRectArray:[],
    tiledMapRectArrayMap:[],
    tiledMapRectMapEnum:{},
    touchWaringNode:null,
    towerPanel:null,

    currGroupCreatedMonsterCount:0,
    currGroupCreatedMonsterSum:0,
    onEnter:function () {
        this._super();
        this.scheduleUpdate();
        this.registerEvent();
        this.loadProperty();
        this.loadPath();
        this.loadTileMap();
        this.loadRoadPointArray();
        this.loadStartAndEnd();
        this.loadCarrotHp();
        this.loadNextGroupMonster();
        this.loadTileRect();
        this.loadTiledMapRectArrayMap();
        this.loadObstacles();
        this.loadRoadMap();
    },
    registerEvent:function () {
        var onMonsterEatCarrotListener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            target:this,
            eventName:zh.EventName.GP_MONSTER_EAT_CARROT,
            callback:this.onMonsterEatCarrot
        });
        cc.eventManager.addListener(onMonsterEatCarrotListener,this);

        var onUpdateCarrotBloodListener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            target:this,
            eventName:zh.EventName.GP_UPDATE_CARROT_BLOOD,
            callback:this.onUpdateCarrotBlood
        });
        cc.eventManager.addListener(onUpdateCarrotBloodListener,this);

        var onTouchEventListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            target:this,
            swallowTouches:true,
            onTouchBegan:this.onTouchBegan,
            onTouchMoved:this.onTouchMoved,
            onTouchEnded:this.onTouchEnded
        });
        cc.eventManager.addListener(onTouchEventListener,this);

        var onCreateTowerListener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            target:this,
            eventName:zh.EventName.GP_CREATE_TOWER,
            callback:this.onCreateTower
        });
        cc.eventManager.addListener(onCreateTowerListener,this);

        var onRemoveBulletListener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            target:this,
            eventName:zh.EventName.GP_REMOVE_BULLET,
            callback:this.onRemoveBullet
        });
        cc.eventManager.addListener(onRemoveBulletListener,this);

        var onGameOverListener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            target:this,
            eventName:zh.EventName.GP_GAME_OVER,
            callback:this.onGameOver
        });
        cc.eventManager.addListener(onGameOverListener,this);
    },
    loadProperty:function () {
        this.ZOrderEnum.Monster = 20;
        this.ZOrderEnum.Start = 10;
        this.ZOrderEnum.Carrot = 0;
        this.ZOrderEnum.Waring = 30;
        this.ZOrderEnum.TowerPanel = 50;

        this.tiledMapRectMapEnum.None = 0;
        this.tiledMapRectMapEnum.Road = 1;
        this.tiledMapRectMapEnum.Small = 2;
        this.tiledMapRectMapEnum.Little = 3;
        this.tiledMapRectMapEnum.Big = 4;
        this.tiledMapRectMapEnum.Invalid = 5;
        this.tiledMapRectMapEnum.Tower = 6;
    },
    loadPath:function () {
        var themeID = GameManager.getThemeID();
        var level = GameManager.getLevel();
        var node = new cc.Sprite("res/GamePlay/Theme/Theme"+themeID+"/BG"+level+"/Path"+level+".png");
        this.addChild(node);
        node.setPosition(cc.winSize.width/2,cc.winSize.height/2);
    },
    loadTileMap:function () {
        var themeID = GameManager.getThemeID();
        var level = GameManager.getLevel();
        var node = new cc.TMXTiledMap("res/GamePlay/Theme/Theme"+themeID+"/BG"+level+"/Level"+level+".tmx");
        this.addChild(node);
        this.tiledMap = node;
        this.tiledSize = node.getTileSize();
        node.x = (cc.winSize.width - node.width)/2;
        node.y = (cc.winSize.height - node.height)/2;
        node.setVisible(false);

        var groups = this.tiledMap.getObjectGroups();
        var group = null;
        var offsetX = (cc.winSize.width - this.tiledMap.width)/2;
        var offsetY = (cc.winSize.height - this.tiledMap.height)/2;
        var finalOffsetX = 0;
        var finalOffsetY = 0;
        var groupName = "";

        for (var i = 0; i < groups.length; i++) {
            group = groups[i];
            groupName = group.getGroupName();

            // 大障碍物[占4格]
            if (groupName == "big") {
                finalOffsetX = offsetX;
                finalOffsetY = offsetY;
            }
            // 中等障碍物[占用左右2格]
            else if (groupName == "little"){
                finalOffsetX = offsetX;
                finalOffsetY = offsetY + this.tiledSize.height / 2;
            }else if (groupName == "small"
                || groupName == "road"
                || groupName == "start_end"
                || groupName == "invalid") {
                finalOffsetX = offsetX + this.tiledSize.width / 2;
                finalOffsetY = offsetY + this.tiledSize.height / 2;
            }else{
                cc.warn("GPMainLayer.loadTiledMap(): " + groupName + "对象组的坐标未调整");
            }

            group.setPositionOffset(cc.p(finalOffsetX, finalOffsetY));
        }
    },
    loadRoadPointArray:function () {
        this.roadPointArray = [];
        var roadGroup = this.tiledMap.getObjectGroup("road");
        var roads = roadGroup.getObjects();
        for (var i = 0; i<roads.length; i++) {
            this.roadPointArray.push(cc.p(roads[i].x+roadGroup.getPositionOffset().x,roads[i].y+roadGroup.getPositionOffset().y));
        }
    },
    loadNextGroupMonster:function () {
        if (GameManager.getGroup() > GameManager.getMaxGroup()) {
            cc.log("GPMainLayer.loadNextGroupMonster():怪物添加完毕");
            return;
        }
        GameManager.currMonsterDataPool = GameManager.popNextMonsterGroupData();
        GameManager.currMonsterPool[GameManager.getGroup() - 1] = [];
        this.currGroupCreatedMonsterCount = 0;
        this.currGroupCreatedMonsterSum = GameManager.getCurrGroupMonsterSum();

        var groupDelay = cc.delayTime(GameManager.getGroupInterval());
        var enemyDelay = cc.delayTime(GameManager.getEnemyInterval());
        var callback = cc.callFunc(this.createMonster.bind(this));
        var createMonsterAction = cc.sequence(enemyDelay,callback).repeat(this.currGroupCreatedMonsterSum);
        var finalAction = cc.sequence(groupDelay,createMonsterAction);
        this.runAction(finalAction);
    },
    createMonster:function () {
        var data = GameManager.currMonsterDataPool[0];
        this.currGroupCreatedMonsterCount++;
        var monsterData = {
            road:this.roadPointArray,
            speed:data.speed,
            index:data.index
        };
        var namePrefix = data.name.substring(0,data.name.length - 1);//提取name前俩字符留用
        var fileNamePrefix = "Theme" + GameManager.getThemeID()+"/Monster/"+namePrefix;
        var fileName = "#"+fileNamePrefix+"1.png";
        var node = new Monster(fileName,monsterData,fileNamePrefix);
        this.addChild(node,this.ZOrderEnum.Monster);
        GameManager.currMonsterPool[GameManager.getGroup() -1].push(node);
        node.setPosition(this.roadPointArray[0]);
        node.run();
        GameManager.currMonsterDataPool.splice(0,1);
    },
    loadStartAndEnd:function () {
        this.loadStartFlag();
        this.loadEndFlag();
    },
    loadStartFlag:function () {
        var themeID = GameManager.getThemeID();
        var fileName = "res/GamePlay/Object/Theme"+themeID+"/Object/start01.png";
        var node = new cc.Sprite(fileName);
        this.addChild(node,this.ZOrderEnum.Start);
        var group = this.tiledMap.getObjectGroup("start_end");
        var obj = group.getObjects()[0];
        node.x = obj.x + group.getPositionOffset().x;
        node.y = obj.y + group.getPositionOffset().y + this.tiledSize.height/2+20;
    },
    loadEndFlag:function () {
        //var node = new cc.Sprite("res/GamePlay/Carrot/Carrot1/hlb1_10.png");
        var node = new cc.Sprite("#hlb1_10.png");
        this.addChild(node,this.ZOrderEnum.Carrot);
        this.carrot = node;
        var group = this.tiledMap.getObjectGroup("start_end");
        var obj = group.getObjects()[1];
        node.x = obj.x + group.getPositionOffset().x;
        node.y = obj.y + group.getPositionOffset().y + this.tiledSize.height/2+20;
    },
    loadCarrotHp:function () {
        this.loadBloodBg();
        this.loadBlood();
    },
    loadBloodBg:function () {
        var node = new cc.Sprite("res/GamePlay/carrot_hp_bg.png");
        this.addChild(node,-1);
        this.carrotHpBg = node;
        node.setPosition(this.carrot.x + 75,this.carrot.y - 50);
    },
    loadBlood:function () {
        var node = new ccui.TextAtlas("10","res/GamePlay/Font/num_blood.png",16,22,'0');
        this.carrotHpBg.addChild(node);
        this.carrotHpText = node;
        node.setPosition(this.carrotHpBg.width/2 -15,this.carrotHpBg.height/2-3);
    },
    onMonsterEatCarrot:function (event) {
        var self = event.getCurrentTarget();
        GameManager.subtractCarrotBlood();
        var monster = event.getUserData().target;
        self.removeMonster(monster);
        if (self.isNeedLoadNextGroup()) {
            self.loadNextGroupMonster();
        }
    },
    onUpdateCarrotBlood:function (event) {
        var self = event.getCurrentTarget();
        var blood = event.getUserData().blood;
        self.carrotHpText.setString(blood+"");
    },
    removeMonster:function (obj) {
        var monster = null;
        for (var i = 0;i<GameManager.currMonsterPool.length;i++) {
            for (var j = 0;j<GameManager.currMonsterPool[i].length;j++) {
                monster = GameManager.currMonsterPool[i][j];
                if (monster == obj) {
                    this.removeMonsterByIndex(i,j);
                }
            }
        }
    },
    removeMonsterByIndex:function (i,j) {
        this.removeChild(GameManager.currMonsterPool[i][j]);
        GameManager.currMonsterPool[i].splice(j,1);
    },
    isNeedLoadNextGroup:function () {
        var isNeed = false;
        if (GameManager.currMonsterPool[GameManager.group - 1].length == 0 &&
            this.currGroupCreatedMonsterCount == this.currGroupCreatedMonsterSum) {
            isNeed = true;
        }
        return isNeed;
    },
    loadTileRect:function () {
        var mapSize = this.tiledMap.getMapSize();
        var nextPosX = (cc.winSize.width - this.tiledMap.width)/2 + this.tiledSize.width/2;
        var nextPosY = (cc.winSize.height - this.tiledMap.height)/2 + this.tiledSize.height/2;
        for (var i = 0;i<mapSize.height;i++) {
            this.tiledMapRectArray[i] = [];
            for (var j = 0;j<mapSize.width;j++){
                this.tiledMapRectArray[i][j] = cc.rect(
                    nextPosX - this.tiledSize.width/2,
                    nextPosY - this.tiledSize.height/2,
                    this.tiledSize.width,
                    this.tiledSize.height
                );
                //var node = new cc.Sprite();
                //this.addChild(node,100);
                //node.setTextureRect(cc.rect(0,0,this.tiledSize.width -3,this.tiledSize.height -3));
                //node.setPosition(nextPosX,nextPosY);
                //node.setColor(cc.color(255,0,255));
                //node.setOpacity(100);
                nextPosX += this.tiledSize.width;
            }
            nextPosX = (cc.winSize.width - this.tiledMap.width)/2 + this.tiledSize.width/2;
            nextPosY += this.tiledSize.height;
        }
    },
    loadTiledMapRectArrayMap:function () {
        var mapSize = this.tiledMap.getMapSize();
        for (var i = 0;i<mapSize.height;i++){
            this.tiledMapRectArrayMap[i] = [];
            for (var j = 0;j<mapSize.width;j++){
                this.tiledMapRectArrayMap[i][j] = this.tiledMapRectMapEnum.None;
            }
        }
    },
    getInfoFromMapByPos:function (x,y) {
        cc.assert(y !==undefined,"GPMainLayer.getInfoFromMapByPos():Y坐标不能为空！");
        var isInMap = false;
        var index = {x:-1,y:-1};
        var rect = null;
        for (var i = 0;i<this.tiledMapRectArray.length;i++){
            for (var j = 0;j<this.tiledMapRectArray[i].length;j++){
                rect = this.tiledMapRectArray[i][j];
                if (cc.rectContainsPoint(rect,cc.p(x,y))){
                    index.row = i;
                    index.cel = j;
                    index.x = rect.x;
                    index.y = rect.y;
                    isInMap = true;
                }
            }
        }
        return {
            isInMap:isInMap,
            row:index.row,
            cel:index.cel,
            x:index.x,
            y:index.y
        };
    },
    loadObstacles:function () {
        this.loadSmallObstacle();
        this.loadLittleObstacle();
        this.loadBigObstacle();
        this.loadInvalidRect();
    },
    loadSmallObstacle:function () {
        var smallGroup = this.tiledMap.getObjectGroup("small");
        var smalls = smallGroup.getObjects();
        var node = null;
        var info = null;
        var themeID = GameManager.getThemeID();
        for (var i = 0;i<smalls.length;i++){
            node = new cc.Sprite("res/GamePlay/Object/Theme"+themeID+"/Object/"+smalls[i].name+".png");
            this.addChild(node);
            node.x = smalls[i].x + smallGroup.getPositionOffset().x;
            node.y = smalls[i].y + smallGroup.getPositionOffset().y;
            info = this.getInfoFromMapByPos(node.x,node.y);
            this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnum.Small;
        }
    },
    loadBigObstacle:function () {
        var bigGroup = this.tiledMap.getObjectGroup("big");
        var bigs = bigGroup.getObjects();
        var node = null;
        var info = null;
        var themeID = GameManager.getThemeID();
        for (var i = 0;i<bigs.length;i++){
            node = new cc.Sprite("res/GamePlay/Object/Theme"+themeID+"/Object/"+bigs[i].name+".png");
            this.addChild(node);
            node.x = bigs[i].x + bigGroup.getPositionOffset().x;
            node.y = bigs[i].y + bigGroup.getPositionOffset().y;
            info = this.getInfoFromMapByPos(node.x,node.y);
            this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnum.Big;
            this.tiledMapRectArrayMap[info.row][info.cel - 1] = this.tiledMapRectMapEnum.Big;
            this.tiledMapRectArrayMap[info.row - 1][info.cel] = this.tiledMapRectMapEnum.Big;
            this.tiledMapRectArrayMap[info.row - 1][info.cel - 1] = this.tiledMapRectMapEnum.Big;
        }
    },
    loadLittleObstacle:function () {
        var littleGroup = this.tiledMap.getObjectGroup("little");
        var littles = littleGroup.getObjects();
        var node = null;
        var info = null;
        var themeID = GameManager.getThemeID();
        for (var i = 0;i<littles.length;i++){
            node = new cc.Sprite("res/GamePlay/Object/Theme"+themeID+"/Object/"+littles[i].name+".png");
            this.addChild(node);
            node.x = littles[i].x + littleGroup.getPositionOffset().x;
            node.y = littles[i].y + littleGroup.getPositionOffset().y;
            info = this.getInfoFromMapByPos(node.x,node.y);
            this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnum.Little;
            this.tiledMapRectArrayMap[info.row][info.cel - 1] = this.tiledMapRectMapEnum.Little;
        }
    },
    loadInvalidRect:function () {
        var invalidGroup = this.tiledMap.getObjectGroup("invalid");
        var invalids = invalidGroup.getObjects();
        var node = null;
        var info = null;
        for (var i = 0;i<invalids.length;i++){
            node = invalids[i];
            node.x = invalids[i].x + invalidGroup.getPositionOffset().x;
            node.y = invalids[i].y + invalidGroup.getPositionOffset().y;
            info = this.getInfoFromMapByPos(node.x,node.y);
            this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnum.Invalid;
        }
    },
    loadRoadMap:function () {
        var roadGroup = this.tiledMap.getObjectGroup("road");
        var roads = roadGroup.getObjects();
        var currPoint = null;
        var nextPoint = null;
        var offsetCount = 0;
        var info = null;
        var j;
        for (var i = 0;i<roads.length - 1;i++){
            currPoint = cc.p(roads[i].x+roadGroup.getPositionOffset().x,roads[i].y+roadGroup.getPositionOffset().y);
            nextPoint = cc.p(roads[i+1].x+roadGroup.getPositionOffset().x,roads[i+1].y+roadGroup.getPositionOffset().y);
            info = this.getInfoFromMapByPos(currPoint.x,currPoint.y);

            if (currPoint == nextPoint){
                offsetCount = Math.abs(nextPoint.x - currPoint.x)/this.tiledSize.width+1;
                if (currPoint.x > nextPoint.x){
                    for (j = 0;j<offsetCount;j++){
                        this.tiledMapRectArrayMap[info.row][info.cel - j] = this.tiledMapRectMapEnum.Road;
                    }
                }else {
                    for (j = 0;j<offsetCount;j++){
                        this.tiledMapRectArrayMap[info.row][info.cel + j] = this.tiledMapRectMapEnum.Road;
                    }
                }
            }else {
                offsetCount = Math.abs(nextPoint.y - currPoint.y)/this.tiledSize.height+1;
                if (currPoint.y > nextPoint.y){
                    for (j = 0;j<offsetCount;j++){
                        this.tiledMapRectArrayMap[info.row - j][info.cel] = this.tiledMapRectMapEnum.Road;
                    }
                }else {
                    for (j = 0;j<offsetCount;j++){
                        this.tiledMapRectArrayMap[info.row + j][info.cel] = this.tiledMapRectMapEnum.Road;
                    }
                }
            }
        }
    },

    onTouchBegan:function (touch,event) {
        var self = event.getCurrentTarget();
        return true;
    },
    onTouchMoved:function (touch,event) {
        var self = event.getCurrentTarget();
    },
    onTouchEnded:function (touch,event) {
        var self = event.getCurrentTarget();
        var result = self.getInfoFromMapByPos(touch.getLocation().x,touch.getLocation().y);
        if (!result.isInMap){
            self.loadTouchWaring(touch.getLocation().x,touch.getLocation().y);
        }else {
            if (self.tiledMapRectArrayMap[result.row][result.cel] != self.tiledMapRectMapEnum.None){
                self.loadTouchWaring(touch.getLocation().x,touch.getLocation().y);
            }else {
                if (self.towerPanel == null){
                    self.loadTowerPanel({
                        row:result.row,
                        cel:result.cel,
                        x:result.x,
                        y:result.y
                    });
                }else {
                    self.removeChild(self.towerPanel);
                    self.towerPanel = null;
                }
            }
        }
    },
    loadTouchWaring:function (x,y) {
        var node = null;
        if (this.touchWaringNode != null){
            node = this.touchWaringNode;
            node.stopAllActions();
            node.setOpacity(255);
        }else {
            node = new cc.Sprite("res/GamePlay/warning.png");
            this.addChild(node,this.ZOrderEnum.Waring);
            this.touchWaringNode = node;
        }
        node.setPosition(x,y);
        var delayTime = cc.delayTime(0.4);
        var fadeOut = cc.fadeOut(0.3);
        var callFun = cc.callFunc(function () {
            this.removeChild(this.touchWaringNode);
            this.touchWaringNode = null;
        }.bind(this));
        var seq = cc.sequence(delayTime,fadeOut,callFun);
        node.runAction(seq);
    },
    loadTowerPanel:function (args) {
        var node = new TowerPanel(args);
        this.addChild(node,this.ZOrderEnum.TowerPanel);
        this.towerPanel = node;
    },
    onCreateTower:function (event) {
        var self = event.getCurrentTarget();
        var data = event.getUserData();
        var node = self.createTower(data);
        self.addChild(node);
        self.removeTowerPanel();
    },
    createTower:function (data) {
        cc.assert(data.name, "GPMainLayer.createTower(): 名字无效！");
        cc.assert(data.x, "GPMainLayer.createTower(): X轴坐标无效！");
        cc.assert(data.y, "GPMainLayer.createTower(): Y轴坐标无效！");
        var towerData = {};
        towerData.name = data.name;
        towerData.x = data.x;
        towerData.y = data.y;
        var node = null;
        switch (data.name){
            case "Bottle":
                towerData.scope = 300;
                towerData.bulletSpeed = 40;
                node = new Tower(towerData);
                break;
            default:
                cc.warn("GPMainLayer.createTower() : 异常");
                break;
        }
        if (node != null){
            this.tiledMapRectArrayMap[data.row][data.cel] = this.tiledMapRectMapEnum.Tower;
        }
        return node;
    },
    removeTowerPanel:function () {
        this.removeChild(this.towerPanel);
        this.towerPanel = null;
    },
    onRemoveBullet:function (event) {
        var self = event.getCurrentTarget();
        var bullet = event.getUserData().target;
        self.removeBullet(bullet);
    },
    removeBullet:function (obj) {
        var bullet = null;
        for (var i = 0;i<GameManager.currBulletPool.length;i++){
            bullet = GameManager.currBulletPool[i];
            if (bullet == obj){
                this.removeBulletByIndex(i);
            }
        }
    },
    removeBulletByIndex:function (index) {
        this.removeChild(GameManager.currBulletPool[index]);
        GameManager.currBulletPool.splice(index,1);
    },
    update:function () {
        this.checkCollision();
    },
    checkCollision:function () {
        var bullet = null;
        var enemy = null;
        var enemyRect = null;

        for (var x = 0;x<GameManager.currBulletPool.length;x++){
            for (var y = 0;y<GameManager.currMonsterPool.length;y++){
                for (var z = 0;z<GameManager.currMonsterPool[y].length;z++){
                    bullet = GameManager.currBulletPool[x];
                    //JSB如果回收对象则跳出循环
                    if (!cc.sys.isObjectValid(bullet)){
                        break;
                    }
                    enemy = GameManager.currMonsterPool[y][z];
                    enemyRect = cc.rect(enemy.x - enemy.width/2,enemy.y - enemy.height/2,enemy.width,enemy.height);
                    if (cc.rectContainsPoint(enemyRect,bullet.getPosition())){
                        this.removeBulletByIndex(x);
                        this.removeMonsterByIndex(y,z);

                        if (this.isNeedLoadNextGroup()){
                            this.loadNextGroupMonster();
                        }else {
                            if (GameManager.getGroup() > GameManager.getMaxGroup()){
                                var event = new cc.EventCustom(zh.EventName.GP_GAME_OVER);
                                event.setUserData({
                                    isWin:true
                                });
                                cc.eventManager.dispatchEvent(event);
                            }
                        }
                    }
                }
            }
        }
    },
    onGameOver:function (event) {
        var self = event.getCurrentTarget();
        var data = event.getUserData();
        GameManager.setIsWin(data.isWin);
        cc.audioEngine.stopMusic();
        var scene = new GameResultScene();
        cc.director.runScene(scene);
        var str = data.isWin?"赢了！":"输了";
        cc.log("GPMainLayer.onGameOver() : 游戏结束，你" + str);
    }
});