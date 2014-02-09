game.EnemyEntity = me.ObjectEntity.extend({
    init: function (enemy_data) {
        var settings = {
            image: 'zombie_right',
            spritewidth: 55,
            height: 55
        }
        for(k in enemy_data) this[k] = enemy_data[k];
        var x = enemy_data.x;
        var y = game.data.baseY;
        this.parent(x, y, settings);
        this.collidable = true;
        this.pos.x = x;
        this.setVelocity(enemy_data.velX, 15);
        this.type = me.game.ENEMY_OBJECT;
        this.alwaysUpdate = true;
    },
    onCollision: function (res, obj) {
        if (obj.type === me.game.BULLET_OBJECT) {
            me.game.remove(obj);
        }
    },
    update: function(){
        if(this.isWalkingToX){
            var endX = Math.abs(this.moveToX);
            var currentPosX = Math.abs(this.pos.x);
            if(endX > currentPosX){
               this.walkLeft = false; 
            }else if(endX < currentPosX){
                this.walkLeft = true; 
            }
            if(endX === currentPosX){
                this.isWalkingToX = false;
            }
        this.doWalk(this.walkLeft);
        this.updateMovement();
        }
        return true;   
    },
    move: function(newX){
        this.moveToX = newX;
        this.isWalkingToX = true;
    }
});