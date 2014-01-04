game.DummyPlayerEntity = me.ObjectEntity.extend({
    init: function (player_data) {
        var settings = {
            image: "soldier_right",
            spriteheight: 55,
            spritewidth: 65
        };
        this.id = player_data.id;
        this.name = player_data.name;
        console.log(this.name);
        this.parent(player_data.x, player_data.y, settings);
        this.setVelocity(3, 15);
        this.endX = player_data.endX;
        this.endY = player_data.endY;
        this.updateColRect(8, 48, -1, 0);
        this.lastTick = 0;
    },
    move: function(newX){
        if(newX < this.pos.x){
            //player moved left
            this.flipX(true);
            this.vel.x -= this.accel.x * me.timer.tick;
        }
        if(newX > this.pos.x){
            //player moved right
            this.flipX(false);
            this.vel.x += this.accel.x * me.timer.tick;
        }
    }
});