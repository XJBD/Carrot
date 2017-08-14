var ChooseUILayer = cc.Layer.extend({
    discountText:null,
    ctor:function () {
        this._super();
        this.loadTopLeftButton();
        this.loadDiscountButton();
        this.loadRightStarButton();
    },
    loadTopLeftButton:function () {
        var leftPanel = new ccui.ImageView("res/ChooseLevel/stagemap_toolbar_leftbg.png");
        leftPanel.setAnchorPoint(cc.p(0,1));
        leftPanel.setPosition(0,cc.winSize.height);
        this.addChild(leftPanel);

        this.loadHomeButton(leftPanel);
        this.loadShopButton(leftPanel);
        this.loadRankButton(leftPanel);

        },
    loadHomeButton:function (parent) {
        var node = new ccui.Button();
        var texture = "res/ChooseLevel/stagemap_toolbar_home.png";
        parent.addChild(node);
        node.loadTextures(texture,texture,"");
        node.setAnchorPoint(0,0);
        node.setPosition(10,10);
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.2);
        node.addTouchEventListener(function (sender,type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.director.runScene(new MainMenuScene());
            }
        },this);

    },
    loadShopButton:function (parent) {
        var node = new ccui.Button();
        var texture = "res/ChooseLevel/stagemap_toolbar_shop.png";
        parent.addChild(node);
        node.loadTextures(texture,texture,"");
        node.setAnchorPoint(0,0);
        node.setPosition(12+node.width,10);
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.2);
        node.addTouchEventListener(function (sender,type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("点击商店按钮");
            }
        },this);
    },
    loadRankButton:function (parent) {
        var node = new ccui.Button();
        var texture = "res/ChooseLevel/stagemap_toolbar_leaderboard.png";
        parent.addChild(node);
        node.loadTextures(texture, texture, "");
        node.setAnchorPoint(0, 0);
        node.setPosition(12 + node.width * 2, 10);
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.2);
        node.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("点击排行榜按钮");
            }
        }, this);
    },
    loadDiscountButton:function () {
        var node = new ccui.Button();
        var texture = "res/ChooseLevel/discount_tag_stone.png";
        this.addChild(node);
        node.loadTextures(texture, texture, "");
        node.setAnchorPoint(0.5, 1);
        node.setPosition(cc.winSize.width/2, cc.winSize.height);
        node.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("点击促销按钮");
            }
        }, this);
        var text = new ccui.TextBMFont("2","res/ChooseLevel/discount.fnt");
        this.discountText = text;
        node.addChild(text);
        text.setAnchorPoint(cc.p(0,0));
        text.setPosition(145,60);
    },
    loadRightStarButton:function () {
        var node = new ccui.Button();
        var texture = "res/ChooseLevel/stagemap_toolbar_rightbg.png";
        this.addChild(node);
        node.loadTextures(texture, texture, "");
        node.setAnchorPoint(1, 1);
        node.setPosition(cc.winSize.width, cc.winSize.height);
        node.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("点击星星按钮");
            }
        }, this);
        var star = new ccui.ImageView("res/ChooseLevel/stagemap_toolbar_overten.png");
        star.setAnchorPoint(cc.p(1,1));
        star.setPosition(cc.winSize.width,cc.winSize.height);
        this.addChild(star);
        var text = new ccui.Text("007","",24);
        star.addChild(text);
        text.setAnchorPoint(cc.p(0,0));
        text.setPosition(190,65);

    }
});