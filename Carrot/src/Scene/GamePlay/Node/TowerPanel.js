var TowerPanel = cc.Sprite.extend({
    ctor:function (args) {
        this._super("res/GamePlay/select_01.png");
        this.loadProperty(args);
        this.loadTower();
    },
    loadProperty:function (args) {
        cc.assert(args.cel >= 0, "TowerPanel.loadProperty(): 列数必须大于0");
        cc.assert(args.row >= 0, "TowerPanel.loadProperty(): 行数必须大于0");
        cc.assert(args.x, "TowerPanel.loadProperty(): X轴坐标必须指定");
        cc.assert(args.y, "TowerPanel.loadProperty(): Y轴坐标必须指定");
        this.row = args.row;
        this.cel = args.cel;
        this.x = args.x + this.width/2;
        this.y = args.y + this.height/2;
    },
    loadTower:function () {
        var node = new cc.Sprite("#Bottle01.png");
        this.addChild(node);
        node.setAnchorPoint(0.5,0);
        node.setName("Bottle");
        if (this.y >= cc.winSize.height - 2*this.height){
            node.setPosition(this.width/2,-this.height);
        }else {
            node.setPosition(this.width/2,this.height);
        }
        var onTouchEventListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            target:node,
            swallowTouches:true,
            onTouchBegan:this.onTouchBegan,
            onTouchMoved:this.onTouchMoved,
            onTouchEnded:this.onTouchEnded
        });
        cc.eventManager.addListener(onTouchEventListener,node);
    },
    onTouchBegan:function (touch,event) {
        var self = event.getCurrentTarget();
        var LocationInNode = self.convertToNodeSpace(touch.getLocation());
        var size = self.getContentSize();
        var rect = cc.rect(0,0,size.width,size.height);
        return cc.rectContainsPoint(rect,LocationInNode);
    },
    onTouchMoved:function (touch,event) {
        var self = event.getCurrentTarget();
    },
    onTouchEnded:function (touch,event) {
        var self = event.getCurrentTarget();
        var createTowerEvent = new cc.EventCustom(zh.EventName.GP_CREATE_TOWER);
        createTowerEvent.setUserData({
            name:self.getName(),
            x:self.getParent().getPositionX(),
            y:self.getParent().getPositionY(),
            cel:self.getParent().cel,
            row:self.getParent().row
        });
        cc.eventManager.dispatchEvent(createTowerEvent);
    }
});