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
// test data
rational.test={
    x: [32,37,42,47,52,57,62,67,72,77,82,87,92],
    y: [749,1525,1947,2201,2380,2537,2671,2758,2803,2943,3007,2979,2992]
}

export{
    logistic,
    rational
}