var roleHarvester = require("role.harvester")
var roleUpgrader = require("role.upgrader")
var roleBuilder = require("role.builder")
var controlPopulation = require("control.population")



function roleControl(){
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.building){
            roleBuilder.run(creep)
        }else{
            if(creep.memory.role == 'harvester') {
                if(!roleHarvester.run(creep)){
                    if(!roleBuilder.run(creep)){
                        roleUpgrader.run(creep);
                    }
                }
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        } //dont stop midway
        
        
    }
}
module.exports.loop = function () {

    // spawnControl()
    roleControl()
    controlPopulation("Spawn1")
    // buildingControl()
}