import mongoose from 'mongoose'

interface IRegistration {
    termId: string,
    studentId: string,
    courses: [string],
    acceptByEducationalManager: boolean
    acceptByProfessor: boolean,
    isSubmited: boolean
}


let registrationSchema = new mongoose.Schema<IRegistration>({
    termId: String,
    studentId: String,
    courses: [String],
    acceptByEducationalManager: { type: Boolean, default: false },
    acceptByProfessor: { type: Boolean, default: false },
    isSubmited: { type: Boolean, default: false }
})


let registrationModel = mongoose.model<IRegistration>("Registration", registrationSchema)

export { registrationModel, IRegistration }