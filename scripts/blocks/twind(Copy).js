Events.on(ClientLoadEvent, () => {
    const blockName = "dedefarius-11o-01-tiny-windmill"; 
    const tinyWindmill = Vars.content.getByName(ContentType.block, blockName);

    if (tinyWindmill == null) return;

    tinyWindmill.buildType = () => extend(ConsumeGenerator.ConsumeGeneratorBuild, tinyWindmill, {
        jamTimer: 0,

        updateTile() {
            this.super$updateTile();

            if (this.enabled) {
                this.jamTimer += Time.delta;
                this.health -= Time.delta / 60;
                this.productionEfficiency = Math.max(0, this.health / this.maxHealth);

               
                if (this.jamTimer >= 18000 && this.jamTimer < 36000) {
                    if (Mathf.chanceDelta(0.1)) {
                        Fx.smoke.at(this.x + Mathf.range(4), this.y + Mathf.range(4));
                        Sounds.click.at(this.x, this.y, 1.0, 0.1); 
                    }
                }

                if (this.jamTimer >= 36000) {
                    Sounds.explosion.at(this.x, this.y);
                    Fx.explosion.at(this.x, this.y);
                    Fx.smokeCloud.at(this.x, this.y);
                    Fx.sparkExplosion.at(this.x, this.y);
                    this.tile.removeNet();
                }
            }
        }
    });
});
