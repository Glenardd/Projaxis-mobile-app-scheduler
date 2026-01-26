interface PertTypes{
    optimistic: string
    mostLikely: string
    pessimistic: string
}   

// expected time
const pert = (PertTypes: PertTypes) => {
    
    const {
        optimistic,
        mostLikely,
        pessimistic
    } = PertTypes
    
    const formula = Math.round((parseInt(optimistic) + 4 * parseInt(mostLikely) + parseInt(pessimistic)) / 6)

    return formula
}

export { pert }

