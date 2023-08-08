import { ApprovedCourseModel } from "../Models/approvedCourse.model"

export async function createApprovedCourse(courseInfo: any) {
    try {
        let newCourse = new ApprovedCourseModel(courseInfo)
        await newCourse.save()
        return "The new approvedCourse has been added successfully"
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function deleteApprovedCourse(id: string) {
    let deleteResult = await ApprovedCourseModel.deleteOne({ _id: id })
        .catch((error) => {
            console.log(error)
            return error
        })

    if (deleteResult.deletedCount === 0) {
        return `The approvedCourse with ${id} id dosen't exist`
    }
    return `The approvedCourse with ${id} id is deleted successfully`
}

export async function getAllApprovedCourses() {
    return await ApprovedCourseModel.find({})
        .catch((error) => {
            console.log(error)
            return "Internal server error"
        })
}

export async function getApprovedCourseById(id: string) {
    return await ApprovedCourseModel.findById(id)
        .catch((error) => {
            console.log(error)
            return `The approvedCourse with ${id} id dosen't exist`
        })
}

export async function UpdateApprovedCourseById(id: string, updatedValues: any) {
    return await ApprovedCourseModel.updateOne({ _id: id }, updatedValues)
        .catch((error) => {
            console.log(error)
            return `The approvedCourse with ${id} id dosen't exist`
        })
}