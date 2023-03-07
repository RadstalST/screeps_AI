var getNearestTarget = function(targets,object){
    var min_cost = 99999
    var nearest_target = targets[0]
    targets.forEach(t => {
                var i_cost = PathFinder.search(t.pos, object.pos ).cost
                if(i_cost<min_cost){
                    min_cost=i_cost
                    nearest_target = t
                }

    });

    return nearest_target
}

exports.getNearestTarget = getNearestTarget;
