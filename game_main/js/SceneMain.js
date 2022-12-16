/*
 * メインシーン
 */
phina.define("SceneMain", {
  // 継承
  superClass: "DisplayScene",
  // コンストラクタ
  init: function(param) {
    console.log("SceneMainクラスinit");
    // 親クラス初期化
    this.superInit();
    // 背景スプライト
    this.mainwindow = Sprite("mainwindow").addChildTo(this);
    this.mainwindow.setPosition(this.gridX.center(), this.gridY.center());
    // メイン画面設定
    GameMain = this;
    // スプライトグループ
    this.background = DisplayElement().addChildTo(this);
    this.characterGroup = DisplayElement().addChildTo(this);
    this.buttonGroup = DisplayElement().addChildTo(this);
    // Xボタン描画
    this.drawXButton();
    // スタートボタン描画
    this.drawStartButton();
    // 正解数カウント
    this.correct_cnt = 0;
  },
  // 画面更新
  update: function(app) {
    // プレイヤー更新
    //if (app.frame % UPDATE_FRAME == 0) {
      //console.log("update_frame：" + app.frame);
    //};
    // spriteの当たり判定
    this.characterGroup.children.forEach(child => {
      if (!child.matchFlg && child.matchCheck()) {
        // 移動停止
        child.sprite.flickable.vertical = false;
        child.sprite.flickable.horizontal = false;
        // 正解数インクリメント
        this.correct_cnt++;
        console.log("this.correct_cnt", this.correct_cnt);
        // 全問正解の場合
        if (this.correct_cnt == CHARACTER_TOTALNUM) {
          this.correct_cnt = 0;
          this.drawGoalButton();
        }
      }
    })
  },
  // Xボタン描画
  drawXButton: function() {
    //console.log("SceneMainクラスdrawXButton");
    let xbutton = SpriteButtonX(
      "000", SCREEN_WIDTH - BUTTON_SIZE / 2, BUTTON_SIZE / 2
    ).addChildTo(this.background);
    //console.log(this.xbutton.x + "/" + this.xbutton.y);
    // Xボタン押下時の処理
    xbutton.sprite.setInteractive(true);
    xbutton.sprite.onpointstart = function() {
      console.log("xbutton.onpointstart");
      this.exit("Exit");
    }.bind(this);
  },
  // スタートボタン描画
  drawStartButton: function() {
    //console.log("SceneMainクラスdrawStartButton");
    let startbutton = SpriteButtonStart(
      "000", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2
    ).addChildTo(this.buttonGroup);
    // スタートボタン押下時の処理
    startbutton.sprite.setInteractive(true);
    startbutton.sprite.onpointstart = function() {
      console.log("startButton.onpointstart");
      startbutton.removeSprite();
      // 枠とキャラクターの描画
      this.drawCharactor();
    }.bind(this);
  },
  // ゴールボタン描画
  drawGoalButton: function() {
    //console.log("SceneMainクラスdrawGoalStartButton");
    let goalbutton = SpriteButtonGoal(
      "000", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2
    ).addChildTo(this.buttonGroup);
    // ゴールボタン押下時の処理
    goalbutton.sprite.setInteractive(true);
    goalbutton.sprite.onpointstart = function() {
      console.log("goalButton.onpointstart");
      goalbutton.removeSprite();
      // 枠とキャラクターの描画
      this.drawCharactor();
    }.bind(this);
  },
  // 枠とキャラクターの描画
  drawCharactor: function() {
    //console.log("SceneMainクラスdrawCharactor");
    this.characterGroup.children.length = 0;
    let sprite_sheet_name = [];
    sprite_sheet_name[0] = SPRITE_SHEET + "_shape";
    sprite_sheet_name[1] = SPRITE_SHEET;
    let keys = Object.keys(ASSETS.spritesheet[SPRITE_SHEET].animations);
    shuffleArray(keys);
    let index = 0;
    for (let i = 0; i < 2; i++) {
      for (let array_no = 0; array_no < CHARACTER_TOTALNUM; array_no++) {
        let animations = zeroPadding(keys[array_no], 3);
        // 枠（i=0）・キャラクター（i=1）
        let obj = SpriteCharacter(
          sprite_sheet_name[i], animations, SCREEN_WIDTH/2, SCREEN_HEIGHT/2, index
        ).addChildTo(this.characterGroup);
        let cnt = 0;
        do {
          obj.moveRandom();
          if (cnt++ > RELOCATION_TIMES) {
            console.log("cnt = ", RELOCATION_TIMES);
            break;
          }
        } while (obj.initHitCheck());
        // マウス・指のイベント処理（キャラクターのみ）
        listSemaphore[index] = 0;
        if (i>0) {
          let sprite = obj.sprite;
          let flick = sprite.flickable;
          sprite.setInteractive(true);

          // オブジェクト上でマウスボタンを押下、もしくは指でオブジェクトをタッチした瞬間
          sprite.onpointstart = () => {
            console.log("obj.index onpointclick", obj.index);
            getSemaphore(obj);
            // レイヤーが一番手前のsprite
            if (listSemaphore[obj.index] == 1) {
              console.log("obj.index splice", obj.index);
              // グループの先頭に移動
              this.characterGroup.children.splice(obj.index, 1);
              obj.addChildTo(this.characterGroup);
              // 摩擦係数（デフォルト0.9）
              flick.friction = 0.9;
              obj.fixed_x = -1;
              obj.fixed_y = -1;
              // spriteのindexを更新
              this.characterGroup.children.forEach((child, index)=> {
                child.index = index;
              })
              // 一番手前のsprite以外は動かないようにする
              this.characterGroup.children
              .filter(child => child.index != this.characterGroup.children.length - 1)
              .filter(child => child.spritesheet.slice(-6) != "_shape")
              .forEach((child, index)=> {
                child.sprite.flickable.friction = 0;
                child.fixed_x = child.sprite.x;
                child.fixed_y = child.sprite.y;
              })
            }
          };

          // pointstart後、マウスボタンを押下しつづける、もくしは指を端末上においている間
          // （マウスボタン/指を押さえている間はオブジェクトの範囲外に出ても発火し続ける）
          sprite.onpointstay = (e) => {
            console.log("obj.index onpointstay", obj.index);
          };

          // pointstayの状態でマウスポインタ、もくしは指を移動
          // （pointstay同様、オブジェクト範囲外に出ても発火し続ける）
          sprite.onpointmove = () => {
            console.log("obj.index onpointmove", obj.index);
            getSemaphore(obj);
            // スクリーン外へ移動した場合
            if (sprite.y < CHARACTER_HEIGHT/5) sprite.y = CHARACTER_HEIGHT/5;
            if (sprite.y > SCREEN_HEIGHT - CHARACTER_HEIGHT/5) sprite.y = SCREEN_HEIGHT - CHARACTER_HEIGHT/5;
            if (sprite.x < CHARACTER_HEIGHT/5) sprite.x = CHARACTER_HEIGHT/5;
            if (sprite.x > SCREEN_WIDTH - CHARACTER_HEIGHT/5) sprite.x = SCREEN_WIDTH -CHARACTER_HEIGHT/5;
          };

          // pointstart後、マウスボタンもしくは指を離した瞬間
          // （離す際、ポインタ・指はオブジェクト上に無くても良い）
          sprite.onpointend = () => {
            console.log("obj.index onpointend", obj.index);
            releaseSemaphore(obj);
          };

          // マウスポインタもしくは指がオブジェクトに乗っかった瞬間
          // （タッチ操作の場合、発火条件がpointstartに近くなるが、若干異なる）
          // （例えばpointover/pointoutの場合、すでに端末上においた指をスライドしてオブジェクトに触れた/離れた際も発火する。）
          sprite.onpointover = () => {
            console.log("obj.index onpointover", obj.index);
          };
          
          // マウスポインタもしくは指がオブジェクトから離れた瞬間
          // （タッチ操作の場合、発火条件がpointendに近くなるが、若干異なる）
          // （例えばpointover/pointoutの場合、すでに端末上においた指をスライドしてオブジェクトに触れた/離れた際も発火する。）
          sprite.onpointout = () => {
            console.log("obj.index onpointout", obj.index);
          };
        }
        index++;
      }
    }
  },
  // プレイヤーオブジェクト消去
  erasePlayers: function() {
    //console.log("SceneMainクラスerasePlayers");
    //this.buttonGroup.children.length = 0;
  }
});
