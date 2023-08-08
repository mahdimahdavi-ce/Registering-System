import mongoose from 'mongoose'

interface IPreRegistration{
    termId: string,
    studentId: string,
    requestedCourses: [string]
}


let preRegistrationSchema = new mongoose.Schema<IPreRegistration>({
    termId: String,
    studentId: String,
    requestedCourses: [String]
})


let preRegistrationModel = mongoose.model<IPreRegistration>("preRegistration", preRegistrationSchema)

export { preRegistrationModel, IPreRegistration}