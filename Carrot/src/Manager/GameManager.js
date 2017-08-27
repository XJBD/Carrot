var GameManager = {

    level:0,
    levelData:[],
    themeID:0,
    monsterGroup:[],
    group:0,
    maxGroup:0,
    _groupIndex:0,
    carrotBlood:0,
    startGold:0,
    enemyInterval:0,
    groupInterval:0,
    levelName:0,

    _teamIndex:0,
    _teamCount:0,
    _teamMonsterCount:0,
    _teamMonsterIndex:0,
    isMonsterGetFinish:false,

    //下一组怪物数据
    _monsterDataArray:[],

    currMonsterDataPool:[], //当前怪物数据池
    currMonsterPool:[], //当前怪物节点池
    currBulletPool:[],  //当前子弹节点池

    isWin:false,

    loadLevelData:function (level) {
        this.level = level;
        this.levelData = LevelData[level];
        this.themeID = this.levelData.themeID;
        this.monsterGroup = this.levelData.monsterGroup;
        this.group = 0;
        this.maxGroup = this.monsterGroup.length - 1;
        this._groupIndex = 0;
        this.carrotBlood = this.levelData.blood;
        this.startGold = this.levelData.gold;
        this.enemyInterval = this.levelData.enemyInterval;
        this.groupInterval = this.levelData.groupInterval;
        this.levelName = this.levelData.levelName;

        this._teamIndex = 0;
        this._teamCount = this.monsterGroup[0].team.length - 1;
        this._teamMonsterIndex = 0;
        this._teamMonsterCount = this.monsterGroup[0].team[0].count - 1;
        this.isMonsterGetFinish = false;

        this._monsterDataArray = [];

        this.currMonsterDataPool = [];
        this.currMonsterPool = [];
        this.currBulletPool = [];

        this.isWin = false;

        this._loadMonsterData();
        //cc.log(this._monsterDataArray[0]);
    },
    _loadMonsterData:function () {
        var group;  //关卡里的波数
        var team;   //每波怪物里包含几队
        var unit;   //每队里有几只怪物
        var data = {};
        this._monsterDataArray = [];
        for (group = 0;group<this.monsterGroup.length;group++){
            this._monsterDataArray[group] = [];
            for (team = 0;team<this.monsterGroup[group].team.length;team++){
                for (unit = 0;unit<this.monsterGroup[group].team[team].count;unit++){
                    data = this._getNextMonsterData();
                    this._monsterDataArray[group].push(data);
                }
            }

        }
    },
    _getNextMonsterData:function () {
        if (this.isMonsterGetFinish == true){
            cc.warn("GameManager._getNextMonsterData():所有怪物数据已经获取完毕！");
            return;
        }
        var teamData = this.monsterGroup[this._groupIndex].team[this._teamIndex];
        var monsterData = {};
        monsterData.group = this._groupIndex;
        monsterData.name = teamData.name;
        monsterData.blood = teamData.blood;
        monsterData.speed = teamData.speed;
        monsterData.index = this._teamMonsterIndex;
        this._teamMonsterIndex++;
        if (this._teamMonsterIndex > this._teamMonsterCount){
            this._enterNextTeam();
        }
        return monsterData;
    },
    _enterNextTeam:function () {
        this._teamMonsterIndex = 0;
        this._teamIndex++;
        if (this._teamIndex > this._teamCount) {
            this._enterNextGroup();
        }
        else {
            this._teamMonsterCount = this.monsterGroup[this._groupIndex].team[this._teamIndex].count - 1;
        }
    },
    _enterNextGroup:function () {
        this._groupIndex++;
        if (this._groupIndex > this.maxGroup){
            this.isMonsterGetFinish = true;
            return;
        }
        this._teamIndex = 0;
        this._teamCount = this.monsterGroup[this._groupIndex].team.length - 1;
        this._teamMonsterIndex = 0;
        this._teamMonsterCount = this.monsterGroup[this._groupIndex].team[this._teamIndex].count - 1;
    },
    popNextMonsterGroupData:function () {
        var groupData = [];
        if (this.group <= this.maxGroup){
            this.group++;
            groupData = this._monsterDataArray[0];
            this._monsterDataArray.splice(0,1);

            var event = new cc.EventCustom(zh.EventName.GP_UPDATE_GROUP);
            event.setUserData({group:this.group});
            cc.eventManager.dispatchEvent(event);
        }else {
            groupData = [];
        }
        return groupData;
    },

    subtractCarrotBlood:function () {
        this.carrotBlood = this.carrotBlood <=0 ? 0:this.carrotBlood - 1;
        var event = new cc.EventCustom(zh.EventName.GP_UPDATE_CARROT_BLOOD);
        event.setUserData({
            blood:this.carrotBlood
        });
        cc.eventManager.dispatchEvent(event);

        if (this.carrotBlood == 0) {
            var gameOverEvent = new cc.EventCustom(zh.EventName.GP_GAME_OVER);
            gameOverEvent.setUserData({
                isWin:false
            });
            cc.eventManager.dispatchEvent(gameOverEvent);
        }
    },
    ///////
    getThemeID:function () {
        return this.themeID;
    },
    getGold:function () {
        return this.startGold;
    },
    getGroup:function () {
        return this.group;
    },
    getMaxGroup:function () {
        return this.maxGroup;
    },
    getLevel:function () {
        return this.level +1;
    },
    getCurrGroupMonsterSum:function () {
        var monsterCount = 0;
        var team = this.monsterGroup[this.group - 1].team;
        for (var i = 0; i< team.length; i++) {
            monsterCount += team[i].count;
        }
        return monsterCount;
    },
    getGroupInterval:function () {
        return this.groupInterval;
    },
    getEnemyInterval:function () {
        return this.enemyInterval;
    },
    setIsWin:function (isWin) {
        this.isWin = isWin;
    },
    getIsWin:function () {
        return this.isWin;
    }
};