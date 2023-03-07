var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            // move to harvest if there is free capacity 
            var sources = creep.room.find(FIND_SOURCES);            
            var target_source = sources[0]
            var min_cost = 99999
            sources.forEach(s => {
                var i_cost = PathFinder.search(creep.pos, s.pos ).cost
                if(i_cost<min_cost){
                    min_cost=i_cost
                    target_source = s
                }

            });
            if(creep.harvest(target_source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target_source, {visualizePathStyle: {stroke: '#ffaa00'}},reusePath=10);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else{
                return false
            }
        }
        return true
	}
};

module.exports = roleHarvester;