var controlPopulation = function(spawn_name){
    // 1. find out how many sources in the room

    var room = Game.spawns[spawn_name].room
    var sources = room.find(FIND_SOURCES);
    var walkable_terrain_spaces = 0

    // 2. for each sources find 
    sources.forEach(source => {
        //2.1 how many spaces surrounding each sources that isnt wall and set that as maximum population
        const lookrange = 1
        var pos = source.pos
        var terrain = room.lookAtArea(pos.x-lookrange,pos.y-lookrange,pos.x+lookrange,pos.y+lookrange,true)
        var walkable_terrain = terrain.forEach(t=>{
            if(t.type==="terrain"){
                if(t.terrain!=="wall"){
                    walkable_terrain_spaces++
                }
            }
        })

    });
    room.memory.space_around_sources = walkable_terrain_spaces

    setTargetPopulation(room)
    getCurrentPopulation(room)
    makeTargetPopulation(room)

    // cleanup
    //clear creep memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

const specs={
    "t1":[WORK,CARRY,MOVE],
    "t2":[WORK,WORK,CARRY,CARRY,MOVE,MOVE]
}
// create queue
var setTargetPopulation= function(room){
    var adaptive_constant = 0
    var total_population = room.memory.space_around_sources
    var population = {
        "t1":{
            "harvester":total_population-2+adaptive_constant,
            "builder":2,
            "upgrader":2,
            "maintainer":2
        }
    }
    room.memory.target_population = population
}
var getCurrentPopulation= function(room){

    var creeps = room.find(FIND_CREEPS)

    var current_population = {
        "t1":{
            "harvester":0,
            "builder":0,
            "upgrader":0,
            "maintainer":0
        }
    }
    creeps.forEach(creep => {
        if(creep.memory.tier){
            current_population[creep.memory.tier][creep.memory.role]++
        }
    })
    room.memory.current_population=current_population
}
function spawnCreep(spawn,info) {
    var newName = info["tier"]+"_"+info["role"]+"_" + Game.time;
   if (spawn.spawnCreep(
        specs[info["tier"]], 
        newName, 
        {memory: info}) === OK){
            console.log("spawning", newName)

        }
    
}

var makeTargetPopulation =function(room){
    var target_population = room.memory.target_population
    var current_population = room.memory.current_population
    var tiers = ['t1']//will add dynamic names later
    var roles = ['harvester','upgrader','builder',"maintainer"] //ranked in priority

    var build_flag = false
    var to_build = {
        "tier":"t1",
        "role":"harvester"
    }
    for (const tier of tiers) {
        if(build_flag){
            break
        }
        for (const role of roles) {
            if(build_flag){
                break
            }
            if(current_population[tier][role] < target_population[tier][role]){
                build_flag = true
                to_build = {
                    "tier":tier,
                    "role":role
                }
                break;
            }
        }
    }

    // find spawn in room
    var spawns = room.find(FIND_MY_SPAWNS)
    for(const spawn of spawns){
        if(spawn.isActive()&&build_flag){
            spawnCreep(spawn,to_build)
        }
    }
}

module.exports = controlPopulation;