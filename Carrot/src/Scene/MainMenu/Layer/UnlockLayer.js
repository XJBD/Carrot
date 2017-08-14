var UnlockLayer = cc.LayerColor.extend({
    layout:null,
    background:null,
    ctor:function () {
        this._super(cc.color(0,0,0,220));
        this.loadLayout();
        this.loadBackground();
        this.loadInfo();
        this.loadButton();
    },
    loadLayout:function () {
        var node = new ccui.Layout();
        this.addChild(node);
        node.setContentSize(cc.winSize);
        node.setTouchEnabled(true);
        this.layout = node;
    },
    loadBackground:function () {
        var imageView = new ccui.ImageView("res/MainMenu/woodbg_notice.png");
        this.layout.addChild(imageView);
        this.background = imageView;
        imageView.setPosition(cc.winSize.width/2,cc.winSize.height/2);
    },
    loadInfo:function () {
        var info = new ccui.ImageView("res/MainMenu/unlock_floor.png");
        this.background.addChild(info);
        info.setPosition(this.background.width/2,this.background.height/2+100);
    },
    loadButton:function () {
        var confirmButton = new ccui.Button();
        confirmButton.loadTextures("res/MainMenu/Unlock/btn_blue_m.png",
            "res/MainMenu/Unlock/btn_blue_m_pressed.png","");
        this.background.addChild(confirmButton);
        confirmButton.setPosition(this.background.width/2-confirmButton.width/2-12,150);
        var confirmInfo = new ccui.ImageView("res/MainMenu/Unlock/btn_blue_m_ok.png");
        confirmButton.addChild(confirmInfo);
        confirmInfo.setPosition(confirmButton.width/2,confirmButton.height/2);
        confirmButton.addTouchEventListener(function (sender,type) {
          switch (type) {
              case ccui.Widget.TOUCH_ENDED:
                  var event = new cc.EventCustom(zh.EventName.Unlock_Up);
                  event.setUserData({
                      isSuccess: true
                  });
                  cc.eventManager.dispatchEvent(event);
                  this.removeFromParent();
                  break;
          }
        },this);

        var cancelButton = new ccui.Button();
        cancelButton.loadTextures("res/MainMenu/Unlock/btn_green_m.png",
            "res/MainMenu/Unlock/btn_green_m_pressed.png","");
        this.background.addChild(cancelButton);
        cancelButton.setPosition(this.background.width/2+cancelButton.width/2+12,150);
        var cancelInfo = new ccui.ImageView("res/MainMenu/Unlock/btn_green_m_cancel.png");
        cancelButton.addChild(cancelInfo);
        cancelInfo.setPosition(cancelButton.width/2,cancelButton.height/2);
        cancelButton.addTouchEventListener(function (sender,type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    this.removeFromParent();
                    break;
            }
        },this);
    }
});