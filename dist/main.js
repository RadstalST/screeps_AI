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
function buildingControl(){
    var room = Game.spawns['Spawn1'].room
    var allSources = room.find(FIND_SOURCES);
    for (var source of allSources) {
        var id = source.id;
        var pos = source.pos;
        for(i=pos.x-1;i<=pos.x+1;i++){
            for(j=pos.y-1;j<=pos.y+1;j++){
                creep.room.createConstructionSite(i, j, STRUCTURE_ROAD);
            }
        }
        for(i=pos.x-2;i<=pos.x+2;i=i+2){
            for(j=pos.y-2;j<=pos.y+2;j=j+2){
                creep.room.createConstructionSite(i, j, STRUCTURE_CONTAINER);
            }
        }
        
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
            "tier":1,
            "type":"basic_harvester",
            "min_balance":1,
            "stats":[WORK,CARRY,MOVE]
        },
        {
            "role":"harvester",
            "tier":1,
            "type":"T2_harvester",
            "min_balance":2,
            "stats":[WORK,WORK,CARRY,CARRY,MOVE,MOVE]
        },
        {
            "role":"upgrader",
            "tier":1,
            "type":"basic_upgrader",
            "min_balance":1,
            "stats":[WORK,CARRY,MOVE]
        },
        {
            "role":"builder",
            "tier":1,
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
    buildingControl()
}