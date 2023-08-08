import mongoose from "mongoose";

interface ITerm {
    name: string,
    studentsIds: [string],
    professorsIds: [string],
    managersIds: [string],
    courses: {}
}

let termSchema = new mongoose.Schema<ITerm>({
    name: String,
    studentsIds: [String],
    professorsIds: [String],
    managersIds: [String],
    courses: {
        type: Map,
        of: String
    }
})

let termModel = mongoose.model<ITerm>("Term", termSchema)

export { termModel, ITerm }