var utils = require("./utils")
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep,target) {
        
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }else if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
            


            // // save building target in memory
            // if(creep.memory.building_target){

            // }else{
            //     var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            //     if(targets.length){
            //         // console.log(JSON.stringify(targets))
            //         creep.memory.building_target = utils.getNearestTarget(targets,creep).id

            //     }
            // }
            // var targets = creep.room.find(FIND_CONSTRUCTION_SITES);


            // var target = targets[0]
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

                
            
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }else{
                return false
            }
	    }
        return true
	}
};

module.exports = roleBuilder;