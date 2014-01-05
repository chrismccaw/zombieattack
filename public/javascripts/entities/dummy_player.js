game.DummyPlayerEntity = me.ObjectEntity.extend({
    init: function (player_data) {
        var settings = {
            image: "soldier_right",
            spriteheight: 55,
            spritewidth: 65
        };
        this.id = player_data.id;
        this.name = player_data.name;
        var y = player_data.y;
        this.parent(player_data.x, y, settings);
        this.setVelocity(3, 15);
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