var ChooseBackgroundLayer = cc.Layer.extend({
    scrollView:null,
    zOrderMap:{},
    buttonArray:[],
    onEnter:function () {
        this._super();
        this.loadBackground();
        this.loadProperty();
        this.loadTiledMap();
        //this.loadRoute(13);
        this.loadLevel(1);
    },
    loadProperty:function () {
        this.zOrderMap.route = 1;
        this.zOrderMap.routeButtonEffect = 5;
        this.zOrderMap.levelButton = 10;
        this.buttonArray = [];
    },
    loadBackground:function () {
        var node = new ccui.ScrollView();
        this.addChild(node);
        node.setContentSize(cc.winSize);
        node.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        node.setTouchEnabled(true);
        this.scrollView = node;

        var nextPosX = 0;
        var imageView = null;
        for (var i = 0;i < 14; i++) {
            imageView = new ccui.ImageView("res/ChooseLevel/map/stage_map_"+ i +".png");
            node.addChild(imageView);
            imageView.setAnchorPoint(cc.p(0,0.5));
            imageView.setPosition(nextPosX,cc.winSize.height/2);
            nextPosX+=imageView.width;
        }
        node.setInnerContainerSize(cc.size(nextPosX,cc.winSize.height));
    },
    loadTiledMap:function () {
        var tmx = new cc.TMXTiledMap("res/ChooseLevel/map/ChooseBG.tmx");
        var objGroup = tmx.getObjectGroup("point");
        var objPoint = objGroup.getObjects();
        for (var i = 0;i<objPoint.length;i++){
            var button = new ccui.Button();
            this.scrollView.addChild(button,this.zOrderMap.levelButton,i);
            this.buttonArray.push(button);
            var btnTexture = "res/ChooseLevel/stagepoint_adv.png";
            if (objPoint[i].isBoss == "YES"){
                btnTexture = "res/ChooseLevel/stagepoint_gate.png";
            }else if (objPoint[i].isTime == "YES"){
                btnTexture = "res/ChooseLevel/stagepoint_time.png";
            }else if (objPoint[i].isChange == "YES"){
                btnTexture = "res/ChooseLevel/stagepoint_chance.png";
            }else {
                btnTexture = "res/ChooseLevel/stagepoint_adv.png";
            }
            button.loadTextures(btnTexture,btnTexture,"");
            button.setPosition(objPoint[i].x,objPoint[i].y);
            button.setTag(i);
            button.addTouchEventListener(this.onLevelButtonEvent,this);
        }
    },
    onLevelButtonEvent:function (sender,type) {
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                var level = sender.getTag();
                cc.audioEngine.stopMusic();
                cc.LoaderScene.preload(GamePlay_resources,function () {
                    GameManager.loadLevelData(level);
                    //cc.log(GameManager.popNextMonsterGroupData());
                    cc.director.runScene(new GamePlayScene());
                },this);
                cc.log(sender.getTag().toString());
            break;
        }
    },
    loadRoute:function (level) {
        var node = null;
        for (var i = 0;i<level -1;i++){
            node = new cc.Sprite("#route_" + (i+1)+".png");
            if (i % 10 == 9){
                node.setAnchorPoint(0,0.5);
            }
            node.x = node.width/2+Math.floor(i/10)*node.width;
            node.y = this.scrollView.getInnerContainerSize().height/2;
            this.scrollView.addChild(node,this.zOrderMap.route);
        }
    },
    loadLevel:function (level) {
        this.loadRoute(level);
        this.loadLevelEffect(level);
    },
    loadLevelEffect:function (level) {
        var index = level-1;
        var button = this.buttonArray[index];
        var node = new RouteButtonEffect();
        this.scrollView.addChild(node,this.zOrderMap.routeButtonEffect);
        node.setPosition(button.getPosition());
    }
});