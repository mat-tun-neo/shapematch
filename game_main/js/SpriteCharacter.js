phina.define("SpriteCharacter", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(spritesheet, animation, x, y, index, width= CHARACTER_WIDTH, height= CHARACTER_HEIGHT) {
    //console.log("SpriteCharacterクラスinit");
    this.superInit(spritesheet, animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
    // spriteの配置順
    this.index = index;
    // 当たり判定用オブジェクト
    this.circle = Circle(this.sprite.x, this.sprite.y, this.sprite.radius); 
  },
  update: function() {
  },
  initHitCheck: function() {
    //console.log("SpriteCharacter hitCheck");
    // 衝突判定（true：衝突している、false：衝突していない）
    let result = false;
    GameMain.characterGroup.children.forEach(child=> {
      let name1 = this.spritesheet + this.animation;
      let name2 = child.spritesheet + child.animation;
      let c1;
      let c2; 
      // 自sprite以外との判定
      if (name1 != name2) {
        c1 = Circle(this.sprite.x, this.sprite.y, CHARACTER_HEIGHT / 2);
        c2 = Circle(child.sprite.x, child.sprite.y, CHARACTER_HEIGHT / 2); 
        // 枠同士：半径以内で衝突判定
        if (this.shapeFlg && child.shapeFlg && Collision.testCircleCircle(c1, c2)) {
          result = true;
        }
        // キャラクター同士：半径以内で衝突判定
        if (!this.shapeFlg && !child.shapeFlg && Collision.testCircleCircle(c1, c2)) {
          result = true;
        }
        // 枠とキャラクター：同じアニメーション番号であれば半径以内で衝突判定
        if (!this.shapeFlg && child.shapeFlg && this.animation == child.animation && Collision.testCircleCircle(c1, c2)) {
          result = true;
        }
      }
    })
    return result;
  },
  moveRandom: function () {
    this.sprite.x = rand(CHARACTER_WIDTH/2, SCREEN_WIDTH - CHARACTER_WIDTH/2);
    this.sprite.y = rand(CHARACTER_HEIGHT/2, SCREEN_HEIGHT - CHARACTER_HEIGHT/2);
  },
  matchCheck: function() {
    // マッチ判定（true：マッチ、false：アンマッチ）
    let result = false;
    GameMain.characterGroup.children.forEach(e=> {
      if (e.shapeFlg && this.animation == e.animation) {
        let c1 = Circle(this.sprite.x, this.sprite.y, MATCH_PIXEL);
        let c2 = Circle(e.sprite.x, e.sprite.y, MATCH_PIXEL); 
        if (Collision.testCircleCircle(c1, c2)) {
          //console.log("Collision.testCircleCircle(c1, c2)", Collision.testCircleCircle(c1, c2));
          // 座標を合わせてクリック処理停止
          this.sprite.x = e.sprite.x;
          this.sprite.y = e.sprite.y;
          this.sprite.setInteractive(false)
          // 周りに星を出す
          for (let i = 0; i < 36; i++) {
            let s = phina.display.StarShape()
              .addChildTo(this.sprite)
              .setScale(1);
            let x = s.x + Math.cos(i*10)*100;
            let y = s.y + Math.sin(i*10)*100;
            s.tweener.clear()
              .to({x: x, y: y, alpha: 0}, 1000,"easeOutQuint")
              .call(function() {
                this.remove();
              }.bind(s));
          }
          phina.display.StarShape()
            .addChildTo(this.sprite)
            .setScale(1);
          result = true;
        }
      }
    })
    return result;
  }
});