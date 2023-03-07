var roleHarvester = require("role.harvester")
var roleUpgrader = require("role.upgrader")
var roleBuilder = require("role.builder")
var roleMaintainer = require("role.maintainer")
var controlPopulation = require("control.population")



function roleControl(){
    var room = Game.spawns["Spawn1"].room
    var targets = room.find(FIND_CONSTRUCTION_SITES);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.building){
            roleBuilder.run(creep,targets[0])
        }else{
            if(creep.memory.role == 'harvester') {
                if(!roleHarvester.run(creep)){
                    if(!roleBuilder.run(creep,targets[0])){
                        roleUpgrader.run(creep);
                    }
                }
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep,targets[0]);
            }
            if(creep.memory.role == 'maintainer'){
                roleMaintainer.run(creep)
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