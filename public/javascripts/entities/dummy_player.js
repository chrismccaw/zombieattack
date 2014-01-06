game.DummyPlayerEntity = me.ObjectEntity.extend({
    init: function (player_data) {
        var settings = {
            image: "alt_soldier_right",
            spriteheight: 55,
            spritewidth: 65
        };
        var y = player_data.y;
        this.parent(player_data.x, y, settings);
        for(p in player_data) this[p] = player_data[p];
        this.id = player_data.id;
        this.setVelocity(3, 15);
        this.type = me.game.PLAYER_OBJECT;
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