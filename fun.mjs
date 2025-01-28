// catalog of functions

function logistic(x,P){
    return x.map(
        xi => 1 / (1 + Math.exp(-(P[0] + (P[1] * xi))))
    )
}

function rational(x,P){
    return x.map(
		xi => P[0] + 1 / (1/(P[1]*(xi-P[2])) + 1/P[3])
    )
}

export{
    logistic,
    rational
}