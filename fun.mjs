// catalog of functions

// logistic
function logistic(x,P){
    return x.map(
        xi => 1 / (1 + Math.exp(-(P[0] + (P[1] * xi))))
    )
}
// test data
logistic.test={
    x: [...Array(101)].map((_,i)=>(i)/10)
}
logistic.test.y=logistic(logistic.test.x,[-10,3]).map(xi=>xi.toExponential(3))

// rational
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


// export models
export{
    logistic,
    rational
}
