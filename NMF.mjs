console.log(`non-negative matrix factorization`)

// matrix multiplication


function multiplyMatrices(
    A=[
       [1, 2, 3],
       [4, 5, 6]
    ],
    B=[
       [7, 8],
       [9, 10],
       [11, 12],
    ]) {
    if(A[0].length!=B.length){
        console.error(`wrong size, number of columns of first matrix is ${A[0].length} while number of rows of second matrix is ${B.length}`)
    }
    console.log(`multiplying`,A, 'by', B)
    return A.map( (row, i) => B[0].map( (_, j) => row.reduce( (sum, _, k) => sum + A[i][k] * B[k][j], 0))) 
}

export {multiplyMatrices}
