var roleHarvester = require("role.harvester")
var roleUpgrader = require("role.upgrader")
var roleBuilder = require("role.builder")

function spawnCreepHandler(info) {
    var creep_group = _.filter(Game.creeps, (creep) => creep.memory.role == info["role"]);
    if(creep_group.length < info["min_balance"]) {
        var newName = info["type"] + Game.time;
        console.log('Spawning new : ' + newName);
        Game.spawns['Spawn1'].spawnCreep(info["stats"], newName, 
            {memory: {role: info["role"]}});
    }
}

function spawnControl(){
    //clear creep memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    // spawn harvesters

    var creep_balance = [
        {
            "role":"harvester",
            "type":"basic_harvester",
            "min_balance":2,
            "stats":[WORK,CARRY,MOVE]
        },
        {
            "role":"upgrader",
            "type":"basic_upgrader",
            "min_balance":1,
            "stats":[WORK,CARRY,MOVE]
        },
        {
            "role":"builder",
            "type":"basic_builder",
            "min_balance":2,
            "stats":[WORK,CARRY,MOVE]
        }

    ] 
    creep_balance.forEach(spawnCreepHandler);

    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
}
function roleControl(){
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
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
        
    }
}
module.exports.loop = function () {

    spawnControl()
    roleControl()
    
}