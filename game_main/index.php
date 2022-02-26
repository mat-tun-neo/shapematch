<!doctype html>

<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title></title>
  </head>
  <body>
  </body>
</html>

<div id="HTTP_REFERER" style="display:none"><?php echo $_SERVER['HTTP_REFERER'] ?></div>
<div id="charset" style="display:none"><?php echo $_POST['charset'] ?></div>
<div id="charnum" style="display:none"><?php echo $_POST['charnum'] ?></div>
<div id="character_width" style="display:none"><?php echo $_POST['character_width'] ?></div>
<div id="character_height" style="display:none"><?php echo $_POST['character_height'] ?></div>

<script src="./js/phina.min.js"></script>
<script src="./js/axios.min.js"></script>
<script src="./js/main.js?<?php echo date('YmdHis') ?>"></script>
<script src="./js/SceneMain.js?<?php echo date('YmdHis') ?>"></script>
<script src="./js/SceneExit.js?<?php echo date('YmdHis') ?>"></script>
<script src="./js/SpriteBase.js?<?php echo date('YmdHis') ?>"></script>
<script src="./js/SpriteButtonStart.js?<?php echo date('YmdHis') ?>"></script>
<script src="./js/SpriteButtonGoal.js?<?php echo date('YmdHis') ?>"></script>
<script src="./js/SpriteButtonX.js?<?php echo date('YmdHis') ?>"></script>
<script src="./js/SpriteCharacter.js?<?php echo date('YmdHis') ?>"></script>
