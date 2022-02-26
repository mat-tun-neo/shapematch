phina.define("SpriteButtonGoal", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(animation, x, y, width= GOAL_BUTTON_WIDTH, height= GOAL_BUTTON_HEIGHT) {
    //console.log("SpriteButtonGoalクラスinit");
    this.superInit("goal_button", animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
    // 周りに星を出す
    for (let i = 0; i < 36; i++) {
      let s = phina.display.StarShape()
        .addChildTo(this.sprite)
        .setScale(1);
      let x = s.x + Math.cos(i*10)*500;
      let y = s.y + Math.sin(i*10)*500;
      s.x = s.x + Math.cos(i*10)*150
      s.y = s.y + Math.sin(i*10)*150;
      s.tweener.clear()
        .to({x: x, y: y, alpha: 0}, 10000, "easeOutQuint")
        .call(function() {
          this.remove();
        }.bind(s));
    }
  }
});